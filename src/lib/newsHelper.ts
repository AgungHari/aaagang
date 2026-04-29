// Fungsi untuk extract YouTube video ID dari URL
export function extractYouTubeId(url: string): string | null {
  const regexps = [
    /youtube\.com\/watch\?v=([a-zA-Z0-9_-]{11})/,
    /youtube\.com\/embed\/([a-zA-Z0-9_-]{11})/,
    /youtube\.com\/live\/([a-zA-Z0-9_-]{11})/,
    /youtu\.be\/([a-zA-Z0-9_-]{11})/,
  ];

  for (const regexp of regexps) {
    const match = url.match(regexp);
    if (match && match[1]) {
      return match[1];
    }
  }
  return null;
}

// Fetch news content dari endpoint Supercell
export async function fetchNewsContent() {
  try {
    const response = await fetch(
      "https://clashofclans.inbox.supercell.com/data/id/news/content.json"
    );
    if (!response.ok) {
      throw new Error("Failed to fetch news");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching news:", error);
    return null;
  }
}

// Fetch esport content dari endpoint Supercell
export async function fetchEsportContent() {
  try {
    const response = await fetch(
      "https://clashofclans.inbox.supercell.com/data/id/esport/content.json"
    );
    if (!response.ok) {
      throw new Error("Failed to fetch esport content");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching esport content:", error);
    return null;
  }
}

export interface NewsArticle {
  id: string;
  title: string;
  postDate: number;
  thumbnail: {
    medium?: {
      path: string;
    };
    large?: {
      path: string;
    };
    largeretina?: {
      path: string;
    };
  };
  heroImage?: {
    medium?: {
      path: string;
    };
    large?: {
      path: string;
    };
    largeRetina?: {
      path: string;
    };
  };
  type: string;
  categories?: Array<{
    title: string;
    color: string;
  }>;
  embed?: {
    url: string;
    provider: string;
  };
  details?: Array<{
    body: string;
  }>;
}

export interface EsportArticle {
  id: string;
  title: string;
  postDate: number;
  section: string;
  lang: string;
  thumbnail: {
    medium?: {
      path: string;
    };
    large?: {
      path: string;
    };
  };
  heroImage?: {
    medium?: {
      path: string;
    };
    large?: {
      path: string;
    };
  };
  type: string;
  categories?: Array<{
    title: string;
    color?: string;
  }>;
  embed?: {
    url: string;
    provider: string;
  };
  details?: Array<{
    title?: string;
    type?: string;
    body?: string;
    accordion?: string;
  }>;
}

export function parseNewsData(data: any): NewsArticle[] {
  if (!data || !data.articles) {
    return [];
  }
  return data.articles.filter((article: any) => {
    const isValidType =
      article.type === "newsEntry" || article.type === "videoNewsEntry";
    const isNotM3u8Video =
      article.type !== "videoNewsEntry" ||
      !article.embed?.url?.includes(".m3u8");

    return isValidType && isNotM3u8Video;
  });
}

export function parseEsportData(data: any): EsportArticle[] {
  if (!data || !data.articles) {
    return [];
  }
  return data.articles.filter((article: any) => {
    const isValidType = article.type === "esportNewsEntry";
    const isNotM3u8Video =
      !article.embed?.url?.includes(".m3u8");

    return isValidType && isNotM3u8Video;
  });
}
