/**
 * Layout Base Context
 * Context untuk menyimpan informasi base layout yang direkomendasikan
 * untuk berbagai strategi serangan dalam Clash of Clans
 * Data diambil langsung dari database layouts
 */

import { createClient } from "@libsql/client";

const client = createClient({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN!,
});

export interface LayoutBase {
  id: string;
  name: string;
  thLevel: number;
  description: string;
  recommendedFor: string[];
  imageUrl: string;
  baseUrl: string;
  tags: string[];
  baseTag: string;
  viewCount: number;
  uploadDate: string;
}

export interface LayoutBaseContextType {
  recommendedLayouts: LayoutBase[];
  getLayoutById: (id: string) => LayoutBase | undefined;
  getLayoutsByTag: (tag: string) => LayoutBase[];
  getLayoutsByThLevel: (thLevel: number) => LayoutBase[];
  getRecommendedLayouts: (strategy: string) => LayoutBase[];
}

export async function getLayoutBaseContext(): Promise<LayoutBaseContextType> {
  try {
    // Fetch data dari database
    const result = await client.execute("SELECT * FROM layouts ORDER BY view_count DESC LIMIT 50");

    const layouts: LayoutBase[] = result.rows.map(row => {
      const description = row.description ? String(row.description) : "No description available";
      const baseTag = String(row.base_tag || "");
      const thLevel = row.th_level ? Number(row.th_level) : 0;
      
      return {
        id: String(row.id),
        name: extractNameFromDescription(description, baseTag, thLevel),
        thLevel: thLevel,
        description: description,
        recommendedFor: getRecommendedForTags(baseTag),
        imageUrl: row.image_url ? String(row.image_url) : "",
        baseUrl: `https://www.3agang.pro/layout/${row.id}`,
        tags: getTagsFromBaseTag(baseTag),
        baseTag: baseTag,
        viewCount: row.view_count ? Number(row.view_count) : 0,
        uploadDate: row.upload_date ? String(row.upload_date) : ""
      };
    });

    return {
      recommendedLayouts: layouts,
      getLayoutById: (id: string) => layouts.find(layout => layout.id === id),
      getLayoutsByTag: (tag: string) =>
        layouts.filter(layout =>
          layout.tags.some(t => t.toLowerCase().includes(tag.toLowerCase())) ||
          layout.baseTag.toLowerCase().includes(tag.toLowerCase())
        ),
      getLayoutsByThLevel: (thLevel: number) =>
        layouts.filter(layout => layout.thLevel === thLevel),
      getRecommendedLayouts: (strategy: string) =>
        layouts.filter(layout =>
          layout.recommendedFor.some(rf =>
            rf.toLowerCase().includes(strategy.toLowerCase())
          ) ||
          layout.tags.some(t =>
            t.toLowerCase().includes(strategy.toLowerCase())
          )
        )
    };

  } catch (error) {
    console.error("Error fetching layout data:", error);
    // Fallback data jika database error
    return {
      recommendedLayouts: [],
      getLayoutById: () => undefined,
      getLayoutsByTag: () => [],
      getLayoutsByThLevel: () => [],
      getRecommendedLayouts: () => []
    };
  }
}

// Helper function untuk extract nama dari markdown description
function extractNameFromDescription(description: string, baseTag: string, thLevel: number): string {
  if (!description || description === "No description available") {
    return generateNameFromTag(baseTag, thLevel);
  }

  // Coba extract judul dari markdown format: "# Title" atau "## Title"
  const headingMatch = description.match(/^#{1,2}\s+(.+?)(?:\n|$)/m);
  if (headingMatch && headingMatch[1]) {
    return headingMatch[1].trim();
  }

  // Fallback: ambil kata pertama yang meaningful dari description
  const firstLine = description.split('\n')[0];
  if (firstLine && firstLine.length > 0 && firstLine.length < 60) {
    // Bersihkan markdown syntax
    const cleaned = firstLine
      .replace(/[#*_`\[\]()]/g, '')
      .replace(/^\*\*/, '')
      .replace(/\*\*$/, '')
      .trim();
    
    if (cleaned && cleaned.length > 3) {
      return cleaned;
    }
  }

  // Last resort: generate dari base_tag
  return generateNameFromTag(baseTag, thLevel);
}

// Helper function untuk generate nama dari base_tag dan thLevel
function generateNameFromTag(baseTag: string, thLevel: number): string {
  if (!baseTag || baseTag === "general") {
    return `TH ${thLevel} Base`;
  }

  // Format: "anti-electro-th18" → "Anti Electro TH18"
  const words = baseTag
    .split(/[-_\s]+/)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');

  // Add TH level jika belum ada
  if (!words.toLowerCase().includes('th')) {
    return `${words} TH${thLevel}`;
  }

  return words;
}

// Helper function untuk mengkonversi base_tag menjadi recommendedFor
function getRecommendedForTags(baseTag: string): string[] {
  const tag = baseTag.toLowerCase();
  const recommendedFor: string[] = [];

  // Tag untuk mode permainan
  if (tag.includes("war")) {
    recommendedFor.push(
      "War attacks",
      "Clan War",
      "Base untuk serangan war",
      "Melawan serangan war"
    );
  }

  if (tag.includes("legends") || tag.includes("legends league")) {
    recommendedFor.push(
      "Legends League",
      "Legends attacks",
      "Base untuk Legends League",
      "Melawan serangan Legends"
    );
  }

  if (tag.includes("cwl")) {
    recommendedFor.push(
      "Clan War League",
      "CWL attacks",
      "Base untuk CWL",
      "Melawan serangan CWL"
    );
  }

  if (tag.includes("ranked")) {
    recommendedFor.push(
      "Ranked attacks",
      "Base untuk naik peringkat",
      "Melawan serangan ranked"
    );
  }

  if (tag.includes("esports")) {
    recommendedFor.push(
      "Esports base",
      "Base untuk kompetisi",
      "Melawan serangan esports"
    );
  }

  if (tag.includes("troll")) {
    recommendedFor.push(
      "Troll base",
      "Base untuk menjebak musuh",
      "Melawan serangan troll"
    );
  }

  // Tag untuk strategi pertahanan
  if (tag.includes("anti super minion")) {
    recommendedFor.push(
      "Melawan Super Minion",
      "Melawan serangan udara massal",
      "Melawan strategi Queen Walk + Super Minion",
      "Defense against air attacks"
    );
  }

  if (tag.includes("anti hybrid")) {
    recommendedFor.push(
      "Melawan serangan Hybrid",
      "Melawan Queen Charge",
      "Melawan strategi Yetis + Siege Barracks",
      "Defense against hybrid attacks"
    );
  }

  if (tag.includes("anti electro")) {
    recommendedFor.push(
      "Melawan Electro Dragon",
      "Melawan serangan udara elektrik",
      "Melawan strategi Electro Dragon + Yetis",
      "Defense against electric attacks"
    );
  }

  if (tag.includes("anti swb") || tag.includes("anti super wall breaker")) {
    recommendedFor.push(
      "Melawan Super Wall Breaker",
      "Melawan serangan ground massal",
      "Melawan strategi Hog Rider + Super Wall Breaker",
      "Defense against ground attacks"
    );
  }

  if (tag.includes("anti super giant")) {
    recommendedFor.push(
      "Melawan Super Giant",
      "Melawan serangan ground tank",
      "Melawan strategi Super Giant + Healer",
      "Defense against tank attacks"
    );
  }

  // Jika tidak ada tag spesifik, gunakan tag umum
  if (recommendedFor.length === 0) {
    return ["General defense", "Melawan berbagai strategi serangan", "Base serbaguna"];
  }

  return [...new Set(recommendedFor)]; // Hapus duplikasi
}

// Helper function untuk mengkonversi base_tag menjadi tags array
function getTagsFromBaseTag(baseTag: string): string[] {
  const tag = baseTag.toLowerCase();
  const tags: string[] = [];

  // Tag untuk mode permainan
  if (tag.includes("war")) tags.push("war");
  if (tag.includes("legends")) tags.push("legends", "legends league");
  if (tag.includes("cwl")) tags.push("cwl", "clan war league");
  if (tag.includes("ranked")) tags.push("ranked");
  if (tag.includes("esports")) tags.push("esports", "competition");
  if (tag.includes("troll")) tags.push("troll", "fun");

  // Tag untuk strategi pertahanan
  if (tag.includes("anti")) tags.push("defensive");
  if (tag.includes("super minion")) tags.push("super minion", "air defense");
  if (tag.includes("hybrid")) tags.push("hybrid", "queen charge");
  if (tag.includes("electro")) tags.push("electro dragon", "electric");
  if (tag.includes("swb") || tag.includes("super wall breaker")) tags.push("super wall breaker", "ground defense");
  if (tag.includes("super giant")) tags.push("super giant", "tank defense");

  // Tambahkan semua kata dari base_tag sebagai tag individual
  const baseTags = baseTag.split(/[\s,/]+/).filter(t => t.length > 0);
  tags.push(...baseTags);

  // Tambahkan tag umum
  tags.push("clash of clans", "base layout");

  return [...new Set(tags)]; // Hapus duplikasi
}
