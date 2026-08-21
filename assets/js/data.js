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
  instagram: 'https://instagram.com/',
  siteOficial: 'https://vibecell.com.br',

  /* Opcional: URL que recebe os leads via POST JSON (Zapier, Make,
     n8n, Apps Script, CRM...). Vazio = grava só no navegador.      */
  leadWebhook: '',

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
      eyebrow: 'Para lojistas e revendedores',
      titulo: 'Telas que giram.<br>Qualidade que faz o cliente voltar.',
      texto: 'Abasteça sua loja com telas e frontais selecionados para quem precisa vender com confiança, manter um estoque competitivo e reduzir problemas no pós-venda.',
      texto2: 'Da linha de maior giro à Premium Vibe, encontre soluções para diferentes perfis de cliente e tenha uma marca preparada para acompanhar sua operação.',
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
      kicker: 'O problema',
      titulo: 'Uma tela ruim custa muito mais do que o valor da peça.',
      texto: 'Quando o produto volta para o balcão, o problema não termina na troca. Sua equipe perde tempo, sua margem diminui e a confiança que o cliente tem na sua loja também pode ser afetada. Para quem trabalha com volume, pequenas inconsistências se transformam rapidamente em grandes custos.',
      itens: [
        { t: 'Estoque parado', d: 'Produto que não transmite confiança demora mais para girar e ocupa espaço no seu estoque.' },
        { t: 'Retrabalho no pós-venda', d: 'Trocas, reclamações e retornos consomem o tempo que sua equipe deveria usar para vender.' },
        { t: 'Margem comprometida', d: 'Uma venda problemática pode custar mais do que o lucro gerado por diversas vendas bem-sucedidas.' },
        { t: 'Cliente que não volta', d: 'O técnico precisa confiar no produto que compra. Quando ele encontra consistência, tende a manter o fornecedor.' }
      ]
    },

    beneficios: {
      kicker: 'A solução',
      titulo: 'Um fornecedor pensado para quem precisa vender todos os dias.',
      texto: 'A Vibe une variedade, qualidade e atendimento especializado para ajudar lojistas e revendedores a construir um estoque mais competitivo e vender com mais segurança.',
      itens: [
        { i: 'check',   t: 'Qualidade previsível',            d: 'Mais consistência entre os produtos para trazer segurança à sua operação e ao cliente que compra de você.' },
        { i: 'camadas', t: 'Produtos para diferentes perfis', d: 'Atenda desde o cliente que procura custo-benefício até quem exige uma experiência superior.' },
        { i: 'shield',  t: 'Mais segurança no pós-venda',     d: 'Produtos mais confiáveis ajudam a reduzir situações que consomem tempo, margem e relacionamento.' },
        { i: 'box',     t: 'Mix pensado para o mercado',      d: 'Tenha opções alinhadas às demandas de assistências técnicas e profissionais de reparação mobile.' },
        { i: 'chat',    t: 'Atendimento especializado',       d: 'Conte com suporte comercial para encontrar produtos adequados ao perfil da sua loja.' },
        { i: 'pin',     t: 'Distribuição estratégica',        d: 'Encontre uma distribuidora Vibe e facilite o abastecimento da sua operação.' }
      ]
    },

    portfolio: {
      kicker: 'Portfólio',
      titulo: 'Opções para cada venda. Uma marca para o seu estoque.',
      texto: 'Do cliente que busca custo-benefício ao profissional que exige uma experiência superior, tenha alternativas para diferentes necessidades de compra.',
      linhas: [
        {
          nome: 'Tela Comum',
          tagline: 'Custo-benefício para o giro do dia a dia.',
          texto: 'Uma opção pensada para atender clientes que procuram equilíbrio entre preço, funcionalidade e disponibilidade. Ideal para compor um estoque competitivo e atender demandas recorrentes do mercado.',
          rotuloLista: 'Indicada para',
          itens: ['modelos de alto giro', 'clientes sensíveis a preço', 'vendas orientadas a custo-benefício', 'ampliação do mix da loja'],
          cta: 'Consultar disponibilidade'
        },
        {
          nome: 'Premium Vibe',
          destaque: true,
          tagline: 'Mais qualidade para quem exige mais da tela.',
          texto: 'A linha Premium Vibe foi desenvolvida para clientes que valorizam uma experiência superior de uso. Mais um argumento para sua equipe vender valor, e não apenas preço.',
          rotuloLista: 'Destaques',
          itens: ['brilho mais intenso', 'toque responsivo', 'acabamento superior', 'maior percepção de qualidade'],
          cta: 'Conhecer a Premium Vibe'
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
      cta: 'Quero vender Premium Vibe'
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
      kicker: 'Onde encontrar',
      titulo: 'Encontre uma distribuidora Vibe perto da sua loja.',
      texto: 'Consulte nossa rede de distribuição, encontre o ponto mais próximo e fale diretamente com quem pode atender sua região.'
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
      titulo: 'O próximo produto que seu cliente procura pode estar no seu estoque.',
      texto: 'Encontre uma distribuidora Vibe, consulte as linhas disponíveis e construa um mix preparado para diferentes perfis de cliente.',
      linhas: ['Mais variedade para vender.', 'Mais segurança para o seu negócio.', 'Mais motivos para o cliente voltar.'],
      botao: 'Encontrar distribuidor',
      botao2: 'Falar com a Vibe'
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
      eyebrow: 'Para técnicos e assistências técnicas',
      titulo: 'A tela certa para entregar<br>o reparo com segurança.',
      texto: 'Telas e frontais selecionados para quem trabalha com o aparelho aberto na bancada e precisa de consistência entre uma peça e outra.',
      texto2: 'Da linha de maior giro à Premium Vibe, escolha o produto conforme o que o seu cliente espera do reparo — e veja onde comprar perto de você.',
      ctaPrimario: 'Encontrar distribuidor',
      ctaSecundario: 'Conhecer as linhas',
      selos: ['Foco em reparação mobile', 'Distribuição nacional', 'Importação direta']
    },

    autoridade: [
      { i: 'box',   t: 'Linhas para cada reparo', d: 'Opções para o serviço econômico e para o cliente exigente.' },
      { i: 'globo', t: 'Importação direta',       d: 'Mais controle sobre seleção e fornecimento.' },
      { i: 'rota',  t: 'Logística nacional',      d: 'Encontre um ponto de atendimento para a sua região.' },
      { i: 'chat',  t: 'Suporte comercial',       d: 'Atendimento para tirar dúvidas antes de fechar o pedido.' }
    ],

    dores: {
      kicker: 'O problema',
      titulo: 'A peça errada aparece depois — e sempre na sua bancada.',
      texto: 'Quando a tela volta, o prejuízo não é só a peça. É o tempo de reabrir o aparelho, a conversa com o cliente e a confiança que você levou anos para construir. Para quem faz volume, pequenas inconsistências viram retrabalho constante.',
      itens: [
        { t: 'Retrabalho na bancada', d: 'Reabrir um aparelho já entregue consome o tempo que deveria ir para o próximo serviço.' },
        { t: 'Peça sem consistência', d: 'Quando cada unidade se comporta de um jeito, fica difícil prometer resultado para o cliente.' },
        { t: 'Conversa difícil no balcão', d: 'Explicar um retorno desgasta o relacionamento, mesmo quando o serviço foi bem feito.' },
        { t: 'Fornecedor que muda toda hora', d: 'Trocar de origem a cada compra transforma cada reparo em teste.' }
      ]
    },

    beneficios: {
      kicker: 'A solução',
      titulo: 'Um fornecedor pensado para quem entrega reparo todos os dias.',
      texto: 'A Vibe une variedade, qualidade e atendimento especializado para que você escolha a tela certa para cada serviço e trabalhe com mais previsibilidade.',
      itens: [
        { i: 'check',   t: 'Qualidade previsível',       d: 'Mais consistência entre as peças para você prometer o resultado com segurança.' },
        { i: 'camadas', t: 'Linhas para cada serviço',   d: 'Atenda desde o reparo orientado a preço até o cliente que exige experiência superior.' },
        { i: 'shield',  t: 'Menos retorno no balcão',    d: 'Produtos mais confiáveis ajudam a reduzir situações que custam tempo e relacionamento.' },
        { i: 'box',     t: 'Mix pensado para reparação', d: 'Opções alinhadas às demandas de assistências técnicas e profissionais de reparação mobile.' },
        { i: 'chat',    t: 'Atendimento especializado',  d: 'Suporte comercial para ajudar a escolher a linha adequada ao seu serviço.' },
        { i: 'pin',     t: 'Distribuição estratégica',   d: 'Encontre uma distribuidora Vibe e facilite a reposição do seu estoque de bancada.' }
      ]
    },

    portfolio: {
      kicker: 'Portfólio',
      titulo: 'Uma linha para cada tipo de reparo.',
      texto: 'Do serviço orientado a custo ao cliente que percebe cada detalhe da tela, escolha a opção adequada para cada atendimento.',
      linhas: [
        {
          nome: 'Tela Comum',
          tagline: 'Custo-benefício para o serviço do dia a dia.',
          texto: 'Uma opção pensada para reparos em que o cliente procura equilíbrio entre preço, funcionalidade e disponibilidade. Ideal para modelos de alta procura e demandas recorrentes da bancada.',
          rotuloLista: 'Indicada para',
          itens: ['modelos de alto giro', 'clientes sensíveis a preço', 'reparos orientados a custo-benefício', 'reposição frequente de estoque'],
          cta: 'Consultar disponibilidade'
        },
        {
          nome: 'Premium Vibe',
          destaque: true,
          tagline: 'Mais qualidade para quem exige mais da tela.',
          texto: 'A linha Premium Vibe foi desenvolvida para clientes que valorizam uma experiência superior de uso. Um argumento a mais para você cobrar pelo serviço bem entregue.',
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
      cta: 'Quero trabalhar com a Premium Vibe'
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
      texto: 'Consulte nossa rede de distribuição, encontre o ponto mais próximo e fale diretamente com quem pode atender sua região.'
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
        { p: 'A Vibe vende diretamente para técnicos?', r: 'A Vibe trabalha com atendimento voltado ao mercado de assistência técnica, incluindo técnicos, lojistas e revendedores. Use o mapa para encontrar a distribuidora que atende sua região.' },
        { p: 'Onde posso comprar produtos Vibe?', r: 'Você pode utilizar nosso mapa de distribuidores para encontrar o ponto mais próximo e acessar os canais de atendimento disponíveis.' },
        { p: 'Qual a diferença entre a linha Comum e a Premium Vibe?', r: 'A linha Comum é direcionada a quem procura equilíbrio entre custo-benefício e funcionalidade. A Premium Vibe é indicada para clientes que valorizam uma experiência superior, com diferenciais como brilho mais intenso, toque responsivo e acabamento superior.' },
        { p: 'Como saber quais modelos estão disponíveis?', r: 'A disponibilidade pode variar de acordo com o estoque e distribuidor. Encontre o atendimento da sua região pelo mapa e consulte os modelos disponíveis diretamente pelo WhatsApp.' },
        { p: 'A Vibe atende todo o Brasil?', r: 'A Vibe trabalha com logística e distribuição para diferentes regiões do país. Utilize o mapa para verificar os pontos disponíveis e encontrar a melhor opção de atendimento para sua localização.' },
        { p: 'Posso comprar para revender?', r: 'Sim. A Vibe possui uma proposta voltada para profissionais e empresas que atuam no mercado de peças e reparação mobile. Consulte um distribuidor para conhecer disponibilidade e condições comerciais.' },
        { p: 'Como escolher qual linha usar em cada reparo?', r: 'Depende do perfil do cliente e do que ele espera do aparelho. O atendimento comercial pode ajudar a indicar a linha mais adequada para cada tipo de serviço.' }
      ]
    },

    ctaFinal: {
      titulo: 'A próxima tela da sua bancada pode ser a que resolve de vez.',
      texto: 'Encontre uma distribuidora Vibe, consulte as linhas disponíveis e escolha a opção adequada para cada reparo.',
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
