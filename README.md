# Albion Analytics Pro - A Gangue Trololo Farm

Bem-vindo ao sistema de análise de mercado do Albion Online. Esta ferramenta foi desenvolvida para identificar oportunidades de arbitragem (compra e venda) entre as cidades do continente real.

## 📖 Manual de Uso

### 1. O que é este sistema?
É um painel que se conecta ao **Albion Data Project (ADP)** para encontrar itens que estão baratos em uma cidade e caros em outra. O objetivo é comprar, viajar e vender com lucro.

### 2. Passo a Passo para Lucrar
1.  **Escolha o Servidor:** No topo direito (globo), selecione o servidor onde você joga (Américas, Europa ou Ásia).
2.  **Filtre sua Localização:** Use o seletor de Cidades no menu para ver apenas ofertas que saem da cidade onde você está.
    *   *Exemplo:* Selecione "Martlock" para ver o que comprar em Martlock para levar para outros lugares.
3.  **Analise a Tabela:**
    *   **Item/Verificar:** Mostra o item. **Clique na imagem** para abrir o gráfico oficial e confirmar se o preço é real ou manipulação.
    *   **Rota:** `Origem ➔ Destino`. Você compra na esquerda e vende na direita.
    *   **Lucro:** Valor líquido estimado (já descontando os 6.5% de taxa Premium).
    *   **Atualizado (Importante!):**
        *   🟢 **Verde:** Preço atualizado há menos de 1 hora. Muito confiável.
        *   🟡 **Amarelo:** Atualizado entre 1h e 6h. Risco médio.
        *   🔴 **Vermelho:** Mais de 6h. Alto risco de o preço já ter mudado.
4.  **Consulte a IA:** Clique no botão de **Cérebro** roxo. A IA analisará a rota (risco de gank) e a liquidez do item.

---

## 🛠️ Documentação Técnica

### Estrutura do Projeto
Este é um projeto **Frontend (Single Page Application)** construído com tecnologias modernas:
*   **Core:** React 19 (TypeScript).
*   **Estilos:** Tailwind CSS.
*   **Dados:** API Pública do Albion Data Project (v2).
*   **IA:** Google Gemini API (Modelo Flash 2.5) para análise de risco.

### Arquivos Principais
*   `/src/services/albionApi.ts`: Contém a lista de itens monitorados e o dicionário de tradução (`ITEM_TRANSLATIONS`). É aqui que a mágica da busca de preços acontece.
*   `/src/components/MarketTable.tsx`: A tabela principal que renderiza os dados e calcula as cores de lucro/risco.
*   `/src/App.tsx`: Gerencia o estado global (filtros, dados carregados, modais).

### Nota sobre Hospedagem PHP
Se você deseja hospedar este sistema em um servidor PHP (Apache/Nginx/cPanel), **não é necessário converter o código**.

1.  **Build:** Execute o comando de build no seu ambiente de desenvolvimento (`npm run build`).
2.  **Upload:** Pegue a pasta `dist` gerada (que contém `index.html`, arquivos `.js` e `.css`) e faça upload para o seu servidor PHP (pasta `public_html`).
3.  **Renomear (Opcional):** Você pode renomear o `index.html` para `index.php` se precisar adicionar lógica de sessão do lado do servidor antes de carregar o app.

O React roda no navegador do usuário, então o servidor PHP serve apenas como hospedeiro dos arquivos estáticos.