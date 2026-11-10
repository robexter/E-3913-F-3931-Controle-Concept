(()=>{'use strict';
const $=id=>document.getElementById(id),qsa=sel=>[...document.querySelectorAll(sel)],clamp=(n,a,b)=>Math.max(a,Math.min(b,n)),fmt=(n,d=1)=>Number(n).toFixed(d).replace('.',','),rand=items=>[...items].sort(()=>Math.random()-.5);
const explanations={
'LIC-518':['LIC-39518 — Controle de nível','LT-518 transmite a PV de nível da E-3913. Na captura atual LIC-39518 apresenta SP = 69% (diagrama didático anterior: 48%) e ajusta o SP remoto do FIC-534. Nível baixo → aumento esperado da referência de vazão; nível alto → redução. A capacidade de recuperação depende da retirada de líquido e da autoridade da FV-534.'],
'FIC-534':['FIC-534 — Malha interna da cascata','O FIC-534 compara o SP enviado pelo LIC-518 com a vazão FT-534 e calcula a solicitação de FV-534. Na V1.3.2, alterações do SP de nível são filtradas antes de gerar a referência de vazão e a MV tem limite de velocidade em AUTO/CAS, evitando quedas abruptas. Se a retirada permanecer inalterada, a vazão deve voltar à condição de balanço de massa. A opção didática NOVO REGIME acopla a mudança do SP a uma nova demanda/retirada, permitindo alcançar novo patamar de vazão fisicamente consistente. A dinâmica e o ganho de acoplamento não foram validados no SDCD.'],
'FV-534':['FV-534 — Válvula de DEA rica','Elemento final da alimentação da E-3913. Para vazão líquida em regime admissível, Q é função de Cv(abertura) e da raiz de ΔP. Uma mesma abertura não garante mesma vazão sob diferentes pressões. ZIC-502 utiliza um sinal associado à posição de controle desta válvula.'],
'ZIC-502':['ZIC-39502 — Controle de posição / VPC','Compara a abertura solicitada da FV-534 com o SP de posição (72% na captura). Em AUTO, desvio maior que 3 pontos percentuais faz sua MV (referência do PIC-39518) aumentar ou reduzir dentro da faixa didática 2,50–3,50 kgf/cm². Dentro de ±3%, congela a correção; em MAN ou desabilitado não corrige. Essa alteração da pressão afeta ΔP e a posição necessária da FV-534. Validar direção, velocidade e limites reais no Centum VP.'],
'PIC-518':['PIC-39518 — Pressão e split-range F-3931','Distribuição conforme informação operacional: MV de 0 a 50% abre apenas a FV-518A (GAS IN). Curva linear da FV-518A: cada ponto percentual a menos na MV abre A em 2 pontos percentuais, logo 0→100%, 25→50%, 50→0%. MV de 50 a 75% abre progressivamente a FV-518B (4% de abertura por 1% de MV); MV de 75 a 100% mantém B=100% e abre FV-518C na mesma taxa. Pressão baixa pede MV menor (GAS IN) e pressão alta MV maior (GAS OUT). Confirmar curva real dos PY-518A/B no SDCD.'],
'FV-518A':['FV-518A — GAS IN','Válvula de admissão de gás do tambor flash F-3931. Em pressão abaixo da referência, sua maior abertura tende a recuperar a pressão se houver gás disponível a pressão adequada. Verifique a capacidade e a fonte antes de atribuir uma pressão baixa somente ao controle.'],
'FV-518B':['FV-518B / FV-518C — GAS OUT','Na estratégia informada: para MV do PIC-39518 de 50 a 75%, B abre linearmente de 0 a 100%; de 75 a 100%, B permanece totalmente aberta e C abre de 0 a 100%. Ambas retiram gás do F-3931, reduzem a pressão e o diferencial disponível à FV-534, favorecendo queda de vazão de DEA rica até que o FIC-39534 corrija a abertura, se houver capacidade.'],
'FV-518C':['FV-518C — Segunda saída GAS OUT','MV do PIC-39518 acima de 75% abre gradualmente FV-518C a 4 pontos percentuais de abertura por 1 ponto de MV; atinge 100% em MV=100%. FV-518B já estará em 100% nessa faixa. Confirmar curvas reais nos blocos PY do SDCD.'],
'FY-533':['FY-533A/B/C e FF-533 — Razão','FY-533A (LDLAG) trata dinamicamente o sinal da alimentação. FY-533B/C calcula DR = 13,3875 × (RV + 1,03) − 26,217 e SP = RV1 × (1 + DR/100). FF-533 (RATIO) fornece referência para FFIC-533. Escalas reais de RV/RV1 não estão comprovadas.'],
'FFIC-533':['FFIC-39533 — Vazão V4 em MAN / AUTO / CAS','Em CAS, o FFIC-39533 recebe o SP remoto calculado por FY-533A/B/C e FF-533 conforme a carga de DEA rica; em AUTO usa SP local editável; em MAN mantém a MV informada. Sua MV passa pelo seletor mínimo FFY-533Y junto à saída do LIC-39527. Quando FFIC solicita menos do que LIC, sua saída é selecionada e pode aumentar a FV-533 até o limite imposto pela outra malha. Maior demanda de stripping é uma associação funcional de treinamento, não medição direta de vapor.'],
'LIC-527':['LIC-39527 — Nível F-3933','LT-527 mede o nível do vaso F-3933. A MV do LIC-39527 é uma solicitação independente da MV do FFIC-39533; FFY-533Y recebe ambas e aplica a menor. Nível baixo pode restringir a FV-533 se a ação for essa. Tracking / external reset do SDCD depende de confirmação.'],
'FFY-533Y':['FFY-533Y — Seletor de menor sinal','A MV do FFIC-39533 e a MV do LIC-39527 são calculadas independentemente. FFY-533Y escolhe somente a menor e a aplica à FV-533. No laboratório, a proteção anti-windup congela a integração positiva do FFIC enquanto o LIC restringe a válvula, sem forçar as duas MVs a serem iguais. Tracking real por reset externo pode levar saídas a acompanharem-se; confirmar o comportamento no SDCD.'],
'FV-533':['FV-533 — V4 para C-43','Válvula da corrente indicada no desenho como V4 P/C-43. Seu comando resulta da seleção de mínima FFY-533Y entre vazão FFIC-533 e nível LIC-527. Por isso uma diferença SP/PV de vazão pode ser atuação correta de uma restrição de inventário.'],
'PIC-524':['PIC-39524A/B — Pressão da E-3913','PIC-39524A controla normalmente a pressão em 0,60 kgf/cm² pela URE. Se a geração de gás aumentar, sua MV cresce até a capacidade da rota. Se não recuperar pressão e a PV atingir o SP do PIC-39524B (0,70 kgf/cm² na captura), a PV-39524B começa a abrir para flare em AUTO. A mesma condição pode decorrer de fechamento indevido da PV-39524A ou contrapressão/restrição de URE, mesmo sem MV=100% no PIC A. O simulador permite elevar o vapor de stripper, fazendo a temperatura de 117°C subir para 122–123°C e a geração de gás crescer por relação hipotética. Confirmar dinâmica, intertravamentos e DB=3 em engenharia.'],
'PV-524A':['PV-524A — Caminho para URE','Válvula prioritária de controle normal de pressão da E-3913, comandada pelo PIC-39524A. Com SP inicial 0,60 kgf/cm², pressão PV acima da referência deve produzir maior abertura para URE. A pressão cai com o aumento da retirada, enquanto a rota flare permanece fechada. A capacidade efetiva depende de ΔP e da contrapressão na URE.'],
'PV-524B':['PV-524B — Caminho para flare','A PV-39524B fica fechada na operação normal com PIC-39524A mantendo a torre em 0,60 kgf/cm². Se a pressão atingir ou superar o SP do PIC-39524B (0,70 kgf/cm² na captura) enquanto a URE está saturada, restrita, indisponível ou a PV-39524A fecha indevidamente, a malha de flare em AUTO passa a solicitar abertura proporcional. O flare não espera obrigatoriamente que a MV do PIC A alcance 100% quando sua válvula está impedida de escoar. O desenho de intertravamento e a DB=3 dependem de validação independente no SDCD.']
};
function explain(tag,scroll=false){const x=explanations[tag];if(!x)return;$('inspectorTitle').textContent=x[0];$('inspectorText').textContent=x[1];$('closeInspector').hidden=false;qsa('[data-hotspot]').forEach(el=>el.classList.toggle('chosen',el.dataset.hotspot===tag));if(scroll){$('simulador').scrollIntoView({behavior:'smooth'});setTimeout(()=>$('inspector').scrollIntoView({behavior:'smooth',block:'center'}),220);}}
qsa('[data-hotspot]').forEach(el=>{el.addEventListener('click',()=>explain(el.dataset.hotspot));el.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();explain(el.dataset.hotspot);}});});qsa('[data-open]').forEach(b=>b.addEventListener('click',()=>explain(b.dataset.open,true)));$('closeInspector').addEventListener('click',()=>{$('inspectorTitle').textContent='Selecione um instrumento';$('inspectorText').textContent='Clique em outro instrumento ou em uma lâmpada para consultar sua função. Os painéis não são abertos automaticamente.';$('closeInspector').hidden=true;qsa('[data-hotspot]').forEach(x=>x.classList.remove('chosen'));});qsa('[data-jump]').forEach(b=>b.addEventListener('click',()=>$(b.dataset.jump).scrollIntoView({behavior:'smooth'})));
qsa('[data-view]').forEach(b=>b.addEventListener('click',()=>{qsa('[data-view]').forEach(x=>x.classList.toggle('active',x===b));$('liveView').hidden=b.dataset.view!=='live';$('originalView').hidden=b.dataset.view!=='orig';}));
$('zoomOriginal').onclick=()=>$('diagramModal').hidden=false;$('closeModal').onclick=()=>$('diagramModal').hidden=true;qsa('[data-close-modal]').forEach(x=>x.onclick=()=>$('diagramModal').hidden=true);document.addEventListener('keydown',e=>{if(e.key==='Escape')$('diagramModal').hidden=true;});
let toastTimer=0;function toast(msg){const el=$('toast');el.textContent=msg;el.classList.add('show');clearTimeout(toastTimer);toastTimer=setTimeout(()=>el.classList.remove('show'),4200);}
const inputIds=['demand','supply','flashGas','gasGen','steamExcess','condIn','ratioTrim'];
const defaults={demand:2648.9,supply:100,flashGas:0,gasGen:100,steamExcess:0,condIn:273.5,ratioTrim:0};
const inputUnit={demand:'m³/d',supply:'%',flashGas:'%',gasGen:'%',steamExcess:'%',condIn:'t/d',ratioTrim:'%'};
// NOVO REGIME: hipótese explícita de alteração conjunta da retirada e do SP de nível; não é propriedade intrínseca da cascata.
const regimeBaseSP=69, regimeDefaultGain=40;
const getInput=id=>Number($('in-'+id).value);
function updateInputLabel(id){const v=getInput(id);setT('v-'+id,fmt(v,(id==='demand'||id==='condIn')?1:0)+' '+inputUnit[id]);}
inputIds.forEach(id=>{$('in-'+id).addEventListener('input',()=>{updateInputLabel(id);if(typeof S!=='undefined')log('Perturbação ajustada: '+id+' = '+fmt(getInput(id),1)+' '+inputUnit[id],false);});updateInputLabel(id);});
// Valores iniciais transcritos das capturas do SDCD; FFIC-39521 não está visível e usa hipótese rotulada.
// Unidades exibidas como "Kg" na tela são representadas aqui como kgf/cm² (interpretação a confirmar na engenharia).
const controllerDefs=[
 {id:'lic',tag:'LIC-39518',label:'Nível E-3913',unit:'%',pv:69,sp:69,mv:2658.7,min:0,max:100,step:.1,modes:['AUTO','MAN'],mvUnit:'m³/d',mvMin:1000,mvMax:4300},
 {id:'fic',tag:'FIC-39534',label:'DEA rica para E-3913',unit:'m³/d',pv:2648.9,sp:2658.7,mv:71,min:500,max:4300,step:.1,modes:['MAN','AUTO','CAS'],mvUnit:'%',mvMin:0,mvMax:100},
 {id:'zic',tag:'ZIC-39502',label:'Posição FV-534 · DB ±3 p.p.',unit:'%',pv:71,sp:72,mv:3.0,min:5,max:95,step:.1,modes:['AUTO','MAN'],mvUnit:'kgf/cm²',mvMin:2.5,mvMax:3.5},
 {id:'pic',tag:'PIC-39518',label:'Pressão F-3931',unit:'kgf/cm²',pv:3.06,sp:3,mv:53,min:2.5,max:3.5,step:.01,modes:['MAN','AUTO','CAS'],mvUnit:'%',mvMin:0,mvMax:100},
 {id:'ffic',tag:'FFIC-39533',label:'V4/condensado · vapor stripper',unit:'t/d',pv:273.5,sp:279.6,mv:20.8,min:50,max:500,step:.1,modes:['MAN','AUTO','CAS'],mvUnit:'%',mvMin:0,mvMax:100},
 {id:'lic27',tag:'LIC-39527',label:'Nível F-3933',unit:'%',pv:82,sp:75,mv:23.5,min:0,max:100,step:.1,modes:['AUTO','MAN'],mvUnit:'%',mvMin:0,mvMax:100},
 {id:'pica',tag:'PIC-39524A',label:'Pressão E-3913 · URE',unit:'kgf/cm²',pv:.60,sp:.60,mv:15,min:0,max:2,step:.01,modes:['AUTO','MAN'],mvUnit:'%',mvMin:0,mvMax:100},
 {id:'picb',tag:'PIC-39524B',label:'Pressão E-3913 · flare',unit:'kgf/cm²',pv:.60,sp:.70,mv:0,min:0,max:2,step:.01,modes:['AUTO','MAN'],mvUnit:'%',mvMin:0,mvMax:100},
 {id:'dea11',tag:'FFIC-39522',label:'Consumo de DEA E-3911',unit:'m³/d',pv:1297,sp:1300,mv:39.3,min:0,max:3000,step:1,modes:['AUTO','MAN'],mvUnit:'%',mvMin:0,mvMax:100},
 {id:'dea12',tag:'FFIC-39521',label:'Consumo de DEA E-3912 · exemplo',unit:'m³/d',pv:1200,sp:1200,mv:40,min:0,max:3000,step:1,modes:['AUTO','MAN'],mvUnit:'%',mvMin:0,mvMax:100,assumed:true}
];
const ctrls={};for(const def of controllerDefs){ctrls[def.id]={def,mode:['fic','pic','ffic'].includes(def.id)?'CAS':'AUTO',sp:def.sp,mv:def.mv,effectiveSP:def.sp};}
const initial=()=>({t:0,level:69,cond:82,flash:3.06,top:.60,stripTemp:117,steamGasExtra:0,flow:2648.9,flowPV:2648.9,v4flow:273.5,q3911:1297,q3912:1200,returnDemand:2648.9,regimeDelta:0,regimeTarget:2648.9,regimeTargetDelta:0,ftFrozenValue:2648.9,fICSP:2658.7,levelSPFiltered:69,ficRawMV:71,licRawSP:2658.7,flashSP:3.00,v4SP:279.6,dr:0,rv:.93,rv1:279.6,prevFlow:2648.9,mv534:71,cmd534:71,mv533:20.8,cmd533:20.8,valveIn:0,valveB:12,valveC:0,ure:15,flare:0,flowControlOut:20.8,levelControlOut:23.5,selected:'FFIC-39533',selectedOut:20.8,LInt:0,FInt:0,FlashInt:0,ZTrim:0,TopInt:0,V4Int:0,CondInt:0,D11Int:0,D12Int:0,FlareInt:0,topDemand:15,topRoute:'URE CONTROLA · FLARE FECHADO',flareActive:false,ureSaturatedPrev:false,steamWarnPrev:false,flareSPPrev:false,flashDemand:53,zicStatus:'DENTRO ±3% · SEM AJUSTE',zicError:-1,splitStage:'FV-518B (GAS OUT)',stability:100,flarePrev:false,selectedPrev:'FFIC-39533',gasWarnPrev:false});
let S=initial(),running=true,speed=1,lastFrame=performance.now(),renderClock=0,chartClock=0,history=[];
function log(msg,highlight=true){const el=$('eventLog'),p=document.createElement('div');p.className='log-line';const t=document.createElement('time');t.textContent=`${fmt(S.t,0)} s`;const sp=document.createElement('span');sp.textContent=msg;if(highlight)sp.style.fontWeight='750';p.append(t,sp);el.prepend(p);while(el.children.length>60)el.lastElementChild.remove();}
function setT(id,value){const x=$(id);if(x)x.textContent=value;}
function setBar(id,v){const x=$(id);if(x)x.style.width=`${clamp(v,0,100)}%`;}
function numFmt(v,unit){const d=unit==='kgf/cm²'?2:unit==='m³/d'||unit==='t/d'?1:1;return fmt(v,d);}
function makeModePanel(){const host=$('operatingControllers');if(!host)return;host.innerHTML=controllerDefs.map(d=>{const c=ctrls[d.id];return `<div class="op-card" data-controller="${d.id}"><div class="op-title"><strong>${d.tag}</strong><span>${d.label}</span>${d.assumed?'<em>SP/PV de partida demonstrativos — não constam das capturas</em>':''}</div><div class="op-data"><div><small>PV</small><b id="pv-${d.id}">${numFmt(d.pv,d.unit)} <small>${d.unit}</small></b></div><label><small id="sp-label-${d.id}">SP editável</small><input type="number" inputmode="decimal" id="sp-${d.id}" min="${d.min}" max="${d.max}" step="${d.step}" value="${d.sp}"></label><label><small>Modo</small><select id="mode-${d.id}">${d.modes.map(m=>`<option value="${m}" ${m===c.mode?'selected':''}>${m}</option>`).join('')}</select></label><div><small>MV / saída</small><b id="mv-${d.id}">${numFmt(d.mv,d.mvUnit)} <small>${d.mvUnit}</small></b></div></div><div class="op-manual" id="manual-wrap-${d.id}" hidden><label for="manual-${d.id}">Saída em MAN (${d.mvUnit}):</label><input id="manual-${d.id}" type="number" inputmode="decimal" min="${d.mvMin}" max="${d.mvMax}" step="${d.mvUnit==='kgf/cm²'?.01:.1}" value="${d.mv}"></div><small class="op-message" id="hint-${d.id}"></small></div>`;}).join('');
for(const d of controllerDefs){const c=ctrls[d.id];$('mode-'+d.id).addEventListener('change',e=>{const m=e.target.value;if(!d.modes.includes(m)){e.target.value=c.mode;return;}c.mv=outputFor(d.id);$('manual-'+d.id).value=String(clamp(c.mv,d.mvMin,d.mvMax));c.mode=m;modeFields(d.id);log(d.tag+' passou para '+m+'.');});$('sp-'+d.id).addEventListener('change',e=>{if(c.mode!=='AUTO'){e.target.value=c.sp;return;}const v=Number(e.target.value);if(!Number.isFinite(v)){e.target.value=c.sp;return;}c.sp=clamp(v,d.min,d.max);e.target.value=String(c.sp);log('SP de '+d.tag+' alterado para '+numFmt(c.sp,d.unit)+' '+d.unit+'.');});$('manual-'+d.id).addEventListener('change',e=>{if(c.mode!=='MAN')return;const v=Number(e.target.value);if(Number.isFinite(v))c.mv=clamp(v,d.mvMin,d.mvMax);e.target.value=String(c.mv);log('MV manual de '+d.tag+' = '+numFmt(c.mv,d.mvUnit)+' '+d.mvUnit);});modeFields(d.id);}}
function modeFields(id){const c=ctrls[id],d=c.def,sp=$('sp-'+id);setT('sp-label-'+id,c.mode==='CAS'?'SP remoto':c.mode==='MAN'?'SP inativo':'SP editável');sp.disabled=c.mode!=='AUTO';$('manual-wrap-'+id).hidden=c.mode!=='MAN';$('hint-'+id).textContent=c.mode==='CAS'?'CAS: SP remoto recebido da malha mestre; altere o SP no controlador mestre.':c.mode==='MAN'?'MAN: saída fixa pelo operador; alteração do SP não comanda a válvula.':'AUTO: ajuste o SP e acompanhe PV e MV.';}
function outputFor(id){return {lic:S.fICSP,fic:S.cmd534,zic:S.flashSP,pic:S.flashDemand,ffic:S.flowControlOut,lic27:S.levelControlOut,pica:S.topDemand,picb:S.flare,dea11:(ctrls.dea11.actualMV??ctrls.dea11.mv),dea12:(ctrls.dea12.actualMV??ctrls.dea12.mv)}[id]??ctrls[id].mv;}
function reset(keepInputs=false){S=initial();history=[];if(!keepInputs){for(const id of inputIds){$('in-'+id).value=defaults[id];updateInputLabel(id);} $('faultSel').value='none';for(const id of ['ckZic','ckProtection','ckTracking','ckRegime'])$(id).checked=true;$('regimeGain').value=regimeDefaultGain;setT('regimeGainValue',fmt(regimeDefaultGain,0)+' m³/d por p.p.');for(const d of controllerDefs){const c=ctrls[d.id];c.sp=d.sp;c.mv=d.mv;c.mode=['fic','pic','ffic'].includes(d.id)?'CAS':'AUTO';$('mode-'+d.id).value=c.mode;$('sp-'+d.id).value=c.sp;$('manual-'+d.id).value=c.mv;modeFields(d.id);}}$('eventLog').innerHTML='';log('Simulação reiniciada nas referências das capturas; FFIC-39521 permanece um exemplo editável.');collectHistory();render();}
function modPI(error,intKey,kp,ki,base,dt,lo,hi){let integral=S[intKey]||0;const pre=base+kp*error+integral,delta=ki*error*dt;if((pre>lo&&pre<hi)||(pre>=hi&&delta<0)||(pre<=lo&&delta>0))integral=clamp(integral+delta,-1200,1200);S[intKey]=integral;return clamp(base+kp*error+integral,lo,hi);}
function control(id,pv,dt,kp,ki,base,iKey,lo=0,hi=100,spOverride=null){const c=ctrls[id];c.effectiveSP=spOverride===null?c.sp:spOverride;const value=c.mode==='MAN'?clamp(c.mv,lo,hi):modPI(c.effectiveSP-pv,iKey,kp,ki,base,dt,lo,hi);c.actualMV=value;return value;}
function advance(dt){const fault=$('faultSel').value;
// 1) Absorvedoras E-3911 e E-3912: dois consumos de DEA independentes (FFC 39522 / 39521).
const out11=control('dea11',S.q3911,dt,.034,.018,39.3,'D11Int');const out12=control('dea12',S.q3912,dt,.036,.019,40,'D12Int');
S.q3911+=(clamp(1297*out11/39.3,0,3100)-S.q3911)*dt/2.2;S.q3912+=(clamp(1200*out12/40,0,3100)-S.q3912)*dt/2.3;
// Dinâmica didática do retorno: acréscimo de consumo altera a demanda da E-3913 com atraso; não é balanço de planta validado.
const baseDemand=getInput('demand')+(S.q3911-1297)+(S.q3912-1200);
// Modelo com conservação de inventário: um NOVO patamar de vazão permanente exige alteração da retirada.
// Quando ckRegime ativo, a simulação SUPÕE que o regime downstream muda junto com o SP do nível.
// Sem esse acoplamento, um degrau apenas em SP gera alteração transitória na vazão, retornando à retirada constante.
const paired=$('ckRegime').checked&&ctrls.lic.mode==='AUTO';
S.regimeTargetDelta=paired?(ctrls.lic.sp-regimeBaseSP)*Number($('regimeGain').value):0;
const regimeRate=2.8; // m³/d por segundo (hipótese didática)
S.regimeDelta+=clamp(S.regimeTargetDelta-S.regimeDelta,-regimeRate*dt,regimeRate*dt);
S.regimeTarget=clamp(baseDemand+S.regimeTargetDelta,800,4400);
const demandTarget=baseDemand+S.regimeDelta;
S.returnDemand+=(clamp(demandTarget,800,4400)-S.returnDemand)*Math.min(1,dt/6.0);
// 2) Inventário E-3913 e cascata de FIC-39534; MAN e CAS efetivamente diferentes.
const lic=ctrls.lic;
// V1.3.2: ajuste de SP de nível sem degrau na saída mestre.
// 8 s = constante didática de filtro de referência, não um parâmetro confirmado do SDCD.
if(lic.mode==='AUTO')S.levelSPFiltered+=(lic.sp-S.levelSPFiltered)*Math.min(1,dt/8);
else S.levelSPFiltered=lic.sp;
S.licRawSP=control('lic',S.level,dt,21,.09,2658.7,'LInt',1000,4300,lic.mode==='AUTO'?S.levelSPFiltered:lic.sp);
// Feedforward didático da mudança de retirada: no NOVO REGIME, acompanhamos a demanda simulada
// no SP remoto do FIC-39534, para evitar que o controle de nível precise integrar toda a mudança
// e para preservar a conservação de massa no novo ponto de operação. Não configura lógica real do SDCD.
if(lic.mode==='AUTO'&&$('ckRegime').checked)S.licRawSP=clamp(S.licRawSP+S.regimeDelta,1000,4300);
// Limita a variação do setpoint REMOTO transmitido ao FIC (12 m³/d/s didáticos).
const licRate=12;
S.fICSP=lic.mode==='MAN'?S.licRawSP:S.fICSP+clamp(S.licRawSP-S.fICSP,-licRate*dt,licRate*dt);
const fic=ctrls.fic;const spFic=fic.mode==='CAS'?S.fICSP:fic.sp;S.flowPV=fault==='ft534'?S.ftFrozenValue:S.flow;
S.ficRawMV=control('fic',S.flowPV,dt,.022,.018,71,'FInt',0,100,spFic);
// Sinal FIC em CAS/AUTO acompanha por rampa: queda de abertura gradual sem degraus.
// Em MAN, a MV manual segue o comando inserido pelo usuário (com inércia física da válvula).
const mvRate=0.85; // pontos percentuais de MV por segundo simulado
S.cmd534=fic.mode==='MAN'?S.ficRawMV:S.cmd534+clamp(S.ficRawMV-S.cmd534,-mvRate*dt,mvRate*dt);
// External-reset/back-calculation simplificado, somente quando a taxa limita o controlador.
if(fic.mode!=='MAN'&&Math.abs(S.ficRawMV-S.cmd534)>0.1){
 S.FInt=clamp(S.cmd534-71-.022*(spFic-S.flowPV),-100,100);
}
const desiredValve=fault==='valve534'?71:S.cmd534;S.mv534+=(desiredValve-S.mv534)*Math.min(1,dt/1.7);
const hd=clamp((getInput('supply')/100)*(S.flash/3.06),.15,2.4);
S.flow+=(clamp(2648.9*(S.mv534/71)*Math.sqrt(hd),0,4800)-S.flow)*dt/1.65;
S.level=clamp(S.level+dt*.002*(S.flow-S.returnDemand),0,100);
// 3) ZIC-39502: DB de ±3 pontos percentuais; o desvio fora da DB deve mover o SP do PIC.
const zic=ctrls.zic;zic.effectiveSP=zic.sp;
// Comparar PV recebida da MV do FIC-39534 (posição comandada), conforme diagrama e tela.
const errZ=S.cmd534-zic.sp;S.zicError=errZ;
const zicEnabled=zic.mode==='AUTO'&&$('ckZic').checked;
if(zic.mode==='MAN'){
 S.flashSP=clamp(zic.mv,2.5,3.5);S.ZTrim=S.flashSP-3;
 S.zicStatus='MAN · MV FIXADA PELO OPERADOR';
}else if(!$('ckZic').checked){
 S.flashSP=clamp(3+S.ZTrim,2.5,3.5);
 S.zicStatus='DESABILITADO · SEM CORREÇÃO';
}else if(Math.abs(errZ)<=3){
 S.flashSP=clamp(3+S.ZTrim,2.5,3.5);
 S.zicStatus='DENTRO ±3% · CORREÇÃO SUSPENSA';
}else{
 // Incremento só no excesso de erro acima da DB; taxa didática em kgf/cm²/s por p.p.
 const move=.0075*(errZ-Math.sign(errZ)*3)*dt;
 S.ZTrim=clamp(S.ZTrim+move,-.5,.5);
 S.flashSP=clamp(3+S.ZTrim,2.5,3.5);
 const stuck=(errZ>3&&S.flashSP>=3.5-1e-7)||(errZ< -3&&S.flashSP<=2.5+1e-7);
 S.zicStatus=stuck?'FORA DA DB · LIMITE DE SP ATINGIDO':(errZ>3?'FORA DA DB · ELEVANDO SP PIC':'FORA DA DB · REDUZINDO SP PIC');
}
if(zicEnabled&&ctrls.pic.mode!=='CAS')S.zicStatus+=' · PIC FORA DE CAS (SP NÃO APLICADO)';
zic.actualMV=S.flashSP;
// 4) Curvas INFORMADAS INFORMADAS pelo operador, ainda não extraídas da configuração PY no SDCD.
// Curva linear corrigida do operador: FV-518A = 100 - 2*MV (0..50); B=4*(MV-50) (50..75); C=4*(MV-75) (75..100).
function split518(mv){
 const u=clamp(mv,0,100);
 const a=u<50?100-2*u:0;
 const b=u<=50?0:u<75?4*(u-50):100;
 const c=u<=75?0:4*(u-75);
 return {a:clamp(a,0,100),b:clamp(b,0,100),c:clamp(c,0,100),stage:u<50?'FV-518A · GAS IN':u<75?'FV-518B · GAS OUT':u<100?'FV-518C · GAS OUT':'FV-518B/C · GAS OUT'};
}
const pic=ctrls.pic;const picSP=pic.mode==='CAS'?S.flashSP:pic.sp;
// Ação reversa da saída: pressão PV baixa → MV < 50 (GAS IN); pressão alta → MV > 50 (GAS OUT).
S.flashDemand=control('pic',S.flash,dt,-36,-2.4,50,'FlashInt',0,100,picSP);
const split=split518(S.flashDemand);S.splitStage=split.stage;
S.valveIn+=(split.a-S.valveIn)*Math.min(1,dt/1.0);
S.valveB+=(split.b-S.valveB)*Math.min(1,dt/1.0);
S.valveC+=(split.c-S.valveC)*Math.min(1,dt/1.0);
// Inventário de gás didático: admissão eleva pressão; retirada a reduz; resistência do sistema estabiliza o balanço.
S.flash=clamp(S.flash+dt*(.0028*S.valveIn-.0033*(S.valveB+S.valveC)+.00010*getInput('flashGas')+.0000015*(S.flow-2648.9)+.010*(3.06-S.flash)),1.2,5.0);
// 5) Pressão de topo E-3913: PIC-39524A é o mestre da URE (SP inicial 0,60).
// Topo E-3913 (didático): o PIC-39524A controla prioritariamente a pressão pela URE.
// O vapor de stripper, quando excessivo, eleva a temperatura acima de 118°C e acrescenta
// geração de gás no modelo. Ganho e constante de tempo NÃO são parâmetros do SDCD.
// Referência observada: operação 116–118°C, caso anormal relatado 122–123°C.
// Ganhos e constante de tempo são ajustados didaticamente para demonstrar a
// priorização URE → flare sem impor valores de projeto ou resposta de segurança.
const steamExcess=getInput('steamExcess');
const stripTarget=117+steamExcess*0.06;
S.stripTemp+=(stripTarget-S.stripTemp)*Math.min(1,dt/30);
S.steamGasExtra=0.030*Math.max(0,S.stripTemp-118);
const topA=ctrls.pica;topA.effectiveSP=topA.sp;
S.topDemand=topA.mode==='MAN'?clamp(topA.mv,0,100):modPI(S.top-topA.sp,'TopInt',280,9.0,15,dt,0,100);
topA.actualMV=S.topDemand;
// Diferencie comando de abertura REAL. Fechamento indevido ou contrapressão podem
// anular a vazão para URE mesmo com a MV solicitando 100%.
const capacity=fault==='ure'?12:fault==='ureClosed'?0:100;
const cmdURE=Math.min(S.topDemand,capacity);
const b=ctrls.picb;b.effectiveSP=b.sp;
const ureSaturated=topA.mode!=='MAN'&&S.topDemand>=99.5;
const ureUnavailable=(fault==='ure'||fault==='ureClosed')||(topA.mode==='MAN');
const ureCannotControl=ureSaturated||ureUnavailable;
// A PV-39524B só inicia quando PV alcança seu próprio SP e a rota principal
// não consegue manter controle; é possível flare mesmo sem MV A=100 quando URE falha.
// Histerese de apenas 0,01 kgf/cm² para evitar tremulação no modelo didático.
if(!S.flareActive){if(ureCannotControl&&S.top>=b.sp)S.flareActive=true;}
else if(!ureCannotControl||S.top<b.sp-0.01)S.flareActive=false;
let cmdFlare=0;
if(b.mode==='MAN')cmdFlare=clamp(b.mv,0,100);
else if(S.flareActive){
  // Variável de pressão é a mesma do PIC A; a abertura cresce com o desvio acima do SP B.
  cmdFlare=modPI(S.top-b.sp,'FlareInt',210,5.5,0,dt,0,100);
}else S.FlareInt=0;
b.actualMV=cmdFlare;
S.topRoute=cmdFlare>0.5?'FLARE AUXILIA · PRESSÃO ELEVADA':fault==='ureClosed'?'URE FECHADA INDEVIDAMENTE':fault==='ure'?'URE RESTRITA · FLARE AGUARDA SP':ureSaturated?'URE EM 100% · AVALIAR SP FLARE':topA.mode==='MAN'?'URE EM MAN · PRESSÃO SOB CONTROLE?':'URE CONTROLA · FLARE FECHADO';
S.ure+=(cmdURE-S.ure)*Math.min(1,dt/1.3);
S.flare+=(cmdFlare-S.flare)*Math.min(1,dt/1.25);
// Balanço dinâmico de gás simplificado. Em condição inicial, T=117°C, URE=15%,
// flare=0% e P=0,60 kgf/cm². A derivação de gás por excesso de vapor é hipotética.
S.top=clamp(S.top+dt*(.00024*(getInput('gasGen')-100)+S.steamGasExtra-.0012*(S.ure-15)-.0019*S.flare+.0000025*(S.flow-2648.9)),0.05,2.0);
if(ureSaturated&&!S.ureSaturatedPrev){log('PIC-39524A atingiu MV=100%: limite de capacidade URE; se pressão atingir SP do flare, PIC-39524B poderá atuar.');S.ureSaturatedPrev=true;}
if(!ureSaturated)S.ureSaturatedPrev=false;
if(S.stripTemp>=122&&!S.steamWarnPrev){log('Temperatura da E-3913 alcançou 122°C: geração extra de gás apenas hipotética na simulação.');S.steamWarnPrev=true;}
if(S.stripTemp<121)S.steamWarnPrev=false;
if(S.flareActive&&!S.flareSPPrev){log('SP PIC-39524B alcançado com URE insuficiente: solicitação de abertura para flare em AUTO.');S.flareSPPrev=true;}
if(!S.flareActive)S.flareSPPrev=false;
// 6) DR e SP de V4 em t/d, seletor de mínima entre FFIC-39533 e LIC-39527.
S.rv=clamp(.93+.002*(S.topDemand-15),.2,1.8);
const derivative=clamp((S.flow-S.prevFlow)/Math.max(dt,.01),-500,500);
const rvTarget=279.6*(S.flow/2648.9)+.003*derivative;
S.rv1+=(clamp(rvTarget,80,450)-S.rv1)*dt/6.0;S.prevFlow=S.flow;
S.dr=13.3875*(S.rv+1.03)-26.217+getInput('ratioTrim');
const ffSP=clamp(S.rv1*(1+S.dr/100),50,500);
S.v4SP=ctrls.ffic.mode==='CAS'?ffSP:ctrls.ffic.sp; // AUTO usa SP local; CAS recebe FF-533.
// Cada controlador gera sua própria MV; o seletor atua SOMENTE depois da comparação.
// Evitar 'tracking' que força a integral do FFIC à MV do LIC: isso fazia as duas saídas coincidirem
// artificialmente e ocultava a autoridade real do seletor. O anti-windup didático abaixo apenas
// congela o crescimento positivo da integral do FFIC sem autoridade; não iguala MVs.
const oldV4Int=S.V4Int;
S.flowControlOut=control('ffic',S.v4flow,dt,.085,.031,20.8,'V4Int',0,100,S.v4SP);
S.levelControlOut=control('lic27',S.cond,dt,-1.5,-.014,13,'CondInt',0,100); // nível abaixo do SP restringe a saída (ação física esperada)
let selection=$('ckProtection').checked&&S.levelControlOut<S.flowControlOut?'LIC-39527':'FFIC-39533';
if($('ckTracking').checked && selection==='LIC-39527' && ctrls.ffic.mode!=='MAN'){
  const e=S.v4SP-S.v4flow;
  // Congela apenas integração na direção de abrir mais a válvula quando LIC já restringe.
  // Erro inverso ainda pode reduzir a demanda do FFIC até ele recuperar a autoridade.
  if(e>0 && S.V4Int>oldV4Int){
    S.V4Int=oldV4Int;
    S.flowControlOut=clamp(20.8+.085*e+S.V4Int,0,100);
    ctrls.ffic.actualMV=S.flowControlOut;
    selection=$('ckProtection').checked&&S.levelControlOut<S.flowControlOut?'LIC-39527':'FFIC-39533';
  }
}
S.selected=selection;
S.selectedOut=selection==='LIC-39527'?S.levelControlOut:S.flowControlOut;
S.cmd533=S.selectedOut;
S.mv533+=((fault==='valve533'?20.8:S.cmd533)-S.mv533)*dt/1.4;
S.v4flow+=(clamp(273.5*S.mv533/20.8,0,650)-S.v4flow)*dt/1.6;
S.cond=clamp(S.cond+dt*.013*(getInput('condIn')-S.v4flow),0,100);
// Métrica didática em unidades normalizadas por tolerâncias especificadas (não é medição do SDCD).
const err=1.7*Math.abs(S.level-ctrls.lic.sp)+10*Math.abs(S.flash-picSP)+18*Math.abs(S.top-ctrls.pica.sp)+.9*Math.abs(S.cond-ctrls.lic27.sp)+.009*Math.abs(S.flow-S.fICSP);
S.stability=clamp(100-err,0,100);S.t+=dt;
if(S.selected!==S.selectedPrev){log('FFY-533Y: autoridade transferida para '+S.selected+'.');S.selectedPrev=S.selected;}
if(S.flare>3&&!S.flarePrev){log('Ação de controle PIC-39524B solicita a rota flare; intertravamento didático é módulo separado.');S.flarePrev=true;}
if(S.flare<1&&S.flarePrev){log('Demanda de flare retornou abaixo de 1%.');S.flarePrev=false;}
if(S.stability<45&&!S.gasWarnPrev){log('Desvio elevado no indicador didático: verificar modos, SP e saturação.');S.gasWarnPrev=true;}
if(S.stability>84)S.gasWarnPrev=false;
}
function collectHistory(){history.push({t:S.t,level:S.level,levelSP:ctrls.lic.sp,cond:S.cond,condSP:ctrls.lic27.sp,flash:S.flash,flashSP:ctrls.pic.effectiveSP,top:S.top,topSP:ctrls.pica.sp,topFlareSP:ctrls.picb.sp,stripTemp:S.stripTemp,ure:S.ure,flare:S.flare,mvURE:S.topDemand,flow:S.flow,flowSP:ctrls.fic.effectiveSP,returnDemand:S.returnDemand,v4flow:S.v4flow,v4SP:S.v4SP,mvFfic:S.flowControlOut,mvLic:S.levelControlOut,mvSelected:S.selectedOut,mvValve533:S.mv533,mvPic:S.flashDemand,valveA:S.valveIn,valveB:S.valveB,valveC:S.valveC,zicError:S.zicError,dea11:S.q3911,dea11SP:ctrls.dea11.sp,dea12:S.q3912,dea12SP:ctrls.dea12.sp});if(history.length>300)history.shift();}
function render(){setT('simClock','t = '+fmt(S.t)+' s');
setT('kLevel',fmt(S.level)+'%');setT('kFlash',fmt(S.flash,2)+' kgf/cm²');setT('kFeed',fmt(S.flow,1)+' m³/d');setT('kCond',fmt(S.cond)+'%');setT('kTop',fmt(S.top,2)+' kgf/cm²');
setBar('barLevel',S.level);setBar('barFlash',S.flash/5*100);setBar('barFeed',S.flow/4000*100);setBar('barCond',S.cond);setBar('barTop',S.top/2*100);
setT('feedSPK','SP efetivo = '+fmt(S.fICSP,1)+' m³/d');setT('regimeTarget',fmt(S.regimeTarget,1)+' m³/d');setT('regimeActual',fmt(S.returnDemand,1)+' m³/d');setT('regimeDelta',fmt(S.regimeTargetDelta,1)+' m³/d');
setT('outFeedSP',fmt(S.fICSP,1)+' m³/d');setT('outValve534',fmt(S.mv534)+'%');setT('outFlashSP',fmt(S.flashSP,2)+' kgf/cm²');setT('outValveIn',fmt(S.valveIn)+'%');setT('outValveOut',fmt(S.valveB)+' / '+fmt(S.valveC)+'%');setT('outDR',fmt(S.dr,2)+'%');setT('outV4SP',fmt(S.v4SP,1)+' / '+fmt(S.v4flow,1)+' t/d');setT('outSelected',S.selected);setT('outValve533',fmt(S.mv533)+'%');setT('outURE',fmt(S.ure)+'%');setT('outFlare',fmt(S.flare)+'%');setT('outTopRoute',S.topRoute);setT('outStripTemp',fmt(S.stripTemp,1)+' °C');setT('outSteamGasSource',fmt(S.steamGasExtra,3)+' kgf/cm²/s (modelo)');setT('outURECmd',fmt(S.topDemand,1)+'%');setT('outFlareSP',fmt(ctrls.picb.sp,2)+' kgf/cm²');
setT('outZicDeadband',S.zicStatus+' · desvio '+fmt(S.zicError,1)+' p.p.');setT('outSplitStage',S.splitStage+' · MV '+fmt(S.flashDemand,1)+'%');setT('outSelectedMV',fmt(S.selectedOut,1)+'% selecionado · FFIC '+fmt(S.flowControlOut,1)+'% | LIC '+fmt(S.levelControlOut,1)+'%');setT('outSelectorDelta',fmt(Math.abs(S.flowControlOut-S.levelControlOut),2)+' p.p. · autoridade: '+S.selected);setT('outDEA11',fmt(S.q3911,1)+' / '+fmt(ctrls.dea11.sp,1)+' m³/d');setT('outDEA12',fmt(S.q3912,1)+' / '+fmt(ctrls.dea12.sp,1)+' m³/d');
const stability=S.stability>85?'ESTÁVEL':S.stability>59?'EM ACOMODAÇÃO':'DESVIO ELEVADO';setT('kStability',stability);$('kStability').style.color=S.stability>85?'#0d8e70':S.stability>59?'#b68324':'#c95c51';setT('stabilityText',S.stability>85?'Variáveis próximas às referências':S.stability>59?'Controladores corrigindo perturbação':'Rever capacidade, limites e falhas');$('healthline').firstElementChild.style.width=fmt(S.stability,0)+'%';
setT('svgLevel',fmt(S.level)+'%');setT('svgFlashP',fmt(S.flash,2));setT('svgZic',fmt(S.flashSP,2));setT('svgFeed',fmt(S.flow,0));setT('svgTop',fmt(S.top,2));setT('svgV4',fmt(S.v4flow,1));setT('svgCond',fmt(S.cond)+'%');const levelFill=$('towerFill'),h=clamp(S.level/100*160,3,160);levelFill.setAttribute('y',String(471-h));levelFill.setAttribute('height',String(h));
const bars={'valve-534':S.mv534,'valve-533':S.mv533,'valve-518a':S.valveIn,'valve-518b':S.valveB,'valve-518c':S.valveC,'valve-524a':S.ure,'valve-524b':S.flare};for(let id in bars){const el=$(id),value=bars[id];if(el){el.setAttribute('width',String(Math.max(1,value*.30)));el.style.fill=value>75?'#e6a044':value<5?'#92aaba':'#27bfa5';}}
for(const d of controllerDefs){const c=ctrls[d.id],pv={lic:S.level,fic:S.flowPV,zic:S.mv534,pic:S.flash,ffic:S.v4flow,lic27:S.cond,pica:S.top,picb:S.top,dea11:S.q3911,dea12:S.q3912}[d.id];setT('pv-'+d.id,numFmt(pv,d.unit)+' '+d.unit);setT('mv-'+d.id,numFmt(outputFor(d.id),d.mvUnit)+' '+d.mvUnit);if(c.mode==='CAS'){$('sp-'+d.id).value=c.effectiveSP.toFixed(d.unit==='kgf/cm²'?2:1);} }
}
function drawChart(id,series,lo,hi){const canvas=$(id);if(!canvas)return;const r=canvas.getBoundingClientRect(),w=Math.max(170,r.width),h=165,dpr=Math.min(window.devicePixelRatio||1,2);if(canvas.width!==Math.round(w*dpr)||canvas.height!==Math.round(h*dpr)){canvas.width=Math.round(w*dpr);canvas.height=Math.round(h*dpr);}const ctx=canvas.getContext('2d');ctx.setTransform(dpr,0,0,dpr,0,0);ctx.clearRect(0,0,w,h);const left=49,right=w-10,top=10,bottom=h-22;ctx.font='10px Segoe UI,Arial';ctx.strokeStyle='#e4ebf0';ctx.fillStyle='#889eac';ctx.textAlign='right';for(let i=0;i<=4;i++){const val=lo+(hi-lo)*i/4,y=bottom-(bottom-top)*i/4;ctx.beginPath();ctx.moveTo(left,y);ctx.lineTo(right,y);ctx.stroke();ctx.fillText(hi<=6?fmt(val,1):fmt(val,0),left-5,y+3);}if(history.length<2)return;const xx=i=>left+i/(history.length-1)*(right-left), yy=v=>bottom-clamp((v-lo)/(hi-lo),0,1)*(bottom-top);for(const se of series){ctx.strokeStyle=se.color;ctx.lineWidth=se.sp?1.35:2.1;ctx.setLineDash(se.sp?[4,3]:[]);ctx.beginPath();history.forEach((row,i)=>{const x=xx(i),y=yy(row[se.key]);if(i===0)ctx.moveTo(x,y);else ctx.lineTo(x,y);});ctx.stroke();}ctx.setLineDash([]);ctx.fillStyle='#8798a5';ctx.textAlign='left';ctx.fillText(fmt(history[0].t,0)+' s',left,bottom+15);ctx.textAlign='right';ctx.fillText(fmt(history.at(-1).t,0)+' s',right,bottom+15);}
function drawCharts(){drawChart('chartLevels',[{key:'level',color:'#22a9a9'},{key:'cond',color:'#e4a349'},{key:'levelSP',color:'#9eafb9',sp:true},{key:'condSP',color:'#d2b38b',sp:true}],0,100);drawChart('chartTop',[{key:'top',color:'#278dce'},{key:'topSP',color:'#a4d0e7',sp:true},{key:'topFlareSP',color:'#e26b67',sp:true}],0,Math.max(1.3,Math.ceil(Math.max(ctrls.pica.sp,...history.map(x=>Math.max(x.top,x.topSP)))*10+1)/10));drawChart('chartTopValves',[{key:'ure',color:'#19a77c'},{key:'flare',color:'#d96b61'},{key:'mvURE',color:'#627d9c',sp:true}],0,100);drawChart('chartStripTemp',[{key:'stripTemp',color:'#e18c33'}],112,125);drawChart('chartPress',[{key:'flash',color:'#548ee0'},{key:'top',color:'#e4a349'},{key:'flashSP',color:'#a7c4df',sp:true},{key:'topSP',color:'#d4ba97',sp:true}],0,5);drawChart('chartFlows',[{key:'flow',color:'#23ac95'},{key:'flowSP',color:'#a8d9cb',sp:true},{key:'returnDemand',color:'#e67c66',sp:true},{key:'dea11',color:'#9774cc'},{key:'dea12',color:'#d0a04b'}],0,4500);drawChart('chartV4',[{key:'v4flow',color:'#9774cc'},{key:'v4SP',color:'#b4a8d7',sp:true}],0,500);drawChart('chartSelector',[{key:'mvFfic',color:'#297eac'},{key:'mvLic',color:'#e4972c'},{key:'mvSelected',color:'#aa60bb',sp:true},{key:'mvValve533',color:'#19a77c'}],0,100);drawChart('chartSplit',[{key:'mvPic',color:'#2f669b',sp:true},{key:'valveA',color:'#10a3a5'},{key:'valveB',color:'#dc9650'},{key:'valveC',color:'#9060cb'}],0,100);}
function frame(now){let realDelta=Math.min((now-lastFrame)/1000,.10);lastFrame=now;if(running){let budget=realDelta*speed;while(budget>0){const dt=Math.min(.10,budget);advance(dt);budget-=dt;}renderClock+=realDelta;chartClock+=realDelta;if(renderClock>.09){render();renderClock=0;}if(chartClock>.25){collectHistory();drawCharts();chartClock=0;}}requestAnimationFrame(frame);}
function pause(force){running=typeof force==='boolean'?!force:!running;setT('playPauseBtn',running?'Ⅱ Pausar':'▶ Continuar');setT('runLabel',running?'Simulação em execução':'Simulação pausada');$('runDot').style.background=running?'#43d9b0':'#e3a546';$('plantSvg').classList.toggle('paused',!running);}
$('playPauseBtn').onclick=()=>pause();$('stepBtn').onclick=()=>{if(running)pause(true);for(let i=0;i<10;i++)advance(.1);collectHistory();render();drawCharts();};$('resetBtn').onclick=()=>{reset();drawCharts();};$('speedSel').onchange=e=>{speed=Number(e.target.value);toast('Velocidade de simulação: '+speed+'×');};$('clearTrendBtn').onclick=()=>{history=[];collectHistory();drawCharts();log('Tendências reiniciadas.');};$('clearLogBtn').onclick=()=>{$('eventLog').innerHTML='';log('Diário limpo.');};$('faultSel').onchange=()=>log('Falha didática selecionada: '+$('faultSel').selectedOptions[0].textContent+'.');
for(const id of ['ckZic','ckProtection','ckTracking'])$(id).onchange=()=>log($(id).parentElement.textContent.trim()+': '+($(id).checked?'habilitado':'desabilitado')+'.');
$('ckRegime').onchange=()=>{log('Novo regime de retirada associado ao SP: '+($('ckRegime').checked?'ON (hipótese didática)':'OFF (nível isolado)')+'.');};
$('regimeGain').oninput=()=>{setT('regimeGainValue',fmt(Number($('regimeGain').value),0)+' m³/d por p.p.');};
$('regimeGain').onchange=()=>log('Ganho didático do novo regime: '+$('regimeGain').value+' m³/d por p.p.');
const scenarios={regimeNew:{name:'SP nível 65% com novo patamar de vazão',controllers:{lic:65},regime:true,text:'O novo SP é associado a uma alteração simulada na retirada. A vazão e a MV devem atingir um novo equilíbrio sem retorno ao valor anterior. Hipótese didática, NÃO uma propriedade automática da malha.'},regimeLevelOnly:{name:'SP nível 65% — balanço com retirada constante',controllers:{lic:65},regime:false,text:'Altere somente o SP: a vazão varia durante a transição e retorna à retirada original quando o nível estabiliza. Este é o comportamento de um balanço de massa sem mudança de carga.'},demand:{name:'Aumento de retirada da E-3913',set:{demand:3100},text:'Demanda/retirada de DEA aumenta em m³/d; acompanhe LIC-39518 e FIC-39534.'},supply:{name:'Redução de capacidade hidráulica',set:{supply:65},text:'O fator hidráulico de FV-534 diminui, provocando maior esforço do FIC-39534 e ação do ZIC-39502 (DB ±3%).'},cond:{name:'Nível F-3933 / proteção',set:{condIn:210},text:'O inventário associado ao LIC-39527 tende a cair. Acompanhe o seletor FFY-533Y.'},gas:{name:'Maior geração de gás ácido',set:{gasGen:146},text:'O PIC-39524A corrige a pressão pela rota URE; PIC-39524B só entra conforme sua faixa.'},failure:{name:'FV-534 com falha de posição',set:{demand:3200},fault:'valve534',text:'Compare SP de vazão, MV comandada e PV real.'},flare:{name:'Restrição de URE',set:{gasGen:150},fault:'ure',text:'Restrição da URE limita a retirada efetiva. Quando pressão atinge SP do PIC-39524B, a rota flare solicita abertura em AUTO.'},steam:{name:'Excesso de vapor stripper: temperatura a 122–123 °C',set:{steamExcess:100},text:'A temperatura da torre sobe gradualmente de 117 para 123°C. O modelo didático eleva a geração de gás. Primeiro o PIC-39524A abre a URE; se saturar e a pressão atingir o SP do PIC-39524B, inicia abertura de flare.'},ureClosed:{name:'Fechamento indevido PV-39524A',fault:'ureClosed',text:'A PV-39524A fecha fisicamente apesar do comando do PIC-39524A. O acúmulo de gás pressuriza a torre; em AUTO o PIC-39524B passa a abrir quando a pressão alcança seu SP.'},dea11:{name:'Maior consumo de DEA — E-3911',controllers:{dea11:1750},text:'Altere o SP da FFIC-39522 e observe a PV, a retirada da E-3913 e as respostas da cascata.'},dea12:{name:'Maior consumo de DEA — E-3912',controllers:{dea12:1650},text:'Altere o SP da FFIC-39521 (valor de partida didático) e acompanhe a interação simulada com a regeneração.'},both:{name:'Consumo conjunto E-3911 + E-3912',controllers:{dea11:1750,dea12:1650},text:'Duas malhas absorvedoras elevam os consumos; comparar SP, PV e saída das FFICs e nível da E-3913.'}};
qsa('[data-scenario]').forEach(b=>b.onclick=()=>{const sc=scenarios[b.dataset.scenario];reset();for(const [k,v]of Object.entries(sc.set||{})){$('in-'+k).value=v;updateInputLabel(k);}if(sc.controllers)for(const [k,v]of Object.entries(sc.controllers)){ctrls[k].mode='AUTO';ctrls[k].sp=v;$('mode-'+k).value='AUTO';$('sp-'+k).value=v;modeFields(k);}if(sc.fault)$('faultSel').value=sc.fault;if(sc.regime!==undefined)$('ckRegime').checked=sc.regime;$('scenarioExplain').textContent=sc.name+': '+sc.text;log('Cenário iniciado: '+sc.name);if(!running)pause(false);toast(sc.name);});
makeModePanel();
$('mathRV').oninput=$('mathRV1').oninput=()=>{const rv=Number($('mathRV').value),rv1=Number($('mathRV1').value),dr=13.3875*(rv+1.03)-26.217;setT('mathRVout',fmt(rv,2));setT('mathRV1out',fmt(rv1));setT('mathDRout',fmt(dr,2)+'%');setT('mathSPout',fmt(rv1*(1+dr/100),2));};$('mathRV').oninput();
const questions=[
{q:'O LT-518 indica queda de nível e o FIC-534 está em cascata. Qual alteração tende a ocorrer primeiro na referência de vazão?',a:['O LIC-518 aumenta o SP remoto do FIC-534.','O PIC-518 reduz a vazão da FV-534 diretamente.','O FFY-533Y aumenta a saída do LIC-527.','O PIC-524B libera a corrente de topo ao flare.'],correct:0,why:'O LIC-518 é o controlador mestre de nível e corrige o SP remoto do controlador secundário de vazão.'},
{q:'A abertura solicitada à FV-534 aumenta, mas a vazão FT-534 diminui. Qual hipótese hidráulica é consistente?',a:['Aumento de pressão diferencial disponível na FV-534.','Redução do diferencial disponível na FV-534.','Elevação automática do setpoint LT-527.','Redução da resistência da FV-534 para a mesma abertura.'],correct:1,why:'O FIC pode exigir maior abertura quando o diferencial de pressão diminui, sem conseguir recuperar imediatamente a vazão.'},
{q:'Qual é a principal razão para usar FIC-534 em cascata com LIC-518?',a:['Substituir medição de nível por medição de pressão.','Evitar qualquer limitação hidráulica da FV-534.','Corrigir distúrbios de vazão antes de grandes desvios de nível.','Obrigar a válvula de pressão do flash a ficar totalmente aberta.'],correct:2,why:'O FIC responde mais rapidamente às perturbações na vazão, enquanto o LIC mantém o inventário.'},
{q:'O PIC-518 detecta pressão abaixo do SP no F-3931. Qual resposta física é consistente com o desenho?',a:['Abrir saída GAS OUT para diminuir inventário de gás.','Aumentar retirada V4 pela FV-533 prioritariamente.','Abrir PV-524B independentemente da pressão da E-3913.','Solicitar maior admissão de gás pela FV-518A.'],correct:3,why:'FV-518A está identificada como GAS IN; maior admissão tende a recuperar a pressão.'},
{q:'Qual interpretação é correta sobre as válvulas FV-518B e FV-518C?',a:['As faixas precisam conferir com a curva informada para PY-518A/B.','As duas abrem sempre simultaneamente em 50%.','A FV-518C atua apenas se o LIC-527 estiver em manual.','A FV-518B precisa estar totalmente fechada na pressão alta.'],correct:0,why:'O diagrama indica saída de gás e split-range, mas não apresenta as faixas reais de atuação.'},
{q:'Por que o ZIC-502 possui função identificada como DB?',a:['Para aumentar a frequência de mudanças de referência.','Para filtrar pequenas variações de posição sem alterar o SP.','Para substituir o FT-534 nas correções da vazão.','Para converter a indicação do LT-518 em pressão absoluta.'],correct:1,why:'A banda morta reduz movimentações desnecessárias de setpoint e interações oscilatórias.'},
{q:'Se a correção DR calculada for +10%, qual referência resulta da expressão indicada?',a:['SP = RV1 − 10 unidades físicas de vazão.','SP = RV1 dividido por 1,10.','SP = RV1 multiplicado por 1,10.','SP = RV1 somado a RV diretamente.'],correct:2,why:'A fórmula exibida é SP = RV1 × (1 + DR/100).'},
{q:'O FFIC-533 indica SP acima da PV, mas a FV-533 continua restringida. Qual observação é mais importante?',a:['A abertura da PV-524B sempre aumenta primeiro.','O LT-518 necessariamente está com a PV falsa.','O ZIC-502 necessariamente desligou a cascata.','O FFY-533Y pode estar selecionando o LIC-527.'],correct:3,why:'O FFY-533Y seleciona a menor demanda, que pode limitar a abertura pedida pelo FFIC.'},
{q:'Ao recuperar autoridade após restrição por LIC-527, qual função reduz riscos de comando brusco?',a:['Tracking / anti-reset windup do controlador não selecionado.','Desativação definitiva da medição FT-533.','Abertura permanente da válvula de flare.','Aumento do ganho integral do FFIC-533 sem limite.'],correct:0,why:'Tracking evita que a integral do controlador sem autoridade acumule erro excessivo.'},
{q:'O PT-524 sobe mesmo com a saída do PIC-524A solicitando maior retirada. O que investigar?',a:['Somente a indicação do nível do LT-527.','Disponibilidade de URE, contrapressão e posicionamento.','Somente a correção DR do FF-533.','Exclusivamente a faixa de abertura da FV-518A.'],correct:1,why:'Maior comando de válvula não assegura maior retirada se a rota de gás estiver limitada.'},
{q:'Qual afirmação sobre DB = 3 no controle PIC-524A/B é tecnicamente defensável?',a:['Representa exatamente 3 kgf/cm² de pressão.','É o mesmo que faixa obrigatória de 3% da PV-524B.','O desenho mostra o valor, mas não a escala ou unidade.','Define necessariamente 3 segundos de atraso da rota flare.'],correct:2,why:'O desenho informa DB = 3, mas não sua unidade, escala e implementação real.'},
{q:'Um bypass aberto na linha controlada pela FV-534 pode provocar qual condição?',a:['Garantia de autoridade máxima da FV-534 na vazão total.','Eliminação da necessidade de analisar pressão diferencial.','Bloqueio inevitável da válvula FV-518A de gás.','Perda parcial de autoridade e relação posição/vazão alterada.'],correct:3,why:'Parte da vazão não passa pela válvula controlada, comprometendo a relação entre comando e vazão total.'}
];let quizOrder=[],qi=0,qscore=0,answered=false;
function restartQuiz(){quizOrder=rand(questions).map(q=>({...q,opts:rand(q.a.map((txt,id)=>({txt,id})))}));qi=0;qscore=0;answered=false;drawQuiz();}
function drawQuiz(){setT('quizScore',qscore+' acertos');if(qi>=quizOrder.length){setT('quizProgress','Avaliação concluída');$('quizStage').innerHTML=`<div class="quiz-body"><span class="quiz-type">RESULTADO</span><h4>Você acertou ${qscore} de ${quizOrder.length} questões.</h4><p>Revise os tópicos de controle em cascata, VPC, split-range e seleção de mínima. Reinicie para embaralhar a ordem das questões e das alternativas.</p></div>`;$('quizNext').disabled=true;return;}let q=quizOrder[qi];answered=false;setT('quizProgress',`Questão ${qi+1} de ${quizOrder.length}`);const root=$('quizStage');root.innerHTML='';const box=document.createElement('div');box.className='quiz-body';const tag=document.createElement('div');tag.className='quiz-type';tag.textContent='ANÁLISE TÉCNICA · CIC';const title=document.createElement('h4');title.textContent=q.q;const list=document.createElement('div');list.className='answer-list';q.opts.forEach((o,i)=>{const b=document.createElement('button');b.className='answer';b.type='button';const marker=document.createElement('b');marker.textContent='ABCD'[i];const sp=document.createElement('span');sp.textContent=o.txt;b.append(marker,sp);b.onclick=()=>selectAnswer(b,o.id,list,q,box);list.append(b);});box.append(tag,title,list);root.append(box);$('quizNext').disabled=true;}
function selectAnswer(button,id,list,q,box){if(answered)return;answered=true;const correct=id===q.correct;if(correct)qscore++;list.querySelectorAll('.answer').forEach(b=>{b.disabled=true;const idx='ABCD'.indexOf(b.querySelector('b').textContent);const option=q.opts[idx];if(option.id===q.correct)b.classList.add('correct');if(b===button&&!correct)b.classList.add('wrong');});const feedback=document.createElement('div');feedback.className='feedback';feedback.textContent=(correct?'Correto. ':'Revisar. ')+q.why;box.append(feedback);$('quizNext').disabled=false;setT('quizScore',qscore+' acertos');}
$('quizNext').onclick=()=>{qi++;drawQuiz();};$('quizRestart').onclick=restartQuiz;
const decisions=[
{title:'Queda de vazão com nível E-3913 começando a cair',info:'FT-534 indica queda de vazão, FIC-534 solicita maior abertura e a pressão do flash começou a reduzir. Qual conjunto de verificações favorece o diagnóstico?',choices:[{t:'Comparar FT-534, saída FIC-534, diferencial disponível e tendência PT-518.',good:true,flag:'Diagnóstico fundamentado'},{t:'Elevar imediatamente o SP do PIC-518 sem conferir limites e causas.',good:false,flag:'Intervenção sem diagnóstico'},{t:'Retirar o FFIC-533 de automático como primeira resposta ao nível da E-3913.',good:false,flag:'Malha não relacionada'}]},
{title:'A FV-534 continua abrindo enquanto a vazão responde lentamente',info:'O ZIC-502 começa a elevar o SP do PIC-518; o PT-518 ainda não recuperou a pressão. Qual avaliação ajuda a distinguir correção normal de falha?',choices:[{t:'Observar SP e PV do PIC-518, demanda de GAS IN e resposta do PT-518.',good:true,flag:'Split-range rastreado'},{t:'Concluir defeito do LT-518 apenas porque a vazão ficou abaixo do SP.',good:false,flag:'Diagnóstico incompleto'},{t:'Atribuir a causa à PV-524B sem relacionar as tendências de pressão.',good:false,flag:'Hipótese sem evidência'}]},
{title:'A referência V4 sobe, mas a FV-533 não abre',info:'O FFIC-533 indica demanda elevada. A indicação LT-527 está caindo e FFY-533Y seleciona LIC-527. Qual interpretação é mais consistente?',choices:[{t:'A seleção de mínima restringe V4 para preservar o inventário de condensado.',good:true,flag:'Prioridade reconhecida'},{t:'O FFY-533Y deve sempre priorizar o maior sinal para recuperar vazão.',good:false,flag:'Seleção interpretada incorretamente'},{t:'Aumento de SP do FFIC obriga abertura independentemente do seletor.',good:false,flag:'Autoridade ignorada'}]},
{title:'A pressão de topo se eleva durante a recuperação de carga',info:'PT-524 aumenta e PV-524A solicita maior retirada para URE. Há indícios de restrição da rota. Qual abordagem é tecnicamente consistente?',choices:[{t:'Conferir capacidade URE, contrapressão, sinais do PIC-524A/B e procedimentos.',good:true,flag:'Destino de gás analisado'},{t:'Considerar a abertura da PV-524A como garantia de vazão disponível.',good:false,flag:'Hidráulica ignorada'},{t:'Assumir que DB = 3 corresponde sempre a 3 unidades de pressão.',good:false,flag:'Unidade não confirmada'}]}
];let stage=0,decisionScore=0,flags=[];
function drawDecision(){setT('cicPhaseLabel',stage>=decisions.length?'FINAL':`ETAPA ${stage+1}/${decisions.length}`);const root=$('cicStage');root.innerHTML='';const box=document.createElement('div');box.className='cic-body';if(stage>=decisions.length){box.innerHTML=`<span class="quiz-type">DIAGNÓSTICO CONCLUÍDO</span><h4>${decisionScore} de ${decisions.length} decisões consistentes.</h4><p>Resultado do encadeamento: ${flags.join(' → ')}.</p><p>Reveja como as ações anteriores influenciam a qualidade da leitura posterior da malha. Este cenário treina interpretação, não execução de manobras.</p>`;root.append(box);return;}let d=decisions[stage];const t=document.createElement('div');t.className='quiz-type';t.textContent='CASO OPERACIONAL SIMULADO';const h=document.createElement('h4');h.textContent=d.title;const p=document.createElement('p');p.textContent=(stage>0?`Histórico anterior: ${flags.at(-1)}. `:'')+d.info;p.style.fontSize='12px';p.style.color='#658096';const opts=document.createElement('div');opts.className='answer-list';rand(d.choices).forEach(ch=>{const b=document.createElement('button');b.className='answer';b.textContent=ch.t;b.onclick=()=>{if(ch.good)decisionScore++;flags.push(ch.flag);const fb=document.createElement('div');fb.className='feedback';fb.textContent=ch.good?'Decisão consistente. A próxima etapa considerará esse diagnóstico.':'Decisão insuficiente. A próxima etapa registra esse risco de interpretação.';opts.querySelectorAll('button').forEach(x=>x.disabled=true);box.append(fb);const next=document.createElement('button');next.className='btn btn-primary';next.style.marginTop='13px';next.textContent=stage===decisions.length-1?'Ver resultado':'Próxima etapa →';next.onclick=()=>{stage++;drawDecision();};box.append(next);};opts.append(b);});box.append(t,h,p,opts);if(flags.length){const div=document.createElement('div');div.className='decision-flag';flags.forEach(f=>{let s=document.createElement('span');s.textContent=f;div.append(s);});box.append(div);}root.append(box);}
$('cicRestart').onclick=()=>{stage=0;decisionScore=0;flags=[];drawDecision();};
// PWA instalação e atualização: dependem de HTTPS/localhost e suporte do navegador.
let deferredPrompt=null;window.addEventListener('beforeinstallprompt',event=>{event.preventDefault();deferredPrompt=event;});$('installBtn').onclick=async()=>{if(deferredPrompt){const prompt=deferredPrompt;deferredPrompt=null;prompt.prompt();const result=await prompt.userChoice;toast(result.outcome==='accepted'?'Instalação solicitada ao navegador.':'Instalação não concluída; use o menu do navegador.');}else if(/iphone|ipad|ipod/i.test(navigator.userAgent))toast('No iOS: Safari → Compartilhar → Adicionar à Tela de Início.');else toast('No Chrome/Android: menu ⋮ → Instalar app ou Adicionar à tela inicial. Requer HTTPS e PWA publicado.');};
async function registerSW(){if(!('serviceWorker' in navigator))return;try{const reg=await navigator.serviceWorker.register('./sw.js');if(reg.waiting)$('updateBanner').hidden=false;reg.addEventListener('updatefound',()=>{const worker=reg.installing;if(worker)worker.addEventListener('statechange',()=>{if(worker.state==='installed'&&navigator.serviceWorker.controller)$('updateBanner').hidden=false;});});$('checkUpdatesBtn').onclick=async()=>{await reg.update();toast(reg.waiting?'Nova versão encontrada.':'Verificação de atualização concluída.');};$('reloadAppBtn').onclick=()=>{if(reg.waiting)reg.waiting.postMessage('SKIP_WAITING');else location.reload();};let reload=false;navigator.serviceWorker.addEventListener('controllerchange',()=>{if(!reload){reload=true;location.reload();}});}catch(err){$('checkUpdatesBtn').onclick=()=>toast('Recurso de atualização indisponível neste navegador.');}}
$('checkUpdatesBtn').onclick=()=>toast('A atualização automática requer publicação em HTTPS.');
reset();restartQuiz();drawDecision();drawCharts();requestAnimationFrame(frame);window.addEventListener('resize',drawCharts);registerSW();
})();
