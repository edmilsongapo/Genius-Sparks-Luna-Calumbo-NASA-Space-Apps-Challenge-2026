# LUNA CALUMBO — pacote completo
1. Abre `index.html` com duplo clique: menu com a Missão 3D, o Planeador 2D e o Pitch.
2. Ranking (opcional): na pasta, `php -S localhost:8000`, abre http://localhost:8000 (PHP com pdo_sqlite).
3. 3D: teclado (W/S/A/D, ESPAÇO, F, T, X) ou botões no telemóvel. Combustível ideal 73–76 t.
Estrutura: `jogo3d.html` (Three.js r128 embutido, funciona sem internet) · `planeador/` · `php/api.php` · `data/` (base de dados do ranking) · `docs/PITCH.md`.

## Versão 0.3
- `index.html`: entrada. `mission.html`: Mission Control (acesso livre, sem níveis).
- Novos módulos: `builder.html`, `treino.html`, `clps.html` (dados de EXEMPLO), `educativo.html`.
- Funcional: navegação, Builder (cálculo), Treino (quiz), mapa clicável, 3D e Planeador já existentes.
- Demonstrativo: pontos do mapa lunar (não verificados). Pendente: GLB para a personagem 3D, contas, progresso, dados reais NASA/GGPEN.
- Não testado em navegador nem em telemóvel neste ambiente.

## Versão 0.4
- Nova entrada interativa (parallax, modo iniciante/experiente, sequência de descida) usando as 3 imagens em `assets/img/`.
- Guia Kiala (`js/guide.js`) em todas as páginas; Missão Base e Missão Rover em `missoes.html`.
- As imagens são ilustrativas (não são fotografias reais): estão assinaladas no ecrã.
- Por fazer: o fundo realista dentro do `jogo3d.html`, personagem GLB, contas/progresso, dados reais NASA/GGPEN.
- Não testado em navegador nem em telemóvel neste ambiente.

## Versão 0.5
- Removidas as imagens de baixa qualidade. Agora tudo é 3D procedural (Three.js local em `js/three.min.js`, `js/world.js`).
- `index.html`: cena 3D viva com a Kiala a andar. `explorar.html`: controlas a Kiala (WASD/joystick, saltar com gravidade lunar, acenar, amostras, ignição da nave).
- Não testado em navegador neste ambiente.

## Versão 0.6
- Hangar (montar a nave: andares, motores, nariz, cores; o empuxo muda a subida), Kiala com capa e patch da bandeira de Angola, novas ações: dançar (G), plantar bandeira (B), sentar (X).
- Não testado em navegador neste ambiente.

## Versão 0.7
- Foco no desafio NASA Space Apps 2026 'Build a Junior Astronaut Mission Trainer': `outpost.html` + `js/outpost.js` (3 níveis, simulação de energia/O2/comida/radiação, tempestade solar, sinais vitais simulados, relatório educativo).
- Terreno lunar com textura e rochas. Modelo educativo simplificado, valores ajustados para o jogo. A Kiala do Treinador usa regras, não IA generativa.
- Não testado em navegador neste ambiente.

## Versão 0.8
- Novo `jornada.html`: simulação Terra → Lua. Conversa com o Director do GGPEN, capacete, montagem da nave por andares, abastecimento (73–76 t), contagem decrescente, lançamento com separação de estágios e carenagem, órbita, injecção translunar, órbita lunar, largada do ANGOSAT-2 (painéis e antena a apontar para a Terra), alunagem, bandeira de Angola e dança (G).
- Nome do director: edita `DIRECTOR_NOME` no topo do script de `jornada.html`.
- Música: “Comboio II”, dos Os Lambas, é reproduzida pelo YouTube na dança Kuduro; o samba continua sintetizado no navegador. O Hino Nacional toca `assets/audio/hino.mp3`, que tens de colocar tu (ver `assets/audio/LEIAME.txt`).
- Valores de Δv, tempos e telemetria são simplificados e marcados como simulados. O ANGOSAT-2 real é geoestacionário; na simulação é largado na Lua só para ilustrar.
- Testado em Chromium sem ecrã (sem erros de consola). Não testado em telemóvel.

## Versão 0.8
- Novo `jornada.html`: simulador Terra → Lua (diálogo com o director do GGPEN, capacete, montagem, combustível 73–76 t, lançamento, estágios, ANGOSAT-2, alunagem, bandeira, dança Kuduro com Os Lambas — “Comboio II”/Samba/Hino).
- Nome do director: editar `DIRECTOR_NOME` no topo do script de `jornada.html`.
- Hino: colocar o ficheiro em `assets/audio/hino.mp3`. “Comboio II”, dos Os Lambas, toca pelo YouTube; o samba continua sintetizado no navegador.
- Testado em Chromium sem ecrã (percurso completo sem erros). Não testado em telemóvel.

## Versão 0.8.1
- Nova música na dança Kuduro do `jornada.html`: Kelly Stress — “Felicidade (Sebém)”, ficheiro `assets/audio/kuduro.mp3` (toca em ciclo, a dança sincroniza com o ritmo, ~135 BPM). Funciona sem internet.

## Versão 0.9
- **Robô explorador** (`jornada.html`): ao chegar à órbita lunar a nave larga um pequeno robô. Ele desce, visita três zonas candidatas (A planalto rochoso, B borda de cratera, C planície lisa) e analisa em cada uma: inclinação, rochas, firmeza do solo, poeira, altura do Sol, temperatura, radiação e ligação à Terra.
- Cada resultado chega à nave como notificação (painel "Robô → Nave", aviso com som e sinal a subir da antena do robô). No fim há um resumo, o robô coloca um farol na zona segura (C) e a nave aluna ao lado dele.
- Os valores das zonas estão em `ZN` e os limites em `SENS` (perto do topo do script, secção "Robô explorador"). São dados simulados, para ensino.
- **Velocidade da demonstração**: Pausa, ×0,5, ×1 e ×2 (tecla P pausa/retoma). A pausa também pára a música do Kuduro e o samba.
- Corrigida a sombra em riscas no chão depois da alunagem (anel de poeira).
- Testado em Chromium sem ecrã (percurso completo, pausa e ×0,5 sem erros de consola). Não testado em telemóvel.
