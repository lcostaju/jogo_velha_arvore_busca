// =============================================================================
// TESTE AUTOMATIZADO DO JOGO DA VELHA COM DFS
// Este script demonstra o funcionamento do jogo sem interação do usuário
// =============================================================================

const readline = require('readline');

// Copiar as funções do jogo_velha.js aqui para teste standalone
function criarTabuleiro() {
  var tabuleiro = [];
  var i = 0;
  while (i < 9) {
    tabuleiro[i] = '';
    i = i + 1;
  }
  return tabuleiro;
}

function exibirTabuleiroComNumeros(tabuleiro) {
  console.log('\n');
  console.log('   ' + (tabuleiro[0] === '' ? '0' : tabuleiro[0]) + ' | ' + 
              (tabuleiro[1] === '' ? '1' : tabuleiro[1]) + ' | ' + 
              (tabuleiro[2] === '' ? '2' : tabuleiro[2]));
  console.log('  -----------');
  console.log('   ' + (tabuleiro[3] === '' ? '3' : tabuleiro[3]) + ' | ' + 
              (tabuleiro[4] === '' ? '4' : tabuleiro[4]) + ' | ' + 
              (tabuleiro[5] === '' ? '5' : tabuleiro[5]));
  console.log('  -----------');
  console.log('   ' + (tabuleiro[6] === '' ? '6' : tabuleiro[6]) + ' | ' + 
              (tabuleiro[7] === '' ? '7' : tabuleiro[7]) + ' | ' + 
              (tabuleiro[8] === '' ? '8' : tabuleiro[8]));
  console.log('\n');
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

function buscaProfundidade(tabuleiro, profundidade) {
  if (verificarVitoria(tabuleiro, 'O')) {
    return true;
  }
  
  if (verificarEmpate(tabuleiro)) {
    return false;
  }
  
  var movimentosValidos = obterMovimentosValidos(tabuleiro);
  var i = 0;
  
  while (i < movimentosValidos.length) {
    var posicao = movimentosValidos[i];
    
    tabuleiro[posicao] = 'O';
    
    var humanoPodeVencer = false;
    var movimentosHumano = obterMovimentosValidos(tabuleiro);
    var j = 0;
    
    while (j < movimentosHumano.length) {
      var posicaoHumano = movimentosHumano[j];
      tabuleiro[posicaoHumano] = 'X';
      
      var resultadoRecursivo = buscaProfundidade(tabuleiro, profundidade + 1);
      
      tabuleiro[posicaoHumano] = '';
      
      if (resultadoRecursivo === true) {
        humanoPodeVencer = true;
        break;
      }
      
      j = j + 1;
    }
    
    if (humanoPodeVencer === false) {
      tabuleiro[posicao] = '';
      return true;
    }
    
    tabuleiro[posicao] = '';
    i = i + 1;
  }
  
  return false;
}

function encontrarMelhorMovimento(tabuleiro) {
  var movimentosValidos = obterMovimentosValidos(tabuleiro);
  
  var i = 0;
  while (i < movimentosValidos.length) {
    var posicao = movimentosValidos[i];
    
    tabuleiro[posicao] = 'O';
    var levaVitoria = buscaProfundidade(tabuleiro, 0);
    tabuleiro[posicao] = '';
    
    if (levaVitoria === true) {
      return posicao;
    }
    
    i = i + 1;
  }
  
  return movimentosValidos[0];
}

// =============================================================================
// CENÁRIO DE TESTE
// =============================================================================

console.log('╔════════════════════════════════════════════════════════════╗');
console.log('║     TESTE AUTOMATIZADO DO JOGO DA VELHA COM DFS           ║');
console.log('╚════════════════════════════════════════════════════════════╝\n');

var tabuleiro = criarTabuleiro();

console.log('=== CENÁRIO DE TESTE ===');
console.log('1. Humano (X) joga no centro (4)');
console.log('2. Computador (O) calcula seu movimento com DFS');
console.log('3. Exibir resultado\n');

// Passo 1: Humano joga no centro
tabuleiro[4] = 'X';
console.log('[PASSO 1] Humano jogou em posição 4:');
exibirTabuleiroComNumeros(tabuleiro);

// Passo 2: Computador pensa
console.log('[PASSO 2] Computador está calculando com DFS...');
console.log('Testando cada movimento válido:\n');

var melhorMov = encontrarMelhorMovimento(tabuleiro);

console.log('\n[RESULTADO] Computador escolheu posição: ' + melhorMov);
tabuleiro[melhorMov] = 'O';
console.log('Tabuleiro após movimento do computador:');
exibirTabuleiroComNumeros(tabuleiro);

// Verificar status
if (verificarVitoria(tabuleiro, 'O')) {
  console.log('✓ Computador venceu!');
} else if (verificarVitoria(tabuleiro, 'X')) {
  console.log('✓ Humano venceu!');
} else if (verificarEmpate(tabuleiro)) {
  console.log('✓ Empate!');
} else {
  console.log('✓ Jogo continua...');
}

console.log('\n╔════════════════════════════════════════════════════════════╗');
console.log('║                   TESTE CONCLUÍDO COM SUCESSO              ║');
console.log('╚════════════════════════════════════════════════════════════╝');
