import "./style.css";
import { Dia, Estado, Tela, enviarFinal, enviarRascunho, estadoInicial, usarCarta, usarPasse, votarRecompensa } from "./regras";
import { TELAS, menu, ui } from "./views";

const $ = <T extends HTMLElement>(sel: string): T => {
  const el = document.querySelector<T>(sel);
  if (!el) throw new Error(`Elemento não encontrado: ${sel}`);
  return el;
};

const app = $<HTMLElement>("#app");
const push = $<HTMLElement>("#push");
const seletorDia = $<HTMLSelectElement>("#day");

const diaSelecionado = (): Dia => Number(seletorDia.value) as Dia;

let estado: Estado = estadoInicial(diaSelecionado());
let timerPush = 0;

function rolarParaTopo(): void {
  window.scrollTo({ top: 0 });
  app.querySelector(".body")?.scrollTo({ top: 0 });
}

function render(): void {
  app.innerHTML = TELAS[estado.tela](estado) + menu(estado);
  app.querySelector<HTMLElement>(".sheet [autofocus], .drawer .mi")?.focus({ preventScroll: true });
}

function irPara(tela: Tela): void {
  estado.tela = tela;
  ui.menu = false;
  render();
  rolarParaTopo();
}

function reiniciar(dia: Dia): void {
  seletorDia.value = String(dia);
  estado = estadoInicial(dia);
  ui.voto = null;
  ui.carta = null;
  ui.menu = false;
}

// Aviso no topo da tela, como a notificação push do app quando o AVA confirma um envio.
function mostrarPush(): void {
  const f = estado.feedback;
  if (!f || f.tipo !== "good") return;
  push.innerHTML = `<span class="ap" aria-hidden="true">★</span><span><span class="tt">Progresso <span>agora</span></span><span class="mm"><b>${f.titulo}</b></span></span>`;
  push.hidden = false;
  push.classList.remove("show");
  void push.offsetWidth;
  push.classList.add("show");
  window.clearTimeout(timerPush);
  timerPush = window.setTimeout(() => { push.hidden = true; }, 4000);
}

document.addEventListener("click", (e) => {
  const alvo = (e.target as HTMLElement).closest<HTMLElement>("[data-goto], [data-action]");
  if (!alvo || (alvo as HTMLButtonElement).disabled) return;
  const { goto, action, value = "" } = alvo.dataset;
  if (goto) return irPara(goto as Tela);

  switch (action) {
    case "rascunho": enviarRascunho(estado); render(); mostrarPush(); return;
    case "final": enviarFinal(estado); render(); mostrarPush(); return;
    case "passe": usarPasse(estado); break;
    case "sel-carta": ui.carta = value; break;
    case "carta": if (value) usarCarta(estado, value); ui.carta = null; break;
    case "sel-voto": ui.voto = value; break;
    case "votar": if (value) votarRecompensa(estado, value); ui.voto = null; break;
    case "menu": ui.menu = true; break;
    case "fechar-menu": ui.menu = false; break;
    case "fechar": if (estado.feedback) return irPara(estado.feedback.proxima); return;
    case "cenario": reiniciar(Number(value) as Dia); return irPara("missao");
    default: return;
  }
  render();
});

document.addEventListener("keydown", (e) => {
  if (e.key !== "Escape") return;
  if (ui.menu) { ui.menu = false; render(); }
  else if (estado.tela === "feedback" && estado.feedback) irPara(estado.feedback.proxima);
});

app.addEventListener("change", (e) => {
  const caixa = e.target as HTMLInputElement;
  if (caixa.dataset.check !== undefined) estado.checklist[Number(caixa.dataset.check)] = caixa.checked;
});

seletorDia.addEventListener("change", () => {
  estado.dia = diaSelecionado();
  render();
});

$<HTMLButtonElement>("#reset").addEventListener("click", () => {
  reiniciar(diaSelecionado());
  irPara("entrada");
});

render();
