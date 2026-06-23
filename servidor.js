// =============================================================================
// SERVIDOR EXPRESS - API REST PARA O JOGO DA VELHA
// =============================================================================

const express = require('express');
const path = require('path');
const jogoDFS = require('./logica_jogo');
const jogoDFSRastreado = require('./logica_rastreada');
const jogoMinimax = require('./logica_minimax');
const jogoMinimaxRastreado = require('./logica_minimax_rastreada');

const app = express();
const PORT = 3000;

// Flag para ativar/desativar rastreamento
let usarRastreamento = false;

// Algoritmo de IA selecionado: 'dfs' ou 'minimax'
let algoritmoAtual = 'dfs';

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// =============================================================================
// SELEÇÃO DO MÓDULO DE IA (DFS x MINIMAX, NORMAL x RASTREADO)
// =============================================================================
function obterModuloIA() {
  if (algoritmoAtual === 'minimax') {
    return usarRastreamento ? jogoMinimaxRastreado : jogoMinimax;
  }
  return usarRastreamento ? jogoDFSRastreado : jogoDFS;
}

function calcularMovimentoComputador(tabuleiro) {
  const moduloIA = obterModuloIA();

  if (usarRastreamento) {
    const movimento = moduloIA.encontrarMelhorMovimentoRastreado(tabuleiro);
    return { movimento: movimento, rastreamento: moduloIA.obterRastreamento() };
  }

  const movimento = moduloIA.encontrarMelhorMovimento(tabuleiro);
  return { movimento: movimento, rastreamento: null };
}

// =============================================================================
// ESTADO DO JOGO (armazenado no servidor)
// =============================================================================
let estadoJogo = {
  tabuleiro: jogoDFS.criarTabuleiro(),
  turno: 'humano',  // 'humano' ou 'computador'
  mensagem: 'Seu turno! Escolha uma posição',
  gameover: false,
  vencedor: null,
  proximoJogador: 'humano'  // Controla quem começa o próximo jogo
};

// Função para criar novo jogo
function criarNovoJogo(quemComeca) {
  estadoJogo = {
    tabuleiro: jogoDFS.criarTabuleiro(),
    turno: quemComeca,
    mensagem: quemComeca === 'humano' ? 'Seu turno! Escolha uma posição' : 'Computador está pensando...',
    gameover: false,
    vencedor: null,
    proximoJogador: quemComeca
  };
  return estadoJogo;
}

// =============================================================================
// ROTAS DA API
// =============================================================================

// GET - Obter estado atual do jogo
app.get('/api/jogo', (req, res) => {
  res.json(estadoJogo);
});

// POST - Criar novo jogo (com escolha de quem começa)
app.post('/api/jogo/novo', (req, res) => {
  const { quemComeca } = req.body;

  // Validar parâmetro
  if (!quemComeca || (quemComeca !== 'humano' && quemComeca !== 'computador')) {
    return res.status(400).json({ erro: 'quemComeca deve ser "humano" ou "computador"' });
  }

  const novoEstado = criarNovoJogo(quemComeca);

  // Se computador começa, fazer sua jogada imediatamente
  if (quemComeca === 'computador') {
    const { movimento, rastreamento } = calcularMovimentoComputador(novoEstado.tabuleiro);

    novoEstado.tabuleiro[movimento] = 'O';
    novoEstado.rastreamento = rastreamento;
    novoEstado.turno = 'humano';
    novoEstado.mensagem = 'Seu turno! Escolha uma posição';

    // Verificar se computador venceu (improvável na primeira jogada)
    if (jogoDFS.verificarVitoria(novoEstado.tabuleiro, 'O')) {
      novoEstado.gameover = true;
      novoEstado.vencedor = 'computador';
      novoEstado.mensagem = 'Computador venceu! 🤖';
    }
  }

  res.json(novoEstado);
});

// POST - Resetar jogo (compatibilidade com versão anterior)
app.post('/api/jogo/reset', (req, res) => {
  const novoEstado = criarNovoJogo('humano');
  res.json(novoEstado);
});

// POST - Fazer jogada do humano
app.post('/api/jogo/jogada', (req, res) => {
  const { posicao } = req.body;

  // Validações
  if (posicao === undefined || posicao < 0 || posicao > 8) {
    return res.status(400).json({ erro: 'Posição inválida' });
  }

  if (estadoJogo.tabuleiro[posicao] !== '') {
    return res.status(400).json({ erro: 'Posição já ocupada' });
  }

  if (estadoJogo.gameover) {
    return res.status(400).json({ erro: 'Jogo já terminou' });
  }

  // Fazer jogada do humano
  estadoJogo.tabuleiro[posicao] = 'X';

  // Verificar vitória do humano
  if (jogoDFS.verificarVitoria(estadoJogo.tabuleiro, 'X')) {
    estadoJogo.gameover = true;
    estadoJogo.vencedor = 'humano';
    estadoJogo.mensagem = 'Você venceu! 🎉';
    estadoJogo.turno = null;
    return res.json(estadoJogo);
  }

  // Verificar empate
  if (jogoDFS.verificarEmpate(estadoJogo.tabuleiro)) {
    estadoJogo.gameover = true;
    estadoJogo.vencedor = 'empate';
    estadoJogo.mensagem = 'Empate! 🤝';
    return res.json(estadoJogo);
  }

  // Computador joga
  const { movimento, rastreamento } = calcularMovimentoComputador(estadoJogo.tabuleiro);

  estadoJogo.tabuleiro[movimento] = 'O';
  estadoJogo.rastreamento = rastreamento;

  // Verificar vitória do computador
  if (jogoDFS.verificarVitoria(estadoJogo.tabuleiro, 'O')) {
    estadoJogo.gameover = true;
    estadoJogo.vencedor = 'computador';
    estadoJogo.mensagem = 'Computador venceu! 🤖';
    estadoJogo.turno = null;
    return res.json(estadoJogo);
  }

  // Verificar empate
  if (jogoDFS.verificarEmpate(estadoJogo.tabuleiro)) {
    estadoJogo.gameover = true;
    estadoJogo.vencedor = 'empate';
    estadoJogo.mensagem = 'Empate! 🤝';
    estadoJogo.turno = null;
    return res.json(estadoJogo);
  }

  // Continuar o jogo
  estadoJogo.turno = 'humano';
  estadoJogo.mensagem = 'Seu turno! Escolha uma posição';

  res.json(estadoJogo);
});

// GET - Ativar/desativar rastreamento
app.get('/api/rastreamento/ativar', (req, res) => {
  usarRastreamento = true;
  res.json({ ativo: true });
});

app.get('/api/rastreamento/desativar', (req, res) => {
  usarRastreamento = false;
  res.json({ ativo: false });
});

app.get('/api/rastreamento/status', (req, res) => {
  res.json({ ativo: usarRastreamento });
});

// POST - Definir algoritmo de IA (dfs ou minimax)
app.post('/api/algoritmo/definir', (req, res) => {
  const { algoritmo } = req.body;

  if (algoritmo !== 'dfs' && algoritmo !== 'minimax') {
    return res.status(400).json({ erro: 'algoritmo deve ser "dfs" ou "minimax"' });
  }

  algoritmoAtual = algoritmo;
  res.json({ algoritmo: algoritmoAtual });
});

app.get('/api/algoritmo/status', (req, res) => {
  res.json({ algoritmo: algoritmoAtual });
});

// =============================================================================
// INICIAR SERVIDOR
// =============================================================================

app.listen(PORT, () => {
  console.log('\n');
  console.log('╔════════════════════════════════════════════╗');
  console.log('║   JOGO DA VELHA COM DFS - INTERFACE WEB   ║');
  console.log('╠════════════════════════════════════════════╣');
  console.log('║                                            ║');
  console.log('║  Servidor rodando em:                      ║');
  console.log('║  👉 http://localhost:' + PORT + '                    ║');
  console.log('║                                            ║');
  console.log('║  Pressione Ctrl+C para parar               ║');
  console.log('║                                            ║');
  console.log('╚════════════════════════════════════════════╝');
  console.log('\n');
});

module.exports = app;
