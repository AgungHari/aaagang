export async function getPlayerData(playerTag: string) {
  // Bersihkan tag dan siapkan format %23 untuk API
  const cleanTag = playerTag.replace("#", "");
  const formattedTag = `%23${cleanTag}`;

  const res = await fetch(`https://cocproxy.royaleapi.dev/v1/players/${formattedTag}`, {
    headers: {
      "Authorization": `Bearer ${process.env.COC_API_KEY}`,
    },
    next: { revalidate: 3600 }, // Cache 1 jam
  });

  if (!res.ok) return null;
  return res.json();
}