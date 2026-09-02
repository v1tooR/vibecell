# Vibe Cell — site institucional + mapa de distribuidores

Duas páginas em **HTML, CSS e JavaScript puro** (sem build, sem framework, sem WordPress),
compartilhando o mesmo motor: `index.html` é a visão **Lojista** e `tecnico.html` é a visão
**Técnico** — cada uma travada na sua audiência, mas lendo os mesmos `data.js`/`app.js`/`style.css`.
Mudar um texto, cor ou comportamento é uma edição só, que vale pras duas.
A única dependência externa é o **Leaflet + OpenStreetMap**, carregado por CDN **somente quando o
mapa é liberado** — nenhuma chave de API, nenhum custo recorrente.

## Fluxo do usuário

1. `index.html` abre travado na visão **Lojista, tema claro**; `tecnico.html` abre travado na
   visão **Técnico, tema escuro**. A pílula no topo de cada página leva pra outra (é navegação de
   página mesmo, não troca de conteúdo por JS). O degradê da marca é o mesmo nos dois temas.
2. O visitante percorre a estrutura comercial: problema → solução → linhas de produto →
   Premium Vibe → como funciona → prova social → distribuidores.
3. Ao chegar em **"Onde encontrar"**, o mapa aparece bloqueado e um **mini popup** pede nome e
   WhatsApp (abre sozinho ao rolar até a seção ou ao clicar em qualquer CTA de distribuidor).
4. Depois de preencher, o mapa é liberado com todos os pontos, busca por cidade/estado, filtro
   por região, ordenação por distância e **botão de WhatsApp + rota** em cada distribuidor.

O lead fica salvo no navegador: quem já preencheu não vê o popup de novo.

## Estrutura

```
index.html                 visão Lojista (trava a página em PAGINA_PERSONA.fixa = 'lojista')
tecnico.html                visão Técnico (trava em 'tecnico') — mesmo HTML, mesmos ícones (sprite SVG)
assets/css/style.css       tokens dos dois temas, layout e responsivo
assets/js/data.js          >>> TODO O CONTEÚDO EDITÁVEL <<<
assets/js/app.js           visão/tema, popup de captura, mapa e filtros
assets/php/salvar-lead.php grava os leads em CSV (ver "Receber os leads")
assets/img/vibe-logo.png   logo original, só como referência (a página não carrega)
```

`index.html` e `tecnico.html` têm o mesmo corpo — os dois carregam a estrutura completa (gate do
mapa, formulário de distribuidor, seções condicionais das duas personas), só que cada arquivo
define `window.PAGINA_PERSONA` (script inline, logo antes de `data.js`) travando qual visão
aparece. Pra criar uma terceira variante, é copiar um dos dois e trocar esse valor.

## O que editar (tudo em `assets/js/data.js`)

| Quero mudar | Onde |
| --- | --- |
| WhatsApp, Instagram e site oficial | `CONFIG` |
| Qual página é qual visão | `window.PAGINA_PERSONA` (script inline no fim de `index.html`/`tecnico.html`) |
| Visão padrão se `PAGINA_PERSONA` não existir | `CONFIG.personaPadrao` (`'lojista'` = claro, `'tecnico'` = escuro) |
| Textos da visão Lojista | `PERSONAS.lojista` |
| Textos da visão Técnico | `PERSONAS.tecnico` |
| Linhas de produto (Comum / Premium) | `PERSONAS.<visão>.portfolio.linhas` |
| Depoimentos | `DEPOIMENTOS` |
| Distribuidoras do mapa | `DISTRIBUIDORAS` |

### Duas regras de conteúdo aplicadas no site

- **Nenhum número inventado.** No lugar da faixa de métricas existe uma faixa de atributos
  (atacado especializado, importação direta, logística nacional, suporte comercial). Quando a
  Vibe tiver dados oficiais, é só trocar esses itens em `PERSONAS.<visão>.autoridade`.
- **Nenhum depoimento fictício.** `DEPOIMENTOS` está vazio e, enquanto estiver, **a seção de
  prova social nem aparece no site**. Ao cadastrar o primeiro relato real, a seção se monta
  sozinha. Modelo de cada item:

```js
{
  txt: 'Depoimento real sobre giro, qualidade, pós-venda ou relacionamento com a Vibe.',
  nome: 'Nome do parceiro',
  local: 'Cidade — UF',
  perfil: 'lojista'   // 'lojista', 'tecnico' ou 'ambos'
}
```

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
  atende: ['tecnico', 'lojista'],     // em qual visão o ponto aparece
  selos: ['Atacado', 'Premium Vibe']
}
```

### Receber os leads

Por padrão (`leadWebhook` / `leadWebhookDistribuidor` apontando para
`assets/php/salvar-lead.php`), cada envio dos dois formulários — o popup do
Técnico e o "Seja um distribuidor" do Lojista — vira uma linha num CSV local,
gravado em `assets/php/leads/` (uma pasta bloqueada por `.htaccess`, ninguém
baixa o arquivo pela URL). **Só funciona em hospedagem com PHP** (Hostinger,
cPanel...). Rodando localmente com `npx serve` o PHP não executa — pra testar
de verdade é preciso subir os arquivos pra hospedagem real.

Se o site for publicado num host só de arquivo estático (GitHub Pages, Vercel,
Netlify), troque `leadWebhook`/`leadWebhookDistribuidor` por uma URL de
webhook (Zapier, Make, n8n, Google Apps Script, CRM...) ou deixe em branco
pra gravar só no navegador de quem preencheu.

O envio é um `POST` com corpo JSON — `{ nome, whatsapp, whatsappFmt, perfil, origem, data }`
no popup do Técnico, `{ nome, telefone, telefoneFmt, email, cep, cidadeUf, faixaCompra, perfil, origem, data }`
no "Seja um distribuidor". Se existir `window.dataLayer` (GTM), também é
disparado o evento `lead_distribuidor` (Técnico) ou `lead_distribuidor_form`
(Lojista).

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

- **Temas:** `html[data-tema="claro"]` (lojista, fundo branco) e `html[data-tema="escuro"]`
  (técnico, preto `#050609`). Todo o CSS usa tokens — não há cor fixa fora dos blocos de tema,
  então criar um terceiro tema é só duplicar um bloco.
- **Tipografia:** Archivo 800/900 nos títulos (peso próximo ao da logo), Inter no texto.
- **Logo:** vetorizada em código, no símbolo `#logo-vibe` do `index.html` — nenhuma fonte
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

Abra `http://localhost:4173` (Lojista) ou `http://localhost:4173/tecnico.html` (Técnico).
`?perfil=lojista` / `?perfil=tecnico` na URL só tem efeito se `window.PAGINA_PERSONA` não
estiver definido no arquivo — nos dois HTMLs publicados, a visão vem travada por ele.

## Publicar

São arquivos estáticos — sobem em qualquer hospedagem (Hostinger, Vercel, Netlify,
GitHub Pages, cPanel). Basta enviar `index.html`, `tecnico.html` e a pasta `assets/` para a
raiz do domínio.

## Detalhes técnicos

- Mapa: Leaflet 1.9.4 com tiles CARTO (light/dark conforme o tema) sobre dados do
  OpenStreetMap, com a atribuição mantida visível como exige a licença.
- Acessibilidade: navegação por teclado, foco preso no popup, `aria-*` nos controles,
  respeito a `prefers-reduced-motion`.
- Sem cookies de terceiros e sem rastreador embutido.
- Testado em desktop (1280px), tablet e mobile (375px), nos dois temas, sem estouro horizontal.
