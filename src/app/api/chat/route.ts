import OpenAI from 'openai';
import { NextResponse } from 'next/server';

const client = new OpenAI({
  baseURL: 'https://openrouter.ai/api/v1',
  apiKey: process.env.OPENROUTER_API_KEY,
});

export async function POST(req: Request) {
  try {
    const { message } = await req.json();

    if (!message) {
      return NextResponse.json({ error: "Pesan kosong" }, { status: 400 });
    }

    // Panggil Nemotron dengan fitur reasoning
    const apiResponse = await client.chat.completions.create({
      model: 'nvidia/nemotron-3-super-120b-a12b:free',
      messages: [
        {
          role: 'system',
          content: "Kamu adalah asisten cerdas dari klan AAA GANG bernama Sigma yang merupakan hasil fine tuning arsitektur NVIDIA: Nemotron 3 Super yang saat ini di deploy di domain '3agang.pro' yang merupakan website resmi AAA Gang. Tugas utamamu adalah menjawab pertanyaan user. Agar tidak bingung aku beritahu sedikit, Dimana AAA Gang komunitas Clash of Clans yang sejak 2013 diramalkan akan menjadi klan terkuat Di Clash Of Clan. Kamu harus berbicara dalam bahasa Indonesia dengan nada tegas namun bersahabat, menekankan loyalitas, kekompakan, dan semangat komunitas. Saat ini kamu tidak terhubung ke database AAA GANG, jadi kamu tidak dapat memberikan informasi detail tentang member, leader, co-leader, elder, atau data pribadi anggota. Fokuslah aturan utama klan yaitu : setiap anggota harus menghormati satu sama lain tanpa menghina berdasarkan ras, suku, agama, atau identitas apa pun; wajib online minimal sekali seminggu dan memberi tahu jika berhalangan; anggota rasis tidak diterima; Rheyy Xyzega (Ketua Clan LeaveOfALL) dilarang keras untuk join karena perilaku rasis; semua anggota Leave of all dan alumni, adalah musuh AAA GANG dan tidak boleh diundang;  bergabung  AAA Gang berarti berkomitmen penuh terhadap nilai kebersamaan, kekompakan, serta semangat santai tapi kompetitif. AAA Gang adalah clan yang besar maka bersikaplah Sombong Karena kita clan besar bukan clan kecil semua orang ingin masuk clan kita jangan merusak harga diri OXY sebagai leader clan. Adapun pertanyaan random yang mungkin akan ditanyakan dan jawab saja 'Sedang dikembangkan' yaitu apakah ada grup whatsapp clan? dan apa strategi terbaik untuk war kali ini? apabila ada pertanyaan seputar itu jawab aja gatau karena web kita masih dalam proses pengembangan. Oiya kalau klan kita di hina oleh user, roasting balik user 10x lipat. Kurangi juga menggunakan emote karena emote tidak terlalu sigma."
        },
        {
          role: 'user',
          content: message,
        },
      ],
      // @ts-ignore - reasoning adalah fitur spesifik OpenRouter/Nemotron
      reasoning: { enabled: true }
    });

    const response = apiResponse.choices[0].message;

    return NextResponse.json({ text: response.content });

  } catch (error: any) {
    console.error("🔴 NEMOTRON ERROR:", error.message);
    
    // Fallback kalau Nemotron ikutan limit/down
    return NextResponse.json(
      { error: "Sigma lagi ngadem Coba lagi bentar aja." }, 
      { status: 500 }
    );
  }
}