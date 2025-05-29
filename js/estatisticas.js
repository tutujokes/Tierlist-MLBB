async function carregarEstatisticas() {
  const tabela = document.getElementById('tabela-estatisticas').querySelector('tbody');
  tabela.innerHTML = '<tr><td colspan="5">Carregando...</td></tr>';

  try {
    const res = await fetch('https://mlbb-proxy.vercel.app/api/heroes?source=rank&days=7&rank=mythic&size=999');
    const json = await res.json();
    const records = json.data?.records || [];
    if (!records.length) {
      tabela.innerHTML = '<tr><td colspan="5">Nenhum dado encontrado.</td></tr>';
      return;
    }

    tabela.innerHTML = '';
    records.forEach(record => {
      const d = record.data;
      const nome = d.main_hero?.data?.name || '-';
      const winRate = isFinite(+d.main_hero_win_rate) ? ((+d.main_hero_win_rate) * 100).toFixed(2) + '%' : '-';
      const pickRate = isFinite(+d.main_hero_appearance_rate) ? ((+d.main_hero_appearance_rate) * 100).toFixed(2) + '%' : '-';
      const banRate = isFinite(+d.main_hero_ban_rate) ? ((+d.main_hero_ban_rate) * 100).toFixed(2) + '%' : '-';
      const matches = d.main_hero_matches !== undefined && d.main_hero_matches !== null ? d.main_hero_matches : '-';

      tabela.innerHTML += `
        <tr>
          <td>${nome}</td>
          <td>${winRate}</td>
          <td>${pickRate}</td>
          <td>${banRate}</td>
          <td>${matches}</td>
        </tr>
      `;
    });
  } catch (e) {
    tabela.innerHTML = '<tr><td colspan="5">Erro ao carregar estatísticas.</td></tr>';
  }
}

carregarEstatisticas();
