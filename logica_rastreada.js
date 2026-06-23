// =============================================================================
// LÓGICA DFS COM RASTREAMENTO DE ÁRVORE
// =============================================================================

const RastreadorDFS = require('./rastreador_dfs');
const utils = require('./tabuleiro_utils');
const criarTabuleiro = utils.criarTabuleiro;
const verificarVitoria = utils.verificarVitoria;
const verificarEmpate = utils.verificarEmpate;
const obterMovimentosValidos = utils.obterMovimentosValidos;

// Instância global do rastreador
const rastreador = new RastreadorDFS();

// =============================================================================
// DFS COM RASTREAMENTO
// =============================================================================

function buscaProfundidadeRastreada(tabuleiro, profundidade) {
  if (verificarVitoria(tabuleiro, 'O')) {
    rastreador.registrarNo('terminal', null, profundidade, true);
    return true;
  }

  if (verificarVitoria(tabuleiro, 'X')) {
    rastreador.registrarNo('terminal', null, profundidade, false);
    return false;
  }

  if (verificarEmpate(tabuleiro)) {
    rastreador.registrarNo('terminal', null, profundidade, false);
    return false;
  }

  var movimentosValidos = obterMovimentosValidos(tabuleiro);
  var i = 0;

  while (i < movimentosValidos.length) {
    var posicao = movimentosValidos[i];

    rastreador.registrarNo('computador', posicao, profundidade, null);

    tabuleiro[posicao] = 'O';

    var humanoPodeVencer = false;
    var movimentosHumano = obterMovimentosValidos(tabuleiro);
    var j = 0;

    while (j < movimentosHumano.length) {
      var posicaoHumano = movimentosHumano[j];

      rastreador.registrarNo('humano', posicaoHumano, profundidade + 1, null);

      tabuleiro[posicaoHumano] = 'X';

      var resultadoRecursivo = buscaProfundidadeRastreada(tabuleiro, profundidade + 2);

      tabuleiro[posicaoHumano] = '';

      if (resultadoRecursivo === true) {
        humanoPodeVencer = true;
        break;
      }

      j = j + 1;
    }

    if (humanoPodeVencer === false) {
      tabuleiro[posicao] = '';
      rastreador.registrarNo('vitoria', posicao, profundidade, true);
      return true;
    }

    tabuleiro[posicao] = '';
    i = i + 1;
  }

  rastreador.registrarNo('falha', null, profundidade, false);
  return false;
}

function encontrarMelhorMovimentoRastreado(tabuleiro) {
  rastreador.iniciar();

  var movimentosValidos = obterMovimentosValidos(tabuleiro);
  var caminhoMov = [];

  var i = 0;
  while (i < movimentosValidos.length) {
    var posicao = movimentosValidos[i];

    tabuleiro[posicao] = 'O';
    var levaVitoria = buscaProfundidadeRastreada(tabuleiro, 0);
    tabuleiro[posicao] = '';

    if (levaVitoria === true) {
      caminhoMov.push(posicao);
      rastreador.registrarEscolha(caminhoMov);
      return posicao;
    }

    i = i + 1;
  }

  rastreador.registrarEscolha([movimentosValidos[0]]);
  return movimentosValidos[0];
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
  buscaProfundidadeRastreada: buscaProfundidadeRastreada,
  encontrarMelhorMovimentoRastreado: encontrarMelhorMovimentoRastreado,
  obterRastreamento: obterRastreamento,
  rastreador: rastreador
};
