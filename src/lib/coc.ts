// Fungsi yang sudah kamu punya
export async function getClanData() {
  const res = await fetch(`https://cocproxy.royaleapi.dev/v1/clans/${process.env.CLAN_TAG}`, {
    headers: {
      "Authorization": `Bearer ${process.env.COC_API_KEY}`,
    },
    next: { revalidate: 60 },
  });

  if (!res.ok) return null;
  return res.json();
}

// Fetch clan data dengan dynamic tag (untuk clan search)
export async function getClanDataByTag(clanTag: string) {
  const cleanTag = clanTag.replace("#", "");
  const formattedTag = `%23${cleanTag}`;

  const res = await fetch(`https://cocproxy.royaleapi.dev/v1/clans/${formattedTag}`, {
    headers: {
      "Authorization": `Bearer ${process.env.COC_API_KEY}`,
    },
    next: { revalidate: 120 },
  });

  if (!res.ok) return null;
  return res.json();
}

// TAMBAHKAN INI: Untuk cek status war real-time
export async function getCurrentWar() {
  const res = await fetch(`https://cocproxy.royaleapi.dev/v1/clans/${process.env.CLAN_TAG}/currentwar`, {
    headers: {
      "Authorization": `Bearer ${process.env.COC_API_KEY}`,
    },
    next: { revalidate: 60 },
  });

  if (!res.ok) return null;
  return res.json();
}

export async function getWarLog() {
  const res = await fetch(`https://cocproxy.royaleapi.dev/v1/clans/${process.env.CLAN_TAG}/warlog`, {
    headers: {
      "Authorization": `Bearer ${process.env.COC_API_KEY}`,
    },
    next: { revalidate: 7200 },
  });

  if (!res.ok) return null;
  return res.json();
}

// Fetch current war by dynamic clan tag (untuk live war status)
export async function getCurrentWarByTag(clanTag: string) {
  const cleanTag = clanTag.replace("#", "");
  const formattedTag = `%23${cleanTag}`;

  const res = await fetch(`https://cocproxy.royaleapi.dev/v1/clans/${formattedTag}/currentwar`, {
    headers: {
      "Authorization": `Bearer ${process.env.COC_API_KEY}`,
    },
    next: { revalidate: 60 },
  });

  if (!res.ok) return null;
  return res.json();
}

// Fetch war log by dynamic clan tag (untuk live war status history)
export async function getWarLogByTag(clanTag: string) {
  const cleanTag = clanTag.replace("#", "");
  const formattedTag = `%23${cleanTag}`;

  const res = await fetch(`https://cocproxy.royaleapi.dev/v1/clans/${formattedTag}/warlog`, {
    headers: {
      "Authorization": `Bearer ${process.env.COC_API_KEY}`,
    },
    next: { revalidate: 7200 },
  });

  if (!res.ok) return null;
  return res.json();
}


// ---FOR CWL---

// Fetch CWL league group by clan tag
export async function getCWLByTag(clanTag: string) {
  const cleanTag = clanTag.replace("#", "");
  const formattedTag = `%23${cleanTag}`;

  const res = await fetch(`https://cocproxy.royaleapi.dev/v1/clans/${formattedTag}/currentwar/leaguegroup`, {
    headers: {
      "Authorization": `Bearer ${process.env.COC_API_KEY}`,
    },
    next: { revalidate: 60 },
  });

  if (!res.ok) return null;
  return res.json();
}

// Fetch specific CWL war by war tag
export async function getCWLWarByTag(warTag: string) {
  const cleanTag = warTag.replace("#", "");
  const formattedTag = `%23${cleanTag}`;

  const res = await fetch(`https://cocproxy.royaleapi.dev/v1/clanwarleagues/wars/${formattedTag}`, {
    headers: {
      "Authorization": `Bearer ${process.env.COC_API_KEY}`,
    },
    next: { revalidate: 60 },
  });

  if (!res.ok) return null;
  return res.json();
}