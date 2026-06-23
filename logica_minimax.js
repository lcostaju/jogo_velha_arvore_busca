// =============================================================================
// LÓGICA DO JOGO DA VELHA COM MINIMAX (COM PODA ALPHA-BETA) - MÓDULO EXPORTÁVEL
// =============================================================================

var utils = require('./tabuleiro_utils');
var criarTabuleiro = utils.criarTabuleiro;
var verificarVitoria = utils.verificarVitoria;
var verificarEmpate = utils.verificarEmpate;
var obterMovimentosValidos = utils.obterMovimentosValidos;

// =============================================================================
// MINIMAX - NÚCLEO DA IA
// =============================================================================
// Diferente da DFS pura, o minimax atribui uma PONTUAÇÃO a cada estado terminal
// e alterna entre maximizar (turno do computador, 'O') e minimizar (turno do
// humano, 'X'). A pontuação usa a profundidade para preferir vitórias mais
// rápidas e derrotas mais lentas, o que faz o computador bloquear ameaças do
// humano mesmo sem uma vitória garantida à vista.
//
// alpha/beta cortam ramos que não podem mudar o resultado final: se um nó MIN
// já encontrou um valor <= alpha (o melhor que o MAX acima já garante em outro
// ramo), não há motivo para continuar testando seus demais movimentos (e
// vice-versa para um nó MAX em relação a beta). Sem essa poda, o minimax
// exploraria a árvore completa do jogo da velha a partir de um tabuleiro
// vazio (centenas de milhares de nós).
function minimax(tabuleiro, profundidade, ehMaximizando, alpha, beta, debug) {
  if (alpha === undefined) alpha = -Infinity;
  if (beta === undefined) beta = Infinity;
  if (debug === undefined) debug = false;

  if (verificarVitoria(tabuleiro, 'O')) {
    var valorVitoriaO = 10 - profundidade;
    if (debug) console.log('[Minimax - Nível ' + profundidade + '] Computador venceu! Valor: ' + valorVitoriaO);
    return valorVitoriaO;
  }

  if (verificarVitoria(tabuleiro, 'X')) {
    var valorVitoriaX = profundidade - 10;
    if (debug) console.log('[Minimax - Nível ' + profundidade + '] Humano venceu! Valor: ' + valorVitoriaX);
    return valorVitoriaX;
  }

  if (verificarEmpate(tabuleiro)) {
    if (debug) console.log('[Minimax - Nível ' + profundidade + '] Empate. Valor: 0');
    return 0;
  }

  var movimentosValidos = obterMovimentosValidos(tabuleiro);
  var jogador = ehMaximizando ? 'O' : 'X';
  var melhorValor = ehMaximizando ? -Infinity : Infinity;

  var i = 0;
  while (i < movimentosValidos.length) {
    var posicao = movimentosValidos[i];

    tabuleiro[posicao] = jogador;
    if (debug) console.log('[Minimax - Nível ' + profundidade + '] (' + (ehMaximizando ? 'MAX' : 'MIN') + ') Testando ' + jogador + ' em ' + posicao);

    var valor = minimax(tabuleiro, profundidade + 1, !ehMaximizando, alpha, beta, debug);

    tabuleiro[posicao] = '';

    if (ehMaximizando) {
      melhorValor = Math.max(melhorValor, valor);
      alpha = Math.max(alpha, melhorValor);
    } else {
      melhorValor = Math.min(melhorValor, valor);
      beta = Math.min(beta, melhorValor);
    }

    if (beta <= alpha) {
      if (debug) console.log('[Minimax - Nível ' + profundidade + '] Poda alpha-beta (alpha=' + alpha + ', beta=' + beta + ')');
      break;
    }

    i = i + 1;
  }

  return melhorValor;
}

// =============================================================================
// ENCONTRAR O MELHOR MOVIMENTO DO COMPUTADOR
// =============================================================================
function encontrarMelhorMovimento(tabuleiro, debug) {
  if (debug === undefined) debug = false;

  var movimentosValidos = obterMovimentosValidos(tabuleiro);

  if (debug) {
    console.log('\n>>> INICIANDO MINIMAX <<<');
    console.log('Movimentos válidos disponíveis: ' + movimentosValidos.toString());
  }

  var melhorMovimento = movimentosValidos[0];
  var melhorValor = -Infinity;
  var alpha = -Infinity;
  var beta = Infinity;

  var i = 0;
  while (i < movimentosValidos.length) {
    var posicao = movimentosValidos[i];

    tabuleiro[posicao] = 'O';
    var valor = minimax(tabuleiro, 1, false, alpha, beta, debug);
    tabuleiro[posicao] = '';

    if (debug) console.log('[TESTE] Posição ' + posicao + ' tem valor minimax: ' + valor);

    if (valor > melhorValor) {
      melhorValor = valor;
      melhorMovimento = posicao;
    }

    alpha = Math.max(alpha, melhorValor);

    i = i + 1;
  }

  if (debug) console.log('\n>>> MOVIMENTO ESCOLHIDO: ' + melhorMovimento + ' (valor ' + melhorValor + ') <<<\n');
  return melhorMovimento;
}

// =============================================================================
// EXPORTAR FUNÇÕES PARA SEREM USADAS EM OUTROS MÓDULOS
// =============================================================================
module.exports = {
  criarTabuleiro: criarTabuleiro,
  verificarVitoria: verificarVitoria,
  verificarEmpate: verificarEmpate,
  obterMovimentosValidos: obterMovimentosValidos,
  minimax: minimax,
  encontrarMelhorMovimento: encontrarMelhorMovimento
};
