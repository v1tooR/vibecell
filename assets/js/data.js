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
  siteOficial: 'https://vibecelloficial.com.br',

  /* Episódio em destaque do Vibecast (ID do vídeo no YouTube) — usado na
     seção de card único (distribuidor). */
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

  /* Opções de "média de compra de telas por mês" no formulário
     "Quero comprar Vibe". `v` é o que vai pro CSV e pro WhatsApp
     (curto, sem acento); `t` é o que o visitante lê na tela.
     Pra mudar as faixas, é só editar esta lista.               */
  faixasCompraTelas: [
    { v: 'ate-100',   t: 'até 100 telas' },
    { v: '100-300',   t: '100 a 300 telas' },
    { v: '300-1000',  t: '300 a 1.000 telas' },
    { v: 'mais-1000', t: 'mais de 1.000 telas' }
  ],

  /* Termo de garantia (botão "Baixar o termo de garantia" na seção
     Premium). Link direto de download do Google Drive.             */
  garantiaPdf: 'https://drive.google.com/uc?export=download&id=1rjcVtme7MYZnHIisDwvJYg26h1f0iqND',

  /* Visão que abre por padrão: 'distribuidor' (tema claro) ou 'tecnico' (escuro) */
  personaPadrao: 'distribuidor'
};

/* ============================================================
   1. CONTEÚDO POR PERSONA
   ============================================================ */

const PERSONAS = {

  /* ------------------------------------------------ DISTRIBUIDOR */
  distribuidor: {
    id: 'distribuidor',
    rotulo: 'Sou Distribuidor',
    rotuloDesc: 'Quero comprar Vibe pra minha distribuidora.',
    tema: 'claro',

    hero: {
      eyebrow: 'Fornecedor de tela para atacado',
      titulo: 'Entre na Vibe e abasteça sua distribuidora<br>com a tela que não volta.',
      texto: 'Todos os modelos, atendimento com gente de verdade do outro lado, 1 ano de garantia e entrega personalizada pra todo o Brasil.',
      texto2: 'A Vibe é a 01 do mercado.',
      ctaPrimario: 'Quero comprar Vibe',
      ctaSecundario: 'Conhecer as linhas',
      selos: ['Atendimento para distribuidoras', 'Distribuição nacional', 'Importação direta']
    },

    autoridade: [
      { i: 'box',   t: 'Atacado especializado', d: 'Produtos pensados para o mercado de reparação mobile.' },
      { i: 'globo', t: 'Importação direta',     d: 'Mais controle sobre seleção e fornecimento.' },
      { i: 'rota',  t: 'Logística nacional',    d: 'Encontre a melhor forma de abastecer sua distribuidora.' },
      { i: 'chat',  t: 'Suporte comercial',     d: 'Atendimento para ajudar na escolha do seu mix.' }
    ],

    dores: {
      kicker: 'Por que comprar da Vibe',
      titulo: 'Quem distribui tela sabe onde dói.',
      itens: [
        { t: 'Você fala com gente', d: 'Pedido, prazo e problema resolvidos com quem atende de verdade. Você não fica esperando resposta pra saber se a carga saiu.', foto: 'assets/img/dist-ceo-cliente.webp' },
        { t: 'Garantia que chega na ponta', d: '1 ano de garantia, com processo que funciona quando você precisa acionar. Prometer garantia é fácil, difícil é honrar.', foto: 'assets/img/dist-equipe.webp' },
        { t: 'Todos os modelos', d: 'Do aparelho de entrada ao topo de linha, iPhone e Android, pra você não perder venda por falta de peça.', foto: 'assets/img/dist-comparando-telas.webp' },
        { t: 'Entrega personalizada pra todo o Brasil', d: 'A logística se ajusta ao seu volume e à sua região.', foto: 'assets/img/dist-estoque.webp' }
      ]
    },

    beneficios: {
      kicker: 'Por que comprar da Vibe',
      titulo: 'Quem distribui tela sabe onde dói.',
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
      fechamento: 'Você monta o estoque com as duas e atende a sua carteira inteira sem mandar cliente pro concorrente.',
      linhas: [
        {
          nome: 'Tela China (Incell)',
          texto: 'A opção de preço. Pro cliente que precisa do aparelho funcionando de novo e decide pelo orçamento.',
          foto: 'assets/img/dist-tela-china.webp'
        },
        {
          nome: 'Linha Vibe',
          destaque: true,
          texto: 'A opção de qualidade. Pro cliente que quer o aparelho igual ao que ele comprou, e pra distribuidora que quer parar de receber tela de volta.',
          foto: 'assets/img/vibe-linha-vibe-display.webp'
        }
      ]
    },

    destaque: {
      kicker: 'Experiência Premium',
      titulo: 'Sua distribuidora não precisa competir apenas por preço.',
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
      titulo: 'Da Vibe para a sua distribuidora.',
      texto: 'Começar a comprar Vibe pro seu estoque pode ser simples.',
      itens: [
        { t: 'Deixe seus dados', d: 'Nome, endereço, telefone e a sua média de compra de telas por mês.' },
        { t: 'Fale com o comercial da Vibe', d: 'A conversa cai direto no WhatsApp: linhas, disponibilidade e condição pro seu volume.' },
        { t: 'Monte seu mix', d: 'Escolha as linhas mais adequadas ao perfil dos clientes que a sua distribuidora atende.' },
        { t: 'Abasteça a sua região', d: 'Receba a carga com a logística ajustada ao seu volume e mantenha o estoque pronto pro próximo pedido.' }
      ]
    },

    prova: {
      kicker: 'Quem já compra Vibe',
      titulo: 'Uma marca feita para quem movimenta esse mercado todos os dias.'
    },

    /* cabeçalho da seção de feedbacks em vídeo (os cards vêm de FEEDBACKS) */
    feedbacks: {
      kicker: 'Feedbacks',
      titulo: 'Quem já compra Vibe fala por nós.',
      texto: 'Distribuidores que trabalham com a marca contando, na frente da câmera, o que muda no dia a dia de quem revende tela.'
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
      titulo: 'Quero comprar Vibe pra minha distribuidora',
      texto: 'Preencha seus dados e o comercial retorna com a condição pro seu volume de compra.',
      botao: 'Quero comprar Vibe',
      micro: 'Leva poucos segundos · Sem compromisso · Seus dados são usados somente para atendimento comercial',
      modalTitulo: 'Quero comprar Vibe pra minha distribuidora',
      modalTexto: 'Preencha os dados abaixo. Ao enviar, a conversa abre direto no WhatsApp da Vibe com tudo preenchido.'
    },

    faq: {
      kicker: 'Dúvidas frequentes',
      titulo: 'Antes de abastecer sua distribuidora',
      itens: [
        { p: 'A Vibe vende diretamente para distribuidoras?', r: 'Sim. A Vibe trabalha com atendimento voltado ao mercado de assistência técnica, incluindo distribuidoras, lojistas, revendedores e operações que comercializam telas e frontais. Preencha o formulário e o comercial fala com você pelo WhatsApp.' },
        { p: 'Como começo a comprar Vibe?', r: 'Preencha nome, endereço, telefone e a sua média de compra de telas por mês. Ao enviar, a conversa abre direto no WhatsApp da Vibe com esses dados, e o comercial retorna com a condição pro seu volume.' },
        { p: 'Qual a diferença entre a linha Comum e a Premium Vibe?', r: 'A linha Comum é direcionada a quem procura equilíbrio entre custo-benefício e funcionalidade. A Premium Vibe é indicada para clientes que valorizam uma experiência superior, com diferenciais como brilho mais intenso, toque responsivo e acabamento superior.' },
        { p: 'Posso comprar para revender?', r: 'Sim. A Vibe possui uma proposta voltada para profissionais e empresas que atuam no mercado de peças e reparação mobile. Fale com o comercial para conhecer disponibilidade e condições.' },
        { p: 'Como saber quais modelos estão disponíveis?', r: 'A disponibilidade pode variar de acordo com o estoque. Fale com o comercial da Vibe pelo WhatsApp e consulte os modelos disponíveis pro seu pedido.' },
        { p: 'A Vibe atende todo o Brasil?', r: 'A Vibe trabalha com logística e distribuição para diferentes regiões do país. Informe a sua região no formulário e o comercial retorna com a melhor opção de atendimento.' },
        { p: 'Como escolher quais telas colocar no meu estoque?', r: 'Isso depende do perfil dos seus clientes, modelos com maior procura e posicionamento da sua distribuidora. O atendimento comercial pode ajudar você a identificar opções adequadas ao seu mix.' }
      ]
    },

    ctaFinal: {
      titulo: 'Entre na Vibe.',
      texto: 'A 01 do mercado em tela para assistência técnica.',
      linhas: ['Mais variedade para vender.', 'Mais segurança para o seu negócio.', 'Mais motivos para o cliente voltar.'],
      botao: 'Quero comprar Vibe',
      faixaMarca: true
    },

    msgWhatsapp: 'Olá! Tenho uma distribuidora e quero comprar Vibe pra ela.',
    msgWhatsappDist: 'Olá! Sou distribuidor e vim pelo site da Vibe. Gostaria de consultar disponibilidade e condições.'
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

    /* cabeçalho da seção de feedbacks em vídeo (os cards vêm de FEEDBACKS) */
    feedbacks: {
      kicker: 'Feedbacks',
      titulo: 'Quem já trabalha com Vibe fala por nós.',
      texto: 'Distribuidores e parceiros contando, na frente da câmera, o que muda na bancada quando a tela é Vibe.'
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
     perfil: 'distribuidor' }   // 'distribuidor', 'tecnico' ou 'ambos'
   ============================================================ */

const DEPOIMENTOS = [];

/* ============================================================
   2b. FEEDBACKS EM VÍDEO (reels do @vibecell.oficial)
   ------------------------------------------------------------
   A seção "Feedbacks" das duas páginas. Cada item é um reel real
   do Instagram da Vibe: o card mostra uma capa local (rápida, no
   visual do site) e só carrega o player do Instagram quando o
   visitante clica — nada de terceiro roda antes disso.

   Como adicionar um feedback novo:
   1. copie o código do reel (o trecho depois de /reel/ na URL);
   2. salve um frame de capa em assets/img/ (proporção 9:16);
   3. copie um bloco abaixo e troque os campos.

   REGRA: `txt` descreve o que a pessoa realmente diz no vídeo —
   nada de frase inventada. Se não souber o que ela fala, use uma
   descrição neutra do vídeo.

   `perfil` diz em qual visão o card aparece:
   'distribuidor', 'tecnico' ou 'ambos'.
   ============================================================ */

const FEEDBACKS = [
  {
    code: 'DZVnF1dDzSK',
    capa: 'assets/img/feedback-ivo.webp',
    nome: 'Ivo',
    local: 'Vibe Distribuidora FSA',
    txt: 'Há cerca de 6 anos abastecendo com a Vibe. Fala da qualidade das telas, do brilho e da evolução da linha ao longo da parceria.',
    perfil: 'ambos'
  },
  {
    code: 'DZfX32fO_ve',
    capa: 'assets/img/feedback-antonio.webp',
    nome: 'Antônio',
    local: 'Parceiro Vibe',
    txt: 'Destaca a consistência: o mesmo padrão de qualidade lote após lote. Nas palavras dele, uma qualidade difícil de igualar.',
    perfil: 'ambos'
  },
  {
    code: 'DZ_AxbMJP0E',
    capa: 'assets/img/feedback-ramon.webp',
    nome: 'Ramon',
    local: 'Distribuidor Vibe — Rio Grande do Norte',
    txt: 'Distribuidor Vibe no Rio Grande do Norte, com duas distribuidoras, conta como é trabalhar com a marca.',
    perfil: 'ambos'
  }
];

/* ============================================================
   3. DISTRIBUIDORAS
   ------------------------------------------------------------
   Para adicionar um ponto: copie um bloco, troque os dados e
   informe latitude/longitude (no Google Maps, clique com o botão
   direito no local e copie as coordenadas).
   'atende' define em qual visão o ponto aparece.
   ============================================================ */

const DISTRIBUIDORAS = [
  /* Rede Papo Reto (RJ) — contato único para todas as unidades */
  { id: 17, nome: 'Papo Reto Santa Cruz', cidade: 'Rio de Janeiro', uf: 'RJ', regiao: 'Sudeste', endereco: 'Av. Isabel, 29 — Santa Cruz', cep: '23510-151', horario: 'Consulte pelo WhatsApp', tel: '(21) 99955-9162', whatsapp: '5521999559162', lat: -22.9233, lng: -43.6858, atende: ['tecnico', 'distribuidor'], selos: [] },
  { id: 18, nome: 'Papo Reto Campo Grande', cidade: 'Rio de Janeiro', uf: 'RJ', regiao: 'Sudeste', endereco: 'R. Campo Grande, 90 — Campo Grande', cep: '23085-360', horario: 'Consulte pelo WhatsApp', tel: '(21) 99955-9162', whatsapp: '5521999559162', lat: -22.9046, lng: -43.5736, atende: ['tecnico', 'distribuidor'], selos: [] },
  { id: 19, nome: 'Papo Reto Queimados', cidade: 'Queimados', uf: 'RJ', regiao: 'Sudeste', endereco: 'Av. Irmãos Guinle, 999 — Rodoviário', cep: '26323-130', horario: 'Consulte pelo WhatsApp', tel: '(21) 99955-9162', whatsapp: '5521999559162', lat: -22.7052, lng: -43.5727, atende: ['tecnico', 'distribuidor'], selos: [] },
  { id: 20, nome: 'Papo Reto Recreio', cidade: 'Rio de Janeiro', uf: 'RJ', regiao: 'Sudeste', endereco: 'R. Arquiteto, 109 — Recreio dos Bandeirantes', cep: '22795-565', horario: 'Consulte pelo WhatsApp', tel: '(21) 99955-9162', whatsapp: '5521999559162', lat: -23.0250, lng: -43.4815, atende: ['tecnico', 'distribuidor'], selos: [] },
  { id: 21, nome: 'Papo Reto Bangu', cidade: 'Rio de Janeiro', uf: 'RJ', regiao: 'Sudeste', endereco: 'R. Francisco Real, 1950 — Bangu', cep: '21810-042', horario: 'Consulte pelo WhatsApp', tel: '(21) 99955-9162', whatsapp: '5521999559162', lat: -22.8791, lng: -43.4506, atende: ['tecnico', 'distribuidor'], selos: [] },
  { id: 22, nome: 'Papo Reto NI 1 Camelô', cidade: 'Nova Iguaçu', uf: 'RJ', regiao: 'Sudeste', endereco: 'Camelódromo de Nova Iguaçu, 215 — Centro', cep: '26216-032', horario: 'Consulte pelo WhatsApp', tel: '(21) 99955-9162', whatsapp: '5521999559162', lat: -22.7574, lng: -43.4431, atende: ['tecnico', 'distribuidor'], selos: [] },
  { id: 23, nome: 'Papo Reto NI 2 Loja', cidade: 'Nova Iguaçu', uf: 'RJ', regiao: 'Sudeste', endereco: 'R. José Hipólito de Oliveira, 58 — Centro', cep: '26210-130', horario: 'Consulte pelo WhatsApp', tel: '(21) 99955-9162', whatsapp: '5521999559162', lat: -22.7590, lng: -43.4479, atende: ['tecnico', 'distribuidor'], selos: [] },
  { id: 24, nome: 'Papo Reto Nilópolis', cidade: 'Nilópolis', uf: 'RJ', regiao: 'Sudeste', endereco: 'Av. Getúlio Vargas, 1577 — Centro', cep: '26510-014', horario: 'Consulte pelo WhatsApp', tel: '(21) 99955-9162', whatsapp: '5521999559162', lat: -22.8099, lng: -43.4169, atende: ['tecnico', 'distribuidor'], selos: [] },
  { id: 25, nome: 'Papo Reto Belford Roxo', cidade: 'Belford Roxo', uf: 'RJ', regiao: 'Sudeste', endereco: 'R. João Fernandes Neto, 1436 — Centro', cep: '26130-050', horario: 'Consulte pelo WhatsApp', tel: '(21) 99955-9162', whatsapp: '5521999559162', lat: -22.7671, lng: -43.3978, atende: ['tecnico', 'distribuidor'], selos: [] },
  { id: 26, nome: 'Papo Reto São João de Meriti', cidade: 'São João de Meriti', uf: 'RJ', regiao: 'Sudeste', endereco: 'Av. Nossa Senhora das Graças, 34 — Centro', cep: '25515-001', horario: 'Consulte pelo WhatsApp', tel: '(21) 99955-9162', whatsapp: '5521999559162', lat: -22.8007, lng: -43.3714, atende: ['tecnico', 'distribuidor'], selos: [] },
  { id: 27, nome: 'Papo Reto Rio das Pedras', cidade: 'Rio de Janeiro', uf: 'RJ', regiao: 'Sudeste', endereco: 'Av. Engenheiro Souza Filho, 511 — Jacarepaguá', cep: '22753-039', horario: 'Consulte pelo WhatsApp', tel: '(21) 99955-9162', whatsapp: '5521999559162', lat: -22.9796, lng: -43.3334, atende: ['tecnico', 'distribuidor'], selos: [] },
  { id: 28, nome: 'Papo Reto Vilar dos Teles', cidade: 'São João de Meriti', uf: 'RJ', regiao: 'Sudeste', endereco: 'R. Egas Muniz, 22 — Vilar dos Teles', cep: '25576-271', horario: 'Consulte pelo WhatsApp', tel: '(21) 99955-9162', whatsapp: '5521999559162', lat: -22.7347, lng: -43.3924, atende: ['tecnico', 'distribuidor'], selos: [] },
  { id: 29, nome: 'Papo Reto Lote XV', cidade: 'Belford Roxo', uf: 'RJ', regiao: 'Sudeste', endereco: 'Av. Governador Leonel de Moura Brizola, 6544 — Lote XV', cep: '26183-242', horario: 'Consulte pelo WhatsApp', tel: '(21) 99955-9162', whatsapp: '5521999559162', lat: -22.7164, lng: -43.3255, atende: ['tecnico', 'distribuidor'], selos: [] },
  { id: 30, nome: 'Papo Reto Caxias 1', cidade: 'Duque de Caxias', uf: 'RJ', regiao: 'Sudeste', endereco: 'R. Nunes Alves, 52 — Centro', cep: '25020-085', horario: 'Consulte pelo WhatsApp', tel: '(21) 99955-9162', whatsapp: '5521999559162', lat: -22.7862, lng: -43.3101, atende: ['tecnico', 'distribuidor'], selos: [] },
  { id: 31, nome: 'Papo Reto Caxias 2', cidade: 'Duque de Caxias', uf: 'RJ', regiao: 'Sudeste', endereco: 'Av. Doutor Plínio Casado, 58 — Centro', cep: '25020-010', horario: 'Consulte pelo WhatsApp', tel: '(21) 99955-9162', whatsapp: '5521999559162', lat: -22.7865, lng: -43.3097, atende: ['tecnico', 'distribuidor'], selos: [] },
  { id: 32, nome: 'Papo Reto Santa Cruz da Serra', cidade: 'Duque de Caxias', uf: 'RJ', regiao: 'Sudeste', endereco: 'Rod. Washington Luiz, 18480 — Santa Cruz da Serra', cep: '25240-005', horario: 'Consulte pelo WhatsApp', tel: '(21) 99955-9162', whatsapp: '5521999559162', lat: -22.6447, lng: -43.2837, atende: ['tecnico', 'distribuidor'], selos: [] },
  { id: 33, nome: 'Papo Reto Piabetá', cidade: 'Magé', uf: 'RJ', regiao: 'Sudeste', endereco: 'R. Eduardina Miranda Teles, 250 — Piabetá (Inhomirim)', cep: '25931-774', horario: 'Consulte pelo WhatsApp', tel: '(21) 99955-9162', whatsapp: '5521999559162', lat: -22.6107, lng: -43.1775, atende: ['tecnico', 'distribuidor'], selos: [] },
  { id: 34, nome: 'Papo Reto Niterói', cidade: 'Niterói', uf: 'RJ', regiao: 'Sudeste', endereco: 'R. Visconde do Uruguai, 477 — Centro', cep: '24030-078', horario: 'Consulte pelo WhatsApp', tel: '(21) 99955-9162', whatsapp: '5521999559162', lat: -22.8878, lng: -43.1228, atende: ['tecnico', 'distribuidor'], selos: [] },
  { id: 35, nome: 'Papo Reto Petrópolis', cidade: 'Petrópolis', uf: 'RJ', regiao: 'Sudeste', endereco: 'R. Dezesseis de Março, 336 — Centro', cep: '25620-040', horario: 'Consulte pelo WhatsApp', tel: '(21) 99955-9162', whatsapp: '5521999559162', lat: -22.5104, lng: -43.1779, atende: ['tecnico', 'distribuidor'], selos: [] },
  { id: 36, nome: 'Papo Reto Magé', cidade: 'Magé', uf: 'RJ', regiao: 'Sudeste', endereco: 'Tv. Renato Pereira de Miranda, 27 — Centro', cep: '25900-091', horario: 'Consulte pelo WhatsApp', tel: '(21) 99955-9162', whatsapp: '5521999559162', lat: -22.6562, lng: -43.0388, atende: ['tecnico', 'distribuidor'], selos: [] },
  { id: 37, nome: 'Papo Reto São Gonçalo', cidade: 'São Gonçalo', uf: 'RJ', regiao: 'Sudeste', endereco: 'R. Manuel João Gonçalves, 434 — Alcântara', cep: '24711-080', horario: 'Consulte pelo WhatsApp', tel: '(21) 99955-9162', whatsapp: '5521999559162', lat: -22.8198, lng: -43.0010, atende: ['tecnico', 'distribuidor'], selos: [] },
  { id: 38, nome: 'Papo Reto Maricá', cidade: 'Maricá', uf: 'RJ', regiao: 'Sudeste', endereco: 'R. 32, 3928 — Jardim Atlântico Oeste (Itaipuaçu)', cep: '24935-435', horario: 'Consulte pelo WhatsApp', tel: '(21) 99955-9162', whatsapp: '5521999559162', lat: -22.9621, lng: -42.9616, atende: ['tecnico', 'distribuidor'], selos: [] },
  { id: 39, nome: 'Papo Reto Itaboraí', cidade: 'Itaboraí', uf: 'RJ', regiao: 'Sudeste', endereco: 'Av. Raimundo de Farias, 86 — Centro', cep: '24800-037', horario: 'Consulte pelo WhatsApp', tel: '(21) 99955-9162', whatsapp: '5521999559162', lat: -22.7497, lng: -42.8588, atende: ['tecnico', 'distribuidor'], selos: [] },
  { id: 40, nome: 'Papo Reto Cabo Frio', cidade: 'Cabo Frio', uf: 'RJ', regiao: 'Sudeste', endereco: 'R. Raul Veiga, 585 — Centro', cep: '28907-090', horario: 'Consulte pelo WhatsApp', tel: '(21) 99955-9162', whatsapp: '5521999559162', lat: -22.8798, lng: -42.0180, atende: ['tecnico', 'distribuidor'], selos: [] },
  { id: 41, nome: 'Papo Reto Rio das Ostras', cidade: 'Rio das Ostras', uf: 'RJ', regiao: 'Sudeste', endereco: 'R. Bangu, 265 — Centro', cep: '28893-443', horario: 'Consulte pelo WhatsApp', tel: '(21) 99955-9162', whatsapp: '5521999559162', lat: -22.5182, lng: -41.9415, atende: ['tecnico', 'distribuidor'], selos: [] },
  { id: 42, nome: 'Papo Reto Campos dos Goytacazes', cidade: 'Campos dos Goytacazes', uf: 'RJ', regiao: 'Sudeste', endereco: 'Pça. Azeredo Coutinho, 6 — Centro', cep: '28010-090', horario: 'Consulte pelo WhatsApp', tel: '(21) 99955-9162', whatsapp: '5521999559162', lat: -21.7576, lng: -41.3257, atende: ['tecnico', 'distribuidor'], selos: [] },

  /* Clientes 2026 (planilha "Vibe _ Clientes") */
  { id: 43, nome: 'Vogel Cell Distribuidora de Peças de Celular', cidade: 'Curitiba', uf: 'PR', regiao: 'Sul', endereco: 'R. Dr. Júlio César Ribeiro de Souza, 890 — Hauer', cep: '81630-200', horario: 'Consulte pelo WhatsApp', tel: '(41) 98896-1819 / (41) 98878-7890 / (41) 98788-6944', whatsapp: '5541988961819', lat: -25.4804, lng: -49.2496, atende: ['tecnico', 'distribuidor'], selos: [] },
  { id: 44, nome: 'Bruneli Casa do Celular', cidade: 'Cachoeiro de Itapemirim', uf: 'ES', regiao: 'Sudeste', endereco: 'Av. Governador Cristiano Dias Lopes, 13 — Gilberto Machado', cep: '29303-320', horario: 'Consulte pelo WhatsApp', tel: '(28) 99988-6999', whatsapp: '5528999886999', lat: -20.4349, lng: -40.3320, atende: ['tecnico', 'distribuidor'], selos: [] },
  { id: 45, nome: 'MK Peças', cidade: 'São Gonçalo', uf: 'RJ', regiao: 'Sudeste', endereco: 'R. Doutor Alfredo Backer, 801 - Loja 02 — Alcântara', cep: '24710-395', horario: 'Consulte pelo WhatsApp', tel: '(21) 97236-3226', whatsapp: '5521972363226', lat: -22.8183, lng: -43.0080, atende: ['tecnico', 'distribuidor'], selos: [] },
  { id: 46, nome: 'DLN Distribuidora (Matriz)', cidade: 'Teixeira de Freitas', uf: 'BA', regiao: 'Nordeste', endereco: 'R. Teixeira de Freitas, 387 — Centro', cep: '45985-192', horario: 'Consulte pelo WhatsApp', tel: '(73) 99815-1515', whatsapp: '5573998151515', lat: -17.5385, lng: -39.7459, atende: ['tecnico', 'distribuidor'], selos: [] },
  { id: 47, nome: 'DLN Distribuidora Itamaraju (Filial 1)', cidade: 'Itamaraju', uf: 'BA', regiao: 'Nordeste', endereco: 'R. Princesa Isabel, 131 — Centro', cep: '45836-000', horario: 'Consulte pelo WhatsApp', tel: '(73) 99868-3793', whatsapp: '5573998683793', lat: -17.0340, lng: -39.5316, atende: ['tecnico', 'distribuidor'], selos: [] },
  { id: 48, nome: 'DLN Distribuidora Nanuque (Filial 2)', cidade: 'Nanuque', uf: 'MG', regiao: 'Sudeste', endereco: 'R. Caxambu, 370 - Lj 09 (Galeria Boulevard Calazans) — Centro', cep: '39860-000', horario: 'Consulte pelo WhatsApp', tel: '(33) 99124-6212', whatsapp: '5533991246212', lat: -17.8413, lng: -40.3459, atende: ['tecnico', 'distribuidor'], selos: [] },
  { id: 49, nome: 'World Mobile Barueri', cidade: 'Barueri', uf: 'SP', regiao: 'Sudeste', endereco: 'R. Campos Sales, 303 - 7º andar, Sala 708 — Vila São João', cep: '06401-000', horario: 'Consulte pelo WhatsApp', tel: '(11) 91999-2723 / (11) 95853-4751 / (11) 98368-0956', whatsapp: '5511919992723', lat: -23.5092, lng: -46.8753, atende: ['tecnico', 'distribuidor'], selos: [] },
  { id: 50, nome: 'World Mobile Itapevi', cidade: 'Itapevi', uf: 'SP', regiao: 'Sudeste', endereco: 'Av. Cesário de Abreu, 220 - Loja 04, segundo piso — Centro', cep: '06653-020', horario: 'Consulte pelo WhatsApp', tel: '(11) 95853-4580', whatsapp: '5511958534580', lat: -23.5458, lng: -46.9336, atende: ['tecnico', 'distribuidor'], selos: [] },
  { id: 51, nome: 'Mendes Cell', cidade: 'Belém', uf: 'PA', regiao: 'Norte', endereco: 'Passagem São Benedito, 233A — Sacramenta', cep: '66120-260', horario: 'Consulte pelo WhatsApp', tel: '(91) 99802-2896', whatsapp: '5591998022896', lat: -1.4130, lng: -48.4832, atende: ['tecnico', 'distribuidor'], selos: [] },
  { id: 52, nome: 'Mendes Cell (Portel)', cidade: 'Portel', uf: 'PA', regiao: 'Norte', endereco: 'R. Duque de Caxias, 37 — Portelinha', cep: '68480-129', horario: 'Consulte pelo WhatsApp', tel: '(91) 99802-2896', whatsapp: '5591998022896', lat: -1.9363, lng: -50.8247, atende: ['tecnico', 'distribuidor'], selos: [] },
  { id: 53, nome: 'Jorginho Cell Prime', cidade: 'Aracaju', uf: 'SE', regiao: 'Nordeste', endereco: 'R. Sete de Setembro (Aju Shopping) — Centro', cep: '49010-620', horario: 'Consulte pelo WhatsApp', tel: '(71) 99939-2004', whatsapp: '5571999392004', lat: -10.9080, lng: -37.0550, atende: ['tecnico', 'distribuidor'], selos: [] },
  { id: 54, nome: 'Kartal Distribuidora', cidade: 'Lajeado', uf: 'RS', regiao: 'Sul', endereco: 'R. Júlio de Castilhos, 745 - Sl 304 — Centro', cep: '95900-022', horario: 'Consulte pelo WhatsApp', tel: '(51) 9151-0859', whatsapp: '555191510859', lat: -29.4647, lng: -51.9644, atende: ['tecnico', 'distribuidor'], selos: [] },
  { id: 55, nome: 'Cell.com', cidade: 'Teresina', uf: 'PI', regiao: 'Nordeste', endereco: 'Av. Maranhão, 300 (Shopping da Cidade) — Centro', cep: '64000-010', horario: 'Consulte pelo WhatsApp', tel: '(86) 99835-2029', whatsapp: '5586998352029', lat: -5.0913, lng: -42.8190, atende: ['tecnico', 'distribuidor'], selos: [] },
  { id: 56, nome: 'LivreCell', cidade: 'Goiânia', uf: 'GO', regiao: 'Centro-Oeste', endereco: 'Av. Anhanguera, 8044 — Setor Campinas', cep: '74503-923', horario: 'Consulte pelo WhatsApp', tel: '(62) 98270-2462', whatsapp: '5562982702462', lat: -16.6731, lng: -49.2853, atende: ['tecnico', 'distribuidor'], selos: [] },
  { id: 57, nome: 'New Distribuidora (Blumenau)', cidade: 'Blumenau', uf: 'SC', regiao: 'Sul', endereco: 'R. Sete de Setembro, 2581 - Sala 103 — Centro', cep: '89012-401', horario: 'Consulte pelo WhatsApp', tel: '(47) 98844-4690', whatsapp: '5547988444690', lat: -26.9130, lng: -49.0795, atende: ['tecnico', 'distribuidor'], selos: [] },
  { id: 58, nome: 'Royalle Atacadista (Loja 1)', cidade: 'Curitiba', uf: 'PR', regiao: 'Sul', endereco: 'R. Lourenço Pinto, 118 — Centro', cep: '80010-160', horario: 'Consulte pelo WhatsApp', tel: '(41) 99920-2187', whatsapp: '5541999202187', lat: -25.4346, lng: -49.2690, atende: ['tecnico', 'distribuidor'], selos: [] },
  { id: 59, nome: 'Royalle Atacadista (Loja 2)', cidade: 'Pontal do Paraná', uf: 'PR', regiao: 'Sul', endereco: 'Rod. Argus Thá Heyn (PR-412), 47 — Balneário Praia de Leste', cep: '83255-000', horario: 'Consulte pelo WhatsApp', tel: '(41) 99920-2187', whatsapp: '5541999202187', lat: -25.6972, lng: -48.4760, atende: ['tecnico', 'distribuidor'], selos: [] },
  { id: 60, nome: 'Rio Cell (Prazeres)', cidade: 'Jaboatão dos Guararapes', uf: 'PE', regiao: 'Nordeste', endereco: 'Av. Barreto de Menezes, s/n (Mercado das Mangueiras) — Prazeres', cep: '54310-310', horario: 'Consulte pelo WhatsApp', tel: '(81) 99334-1995', whatsapp: '5581993341995', lat: -8.1617, lng: -34.9279, atende: ['tecnico', 'distribuidor'], selos: [] },
  { id: 61, nome: 'Rio Cell (Porto de Galinhas)', cidade: 'Ipojuca', uf: 'PE', regiao: 'Nordeste', endereco: 'R. do Comércio, 19 — Nossa Senhora do Ó', cep: '55592-302', horario: 'Consulte pelo WhatsApp', tel: '(81) 98242-5063', whatsapp: '5581982425063', lat: -8.4424, lng: -35.0143, atende: ['tecnico', 'distribuidor'], selos: [] },
  { id: 62, nome: 'New Distribuidora (São José)', cidade: 'São José', uf: 'SC', regiao: 'Sul', endereco: 'R. Altamiro Di Bernardi, 760 - Sala 3 — Campinas', cep: '88101-150', horario: 'Consulte pelo WhatsApp', tel: '(48) 99972-3623', whatsapp: '5548999723623', lat: -27.5975, lng: -48.6093, atende: ['tecnico', 'distribuidor'], selos: [] }
];
