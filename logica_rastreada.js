// =============================================================================
// LÓGICA DFS COM RASTREAMENTO DE ÁRVORE
// =============================================================================

const RastreadorDFS = require('./rastreador_dfs');

// Instância global do rastreador
const rastreador = new RastreadorDFS();

// =============================================================================
// FUNÇÕES BÁSICAS (copiadas de logica_jogo.js)
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
    if (tabuleiro[combo[0]] === jogador && tabuleiro[combo[1]] === jogador && tabuleiro[combo[2]] === jogador) {
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

// =============================================================================
// DFS COM RASTREAMENTO
// =============================================================================

function buscaProfundidadeRastreada(tabuleiro, profundidade) {
  if (verificarVitoria(tabuleiro, 'O')) {
    rastreador.registrarNo('terminal', null, profundidade, true);
    return true;
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
