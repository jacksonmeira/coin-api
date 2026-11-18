# coinAPI

Dashboard de mercado de criptomoedas criado com React, Vite, TypeScript, Tailwind CSS, Recharts e componentes no estilo shadcn/ui.

## Organização do código

```text
src/
├── app/                  # Composição e inicialização da aplicação
├── components/
│   ├── layout/           # Navegação lateral e cabeçalho
│   └── ui/               # Primitivos reutilizáveis de interface
├── features/
│   ├── market/           # API, tipos, hook e componentes do mercado
│   └── portfolio/        # Componentes da área de portfólio
├── hooks/                # Preferências compartilhadas, tema e favoritos
├── lib/                  # Formatação e utilitários
└── pages/                # Composição das páginas
```

As integrações externas ficam na camada `features/*/api`; hooks concentram o estado e os efeitos; componentes de feature cuidam da apresentação; e `pages` conecta essas partes. Isso permite ampliar o dashboard sem concentrar regras de mercado, navegação e interface em um único arquivo.

## Rodar localmente

```bash
npm install
npm run dev
```

A chave informada está configurada localmente em `.env.local`, arquivo ignorado pelo Git. Para trocar ou configurar outra chave, copie `.env.example` para `.env.local` e preencha `VITE_COINGECKO_API_KEY`.

O prefixo `VITE_` significa que a chave será incluída no JavaScript enviado ao navegador. Para um deploy público, use uma função serverless ou backend como proxy e mantenha a chave somente no servidor.

## Recursos

- Dados de mercado e preços históricos obtidos pela API CoinGecko.
- Gráfico interativo com períodos de 1 dia a histórico completo.
- Busca, ativos favoritos persistidos no navegador e alternância de tema.
- Layout responsivo para desktop, tablet e celular.
- O cartão de portfólio contém valores fictícios para fins visuais.
