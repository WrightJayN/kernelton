// Plays every level in a headless browser using the answers in the content files.
// Usage: node tools/playtest.js   (needs playwright)
const { chromium } = require('playwright');
const path = require('path');
(async () => {
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 900, height: 900 } });
  const errs = [];
  p.on('pageerror', e => errs.push('pageerror: ' + e.message));
  p.on('console', m => { if (m.type() === 'error') errs.push('console: ' + m.text()); });
  await p.goto('file://' + path.resolve(__dirname, '..', 'index.html'));
  const res = await p.evaluate(async () => {
    const out = [], $ = s => document.querySelector(s), $$ = s => [...document.querySelectorAll(s)];
    const click = el => { if (!el) throw new Error('missing element'); el.click(); };
    const strip = s => { const d = document.createElement('div'); d.innerHTML = s; return d.textContent.replace(/\s+/g, ' ').trim(); };
    const variants = s => [s.replace(/\[\[(.+?)\|(.+?)\]\]/g, '$1'), s.replace(/\[\[(.+?)\|(.+?)\]\]/g, '$1 ($2)'), s.replace(/\[\[(.+?)\|(.+?)\]\]/g, '$2')].map(strip);
    const victim = (pz, fr, i) => {
      const nx = x => { const k = pz.refs.indexOf(x.pg, i + 1); return k < 0 ? Infinity : k; };
      if (pz.algo === 'fifo') return fr.slice().sort((a, c) => a.loaded - c.loaded)[0];
      if (pz.algo === 'lru') return fr.slice().sort((a, c) => a.used - c.used)[0];
      return fr.slice().sort((a, c) => nx(c) - nx(a) || a.loaded - c.loaded)[0];
    };
    const walk = (pz, onVictim) => {
      const fr = []; let faults = 0;
      pz.refs.forEach((pg, i) => {
        const f = fr.find(x => x.pg === pg); if (f) { f.used = i; return; }
        faults++;
        if (fr.length < pz.frames) { fr.push({ pg, loaded: i, used: i }); return; }
        const k = fr.indexOf(victim(pz, fr, i)); if (onVictim) onVictim(k); fr[k] = { pg, loaded: i, used: i };
      });
      return faults;
    };
    const solve = {
      match: pz => pz.pairs.forEach((_, i) => { click($(`#pz [data-l="${i}"]`)); click($(`#pz [data-r="${i}"]`)); }),
      order: pz => pz.items.forEach((_, i) => click($(`#pz [data-i="${i}"]`))),
      pick: pz => pz.steps.forEach(() => { click($('#pz .opt[data-k="0"]')); const n = $('#pz [data-next]'); if (n) n.click(); }),
      sort: pz => pz.items.forEach(() => {
        const t = strip($('#pz .card.big').innerHTML), it = pz.items.find(x => variants(x[0]).includes(t));
        if (!it) throw new Error('sort item not found: ' + t);
        click($(`#pz .opt[data-k="${it[1]}"]`));
      }),
      calc: pz => { $$('#pz input').forEach((inp, i) => { inp.value = pz.fields[i].a; }); click($('#pz [data-check]')); },
      sched: pz => window.KT_SIM.simSched(pz).segs.forEach(s => click($(`#pz button[data-id="${s.id}"]`))),
      fit: pz => {
        const h = pz.holes.slice(); let last = 0;
        pz.reqs.forEach(r => { const k = window.KT_SIM.fitIdx(pz.algo, h, r, last); if (k < 0) click($('#pz [data-wait]')); else { click($(`#pz .hole[data-k="${k}"]`)); h[k] -= r; last = k; } });
      },
      pages: pz => walk(pz, k => click($(`#pz .frame[data-k="${k}"]`))),
      disk: pz => window.KT_SIM.diskPlan(pz).order.forEach(r => click($(`#pz button[data-r="${r}"]:not(:disabled)`))),
      term: pz => pz.tasks.forEach((t, i) => {
        const inp = $('#pz input'); inp.value = t.sol; inp.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
        if ($$('#pz .err').length) throw new Error(`term task ${i + 1} rejected its own solution: ${t.sol}`);
      })
    };
    for (const [wi, w] of window.KT.WORLDS.entries()) for (const [li, lv] of w.levels.entries()) {
      try {
        window.KT.startLevel(wi, li);
        let guard = 0; while ($('#adv') && guard++ < 20) click($('#adv'));
        for (const pz of [].concat(lv.pz)) {
          if (!$('#pz')) throw new Error('no puzzle mounted');
          solve[pz.type](pz);
          if ($('#cont').hidden) throw new Error(`${pz.type} puzzle did not complete: ${$('.fb').textContent}`);
          click($('#cont'));
        }
        if (lv.rv && lv.rv.length) click($('[data-go="n"]'));
        for (let q = 0; q < 3; q++) { click($('.opt[data-k="0"]')); click($('[data-go="n"]')); }
        const st = $('.bigstars');
        if (!st || st.textContent !== '★★★') throw new Error('expected 3 stars, got ' + (st ? st.textContent : 'no reward screen'));
        if (lv.qz.length < 3) throw new Error('fewer than 3 quiz questions');
        lv.qz.forEach(q => { if (new Set(q.a).size !== q.a.length) throw new Error('duplicate quiz options: ' + q.q); });
        out.push({ id: lv.id, ok: true });
      } catch (e) { out.push({ id: lv.id, ok: false, err: e.message }); }
    }
    const refs = [7, 0, 1, 2, 0, 3, 0, 4, 2, 3, 0, 3, 2];
    return {
      out, faults: [['fifo', 3], ['lru', 3], ['opt', 3], ['fifo', 4]].map(([algo, frames]) => walk({ algo, frames, refs })),
      qs: window.KT.WORLDS.reduce((a, w) => a + w.levels.reduce((x, l) => x + l.qz.length, 0), 0)
    };
  });
  const bad = res.out.filter(r => !r.ok);
  console.log(`levels: ${res.out.length}, passed: ${res.out.length - bad.length}, quiz questions: ${res.qs}, page faults fifo3/lru3/opt3/fifo4: ${res.faults}`);
  bad.forEach(r => console.log('FAIL', r.id, r.err));
  errs.forEach(e => console.log(e));
  await b.close();
  process.exit(bad.length || errs.length ? 1 : 0);
})();
