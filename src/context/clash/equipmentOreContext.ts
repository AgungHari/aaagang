export const equipmentOreContext = `
Kamus Equipment Ore :
- Equipment Ore adalah sumber daya yang diperkenalkan di Clash of Clans, digunakan untuk meningkatkan peralatan (equipment) yang dapat dipasang pada Heroes.
- Terdapat 3 jenis Ore: Shiny Ore (Biru, paling mudah didapat), Glowy Ore (Ungu, lebih langka), dan Starry Ore (Kuning, paling langka dan hanya digunakan untuk Epic Equipment).
- Terdapat 2 tingkat kelangkaan Equipment: COMMON (Level Maksimal 18) dan EPIC (Level Maksimal 27).

INSTRUKSI PERHITUNGAN UNTUK SIGMA:
Jika pengunjung bertanya, "Berapa ore yang dibutuhkan dari level X ke level Y?", kamu harus:
1. Pastikan apakah equipment tersebut COMMON atau EPIC.
2. JUMLAHKAN semua biaya dari Level (X+1) sampai Level Y berdasarkan tabel di bawah.

Contoh: Jika user bertanya biaya Epic dari level 18 ke 20, kamu harus menjumlahkan biaya Level 19 (2800 Shiny) ditambah biaya Level 20 (2900 Shiny). Total: 5700 Shiny.

BIAYA UPGRADE COMMON EQUIPMENT (Biaya untuk NAIK ke level tersebut):
Level 2: 120 Shiny
Level 3: 240 Shiny, 20 Glowy
Level 4: 400 Shiny
Level 5: 600 Shiny
Level 6: 840 Shiny, 100 Glowy
Level 7: 1120 Shiny
Level 8: 1440 Shiny
Level 9: 1800 Shiny, 200 Glowy
Level 10: 1900 Shiny
Level 11: 2000 Shiny
Level 12: 2100 Shiny, 400 Glowy
Level 13: 2200 Shiny
Level 14: 2300 Shiny
Level 15: 2400 Shiny, 600 Glowy
Level 16: 2500 Shiny
Level 17: 2600 Shiny
Level 18: 2700 Shiny, 600 Glowy

BIAYA UPGRADE EPIC EQUIPMENT (Biaya untuk NAIK ke level tersebut):
Level 2: 120 Shiny
Level 3: 240 Shiny, 20 Glowy
Level 4: 400 Shiny
Level 5: 600 Shiny
Level 6: 840 Shiny, 100 Glowy
Level 7: 1120 Shiny
Level 8: 1440 Shiny
Level 9: 1800 Shiny, 200 Glowy, 10 Starry
Level 10: 1900 Shiny
Level 11: 2000 Shiny
Level 12: 2100 Shiny, 400 Glowy, 20 Starry
Level 13: 2200 Shiny
Level 14: 2300 Shiny
Level 15: 2400 Shiny, 600 Glowy, 30 Starry
Level 16: 2500 Shiny
Level 17: 2600 Shiny
Level 18: 2700 Shiny, 600 Glowy, 40 Starry
Level 19: 2800 Shiny
Level 20: 2900 Shiny
Level 21: 3000 Shiny, 600 Glowy, 50 Starry
Level 22: 3100 Shiny
Level 23: 3200 Shiny
Level 24: 3300 Shiny, 600 Glowy, 60 Starry
Level 25: 3400 Shiny
Level 26: 3500 Shiny
Level 27: 3600 Shiny, 600 Glowy, 110 Starry
`;