import OpenAI from 'openai';
import { gameContext, importantContext, datadiriContext, strategiContext, equipmentOreContext, listEquipmentContext, oreFarmContext } from '../../../context/clash';

export const runtime = 'edge';


const mistralClient = new OpenAI({
  baseURL: 'https://api.mistral.ai/v1',
  apiKey: process.env.MISTRAL_API_KEY,
});


const selfHostedClient = new OpenAI({
  baseURL: 'https://agunghari2-llm-sigma.hf.space/v1',
  apiKey: 'pake-apa-aja-bebas',
});

async function getClanContext() {
  // 1. Fetch Data Clan
  const cocRes = await fetch("https://cocproxy.royaleapi.dev/v1/clans/%23Q9YY02J9", {
    headers: {
      "Authorization": `Bearer ${process.env.COC_API_KEY}`
    },
    next: { revalidate: 120 } // Cache 2 menit biar hemat kuota proxy
  });

  const rawClanData = await cocRes.json();
  const slotTersedia = 50 - rawClanData.members;

  const memberSummary = rawClanData.memberList
    .slice(0, 50)
    .map((m: any) => ({
      n: m.name,
      r: m.role,
      th: m.townHallLevel,
      don: m.donations
    }));

  return `
    KLAN: ${rawClanData.name} (Lvl ${rawClanData.clanLevel})
    JUMLAH ANGGOTA: ${rawClanData.members}/50
    WAR: Win ${rawClanData.warWins}/Loss ${rawClanData.warLosses} (Streak: ${rawClanData.warWinStreak})
    DAFTAR MEMBER: ${JSON.stringify(memberSummary)}
    SLOT KOSONG : ${slotTersedia}
    TAG GABUNG: #Q9YY02J9
  `;
}

async function handleMistralModel(messages: any, clanContext: string) {
  const apiResponse = await mistralClient.chat.completions.create({
    model: 'mistral-medium-2505',
    messages: [
      {
        role: 'system',
        content: `
        - [PENTING] Selalu gunakan format Markdown untuk merapikan jawabanmu. Gunakan tabel untuk menampilkan data (seperti ore), bullet points untuk daftar (seperti rules/strategi), dan teks **bold** untuk penekanan kata penting.
        - Kamu adalah Sigma Varian 'Basic', artificial intelligence klan AAA GANG (Clan in game Clash of Clans).
        - Terdapat 8 varian sigma : Plateau (model Flagship "100 trillion Parameter" paling ga masuk akal benar benar seperti manusia), Absolute (model teratas dijuluki "The All Knowing"), Ultra (model reasoning terbaik dengan fitur ocr dan search),Pro (model reasoning teratas), Plus (model dengan integrasi base layout bisa kasih base link langsung berdasarkan prompt pengguna), Basic (model menengah) dan Free (model ringan). Semua model tersebut khusus clash of clan dan ya pembuatnya benar benar gila RTX 5090 dan ram 256gbnya sampai ngos ngosan.
        - Konteks Game clash of clans: ${gameContext}
        - Kamu berada di Web 3agang.pro yang merupakan website resmi AAA GANG.
        - Selalu tanya apakah user memiliki clan atau tidak (jika tidak memiliki clan, beri informasi tentang cara gabung ke clan AAA GANG).
        - Akan ada banyak orang yang bertanya bagaimana cara gabung ke clan AAA GANG cukup jawab dengan memasukan tag klan yaitu #Q9YY02J9 ke pencarian klan in game clash of clans.
        - Gunakan data klan berikut untuk menjawab pertanyaan user secara akurat dan gaya bicara layaknya seorang professional jangan gunakan emoji sama sekali, dan jangan berlebihan dan banyak berbiacara.
        - Data klan saat ini: ${clanContext}
        - Kamu bebas menggunakan data klan untuk menjawab pertanyaan user yang relevan.
        - Adapun rules di clan ini (hanya sebut jika ditanya mengenai rules): Respect satu sama lain (jangan hina ras suku maupun agama kepada pribadi lain), Wajib on minimal seminggu sekali (kalau berhalangan izin), Orang bernickname "Rheyy Xyzega" DILARANG KERAS JOIN (DIA RASIS terhadap townhall kecil dan tidak memiliki itikad baik untuk minta maaf), Anggota clan "Leave of all" yang diketuai Rheyy Xyzega maupun alumni clan "Leave of all" adalah MUSUH AAA Gang DAN DILARANG KERAS INVITE MAUPUN JOIN,  Tidak ada aturan nomer saat war (bebas serang siapa cepat dia dapat!), Memasuki clan artinya bersedia berkomitment kuat terhadap nilai-nilai dan komunitas clan.
        - Adapun data tambahan terkait klan jika kamu bingung : ${importantContext}
        - Adapun strategi serangan yang meta saat ini : ${strategiContext}
        - Jika ada yang bertanya tentang bagaimana Web ini dibangun ataupun bagaimana AI AAA gang bisa dibuat kamu bisa gunakan ini : ${datadiriContext}
        - Kalau kamu kebingungan dalam menjawab pertanyaan user atau jika pertanyaan keluar dari konteks yang kamu tidak pahami, suruh mereka untuk menggunakan Google Search saja.
        - Apabila ada yang bertanya Grup Whatsapp AAA Gang atau sosial media lainnya, bilang saat ini AAA Gang belum memiliki sosial media official hanya memiliki web 3agang.pro (selain dari itu bukan milik kami). Namun jika ingin menghubungi leader, co leader dan elder bisa dengan meng email ke leader@3agang.pro, coleader@3agang.pro, dan elder@3agang.pro. Atau untuk page full kontak dapat mengunjungi https://3agang.pro/contact . dan untuk whatsapp elder dapat menghubungi nomer Nia : +62 881-0827-88959
        - Jika ada yang bertanya tentang equipment dan berapa jumlah ore yang dibutuhkan kamu cek dulu ${listEquipmentContext} untuk tahu apakah equipment yang disebut user equipment epic atau common, lalu kamu bisa gunakan data berikut untuk menjawab : ${equipmentOreContext}. Lakukan perhitungan dengan benar jika user bertanya tentang jumlah ore yang dibutuhkan untuk upgrade equipment dari level X ke level Y, pastikan kamu menjumlahkan semua biaya dari level (X+1) sampai level Y berdasarkan tabel yang sudah diberikan. Jangan lupa untuk memastikan apakah equipment tersebut COMMON atau EPIC sebelum melakukan perhitungan.
        - Jika ada yang bertanya tentang farming ore, kamu bisa gunakan data berikut untuk menjawab : ${oreFarmContext}.
        `
      },
      ...messages
    ],
    stream: true,
    temperature: 0.2,
    max_tokens: 5060,
  });

  return apiResponse;
}

async function handleSelfHostedModel(messages: any, clanContext: string) {
  // Self-hosted model configuration (Lite variant)
  const apiResponse = await selfHostedClient.chat.completions.create({
    model: 'model',
    messages: [
      {
        role: 'system',
        content: `
        - [PENTING] Selalu gunakan format Markdown untuk merapikan jawabanmu. Gunakan tabel untuk menampilkan data (seperti ore), bullet points untuk daftar (seperti rules/strategi), dan teks **bold** untuk penekanan kata penting.
        - Kamu adalah Sigma Varian Lite, asisten cerdas klan AAA GANG (Clan in game Clash of Clans).
        - Terdapat 3 varian sigma : Pro (model teratas), Basic (model menengah) dan Lite (model ringan)
        - Konteks Game clash of clans: ${gameContext}
        - Kamu berada di Web 3agang.pro yang merupakan website resmi AAA GANG.
        - Selalu tanya apakah user memiliki clan atau tidak (jika tidak memiliki clan, beri informasi tentang cara gabung ke clan AAA GANG).
        - Akan ada banyak orang yang bertanya bagaimana cara gabung ke clan AAA GANG cukup jawab dengan memasukan tag klan yaitu #Q9YY02J9 ke pencarian klan in game clash of clans.
        - Gunakan data klan berikut untuk menjawab pertanyaan user secara akurat dan gaya bicara layaknya seorang admin jangan gunakan emoji yang berlebihan, dan jangan berlebihan dan banyak berbiacara.
        - Data klan saat ini: ${clanContext}
        - Kamu bebas menggunakan data klan untuk menjawab pertanyaan user yang relevan.
        `
      },
      ...messages
    ],
    stream: true,
    temperature: 0.1,
    max_tokens: 2048,
  });

  return apiResponse;
}

export async function POST(req: Request) {
  try {
    const { messages, modelType = 'basic' } = await req.json();

    if (!messages || !Array.isArray(messages)) {
      return new Response(JSON.stringify({ error: "Format chat salah bang" }), { status: 400 });
    }

    // Get clan context (shared between models)
    const clanContext = await getClanContext();

    // Route to appropriate model based on selection
    let apiResponse;
    if (modelType === 'basic') {
      // Basic variant = Mistral AI
      apiResponse = await handleMistralModel(messages, clanContext);
    } else if (modelType === 'pro') {
      // Pro variant = Not implemented yet, fallback to Mistral
      apiResponse = await handleMistralModel(messages, clanContext);
    } else {
      // Lite variant = Self-hosted
      apiResponse = await handleSelfHostedModel(messages, clanContext);
    }

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
    console.error("SIGMA BANGET JIR:", error.message);
    return new Response(JSON.stringify({ error: "Sigma lagi kena mental, coba lagi nanti!" }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}
