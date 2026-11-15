/* Mundo 3D do Luna Calumbo. Gráficos procedurais (sem imagens), Three.js r128 local. */
function LunaWorld(o){const hero=o.mode==='hero',$=i=>document.getElementById(i);
const R=new THREE.WebGLRenderer({antialias:true});R.setPixelRatio(Math.min(devicePixelRatio,2));R.shadowMap.enabled=true;R.setClearColor(0x000005);o.el.appendChild(R.domElement);
const S=new THREE.Scene(),C=new THREE.PerspectiveCamera(60,1,.1,2000);
function rs(){R.setSize(innerWidth,innerHeight);C.aspect=innerWidth/innerHeight;C.updateProjectionMatrix()}addEventListener('resize',rs);rs();
const sun=new THREE.DirectionalLight(0xfff4e0,1.9);sun.position.set(60,45,30);sun.castShadow=true;sun.shadow.mapSize.set(2048,2048);Object.assign(sun.shadow.camera,{left:-45,right:45,top:45,bottom:-45,far:200});sun.shadow.camera.updateProjectionMatrix();S.add(sun,sun.target,new THREE.HemisphereLight(0x6f86c8,0x222222,.35));
const st=new Float32Array(2400);for(let i=0;i<st.length;i+=3){const a=Math.random()*6.283,b=Math.acos(2*Math.random()-1),v={x:900*Math.sin(b)*Math.cos(a),y:900*Math.cos(b),z:900*Math.sin(b)*Math.sin(a)};st.set([v.x,Math.abs(v.y)*.9+20,v.z],i)}
const sg=new THREE.BufferGeometry();sg.setAttribute('position',new THREE.BufferAttribute(st,3));S.add(new THREE.Points(sg,new THREE.PointsMaterial({color:0xffffff,size:2,sizeAttenuation:false})));
/* terreno */
const CR=[[-30,-40,14],[40,-60,18],[-60,20,12],[55,35,16],[0,-90,22],[-25,60,10],[80,-10,12],[-85,-50,15]];
function H(x,z){let h=Math.sin(x*.05)*Math.cos(z*.04)*1.6+Math.sin(x*.19+z*.13)*.35+Math.sin(z*.31)*.15;
CR.forEach(([cx,cz,r])=>{const d=Math.hypot(x-cx,z-cz)/r;if(d<1)h-=(1-d*d)*3.2;else if(d<1.3)h+=Math.exp(-(d-1)*9)*1.1});
const f=Math.min(1,Math.max(0,(Math.hypot(x,z)-22)/18));return h*f}
const G=new THREE.PlaneGeometry(500,500,200,200);G.rotateX(-Math.PI/2);const p=G.attributes.position;for(let i=0;i<p.count;i++)p.setY(i,H(p.getX(i),p.getZ(i)));G.computeVertexNormals();
const rc=document.createElement('canvas');rc.width=rc.height=256;{const x=rc.getContext('2d');x.fillStyle='#8f8e8a';x.fillRect(0,0,256,256);for(let i=0;i<6000;i++){const v=80+Math.random()*90|0;x.fillStyle='rgba('+v+','+v+','+(v-4)+',.35)';x.fillRect(Math.random()*256,Math.random()*256,1+Math.random()*3,1+Math.random()*3)}}
const rt=new THREE.CanvasTexture(rc);rt.wrapS=rt.wrapT=THREE.RepeatWrapping;rt.repeat.set(60,60);
const gr=new THREE.Mesh(G,new THREE.MeshStandardMaterial({color:0xb8b6b0,map:rt,bumpMap:rt,bumpScale:1.5,roughness:1}));gr.receiveShadow=true;S.add(gr);
{const im=new THREE.InstancedMesh(new THREE.DodecahedronGeometry(1,0),new THREE.MeshStandardMaterial({color:0x77756f,roughness:1}),500),d=new THREE.Object3D();for(let i=0;i<500;i++){let x,z;do{x=(Math.random()-.5)*400;z=(Math.random()-.5)*400}while(Math.hypot(x,z)<26);const s=.2+Math.random()*Math.random()*1.5;d.position.set(x,H(x,z)+s*.3,z);d.scale.set(s,s*.7,s);d.rotation.set(Math.random()*3,Math.random()*3,0);d.updateMatrix();im.setMatrixAt(i,d.matrix)}im.castShadow=true;S.add(im)}
/* Terra */
const cv=document.createElement('canvas');cv.width=512;cv.height=256;const x=cv.getContext('2d');x.fillStyle='#1c52a8';x.fillRect(0,0,512,256);
for(let i=0;i<40;i++){x.fillStyle=Math.random()<.7?'#3f8f4f':'#c9b36a';x.beginPath();x.ellipse(Math.random()*512,40+Math.random()*176,10+Math.random()*34,6+Math.random()*18,Math.random()*3,0,7);x.fill()}
for(let i=0;i<60;i++){x.fillStyle='#ffffff99';x.beginPath();x.ellipse(Math.random()*512,Math.random()*256,16+Math.random()*40,3+Math.random()*7,0,0,7);x.fill()}
const E=new THREE.Mesh(new THREE.SphereGeometry(16,48,32),new THREE.MeshStandardMaterial({map:new THREE.CanvasTexture(cv),roughness:.9,emissive:0x0b1c3a}));E.position.set(-90,75,-210);S.add(E);
const at=new THREE.Mesh(new THREE.SphereGeometry(17.2,32,24),new THREE.MeshBasicMaterial({color:0x6fa8ff,transparent:true,opacity:.18,side:THREE.BackSide}));at.position.copy(E.position);S.add(at);
/* materiais */
const M=(c,r=.6,m=0)=>new THREE.MeshStandardMaterial({color:c,roughness:r,metalness:m}),W=M(0xf2f2f2),RED=M(0xd6122f),YEL=M(0xf9d200,.4),BLK=M(0x111111),
add=(g,mat,px,py,pz,par)=>{const m=new THREE.Mesh(g,mat);m.position.set(px,py,pz);m.castShadow=true;m.receiveShadow=true;(par||S).add(m);return m};
/* base */
const B=new THREE.Group();B.position.set(22,0,-12);B.position.y=H(22,-12);S.add(B);
for(let i=0;i<3;i++){const c=add(new THREE.CylinderGeometry(2,2,7,24),W,0,2,i*5.5-5.5,B);c.rotation.z=Math.PI/2;add(new THREE.CylinderGeometry(2.05,2.05,.8,24),RED,0,2,i*5.5-5.5,B).rotation.z=Math.PI/2}
add(new THREE.SphereGeometry(2.6,24,16,0,7,0,1.6),W,0,3.6,-11,B);
for(let i=0;i<4;i++){const s=add(new THREE.BoxGeometry(4,.15,2.4),M(0x1a2f6b,.3,.7),-6,2.6,i*3-4.5,B);s.rotation.z=.5;add(new THREE.CylinderGeometry(.1,.1,2.4),W,-6,1.3,i*3-4.5,B)}
add(new THREE.CylinderGeometry(.08,.08,8),W,4.5,4,4,B);const fl=new THREE.Group();fl.position.set(4.5,7.2,4);B.add(fl);add(new THREE.PlaneGeometry(2,.7),new THREE.MeshBasicMaterial({color:0xd6122f,side:2}),1,.35,0,fl);add(new THREE.PlaneGeometry(2,.7),new THREE.MeshBasicMaterial({color:0x111111,side:2}),1,-.35,0,fl);add(new THREE.CircleGeometry(.22,16),new THREE.MeshBasicMaterial({color:0xf9d200,side:2}),1,0,.01,fl);
/* nave Calumbo */
const N=new THREE.Group();N.position.set(-20,H(-20,-10),-10);S.add(N);
const PAL=[{b:0xf2f2f2,n:0xd6122f,c:0x111111},{b:0x1a1a1a,n:0xc9a227,c:0xd6122f},{b:0xd6122f,n:0x111111,c:0xf2f2f2}];let CFG={st:2,en:2,nose:0,col:0};
const perf=c=>Math.max(.3,Math.min(2,c.en*1.2/(c.st*1.4+c.en*.35+1)*1.6));
function build(c){CFG=c;while(N.children.length)N.remove(N.children[0]);const p=PAL[c.col],mb=M(p.b),mn=M(p.n),mc=M(p.c);
for(let i=0;i<c.en;i++){const a=i/c.en*6.283,r=c.en>1?1:0;add(new THREE.CylinderGeometry(.35,.6,1.2,14),M(0x444444,.4,.8),Math.cos(a)*r,.6,Math.sin(a)*r,N)}
let y=1.2;for(let i=0;i<c.st;i++){add(new THREE.CylinderGeometry(1.6,1.8,4,28),mb,0,y+2,0,N);add(new THREE.CylinderGeometry(1.82,1.82,.5,28),i%2?mc:YEL,0,y+.4,0,N);y+=4}
if(c.nose)add(new THREE.SphereGeometry(1.6,24,16,0,6.3,0,1.57),mn,0,y,0,N);else add(new THREE.ConeGeometry(1.6,3.2,28),mn,0,y+1.6,0,N);
for(let i=0;i<4;i++){const a=i*Math.PI/2,f=add(new THREE.BoxGeometry(.2,3,1.8),mn,Math.cos(a)*2.3,1.9,Math.sin(a)*2.3,N);f.rotation.y=-a}}
build(CFG);
/* amostras */
const SM=[];[[8,8],[-8,14],[30,12],[-30,-25],[12,-30],[-5,-20]].forEach(([a,b])=>{const m=add(new THREE.IcosahedronGeometry(.5,0),new THREE.MeshStandardMaterial({color:0xf9d200,emissive:0xaa8800,emissiveIntensity:.8}),a,H(a,b)+.6,b);m.userData.on=1;SM.push(m)});
/* astronauta */
function FT(){const c=document.createElement('canvas');c.width=128;c.height=80;const x=c.getContext('2d');x.fillStyle='#d6122f';x.fillRect(0,0,128,40);x.fillStyle='#111';x.fillRect(0,40,128,40);x.strokeStyle='#f9d200';x.lineWidth=5;x.beginPath();x.arc(64,40,16,.6,5.7);x.stroke();x.fillStyle='#f9d200';x.beginPath();for(let i=0;i<10;i++){const r=i%2?4:9,a=i*Math.PI/5-Math.PI/2;x.lineTo(64+Math.cos(a)*r,40+Math.sin(a)*r)}x.fill();return new THREE.CanvasTexture(c)}
const FTX=FT(),FM=new THREE.MeshStandardMaterial({map:FTX,side:2,roughness:.8});
function Astro(){const g=new THREE.Group(),u={},mk=(geo,mat,x,y,z,par)=>add(geo,mat,x,y,z,par||g);
mk(new THREE.BoxGeometry(.75,.95,.45),W,0,1.35,0);mk(new THREE.BoxGeometry(.77,.14,.47),RED,0,.95,0);mk(new THREE.BoxGeometry(.78,.05,.48),YEL,0,.84,0);mk(new THREE.BoxGeometry(.55,.75,.3),M(0xcfcfcf),0,1.4,-.37);
mk(new THREE.SphereGeometry(.34,24,18),W,0,2.1,0);const v=mk(new THREE.SphereGeometry(.27,24,18),M(0x13224d,.15,.9),0,2.12,.17);v.scale.set(1,.8,.6);
function lim(sx,py,len,name){const p=new THREE.Group();p.position.set(sx,py,0);g.add(p);mk(new THREE.CylinderGeometry(.14,.12,len,12),W,0,-len/2,0,p);mk(name.startsWith('leg')?new THREE.BoxGeometry(.28,.2,.42):new THREE.SphereGeometry(.15,12,10),name.startsWith('leg')?M(0x333333):RED,0,-len,name.startsWith('leg')?.08:0,p);u[name]=p}
const cp=new THREE.Mesh(new THREE.PlaneGeometry(.9,1.3),FM);cp.position.set(0,1.15,-.58);cp.castShadow=true;cp.geometry.translate(0,-.65,0);cp.position.y=1.8;g.add(cp);u.cape=cp;const ch=new THREE.Mesh(new THREE.PlaneGeometry(.32,.2),FM);ch.position.set(0,1.55,.235);g.add(ch);
lim(-.52,1.7,.7,'armL');lim(.52,1.7,.7,'armR');lim(-.2,.85,.85,'legL');lim(.2,.85,.85,'legR');g.userData=u;return g}
const A=Astro();A.position.set(0,H(0,8),8);S.add(A);const P={v:0,ph:0,wave:0,msgT:0};
/* controlo */
const K={};let yaw=0,pit=.35,dist=8,jx=0,jz=0,drag=null;
addEventListener('keydown',e=>{if(PAUSE)return;K[e.code]=1;if(e.code==='KeyG')dance();if(e.code==='KeyB')flag();if(e.code==='KeyX')sit();if(e.code==='KeyE')act();if(e.code==='KeyF')wave();if(e.code==='Space'&&!hero)jump();if(e.code.startsWith('Arrow')||e.code==='Space')e.preventDefault()});addEventListener('keyup',e=>K[e.code]=0);
if(!hero){R.domElement.addEventListener('pointerdown',e=>drag=[e.clientX,e.clientY]);addEventListener('pointerup',()=>drag=null);addEventListener('pointermove',e=>{if(drag){yaw-=(e.clientX-drag[0])*.006;pit=Math.max(.1,Math.min(1.2,pit+(e.clientY-drag[1])*.004));drag=[e.clientX,e.clientY]}})}
function msg(t){o.onMsg&&o.onMsg(t);P.msgT=5}
function jump(){if(P.y<=0.01)P.vy=3.6}
function wave(){P.wave=2.2;msg('Kiala acena: Olá, Angola!')}
let lift=0,got=0,PAUSE=false;const PL=[];
function dance(){P.dance=4;P.sit=0;msg('Kiala dança Kuduro!')}
function sit(){P.sit=P.sit?0:1}
function flag(){if(hero)return;if(P.flags>=8){msg('Já plantaste 8 bandeiras.');return}const g=new THREE.Group(),f=new THREE.Vector3(Math.sin(A.rotation.y),0,Math.cos(A.rotation.y)),px=A.position.x+f.x*1.5,pz=A.position.z+f.z*1.5;g.position.set(px,H(px,pz),pz);add(new THREE.CylinderGeometry(.04,.04,3),W,0,1.5,0,g);const fl=add(new THREE.PlaneGeometry(1.2,.75),FM,.62,2.6,0,g);S.add(g);PL.push(g);P.flags++;msg('Bandeira de Angola plantada na Lua! Total: '+P.flags)}
function act(){if(hero)return;const q=A.position;
for(const s of SM)if(s.userData.on&&s.position.distanceTo(q)<3){s.userData.on=0;s.visible=false;got++;o.onScore&&o.onScore(got,SM.length);msg(got===SM.length?'Todas as amostras recolhidas. Missão cumprida!':'Amostra recolhida. Os cientistas estudam estas rochas para saber a idade da Lua.');return}
if(q.distanceTo(N.position)<9){const k=perf(CFG);lift=lift?lift:1;msg(k<.7?'Empuxo fraco: a nave mal sobe. Acrescenta motores ou tira andares no Hangar.':k>1.3?'Ignição perfeita! Subida potente e regresso seguro.':'Ignição! A nave sobe e regressa em segurança.');return}
if(q.distanceTo(B.position)<12){msg('Base Calumbo: painéis solares de dia, baterias de noite. Uma noite lunar dura cerca de 14 dias.');return}
msg('Nada para fazer aqui. Aproxima-te da nave, da base ou de uma amostra amarela.')}
if(!hero){const j=$('joy');if(j){let id=null;const mv=e=>{const r=j.getBoundingClientRect(),dx=(e.clientX-r.left-r.width/2)/(r.width/2),dy=(e.clientY-r.top-r.height/2)/(r.height/2),l=Math.hypot(dx,dy)||1,k=Math.min(1,l);jx=dx/l*k;jz=-dy/l*k;$('knob').style.transform=`translate(${jx*30}px,${-jz*30}px)`};
j.addEventListener('pointerdown',e=>{id=e.pointerId;j.setPointerCapture(id);mv(e)});j.addEventListener('pointermove',e=>{if(e.pointerId===id)mv(e)});['pointerup','pointercancel'].forEach(v=>j.addEventListener(v,()=>{id=null;jx=jz=0;$('knob').style.transform=''}))}
[['bAct',act],['bJump',jump],['bWave',wave],['bDance',dance],['bFlag',flag],['bSit',sit]].forEach(([i,f])=>{const b=$(i);b&&b.addEventListener('pointerdown',e=>{e.preventDefault();f()})})}
P.y=0;P.vy=0;P.dance=0;P.sit=0;P.flags=0;
let t=0,last=performance.now();
function frame(now){requestAnimationFrame(frame);const dt=Math.min(.05,(now-last)/1000);last=now;t+=dt;
let ix=(K.KeyD||K.ArrowRight?1:0)-(K.KeyA||K.ArrowLeft?1:0)+jx,iz=(K.KeyW||K.ArrowUp?1:0)-(K.KeyS||K.ArrowDown?1:0)+jz;
if(hero){const a=t*.35;A.position.x=Math.cos(a)*9+8;A.position.z=Math.sin(a)*9-2;A.rotation.y=-a;ix=0;iz=0;P.v=1;if(!P.wave&&Math.sin(t*.7)>.97)P.wave=2;yaw=t*.12;pit=.28;dist=24}
else{const f=new THREE.Vector3(-Math.sin(yaw),0,-Math.cos(yaw)),r=new THREE.Vector3(Math.cos(yaw),0,-Math.sin(yaw)),d=f.multiplyScalar(iz).add(r.multiplyScalar(ix));const l=d.length();
if(l>.05){d.normalize();const sp=(K.ShiftLeft?7:4.2)*Math.min(1,l);A.position.addScaledVector(d,sp*dt);const ty=Math.atan2(d.x,d.z);let dy=ty-A.rotation.y;dy=Math.atan2(Math.sin(dy),Math.cos(dy));A.rotation.y+=dy*Math.min(1,dt*10);P.v=sp/4.2}else P.v=0;
const lim=140,rr=Math.hypot(A.position.x,A.position.z);if(rr>lim){A.position.x*=lim/rr;A.position.z*=lim/rr}}
const gy=H(A.position.x,A.position.z);P.vy-=1.62*dt;P.y+=P.vy*dt;if(P.y<0){P.y=0;P.vy=0}A.position.y=gy+P.y;
const u=A.userData;if(P.v>.05&&P.y<.05){P.ph+=dt*9*P.v;u.legL.rotation.x=Math.sin(P.ph)*.8;u.legR.rotation.x=-Math.sin(P.ph)*.8;u.armL.rotation.x=-Math.sin(P.ph)*.6;u.armR.rotation.x=Math.sin(P.ph)*.6}
else{['legL','legR','armL','armR'].forEach(k=>u[k].rotation.x*=.85);u.armL.rotation.x=Math.sin(t*1.5)*.05}
if(P.y>.05){u.armL.rotation.z=.8;u.armR.rotation.z=-.8}else{u.armL.rotation.z*=.8;u.armR.rotation.z*=.8}
if(P.sit&&P.v>.05)P.sit=0;let yo=0;if(P.sit){u.legL.rotation.x=u.legR.rotation.x=-1.4;u.armL.rotation.x=u.armR.rotation.x=-.4;yo=-.45}
if(P.dance>0){P.dance-=dt;A.rotation.y+=dt*3;u.armL.rotation.z=1.5+Math.sin(t*9)*.5;u.armR.rotation.z=-1.5-Math.sin(t*9+1)*.5;u.legL.rotation.x=Math.sin(t*9)*.5;u.legR.rotation.x=-Math.sin(t*9)*.5;yo+=Math.abs(Math.sin(t*9))*.25}
A.position.y+=yo;u.cape.rotation.x=.12+P.v*.5+Math.sin(t*6)*.06*P.v;
if(P.wave>0){P.wave-=dt;u.armR.rotation.x=0;u.armR.rotation.z=-2.5+Math.sin(t*12)*.35}
if(lift){lift+=dt;N.position.y=H(-20,-10)+perf(CFG)*(lift<4?lift*lift*3:Math.max(0,(8-lift))*lift*1.5);if(lift>8){lift=0;N.position.y=H(-20,-10)}}
SM.forEach(s=>{if(s.userData.on){s.rotation.y+=dt;s.position.y+=Math.sin(t*3+s.position.x)*.003}});
E.rotation.y+=dt*.02;
const tg=new THREE.Vector3(A.position.x,A.position.y+1.6,A.position.z);C.position.set(tg.x+Math.sin(yaw)*Math.cos(pit)*dist,tg.y+Math.sin(pit)*dist,tg.z+Math.cos(yaw)*Math.cos(pit)*dist);
const cg=H(C.position.x,C.position.z)+1.2;if(C.position.y<cg)C.position.y=cg;C.lookAt(tg);
if(!hero&&o.onHint){let h='';if(SM.some(s=>s.userData.on&&s.position.distanceTo(A.position)<3))h='Carrega em E para recolher a amostra';else if(A.position.distanceTo(N.position)<9)h='Carrega em E para ligar a nave';else if(A.position.distanceTo(B.position)<12)h='Carrega em E para ver a base';o.onHint(h)}
R.render(S,C)}
requestAnimationFrame(frame);return{msg,act,wave,build,perf,setPause:v=>{PAUSE=v;if(v){for(const k in K)K[k]=0}}}}
