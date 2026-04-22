export const LEAGUE_MAP: Record<number, { name: string; icon: string }> = {
  29000000: { 
    name: "Unranked", 
    icon: "https://api-assets.clashofclans.com/leagues/72/e--YMyIexEQQhE4imLoJcwhYn6Uy8KqlgyY3_kFV6t4.png" 
  },
  29000001: { 
    name: "Bronze League III", 
    icon: "https://api-assets.clashofclans.com/leagues/288/uUJDLEdAh7Lwf6YOHmXfNM586ZlEvMju54bTlt2u6EE.png" 
  },
  29000002: { 
    name: "Bronze League II", 
    icon: "https://api-assets.clashofclans.com/leagues/288/U2acNDRaR5rQDu4Z6pQKaGcjWm9dkSnHMAPZCXrHPB4.png" 
  },
  29000003: { 
    name: "Bronze League I", 
    icon: "https://api-assets.clashofclans.com/leagues/288/SZIXZHZxfHTmgseKCH6T5hvMQ3JQM-Js2QfpC9A3ya0.png" 
  },
  29000004: { 
    name: "Silver League III", 
    icon: "https://api-assets.clashofclans.com/leagues/288/QcFBfoArnafaXCnB5OfI7vESpQEBuvWtzOyLq8gJzVc.png" 
  },
  29000005: { 
    name: "Silver League II", 
    icon: "https://api-assets.clashofclans.com/leagues/288/8OhXcwDJkenBH2kPH73eXftFOpHHRF-b32n0yrTqC44.png" 
  },
  29000006: { 
    name: "Silver League I", 
    icon: "https://api-assets.clashofclans.com/leagues/288/nvrBLvCK10elRHmD1g9w5UU1flDRMhYAojMB2UbYfPs.png" 
  },
  29000007: { 
    name: "Gold League III", 
    icon: "https://api-assets.clashofclans.com/leagues/288/vd4Lhz5b2I1P0cLH25B6q63JN3Wt1j2NTMhOYpMPQ4M.png" 
  },
  29000008: { 
    name: "Gold League II", 
    icon: "https://api-assets.clashofclans.com/leagues/288/Y6CveuHmPM_oiOic2Yet0rYL9AFRYW0WA0u2e44-YbM.png" 
  },
  29000009: { 
    name: "Gold League I", 
    icon: "https://api-assets.clashofclans.com/leagues/288/CorhMY9ZmQvqXTZ4VYVuUgPNGSHsO0cEXEL5WYRmB2Y.png" 
  },
  29000010: { 
    name: "Crystal League III", 
    icon: "https://api-assets.clashofclans.com/leagues/288/Hyqco7bHh0Q81xB8mSF_ZhjKnKcTmJ9QEq9QGlsxiKE.png" 
  },
  29000011: { 
    name: "Crystal League II", 
    icon: "https://api-assets.clashofclans.com/leagues/288/jhP36EhAA9n1ADafdQtCP-ztEAQjoRpY7cT8sU7SW8A.png" 
  },
  29000012: { 
    name: "Crystal League I", 
    icon: "https://api-assets.clashofclans.com/leagues/288/kSfTyNNVSvogX3dMvpFUTt72VW74w6vEsEFuuOV4osQ.png" 
  },
  29000013: { 
    name: "Master League III", 
    icon: "https://api-assets.clashofclans.com/leagues/288/pSXfKvBKSgtvfOY3xKkgFaRQi0WcE28s3X35ywbIluY.png" 
  },
  29000014: { 
    name: "Master League II", 
    icon: "https://api-assets.clashofclans.com/leagues/288/4wtS1stWZQ-1VJ5HaCuDPfdhTWjeZs_jPar_YPzK6Lg.png" 
  },
  29000015: { 
    name: "Master League I", 
    icon: "https://api-assets.clashofclans.com/leagues/288/olUfFb1wscIH8hqECAdWbdB6jPm9R8zzEyHIzyBgRXc.png" 
  },
  29000016: { 
    name: "Champion League III", 
    icon: "https://api-assets.clashofclans.com/leagues/288/JmmTbspV86xBigM7OP5_SjsEDPuE7oXjZC9aOy8xO3s.png" 
  },
  29000017: { 
    name: "Champion League II", 
    icon: "https://api-assets.clashofclans.com/leagues/288/kLWSSyq7vJiRiCantiKCoFuSJOxief6R1ky6AyfB8q0.png" 
  },
  29000018: { 
    name: "Champion League I", 
    icon: "https://api-assets.clashofclans.com/leagues/288/9v_04LHmd1LWq7IoY45dAdGhrBkrc2ZFMZVhe23PdCE.png" 
  },
  29000019: { 
    name: "Titan League III", 
    icon: "https://api-assets.clashofclans.com/leagues/288/L-HrwYpFbDwWjdmhJQiZiTRa_zXPPOgUTdmbsaq4meo.png" 
  },
  29000020: { 
    name: "Titan League II", 
    icon: "https://api-assets.clashofclans.com/leagues/288/llpWocHlOoFliwyaEx5Z6dmoZG4u4NmxwpF-Jg7su7Q.png" 
  },
  29000021: { 
    name: "Titan League I", 
    icon: "https://api-assets.clashofclans.com/leagues/288/qVCZmeYH0lS7Gaa6YoB7LrNly7bfw7fV_d4Vp2CU-gk.png" 
  },
  29000022: { 
    name: "Legend League", 
    icon: "https://api-assets.clashofclans.com/leagues/288/R2zmhyqQ0_lKcDR5EyghXCxgyC9mm_mVMIjAbmGoZtw.png" 
  }
};

/**
 * Helper buat dapetin badge berdasarkan nama (Case-Insensitive)
 * Berguna buat mapping Clan Capital League ke icon Home Village yang mirip.
 */
export function getBadgeByLeagueName(name?: string): string {
  if (!name) return LEAGUE_MAP[29000000].icon;
  
  const normalized = name.toLowerCase();
  
  // Cari kecocokan nama liga
  const foundId = Object.keys(LEAGUE_MAP).find(id => 
    LEAGUE_MAP[Number(id)].name.toLowerCase() === normalized
  );

  if (foundId) return LEAGUE_MAP[Number(foundId)].icon;

  // Fallback parsial (misal: "Capital Crystal League III" bakal dapet icon Crystal III biasa)
  if (normalized.includes("legend")) return LEAGUE_MAP[29000022].icon;
  if (normalized.includes("titan i")) return LEAGUE_MAP[29000021].icon;
  if (normalized.includes("titan ii")) return LEAGUE_MAP[29000020].icon;
  if (normalized.includes("titan iii")) return LEAGUE_MAP[29000019].icon;
  if (normalized.includes("champion i")) return LEAGUE_MAP[29000018].icon;
  if (normalized.includes("champion ii")) return LEAGUE_MAP[29000017].icon;
  if (normalized.includes("champion iii")) return LEAGUE_MAP[29000016].icon;
  if (normalized.includes("master i")) return LEAGUE_MAP[29000015].icon;
  if (normalized.includes("master ii")) return LEAGUE_MAP[29000014].icon;
  if (normalized.includes("master iii")) return LEAGUE_MAP[29000013].icon;
  if (normalized.includes("crystal i")) return LEAGUE_MAP[29000012].icon;
  if (normalized.includes("crystal ii")) return LEAGUE_MAP[29000011].icon;
  if (normalized.includes("crystal iii")) return LEAGUE_MAP[29000010].icon;
  if (normalized.includes("gold i")) return LEAGUE_MAP[29000009].icon;
  if (normalized.includes("gold ii")) return LEAGUE_MAP[29000008].icon;
  if (normalized.includes("gold iii")) return LEAGUE_MAP[29000007].icon;

  return LEAGUE_MAP[29000000].icon;
}