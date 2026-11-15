const Q=[["Qual é a gravidade da Lua, comparada com a da Terra?",["Cerca de 1/6","Cerca de metade","Igual"],0,"A gravidade lunar é cerca de 1/6 da terrestre (1,62 m/s²)."],
["Porque é que o Polo Sul lunar interessa à exploração?",["Tem atmosfera","Há zonas com luz quase contínua e gelo de água em crateras sombreadas","Tem oceanos"],1,"Os picos iluminados dão energia e as crateras sombreadas podem guardar gelo."],
["O que acontece à temperatura nas crateras permanentemente sombreadas?",["Fica muito baixa, abaixo de −200 °C","Fica igual à da Terra","Passa os 100 °C"],0,"Sem sol directo, ficam extremamente frias."],
["Quanto dura aproximadamente um dia lunar (luz + noite)?",["24 horas","Cerca de 29,5 dias terrestres","1 ano"],1,"Um ciclo completo dura cerca de 29,5 dias."],
["Que fonte de energia ajuda a sobreviver à noite lunar?",["Painéis solares apenas","Baterias e reactores nucleares pequenos","Vento"],1,"Sem sol, é preciso armazenar energia ou ter outra fonte."]];
let i=0,s=0;const q=document.getElementById('q');
function show(){if(i>=Q.length){q.innerHTML=`<h2>Treino concluído</h2><p>Acertaste ${s} de ${Q.length}.</p><button class="btn" onclick="i=0;s=0;show()">Repetir</button> <a class="btn alt" href="mission.html">Mission Control</a>`;return}
const [t,o,c]=Q[i];q.innerHTML=`<p class="mu">Desafio ${i+1} de ${Q.length}</p><h2>${t}</h2>`+o.map((x,k)=>`<p><button class="btn alt" style="width:100%;text-align:left" data-k="${k}">${x}</button></p>`).join('')+'<div id="fb"></div>';
q.querySelectorAll('button[data-k]').forEach(b=>b.onclick=()=>{const r=+b.dataset.k===c;if(r)s++;q.querySelectorAll('button[data-k]').forEach(x=>x.disabled=true);
document.getElementById('fb').innerHTML=`<p class="${r?'ok':'bad'}"><b>${r?'Certo.':'Errado.'}</b> ${Q[i][3]}</p><button class="btn" id="nx">Seguinte</button>`;document.getElementById('nx').onclick=()=>{i++;show()}})}
show();
