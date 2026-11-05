// Telas do protótipo no visual do app (aba Progresso). Cada função devolve HTML;
// os botões usam data-action / data-goto, tratados em main.ts.
import {
  CHECKLIST, DIAS, Estado, Feedback, TURMA_META, TURMA_PREVISTAS, Tela,
  missaoFechada, nivel, porcentagemTurma, progressoMissao,
} from "./regras";

// Estado só de interface (não faz parte das regras): menu aberto e opções marcadas antes de confirmar.
export const ui: { menu: boolean; voto: string | null; carta: string | null } = { menu: false, voto: null, carta: null };

const esc = (s: string | number): string =>
  String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]!);

const pct = (n: number): string => n.toString().replace(".", ",");

const DISCIPLINA = "N231 · N1 · Desenvolvimento de Jogos Digitais";
const MISSAO = "Questionário · Capítulo 4";

const CARTAS = [
  ["+24h de prazo", "em uma atividade futura"],
  ["Formato alternativo", "entregar em áudio ou mapa mental"],
  ["Escolher o tema", "de um exercício da próxima semana"],
] as const;

const RECOMPENSAS = [
  ["Quiz em equipes", "15 minutos de quiz de revisão"],
  ["Tema da revisão", "a turma escolhe o tema da aula de revisão"],
] as const;

// ---------- Componentes ----------
function bar(valor: number, cls = ""): string {
  const v = Math.max(0, Math.min(valor, 100));
  return `<div class="bar ${cls}" role="img" aria-label="${Math.round(v)}%"><span style="width:${v}%"></span></div>`;
}

const row = (l: string, v: string): string => `<div class="row"><span class="l">${l}</span><span class="v">${v}</span></div>`;
const rowStack = (l: string, v: string): string => `<div class="row stack"><span class="l">${l}</span><span class="v">${v}</span></div>`;
const tag = (cls: string, txt: string): string => `<span class="tag ${cls}">${txt}</span>`;
const card = (titulo: string, corpo: string, extra = ""): string =>
  `<section class="card"${extra}>${titulo ? `<h3 class="ct">${titulo}</h3>` : ""}${corpo}</section>`;

function cabecalho(titulo: string, voltar: Tela): string {
  return `<header class="hdr">
    <button type="button" class="back" data-goto="${voltar}" aria-label="Voltar">←</button>
    <h2>${titulo}</h2>
    <button type="button" class="circ" data-action="menu" aria-label="Abrir menu">☰</button>
  </header>`;
}

const tela = (titulo: string, voltar: Tela, corpo: string): string =>
  `${cabecalho(titulo, voltar)}<div class="body">${corpo}</div>`;

// [classe da tag, texto da tag, texto curto]
function statusMissao(s: Estado): [string, string] {
  switch (s.final) {
    case "prazo": return ["g", "✔ No prazo"];
    case "atraso": return ["b", "⚠ Atrasada"];
    case "pendente": return ["w", "⏳ XP pendente"];
    default: return s.rascunho ? ["i", "◐ Rascunho ok"] : ["w", "○ Não iniciada"];
  }
}

function xpCard(s: Estado): string {
  const falta = s.xp >= 120
    ? tag("g", "★ Nível máximo da etapa")
    : `<p class="small">Faltam ${120 - s.xp} XP para <b>Mestre do Prazo</b></p>`;
  return card("Meu progresso · só eu vejo", `
    <div class="flex"><span class="big">${s.xp} XP</span>${tag("i", `★ ${nivel(s.xp)}`)}</div>
    ${bar(Math.round((Math.min(s.xp, 120) / 120) * 100), s.xp >= 120 ? "gold" : "")}
    ${falta}
    <p class="small">Faixas: Aprendiz 0–59 · Organizado 60–119 · Mestre do Prazo 120+</p>`);
}

function semanas(n: number): string {
  return `<div class="weeks" aria-hidden="true">${[1, 2, 3].map((i) =>
    `<i class="${i <= n ? (i === 3 ? "card3" : "on") : ""}">${i === 3 ? "🃏" : "S" + i}</i>`).join("")}</div>`;
}

function seqCard(s: Estado): string {
  const incompleta = s.final === "atraso";
  const passe = s.passe ? "🎟 1 disponível" : s.passeUsado ? "Usado nesta semana" : "0";
  let selo = "";
  if (s.cartas > 0) selo = tag("g", "🃏 Carta liberada");
  else if (incompleta && !s.passeUsado) selo = tag("b", "Semana incompleta");
  else if (s.passeUsado) selo = tag("g", "✔ Sequência mantida");

  let extra = "";
  if (incompleta && s.passe) {
    extra = `<p class="small" style="margin:8px 0">Sem o Passe, a sequência volta a 0 na segunda. Seu XP não muda.</p>
      <button type="button" class="pill" data-action="passe">🎟 Usar Passe e manter</button>`;
  } else if (incompleta && s.passeUsado) {
    extra = `<p class="small" style="margin-top:8px">Passe usado: a sequência de ${s.sequencia} semanas foi mantida.</p>`;
  }
  if (s.cartas > 0) extra += `<button type="button" class="pill ghost" data-goto="carta" style="margin-top:10px">Usar minha carta</button>`;

  return card("Sequência semanal", `
    <div class="flex"><span class="big md">${s.sequencia} ${s.sequencia === 1 ? "semana" : "semanas"}</span>${selo}</div>
    ${semanas(s.sequencia)}
    ${row("Passe do mês", passe)}
    ${s.cartaUsada ? row("Carta usada", esc(s.cartaUsada)) : ""}
    ${extra}`);
}

function misList(s: Estado): string {
  const [cls, txt] = statusMissao(s);
  return card("Missões da semana", `
    <button type="button" class="mis link" data-goto="missao">
      <span class="dot ${cls}">1</span><span class="tx">Questionário<small>N231 · Jogos Digitais</small></span>${tag(cls, txt)}<span class="chev" aria-hidden="true">›</span>
    </button>
    <div class="mis"><span class="dot g">2</span><span class="tx">Lista de exercícios<small>N202 · Robótica</small></span>${tag("g", "✔ No prazo")}</div>
    <div class="mis"><span class="dot g">3</span><span class="tx">Resumo do capítulo<small>N215 · Banco de Dados</small></span>${tag("g", "✔ No prazo")}</div>`);
}

function turmaCard(s: Estado): string {
  const p = porcentagemTurma(s);
  const fim = s.turma >= TURMA_META
    ? `<div style="margin-top:8px">${tag("g", s.recompensa ? "✔ Recompensa votada" : "✔ Meta atingida · votação aberta")}</div>`
    : `<p class="small" style="margin-top:6px">Faltam ${TURMA_META - s.turma} entregas para a recompensa coletiva.</p>`;
  return card("Meta da turma · N231", `
    ${bar(p, "goal")}
    <div class="flex small"><span>${s.turma} de ${TURMA_PREVISTAS} entregas no prazo</span><b class="navy">${pct(p)}% · meta 80%</b></div>
    ${fim}
    <button type="button" class="pill ghost" data-goto="turma" style="margin-top:10px">Ver meta da turma</button>`);
}

function lembrete(s: Estado): string {
  if (s.dia < 4 || s.dia > 5 || missaoFechada(s)) return "";
  return `<div class="alert w" role="status">⏰ A Missão 1 fecha ${s.dia === 5 ? "hoje" : "amanhã"} (sexta) às 23h59.</div>`;
}

// ---------- Telas ----------
function entrada(s: Estado): string {
  return `<div class="homebar">
    <button type="button" class="circ" data-action="menu" aria-label="Abrir menu">☰</button>
    <span class="circ" aria-hidden="true">🔔</span>
  </div>
  <div class="ola"><div class="o">Olá,</div><div class="n">ANA F. (ALUNA FICTÍCIA)</div></div>
  <div class="body">
    <section class="hero">
      <div class="flex"><div><h2 class="t">seu progresso</h2><p class="s">${s.xp} XP · ${nivel(s.xp)} · ${s.sequencia} semanas seguidas</p></div><div class="star" aria-hidden="true">★</div></div>
      ${bar(Math.round((Math.min(s.xp, 120) / 120) * 100), "on-hero")}
      <p class="s">${missaoFechada(s) ? "Missão 1 encerrada nesta semana" : "Missão 1 fecha sexta às 23h59"}</p>
      <button type="button" class="pill white" data-goto="painel">Ver minhas missões</button>
    </section>
    ${lembrete(s)}
    ${card("Esta semana", `
      <p class="txt">Você tem <b>3 missões</b>. Cada missão é uma atividade real da disciplina, em duas etapas: rascunho até <b>quarta 23h59</b> e entrega final até <b>sexta 23h59</b>.</p>
      <p class="small" style="margin-top:6px">Ponto de partida simulado: 105 XP, sequência de 2 semanas, Missões 2 e 3 concluídas e turma com 71 de 90 entregas no prazo.</p>`)}
    <section class="card soft">
      <h3 class="soft-t">Protótipo de estudo</h3>
      <p class="small">Nomes e números são fictícios. Os envios são simulados no navegador e nada é salvo. Use o menu ☰ para ver as regras e o roteiro de testes.</p>
    </section>
  </div>`;
}

function painel(s: Estado): string {
  return tela("Progresso", "entrada", `
    <div class="filter"><span class="lines" aria-hidden="true"><i></i><i></i></span>COMPUTAÇÃO · SEMANA 12 · ${DIAS[s.dia].toUpperCase()}</div>
    ${lembrete(s)}
    ${xpCard(s)}
    ${seqCard(s)}
    ${misList(s)}
    ${turmaCard(s)}`);
}

function missao(s: Estado): string {
  const [cls, txt] = statusMissao(s);
  const fechada = missaoFechada(s);
  const progresso = progressoMissao(s);
  const rascunho = s.rascunho === "ok" ? tag("g", "✔ +5 XP")
    : s.rascunho === "fora" ? tag("w", "⏳ Após o ponto · 0 XP")
    : tag("w", "○ Não enviado");
  const final = s.final === "prazo" ? tag("g", "✔ +10 XP")
    : s.final === "atraso" ? tag("b", "⚠ Atraso · 0 XP")
    : s.final === "pendente" ? tag("w", "⏳ XP pendente")
    : tag("w", "○ Não enviado");

  const itens = CHECKLIST.map((c, i) => {
    const falta = s.final === "pendente" && !s.checklist[i];
    return `<label class="chk${falta ? " miss" : ""}">
      <input type="checkbox" data-check="${i}" ${s.checklist[i] ? "checked" : ""} ${fechada ? "disabled" : ""}>
      <span class="box" aria-hidden="true"></span><span>${c}</span></label>`;
  }).join("");

  return tela("Missão 1", "painel", `
    ${card(DISCIPLINA, `
      <div class="mtitle">${MISSAO}</div>
      ${bar(progresso)}
      <div class="flex small"><span>Progresso da missão</span><b>${progresso}%</b></div>
      ${row("Status", tag(cls, txt))}
      ${row("Hoje (simulado)", DIAS[s.dia])}`)}
    ${lembrete(s)}
    ${card("Etapa 1 · Rascunho", `
      ${row("Prazo", "até qua 23h59 · +5 XP")}
      ${row("Situação", rascunho)}
      <p class="small" style="margin:6px 0 10px">Arquivo simulado: rascunho-jogos-digitais.pdf</p>
      <button type="button" class="pill${s.rascunho ? " ghost" : ""}" data-action="rascunho">${s.rascunho ? "Enviar rascunho de novo" : "Enviar rascunho"}</button>`)}
    ${card("Etapa 2 · Entrega final", `
      ${row("Prazo", "até sex 23h59 · +10 XP")}
      ${row("Situação", final)}
      <fieldset class="checks"><legend class="small">Checklist da entrega final · os 3 itens são obrigatórios para o XP</legend>${itens}</fieldset>
      ${s.final === "pendente" && s.dia <= 5 ? `<p class="small bad">Prazo para corrigir: ${s.dia === 5 ? "hoje, sexta" : "sexta"}, 23h59.</p>` : ""}
      <p class="small" style="margin:6px 0 10px">Arquivo simulado: questionario-final.pdf${s.versoesExtras ? ` · versões extras: ${s.versoesExtras}` : ""}</p>
      <button type="button" class="pill${fechada ? " ghost" : ""}" data-action="final">${fechada ? "Reenviar entrega" : s.final === "pendente" ? "Corrigir e reenviar" : "Enviar entrega final"}</button>`)}
    <p class="small center">No app real, os botões abrem a atividade no AVA, onde o envio já acontece hoje.</p>`);
}

function sheet(f: Feedback): string {
  const ganho = f.depois.xp - f.antes.xp;
  const icone = { good: "✔", warn: "⏳", bad: "⚠" }[f.tipo];
  const cor = { good: "g", warn: "w", bad: "b" }[f.tipo];
  const curto = (n: string) => (n === "Mestre do Prazo" ? "Mestre" : n);
  const linhas: Array<[string, string, string]> = [
    ["XP", String(f.antes.xp), String(f.depois.xp)],
    ["Nível", curto(f.antes.nivel), curto(f.depois.nivel)],
    ["Missão 1", `${f.antes.missao}%`, `${f.depois.missao}%`],
    ["Sequência", `${f.antes.sequencia} sem.`, `${f.depois.sequencia} sem.`],
    ["Turma", `${f.antes.turma}/90`, `${f.depois.turma}/90`],
  ];
  const cmp = linhas.map(([k, a, d]) =>
    `<div class="k">${k}</div><div class="a">${a}</div><div class="ar" aria-hidden="true">→</div><div class="d ${a === d ? "same" : "up"}">${d}</div>`).join("");
  const botao = f.tipo === "bad" ? "Ver opção de Passe" : f.proxima === "missao" ? "Voltar à missão" : "Ver meu progresso";
  return `<div class="dim" data-action="fechar"></div>
  <div class="sheet" role="dialog" aria-modal="true" aria-labelledby="sheet-t">
    <div class="grab" aria-hidden="true"></div>
    ${ganho > 0 ? `<div class="xpbig">+${ganho} XP</div>` : `<div class="badge ${cor}" aria-hidden="true">${icone}</div>`}
    <h4 id="sheet-t">${esc(ganho > 0 ? f.titulo.replace(/: \+\d+ XP$/, "") : f.titulo)}</h4>
    <p>${esc(f.mensagem)}</p>
    <div class="cmp">${cmp}</div>
    <button type="button" class="pill" data-goto="${f.proxima}" autofocus>${botao}</button>
  </div>`;
}

function feedback(s: Estado): string {
  const f = s.feedback;
  if (!f) return painel(s);
  return TELAS[f.proxima](s) + sheet(f);
}

function turma(s: Estado): string {
  const p = porcentagemTurma(s);
  const bateu = s.turma >= TURMA_META;
  const hero = `<section class="hero">
    <h2 class="t">${bateu ? "Meta atingida! 🎉" : "Meta da turma"}</h2>
    <p class="s">N231 · Desenvolvimento de Jogos Digitais</p>
    ${bar(p, `goal on-hero${bateu ? " gold-fill" : ""}`)}
    <p class="s">${s.turma} de ${TURMA_PREVISTAS} entregas no prazo · ${pct(p)}%</p>
  </section>`;

  let votacao: string;
  if (!bateu) {
    votacao = card("Recompensa coletiva", `<p class="txt">Faltam <b>${TURMA_META - s.turma} entregas</b> no prazo para a turma liberar a recompensa da semana.</p>`);
  } else if (s.recompensa) {
    votacao = card("Recompensa coletiva", `${tag("g", "✔ Voto registrado")}<p class="txt" style="margin-top:8px">A turma escolheu: <b>${esc(s.recompensa)}</b>.</p>`);
  } else {
    const opts = RECOMPENSAS.map(([t, d]) => {
      const valor = `${t}: ${d}`;
      return `<button type="button" class="opt${ui.voto === valor ? " sel" : ""}" data-action="sel-voto" data-value="${esc(valor)}" aria-pressed="${ui.voto === valor}"><b>${t}</b>${d}</button>`;
    }).join("");
    votacao = card("Vote na recompensa coletiva", `<div class="opts">${opts}</div>`) +
      `<button type="button" class="pill" data-action="votar" data-value="${esc(ui.voto ?? "")}" ${ui.voto ? "" : "disabled"}>Confirmar meu voto</button>`;
  }

  return tela("Meta da turma", "painel", `
    ${hero}
    ${votacao}
    ${card("Como funciona", `
      ${rowStack("Pontos", "Cada missão concluída no prazo, de qualquer aluno, soma 1 ponto.")}
      ${rowStack("Meta", "A linha tracejada marca os 80% (72 entregas). A barra volta a zero na segunda.")}
      ${rowStack("Privacidade", "A barra mostra só o total da turma, sem nomes.")}`)}`);
}

function carta(s: Estado): string {
  let corpo: string;
  if (s.cartaUsada) {
    corpo = card("", `<div class="center"><div class="emoji">🃏</div><div class="mtitle">Carta usada</div>${tag("g", "✔ Confirmada")}<p class="txt" style="margin-top:8px">${esc(s.cartaUsada)}</p></div>`);
  } else if (s.cartas > 0) {
    const opts = CARTAS.map(([t, d]) => {
      const valor = `${t} ${d}`;
      return `<button type="button" class="opt${ui.carta === valor ? " sel" : ""}" data-action="sel-carta" data-value="${esc(valor)}" aria-pressed="${ui.carta === valor}"><b>${t}</b>${d}</button>`;
    }).join("");
    corpo = card("", `<div class="center"><div class="emoji">🃏</div><div class="mtitle">${s.sequencia} semanas seguidas!</div><p class="small">Escolha como usar sua carta (1 por semana):</p></div>`) +
      `<div class="opts">${opts}</div>
      <button type="button" class="pill" data-action="carta" data-value="${esc(ui.carta ?? "")}" ${ui.carta ? "" : "disabled"}>Usar carta</button>`;
  } else {
    corpo = card("Ainda bloqueada", `<p class="txt">Complete <b>3 semanas seguidas</b> com todas as missões no prazo para liberar uma Carta de Escolha.</p>${semanas(s.sequencia)}`);
  }
  return tela("Carta de Escolha", "painel", `${corpo}
    <p class="small center">A recompensa é autonomia, não nota: +24h de prazo, formato alternativo ou escolher o tema de um exercício.</p>`);
}

function regras(): string {
  const mec = (nome: string, linhas: Array<[string, string]>) => card(nome, linhas.map(([l, v]) => rowStack(l, v)).join(""));
  return tela("Regras", "painel", `
    ${mec("M1 · Missão em Etapas", [
      ["Ação", "Enviar rascunho e entrega final"],
      ["Validação", "Rascunho até qua 23h59; final até sex 23h59 com checklist completo"],
      ["Resultado", "+5 XP (50%) e +10 XP (100%); níveis por XP"],
      ["Limites", "XP 1 vez por etapa; reenvio sem XP; atraso = 0 XP sem perder XP"],
    ])}
    ${mec("M2 · Sequência com Passe", [
      ["Ação", "Concluir as 3 missões da semana no prazo"],
      ["Validação", "3 missões “No prazo” até sex 23h59"],
      ["Resultado", "+1 semana; a cada 3 semanas, 1 Carta de Escolha"],
      ["Limites", "1 Passe por mês; quebra zera só a sequência"],
    ])}
    ${mec("M3 · Meta da Turma", [
      ["Ação", "Qualquer missão concluída no prazo"],
      ["Validação", "Entrega validada na M1"],
      ["Resultado", "+1 na barra; 72/90 (80%) libera recompensa votada"],
      ["Limites", "1 recompensa por semana; sem nomes"],
    ])}`);
}

function testes(): string {
  const cen = (titulo: string, passos: string[], dia?: number) => card(titulo, `
    <ol class="steps">${passos.map((p) => `<li>${p}</li>`).join("")}</ol>
    ${dia ? `<button type="button" class="pill" data-action="cenario" data-value="${dia}" style="margin-top:10px">Iniciar ${titulo.split(" · ")[0].toLowerCase()}</button>` : ""}`);
  return tela("Roteiro de testes", "painel", `
    <p class="small">Cada botão reinicia a simulação e coloca o dia certo. Siga os passos e compare com o resultado esperado.</p>
    ${cen("Cenário A · Conclusão no prazo", [
      "Dia: Quarta. Missão 1 → Enviar rascunho. Esperado: +5 XP (110), missão 50%.",
      "Mude o dia para Sexta. Marque os 3 itens do checklist → Enviar entrega final.",
      "Esperado: +10 XP (120, Mestre do Prazo), missão 100%, sequência 3 semanas, 1 Carta de Escolha, turma 72/90 com recompensa liberada.",
    ], 3)}
    ${cen("Cenário B · Ação repetida", [
      "Complete o cenário A.",
      "Abra a Missão 1 e toque em Reenviar entrega.",
      "Esperado: aviso “Entrega já registrada”, XP continua 120 e turma continua 72/90.",
    ])}
    ${cen("Cenário C · Checklist incompleto", [
      "Dia: Sexta. Marque só 2 itens → Enviar entrega final.",
      "Esperado: “XP pendente”, item que falta em destaque, XP e turma sem mudança. Marque o 3º item e reenvie: +10 XP.",
    ], 5)}
    ${cen("Cenário D · Prazo perdido", [
      "Dia: Sábado. Enviar entrega final.",
      "Esperado: “Entregue com atraso: 0 XP”, XP anterior mantido; no Progresso aparece a opção de usar o Passe.",
    ], 6)}`);
}

// Menu lateral, no estilo do app, com o item novo "Progresso".
export function menu(s: Estado): string {
  if (!ui.menu) return "";
  const item = (goto: Tela, ico: string, txt: string, extra = "") =>
    `<button type="button" class="mi${s.tela === goto ? " cur" : ""}${extra ? " new" : ""}" data-goto="${goto}"><span class="ico" aria-hidden="true">${ico}</span>${txt}${extra}</button>`;
  return `<div class="dim" data-action="fechar-menu"></div>
  <nav class="drawer" aria-label="Menu">
    <div class="drawer-top">
      <div class="avatar" aria-hidden="true">AF</div>
      <div class="nm">ANA F. (ALUNA FICTÍCIA)</div>
      <div class="mt">N231 · Computação</div>
    </div>
    <div class="menu">
      ${item("entrada", "⌂", "Início")}
      ${item("painel", "★", "Progresso", '<span class="newtag">NOVO</span>')}
      ${item("missao", "✎", "Missão 1")}
      ${item("turma", "◎", "Meta da turma")}
      ${item("carta", "🃏", "Carta de Escolha")}
      ${item("regras", "☰", "Regras")}
      ${item("testes", "✓", "Roteiro de testes")}
      <button type="button" class="mi sair" data-action="fechar-menu"><span class="ico" aria-hidden="true">✕</span>Fechar menu</button>
    </div>
  </nav>`;
}

export const TELAS: Record<Tela, (s: Estado) => string> = {
  entrada, painel, missao, feedback, turma, carta, regras, testes,
};
