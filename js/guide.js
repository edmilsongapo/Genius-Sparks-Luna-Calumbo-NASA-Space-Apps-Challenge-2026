/* Kiala: guia do projeto. Modo iniciante/experiente guardado em localStorage (opcional). */
const LC={get mode(){try{return localStorage.getItem('lc_mode')||'novo'}catch(e){return 'novo'}},set mode(v){try{localStorage.setItem('lc_mode',v)}catch(e){}},
get suit(){try{return localStorage.getItem('lc_suit')||'#d6122f'}catch(e){return '#d6122f'}},set suit(v){try{localStorage.setItem('lc_suit',v)}catch(e){}}};
function kiala(msgNovo,msgPro){const w=document.createElement('div');w.className='who';
const svg=()=>`<svg viewBox="0 0 60 80" width="56" height="74" role="img" aria-label="Kiala, a astronauta guia"><rect x="14" y="30" width="32" height="38" rx="8" fill="#eee"/><rect x="14" y="48" width="32" height="7" fill="${LC.suit}"/><rect x="14" y="55" width="32" height="3" fill="#f9d200"/><circle cx="30" cy="20" r="15" fill="#eee"/><ellipse cx="30" cy="20" rx="10" ry="8" fill="#14203d"/><circle cx="26" cy="17" r="2.5" fill="#9cc3ff"/><rect x="16" y="66" width="10" height="12" rx="3" fill="#ccc"/><rect x="34" y="66" width="10" height="12" rx="3" fill="#ccc"/></svg>`;
const b=document.createElement('div');b.className='bub';b.setAttribute('aria-live','polite');
const set=()=>{b.innerHTML='<b>Kiala:</b> '+(LC.mode==='pro'?msgPro:msgNovo)};
const a=document.createElement('button');a.className='av';a.title='Muda a cor do fato';a.innerHTML=svg();
a.onclick=()=>{const c=['#d6122f','#f9d200','#3fbf7a','#3c82e0'];LC.suit=c[(c.indexOf(LC.suit)+1)%c.length];a.innerHTML=svg()};
w.append(b,a);document.body.append(w);set();return set}
