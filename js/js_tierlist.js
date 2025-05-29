// Carrega Tier List da API (por WinRate) e organiza em SS, S, A
const API_URL = "https://mlbb-stats.ridwaanhall.com/api/hero-rank/?sort_field=win_rate&sort_order=desc&rank=Mythic&days=7&size=130";

function criarCardHeroi(hero, winRate) {
  // Linka para a página do herói
  const card = document.createElement('div');
  card.className = "card-hero";
  card.innerHTML = `
    <a href="heroi.html?name=${encodeURIComponent(hero.name)}">
      <img src="${hero.icon}" alt="${hero.name}">
      <div>${hero.name}</div>
      <small>${winRate}% WR</small>
    </a>
  `;
  return card;
}

fetch(API_URL)
  .then(res => res.json())
  .then(json => {
    const dados = json.data || [];
    // Limpa containers
    document.getElementById('tier-ss').innerHTML = '';
    document.getElementById('tier-s').innerHTML = '';
    document.getElementById('tier-a').innerHTML = '';
    // Classificação por winrate
    dados.forEach(entry => {
      const hero = entry.hero;
      const win = (entry.win_rate * 100).toFixed(1);
      let tier = '';
      if (win >= 54) tier = 'tier-ss';
      else if (win >= 51) tier = 'tier-s';
      else tier = 'tier-a';
      const card = criarCardHeroi(hero, win);
      document.getElementById(tier).appendChild(card);
    });
  })
  .catch(() => {
    document.getElementById('tier-ss').innerHTML = '<p>Erro ao carregar dados da API.</p>';
  });