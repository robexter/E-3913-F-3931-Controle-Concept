# E-3913 / F-3931 — Controle Concept V1.2 + Intertravamento Gás Ácido

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

## Refinamento V1.2 — Solicitação operacional

- PV/SP e unidades iniciais conforme as duas capturas fornecidas (ver tabela abaixo). As imagens são de um instante; não fixar como valores de projeto.
- ZIC-39502: SP=72%, PV=71%, e banda morta de 3 pontos percentuais de posição na estratégia VPC (conforme solicitação).
- FIC-39534 e PIC-39518: MAN / AUTO / CAS. Todos os demais controles de processo do laboratório: MAN / AUTO (restrição de treinamento solicitada).
- Cada controlador: SP editável em AUTO; em CAS lê SP remoto (alterar no mestre); em MAN MV editável sem correção PI automática.
- FFIC-39522 E-3911 e FFIC-39521 E-3912 com consumo de DEA independente; mudanças podem repercutir no inventário da E-3913 por balanço aproximado com atraso.
- FFIC-39521 não possui PV/SP na captura: início em 1200/1200 m³/d é cenário DIDÁTICO editável, não número medido.
- As conversões de sinais, dinâmica, ganhos e origens de vazão de retorno não foram validadas no SDCD; não utilizar a aplicação para manobras de planta.
- Os antigos desenhos de referência preservados e seus SPs históricos (48%) não substituem a captura atual que mostra nível E-3913 em 69%.

| Instrumento | PV da captura | SP da captura | Unidade exibida/utilizada |
|---|---:|---:|---|
| LIC-39518 | 69 | 69 | % |
| FIC-39534 | 2648,9 | 2658,7 | m³/d |
| ZIC-39502 | 71 | 72 | % |
| PIC-39518 | 3,06 | 3,00 | kgf/cm² ("Kg" na tela) |
| FFIC-39533 | 273,5 | 279,6 | t/d |
| LIC-39527 | 82 | 75 | % |
| PIC-39524A | 0,60 | 0,60 | kgf/cm² ("Kg" na tela) |
| PIC-39524B | 0,60 | 0,70 | kgf/cm² ("Kg" na tela) |
| FFIC-39522 | 1297 | 1300 | m³/d |
| FFIC-39521 | — | — | m³/d; exemplos 1200/1200 didáticos |

Observação: a faixa de deadband 3% do ZIC **não** deve ser confundida com o DB=3 do circuito de pressão PIC-524A/B presente no desenho original; são funções distintas.

- Atualizados os valores de partida do módulo de intertravamento didático a partir das capturas: LI-514 F-3931=77%; PT-518=3,06; pressão E-3913=0,60; nível F-3932=30%. As condições de disparo permanecem conforme diagrama original.
- Implementação do ZIC trata 3 pontos percentuais de diferença entre PV e SP de cada lado (|erro| > 3%); confirmar no SDCD se a definição de banda morta usa semilargura ou largura total.
