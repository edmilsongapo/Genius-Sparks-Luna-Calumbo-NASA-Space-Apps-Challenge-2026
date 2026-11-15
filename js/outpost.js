const $=i=>document.getElementById(i);
const LV=[{n:'Júnior',crew:2,days:10,bud:100,st:[],dust:0,free:{solar:2,rec:1}},{n:'Explorador',crew:4,days:20,bud:90,st:[8],dust:0,free:{solar:1,rec:1}},{n:'Comandante',crew:4,days:30,bud:80,st:[8,21],dust:1,free:{solar:1,rec:1}}];
const D={solar:['Painel solar',5,'2 kW só de dia'],reactor:['Reactor nuclear',15,'6 kW dia e noite'],bat:['Bateria',8,'+60 kWh de reserva'],rec:['Reciclador de oxigénio',10,'produz O₂, gasta 1,5 kW'],gh:['Estufa de comida',12,'produz comida, gasta 2 kW'],shield:['Regolito no habitat',10,'-25% de radiação']};
const LIM=250;let L,S,run=false,speed=0,acc=0,ph='menu';
/* 3D */
const R=new THREE.WebGLRenderer({antialias:true});R.setPixelRatio(Math.min(devicePixelRatio,2));R.shadowMap.enabled=true;R.setClearColor(0x000005);$('w').appendChild(R.domElement);
const SC=new THREE.Scene();SC.fog=new THREE.Fog(0x000005,140,420);const C=new THREE.PerspectiveCamera(55,1,.1,1500);
function rs(){R.setSize(innerWidth,innerHeight);C.aspect=innerWidth/innerHeight;C.updateProjectionMatrix()}addEventListener('resize',rs);rs();
const sun=new THREE.DirectionalLight(0xfff2dc,2);sun.castShadow=true;sun.shadow.mapSize.set(2048,2048);Object.assign(sun.shadow.camera,{left:-40,right:40,top:40,bottom:-40,far:300});sun.shadow.camera.updateProjectionMatrix();SC.add(sun,sun.target);const hemi=new THREE.HemisphereLight(0x6f86c8,0x222222,.3);SC.add(hemi);
const sp=new Float32Array(2100);for(let i=0;i<sp.length;i+=3){const a=Math.random()*6.283,b=Math.acos(Math.random()),r=900;sp.set([r*Math.sin(b)*Math.cos(a),r*Math.cos(b)+10,r*Math.sin(b)*Math.sin(a)],i)}
const sg=new THREE.BufferGeometry();sg.setAttribute('position',new THREE.BufferAttribute(sp,3));SC.add(new THREE.Points(sg,new THREE.PointsMaterial({size:2,sizeAttenuation:false})));
const ec=document.createElement('canvas');ec.width=256;ec.height=128;{const x=ec.getContext('2d');x.fillStyle='#1c52a8';x.fillRect(0,0,256,128);for(let i=0;i<24;i++){x.fillStyle=i%4?'#3f8f4f':'#c9b36a';x.beginPath();x.ellipse(Math.random()*256,20+Math.random()*88,6+Math.random()*20,4+Math.random()*10,Math.random()*3,0,7);x.fill()}for(let i=0;i<30;i++){x.fillStyle='#fff9';x.beginPath();x.ellipse(Math.random()*256,Math.random()*128,10+Math.random()*24,2+Math.random()*4,0,0,7);x.fill()}}
const earth=new THREE.Mesh(new THREE.SphereGeometry(18,48,32),new THREE.MeshStandardMaterial({map:new THREE.CanvasTexture(ec),emissive:0x0b1c3a,roughness:.9}));earth.position.set(-120,70,-260);SC.add(earth);
function GH(x,z){const f=Math.min(1,Math.max(0,(Math.hypot(x,z)-30)/20));let h=Math.sin(x*.06)*Math.cos(z*.05)*2+Math.sin(x*.21+z*.15)*.4;[[50,-60,16],[-70,30,14],[60,50,12]].forEach(([a,b,r])=>{const d=Math.hypot(x-a,z-b)/r;if(d<1)h-=(1-d*d)*3.5;else if(d<1.3)h+=Math.exp(-(d-1)*9)*1.2});return h*f}
const rc=document.createElement('canvas');rc.width=rc.height=256;{const x=rc.getContext('2d');x.fillStyle='#8f8e8a';x.fillRect(0,0,256,256);for(let i=0;i<6000;i++){const v=80+Math.random()*90|0;x.fillStyle=`rgba(${v},${v},${v-4},.35)`;x.fillRect(Math.random()*256,Math.random()*256,1+Math.random()*3,1+Math.random()*3)}}
const rt=new THREE.CanvasTexture(rc);rt.wrapS=rt.wrapT=THREE.RepeatWrapping;rt.repeat.set(50,50);
const G=new THREE.PlaneGeometry(500,500,200,200);G.rotateX(-Math.PI/2);{const p=G.attributes.position;for(let i=0;i<p.count;i++)p.setY(i,GH(p.getX(i),p.getZ(i)));G.computeVertexNormals()}
const gr=new THREE.Mesh(G,new THREE.MeshStandardMaterial({color:0xb8b6b0,map:rt,bumpMap:rt,bumpScale:1.5,roughness:1}));gr.receiveShadow=true;SC.add(gr);
{const im=new THREE.InstancedMesh(new THREE.DodecahedronGeometry(1,0),new THREE.MeshStandardMaterial({color:0x77756f,roughness:1}),400),d=new THREE.Object3D();for(let i=0;i<400;i++){let x,z;do{x=(Math.random()-.5)*400;z=(Math.random()-.5)*400}while(Math.hypot(x,z)<28);const s=.2+Math.random()*Math.random()*1.4;d.position.set(x,GH(x,z)+s*.3,z);d.scale.set(s,s*.7,s);d.rotation.set(Math.random()*3,Math.random()*3,0);d.updateMatrix();im.setMatrixAt(i,d.matrix)}im.castShadow=true;SC.add(im)}
const mt=(c,r=.6,m=0)=>new THREE.MeshStandardMaterial({color:c,roughness:r,metalness:m}),MW=mt(0xf2f2f2),MR=mt(0xd6122f),MY=mt(0xf9d200,.4),MG=mt(0x555a62,.4,.7),MS=mt(0x1a2f6b,.3,.7),MD=mt(0x13224d,.15,.9);
function mesh(g,m,x,y,z,p){const o=new THREE.Mesh(g,m);o.position.set(x,y,z);o.castShadow=o.receiveShadow=true;p.add(o);return o}
const BL={solar(g){mesh(new THREE.CylinderGeometry(.08,.08,1.6),MW,0,.8,0,g);mesh(new THREE.BoxGeometry(3.2,.1,2),MS,0,1.8,0,g).rotation.x=-.5},
reactor(g){mesh(new THREE.CylinderGeometry(.9,.9,2.4,20),MG,0,1.2,0,g);mesh(new THREE.CylinderGeometry(.95,.95,.3,20),MY,0,2.1,0,g);for(let i=0;i<4;i++)mesh(new THREE.BoxGeometry(.1,1.4,1.2),MG,Math.cos(i*1.57)*1.3,1,Math.sin(i*1.57)*1.3,g)},
bat(g){for(let i=0;i<3;i++)mesh(new THREE.BoxGeometry(1.1,1.1,1.1),mt(0x2b6a3c),i*1.2-1.2,.55,0,g)},
rec(g){for(let i=0;i<2;i++){mesh(new THREE.CylinderGeometry(.6,.6,2,16),MW,i*1.4-.7,1,0,g);mesh(new THREE.CylinderGeometry(.62,.62,.3,16),mt(0x3c82e0),i*1.4-.7,1.3,0,g)}},
gh(g){mesh(new THREE.SphereGeometry(2,20,12,0,6.3,0,1.57),new THREE.MeshStandardMaterial({color:0x9fe3b0,transparent:true,opacity:.4,roughness:.1}),0,0,0,g);for(let i=0;i<6;i++)mesh(new THREE.ConeGeometry(.25,.8,6),mt(0x2e9a45),Math.cos(i)*.9,.4,Math.sin(i)*.9,g)}};
const HAB=new THREE.Group();SC.add(HAB);for(let i=0;i<3;i++){mesh(new THREE.CylinderGeometry(1.8,1.8,6,24),MW,0,1.8,i*5-5,HAB).rotation.z=Math.PI/2;mesh(new THREE.CylinderGeometry(1.85,1.85,.7,24),MR,0,1.8,i*5-5,HAB).rotation.z=Math.PI/2}
const slots=[...Array(26)].map((_,i)=>{const a=i*2.4,r=9+Math.sqrt(i)*3;return[Math.cos(a)*r,Math.sin(a)*r]});let ns=0,grow=[],mods=[],mounds=[];
function place(t){const g=new THREE.Group(),[x,z]=slots[ns++%26];BL[t](g);g.position.set(x,0,z);g.scale.setScalar(.01);SC.add(g);grow.push(g);mods.push([x,z])}
function mound(n){for(let i=0;i<7;i++){const a=i*.9+n,r=5+n*.8,m=mesh(new THREE.SphereGeometry(1.2,12,8,0,6.3,0,1.57),mt(0x7c7a74,1),Math.cos(a)*r,0,Math.sin(a)*r,SC);m.scale.set(1,.55,1);m.userData.s=.01;m.scale.setScalar(.01);grow.push(m)}}
/* tripulação */
function FT(){const c=document.createElement('canvas');c.width=64;c.height=40;const x=c.getContext('2d');x.fillStyle='#d6122f';x.fillRect(0,0,64,20);x.fillStyle='#111';x.fillRect(0,20,64,20);x.fillStyle='#f9d200';x.beginPath();x.arc(32,20,6,0,7);x.fill();return new THREE.CanvasTexture(c)}
const FM=new THREE.MeshStandardMaterial({map:FT(),side:2});let crew=[];
function astro(){const g=new THREE.Group();mesh(new THREE.BoxGeometry(.5,.65,.3),MW,0,.95,0,g);mesh(new THREE.SphereGeometry(.22,16,12),MW,0,1.45,0,g);mesh(new THREE.SphereGeometry(.17,16,12),MD,0,1.46,.1,g).scale.set(1,.8,.6);
const cp=mesh(new THREE.PlaneGeometry(.5,.7),FM,0,1.2,-.22,g);cp.material=FM;const L=[];for(const sx of[-.13,.13]){const p=new THREE.Group();p.position.set(sx,.65,0);g.add(p);mesh(new THREE.CylinderGeometry(.09,.08,.65),MW,0,-.32,0,p);L.push(p)}g.userData.L=L;return g}
/* módulo de aterragem */
const LD=new THREE.Group();LD.position.set(-22,40,6);SC.add(LD);mesh(new THREE.CylinderGeometry(1.8,2.2,2.2,8),mt(0xd4af37,.3,.8),0,2.6,0,LD);mesh(new THREE.BoxGeometry(2.2,1.4,2.2),MW,0,4.3,0,LD);for(let i=0;i<4;i++){const a=i*1.57+.78,l=mesh(new THREE.CylinderGeometry(.08,.08,3),MG,Math.cos(a)*2.2,1.4,Math.sin(a)*2.2,LD);l.rotation.z=Math.cos(a)*.5;l.rotation.x=-Math.sin(a)*.5}
const FL=mesh(new THREE.ConeGeometry(.9,3,12),new THREE.MeshBasicMaterial({color:0xffb040,transparent:true,opacity:.8}),0,.3,0,LD);FL.rotation.x=Math.PI;
/* estado */
let az=.6,el=.45,dist=46,drag=null,t=0;
R.domElement.addEventListener('pointerdown',e=>drag=[e.clientX,e.clientY]);addEventListener('pointerup',()=>drag=null);addEventListener('pointermove',e=>{if(drag){az-=(e.clientX-drag[0])*.006;el=Math.max(.12,Math.min(1.3,el+(e.clientY-drag[1])*.004));drag=[e.clientX,e.clientY]}});addEventListener('wheel',e=>{dist=Math.max(18,Math.min(110,dist+e.deltaY*.05))},{passive:true});
const light=()=>{const p=(S?S.h/240:0)%1;return p<.7};
const gen=()=>S.cnt.solar*2*(light()?1:0)*(S.dust>0?.5:1)+S.cnt.reactor*6,dem=()=>2+L.crew*.8+S.cnt.gh*2+S.cnt.rec*1.5,storm=()=>S.storm>0;
function say(m){$('ms').textContent=m}
function buy(k){if(ph!=='play'||S.bud<D[k][1]||(k==='shield'&&S.cnt.shield>=3))return;S.bud-=D[k][1];S.cnt[k]++;k==='shield'?mound(S.cnt.shield):place(k);ui()}
function ui(){$('bud').textContent='Orçamento: '+S.bud;$('bb').innerHTML=Object.keys(D).map(k=>`<button class="btn alt" data-k="${k}" ${S.bud<D[k][1]||(k==='shield'&&S.cnt.shield>=3)?'disabled':''}>${D[k][0]} (${D[k][1]})<br><small>${D[k][2]}</small></button>`).join('');
$('bb').querySelectorAll('button').forEach(b=>b.onclick=()=>buy(b.dataset.k));
const bar=(i,v,c)=>{$(i).style.width=Math.max(0,Math.min(100,v))+'%';$(i).style.background=c||(v<25?'#ff6b6b':v<50?'#f9d200':'#3fbf7a')};
const d=Math.floor(S.h/24);$('dy').innerHTML=`Dia ${d+1}/${L.days} · ${light()?'☀ luz':'🌑 noite'}${storm()?' · <b style="color:#ff6b6b">TEMPESTADE SOLAR</b>':S.warn>0?' · <b style="color:#f9d200">alerta</b>':''}`;
bar('b1',S.bat/(60+S.cnt.bat*60)*100);bar('b2',S.o2);bar('b3',S.food);bar('b4',100-S.dose/LIM*100);bar('b5',S.hp);
$('pw').innerHTML=`Produção: ${gen().toFixed(1)} kW · Consumo: ${dem().toFixed(1)} kW<br>Dose acumulada: ${S.dose.toFixed(0)} mSv (limite de jogo ${LIM})`;
$('vt').innerHTML='<tr><th>Astronauta</th><th>Pulso</th><th>SpO₂</th></tr>'+[...Array(L.crew)].map((_,i)=>`<tr><td>A${i+1}</td><td>${Math.round(64+(S.hp<60?24:0)+(storm()&&!S.sh?14:0)+Math.random()*4)}</td><td>${S.o2<15?88:97+Math.round(Math.random()*2)}%</td></tr>`).join('');
$('sh').style.display=(storm()||S.warn>0)?'block':'none';$('sh').textContent=S.sh?'Sair do abrigo':'Abrigar tripulação'}
function tick(){S.h++;const d=Math.floor(S.h/24),hr=S.h%24;
L.st.forEach(s=>{const a=s*24;if(S.h===a-12){S.warn=12;say('Alerta! Tempestade solar em 12 horas. Carrega em Abrigar tripulação quando chegar.')}if(S.h===a){S.storm=12;S.warn=0}});
if(L.dust&&S.h===12*24){S.dust=48;say('Tempestade de poeira: os painéis produzem metade durante 2 dias.')}
if(S.warn>0&&S.h%1===0&&!storm())S.warn=Math.max(0,S.warn-1);if(S.storm>0)S.storm--;if(S.dust>0)S.dust--;
const g=gen(),dm=dem();S.bat=Math.max(0,Math.min(60+S.cnt.bat*60,S.bat+g-dm));const pw=S.bat>0||g>=dm;if(!pw)S.f.blk=1;
S.o2=Math.max(0,Math.min(100,S.o2+(pw?S.cnt.rec*.25:0)-L.crew*.2));S.food=Math.max(0,Math.min(100,S.food+(pw?S.cnt.gh*.18:0)-L.crew*.15));
const sf=Math.pow(.75,S.cnt.shield);let rate=.35*sf;if(storm())rate*=S.sh?(S.cnt.shield>=1?.1:.4)*1:20;S.dose+=rate;if(S.dose>LIM)S.f.od=1;
if(S.o2<=0){S.hp-=3;S.f.o2=1}if(S.food<=0){S.hp-=1;S.f.fd=1}if(!pw)S.hp-=1.5;if(S.dose>LIM)S.hp-=.5;if(S.o2>0&&S.food>0&&pw&&S.dose<=LIM)S.hp=Math.min(100,S.hp+.1);S.hp=Math.max(0,S.hp);
if(hr===0)say(advise());ui();if(S.hp<=0)end(false);else if(S.h>=L.days*24)end(true)}
function advise(){const n=!light();if(S.warn>0)return'Alerta de tempestade solar! Prepara o abrigo.';if(storm())return'Tempestade solar: partículas muito energéticas. Abrigo e regolito reduzem a dose.';if(n&&S.bat<25)return'É noite lunar e a bateria está baixa. Só reactores e baterias funcionam sem sol.';if(S.o2<30)return'Oxigénio baixo. Um reciclador produz O₂, mas gasta energia.';if(S.food<30)return'Comida baixa. A estufa produz comida, mas precisa de energia.';if(S.dose>LIM*.7)return'A dose de radiação está alta. Cobre o habitat com regolito.';if(!n&&gen()<dem())return'Gastas mais energia do que produzes. Mais painéis ou um reactor?';return'Tudo estável. Vigia energia, oxigénio, comida e radiação.'}
function end(win){run=false;ph='end';const f=S.f,sc=Math.round(S.hp*6+S.bud*3+(S.o2+S.food)/2+(win?200:0)+LV.indexOf(L)*100),ls=[];
ls.push(f.od?'Radiação: a dose passou o limite. A Lua não tem atmosfera nem campo magnético global; regolito sobre o habitat e abrigo durante tempestades solares protegem.':'Radiação: manteste a dose abaixo do limite. A blindagem com regolito e o abrigo funcionam.');
ls.push(f.blk?'Energia: houve falta de energia. Os painéis não produzem à noite lunar, por isso baterias e reactores são essenciais.':'Energia: nunca ficaste sem energia. Combinar painéis, baterias e reactor cobre a noite lunar.');
ls.push(f.o2?'Oxigénio: acabou. Cada astronauta consome oxigénio todos os dias, e o reciclador precisa de energia.':'Oxigénio: sempre suficiente.');ls.push(f.fd?'Comida: acabou. Em missões longas a estufa reduz o reabastecimento da Terra.':'Comida: sempre suficiente.');
$('rp').innerHTML=`<h2>${win?'Missão cumprida!':'Missão falhada'}</h2><p>Nível ${L.n}. Pontuação: <b>${sc}</b> · Saúde final: ${Math.round(S.hp)}%</p><ul>${ls.map(x=>`<li>${x}</li>`).join('')}</ul><button class="btn" onclick="location.reload()">Jogar outra vez</button> <a class="btn alt" href="mission.html">Mission Control</a>`;$('en').style.display='flex'}
function start(i){L=LV[i];S={h:0,bat:60,o2:100,food:100,dose:0,hp:100,bud:L.bud,cnt:{solar:0,reactor:0,bat:0,rec:0,gh:0,shield:0},storm:0,warn:0,dust:0,sh:false,f:{}};$('st').style.display='none';ph='land';landT=0;
Object.entries(L.free).forEach(([k,n])=>{for(let j=0;j<n;j++){S.cnt[k]++;place(k)}});ui();say('A aterrar... Olha como a nave Calumbo pousa.')}
document.querySelectorAll('[data-l]').forEach(b=>b.onclick=()=>start(+b.dataset.l));
const spd=v=>{if(ph==='play'){speed=v;run=v>0}};$('sp0').onclick=()=>spd(0);$('sp1').onclick=()=>spd(1);$('sp3').onclick=()=>spd(3);$('sh').onclick=()=>{S.sh=!S.sh;ui();say(S.sh?'Tripulação abrigada no habitat.':'Tripulação de volta ao trabalho.')};
let landT=0;
function frame(now){requestAnimationFrame(frame);const dt=Math.min(.05,(now-(frame.l||now))/1000);frame.l=now;t+=dt;
if(ph==='menu'||ph==='end')az+=dt*.05;
if(ph==='land'){landT+=dt;const k=Math.min(1,landT/5),y=40*Math.pow(1-k,2)*(1-k*.2);LD.position.y=y;FL.visible=k<.97;if(k>=1){ph='play';crew=[...Array(L.crew)].map((_,i)=>{const g=astro();g.position.set(-22+i,0,6+i);SC.add(g);return{g,tx:0,tz:0,w:0}});say('Aterragem concluída! Planeia a base com o orçamento e carrega em Jogar ×1.')}}
if(run){acc+=dt*speed*4;while(acc>=1&&ph==='play'){acc--;tick()}}
grow.forEach(g=>{const s=g.scale.x;g.scale.setScalar(s+(1-s)*Math.min(1,dt*3))});
crew.forEach((c,i)=>{c.g.visible=!(S.sh&&storm());if(c.w>0)c.w-=dt;else if(run&&Math.hypot(c.tx-c.g.position.x,c.tz-c.g.position.z)<1){const m=mods.length&&Math.random()<.8?mods[Math.floor(Math.random()*mods.length)]:[0,0];c.tx=m[0]+1.8;c.tz=m[1]+1.8;c.w=2+Math.random()*3}
const dx=c.tx-c.g.position.x,dz=c.tz-c.g.position.z,d=Math.hypot(dx,dz);if(run&&d>.8){const s=1.6*Math.min(1,speed)*dt;c.g.position.x+=dx/d*s*speed;c.g.position.z+=dz/d*s*speed;c.g.rotation.y=Math.atan2(dx,dz);c.g.userData.L[0].rotation.x=Math.sin(t*7+i)*.7;c.g.userData.L[1].rotation.x=-Math.sin(t*7+i)*.7}c.g.position.y=GH(c.g.position.x,c.g.position.z)})
const p=S?(S.h/240)%1:.2,lit=p<.7,a=lit?p/.7*Math.PI:0;sun.position.set(Math.cos(a)*120,18+Math.sin(a)*40,Math.sin(a*.5)*60+30);sun.intensity+=((lit?2:.03)-sun.intensity)*Math.min(1,dt*2);hemi.intensity=lit?.3:.55;
const tgt=new THREE.Vector3(0,2,0);C.position.set(Math.sin(az)*Math.cos(el)*dist,Math.sin(el)*dist+2,Math.cos(az)*Math.cos(el)*dist);C.lookAt(tgt);R.render(SC,C)}
requestAnimationFrame(frame);
