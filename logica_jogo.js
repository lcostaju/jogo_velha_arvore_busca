// =============================================================================
// LÓGICA DO JOGO DA VELHA COM DFS - MÓDULO EXPORTÁVEL
// Contém apenas as funções da lógica, sem interface readline
// =============================================================================

var utils = require('./tabuleiro_utils');
var criarTabuleiro = utils.criarTabuleiro;
var verificarVitoria = utils.verificarVitoria;
var verificarEmpate = utils.verificarEmpate;
var obterMovimentosValidos = utils.obterMovimentosValidos;

// =============================================================================
// BUSCA EM PROFUNDIDADE (DFS) - NÚCLEO DA IA
// =============================================================================
function buscaProfundidade(tabuleiro, profundidade, debug) {
  if (debug === undefined) debug = false;

  if (verificarVitoria(tabuleiro, 'O')) {
    if (debug) console.log('[DFS - Nível ' + profundidade + '] Computador venceu! Retornando true');
    return true;
  }

  if (verificarVitoria(tabuleiro, 'X')) {
    if (debug) console.log('[DFS - Nível ' + profundidade + '] Humano venceu! Retornando false');
    return false;
  }

  if (verificarEmpate(tabuleiro)) {
    if (debug) console.log('[DFS - Nível ' + profundidade + '] Empate detectado. Retornando false');
    return false;
  }

  var movimentosValidos = obterMovimentosValidos(tabuleiro);
  var i = 0;

  while (i < movimentosValidos.length) {
    var posicao = movimentosValidos[i];

    if (debug) console.log('[DFS - Nível ' + profundidade + '] Testando movimento na posição ' + posicao);

    tabuleiro[posicao] = 'O';
    if (debug) console.log('[DFS - Nível ' + profundidade + '] Colocado O na posição ' + posicao);

    var humanoPodeVencer = false;
    var movimentosHumano = obterMovimentosValidos(tabuleiro);
    var j = 0;

    while (j < movimentosHumano.length) {
      var posicaoHumano = movimentosHumano[j];

      tabuleiro[posicaoHumano] = 'X';
      if (debug) console.log('[DFS - Nível ' + profundidade + '] ├─ Simulando resposta humana em ' + posicaoHumano);

      var resultadoRecursivo = buscaProfundidade(tabuleiro, profundidade + 1, debug);

      tabuleiro[posicaoHumano] = '';
      if (debug) console.log('[DFS - Nível ' + profundidade + '] ├─ Desfeito movimento em ' + posicaoHumano);

      if (resultadoRecursivo === true) {
        if (debug) console.log('[DFS - Nível ' + profundidade + '] ├─ Encontrou vitória após resposta em ' + posicaoHumano);
        humanoPodeVencer = true;
        break;
      }

      j = j + 1;
    }

    if (humanoPodeVencer === false) {
      if (debug) console.log('[DFS - Nível ' + profundidade + '] Movimento vencedor encontrado em ' + posicao + '!');
      tabuleiro[posicao] = '';
      return true;
    }

    tabuleiro[posicao] = '';
    if (debug) console.log('[DFS - Nível ' + profundidade + '] Movimento em ' + posicao + ' não leva à vitória. Desfazendo.');

    i = i + 1;
  }

  if (debug) console.log('[DFS - Nível ' + profundidade + '] Nenhum movimento leva à vitória. Retornando false');
  return false;
}

// =============================================================================
// ENCONTRAR O MELHOR MOVIMENTO DO COMPUTADOR
// =============================================================================
function encontrarMelhorMovimento(tabuleiro, debug) {
  if (debug === undefined) debug = false;

  var movimentosValidos = obterMovimentosValidos(tabuleiro);

  if (debug) {
    console.log('\n>>> INICIANDO BUSCA EM PROFUNDIDADE <<<');
    console.log('Movimentos válidos disponíveis: ' + movimentosValidos.toString());
  }

  var i = 0;
  while (i < movimentosValidos.length) {
    var posicao = movimentosValidos[i];

    if (debug) console.log('\n[TESTE] Verificando se posição ' + posicao + ' leva à vitória...');

    tabuleiro[posicao] = 'O';
    var levaVitoria = buscaProfundidade(tabuleiro, 0, debug);
    tabuleiro[posicao] = '';

    if (levaVitoria === true) {
      if (debug) console.log('\n>>> MOVIMENTO VENCEDOR ENCONTRADO: ' + posicao + ' <<<\n');
      return posicao;
    }

    i = i + 1;
  }

  if (debug) console.log('\n>>> NENHUMA VITÓRIA ENCONTRADA. ESCOLHENDO PRIMEIRO MOVIMENTO: ' + movimentosValidos[0] + ' <<<\n');
  return movimentosValidos[0];
}

// =============================================================================
// EXPORTAR FUNÇÕES PARA SEREM USADAS EM OUTROS MÓDULOS
// =============================================================================
module.exports = {
  criarTabuleiro: criarTabuleiro,
  verificarVitoria: verificarVitoria,
  verificarEmpate: verificarEmpate,
  obterMovimentosValidos: obterMovimentosValidos,
  buscaProfundidade: buscaProfundidade,
  encontrarMelhorMovimento: encontrarMelhorMovimento
};
