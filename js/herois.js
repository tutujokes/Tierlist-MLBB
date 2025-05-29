const API_URL = "https://mlbb-proxy.vercel.app/api/hero-list/";

function criarCardHeroi(hero) {
  const card = document.createElement('div');
  card.className = "card-hero";
  card.innerHTML = `
    <a href="heroi.html?name=${encodeURIComponent(hero.name)}">
      <img src="${hero.icon}" alt="${hero.name}">
      <div>${hero.name}</div>
    </a>
  `;
  return card;
}

fetch(API_URL)
  .then(res => res.json())
  .then(json => {
    const dados = json.data || [];
    dados.sort((a, b) => a.name.localeCompare(b.name, 'pt-BR'));
    const container = document.getElementById('lista-herois');
    dados.forEach(hero => {
      const card = criarCardHeroi(hero);
      container.appendChild(card);
    });
  })
  .catch(() => {
    document.getElementById('lista-herois').innerHTML = '<p>Erro ao carregar lista de heróis.</p>';
  });
