/* Kernelton engine. Content lives in js/content/*.js as window.KT_WORLDS. */
(function () {
  'use strict';
  const WORLDS = (window.KT_WORLDS || []).sort((a, b) => a.id - b.id);
  const CH = { root: 'Mayor Root', tick: 'Tick', paige: 'Paige', archie: 'Archie', shelly: 'Shelly', gridlock: 'Gridlock', lockhart: 'Lockhart', belle: 'Belle', sentry: 'Sentry' };
  const ACTS = { 1: 'Act 1 · Arrival · Unit 1', 2: 'Act 2 · Growth · Unit 2', 6: 'Act 3 · Pressure · Units 3 and 4', 10: 'Act 4 · Night Shift · Unit 5' };
  const TESTS = [
    { id: 'insp1', after: 5, name: 'Town Inspection 1', mirrors: 'Theory Test 1 · Units 1 and 2', worlds: [1, 2, 3, 4, 5], n: 15 },
    { id: 'insp2', after: 9, name: 'Town Inspection 2', mirrors: 'Theory Test 2 · Units 3 and 4', worlds: [6, 7, 8, 9], n: 15 },
    { id: 'lab', after: 10, name: "Shelly's Exam", mirrors: 'Lab Test · practical concepts and commands', lab: true },
    { id: 'final', after: 10, name: 'Final Inspection', mirrors: 'Theory Test 3 · all five units', worlds: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10], n: 25, needs: ['insp1', 'insp2', 'lab'] }
  ];
  const KEY = 'kernelton-v1';
  let S = { stars: {}, tests: {}, set: { expert: false, story: true, music: false, sfx: true, revision: false }, placed: false };
  try { const o = JSON.parse(localStorage.getItem(KEY)); if (o) S = Object.assign(S, o, { set: Object.assign(S.set, o.set) }); } catch (e) { /* first run */ }
  const save = () => { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) { /* private mode */ } };

  let lens = false;
  const $ = (s, r) => (r || document).querySelector(s);
  const app = $('#app');
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const shuffle = a => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  // [[town words|real term]] is shown according to the language layer.
  function tx(s, layer) {
    // Both wordings are always in the page; CSS shows the right one, so the Lens works without redrawing.
    return String(s).replace(/\[\[(.+?)\|(.+?)\]\]/g, (_, a, b) => `<span class="tx L-${layer || 'bridge'}" title="${esc(b.replace(/<[^>]+>/g, ''))}"><span class="ta">${a}</span><span class="tp"> (</span><span class="tr">${b}</span><span class="tp">)</span></span>`);
  }

  /* ---------- sound ---------- */
  let AC = null, musicTimer = null;
  const ac = () => { if (!AC) { try { AC = new (window.AudioContext || window.webkitAudioContext)(); } catch (e) { return null; } } return AC; };
  function tone(f, t, d, type, vol) {
    const a = ac(); if (!a) return;
    const o = a.createOscillator(), g = a.createGain();
    o.type = type || 'sine'; o.frequency.value = f; g.gain.setValueAtTime(0, a.currentTime + t);
    g.gain.linearRampToValueAtTime(vol || 0.08, a.currentTime + t + 0.02); g.gain.exponentialRampToValueAtTime(0.0001, a.currentTime + t + d);
    o.connect(g).connect(a.destination); o.start(a.currentTime + t); o.stop(a.currentTime + t + d + 0.05);
  }
  function sfx(k) {
    if (!S.set.sfx) return;
    if (k === 'ok') { tone(660, 0, 0.12, 'triangle'); tone(880, 0.08, 0.16, 'triangle'); }
    else if (k === 'bad') tone(150, 0, 0.25, 'sawtooth', 0.05);
    else if (k === 'bell') { tone(1320, 0, 0.5, 'sine', 0.06); tone(1760, 0.02, 0.4, 'sine', 0.03); }
    else if (k === 'key') tone(520, 0, 0.05, 'square', 0.03);
    else if (k === 'win') [523, 659, 784, 1047].forEach((f, i) => tone(f, i * 0.11, 0.3, 'triangle'));
  }
  const CHORDS = [[220, 261.6, 329.6, 392], [174.6, 220, 261.6, 329.6], [130.8, 196, 246.9, 329.6], [196, 246.9, 293.7, 370]];
  function music(on) {
    clearInterval(musicTimer); musicTimer = null;
    if (!on || !ac()) return;
    let bar = 0;
    const play = () => {
      const c = CHORDS[bar++ % 4];
      c.forEach((f, i) => tone(f, i * 0.02, 2.6, 'triangle', 0.025));
      [0, 2, 1, 3, 2, 1].forEach((n, i) => tone(c[n] * 2, 0.45 * i, 0.35, 'sine', 0.02));
      for (let i = 0; i < 6; i++) tone(6000, 0.45 * i, 0.03, 'square', 0.004);
    };
    play(); musicTimer = setInterval(play, 2700);
  }

  /* ---------- progress helpers ---------- */
  const lvDone = id => S.stars[id] != null;
  const worldDone = w => w.levels.every(l => lvDone(l.id));
  const worldOpen = i => S.set.revision || i === 0 || worldDone(WORLDS[i - 1]);
  const testOpen = t => S.set.revision || (WORLDS.filter(w => w.id <= t.after).every(worldDone) && (t.needs || []).every(n => S.tests[n] != null));
  const starHtml = v => v == null ? '<span class="st muted">☆☆☆</span>' : v === 'silver' ? '<span class="st silver" title="Cleared by skipping">◆ silver</span>' : `<span class="st">${'★'.repeat(v)}${'☆'.repeat(3 - v)}</span>`;
  function hud(crumb) {
    $('#crumb').textContent = crumb || 'Kernelton';
    const n = Object.values(S.stars).reduce((a, v) => a + (v === 'silver' ? 0 : v), 0);
    $('#stars').textContent = '★ ' + n;
    $('#lensBtn').classList.toggle('on', lens || S.set.expert);
    document.body.classList.toggle('lens', lens || S.set.expert);
  }
  let redraw = () => {};
  function screen(crumb, html, handlers) {
    hud(crumb); app.innerHTML = html; app.onclick = null; window.scrollTo(0, 0);
    app.onclick = e => { const b = e.target.closest('[data-go]'); if (b && !b.disabled && handlers && handlers[b.dataset.go]) handlers[b.dataset.go](b); };
  }

  /* ---------- screens ---------- */
  function showTitle() {
    redraw = showTitle;
    const fresh = !S.placed && !Object.keys(S.stars).length;
    screen('Kernelton', `<div class="title">
      <h1>Kernelton</h1><p class="muted">Run the town. Learn the operating system. CIT3002.</p>
      <div class="castrow">${['root', 'tick', 'paige', 'archie', 'shelly', 'gridlock'].map(c => `<img src="assets/${c}.svg" alt="${CH[c]}">`).join('')}</div>
      <p>Every town service is an Operating Systems concept in disguise. Press <b>Lens</b> at any time to see the real term.</p>
      <div class="row">${fresh ? `<button class="btn" data-go="new">I am new to this</button><button class="btn alt" data-go="place">I know some already: placement test</button>` : `<button class="btn" data-go="map">Continue</button>`}</div>
    </div>`, {
      new: () => { S.placed = true; save(); startLevel(0, 0); },
      place: placement, map: showMap
    });
  }

  function showMap() {
    redraw = showMap;
    let html = '<h2>Town map</h2><p class="muted">One district per lecture week. Finish a district to open the next, or use Test out inside a district to skip it.</p>';
    WORLDS.forEach((w, i) => {
      if (ACTS[w.id]) html += `${i ? '</div>' : ''}<div class="act">${ACTS[w.id]}</div><div class="grid">`;
      const open = worldOpen(i), done = w.levels.filter(l => lvDone(l.id)).length;
      html += `<button class="wcard ${open ? '' : 'locked'} ${done === w.levels.length ? 'done' : ''}" data-go="w" data-i="${i}" ${open ? '' : 'disabled'}>
        <img src="assets/${w.guide}.svg" alt=""><span><span class="num">World ${w.id} · ${w.week}</span><b>${w.name}</b><span class="muted">${w.topic}</span>
        <span class="bar"><i style="width:${100 * done / w.levels.length}%"></i></span></span></button>`;
      TESTS.filter(t => t.after === w.id).forEach(t => {
        const o = testOpen(t), sc = S.tests[t.id];
        html += `<button class="wcard test ${o ? '' : 'locked'}" data-go="t" data-id="${t.id}" ${o ? '' : 'disabled'}>
          <img src="assets/${t.lab ? 'shelly' : t.id === 'final' ? 'gridlock' : 'root'}.svg" alt=""><span><span class="num">Mock test</span><b>${t.name}</b><span class="muted">${t.mirrors}</span>${sc != null ? `<br><b>Best: ${sc}%</b>` : ''}</span></button>`;
      });
    });
    screen('Town map', html + '</div>', { w: b => showWorld(+b.dataset.i), t: b => runTest(TESTS.find(t => t.id === b.dataset.id)) });
  }

  function showWorld(wi) {
    redraw = () => showWorld(wi);
    const w = WORLDS[wi];
    const tags = { t: '', p: '<span class="tag p">practical</span>', b: '<span class="tag b">boss</span>' };
    screen(`World ${w.id} · ${w.name}`, `<div class="panel whead"><img src="assets/${w.guide}.svg" alt="${CH[w.guide]}"><div>
        <span class="phase">${w.unit} · ${w.week}</span><h2>${w.name}</h2><p>${tx(w.intro, 'bridge')}</p>
        <button class="btn alt sm" data-go="out">Test out of this district</button></div></div>
      ${w.levels.map((l, i) => { const open = S.set.revision || i === 0 || lvDone(w.levels[i - 1].id) || lvDone(l.id);
        return `<button class="lv ${open ? '' : 'locked'}" data-go="lv" data-i="${i}" ${open ? '' : 'disabled'}><span class="id">${l.id}</span><span class="nm">${l.n}</span>${tags[l.k] || ''}${starHtml(S.stars[l.id])}</button>`; }).join('')}`,
      { lv: b => startLevel(wi, +b.dataset.i), out: () => testOut(wi) });
  }

  /* ---------- quiz (checkpoints, test out, placement, mock tests) ---------- */
  function runQuiz(title, qs, layer, cb, note) {
    let i = 0, right = 0; const missed = [];
    const show = () => {
      const q = qs[i], opts = shuffle(q.a.map((t, k) => ({ t, k })));
      screen(title, `<div class="phase">Question ${i + 1} of ${qs.length}${note ? ' · ' + note : ''}</div><div class="panel"><p class="say">${tx(q.q, layer)}</p>
        <div class="opts">${opts.map(o => `<button class="opt" data-go="a" data-k="${o.k}">${tx(o.t, layer)}</button>`).join('')}</div><p class="why"></p></div>`, {
        a: b => {
          const ok = +b.dataset.k === q.c;
          app.querySelectorAll('.opt').forEach(x => { x.disabled = true; if (+x.dataset.k === q.c) x.classList.add('ok'); });
          if (ok) { right++; sfx('ok'); } else { b.classList.add('bad'); missed.push(q); sfx('bad'); }
          $('.why', app).innerHTML = `${ok ? 'Correct.' : 'Not quite.'} ${tx(q.w || '', layer)} <button class="btn sm" data-go="n">${i + 1 < qs.length ? 'Next' : 'Finish'}</button>`;
        },
        n: () => { if (++i < qs.length) show(); else cb(right, missed); }
      });
    };
    redraw = show; show();
  }
  const pool = ids => WORLDS.filter(w => ids.includes(w.id)).flatMap(w => w.levels.flatMap(l => l.qz.map(q => Object.assign({ lv: l.id, w: w.id }, q))));
  const layerOf = () => 'technical';

  function testOut(wi) {
    const w = WORLDS[wi], qs = shuffle(pool([w.id])).slice(0, 5);
    runQuiz(`Test out · ${w.name}`, qs, 'technical', (right, missed) => {
      const pass = right >= 4;
      if (pass) { w.levels.forEach(l => { if (!lvDone(l.id)) S.stars[l.id] = 'silver'; }); save(); sfx('win'); }
      const gaps = [...new Set(missed.map(q => q.lv))];
      screen(w.name, `<div class="panel"><h2>${pass ? 'District cleared' : 'Not yet'}</h2><p>You scored ${right} of 5. ${pass ? 'Every level here now has a silver badge. Play them any time for stars.' : 'You need 4 of 5 to test out.'}</p>
        ${gaps.length ? `<p>Levels worth playing: <b>${gaps.join(', ')}</b></p>` : ''}<div class="row"><button class="btn" data-go="w">Back to district</button><button class="btn alt" data-go="m">Town map</button></div></div>`,
        { w: () => showWorld(wi), m: showMap });
    }, 'need 4 of 5');
  }

  function placement() {
    const qs = WORLDS.flatMap(w => shuffle(pool([w.id])).slice(0, w.id <= 5 ? 2 : 1));
    runQuiz('Placement test', qs, 'technical', (right, missed) => {
      const firstGap = missed.length ? Math.min(...missed.map(q => q.w)) : WORLDS.length + 1;
      WORLDS.filter(w => w.id < firstGap).forEach(w => w.levels.forEach(l => { if (!lvDone(l.id)) S.stars[l.id] = 'silver'; }));
      S.placed = true; save();
      const start = WORLDS.find(w => w.id === firstGap);
      screen('Placement test', `<div class="panel"><h2>${right} of ${qs.length}</h2><p>${start ? `You start at <b>World ${start.id}: ${start.name}</b>. Earlier districts have silver badges and stay open for revision.` : 'You cleared every district. Head for the mock tests.'}</p>
        <button class="btn" data-go="m">Town map</button></div>`, { m: showMap });
    });
  }

  function runTest(t) {
    const finish = (score, total, missed) => {
      const pct = Math.round(100 * score / total);
      S.tests[t.id] = Math.max(S.tests[t.id] || 0, pct); save(); sfx(pct >= 50 ? 'win' : 'bad');
      const by = {}; missed.forEach(q => { (by[q.w] = by[q.w] || new Set()).add(q.lv); });
      screen(t.name, `<div class="panel"><h2>${t.name}: ${pct}%</h2><p>${score} of ${total}. ${pct >= 80 ? 'The inspector is impressed.' : pct >= 50 ? 'A pass, with gaps to close.' : 'Gridlock is pleased. Revise and try again.'}</p>
        ${Object.keys(by).length ? `<h3>Revise these levels</h3><ul>${Object.keys(by).map(w => `<li>World ${w}: ${[...by[w]].join(', ')}</li>`).join('')}</ul>` : ''}
        <button class="btn" data-go="m">Town map</button></div>`, { m: showMap });
    };
    if (!t.lab) { const qs = shuffle(pool(t.worlds)).slice(0, t.n); return runQuiz(t.name, qs, 'technical', (r, m) => finish(r, qs.length, m), 'no hints'); }
    const prac = WORLDS.flatMap(w => w.levels.filter(l => l.k === 'p').map(l => ({ l, w })));
    const tasks = shuffle(prac.flatMap(x => [].concat(x.l.pz).filter(p => p.type === 'term').flatMap(p => p.tasks.map(tk => Object.assign({ lv: x.l.id, w: x.w.id }, tk))))).slice(0, 8);
    const qs = shuffle(prac.flatMap(x => x.l.qz.map(q => Object.assign({ lv: x.l.id, w: x.w.id }, q)))).slice(0, 6);
    let pts = 0; const missed = [];
    screen(t.name, `<div class="phase">Part 1 of 2 · type the commands · two attempts each · no hints</div><div id="pz"></div><div class="fb"></div>`);
    PZ.term($('#pz'), { tasks }, { layer: 'technical', exam: true, miss: () => sfx('bad'), point: (ok, tk) => { if (ok) pts++; else missed.push(tk); },
      done: () => runQuiz(t.name, qs, 'technical', (r, m) => finish(pts + r, tasks.length + qs.length, missed.concat(m)), 'Part 2 of 2') });
  }

  /* ---------- level flow ---------- */
  let run = null;
  function startLevel(wi, li) {
    const w = WORLDS[wi], lv = w.levels[li];
    run = { wi, li, w, lv, mistakes: 0, hints: 0, skipped: false, stage: 0 };
    if (S.set.story && lv.brief && lv.brief.length) brief(0); else puzzle();
  }
  const crumb = () => `${run.lv.id} · ${run.lv.n}`;
  function brief(i) {
    redraw = () => brief(i);
    const { lv, w } = run, line = lv.brief[i], who = Array.isArray(line) ? line[0] : w.guide, text = Array.isArray(line) ? line[1] : line;
    if (who === 'belle' && i === 0) sfx('bell');
    screen(crumb(), `<div class="phase">Briefing · ${i + 1} of ${lv.brief.length}</div><div class="dlg"><img src="assets/${who}.svg" alt=""><div class="bub"><div class="who">${CH[who]}</div><p>${tx(text, lv.L)}</p></div></div>
      <div class="row end" style="margin-top:14px"><button class="btn alt sm" data-go="know">I know this: go to the checkpoint</button><button class="btn alt sm" data-go="skip">Skip story</button><button class="btn" data-go="next" id="adv">${i + 1 < lv.brief.length ? 'Next' : 'Start'}</button></div>`,
      { next: () => (i + 1 < lv.brief.length ? brief(i + 1) : puzzle()), skip: puzzle, know: () => { run.skipped = true; checkpoint(); } });
  }

  function puzzle() {
    const { lv } = run, list = [].concat(lv.pz), p = list[run.stage], boss = lv.k === 'b';
    redraw = puzzle;
    screen(crumb(), `<div class="phase">${boss ? 'Boss' : 'Puzzle'}${list.length > 1 ? ` · part ${run.stage + 1} of ${list.length}` : ''}</div>
      ${boss ? `<div class="grid-meter"><img id="gl" src="assets/gridlock.svg" alt="Gridlock"><span id="glt"></span></div>` : ''}
      <div class="panel"><p class="say">${tx(p.say || '', lv.L)}</p><div id="pz"></div><div class="fb"></div></div>
      <div class="row end">${boss ? '' : '<button class="btn alt sm" data-go="hint">Hint</button>'}<button class="btn alt sm" data-go="know">I know this: go to the checkpoint</button><button class="btn" data-go="cont" id="cont" hidden>Continue</button></div>`, {
      hint: () => { run.hints++; const h = (api && api.hint && api.hint()) || p.hint || 'Read the prompt again, one piece at a time.'; fb(tx('Hint: ' + h, lv.L), ''); },
      know: () => { run.skipped = true; checkpoint(); },
      cont: () => { if (++run.stage < list.length) puzzle(); else { run.stage = 0; reveal(); } }
    });
    const fb = (html, cls) => { const f = $('.fb', app); f.className = 'fb ' + (cls || ''); f.innerHTML = html; };
    const meter = () => { if (!boss) return; const left = 5 - run.bossMiss; $('#glt').textContent = `Gridlock grows with every mistake. ${left} left.`; $('#gl').style.transform = `scale(${1 + run.bossMiss * 0.22})`; };
    if (boss && run.stage === 0 && run.bossMiss == null) run.bossMiss = 0;
    meter();
    const api = PZ[p.type]($('#pz'), p, {
      layer: lv.L,
      miss: msg => {
        run.mistakes++; sfx('bad'); fb(msg || 'Not quite. Try again.', 'bad');
        const el = $('#pz'); el.classList.remove('shake'); void el.offsetWidth; el.classList.add('shake');
        if (boss && ++run.bossMiss >= 5) {
          screen(crumb(), `<div class="panel"><h2>Gridlock has the town</h2><p>Five mistakes and nothing moves any more. Take a breath and try the boss again.</p><button class="btn" data-go="r">Try again</button> <button class="btn alt" data-go="w">Back to district</button></div>`,
            { r: () => startLevel(run.wi, run.li), w: () => showWorld(run.wi) });
        } else meter();
      },
      done: html => { sfx('ok'); fb(html || 'Solved.', 'ok'); $('#cont').hidden = false; $('#cont').focus(); }
    });
  }

  function reveal() {
    const { lv } = run; redraw = reveal;
    if (!lv.rv || !lv.rv.length) return checkpoint();
    screen(crumb(), `<div class="phase">Reveal · the real terms</div><div class="rv">${lv.rv.map(r => `<div class="panel"><div class="t">${r[0]}</div><div class="r">${r[1]}</div><div>${r[2]}</div></div>`).join('')}</div>
      <div class="row end" style="margin-top:14px"><button class="btn" data-go="n">To the checkpoint</button></div>`, { n: checkpoint });
  }

  function checkpoint() {
    const { lv } = run;
    runQuiz(crumb(), shuffle(lv.qz).slice(0, 3), lv.k === 'b' || lv.k === 'p' ? 'technical' : lv.L === 'layman' ? 'bridge' : 'technical', right => {
      if (right < 2) return screen(crumb(), `<div class="panel"><h2>Checkpoint not passed</h2><p>${right} of 3. You need 2. ${run.skipped ? 'Try the puzzle first, it teaches exactly this.' : 'Replay the puzzle with a hint, then try again.'}</p>
        <div class="row"><button class="btn" data-go="p">Play the puzzle</button><button class="btn alt" data-go="q">Retry the checkpoint</button></div></div>`,
        { p: () => { const s = run.skipped; startLevel(run.wi, run.li); if (!s) run.hints = 1; }, q: checkpoint });
      reward(right);
    }, 'checkpoint · need 2 of 3');
  }

  function reward(right) {
    const { lv, w, wi, li } = run;
    let v = run.skipped ? 'silver' : 1 + (run.mistakes <= 1 && right === 3 ? 1 : 0) + (run.hints === 0 ? 1 : 0);
    const old = S.stars[lv.id];
    if (old == null || old === 'silver' || (v !== 'silver' && v > old)) S.stars[lv.id] = (v === 'silver' && old != null) ? old : v;
    save(); sfx('win');
    const next = w.levels[li + 1], last = !next, nw = WORLDS[wi + 1];
    screen(crumb(), `<div class="panel"><div class="bigstars ${v === 'silver' ? 'silver' : ''}">${v === 'silver' ? '◆' : '★'.repeat(v) + '☆'.repeat(3 - v)}</div>
      <h2 style="text-align:center">${v === 'silver' ? 'Silver badge' : ['', 'Done', 'Well run', 'Perfectly run'][v]}</h2>
      ${v === 'silver' ? '<p>Cleared by skipping the puzzle. Play it in full to earn stars.</p>' : `<p class="muted" style="text-align:center">Stars: finished${run.mistakes <= 1 && right === 3 ? ' · efficient' : ''}${run.hints === 0 ? ' · no hints' : ''}. Mistakes: ${run.mistakes}. Hints: ${run.hints}.</p>`}
      ${last ? `<p><b>${w.name} is rebuilt.</b> ${w.outro || ''}</p>` : ''}
      <div class="row end">${next ? `<button class="btn" data-go="n">Next level</button>` : nw ? `<button class="btn" data-go="m">Town map</button>` : `<button class="btn" data-go="m">Town map</button>`}<button class="btn alt" data-go="w">District</button><button class="btn alt" data-go="r">Replay</button></div></div>`,
      { n: () => startLevel(wi, li + 1), m: showMap, w: () => showWorld(wi), r: () => startLevel(wi, li) });
  }

  /* ---------- simulators shared by puzzles ---------- */
  function simSched(p) {
    const P = p.procs.map((x, i) => Object.assign({}, x, { i, rem: x.b, fin: 0 }));
    let t = 0; const segs = [], q = [], seen = new Set();
    const push = (id, s, e) => { const l = segs[segs.length - 1]; if (l && l.id === id && l.e === s) l.e = e; else segs.push({ id, s, e }); };
    const left = () => P.filter(x => x.rem > 0);
    if (p.algo === 'rr') {
      const adm = () => P.filter(x => x.a <= t && !seen.has(x.i)).sort((a, b) => a.a - b.a || a.i - b.i).forEach(x => { seen.add(x.i); q.push(x); });
      adm();
      while (left().length) {
        if (!q.length) { t = Math.min(...left().filter(x => !seen.has(x.i)).map(x => x.a)); adm(); continue; }
        const x = q.shift(), d = Math.min(p.q, x.rem); push(x.id, t, t + d); t += d; x.rem -= d; adm(); if (x.rem > 0) q.push(x); else x.fin = t;
      }
    } else {
      const key = { fcfs: x => x.a, sjf: x => x.b, srtf: x => x.rem, prio: x => x.p, pprio: x => x.p }[p.algo];
      while (left().length) {
        const r = left().filter(x => x.a <= t);
        if (!r.length) { t = Math.min(...left().map(x => x.a)); continue; }
        r.sort((a, b) => key(a) - key(b) || a.a - b.a || a.i - b.i);
        const x = r[0], d = (p.algo === 'srtf' || p.algo === 'pprio') ? 1 : x.rem;
        push(x.id, t, t + d); t += d; x.rem -= d; if (!x.rem) x.fin = t;
      }
    }
    return { segs, P };
  }
  function fitIdx(algo, holes, r, last) {
    const ok = holes.map((h, i) => ({ h, i })).filter(o => o.h >= r);
    if (!ok.length) return -1;
    if (algo === 'first') return ok[0].i;
    if (algo === 'best') return ok.sort((a, b) => a.h - b.h || a.i - b.i)[0].i;
    if (algo === 'worst') return ok.sort((a, b) => b.h - a.h || a.i - b.i)[0].i;
    return (ok.find(o => o.i >= last) || ok[0]).i;
  }
  function diskPlan(p) {
    const up = p.reqs.filter(r => r >= p.head).sort((a, b) => a - b), dn = p.reqs.filter(r => r < p.head).sort((a, b) => b - a);
    const max = p.max || 199; let order, path;
    if (p.algo === 'fcfs') order = p.reqs.slice();
    else if (p.algo === 'sstf') { order = []; let h = p.head; const rest = p.reqs.slice(); while (rest.length) { rest.sort((a, b) => Math.abs(a - h) - Math.abs(b - h) || a - b); h = rest.shift(); order.push(h); } }
    else if (p.algo === 'scan' || p.algo === 'look') order = up.concat(dn);
    else order = up.concat(dn.slice().reverse());
    path = [p.head].concat(order);
    if (p.algo === 'scan' && dn.length) path = [p.head].concat(up, [max], dn);
    if (p.algo === 'cscan' && dn.length) path = [p.head].concat(up, [max, 0], dn.slice().reverse());
    let total = 0; for (let i = 1; i < path.length; i++) total += Math.abs(path[i] - path[i - 1]);
    return { order, total, path };
  }
  window.KT_SIM = { simSched, fitIdx, diskPlan };

  /* ---------- puzzle types ---------- */
  const PZ = {};
  PZ.match = (el, p, c) => {
    const R = shuffle(p.pairs.map((x, i) => ({ t: x[1], i }))); let sel = null, left = p.pairs.length;
    el.innerHTML = `<div class="cols"><div class="col">${p.pairs.map((x, i) => `<button class="chip" data-l="${i}">${tx(x[0], c.layer)}</button>`).join('')}</div><div class="col">${R.map(o => `<button class="chip alt" data-r="${o.i}">${tx(o.t, c.layer)}</button>`).join('')}</div></div>`;
    el.onclick = e => {
      const b = e.target.closest('button'); if (!b || b.disabled) return;
      if (b.dataset.l != null) { el.querySelectorAll('[data-l]').forEach(x => x.classList.remove('sel')); b.classList.add('sel'); sel = b; }
      else if (b.dataset.r != null && sel) {
        if (b.dataset.r === sel.dataset.l) { b.disabled = sel.disabled = true; b.classList.add('ok'); sel.classList.add('ok'); sel.classList.remove('sel'); sel = null; sfx('key'); if (--left === 0) c.done(); }
        else c.miss('Not a match. Try another.');
      }
    };
  };
  PZ.order = (el, p, c) => {
    const items = shuffle(p.items.map((t, i) => ({ t, i }))); let n = 0;
    el.innerHTML = `<ol class="seq"></ol><div class="pool">${items.map(o => `<button class="chip" data-i="${o.i}">${tx(o.t, c.layer)}</button>`).join('')}</div>`;
    el.onclick = e => {
      const b = e.target.closest('button[data-i]'); if (!b || b.disabled) return;
      if (+b.dataset.i === n) { b.disabled = true; $('.seq', el).insertAdjacentHTML('beforeend', `<li>${b.innerHTML}</li>`); n++; sfx('key'); if (n === p.items.length) c.done(); }
      else c.miss('That one does not come next.');
    };
  };
  PZ.pick = (el, p, c) => {
    let i = 0;
    const show = () => { const s = p.steps[i], opts = shuffle(s.o.map((t, k) => ({ t, k })));
      el.innerHTML = `${p.steps.length > 1 ? `<p class="count">Step ${i + 1} of ${p.steps.length}</p>` : ''}<p class="scn">${tx(s.t, c.layer)}</p><div class="opts">${opts.map(o => `<button class="opt" data-k="${o.k}">${tx(o.t, c.layer)}</button>`).join('')}</div><p class="why"></p>`; };
    show();
    el.onclick = e => {
      const b = e.target.closest('button'); if (!b || b.disabled) return;
      if (b.dataset.k != null) {
        if (+b.dataset.k === p.steps[i].c) {
          el.querySelectorAll('.opt').forEach(x => { x.disabled = true; }); b.classList.add('ok'); sfx('key');
          if (i + 1 < p.steps.length) $('.why', el).innerHTML = tx(p.steps[i].w || 'Correct.', c.layer) + ' <button class="btn sm" data-next="1">Next</button>';
          else c.done(tx(p.steps[i].w || 'Solved.', c.layer));
        } else { b.disabled = true; b.classList.add('bad'); c.miss('Not that one.'); }
      } else if (b.dataset.next) { i++; show(); }
    };
  };
  PZ.sort = (el, p, c) => {
    const items = shuffle(p.items); let i = 0;
    const show = () => { el.innerHTML = `<p class="count">${i + 1} of ${items.length}</p><div class="card big">${tx(items[i][0], c.layer)}</div><div class="opts row" style="flex-wrap:wrap">${p.bins.map((b, k) => `<button class="opt" data-k="${k}">${tx(b, c.layer)}</button>`).join('')}</div>`; };
    show();
    el.onclick = e => {
      const b = e.target.closest('button[data-k]'); if (!b) return;
      if (+b.dataset.k === items[i][1]) { sfx('key'); if (++i < items.length) show(); else { el.querySelectorAll('button').forEach(x => { x.disabled = true; }); c.done(); } }
      else { b.classList.add('bad'); c.miss('That belongs in a different group.'); }
    };
  };
  PZ.calc = (el, p, c) => {
    el.innerHTML = (p.table ? `<pre class="tbl">${esc(p.table)}</pre>` : '') + p.fields.map((f, i) => `<label class="fld"><span>${tx(f.l, c.layer)}</span><input inputmode="decimal" data-i="${i}"></label>`).join('') + '<button class="btn" data-check="1">Check</button>';
    el.onclick = e => {
      if (!e.target.closest('[data-check]')) return; let bad = 0;
      el.querySelectorAll('input').forEach(inp => { const f = p.fields[+inp.dataset.i], v = parseFloat(inp.value), ok = !isNaN(v) && Math.abs(v - f.a) <= (f.tol || 0.011); inp.classList.toggle('ok', ok); inp.classList.toggle('bad', !ok); if (!ok) bad++; });
      if (bad) c.miss(`${bad} answer${bad > 1 ? 's are' : ' is'} off. Check the red box${bad > 1 ? 'es' : ''}.`);
      else { el.querySelectorAll('input,button').forEach(x => { x.disabled = true; }); c.done(p.after ? tx(p.after, c.layer) : ''); }
    };
  };
  PZ.sched = (el, p, c) => {
    const { segs, P } = simSched(p); let k = 0; const total = segs[segs.length - 1].e;
    const hasP = p.procs.some(x => x.p != null);
    const draw = () => {
      el.innerHTML = `<table class="pt"><tr><th>${tx('[[Resident|Process]]', c.layer)}</th><th>${tx('[[Arrives|Arrival time]]', c.layer)}</th><th>${tx('[[Job length|Burst time]]', c.layer)}</th>${hasP ? `<th>${tx('[[Urgency|Priority]]', c.layer)} (1 is highest)</th>` : ''}</tr>
        ${p.procs.map(x => `<tr><td><b>${x.id}</b></td><td>${x.a}</td><td>${x.b}</td>${hasP ? `<td>${x.p}</td>` : ''}</tr>`).join('')}</table>
        <div class="gantt">${segs.slice(0, k).map(s => `<div style="flex:${s.e - s.s}">${s.id}</div>`).join('')}${k < segs.length ? `<span style="flex:${total - (k ? segs[k - 1].e : 0)}"></span>` : ''}</div>
        <div class="ticks">time: 0${segs.slice(0, k).map(s => ' → ' + s.e).join('')}</div>
        ${k < segs.length ? `<p>${tx('Time is ' + (segs[k].s) + '. Who uses [[the workshop|the CPU]] next?', c.layer)}</p><div class="pool">${p.procs.map(x => `<button class="chip" data-id="${x.id}">${x.id}</button>`).join('')}</div>` : ''}`;
    };
    draw();
    el.onclick = e => {
      const b = e.target.closest('button[data-id]'); if (!b) return;
      if (b.dataset.id === segs[k].id) {
        k++; sfx('key'); draw();
        if (k === segs.length) { const w = P.map(x => x.fin - x.a - x.b), avg = w.reduce((a, v) => a + v, 0) / w.length, ta = P.reduce((a, x) => a + x.fin - x.a, 0) / P.length;
          c.done(tx(`[[Waiting|Waiting time]]: ${P.map((x, i) => `${x.id} ${w[i]}`).join(', ')}. Average ${avg.toFixed(2)}. Average [[time from arrival to finish|turnaround time]] ${ta.toFixed(2)}.`, c.layer)); }
      } else c.miss(p.algo === 'rr' ? 'Not that one. Who is at the front of the line now?' : 'Not that one. Check who has arrived and apply the rule.');
    };
  };
  PZ.fit = (el, p, c) => {
    const holes = p.holes.slice(); let i = 0, last = 0, waiting = 0;
    const draw = () => {
      el.innerHTML = `<div class="holes">${holes.map((h, k) => `<button class="hole" data-k="${k}" style="flex:${Math.max(h, 40)}">${h}K<small>free</small></button>`).join('')}</div>` +
        (i < p.reqs.length ? `<div class="card big">${tx(`Next [[group|process]] needs ${p.reqs[i]}K (${i + 1} of ${p.reqs.length})`, c.layer)}</div><button class="btn alt sm" data-wait="1">Nothing fits: it must wait</button>` : '');
    };
    draw();
    el.onclick = e => {
      const b = e.target.closest('button'); if (!b || i >= p.reqs.length) return;
      const want = fitIdx(p.algo, holes, p.reqs[i], last), got = b.dataset.wait ? -1 : +b.dataset.k;
      if (got !== want) return c.miss(want === -1 ? 'Look again: is any space big enough?' : holes[got] < p.reqs[i] ? 'That space is too small.' : 'It fits, but the rule picks a different space.');
      if (want >= 0) { holes[want] -= p.reqs[i]; last = want; } else waiting++;
      i++; sfx('key'); draw();
      if (i === p.reqs.length) c.done(tx(`Left over: ${holes.join('K, ')}K, a total of ${holes.reduce((a, v) => a + v, 0)}K in ${holes.filter(h => h > 0).length} pieces. ${waiting ? waiting + ' [[group|process]] left waiting.' : 'Everyone is seated.'}`, c.layer));
    };
  };
  PZ.pages = (el, p, c) => {
    const fr = [], marks = []; let i = 0, faults = 0, need = -1;
    const victim = () => {
      if (p.algo === 'fifo') return fr.indexOf(fr.slice().sort((a, b) => a.loaded - b.loaded)[0]);
      if (p.algo === 'lru') return fr.indexOf(fr.slice().sort((a, b) => a.used - b.used)[0]);
      const nx = f => { const k = p.refs.indexOf(f.pg, i + 1); return k < 0 ? Infinity : k; };
      return fr.indexOf(fr.slice().sort((a, b) => nx(b) - nx(a) || a.loaded - b.loaded)[0]);
    };
    const adv = () => {
      need = -1;
      while (i < p.refs.length) {
        const pg = p.refs[i], f = fr.find(x => x.pg === pg);
        if (f) { f.used = i; marks[i] = 'H'; i++; continue; }
        if (fr.length < p.frames) { fr.push({ pg, loaded: i, used: i }); marks[i] = 'F'; faults++; i++; continue; }
        need = victim(); break;
      }
      draw();
      if (i >= p.refs.length) c.done(tx(`${faults} [[warehouse trips|page faults]] in ${p.refs.length} requests.`, c.layer));
    };
    const draw = () => {
      el.innerHTML = `<div class="refs">${p.refs.map((r, k) => `<span class="${k === i ? 'cur' : ''} ${marks[k] === 'F' ? 'f' : ''}">${r}<i>${marks[k] || ''}</i></span>`).join('')}</div>
        <div class="frames">${Array.from({ length: p.frames }, (_, k) => `<button class="frame" data-k="${k}" ${need < 0 ? 'disabled' : ''}>${fr[k] ? fr[k].pg : '–'}<small>${tx('[[desk|frame]]', c.layer)} ${k}</small></button>`).join('')}</div>
        <p>${tx(`[[Warehouse trips|Page faults]] so far: <b>${faults}</b>. F marks a [[trip|fault]], H marks a hit.`, c.layer)} ${need >= 0 ? tx(`<br><b>Box ${p.refs[i]} is needed and every [[desk|frame]] is full. Which box goes back?</b>`, c.layer) : ''}</p>`;
    };
    adv();
    el.onclick = e => {
      const b = e.target.closest('button[data-k]'); if (!b || need < 0) return;
      if (+b.dataset.k !== need) return c.miss({ fifo: 'Not that one. Which box has been on a desk the longest?', lru: 'Not that one. Which box has gone unused the longest?', opt: 'Not that one. Which box will not be needed for the longest time?' }[p.algo]);
      fr[need] = { pg: p.refs[i], loaded: i, used: i }; marks[i] = 'F'; faults++; i++; sfx('key'); adv();
    };
  };
  PZ.disk = (el, p, c) => {
    const plan = diskPlan(p), max = p.max || 199; let k = 0, head = p.head;
    const sorted = p.reqs.slice().sort((a, b) => a - b);
    el.innerHTML = `<div class="track"><div class="head" style="left:${100 * head / max}%"></div>${p.reqs.map(r => `<button data-r="${r}" style="left:${100 * r / max}%;bottom:${8 + 28 * (sorted.indexOf(r) % 3)}px">${r}</button>`).join('')}</div>
      <div class="row" style="justify-content:space-between;font-family:var(--mono);font-size:.8em"><span>0</span><span>${tx('[[cart|head]]', c.layer)} starts at ${p.head}${p.algo !== 'fcfs' && p.algo !== 'sstf' ? ', moving up' : ''}</span><span>${max}</span></div>
      <p class="visited">${tx('Visited:', c.layer)} </p>`;
    el.onclick = e => {
      const b = e.target.closest('button[data-r]'); if (!b || b.disabled) return;
      if (+b.dataset.r !== plan.order[k]) return c.miss('The rule sends the cart somewhere else next.');
      b.disabled = true; head = plan.order[k]; k++; $('.head', el).style.left = (100 * head / max) + '%'; $('.visited', el).append(head + (k < plan.order.length ? ' → ' : '')); sfx('key');
      if (k === plan.order.length) c.done(tx(`Route: ${plan.path.join(' → ')}. Total [[cart travel|head movement]]: ${plan.total} [[shelves|tracks]].`, c.layer));
    };
  };
  PZ.term = (el, p, c) => {
    let i = 0, tries = 0;
    el.innerHTML = `<div class="task"></div><div class="term"><div class="out"></div><div class="line"><span class="ps"></span><input autocomplete="off" autocapitalize="off" autocorrect="off" spellcheck="false" aria-label="terminal input"></div></div>`;
    const out = $('.out', el), inp = $('input', el);
    const print = (t, cls) => { const d = document.createElement('div'); d.className = cls || ''; d.textContent = t; out.appendChild(d); out.scrollTop = 1e9; };
    const show = () => { const t = p.tasks[i]; $('.task', el).innerHTML = `<b>Task ${i + 1} of ${p.tasks.length}${t.predict ? ' · predict the output' : ''}</b><p>${tx(t.ask, c.layer)}</p>`; $('.ps', el).textContent = t.predict ? 'it prints>' : 'student@kernelton:~$'; inp.focus(); };
    const next = () => { tries = 0; if (++i < p.tasks.length) show(); else { inp.disabled = true; $('.task', el).innerHTML = '<b>All tasks done.</b>'; c.done(); } };
    inp.onkeydown = e => {
      if (e.key !== 'Enter') return; e.stopPropagation();
      const v = inp.value.trim().replace(/\s+/g, ' '); if (!v) return; inp.value = '';
      const t = p.tasks[i]; print((t.predict ? 'it prints> ' : '$ ') + v, 'cmd');
      if (t.accept.some(r => new RegExp('^(?:' + r + ')$').test(v))) { if (t.out) print(t.out); if (c.point) c.point(true, t); sfx('key'); next(); }
      else {
        tries++; c.miss(' ');
        print(t.predict ? 'Shelly: that is not what it prints.' : 'Shelly: I did exactly what you typed, but that is not what the task asked for.', 'err');
        if (c.exam && tries >= 2) { print('Shelly: moving on. One answer: ' + t.sol, 'hint'); c.point(false, t); next(); }
        else if (!c.exam && tries >= 3) print('Shelly: one way to do it: ' + t.sol, 'hint');
      }
    };
    show();
    return { hint: () => 'one way to do it is <code>' + esc(p.tasks[Math.min(i, p.tasks.length - 1)].sol) + '</code>' };
  };
  window.KT_PZ = PZ;

  /* ---------- settings ---------- */
  function settings() {
    const m = $('#modal'), row = (k, label, note) => `<label class="setrow"><span><b>${label}</b><br><span class="muted">${note}</span></span><input type="checkbox" data-k="${k}" ${S.set[k] ? 'checked' : ''}></label>`;
    m.hidden = false;
    m.innerHTML = `<div class="panel"><h2>Settings</h2>
      ${row('expert', 'Expert mode', 'Lens stays on: real terms from the start.')}${row('story', 'Story', 'Show the briefing before each puzzle.')}
      ${row('music', 'Music', 'A quiet lo-fi loop.')}${row('sfx', 'Sound effects', 'Clicks, bells and stars.')}
      ${row('revision', 'Revision mode', 'Unlock every district and mock test.')}
      <div class="row" style="margin-top:14px"><button class="btn alt sm" data-x="place">Placement test</button><button class="btn warn sm" data-x="reset">Reset progress</button><span style="flex:1"></span><button class="btn" data-x="close">Close</button></div></div>`;
    m.onchange = e => { const k = e.target.dataset.k; if (!k) return; S.set[k] = e.target.checked; save(); if (k === 'music') music(S.set.music); hud($('#crumb').textContent); };
    m.onclick = e => {
      const x = e.target.dataset.x; if (e.target === m || x === 'close') { m.hidden = true; redraw(); }
      else if (x === 'place') { m.hidden = true; placement(); }
      else if (x === 'reset') {
        if (e.target.dataset.sure) { S.stars = {}; S.tests = {}; S.placed = false; save(); m.hidden = true; showTitle(); }
        else { e.target.dataset.sure = '1'; e.target.textContent = 'Press again to erase everything'; }
      }
    };
  }

  /* ---------- global controls ---------- */
  $('#top').onclick = e => {
    const a = e.target.closest('[data-act]'); if (!a) return;
    if (a.dataset.act === 'map') showMap();
    else if (a.dataset.act === 'settings') settings();
    else if (a.dataset.act === 'lens') { lens = !lens; hud($('#crumb').textContent); }
  };
  document.addEventListener('keydown', e => {
    if (e.target.tagName === 'INPUT') return;
    if (e.key === 'l' || e.key === 'L') $('#lensBtn').click();
    if (e.key === ' ' || e.key === 'Enter') { const b = $('#adv') || ($('#cont') && !$('#cont').hidden && $('#cont')) || $('[data-go="n"]'); if (b && document.activeElement.tagName !== 'BUTTON') { e.preventDefault(); b.click(); } }
  });
  document.addEventListener('click', () => { if (S.set.music && !musicTimer) music(true); }, { once: false });
  window.KT = { S, WORLDS, startLevel, showMap, save };
  showTitle();
})();
