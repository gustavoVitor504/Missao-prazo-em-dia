(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))o(s);new MutationObserver(s=>{for(const n of s)if(n.type==="childList")for(const d of n.addedNodes)d.tagName==="LINK"&&d.rel==="modulepreload"&&o(d)}).observe(document,{childList:!0,subtree:!0});function t(s){const n={};return s.integrity&&(n.integrity=s.integrity),s.referrerPolicy&&(n.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?n.credentials="include":s.crossOrigin==="anonymous"?n.credentials="omit":n.credentials="same-origin",n}function o(s){if(s.ep)return;s.ep=!0;const n=t(s);fetch(s.href,n)}})();const U={2:"Terça",3:"Quarta",4:"Quinta",5:"Sexta",6:"Sábado"},X=["Respondi as 5 questões","Citei a fonte do texto usado","Revisei a ortografia"],K=[[0,"Aprendiz"],[60,"Organizado"],[120,"Mestre do Prazo"]],G=3,W=5,L=5,S=10,Z=3,z=90,$=72;function V(a=3){return{tela:"entrada",dia:a,xp:105,rascunho:null,final:null,checklist:X.map(()=>!1),sequencia:2,passe:1,passeUsado:!1,cartas:0,cartaUsada:null,turma:71,recompensa:null,feedback:null,versoesExtras:0}}const A=a=>K.filter(([e])=>a>=e).at(-1)[1],I=a=>a.final==="prazo"||a.final==="atraso"?100:a.rascunho?50:0,F=a=>Math.round(a.turma/z*1e3)/10,y=a=>a.final==="prazo"||a.final==="atraso",N=a=>({xp:a.xp,nivel:A(a.xp),missao:I(a),sequencia:a.sequencia,turma:a.turma});function v(a,e,t,o,s,n){a.feedback={tipo:e,titulo:t,mensagem:o,antes:s,depois:N(a),proxima:n},a.tela="feedback"}function Y(a){const e=N(a);if(a.rascunho)return v(a,"warn","Rascunho já registrado","Você já enviou o rascunho desta missão. O reenvio fica salvo como nova versão, mas o XP desta etapa só é contado uma vez.",e,"missao");if(a.dia>G)return a.rascunho="fora",v(a,"warn","Rascunho recebido após o ponto de controle","O ponto de controle fechou na quarta às 23h59, então esta etapa não gera XP. Você ainda pode fazer a entrega final até sexta às 23h59 e ganhar +10 XP.",e,"missao");a.rascunho="ok",a.xp+=L,v(a,"good",`Etapa 1 concluída: +${L} XP`,"Rascunho enviado antes do ponto de controle. A missão está em 50%. Próximo passo: completar o checklist e entregar até sexta às 23h59.",e,"missao")}function aa(a){const e=N(a),t=X.filter((s,n)=>!a.checklist[n]);if(y(a))return a.versoesExtras++,v(a,"warn","Entrega já registrada","Esta missão já foi validada. O reenvio foi salvo como nova versão para o professor, sem XP adicional e sem somar de novo na meta da turma.",e,"painel");if(a.dia>W)return a.final="atraso",v(a,"bad","Entregue com atraso: 0 XP","O prazo fechou na sexta às 23h59. A entrega foi registrada e o professor vai corrigir. Seu XP já ganho continua o mesmo. A semana ficou incompleta: veja no painel se quer usar o Passe para manter a sequência.",e,"painel");if(t.length>0)return a.final="pendente",v(a,"warn","Entrega registrada, XP pendente",`Falta no checklist: ${t.join("; ")}. Corrija e envie de novo até sexta às 23h59 para liberar +${S} XP. Nada foi perdido.`,e,"missao");a.final="prazo",a.xp+=S,a.turma+=1,a.sequencia+=1;let o=` A semana está completa: sequência agora em ${a.sequencia} semanas.`;a.sequencia%Z===0&&(a.cartas+=1,o+=" Você ganhou 1 Carta de Escolha."),e.nivel!==A(a.xp)&&(o+=` Novo nível: ${A(a.xp)}.`),a.turma>=$&&e.turma<$&&(o+=" Sua entrega ajudou a turma a bater a meta de 80%!"),v(a,"good",`Missão concluída no prazo: +${S} XP`,"Checklist completo e envio antes do prazo."+o,e,"painel")}function ea(a){a.passe<1||(a.passe=0,a.passeUsado=!0)}function sa(a,e){a.cartas<1||a.cartaUsada||(a.cartaUsada=e,a.cartas-=1)}function ta(a,e){a.turma<$||a.recompensa||(a.recompensa=e)}const r={menu:!1,voto:null,carta:null},p=a=>String(a).replace(/[&<>"]/g,e=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"})[e]),D=a=>a.toString().replace(".",","),oa="N231 · N1 · Desenvolvimento de Jogos Digitais",na="Questionário · Capítulo 4",ra=[["+24h de prazo","em uma atividade futura"],["Formato alternativo","entregar em áudio ou mapa mental"],["Escolher o tema","de um exercício da próxima semana"]],ia=[["Quiz em equipes","15 minutos de quiz de revisão"],["Tema da revisão","a turma escolhe o tema da aula de revisão"]];function E(a,e=""){const t=Math.max(0,Math.min(a,100));return`<div class="bar ${e}" role="img" aria-label="${Math.round(t)}%"><span style="width:${t}%"></span></div>`}const m=(a,e)=>`<div class="row"><span class="l">${a}</span><span class="v">${e}</span></div>`,M=(a,e)=>`<div class="row stack"><span class="l">${a}</span><span class="v">${e}</span></div>`,i=(a,e)=>`<span class="tag ${a}">${e}</span>`,l=(a,e,t="")=>`<section class="card"${t}>${a?`<h3 class="ct">${a}</h3>`:""}${e}</section>`;function ca(a,e){return`<header class="hdr">
    <button type="button" class="back" data-goto="${e}" aria-label="Voltar">←</button>
    <h2>${a}</h2>
    <button type="button" class="circ" data-action="menu" aria-label="Abrir menu">☰</button>
  </header>`}const x=(a,e,t)=>`${ca(a,e)}<div class="body">${t}</div>`;function _(a){switch(a.final){case"prazo":return["g","✔ No prazo"];case"atraso":return["b","⚠ Atrasada"];case"pendente":return["w","⏳ XP pendente"];default:return a.rascunho?["i","◐ Rascunho ok"]:["w","○ Não iniciada"]}}function la(a){const e=a.xp>=120?i("g","★ Nível máximo da etapa"):`<p class="small">Faltam ${120-a.xp} XP para <b>Mestre do Prazo</b></p>`;return l("Meu progresso · só eu vejo",`
    <div class="flex"><span class="big">${a.xp} XP</span>${i("i",`★ ${A(a.xp)}`)}</div>
    ${E(Math.round(Math.min(a.xp,120)/120*100),a.xp>=120?"gold":"")}
    ${e}
    <p class="small">Faixas: Aprendiz 0–59 · Organizado 60–119 · Mestre do Prazo 120+</p>`)}function Q(a){return`<div class="weeks" aria-hidden="true">${[1,2,3].map(e=>`<i class="${e<=a?e===3?"card3":"on":""}">${e===3?"🃏":"S"+e}</i>`).join("")}</div>`}function da(a){const e=a.final==="atraso",t=a.passe?"🎟 1 disponível":a.passeUsado?"Usado nesta semana":"0";let o="";a.cartas>0?o=i("g","🃏 Carta liberada"):e&&!a.passeUsado?o=i("b","Semana incompleta"):a.passeUsado&&(o=i("g","✔ Sequência mantida"));let s="";return e&&a.passe?s=`<p class="small" style="margin:8px 0">Sem o Passe, a sequência volta a 0 na segunda. Seu XP não muda.</p>
      <button type="button" class="pill" data-action="passe">🎟 Usar Passe e manter</button>`:e&&a.passeUsado&&(s=`<p class="small" style="margin-top:8px">Passe usado: a sequência de ${a.sequencia} semanas foi mantida.</p>`),a.cartas>0&&(s+='<button type="button" class="pill ghost" data-goto="carta" style="margin-top:10px">Usar minha carta</button>'),l("Sequência semanal",`
    <div class="flex"><span class="big md">${a.sequencia} ${a.sequencia===1?"semana":"semanas"}</span>${o}</div>
    ${Q(a.sequencia)}
    ${m("Passe do mês",t)}
    ${a.cartaUsada?m("Carta usada",p(a.cartaUsada)):""}
    ${s}`)}function ua(a){const[e,t]=_(a);return l("Missões da semana",`
    <button type="button" class="mis link" data-goto="missao">
      <span class="dot ${e}">1</span><span class="tx">Questionário<small>N231 · Jogos Digitais</small></span>${i(e,t)}<span class="chev" aria-hidden="true">›</span>
    </button>
    <div class="mis"><span class="dot g">2</span><span class="tx">Lista de exercícios<small>N202 · Robótica</small></span>${i("g","✔ No prazo")}</div>
    <div class="mis"><span class="dot g">3</span><span class="tx">Resumo do capítulo<small>N215 · Banco de Dados</small></span>${i("g","✔ No prazo")}</div>`)}function pa(a){const e=F(a),t=a.turma>=$?`<div style="margin-top:8px">${i("g",a.recompensa?"✔ Recompensa votada":"✔ Meta atingida · votação aberta")}</div>`:`<p class="small" style="margin-top:6px">Faltam ${$-a.turma} entregas para a recompensa coletiva.</p>`;return l("Meta da turma · N231",`
    ${E(e,"goal")}
    <div class="flex small"><span>${a.turma} de ${z} entregas no prazo</span><b class="navy">${D(e)}% · meta 80%</b></div>
    ${t}
    <button type="button" class="pill ghost" data-goto="turma" style="margin-top:10px">Ver meta da turma</button>`)}function w(a){return a.dia<4||a.dia>5||y(a)?"":`<div class="alert w" role="status">⏰ A Missão 1 fecha ${a.dia===5?"hoje":"amanhã"} (sexta) às 23h59.</div>`}function ma(a){return`<div class="homebar">
    <button type="button" class="circ" data-action="menu" aria-label="Abrir menu">☰</button>
    <span class="circ" aria-hidden="true">🔔</span>
  </div>
  <div class="ola"><div class="o">Olá,</div><div class="n">ANA F. (ALUNA FICTÍCIA)</div></div>
  <div class="body">
    <section class="hero">
      <div class="flex"><div><h2 class="t">seu progresso</h2><p class="s">${a.xp} XP · ${A(a.xp)} · ${a.sequencia} semanas seguidas</p></div><div class="star" aria-hidden="true">★</div></div>
      ${E(Math.round(Math.min(a.xp,120)/120*100),"on-hero")}
      <p class="s">${y(a)?"Missão 1 encerrada nesta semana":"Missão 1 fecha sexta às 23h59"}</p>
      <button type="button" class="pill white" data-goto="painel">Ver minhas missões</button>
    </section>
    ${w(a)}
    ${l("Esta semana",`
      <p class="txt">Você tem <b>3 missões</b>. Cada missão é uma atividade real da disciplina, em duas etapas: rascunho até <b>quarta 23h59</b> e entrega final até <b>sexta 23h59</b>.</p>
      <p class="small" style="margin-top:6px">Ponto de partida simulado: 105 XP, sequência de 2 semanas, Missões 2 e 3 concluídas e turma com 71 de 90 entregas no prazo.</p>`)}
    <section class="card soft">
      <h3 class="soft-t">Protótipo de estudo</h3>
      <p class="small">Nomes e números são fictícios. Os envios são simulados no navegador e nada é salvo. Use o menu ☰ para ver as regras e o roteiro de testes.</p>
    </section>
  </div>`}function H(a){return x("Progresso","entrada",`
    <div class="filter"><span class="lines" aria-hidden="true"><i></i><i></i></span>COMPUTAÇÃO · SEMANA 12 · ${U[a.dia].toUpperCase()}</div>
    ${w(a)}
    ${la(a)}
    ${da(a)}
    ${ua(a)}
    ${pa(a)}`)}function va(a){const[e,t]=_(a),o=y(a),s=I(a),n=a.rascunho==="ok"?i("g","✔ +5 XP"):a.rascunho==="fora"?i("w","⏳ Após o ponto · 0 XP"):i("w","○ Não enviado"),d=a.final==="prazo"?i("g","✔ +10 XP"):a.final==="atraso"?i("b","⚠ Atraso · 0 XP"):a.final==="pendente"?i("w","⏳ XP pendente"):i("w","○ Não enviado"),h=X.map((u,b)=>`<label class="chk${a.final==="pendente"&&!a.checklist[b]?" miss":""}">
      <input type="checkbox" data-check="${b}" ${a.checklist[b]?"checked":""} ${o?"disabled":""}>
      <span class="box" aria-hidden="true"></span><span>${u}</span></label>`).join("");return x("Missão 1","painel",`
    ${l(oa,`
      <div class="mtitle">${na}</div>
      ${E(s)}
      <div class="flex small"><span>Progresso da missão</span><b>${s}%</b></div>
      ${m("Status",i(e,t))}
      ${m("Hoje (simulado)",U[a.dia])}`)}
    ${w(a)}
    ${l("Etapa 1 · Rascunho",`
      ${m("Prazo","até qua 23h59 · +5 XP")}
      ${m("Situação",n)}
      <p class="small" style="margin:6px 0 10px">Arquivo simulado: rascunho-jogos-digitais.pdf</p>
      <button type="button" class="pill${a.rascunho?" ghost":""}" data-action="rascunho">${a.rascunho?"Enviar rascunho de novo":"Enviar rascunho"}</button>`)}
    ${l("Etapa 2 · Entrega final",`
      ${m("Prazo","até sex 23h59 · +10 XP")}
      ${m("Situação",d)}
      <fieldset class="checks"><legend class="small">Checklist da entrega final · os 3 itens são obrigatórios para o XP</legend>${h}</fieldset>
      ${a.final==="pendente"&&a.dia<=5?`<p class="small bad">Prazo para corrigir: ${a.dia===5?"hoje, sexta":"sexta"}, 23h59.</p>`:""}
      <p class="small" style="margin:6px 0 10px">Arquivo simulado: questionario-final.pdf${a.versoesExtras?` · versões extras: ${a.versoesExtras}`:""}</p>
      <button type="button" class="pill${o?" ghost":""}" data-action="final">${o?"Reenviar entrega":a.final==="pendente"?"Corrigir e reenviar":"Enviar entrega final"}</button>`)}
    <p class="small center">No app real, os botões abrem a atividade no AVA, onde o envio já acontece hoje.</p>`)}function fa(a){const e=a.depois.xp-a.antes.xp,t={good:"✔",warn:"⏳",bad:"⚠"}[a.tipo],o={good:"g",warn:"w",bad:"b"}[a.tipo],s=u=>u==="Mestre do Prazo"?"Mestre":u,d=[["XP",String(a.antes.xp),String(a.depois.xp)],["Nível",s(a.antes.nivel),s(a.depois.nivel)],["Missão 1",`${a.antes.missao}%`,`${a.depois.missao}%`],["Sequência",`${a.antes.sequencia} sem.`,`${a.depois.sequencia} sem.`],["Turma",`${a.antes.turma}/90`,`${a.depois.turma}/90`]].map(([u,b,k])=>`<div class="k">${u}</div><div class="a">${b}</div><div class="ar" aria-hidden="true">→</div><div class="d ${b===k?"same":"up"}">${k}</div>`).join(""),h=a.tipo==="bad"?"Ver opção de Passe":a.proxima==="missao"?"Voltar à missão":"Ver meu progresso";return`<div class="dim" data-action="fechar"></div>
  <div class="sheet" role="dialog" aria-modal="true" aria-labelledby="sheet-t">
    <div class="grab" aria-hidden="true"></div>
    ${e>0?`<div class="xpbig">+${e} XP</div>`:`<div class="badge ${o}" aria-hidden="true">${t}</div>`}
    <h4 id="sheet-t">${p(e>0?a.titulo.replace(/: \+\d+ XP$/,""):a.titulo)}</h4>
    <p>${p(a.mensagem)}</p>
    <div class="cmp">${d}</div>
    <button type="button" class="pill" data-goto="${a.proxima}" autofocus>${h}</button>
  </div>`}function $a(a){const e=a.feedback;return e?J[e.proxima](a)+fa(e):H(a)}function ha(a){const e=F(a),t=a.turma>=$,o=`<section class="hero">
    <h2 class="t">${t?"Meta atingida! 🎉":"Meta da turma"}</h2>
    <p class="s">N231 · Desenvolvimento de Jogos Digitais</p>
    ${E(e,`goal on-hero${t?" gold-fill":""}`)}
    <p class="s">${a.turma} de ${z} entregas no prazo · ${D(e)}%</p>
  </section>`;let s;if(!t)s=l("Recompensa coletiva",`<p class="txt">Faltam <b>${$-a.turma} entregas</b> no prazo para a turma liberar a recompensa da semana.</p>`);else if(a.recompensa)s=l("Recompensa coletiva",`${i("g","✔ Voto registrado")}<p class="txt" style="margin-top:8px">A turma escolheu: <b>${p(a.recompensa)}</b>.</p>`);else{const n=ia.map(([d,h])=>{const u=`${d}: ${h}`;return`<button type="button" class="opt${r.voto===u?" sel":""}" data-action="sel-voto" data-value="${p(u)}" aria-pressed="${r.voto===u}"><b>${d}</b>${h}</button>`}).join("");s=l("Vote na recompensa coletiva",`<div class="opts">${n}</div>`)+`<button type="button" class="pill" data-action="votar" data-value="${p(r.voto??"")}" ${r.voto?"":"disabled"}>Confirmar meu voto</button>`}return x("Meta da turma","painel",`
    ${o}
    ${s}
    ${l("Como funciona",`
      ${M("Pontos","Cada missão concluída no prazo, de qualquer aluno, soma 1 ponto.")}
      ${M("Meta","A linha tracejada marca os 80% (72 entregas). A barra volta a zero na segunda.")}
      ${M("Privacidade","A barra mostra só o total da turma, sem nomes.")}`)}`)}function ba(a){let e;if(a.cartaUsada)e=l("",`<div class="center"><div class="emoji">🃏</div><div class="mtitle">Carta usada</div>${i("g","✔ Confirmada")}<p class="txt" style="margin-top:8px">${p(a.cartaUsada)}</p></div>`);else if(a.cartas>0){const t=ra.map(([o,s])=>{const n=`${o} ${s}`;return`<button type="button" class="opt${r.carta===n?" sel":""}" data-action="sel-carta" data-value="${p(n)}" aria-pressed="${r.carta===n}"><b>${o}</b>${s}</button>`}).join("");e=l("",`<div class="center"><div class="emoji">🃏</div><div class="mtitle">${a.sequencia} semanas seguidas!</div><p class="small">Escolha como usar sua carta (1 por semana):</p></div>`)+`<div class="opts">${t}</div>
      <button type="button" class="pill" data-action="carta" data-value="${p(r.carta??"")}" ${r.carta?"":"disabled"}>Usar carta</button>`}else e=l("Ainda bloqueada",`<p class="txt">Complete <b>3 semanas seguidas</b> com todas as missões no prazo para liberar uma Carta de Escolha.</p>${Q(a.sequencia)}`);return x("Carta de Escolha","painel",`${e}
    <p class="small center">A recompensa é autonomia, não nota: +24h de prazo, formato alternativo ou escolher o tema de um exercício.</p>`)}function ga(){const a=(e,t)=>l(e,t.map(([o,s])=>M(o,s)).join(""));return x("Regras","painel",`
    ${a("M1 · Missão em Etapas",[["Ação","Enviar rascunho e entrega final"],["Validação","Rascunho até qua 23h59; final até sex 23h59 com checklist completo"],["Resultado","+5 XP (50%) e +10 XP (100%); níveis por XP"],["Limites","XP 1 vez por etapa; reenvio sem XP; atraso = 0 XP sem perder XP"]])}
    ${a("M2 · Sequência com Passe",[["Ação","Concluir as 3 missões da semana no prazo"],["Validação","3 missões “No prazo” até sex 23h59"],["Resultado","+1 semana; a cada 3 semanas, 1 Carta de Escolha"],["Limites","1 Passe por mês; quebra zera só a sequência"]])}
    ${a("M3 · Meta da Turma",[["Ação","Qualquer missão concluída no prazo"],["Validação","Entrega validada na M1"],["Resultado","+1 na barra; 72/90 (80%) libera recompensa votada"],["Limites","1 recompensa por semana; sem nomes"]])}`)}function xa(){const a=(e,t,o)=>l(e,`
    <ol class="steps">${t.map(s=>`<li>${s}</li>`).join("")}</ol>
    ${o?`<button type="button" class="pill" data-action="cenario" data-value="${o}" style="margin-top:10px">Iniciar ${e.split(" · ")[0].toLowerCase()}</button>`:""}`);return x("Roteiro de testes","painel",`
    <p class="small">Cada botão reinicia a simulação e coloca o dia certo. Siga os passos e compare com o resultado esperado.</p>
    ${a("Cenário A · Conclusão no prazo",["Dia: Quarta. Missão 1 → Enviar rascunho. Esperado: +5 XP (110), missão 50%.","Mude o dia para Sexta. Marque os 3 itens do checklist → Enviar entrega final.","Esperado: +10 XP (120, Mestre do Prazo), missão 100%, sequência 3 semanas, 1 Carta de Escolha, turma 72/90 com recompensa liberada."],3)}
    ${a("Cenário B · Ação repetida",["Complete o cenário A.","Abra a Missão 1 e toque em Reenviar entrega.","Esperado: aviso “Entrega já registrada”, XP continua 120 e turma continua 72/90."])}
    ${a("Cenário C · Checklist incompleto",["Dia: Sexta. Marque só 2 itens → Enviar entrega final.","Esperado: “XP pendente”, item que falta em destaque, XP e turma sem mudança. Marque o 3º item e reenvie: +10 XP."],5)}
    ${a("Cenário D · Prazo perdido",["Dia: Sábado. Enviar entrega final.","Esperado: “Entregue com atraso: 0 XP”, XP anterior mantido; no Progresso aparece a opção de usar o Passe."],6)}`)}function Pa(a){if(!r.menu)return"";const e=(t,o,s,n="")=>`<button type="button" class="mi${a.tela===t?" cur":""}${n?" new":""}" data-goto="${t}"><span class="ico" aria-hidden="true">${o}</span>${s}${n}</button>`;return`<div class="dim" data-action="fechar-menu"></div>
  <nav class="drawer" aria-label="Menu">
    <div class="drawer-top">
      <div class="avatar" aria-hidden="true">AF</div>
      <div class="nm">ANA F. (ALUNA FICTÍCIA)</div>
      <div class="mt">N231 · Computação</div>
    </div>
    <div class="menu">
      ${e("entrada","⌂","Início")}
      ${e("painel","★","Progresso",'<span class="newtag">NOVO</span>')}
      ${e("missao","✎","Missão 1")}
      ${e("turma","◎","Meta da turma")}
      ${e("carta","🃏","Carta de Escolha")}
      ${e("regras","☰","Regras")}
      ${e("testes","✓","Roteiro de testes")}
      <button type="button" class="mi sair" data-action="fechar-menu"><span class="ico" aria-hidden="true">✕</span>Fechar menu</button>
    </div>
  </nav>`}const J={entrada:ma,painel:H,missao:va,feedback:$a,turma:ha,carta:ba,regras:ga,testes:xa},C=a=>{const e=document.querySelector(a);if(!e)throw new Error(`Elemento não encontrado: ${a}`);return e},q=C("#app"),g=C("#push"),R=C("#day"),j=()=>Number(R.value);let c=V(j()),O=0;function Aa(){var a;window.scrollTo({top:0}),(a=q.querySelector(".body"))==null||a.scrollTo({top:0})}function f(){var a;q.innerHTML=J[c.tela](c)+Pa(c),(a=q.querySelector(".sheet [autofocus], .drawer .mi"))==null||a.focus({preventScroll:!0})}function P(a){c.tela=a,r.menu=!1,f(),Aa()}function B(a){R.value=String(a),c=V(a),r.voto=null,r.carta=null,r.menu=!1}function T(){const a=c.feedback;!a||a.tipo!=="good"||(g.innerHTML=`<span class="ap" aria-hidden="true">★</span><span><span class="tt">Progresso <span>agora</span></span><span class="mm"><b>${a.titulo}</b></span></span>`,g.hidden=!1,g.classList.remove("show"),g.offsetWidth,g.classList.add("show"),window.clearTimeout(O),O=window.setTimeout(()=>{g.hidden=!0},4e3))}document.addEventListener("click",a=>{const e=a.target.closest("[data-goto], [data-action]");if(!e||e.disabled)return;const{goto:t,action:o,value:s=""}=e.dataset;if(t)return P(t);switch(o){case"rascunho":Y(c),f(),T();return;case"final":aa(c),f(),T();return;case"passe":ea(c);break;case"sel-carta":r.carta=s;break;case"carta":s&&sa(c,s),r.carta=null;break;case"sel-voto":r.voto=s;break;case"votar":s&&ta(c,s),r.voto=null;break;case"menu":r.menu=!0;break;case"fechar-menu":r.menu=!1;break;case"fechar":return c.feedback?P(c.feedback.proxima):void 0;case"cenario":return B(Number(s)),P("missao");default:return}f()});document.addEventListener("keydown",a=>{a.key==="Escape"&&(r.menu?(r.menu=!1,f()):c.tela==="feedback"&&c.feedback&&P(c.feedback.proxima))});q.addEventListener("change",a=>{const e=a.target;e.dataset.check!==void 0&&(c.checklist[Number(e.dataset.check)]=e.checked)});R.addEventListener("change",()=>{c.dia=j(),f()});C("#reset").addEventListener("click",()=>{B(j()),P("entrada")});f();
