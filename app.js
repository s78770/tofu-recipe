// 두부 레시피 관리 — 순수 JS, 데이터는 localStorage에 저장
(function () {
  'use strict';

  const STORE_KEY = 'tofu-recipe.v1';
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

  const esc = (v) => String(v ?? '').replace(/[&<>"']/g, (c) => (
    { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]
  ));
  const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
  const fmt = (n, d = 2) => {
    if (n === null || n === undefined || n === '' || isNaN(n)) return '-';
    return Number(Number(n).toFixed(d)).toLocaleString('ko-KR');
  };

  // ---------- 저장소 ----------
  function defaults() {
    return (window.DEFAULT_RECIPES || []).map((r) => ({ ...structuredClone(r), id: r.id || uid(), builtin: true }));
  }

  // 표준 레시피는 항상 data/standard-recipes.js 최신본을 사용하고, 사용자 레시피만 저장본에서 가져온다
  function load() {
    let saved = null;
    try {
      const raw = localStorage.getItem(STORE_KEY);
      if (raw) saved = JSON.parse(raw);
    } catch (e) { /* 손상된 데이터는 무시하고 기본값 사용 */ }
    const own = (saved?.recipes || []).filter((r) => !r.builtin);
    return { recipes: [...defaults(), ...own], batches: saved?.batches || [], notes: saved?.notes || [] };
  }

  let state = load();
  const save = () => {
    try { localStorage.setItem(STORE_KEY, JSON.stringify(state)); }
    catch (e) { alert('저장 실패: 브라우저 저장소를 사용할 수 없습니다.'); }
  };

  let selectedId = state.recipes[0]?.id || null;
  const getRecipe = (id) => state.recipes.find((r) => r.id === id);

  // ---------- 탭 ----------
  $$('.tabs button').forEach((b) => b.addEventListener('click', () => showTab(b.dataset.tab)));
  function showTab(name) {
    $$('.tabs button').forEach((b) => b.classList.toggle('active', b.dataset.tab === name));
    $$('.tab').forEach((t) => t.classList.toggle('active', t.id === 'tab-' + name));
    if (name === 'recipes') { renderList(); renderDetail(); }
    if (name === 'calc') renderCalc();
    if (name === 'batches') renderBatches();
    if (name === 'notes') renderNotes();
    window.scrollTo(0, 0);
    location.hash = name;
  }

  // ---------- 레시피 목록 / 상세 ----------
  function renderList() {
    const ul = $('#recipe-list');
    if (!state.recipes.length) { ul.innerHTML = '<li class="muted">레시피가 없습니다</li>'; return; }
    const item = (r) => `
      <li data-id="${esc(r.id)}" class="${r.id === selectedId ? 'active' : ''}">
        ${esc(r.name)}<small>콩 ${fmt(r.soyKg, 1)}kg · ${esc(r.coagulant || '응고제 미지정')}${r.builtin ? '' : ' · v' + esc(r.version || 1)}</small>
      </li>`;
    const std = state.recipes.filter((r) => r.builtin);
    const own = state.recipes.filter((r) => !r.builtin);
    ul.innerHTML =
      `<li class="group">📘 표준 레시피</li>${std.map(item).join('') || '<li class="muted">없음</li>'}` +
      `<li class="group">🧪 연구 레시피</li>${own.map(item).join('') || '<li class="muted small-note">표준 레시피에서 "연구 시작"을 누르세요</li>'}`;
    $$('li[data-id]', ul).forEach((li) => li.addEventListener('click', () => {
      selectedId = li.dataset.id; renderList(); renderDetail();
    }));
  }

  function ingredientsTable(r, soyKg) {
    const k = soyKg / (r.soyKg || 1);
    if (!r.ingredients?.length) return '<p class="muted">재료 없음</p>';
    return `<div class="table-wrap"><table class="table">
      <thead><tr><th>재료</th><th>양</th><th>비고</th></tr></thead>
      <tbody>${r.ingredients.map((i) => `
        <tr><td>${esc(i.name)}</td>
        <td class="num">${fmt(Number(i.amount) * k)} ${esc(i.unit)}</td>
        <td class="note">${esc(i.note)}</td></tr>`).join('')}
      </tbody></table></div>`;
  }

  function coagTable(r, soyKg) {
    if (!r.coagulantOptions?.length) return '';
    return `<h3>응고제별 사용량 (콩 ${fmt(soyKg, 1)}kg)</h3>
      <div class="table-wrap"><table class="table">
      <thead><tr><th>응고제</th><th>사용량</th><th>희석</th><th>투입 온도</th></tr></thead>
      <tbody>${r.coagulantOptions.map((c) => `
        <tr><td>${esc(c.name)}</td>
        <td class="num">${fmt(Number(c.amountPerKgSoy) * soyKg, 1)} ${esc(c.unit)}</td>
        <td class="note">${esc(c.dilution)}</td>
        <td class="num">${esc(c.addTempC)}</td></tr>`).join('')}
      </tbody></table></div>`;
  }

  // 표준 목표값 (Brix, 응고 온도 등) — 연구 레시피는 기반 표준의 값과 비교
  function targetsBlock(r, base) {
    const t = r.targets || base?.targets;
    if (!t) return '';
    const items = [
      ['불림 시간', t.soakHours], ['두유 Brix', t.brix], ['응고 온도', t.coagTempC],
      ['응고 대기', t.restMinutes], ['압착', t.pressMinutes], ['수율비 (두부/콩)', t.yieldRatio],
    ].filter(([, v]) => v !== undefined && v !== null && v !== '');
    if (!items.length) return '';
    return `<div class="targets"><strong>📐 표준 목표값</strong>${base && !r.targets ? ` <span class="muted">(${esc(base.name)})</span>` : ''}
      <div class="stats">${items.map(([k, v]) => `<div class="stat"><b>${esc(v)}</b><span>${esc(k)}</span></div>`).join('')}</div></div>`;
  }

  function batchCompareTable(r, batches) {
    const sorted = [...batches].sort((a, b) => (b.date || '').localeCompare(a.date || ''));
    return `<div class="table-wrap"><table class="table">
      <thead><tr><th>날짜</th><th>실험 변수</th><th>불림</th><th>Brix</th><th>응고℃</th><th>응고제</th><th>수율비</th><th>평가</th><th></th></tr></thead>
      <tbody>${sorted.map((b) => `
        <tr class="${b.id === r.bestBatchId ? 'best-row' : ''}">
          <td class="num">${esc(b.date)}</td>
          <td>${esc(b.variable || '-')}</td>
          <td class="num">${b.soakHours != null ? fmt(b.soakHours, 1) + 'h' : '-'}</td>
          <td class="num">${fmt(b.brix, 1)}</td>
          <td class="num">${fmt(b.coagTemp, 0)}</td>
          <td>${esc(b.coagAmount || '-')}</td>
          <td class="num">${b.yieldKg && b.soyKg ? '×' + fmt(b.yieldKg / b.soyKg, 2) : '-'}</td>
          <td>${'★'.repeat(Number(b.rating) || 0)}</td>
          <td class="no-print"><button class="btn ${b.id === r.bestBatchId ? '' : 'ghost'} small" data-best="${esc(b.id)}">${b.id === r.bestBatchId ? '🏆 최적' : '최적 지정'}</button></td>
        </tr>`).join('')}</tbody></table></div>`;
  }

  function renderDetail() {
    const box = $('#recipe-detail');
    const r = getRecipe(selectedId);
    if (!r) { box.innerHTML = '<p class="empty">왼쪽에서 레시피를 선택하거나 새로 만드세요.</p>'; return; }
    const totalMin = (r.steps || []).reduce((s, x) => s + (Number(x.minutes) || 0), 0);
    const done = new Set(r._done || []);

    const base = r.baseId ? getRecipe(r.baseId) : null;
    const myBatches = state.batches.filter((b) => b.recipeId === r.id);
    const bestBatch = myBatches.find((b) => b.id === r.bestBatchId);
    const relNotes = state.notes.filter((n) => n.recipeId === r.id || myBatches.some((b) => b.id === n.batchId));

    box.innerHTML = `
      <div class="detail-head">
        <div>
          <h2>${esc(r.name)}</h2>
          <div class="badges">
            ${r.builtin ? '<span class="badge std">📘 표준 레시피 · 읽기 전용</span>' : `<span class="badge lab">🧪 연구 레시피 v${esc(r.version || 1)}</span>`}
            ${base ? `<span class="badge">기반: ${esc(base.name)}</span>` : ''}
            <span class="badge">콩 ${fmt(r.soyKg, 1)}kg</span>
            ${r.coagulant ? `<span class="badge">${esc(r.coagulant)}</span>` : ''}
            ${r.expectedYieldKg ? `<span class="badge">예상 수율 ${fmt(r.expectedYieldKg, 1)}kg</span>` : ''}
            ${totalMin ? `<span class="badge">총 ${Math.floor(totalMin / 60)}시간 ${totalMin % 60}분</span>` : ''}
          </div>
        </div>
        <div class="actions no-print">
          <button class="btn ghost small" id="d-print">인쇄</button>
          <button class="btn ${r.builtin ? '' : 'ghost'} small" id="d-dup">${r.builtin ? '🧪 이 표준으로 연구 시작' : '복제'}</button>
          ${r.builtin ? '' : '<button class="btn ghost small" id="d-edit">편집(개정)</button>'}
          <button class="btn danger small" id="d-del">삭제</button>
        </div>
      </div>

      ${targetsBlock(r, base)}

      ${bestBatch ? `<div class="best-card">
        <strong>🏆 검증된 최적 조건</strong> <span class="muted">(${esc(bestBatch.date)} 제조 기록)</span>
        <div class="badges" style="margin:6px 0 0">
          <span class="badge">콩 ${fmt(bestBatch.soyKg, 1)}kg</span>
          ${bestBatch.soakHours != null ? `<span class="badge">불림 ${fmt(bestBatch.soakHours, 1)}h / ${fmt(bestBatch.waterTemp, 1)}℃</span>` : ''}
          ${bestBatch.brix != null ? `<span class="badge">Brix ${fmt(bestBatch.brix, 1)}</span>` : ''}
          ${bestBatch.coagTemp != null ? `<span class="badge">응고 ${fmt(bestBatch.coagTemp, 0)}℃</span>` : ''}
          ${bestBatch.coagAmount ? `<span class="badge">${esc(bestBatch.coagAmount)}</span>` : ''}
          ${bestBatch.yieldKg ? `<span class="badge">수율 ${fmt(bestBatch.yieldKg, 1)}kg (×${fmt(bestBatch.yieldKg / bestBatch.soyKg, 2)})</span>` : ''}
        </div>
        ${bestBatch.notes ? `<div class="muted">${esc(bestBatch.notes)}</div>` : ''}
      </div>` : ''}

      <h3>재료</h3>
      ${ingredientsTable(r, r.soyKg)}
      ${coagTable(r, r.soyKg)}

      <h3>공정 <button class="btn ghost small no-print" id="d-reset-steps">체크 초기화</button></h3>
      <ol class="steps">${(r.steps || []).map((s, idx) => `
        <li class="${done.has(idx) ? 'done' : ''}">
          <label class="chk no-print"><input type="checkbox" data-step="${idx}" ${done.has(idx) ? 'checked' : ''}></label>
          <strong>${esc(s.title)}</strong>
          ${s.minutes ? `<span class="step-meta">⏱ ${esc(s.minutes)}분</span>` : ''}
          ${s.temp ? `<span class="step-meta">🌡 ${esc(s.temp)}</span>` : ''}
          <div>${esc(s.detail)}</div>
        </li>`).join('')}
      </ol>

      ${r.tips?.length ? `<h3>팁</h3><ul class="tips">${r.tips.map((t) => `<li>${esc(t)}</li>`).join('')}</ul>` : ''}

      <h3>💡 관련 노하우 (${relNotes.length}) <button class="btn ghost small no-print" data-note-from="recipe:${esc(r.id)}">+ 기록</button></h3>
      ${relNotes.length ? `<div class="note-list">${relNotes.map((n) => noteCard(n, true)).join('')}</div>` : '<p class="muted">이 레시피와 연결된 노하우가 없습니다.</p>'}

      ${r.troubleshooting?.length ? `<h3>문제 해결</h3><div class="trouble">${r.troubleshooting.map((t) => `
        <div><strong>${esc(t.problem)}</strong><br>원인: ${esc(t.cause)}<br>해결: ${esc(t.fix)}</div>`).join('')}</div>` : ''}

      ${r.sources?.length ? `<h3>참고 자료</h3><ul class="sources">${r.sources.map((u) => {
        const safe = /^https?:\/\//i.test(u);
        return `<li>${safe ? `<a href="${esc(u)}" target="_blank" rel="noopener">${esc(u)}</a>` : esc(u)}</li>`;
      }).join('')}</ul>` : ''}

      ${r.builtin ? '' : `
        <h3>연구 이력</h3>
        ${r.changelog?.length ? `<ul class="changelog">${[...r.changelog].reverse().map((c) => `
          <li><span class="num">v${esc(c.version)} · ${esc(c.date)}</span> ${esc(c.note)}</li>`).join('')}</ul>`
          : '<p class="muted">아직 개정 이력이 없습니다. 편집(개정) 시 변경 사유를 기록하세요.</p>'}
        <h3>이 레시피의 시험 제조 (${myBatches.length}회)</h3>
        ${myBatches.length ? batchCompareTable(r, myBatches) : '<p class="muted">제조 기록 탭에서 이 레시피로 시험 제조를 기록하세요.</p>'}
      `}
    `;

    $('#d-print').onclick = () => window.print();
    if ($('#d-edit')) $('#d-edit').onclick = () => openEditor(r);
    $('#d-dup').onclick = () => {
      const today = new Date().toISOString().slice(0, 10);
      const copy = {
        ...structuredClone(r), id: uid(), builtin: false, _done: [], bestBatchId: null,
        name: r.builtin ? '나의 최적 레시피 (' + r.name + ' 기반)' : r.name + ' (복사본)',
        baseId: r.builtin ? r.id : (r.baseId || r.id),
        version: 1,
        changelog: [{ version: 1, date: today, note: `"${r.name}"에서 시작` }],
      };
      state.recipes.push(copy); selectedId = copy.id; save(); refresh();
    };
    $$('[data-best]', box).forEach((btn) => btn.addEventListener('click', () => {
      r.bestBatchId = r.bestBatchId === btn.dataset.best ? null : btn.dataset.best;
      save(); renderDetail();
    }));
    $('#d-del').onclick = () => {
      if (r.builtin) { alert('표준 레시피는 삭제할 수 없습니다. data/standard-recipes.js 에서 관리합니다.'); return; }
      if (!confirm(`"${r.name}" 레시피를 삭제할까요?`)) return;
      state.recipes = state.recipes.filter((x) => x.id !== r.id);
      selectedId = state.recipes[0]?.id || null; save(); refresh();
    };
    $('#d-reset-steps').onclick = () => { r._done = []; save(); renderDetail(); };
    $$('input[data-step]', box).forEach((cb) => cb.addEventListener('change', () => {
      const i = Number(cb.dataset.step);
      const set = new Set(r._done || []);
      cb.checked ? set.add(i) : set.delete(i);
      r._done = [...set]; save(); renderDetail();
    }));
  }

  // ---------- 레시피 편집기 ----------
  const dlg = $('#recipe-dialog');
  const form = $('#recipe-form');
  let editingId = null;

  function ingRow(i = {}) {
    const d = document.createElement('div');
    d.className = 'row ing';
    d.innerHTML = `
      <input placeholder="재료명" data-k="name" value="${esc(i.name)}">
      <input type="number" step="any" placeholder="양" data-k="amount" value="${esc(i.amount)}">
      <input placeholder="단위" data-k="unit" value="${esc(i.unit || 'kg')}">
      <input placeholder="비고" data-k="note" value="${esc(i.note)}">
      <button type="button" title="삭제">✕</button>`;
    d.querySelector('button').onclick = () => d.remove();
    return d;
  }
  function stepRow(s = {}) {
    const d = document.createElement('div');
    d.className = 'row step';
    d.innerHTML = `
      <input placeholder="단계명" data-k="title" value="${esc(s.title)}">
      <input type="number" placeholder="분" data-k="minutes" value="${esc(s.minutes)}">
      <input placeholder="온도" data-k="temp" value="${esc(s.temp)}">
      <input placeholder="설명" data-k="detail" value="${esc(s.detail)}">
      <button type="button" title="삭제">✕</button>`;
    d.querySelector('button').onclick = () => d.remove();
    return d;
  }
  $$('[data-add]', form).forEach((b) => b.addEventListener('click', () => {
    b.dataset.add === 'ingredient' ? $('#ing-rows').append(ingRow()) : $('#step-rows').append(stepRow());
  }));

  function openEditor(r) {
    editingId = r?.id || null;
    $('#recipe-dialog-title').textContent = r ? '레시피 편집' : '새 레시피';
    form.name.value = r?.name || '';
    form.soyKg.value = r?.soyKg ?? 8;
    form.coagulant.value = r?.coagulant || '';
    form.expectedYieldKg.value = r?.expectedYieldKg ?? '';
    form.tips.value = (r?.tips || []).join('\n');
    form.changeNote.value = '';
    $('#change-note-wrap').hidden = !r;
    $('#ing-rows').replaceChildren(...(r?.ingredients?.length ? r.ingredients : [{}]).map(ingRow));
    $('#step-rows').replaceChildren(...(r?.steps?.length ? r.steps : [{}]).map(stepRow));
    dlg.showModal();
  }
  $('#btn-new-recipe').onclick = () => openEditor(null);
  $('#btn-cancel').onclick = () => dlg.close();

  const readRows = (sel) => $$(sel).map((row) => {
    const o = {};
    $$('input', row).forEach((inp) => { o[inp.dataset.k] = inp.type === 'number' ? (inp.value === '' ? null : Number(inp.value)) : inp.value.trim(); });
    return o;
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const prev = editingId ? getRecipe(editingId) : null;
    const data = {
      ...(prev || {}),
      id: editingId || uid(),
      name: form.name.value.trim(),
      soyKg: Number(form.soyKg.value) || 8,
      coagulant: form.coagulant.value.trim(),
      expectedYieldKg: form.expectedYieldKg.value === '' ? null : Number(form.expectedYieldKg.value),
      tips: form.tips.value.split('\n').map((s) => s.trim()).filter(Boolean),
      ingredients: readRows('#ing-rows .row').filter((i) => i.name),
      steps: readRows('#step-rows .row').filter((s) => s.title),
    };
    if (prev) {
      data.version = (prev.version || 1) + 1;
      data.changelog = [...(prev.changelog || []), {
        version: data.version,
        date: new Date().toISOString().slice(0, 10),
        note: form.changeNote.value.trim() || '내용 수정',
      }];
      Object.assign(prev, data);
    } else {
      data.version = 1;
      data.changelog = [{ version: 1, date: new Date().toISOString().slice(0, 10), note: '새로 작성' }];
      state.recipes.push(data);
    }
    selectedId = data.id; save(); dlg.close(); refresh();
  });

  // ---------- 계산기 ----------
  function fillRecipeSelect(sel) {
    const cur = sel.value;
    sel.innerHTML = state.recipes.map((r) => `<option value="${esc(r.id)}">${esc(r.name)}</option>`).join('');
    if (cur && getRecipe(cur)) sel.value = cur;
  }
  function renderCalc() {
    const sel = $('#calc-recipe');
    fillRecipeSelect(sel);
    const r = getRecipe(sel.value);
    const soy = Number($('#calc-soy').value) || 0;
    if (!r) { $('#calc-result').innerHTML = '<p class="empty">레시피가 없습니다.</p>'; return; }
    const k = soy / (r.soyKg || 1);
    $('#calc-result').innerHTML = `
      <div class="stats">
        <div class="stat"><b>${fmt(soy, 1)} kg</b><span>콩 (${fmt(soy / 8, 2)}말)</span></div>
        <div class="stat"><b>×${fmt(k, 3)}</b><span>기준 레시피 대비 배율</span></div>
        ${r.expectedYieldKg ? `<div class="stat"><b>${fmt(r.expectedYieldKg * k, 1)} kg</b><span>예상 두부 수율</span></div>` : ''}
      </div>
      <h3>재료</h3>${ingredientsTable(r, soy)}
      ${coagTable(r, soy)}
      <p class="muted">※ 가열·응고 대기 시간은 양에 정비례하지 않습니다. 솥 크기와 화력에 맞게 조정하세요. 비고란의 범위 수치는 기준 레시피(8kg) 값입니다.</p>`;
  }
  $('#calc-recipe').addEventListener('change', renderCalc);
  $('#calc-soy').addEventListener('input', renderCalc);
  $$('[data-soy]').forEach((b) => b.addEventListener('click', () => { $('#calc-soy').value = b.dataset.soy; renderCalc(); }));

  // ---------- 제조 기록 ----------
  const bform = $('#batch-form');
  bform.date.valueAsDate = new Date();

  function renderBatches() {
    const bsel = $('#batch-recipe');
    const first = !bsel.options.length;
    fillRecipeSelect(bsel);
    if (first && getRecipe(selectedId)) bsel.value = selectedId;
    const list = [...state.batches].sort((a, b) => (b.date || '').localeCompare(a.date || ''));
    const withYield = list.filter((b) => b.yieldKg && b.soyKg);
    const avgRatio = withYield.length ? withYield.reduce((s, b) => s + b.yieldKg / b.soyKg, 0) / withYield.length : null;
    const totalSoy = list.reduce((s, b) => s + (Number(b.soyKg) || 0), 0);
    const best = withYield.reduce((m, b) => (!m || b.yieldKg / b.soyKg > m.yieldKg / m.soyKg ? b : m), null);

    $('#batch-stats').innerHTML = `
      <div class="stat"><b>${list.length}회</b><span>총 제조</span></div>
      <div class="stat"><b>${fmt(totalSoy, 1)} kg</b><span>누적 콩 사용</span></div>
      <div class="stat"><b>${avgRatio ? '×' + fmt(avgRatio, 2) : '-'}</b><span>평균 수율비 (두부/콩)</span></div>
      <div class="stat"><b>${best ? '×' + fmt(best.yieldKg / best.soyKg, 2) : '-'}</b><span>최고 수율비 ${best ? '(' + esc(best.date) + ')' : ''}</span></div>`;

    $('#batch-list').innerHTML = list.length ? list.map((b) => `
      <tr>
        <td class="num">${esc(b.date)}</td>
        <td>${esc(getRecipe(b.recipeId)?.name || b.recipeName || '-')}</td>
        <td class="num">${fmt(b.soyKg, 1)}kg</td>
        <td class="num">${fmt(b.brix, 1)}</td>
        <td class="num">${fmt(b.coagTemp, 0)}</td>
        <td class="num">${b.yieldKg ? fmt(b.yieldKg, 1) + 'kg' : '-'}</td>
        <td class="num">${b.yieldKg && b.soyKg ? '×' + fmt(b.yieldKg / b.soyKg, 2) : '-'}</td>
        <td>${'★'.repeat(Number(b.rating) || 0)}</td>
        <td class="note">${b.variable ? `<b>${esc(b.variable)}</b> ` : ''}${esc(b.coagAmount ? '[' + b.coagAmount + '] ' : '')}${esc(b.notes)}</td>
        <td class="row-actions"><button class="btn ghost small" data-note-from="batch:${esc(b.id)}" title="노하우로 기록">💡 노하우</button> <button class="btn danger small" data-del="${esc(b.id)}">삭제</button></td>
      </tr>`).join('') : '<tr><td colspan="10" class="empty">아직 기록이 없습니다.</td></tr>';

    $$('[data-del]', $('#batch-list')).forEach((btn) => btn.addEventListener('click', () => {
      if (!confirm('이 기록을 삭제할까요?')) return;
      state.batches = state.batches.filter((b) => b.id !== btn.dataset.del); save(); renderBatches();
    }));
  }

  bform.addEventListener('submit', (e) => {
    e.preventDefault();
    const fd = new FormData(bform);
    const num = (k) => (fd.get(k) === '' ? null : Number(fd.get(k)));
    const recipeId = fd.get('recipeId');
    state.batches.push({
      id: uid(),
      date: fd.get('date'),
      recipeId,
      recipeName: getRecipe(recipeId)?.name || '',
      variable: fd.get('variable').trim(),
      soyKg: num('soyKg'), soakHours: num('soakHours'), waterTemp: num('waterTemp'),
      brix: num('brix'), coagTemp: num('coagTemp'), yieldKg: num('yieldKg'),
      coagAmount: fd.get('coagAmount').trim(), rating: num('rating'), notes: fd.get('notes').trim(),
    });
    save();
    bform.reset(); bform.date.valueAsDate = new Date(); bform.soyKg.value = 8;
    renderBatches();
  });

  // ---------- 백업 ----------
  $('#btn-export').onclick = () => {
    const blob = new Blob([JSON.stringify(state, null, 2)], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `tofu-recipes-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(a.href);
  };
  $('#file-import').addEventListener('change', async (e) => {
    const f = e.target.files[0];
    if (!f) return;
    try {
      const data = JSON.parse(await f.text());
      if (!Array.isArray(data.recipes) || !Array.isArray(data.batches)) throw new Error('형식 오류');
      if (!confirm('현재 데이터를 가져온 파일로 덮어쓸까요?')) return;
      state = { recipes: [...defaults(), ...data.recipes.filter((r) => !r.builtin)], batches: data.batches, notes: data.notes || [] };
      selectedId = state.recipes[0]?.id || null; save(); refresh();
      alert('가져오기 완료');
    } catch (err) { alert('가져오기 실패: ' + err.message); }
    e.target.value = '';
  });
  $('#btn-reset').onclick = () => {
    if (!confirm('연구 레시피를 모두 지우고 표준 레시피만 남깁니다. (제조 기록은 유지) 계속할까요?')) return;
    state.recipes = defaults(); selectedId = state.recipes[0]?.id || null; save(); refresh();
  };

  // ---------- 연구 노하우 ----------
  const STATUS = {
    hypothesis: '💭 가설', testing: '🔬 검증 중', verified: '✅ 검증됨', failed: '❌ 효과 없음',
  };
  const nform = $('#note-form');
  let editingNoteId = null;
  let noteCat = '전체';

  function batchLabel(b) {
    return `${b.date} · ${getRecipe(b.recipeId)?.name || b.recipeName || ''}${b.variable ? ' · ' + b.variable : ''}`;
  }

  function noteCard(n, compact = false) {
    const r = getRecipe(n.recipeId);
    const b = state.batches.find((x) => x.id === n.batchId);
    return `<div class="note-card status-${esc(n.status)}">
      <div class="note-top">
        <span class="badge">${esc(n.category)}</span>
        <span class="badge">${esc(STATUS[n.status] || '')}</span>
        <span class="muted num">${esc(n.date)}</span>
      </div>
      <strong class="note-title">${esc(n.title)}</strong>
      ${n.content ? `<div class="note-body">${esc(n.content)}</div>` : ''}
      <div class="note-meta">
        ${(n.tags || []).map((t) => `<span class="tag">#${esc(t)}</span>`).join('')}
        ${!compact && r ? `<span class="link" data-goto-recipe="${esc(r.id)}">📖 ${esc(r.name)}</span>` : ''}
        ${b ? `<span class="muted">📝 ${esc(batchLabel(b))}</span>` : ''}
      </div>
      ${compact ? '' : `<div class="actions end note-actions">
        <button class="btn ghost small" data-note-edit="${esc(n.id)}">수정</button>
        <button class="btn danger small" data-note-del="${esc(n.id)}">삭제</button>
      </div>`}
    </div>`;
  }

  function renderNotes() {
    const rs = $('#note-recipe');
    rs.innerHTML = '<option value="">(없음)</option>' + state.recipes.map((r) => `<option value="${esc(r.id)}">${esc(r.name)}</option>`).join('');
    const bs = $('#note-batch');
    bs.innerHTML = '<option value="">(없음)</option>' + [...state.batches].reverse().map((b) => `<option value="${esc(b.id)}">${esc(batchLabel(b))}</option>`).join('');

    const cats = ['전체', ...new Set(state.notes.map((n) => n.category))];
    if (!cats.includes(noteCat)) noteCat = '전체';
    $('#note-cats').innerHTML = cats.map((c) => `<button class="chip ${c === noteCat ? 'active' : ''}" data-cat="${esc(c)}">${esc(c)}${c === '전체' ? ` ${state.notes.length}` : ''}</button>`).join('');
    $$('[data-cat]').forEach((b) => b.onclick = () => { noteCat = b.dataset.cat; renderNotes(); });

    const q = $('#note-search').value.trim().toLowerCase();
    const list = state.notes
      .filter((n) => noteCat === '전체' || n.category === noteCat)
      .filter((n) => !q || [n.title, n.content, ...(n.tags || [])].join(' ').toLowerCase().includes(q))
      .sort((a, b) => (b.date || '').localeCompare(a.date || '') || (b.createdAt || 0) - (a.createdAt || 0));

    $('#note-list').innerHTML = list.length ? list.map((n) => noteCard(n)).join('')
      : `<p class="empty">${state.notes.length ? '검색 결과가 없습니다.' : '아직 기록한 노하우가 없습니다.'}</p>`;

    $$('[data-note-edit]').forEach((b) => b.onclick = () => openNoteForm(state.notes.find((n) => n.id === b.dataset.noteEdit)));
    $$('[data-note-del]').forEach((b) => b.onclick = () => {
      if (!confirm('이 노하우를 삭제할까요?')) return;
      state.notes = state.notes.filter((n) => n.id !== b.dataset.noteDel); save(); renderNotes();
    });
    $$('[data-goto-recipe]').forEach((el) => el.onclick = () => { selectedId = el.dataset.gotoRecipe; showTab('recipes'); });
  }

  function openNoteForm(n, preset = {}) {
    renderNotes();
    editingNoteId = n?.id || null;
    const v = { category: '응고', status: 'hypothesis', ...preset, ...(n || {}) };
    nform.title.value = v.title || '';
    nform.category.value = v.category;
    nform.status.value = v.status;
    nform.recipeId.value = v.recipeId || '';
    nform.batchId.value = v.batchId || '';
    nform.content.value = v.content || '';
    nform.tags.value = (v.tags || []).join(', ');
    nform.hidden = false;
    nform.scrollIntoView({ behavior: 'smooth', block: 'start' });
    nform.title.focus({ preventScroll: true });
  }

  $('#btn-new-note').onclick = () => openNoteForm(null);
  $('#btn-note-cancel').onclick = () => { nform.hidden = true; };
  $('#note-search').addEventListener('input', renderNotes);
  nform.addEventListener('submit', (e) => {
    e.preventDefault();
    const prev = state.notes.find((n) => n.id === editingNoteId);
    const data = {
      id: editingNoteId || uid(),
      date: prev?.date || new Date().toISOString().slice(0, 10),
      createdAt: prev?.createdAt || Date.now(),
      title: nform.title.value.trim(),
      category: nform.category.value,
      status: nform.status.value,
      recipeId: nform.recipeId.value || null,
      batchId: nform.batchId.value || null,
      content: nform.content.value.trim(),
      tags: nform.tags.value.split(',').map((t) => t.trim().replace(/^#/, '')).filter(Boolean),
    };
    if (prev) Object.assign(prev, data); else state.notes.push(data);
    save(); nform.hidden = true; renderNotes();
  });

  // 레시피 상세 · 제조 기록에서 바로 노하우 작성
  document.addEventListener('click', (e) => {
    const t = e.target.closest('[data-note-from]');
    if (!t) return;
    const [kind, id] = t.dataset.noteFrom.split(':');
    const preset = {};
    if (kind === 'recipe') preset.recipeId = id;
    if (kind === 'batch') {
      const b = state.batches.find((x) => x.id === id);
      Object.assign(preset, { batchId: id, recipeId: b?.recipeId, title: b?.variable ? b.variable + ' — ' : '', content: b?.notes || '' });
    }
    showTab('notes');
    openNoteForm(null, preset);
  });

  // ---------- 모바일: 표 셀에 열 제목을 붙여 카드형으로 표시 ----------
  function labelTables() {
    $$('table.table').forEach((t) => {
      const heads = $$('thead th', t).map((th) => th.textContent.trim());
      $$('tbody tr', t).forEach((tr) => $$('td', tr).forEach((td, i) => {
        if (heads[i] && td.colSpan === 1) td.dataset.label = heads[i];
      }));
    });
  }
  new MutationObserver(labelTables).observe($('main'), { childList: true, subtree: true });

  // 안드로이드 홈 화면 설치 / 오프라인 사용
  if ('serviceWorker' in navigator && location.protocol.startsWith('http')) {
    navigator.serviceWorker.register('sw.js').catch(() => {});
  }
  let installEvt = null;
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault(); installEvt = e; $('#btn-install').hidden = false;
  });
  $('#btn-install').onclick = async () => {
    if (!installEvt) return;
    installEvt.prompt();
    await installEvt.userChoice;
    installEvt = null; $('#btn-install').hidden = true;
  };
  window.addEventListener('appinstalled', () => { $('#btn-install').hidden = true; });
  // 안드로이드 뒤로가기: 이전 탭으로 이동
  window.addEventListener('hashchange', () => {
    const t = location.hash.slice(1);
    if (['recipes', 'calc', 'batches', 'notes', 'settings'].includes(t) && !$('#tab-' + t).classList.contains('active')) showTab(t);
  });

  // ---------- 시작 ----------
  function refresh() {
    renderList(); renderDetail();
    if ($('#tab-calc').classList.contains('active')) renderCalc();
    if ($('#tab-batches').classList.contains('active')) renderBatches();
  }
  refresh();
  const initial = location.hash.slice(1);
  if (['recipes', 'calc', 'batches', 'notes', 'settings'].includes(initial)) showTab(initial);
})();
