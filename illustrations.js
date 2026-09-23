// 그림 레시피용 공정 일러스트 (인라인 SVG, viewBox 0 0 120 90)
(function () {
  'use strict';

  const C = {
    pot: '#8d8f95', potDark: '#5f6168', water: '#8cc5e8', waterDeep: '#5aa6d6',
    bean: '#e7c46a', beanDark: '#c9a043', milk: '#fbf6e9', tofu: '#fffaf0', tofuSide: '#eadfc4',
    fire: '#f08a3c', fireIn: '#ffd166', wood: '#b0824d', woodDark: '#86602f', cloth: '#f1ece0',
    steel: '#c9ccd2', ink: '#4a4238', salt: '#9fd3c7', red: '#e0735e',
  };

  const beans = (pts, r = 4.2) => pts.map(([x, y]) =>
    `<ellipse cx="${x}" cy="${y}" rx="${r}" ry="${r * 0.8}" fill="${C.bean}" stroke="${C.beanDark}" stroke-width="1"/>`).join('');
  const steam = (xs, y) => xs.map((x) =>
    `<path d="M${x} ${y} q-5 -6 0 -12 q5 -6 0 -12" fill="none" stroke="#b9c3cc" stroke-width="2.2" stroke-linecap="round" opacity=".8"/>`).join('');
  const drops = (pts) => pts.map(([x, y]) =>
    `<path d="M${x} ${y} q-3 5 0 7 q3 -2 0 -7z" fill="${C.waterDeep}"/>`).join('');
  const clock = (x, y) => `<g transform="translate(${x} ${y})"><circle r="11" fill="#fff" stroke="${C.ink}" stroke-width="2"/>
    <path d="M0 -6 V0 L5 3" stroke="${C.ink}" stroke-width="2" fill="none" stroke-linecap="round"/></g>`;
  const fire = (cx, y) => `<g transform="translate(${cx} ${y})">
    <path d="M-22 0 q4 -12 10 -8 q-2 -10 8 -14 q-1 10 6 10 q4 -8 10 -6 q-3 8 4 18z" fill="${C.fire}"/>
    <path d="M-10 0 q2 -7 6 -5 q0 -6 5 -8 q0 6 4 7 q3 -3 5 -1 q-1 4 1 7z" fill="${C.fireIn}"/></g>`;
  const pot = (x, y, w, h, fill) => `
    <rect x="${x - 6}" y="${y + 3}" width="7" height="5" rx="2" fill="${C.potDark}"/>
    <rect x="${x + w - 1}" y="${y + 3}" width="7" height="5" rx="2" fill="${C.potDark}"/>
    <path d="M${x} ${y} h${w} v${h - 6} q0 6 -6 6 h${-(w - 12)} q-6 0 -6 -6z" fill="${C.pot}"/>
    ${fill ? `<rect x="${x + 3}" y="${y + 3}" width="${w - 6}" height="7" rx="2" fill="${fill}"/>` : ''}
    <rect x="${x - 2}" y="${y - 3}" width="${w + 4}" height="5" rx="2" fill="${C.potDark}"/>`;
  const tofuBlock = (x, y, s = 1) => `<g transform="translate(${x} ${y}) scale(${s})">
    <path d="M0 10 L22 0 L44 10 L22 20z" fill="${C.tofu}" stroke="#d9cba8" stroke-width="1"/>
    <path d="M0 10 L22 20 V36 L0 26z" fill="${C.tofuSide}"/>
    <path d="M44 10 L22 20 V36 L44 26z" fill="#ddcfaf"/></g>`;

  const ART = {
    sort: `
      <ellipse cx="60" cy="66" rx="40" ry="10" fill="${C.potDark}" opacity=".15"/>
      <path d="M20 44 h80 q-4 26 -40 26 q-36 0 -40 -26z" fill="${C.wood}"/>
      <path d="M20 44 h80" stroke="${C.woodDark}" stroke-width="3"/>
      ${beans([[38, 44], [48, 41], [58, 43], [68, 41], [78, 44], [53, 37], [64, 36], [44, 36], [73, 36]])}
      <circle cx="96" cy="24" r="7" fill="none" stroke="${C.red}" stroke-width="2.5"/>
      <path d="M91 19 l10 10" stroke="${C.red}" stroke-width="2.5"/>
      <ellipse cx="96" cy="24" rx="3" ry="2.4" fill="#8a6d3b"/>
      ${drops([[26, 18], [34, 12], [30, 26]])}`,
    soak: `
      <path d="M28 26 h64 l-6 50 h-52z" fill="${C.water}" opacity=".55"/>
      <path d="M28 26 h64 l-6 50 h-52z" fill="none" stroke="${C.potDark}" stroke-width="3" stroke-linejoin="round"/>
      <path d="M31 36 q7 -4 14 0 t14 0 t14 0 t14 0" fill="none" stroke="#fff" stroke-width="2" opacity=".8"/>
      ${beans([[42, 64], [52, 67], [62, 64], [72, 67], [47, 57], [57, 58], [67, 57], [77, 60], [52, 50], [64, 50]], 5)}
      ${clock(100, 20)}
      <text x="100" y="45" text-anchor="middle" font-size="9" font-weight="700" fill="${C.ink}">×2.2</text>`,
    grind: `
      <path d="M42 8 h36 l-10 18 h-16z" fill="${C.steel}" stroke="${C.potDark}" stroke-width="2"/>
      ${beans([[54, 10], [63, 12], [58, 5]], 3.6)}
      <rect x="36" y="26" width="48" height="26" rx="6" fill="${C.pot}"/>
      <circle cx="60" cy="39" r="8" fill="${C.potDark}"/><path d="M60 31 v16 M52 39 h16" stroke="${C.steel}" stroke-width="2"/>
      <path d="M84 36 q10 0 10 8 v6" stroke="${C.water}" stroke-width="4" fill="none" stroke-linecap="round"/>
      <path d="M52 52 v6" stroke="${C.milk}" stroke-width="5"/>
      <path d="M36 60 h48 l-4 20 h-40z" fill="${C.milk}" stroke="${C.potDark}" stroke-width="2"/>
      <path d="M40 66 h40" stroke="#efe3c6" stroke-width="3"/>`,
    boil: `
      ${steam([44, 60, 76], 22)}
      ${pot(30, 32, 60, 30, C.milk)}
      <circle cx="46" cy="37" r="2" fill="#fff"/><circle cx="66" cy="36" r="2.5" fill="#fff"/><circle cx="76" cy="38" r="1.6" fill="#fff"/>
      ${fire(60, 84)}
      <rect x="89" y="9" width="27" height="13" rx="3" fill="#fff" stroke="${C.ink}" stroke-width="1.5"/>
      <text x="102.5" y="19" text-anchor="middle" font-size="8" font-weight="700" fill="${C.red}">100℃</text>`,
    strain: `
      ${pot(28, 56, 64, 26, C.milk)}
      <path d="M40 12 q20 -8 40 0 l-6 34 q-14 8 -28 0z" fill="${C.cloth}" stroke="#cbbf9f" stroke-width="2"/>
      <path d="M46 22 q14 5 28 0 M48 32 q12 4 24 0" stroke="#d8ccaf" stroke-width="1.5" fill="none"/>
      <path d="M36 16 q-8 10 4 18 M84 16 q8 10 -4 18" stroke="#c49a6c" stroke-width="5" fill="none" stroke-linecap="round"/>
      ${drops([[52, 48], [60, 52], [68, 48]]).replaceAll(C.waterDeep, '#efe3c6')}
      <text x="104" y="30" text-anchor="middle" font-size="8" fill="${C.ink}">비지</text>
      <path d="M96 34 l-12 4" stroke="${C.ink}" stroke-width="1.2"/>`,
    coagulate: `
      ${pot(24, 44, 64, 34, C.milk)}
      <path d="M36 50 q8 4 16 0 t16 0 t16 0" stroke="#e5d6b3" stroke-width="2" fill="none"/>
      <path d="M76 8 l-22 44" stroke="${C.woodDark}" stroke-width="4" stroke-linecap="round"/>
      <ellipse cx="52" cy="54" rx="7" ry="4" fill="${C.wood}"/>
      <path d="M40 36 a18 8 0 1 0 36 0" fill="none" stroke="${C.ink}" stroke-width="1.5" stroke-dasharray="3 3"/>
      <path d="M74 36 l4 -2 l-1 5z" fill="${C.ink}"/>
      <rect x="92" y="8" width="14" height="22" rx="3" fill="${C.salt}" stroke="#5f9f92" stroke-width="1.5"/>
      <rect x="95" y="4" width="8" height="5" rx="1" fill="#5f9f92"/>
      <text x="99" y="23" text-anchor="middle" font-size="7" font-weight="700" fill="#2f5f56">간수</text>
      ${drops([[94, 36], [90, 44]]).replaceAll(C.waterDeep, '#5f9f92')}`,
    rest: `
      ${pot(26, 36, 68, 38, null)}
      <rect x="29" y="39" width="62" height="10" rx="2" fill="#dce9ef"/>
      <circle cx="40" cy="47" r="5" fill="${C.tofu}"/><circle cx="52" cy="45" r="6" fill="${C.tofu}"/>
      <circle cx="64" cy="47" r="5" fill="${C.tofu}"/><circle cx="76" cy="45" r="6" fill="${C.tofu}"/><circle cx="86" cy="47" r="4" fill="${C.tofu}"/>
      <path d="M22 30 h76 q-4 -10 -38 -10 q-34 0 -38 10z" fill="${C.potDark}"/><rect x="54" y="14" width="12" height="6" rx="2" fill="${C.potDark}"/>
      ${clock(104, 18)}`,
    mold: `
      <path d="M20 44 h80 v26 h-80z" fill="${C.wood}"/>
      <path d="M24 44 h72 v22 h-72z" fill="${C.cloth}"/>
      <path d="M20 44 h80" stroke="${C.woodDark}" stroke-width="3"/>
      <path d="M20 70 h80" stroke="${C.woodDark}" stroke-width="3"/>
      <circle cx="40" cy="52" r="6" fill="${C.tofu}" stroke="#e2d6b8"/><circle cx="54" cy="50" r="7" fill="${C.tofu}" stroke="#e2d6b8"/>
      <circle cx="68" cy="53" r="6" fill="${C.tofu}" stroke="#e2d6b8"/><circle cx="80" cy="50" r="6" fill="${C.tofu}" stroke="#e2d6b8"/>
      <path d="M70 8 q18 2 16 16 l-6 12 q-10 2 -16 -4z" fill="${C.pot}"/>
      <circle cx="74" cy="38" r="3.5" fill="${C.tofu}"/><circle cx="70" cy="42" r="2.5" fill="${C.tofu}"/>
      ${drops([[30, 74], [60, 76], [88, 74]])}`,
    press: `
      <path d="M20 50 h80 v22 h-80z" fill="${C.wood}"/>
      <path d="M24 50 h72 v18 h-72z" fill="${C.tofu}"/>
      <rect x="18" y="44" width="84" height="7" rx="2" fill="${C.woodDark}"/>
      <rect x="38" y="16" width="44" height="28" rx="5" fill="${C.potDark}"/>
      <text x="60" y="35" text-anchor="middle" font-size="11" font-weight="700" fill="#fff">kg</text>
      <path d="M60 4 v8 M54 8 l6 6 l6 -6" stroke="${C.red}" stroke-width="3" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
      ${drops([[22, 76], [34, 80], [86, 80], [98, 76]])}`,
    cool: `
      <path d="M14 38 h92 l-6 38 h-80z" fill="${C.water}" opacity=".55"/>
      <path d="M14 38 h92 l-6 38 h-80z" fill="none" stroke="${C.potDark}" stroke-width="3" stroke-linejoin="round"/>
      ${tofuBlock(38, 36, 1)}
      <path d="M17 46 q8 -4 16 0 t16 0 t16 0 t16 0 t16 0 t8 0" fill="none" stroke="#fff" stroke-width="2" opacity=".8"/>
      <circle cx="26" cy="60" r="2.5" fill="#fff" opacity=".8"/><circle cx="92" cy="64" r="3" fill="#fff" opacity=".8"/>
      <path d="M96 10 v16 M88 14 l16 8 M104 14 l-16 8" stroke="${C.waterDeep}" stroke-width="2.4" stroke-linecap="round"/>`,
    cut: `
      ${tofuBlock(20, 30, 1.4)}
      <path d="M36 36 l30 14 M51 29 l30 14" stroke="#cdbd96" stroke-width="1.5" stroke-dasharray="3 2"/>
      <path d="M78 10 l24 -4 l-2 8 z" fill="${C.steel}" stroke="${C.potDark}" stroke-width="1.5"/>
      <rect x="100" y="4" width="14" height="7" rx="2" transform="rotate(-10 107 7)" fill="${C.woodDark}"/>
      <rect x="84" y="56" width="26" height="18" rx="3" fill="#fff" stroke="${C.ink}" stroke-width="1.5"/>
      <path d="M88 62 h18 M88 67 h12" stroke="${C.ink}" stroke-width="1.5"/>`,
  };

  // 사용자 레시피처럼 icon 이 없을 때 단계명으로 추정
  const GUESS = [
    ['cool', /찬물|냉각|담금|식히/], ['press', /압착|누르/], ['mold', /틀|성형|순물/],
    ['rest', /대기|뜸|순두부|몽글/], ['coagulate', /응고|간수|젓/], ['strain', /비지|짜|여과|거르/],
    ['boil', /끓|가열|소포|거품/], ['grind', /갈|마쇄|분쇄/], ['soak', /불림|불리/],
    ['sort', /선별|세척|씻/], ['cut', /자르|포장|절단|보관/],
  ];
  function guessIcon(step) {
    if (step.icon && ART[step.icon]) return step.icon;
    const t = (step.title || '') + ' ' + (step.detail || '');
    return (GUESS.find(([, re]) => re.test(step.title || '')) || GUESS.find(([, re]) => re.test(t)) || ['boil'])[0];
  }

  window.TofuArt = {
    keys: Object.keys(ART),
    guessIcon,
    svg(key, cls = '') {
      return `<svg class="art ${cls}" viewBox="0 0 120 90" role="img" aria-hidden="true">${ART[key] || ART.boil}</svg>`;
    },
    tofu(firmness = 3) {
      // 경도에 따라 두부 모양이 달라지는 미니 일러스트 (1 부드러움 ~ 5 단단함)
      const h = 10 + firmness * 3;
      const wob = firmness <= 2 ? 'q22 6 44 0' : 'l44 0';
      return `<svg class="art tofu-mini" viewBox="0 0 60 50" aria-hidden="true">
        <path d="M8 ${40 - h} L30 ${32 - h} L52 ${40 - h} L30 ${48 - h}z" fill="${C.tofu}" stroke="#d9cba8"/>
        <path d="M8 ${40 - h} L30 ${48 - h} V48 L8 40z" fill="${C.tofuSide}"/>
        <path d="M52 ${40 - h} L30 ${48 - h} V48 L52 40z" fill="#ddcfaf"/>
        ${firmness <= 2 ? `<path d="M8 40 ${wob}" stroke="#cdbd96" fill="none"/>` : ''}
      </svg>`;
    },
  };
})();
