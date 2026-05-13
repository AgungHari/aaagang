import { createClient } from "@libsql/client";
import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

const client = createClient({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN!,
});

// GET - Fetch comments for a layout
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const layoutId = searchParams.get("layoutId");

    if (!layoutId) {
      return NextResponse.json(
        { error: "layoutId required" },
        { status: 400 }
      );
    }

    const result = await client.execute({
      sql: `SELECT id, layout_id, content, author_name, like_count, dislike_count, created_at 
            FROM layout_comments 
            WHERE layout_id = ? AND is_visible = TRUE
            ORDER BY created_at DESC`,
      args: [layoutId],
    });

    const comments = result.rows.map(row => ({
      id: row.id,
      layout_id: row.layout_id,
      content: row.content,
      author_name: row.author_name,
      like_count: row.like_count,
      dislike_count: row.dislike_count,
      created_at: row.created_at,
    }));

    return NextResponse.json({ comments });
  } catch (error) {
    console.error("Error fetching comments:", error);
    return NextResponse.json(
      { error: "Failed to fetch comments" },
      { status: 500 }
    );
  }
}

// POST - Create a new comment
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { layoutId, content, authorName } = body;

    if (!layoutId || !content) {
      return NextResponse.json(
        { error: "layoutId and content required" },
        { status: 400 }
      );
    }

    const trimmedContent = String(content).trim();
    if (trimmedContent.length === 0 || trimmedContent.length > 1000) {
      return NextResponse.json(
        { error: "Content must be 1-1000 characters" },
        { status: 400 }
      );
    }

    const author = authorName ? String(authorName).trim() : "Anonim";
    if (author.length > 50) {
      return NextResponse.json(
        { error: "Author name too long" },
        { status: 400 }
      );
    }

    const result = await client.execute({
      sql: `INSERT INTO layout_comments (layout_id, content, author_name) 
            VALUES (?, ?, ?)
            RETURNING id, content, author_name, like_count, dislike_count, created_at`,
      args: [layoutId, trimmedContent, author],
    });

    const newComment = result.rows[0];

    // Revalidate the layout page to show comment immediately
    revalidatePath(`/layout/${layoutId}`);

    return NextResponse.json(
      {
        id: newComment.id,
        layout_id: newComment.layout_id,
        content: newComment.content,
        author_name: newComment.author_name,
        like_count: newComment.like_count,
        dislike_count: newComment.dislike_count,
        created_at: newComment.created_at,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating comment:", error);
    return NextResponse.json(
      { error: "Failed to create comment" },
      { status: 500 }
    );
  }
}

// PUT - Update like/dislike/report count
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { commentId, layoutId, action } = body; // action: 'like' | 'dislike' | 'report'

    if (!commentId || !action) {
      return NextResponse.json(
        { error: "commentId and action required" },
        { status: 400 }
      );
    }

    if (action === "report") {
      // Handle report - increment report_count and check if need to hide
      const result = await client.execute({
        sql: `UPDATE layout_comments 
              SET report_count = report_count + 1
              WHERE id = ?
              RETURNING id, report_count, is_visible`,
        args: [commentId],
      });

      if (result.rows.length === 0) {
        return NextResponse.json(
          { error: "Comment not found" },
          { status: 404 }
        );
      }

      const updated = result.rows[0];
      const reportCount = Number(updated.report_count);

      // If report count > 5, set is_visible to false
      if (reportCount > 5 && updated.is_visible) {
        await client.execute({
          sql: `UPDATE layout_comments 
                SET is_visible = FALSE
                WHERE id = ?`,
          args: [commentId],
        });
      }

      if (layoutId) {
        revalidatePath(`/layout/${layoutId}`);
      }

      return NextResponse.json({
        id: updated.id,
        report_count: reportCount,
        is_visible: reportCount > 5 ? false : updated.is_visible,
        reported: true,
      });
    } else {
      // Handle like/dislike
      const column = action === "like" ? "like_count" : "dislike_count";

      const result = await client.execute({
        sql: `UPDATE layout_comments 
              SET ${column} = ${column} + 1
              WHERE id = ?
              RETURNING id, like_count, dislike_count`,
        args: [commentId],
      });

      if (result.rows.length === 0) {
        return NextResponse.json(
          { error: "Comment not found" },
          { status: 404 }
        );
      }

      if (layoutId) {
        revalidatePath(`/layout/${layoutId}`);
      }

      const updated = result.rows[0];
      return NextResponse.json({
        id: updated.id,
        like_count: updated.like_count,
        dislike_count: updated.dislike_count,
      });
    }
  } catch (error) {
    console.error("Error updating comment:", error);
    return NextResponse.json(
      { error: "Failed to update comment" },
      { status: 500 }
    );
  }
}
