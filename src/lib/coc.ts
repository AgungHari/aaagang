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
    next: { revalidate: 43200 },
  });

  if (!res.ok) return null;
  return res.json();
}


// ---FOR CWL---

// export async function getCurrentCWL() {
//   const res = await fetch(`https://cocproxy.royaleapi.dev/v1/clans/${process.env.CLAN_TAG}/currentwar/leaguegroup`, {
//     headers: {
//       "Authorization": `Bearer ${process.env.COC_API_KEY}`,
//     },
//     next: { revalidate: 60 },
//   });

//   if (!res.ok) return null;
//   return res.json();
// }

// export async function getRoundsCWL() {
//   const res = await fetch(`https://cocproxy.royaleapi.dev/v1/clanwarleagues/wars/{warTag}`, {
//     headers: {
//       "Authorization": `Bearer ${process.env.COC_API_KEY}`,
//     },
//     next: { revalidate: 60 },
//   });

//   if (!res.ok) return null;
//   return res.json();
// }