// Tests des fonctions de l'appli : migrations, semaines, mois suivant, objectif de poids, plats renommés, interface
const {JSDOM}=require(process.env.JSDOM||'jsdom');const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'..','index.html'),'utf8').replace(/<script src="https:\/\/www.gstatic[^<]*<\/script>/g,'').replace(/<link[^>]*fonts[^>]*>/g,'');
let fails=0,passes=0;
function check(name,cond,info){if(cond){passes++}else{fails++;console.log("ÉCHEC : "+name+(info!==undefined?" → "+JSON.stringify(info):""))}}
function boot(store,now){
 return new Promise(res=>{
  const dom=new JSDOM(html,{runScripts:'dangerously',url:'https://anth0ny47.github.io/menus-a-deux/',pretendToBeVisual:true,beforeParse(w){
   w.scrollTo=()=>{};
   if(now){const RealDate=w.Date;const fixed=new RealDate(now).getTime();class D extends RealDate{constructor(...a){if(a.length===0){super(fixed)}else{super(...a)}}static now(){return fixed}};w.Date=D}
   if(store)w.localStorage.setItem('menus-couple-v1',JSON.stringify(store));
  }});
  const errs=[];dom.window.addEventListener('error',e=>errs.push(e.message));
  setTimeout(()=>res({w:dom.window,d:dom.window.document,errs}),250);
 });
}
const click=(w,sel)=>{const el=w.document.querySelector(sel);if(!el)throw new Error("introuvable : "+sel);el.dispatchEvent(new w.MouseEvent('click',{bubbles:true}))};
const V3={tab:"jour",week:0,seed:20261116,start:"2026-11-16",days:30,excl:["fdm"],v:3,owner:0,
 people:[{name:"Anthony",sex:"H",age:22,h:188,w:85,act:2,goal:"recompo",snack:false,lunch:"home",sweet:false,bkfFixed:"",train:[true,true,false,true,true,false,false]},
         {name:"Princesse",sex:"F",age:22,h:165,w:60,act:1,goal:"recompo",snack:false,lunch:"alt",sweet:true,bkfFixed:"Flocons d'avoine, muesli chocolat et lait",train:[false,true,false,false,true,false,false]}],
 checked:{w0:{poulet:true},w1:{riz:true}},done:{"0":true},ledger:{"0":{before:{},bought:{riz:1000}}},stock:{riz:600},
 banned:["Dahl de lentilles corail et riz"],ov:{"2026-11-20":{dinner:"Omelette aux pommes de terre et épinards"}}};
(async()=>{
 // 1. migration depuis la version 3
 {const {w,errs}=await boot(V3,"2026-11-18T09:00:00");const S=w.eval("S");
  check("version 6",S.v===6,S.v);
  check("Anthony : 300 kcal de moins par jour",S.people[0].kadj===-300,S.people[0].kadj);
  check("Princesse : quantités comme calculé",S.people[1].kadj===0,S.people[1].kadj);
  check("Princesse 1m60",S.people[1].h===160,S.people[1].h);
  check("Princesse sans sport",S.people[1].act===0&&S.people[1].train.every(x=>!x),[S.people[1].act,S.people[1].train]);
  check("4 semaines",S.days===28,S.days);
  check("Princesse 66 kg",S.people[1].w===66,S.people[1].w);
  check("Princesse en perte",S.people[1].goal==="perte",S.people[1].goal);
  check("objectif 50 à 60",S.people[1].goalMin===50&&S.people[1].goalMax===60);
  check("Anthony inchangé",S.people[0].w===85&&S.people[0].goal==="recompo");
  check("semaine validée convertie",S.done.w20261116===true&&!S.done["0"],S.done);
  check("cases cochées converties",S.checked.w20261116&&S.checked.w20261116.poulet===true&&S.checked.w20261123&&S.checked.w20261123.riz===true,S.checked);
  check("historique converti",!!S.ledger.w20261116,Object.keys(S.ledger));
  check("plat retiré renommé reconnu",w.eval("PLAN.every(d=>d.lunch.n!=='Dahl de lentilles corail au poulet'&&d.dinner.n!=='Dahl de lentilles corail au poulet')"));
  check("plat changé renommé reconnu",w.eval("PLAN.find(d=>iso(d.date)==='2026-11-20').dinner.n")==="Omelette au jambon, pommes de terre et épinards",w.eval("PLAN.find(d=>iso(d.date)==='2026-11-20').dinner.n"));
  const t=w.eval("targets(S.people[1])");
  check("cible Princesse plausible",t.kcal>1350&&t.kcal<1600&&t.P>=80&&t.P<=95,t);
  check("Princesse : même cible tous les jours",w.eval("dayTarget(S.people[1],false).kcal===targets(S.people[1]).kcal"));
  check("Anthony : moyenne de la semaine = cible",Math.abs(w.eval("[0,1,2,3,4,5,6].map(i=>dayTarget(S.people[0],S.people[0].train[i]).kcal).reduce((a,b)=>a+b)/7")-2529)<3);
  const ta=w.eval("targets(S.people[0])");
  check("cible Anthony allégée, protéines gardées",ta.kcal===2529&&ta.P===170&&ta.L===77,ta);
  check("Anthony : riz du soir raisonnable",w.eval("Object.values(PLAN.map((d,i)=>pd(0,i).dinner||{})).every(m=>!(m.riz>160)&&!(m.pates>160))"));
  check("aucune erreur JS",errs.length===0,errs);
 }
 // 1 bis. réglage « Quantités » du profil : moins copieux, plus copieux, plancher
 {const st=JSON.parse(JSON.stringify(V3));st.v=6;st.days=28;st.people[0].kadj=-300;st.people[1].kadj=0;
  const {w,d,errs}=await boot(st,"2026-11-18T09:00:00");
  check("migration déjà faite : réglage gardé",w.eval("S.people[0].kadj")===-300);
  w.eval("openSheet({t:'prof',pi:0})");
  const sel=d.querySelector('select[data-f="kadj"]');
  check("champ Quantités présent",!!sel&&sel.value==="-300",sel&&sel.value);
  if(sel){sel.value="0";sel.dispatchEvent(new w.Event('change',{bubbles:true}))}
  check("Quantités comme calculé : 2 829 kcal",w.eval("targets(S.people[0]).kcal")===2829,w.eval("targets(S.people[0]).kcal"));
  check("valeur enregistrée en nombre",w.eval("S.people[0].kadj")===0,w.eval("S.people[0].kadj"));
  w.eval("S.people[1].kadj=-600;S.people[1].adj=-600");
  const tp=w.eval("targets(S.people[1])");
  const bmr=w.eval("(q=>10*q.w+6.25*q.h-5*q.age-161)(S.people[1])");
  check("jamais sous le métabolisme de base",tp.kcal>=1200&&tp.kcal>=Math.round(bmr)-2,[tp,bmr]);
  check("aucune erreur JS",errs.length===0,errs);
 }
 // 2. semaines passées, semaine ouverte, validation
 {const st=JSON.parse(JSON.stringify(V3));st.v=5;st.days=28;st.start="2026-11-02";st.done={};st.ledger={};st.checked={};
  const {w,d,errs}=await boot(st,"2026-11-18T09:00:00");
  check("semaine en cours ouverte",w.eval("firstOpenWeek()")===2,w.eval("firstOpenWeek()"));
  check("semaine passée",w.eval("isPast(0)&&isPast(1)&&!isPast(2)"));
  click(w,'[data-a="tab"][data-v="courses"]');
  w.eval("S.week=2;render()");
  check("bouton courses présent",!!d.querySelector('[data-v="buy"]'));
  click(w,'[data-v="buy"]');click(w,'[data-a="validate"]');
  check("validation enregistrée par date",w.eval("!!S.done.w20261116"),w.eval("S.done"));
  w.eval("S.week=2;render()");
  check("annuler visible",!!d.querySelector('[data-a="undo"]'));
  click(w,'[data-a="undo"]');
  check("annulation",w.eval("!S.done.w20261116"));
  w.eval("S.week=0;render()");
  check("semaine passée sans bouton",!d.querySelector('[data-v="buy"]')&&d.body.textContent.includes("Cette semaine est passée"));
  check("aucune erreur JS",errs.length===0,errs);
 }
 // 3. mois suivant
 {const st=JSON.parse(JSON.stringify(V3));st.v=5;st.days=28;st.start="2026-10-26";st.done={w20261109:true};st.ledger={};st.checked={};
  const {w,d,errs}=await boot(st,"2026-11-18T09:00:00");
  check("bandeau fin de menus",d.body.textContent.includes("Les menus se terminent"),d.querySelector('.app').textContent.slice(0,200));
  const seed=w.eval("S.seed");
  click(w,'[data-a="nextplan"]');
  check("nouveau départ",w.eval("S.start")==="2026-11-23",w.eval("S.start"));
  check("nouveaux menus",w.eval("S.seed")!==seed);
  check("courses validées gardées",w.eval("!!S.done.w20261109"));
  check("stock gardé",w.eval("S.stock.riz")===600);
  check("aucune erreur JS",errs.length===0,errs);
 }
 {const st=JSON.parse(JSON.stringify(V3));st.v=5;st.days=28;st.start="2026-10-12";st.done={};st.ledger={};st.checked={};
  const {w,d,errs}=await boot(st,"2026-11-18T09:00:00");
  check("bandeau menus terminés",d.body.textContent.includes("se sont terminés"));
  click(w,'[data-a="nextplan"]');
  check("enchaîne sur la période suivante",w.eval("S.start")==="2026-11-09",w.eval("S.start"));
  check("aujourd'hui retrouvé",w.eval("todayIdx()")===9,w.eval("todayIdx()"));
  check("aucune erreur JS",errs.length===0,errs);
 }
 // 4. objectif de poids et suivi
 {const st=JSON.parse(JSON.stringify(V3));st.v=5;st.days=28;st.owner=1;st.people[1].w=66;st.people[1].goal="perte";st.people[1].goalMin=50;st.people[1].goalMax=60;st.done={};st.ledger={};st.checked={};
  st.people[1].log=[];for(let k=0;k<15;k++){const dd=new Date(2026,10,3+k,12);st.people[1].log.push({d:dd.toISOString().slice(0,10),kg:+(66.6-k*0.07).toFixed(1)})}
  const {w,d,errs}=await boot(st,"2026-11-18T09:00:00");
  click(w,'[data-a="tab"][data-v="moi"]');
  const txt=d.body.textContent;
  check("objectif affiché",txt.includes("Objectif : entre 50 et 60 kg"),txt.match(/Objectif[^.]*\./));
  check("reste à perdre",/Encore 5,\d kg/.test(txt)||/Encore 6,\d kg/.test(txt),(txt.match(/Encore[^.]*\./)||[""])[0]);
  check("estimation en semaines",/environ \d+ semaines/.test(txt),(txt.match(/À ce rythme[^.]*\./)||[""])[0]);
  click(w,'[data-v="prof:1"]');
  const inp=d.querySelector('#sheet [data-f="goalMax"]');check("champ poids visé",!!inp);
  inp.value="58";inp.dispatchEvent(new w.Event('change',{bubbles:true}));
  check("poids visé enregistré",w.eval("S.people[1].goalMax")===58);
  {const i2=d.querySelector('#sheet [data-f="goalMax"]');i2.value="";i2.dispatchEvent(new w.Event('change',{bubbles:true}))}
  check("poids visé effaçable",w.eval("S.people[1].goalMax")===null,w.eval("S.people[1].goalMax"));
  check("aucune erreur JS",errs.length===0,errs);
 }
 // 5. tous les écrans et fiches, pour chaque profil et chaque jour de la première semaine
 {const st=JSON.parse(JSON.stringify(V3));st.v=5;st.days=28;st.done={};st.ledger={};st.checked={};st.leftovers=true;
  const {w,d,errs}=await boot(st,"2026-11-18T09:00:00");
  let bad=0;
  for(const me of [0,1,"all"])for(let i=0;i<7;i++){w.eval(`S.me=${JSON.stringify(me)};S.day=${i};S.tab="jour";render()`);
   const t=d.getElementById('app').textContent;if(/NaN|undefined|Infinity/.test(t))bad++;
   for(const b of [...d.querySelectorAll('.meal[data-a="meal"]')]){b.dispatchEvent(new w.MouseEvent('click',{bubbles:true}));const s=d.getElementById('sheet').textContent;if(/NaN|undefined|Infinity/.test(s)||!s.includes("Recette"))bad++;w.eval("closeSheet()")}}
  for(const tab of ["semaine","courses","stock","moi"]){click(w,`[data-a="tab"][data-v="${tab}"]`);if(/NaN|undefined|Infinity/.test(d.getElementById('app').textContent))bad++}
  check("écrans et fiches sans valeur cassée",bad===0,bad);
  check("message sans collation",!d.body.innerHTML.includes("Active la collation"));
  check("aucune erreur JS",errs.length===0,errs);
 }
 console.log(`${passes} vérifications réussies, ${fails} échec${fails>1?"s":""}`);
 process.exit(fails?1:0);
})();
