// =============================================================================
// CLIENTE VISUALIZADOR DE ÁRVORE DFS
// =============================================================================

let estadoJogo = null;
let rastreamentoAtivo = false;
let ultimoRastreamento = null;

// Elementos do DOM
const rastreamentoToggle = document.getElementById('rastreamentoToggle');
const quemComecaSelect = document.getElementById('quemComeca');
const jogarBtn = document.getElementById('jogarBtn');
const limparBtn = document.getElementById('limparBtn');
const tabuleiro = document.getElementById('tabuleiro');
const mensagemJogo = document.getElementById('mensagemJogo');
const treeContainer = document.getElementById('treeContainer');
const nosExplorados = document.getElementById('nosExplorados');
const profundidade = document.getElementById('profundidade');
const movimentoEscolhido = document.getElementById('movimentoEscolhido');
const statusRastreamento = document.getElementById('statusRastreamento');

// =============================================================================
// FUNÇÕES DE CONTROLE
// =============================================================================

async function iniciarJogo() {
  try {
    // Ativar rastreamento se selecionado
    if (rastreamentoToggle.checked) {
      await fetch('/api/rastreamento/ativar');
      rastreamentoAtivo = true;
    } else {
      await fetch('/api/rastreamento/desativar');
      rastreamentoAtivo = false;
    }

    // Obter escolha de quem começa
    const quemComeca = quemComecaSelect.value;

    // Criar novo jogo
    const response = await fetch('/api/jogo/novo', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ quemComeca })
    });
    estadoJogo = await response.json();

    // Se o computador já jogou, capturar rastreamento
    if (estadoJogo.rastreamento) {
      ultimoRastreamento = estadoJogo.rastreamento;
    }

    renderizarJogo();
    if (ultimoRastreamento) {
      renderizarArvore();
      atualizarEstatisticas();
    }
    atualizarStatus();
  } catch (erro) {
    console.error('Erro ao iniciar jogo:', erro);
  }
}

async function fazerJogada(posicao) {
  if (!estadoJogo || estadoJogo.gameover) return;

  try {
    const response = await fetch('/api/jogo/jogada', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ posicao })
    });

    estadoJogo = await response.json();
    ultimoRastreamento = estadoJogo.rastreamento;

    renderizarJogo();
    if (ultimoRastreamento) {
      renderizarArvore();
      atualizarEstatisticas();
    }
    atualizarStatus();
  } catch (erro) {
    console.error('Erro ao fazer jogada:', erro);
  }
}

function atualizarStatus() {
  if (rastreamentoAtivo) {
    statusRastreamento.textContent = '✓ Ativo';
    statusRastreamento.style.color = '#4caf50';
  } else {
    statusRastreamento.textContent = 'Inativo';
    statusRastreamento.style.color = '#999';
  }
}

// =============================================================================
// RENDERIZAÇÃO DO JOGO
// =============================================================================

function renderizarJogo() {
  tabuleiro.innerHTML = '';

  for (let i = 0; i < 9; i++) {
    const cell = document.createElement('div');
    cell.className = 'cell';

    const valor = estadoJogo.tabuleiro[i];
    if (valor === 'X') {
      cell.textContent = 'X';
      cell.classList.add('x', 'disabled');
    } else if (valor === 'O') {
      cell.textContent = 'O';
      cell.classList.add('o', 'disabled');
    } else {
      if (!estadoJogo.gameover) {
        cell.addEventListener('click', () => fazerJogada(i));
      } else {
        cell.classList.add('disabled');
      }
    }

    tabuleiro.appendChild(cell);
  }

  mensagemJogo.textContent = estadoJogo.mensagem;
}

// =============================================================================
// RENDERIZAÇÃO DA ÁRVORE
// =============================================================================

function renderizarArvore() {
  if (!ultimoRastreamento || !ultimoRastreamento.nos) {
    treeContainer.innerHTML = '<p class="tree-placeholder">Nenhum rastreamento disponível</p>';
    return;
  }

  const nos = ultimoRastreamento.nos;
  const caminho = ultimoRastreamento.caminho || [];

  treeContainer.innerHTML = '';

  const nosPorProfundidade = {};
  nos.forEach(no => {
    if (!nosPorProfundidade[no.profundidade]) {
      nosPorProfundidade[no.profundidade] = [];
    }
    nosPorProfundidade[no.profundidade].push(no);
  });

  // Renderizar por profundidade
  const profundidades = Object.keys(nosPorProfundidade).sort((a, b) => a - b);
  profundidades.forEach(prof => {
    const nosNivel = nosPorProfundidade[prof];

    nosNivel.forEach(no => {
      const nodeEl = document.createElement('div');
      nodeEl.className = 'tree-node';

      let texto = '';
      let ehCaminho = caminho.includes(no.posicao);

      if (no.tipo === 'computador') {
        nodeEl.classList.add('computador-node');
        texto = `🤖 Computador | Posição: ${no.posicao}`;
      } else if (no.tipo === 'humano') {
        nodeEl.classList.add('humano-node');
        texto = `👤 Humano | Posição: ${no.posicao}`;
      } else if (no.tipo === 'vitoria') {
        nodeEl.classList.add('vitoria-node');
        texto = `✓ VITÓRIA ENCONTRADA em ${no.posicao}`;
      } else if (no.tipo === 'terminal') {
        texto = `🛑 Terminal: ${no.resultado ? 'Vitória' : 'Empate'}`;
      } else {
        texto = `[${no.tipo}]`;
      }

      // Adicionar indentação
      nodeEl.style.marginLeft = `${no.profundidade * 15}px`;

      // Destacar caminho escolhido
      if (ehCaminho && (no.tipo === 'computador' || no.tipo === 'humano')) {
        nodeEl.classList.add('caminho-node');
        texto += ' ⭐ CAMINHO ESCOLHIDO';
      }

      nodeEl.textContent = texto;
      treeContainer.appendChild(nodeEl);
    });
  });
}

// =============================================================================
// ATUALIZAR ESTATÍSTICAS
// =============================================================================

function atualizarEstatisticas() {
  if (!ultimoRastreamento) return;

  const total = ultimoRastreamento.nos ? ultimoRastreamento.nos.length : 0;
  const profMax = ultimoRastreamento.nos
    ? Math.max(...ultimoRastreamento.nos.map(n => n.profundidade))
    : 0;
  const caminho = ultimoRastreamento.caminho ? ultimoRastreamento.caminho[0] : '-';

  nosExplorados.textContent = total;
  profundidade.textContent = profMax;
  movimentoEscolhido.textContent = caminho;
}

// =============================================================================
// EVENT LISTENERS
// =============================================================================

rastreamentoToggle.addEventListener('change', () => {
  // Resetar jogo quando mudar configuração
  iniciarJogo();
});

quemComecaSelect.addEventListener('change', () => {
  // Iniciar novo jogo quando mudar quem começa
  iniciarJogo();
});

jogarBtn.addEventListener('click', iniciarJogo);
limparBtn.addEventListener('click', () => {
  treeContainer.innerHTML = '<p class="tree-placeholder">Faça uma jogada para visualizar a árvore de busca</p>';
  nosExplorados.textContent = '0';
  profundidade.textContent = '0';
  movimentoEscolhido.textContent = '-';
  ultimoRastreamento = null;
});

// =============================================================================
// INICIALIZAÇÃO
// =============================================================================

document.addEventListener('DOMContentLoaded', () => {
  iniciarJogo();
});
