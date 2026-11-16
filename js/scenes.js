/* Town view scenes for the question style puzzles. KT_SCENES maps level id -> one scene per puzzle part. */
(function () {
  'use strict';
  const INK = '#22304A', C = { teal: '#2BA6A0', amber: '#F2B134', coral: '#E8604C', green: '#6BBF59', violet: '#7A5CC2', grey: '#9AA3B2', skin: '#F1D9BD', wood: '#C98B5E', sand: '#F1E4C8' };
  const SK = `stroke="${INK}" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"`;
  const T = (x, y, t, o) => `<text x="${x}" y="${y}" text-anchor="${(o && o.a) || 'middle'}" font-size="${(o && o.s) || 13}" font-weight="${(o && o.w) || 400}" fill="${(o && o.f) || INK}">${t}</text>`;
  const person = (x, g, col, o) => `<g ${o && o.dim ? 'opacity=".45"' : ''}><ellipse cx="${x}" cy="${g + 3}" rx="22" ry="4" fill="${INK}" opacity=".12"/><rect x="${x - 17}" y="${g - 46}" width="34" height="46" rx="14" fill="${col}" ${SK}/><circle cx="${x}" cy="${g - 61}" r="18" fill="${C.skin}" ${SK}/><circle cx="${x - 6}" cy="${g - 63}" r="2.4" fill="${INK}"/><circle cx="${x + 6}" cy="${g - 63}" r="2.4" fill="${INK}"/>${o && o.hat ? `<path d="M${x - 16} ${g - 74}h32v-14a16 12 0 0 0 -32 0z" fill="#fff" ${SK}/>` : ''}${o && o.name ? T(x, g + 20, o.name, { w: 800, s: 13 }) : ''}</g>`;
  const house = (x, g, w, h, name, roof) => `<path d="M${x - 8} ${g - h} L${x + w / 2} ${g - h - 34} L${x + w + 8} ${g - h}Z" fill="${roof}" ${SK}/><rect x="${x}" y="${g - h}" width="${w}" height="${h}" fill="#fff" ${SK}/>${name ? T(x + w / 2, g + 20, name, { s: 12, w: 700 }) : ''}`;
  const bubble = (x, y, w, t) => `<rect x="${x - w / 2}" y="${y - 20}" width="${w}" height="30" rx="10" fill="#fff" ${SK}/>${T(x, y, t, { s: 12.5, w: 700 })}`;
  const box = (x, y, sz, t, col) => `<rect x="${x}" y="${y}" width="${sz}" height="${sz}" rx="5" fill="${col || C.amber}" ${SK}/>${T(x + sz / 2, y + sz / 2 + 5, t, { s: 13, w: 800 })}`;
  const car = (x, y, col, rot) => `<g transform="translate(${x} ${y}) rotate(${rot || 0})"><rect x="-24" y="-13" width="48" height="26" rx="8" fill="${col}" ${SK}/><rect x="4" y="-9" width="12" height="18" rx="3" fill="#fff" stroke="${INK}" stroke-width="2"/></g>`;
  const bell = (x, y, ring) => `<line x1="${x}" y1="${y + 18}" x2="${x}" y2="160" ${SK}/><path d="M${x - 16} ${y + 18}q2 -34 16 -34q14 0 16 34z" fill="${C.amber}" ${SK}/><circle cx="${x}" cy="${y + 22}" r="5" fill="${INK}"/>${ring ? `<path d="M${x - 28} ${y - 6}q-8 10 0 22M${x + 28} ${y - 6}q8 10 0 22M${x - 38} ${y - 12}q-12 16 0 34M${x + 38} ${y - 12}q12 16 0 34" fill="none" stroke="${C.coral}" stroke-width="3" stroke-linecap="round"/>` : ''}`;
  const img = (n, x, y, w) => `<image href="assets/${n}.svg" x="${x}" y="${y}" width="${w}" height="${w * 1.36}"/>`;
  const wrap = (inner, h, g) => `<div class="scene"><svg viewBox="0 0 760 ${h || 200}" role="img" aria-label="Town view"><rect width="760" height="${h || 200}" fill="#FBF3E4"/><rect y="${g || 160}" width="760" height="${(h || 200) - (g || 160)}" fill="${C.sand}"/><line x1="0" x2="760" y1="${g || 160}" y2="${g || 160}" stroke="${INK}" stroke-width="3"/>${inner}</svg></div>`;

  const S = {
    town: () => wrap([['workshop', C.coral], ['desks', C.amber], ['archive', C.green], ['docks', C.teal], ['gate', '#3E6FB0'], ['counter', C.violet]].map((b, i) => house(34 + i * 122, 160, 84, 56, b[0], b[1])).join('') + T(380, 24, 'Kernelton: six services, one Town Manager', { w: 700, s: 14 })),
    eras: (d, n) => wrap([0, 1, 2, 3].map(k => k < n ? house(60 + k * 175, 160, 100, 50 + k * 8, 'era ' + (k + 1), [C.grey, C.amber, C.teal, C.coral][k]) + Array.from({ length: k + 1 }, (_, j) => `<circle cx="${82 + k * 175 + j * 19}" cy="${140}" r="7" fill="${C.skin}" ${SK}/>`).join('') : `<rect x="${60 + k * 175}" y="80" width="100" height="80" rx="8" fill="none" stroke="${INK}" stroke-width="3" stroke-dasharray="7 6"/>${T(110 + k * 175, 128, '?', { s: 28, w: 800 })}`).join('') + T(380, 26, 'The workshop through the years, oldest on the left', { w: 700, s: 14 })),
    counter: (d, n) => {
      const mx = [250, 250, 96, 640, 96, 96][Math.min(n, 5)], rx = n === 0 ? 470 : 380, ring = n === 2 || n === 4;
      return wrap(house(40, 160, 112, 84, '', C.violet) + T(96, 180, "manager's office", { s: 12, w: 700 }) + `<rect x="300" y="118" width="60" height="42" fill="${C.wood}" ${SK}/><rect x="290" y="108" width="80" height="12" rx="3" fill="${C.wood}" ${SK}/>` + T(330, 180, 'service counter', { s: 12, w: 700 })
        + person(rx, 160, C.amber, {}) + box(rx + 20, 122, 26, '', C.sand) + person(mx, 160, C.violet, {}) + bell(640, 60, ring) + (n === 4 ? bell(700, 60, true) : '') + T(n === 4 ? 670 : 640, 180, 'doorbell', { s: 12, w: 700 })
        + (n === 3 ? bubble(190, 50, 190, 'task saved: carry on later') : '') + T(380, 24, ['A resident arrives with a box for the warehouse', 'The resident asks at the counter', 'The manager is working in the office. The doorbell rings', 'The manager goes to deal with the delivery', 'Back at work. Now two doorbells ring at once', 'A quiet square again'][Math.min(n, 5)], { w: 700, s: 13.5 }));
    },
    recipe: () => wrap(`<rect x="60" y="92" width="92" height="64" rx="6" fill="${C.coral}" ${SK}/><line x1="106" y1="92" x2="106" y2="156" ${SK}/>` + T(106, 180, 'a recipe on the shelf', { s: 12, w: 700 }) + house(300, 160, 250, 96, '', C.teal) + T(425, 180, 'one household, cooking it', { s: 12, w: 700 })
      + [0, 1, 2].map(k => person(350 + k * 76, 158, [C.amber, C.green, C.violet][k], {})).join('') + T(660, 100, 'the family members', { s: 12 }) + T(660, 116, 'share one kitchen', { s: 12 }) + `<path d="M606 104h-44" ${SK}/>`),
    states: (d, n) => {
      const xs = [70, 225, 380, 535, 690], at = [0, 1, 2, 3, 3, 2, 2, 4][Math.min(n, 7)];
      return wrap(house(34, 160, 72, 50, 'town office', C.violet) + T(225, 180, 'the line', { s: 12, w: 700 }) + `<path d="M185 160h80" stroke="${INK}" stroke-width="3" stroke-dasharray="6 6"/>` + house(340, 160, 80, 60, 'workshop', C.coral) + house(500, 160, 70, 44, 'docks', C.teal) + house(654, 160, 72, 50, 'home', C.green)
        + person(xs[at] + (at === 1 ? 0 : 0), at === 1 ? 160 : 160, C.amber, {}) + `<path d="M${xs[at]} 52v20m-8 -8l8 8l8 -8" fill="none" ${SK}/>` + T(380, 26, 'Follow the household through its day', { w: 700, s: 14 }));
    },
    kitchen: (d, n) => {
      const k = Math.min(n, 6), nb = [5, 5, 6, 6, 6, 6, 6][k], a = ['read 5', 'read 5', 'wrote 6', 'done', 'done', 'done', 'done'][k], b = ['not looked yet', 'read 5', 'still thinks 5', 'wrote 6', 'done', 'done', 'done'][k];
      return wrap(person(150, 160, C.teal, { hat: true, name: 'Cook A' }) + bubble(150, 52, 150, a) + person(610, 160, C.coral, { hat: true, name: 'Cook B' }) + bubble(610, 52, 150, b)
        + `<rect x="300" y="126" width="160" height="12" rx="3" fill="${C.wood}" ${SK}/><path d="M316 138V160M444 138V160" ${SK}/><rect x="318" y="72" width="64" height="54" rx="4" fill="#fff" ${SK}/>` + T(350, 110, nb, { s: 30, w: 800 }) + T(350, 64, 'notebook', { s: 12, w: 700 })
        + `<path d="M404 86h36v32a8 8 0 0 1 -8 8h-20a8 8 0 0 1 -8 -8z" fill="${C.amber}" fill-opacity=".5" ${SK}/>` + T(422, 78, 'jar', { s: 12, w: 700 }) + T(380, 184, 'Tips actually in the jar: 7', { s: 12.5 }));
    },
    parking: () => wrap([0, 1, 2].map(k => `<rect x="${430 + k * 92}" y="86" width="78" height="70" rx="4" fill="none" stroke="${INK}" stroke-width="3" stroke-dasharray="7 6"/>`).join('') + `<rect x="330" y="40" width="70" height="44" rx="6" fill="${INK}"/>` + T(365, 60, 'free', { s: 11, f: '#fff' }) + T(365, 78, '3', { s: 17, w: 800, f: C.amber }) + `<line x1="365" y1="84" x2="365" y2="160" ${SK}/><line x1="365" y1="130" x2="412" y2="130" stroke="${C.coral}" stroke-width="6" stroke-linecap="round"/>`
      + [0, 1, 2, 3, 4].map(k => car(292 - k * 58, 140, [C.teal, C.coral, C.violet, C.green, C.amber][k])).join('') + T(160, 30, 'Five cars arrive at a lot with three spaces', { w: 700, s: 14 })),
    table: () => {
      let s = `<circle cx="380" cy="104" r="46" fill="${C.wood}" ${SK}/>`;
      for (let k = 0; k < 5; k++) { const a = -Math.PI / 2 + k * 2 * Math.PI / 5, b = a + Math.PI / 5;
        s += `<circle cx="${380 + 76 * Math.cos(a)}" cy="${104 + 76 * Math.sin(a)}" r="16" fill="${C.skin}" ${SK}/><line x1="${380 + 20 * Math.cos(b)}" y1="${104 + 20 * Math.sin(b)}" x2="${380 + 40 * Math.cos(b)}" y2="${104 + 40 * Math.sin(b)}" stroke="${INK}" stroke-width="5" stroke-linecap="round"/>`; }
      return wrap(s + T(150, 60, 'Five cooks.', { s: 14, w: 700 }) + T(150, 80, 'Five knives.', { s: 14, w: 700 }) + T(150, 100, 'Each needs two.', { s: 14, w: 700 }) + img('lockhart', 600, 30, 96), 200, 190);
    },
    junction: () => wrap(`<rect x="0" y="70" width="760" height="60" fill="${C.grey}"/><rect x="350" y="0" width="60" height="200" fill="${C.grey}"/><rect x="350" y="70" width="60" height="60" fill="none" stroke="#fff" stroke-width="2" stroke-dasharray="6 6"/>`
      + car(336, 115, C.teal, 0) + car(395, 144, C.amber, -90) + car(424, 85, C.coral, 180) + car(365, 56, C.violet, 90) + img('gridlock', 690, 2, 48) + T(130, 30, 'Each car holds one piece of road', { s: 13, w: 700 }) + T(130, 48, 'and wants the piece ahead.', { s: 13, w: 700 }), 200, 200),
    rag: (d, n) => {
      const g = d.g[Math.min(n, d.g.length - 1)], px = {}, rx = {};
      let s = `<defs><marker id="rg" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0L10 5L0 10z" fill="${INK}"/></marker></defs>`;
      g.P.forEach((p, i) => { px[p] = 380 + (i - (g.P.length - 1) / 2) * 200; });
      (g.R || []).forEach((r, i) => { rx[r[0]] = 380 + (i - (g.R.length - 1) / 2) * 200; });
      const edge = (x1, y1, x2, y2, dash) => { const dx = x2 - x1, dy = y2 - y1, L = Math.hypot(dx, dy), a = 26 / L, b = 1 - 30 / L; return `<line x1="${x1 + dx * a}" y1="${y1 + dy * a}" x2="${x1 + dx * b}" y2="${y1 + dy * b}" stroke="${INK}" stroke-width="2.5" ${dash ? 'stroke-dasharray="6 5"' : ''} marker-end="url(#rg)"/>`; };
      (g.hold || []).forEach(e => { s += edge(rx[e[0]], 150, px[e[1]], 56); });
      (g.want || []).forEach(e => { s += edge(px[e[0]], 56, rx[e[1]], 150, true); });
      (g.pp || []).forEach((e, i) => { const y = 50 + i * 16; s += edge(px[e[0]], y, px[e[1]], y, true); });
      g.P.forEach(p => { s += `<circle cx="${px[p]}" cy="56" r="24" fill="${C.amber}" ${SK}/>` + T(px[p], 61, p, { w: 800 }); });
      (g.R || []).forEach(r => { s += `<rect x="${rx[r[0]] - 26}" y="126" width="52" height="48" rx="6" fill="#fff" ${SK}/>` + T(rx[r[0]], 144, r[0], { w: 800, s: 12 }) + Array.from({ length: r[1] }, (_, j) => `<circle cx="${rx[r[0]] + (j - (r[1] - 1) / 2) * 14}" cy="160" r="5" fill="${INK}"/>`).join(''); });
      return wrap(s + T(20, 24, 'solid: held by', { a: 'start', s: 12 }) + T(20, 42, 'dashed: wants', { a: 'start', s: 12 }) + T(740, 24, 'dots: copies', { a: 'end', s: 12 }), 196, 196);
    },
    shed: d => {
      const tool = (x, y) => `<rect x="${x}" y="${y}" width="8" height="24" rx="3" fill="${C.grey}" stroke="${INK}" stroke-width="2"/>`, free = d.total - d.hold.reduce((a, v) => a + v, 0);
      return wrap(house(40, 160, 150, 86, '', C.wood) + `<line x1="52" y1="130" x2="178" y2="130" ${SK}/>` + Array.from({ length: free }, (_, j) => tool(62 + j * 14, 104)).join('') + T(115, 180, `tool shed: ${free} on the shelf`, { s: 12, w: 700 })
        + d.hold.map((h, k) => person(300 + k * 160, 160, [C.teal, C.amber, C.violet][k], { name: 'P' + (k + 1) }) + Array.from({ length: h }, (_, j) => tool(326 + k * 160 + j * 12, 116)).join('') + T(300 + k * 160, 196, `holds ${h}, may need ${d.max[k]}`, { s: 12 })).join('') + T(380, 26, `${d.total} tools in total`, { w: 700, s: 14 }), 206, 160);
    },
    boxes: d => {
      const n = d.table ? d.table.length : 4, f = d.frames || 0, bx = k => 230 + k * (440 / (n - 1)), fx = k => 40 + k * (680 / (f - 1));
      let s = T(20, 44, 'boxes', { a: 'start', s: 12, w: 700 }) + Array.from({ length: n }, (_, k) => box(bx(k) - 22, 16, 44, k)).join('') + T(20, 62, `each holds ${d.size}`, { a: 'start', s: 12 });
      if (d.table) s += `<defs><marker id="bx" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0L10 5L0 10z" fill="${INK}"/></marker></defs>` + d.table.map((fr, k) => `<line x1="${bx(k)}" y1="62" x2="${fx(fr)}" y2="118" stroke="${INK}" stroke-width="2" marker-end="url(#bx)"/>`).join('')
        + Array.from({ length: f }, (_, k) => `<rect x="${fx(k) - 26}" y="122" width="52" height="10" rx="3" fill="${C.wood}" ${SK}/><path d="M${fx(k) - 18} 132V150M${fx(k) + 18} 132V150" ${SK}/>` + T(fx(k), 170, 'desk ' + k, { s: 11.5 })).join('');
      else s += person(120, 150, C.teal, {}) + bubble(420, 120, 300, 'Which box, and how far into it?');
      return wrap(s, 180, 150);
    },
    notes: () => wrap(img('paige', 40, 22, 100) + `<rect x="210" y="84" width="110" height="72" rx="5" fill="${C.green}" ${SK}/><line x1="265" y1="84" x2="265" y2="156" ${SK}/>` + T(265, 180, 'index book: slow', { s: 12, w: 700 })
      + [0, 1, 2].map(k => `<rect x="${420 + k * 96}" y="${70 + (k % 2) * 14}" width="76" height="66" fill="${C.amber}" ${SK} transform="rotate(${[-4, 3, -2][k]} ${458 + k * 96} 100)"/>` + T(458 + k * 96, 100 + (k % 2) * 14, 'box ' + [2, 0, 7][k], { s: 12, w: 800 }) + T(458 + k * 96, 118 + (k % 2) * 14, 'desk ' + [7, 5, 3][k], { s: 12 })).join('') + T(556, 180, 'sticky notes: fast, but only a few', { s: 12, w: 700 })),
    rooms: d => { let x = 30; const tot = d.limits.reduce((a, v) => a + Math.max(v, 110), 0), sc = (700 - 12 * (d.limits.length - 1)) / tot;
      return wrap(d.limits.map((l, k) => { const w = Math.max(l, 110) * sc, r = `<rect x="${x}" y="70" width="${w}" height="90" fill="#fff" ${SK}/>` + T(x + w / 2, 106, 'room ' + k, { s: 12, w: 800 }) + T(x + w / 2, 124, 'length', { s: 11 }) + T(x + w / 2, 140, l, { s: 12, w: 700 }); x += w + 12; return r; }).join('') + T(380, 34, 'Rooms of different sizes, one per kind of belonging', { w: 700, s: 14 }));
    },
    watch: () => wrap(`<rect x="0" y="92" width="300" height="68" fill="${C.grey}" ${SK}/><rect x="524" y="92" width="236" height="68" fill="${C.grey}" ${SK}/><rect x="300" y="60" width="120" height="100" fill="#fff" ${SK}/><path d="M330 160v-44a30 30 0 0 1 60 0v44z" fill="${C.wood}" ${SK}/><path d="M292 60h136l-12 -22h-112z" fill="#3E6FB0" ${SK}/>`
      + img('sentry', 430, 40, 92) + person(120, 160, '#555E70', { name: 'outside' }) + `<circle cx="114" cy="97" r="2.6" fill="${C.coral}"/><circle cx="126" cy="97" r="2.6" fill="${C.coral}"/>` + person(620, 160, C.amber, {}) + person(680, 160, C.teal, {}) + T(650, 180, 'residents', { s: 13, w: 800 })
      + T(380, 24, 'The wall keeps attackers out. The locks inside decide who may open what.', { w: 700, s: 13 }))
  };

  window.KT_SCENE = (sc, n) => (S[sc.kind] ? S[sc.kind](sc, n || 0) : '');
  const RAG = [{ P: ['P1', 'P2'], R: [['R1', 1], ['R2', 1]], hold: [['R1', 'P1'], ['R2', 'P2']], want: [['P1', 'R2'], ['P2', 'R1']] }];
  RAG[1] = RAG[0];
  RAG[2] = { P: ['P1', 'P2', 'P3'], R: [['R1', 1], ['R2', 2]], hold: [['R1', 'P1'], ['R2', 'P2'], ['R2', 'P3']], want: [['P1', 'R2'], ['P2', 'R1']] };
  RAG[3] = { P: ['P1', 'P2'], R: [['R1', 1], ['R2', 1]], hold: [['R1', 'P1'], ['R2', 'P2']], want: [['P1', 'R2']] };
  RAG[4] = { P: ['P1', 'P2'], pp: [['P1', 'P2'], ['P2', 'P1']] };
  const town = { kind: 'town' }, watch = { kind: 'watch' }, junction = { kind: 'junction' }, table = { kind: 'table' };
  const shed = { kind: 'shed', total: 10, hold: [2, 3, 3], max: [6, 5, 9] };
  window.KT_SCENES = {
    '1.1': [town], '1.2': [{ kind: 'eras' }, { kind: 'eras', done: true }], '1.3': [{ kind: 'counter' }], '1.5': [town, town, town],
    '2.1': [{ kind: 'recipe' }], '2.2': [{ kind: 'states' }], '2.3': [{ kind: 'recipe' }, { kind: 'recipe' }], '2.5': [{ kind: 'recipe' }, { kind: 'states' }],
    '4.1': [{ kind: 'kitchen' }], '4.2': [{ kind: 'parking' }, { kind: 'parking' }], '4.3': [table, table], '4.5': [{ kind: 'kitchen' }, table],
    '5.1': [junction], '5.2': [{ kind: 'rag', g: RAG }], '5.3': [shed, shed, shed], '5.5': [junction, junction, { kind: 'shed', total: 12, hold: [5, 2, 2], max: [10, 4, 9] }],
    '7.1': [{ kind: 'boxes', size: 1024 }, { kind: 'boxes', size: 1024 }], '7.2': [{ kind: 'boxes', size: 1024, table: [5, 2, 7, 0], frames: 8 }, { kind: 'notes' }],
    '7.3': [{ kind: 'notes' }, { kind: 'rooms', limits: [600, 14, 100, 580] }, { kind: 'rooms', limits: [600, 14, 100, 580] }],
    '7.5': [{ kind: 'boxes', size: 4096, table: [3, 6, 1, 9], frames: 10 }, { kind: 'boxes', size: 4096 }, { kind: 'notes' }, { kind: 'rooms', limits: [300, 120, 500] }],
    '10.1': [watch, watch], '10.2': [watch, watch], '10.3': [watch, watch, watch, watch], '10.5': [watch, watch, watch]
  };
})();
