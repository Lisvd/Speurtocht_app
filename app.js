const WORD = 'DUMPLINGS';
const tasks = [
  {id:1,title:'Dumpling Delivery',letter:'D',type:'multi',answer:['2','4','6','8','9','11','13','15'],text:'Tik de cijfers één voor één in van laag naar hoog.'},
  {id:2,title:'Het Geheime Dumpling Recept',letter:'U',type:'text',answer:'35153',text:'Los het geheime recept op en vul de code in één keer in.'},
  {id:3,title:'Ninja Bunny Training',letter:'M',type:'text',answer:'dumpling bunny',text:'Voer de training uit en vul daarna het codewoord in.'},
  {id:4,title:'Dumpling Katapult',letter:'P',type:'text',answer:'raak',text:'Gooi samen genoeg dumplings raak en vul het codewoord in.'},
  {id:5,title:'Konijnenradar',letter:'L',type:'multi',answer:['17','15','12','9','5','4','3','2'],text:'Zet iedereen op volgorde van hoog naar laag en tik de cijfers in.'},
  {id:6,title:'De Geheime Menukaart',letter:'I',type:'text',answer:'15',text:'Reken uit wat de Chef moet betalen.'},
  {id:7,title:'Codekraker',letter:'N',type:'text',answer:'dumpling',text:'Kraak de Caesar-code. Hint: iedere letter staat 1 plek verder in het alfabet.'},
  {id:8,title:'De Verloren Receptingrediënten',letter:'G',type:'multi',answer:['1','2','2','5','10'],text:'Zoek de goede ingrediënten en zet de cijfers van laag naar hoog.'},
  {id:9,title:'Dumpling Foto Challenge',letter:'S',type:'scan',text:'Maak 4 foto-opdrachten. Maak een foto, scan daarna voor het resultaat.'}
];
let state = JSON.parse(localStorage.getItem('dumplingQuest') || '{}');
function save(){localStorage.setItem('dumplingQuest', JSON.stringify(state));}
function done(id){return !!state[id];}
function clean(v){return String(v||'').trim().toLowerCase().replace(/\s+/g,' ')}
function mascot(cls='mascot'){return `<img class="${cls}" src="assets/mascot.png" alt="Dumpling">`}
function renderHome(){
  const collected = tasks.map(t=>done(t.id)?t.letter:'_').join(' ');
  const complete = tasks.every(t=>done(t.id));
  app.innerHTML = `<div class="wrap sparkle"><section class="hero"><h1 class="title">Jaley-ann's<br>Dumpling Mystery Quest</h1>${mascot('mascot heroMascot')}</section>
  <section class="card intro">Welkom bij Jaley-ann's mystery dumpling speurtocht!<br>Vind de lintjes en open één van de stoommandjes, voer de opdrachten op en verzamel alle 9 letters.<br>maar pas op: vind geen aangebrande dumpling want dan .....</section>
  <section class="grid">${tasks.map(t=>`<button class="taskbtn ${done(t.id)?'done':''}" onclick="renderTask(${t.id})"><span>🥟 Opdracht ${t.id}</span><span>${done(t.id)?'✓':'›'}</span></button>`).join('')}</section>
  <section class="card"><strong>Verzamelde letters:</strong><div class="letters">${collected}</div></section>
  ${complete?`<section class="card final">🏆 Missie voltooid!<br><br><button onclick="renderFinal()">Toon locatie van de prijs</button></section>`:''}
  <div style="text-align:center"><button class="reset" onclick="resetQuest()">Reset speurtocht</button></div></div>`;
}
function renderTask(id){
 const t=tasks.find(x=>x.id===id);
 if(t.type==='scan') scanNr=1;
 let body='';
 if(t.type==='multi'){
   body = `<div class="smallInputs">${t.answer.map((_,i)=>`<input class="input" inputmode="numeric" id="v${i}" aria-label="Cijfer ${i+1}" autocomplete="off">`).join('')}</div><button onclick="checkMulti(${id})">Invoeren</button>`;
 } else if(t.type==='text') {
   body = `<input class="input" id="answer" autocomplete="off" placeholder="Vul code in"><button onclick="checkText(${id})">Invoeren</button>`;
 } else {
   body = `<div class="scanbox"><h2 id="scanTitle">Foto 1 van 4</h2><p id="scanText">Maak de foto en druk daarna op de knop.</p><div class="bar"><div id="fill" class="fill"></div></div></div><button id="scanBtn" onclick="startScan()">📸 Foto gemaakt!</button>`;
 }
 app.innerHTML = `<div class="wrap"><button class="reset" onclick="renderHome()">← Terug</button><section class="card"><h1 class="tasktitle">Opdracht ${t.id}: ${t.title}</h1>${mascot('mascot taskMascot')}<p class="instructions">${t.text}</p>${body}<p class="hint">Bij fout komt er een rood scherm. Bij goed krijgen jullie de letter.</p></section></div>`;
 if(t.type==='text') setTimeout(()=>document.getElementById('answer')?.focus(),100);
}
function checkText(id){ const t=tasks.find(x=>x.id===id); const v=clean(document.getElementById('answer').value); clean(t.answer)===v ? success(t) : fail(id); }
function checkMulti(id){ const t=tasks.find(x=>x.id===id); const vals=t.answer.map((_,i)=>clean(document.getElementById('v'+i).value)); JSON.stringify(vals)===JSON.stringify(t.answer.map(clean)) ? success(t) : fail(id); }
function success(t){ state[t.id]=true; save(); app.innerHTML=`<div class="screen ok"><div class="panel">${mascot('mascot resultMascot')}<h1>Goed zo! 🎉</h1><p class="final">Hier is jullie letter:</p><div class="letterbox">${t.letter}</div><br><button onclick="renderHome()">Verder</button></div></div>`; }
function fail(id){ app.innerHTML=`<div class="screen bad"><div class="panel"><h1>Helaas!</h1><p class="final">Het is niet goed. Probeer opnieuw.</p><button onclick="renderTask(${id})">Opnieuw proberen</button></div></div>`; }
let scanNr=1;
function startScan(){
 const fill=document.getElementById('fill'), txt=document.getElementById('scanText'), title=document.getElementById('scanTitle'), btn=document.getElementById('scanBtn');
 btn.disabled=true; let p=0; txt.textContent='Ik scan jullie foto...'; fill.style.width='0%';
 const timer=setInterval(()=>{p+=20; fill.style.width=p+'%'; txt.textContent=`Ik scan jullie foto... ${p}%`; if(p>=100){clearInterval(timer); txt.textContent='Geweldig! Foto goedgekeurd ✅'; setTimeout(()=>{ if(scanNr<4){scanNr++; title.textContent=`Foto ${scanNr} van 4`; txt.textContent='Maak de volgende foto en druk op de knop.'; fill.style.width='0%'; btn.disabled=false;} else {success(tasks[8]);}},900);}},380);
}
function renderFinal(){
  app.innerHTML=`<div class="screen ok celebration"><div class="panel">${mascot('mascot')}<h1 class="goldTitle">🏆 MISSIE VOLTOOID! 🎉</h1><p class="final">Jullie hebben alle opdrachten opgelost en alle 9 letters verzameld.</p><div class="codeList">${WORD}</div><p class="final">TROFEE ONTGRENDELD</p><button onclick="renderLocationReveal()">🏆 Toon locatie</button></div></div>`;
}
function renderLocationReveal(){
  app.innerHTML=`<div class="screen ok celebration"><div class="panel">${mascot('mascot')}<h1 class="goldTitle">Dumpling trofee locatie:</h1><div id="locationText" class="locationScramble">••• • •••</div><p id="locationHint" class="hint">Locatie wordt ontsleuteld...</p><button onclick="renderHome()">Terug</button></div></div>`;
  startLocationScramble();
}
function startLocationScramble(){
  const target='OMA & OPA';
  const chars='ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789♥★🥟🐰';
  const el=document.getElementById('locationText');
  const hint=document.getElementById('locationHint');
  const started=Date.now();
  const duration=10000;
  const timer=setInterval(()=>{
    const elapsed=Date.now()-started;
    if(elapsed>=duration){
      clearInterval(timer);
      el.textContent=target;
      hint.textContent='Locatie gevonden! Rennen maar! 🎉';
      return;
    }
    const revealCount=Math.floor((elapsed/duration)*target.length);
    el.textContent=target.split('').map((ch,i)=>{
      if(ch===' ') return ' ';
      if(i<revealCount) return ch;
      return chars[Math.floor(Math.random()*chars.length)];
    }).join('');
  },120);
}
function resetQuest(){ if(confirm('Weet je zeker dat je opnieuw wilt beginnen?')){state={}; save(); renderHome();}}
if('serviceWorker' in navigator){navigator.serviceWorker.register('./sw.js').catch(()=>{});} 
renderHome();
