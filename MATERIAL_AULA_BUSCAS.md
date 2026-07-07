# Material de aula: DFS, Minimax e visualizador de arvore de busca

Este material explica, de forma didatica, como os metodos de Busca em Profundidade (DFS) e Minimax aparecem neste projeto de Jogo da Velha, e como interpretar a arvore de busca e as estatisticas exibidas na tela.

## 1. Ideia geral: jogo como arvore de estados

Em Inteligencia Computacional, um jogo pode ser representado como uma arvore de estados.

No Jogo da Velha:

- cada estado e uma configuracao do tabuleiro;
- cada aresta representa uma jogada possivel;
- cada no da arvore representa uma possibilidade analisada pelo algoritmo;
- a raiz e o estado atual do jogo, antes da IA decidir;
- os niveis seguintes alternam entre jogadas do computador e jogadas do humano;
- um no terminal e um estado em que o jogo acabou: vitoria, derrota ou empate.

Exemplo conceitual:

```text
Estado atual
|-- Computador joga na posicao 0
|   |-- Humano responde na posicao 1
|   |-- Humano responde na posicao 2
|   `-- ...
|-- Computador joga na posicao 1
|   |-- Humano responde na posicao 0
|   |-- Humano responde na posicao 2
|   `-- ...
`-- ...
```

O visualizador do projeto mostra justamente essa exploracao: quais possibilidades a IA visitou antes de escolher uma jogada.

## 2. Busca em Profundidade (DFS)

DFS significa Depth-First Search, ou Busca em Profundidade.

A ideia central da DFS e simples: em vez de olhar todas as jogadas de um nivel antes de avancar, ela escolhe uma possibilidade e vai descendo por ela ate chegar ao fim ou ate perceber que aquele caminho nao serve. Depois, volta e testa outro caminho. Esse retorno e chamado de backtracking.

Em termos de jogo:

1. A IA testa uma jogada possivel para o computador.
2. Simula respostas possiveis do humano.
3. Continua descendo na arvore, alternando jogadas.
4. Quando encontra uma vitoria, derrota ou empate, retorna essa informacao.
5. Se o caminho nao for bom, desfaz as jogadas simuladas e tenta outro caminho.

Neste projeto, o computador usa `O` e o humano usa `X`.

### Como a DFS e usada neste projeto

No codigo deste projeto, a DFS procura uma jogada que leve a uma vitoria do computador. Ela retorna uma resposta booleana:

- `true`: foi encontrado um caminho que leva a vitoria do computador;
- `false`: aquele caminho nao leva a uma vitoria do computador.

Ela nao atribui pontuacao numerica aos estados. Tambem nao faz uma analise estrategica completa como o Minimax. Por isso, didaticamente, ela e boa para mostrar a mecanica de exploracao em profundidade, mas nao representa tao bem a ideia de adversario otimo.

Uma forma curta de explicar em aula:

> A DFS pergunta: "Existe algum caminho, explorando profundamente as possibilidades, em que o computador consegue vencer?"

### Pontos importantes sobre DFS

- Explora caminhos profundamente antes de testar todos os irmaos.
- Usa backtracking para desfazer jogadas simuladas.
- Pode encontrar uma solucao sem avaliar todas as possibilidades.
- No projeto, busca uma vitoria possivel para o computador.
- Nao calcula uma nota para cada jogada.
- Nao modela de forma completa que o humano sempre escolhera a melhor resposta.

## 3. Minimax

Minimax e um algoritmo classico para jogos de dois jogadores, especialmente jogos de soma zero, em que o ganho de um jogador corresponde a perda do outro.

A ideia central e:

- o computador tenta maximizar o resultado;
- o humano e tratado como alguem que tenta minimizar o resultado do computador;
- a IA escolhe a jogada que continua sendo boa mesmo considerando a melhor resposta do adversario.

Por isso o nome Minimax:

- MAX: turno do computador, que quer o maior valor possivel;
- MIN: turno do humano, que quer reduzir o valor do computador.

Uma forma curta de explicar em aula:

> O Minimax pergunta: "Se eu jogar aqui e meu adversario responder da melhor forma possivel, qual sera o melhor resultado que ainda consigo garantir?"

### Pontuacao usada no projeto

O Minimax deste projeto avalia estados terminais da seguinte forma:

- vitoria do computador (`O`): `10 - profundidade`;
- vitoria do humano (`X`): `profundidade - 10`;
- empate: `0`.

Essa pontuacao tem duas consequencias didaticas importantes:

- vitorias mais rapidas do computador recebem valores maiores;
- derrotas mais demoradas recebem valores menos ruins do que derrotas imediatas.

Exemplos:

```text
Computador vence na profundidade 2:
valor = 10 - 2 = 8

Computador vence na profundidade 5:
valor = 10 - 5 = 5

Humano vence na profundidade 3:
valor = 3 - 10 = -7

Empate:
valor = 0
```

Assim, o computador prefere vencer rapido, empatar quando nao pode vencer, e adiar uma derrota quando nao ha alternativa melhor.

### Minimax com poda alfa-beta

O Minimax deste projeto usa poda alfa-beta.

A poda alfa-beta evita explorar ramos que nao podem mais alterar a decisao final. Em outras palavras: se o algoritmo ja sabe que uma alternativa e pior do que outra ja encontrada, ele nao precisa terminar de explorar aquela parte da arvore.

Isso e importante para interpretar a tela:

- a arvore exibida mostra os nos realmente visitados pelo algoritmo;
- alguns ramos possiveis do jogo podem nao aparecer, porque foram podados;
- menos nos explorados nao significa menos inteligencia, pode significar busca mais eficiente.

## 4. Comparacao didatica entre DFS e Minimax

| Aspecto | DFS | Minimax |
|---|---|---|
| Pergunta principal | Existe um caminho que leva a vitoria? | Qual jogada e melhor contra um adversario otimo? |
| Tipo de retorno | Verdadeiro ou falso | Valor numerico |
| Avalia empate | Como caminho nao vencedor | Como valor `0` |
| Considera adversario otimo | Nao completamente | Sim |
| Bloqueia ameacas do humano | Nao necessariamente | Sim, quando isso melhora o resultado |
| Melhor uso didatico | Mostrar exploracao e backtracking | Mostrar tomada de decisao estrategica |
| Estatistica extra | Nao tem valor Minimax | Mostra valor da jogada escolhida |

## 5. Como ler o visualizador da arvore

Na tela principal, o usuario pode ativar o rastreamento da arvore. Quando o rastreamento esta ativo, cada jogada da IA gera uma arvore de busca correspondente a decisao tomada naquele momento.

A arvore e renderizada por profundidade:

- nos mais a esquerda representam niveis mais proximos da decisao inicial;
- nos indentados representam niveis mais profundos da simulacao;
- cada nivel indica que o algoritmo avancou mais um passo na sequencia de jogadas possiveis.

### Tipos de nos exibidos

O visualizador usa cores e textos para diferenciar os nos:

| Tipo visual | Significado |
|---|---|
| Movimento do Computador | Uma jogada simulada para o computador (`O`) |
| Movimento do Humano | Uma resposta simulada para o humano (`X`) |
| Caminho Escolhido | A posicao escolhida pela IA ao final da busca |
| Vitoria Encontrada | Um ponto em que a DFS encontrou uma possibilidade de vitoria |
| Terminal | Estado final: vitoria ou empate |

O texto de cada no pode incluir:

- quem jogou: computador ou humano;
- a posicao testada no tabuleiro;
- o valor calculado, quando o algoritmo e Minimax;
- marcacao de caminho escolhido.

### Posicoes do tabuleiro

As posicoes sao numeradas de `0` a `8`, seguindo a ordem comum de leitura:

```text
0 | 1 | 2
---------
3 | 4 | 5
---------
6 | 7 | 8
```

Quando o visualizador mostra `Posicao: 4`, por exemplo, significa que o algoritmo esta simulando ou escolhendo a casa central.

## 6. Visualizacao quando o metodo e DFS

Quando o algoritmo selecionado e DFS, a arvore mostra a tentativa de encontrar uma sequencia que leve a vitoria do computador.

O que observar em aula:

- a DFS desce por uma sequencia de possibilidades;
- quando um caminho nao funciona, ela volta e tenta outra jogada;
- a tela pode mostrar nos de computador, nos de humano e nos terminais;
- quando uma vitoria e encontrada, aparece um no de "Vitoria Encontrada";
- o "Movimento Escolhido" e a primeira posicao registrada como solucao encontrada.

Na DFS, o campo `Valor (Minimax)` nao aparece, porque a DFS deste projeto nao pontua numericamente os estados. Ela trabalha com a ideia de encontrou ou nao encontrou uma vitoria.

Interpretacao didatica:

> A DFS esta explorando caminhos. Ela nao esta dizendo "esta jogada vale 8" ou "esta jogada vale 0". Ela esta procurando uma rota que satisfaca a condicao desejada: vitoria do computador.

## 7. Visualizacao quando o metodo e Minimax

Quando o algoritmo selecionado e Minimax, a arvore mostra uma avaliacao estrategica das jogadas.

O que observar em aula:

- os nos do computador representam decisoes MAX;
- os nos do humano representam decisoes MIN;
- os nos terminais recebem valores;
- os valores sobem pela arvore ate chegar as jogadas iniciais;
- o computador escolhe a jogada inicial com maior valor;
- se houver uma ameaca do humano, o Minimax tende a bloquea-la porque considera a melhor resposta adversaria.

Na visualizacao, alguns nos exibem `valor: ...`. Esse valor representa a avaliacao Minimax daquele estado ou movimento.

Exemplos de interpretacao:

- valor positivo: cenario favoravel ao computador;
- valor negativo: cenario favoravel ao humano;
- valor zero: tendencia a empate, assumindo boas jogadas dos dois lados;
- valor maior: jogada mais desejavel para o computador.

O campo `Valor (Minimax)` no painel de estatisticas mostra a pontuacao associada ao movimento escolhido pelo computador.

## 8. Estatisticas exibidas na tela

O painel de estatisticas resume a busca realizada na ultima decisao da IA.

| Estatistica | O que significa |
|---|---|
| Nos Explorados | Quantidade de nos registrados na arvore durante a busca |
| Profundidade | Maior profundidade alcancada na exploracao |
| Movimento Escolhido | Posicao do tabuleiro escolhida pelo computador |
| Algoritmo | Metodo ativo: DFS ou Minimax |
| Valor (Minimax) | Pontuacao da jogada escolhida, quando Minimax esta ativo |
| Status | Indica se o rastreamento da arvore esta ativo ou inativo |

### Nos Explorados

Representa quantas possibilidades foram visitadas pelo algoritmo.

Em geral:

- mais casas vazias tendem a gerar mais possibilidades;
- tabuleiros proximos do fim tendem a gerar menos possibilidades;
- com poda alfa-beta, o Minimax pode deixar de visitar ramos que nao mudariam a decisao.

Essa estatistica ajuda a discutir custo computacional.

### Profundidade

Mostra ate que nivel a busca precisou ir.

No Jogo da Velha, a profundidade esta relacionada a quantidade de jogadas simuladas a frente. Quanto maior a profundidade, mais distante no futuro o algoritmo analisou.

Essa estatistica ajuda a discutir previsao de consequencias.

### Movimento Escolhido

Mostra a posicao final escolhida pela IA.

Essa posicao e uma casa de `0` a `8`, conforme o mapa do tabuleiro.

### Valor (Minimax)

Aparece apenas quando o Minimax esta ativo e ha um valor registrado para a jogada escolhida.

Interpretacao:

- valor positivo: a IA encontrou uma linha favoravel ao computador;
- valor `0`: a melhor linha tende ao empate;
- valor negativo: mesmo com a melhor jogada, o cenario favorece o humano.

## 9. Sugestao de roteiro para aula

1. Apresente o jogo como uma arvore de possibilidades.
2. Mostre que cada jogada cria novos estados.
3. Explique DFS como exploracao profunda com backtracking.
4. Rode uma jogada com DFS e peca aos alunos para observarem profundidade e nos explorados.
5. Explique Minimax como decisao contra um adversario otimo.
6. Mostre a pontuacao dos estados terminais.
7. Rode uma jogada com Minimax e compare o campo `Valor (Minimax)`.
8. Compare os dois metodos usando a mesma configuracao de tabuleiro.
9. Discuta por que o Minimax tende a jogar de forma mais estrategica.
10. Finalize relacionando estatisticas da tela com custo computacional e qualidade da decisao.

## 10. Perguntas para estimular a turma

- O que acontece com a quantidade de nos explorados quando o tabuleiro esta quase vazio?
- Por que uma vitoria mais rapida recebe valor maior no Minimax?
- Por que o empate vale `0`?
- O que significa um valor negativo para o computador?
- Por que o Minimax bloqueia uma ameaca do humano?
- A arvore exibida pelo Minimax mostra todas as possibilidades ou apenas as visitadas?
- Qual estatistica ajuda a perceber o custo da busca?
- Qual metodo e melhor para explicar exploracao? Qual e melhor para explicar decisao estrategica?

## 11. Resumo final

A DFS e o Minimax exploram arvores de possibilidades, mas respondem perguntas diferentes.

A DFS e util para mostrar como um algoritmo percorre caminhos em profundidade, desfaz escolhas e tenta alternativas. Neste projeto, ela procura uma sequencia que leve a vitoria do computador.

O Minimax e mais adequado para jogos adversariais, porque considera que o oponente tambem joga bem. Ele atribui valores aos finais possiveis e escolhe a jogada que maximiza o resultado do computador, assumindo que o humano tentara minimiza-lo.

O visualizador da arvore transforma essas ideias abstratas em algo observavel: nos, profundidade, caminho escolhido, pontuacao e custo da busca.
