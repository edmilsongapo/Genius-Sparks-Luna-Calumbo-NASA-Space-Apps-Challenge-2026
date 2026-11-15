/* guardar progresso */
function save(){try{localStorage.setItem('lc_save',JSON.stringify({ph:S.ph,done:S.done,F:S.F,sp:S.sp,R:S.R,day:S.day,site:S.site,d0:S.d0,cr:S.cr}))}catch(e){}}
function load(){try{Object.assign(S,JSON.parse(localStorage.getItem('lc_save')||'{}'))}catch(e){}}
const _r=render;render=function(){_r();save()};
/* mini-jogo de aterragem */
function land(){const s=SITES[S.site],pad=Math.max(70,150-s.dv*500),px=250+Math.random()*300,K={},M={ArrowLeft:'l',KeyA:'l',ArrowRight:'r',KeyD:'r',ArrowUp:'u',KeyW:'u'};
const st={x:400,y:30,vx:(Math.random()-.5)*40,vy:0,a:0,fuel:90+Math.max(0,dvAv()-need())*250};
$("app").innerHTML=`<div class="card"><div class="k">Fase 3 · ${s.n}</div><h2>Pousa na plataforma</h2><p>Setas ou A/W/D. Velocidade < 28, inclinação pequena. Combustível = a tua margem de Δv.</p><canvas id="cv" width="800" height="400"></canvas><div class="row" id="ht"></div><div class="pad"><button class="btn g" data-k="l">◀</button><button class="btn g" data-k="u">▲</button><button class="btn g" data-k="r">▶</button></div><div id="res"></div></div>`;
const kd=e=>{if(M[e.code]){K[M[e.code]]=1;e.preventDefault()}},ku=e=>{if(M[e.code])K[M[e.code]]=0};addEventListener('keydown',kd);addEventListener('keyup',ku);
document.querySelectorAll('[data-k]').forEach(b=>{b.onpointerdown=()=>K[b.dataset.k]=1;b.onpointerup=b.onpointerleave=()=>K[b.dataset.k]=0});
const c=$("cv").getContext("2d");let last=performance.now();
function f(now){if(!$("ht")){removeEventListener('keydown',kd);removeEventListener('keyup',ku);return}const dt=Math.min(.05,(now-last)/1000);last=now;
if(K.l)st.a-=2*dt;if(K.r)st.a+=2*dt;const th=K.u&&st.fuel>0;
if(th){st.fuel-=10*dt;st.vx+=Math.sin(st.a)*32*dt;st.vy-=Math.cos(st.a)*32*dt}
st.vy+=14*dt;st.x+=st.vx*dt;st.y+=st.vy*dt;
c.fillStyle="#000";c.fillRect(0,0,800,400);c.fillStyle="#555";c.fillRect(0,370,800,30);c.fillStyle="#ffc83d";c.fillRect(px-pad/2,368,pad,5);
c.save();c.translate(st.x,st.y);c.rotate(st.a);c.fillStyle="#e8e4da";c.beginPath();c.moveTo(0,-14);c.lineTo(10,10);c.lineTo(-10,10);c.fill();
if(th){c.fillStyle="#e0301e";c.fillRect(-4,10,8,12)}c.restore();
$("ht").innerHTML=m("Combustível",Math.max(0,Math.round(st.fuel)),"u")+m("VELOCIDADE",Math.round(st.vy),"")+m("INCLINAÇÃO",Math.round(st.a*57),"°");
if(st.y>=370||st.x<0||st.x>800){removeEventListener('keydown',kd);removeEventListener('keyup',ku);
const ok=st.y>=370&&Math.abs(st.vx)<18&&st.vy<28&&Math.abs(st.a)<.3&&Math.abs(st.x-px)<pad/2;
if(!ok)S.cr=(S.cr||0)+1;
$("res").innerHTML=`<div class="msg ${ok?"ok":"bad"}"><b>${ok?"ATERRAGEM PERFEITA!":"DESASTRE: a nave despenhou-se."}</b></div><button class="btn" onclick="${ok?"fin(2)":"land()"}">${ok?"CONTINUAR →":"TENTAR OUTRA VEZ"}</button>`;return}
requestAnimationFrame(f)}
requestAnimationFrame(f)}
/* ranking */
async function lb(sc){sc=Math.max(0,sc);let best=+localStorage.getItem('lc_best')||0;if(sc>best){best=sc;localStorage.setItem('lc_best',sc)}
$("out").insertAdjacentHTML('beforeend',`<div class="card"><h2>Ranking</h2><p class="note">Melhor pontuação local: ${best}</p><input id="nm" maxlength="20" placeholder="Nome" style="padding:8px"> <button class="btn" style="margin:0" id="sb">ENVIAR</button><div id="lbt" class="lb"></div></div>`);
const show=async()=>{try{const r=await(await fetch('../php/api.php')).json();$("lbt").innerHTML='<table>'+r.map((x,i)=>`<tr><td>${i+1}</td><td>${x.name.replace(/</g,'&lt;')}</td><td>${x.score}</td></tr>`).join('')+'</table>'}catch(e){$("lbt").textContent='Ranking indisponível (precisa de PHP).'}};
$("sb").onclick=async()=>{try{const r=await fetch('../php/api.php',{method:'POST',body:JSON.stringify({name:$("nm").value,score:sc,site:SITES[S.site].n})});if(r.ok){$("sb").disabled=true;await show()}}catch(e){}};show()}

/* arranque */
SITES=window.SITES_DATA;load();render();
