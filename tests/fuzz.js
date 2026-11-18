// Revue aléatoire : profils, réglages et actions tirés au hasard, vérifie calculs et affichage
const {JSDOM}=require(process.env.JSDOM||'jsdom');const fs=require('fs'),path=require('path');
let html=fs.readFileSync(path.join(__dirname,'..','index.html'),'utf8').replace(/<script src="https:\/\/www.gstatic[^<]*<\/script>/g,'').replace(/<link[^>]*fonts[^>]*>/g,'');
const dom=new JSDOM(html,{runScripts:'dangerously',url:'https://anth0ny47.github.io/menus-a-deux/',pretendToBeVisual:true,beforeParse(w){w.scrollTo=()=>{}}});
const N=+(process.argv[2]||400);
const errs=[];dom.window.addEventListener('error',e=>errs.push(e.message));
setTimeout(()=>{const w=dom.window;w.eval(`
let seed=12345;const R=()=>{seed=(seed*1103515245+12345)%2147483648;return seed/2147483648};
const pick=a=>a[Math.floor(R()*a.length)],ri=(a,b)=>Math.round(a+R()*(b-a));
const MAINR={riz:[35,210],pates:[35,210],semoule:[35,210],quinoa:[35,185],pdt:[110,400],patdouce:[110,400],tortilla:[60,240],painc:[25,175],poulet:[75,250],dinde:[75,250],boeuf5:[75,250],rumsteck:[75,250],porc:[75,250],jambon:[45,200],thon:[50,205],crevettes:[75,250],oeuf:[55,275],huile:[0,20],beurre:[0,20],creme:[0,80],emmental:[0,50],pesto:[0,35],avocat:[0,150],lentilles:[30,195]};
const BKFR={avoine:[25,145],painc:[30,170],whey:[10,40],fblanc:[80,350],oeuf:[55,220],beurre:[0,15],cacahuete:[0,30],amandes:[0,35],lait:[60,300],banane:[60,180],pomme:[75,225]};
const SNKR={fblanc:[80,300],whey:[10,40],banane:[60,300],avoine:[14,82],pomme:[75,375],choco:[0,25],jambon:[30,120],painc:[25,120],beurre:[0,10],amandes:[0,30],frouges:[40,250],lait:[100,300]};
const out={cases:0,days:0,bad:{},ex:{}};const bad=(k,e)=>{out.bad[k]=(out.bad[k]||0)+1;if(!out.ex[k])out.ex[k]=e};
const ALLEX=["poisson","fdm","porc","boeuf","volaille","oeuf"];
for(let c=0;c<${N};c++){
 for(let pi=0;pi<2;pi++){const sex=pi===0?"H":pick(["F","F","H"]);const h=sex==="H"?ri(165,200):ri(150,182);const bmi=18.5+R()*13;
  S.people[pi]=Object.assign({},S.people[pi],{sex,h,w:Math.round(bmi*(h/100)**2),age:ri(18,60),act:ri(0,4),goal:pick(["perte","recompo","maintien","prise"]),snack:R()<0.75,lunch:pick(["home","alt","week"]),sweet:R()<0.5,adj:pick([0,0,0,-600,-250,250,600]),train:[0,1,2,3,4,5,6].map(()=>R()<0.5),log:[]});}
 S.seed=ri(1,1e9);S.leftovers=R()<0.5;S.days=pick([7,14,28,30,31]);
 const d0=new Date(2026,10,1+ri(0,300),12);S.start=iso(d0);
 S.excl=ALLEX.filter(()=>R()<0.15);S.banned=MAINS.filter(()=>R()<0.08).map(r=>r.n);S.ov={};S.cheap=R()<0.5;S.stock={};S.done={};S.ledger={};S.checked={};
 DCACHE.clear();buildPlan();
 for(let k=0;k<5;k++){const i=ri(0,S.days-1);const kk=pick(["bkf","lunch","snack","dinner"]);if(R()<0.7)swapMeal(i,kk);else if(R()<0.5)banMeal(i,kk);else resetMeal(i,kk)}
 DCACHE.clear();out.cases++;
 if(PLAN.length!==S.days)bad("PLAN TAILLE",S.days+" vs "+PLAN.length);
 for(let i=0;i<S.days;i++){const day=PLAN[i];
  ["bkf","lunch","snack","dinner"].forEach(k=>{if(!day[k])bad("PLAT MANQUANT "+k,"j"+i)});
  [day.lunch,day.dinner].forEach(r=>{if(S.excl.length&&!allowed(r)&&!PLANWARN)bad("PLAT EXCLU SERVI",r.n+" excl="+S.excl)});
  if(!PLANWARN&&(S.banned.includes(day.lunch.n)||S.banned.includes(day.dinner.n)))bad("PLAT RETIRÉ SERVI",day.lunch.n+" / "+day.dinner.n);
  for(let pi=0;pi<2;pi++){const p=S.people[pi],d=pd(pi,i);out.days++;
   const T=d.target;if(!(T.kcal>0&&T.P>0&&T.G>0&&T.L>0))bad("CIBLE INVALIDE",JSON.stringify(T)+" "+JSON.stringify(p));
   for(const k of ["bkf","lunch","snack","dinner"]){const m=d[k];if(!m)continue;const r=d.recs[k];
    for(const f in m){if(!(m[f]>0)||!isFinite(m[f]))bad("QUANTITÉ INVALIDE",k+" "+f+"="+m[f]+" "+r.n)}
    if((k==="lunch"||k==="dinner")&&r.carb&&!(m[r.carb]>0))bad("SANS FÉCULENT",r.n);
    if(!(m[r.prot]>0))bad("SANS PROTÉINE",k+" "+r.n);
    const RR=k==="bkf"?BKFR:k==="snack"?SNKR:MAINR;
    for(const f in m){const rg=RR[f];if(!rg)continue;const fixedMain=(k==="lunch"||k==="dinner")&&f!==r.prot&&f!==r.carb&&f!==r.fat&&f!=="painc";
     if(m[f]>rg[1]+0.5)bad("TROP "+k+" "+f,Math.round(m[f])+" g "+r.n+" | "+p.sex+p.h+"/"+p.w+" "+p.goal+" adj"+p.adj);
     if(!fixedMain&&m[f]<rg[0]-0.5)bad("TROP PEU "+k+" "+f,Math.round(m[f])+" g "+r.n+" | "+p.sex+p.h+"/"+p.w+" "+p.goal+" adj"+p.adj)}
   }
   if(eatsOut(p,day.date)&&d.lunch)bad("MIDI SERVI EN ENTREPRISE","j"+i);
   const tot=macrosOf(sumItems([d.bkf,d.lunch,d.snack,d.dinner]));const e=(tot.kcal-T.kcal)/T.kcal;
   if(!isFinite(e))bad("TOTAL INVALIDE","");
   if(Math.abs(e)>0.07){const shown=gapNote(p,tot.kcal,T.kcal);if(!shown)bad("ÉCART > 7 % SANS MESSAGE",Math.round(e*100)+"%")}
   if(Math.abs(e)>0.10)bad("ÉCART > 10 % (message affiché)",Math.round(e*100)+"% "+p.sex+p.h+"/"+p.w+" "+p.goal+" adj"+p.adj+" collation:"+p.snack+" midi:"+p.lunch);
  }
 }
 for(let w=0;w<nWeeks();w++){const {tot}=shoppingFor(w);for(const k in tot)if(!(tot[k]>0))bad("COURSES INVALIDES",k)}
 for(const tab of ["jour","semaine","courses","stock","moi"]){S.tab=tab;S.day=ri(0,S.days-1);S.week=Math.floor(S.day/7);S.me=pick([0,1,"all"]);try{render();const t=document.getElementById("app").textContent;if(/NaN|undefined|Infinity/.test(t))bad("AFFICHAGE "+tab,t.match(/.{0,40}(NaN|undefined|Infinity).{0,20}/)[0])}catch(e){bad("ERREUR AFFICHAGE "+tab,e.message+" "+String(e.stack||"").split(String.fromCharCode(10)).slice(1,4).join(" | "))}}
 try{const i=ri(0,S.days-1);for(const k of ["bkf","lunch","snack","dinner"]){const r=PLAN[i][k];S.sheet={t:"meal",i,k,n:r.n};renderSheet();const t=document.getElementById("sheet").textContent;if(/NaN|undefined|Infinity/.test(t))bad("AFFICHAGE FICHE",t.match(/.{0,40}(NaN|undefined|Infinity).{0,20}/)[0])}S.sheet=null;renderSheet()}catch(e){bad("ERREUR FICHE",e.message)}
}
window.__o=JSON.stringify(out,null,1)`);console.log(w.__o);console.log('erreurs JS',errs)},300);
