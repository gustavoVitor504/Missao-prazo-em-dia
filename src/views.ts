// Telas do protótipo. Cada função devolve HTML; os botões usam data-action, tratados em main.ts.
import {
  CHECKLIST, DIAS, Estado, TURMA_META, TURMA_PREVISTAS, Tela,
  missaoFechada, nivel, porcentagemTurma, progressoMissao,
} from "./regras";

const esc = (s: string | number): string =>
  String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]!);

const pct = (n: number): string => n.toString().replace(".", ",");

function barra(valor: number, comMeta = false): string {
  return `<div class="bar${comMeta ? " goal" : ""}" role="img" aria-label="${valor}%"><span style="width:${Math.min(valor, 100)}%"></span></div>`;
}

function statusMissao(s: Estado): [string, string] {
  switch (s.final) {
    case "prazo": return ["s-good", "✔ Concluída no prazo"];
    case "atraso": return ["s-bad", "⚠ Entregue com atraso"];
    case "pendente": return ["s-warn", "⏳ XP pendente: checklist incompleto"];
    default: return s.rascunho ? ["s-info", "◐ Rascunho enviado"] : ["s-warn", "○ Não iniciada"];
  }
}

function entrada(): string {
  return `<section class="panel">
  <h2>Olá, Ana F. (aluna fictícia)</h2>
  <p>Esta semana você tem <strong>3 missões</strong>. Cada missão é uma atividade real da disciplina, dividida em duas etapas: rascunho até <strong>quarta 23h59</strong> e entrega final até <strong>sexta 23h59</strong>.</p>
  <p class="muted">Dados de partida (simulados): 105 XP, sequência de 2 semanas, Missões 2 e 3 já concluídas, turma com 71 de 90 entregas no prazo.</p>
  <div class="actions"><button type="button" data-goto="painel">Entrar na semana</button></div>
</section>`;
}

function painel(s: Estado): string {
  const [cls, txt] = statusMissao(s);
  const lembrete = s.dia >= 4 && s.dia <= 5 && s.final !== "prazo"
    ? `<div class="banner s-warn" role="status">⏰ Lembrete: a Missão 1 fecha ${s.dia === 5 ? "hoje" : "amanhã"} (sexta) às 23h59.</div>`
    : "";
  const semanaIncompleta = s.final === "atraso";
  const passeTxt = s.passe ? "✔ 1 disponível" : s.passeUsado ? "Usado nesta semana" : "0";

  const carta = s.cartas > 0 || s.cartaUsada
    ? `<section class="panel" aria-labelledby="h-carta">
    <h3 id="h-carta">Carta de Escolha</h3>
    ${s.cartaUsada
      ? `<p class="status s-good">✔ Você escolheu: ${esc(s.cartaUsada)}</p>`
      : `<p>Você completou 3 semanas seguidas. Escolha como usar sua carta (1 por semana):</p>
    <div class="choices">
      <button type="button" data-action="carta" data-value="+24h de prazo em uma atividade futura"><strong>+24h de prazo</strong>em uma atividade futura</button>
      <button type="button" data-action="carta" data-value="Entregar a próxima atividade em formato alternativo"><strong>Formato alternativo</strong>áudio ou mapa mental</button>
      <button type="button" data-action="carta" data-value="Escolher o tema de um exercício"><strong>Escolher o tema</strong>de um exercício da próxima semana</button>
    </div>`}
  </section>`
    : "";

  return `${lembrete}
  <div class="grid">
    <section class="panel" aria-labelledby="h-xp">
      <h3 id="h-xp">Meu progresso (só eu vejo)</h3>
      <div class="big">${s.xp} XP</div>
      <p><span class="status s-info">★ Nível: ${nivel(s.xp)}</span></p>
      ${barra(Math.round((Math.min(s.xp, 120) / 120) * 100))}
      <p class="muted">Faixas: Aprendiz 0–59 · Organizado 60–119 · Mestre do Prazo 120+</p>
    </section>
    <section class="panel" aria-labelledby="h-seq">
      <h3 id="h-seq">Sequência semanal</h3>
      <div class="big">${s.sequencia} ${s.sequencia === 1 ? "semana" : "semanas"}</div>
      <p class="muted">A cada 3 semanas seguidas com todas as missões no prazo: 1 Carta de Escolha.</p>
      <div class="kv"><span>Passe do mês</span><strong>${passeTxt}</strong></div>
      ${semanaIncompleta && s.passe ? `<div class="banner s-warn">Semana incompleta. Sem o Passe, a sequência volta a 0 na segunda (seu XP não muda).<div class="actions" style="margin-top:8px"><button type="button" data-action="passe">Usar Passe e manter a sequência</button></div></div>` : ""}
      ${semanaIncompleta && s.passeUsado ? `<div class="banner s-good">✔ Passe usado: a sequência de ${s.sequencia} semanas foi mantida.</div>` : ""}
    </section>
  </div>
  <section class="panel" aria-labelledby="h-mis">
    <h3 id="h-mis">Missões da semana</h3>
    <ul class="missions">
      <li><span><strong>Missão 1</strong> · Questionário de Biologia</span><span class="status ${cls}">${txt}</span><button type="button" class="ghost" data-goto="missao">Abrir</button></li>
      <li><span><strong>Missão 2</strong> · Lista de Matemática</span><span class="status s-good">✔ Concluída no prazo</span></li>
      <li><span><strong>Missão 3</strong> · Resumo de História</span><span class="status s-good">✔ Concluída no prazo</span></li>
    </ul>
  </section>
  ${carta}
  <section class="panel">
    <h3>Meta da turma</h3>
    ${barra(porcentagemTurma(s), true)}
    <div class="kv"><span>${s.turma} de ${TURMA_PREVISTAS} entregas no prazo</span><strong>${pct(porcentagemTurma(s))}% · meta 80%</strong></div>
    <div class="actions"><button type="button" class="ghost" data-goto="turma">Ver meta da turma</button></div>
  </section>`;
}

function missao(s: Estado): string {
  const [cls, txt] = statusMissao(s);
  const fechada = missaoFechada(s);
  const rascunho = s.rascunho === "ok"
    ? '<span class="status s-good">✔ Enviado no ponto de controle (+5 XP)</span>'
    : s.rascunho === "fora"
      ? '<span class="status s-warn">⏳ Enviado após o ponto de controle (0 XP)</span>'
      : '<span class="status s-warn">○ Ainda não enviado</span>';
  const itens = CHECKLIST.map((c, i) =>
    `<label class="check" for="ck${i}"><input type="checkbox" id="ck${i}" data-check="${i}" ${s.checklist[i] ? "checked" : ""} ${fechada ? "disabled" : ""}> <span>${c}</span></label>`,
  ).join("");

  return `<section class="panel">
    <div class="top"><h2>Missão 1 · Questionário de Biologia</h2><span class="status ${cls}">${txt}</span></div>
    ${barra(progressoMissao(s))}
    <p class="muted">Progresso da missão: ${progressoMissao(s)}% · Hoje (simulado): ${DIAS[s.dia]}</p>
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
    <p>${rascunho}</p>
    <p class="muted">Arquivo simulado: rascunho-biologia.pdf</p>
    <div class="actions"><button type="button" id="b-rasc" data-action="rascunho">${s.rascunho ? "Enviar rascunho de novo" : "Enviar rascunho"}</button></div>
  </section>
  <section class="panel" aria-labelledby="h-e2">
    <h3 id="h-e2">Etapa 2 · Entrega final</h3>
    <fieldset>
      <legend>Checklist de qualidade (os 3 são obrigatórios para o XP)</legend>
      ${itens}
    </fieldset>
    <p class="muted">Arquivo simulado: questionario-biologia-final.pdf${s.versoesExtras ? ` · versões extras enviadas: ${s.versoesExtras}` : ""}</p>
    <div class="actions"><button type="button" id="b-final" data-action="final">${fechada ? "Reenviar entrega" : "Enviar entrega final"}</button></div>
  </section>`;
}

function feedback(s: Estado): string {
  const f = s.feedback;
  if (!f) return painel(s);
  const icone = { good: "✔", warn: "⏳", bad: "⚠" }[f.tipo];
  const linha = (nome: string, a: string | number, d: string | number) =>
    `<tr><th scope="row">${nome}</th><td>${a}</td><td>${d}</td><td>${a === d ? "sem mudança" : "<strong>mudou</strong>"}</td></tr>`;
  return `<section class="panel">
    <div class="fb-head"><span class="fb-icon status s-${f.tipo}" aria-hidden="true">${icone}</span><h2>${esc(f.titulo)}</h2></div>
    <p>${esc(f.mensagem)}</p>
    <h3>Progresso atualizado</h3>
    <div class="tablebox"><table>
      <thead><tr><th>Indicador</th><th>Antes</th><th>Depois</th><th></th></tr></thead>
      <tbody>
      ${linha("XP", f.antes.xp, f.depois.xp)}
      ${linha("Nível", f.antes.nivel, f.depois.nivel)}
      ${linha("Missão 1", `${f.antes.missao}%`, `${f.depois.missao}%`)}
      ${linha("Sequência", `${f.antes.sequencia} sem.`, `${f.depois.sequencia} sem.`)}
      ${linha("Meta da turma", `${f.antes.turma}/90`, `${f.depois.turma}/90`)}
      </tbody></table></div>
    <div class="actions"><button type="button" data-goto="${f.proxima}">Próxima ação: ${f.proxima === "missao" ? "voltar à missão" : "ir ao painel"}</button></div>
  </section>`;
}

function turma(s: Estado): string {
  const bateu = s.turma >= TURMA_META;
  const rodape = bateu
    ? s.recompensa
      ? `<p class="status s-good">✔ Turma votou: ${esc(s.recompensa)}</p>`
      : `<div class="banner s-good">✔ Meta atingida! A turma desbloqueou 1 recompensa coletiva nesta semana. Vote:</div>
      <div class="choices">
        <button type="button" data-action="votar" data-value="escolher o tema da aula de revisão"><strong>Tema da revisão</strong>a turma escolhe o tema da aula de revisão</button>
        <button type="button" data-action="votar" data-value="15 min de quiz de revisão em equipes"><strong>Quiz em equipes</strong>15 minutos de quiz de revisão</button>
      </div>`
    : `<p class="status s-info">Faltam ${TURMA_META - s.turma} entregas no prazo para a meta.</p>`;
  return `<section class="panel">
    <h2>Meta da turma 1º A</h2>
    <p>Cada missão concluída no prazo, por qualquer aluno, soma 1 ponto. A barra mostra só o total da turma, sem nomes.</p>
    ${barra(porcentagemTurma(s), true)}
    <div class="kv"><span>${s.turma} de ${TURMA_PREVISTAS} entregas previstas</span><strong>${pct(porcentagemTurma(s))}%</strong></div>
    <p class="muted">Linha tracejada = meta de 80% (72 entregas). A barra volta a zero na segunda-feira.</p>
    ${rodape}
  </section>`;
}

function regras(): string {
  return `<section class="panel">
  <h2>Regras das três mecânicas</h2>
  <div class="tablebox"><table>
  <thead><tr><th>Mecânica</th><th>Ação</th><th>Validação</th><th>Resultado</th><th>Limites</th></tr></thead>
  <tbody>
  <tr><td><strong>M1 Missão em Etapas</strong></td><td>Enviar rascunho e entrega final</td><td>Rascunho até qua 23h59; final até sex 23h59 com checklist completo</td><td>+5 XP (50%) e +10 XP (100%); níveis por XP</td><td>XP 1 vez por etapa; reenvio sem XP; atraso = 0 XP sem perder XP</td></tr>
  <tr><td><strong>M2 Sequência com Passe</strong></td><td>Concluir as 3 missões da semana no prazo</td><td>3 missões “Concluída no prazo” até sex 23h59</td><td>+1 semana; a cada 3 semanas, 1 Carta de Escolha</td><td>1 Passe por mês; quebra zera só a sequência</td></tr>
  <tr><td><strong>M3 Meta da Turma</strong></td><td>Qualquer missão concluída no prazo</td><td>Entrega validada na M1</td><td>+1 na barra; 72/90 (80%) libera recompensa votada</td><td>1 recompensa por semana; sem nomes</td></tr>
  </tbody></table></div>
</section>`;
}

function testes(): string {
  return `<section class="panel">
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
</section>`;
}

export const TELAS: Record<Tela, (s: Estado) => string> = {
  entrada, painel, missao, feedback, turma, regras, testes,
};
