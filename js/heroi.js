import { getHeroIdByName } from './getHeroIdByName.js';

async function carregaDetalhes(nome) {
  document.getElementById('detalhes-heroi').innerHTML = '<p>Carregando...</p>';

  const heroId = await getHeroIdByName(nome);
  if (!heroId) {
    document.getElementById('detalhes-heroi').innerHTML = '<p>Herói não encontrado.</p>';
    return;
  }

  fetch(`https://mlbb-proxy.vercel.app/api/heroes?source=detail&name=${encodeURIComponent(nome)}`)
    .then(res => res.json())
    .then(json => {
      // O parser pode precisar mudar conforme a estrutura real do retorno!
      const record = json.data.records && json.data.records[0] ? json.data.records[0] : null;
      const d = record?.data?.hero?.data;
      if (!d) {
        document.getElementById('detalhes-heroi').innerHTML = '<p>Detalhes não encontrados.</p>';
        return;
      }
      document.getElementById('detalhes-heroi').innerHTML = `
        <h2>${d.name}</h2>
        <img src="${d.head}" alt="${d.name}" style="width:110px; border-radius:15px;">
        <p><b>ID:</b> ${d.heroid}</p>
        <!-- Continue exibindo os campos como desejar -->
      `;
      // Carregue outros dados (combos, counters, skins, equipamentos) usando o mesmo nome ou id conforme o caso
    });
}