const $=i=>document.getElementById(i);
function calc(){const f=+$('fuel').value,c=+$('cargo').value,isp=+$('eng').value,goal=+$('goal').value;
const struct=0.08*f+2,m0=f+c+struct,m1=c+struct;const dv=isp*9.807*Math.log(m0/m1)/1000;
$('vf').textContent=f;$('vc').textContent=c;
const ok=dv>=goal;$('out').innerHTML=`<p>Massa total: <b>${m0.toFixed(1)} t</b> · estrutura: ${struct.toFixed(1)} t</p><p>Δv da nave: <b>${dv.toFixed(2)} km/s</b> · necessário: ${goal.toFixed(1)} km/s</p><p class="${ok?'ok':'bad'}"><b>${ok?'A nave chega ao destino.':'Falta velocidade. Aumenta o combustível, reduz a carga ou muda de motor.'}</b></p>`}
['eng','fuel','cargo','goal'].forEach(i=>$(i).addEventListener('input',calc));calc();
