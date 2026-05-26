// =============================================================================
// LÓGICA DO JOGO DA VELHA COM DFS - MÓDULO EXPORTÁVEL
// Contém apenas as funções da lógica, sem interface readline
// =============================================================================

// =============================================================================
// 1. REPRESENTAÇÃO DO TABULEIRO
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

// =============================================================================
// 2. VERIFICAR CONDIÇÕES DE VITÓRIA
// =============================================================================
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

// =============================================================================
// 3. VERIFICAR SE O JOGO TERMINOU (EMPATE)
// =============================================================================
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

// =============================================================================
// 4. OBTER MOVIMENTOS VÁLIDOS (POSIÇÕES VAZIAS)
// =============================================================================
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
// 5. BUSCA EM PROFUNDIDADE (DFS) - NÚCLEO DA IA
// =============================================================================
function buscaProfundidade(tabuleiro, profundidade, debug) {
  if (debug === undefined) debug = false;
  
  if (verificarVitoria(tabuleiro, 'O')) {
    if (debug) console.log('[DFS - Nível ' + profundidade + '] Computador venceu! Retornando true');
    return true;
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
// 6. ENCONTRAR O MELHOR MOVIMENTO DO COMPUTADOR
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
// 7. EXPORTAR FUNÇÕES PARA SEREM USADAS EM OUTROS MÓDULOS
// =============================================================================
module.exports = {
  criarTabuleiro: criarTabuleiro,
  verificarVitoria: verificarVitoria,
  verificarEmpate: verificarEmpate,
  obterMovimentosValidos: obterMovimentosValidos,
  buscaProfundidade: buscaProfundidade,
  encontrarMelhorMovimento: encontrarMelhorMovimento
};
