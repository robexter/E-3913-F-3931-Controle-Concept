# E-3913 / F-3931 — Testes de validação do simulador V1.3.8

## Ajuste solicitado

- PIC-39524A: em AUTO, pressão acima do SP solicita maior abertura da URE e pressão abaixo solicita fechamento. A mudança de setpoint provoca **rampa de referência** (0,006 kgf/cm²/s, DIDÁTICA) e **rampa de MV** (máximo 0,26 ponto percentual por segundo simulado). A válvula efetiva tem atraso didático adicional.
- PIC-39524B: em AUTO, pressão acima do SP do flare produz solicitação de abertura, **independentemente de indicação prévia de falta de capacidade da URE**. A MV varia no máximo 0,32 ponto percentual/s e a abertura efetiva é suavizada.
- A saída de cada PIC e a abertura efetiva de sua válvula são independentes na representação; compare no laboratório.
- A recuperação de pressão e as aberturas de equilíbrio dependem da hidráulica simplificada do modelo (contrapressão de URE de 0,30 kgf/cm² como hipótese didática). Não traduzir os resultados em parâmetros ou permissivos reais de operação.

## Testes automatizados em navegador

Os seguintes casos passaram em Chromium (execução local da página por injeção de conteúdo, sem publicação em GitHub):

1. SP PIC A 0,60→0,65: MV A fecha gradualmente; pressão se aproxima de 0,65; MV A estabiliza em outro patamar; flare não abre com SP B em 0,70.
2. SP PIC A 0,60→0,50: MV A abre gradualmente; pressão se aproxima de 0,50; flare fechado.
3. SP PIC B 0,70→0,50 com PIC A em AUTO a 0,60: MV B cresce por rampa; MV A diminui até 0; pressão estabiliza próximo de 0,50. São SPs conflitantes, situação apenas didática.
4. SP PIC A 0,60→0,70 e SP B 0,80: MV A encontra nova abertura, mantendo a rota flare fechada.
5. Falha simulada de fechamento físico da PV A: saída PIC A solicita progressivamente maior abertura, abertura física permanece zero; flare entra pelo próprio SP e mantém abertura positiva.
6. Responsividade de 320, 360, 390, 768, 1024 e 1440 pixels sem transbordamento horizontal.
7. Nenhum erro JavaScript durante os testes de regressão.

## Como publicar

Recomendado: manter cópia da versão anterior. Substituir os arquivos do ZIP de atualização na raiz do repositório e confirmar o commit. O `sw.js` utiliza cache `e3913-f3931-concept-v1.3.8`. Após publicar, abrir a página com rede disponível e atualizar para obter o novo JavaScript. **A publicação não foi feita por esta geração.**
