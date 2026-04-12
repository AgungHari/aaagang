import OpenAI from 'openai';
import { NextResponse } from 'next/server';

const client = new OpenAI({
  baseURL: 'https://agunghari2-llm.hf.space/v1', 
  apiKey: 'pake-apa-aja-bebas',
});

export async function POST(req: Request) {
  try {
    const { message } = await req.json();

    if (!message) {
      return NextResponse.json({ error: "Pesan kosong rek" }, { status: 400 });
    }

    // 1. Ambil Data dari API Supercell (via Proxy RoyaleAPI)
    const cocRes = await fetch("https://cocproxy.royaleapi.dev/v1/clans/%23Q9YY02J9", {
      headers: {
        "Authorization": `Bearer ${process.env.COC_API_KEY}` // Pake ENV biar aman, Hari!
      }
    });
    
    const rawClanData = await cocRes.json();

    // 2. DATA PREPROCESSING (Filter biar Sigma gak mabuk token)
    const clanBrief = {
      name: rawClanData.name,
      level: rawClanData.clanLevel,
      points: rawClanData.clanPoints,
      membersCount: rawClanData.members,
      warRecord: `Win: ${rawClanData.warWins}, Loss: ${rawClanData.warLosses}, Streak: ${rawClanData.warWinStreak}`,
      description: rawClanData.description
    };

    // Ambil top 10 member berdasarkan donasi/rank untuk efisiensi
    const memberSummary = rawClanData.memberList
      .slice(0, 15) // Ambil 15 besar saja sudah cukup mewakili klan
      .map((m: any) => ({
        n: m.name,      // Pakai key pendek (n, r, t) buat hemat token lebih ekstrim
        r: m.role,
        th: m.townHallLevel,
        don: m.donations
      }));

    // 3. Gabungkan jadi Context String
    const clanContext = `
    INFO KLAN REAL-TIME:
    Klan: ${clanBrief.name} (Lvl ${clanBrief.level})
    Poin: ${clanBrief.points} | Member: ${clanBrief.membersCount}/50
    War Record: ${clanBrief.warRecord}
    Deskripsi: ${clanBrief.description}
    Top Member List (Name|Role|TH|Donation): ${JSON.stringify(memberSummary)}
    `;

    // 4. Panggil Sigma dengan Context
    const apiResponse = await client.chat.completions.create({
      model: 'model',
      messages: [
        {
          role: 'system',
          content: `Kamu adalah Sigma, asisten cerdas klan AAA GANG. Kamu berada di Web 3agang.pro yang merupakan website resmi AAA GANG. Akan ada banyak orang yang bertanya bagaimana cara gabung ke clan AAA GANG cukup jawab dengan memasukan tag klan yaitu #Q9YY02J9 ke pencarian klan in game.
          Gunakan data klan berikut untuk menjawab pertanyaan user secara akurat dan gaya bicara yang asik/sedikit sombong khas klan kuat. 
          Data klan saat ini: ${clanContext}
          jika ada yang tanya tentang kamu bilang saja kamu dibuat menggunakan kombinasi Arsitektur GPT 5, AgungR2 dan Qwen3,6. 
          `
          
        },
        {
          role: 'user',
          content: message,
        },
      ],
      max_tokens: 512,
      temperature: 0.7, // Biar jawabannya lebih variatif
    });

    const response = apiResponse.choices[0].message;
    return NextResponse.json({ text: response.content });

  } catch (error: any) {
    console.error("🔴 SIGMA HF ERROR:", error.message);
    return NextResponse.json(
      { error: "Sigma lagi ke bengkel rek, coba cek koneksi API CoC atau Space HF-mu." }, 
      { status: 500 }
    );
  }
}