# 🎮 Jogo da Velha com Visualizador de Árvore de Busca

Um **Jogo da Velha interativo** com visualização em tempo real da árvore de busca explorada pela IA, com **dois algoritmos intercambiáveis**: **Busca em Profundidade (DFS)** e **Minimax**.

## 🚀 Como Usar

### 1️⃣ Instalar Dependências
```bash
npm install
```

### 2️⃣ Iniciar o Servidor
```bash
npm start
```

### 3️⃣ Acessar no Navegador
Abra: **http://localhost:3000**

---

## 🎯 Funcionalidades

### 👤 Quem Começa?
- **🧑 Humano** - Você começa
- **🤖 Computador** - Computador começa automaticamente

### 🧠 Algoritmo da IA
- **🌲 DFS (Busca em Profundidade)** - Busca por um caminho que leve à vitória garantida do computador, com backtracking. Não pontua os estados nem bloqueia ativamente o adversário.
- **🧠 Minimax** - Alterna entre maximizar (computador) e minimizar (humano), pontuando estados terminais (`10 - profundidade` para vitória do computador, `profundidade - 10` para vitória do humano, `0` para empate). Por considerar a jogada ótima do adversário, também bloqueia ameaças do humano.

Alterne entre os dois pelo seletor "Algoritmo da IA" antes ou durante o jogo — a troca reinicia a partida atual.

### 🌳 Visualizador de Árvore de Busca
- **Ativar Rastreamento** - Marca a caixa para ver a árvore durante o jogo
- **Cores dos Nós**:
  - 🔵 Azul = Movimento do Computador
  - 🟠 Laranja = Movimento do Humano
  - 🟣 Roxo = Caminho Escolhido
  - 🟢 Verde = Vitória Encontrada

### 📊 Estatísticas
- **Nós Explorados** - Quantos estados foram analisados
- **Profundidade** - Nível máximo de busca
- **Movimento Escolhido** - Qual posição o computador escolheu
- **Algoritmo** - Qual algoritmo está ativo (DFS ou Minimax)
- **Valor (Minimax)** - Pontuação minimax do movimento escolhido (só aparece quando o Minimax está selecionado)
- **Status** - Se o rastreamento está ativo/inativo

### 🎮 Como Jogar
1. Clique em **"Novo Jogo"**
2. Se for sua vez, clique em uma posição no tabuleiro
3. O computador responde
4. Primeira pessoa com 3 em linha ganha! 🏆

---

## 📁 Estrutura do Projeto

```
public/
├── index.html               # Página principal
├── tree.html                # Página alternativa (visualizador)
├── cliente.js               # Lógica do cliente (index.html)
├── cliente-tree.js          # Lógica do cliente (tree.html)
└── style.css / style-tree.css  # Estilos

servidor.js                  # API Express.js
tabuleiro_utils.js            # Funções de tabuleiro compartilhadas (vitória/empate/movimentos)
logica_jogo.js                # Algoritmo DFS
logica_rastreada.js           # Algoritmo DFS com rastreamento
logica_minimax.js             # Algoritmo Minimax
logica_minimax_rastreada.js   # Algoritmo Minimax com rastreamento
rastreador_dfs.js             # Rastreador de árvore (reaproveitado por DFS e Minimax)
package.json                  # Dependências
README.md                     # Este arquivo
```

---

## 🔧 Troubleshooting

### Porta 3000 já em uso?
```bash
# Windows (PowerShell)
Get-Process -Name node | Stop-Process -Force

# macOS/Linux
lsof -ti:3000 | xargs kill -9
```

### Página em branco?
- Abra o Console (F12) para ver erros
- Certifique-se que o servidor está rodando
- Tente atualizar a página (Ctrl+Shift+R)

---

**IFTM** • Inteligência Computacional • Busca em Profundidade (DFS) e Minimax
