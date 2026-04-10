// Fungsi yang sudah kamu punya
export async function getClanData() {
  const res = await fetch(`https://api.clashofclans.com/v1/clans/${process.env.CLAN_TAG}`, {
    headers: {
      "Authorization": `Bearer ${process.env.COC_API_KEY}`,
    },
    next: { revalidate: 60 },
  });

  if (!res.ok) return null;
  return res.json();
}

// TAMBAHKAN INI: Untuk cek status war real-time
export async function getCurrentWar() {
  const res = await fetch(`https://api.clashofclans.com/v1/clans/${process.env.CLAN_TAG}/currentwar`, {
    headers: {
      "Authorization": `Bearer ${process.env.COC_API_KEY}`,
    },
    next: { revalidate: 60 },
  });

  if (!res.ok) return null;
  return res.json();
}