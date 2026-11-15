const L=[{n:"IM-1 Odysseus (Intuitive Machines)",lat:-80,lon:1,d:"Aterragem em 2024 na região do Polo Sul, perto da cratera Malapert A. A nave ficou inclinada."},
{n:"Blue Ghost M1 (Firefly)",lat:19,lon:62,d:"Aterragem em 2025 em Mare Crisium, com experiências científicas da NASA."},
{n:"IM-2 Athena (Intuitive Machines)",lat:-85,lon:29,d:"Aterragem em 2025 perto do Polo Sul, tombou ao pousar."}];
const c=document.getElementById('map'),x=c.getContext('2d'),P=l=>[(l.lon+180)/360*720,(90-l.lat)/180*360];
function draw(sel){x.clearRect(0,0,720,360);x.strokeStyle='#2a3550';for(let i=0;i<=720;i+=60){x.beginPath();x.moveTo(i,0);x.lineTo(i,360);x.stroke()}for(let j=0;j<=360;j+=60){x.beginPath();x.moveTo(0,j);x.lineTo(720,j);x.stroke()}
L.forEach((l,k)=>{const[a,b]=P(l);x.fillStyle=k===sel?'#f9d200':'#d6122f';x.beginPath();x.arc(a,b,9,0,7);x.fill()})}
function pick(ev){const r=c.getBoundingClientRect(),mx=(ev.clientX-r.left)*720/r.width,my=(ev.clientY-r.top)*360/r.height;let best=-1,bd=1e9;L.forEach((l,k)=>{const[a,b]=P(l),d=Math.hypot(a-mx,b-my);if(d<bd){bd=d;best=k}});
if(bd<30){draw(best);document.getElementById('info').innerHTML=`<h3>${L[best].n}</h3><p>${L[best].d}</p><p class="mu">Lat ${L[best].lat}°, lon ${L[best].lon}° (aproximado, exemplo)</p>`}}
c.addEventListener('click',pick);draw(-1);
