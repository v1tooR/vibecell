/* ============================================================
   VIBE CELL — Conteúdo, configuração e base de distribuidoras
   ------------------------------------------------------------
   Este é o ÚNICO arquivo que precisa ser editado para trocar
   textos, linhas de produto, depoimentos, FAQ e pontos no mapa.

   Regra de conteúdo: nada de número inventado. Enquanto a Vibe
   não fornecer dados oficiais (nº de distribuidores, prazos,
   índices), as seções trabalham com atributos, não com métricas.
   ============================================================ */

const CONFIG = {
  marca: 'VIBE',
  marcaCompleta: 'Vibe Cell',
  slogan: 'Telas e frontais para smartphones',

  /* WhatsApp comercial da marca (formato internacional, só números) */
  whatsappComercial: '5511999999999',
  instagram: 'https://instagram.com/vibecell.oficial',
  siteOficial: 'https://vibecell.com.br',

  /* Episódio em destaque do Vibecast (ID do vídeo no YouTube) — usado na
     seção de card único (lojista). */
  vibecastVideoId: 'UTCaBXgikc4',

  /* Vitrine "Conheça o nosso canal" (técnico) — 4 episódios lado a lado,
     um por convidado. Só o ID do vídeo (o trecho depois de "v=" na URL). */
  vibecastCanalIds: ['UTCaBXgikc4', 'zEHEOCB0szo', '2AGfSr5vDAg', '_asVEGjyMXE'],

  /* Chave gratuita da CARTO pros tiles do mapa de distribuidores (claro/
     escuro). Sem ela, o mapa funciona só que com a marca d'água "API KEY
     REQUIRED". É de graça, não precisa criar conta e chega por e-mail em
     minutos: preencha o formulário em https://carto.com/basemaps/apikey/
     (com o domínio onde o site vai rodar) e cole a chave aqui. */
  cartoApiKey: 'cb1_2t4i_1_e17f495072781ec031d0316a',

  /* Endpoint que grava cada envio dos formulários numa linha de CSV, no
     próprio servidor (assets/php/salvar-lead.php + assets/php/leads/) —
     precisa de hospedagem com PHP (Hostinger, cPanel...). Se o site estiver
     numa hospedagem só de arquivo estático (GitHub Pages, Vercel, Netlify),
     troque essa URL por outro destino (ex.: Google Apps Script) ou deixe em
     branco pra gravar só no navegador de quem preencheu.               */
  leadWebhook: 'assets/php/salvar-lead.php',
  leadWebhookDistribuidor: 'assets/php/salvar-lead.php',

  /* Termo de garantia (botão "Baixar o termo de garantia" na seção
     Premium). Link direto de download do Google Drive.             */
  garantiaPdf: 'https://drive.google.com/uc?export=download&id=1rjcVtme7MYZnHIisDwvJYg26h1f0iqND',

  /* Visão que abre por padrão: 'lojista' (tema claro) ou 'tecnico' (escuro) */
  personaPadrao: 'lojista'
};

/* ============================================================
   1. CONTEÚDO POR PERSONA
   ============================================================ */

const PERSONAS = {

  /* ---------------------------------------------------- LOJISTA */
  lojista: {
    id: 'lojista',
    rotulo: 'Sou Lojista',
    rotuloDesc: 'Quero abastecer minha loja, revender e encontrar distribuidores.',
    tema: 'claro',

    hero: {
      eyebrow: 'Fornecedor de tela para atacado',
      titulo: 'Entre na Vibe e abasteça sua operação<br>com a tela que não volta.',
      texto: 'Todos os modelos, atendimento com gente de verdade do outro lado, 1 ano de garantia e entrega personalizada pra todo o Brasil.',
      texto2: 'A Vibe é a 01 do mercado.',
      ctaPrimario: 'Encontrar distribuidor',
      ctaSecundario: 'Conhecer as linhas',
      selos: ['Atendimento para lojistas', 'Distribuição nacional', 'Importação direta']
    },

    autoridade: [
      { i: 'box',   t: 'Atacado especializado', d: 'Produtos pensados para o mercado de reparação mobile.' },
      { i: 'globo', t: 'Importação direta',     d: 'Mais controle sobre seleção e fornecimento.' },
      { i: 'rota',  t: 'Logística nacional',    d: 'Encontre a melhor forma de abastecer sua operação.' },
      { i: 'chat',  t: 'Suporte comercial',     d: 'Atendimento para ajudar na escolha do seu mix.' }
    ],

    dores: {
      kicker: 'Por que comprar da Vibe',
      titulo: 'Quem revende tela sabe onde dói.',
      itens: [
        { t: 'Você fala com gente', d: 'Pedido, prazo e problema resolvidos com quem atende de verdade. Você não fica esperando resposta pra saber se a carga saiu.', foto: 'assets/img/dist-ceo-cliente.webp' },
        { t: 'Garantia que chega na ponta', d: '1 ano de garantia, com processo que funciona quando você precisa acionar. Prometer garantia é fácil, difícil é honrar.', foto: 'assets/img/dist-equipe.webp' },
        { t: 'Todos os modelos', d: 'Do aparelho de entrada ao topo de linha, iPhone e Android, pra você não perder venda por falta de peça.', foto: 'assets/img/dist-comparando-telas.webp' },
        { t: 'Entrega personalizada pra todo o Brasil', d: 'A logística se ajusta ao seu volume e à sua região.', foto: 'assets/img/dist-estoque.webp' }
      ]
    },

    beneficios: {
      kicker: 'Por que comprar da Vibe',
      titulo: 'Quem revende tela sabe onde dói.',
      itens: [
        { i: 'chat',  t: 'Você fala com gente',                        d: 'Pedido, prazo e problema resolvidos com quem atende de verdade. Você não fica esperando resposta pra saber se a carga saiu.' },
        { i: 'shield', t: 'Garantia que chega na ponta',                d: '1 ano de garantia, com processo que funciona quando você precisa acionar. Prometer garantia é fácil, difícil é honrar.' },
        { i: 'box',   t: 'Todos os modelos',                            d: 'Do aparelho de entrada ao topo de linha, iPhone e Android, pra você não perder venda por falta de peça.' },
        { i: 'pin',   t: 'Entrega personalizada pra todo o Brasil',     d: 'A logística se ajusta ao seu volume e à sua região.', mapa: true }
      ]
    },

    portfolio: {
      kicker: 'Tela China e tela Vibe',
      titulo: 'Tem cliente que compra por preço e tem cliente que compra por qualidade. A Vibe atende os dois.',
      fechamento: 'Você monta a prateleira com as duas e atende o balcão inteiro sem mandar cliente pro concorrente.',
      linhas: [
        {
          nome: 'Tela China (Incell)',
          texto: 'A opção de preço. Pro cliente que precisa do aparelho funcionando de novo e decide pelo orçamento.',
          foto: 'assets/img/dist-tela-china.webp'
        },
        {
          nome: 'Linha Vibe',
          destaque: true,
          texto: 'A opção de qualidade. Pro cliente que quer o aparelho igual ao que ele comprou, e pro lojista que quer parar de receber tela de volta.',
          foto: 'assets/img/dist-tela-vibe.webp'
        }
      ]
    },

    destaque: {
      kicker: 'Experiência Premium',
      titulo: 'Sua loja não precisa competir apenas por preço.',
      texto: 'Quando existem diferentes perfis de cliente, ter apenas uma opção limita sua venda. Com a Premium Vibe, sua equipe ganha uma alternativa para oferecer a quem procura mais qualidade, aumentando o valor percebido do produto e criando novas possibilidades de margem.',
      itens: [
        'Uma alternativa premium dentro do seu mix',
        'Mais argumentos para sua equipe comercial',
        'Maior percepção de valor na venda',
        'Ideal para clientes mais exigentes'
      ],
      cta: 'Quero vender Premium Vibe',
      garantiaTitulo: '1 ano de garantia que funciona',
      garantiaTexto: 'Todo mundo no mercado fala em garantia. A diferença aparece na hora que você precisa acionar. Na Vibe o processo está escrito, o prazo está escrito e quem atende é o mesmo time que te vendeu.',
      garantiaCta: 'Baixar o termo de garantia'
    },

    passos: {
      kicker: 'Passo a passo',
      titulo: 'Da Vibe para o seu estoque.',
      texto: 'Encontrar os produtos certos para sua loja pode ser simples.',
      itens: [
        { t: 'Encontre a Vibe mais próxima', d: 'Use nosso mapa para localizar uma distribuidora que atende sua região.' },
        { t: 'Fale com o distribuidor', d: 'Consulte modelos, linhas, disponibilidade e condições comerciais.' },
        { t: 'Monte seu mix', d: 'Escolha os produtos mais adequados ao perfil dos clientes da sua loja.' },
        { t: 'Venda com mais confiança', d: 'Tenha opções para diferentes necessidades e mantenha seu estoque preparado para o próximo pedido.' }
      ]
    },

    prova: {
      kicker: 'Quem já vende Vibe',
      titulo: 'Uma marca feita para quem movimenta esse mercado todos os dias.'
    },

    mapa: {
      kicker: 'Seja um distribuidor',
      titulo: 'Vibe é a 01 do mercado. Seja o distribuidor na sua região',
      texto: 'Preencha os dados e o comercial retorna com a condição pro seu volume de compra.',
      formulario: true
    },

    gate: {
      titulo: 'A Vibe mais perto do seu negócio.',
      texto: 'Informe seu nome e WhatsApp para acessar o mapa, visualizar os distribuidores disponíveis e encontrar o melhor atendimento para sua região.',
      botao: 'Ver distribuidores no mapa',
      micro: 'Leva poucos segundos · Sem criação de senha · Seus dados são usados somente para atendimento comercial'
    },

    modal: {
      titulo: 'Falta pouco para encontrar sua Vibe.',
      texto: 'Informe seus dados para liberar o mapa de distribuidores e encontrar o ponto de atendimento mais adequado para sua região.'
    },

    distGate: {
      titulo: 'Seja um distribuidor Vibe',
      texto: 'Preencha seus dados e o comercial retorna com a condição pro seu volume de compra.',
      botao: 'Quero ser distribuidor',
      micro: 'Leva poucos segundos · Sem compromisso · Seus dados são usados somente para atendimento comercial',
      modalTitulo: 'Seja um distribuidor Vibe',
      modalTexto: 'Preencha os dados abaixo para receber a condição comercial pro seu volume de compra.'
    },

    faq: {
      kicker: 'Dúvidas frequentes',
      titulo: 'Antes de abastecer sua loja',
      itens: [
        { p: 'A Vibe vende diretamente para lojistas?', r: 'A Vibe trabalha com atendimento voltado ao mercado de assistência técnica, incluindo lojistas, revendedores e operações que comercializam telas e frontais. Use o mapa para encontrar a distribuidora que atende sua região.' },
        { p: 'Onde posso comprar produtos Vibe?', r: 'Você pode utilizar nosso mapa de distribuidores para encontrar o ponto mais próximo e acessar os canais de atendimento disponíveis.' },
        { p: 'Qual a diferença entre a linha Comum e a Premium Vibe?', r: 'A linha Comum é direcionada a quem procura equilíbrio entre custo-benefício e funcionalidade. A Premium Vibe é indicada para clientes que valorizam uma experiência superior, com diferenciais como brilho mais intenso, toque responsivo e acabamento superior.' },
        { p: 'Posso comprar para revender?', r: 'Sim. A Vibe possui uma proposta voltada para profissionais e empresas que atuam no mercado de peças e reparação mobile. Consulte um distribuidor para conhecer disponibilidade e condições comerciais.' },
        { p: 'Como saber quais modelos estão disponíveis?', r: 'A disponibilidade pode variar de acordo com o estoque e distribuidor. Encontre o atendimento da sua região pelo mapa e consulte os modelos disponíveis diretamente pelo WhatsApp.' },
        { p: 'A Vibe atende todo o Brasil?', r: 'A Vibe trabalha com logística e distribuição para diferentes regiões do país. Utilize o mapa para verificar os pontos disponíveis e encontrar a melhor opção de atendimento para sua localização.' },
        { p: 'Como escolher quais telas colocar no meu estoque?', r: 'Isso depende do perfil dos seus clientes, modelos com maior procura e posicionamento da sua loja. O atendimento comercial pode ajudar você a identificar opções adequadas ao seu mix.' }
      ]
    },

    ctaFinal: {
      titulo: 'Entre na Vibe.',
      texto: 'A 01 do mercado em tela para assistência técnica.',
      linhas: ['Mais variedade para vender.', 'Mais segurança para o seu negócio.', 'Mais motivos para o cliente voltar.'],
      botao: 'Quero ser distribuidor',
      faixaMarca: true
    },

    msgWhatsapp: 'Olá! Tenho uma loja e quero conhecer as linhas de tela da Vibe.',
    msgWhatsappDist: 'Olá! Sou lojista e vim pelo site da Vibe. Gostaria de consultar disponibilidade e condições.'
  },

  /* ---------------------------------------------------- TÉCNICO */
  tecnico: {
    id: 'tecnico',
    rotulo: 'Sou Técnico',
    rotuloDesc: 'Quero encontrar telas Vibe para meus reparos.',
    tema: 'escuro',

    hero: {
      eyebrow: 'Pra quem tá na bancada',
      titulo: 'Tela de qualidade na sua bancada<br>faz o cliente parar de voltar.',
      texto: 'Com tela Vibe você entrega o aparelho e dá a sua garantia sem medo.',
      texto2: 'A Vibe é a 01 do mercado e a mais conhecida entre quem conserta celular.',
      ctaPrimario: 'Ver quem vende Vibe perto de mim',
      ctaSecundario: 'Ver os modelos',
      selos: ['Foco em reparação mobile', 'Distribuição nacional', 'Importação direta']
    },

    autoridade: [
      { i: 'box',   t: 'Linhas pra cada reparo', d: 'Do serviço mais econômico ao que exige mais da tela.' },
      { i: 'globo', t: 'Importação direta',      d: 'Mais controle do início ao fim, sem depender de intermediário.' },
      { i: 'rota',  t: 'Logística nacional',     d: 'A Vibe chega até a sua bancada, em qualquer região.' },
      { i: 'chat',  t: 'Suporte comercial',      d: 'Time pronto pra tirar sua dúvida antes de fechar o pedido.' }
    ],

    beneficios: {
      kicker: 'Por que trocar com tela Vibe',
      titulo: 'Tela que volta é serviço refeito de graça.',
      texto: 'Você já sabe como é: o cliente volta duas semanas depois, você abre o aparelho de novo, gasta seu tempo e não fatura nada. Com peça boa esse retorno cai, e aí você consegue dar garantia sem apertar a margem.',
      texto2: 'A Vibe é a marca que o mercado conhece. Quando você diz pro cliente que colocou tela Vibe, isso vale alguma coisa no orçamento.'
    },

    portfolio: {
      kicker: 'Portfólio',
      titulo: 'Uma linha para cada tipo de reparo.',
      texto: 'Do serviço que preza pelo custo ao cliente que percebe cada detalhe da tela — escolha a linha certa pra cada atendimento.',
      linhas: [
        {
          nome: 'Tela Comum',
          tagline: 'Custo-benefício para o serviço do dia a dia.',
          texto: 'Feita pra quando o cliente busca equilíbrio entre preço, funcionalidade e disponibilidade. Ideal pros modelos de alta procura e pra reposição frequente da bancada.',
          rotuloLista: 'Indicada para',
          itens: ['modelos de alto giro', 'clientes sensíveis a preço', 'reparos orientados a custo-benefício', 'reposição frequente de estoque'],
          cta: 'Consultar disponibilidade'
        },
        {
          nome: 'Premium Vibe',
          destaque: true,
          tagline: 'Mais qualidade para quem exige mais da tela.',
          texto: 'Pensada pra quem valoriza uma experiência de uso superior — e um argumento a mais na hora de cobrar pelo serviço bem entregue.',
          rotuloLista: 'Destaques',
          itens: ['brilho mais intenso', 'toque responsivo', 'acabamento superior', 'maior percepção de qualidade'],
          cta: 'Conhecer a Premium Vibe'
        }
      ]
    },

    destaque: {
      kicker: 'Experiência Premium',
      titulo: 'Seu serviço não precisa ser cobrado apenas pelo preço da peça.',
      texto: 'Quando o cliente percebe diferença na tela, o reparo deixa de ser comparado só por valor. Com a Premium Vibe você oferece uma alternativa superior para quem exige mais e valoriza o resultado final do serviço.',
      itens: [
        'Uma alternativa premium para oferecer no balcão',
        'Mais argumentos na hora de explicar o orçamento',
        'Maior percepção de valor no seu serviço',
        'Ideal para clientes mais exigentes'
      ],
      cta: 'Quero trabalhar com a Premium Vibe',
      garantiaTitulo: '1 ano de garantia que funciona',
      garantiaTexto: 'Todo mundo no mercado fala em garantia. A diferença aparece na hora que você precisa acionar. Na Vibe o processo está escrito, o prazo está escrito e quem atende é o mesmo time que te vendeu.',
      garantiaCta: 'Baixar o termo de garantia'
    },

    passos: {
      kicker: 'Passo a passo',
      titulo: 'Da Vibe para a sua bancada.',
      texto: 'Encontrar a tela certa para o seu reparo pode ser simples.',
      itens: [
        { t: 'Encontre a Vibe mais próxima', d: 'Use nosso mapa para localizar uma distribuidora que atende sua região.' },
        { t: 'Fale com o distribuidor', d: 'Consulte modelos, linhas, disponibilidade e condições comerciais.' },
        { t: 'Escolha a linha do serviço', d: 'Defina entre Tela Comum e Premium Vibe conforme o que o cliente espera do reparo.' },
        { t: 'Entregue com mais segurança', d: 'Trabalhe com peças consistentes e mantenha seu estoque de bancada preparado.' }
      ]
    },

    prova: {
      kicker: 'Quem já trabalha com a Vibe',
      titulo: 'Uma marca feita para quem movimenta esse mercado todos os dias.'
    },

    mapa: {
      kicker: 'Onde encontrar',
      titulo: 'Encontre uma distribuidora Vibe perto da sua bancada.',
      texto: 'Veja no mapa o ponto mais próximo e fale direto com quem atende a sua região.'
    },

    gate: {
      titulo: 'A Vibe mais perto do seu trabalho.',
      texto: 'Informe seu nome e WhatsApp para acessar o mapa, visualizar os distribuidores disponíveis e encontrar o melhor atendimento para sua região.',
      botao: 'Ver distribuidores no mapa',
      micro: 'Leva poucos segundos · Sem criação de senha · Seus dados são usados somente para atendimento comercial'
    },

    modal: {
      titulo: 'Falta pouco para encontrar sua Vibe.',
      texto: 'Informe seus dados para liberar o mapa de distribuidores e encontrar o ponto de atendimento mais adequado para sua região.'
    },

    faq: {
      kicker: 'Dúvidas frequentes',
      titulo: 'Antes de fechar o pedido',
      itens: [
        { p: 'A Vibe vende diretamente para técnicos?', r: 'Sim. O atendimento da Vibe cobre técnicos, assistências técnicas, lojistas e revendedores. Use o mapa pra encontrar a distribuidora que atende a sua região.' },
        { p: 'Onde posso comprar produtos Vibe?', r: 'Pelo mapa de distribuidores. Encontre o ponto mais próximo e fale direto pelos canais de atendimento disponíveis.' },
        { p: 'Qual a diferença entre a linha Comum e a Premium Vibe?', r: 'A Tela Comum entrega equilíbrio entre custo-benefício e funcionalidade. A Premium Vibe é pra quando o cliente exige mais: brilho mais intenso, toque responsivo e acabamento superior.' },
        { p: 'Como saber quais modelos estão disponíveis?', r: 'A disponibilidade varia por estoque e distribuidor. Encontre o atendimento da sua região pelo mapa e confirme os modelos direto pelo WhatsApp.' },
        { p: 'A Vibe atende todo o Brasil?', r: 'Sim, a distribuição cobre diferentes regiões do país. Use o mapa pra ver os pontos disponíveis perto de você.' },
        { p: 'Posso comprar para revender?', r: 'Sim. A Vibe atende profissionais e empresas do mercado de peças e reparação mobile. Fale com um distribuidor pra conhecer disponibilidade e condições.' },
        { p: 'Como escolher qual linha usar em cada reparo?', r: 'Depende do que o cliente espera do aparelho. O atendimento comercial ajuda a indicar a linha certa pra cada tipo de serviço.' }
      ]
    },

    ctaFinal: {
      titulo: 'A próxima tela da sua bancada pode ser a que resolve de vez.',
      texto: 'Encontre uma distribuidora Vibe perto de você e escolha a linha certa pra cada reparo.',
      linhas: ['Mais opções para cada serviço.', 'Mais segurança na entrega.', 'Mais motivos para o cliente voltar.'],
      botao: 'Encontrar distribuidor',
      botao2: 'Falar com a Vibe'
    },

    msgWhatsapp: 'Olá! Sou técnico e quero conhecer as linhas de tela da Vibe.',
    msgWhatsappDist: 'Olá! Sou técnico e vim pelo site da Vibe. Gostaria de consultar disponibilidade de telas.'
  }
};

/* ============================================================
   2. DEPOIMENTOS
   ------------------------------------------------------------
   Usar SOMENTE relatos reais de lojistas, revendedores, técnicos
   e distribuidores parceiros. Enquanto a lista estiver vazia, a
   seção de prova social não aparece no site.

   Modelo:
   { txt: 'Depoimento real sobre giro, qualidade, pós-venda ou
           relacionamento com a Vibe.',
     nome: 'Nome do parceiro',
     local: 'Cidade — UF',
     perfil: 'lojista' }   // 'lojista', 'tecnico' ou 'ambos'
   ============================================================ */

const DEPOIMENTOS = [];

/* ============================================================
   3. DISTRIBUIDORAS
   ------------------------------------------------------------
   Para adicionar um ponto: copie um bloco, troque os dados e
   informe latitude/longitude (no Google Maps, clique com o botão
   direito no local e copie as coordenadas).
   'atende' define em qual visão o ponto aparece.
   ============================================================ */

const DISTRIBUIDORAS = [
  { id: 1,  nome: 'Vibe São Paulo — Matriz', cidade: 'São Paulo', uf: 'SP', regiao: 'Sudeste', endereco: 'Av. Paulista, 1000 — Bela Vista', cep: '01310-100', horario: 'Seg a Sex 8h–18h · Sáb 9h–13h', tel: '(11) 3000-1000', whatsapp: '5511999990001', lat: -23.5614, lng: -46.6559, atende: ['tecnico', 'lojista'], selos: ['Matriz', 'Atacado', 'Premium Vibe'] },
  { id: 2,  nome: 'Vibe Campinas', cidade: 'Campinas', uf: 'SP', regiao: 'Sudeste', endereco: 'R. Barão de Jaguara, 1200 — Centro', cep: '13015-002', horario: 'Seg a Sex 8h–18h', tel: '(19) 3000-2000', whatsapp: '5519999990002', lat: -22.9056, lng: -47.0608, atende: ['tecnico', 'lojista'], selos: ['Atacado', 'Premium Vibe'] },
  { id: 3,  nome: 'Vibe Vale do Paraíba', cidade: 'São José dos Campos', uf: 'SP', regiao: 'Sudeste', endereco: 'Av. São João, 2200 — Jardim Esplanada', cep: '12242-000', horario: 'Seg a Sex 8h30–18h', tel: '(12) 3000-3000', whatsapp: '5512999990003', lat: -23.2107, lng: -45.8958, atende: ['tecnico', 'lojista'], selos: ['Atacado'] },
  { id: 4,  nome: 'Vibe Rio de Janeiro', cidade: 'Rio de Janeiro', uf: 'RJ', regiao: 'Sudeste', endereco: 'Av. Rio Branco, 156 — Centro', cep: '20040-901', horario: 'Seg a Sex 9h–18h', tel: '(21) 3000-4000', whatsapp: '5521999990004', lat: -22.9068, lng: -43.1789, atende: ['tecnico', 'lojista'], selos: ['Atacado', 'Premium Vibe'] },
  { id: 5,  nome: 'Vibe Belo Horizonte', cidade: 'Belo Horizonte', uf: 'MG', regiao: 'Sudeste', endereco: 'Av. Afonso Pena, 3000 — Funcionários', cep: '30130-009', horario: 'Seg a Sex 8h–18h', tel: '(31) 3000-5000', whatsapp: '5531999990005', lat: -19.9320, lng: -43.9378, atende: ['tecnico', 'lojista'], selos: ['Atacado'] },
  { id: 6,  nome: 'Vibe Vitória', cidade: 'Vitória', uf: 'ES', regiao: 'Sudeste', endereco: 'Av. N. Sra. dos Navegantes, 675 — Enseada do Suá', cep: '29050-335', horario: 'Seg a Sex 9h–18h', tel: '(27) 3000-6000', whatsapp: '5527999990006', lat: -20.3155, lng: -40.2925, atende: ['lojista'], selos: ['Foco em revenda'] },
  { id: 7,  nome: 'Vibe Curitiba', cidade: 'Curitiba', uf: 'PR', regiao: 'Sul', endereco: 'R. XV de Novembro, 500 — Centro', cep: '80020-310', horario: 'Seg a Sex 8h30–18h', tel: '(41) 3000-7000', whatsapp: '5541999990007', lat: -25.4296, lng: -49.2713, atende: ['tecnico', 'lojista'], selos: ['Atacado', 'Premium Vibe'] },
  { id: 8,  nome: 'Vibe Porto Alegre', cidade: 'Porto Alegre', uf: 'RS', regiao: 'Sul', endereco: 'Av. Borges de Medeiros, 800 — Centro Histórico', cep: '90020-025', horario: 'Seg a Sex 8h–17h30', tel: '(51) 3000-8000', whatsapp: '5551999990008', lat: -30.0346, lng: -51.2177, atende: ['tecnico', 'lojista'], selos: ['Atacado'] },
  { id: 9,  nome: 'Vibe Florianópolis', cidade: 'Florianópolis', uf: 'SC', regiao: 'Sul', endereco: 'R. Felipe Schmidt, 300 — Centro', cep: '88010-001', horario: 'Seg a Sex 9h–18h', tel: '(48) 3000-9000', whatsapp: '5548999990009', lat: -27.5954, lng: -48.5480, atende: ['tecnico'], selos: ['Foco técnico'] },
  { id: 10, nome: 'Vibe Salvador', cidade: 'Salvador', uf: 'BA', regiao: 'Nordeste', endereco: 'Av. Tancredo Neves, 1200 — Caminho das Árvores', cep: '41820-021', horario: 'Seg a Sex 8h–17h', tel: '(71) 3000-1100', whatsapp: '5571999990010', lat: -12.9777, lng: -38.5016, atende: ['tecnico', 'lojista'], selos: ['Atacado'] },
  { id: 11, nome: 'Vibe Recife', cidade: 'Recife', uf: 'PE', regiao: 'Nordeste', endereco: 'Av. Conde da Boa Vista, 900 — Boa Vista', cep: '50060-004', horario: 'Seg a Sex 8h–17h30', tel: '(81) 3000-1200', whatsapp: '5581999990011', lat: -8.0578, lng: -34.8829, atende: ['tecnico', 'lojista'], selos: ['Atacado', 'Premium Vibe'] },
  { id: 12, nome: 'Vibe Fortaleza', cidade: 'Fortaleza', uf: 'CE', regiao: 'Nordeste', endereco: 'Av. Dom Luís, 500 — Meireles', cep: '60160-230', horario: 'Seg a Sex 8h–17h', tel: '(85) 3000-1300', whatsapp: '5585999990012', lat: -3.7327, lng: -38.5267, atende: ['lojista'], selos: ['Foco em revenda'] },
  { id: 13, nome: 'Vibe Brasília', cidade: 'Brasília', uf: 'DF', regiao: 'Centro-Oeste', endereco: 'SCS Quadra 2, Bloco C — Asa Sul', cep: '70302-000', horario: 'Seg a Sex 9h–18h', tel: '(61) 3000-1400', whatsapp: '5561999990013', lat: -15.7975, lng: -47.8919, atende: ['tecnico', 'lojista'], selos: ['Atacado'] },
  { id: 14, nome: 'Vibe Goiânia', cidade: 'Goiânia', uf: 'GO', regiao: 'Centro-Oeste', endereco: 'Av. T-63, 1500 — Setor Bueno', cep: '74230-100', horario: 'Seg a Sex 8h–18h', tel: '(62) 3000-1500', whatsapp: '5562999990014', lat: -16.7073, lng: -49.2648, atende: ['tecnico', 'lojista'], selos: ['Atacado'] },
  { id: 15, nome: 'Vibe Manaus', cidade: 'Manaus', uf: 'AM', regiao: 'Norte', endereco: 'Av. Djalma Batista, 1800 — Chapada', cep: '69050-010', horario: 'Seg a Sex 8h–17h', tel: '(92) 3000-1600', whatsapp: '5592999990015', lat: -3.1019, lng: -60.0250, atende: ['tecnico', 'lojista'], selos: ['Atacado'] },
  { id: 16, nome: 'Vibe Belém', cidade: 'Belém', uf: 'PA', regiao: 'Norte', endereco: 'Av. Almirante Barroso, 2000 — Marco', cep: '66093-020', horario: 'Seg a Sex 8h–17h', tel: '(91) 3000-1700', whatsapp: '5591999990016', lat: -1.4558, lng: -48.4902, atende: ['lojista'], selos: ['Foco em revenda'] }
];
