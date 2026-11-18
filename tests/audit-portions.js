// Audit automatique des portions : charge l'appli dans jsdom et vérifie chaque repas
const {JSDOM}=require(process.env.JSDOM||'jsdom');const fs=require('fs');
let html=fs.readFileSync(require('path').join(__dirname,'..','index.html'),'utf8').replace(/<script src="https:\/\/www.gstatic[^<]*<\/script>/g,'').replace(/<link[^>]*fonts[^>]*>/g,'');
const dom=new JSDOM(html,{runScripts:'dangerously',url:'https://anth0ny47.github.io/menus-a-deux/',pretendToBeVisual:true,beforeParse(w){w.scrollTo=()=>{}}});
const QUICK=process.argv.includes('--quick');const MODE=process.argv.includes('--foyer')?'foyer':'large';
setTimeout(()=>{const w=dom.window;
w.eval(`const MODE='${MODE}';
const MAINR={riz:[35,210],pates:[35,210],semoule:[35,210],quinoa:[35,185],pdt:[110,400],patdouce:[110,400],tortilla:[60,240],painc:[25,175],
 poulet:[75,250],dinde:[75,250],boeuf5:[75,250],rumsteck:[75,250],porc:[75,250],jambon:[45,200],thon:[50,205],crevettes:[75,250],oeuf:[55,275],
 huile:[0,20],beurre:[0,20],creme:[0,80],emmental:[0,50],pesto:[0,35],avocat:[0,150],lentilles:[30,195]};
const BKFR={muesli:[15,95],avoine:[20,145],painc:[30,170],whey:[10,40],fblanc:[80,350],oeuf:[55,220],beurre:[0,15],cacahuete:[0,30],amandes:[0,35],lait:[60,400],banane:[60,180],pomme:[75,225]};
const SNKR={fblanc:[80,300],whey:[10,40],banane:[60,300],avoine:[14,82],pomme:[75,375],choco:[0,25],jambon:[30,120],painc:[25,120],beurre:[0,10],amandes:[0,30],frouges:[40,250],lait:[100,300]};
const HS0=[["H188",{sex:"H",h:188,w:85,age:22,act:2,goal:"recompo"}],["H178prise",{sex:"H",h:178,w:75,age:30,act:3,goal:"prise"}],["H175perte",{sex:"H",h:175,w:95,age:35,act:1,goal:"perte"}],["H185maigre",{sex:"H",h:185,w:70,age:20,act:3,goal:"prise"}]];
const FS0=[["F165",{sex:"F",h:165,w:60,age:22,act:1,goal:"recompo"}],["F160perte",{sex:"F",h:160,w:52,age:22,act:1,goal:"perte"}],["F170",{sex:"F",h:170,w:68,age:25,act:2,goal:"maintien"}],["F158petite",{sex:"F",h:158,w:48,age:20,act:0,goal:"recompo"}],["F172perte",{sex:"F",h:172,w:75,age:28,act:2,goal:"perte"}]];
const HS=MODE==='foyer'?[["Anthony",{sex:"H",h:188,w:85,age:22,act:2,goal:"recompo"}],["Anthony-prise",{sex:"H",h:188,w:85,age:22,act:2,goal:"prise"}],["Anthony-perte",{sex:"H",h:188,w:85,age:22,act:2,goal:"perte"}]]:HS0;
const FS=MODE==='foyer'?[["P55",{sex:"F",h:160,w:55,age:22,act:1,goal:"recompo"}],["P60",{sex:"F",h:165,w:60,age:22,act:1,goal:"recompo"}],["P65perte",{sex:"F",h:168,w:65,age:22,act:2,goal:"perte"}],["P50",{sex:"F",h:158,w:50,age:22,act:1,goal:"maintien"}]]:FS0;
const issues={};let checks=0;
function flag(key,ex){if(!issues[key])issues[key]={n:0,ex:[]};issues[key].n++;if(issues[key].ex.length<3)issues[key].ex.push(ex)}
function run(seeds,los,snacks,lunches){
 for(const [hn,H] of HS)for(const [fn,Fm] of FS)for(const seed of seeds)for(const lo of los)for(const sn of snacks)for(const lm of lunches){
  S.people[0]=Object.assign({},S.people[0],H,{name:hn,snack:sn,lunch:"home",sweet:false,bkfFixed:"",adj:0,train:[true,true,false,true,true,false,false]});
  S.people[1]=Object.assign({},S.people[1],Fm,{name:fn,snack:sn,lunch:lm,sweet:true,bkfFixed:MODE==='foyer'?"Flocons d'avoine, muesli chocolat et lait":"",adj:0,train:[false,true,false,false,true,false,false]});
  S.seed=seed;S.leftovers=lo;S.start="2026-11-16";S.days=30;S.ov={};S.banned=[];S.excl=["fdm"];buildPlan();DCACHE.clear();
  for(let i=0;i<S.days;i++)for(let pi=0;pi<2;pi++){
   const p=S.people[pi],d=pd(pi,i),t=dayTarget(p,d.tr),sh=shares(p.snack);
   const ctx=p.name+" j"+i+(lo?" restes":"")+(sn?"":" sanscollation")+" "+lm;
   for(const k of ["bkf","lunch","snack","dinner"]){
    const m=d[k];if(!m)continue;const r=d.recs[k];checks++;
    const R=k==="bkf"?BKFR:k==="snack"?SNKR:MAINR;
    for(const f in m){const rg=R[f];
     const role=f===r.prot?"prot":f===r.carb?"carb":f===r.fat?"gras":"fixe";
     if(!rg){continue}
     if(m[f]<rg[0]-0.5&&(role!=="fixe"||k!=="lunch"&&k!=="dinner"))flag("TROP PEU "+k+" "+f+" ("+role+")",ctx+" | "+r.n+" : "+Math.round(m[f])+" g");
     if(m[f]>rg[1]+0.5)flag("TROP "+k+" "+f+" ("+role+")",ctx+" | "+r.n+" : "+Math.round(m[f])+" g");}
    if((k==="lunch"||k==="dinner")&&r.carb&&!(m[r.carb]>0))flag("SANS FECULENT "+k,ctx+" | "+r.n);
    const mk=macrosOf(m).kcal,tk=t.kcal*(sh[k]||0.3);const ratio=mk/tk;
    const lo2=k==="lunch"||k==="dinner"?0.6:0.5,hi2=k==="lunch"||k==="dinner"?1.45:1.7;
    if(ratio<lo2)flag("REPAS TROP PETIT "+k,ctx+" | "+r.n+" : "+Math.round(mk)+" kcal pour "+Math.round(tk));
    if(ratio>hi2)flag("REPAS TROP GROS "+k,ctx+" | "+r.n+" : "+Math.round(mk)+" kcal pour "+Math.round(tk));
   }
   const tot=macrosOf(sumItems([d.bkf,d.lunch,d.snack,d.dinner])),T=d.target;
   const e=(tot.kcal-T.kcal)/T.kcal;
   if(e>0.10)flag("JOUR AU DESSUS +10%",ctx+" : "+Math.round(tot.kcal)+"/"+T.kcal+" ("+Math.round(e*100)+"%)");
   if(e<-0.10)flag("JOUR EN DESSOUS -10%",ctx+" : "+Math.round(tot.kcal)+"/"+T.kcal+" ("+Math.round(e*100)+"%)");
   if(tot.p<T.P*0.88)flag("PROTEINES BASSES",ctx+" : "+Math.round(tot.p)+"/"+T.P);
   if(tot.p>T.P*1.3)flag("PROTEINES HAUTES",ctx+" : "+Math.round(tot.p)+"/"+T.P);
   if(tot.l>T.L*1.35)flag("LIPIDES HAUTS",ctx+" : "+Math.round(tot.l)+"/"+T.L);
   if(tot.l<T.L*0.6)flag("LIPIDES BAS",ctx+" : "+Math.round(tot.l)+"/"+T.L);
   if(tot.g<T.G*0.75)flag("GLUCIDES BAS",ctx+" : "+Math.round(tot.g)+"/"+T.G);
   if(tot.g>T.G*1.25)flag("GLUCIDES HAUTS",ctx+" : "+Math.round(tot.g)+"/"+T.G);
  }
 }
}
${MODE==='foyer'?'run([1,2,3,4,5,6,7,8,9,10,42,20261116],[false,true],[false],["alt","home"]);':QUICK?'run([1,7],[false,true],[true],["alt"]);':'run([1,7,42,20261116],[false,true],[true,false],["home","alt","week"]);'}
const keys=Object.keys(issues).sort((a,b)=>issues[b].n-issues[a].n);
window.__o="Repas vérifiés : "+checks+"\\n"+(keys.length?keys.map(k=>issues[k].n+"  "+k+"\\n     "+issues[k].ex.join("\\n     ")).join("\\n"):"AUCUNE ANOMALIE");
`);console.log(w.__o)},300);
