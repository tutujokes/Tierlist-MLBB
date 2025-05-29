import { getHeroIdByName } from './getHeroIdByName.js';

function getParamNome() {
  const params = new URLSearchParams(window.location.search);
  return params.get('name');
}

const nomeHeroi = getParamNome();
if (nomeHeroi) {
  carregaDetalhes(nomeHeroi);
  carregaHistorico(nomeHeroi);
  carregaDetailStats(nomeHeroi);
  carregaCompatibilidade(nomeHeroi);
}

async function carregaDetalhes(nome) {
  document.getElementById('detalhes-heroi').innerHTML = '<p>Carregando...</p>';
  fetch(`https://mlbb-proxy.vercel.app/api/heroes?source=detail&name=${encodeURIComponent(nome)}`)
    .then(res => res.json())
    .then(json => {
      const record = json.data?.records?.[0];
      const d = record?.data?.hero?.data;
      if (!d) {
        document.getElementById('detalhes-heroi').innerHTML = '<p>Detalhes não encontrados.</p>';
        return;
      }
      document.getElementById('detalhes-heroi').innerHTML = `
        <h2>${d.name}</h2>
        <img src="${d.head}" alt="${d.name}" style="width:110px; border-radius:15px;">
        <p><b>ID:</b> ${d.heroid}</p>
        <p><b>Função:</b> ${d.role || 'N/A'}</p>
        <p><b>Lane:</b> ${d.lane || 'N/A'}</p>
        <p><b>Dificuldade:</b> ${d.difficulty || 'N/A'}</p>
        <p><b>Título:</b> ${d.title || 'N/A'}</p>
        <p><b>Especialidade:</b> ${d.specialty || 'N/A'}</p>
      `;
    })
    .catch(() => {
      document.getElementById('detalhes-heroi').innerHTML = '<p>Erro ao carregar detalhes.</p>';
    });
}

async function carregaHistorico(nome) {
  const heroId = await getHeroIdByName(nome);
  if (!heroId) {
    document.getElementById('historico-heroi').innerHTML = '<h3>Histórico</h3><p>Herói não encontrado.</p>';
    return;
  }
  fetch(`https://mlbb-proxy.vercel.app/api/heroes?source=rate&name=${encodeURIComponent(nome)}&days=30`)
    .then(res => res.json())
    .then(json => {
      const records = json.data?.records || [];
      if (!records.length || !records[0].data) {
        document.getElementById('historico-heroi').innerHTML = '<h3>Histórico</h3><p>Sem histórico disponível.</p>';
        return;
      }
      const dias = records[0].data;
      let html = `<h3>Histórico (últimos 30 dias)</h3>
      <table><tr>
        <th>Data</th><th>Winrate</th><th>Pickrate</th><th>Banrate</th>
      </tr>`;
      dias.forEach(dia => {
        html += `<tr>
          <td>${dia.date}</td>
          <td>${(dia.win_rate*100).toFixed(2)}%</td>
          <td>${(dia.app_rate*100).toFixed(2)}%</td>
          <td>${(dia.ban_rate*100).toFixed(2)}%</td>
        </tr>`;
      });
      html += '</table>';
      document.getElementById('historico-heroi').innerHTML = html;
    })
    .catch(() => {
      document.getElementById('historico-heroi').innerHTML = '<h3>Histórico</h3><p>Erro ao carregar histórico.</p>';
    });
}

async function carregaDetailStats(nome) {
  fetch(`https://mlbb-proxy.vercel.app/api/heroes?source=detail-stats&name=${encodeURIComponent(nome)}`)
    .then(res => res.json())
    .then(json => {
      const stats = json.data?.records?.[0]?.data || {};
      let html = `<h3>Desempenho Detalhado</h3>`;
      if (stats.positive_heroes && stats.positive_heroes.length > 0) {
        html += `<b>Melhores aliados:</b> ${stats.positive_heroes.map(h=>h.hero_name).join(', ')}<br>`;
      }
      if (stats.negative_heroes && stats.negative_heroes.length > 0) {
        html += `<b>Piores para jogar junto:</b> ${stats.negative_heroes.map(h=>h.hero_name).join(', ')}<br>`;
      }
      document.getElementById('sinergias-heroi').innerHTML = html;
    })
    .catch(() => {
      document.getElementById('sinergias-heroi').innerHTML = '<h3>Desempenho Detalhado</h3><p>Erro ao carregar dados.</p>';
    });
}

async function carregaCompatibilidade(nome) {
  fetch(`https://mlbb-proxy.vercel.app/api/heroes?source=compatibility&name=${encodeURIComponent(nome)}`)
    .then(res => res.json())
    .then(json => {
      const comp = json.data?.records?.[0]?.data || {};
      let html = `<h3>Compatibilidade</h3>`;
      if (comp.positive_heroes && comp.positive_heroes.length > 0) {
        html += `<b>Alta sinergia:</b> ${comp.positive_heroes.map(h=>h.hero_name).join(', ')}<br>`;
      }
      if (comp.negative_heroes && comp.negative_heroes.length > 0) {
        html += `<b>Pouca sinergia:</b> ${comp.negative_heroes.map(h=>h.hero_name).join(', ')}<br>`;
      }
      document.getElementById('compatibilidade-heroi').innerHTML = html;
    })
    .catch(() => {
      document.getElementById('compatibilidade-heroi').innerHTML = '<h3>Compatibilidade</h3><p>Erro ao carregar dados.</p>';
    });
}
