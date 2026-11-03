(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const t of document.querySelectorAll('link[rel="modulepreload"]'))o(t);new MutationObserver(t=>{for(const s of t)if(s.type==="childList")for(const i of s.addedNodes)i.tagName==="LINK"&&i.rel==="modulepreload"&&o(i)}).observe(document,{childList:!0,subtree:!0});function n(t){const s={};return t.integrity&&(s.integrity=t.integrity),t.referrerPolicy&&(s.referrerPolicy=t.referrerPolicy),t.crossOrigin==="use-credentials"?s.credentials="include":t.crossOrigin==="anonymous"?s.credentials="omit":s.credentials="same-origin",s}function o(t){if(t.ep)return;t.ep=!0;const s=n(t);fetch(t.href,s)}})();const R={2:"Terça",3:"Quarta",4:"Quinta",5:"Sexta",6:"Sábado"},E=["Respondi as 5 questões","Citei a fonte do texto usado","Revisei a ortografia"],O=[[0,"Aprendiz"],[60,"Organizado"],[120,"Mestre do Prazo"]],L=3,T=5,A=5,f=10,N=3,P=90,d=72;function x(a=3){return{tela:"entrada",dia:a,xp:105,rascunho:null,final:null,checklist:E.map(()=>!1),sequencia:2,passe:1,passeUsado:!1,cartas:0,cartaUsada:null,turma:71,recompensa:null,feedback:null,versoesExtras:0}}const p=a=>O.filter(([e])=>a>=e).at(-1)[1],b=a=>a.final==="prazo"||a.final==="atraso"?100:a.rascunho?50:0,m=a=>Math.round(a.turma/P*1e3)/10,k=a=>a.final==="prazo"||a.final==="atraso",q=a=>({xp:a.xp,nivel:p(a.xp),missao:b(a),sequencia:a.sequencia,turma:a.turma});function c(a,e,n,o,t,s){a.feedback={tipo:e,titulo:n,mensagem:o,antes:t,depois:q(a),proxima:s},a.tela="feedback"}function j(a){const e=q(a);if(a.rascunho)return c(a,"warn","Rascunho já registrado","Você já enviou o rascunho desta missão. O reenvio fica salvo como nova versão, mas o XP desta etapa só é contado uma vez.",e,"missao");if(a.dia>L)return a.rascunho="fora",c(a,"warn","Rascunho recebido após o ponto de controle","O ponto de controle fechou na quarta às 23h59, então esta etapa não gera XP. Você ainda pode fazer a entrega final até sexta às 23h59 e ganhar +10 XP.",e,"missao");a.rascunho="ok",a.xp+=A,c(a,"good",`Etapa 1 concluída: +${A} XP`,"Rascunho enviado antes do ponto de controle. A missão está em 50%. Próximo passo: completar o checklist e entregar até sexta às 23h59.",e,"missao")}function U(a){const e=q(a),n=E.filter((t,s)=>!a.checklist[s]);if(k(a))return a.versoesExtras++,c(a,"warn","Entrega já registrada","Esta missão já foi validada. O reenvio foi salvo como nova versão para o professor, sem XP adicional e sem somar de novo na meta da turma.",e,"painel");if(a.dia>T)return a.final="atraso",c(a,"bad","Entregue com atraso: 0 XP","O prazo fechou na sexta às 23h59. A entrega foi registrada e o professor vai corrigir. Seu XP já ganho continua o mesmo. A semana ficou incompleta: veja no painel se quer usar o Passe para manter a sequência.",e,"painel");if(n.length>0)return a.final="pendente",c(a,"warn","Entrega registrada, XP pendente",`Falta no checklist: ${n.join("; ")}. Corrija e envie de novo até sexta às 23h59 para liberar +${f} XP. Nada foi perdido.`,e,"missao");a.final="prazo",a.xp+=f,a.turma+=1,a.sequencia+=1;let o=` A semana está completa: sequência agora em ${a.sequencia} semanas.`;a.sequencia%N===0&&(a.cartas+=1,o+=" Você ganhou 1 Carta de Escolha."),e.nivel!==p(a.xp)&&(o+=` Novo nível: ${p(a.xp)}.`),a.turma>=d&&e.turma<d&&(o+=" Sua entrega ajudou a turma a bater a meta de 80%!"),c(a,"good",`Missão concluída no prazo: +${f} XP`,"Checklist completo e envio antes do prazo."+o,e,"painel")}function I(a){a.passe<1||(a.passe=0,a.passeUsado=!0)}function D(a,e){a.cartas<1||a.cartaUsada||(a.cartaUsada=e,a.cartas-=1)}function F(a,e){a.turma<d||a.recompensa||(a.recompensa=e)}const h=a=>String(a).replace(/[&<>"]/g,e=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"})[e]),C=a=>a.toString().replace(".",",");function v(a,e=!1){return`<div class="bar${e?" goal":""}" role="img" aria-label="${a}%"><span style="width:${Math.min(a,100)}%"></span></div>`}function S(a){switch(a.final){case"prazo":return["s-good","✔ Concluída no prazo"];case"atraso":return["s-bad","⚠ Entregue com atraso"];case"pendente":return["s-warn","⏳ XP pendente: checklist incompleto"];default:return a.rascunho?["s-info","◐ Rascunho enviado"]:["s-warn","○ Não iniciada"]}}function V(){return`<section class="panel">
  <h2>Olá, Ana F. (aluna fictícia)</h2>
  <p>Esta semana você tem <strong>3 missões</strong>. Cada missão é uma atividade real da disciplina, dividida em duas etapas: rascunho até <strong>quarta 23h59</strong> e entrega final até <strong>sexta 23h59</strong>.</p>
  <p class="muted">Dados de partida (simulados): 105 XP, sequência de 2 semanas, Missões 2 e 3 já concluídas, turma com 71 de 90 entregas no prazo.</p>
  <div class="actions"><button type="button" data-goto="painel">Entrar na semana</button></div>
</section>`}function w(a){const[e,n]=S(a),o=a.dia>=4&&a.dia<=5&&a.final!=="prazo"?`<div class="banner s-warn" role="status">⏰ Lembrete: a Missão 1 fecha ${a.dia===5?"hoje":"amanhã"} (sexta) às 23h59.</div>`:"",t=a.final==="atraso",s=a.passe?"✔ 1 disponível":a.passeUsado?"Usado nesta semana":"0",i=a.cartas>0||a.cartaUsada?`<section class="panel" aria-labelledby="h-carta">
    <h3 id="h-carta">Carta de Escolha</h3>
    ${a.cartaUsada?`<p class="status s-good">✔ Você escolheu: ${h(a.cartaUsada)}</p>`:`<p>Você completou 3 semanas seguidas. Escolha como usar sua carta (1 por semana):</p>
    <div class="choices">
      <button type="button" data-action="carta" data-value="+24h de prazo em uma atividade futura"><strong>+24h de prazo</strong>em uma atividade futura</button>
      <button type="button" data-action="carta" data-value="Entregar a próxima atividade em formato alternativo"><strong>Formato alternativo</strong>áudio ou mapa mental</button>
      <button type="button" data-action="carta" data-value="Escolher o tema de um exercício"><strong>Escolher o tema</strong>de um exercício da próxima semana</button>
    </div>`}
  </section>`:"";return`${o}
  <div class="grid">
    <section class="panel" aria-labelledby="h-xp">
      <h3 id="h-xp">Meu progresso (só eu vejo)</h3>
      <div class="big">${a.xp} XP</div>
      <p><span class="status s-info">★ Nível: ${p(a.xp)}</span></p>
      ${v(Math.round(Math.min(a.xp,120)/120*100))}
      <p class="muted">Faixas: Aprendiz 0–59 · Organizado 60–119 · Mestre do Prazo 120+</p>
    </section>
    <section class="panel" aria-labelledby="h-seq">
      <h3 id="h-seq">Sequência semanal</h3>
      <div class="big">${a.sequencia} ${a.sequencia===1?"semana":"semanas"}</div>
      <p class="muted">A cada 3 semanas seguidas com todas as missões no prazo: 1 Carta de Escolha.</p>
      <div class="kv"><span>Passe do mês</span><strong>${s}</strong></div>
      ${t&&a.passe?'<div class="banner s-warn">Semana incompleta. Sem o Passe, a sequência volta a 0 na segunda (seu XP não muda).<div class="actions" style="margin-top:8px"><button type="button" data-action="passe">Usar Passe e manter a sequência</button></div></div>':""}
      ${t&&a.passeUsado?`<div class="banner s-good">✔ Passe usado: a sequência de ${a.sequencia} semanas foi mantida.</div>`:""}
    </section>
  </div>
  <section class="panel" aria-labelledby="h-mis">
    <h3 id="h-mis">Missões da semana</h3>
    <ul class="missions">
      <li><span><strong>Missão 1</strong> · Questionário de Biologia</span><span class="status ${e}">${n}</span><button type="button" class="ghost" data-goto="missao">Abrir</button></li>
      <li><span><strong>Missão 2</strong> · Lista de Matemática</span><span class="status s-good">✔ Concluída no prazo</span></li>
      <li><span><strong>Missão 3</strong> · Resumo de História</span><span class="status s-good">✔ Concluída no prazo</span></li>
    </ul>
  </section>
  ${i}
  <section class="panel">
    <h3>Meta da turma</h3>
    ${v(m(a),!0)}
    <div class="kv"><span>${a.turma} de ${P} entregas no prazo</span><strong>${C(m(a))}% · meta 80%</strong></div>
    <div class="actions"><button type="button" class="ghost" data-goto="turma">Ver meta da turma</button></div>
  </section>`}function _(a){const[e,n]=S(a),o=k(a),t=a.rascunho==="ok"?'<span class="status s-good">✔ Enviado no ponto de controle (+5 XP)</span>':a.rascunho==="fora"?'<span class="status s-warn">⏳ Enviado após o ponto de controle (0 XP)</span>':'<span class="status s-warn">○ Ainda não enviado</span>',s=E.map((i,u)=>`<label class="check" for="ck${u}"><input type="checkbox" id="ck${u}" data-check="${u}" ${a.checklist[u]?"checked":""} ${o?"disabled":""}> <span>${i}</span></label>`).join("");return`<section class="panel">
    <div class="top"><h2>Missão 1 · Questionário de Biologia</h2><span class="status ${e}">${n}</span></div>
    ${v(b(a))}
    <p class="muted">Progresso da missão: ${b(a)}% · Hoje (simulado): ${R[a.dia]}</p>
    <h3>Regras</h3>
    <ol class="rules">
      <li><strong>Etapa 1, rascunho:</strong> envio até quarta 23h59 → +5 XP e missão em 50%.</li>
      <li><strong>Etapa 2, entrega final:</strong> envio até sexta 23h59 com os 3 itens do checklist → +10 XP e missão concluída.</li>
      <li>XP só uma vez por etapa. Reenvio não soma XP.</li>
      <li>Depois do prazo: entrega registrada como atrasada, 0 XP, sem perder XP já ganho.</li>
    </ol>
  </section>
  <section class="panel" aria-labelledby="h-e1">
    <h3 id="h-e1">Etapa 1 · Rascunho</h3>
    <p>${t}</p>
    <p class="muted">Arquivo simulado: rascunho-biologia.pdf</p>
    <div class="actions"><button type="button" id="b-rasc" data-action="rascunho">${a.rascunho?"Enviar rascunho de novo":"Enviar rascunho"}</button></div>
  </section>
  <section class="panel" aria-labelledby="h-e2">
    <h3 id="h-e2">Etapa 2 · Entrega final</h3>
    <fieldset>
      <legend>Checklist de qualidade (os 3 são obrigatórios para o XP)</legend>
      ${s}
    </fieldset>
    <p class="muted">Arquivo simulado: questionario-biologia-final.pdf${a.versoesExtras?` · versões extras enviadas: ${a.versoesExtras}`:""}</p>
    <div class="actions"><button type="button" id="b-final" data-action="final">${o?"Reenviar entrega":"Enviar entrega final"}</button></div>
  </section>`}function Q(a){const e=a.feedback;if(!e)return w(a);const n={good:"✔",warn:"⏳",bad:"⚠"}[e.tipo],o=(t,s,i)=>`<tr><th scope="row">${t}</th><td>${s}</td><td>${i}</td><td>${s===i?"sem mudança":"<strong>mudou</strong>"}</td></tr>`;return`<section class="panel">
    <div class="fb-head"><span class="fb-icon status s-${e.tipo}" aria-hidden="true">${n}</span><h2>${h(e.titulo)}</h2></div>
    <p>${h(e.mensagem)}</p>
    <h3>Progresso atualizado</h3>
    <div class="tablebox"><table>
      <thead><tr><th>Indicador</th><th>Antes</th><th>Depois</th><th></th></tr></thead>
      <tbody>
      ${o("XP",e.antes.xp,e.depois.xp)}
      ${o("Nível",e.antes.nivel,e.depois.nivel)}
      ${o("Missão 1",`${e.antes.missao}%`,`${e.depois.missao}%`)}
      ${o("Sequência",`${e.antes.sequencia} sem.`,`${e.depois.sequencia} sem.`)}
      ${o("Meta da turma",`${e.antes.turma}/90`,`${e.depois.turma}/90`)}
      </tbody></table></div>
    <div class="actions"><button type="button" data-goto="${e.proxima}">Próxima ação: ${e.proxima==="missao"?"voltar à missão":"ir ao painel"}</button></div>
  </section>`}function H(a){const n=a.turma>=d?a.recompensa?`<p class="status s-good">✔ Turma votou: ${h(a.recompensa)}</p>`:`<div class="banner s-good">✔ Meta atingida! A turma desbloqueou 1 recompensa coletiva nesta semana. Vote:</div>
      <div class="choices">
        <button type="button" data-action="votar" data-value="escolher o tema da aula de revisão"><strong>Tema da revisão</strong>a turma escolhe o tema da aula de revisão</button>
        <button type="button" data-action="votar" data-value="15 min de quiz de revisão em equipes"><strong>Quiz em equipes</strong>15 minutos de quiz de revisão</button>
      </div>`:`<p class="status s-info">Faltam ${d-a.turma} entregas no prazo para a meta.</p>`;return`<section class="panel">
    <h2>Meta da turma 1º A</h2>
    <p>Cada missão concluída no prazo, por qualquer aluno, soma 1 ponto. A barra mostra só o total da turma, sem nomes.</p>
    ${v(m(a),!0)}
    <div class="kv"><span>${a.turma} de ${P} entregas previstas</span><strong>${C(m(a))}%</strong></div>
    <p class="muted">Linha tracejada = meta de 80% (72 entregas). A barra volta a zero na segunda-feira.</p>
    ${n}
  </section>`}function B(){return`<section class="panel">
  <h2>Regras das três mecânicas</h2>
  <div class="tablebox"><table>
  <thead><tr><th>Mecânica</th><th>Ação</th><th>Validação</th><th>Resultado</th><th>Limites</th></tr></thead>
  <tbody>
  <tr><td><strong>M1 Missão em Etapas</strong></td><td>Enviar rascunho e entrega final</td><td>Rascunho até qua 23h59; final até sex 23h59 com checklist completo</td><td>+5 XP (50%) e +10 XP (100%); níveis por XP</td><td>XP 1 vez por etapa; reenvio sem XP; atraso = 0 XP sem perder XP</td></tr>
  <tr><td><strong>M2 Sequência com Passe</strong></td><td>Concluir as 3 missões da semana no prazo</td><td>3 missões “Concluída no prazo” até sex 23h59</td><td>+1 semana; a cada 3 semanas, 1 Carta de Escolha</td><td>1 Passe por mês; quebra zera só a sequência</td></tr>
  <tr><td><strong>M3 Meta da Turma</strong></td><td>Qualquer missão concluída no prazo</td><td>Entrega validada na M1</td><td>+1 na barra; 72/90 (80%) libera recompensa votada</td><td>1 recompensa por semana; sem nomes</td></tr>
  </tbody></table></div>
</section>`}function K(){return`<section class="panel">
  <h2>Roteiro de testes</h2>
  <p class="muted">Cada botão reinicia a simulação e coloca o dia certo. Siga os passos e compare com o resultado esperado.</p>
  <h3>Cenário A · Conclusão bem-sucedida</h3>
  <ol class="steps"><li>Dia: Quarta. Missão 1 → Enviar rascunho. Esperado: +5 XP (110), missão 50%.</li>
  <li>Mude o dia para Sexta. Marque os 3 itens do checklist → Enviar entrega final.</li>
  <li>Esperado: +10 XP (120, Mestre do Prazo), missão 100%, sequência 3 semanas, 1 Carta de Escolha, turma 72/90 (80%) com recompensa liberada.</li></ol>
  <div class="actions"><button type="button" data-action="cenario" data-value="3">Iniciar cenário A</button></div>
  <h3>Cenário B · Exceção: ação repetida</h3>
  <ol class="steps"><li>Complete o cenário A.</li><li>Abra a Missão 1 e clique em Reenviar entrega.</li>
  <li>Esperado: aviso “Entrega já registrada”, XP continua 120 e turma continua 72/90.</li></ol>
  <h3>Cenário C · Exceção: critério não atendido</h3>
  <ol class="steps"><li>Dia: Sexta. Marque só 2 itens → Enviar entrega final.</li>
  <li>Esperado: “XP pendente”, item que falta citado, XP e turma sem mudança. Marque o 3º item e envie de novo: +10 XP.</li></ol>
  <div class="actions"><button type="button" data-action="cenario" data-value="5">Iniciar cenário C</button></div>
  <h3>Cenário D · Exceção: interrupção (prazo perdido)</h3>
  <ol class="steps"><li>Dia: Sábado. Enviar entrega final.</li>
  <li>Esperado: “Entregue com atraso”, 0 XP, XP anterior mantido; no painel aparece a opção de usar o Passe.</li></ol>
  <div class="actions"><button type="button" data-action="cenario" data-value="6">Iniciar cenário D</button></div>
</section>`}const G={entrada:V,painel:w,missao:_,feedback:Q,turma:H,regras:B,testes:K},g=a=>{const e=document.querySelector(a);if(!e)throw new Error(`Elemento não encontrado: ${a}`);return e},M=g("#app"),$=g("#nav"),y=g("#day"),X=()=>Number(y.value);let r=x(X());function l(){$.hidden=r.tela==="entrada",$.querySelectorAll("button[data-view]").forEach(a=>{a.dataset.view===r.tela?a.setAttribute("aria-current","page"):a.removeAttribute("aria-current")}),M.innerHTML=G[r.tela](r)}function z(a){r.tela=a,l(),window.scrollTo({top:0})}function Z(a){y.value=String(a),r=x(a),z("missao")}$.addEventListener("click",a=>{var n;const e=(n=a.target.closest("button[data-view]"))==null?void 0:n.dataset.view;e&&z(e)});M.addEventListener("click",a=>{const e=a.target.closest("button");if(!e)return;const{goto:n,action:o,value:t=""}=e.dataset;if(n)return z(n);switch(o){case"rascunho":j(r);break;case"final":U(r);break;case"passe":I(r);break;case"carta":D(r,t);break;case"votar":F(r,t);break;case"cenario":return Z(Number(t));default:return}l(),window.scrollTo({top:0})});M.addEventListener("change",a=>{const e=a.target;e.dataset.check!==void 0&&(r.checklist[Number(e.dataset.check)]=e.checked)});y.addEventListener("change",()=>{r.dia=X(),l()});g("#reset").addEventListener("click",()=>{r=x(X()),l()});l();
