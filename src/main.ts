import "./style.css";
import { Dia, Estado, Tela, enviarFinal, enviarRascunho, estadoInicial, usarCarta, usarPasse, votarRecompensa } from "./regras";
import { TELAS } from "./views";

const $ = <T extends HTMLElement>(sel: string): T => {
  const el = document.querySelector<T>(sel);
  if (!el) throw new Error(`Elemento não encontrado: ${sel}`);
  return el;
};

const app = $<HTMLElement>("#app");
const nav = $<HTMLElement>("#nav");
const seletorDia = $<HTMLSelectElement>("#day");

const diaSelecionado = (): Dia => Number(seletorDia.value) as Dia;

let estado: Estado = estadoInicial(diaSelecionado());

function render(): void {
  nav.hidden = estado.tela === "entrada";
  nav.querySelectorAll<HTMLButtonElement>("button[data-view]").forEach((b) => {
    if (b.dataset.view === estado.tela) b.setAttribute("aria-current", "page");
    else b.removeAttribute("aria-current");
  });
  app.innerHTML = TELAS[estado.tela](estado);
}

function irPara(tela: Tela): void {
  estado.tela = tela;
  render();
  window.scrollTo({ top: 0 });
}

function iniciarCenario(dia: Dia): void {
  seletorDia.value = String(dia);
  estado = estadoInicial(dia);
  irPara("missao");
}

nav.addEventListener("click", (e) => {
  const view = (e.target as HTMLElement).closest<HTMLButtonElement>("button[data-view]")?.dataset.view;
  if (view) irPara(view as Tela);
});

app.addEventListener("click", (e) => {
  const botao = (e.target as HTMLElement).closest<HTMLButtonElement>("button");
  if (!botao) return;
  const { goto, action, value = "" } = botao.dataset;
  if (goto) return irPara(goto as Tela);
  switch (action) {
    case "rascunho": enviarRascunho(estado); break;
    case "final": enviarFinal(estado); break;
    case "passe": usarPasse(estado); break;
    case "carta": usarCarta(estado, value); break;
    case "votar": votarRecompensa(estado, value); break;
    case "cenario": return iniciarCenario(Number(value) as Dia);
    default: return;
  }
  render();
  window.scrollTo({ top: 0 });
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
  estado = estadoInicial(diaSelecionado());
  render();
});

render();
