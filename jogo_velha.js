// =============================================================================
// JOGO DA VELHA COM BUSCA EM PROFUNDIDADE (DFS)
// Estudante: Inteligência Computacional
// Algoritmo: Busca em Profundidade (DFS) pura
// =============================================================================

const readline = require('readline');

// =============================================================================
// 1. REPRESENTAÇÃO DO TABULEIRO
// =============================================================================
// O tabuleiro é representado como um array de 9 posições (índices 0 a 8)
// Valor '' = posição vazia
// Valor 'X' = jogada do humano
// Valor 'O' = jogada do computador
//
// Layout visual das posições:
//    0 | 1 | 2
//   -----------
//    3 | 4 | 5
//   -----------
//    6 | 7 | 8

// Inicializar um tabuleiro vazio
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
// 2. EXIBIR O TABULEIRO NA TELA
// =============================================================================
function exibirTabuleiro(tabuleiro) {
  console.log('\n');
  
  // Linha 1
  console.log('   ' + exibirPosicao(tabuleiro[0]) + ' | ' + exibirPosicao(tabuleiro[1]) + ' | ' + exibirPosicao(tabuleiro[2]));
  console.log('  -----------');
  
  // Linha 2
  console.log('   ' + exibirPosicao(tabuleiro[3]) + ' | ' + exibirPosicao(tabuleiro[4]) + ' | ' + exibirPosicao(tabuleiro[5]));
  console.log('  -----------');
  
  // Linha 3
  console.log('   ' + exibirPosicao(tabuleiro[6]) + ' | ' + exibirPosicao(tabuleiro[7]) + ' | ' + exibirPosicao(tabuleiro[8]));
  console.log('\n');
}

// Função auxiliar para exibir uma posição (número se vazio, ou X/O se preenchido)
function exibirPosicao(valor) {
  if (valor === '') {
    // Calcular qual número essa posição deveria ter é feito no contexto principal
    return '?';  // Será sobrescrito no contexto
  } else {
    return valor;
  }
}

// Exibir tabuleiro com números das posições disponíveis
function exibirTabuleiroComNumeros(tabuleiro) {
  console.log('\n');
  
  // Linha 1
  console.log('   ' + (tabuleiro[0] === '' ? '0' : tabuleiro[0]) + ' | ' + 
              (tabuleiro[1] === '' ? '1' : tabuleiro[1]) + ' | ' + 
              (tabuleiro[2] === '' ? '2' : tabuleiro[2]));
  console.log('  -----------');
  
  // Linha 2
  console.log('   ' + (tabuleiro[3] === '' ? '3' : tabuleiro[3]) + ' | ' + 
              (tabuleiro[4] === '' ? '4' : tabuleiro[4]) + ' | ' + 
              (tabuleiro[5] === '' ? '5' : tabuleiro[5]));
  console.log('  -----------');
  
  // Linha 3
  console.log('   ' + (tabuleiro[6] === '' ? '6' : tabuleiro[6]) + ' | ' + 
              (tabuleiro[7] === '' ? '7' : tabuleiro[7]) + ' | ' + 
              (tabuleiro[8] === '' ? '8' : tabuleiro[8]));
  console.log('\n');
}

// =============================================================================
// 3. VERIFICAR CONDIÇÕES DE VITÓRIA
// =============================================================================
// Verifica se um jogador (X ou O) venceu
function verificarVitoria(tabuleiro, jogador) {
  // Todas as combinações possíveis de vitória
  var combinacoes = [
    // Linhas
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    // Colunas
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    // Diagonais
    [0, 4, 8],
    [2, 4, 6]
  ];
  
  var i = 0;
  while (i < combinacoes.length) {
    var combo = combinacoes[i];
    var pos1 = combo[0];
    var pos2 = combo[1];
    var pos3 = combo[2];
    
    // Verificar se todas as três posições da combinação pertencem ao jogador
    if (tabuleiro[pos1] === jogador && tabuleiro[pos2] === jogador && tabuleiro[pos3] === jogador) {
      return true;
    }
    
    i = i + 1;
  }
  
  return false;
}

// =============================================================================
// 4. VERIFICAR SE O JOGO TERMINOU (EMPATE)
// =============================================================================
function verificarEmpate(tabuleiro) {
  var i = 0;
  while (i < 9) {
    if (tabuleiro[i] === '') {
      return false;  // Ainda há espaços vazios
    }
    i = i + 1;
  }
  return true;  // Tabuleiro cheio, empate
}

// =============================================================================
// 5. OBTER MOVIMENTOS VÁLIDOS (POSIÇÕES VAZIAS)
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
// 6. BUSCA EM PROFUNDIDADE (DFS) - NÚCLEO DA IA
// =============================================================================
// Esta função implementa um algoritmo de Busca em Profundidade pura.
// Ela procura recursivamente por um caminho que leva à vitória do computador.
//
// PARÂMETROS:
//   tabuleiro: o estado atual do jogo
//   profundidade: nível atual da recursão (0 = raiz, aumenta conforme desce)
//
// RETORNO:
//   true se encontrou um caminho para vitória, false caso contrário
//
// FUNCIONAMENTO:
// 1. A função tenta cada movimento válido para o computador ('O')
// 2. Depois de colocar 'O', ela muda de perspectiva: agora testa se o 
//    adversário (humano com 'X') venceria em seu turno
// 3. Recursivamente, ela continua descendo na árvore de possibilidades
// 4. Se em algum ponto encontrar uma situação onde o computador vence,
//    ela retorna true (indicando sucesso naquele ramo)
// 5. Se nenhum ramo levar à vitória, retorna false

function buscaProfundidade(tabuleiro, profundidade) {
  // COMENTÁRIO DIDÁTICO 1: Verificar condições terminais da recursão
  
  // Se o computador já venceu neste estado, retornar sucesso (true)
  if (verificarVitoria(tabuleiro, 'O')) {
    console.log('[DFS - Nível ' + profundidade + '] Computador venceu! Retornando true');
    return true;
  }
  
  // Se o tabuleiro está cheio (empate), a busca falhou (false)
  if (verificarEmpate(tabuleiro)) {
    console.log('[DFS - Nível ' + profundidade + '] Empate detectado. Retornando false');
    return false;
  }
  
  // COMENTÁRIO DIDÁTICO 2: Obter todos os movimentos válidos neste nível
  var movimentosValidos = obterMovimentosValidos(tabuleiro);
  var i = 0;
  
  // COMENTÁRIO DIDÁTICO 3: Iterar através de cada movimento válido
  // Isto representa a expansão dos nós filhos na árvore de busca
  while (i < movimentosValidos.length) {
    var posicao = movimentosValidos[i];
    
    console.log('[DFS - Nível ' + profundidade + '] Testando movimento na posição ' + posicao);
    
    // COMENTÁRIO DIDÁTICO 4: Fazer a jogada do computador
    // Isto SIMULA uma possível ação do computador
    tabuleiro[posicao] = 'O';
    console.log('[DFS - Nível ' + profundidade + '] Colocado O na posição ' + posicao);
    
    // COMENTÁRIO DIDÁTICO 5: Agora mudamos a perspectiva
    // Testamos se o HUMANO (X) teria uma estratégia vencedora após esse movimento
    // Se o humano NÃO conseguir vencer mesmo respondendo otimamente, 
    // então este é um movimento bom para o computador
    
    var humanoPodeVencer = false;
    
    // Simular a resposta do humano: testar TODOS os próximos movimentos do humano
    var movimentosHumano = obterMovimentosValidos(tabuleiro);
    var j = 0;
    
    while (j < movimentosHumano.length) {
      var posicaoHumano = movimentosHumano[j];
      
      // COMENTÁRIO DIDÁTICO 6: Simular movimento do humano
      tabuleiro[posicaoHumano] = 'X';
      console.log('[DFS - Nível ' + profundidade + '] ├─ Simulando resposta humana em ' + posicaoHumano);
      
      // COMENTÁRIO DIDÁTICO 7: CHAMADA RECURSIVA - Descer um nível na árvore
      // Agora passamos a decisão para o próximo nível
      // O próximo nível será a próxima jogada do computador (se houver)
      var resultadoRecursivo = buscaProfundidade(tabuleiro, profundidade + 1);
      
      // COMENTÁRIO DIDÁTICO 9: Desfazer a simulação do movimento do humano
      // Isto permite testar o próximo movimento alternativo
      tabuleiro[posicaoHumano] = '';
      console.log('[DFS - Nível ' + profundidade + '] ├─ Desfeito movimento em ' + posicaoHumano);
      
      // COMENTÁRIO DIDÁTICO 8: Análise do resultado recursivo
      // Se a recursão retornou true, o computador encontrou vitória naquele caminho
      if (resultadoRecursivo === true) {
        console.log('[DFS - Nível ' + profundidade + '] ├─ Encontrou vitória após resposta em ' + posicaoHumano);
        humanoPodeVencer = true;
        // Não precisa testar outras respostas do humano
        break;
      }
      
      j = j + 1;
    }
    
    // COMENTÁRIO DIDÁTICO 10: Decisão crítica
    // Se testamos TODAS as respostas do humano e NENHUMA levou a uma vitória do computador
    // (humanoPodeVencer === false), então este é um movimento ganho para o computador!
    if (humanoPodeVencer === false) {
      console.log('[DFS - Nível ' + profundidade + '] Movimento vencedor encontrado em ' + posicao + '!');
      // DESFAZER a jogada antes de retornar
      // (ela será feita de novo quando selecionarmos este movimento no jogo real)
      tabuleiro[posicao] = '';
      return true;
    }
    
    // COMENTÁRIO DIDÁTICO 11: Desfazer a jogada do computador
    // Se não encontramos vitória neste caminho, voltamos ao estado anterior
    tabuleiro[posicao] = '';
    console.log('[DFS - Nível ' + profundidade + '] Movimento em ' + posicao + ' não leva à vitória. Desfazendo.');
    
    i = i + 1;
  }
  
  // COMENTÁRIO DIDÁTICO 12: Se testamos TODOS os movimentos e NENHUM levou à vitória,
  // retornamos false (falha neste caminho)
  console.log('[DFS - Nível ' + profundidade + '] Nenhum movimento leva à vitória. Retornando false');
  return false;
}

// =============================================================================
// 7. ENCONTRAR O MELHOR MOVIMENTO DO COMPUTADOR
// =============================================================================
// Esta função usa o DFS para encontrar um movimento que leve à vitória.
// Se não encontrar, retorna o primeiro movimento válido disponível.

function encontrarMelhorMovimento(tabuleiro) {
  var movimentosValidos = obterMovimentosValidos(tabuleiro);
  
  console.log('\n>>> INICIANDO BUSCA EM PROFUNDIDADE <<<');
  console.log('Movimentos válidos disponíveis: ' + movimentosValidos.toString());
  
  // Tentar encontrar um movimento que leve à vitória
  var i = 0;
  while (i < movimentosValidos.length) {
    var posicao = movimentosValidos[i];
    
    console.log('\n[TESTE] Verificando se posição ' + posicao + ' leva à vitória...');
    
    // Simular a jogada
    tabuleiro[posicao] = 'O';
    
    // Verificar recursivamente se leva à vitória
    var levaVitoria = buscaProfundidade(tabuleiro, 0);
    
    // Desfazer a simulação
    tabuleiro[posicao] = '';
    
    if (levaVitoria === true) {
      console.log('\n>>> MOVIMENTO VENCEDOR ENCONTRADO: ' + posicao + ' <<<\n');
      return posicao;
    }
    
    i = i + 1;
  }
  
  // Se nenhum movimento leva à vitória, retornar o primeiro válido
  console.log('\n>>> NENHUMA VITÓRIA ENCONTRADA. ESCOLHENDO PRIMEIRO MOVIMENTO: ' + movimentosValidos[0] + ' <<<\n');
  return movimentosValidos[0];
}

// =============================================================================
// 8. LOOP PRINCIPAL DO JOGO COM READLINE
// =============================================================================

function iniciarJogo() {
  var tabuleiro = criarTabuleiro();
  var jogando = true;
  
  // Criar a interface de leitura
  var rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  
  console.log('='.repeat(50));
  console.log('  BEM-VINDO AO JOGO DA VELHA COM DFS');
  console.log('  Você é X, o computador é O');
  console.log('='.repeat(50));
  exibirTabuleiroComNumeros(tabuleiro);
  
  // Função para executar a próxima rodada
  function proximaRodada() {
    if (jogando === false) {
      rl.close();
      return;
    }
    
    // Solicitar entrada do jogador
    rl.question('Digite a posição (0-8) para sua jogada: ', function(resposta) {
      var posicao = parseInt(resposta);
      
      // VALIDAR entrada
      if (isNaN(posicao) || posicao < 0 || posicao > 8) {
        console.log('Posição inválida! Digite um número entre 0 e 8.');
        proximaRodada();
        return;
      }
      
      if (tabuleiro[posicao] !== '') {
        console.log('Posição já ocupada! Escolha outra.');
        proximaRodada();
        return;
      }
      
      // Fazer a jogada do humano
      tabuleiro[posicao] = 'X';
      console.log('\nVocê jogou em ' + posicao);
      exibirTabuleiroComNumeros(tabuleiro);
      
      // Verificar vitória do humano
      if (verificarVitoria(tabuleiro, 'X')) {
        console.log('Você venceu! Parabéns!');
        jogando = false;
        proximaRodada();
        return;
      }
      
      // Verificar empate
      if (verificarEmpate(tabuleiro)) {
        console.log('Empate!');
        jogando = false;
        proximaRodada();
        return;
      }
      
      // Computador joga
      console.log('\nComputador está pensando...');
      var movimentoComputador = encontrarMelhorMovimento(tabuleiro);
      tabuleiro[movimentoComputador] = 'O';
      console.log('Computador jogou em ' + movimentoComputador);
      exibirTabuleiroComNumeros(tabuleiro);
      
      // Verificar vitória do computador
      if (verificarVitoria(tabuleiro, 'O')) {
        console.log('Computador venceu!');
        jogando = false;
        proximaRodada();
        return;
      }
      
      // Verificar empate
      if (verificarEmpate(tabuleiro)) {
        console.log('Empate!');
        jogando = false;
        proximaRodada();
        return;
      }
      
      // Continuar para a próxima rodada
      proximaRodada();
    });
  }
  
  // Iniciar a primeira rodada
  proximaRodada();
}

// =============================================================================
// 9. INICIAR O PROGRAMA
// =============================================================================

iniciarJogo();
