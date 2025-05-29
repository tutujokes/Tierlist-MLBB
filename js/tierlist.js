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
    // Ajuste aqui para pegar os records
    const records = json.data && json.data.records ? json.data.records : [];
    // Limpa containers
    document.getElementById('tier-ss').innerHTML = '';
    document.getElementById('tier-s').innerHTML = '';
    document.getElementById('tier-a').innerHTML = '';
    // Classificação por winrate
    records.forEach(entry => {
      const hero = entry.data.main_hero.data;
      const win = (entry.main_hero_win_rate * 100).toFixed(1);
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
