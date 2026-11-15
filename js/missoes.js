const $=i=>document.getElementById(i);
kiala('Na base, cada módulo gasta energia. Painéis dão 2 kW de dia, o reactor dá 10 kW sempre. Tenta o equilíbrio!','Base: limite 20 t. Painel 2 kW/1 t (só de dia), reactor 10 kW/3 t. Noite: só reactores.');
const M=[["Habitat",3,5],["Laboratório",2,3],["Comunicações",1,1],["Oxigénio",2,2],["Extração de gelo",4,4]];
const st={mods:M.map(()=>1),pan:2,rea:0};
function bs(){$('bd').textContent=LC.mode==='pro'?'Massa máxima 20 t. Sobrevive à noite com reactores.':'Liga os módulos que quiseres. A base precisa de energia de dia e de noite, e não pode pesar mais de 20 toneladas.';
$('mods').innerHTML=M.map((m,i)=>`<label style="display:inline-block;margin-right:14px"><input type="checkbox" data-i="${i}" ${st.mods[i]?'checked':''}> ${m[0]} (${m[1]} kW, ${m[2]} t)</label>`).join('')+`<label>Painéis solares: ${st.pan}<input type="range" id="p" min="0" max="8" value="${st.pan}"></label><label>Reactores: ${st.rea}<input type="range" id="r" min="0" max="3" value="${st.rea}"></label>`;
document.querySelectorAll('[data-i]').forEach(c=>c.onchange=()=>{st.mods[+c.dataset.i]=c.checked?1:0;bs()});$('p').oninput=e=>{st.pan=+e.target.value;bs()};$('r').oninput=e=>{st.rea=+e.target.value;bs()};
const dem=M.reduce((a,m,i)=>a+st.mods[i]*m[1],0),mass=M.reduce((a,m,i)=>a+st.mods[i]*m[2],0)+st.pan+st.rea*3,day=st.pan*2+st.rea*10,night=st.rea*10;
const ok=mass<=20&&day>=dem&&night>=dem*.5;
$('bo').innerHTML=`<p>Consumo: <b>${dem} kW</b> · Massa: <b>${mass} t</b> · Energia de dia: ${day} kW · de noite: ${night} kW (a base reduz para metade à noite)</p><p class="${ok?'ok':'bad'}"><b>${mass>20?'Pesada demais.':day<dem?'Falta energia de dia.':night<dem*.5?'Sem energia suficiente à noite.':'A base sobrevive à noite lunar.'}</b></p>`}
bs();
/* Rover */
const c=$('cv'),x=c.getContext('2d');let r,run=false,t0,pts,cr,keys={};
function init(){r={x:240,y:160};pts=[...Array(5)].map(()=>({x:30+Math.random()*420,y:30+Math.random()*260}));cr=[...Array(4)].map(()=>({x:40+Math.random()*400,y:40+Math.random()*240,r:24}));t0=performance.now();run=true;loop()}
const K={ArrowUp:'u',w:'u',ArrowDown:'d',s:'d',ArrowLeft:'l',a:'l',ArrowRight:'r',d:'r'};
addEventListener('keydown',e=>{if(K[e.key]){keys[K[e.key]]=1;if(run)e.preventDefault()}});addEventListener('keyup',e=>{if(K[e.key])keys[K[e.key]]=0});
document.querySelectorAll('[data-d]').forEach(b=>{const k=b.dataset.d;['pointerdown'].forEach(v=>b.addEventListener(v,()=>keys[k]=1));['pointerup','pointerleave'].forEach(v=>b.addEventListener(v,()=>keys[k]=0))});
function loop(){if(!run)return;const left=30-(performance.now()-t0)/1000;
r.x+=((keys.r?1:0)-(keys.l?1:0))*2.6;r.y+=((keys.d?1:0)-(keys.u?1:0))*2.6;r.x=Math.max(8,Math.min(472,r.x));r.y=Math.max(8,Math.min(312,r.y));
pts=pts.filter(p=>Math.hypot(p.x-r.x,p.y-r.y)>14);
const hit=cr.some(q=>Math.hypot(q.x-r.x,q.y-r.y)<q.r);
x.clearRect(0,0,480,320);cr.forEach(q=>{x.fillStyle='#d6122f88';x.beginPath();x.arc(q.x,q.y,q.r,0,7);x.fill()});pts.forEach(p=>{x.fillStyle='#f9d200';x.beginPath();x.arc(p.x,p.y,6,0,7);x.fill()});x.fillStyle='#eee';x.fillRect(r.x-9,r.y-6,18,12);
$('rs').textContent=`Tempo: ${Math.max(0,left).toFixed(0)} s · Amostras: ${5-pts.length}/5`;
if(hit||left<=0||!pts.length){run=false;$('rs').textContent=hit?'O rover caiu numa cratera.':!pts.length?'Missão cumprida! Todas as amostras recolhidas.':'Tempo esgotado.';return}
requestAnimationFrame(loop)}
$('st').onclick=init;
