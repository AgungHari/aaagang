const characters = [
  "Goblin",
  "Barbarian",
  "Archer",
  "Giant",
  "Hog",
  "Dragon",
  "Wizard",
  "Witch",
  "Golem",
  "Balloon",
  "Knight",
  "Valkyrie",
  "Lava",
  "Pekka",
  "Minion",
  "Skeleton",
  "RootRider",
  "Miner",
  "Bowler",
  "Warden",
];

const adjectives = [
  "fierce",
  "mighty",
  "swift",
  "silent",
  "bold",
  "wild",
  "crazy",
  "insane",
  "elite",
  "master",
  "brave",
  "strong",
  "cunning",
  "deadly",
  "dark",
  "golden",
  "silver",
  "racing",
  "flying",
  "killer",
  "toxic",
  "wicked",
  "savage",
  "violent",
  "gamer",
  "kikir",
  "ngompol",
  "loncat",
  "goyang",
  "joget",
];

export function generateRandomName(): string {
  const randomChar =
    characters[Math.floor(Math.random() * characters.length)];
  const randomAdj = adjectives[Math.floor(Math.random() * adjectives.length)];
  const randomNum = Math.floor(Math.random() * 10000);

  return `${randomChar}_${randomAdj}_${randomNum}`;
}
