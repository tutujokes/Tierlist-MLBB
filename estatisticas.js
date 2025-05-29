const API_URL = "https://mlbb-stats.ridwaanhall.com/api/hero-rank/?sort_field=win_rate&sort_order=desc&rank=Mythic&days=7&size=130";
let estatisticasCache = [];
let ordemAtual = { key: 'win_rate', asc: false };

function renderTabela(dados) {
  const tbody = document.querySelector('#tabela-estatisticas tbody');
  tbody.innerHTML = '';
  dados.forEach(entry => {
    const hero = entry.hero;
    tbody.innerHTML += `
      <tr>
        <td><a href="heroi.html?name=${encodeURIComponent(hero.name)}">${hero.name}</a></td>
        <td>${(entry.win_rate * 100).toFixed(1)}%</td>
        <td>${(entry.pick_rate * 100).toFixed(1)}%</td>
        <td>${(entry.ban_rate * 100).toFixed(1)}%</td>
        <td>${entry.matches}</td>
      </tr>
    `;
  });
}

function ordenarTabela(key) {
  if (ordemAtual.key === key) ordemAtual.asc = !ordemAtual.asc;
  else ordemAtual = { key, asc: true };

  const sorted = [...estatisticasCache].sort((a, b) => {
    let valA = key === 'name' ? a.hero.name : a[key];
    let valB = key === 'name' ? b.hero.name : b[key];

    // String sort
    if (typeof valA === 'string') valA = valA.toLowerCase();
    if (typeof valB === 'string') valB = valB.toLowerCase();

    if (valA > valB) return ordemAtual.asc ? 1 : -1;
    if (valA < valB) return ordemAtual.asc ? -1 : 1;
    return 0;
  });

  // Atualiza headers
  document.querySelectorAll('#tabela-estatisticas th').forEach(th => {
    th.classList.remove('sorted-asc', 'sorted-desc');
    if (th.getAttribute('data-key') === key) {
      th.classList.add(ordemAtual.asc ? 'sorted-asc' : 'sorted-desc');
    }
  });

  renderTabela(sorted);
}

fetch(API_URL)
  .then(res => res.json())
  .then(json => {
    estatisticasCache = json.data || [];
    renderTabela(estatisticasCache);
  });

document.querySelectorAll('#tabela-estatisticas th').forEach(th => {
  th.addEventListener('click', () => {
    ordenarTabela(th.getAttribute('data-key'));
  });
});
