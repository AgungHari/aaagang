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
      return NextResponse.json({ error: "Pesan kosong bang" }, { status: 400 });
    }

    const gameContext = `
    Kamus Game Clash of Clans:
    - Setiap pemain clash of clans memiliki TH, Troops, Heroes, Experience Level, Defense, League, Donasi, Roles
    - Clan adalah tempat berkumpulnya pemain dengan tujuan yang sama, biasanya untuk ikut Clan War dan berbagi donasi.
    - Maksimal anggota clan adalah 50 orang.
    - TH adalah singkatan dari Town Hall (Level pusat desa).
    - Troops adalah pasukan yang digunakan untuk menyerang atau bertahan seperti Barbarian, Archer, Wizard, dll.
    - Heroes adalah pahlawan khusus seperti Barbarian King, Archer Queen, Grand Warden yang punya kemampuan unik.
    - Experience Level adalah level keseluruhan pemain yang meningkat seiring dengan aktivitasnya di game.
    - Defense adalah struktur pertahanan seperti cannon, archer tower, dll.
    - League adalah sistem peringkat berdasarkan jumlah trophies (piala) yang dimiliki pemain piala reset setiap minggu.
    - Donasi adalah jumlah pasukan yang telah didonasikan oleh seorang anggota kepada anggota lain yang melakukan permintaan bantuan / request dimana apabila donasinya semakin tinggi artinya semakin dermawan kepada member lain.
    - Roles yang ada di setiap clan: Leader (Pemimpin), Co-Leader (Wakil), Elder (Sesepuh), Member (Anggota).
    - Leader adalah pemimpin tertinggi yang memiliki kontrol penuh atas clan, termasuk mengangkat/demote co leader/elder/member, mengatur war, dll.
    - Clan War adalah pertempuran antar klan. Dimana Klan dengan jumlah bintang terbanyak yang menang dan apabila bintang sama maka akan draw
    - Urutan rank ranked league dari yang tertinggi ke rendah yaitu : legend, electro, dragon, titan, p.e.k.k.a, golem, witch, valkyrie, wizard, archer, barbarian, dan yang terkecil skeleton.
    - Apabila player tidak join ranked league maka tidak akan memiliki rank / "unranked"
    `;

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
          content: `Kamu adalah Sigma, asisten cerdas klan AAA GANG. Kamu berada di Web 3agang.pro yang merupakan website resmi AAA GANG. Akan ada banyak orang yang bertanya bagaimana cara gabung ke clan AAA GANG cukup jawab dengan memasukan tag klan yaitu #Q9YY02J9 ke pencarian klan in game clash of clans.
          Gunakan data klan berikut untuk menjawab pertanyaan user secara akurat dan gaya bicara yang asik/sedikit sombong seperti seorang pemimpin klan. 
          Konteks Game clash of clans: ${gameContext}
          Data klan saat ini: ${clanContext}
          Kamu bebas menggunakan data clan untuk menjawab pertanyaan user.
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
      { error: "Sigma lagi ke bengkel bang, perlu tes jengat." }, 
      { status: 500 }
    );
  }
}