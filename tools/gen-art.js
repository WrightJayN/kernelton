const fs = require('fs');
const path = require('path');
const out = process.argv[2];

const C = { cream: '#FBF3E4', ink: '#22304A', teal: '#2BA6A0', amber: '#F2B134', coral: '#E8604C', green: '#6BBF59', violet: '#7A5CC2', black: '#10151F', white: '#FFFFFF', grey: '#9AA3B2' };
const marks = [];
const S = `stroke="${C.ink}" stroke-width="5" stroke-linejoin="round" stroke-linecap="round"`;

// generic person: cx = centre, g = ground y
function person(cx, g, body, skin, opts = {}) {
  const bh = opts.long ? 150 : 120, by = g - 22 - bh, hy = by - 42;
  return `
  <rect x="${cx - 34}" y="${g - 30}" width="24" height="30" rx="8" fill="${C.ink}"/>
  <rect x="${cx + 10}" y="${g - 30}" width="24" height="30" rx="8" fill="${C.ink}"/>
  <rect x="${cx - 55}" y="${by}" width="110" height="${bh}" rx="38" fill="${body}" ${S}/>
  <circle cx="${cx}" cy="${hy}" r="54" fill="${skin}" ${S}/>
  <circle cx="${cx - 19}" cy="${hy - 2}" r="6.5" fill="${C.ink}"/>
  <circle cx="${cx + 19}" cy="${hy - 2}" r="6.5" fill="${C.ink}"/>
  ${opts.noSmile ? '' : `<path d="M${cx - 14} ${hy + 20} Q${cx} ${hy + 32} ${cx + 14} ${hy + 20}" fill="none" ${S}/>`}`;
}
function label(cx, y, name, role, dark) {
  return `<text x="${cx}" y="${y}" text-anchor="middle" font-family="Nunito, 'Trebuchet MS', Verdana, sans-serif" font-weight="800" font-size="26" fill="${dark ? C.cream : C.ink}">${name}</text>
  <text x="${cx}" y="${y + 28}" text-anchor="middle" font-family="'DejaVu Sans Mono', Menlo, Consolas, monospace" font-size="17" fill="${dark ? C.amber : C.teal}">${role}</text>`;
}

function cast() {
  const g = 400, xs = [110, 300, 480, 705, 912, 1096];
  let s = `<rect x="-200" width="2200" height="520" fill="${C.cream}"/>
  <rect x="-200" y="${g}" width="2200" height="120" fill="#F1E4C8"/>
  <line x1="-200" y1="${g}" x2="2000" y2="${g}" stroke="${C.ink}" stroke-width="4"/>`;
  // shadows
  xs.forEach(x => { s += `<ellipse cx="${x}" cy="${g + 8}" rx="70" ry="9" fill="${C.ink}" opacity="0.12"/>`; });

  // 1 Mayor Root
  marks.push(s.length);
  let x = xs[0], by = g - 142, hy = by - 42;
  s += person(x, g, C.violet, '#C98B5E');
  s += `<path d="M${x - 50} ${by + 22} L${x + 52} ${by + 96} L${x + 54} ${by + 70} L${x - 38} ${by + 6} Z" fill="${C.amber}" ${S}/>
  <rect x="${x - 62}" y="${hy - 58}" width="124" height="16" rx="8" fill="${C.ink}"/>
  <rect x="${x - 40}" y="${hy - 122}" width="80" height="70" rx="6" fill="${C.ink}"/>
  <rect x="${x - 40}" y="${hy - 76}" width="80" height="12" fill="${C.violet}"/>
  <path d="M${x - 30} ${hy + 14} Q${x - 14} ${hy + 4} ${x} ${hy + 14} Q${x + 14} ${hy + 4} ${x + 30} ${hy + 14} Q${x + 14} ${hy + 26} ${x} ${hy + 18} Q${x - 14} ${hy + 26} ${x - 30} ${hy + 14}Z" fill="${C.white}" ${S}/>
  <g transform="translate(${x + 66} ${by + 20})"><circle cx="0" cy="0" r="20" fill="none" stroke="${C.ink}" stroke-width="17"/><circle cx="0" cy="0" r="20" fill="none" stroke="${C.amber}" stroke-width="8"/>
  <rect x="-7" y="24" width="14" height="82" rx="4" fill="${C.amber}" ${S}/><rect x="7" y="72" width="20" height="12" fill="${C.amber}" ${S}/><rect x="7" y="92" width="14" height="12" fill="${C.amber}" ${S}/></g>`;

  // 2 Tick
  marks.push(s.length);
  x = xs[1]; by = g - 142; hy = by - 42;
  s += person(x, g, C.teal, '#F6D2B0');
  s += `<path d="M${x - 54} ${hy - 20} A54 54 0 0 1 ${x + 54} ${hy - 20} Z" fill="${C.coral}" ${S}/>
  <path d="M${x + 20} ${hy - 22} H${x + 84} Q${x + 78} ${hy - 6} ${x + 40} ${hy - 12}Z" fill="${C.coral}" ${S}/>
  <g transform="translate(${x - 64} ${by + 62})"><rect x="-7" y="-46" width="14" height="14" rx="3" fill="${C.ink}"/><circle r="34" fill="${C.white}" ${S}/><path d="M0 0V-22M0 0L15 9" fill="none" ${S}/><circle r="4" fill="${C.ink}"/></g>
  <path d="M${x + 22} ${by + 34} h30 a11 11 0 0 1 0 22 h-30z" fill="${C.amber}" ${S}/>
  <path d="M${x} ${by + 4} L${x + 30} ${by + 36}" fill="none" stroke="${C.ink}" stroke-width="3"/>`;

  // 3 Paige
  marks.push(s.length);
  x = xs[2]; by = g - 142; hy = by - 42;
  s += `<circle cx="${x}" cy="${hy - 58}" r="24" fill="${C.ink}"/>`;
  s += person(x - 20, g, C.amber, '#8D5A3B');
  s += `<circle cx="${x - 39}" cy="${hy - 2}" r="17" fill="${C.white}" fill-opacity="0.55" ${S}/><circle cx="${x - 1}" cy="${hy - 2}" r="17" fill="${C.white}" fill-opacity="0.55" ${S}/>
  <circle cx="${x - 39}" cy="${hy - 2}" r="6" fill="${C.ink}"/><circle cx="${x - 1}" cy="${hy - 2}" r="6" fill="${C.ink}"/>`;
  s = s.replace(`<circle cx="${x}" cy="${hy - 58}" r="24" fill="${C.ink}"/>`, `<circle cx="${x - 20}" cy="${hy - 58}" r="24" fill="${C.ink}"/>`);
  [0, 1, 2].forEach(i => {
    const yy = g - 50 - i * 50, col = [C.teal, C.coral, C.green][i];
    s += `<rect x="${x + 42}" y="${yy}" width="62" height="50" rx="6" fill="${col}" ${S}/><text x="${x + 73}" y="${yy + 34}" text-anchor="middle" font-family="'DejaVu Sans Mono', monospace" font-weight="700" font-size="26" fill="${C.ink}">${2 - i}</text>`;
  });

  // 4 Archie
  marks.push(s.length);
  x = xs[3]; by = g - 172; hy = by - 42;
  s += person(x, g, C.green, '#E7B48A', { long: true, noSmile: true });
  s += `<line x1="${x}" y1="${by + 30}" x2="${x}" y2="${g - 24}" stroke="${C.ink}" stroke-width="5"/>
  <path d="M${x - 51} ${hy + 14} Q${x - 50} ${hy + 80} ${x} ${hy + 88} Q${x + 50} ${hy + 80} ${x + 51} ${hy + 14} Q${x} ${hy + 40} ${x - 51} ${hy + 14}Z" fill="${C.white}" ${S}/>
  <path d="M${x - 10} ${hy + 50} Q${x} ${hy + 58} ${x + 10} ${hy + 50}" fill="none" ${S}/>
  <g transform="translate(${x - 62} ${by + 74})"><rect x="-30" y="-36" width="60" height="76" rx="6" fill="${C.coral}" ${S}/><rect x="-18" y="-22" width="36" height="12" fill="${C.cream}"/><line x1="-30" y1="26" x2="30" y2="26" stroke="${C.ink}" stroke-width="4"/></g>
  <g transform="translate(${x + 62} ${by + 80})"><circle r="16" fill="none" ${S}/><rect x="-10" y="14" width="20" height="30" rx="4" fill="${C.amber}" ${S}/><rect x="10" y="6" width="20" height="30" rx="4" fill="${C.teal}" ${S} transform="rotate(-35 10 6)"/></g>`;

  // 5 Shelly the hermit crab
  marks.push(s.length);
  x = xs[4];
  s += `<path d="M${x - 70} ${g - 40} L${x - 96} ${g - 6}M${x - 50} ${g - 30} L${x - 62} ${g - 2}M${x + 40} ${g - 30} L${x + 52} ${g - 2}M${x + 62} ${g - 40} L${x + 88} ${g - 6}" fill="none" stroke="${C.ink}" stroke-width="9" stroke-linecap="round"/>
  <path d="M${x - 62} ${g - 46} C${x - 76} ${g - 190} ${x + 96} ${g - 200} ${x + 86} ${g - 46} Z" fill="${C.amber}" ${S}/>
  <path d="M${x - 40} ${g - 120} C${x - 10} ${g - 176} ${x + 62} ${g - 160} ${x + 64} ${g - 100}" fill="none" ${S}/>
  <rect x="${x - 26}" y="${g - 118}" width="86" height="56" rx="8" fill="${C.black}" ${S}/>
  <text x="${x - 14}" y="${g - 80}" font-family="'DejaVu Sans Mono', monospace" font-weight="700" font-size="28" fill="${C.green}">&gt;_</text>
  <ellipse cx="${x - 30}" cy="${g - 44}" rx="62" ry="34" fill="${C.coral}" ${S}/>
  <path d="M${x - 56} ${g - 70} V${g - 112}M${x - 22} ${g - 74} V${g - 116}" fill="none" ${S}/>
  <circle cx="${x - 56}" cy="${g - 118}" r="13" fill="${C.white}" ${S}/><circle cx="${x - 22}" cy="${g - 122}" r="13" fill="${C.white}" ${S}/>
  <circle cx="${x - 54}" cy="${g - 118}" r="5" fill="${C.ink}"/><circle cx="${x - 20}" cy="${g - 122}" r="5" fill="${C.ink}"/>
  <path d="M${x - 50} ${g - 36} Q${x - 36} ${g - 26} ${x - 22} ${g - 36}" fill="none" ${S}/>
  <path d="M${x - 88} ${g - 50} q-30 -4 -26 -34 q22 -6 34 14 z" fill="${C.coral}" ${S}/>
  <g transform="translate(${x - 112} ${g - 120}) rotate(-12)"><rect x="-13" y="-8" width="26" height="46" rx="5" fill="${C.ink}"/><rect x="-8" y="-2" width="16" height="12" rx="2" fill="${C.green}"/><line x1="6" y1="-8" x2="6" y2="-30" stroke="${C.ink}" stroke-width="5" stroke-linecap="round"/></g>`;

  // 6 Gridlock
  marks.push(s.length);
  x = xs[5]; const ky = g - 110;
  const rope = (d) => `<path d="${d}" fill="none" stroke="${C.ink}" stroke-width="40" stroke-linecap="round"/><path d="${d}" fill="none" stroke="${C.grey}" stroke-width="30" stroke-linecap="round"/>`;
  s += rope(`M${x - 84} ${g - 14} C${x - 100} ${ky - 60} ${x + 20} ${ky - 110} ${x + 50} ${ky - 30}`);
  s += rope(`M${x + 86} ${g - 14} C${x + 100} ${ky - 40} ${x - 30} ${ky - 110} ${x - 54} ${ky - 20}`);
  s += rope(`M${x - 60} ${ky + 40} C${x - 20} ${ky + 90} ${x + 40} ${ky + 80} ${x + 62} ${ky + 20}`);
  s += rope(`M${x - 40} ${ky + 10} C${x - 10} ${ky - 30} ${x + 20} ${ky - 30} ${x + 40} ${ky + 10}`);
  s += `<circle cx="${x - 22}" cy="${ky - 4}" r="15" fill="${C.white}" ${S}/><circle cx="${x + 22}" cy="${ky - 4}" r="15" fill="${C.white}" ${S}/>
  <circle cx="${x - 19}" cy="${ky - 1}" r="6" fill="${C.coral}"/><circle cx="${x + 19}" cy="${ky - 1}" r="6" fill="${C.coral}"/>
  <path d="M${x - 42} ${ky - 26} L${x - 8} ${ky - 14}M${x + 42} ${ky - 26} L${x + 8} ${ky - 14}" fill="none" ${S}/>
  <path d="M${x - 14} ${ky + 36} Q${x} ${ky + 26} ${x + 14} ${ky + 36}" fill="none" ${S}/>`;


  // 7 Lockhart
  marks.push(s.length);
  x = 1300; by = g - 172; hy = by - 42;
  s += person(x, g, C.ink, '#C98B5E', { long: true, noSmile: true });
  s += `<path d="M${x - 56} ${hy - 22} A56 50 0 0 1 ${x + 56} ${hy - 22} Z" fill="${C.grey}" ${S}/><rect x="${x - 66}" y="${hy - 28}" width="132" height="14" rx="7" fill="${C.ink}"/>
  <path d="M${x - 12} ${hy + 24} H${x + 12}" fill="none" ${S}/>
  <path d="M${x - 30} ${by + 20} Q${x} ${by + 70} ${x + 30} ${by + 20}" fill="none" stroke="${C.grey}" stroke-width="4" stroke-dasharray="6 5"/>
  <g transform="translate(${x} ${by + 62})"><circle r="13" fill="none" stroke="${C.amber}" stroke-width="8"/><rect x="-5" y="14" width="10" height="44" rx="3" fill="${C.amber}"/><rect x="5" y="40" width="14" height="8" fill="${C.amber}"/><rect x="5" y="52" width="10" height="6" fill="${C.amber}"/></g>`;
  // 8 Belle
  marks.push(s.length);
  x = 1500; by = g - 142; hy = by - 42;
  s += `<path d="M${x - 58} ${hy + 30} Q${x - 70} ${hy - 70} ${x} ${hy - 64} Q${x + 70} ${hy - 70} ${x + 58} ${hy + 30}Z" fill="${C.ink}"/>`;
  s += person(x, g, C.coral, '#F6D2B0');
  s += `<line x1="${x + 76}" y1="${g}" x2="${x + 76}" y2="${hy - 40}" ${S}/>
  <path d="M${x + 48} ${hy - 40} Q${x + 50} ${hy - 96} ${x + 76} ${hy - 98} Q${x + 102} ${hy - 96} ${x + 104} ${hy - 40} Z" fill="${C.amber}" ${S}/><circle cx="${x + 76}" cy="${hy - 34}" r="8" fill="${C.ink}"/>
  <rect x="${x - 44}" y="${by + 58}" width="52" height="40" rx="6" fill="${C.cream}" ${S}/><path d="M${x - 44} ${by + 62} L${x - 18} ${by + 80} L${x + 8} ${by + 62}" fill="none" ${S}/>`;
  // 9 Sentry
  marks.push(s.length);
  x = 1700; by = g - 142; hy = by - 42;
  s += person(x, g, '#3E6FB0', '#8D5A3B', { noSmile: true });
  s += `<path d="M${x - 56} ${hy - 14} A56 56 0 0 1 ${x + 56} ${hy - 14} Z" fill="${C.grey}" ${S}/><rect x="${x - 6}" y="${hy - 84}" width="12" height="20" rx="4" fill="${C.coral}" ${S}/>
  <path d="M${x - 10} ${hy + 24} H${x + 10}" fill="none" ${S}/>
  <path d="M${x - 92} ${by + 20} H${x - 8} V${by + 76} Q${x - 10} ${by + 112} ${x - 50} ${by + 128} Q${x - 90} ${by + 112} ${x - 92} ${by + 76}Z" fill="${C.teal}" ${S}/>
  <text x="${x - 50}" y="${by + 78}" text-anchor="middle" font-family="'DejaVu Sans Mono', monospace" font-weight="700" font-size="26" fill="${C.white}">rwx</text>`;
  marks.push(s.length);
  const names = [['Mayor Root', 'root user'], ['Tick', 'CPU scheduler'], ['Paige', 'memory manager'], ['Archie', 'file system'], ['Shelly', 'the shell'], ['Gridlock', 'deadlock']];
  names.forEach((n, i) => { s += label(xs[i], g + 52, n[0], n[1]); });
  return { w: 1200, h: 520, s };
}

function resident(cx, g, col, pid, icon) {
  return `<ellipse cx="${cx}" cy="${g + 4}" rx="30" ry="5" fill="${C.ink}" opacity="0.12"/>
  <rect x="${cx - 24}" y="${g - 62}" width="48" height="62" rx="20" fill="${col}" ${S}/>
  <circle cx="${cx}" cy="${g - 84}" r="26" fill="#F1D9BD" ${S}/>
  <circle cx="${cx - 9}" cy="${g - 86}" r="3.5" fill="${C.ink}"/><circle cx="${cx + 9}" cy="${g - 86}" r="3.5" fill="${C.ink}"/>
  <rect x="${cx - 15}" y="${g - 46}" width="30" height="20" rx="4" fill="${C.white}" stroke="${C.ink}" stroke-width="3"/>
  <text x="${cx}" y="${g - 31}" text-anchor="middle" font-family="'DejaVu Sans Mono', monospace" font-weight="700" font-size="13" fill="${C.ink}">${pid}</text>
  <text x="${cx}" y="${g - 122}" text-anchor="middle" font-size="20">${icon}</text>`;
}

function screen() {
  const f = `font-family="Nunito, 'Trebuchet MS', Verdana, sans-serif"`, m = `font-family="'DejaVu Sans Mono', Menlo, monospace"`;
  let s = `<rect width="1200" height="560" fill="${C.cream}"/><rect x="600" width="600" height="560" fill="${C.black}"/>`;
  // town view
  s += `<text x="32" y="48" ${f} font-weight="800" font-size="26" fill="${C.ink}">Town view</text>
  <text x="32" y="76" ${f} font-size="17" fill="${C.ink}">Level 3.1: serve the line in the order they arrived</text>
  <rect x="0" y="400" width="600" height="160" fill="#F1E4C8"/><line x1="0" y1="400" x2="600" y2="400" stroke="${C.ink}" stroke-width="4"/>
  <path d="M28 250 L118 180 L208 250Z" fill="${C.coral}" ${S}/><rect x="40" y="250" width="156" height="150" fill="${C.white}" ${S}/>
  <rect x="88" y="300" width="60" height="100" rx="6" fill="${C.teal}" fill-opacity="0.25" ${S}/>
  <text x="118" y="232" text-anchor="middle" ${f} font-weight="800" font-size="16" fill="${C.white}">WORKSHOP</text>`;
  s += resident(118, 400, C.teal, '11', '');
  [[270, '12'], [350, '13'], [430, '14'], [510, '15']].forEach(([x, p]) => { s += resident(x, 400, C.amber, p, ''); });
  s += `<path d="M236 432 H548" stroke="${C.ink}" stroke-width="3" stroke-dasharray="8 8"/>
  <text x="392" y="462" text-anchor="middle" ${f} font-weight="700" font-size="18" fill="${C.ink}">the line</text>
  <text x="118" y="462" text-anchor="middle" ${f} font-weight="700" font-size="18" fill="${C.ink}">working</text>
  <rect x="32" y="490" width="536" height="50" rx="14" fill="${C.white}" ${S}/>
  <text x="52" y="522" ${f} font-size="17" fill="${C.ink}"><tspan font-weight="800">Tick:</tspan> One slow job and the whole line waits. Is that fair?</text>`;
  // lens view
  s += `<text x="632" y="48" ${m} font-weight="700" font-size="24" fill="${C.cream}">Lens view</text>
  <text x="632" y="76" ${m} font-size="15" fill="${C.amber}">FCFS scheduling: first come, first served</text>
  <rect x="640" y="250" width="156" height="150" rx="6" fill="none" stroke="${C.teal}" stroke-width="4"/>
  <text x="718" y="238" text-anchor="middle" ${m} font-weight="700" font-size="16" fill="${C.teal}">CPU</text>
  <text x="718" y="318" text-anchor="middle" ${m} font-weight="700" font-size="20" fill="${C.cream}">PID 11</text>
  <text x="718" y="346" text-anchor="middle" ${m} font-size="15" fill="${C.teal}">running</text>
  <text x="718" y="372" text-anchor="middle" ${m} font-size="15" fill="${C.cream}">burst 24</text>`;
  [[840, '12', 3], [925, '13', 3], [1010, '14', 7], [1095, '15', 2]].forEach(([x, p, b]) => {
    s += `<rect x="${x}" y="290" width="72" height="110" rx="6" fill="none" stroke="${C.amber}" stroke-width="4"/>
    <text x="${x + 36}" y="326" text-anchor="middle" ${m} font-weight="700" font-size="17" fill="${C.cream}">PID ${p}</text>
    <text x="${x + 36}" y="352" text-anchor="middle" ${m} font-size="14" fill="${C.amber}">ready</text>
    <text x="${x + 36}" y="378" text-anchor="middle" ${m} font-size="14" fill="${C.cream}">burst ${b}</text>`;
  });
  s += `<text x="1003" y="432" text-anchor="middle" ${m} font-size="16" fill="${C.amber}">ready queue</text>
  <path d="M836 345 H804" stroke="${C.cream}" stroke-width="3"/><path d="M812 337 L800 345 L812 353Z" fill="${C.cream}"/>
  <rect x="632" y="490" width="536" height="50" rx="8" fill="none" stroke="${C.green}" stroke-width="3"/>
  <text x="652" y="521" ${m} font-size="16" fill="${C.green}">avg waiting time = (24+27+30+37)/4 = 29.5</text>`;
  return { w: 1200, h: 560, s };
}


const crops = { root: 125, tick: 290, paige: 485, archie: 705, shelly: 890, gridlock: 1096, lockhart: 1300, belle: 1505, sentry: 1690 };
const full = cast().s, prefix = full.slice(0, marks[0]);
Object.entries(crops).forEach(([k, c], i) => {
  fs.writeFileSync(path.join(out, k + '.svg'), `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${c - 125} 70 250 340">${prefix}${full.slice(marks[i], marks[i + 1])}</svg>`);
});
