# E-3913 / F-3931 — Controle Concept V1.1 + Intertravamento Gás Ácido

One-page/PWA responsiva da U-39 para treinamento de operação e engenharia de controle.

## O que há nesta versão

Preservados integralmente os capítulos, simulador das cinco malhas de controle, fluxograma animado, tendências, situações de falha, quiz e avaliação CIC da Concept V1.0.

**NOVO: módulo "Intertravamento gás ácido"** na navegação superior, inserido após o simulador principal.

- 4 inputs de processo com campos numéricos e sliders sincronizados: LI-514, PT-518, PIC-524A e LIC-519.
- Porta OU binária com indicadores por comparador: PV<10%, PV≥4,5, PV≥0,85, PV≥95%.
- Visualização temporal das ações do desenho: XA-39524, PIC-39524B abre 5% (flare), PIC-39524A fecha / MANUAL, PIC-39524B vai AUTO.
- Entradas auxiliares para recuperação: PIC-524A MODO = AUTO ou MV > 0; simulação de porta E, temporizador T4, botão RESET manual.
- Pausa, avanço manual de +1s, velocidade 1x/3x/6x, relógio, eventos históricos e tendências escalonadas.
- Cenários pré-carregados: normal, baixo nível flash, alta pressão flash, alta pressão E-3913, alto nível F-3932, múltiplos, pulso curto, igualdade aos limites.
- 8 exercícios técnicos CIC com alternativas embaralhadas e feedback de engenharia.
- Explicação integral de origem dos sinais, temporização, reset, prioridades, premissas e limites de validação, com imagem original preservada.

## Simular um disparo

1. Abrir a seção Intertravamento gás ácido.
2. Pausar (opcional) e ajustar um campo, como PT-518 de 2,5 para 4,5.
3. A porta OU fica com estado 1; aguardar ou acionar +1 segundo repetidas vezes.
4. Observar a ordem de alarme, abertura inicial de flare, fechamento/manual e AUTO do controlador B.
5. Normalizar todas as quatro causas.
6. Definir MODO PIC-524A = AUTO ou MV>0, aguardar T4 e clicar RESET para rearmar a lógica didática.
7. Observar nos gráficos e no log a diferença entre condição de disparo e saída retida.

## Interpretação do desenho e pontos pendentes

**Representado explicitamente**:
- LI-514 PV<10%; PT-518 PV≥4,5; PIC-524A PV≥0,85; LIC-519 PV≥95%.
- Porta OU combinacional.
- Alarme XA-39524.
- Comandos PIC-39524B abertura 5%, PIC-39524A fecha/manual, PIC-39524B AUTO.
- Circuito direito: PIC-524A MODO=AUTO OU PIC-524A MV>0; porta E; T4; reset.

**Hipóteses pedagógicas não validadas**:
- T3 como persistência inicial para disparo (pulso inferior a 3 segundos é descartado).
- Sequência didática T3 → alarme; +T3 → PIC39524B 5%; +T3+T2 → PIC39524A fecha/manual; +T0 → PIC39524B AUTO.
- Retenção das saídas após alarme até o rearme.
- Condição conservadora adicional para reset: todas as quatro entradas falsas, além da porta OU de retorno (MODO=AUTO ou MV>0), por 4s, e confirmação manual. A segunda entrada da porta E não é inequívoca no desenho.
- As pressões 4,5 e 0,85 não são atribuídas a unidades de engenharia sem confirmação.
- Comandos de controlador não significam movimento físico comprovado de válvulas.

Essas hipóteses devem ser confirmadas na configuração do SDCD Yokogawa Centum VP antes de qualquer uso operacional. **Não utilizar como procedimento de emergência ou em campo.**

## Publicação GitHub Pages

Enviar `index.html`, `style.css`, `app.js`, `interlock.css`, `interlock.js`, `sw.js`, `manifest.webmanifest`, `assets/` e `icons/` para a **raiz** do repositório. Configurar Settings → Pages → Deploy from a branch → main / (root). Todos os caminhos são relativos. A instalação PWA depende de HTTPS e suporte do navegador. O cache foi versionado como `e3913-f3931-concept-v1.1.0`, para não reter automaticamente a V1.0.

## Arquivos

- `index.html`: one-page integrada
- `interlock.css`: estilos isolados do novo módulo
- `interlock.js`: simulador discreto do intertravamento, eventos, reset, gráficos, desafios
- `assets/intertravamento-gas-acido-original.png`: referência do novo diagrama
- Demais arquivos correspondem à Concept anterior preservada, exceto os ajustes de publicação/manifesto/cache.
