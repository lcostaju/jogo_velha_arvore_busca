// =============================================================================
// RASTREADOR DE ÁRVORE DFS - Registra cada nó visitado
// =============================================================================

class RastreadorDFS {
  constructor() {
    this.no = 0;  // Contador de nós
    this.arvore = [];  // Registro de nós
    this.caminhoEscolhido = [];  // Caminho final
    this.ativo = false;
  }

  iniciar() {
    this.no = 0;
    this.arvore = [];
    this.caminhoEscolhido = [];
    this.ativo = true;
  }

  registrarNo(tipo, posicao, profundidade, resultado) {
    const noId = this.no++;
    
    const noInfo = {
      id: noId,
      tipo: tipo,  // 'computador' ou 'humano'
      posicao: posicao,
      profundidade: profundidade,
      resultado: resultado,  // true/false/null
      timestamp: Date.now()
    };
    
    this.arvore.push(noInfo);
    return noId;
  }

  registrarEscolha(posicoes) {
    this.caminhoEscolhido = posicoes;
  }

  obterArvore() {
    return {
      nos: this.arvore,
      caminho: this.caminhoEscolhido,
      totalNos: this.no
    };
  }

  limpar() {
    this.no = 0;
    this.arvore = [];
    this.caminhoEscolhido = [];
    this.ativo = false;
  }
}

module.exports = RastreadorDFS;
