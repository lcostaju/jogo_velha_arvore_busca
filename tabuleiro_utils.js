// =============================================================================
// FUNÇÕES PURAS DE TABULEIRO - COMPARTILHADAS ENTRE DFS E MINIMAX
// =============================================================================

function criarTabuleiro() {
  var tabuleiro = [];
  var i = 0;
  while (i < 9) {
    tabuleiro[i] = '';
    i = i + 1;
  }
  return tabuleiro;
}

function verificarVitoria(tabuleiro, jogador) {
  var combinacoes = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]
  ];

  var i = 0;
  while (i < combinacoes.length) {
    var combo = combinacoes[i];
    var pos1 = combo[0];
    var pos2 = combo[1];
    var pos3 = combo[2];

    if (tabuleiro[pos1] === jogador && tabuleiro[pos2] === jogador && tabuleiro[pos3] === jogador) {
      return true;
    }

    i = i + 1;
  }

  return false;
}

function verificarEmpate(tabuleiro) {
  var i = 0;
  while (i < 9) {
    if (tabuleiro[i] === '') {
      return false;
    }
    i = i + 1;
  }
  return true;
}

function obterMovimentosValidos(tabuleiro) {
  var movimentos = [];
  var i = 0;
  while (i < 9) {
    if (tabuleiro[i] === '') {
      movimentos.push(i);
    }
    i = i + 1;
  }
  return movimentos;
}

module.exports = {
  criarTabuleiro: criarTabuleiro,
  verificarVitoria: verificarVitoria,
  verificarEmpate: verificarEmpate,
  obterMovimentosValidos: obterMovimentosValidos
};
