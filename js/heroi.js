function getParamNome() {
  const params = new URLSearchParams(window.location.search);
  return params.get('name');
}

function carregaDetalhes(nome) {
  document.getElementById('detalhes-heroi').innerHTML = '<p>Carregando...</p>';

  fetch(`https://mlbb-proxy.vercel.app/api/hero-detail/?name=${encodeURIComponent(nome)}`)
    .then(res => res.json())
    .then(json => {
      const d = json.data;
      document.getElementById('detalhes-heroi').innerHTML = `
        <h2>${d.name}</h2>
        <img src="${d.icon}" alt="${d.name}" style="width:110px; border-radius:15px;">
        <p><b>Função:</b> ${d.role}</p>
        <p><b>Lane:</b> ${d.lane}</p>
        <p><b>Dificuldade:</b> ${d.difficulty}</p>
        <p><b>Título:</b> ${d.title}</p>
        <p><b>Especialidade:</b> ${d.specialty}</p>
      `;
      carregaSkins(nome);
      carregaEquipamentos(nome);
    });
}

function carregaCombos(nome) {
  fetch(`https://mlbb-proxy.vercel.app/api/hero-combo/?name=${encodeURIComponent(nome)}`)
    .then(res => res.json())
    .then(json => {
      const combos = json.data || [];
      let html = '<h3>Combos</h3>';
      if (combos.length === 0) html += '<p>Nenhum combo registrado.</p>';
      else {
        html += '<ul>';
        combos.forEach(combo => {
          html += `<li>${combo.combo}</li>`;
        });
        html += '</ul>';
      }
      document.getElementById('combos-heroi').innerHTML = html;
    });
}

function carregaCounters(nome) {
  fetch(`https://mlbb-proxy.vercel.app/api/hero-counter/?name=${encodeURIComponent(nome)}`)
    .then(res => res.json())
    .then(json => {
      const counters = json.data || [];
      let html = '<h3>Counters</h3>';
      if (counters.length === 0) html += '<p>Nenhum counter registrado.</p>';
      else {
        html += '<ul>';
        counters.forEach(counter => {
          html += `<li>${counter.counter_name} – ${counter.desc}</li>`;
        });
        html += '</ul>';
      }
      document.getElementById('counters-heroi').innerHTML = html;
    });
}

function carregaSkins(nome) {
  fetch(`https://mlbb-proxy.vercel.app/api/hero-skin/?name=${encodeURIComponent(nome)}`)
    .then(res => res.json())
    .then(json => {
      const skins = json.data || [];
      let html = '<h3>Skins</h3>';
      if (skins.length === 0) html += '<p>Sem skins registradas.</p>';
      else {
        html += '<div style="display:flex; gap:1rem; flex-wrap:wrap">';
        skins.forEach(skin => {
          html += `<div><img src="${skin.icon}" alt="${skin.name}" style="width:60px; border-radius:10px;"><div>${skin.name}</div></div>`;
        });
        html += '</div>';
      }
      document.getElementById('skins-heroi').innerHTML = html;
    });
}

function carregaEquipamentos(nome) {
  fetch(`https://mlbb-stats.ridwaanhall.com/api/hero-equip/?name=${encodeURIComponent(nome)}`)
    .then(res => res.json())
    .then(json => {
      const equips = json.data || [];
      let html = '<h3>Equipamentos recomendados</h3>';
      if (equips.length === 0) html += '<p>Sem equipamentos registrados.</p>';
      else {
        html += '<div style="display:flex; gap:0.5rem; flex-wrap:wrap">';
        equips.forEach(equip => {
          html += `<div><img src="${equip.icon}" alt="${equip.name}" style="width:44px; border-radius:8px;"><div style="font-size:0.95em">${equip.name}</div></div>`;
        });
        html += '</div>';
      }
      document.getElementById('equipamentos-heroi').innerHTML = html;
    });
}

const nomeHeroi = getParamNome();
if (nomeHeroi) {
  carregaDetalhes(nomeHeroi);
  carregaCombos(nomeHeroi);
  carregaCounters(nomeHeroi);
}
