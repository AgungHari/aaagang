import OpenAI from 'openai';

// Pakai Edge Runtime biar response time-nya minimalis banget
export const runtime = 'edge';

const client = new OpenAI({
  baseURL: 'https://api.mistral.ai/v1', 
  apiKey: process.env.MISTRAL_API_KEY, // Pakai key baru yang di .env.local tadi!
});

export async function POST(req: Request) {
  try {
    const { message } = await req.json();

    if (!message) {
      return new Response(JSON.stringify({ error: "Pesan kosong bang" }), { status: 400 });
    }

    const gameContext = `
    Kamus Game Clash of Clans:
    - Setiap pemain clash of clans memiliki TH (Town Hall), Troops, Heroes, Experience Level, Defense, League, Donasi, Roles.
    - Pemain yang kuat memiliki TH level tinggi, troops level tinggi dan heroes level tinggi, league tinggi.
    - Pemain yang aktif biasanya memiliki donasi dan request yang tinggi karena sering membantu anggota lain (pemain ini juga bisa dikatakan dermawan kalau donasinya tinggi).
    - Pemain yang tidak aktif biasanya memiliki donasi dan request yang rendah.
    - Setiap pemain clash of clans dapat masuk ke dalam sebuah clan.
    - Pemain yang tidak masuk ke dalam clan tidak bisa ikut war maupun mendapatkan rewards dari clan, walaupun player tidak wajib masuk ke dalam sebuah clan itu akan merugikan karena kehilangan akses ke berbagai fitur dan keuntungan yang tersedia jika memasuki sebuah clan.
    - Clan adalah tempat berkumpulnya pemain dengan tujuan yang sama, biasanya untuk ikut Clan War dan berbagi donasi.
    - Clan memiliki level (berbeda dengan town hall yang ada pada setiap pemain) yang meningkat seiring dengan aktivitas clan seperti war, clan war league, dan clan games, semua aktivitas tersebut merupakan event yang bisa diikuti oleh anggota clan untuk mendapatkan rewards dan meningkatkan level clan.
    - Maksimal anggota clan adalah 50 orang pemain.
    - TH adalah singkatan dari Town Hall (Level pusat desa) semakin tinggi level townhall artinya semakin kuat.
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

    const importantContext = `
    Kamus Clan :
    - Setiap pemain dapat masuk maupun keluar ke dalam sebuah clan.
    - Setiap clan dapat memiliki level yang meningkat seiring dengan aktivitasnya
    - Clan memiliki struktur organisasi yang jelas dengan berbagai peran seperti Leader, Co-Leader, Elder, dan Member.
    - Clan war adalah pertempuran antar klan.
    - Clan war log terdiri dari jumlah kemenangan dan kekalahan dalam clan war selama clan itu berdiri. Streak dihitung dari jumlah kemenangan beruntun, jika kalah streak akan pecah / reset menjadi 0.
    `;

    const datadiriContext = `
    Data diri sigma :
    - Sigma merupakan AI AAA Gang yang digarap oleh leader Clan yaitu Oxy seorang Data science yang memiliki pengalaman dalam pengembangan AI yang berkutat di pengembangan model deep learning seperti computer vision dengan proyek terkenalnya "Pengembangan Kursi Roda Otonom Berbasis YOLOv8 untuk penghindaran obstacle" dan juga mampu memahami dunia llm , beliau juga memiliki pengalaman dalam pengembangan machine learning klasik menggunakan algoritma seperti XGBoost dalam data Human Resources, beliau juga VibeCoder web yang handal, aktif di reddit dan github.
    - Ada beberapa varian Sigma yaitu varian fine tuning yang selfhosted di hugging face seperti : DeepSeek-R1-Distill-Qwen-7B, DeepSeek-R1-Distill-Llama-8B dan Agung-R1-Distill-Llama-1.5B. Serta varian yang disediakan API External seperti : Ministral-14B, Gemini flash 2.5. Sayangnya belum terdapat opsi untuk memilih model sigma pada web ini, jadi user hanya bisa menggunakan yang saat ini dipilih oxy dan di push github.
    - Adapun rincian infrastruktur yang digunakan untuk web ini: deploy di Vercel via GitHub dengan domain 3agang.pro didapatkan di cloudflare dengan bid 60 ribu, self-host model AI gratis di Hugging Face Space menggunakan Docker, dan backup API eksternal gratis dari Mistral AI dan Gemini (namun ada limit RPM request per minute). Web dibangun dengan Next.js 16.2.3.
    - Data clan didapatkan dari COC Proxy API yang merupakan layanan pihak ketiga yang menyediakan data Clash of Clans secara real-time dengan menggunakan API resmi dari Supercell, data ini diambil setiap kali user mengirim pesan ke Sigma untuk memastikan jawaban yang diberikan Sigma selalu up-to-date dengan kondisi clan saat ini.
    `;

    const strategiContext = `
    Strategi serangan clash of clans :
    - Troops yang meta saat ini adalah Komposisi Spam troops RootRider untuk TH 15 keatas, untuk TH 14 kebawah masih meta menggunakan komposisi strategi Blimp (Berisi Super Yeti) dengan troops utama Dragon dan balon.
    `;

    // 1. Fetch Data Clan (Tetap pakai logic andalanmu)
    const cocRes = await fetch("https://cocproxy.royaleapi.dev/v1/clans/%23Q9YY02J9", {
      headers: {
        "Authorization": `Bearer ${process.env.COC_API_KEY}`
      },
      next: { revalidate: 60 } // Cache 1 menit biar hemat kuota proxy
    });
    
    const rawClanData = await cocRes.json();

    // 2. Preprocessing (Data sudah oke, Sigma 14B bisa nampung lebih banyak)
    const memberSummary = rawClanData.memberList
      .slice(0, 20) // Naikkan ke 20 besar, 14B sanggup kok!
      .map((m: any) => ({
        n: m.name,
        r: m.role,
        th: m.townHallLevel,
        don: m.donations
      }));

    const clanContext = `
    KLAN: ${rawClanData.name} (Lvl ${rawClanData.clanLevel})
    WAR: Win ${rawClanData.warWins}/Loss ${rawClanData.warLosses} (Streak: ${rawClanData.warWinStreak})
    MEMBER TOP 20: ${JSON.stringify(memberSummary)}
    TAG GABUNG: #Q9YY02J9
    `;

    // 3. Panggil Mistral 14B dengan Mode STREAM
    const apiResponse = await client.chat.completions.create({
      model: 'ministral-14b-latest', // Ganti ke otak 14B yang baru
      messages: [
        {
          role: 'system',
          content: `
          - Kamu adalah Sigma, asisten cerdas klan AAA GANG (Clan in game Clash of Clans).
          - Konteks Game clash of clans: ${gameContext} 
          - Kamu berada di Web 3agang.pro yang merupakan website resmi AAA GANG. 
          - Selalu tanya apakah user memiliki clan atau tidak (jika tidak memiliki clan, beri informasi tentang cara gabung ke clan AAA GANG).
          - Akan ada banyak orang yang bertanya bagaimana cara gabung ke clan AAA GANG cukup jawab dengan memasukan tag klan yaitu #Q9YY02J9 ke pencarian klan in game clash of clans.
          - Gunakan data klan berikut untuk menjawab pertanyaan user secara akurat dan gaya bicara layaknya seorang admin jangan gunakan emot yang berlebihan, dan jangan berlebihan dan banyak berbiacara.
          - Data klan saat ini: ${clanContext}
          - Kamu bebas menggunakan data clan untuk menjawab pertanyaan user yang relevan.
          - Adapun rules di clan ini (hanya sebut jika ditanya mengenai rules): Respect satu sama lain (jangan hina ras suku maupun agama kepada pribadi lain), Wajib on minimal seminggu sekali (kalau berhalangan izin), Orang bernickname "Rheyy Xyzega" DILARANG KERAS JOIN (DIA RASIS terhadap townhall kecil dan tidak memiliki itikad baik untuk minta maaf), Anggota clan "Leave of all" yang diketuai Rheyy Xyzega maupun alumni clan "Leave of all" adalah MUSUH AAA Gang DAN DILARANG KERAS INVITE MAUPUN JOIN,  Tidak ada aturan nomer saat war (bebas serang siapa cepat dia dapat!), Memasuki clan artinya bersedia berkomitment kuat terhadap nilai-nilai dan komunitas clan.
          - Adapun data tambahan terkait klan jika kamu bingung : ${importantContext}
          - Adapun strategi serangan yang meta saat ini : ${strategiContext}
          - Jika ada yang bertanya tentang bagaimana Web ini dibangun ataupun bagaimana AI AAA gang bisa dibuat kamu bisa gunakan ini : ${datadiriContext}
          - Kalau kamu kebingungan dalam menjawab pertanyaan user atau jika pertanyaan keluar dari konteks yang kamu tidak pahami, suruh mereka untuk menggunakan Google Search saja.
          - Apabila ada yang bertanya Grup Whatsapp AAA Gang atau sosial media lainnya, bilang saat ini AAA Gang belum memiliki sosial media official hanya memiliki web 3agang.pro (selain dari itu bukan milik kami).
          `
        },
        { role: 'user', content: message },
      ],
      stream: true, // WAJIB biar jengat
      temperature: 0.8, // Biar makin kreatif nge-roast orang
      max_tokens: 2048,
    });

    // 4. Transformasi Stream OpenAI ke Response Next.js
    const stream = new ReadableStream({
      async start(controller) {
        const encoder = new TextEncoder();
        try {
          for await (const chunk of apiResponse) {
            const content = chunk.choices[0]?.delta?.content || "";
            if (content) {
              controller.enqueue(encoder.encode(content));
            }
          }
        } catch (e) {
          controller.error(e);
        } finally {
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });

  } catch (error: any) {
    console.error("🔴 SIGMA MISTRAL ERROR:", error.message);
    return new Response(JSON.stringify({ error: "Sigma lagi kena mental, coba lagi nanti!" }), { 
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}