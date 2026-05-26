# 🎮 Jogo da Velha com Visualizador de Árvore DFS

Um **Jogo da Velha interativo** com visualização em tempo real de uma **Árvore de Busca em Profundidade (DFS)** para demonstrar como o algoritmo explora todas as possibilidades do jogo.

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

### 🌳 Visualizador de Árvore DFS
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
├── index.html          # Página principal
├── cliente.js          # Lógica do cliente
└── style.css           # Estilos

servidor.js             # API Express.js
logica_jogo.js          # Algoritmo DFS
logica_rastreada.js     # Algoritmo DFS com rastreamento
rastreador_dfs.js       # Rastreador
package.json            # Dependências
README.md               # Este arquivo
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

**IFTM** • Inteligência Computacional • Busca em Profundidade (DFS)
