
const G=9.807,ISP=465,LEO=100,H_T=5,KP=1.5,PV=3,BAT=100,N=336;
let SITES=[];
const S={ph:0,done:[],F:72,sp:50,R:0,day:9,site:0,d0:Math.floor(Math.random()*28),res:null,run:null};
const $=id=>document.getElementById(id),f1=x=>x.toFixed(1);
const struct=()=>2+.06*S.F, free=()=>LEO-S.F-struct()-H_T-KP*S.R;
const dvAv=()=>ISP*G*Math.log(LEO/(LEO-S.F))/1000;
const wdv=d=>.02+.30*(1-Math.cos(2*Math.PI*(d-S.d0)/27.3))/2;
const need=()=>3.13+wdv(S.day)+.85+1.85+SITES[S.site].dv;
function nav(){$("nav").innerHTML=["1 FOGUETÃO","2 JANELA","3 LOCAL","4 SOBREVIVER"].map((t,i)=>`<button class="${S.ph==i?"on":""} ${S.done.includes(i)?"done":""}" onclick="go(${i})">${t}</button>`).join("")}
function go(i){if(i>0&&!S.done.includes(i-1))return;S.ph=i;render()}
function fin(i){if(!S.done.includes(i))S.done.push(i);go(i+1)}
function m(l,v,u=""){return`<div class="m"><span class="k">${l}</span><b>${v}<small> ${u}</small></b></div>`}
function render(){nav();[p1,p2,p3,p4][S.ph]()}
function p1(){const fr=free(),ok=fr>=2,sol=Math.max(0,fr)*S.sp/100,bat=Math.max(0,fr)-sol;
$("app").innerHTML=`<div class="card"><div class="k">Fase 1 · Calumbo, Luanda</div><h2>Divide as 100 toneladas</h2>
<p>Capacidade máxima à saída da Terra: <b>${LEO} t</b> (ordem de grandeza de um lançador super-pesado). Mais combustível = mais Δv, mas menos carga para a base.</p>
<div class="row">${m("Δv DISPONÍVEL",f1(dvAv()),"km/s")}${m("Δv BASE MISSÃO",f1(3.13+.85+1.85+.02),"km/s")}${m("CARGA LIVRE",f1(fr),"t")}</div>
<label>Combustível <span id="vF">${S.F} t</span></label><input type=range min=40 max=85 step=1 value=${S.F} oninput="S.F=+this.value;p1()">
<label>Reactores Kilopower (10 kW, 1,5 t) <span>${S.R}</span></label><input type=range min=0 max=3 step=1 value=${S.R} oninput="S.R=+this.value;p1()">
<label>Carga livre: painéis solares ${f1(sol)} t · baterias ${f1(bat)} t <span>${S.sp}% solar</span></label><input type=range min=0 max=100 step=5 value=${S.sp} oninput="S.sp=+this.value;p1()">
<div class="note">Estrutura ${f1(struct())} t (tanques+motores) · habitat e suporte de vida ${H_T} t fixos · baterias ${BAT} kWh/t · painéis ${PV} kW/t.</div>
<div class="msg ${ok?"ok":"bad"}">${ok?`Foguetão válido. Δv de sobra sobre a missão mínima: ${f1(dvAv()-5.83)} km/s (a janela e o local vão consumir mais).`:"Sem carga livre suficiente (mínimo 2 t). Reduz combustível ou reactores."}</div>
<button class="btn" ${ok?"":"disabled"} onclick="fin(0)">VALIDAR E AVANÇAR →</button></div>`}
function p2(){const best=need()-SITES[S.site].dv;
$("app").innerHTML=`<div class="card"><div class="k">Fase 2 · Janela de lançamento</div><h2>Escolhe o dia de partida</h2>
<p>A Lua move-se na órbita (27,3 dias). Partir quando ela está bem posicionada poupa Δv da injecção translunar. Encontra o mínimo da curva.</p>
<canvas id="cv" width=800 height=220></canvas>
<label>Dia do ciclo <span>${S.day}</span></label><input type=range min=0 max=27 value=${S.day} oninput="S.day=+this.value;p2()">
<div class="row">${m("Δv TLI+LOI+DESCIDA",f1(best),"km/s")}${m("Δv DISPONÍVEL",f1(dvAv()),"km/s")}${m("MARGEM",(dvAv()-best>=0?"+":"")+(dvAv()-best).toFixed(2),"km/s")}</div>
<div class="msg ${dvAv()>=best?"ok":"bad"}">${dvAv()>=best?"Combustível chega. Cada 0,1 km/s poupado vale carga extra.":"Combustível insuficiente neste dia. Muda de data ou volta à Fase 1."}</div>
<button class="btn" ${dvAv()>=best?"":"disabled"} onclick="fin(1)">LANÇAR →</button></div>`;
const c=$("cv").getContext("2d");c.fillStyle="#000";c.fillRect(0,0,800,220);c.strokeStyle="#ffc83d";c.beginPath();
for(let d=0;d<=27;d+=.25){const x=d/27*760+20,y=200-(wdv(d)/.35)*170;d?c.lineTo(x,y):c.moveTo(x,y)}c.stroke();
c.fillStyle="#e0301e";c.beginPath();c.arc(S.day/27*760+20,200-(wdv(S.day)/.35)*170,7,0,7);c.fill();
c.fillStyle="#8d96a0";c.font="12px monospace";c.fillText("Δv extra (0 → 0,3 km/s)  ·  eixo: dia do ciclo",20,16)}
function p3(){$("app").innerHTML=`<div class="card"><div class="k">Fase 3 · Onde pousar?</div><h2>Escolhe o local no Polo Sul</h2>
<div class="sites">${SITES.map(s=>`<button class="site ${S.site==s.id?"on":""}" onclick="S.site=${s.id};p3()"><b>${s.n}</b><small>${s.d}</small><small class="mono">Sol ≈${Math.round(s.f*100)}% · noite máx ≈${s.f?s.L:"∞"} h · aquecimento ${s.cold} kW · Terra visível ≈${Math.round(s.e*100)}%</small></button>`).join("")}</div>
<div class="msg ${dvAv()>=need()?"ok":"bad"}">Δv necessário neste local: ${need().toFixed(2)} km/s · disponível ${dvAv().toFixed(2)} km/s. ${dvAv()>=need()?"Aterragem possível.":"Sem combustível para este local: voltarias a ter de reprojectar."}</div>
<button class="btn" ${dvAv()>=need()?"":"disabled"} onclick="land()">POUSAR →</button></div>`}
function p4(){const s=SITES[S.site],fr=free(),sol=fr*S.sp/100,bat=fr-sol,cap=bat*BAT;
$("app").innerHTML=`<div class="card"><div class="k">Fase 4 · ${s.n}</div><h2>14 dias à prova</h2>
<p>A simulação começa ao pôr-do-sol. Carga: ${f1(sol)} t de painéis (${f1(sol*PV)} kW com sol), ${f1(bat)} t de baterias (${Math.round(cap)} kWh), ${S.R} reactor(es) (${S.R*10} kW). Consumo: 7 kW + comunicações 1,5 kW + aquecimento ${s.cold} kW.</p>
<canvas id="cv" width=800 height=260></canvas>
<div class="row" id="tel"></div><div id="out"></div>
<button class="btn" id="go" onclick="sim()">▶ INICIAR 336 HORAS</button> <button class="btn g" onclick="S.done=[];S.cr=0;S.ph=0;S.d0=Math.floor(Math.random()*28);render()">↺ NOVA MISSÃO</button></div>`;draw([],cap,0,0,0)}
function draw(h,cap,hr,link,dead){const c=$("cv").getContext("2d");c.fillStyle="#000";c.fillRect(0,0,800,260);
c.strokeStyle="#27303a";c.strokeRect(20,10,760,230);c.fillStyle="#8d96a0";c.font="12px monospace";c.fillText("bateria %  ·  verde = sol  ·  cinza = noite",24,256);
h.forEach((p,i)=>{const x=20+i/N*760;c.fillStyle=p.lit?"rgba(255,200,61,.15)":"rgba(255,255,255,.04)";c.fillRect(x,10,2.3,230);c.fillStyle=p.b>0?"#5fd38d":"#ff5d5d";c.fillRect(x,240-p.b*2.3,2.3,2.3+0)});
$("tel").innerHTML=m("HORA",hr,"/ 336")+m("BATERIA",cap?Math.round(h.length?h[h.length-1].b:100):"—","%")+m("LINK TERRA",hr?Math.round(link/hr*100):0,"%")}
function sim(){const s=SITES[S.site],fr=free(),sol=fr*S.sp/100,cap=Math.max(.001,(fr-sol)*BAT);
let E=cap,h=[],link=0,dead=-1,ang=0,P=s.f?s.L/(1-s.f):1;$("go").disabled=true;let t=0;
const iv=setInterval(()=>{for(let k=0;k<4&&t<N;k++,t++){const lit=s.f>0&&(t%P)>=s.L;
const gen=(lit?sol*PV:0)+S.R*10,load=7+1.5+s.cold;E=Math.min(cap,E+gen-load);
if(E<=0&&dead<0){dead=t;E=0}
const up=dead<0&&s.e>0&&(t%48)/48<s.e;if(up){link++;if(t%24<12)ang++}
h.push({lit,b:E/cap*100})}
draw(h,cap,t,link,dead);
if(t>=N||dead>=0){clearInterval(iv);end(dead,link,ang,h)}},40)}
function end(dead,link,ang,h){const surv=dead<0?N:dead,margin=Math.max(0,dvAv()-need());
const sc=Math.max(0,Math.round(surv/N*700+link/N*200+Math.min(100,margin*200)-(S.cr||0)*50));
$("out").innerHTML=`<div class="msg ${dead<0?"ok":"bad"}"><b>${dead<0?"BASE VIVA. Angola está na Lua.":"BASE PERDIDA à hora "+dead+" (dia "+(1+Math.floor(dead/24))+")."}</b><br>
${dead<0?"Sobreviveste 14 dias.":"A bateria esgotou-se durante a noite: faltou energia armazenada ou geração contínua."}<br>
Ligação com a Terra: ${Math.round(link/N*100)}% do tempo, sendo ${ang} h com o elo via Angola/ANGOSAT-2 e o restante via rede NASA DSN (modelo simplificado).<br><b>Pontuação: ${sc}/1000</b></div>
<p class="note">${dead>=0?"Dica: mais baterias, um reactor, ou um local com noites mais curtas.":"Agora tenta o local sombreado só com reactores, ou maximiza a carga científica."}</p>`;
lb(sc);$("go").disabled=false;$("go").textContent="↻ REPETIR"}

