const API_URL = "https://mlbb-proxy.vercel.app/api/heroes?sort_field=win_rate&sort_order=desc&size=130";

function criarCardHeroi(hero, winRate) {
  const card = document.createElement('div');
  card.className = "card-hero";
  card.innerHTML = `
    <a href="heroi.html?name=${encodeURIComponent(hero.name)}">
      <img src="${hero.head}" alt="${hero.name}">
      <div>${hero.name}</div>
      <small>${winRate}% WR</small>
    </a>
  `;
  return card;
}

fetch(API_URL)
  .then(res => res.json())
  .then(json => {
    // Debug: veja no console a estrutura recebida
    // console.log("JSON recebido:", json);

    // Ajuste para records
    const records = (json.data && Array.isArray(json.data.records)) ? json.data.records : [];
    // Limpa containers
    document.getElementById('tier-ss').innerHTML = '';
    document.getElementById('tier-s').innerHTML = '';
    document.getElementById('tier-a').innerHTML = '';
    // Classificação por winrate
    records.forEach(entry => {
      const hero = entry?.data?.main_hero?.data;
      const win = (entry.main_hero_win_rate * 100).toFixed(1);
      if (!hero || !hero.name || !hero.head) return; // Pula se faltar campo

      let tier = '';
      if (win >= 54) tier = 'tier-ss';
      else if (win >= 51) tier = 'tier-s';
      else tier = 'tier-a';

      const card = criarCardHeroi(hero, win);
      const container = document.getElementById(tier);
      if (container) container.appendChild(card);
    });
  })
  .catch(() => {
    document.getElementById('tier-ss').innerHTML = '<p>Erro ao carregar dados da API.</p>';
    document.getElementById('tier-s').innerHTML = '';
    document.getElementById('tier-a').innerHTML = '';
  });
