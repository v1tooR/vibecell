/* ============================================================
   VIBE CELL — Lógica do site
   1. Estado (persona/lead) · 2. Render de conteúdo
   3. Header, menu, reveal, FAQ · 4. Popup de captura
   5. Mapa de distribuidores (Leaflet + OpenStreetMap)

   A visão escolhida na pílula troca conteúdo E tema:
   distribuidor = tema claro (padrão) · técnico = tema escuro.
   ============================================================ */
(function () {
  'use strict';

  var $  = function (s, ctx) { return (ctx || document).querySelector(s); };
  var $$ = function (s, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(s)); };
  var LS_PERSONA  = 'vibe:persona';
  var LS_LEAD     = 'vibe:lead';
  var LS_LEAD_DIST = 'vibe:leadDistribuidor';

  /* Tiles do mapa por tema (CARTO sobre dados do OpenStreetMap) */
  /* A CARTO passou a exigir uma chave (gratuita) nos tiles do mapa — sem
     ela, o tile continua funcionando, só que com a marca d'água "API KEY
     REQUIRED". Configure CONFIG.cartoApiKey em data.js pra tirar isso. */
  var CARTO_KEY = CONFIG.cartoApiKey ? '?key=' + CONFIG.cartoApiKey : '';
  var TILES = {
    claro:  'https://{s}.basemaps.cartocdn.com/rastertiles/light_all/{z}/{x}/{y}{r}.png' + CARTO_KEY,
    escuro: 'https://{s}.basemaps.cartocdn.com/rastertiles/dark_all/{z}/{x}/{y}{r}.png' + CARTO_KEY
  };
  var ATRIB = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>';

  /* ============================================================
     1. ESTADO
     ============================================================ */
  var estado = {
    persona: lerPersonaInicial(),
    /* o que o visitante marcou em "Você é:" no popup do mapa. É só um
       campo do lead — não troca a visão da página (isso agora só acontece
       na porta de entrada, index.html). Começa igual à visão da página. */
    perfilLead: null,
    lead: lerJSON(LS_LEAD),
    leadDistribuidor: lerJSON(LS_LEAD_DIST),
    mapa: null,
    camada: null,
    marcadores: {},
    coordUsuario: null,
    leafletPronto: false
  };

  function lerJSON(chave) {
    try { return JSON.parse(localStorage.getItem(chave) || 'null'); } catch (e) { return null; }
  }
  function gravar(chave, valor) {
    try { localStorage.setItem(chave, typeof valor === 'string' ? valor : JSON.stringify(valor)); } catch (e) {}
  }
  function lerPersonaInicial() {
    /* distribuidor.html e tecnico.html travam numa visão só (window.PAGINA_PERSONA,
       definido inline em cada arquivo) — a pílula do topo, nesse caso, navega
       pra outra página em vez de trocar o conteúdo aqui. */
    if (window.PAGINA_PERSONA && PERSONAS[window.PAGINA_PERSONA.fixa]) return window.PAGINA_PERSONA.fixa;
    var url = new URLSearchParams(location.search).get('perfil');
    if (url && PERSONAS[url]) return url;
    var salva = null;
    try { salva = localStorage.getItem(LS_PERSONA); } catch (e) {}
    return PERSONAS[salva] ? salva : (CONFIG.personaPadrao || 'distribuidor');
  }
  function P() { return PERSONAS[estado.persona]; }

  /* Busca "hero.titulo" dentro do objeto da persona */
  function valorPorCaminho(obj, caminho) {
    return caminho.split('.').reduce(function (o, k) { return (o || {})[k]; }, obj);
  }

  function icone(nome, classe) {
    return '<svg class="ico ' + (classe || '') + '"><use href="#i-' + nome + '"/></svg>';
  }
  function barras(classe) {
    return '<svg class="' + (classe || '') + '" viewBox="0 0 164 100" aria-hidden="true">' +
      '<use href="#barras"/></svg>';
  }
  function esc(t) {
    return String(t == null ? '' : t).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function linkWhats(numero, texto) {
    return 'https://wa.me/' + numero + '?text=' + encodeURIComponent(texto);
  }

  /* Mini-animações da grade "bento" de benefícios — uma por posição,
     só CSS/keyframes (sem estado em JS, sem dependências externas). */
  /* Uma mini-animação por ícone (não por posição) — assim qualquer item
     puxa a animação certa pro seu conteúdo, com 4 ou 6 cards no grid. */
  var BENEF_MOCKUPS = {
    check: function () { // selo pulsando — qualidade/confiança
      return '<div class="mock mock-ping">' +
        '<span class="mock-ring"></span><span class="mock-ring"></span><span class="mock-ring"></span>' +
        icone('check', 'mock-core') + '</div>';
    },
    camadas: function () { // embalagem Vibe conectando dois perfis de usuário
      return '<div class="mock mock-profiles" aria-hidden="true">' +
        '<span class="mock-vibe-box"><svg viewBox="0 0 164 100"><use href="#barras"/></svg></span>' +
        '<span class="mock-branch"><i></i><i></i><i></i><i></i><i></i></span>' +
        '<span class="mock-user mock-user-a"><i></i></span>' +
        '<span class="mock-user mock-user-b"><i></i></span>' +
      '</div>';
    },
    shield: function () { // escudos em sequência — garantia/segurança
      return '<div class="mock mock-shields">' +
        icone('shield', 'mock-shield') + icone('shield', 'mock-shield') + icone('shield', 'mock-shield') +
        '</div>';
    },
    box: function () { // grade de opções — variedade/mix
      return '<div class="mock mock-swatches">' +
        '<span></span><span></span><span></span><span></span><span></span><span></span></div>';
    },
    chat: function () { // chat digitando — atendimento
      return '<div class="mock mock-chat"><span class="mock-bubble">' +
        icone('chat', 'mock-chat-ico') +
        '<span class="mock-dots"><i></i><i></i><i></i></span></span></div>';
    },
    pin: function () { // pino pulsando — distribuição/entrega
      return '<div class="mock mock-radar">' +
        '<span class="mock-ring"></span><span class="mock-ring"></span>' +
        icone('pin', 'mock-core') + '</div>';
    }
  };

  /* Estrutura interna usada pelo brilho dos CTAs principais. Mantém ícones,
     textos dinâmicos e links acessíveis sem exigir markup repetido no HTML. */
  function aprimorarCtas() {
    $$('.btn-primary').forEach(function (btn) {
      if (btn.querySelector(':scope > .btn-shiny-content')) return;
      var conteudo = document.createElement('span');
      conteudo.className = 'btn-shiny-content';
      while (btn.firstChild) conteudo.appendChild(btn.firstChild);
      btn.appendChild(conteudo);
    });
  }

  /* ============================================================
     2. RENDER DE CONTEÚDO
     ============================================================ */
  function renderTudo(animar) {
    var p = P();
    var raiz = document.documentElement;

    raiz.setAttribute('data-persona', p.id);
    raiz.setAttribute('data-tema', p.tema);            /* claro | escuro */
    var meta = $('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', p.tema === 'claro' ? '#ffffff' : '#050609');

    /* textos simples marcados com data-c="caminho.no.objeto" */
    $$('[data-c]').forEach(function (el) {
      var txt = valorPorCaminho(p, el.getAttribute('data-c'));
      if (txt == null) return;
      if (el.hasAttribute('data-html')) el.innerHTML = txt;
      else el.textContent = txt;
    });

    /* distribuidores — distribuidor usa o popup "seja um
       distribuidor"; técnico mantém o gate + mapa original. */
    var usaFormDist = !!(p.mapa && p.mapa.formulario);
    $('#gate').hidden = usaFormDist || !!estado.lead;
    $('#mapzone').hidden = usaFormDist || !estado.lead;
    $('#distGate').hidden = !usaFormDist || !!estado.leadDistribuidor;
    $('#distribuidorOk').hidden = !usaFormDist || !estado.leadDistribuidor;

    /* selos do hero */
    $('#heroSelos').innerHTML = p.hero.selos.map(function (s) {
      return '<li>' + icone('check') + '<span>' + esc(s) + '</span></li>';
    }).join('');

    /* faixa de autoridade (atributos, sem números) */
    $('#autoridade').innerHTML = p.autoridade.map(function (a) {
      return '<li><span class="aut-ico">' + icone(a.i) + '</span>' +
             '<h3>' + esc(a.t) + '</h3><p>' + esc(a.d) + '</p></li>';
    }).join('');

    /* dores — a persona distribuidor não mostra essa seção por
       enquanto (removida a pedido); a técnico removeu a seção inteira (a
       página nem tem mais o #dores no HTML), então isso só roda se a
       persona tiver dados de dores. */
    var elDores = $('#dores');
    if (elDores && p.dores) {
      var temDores = p.dores.itens.length && !p.dores.itens[0].foto;
      elDores.hidden = !temDores;

      if (temDores) {
        pararFeatureAuto();
        var DOR_PESO = ['34%', '58%', '80%', '100%'];
        $('#doresGrid').innerHTML = p.dores.itens.map(function (d, i) {
          var ultimo = i === p.dores.itens.length - 1;
          return '<article class="dor' + (ultimo ? ' dor-critico' : '') + '" style="--sev:' + (DOR_PESO[i] || '100%') + '">' +
            '<span class="dor-idx">' + ('0' + (i + 1)).slice(-2) + '</span>' +
            '<h3>' + esc(d.t) + '</h3><p>' + esc(d.d) + '</p>' +
            '<span class="dor-peso" aria-hidden="true"><span class="dor-peso-fill"></span></span>' +
            (ultimo ? '' : '<span class="dor-seta" aria-hidden="true">' + icone('seta') + '</span>') +
          '</article>';
        }).join('');
      }
    }

    /* benefícios — grade "bento": 6 itens (técnico antigo) usa o recorte
       original; 4 itens (distribuidor) usa 1 card grande e 3
       menores. Técnico agora usa bloco de texto + foto (sem #benefGrid no
       HTML), então isso só roda quando a persona tiver itens de fato. */
    var benefGrid = $('#benefGrid');
    if (benefGrid && p.beneficios.itens) {
      benefGrid.className = p.beneficios.itens.length === 4 ? 'cards-bento-4' : 'cards';
      benefGrid.innerHTML = p.beneficios.itens.map(function (b, idx) {
        var mock = b.mapa
          ? '<div class="mock mock-mapa-brasil"><img src="assets/img/brasil-contorno.svg" alt="Mapa do Brasil"></div>'
          : (BENEF_MOCKUPS[b.i] ? BENEF_MOCKUPS[b.i]() : '');
        var foto = idx === 5 && p.beneficios.itens.length === 6 ? ' card-photo' : '';
        return '<article class="card' + foto + '">' + mock +
               '<h3>' + esc(b.t) + '</h3><p>' + esc(b.d) + '</p></article>';
      }).join('');
    }

    /* linhas de produto — distribuidor usa o split Tela China x
       Linha Vibe; técnico mantém os cards Tela Comum / Premium Vibe. */
    var usaSplit = p.portfolio.linhas.length && p.portfolio.linhas[0].foto;
    $('#linhas').hidden = !!usaSplit;
    $('#splitChina').hidden = !usaSplit;
    $('#splitFechamento').hidden = !usaSplit;

    if (usaSplit) {
      var cols = [$('#splitColA'), $('#splitColB')];
      p.portfolio.linhas.forEach(function (l, i) {
        var col = cols[i];
        if (!col) return;
        col.classList.toggle('split-col-vibe', !!l.destaque);
        $('img', col).src = l.foto;
        $('img', col).alt = l.nome;
        $('h3', col).textContent = l.nome;
        $('p', col).textContent = l.texto;
      });
      $('#splitFechamento').textContent = p.portfolio.fechamento || '';
    } else {
      $('#linhas').innerHTML = p.portfolio.linhas.map(function (l) {
        var msg = 'Olá! Quero saber mais sobre a linha ' + l.nome + ' da Vibe.';
        return '<article class="linha' + (l.destaque ? ' linha-destaque' : '') + '">' +
          (l.destaque ? '<span class="selo-linha">' + barras('selo-barras') + 'Premium</span>' : '') +
          '<div class="linha-ico">' + icone(l.destaque ? 'brilho' : 'display') + '</div>' +
          '<h3>' + esc(l.nome) + '</h3>' +
          '<p class="linha-tag">' + esc(l.tagline) + '</p>' +
          '<p class="linha-txt">' + esc(l.texto) + '</p>' +
          '<p class="linha-rot">' + esc(l.rotuloLista) + '</p>' +
          '<ul class="tick-list">' + l.itens.map(function (i) {
            return '<li>' + icone('check', 'tick-ico') + '<span>' + esc(i) + '</span></li>';
          }).join('') + '</ul>' +
          '<a class="btn ' + (l.destaque ? 'btn-primary' : 'btn-ghost') + '" target="_blank" rel="noopener" href="' +
            linkWhats(CONFIG.whatsappComercial, msg) + '">' + esc(l.cta) + '</a>' +
        '</article>';
      }).join('');
    }

    /* destaque premium */
    $('#progList').innerHTML = p.destaque.itens.map(function (i) {
      return '<li>' + icone('check', 'tick-ico') + '<span>' + esc(i) + '</span></li>';
    }).join('');

    /* passos — linha do tempo: os marcadores acendem em sincronia com a
       linha se desenhando (ver ligarLinhaPassos); o último é a chegada. */
    var totalPassos = p.passos.itens.length;
    $('#steps').innerHTML = p.passos.itens.map(function (s, i) {
      var ultimo = i === totalPassos - 1;
      var atraso = (i / Math.max(totalPassos - 1, 1) * 1.3).toFixed(2) + 's';
      var marcador = ultimo ? icone('check', 'step-n-ico') : ('0' + (i + 1)).slice(-2);
      return '<li class="step' + (ultimo ? ' step-last' : '') + '" style="--node-delay:' + atraso + '">' +
             '<span class="step-n">' + marcador + '</span>' +
             '<h3>' + esc(s.t) + '</h3><p>' + esc(s.d) + '</p></li>';
    }).join('');
    ligarLinhaPassos();

    /* prova social — só aparece com depoimentos reais cadastrados */
    renderDepoimentos();

    /* feedbacks em vídeo — os reels reais do Instagram da Vibe */
    renderFeedbacks();

    /* CTA final — distribuidor usa faixa de largura total na cor
       da marca, com um botão só; técnico mantém o fundo original e os
       dois botões (mapa + WhatsApp). */
    $('#ctaFinal').classList.toggle('cta-final-marca', !!p.ctaFinal.faixaMarca);
    $('#ctaBotao2').hidden = !p.ctaFinal.botao2;

    /* linhas do CTA final — cards flutuando ao redor do vídeo */
    var CTA_ICONES = ['camadas', 'shield', 'star'];
    $('#ctaLinhas').innerHTML = (p.ctaFinal.linhas || []).map(function (l, i) {
      return '<li class="cta-float cta-float-' + (i + 1) + '">' +
             '<span class="cta-float-ico">' + icone(CTA_ICONES[i % CTA_ICONES.length]) + '</span>' +
             '<span>' + esc(l) + '</span></li>';
    }).join('');

    /* FAQ */
    $('#faqList').innerHTML = p.faq.itens.map(function (f, i) {
      return '<div class="faq-item"><button type="button" class="faq-q" aria-expanded="false" aria-controls="fa' + i + '">' +
             esc(f.p) + '</button><div class="faq-a" id="fa' + i + '"><p>' + esc(f.r) + '</p></div></div>';
    }).join('');

    /* botões de WhatsApp da marca */
    $$('[data-wa-marca]').forEach(function (a) {
      a.href = linkWhats(CONFIG.whatsappComercial, p.msgWhatsapp);
      a.target = '_blank';
      a.rel = 'noopener';
    });

    /* pílulas de troca de visão — nas duas páginas publicadas elas ficam
       travadas na persona do arquivo e servem de atalho pro outro lado */
    $$('[data-persona-btn]').forEach(function (b) {
      var on = b.getAttribute('data-persona-btn') === p.id;
      b.classList.toggle('is-on', on);
      b.setAttribute('aria-pressed', on ? 'true' : 'false');
    });

    /* campo "Você é:" do popup do mapa — começa marcado na visão da página */
    marcarPerfilLead(estado.perfilLead || p.id);

    aprimorarCtas();

    ligarFaq();
    ligarBrilhoCards();
    ligarTiltDores();
    ligarCascataDores();
    prepararReveal();

    if (animar) {
      ['#heroSelos', '#autoridade', '#doresGrid', '#benefGrid', '#linhas', '#progList', '#steps', '#faqList', '#ctaLinhas']
        .forEach(function (sel) {
          var el = $(sel);
          if (!el) return;
          el.classList.remove('swap');
          void el.offsetWidth;
          el.classList.add('swap');
        });
    }

    /* mapa já liberado: refiltra os pontos e troca o tema dos tiles */
    if (estado.leafletPronto) {
      trocarTiles();
      renderDistribuidoras();
    }
  }

  /* ============================================================
     Painel interativo "Por que comprar" — lista de recursos que troca
     de foto sozinha (e ao clicar), com barra de progresso no item ativo.
     Usado pela persona distribuidor no lugar da cascata de dores.
     ============================================================ */
  var featureEstado = { idx: 0, timer: null, pronto: false };

  function pararFeatureAuto() {
    clearInterval(featureEstado.timer);
    featureEstado.timer = null;
  }

  function iniciarFeatureAuto(total) {
    pararFeatureAuto();
    if (window.matchMedia && matchMedia('(prefers-reduced-motion:reduce)').matches) return;
    featureEstado.timer = setInterval(function () {
      selecionarFeature((featureEstado.idx + 1) % total, false);
    }, 4800);
  }

  function selecionarFeature(i, manual) {
    featureEstado.idx = i;
    $$('.feature-tab').forEach(function (b, bi) {
      var on = bi === i;
      b.classList.toggle('is-on', on);
      b.setAttribute('aria-selected', on ? 'true' : 'false');
      var barra = $('.feature-tab-bar', b);
      barra.classList.remove('anda');
      if (on) {
        void barra.offsetWidth; /* força reflow pra reiniciar a animação */
        barra.classList.add('anda');
      }
    });
    $$('.feature-preview-img').forEach(function (f, fi) { f.classList.toggle('is-on', fi === i); });
    if (manual) iniciarFeatureAuto($$('.feature-tab').length);
  }

  function renderFeatureTabs(itens) {
    var lista = $('#featureList');
    var preview = $('#featurePreview');

    lista.innerHTML = itens.map(function (it, i) {
      return '<button type="button" class="feature-tab' + (i === 0 ? ' is-on' : '') + '" role="tab" aria-selected="' + (i === 0 ? 'true' : 'false') + '" data-idx="' + i + '">' +
        '<span class="feature-tab-idx">' + ('0' + (i + 1)).slice(-2) + '</span>' +
        '<span class="feature-tab-body"><strong>' + esc(it.t) + '</strong><span class="feature-tab-desc">' + esc(it.d) + '</span></span>' +
        '<span class="feature-tab-bar' + (i === 0 ? ' anda' : '') + '" aria-hidden="true"></span>' +
      '</button>';
    }).join('');

    preview.innerHTML = itens.map(function (it, i) {
      return '<figure class="feature-preview-img' + (i === 0 ? ' is-on' : '') + '">' +
        '<img src="' + esc(it.foto) + '" alt="" loading="' + (i === 0 ? 'eager' : 'lazy') + '"></figure>';
    }).join('');

    $$('.feature-tab', lista).forEach(function (b) {
      b.addEventListener('click', function () { selecionarFeature(parseInt(b.getAttribute('data-idx'), 10), true); });
    });

    if (!featureEstado.pronto) {
      featureEstado.pronto = true;
      var painel = $('#featureTabs');
      painel.addEventListener('mouseenter', pararFeatureAuto);
      painel.addEventListener('mouseleave', function () { iniciarFeatureAuto(itens.length); });
      painel.addEventListener('focusin', pararFeatureAuto);
      painel.addEventListener('focusout', function () { iniciarFeatureAuto(itens.length); });
    }

    featureEstado.idx = 0;
    iniciarFeatureAuto(itens.length);
  }

  function renderDepoimentos() {
    var sec = $('#secProva');
    var itens = DEPOIMENTOS.filter(function (d) {
      return !d.perfil || d.perfil === 'ambos' || d.perfil === estado.persona;
    });
    if (!itens.length) { sec.hidden = true; return; }
    sec.hidden = false;
    $('#depoGrid').innerHTML = itens.map(function (d) {
      return '<article class="depo"><div class="depo-stars">' +
        icone('star') + icone('star') + icone('star') + icone('star') + icone('star') + '</div>' +
        '<p>“' + esc(d.txt) + '”</p>' +
        '<footer><span class="depo-av">' + esc((d.nome || '?').charAt(0)) + '</span>' +
        '<span><span class="depo-nome">' + esc(d.nome) + '</span>' +
        '<span class="depo-cargo">' + esc(d.local || '') + '</span></span></footer></article>';
    }).join('');
  }

  /* Feedbacks em vídeo — os reels do Instagram da Vibe.
     O card mostra só a capa local (rápida e no visual do site); o player
     do Instagram é montado no clique, dentro do lightbox, e destruído ao
     fechar. Nenhum script de terceiro roda antes disso. */
  function renderFeedbacks() {
    var sec = $('#feedbacks');
    if (!sec) return;
    var lista = typeof FEEDBACKS !== 'undefined' ? FEEDBACKS : [];
    var itens = lista.filter(function (f) {
      return !f.perfil || f.perfil === 'ambos' || f.perfil === estado.persona;
    });
    if (!itens.length) { sec.hidden = true; return; }
    sec.hidden = false;
    $('#reelsGrid').innerHTML = itens.map(function (f) {
      return '<article class="reel">' +
        '<button type="button" class="reel-capa" data-reel="' + esc(f.code) + '"' +
          ' aria-label="Assistir ao feedback de ' + esc(f.nome) + '">' +
          '<img src="' + esc(f.capa) + '" alt="" loading="lazy" decoding="async">' +
          '<span class="reel-scrim" aria-hidden="true"></span>' +
          '<span class="reel-play" aria-hidden="true">' + icone('play') + '</span>' +
        '</button>' +
        '<div class="reel-corpo">' +
          '<p class="reel-txt">' + esc(f.txt) + '</p>' +
          '<footer class="reel-pe">' +
            '<span class="reel-av">' + esc((f.nome || '?').charAt(0)) + '</span>' +
            '<span><span class="reel-nome">' + esc(f.nome) + '</span>' +
            '<span class="reel-local">' + esc(f.local || '') + '</span></span>' +
          '</footer>' +
        '</div>' +
      '</article>';
    }).join('');
  }

  /* "Você é:" no popup do mapa: marca o botão e guarda o valor pro lead.
     Não chama renderTudo — a visão da página não muda mais aqui. */
  function marcarPerfilLead(valor) {
    var btns = $$('[data-perfil-lead]');
    if (!btns.length) return;
    estado.perfilLead = valor;
    btns.forEach(function (b) {
      var on = b.getAttribute('data-perfil-lead') === valor;
      b.classList.toggle('is-on', on);
      b.setAttribute('aria-pressed', on ? 'true' : 'false');
    });
  }

  function trocarPersona(nova) {
    if (!PERSONAS[nova] || nova === estado.persona) return;
    estado.persona = nova;
    gravar(LS_PERSONA, nova);
    renderTudo(true);
    var u = new URL(location.href);
    u.searchParams.set('perfil', nova);
    history.replaceState(null, '', u);
  }

  /* ============================================================
     3. HEADER, MENU, REVEAL, FAQ
     ============================================================ */
  function ligarHeader() {
    var hdr = $('#hdr'), nav = $('#nav'), btn = $('#menuBtn'), barra = $('#progresso');

    var aoRolar = function () {
      hdr.classList.toggle('scrolled', window.scrollY > 48);
      var total = document.documentElement.scrollHeight - window.innerHeight;
      barra.style.width = (total > 0 ? (window.scrollY / total) * 100 : 0) + '%';
    };
    aoRolar();
    window.addEventListener('scroll', aoRolar, { passive: true });

    btn.addEventListener('click', function () {
      var aberto = nav.classList.toggle('aberto');
      hdr.classList.toggle('menu-open', aberto);
      btn.setAttribute('aria-expanded', aberto ? 'true' : 'false');
    });
    $$('#nav a').forEach(function (a) {
      a.addEventListener('click', function () {
        nav.classList.remove('aberto');
        hdr.classList.remove('menu-open');
        btn.setAttribute('aria-expanded', 'false');
      });
    });

    document.addEventListener('click', function (e) {
      var perfil = e.target.closest('[data-perfil-lead]');
      if (perfil) { marcarPerfilLead(perfil.getAttribute('data-perfil-lead')); return; }

      var b = e.target.closest('[data-persona-btn]');
      if (!b) return;
      var alvo = b.getAttribute('data-persona-btn');
      /* Página travada (distribuidor.html / tecnico.html): a pílula do topo
         leva pro HTML do outro perfil. Numa página solta (sem
         PAGINA_PERSONA), ela troca o conteúdo na hora. */
      if (window.PAGINA_PERSONA && b.classList.contains('pill-btn') && alvo !== window.PAGINA_PERSONA.fixa) {
        location.href = window.PAGINA_PERSONA.outraUrl;
        return;
      }
      trocarPersona(alvo);
    });
  }

  function prepararReveal() {
    var alvos = $$('.hero-copy > *, .sec-hd > *, .dor, .card, .linha, .step, .depo, .reel, .faq-item, .gate, .vibecast-card, .vibecast-ep, .prog-copy > *, .prog-art, .brand-stream-content > *, .cta-in > *, .autoridade li');

    /* rede de segurança: sem IntersectionObserver (ou se ele não disparar),
       o conteúdo aparece assim mesmo */
    var revelarTudo = function () { alvos.forEach(function (el) { el.classList.add('vis'); }); };
    if (!('IntersectionObserver' in window)) { revelarTudo(); return; }
    var disparou = false;
    setTimeout(function () { if (!disparou) revelarTudo(); }, 2500);

    var io = new IntersectionObserver(function (entradas) {
      entradas.forEach(function (en) {
        if (en.isIntersecting) {
          disparou = true;
          en.target.classList.add('vis');
          io.unobserve(en.target);
          setTimeout(function () {
            en.target.removeAttribute('data-reveal');
            en.target.style.removeProperty('--reveal-delay');
            en.target.style.removeProperty('--reveal-offset');
            en.target.style.removeProperty('--reveal-tilt');
          }, 1450);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -32px' });

    var contadores = new Map();
    var pendentes = [];
    alvos.forEach(function (el) {
      if (el.classList.contains('vis')) return;

      var pai = el.parentElement;
      var indice = contadores.get(pai) || 0;
      contadores.set(pai, indice + 1);

      var tipo = 'card';
      if (pai.classList.contains('hero-copy')) tipo = 'hero';
      else if (pai.classList.contains('sec-hd')) tipo = 'heading';
      else if (pai.classList.contains('prog-copy')) tipo = 'left';
      else if (el.classList.contains('prog-art')) tipo = 'right';
      else if (el.classList.contains('faq-item')) tipo = 'slide';
      else if (el.classList.contains('gate') || pai.classList.contains('cta-in')) tipo = 'zoom';

      el.setAttribute('data-reveal', tipo);
      var passo = tipo === 'hero' ? 55 : 90;
      var limite = tipo === 'hero' ? 220 : 360;
      el.style.setProperty('--reveal-delay', Math.min(indice * passo, limite) + 'ms');
      el.style.setProperty('--reveal-offset', (indice % 2 ? -18 : 18) + 'px');
      el.style.setProperty('--reveal-tilt', (indice % 2 ? -.55 : .55) + 'deg');
      pendentes.push(el);
    });

    /* Dois frames garantem que o navegador pinte o estado inicial antes de o
       IntersectionObserver liberar a transição. Evita saltos no hero inicial. */
    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        pendentes.forEach(function (el) { io.observe(el); });
      });
    });
  }

  /* Dispara a animação da linha do tempo (seção "Como funciona") uma única
     vez, quando ela entra na tela — os marcadores usam --node-delay (setado
     no render) para acender junto com a linha se desenhando até eles. */
  function ligarLinhaPassos() {
    var steps = $('#steps');
    if (!steps || steps.dataset.linhaPronta) return;
    steps.dataset.linhaPronta = '1';
    if (!('IntersectionObserver' in window)) { steps.classList.add('in-view'); return; }
    var io = new IntersectionObserver(function (entradas) {
      entradas.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('in-view'); io.unobserve(en.target); }
      });
    }, { threshold: .3 });
    io.observe(steps);
  }

  function ligarFaq() {
    $$('.faq-q').forEach(function (q) {
      q.addEventListener('click', function () {
        var item = q.parentElement, resp = q.nextElementSibling, abrindo = !item.classList.contains('open');
        $$('.faq-item.open').forEach(function (o) {
          o.classList.remove('open');
          o.querySelector('.faq-a').style.maxHeight = null;
          o.querySelector('.faq-q').setAttribute('aria-expanded', 'false');
        });
        if (abrindo) {
          item.classList.add('open');
          resp.style.maxHeight = resp.scrollHeight + 'px';
          q.setAttribute('aria-expanded', 'true');
        }
      });
    });
  }

  function ligarBrilhoCards() {
    $$('.card, .dor').forEach(function (c) {
      c.addEventListener('pointermove', function (e) {
        var r = c.getBoundingClientRect();
        c.style.setProperty('--mx', (e.clientX - r.left) + 'px');
        c.style.setProperty('--my', (e.clientY - r.top) + 'px');
      });
    });
  }

  /* Leve inclinação 3D nos cards de "dores", só com ponteiro fino e sem
     prefers-reduced-motion — reforça o clima de instabilidade do tema (tela
     rachada) sem exigir nada além de custom properties CSS. Como os cards
     são recriados a cada renderTudo(), a função é chamada de novo sempre. */
  function ligarTiltDores() {
    var fino = window.matchMedia && matchMedia('(pointer:fine)').matches;
    var reduz = window.matchMedia && matchMedia('(prefers-reduced-motion:reduce)').matches;
    if (!fino || reduz) return;
    $$('.dor').forEach(function (c) {
      c.addEventListener('pointermove', function (e) {
        var r = c.getBoundingClientRect();
        var px = (e.clientX - r.left) / r.width;
        var py = (e.clientY - r.top) / r.height;
        c.style.setProperty('--tiltx', ((px - .5) * 5).toFixed(2) + 'deg');
        c.style.setProperty('--tilty', ((.5 - py) * 5).toFixed(2) + 'deg');
      });
      c.addEventListener('pointerleave', function () {
        c.style.setProperty('--tiltx', '0deg');
        c.style.setProperty('--tilty', '0deg');
      });
    });
  }

  /* Liga a cascata de "dores" (barras de peso + setas) uma única vez, quando
     a fileira inteira entra na tela — mesma lógica de ligarLinhaPassos,
     aplicada às consequências em vez dos passos. */
  function ligarCascataDores() {
    var wrap = $('#doresGrid');
    if (!wrap || wrap.dataset.cascataPronta) return;
    wrap.dataset.cascataPronta = '1';
    if (!('IntersectionObserver' in window)) { wrap.classList.add('in-view'); return; }
    var io = new IntersectionObserver(function (entradas) {
      entradas.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('in-view'); io.unobserve(en.target); }
      });
    }, { threshold: .3 });
    io.observe(wrap);
  }

  /* Corredor visual inspirado no componente anexado, reconstruído em HTML/CSS
     nativo para preservar a arquitetura do site e evitar novas dependências. */
  function montarBrandStream() {
    var palco = $('#brandStream');
    if (!palco || palco.dataset.pronto) return;
    palco.dataset.pronto = '1';
    /* Marca e produto alternados: as fotos "vibe-selo-*" são o verso das
       telas na bancada, onde aparece a identificação da Vibe — selo numerado,
       etiqueta no flex, carimbo de teste. O segundo item de cada par diz se
       o card é largo (foto em paisagem). */
    var imagens = [
      ['assets/img/vibe-em-maos.webp', false],
      ['assets/img/vibe-unboxing.webp', false],
      ['assets/img/vibe-selo-frame.webp', false],
      ['assets/img/vibe-evento-equipe.webp', false],
      ['assets/img/vibe-duas-linhas.webp', false],
      ['assets/img/vibe-selo-a54.webp', false],
      ['assets/img/vibe-brand-pose.webp', false],
      ['assets/img/vibe-evento-kit.webp', false],
      ['assets/img/vibe-tela-detalhe.webp', false],
      ['assets/img/vibe-selo-flex.webp', false],
      ['assets/img/vibe-evento-atendimento.webp', false],
      ['assets/img/vibe-packaging-grid.webp', true],
      ['assets/img/vibe-selo-testada.webp', true],
      ['assets/img/vibe-brand-proposal.webp', true],
      ['assets/img/vibe-selo-a15.webp', true],
      ['assets/img/vibe-packaging-line.webp', true]
    ];
    function trilha(lado, deslocamento) {
      var cards = imagens.map(function (img, i) {
        var atual = imagens[(i + deslocamento) % imagens.length];
        var atraso = -((i * 18) / imagens.length).toFixed(2);
        return '<figure class="brand-stream-card' + (atual[1] ? ' is-wide' : '') + '" style="animation-delay:' + atraso + 's">' +
          '<img src="' + atual[0] + '" alt="" loading="lazy" decoding="async" draggable="false"></figure>';
      }).join('');
      return '<div class="brand-stream-rail brand-stream-rail-' + lado + '">' + cards + '</div>';
    }
    palco.innerHTML = trilha('left', 0) + trilha('right', 4);
  }

  /* Leque de cards das linhas de tela — toque/clique traz o card pra frente
     em telas sem hover (o CSS já cuida do :hover em telas com ponteiro fino). */
  function ligarFanLinhas() {
    var leque = $('#fanLinhas');
    if (!leque) return;
    $$('.fan-card', leque).forEach(function (card) {
      card.addEventListener('click', function () {
        var jaAberto = card.classList.contains('is-up');
        $$('.fan-card.is-up', leque).forEach(function (c) { c.classList.remove('is-up'); });
        if (!jaAberto) card.classList.add('is-up');
      });
    });
  }

  function mascaraCep(v) {
    var d = v.replace(/\D/g, '').slice(0, 8);
    return d.length <= 5 ? d : d.slice(0, 5) + '-' + d.slice(5);
  }
  /* Formulário "Quero comprar Vibe pra minha distribuidora".
     Coleta nome, telefone, endereço (CEP + rua) e a média de compra de
     TELAS por mês. No envio, além de gravar o lead como sempre, abre o
     WhatsApp da Vibe com tudo preenchido — é lá que a conversa continua.
     O CEP é conferido na API pública do ViaCEP (sem chave): confirma
     cidade/UF e já sugere o endereço. */
  function ligarFormDistribuidor() {
    var form = $('#formDistribuidor');
    if (!form) return;
    var grupoFaixa = $('#faixaCompra');
    var faixaValor = '';
    var faixaRotulo = '';
    var cepValido = null;

    /* as faixas vêm de CONFIG pra ficarem editáveis num lugar só */
    var faixas = CONFIG.faixasCompraTelas || [];
    grupoFaixa.innerHTML = faixas.map(function (f) {
      return '<button type="button" data-valor="' + esc(f.v) + '" aria-pressed="false">' +
             esc(f.t) + '</button>';
    }).join('');

    grupoFaixa.addEventListener('click', function (e) {
      var b = e.target.closest('button');
      if (!b) return;
      $$('button', grupoFaixa).forEach(function (o) { o.classList.remove('is-on'); o.setAttribute('aria-pressed', 'false'); });
      b.classList.add('is-on');
      b.setAttribute('aria-pressed', 'true');
      faixaValor = b.getAttribute('data-valor');
      faixaRotulo = b.textContent.trim();
      mostrarErro('faixa');
    });

    var telInput = $('#dtel');
    telInput.addEventListener('input', function () { telInput.value = mascaraTel(telInput.value); });

    var cepInput = $('#dcep'), cepInfo = $('#cepInfo');
    cepInput.addEventListener('input', function () {
      cepInput.value = mascaraCep(cepInput.value);
      cepInfo.textContent = '';
      cepValido = null;
      mostrarErro('cep');
    });
    cepInput.addEventListener('blur', function () {
      var digitos = cepInput.value.replace(/\D/g, '');
      if (digitos.length !== 8) return;
      cepInfo.textContent = 'Consultando...';
      fetch('https://viacep.com.br/ws/' + digitos + '/json/')
        .then(function (r) { return r.json(); })
        .then(function (j) {
          if (j.erro) { cepValido = false; cepInfo.textContent = ''; mostrarErro('cep', 'CEP não encontrado.'); return; }
          cepValido = true;
          cepInfo.textContent = j.localidade + '/' + j.uf;
          /* adianta a rua e o bairro — quem preenche só completa o número */
          var end = $('#dend');
          if (end && !end.value.trim() && j.logradouro) {
            end.value = j.logradouro + (j.bairro ? ', ' + j.bairro : '');
          }
        })
        .catch(function () { cepInfo.textContent = ''; /* API fora do ar: segue sem bloquear o cadastro */ });
    });

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var nome = $('#dnome').value.trim();
      var tel = $('#dtel').value.replace(/\D/g, '');
      var endereco = $('#dend').value.trim();
      var cep = cepInput.value.replace(/\D/g, '');
      var ok = true;

      ['nome', 'telefone', 'endereco', 'cep', 'faixa'].forEach(function (c) { mostrarErro(c); });
      $$('.campo input', form).forEach(function (i) { i.classList.remove('inv'); });

      if (nome.length < 3) { mostrarErro('nome', 'Informe seu nome completo.'); $('#dnome').classList.add('inv'); ok = false; }
      if (tel.length < 10 || tel.length > 11) { mostrarErro('telefone', 'Informe um telefone com DDD.'); telInput.classList.add('inv'); ok = false; }
      if (cep.length !== 8) { mostrarErro('cep', 'Informe um CEP válido.'); cepInput.classList.add('inv'); ok = false; }
      else if (cepValido === false) { mostrarErro('cep', 'CEP não encontrado.'); cepInput.classList.add('inv'); ok = false; }
      if (endereco.length < 5) { mostrarErro('endereco', 'Informe rua, número e bairro.'); $('#dend').classList.add('inv'); ok = false; }
      if (!faixaValor) { mostrarErro('faixa', 'Escolha sua média de compra de telas por mês.'); ok = false; }
      if (!ok) return;

      var cidadeUf = cepInfo.textContent || '';
      var lead = {
        nome: nome, telefone: tel, telefoneFmt: telInput.value,
        endereco: endereco, cep: cepInput.value, cidadeUf: cidadeUf,
        faixaCompra: faixaValor, faixaCompraRotulo: faixaRotulo,
        perfil: 'distribuidor',
        origem: location.href, data: new Date().toISOString()
      };

      /* O WhatsApp abre PRIMEIRO, ainda dentro do clique do visitante —
         se ficasse depois do fetch, o navegador trataria como popup e
         bloquearia a aba. */
      var msg = 'Olá! Quero comprar Vibe pra minha distribuidora.\n\n' +
        'Nome: ' + nome + '\n' +
        'Telefone: ' + telInput.value + '\n' +
        'Endereço: ' + endereco + '\n' +
        (cidadeUf ? 'Cidade/UF: ' + cidadeUf + '\n' : '') +
        'CEP: ' + cepInput.value + '\n' +
        'Média de compra: ' + faixaRotulo + ' por mês';
      window.open(linkWhats(CONFIG.whatsappComercial, msg), '_blank', 'noopener');

      estado.leadDistribuidor = lead;
      gravar(LS_LEAD_DIST, lead);
      if (window.dataLayer) window.dataLayer.push({ event: 'lead_distribuidor_form', lead: lead });
      console.info('[Vibe] Lead capturado (quero comprar Vibe):', lead);
      if (CONFIG.leadWebhookDistribuidor) {
        /* text/plain evita o preflight de CORS que o Google Apps Script não
           responde — o Apps Script lê o corpo como JSON normalmente. */
        fetch(CONFIG.leadWebhookDistribuidor, {
          method: 'POST', headers: { 'Content-Type': 'text/plain;charset=utf-8' }, body: JSON.stringify(lead)
        }).catch(function (err) { console.warn('[Vibe] Falha ao enviar lead:', err); });
      }

      fecharModalDist();
      $('#distGate').hidden = true;
      $('#distribuidorOk').hidden = false;
      $('#distribuidorOk').scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }

  /* ============================================================
     4. POPUP DE CAPTURA (gate)
     ============================================================ */
  var modal = $('#modal'), form = $('#formLead'), ultimoFoco = null;

  function abrirModal() {
    if (P().mapa && P().mapa.formulario) return; /* distribuidor usa o formulário, não o gate */
    if (estado.lead) { liberarMapa(false); return; }
    ultimoFoco = document.activeElement;
    modal.hidden = false;
    document.body.style.overflow = 'hidden';
    setTimeout(function () { $('#ln').focus(); }, 60);
    document.addEventListener('keydown', teclasModal);
  }
  function fecharModal() {
    modal.hidden = true;
    document.body.style.overflow = '';
    document.removeEventListener('keydown', teclasModal);
    if (ultimoFoco) ultimoFoco.focus();
  }
  function teclasModal(e) {
    if (e.key === 'Escape') return fecharModal();
    if (e.key !== 'Tab') return;
    var foco = $$('button, input, a[href], select', modal).filter(function (el) { return !el.disabled && el.offsetParent !== null; });
    if (!foco.length) return;
    var pri = foco[0], ult = foco[foco.length - 1];
    if (e.shiftKey && document.activeElement === pri) { e.preventDefault(); ult.focus(); }
    else if (!e.shiftKey && document.activeElement === ult) { e.preventDefault(); pri.focus(); }
  }

  /* Popup "Seja um distribuidor" (persona distribuidor) — mesmo mecanismo do
     gate técnico (abre sozinho ao rolar até a seção), só que com o
     formulário de cadastro de distribuidor. */
  var modalDist = $('#modalDist'), ultimoFocoDist = null;

  function abrirModalDist() {
    if (estado.leadDistribuidor) return;
    ultimoFocoDist = document.activeElement;
    modalDist.hidden = false;
    document.body.style.overflow = 'hidden';
    setTimeout(function () { $('#dnome').focus(); }, 60);
    document.addEventListener('keydown', teclasModalDist);
  }
  function fecharModalDist() {
    modalDist.hidden = true;
    document.body.style.overflow = '';
    document.removeEventListener('keydown', teclasModalDist);
    if (ultimoFocoDist) ultimoFocoDist.focus();
  }
  function teclasModalDist(e) {
    if (e.key === 'Escape') return fecharModalDist();
    if (e.key !== 'Tab') return;
    var foco = $$('button, input, a[href], select', modalDist).filter(function (el) { return !el.disabled && el.offsetParent !== null; });
    if (!foco.length) return;
    var pri = foco[0], ult = foco[foco.length - 1];
    if (e.shiftKey && document.activeElement === pri) { e.preventDefault(); ult.focus(); }
    else if (!e.shiftKey && document.activeElement === ult) { e.preventDefault(); pri.focus(); }
  }

  function ligarModalDist() {
    var gateBtn = $('#distGateBtn');
    if (!gateBtn) return;
    gateBtn.addEventListener('click', abrirModalDist);
    $$('[data-fechar-dist]').forEach(function (el) { el.addEventListener('click', fecharModalDist); });

    /* CTAs que levam à seção de distribuidores também abrem o popup */
    $$('a[href="#distribuidores"]').forEach(function (a) {
      a.addEventListener('click', function () {
        if (P().mapa && P().mapa.formulario && !estado.leadDistribuidor) setTimeout(abrirModalDist, 700);
      });
    });

    /* abre sozinho quando o usuário chega na seção (uma vez por visita) */
    var jaAbriuDist = sessionStorage.getItem('vibe:gateDist') === '1';
    var checarGateDist = function () {
      if (jaAbriuDist || estado.leadDistribuidor) { window.removeEventListener('scroll', checarGateDist); return; }
      var gate = $('#distGate');
      if (!gate || gate.hidden) return;
      var r = gate.getBoundingClientRect();
      if (r.top < window.innerHeight * 0.62 && r.bottom > 120) {
        jaAbriuDist = true;
        try { sessionStorage.setItem('vibe:gateDist', '1'); } catch (e) {}
        window.removeEventListener('scroll', checarGateDist);
        abrirModalDist();
      }
    };
    window.addEventListener('scroll', checarGateDist, { passive: true });
  }

  /* Lightbox do feedback em vídeo. O iframe do Instagram nasce ao abrir e
     morre ao fechar — sem player de terceiro rodando em segundo plano e
     sem custo nenhum pra quem só passa pela seção. */
  var modalReel = $('#modalReel'), ultimoFocoReel = null;

  function abrirModalReel(code) {
    /* o código do reel entra numa URL: só aceita o alfabeto que o
       Instagram usa, pra nada estranho vazar de data.js pro src */
    if (!modalReel || !/^[A-Za-z0-9_-]{1,32}$/.test(code || '')) return;
    var url = 'https://www.instagram.com/reel/' + code + '/';
    ultimoFocoReel = document.activeElement;
    $('#modalReelPalco').innerHTML =
      '<iframe src="' + url + 'embed/captioned/" title="Feedback em vídeo no Instagram"' +
      ' frameborder="0" scrolling="no" allowtransparency="true"' +
      ' allow="autoplay; clipboard-write; encrypted-media; picture-in-picture"></iframe>';
    $('#modalReelLink').href = url;
    modalReel.hidden = false;
    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', teclasModalReel);
    setTimeout(function () {
      var x = $('.modal-x', modalReel);
      if (x) x.focus();
    }, 60);
  }
  function fecharModalReel() {
    if (!modalReel || modalReel.hidden) return;
    modalReel.hidden = true;
    $('#modalReelPalco').innerHTML = '';
    document.body.style.overflow = '';
    document.removeEventListener('keydown', teclasModalReel);
    if (ultimoFocoReel) ultimoFocoReel.focus();
  }
  function teclasModalReel(e) {
    if (e.key === 'Escape') return fecharModalReel();
    if (e.key !== 'Tab') return;
    var foco = $$('button, a[href]', modalReel).filter(function (el) { return el.offsetParent !== null; });
    if (!foco.length) return;
    var pri = foco[0], ult = foco[foco.length - 1];
    if (e.shiftKey && document.activeElement === pri) { e.preventDefault(); ult.focus(); }
    else if (!e.shiftKey && document.activeElement === ult) { e.preventDefault(); pri.focus(); }
  }
  function ligarModalReel() {
    if (!modalReel) return;
    $$('[data-fechar-reel]').forEach(function (el) { el.addEventListener('click', fecharModalReel); });
    /* delegado: os cards nascem depois, no renderFeedbacks() */
    document.addEventListener('click', function (e) {
      var b = e.target.closest('[data-reel]');
      if (b) abrirModalReel(b.getAttribute('data-reel'));
    });
  }

  /* Popup "Vibe Academy" (persona técnico) — abre só no clique do botão da
     seção de marca, sem gatilho automático de rolagem. Ainda sem função de
     verdade: o formulário só confirma visualmente, não grava em lugar
     nenhum (a Academia em si ainda nem lançou). */
  var modalAcademy = $('#modalAcademy'), formAcademy = $('#formAcademy'), ultimoFocoAcademy = null;

  function abrirModalAcademy() {
    ultimoFocoAcademy = document.activeElement;
    modalAcademy.hidden = false;
    document.body.style.overflow = 'hidden';
    setTimeout(function () { $('#anome').focus(); }, 60);
    document.addEventListener('keydown', teclasModalAcademy);
  }
  function fecharModalAcademy() {
    modalAcademy.hidden = true;
    document.body.style.overflow = '';
    document.removeEventListener('keydown', teclasModalAcademy);
    if (ultimoFocoAcademy) ultimoFocoAcademy.focus();
  }
  function teclasModalAcademy(e) {
    if (e.key === 'Escape') return fecharModalAcademy();
    if (e.key !== 'Tab') return;
    var foco = $$('button, input, a[href]', modalAcademy).filter(function (el) { return !el.disabled && el.offsetParent !== null; });
    if (!foco.length) return;
    var pri = foco[0], ult = foco[foco.length - 1];
    if (e.shiftKey && document.activeElement === pri) { e.preventDefault(); ult.focus(); }
    else if (!e.shiftKey && document.activeElement === ult) { e.preventDefault(); pri.focus(); }
  }

  function ligarModalAcademy() {
    var btn = $('#brandStreamAcademyBtn');
    if (!btn || !modalAcademy) return;
    btn.addEventListener('click', abrirModalAcademy);
    $$('[data-fechar-academy]').forEach(function (el) { el.addEventListener('click', fecharModalAcademy); });

    var campoWpp = $('#awpp');
    if (campoWpp) campoWpp.addEventListener('input', function () { campoWpp.value = mascaraTel(campoWpp.value); });

    formAcademy.addEventListener('submit', function (e) {
      e.preventDefault();
      formAcademy.hidden = true;
      $('#academyOk').hidden = false;
    });
  }

  function mascaraTel(v) {
    var d = v.replace(/\D/g, '').slice(0, 11);
    if (d.length <= 2) return d.length ? '(' + d : '';
    if (d.length <= 6) return '(' + d.slice(0, 2) + ') ' + d.slice(2);
    if (d.length <= 10) return '(' + d.slice(0, 2) + ') ' + d.slice(2, 6) + '-' + d.slice(6);
    return '(' + d.slice(0, 2) + ') ' + d.slice(2, 7) + '-' + d.slice(7);
  }

  function mostrarErro(campo, msg) {
    var el = $('[data-erro="' + campo + '"]');
    if (el) el.textContent = msg || '';
  }

  function ligarModal() {
    $('#gateBtn').addEventListener('click', abrirModal);
    $$('[data-fechar]').forEach(function (el) { el.addEventListener('click', fecharModal); });

    var tel = $('#lw');
    tel.addEventListener('input', function () { tel.value = mascaraTel(tel.value); });

    /* CTAs que levam ao mapa abrem o popup */
    $$('a[href="#distribuidores"]').forEach(function (a) {
      a.addEventListener('click', function () {
        if (!estado.lead) setTimeout(abrirModal, 700);
      });
    });

    /* abre sozinho quando o usuário chega na seção (uma vez por visita) */
    var jaAbriu = sessionStorage.getItem('vibe:gate') === '1';
    var checarGate = function () {
      if (jaAbriu || estado.lead) { window.removeEventListener('scroll', checarGate); return; }
      var gate = $('#gate');
      if (!gate || gate.hidden) return;
      var r = gate.getBoundingClientRect();
      if (r.top < window.innerHeight * 0.62 && r.bottom > 120) {
        jaAbriu = true;
        try { sessionStorage.setItem('vibe:gate', '1'); } catch (e) {}
        window.removeEventListener('scroll', checarGate);
        abrirModal();
      }
    };
    window.addEventListener('scroll', checarGate, { passive: true });

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var nome = $('#ln').value.trim();
      var fone = $('#lw').value.replace(/\D/g, '');
      var ok = true;

      mostrarErro('nome'); mostrarErro('whatsapp'); mostrarErro('consent');
      $('#ln').classList.remove('inv'); $('#lw').classList.remove('inv');

      if (nome.length < 3) { mostrarErro('nome', 'Informe seu nome completo.'); $('#ln').classList.add('inv'); ok = false; }
      if (fone.length < 10 || fone.length > 11) { mostrarErro('whatsapp', 'Informe um WhatsApp com DDD.'); $('#lw').classList.add('inv'); ok = false; }
      if (!$('#lc').checked) { mostrarErro('consent', 'É preciso autorizar o contato.'); ok = false; }
      if (!ok) return;

      var lead = {
        nome: nome,
        whatsapp: fone,
        whatsappFmt: $('#lw').value,
        perfil: estado.perfilLead || estado.persona,
        origem: location.href,
        data: new Date().toISOString()
      };
      estado.lead = lead;
      gravar(LS_LEAD, lead);
      enviarLead(lead);

      fecharModal();
      liberarMapa(true);
    });
  }

  /* Envia o lead para onde você quiser (webhook opcional em data.js) */
  function enviarLead(lead) {
    if (window.dataLayer) window.dataLayer.push({ event: 'lead_distribuidor', perfil: lead.perfil });
    if (!CONFIG.leadWebhook) { console.info('[Vibe] Lead capturado:', lead); return; }
    /* text/plain evita o preflight de CORS que o Google Apps Script não
       responde — o Apps Script lê o corpo como JSON normalmente. */
    fetch(CONFIG.leadWebhook, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify(lead)
    }).catch(function (err) { console.warn('[Vibe] Falha ao enviar lead:', err); });
  }

  /* ============================================================
     5. MAPA DE DISTRIBUIDORES
     ============================================================ */
  function liberarMapa(rolar) {
    if (P().mapa && P().mapa.formulario) return; /* distribuidor usa o formulário, não o mapa técnico */
    $('#gate').hidden = true;
    $('#mapzone').hidden = false;
    $('#olaMsg').innerHTML = '<svg class="ico"><use href="#i-check"/></svg> Olá, ' +
      esc(estado.lead.nome.split(' ')[0]) + '. Encontre abaixo a Vibe mais próxima de você.';

    carregarLeaflet(function () {
      iniciarMapa();
      renderDistribuidoras();
      if (rolar) $('#mapzone').scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }

  function carregarLeaflet(cb) {
    if (window.L) return cb();
    var css = document.createElement('link');
    css.rel = 'stylesheet';
    css.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
    /* entra ANTES da folha do site para que o nosso tema
       sobrescreva o visual padrão do Leaflet */
    var nossa = document.querySelector('link[href*="style.css"]');
    if (nossa) nossa.parentNode.insertBefore(css, nossa);
    else document.head.appendChild(css);

    var js = document.createElement('script');
    js.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
    js.onload = cb;
    js.onerror = function () {
      $('#mapa').innerHTML = '<div class="vazio">Não foi possível carregar o mapa agora. A lista de distribuidores continua disponível ao lado.</div>';
      renderDistribuidoras();
    };
    document.head.appendChild(js);
  }

  function iniciarMapa() {
    if (estado.mapa || !window.L) return;
    estado.mapa = L.map('mapa', { scrollWheelZoom: false, zoomControl: true }).setView([-15.2, -50.5], 4);
    estado.camada = L.tileLayer(TILES[P().tema], { maxZoom: 19, attribution: ATRIB }).addTo(estado.mapa);
    estado.mapa.on('click', function () { estado.mapa.scrollWheelZoom.enable(); });
    estado.leafletPronto = true;
  }

  function trocarTiles() {
    if (!estado.mapa || !window.L) return;
    if (estado.camada) estado.mapa.removeLayer(estado.camada);
    estado.camada = L.tileLayer(TILES[P().tema], { maxZoom: 19, attribution: ATRIB }).addTo(estado.mapa);
  }

  function distanciaKm(a, b) {
    var R = 6371, r = Math.PI / 180;
    var dLat = (b.lat - a.lat) * r, dLng = (b.lng - a.lng) * r;
    var h = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(a.lat * r) * Math.cos(b.lat * r) * Math.sin(dLng / 2) * Math.sin(dLng / 2);
    return Math.round(2 * R * Math.asin(Math.sqrt(h)));
  }

  function listaFiltrada() {
    var termo = ($('#buscaDist').value || '').toLowerCase().trim();
    var regiao = $('#filtroRegiao').value;
    var itens = DISTRIBUIDORAS.filter(function (d) {
      if (d.atende.indexOf(estado.persona) === -1) return false;
      if (regiao && d.regiao !== regiao) return false;
      if (!termo) return true;
      return (d.nome + ' ' + d.cidade + ' ' + d.uf + ' ' + d.endereco + ' ' + d.regiao).toLowerCase().indexOf(termo) > -1;
    });
    if (estado.coordUsuario) {
      itens = itens.map(function (d) {
        d.dist = distanciaKm(estado.coordUsuario, d);
        return d;
      }).sort(function (a, b) { return a.dist - b.dist; });
    }
    return itens;
  }

  function msgDistribuidor(d) {
    var nome = estado.lead ? estado.lead.nome.split(' ')[0] : '';
    return P().msgWhatsappDist + (nome ? ' Meu nome é ' + nome + '.' : '') + ' (Unidade ' + d.cidade + '/' + d.uf + ')';
  }
  function linkRota(d) {
    return 'https://www.google.com/maps/dir/?api=1&destination=' + d.lat + ',' + d.lng;
  }

  function renderDistribuidoras() {
    var itens = listaFiltrada();
    var lista = $('#listaDist');

    if (!itens.length) {
      lista.innerHTML = '<p class="vazio">Nenhum distribuidor encontrado com esse filtro.<br>Fale com a gente que indicamos o ponto mais próximo.</p>';
    } else {
      lista.innerHTML = itens.map(function (d) {
        return '<article class="dist" data-id="' + d.id + '" tabindex="0" aria-label="Ver ' + esc(d.nome) + ' no mapa">' +
          '<div class="dist-top"><span class="dist-nome">' + esc(d.nome) + '</span>' +
          '<span class="dist-uf">' + esc(d.uf) + (d.dist != null ? ' · ' + d.dist + ' km' : '') + '</span></div>' +
          '<p class="dist-end">' + esc(d.endereco) + ' — ' + esc(d.cidade) + '</p>' +
          '<p class="dist-hr">' + icone('clock') + esc(d.horario) + '</p>' +
          '<div class="dist-selos">' + d.selos.map(function (s) { return '<span>' + esc(s) + '</span>'; }).join('') + '</div>' +
          '<div class="dist-acoes">' +
            '<a class="btn btn-whats" href="' + linkWhats(d.whatsapp, msgDistribuidor(d)) + '" target="_blank" rel="noopener">' +
              icone('whats') + 'WhatsApp</a>' +
            '<a class="btn btn-ghost" href="' + linkRota(d) + '" target="_blank" rel="noopener">' +
              icone('rota') + 'Ver rota</a>' +
          '</div></article>';
      }).join('');
    }

    $$('.dist', lista).forEach(function (card) {
      var foco = function (e) {
        if (e.target.closest('a')) return;
        selecionar(parseInt(card.getAttribute('data-id'), 10));
      };
      card.addEventListener('click', foco);
      card.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); foco(e); }
      });
    });

    desenharMarcadores(itens);
  }

  function desenharMarcadores(itens) {
    if (!estado.mapa || !window.L) return;

    Object.keys(estado.marcadores).forEach(function (id) {
      estado.mapa.removeLayer(estado.marcadores[id]);
    });
    estado.marcadores = {};

    var pontos = [];
    itens.forEach(function (d) {
      var ic = L.divIcon({
        className: '',
        html: '<div class="pin-vibe">' + barras() + '</div>',
        iconSize: [34, 40],
        iconAnchor: [17, 40],
        popupAnchor: [0, -38]
      });
      var m = L.marker([d.lat, d.lng], { icon: ic, title: d.nome }).addTo(estado.mapa);
      m.bindPopup(
        '<div class="pop-tit">' + esc(d.nome) + '</div>' +
        '<div class="pop-end">' + esc(d.endereco) + '<br>' + esc(d.cidade) + '/' + esc(d.uf) + ' · ' + esc(d.cep) + '</div>' +
        '<div class="pop-end">' + esc(d.horario) + '<br>' + esc(d.tel) + '</div>' +
        '<div class="pop-acoes">' +
          '<a class="pop-wa" href="' + linkWhats(d.whatsapp, msgDistribuidor(d)) + '" target="_blank" rel="noopener">WhatsApp</a>' +
          '<a class="pop-rota" href="' + linkRota(d) + '" target="_blank" rel="noopener">Ver rota</a>' +
        '</div>'
      );
      m.on('click', function () { marcarCard(d.id); });
      estado.marcadores[d.id] = m;
      pontos.push([d.lat, d.lng]);
    });

    if (pontos.length) {
      estado.mapa.fitBounds(pontos, { padding: [45, 45], maxZoom: estado.coordUsuario ? 8 : 6 });
    }
  }

  function marcarCard(id) {
    $$('.dist').forEach(function (c) { c.classList.toggle('on', c.getAttribute('data-id') === String(id)); });
  }

  function selecionar(id) {
    var d = DISTRIBUIDORAS.filter(function (x) { return x.id === id; })[0];
    if (!d) return;
    marcarCard(id);
    var m = estado.marcadores[id];
    if (estado.mapa && m) {
      estado.mapa.flyTo([d.lat, d.lng], 12, { duration: .8 });
      setTimeout(function () { m.openPopup(); }, 850);
      if (window.innerWidth <= 1024) $('.mapa-box').scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }

  function ligarFiltros() {
    var t;
    $('#buscaDist').addEventListener('input', function () {
      clearTimeout(t);
      t = setTimeout(renderDistribuidoras, 180);
    });
    $('#filtroRegiao').addEventListener('change', renderDistribuidoras);

    $('#btnPerto').addEventListener('click', function () {
      var btn = this;
      if (!navigator.geolocation) { alert('Seu navegador não permite localização. Use a busca por cidade.'); return; }
      btn.disabled = true;
      btn.textContent = 'Localizando...';
      navigator.geolocation.getCurrentPosition(function (pos) {
        estado.coordUsuario = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        renderDistribuidoras();
        btn.disabled = false;
        btn.innerHTML = icone('check') + ' Ordenado por distância';
      }, function () {
        btn.disabled = false;
        btn.innerHTML = icone('pin') + ' Perto de mim';
        alert('Não conseguimos acessar sua localização. Busque pela cidade no campo ao lado.');
      }, { timeout: 8000 });
    });
  }

  /* ============================================================
     VIBECAST — episódio em destaque (thumb estática, sem player
     embedado; o clique leva direto para o YouTube). O título real
     do vídeo é buscado na API pública oEmbed do YouTube (sem
     chave), pra não depender de copy digitada à mão. */
  /* Busca a thumb estática (com fallback pra vídeo sem maxres) e o título
     real via oEmbed do YouTube — sem chave, sem player embedado. Reusado
     pelo card único (distribuidor) e pela grade de episódios (técnico). */
  function carregarThumbETitulo(id, img, elTitulo) {
    img.addEventListener('load', function () {
      if (img.naturalWidth <= 120) img.src = 'https://img.youtube.com/vi/' + id + '/hqdefault.jpg';
    });
    img.src = 'https://img.youtube.com/vi/' + id + '/maxresdefault.jpg';

    var watchUrl = 'https://www.youtube.com/watch?v=' + id;
    fetch('https://www.youtube.com/oembed?url=' + encodeURIComponent(watchUrl) + '&format=json')
      .then(function (r) { return r.ok ? r.json() : null; })
      .then(function (j) { if (j && j.title) elTitulo.textContent = j.title; })
      .catch(function () { /* API fora do ar: mantém o texto padrão do HTML */ });
  }

  function ligarVibecast() {
    /* Card único em destaque (persona distribuidor) */
    var card = $('#vibecastCard');
    if (card && CONFIG.vibecastVideoId) {
      card.href = 'https://www.youtube.com/watch?v=' + CONFIG.vibecastVideoId;
      carregarThumbETitulo(CONFIG.vibecastVideoId, $('#vibecastThumb'), $('#vibecastTitulo'));
    }

    /* Vitrine "Conheça o nosso canal" — 4 episódios lado a lado (persona
       técnico); no mobile a grade vira carrossel (ver CSS). */
    var grid = $('#vibecastGrid');
    var ids = CONFIG.vibecastCanalIds;
    if (grid && ids && ids.length) {
      grid.innerHTML = ids.map(function (id) {
        return '<a class="vibecast-ep" href="https://www.youtube.com/watch?v=' + id + '" target="_blank" rel="noopener" data-vc-id="' + id + '" aria-label="Assistir no YouTube (abre em nova aba)">' +
          '<span class="vibecast-ep-thumb">' +
            '<img alt="" loading="lazy">' +
            '<span class="vibecast-ep-play" aria-hidden="true">' + icone('play') + '</span>' +
          '</span>' +
          '<span class="vibecast-ep-nome">Vibecast</span>' +
          '<span class="vibecast-ep-cta">' + icone('youtube') + '<span>Ver no YouTube</span></span>' +
        '</a>';
      }).join('');

      $$('.vibecast-ep', grid).forEach(function (a) {
        carregarThumbETitulo(a.dataset.vcId, $('img', a), $('.vibecast-ep-nome', a));
      });

      /* os cards nasceram depois do primeiro prepararReveal() (renderTudo
         já tinha rodado), então precisam entrar no radar do reveal agora */
      prepararReveal();
    }
  }

  /* ============================================================
     INICIALIZAÇÃO
     ============================================================ */
  function init() {
    $('#ano').textContent = new Date().getFullYear();

    /* mais de um link do Instagram na página (rodapé + seção de feedbacks) */
    $$('[data-instagram]').forEach(function (a) { a.href = CONFIG.instagram; });
    var site = $('[data-site]');
    if (site) site.href = CONFIG.siteOficial;
    var garantiaBtn = $('#garantiaBtn');
    if (garantiaBtn) garantiaBtn.href = CONFIG.garantiaPdf;

    renderTudo(false);
    ligarHeader();
    ligarModal();
    ligarModalDist();
    ligarModalAcademy();
    ligarModalReel();
    ligarFiltros();
    montarBrandStream();
    ligarFanLinhas();
    ligarFormDistribuidor();
    ligarVibecast();

    /* visitante que já preencheu antes: mapa liberado direto */
    if (estado.lead) liberarMapa(false);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
