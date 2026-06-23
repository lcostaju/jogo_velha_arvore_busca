// =============================================================================
// LÓGICA MINIMAX COM RASTREAMENTO DE ÁRVORE
// =============================================================================

const RastreadorDFS = require('./rastreador_dfs');
const utils = require('./tabuleiro_utils');
const criarTabuleiro = utils.criarTabuleiro;
const verificarVitoria = utils.verificarVitoria;
const verificarEmpate = utils.verificarEmpate;
const obterMovimentosValidos = utils.obterMovimentosValidos;

// Instância própria do rastreador (mesma classe usada pela DFS)
const rastreador = new RastreadorDFS();

// =============================================================================
// MINIMAX COM RASTREAMENTO
// =============================================================================

// Mesma poda alpha-beta de logica_minimax.js: nós que não podem mais influenciar
// o resultado final não são explorados, então também não aparecem na árvore
// rastreada (a visualização reflete exatamente o que o algoritmo visitou).
function minimaxRastreado(tabuleiro, profundidade, ehMaximizando, alpha, beta) {
  if (verificarVitoria(tabuleiro, 'O')) {
    var valorVitoriaO = 10 - profundidade;
    rastreador.registrarNo('terminal', null, profundidade, true, valorVitoriaO);
    return valorVitoriaO;
  }

  if (verificarVitoria(tabuleiro, 'X')) {
    var valorVitoriaX = profundidade - 10;
    rastreador.registrarNo('terminal', null, profundidade, false, valorVitoriaX);
    return valorVitoriaX;
  }

  if (verificarEmpate(tabuleiro)) {
    rastreador.registrarNo('terminal', null, profundidade, false, 0);
    return 0;
  }

  var movimentosValidos = obterMovimentosValidos(tabuleiro);
  var jogador = ehMaximizando ? 'O' : 'X';
  var tipoNo = ehMaximizando ? 'computador' : 'humano';
  var melhorValor = ehMaximizando ? -Infinity : Infinity;

  var i = 0;
  while (i < movimentosValidos.length) {
    var posicao = movimentosValidos[i];

    tabuleiro[posicao] = jogador;
    var valor = minimaxRastreado(tabuleiro, profundidade + 1, !ehMaximizando, alpha, beta);
    tabuleiro[posicao] = '';

    rastreador.registrarNo(tipoNo, posicao, profundidade, null, valor);

    if (ehMaximizando) {
      melhorValor = Math.max(melhorValor, valor);
      alpha = Math.max(alpha, melhorValor);
    } else {
      melhorValor = Math.min(melhorValor, valor);
      beta = Math.min(beta, melhorValor);
    }

    if (beta <= alpha) {
      break;
    }

    i = i + 1;
  }

  return melhorValor;
}

function encontrarMelhorMovimentoRastreado(tabuleiro) {
  rastreador.iniciar();

  var movimentosValidos = obterMovimentosValidos(tabuleiro);
  var melhorMovimento = movimentosValidos[0];
  var melhorValor = -Infinity;
  var alpha = -Infinity;
  var beta = Infinity;

  var i = 0;
  while (i < movimentosValidos.length) {
    var posicao = movimentosValidos[i];

    tabuleiro[posicao] = 'O';
    var valor = minimaxRastreado(tabuleiro, 1, false, alpha, beta);
    tabuleiro[posicao] = '';

    rastreador.registrarNo('computador', posicao, 0, null, valor);

    if (valor > melhorValor) {
      melhorValor = valor;
      melhorMovimento = posicao;
    }

    alpha = Math.max(alpha, melhorValor);

    i = i + 1;
  }

  rastreador.registrarEscolha([melhorMovimento]);
  return melhorMovimento;
}

function obterRastreamento() {
  return rastreador.obterArvore();
}

// =============================================================================
// EXPORTAR
// =============================================================================

module.exports = {
  criarTabuleiro: criarTabuleiro,
  verificarVitoria: verificarVitoria,
  verificarEmpate: verificarEmpate,
  obterMovimentosValidos: obterMovimentosValidos,
  minimaxRastreado: minimaxRastreado,
  encontrarMelhorMovimentoRastreado: encontrarMelhorMovimentoRastreado,
  obterRastreamento: obterRastreamento,
  rastreador: rastreador
};
