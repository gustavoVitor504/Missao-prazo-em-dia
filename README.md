# Missão Prazo em Dia

Protótipo navegável de gamificação para incentivar a entrega de atividades no prazo. Feito com TypeScript e Vite, sem framework.

> Todos os nomes, turmas e números são **fictícios**. As validações são **simuladas** no navegador e nada é salvo. Os valores do protótipo não comprovam impacto real.

## Mecânicas representadas

| Mecânica | Regra resumida |
| --- | --- |
| M1 Missão em Etapas | Rascunho até quarta 23h59 (+5 XP) e entrega final até sexta 23h59 com checklist completo (+10 XP). Níveis: Aprendiz 0–59, Organizado 60–119, Mestre do Prazo 120+ |
| M2 Sequência Semanal com Passe | Semana com as 3 missões no prazo soma 1 na sequência. A cada 3 semanas, 1 Carta de Escolha. 1 Passe por mês mantém a sequência |
| M3 Meta da Turma | Cada entrega validada soma 1 na barra da turma. 72 de 90 (80%) libera uma recompensa coletiva votada |

As regras ficam em `src/regras.ts`, separadas da interface (`src/views.ts`), para facilitar a conferência com o documento do trabalho.

## Rodar no computador

Precisa do [Node.js](https://nodejs.org) 20 ou mais novo.

```bash
npm install
npm run dev       # abre em http://localhost:5173
npm run build     # gera a pasta dist/ para publicar
npm run preview   # testa a versão de produção
```
## Roteiro de testes

O item **Roteiro de testes** do menu ☰ (e os atalhos ao lado do celular, no computador) tem botões que preparam cada cenário:

- **A. Conclusão bem-sucedida:** rascunho na quarta e entrega completa na sexta. Esperado: 105 → 120 XP, missão 100%, sequência 3 semanas, Carta de Escolha e turma 72/90.
- **B. Ação repetida:** reenviar a entrega já validada. Esperado: nenhuma mudança de XP nem da turma.
- **C. Critério não atendido:** entregar com 2 itens do checklist. Esperado: XP pendente até completar.
- **D. Interrupção:** entregar no sábado. Esperado: 0 XP, XP anterior mantido e opção de usar o Passe.

Autores: [Gustavo Vitor Ferreira , Júlio César Nunes , Thalles Silveira]
