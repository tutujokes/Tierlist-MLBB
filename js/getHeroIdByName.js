export async function getHeroIdByName(name) {
  const response = await fetch('https://mlbb-proxy.vercel.app/api/heroes?source=list');
  const heroList = await response.json();
  const normalized = (str) => str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
  const target = normalized(name);
  for (const [id, heroName] of Object.entries(heroList)) {
    if (normalized(heroName) === target) return id;
  }
  return null;
}
