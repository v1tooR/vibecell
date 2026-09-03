# Vibe Cell — site institucional + mapa de distribuidores

Três páginas em **HTML, CSS e JavaScript puro** (sem build, sem framework, sem WordPress).
`index.html` é a **porta de entrada**: uma tela só, dois caminhos. Daí o visitante vai pra
`distribuidor.html` (quem compra Vibe pra revender) ou `tecnico.html` (quem conserta aparelho).
Essas duas compartilham o mesmo motor — `data.js`/`app.js`/`style.css` —, então mudar um texto,
cor ou comportamento é uma edição só, que vale pras duas.
A única dependência externa é o **Leaflet + OpenStreetMap**, carregado por CDN **somente quando o
mapa é liberado** — nenhuma chave de API, nenhum custo recorrente.

## Fluxo do usuário

1. `index.html` abre com a escolha de perfil: **Sou Distribuidor** ("quero comprar Vibe pra minha
   distribuidora") e **Sou Técnico** ("quero encontrar o distribuidor Vibe mais perto de mim").
   Não tem menu nem conteúdo pra rolar — só os dois caminhos.
2. `distribuidor.html` abre travado no **tema claro**; `tecnico.html`, no **escuro**. O degradê da
   marca é o mesmo nos dois. Nas duas, o logo do topo volta pra escolha de perfil.
3. O visitante percorre a estrutura comercial: problema → solução → linhas de produto →
   Premium Vibe → como funciona → **feedbacks em vídeo** → Vibecast → dúvidas.
4. **Técnico:** ao chegar em "Onde encontrar", o mapa aparece bloqueado e um **mini popup** pede
   nome e WhatsApp. Depois de preencher, o mapa é liberado com todos os pontos, busca por
   cidade/estado, filtro por região, ordenação por distância e **botão de WhatsApp + rota**.
5. **Distribuidor:** no lugar do mapa, o formulário **"Quero comprar Vibe"** — nome, telefone,
   CEP, endereço e média de compra de telas por mês. Ao enviar, o lead é gravado **e** a conversa
   abre no **WhatsApp da Vibe** já preenchida com esses dados.

O lead fica salvo no navegador: quem já preencheu não vê o popup de novo.

## Estrutura

```
index.html                 porta de entrada — escolha de perfil (não carrega app.js)
distribuidor.html          visão Distribuidor (trava em PAGINA_PERSONA.fixa = 'distribuidor')
tecnico.html               visão Técnico (trava em 'tecnico') — mesmo corpo, mesmos ícones
assets/css/style.css       tokens dos dois temas, layout e responsivo
assets/js/data.js          >>> TODO O CONTEÚDO EDITÁVEL <<<
assets/js/app.js           conteúdo por visão, popups, feedbacks, mapa e filtros
assets/js/shader-bg.js     fundo animado (WebGL) do hero e da porta de entrada
assets/php/salvar-lead.php grava os leads em CSV (ver "Receber os leads")
assets/img/vibe-logo.png   logo original, só como referência (a página não carrega)
```

`distribuidor.html` e `tecnico.html` têm o mesmo corpo — os dois carregam a estrutura completa
(gate do mapa, formulário de distribuidor, seções condicionais das duas visões), só que cada
arquivo define `window.PAGINA_PERSONA` (script inline, logo antes de `data.js`) travando qual
visão aparece. Pra criar uma terceira variante, é copiar um dos dois e trocar esse valor.

`index.html` é a exceção: é HTML estático, carrega só `shader-bg.js` e `data.js` (pros links de
WhatsApp e Instagram) e **não** carrega `app.js` — não tem mapa, formulário nem conteúdo por visão.

## O que editar (tudo em `assets/js/data.js`)

| Quero mudar | Onde |
| --- | --- |
| WhatsApp, Instagram e site oficial | `CONFIG` |
| Qual página é qual visão | `window.PAGINA_PERSONA` (script inline no fim de `distribuidor.html`/`tecnico.html`) |
| Visão padrão se `PAGINA_PERSONA` não existir | `CONFIG.personaPadrao` (`'distribuidor'` = claro, `'tecnico'` = escuro) |
| Textos da visão Distribuidor | `PERSONAS.distribuidor` |
| Textos da visão Técnico | `PERSONAS.tecnico` |
| Linhas de produto (Comum / Premium) | `PERSONAS.<visão>.portfolio.linhas` |
| Faixas de "média de compra de telas" do formulário | `CONFIG.faixasCompraTelas` |
| Feedbacks em vídeo (reels) | `FEEDBACKS` |
| Depoimentos em texto | `DEPOIMENTOS` |
| Distribuidoras do mapa | `DISTRIBUIDORAS` |

Os textos da **porta de entrada** (`index.html`) são os únicos que ficam no HTML, não em
`data.js` — a página é estática de propósito.

### Duas regras de conteúdo aplicadas no site

- **Nenhum número inventado.** No lugar da faixa de métricas existe uma faixa de atributos
  (atacado especializado, importação direta, logística nacional, suporte comercial). Quando a
  Vibe tiver dados oficiais, é só trocar esses itens em `PERSONAS.<visão>.autoridade`.
- **Nenhum depoimento fictício.** `DEPOIMENTOS` está vazio e, enquanto estiver, **a seção de
  prova social em texto nem aparece no site**. Ao cadastrar o primeiro relato real, a seção se
  monta sozinha. Modelo de cada item:

```js
{
  txt: 'Depoimento real sobre giro, qualidade, pós-venda ou relacionamento com a Vibe.',
  nome: 'Nome do parceiro',
  local: 'Cidade — UF',
  perfil: 'distribuidor'   // 'distribuidor', 'tecnico' ou 'ambos'
}
```

### Adicionar um feedback em vídeo

A seção **Feedbacks** das duas páginas monta os cards a partir de `FEEDBACKS`. Cada card é um
reel real do `@vibecell.oficial`: mostra uma **capa local** (rápida, no visual do site) e só
carrega o player do Instagram quando o visitante clica — nenhum script de terceiro roda antes
disso, e o iframe é destruído ao fechar o lightbox.

Pra adicionar um: copie o código do reel (o trecho depois de `/reel/` na URL), salve um frame de
capa em `assets/img/` na proporção 9:16 e acrescente um bloco:

```js
{
  code: 'DZVnF1dDzSK',                    // só o código do reel
  capa: 'assets/img/feedback-ivo.webp',   // frame de capa, 9:16
  nome: 'Ivo',
  local: 'Vibe Distribuidora FSA',
  txt: 'O que a pessoa realmente diz no vídeo.',
  perfil: 'ambos'   // 'distribuidor', 'tecnico' ou 'ambos'
}
```

A mesma regra dos depoimentos vale aqui: **`txt` descreve o que a pessoa fala de verdade** — nada
de frase inventada. Com a lista vazia, a seção não aparece.

### Adicionar uma distribuidora

Copie um bloco de `DISTRIBUIDORAS` e ajuste. As coordenadas saem do Google Maps
(clique com o botão direito no local → copiar latitude/longitude):

```js
{
  id: 17, nome: 'Vibe Londrina', cidade: 'Londrina', uf: 'PR', regiao: 'Sul',
  endereco: 'Av. Higienópolis, 100 — Centro', cep: '86020-080',
  horario: 'Seg a Sex 8h–18h', tel: '(43) 3000-1800',
  whatsapp: '5543999990017',          // formato internacional, só números
  lat: -23.3103, lng: -51.1628,
  atende: ['tecnico', 'distribuidor'], // em qual visão o ponto aparece
  selos: ['Atacado', 'Premium Vibe']
}
```

### Receber os leads

Por padrão (`leadWebhook` / `leadWebhookDistribuidor` apontando para
`assets/php/salvar-lead.php`), cada envio dos dois formulários — o popup do
Técnico e o "Quero comprar Vibe" do Distribuidor — vira uma linha num CSV
local, gravado em `assets/php/leads/` (uma pasta bloqueada por `.htaccess`,
ninguém baixa o arquivo pela URL): `libera-mapa.csv` e
`quero-comprar-vibe.csv`. **Só funciona em hospedagem com PHP** (Hostinger,
cPanel...). Rodando localmente com `npx serve` o PHP não executa — pra testar
de verdade é preciso subir os arquivos pra hospedagem real.

O formulário do distribuidor **não depende do PHP pra converter**: ao enviar,
ele abre o WhatsApp da Vibe com nome, telefone, endereço, cidade/UF, CEP e
média de compra já escritos na mensagem. O CSV é o registro; o WhatsApp é a
conversa.

Se o site for publicado num host só de arquivo estático (GitHub Pages, Vercel,
Netlify), troque `leadWebhook`/`leadWebhookDistribuidor` por uma URL de
webhook (Zapier, Make, n8n, Google Apps Script, CRM...) ou deixe em branco
pra gravar só no navegador de quem preencheu.

O envio é um `POST` com corpo JSON — `{ nome, whatsapp, whatsappFmt, perfil, origem, data }`
no popup do Técnico, `{ nome, telefone, telefoneFmt, cep, cidadeUf, endereco, faixaCompra, faixaCompraRotulo, perfil, origem, data }`
no "Quero comprar Vibe". O PHP separa os dois pela presença de `faixaCompra`.
Se existir `window.dataLayer` (GTM), também é disparado o evento
`lead_distribuidor` (Técnico) ou `lead_distribuidor_form` (Distribuidor).

Os CSVs guardam dado pessoal de cliente — por isso `assets/php/leads/*.csv`
está no `.gitignore` e nunca deve ir pro controle de versão.

## Identidade visual

Extraída da logo (`assets/img/vibe-logo.png`).

| Token | Valor | Uso |
| --- | --- | --- |
| `--grad` | `#59A6E7 → #5B80D9 → #6F4AC4 → #8330A8` (90°) | logo, barras, passos, filetes |
| `--grad-cta` | `#5FA9E9 → #5B80D9` | botões primários (trecho claro da rampa, para o texto escuro manter contraste) |
| `--acc` | `#2F6FD0` no claro · `#6FB6EF` no escuro | ícones, links e detalhes |
| `--r1…--r6` | rampa distribuída pelas grades | cada tema tem sua versão legível |

- **Temas:** `html[data-tema="claro"]` (distribuidor, fundo branco) e `html[data-tema="escuro"]`
  (técnico e porta de entrada, preto `#050609`). Todo o CSS usa tokens — não há cor fixa fora dos blocos de tema,
  então criar um terceiro tema é só duplicar um bloco.
- **Tipografia:** Archivo 800/900 nos títulos (peso próximo ao da logo), Inter no texto.
- **Logo:** vetorizada em código, no símbolo `#logo-vibe` de cada HTML — nenhuma fonte
  envolvida, então o desenho é sempre idêntico. As medidas saíram de uma leitura pixel a pixel
  do arquivo da marca, normalizadas para altura de caixa alta = 100:

  | Elemento | Medida |
  | --- | --- |
  | V | largura 108, hastes de 32, entalhe até 56, base chata de 29 |
  | I | largura 30 |
  | B | largura 162, cantos direitos com raio 28, vazados em pílula de 15 de altura |
  | E (3 barras) | largura 164, barra 26, vão 11 |
  | Vãos | 6 (V–I) · 6 (I–B) · 4 (B–E) |

  As letras usam `currentColor` (acompanham o tema); as barras, o degradê `#g-vibe`.
  Para redimensionar, altere só `--wm-h` em `.wm`. Se aparecer o vetor original da marca,
  basta substituir o conteúdo do símbolo — nada mais no layout muda.
- **As 3 barras** se repetem como sistema: favicon, tela do celular no topo, selo Premium,
  selo do programa, pin do mapa e barra de progresso de leitura.

## Rodar localmente

```bash
npx serve -l 4173 .
```

Abra `http://localhost:4173` (porta de entrada), `/distribuidor.html` ou `/tecnico.html`.
`?perfil=distribuidor` / `?perfil=tecnico` na URL só tem efeito se `window.PAGINA_PERSONA` não
estiver definido no arquivo — nas duas páginas internas, a visão vem travada por ele.

## Publicar

São arquivos estáticos — sobem em qualquer hospedagem (Hostinger, Vercel, Netlify,
GitHub Pages, cPanel). Basta enviar `index.html`, `distribuidor.html`, `tecnico.html` e a pasta
`assets/` para a raiz do domínio (**vibecelloficial.com.br**), ficando assim:

```
vibecelloficial.com.br                    escolha de perfil
vibecelloficial.com.br/distribuidor.html  quero comprar Vibe
vibecelloficial.com.br/tecnico.html       mapa de distribuidores
```

**O domínio raiz passa a abrir na escolha de perfil** — quem já divulgou o link antigo do
Lojista (`/index.html`) precisa passar a divulgar `/distribuidor.html`.

## Detalhes técnicos

- Mapa: Leaflet 1.9.4 com tiles CARTO (light/dark conforme o tema) sobre dados do
  OpenStreetMap, com a atribuição mantida visível como exige a licença.
- Acessibilidade: navegação por teclado, foco preso no popup, `aria-*` nos controles,
  respeito a `prefers-reduced-motion`.
- Sem cookies de terceiros e sem rastreador embutido.
- Testado em desktop (1280px), tablet e mobile (375px), nos dois temas, sem estouro horizontal.
