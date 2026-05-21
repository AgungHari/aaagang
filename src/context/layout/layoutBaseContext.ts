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

export interface UserIntent {
  thLevel?: number;
  strategy?: string;
}

/**
 * Detect user intent dari message untuk smart filtering
 * Extract TH level dan strategy keywords
 */
export function detectUserIntent(message: string): UserIntent {
  const lowerMsg = message.toLowerCase();
  const intent: UserIntent = {};

  // Regex patterns untuk detect TH level
  const thPatterns = [
    /th\s*(\d+)/gi,  // "TH18", "TH 18", "th18"
    /town\s*hall\s*(\d+)/gi,  // "Town Hall 18"
    /townhall\s*(\d+)/gi,  // "Townhall18"
  ];

  let detectedTh = 0;
  for (const pattern of thPatterns) {
    const match = pattern.exec(lowerMsg);
    if (match) {
      detectedTh = parseInt(match[1]);
      break;
    }
  }

  // Strategy keywords mapping
  const strategyKeywords: Record<string, string> = {
    // Defense anti-strategies
    'electro': 'anti-electro',
    'electro dragon': 'anti-electro',
    'edrag': 'anti-electro',
    'hybrid': 'anti-hybrid',
    'rc charge': 'anti-rc-charge',
    'rc': 'anti-rc-charge',
    'super minion': 'anti-super-minion',
    'super wall breaker': 'anti-super-wall-breaker',
    'swb': 'anti-super-wall-breaker',
    'super giant': 'anti-super-giant',
    
    // Game modes
    'war': 'war',
    'cwl': 'cwl',
    'clan war league': 'cwl',
    'legends': 'legends-league',
    'legends league': 'legends-league',
    'ranked': 'ranked',
    'esports': 'esports',
    'troll': 'troll',
  };

  let detectedStrategy: string | undefined;
  for (const [keyword, strategy] of Object.entries(strategyKeywords)) {
    if (lowerMsg.includes(keyword)) {
      detectedStrategy = strategy;
      break;
    }
  }

  if (detectedTh > 0 && detectedTh <= 16) {
    intent.thLevel = detectedTh;
  }
  
  if (detectedStrategy) {
    intent.strategy = detectedStrategy;
  }

  // Fallback ke TH18 jika ambiguous (most popular)
  if (!intent.thLevel && (lowerMsg.includes('base') || lowerMsg.includes('layout'))) {
    intent.thLevel = 18;
  }

  return intent;
}

export async function getLayoutBaseContext(thLevel?: number, strategy?: string): Promise<LayoutBaseContextType> {
  try {
    // Build smart query dengan filtering
    let query = "SELECT * FROM layouts WHERE is_active = 1";
    
    // Apply TH level filter jika specified
    if (thLevel && thLevel > 0) {
      query += ` AND th_level = ${thLevel}`;
    }
    
    // Apply strategy filter jika specified (search dalam base_tag)
    if (strategy) {
      query += ` AND base_tag LIKE '%${strategy}%'`;
    }
    
    query += " ORDER BY view_count DESC LIMIT 20";

    const result = await client.execute(query);

    const layouts: LayoutBase[] = result.rows.map(row => {
      const description = row.description ? String(row.description) : "No description available";
      const baseTag = String(row.base_tag || "");
      const thLevelFromDb = row.th_level ? Number(row.th_level) : 0;
      
      return {
        id: String(row.id),
        name: extractNameFromDescription(description, baseTag, thLevelFromDb),
        thLevel: thLevelFromDb,
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

    // Fallback: jika query dengan strategy tidak return hasil, coba ulang tanpa strategy
    if (layouts.length === 0 && strategy) {
      const fallbackQuery = `SELECT * FROM layouts WHERE is_active = 1${thLevel ? ` AND th_level = ${thLevel}` : ""} ORDER BY view_count DESC LIMIT 20`;
      const fallbackResult = await client.execute(fallbackQuery);
      
      const fallbackLayouts: LayoutBase[] = fallbackResult.rows.map(row => {
        const description = row.description ? String(row.description) : "No description available";
        const baseTag = String(row.base_tag || "");
        const thLevelFromDb = row.th_level ? Number(row.th_level) : 0;
        
        return {
          id: String(row.id),
          name: extractNameFromDescription(description, baseTag, thLevelFromDb),
          thLevel: thLevelFromDb,
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
        recommendedLayouts: fallbackLayouts,
        getLayoutById: (id: string) => fallbackLayouts.find(layout => layout.id === id),
        getLayoutsByTag: (tag: string) =>
          fallbackLayouts.filter(layout =>
            layout.tags.some(t => t.toLowerCase().includes(tag.toLowerCase())) ||
            layout.baseTag.toLowerCase().includes(tag.toLowerCase())
          ),
        getLayoutsByThLevel: (thLv: number) =>
          fallbackLayouts.filter(layout => layout.thLevel === thLv),
        getRecommendedLayouts: (strat: string) =>
          fallbackLayouts.filter(layout =>
            layout.recommendedFor.some(rf =>
              rf.toLowerCase().includes(strat.toLowerCase())
            ) ||
            layout.tags.some(t =>
              t.toLowerCase().includes(strat.toLowerCase())
            )
          )
      };
    }

    return {
      recommendedLayouts: layouts,
      getLayoutById: (id: string) => layouts.find(layout => layout.id === id),
      getLayoutsByTag: (tag: string) =>
        layouts.filter(layout =>
          layout.tags.some(t => t.toLowerCase().includes(tag.toLowerCase())) ||
          layout.baseTag.toLowerCase().includes(tag.toLowerCase())
        ),
      getLayoutsByThLevel: (thLv: number) =>
        layouts.filter(layout => layout.thLevel === thLv),
      getRecommendedLayouts: (strat: string) =>
        layouts.filter(layout =>
          layout.recommendedFor.some(rf =>
            rf.toLowerCase().includes(strat.toLowerCase())
          ) ||
          layout.tags.some(t =>
            t.toLowerCase().includes(strat.toLowerCase())
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
