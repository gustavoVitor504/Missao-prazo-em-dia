// Regras das três mecânicas. Lógica pura, sem DOM, para ficar fácil de conferir com o documento.

export type Dia = 2 | 3 | 4 | 5 | 6; // terça a sábado
export type Tela = "entrada" | "painel" | "missao" | "feedback" | "turma" | "carta" | "regras" | "testes";
export type StatusRascunho = null | "ok" | "fora";
export type StatusFinal = null | "pendente" | "prazo" | "atraso";
export type TipoFeedback = "good" | "warn" | "bad";

export const DIAS: Record<Dia, string> = { 2: "Terça", 3: "Quarta", 4: "Quinta", 5: "Sexta", 6: "Sábado" };
export const CHECKLIST = ["Respondi as 5 questões", "Citei a fonte do texto usado", "Revisei a ortografia"] as const;
export const NIVEIS: ReadonlyArray<readonly [number, string]> = [
  [0, "Aprendiz"],
  [60, "Organizado"],
  [120, "Mestre do Prazo"],
];

export const PONTO_DE_CONTROLE: Dia = 3; // quarta 23h59
export const PRAZO_FINAL: Dia = 5; // sexta 23h59
export const XP_RASCUNHO = 5;
export const XP_ENTREGA = 10;
export const SEMANAS_POR_CARTA = 3;
export const TURMA_PREVISTAS = 90; // 30 alunos x 3 atividades
export const TURMA_META = 72; // 80% de 90

export interface Retrato {
  xp: number;
  nivel: string;
  missao: number;
  sequencia: number;
  turma: number;
}

export interface Feedback {
  tipo: TipoFeedback;
  titulo: string;
  mensagem: string;
  antes: Retrato;
  depois: Retrato;
  proxima: Tela;
}

export interface Estado {
  tela: Tela;
  dia: Dia;
  xp: number;
  rascunho: StatusRascunho;
  final: StatusFinal;
  checklist: boolean[];
  sequencia: number;
  passe: number;
  passeUsado: boolean;
  cartas: number;
  cartaUsada: string | null;
  turma: number;
  recompensa: string | null;
  feedback: Feedback | null;
  versoesExtras: number;
}

// Dados de partida simulados: Missões 2 e 3 já concluídas, sequência de 2 semanas.
export function estadoInicial(dia: Dia = 3): Estado {
  return {
    tela: "entrada",
    dia,
    xp: 105,
    rascunho: null,
    final: null,
    checklist: CHECKLIST.map(() => false),
    sequencia: 2,
    passe: 1,
    passeUsado: false,
    cartas: 0,
    cartaUsada: null,
    turma: 71,
    recompensa: null,
    feedback: null,
    versoesExtras: 0,
  };
}

export const nivel = (xp: number): string => NIVEIS.filter(([min]) => xp >= min).at(-1)![1];

export const progressoMissao = (s: Estado): number =>
  s.final === "prazo" || s.final === "atraso" ? 100 : s.rascunho ? 50 : 0;

export const porcentagemTurma = (s: Estado): number => Math.round((s.turma / TURMA_PREVISTAS) * 1000) / 10;

export const missaoFechada = (s: Estado): boolean => s.final === "prazo" || s.final === "atraso";

export const retrato = (s: Estado): Retrato => ({
  xp: s.xp,
  nivel: nivel(s.xp),
  missao: progressoMissao(s),
  sequencia: s.sequencia,
  turma: s.turma,
});

function comFeedback(s: Estado, tipo: TipoFeedback, titulo: string, mensagem: string, antes: Retrato, proxima: Tela): void {
  s.feedback = { tipo, titulo, mensagem, antes, depois: retrato(s), proxima };
  s.tela = "feedback";
}

// M1, etapa 1: rascunho até o ponto de controle.
export function enviarRascunho(s: Estado): void {
  const antes = retrato(s);
  if (s.rascunho) {
    return comFeedback(s, "warn", "Rascunho já registrado",
      "Você já enviou o rascunho desta missão. O reenvio fica salvo como nova versão, mas o XP desta etapa só é contado uma vez.",
      antes, "missao");
  }
  if (s.dia > PONTO_DE_CONTROLE) {
    s.rascunho = "fora";
    return comFeedback(s, "warn", "Rascunho recebido após o ponto de controle",
      "O ponto de controle fechou na quarta às 23h59, então esta etapa não gera XP. Você ainda pode fazer a entrega final até sexta às 23h59 e ganhar +10 XP.",
      antes, "missao");
  }
  s.rascunho = "ok";
  s.xp += XP_RASCUNHO;
  comFeedback(s, "good", `Etapa 1 concluída: +${XP_RASCUNHO} XP`,
    "Rascunho enviado antes do ponto de controle. A missão está em 50%. Próximo passo: completar o checklist e entregar até sexta às 23h59.",
    antes, "missao");
}

// M1, etapa 2: entrega final. Quando validada, também aciona M2 (sequência) e M3 (meta da turma).
export function enviarFinal(s: Estado): void {
  const antes = retrato(s);
  const faltam = CHECKLIST.filter((_, i) => !s.checklist[i]);

  if (missaoFechada(s)) {
    s.versoesExtras++;
    return comFeedback(s, "warn", "Entrega já registrada",
      "Esta missão já foi validada. O reenvio foi salvo como nova versão para o professor, sem XP adicional e sem somar de novo na meta da turma.",
      antes, "painel");
  }
  if (s.dia > PRAZO_FINAL) {
    s.final = "atraso";
    return comFeedback(s, "bad", "Entregue com atraso: 0 XP",
      "O prazo fechou na sexta às 23h59. A entrega foi registrada e o professor vai corrigir. Seu XP já ganho continua o mesmo. A semana ficou incompleta: veja no painel se quer usar o Passe para manter a sequência.",
      antes, "painel");
  }
  if (faltam.length > 0) {
    s.final = "pendente";
    return comFeedback(s, "warn", "Entrega registrada, XP pendente",
      `Falta no checklist: ${faltam.join("; ")}. Corrija e envie de novo até sexta às 23h59 para liberar +${XP_ENTREGA} XP. Nada foi perdido.`,
      antes, "missao");
  }

  s.final = "prazo";
  s.xp += XP_ENTREGA;
  s.turma += 1;
  s.sequencia += 1;
  let extra = ` A semana está completa: sequência agora em ${s.sequencia} semanas.`;
  if (s.sequencia % SEMANAS_POR_CARTA === 0) {
    s.cartas += 1;
    extra += " Você ganhou 1 Carta de Escolha.";
  }
  if (antes.nivel !== nivel(s.xp)) extra += ` Novo nível: ${nivel(s.xp)}.`;
  if (s.turma >= TURMA_META && antes.turma < TURMA_META) extra += " Sua entrega ajudou a turma a bater a meta de 80%!";
  comFeedback(s, "good", `Missão concluída no prazo: +${XP_ENTREGA} XP`, "Checklist completo e envio antes do prazo." + extra, antes, "painel");
}

// M2: o Passe mantém a sequência em uma semana incompleta (1 por mês).
export function usarPasse(s: Estado): void {
  if (s.passe < 1) return;
  s.passe = 0;
  s.passeUsado = true;
}

export function usarCarta(s: Estado, escolha: string): void {
  if (s.cartas < 1 || s.cartaUsada) return;
  s.cartaUsada = escolha;
  s.cartas -= 1;
}

// M3: recompensa coletiva, só depois de atingir a meta.
export function votarRecompensa(s: Estado, escolha: string): void {
  if (s.turma < TURMA_META || s.recompensa) return;
  s.recompensa = escolha;
}
