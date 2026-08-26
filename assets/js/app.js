/* ============================================================
   VIBE CELL — Lógica do site
   1. Estado (persona/lead) · 2. Render de conteúdo
   3. Header, menu, reveal, FAQ · 4. Popup de captura
   5. Mapa de distribuidores (Leaflet + OpenStreetMap)

   A visão escolhida na pílula troca conteúdo E tema:
   lojista = tema claro (padrão) · técnico = tema escuro.
   ============================================================ */
(function () {
  'use strict';

  var $  = function (s, ctx) { return (ctx || document).querySelector(s); };
  var $$ = function (s, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(s)); };
  var LS_PERSONA = 'vibe:persona';
  var LS_LEAD    = 'vibe:lead';

  /* Tiles do mapa por tema (CARTO sobre dados do OpenStreetMap) */
  var TILES = {
    claro:  'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',
    escuro: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
  };
  var ATRIB = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>';

  /* ============================================================
     1. ESTADO
     ============================================================ */
  var estado = {
    persona: lerPersonaInicial(),
    lead: lerJSON(LS_LEAD),
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
    var url = new URLSearchParams(location.search).get('perfil');
    if (url && PERSONAS[url]) return url;
    var salva = null;
    try { salva = localStorage.getItem(LS_PERSONA); } catch (e) {}
    return PERSONAS[salva] ? salva : (CONFIG.personaPadrao || 'lojista');
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
  var BENEF_MOCKUPS = [
    function () { // 1. Qualidade previsível — selo pulsando
      return '<div class="mock mock-ping">' +
        '<span class="mock-ring"></span><span class="mock-ring"></span><span class="mock-ring"></span>' +
        icone('check', 'mock-core') + '</div>';
    },
    function () { // 2. Produtos para diferentes perfis — níveis acendendo
      return '<div class="mock mock-tiers"><span></span><span></span><span></span></div>';
    },
    function () { // 3. Mais segurança no pós-venda — escudos em sequência
      return '<div class="mock mock-shields">' +
        icone('shield', 'mock-shield') + icone('shield', 'mock-shield') + icone('shield', 'mock-shield') +
        '</div>';
    },
    function () { // 4. Mix pensado para o mercado — grade de opções
      return '<div class="mock mock-swatches">' +
        '<span></span><span></span><span></span><span></span><span></span><span></span></div>';
    },
    function () { // 5. Atendimento especializado — chat digitando
      return '<div class="mock mock-chat"><span class="mock-bubble">' +
        icone('chat', 'mock-chat-ico') +
        '<span class="mock-dots"><i></i><i></i><i></i></span></span></div>';
    },
    function () { // 6. Distribuição estratégica — foto + pino pulsando
      return '<div class="mock mock-radar">' +
        '<span class="mock-ring"></span><span class="mock-ring"></span>' +
        icone('pin', 'mock-core') + '</div>';
    }
  ];

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

    /* selos do hero */
    $('#heroSelos').innerHTML = p.hero.selos.map(function (s) {
      return '<li>' + icone('check') + '<span>' + esc(s) + '</span></li>';
    }).join('');

    /* faixa de autoridade (atributos, sem números) */
    $('#autoridade').innerHTML = p.autoridade.map(function (a) {
      return '<li><span class="aut-ico">' + icone(a.i) + '</span>' +
             '<h3>' + esc(a.t) + '</h3><p>' + esc(a.d) + '</p></li>';
    }).join('');

    /* dores — cascata de consequências: a gravidade cresce a cada item, do
       sintoma inicial ao desfecho, sem depender de nenhum número — só o
       índice, o friso e a barra de peso ficam mais intensos a cada passo. */
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

    /* benefícios — grade "bento", cada posição tem sua própria mini-animação */
    $('#benefGrid').innerHTML = p.beneficios.itens.map(function (b, idx) {
      var mock = BENEF_MOCKUPS[idx] ? BENEF_MOCKUPS[idx]() : '';
      var foto = idx === 5 ? ' card-photo' : '';
      return '<article class="card' + foto + '">' + mock +
             '<h3>' + esc(b.t) + '</h3><p>' + esc(b.d) + '</p></article>';
    }).join('');

    /* linhas de produto */
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

    /* pílulas */
    $$('[data-persona-btn]').forEach(function (b) {
      var on = b.getAttribute('data-persona-btn') === p.id;
      b.classList.toggle('is-on', on);
      b.setAttribute('aria-pressed', on ? 'true' : 'false');
    });

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
      var b = e.target.closest('[data-persona-btn]');
      if (b) trocarPersona(b.getAttribute('data-persona-btn'));
    });
  }

  function prepararReveal() {
    var alvos = $$('.hero-copy > *, .sec-hd > *, .dor, .card, .linha, .step, .depo, .faq-item, .gate, .prog-copy > *, .prog-art, .cta-in > *, .autoridade li');

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

  /* ============================================================
     4. POPUP DE CAPTURA (gate)
     ============================================================ */
  var modal = $('#modal'), form = $('#formLead'), ultimoFoco = null;

  function abrirModal() {
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
        perfil: estado.persona,
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
    fetch(CONFIG.leadWebhook, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(lead)
    }).catch(function (err) { console.warn('[Vibe] Falha ao enviar lead:', err); });
  }

  /* ============================================================
     5. MAPA DE DISTRIBUIDORES
     ============================================================ */
  function liberarMapa(rolar) {
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
     INICIALIZAÇÃO
     ============================================================ */
  function init() {
    $('#ano').textContent = new Date().getFullYear();

    var insta = $('[data-instagram]');
    if (insta) insta.href = CONFIG.instagram;
    var site = $('[data-site]');
    if (site) site.href = CONFIG.siteOficial;

    renderTudo(false);
    ligarHeader();
    ligarModal();
    ligarFiltros();

    /* visitante que já preencheu antes: mapa liberado direto */
    if (estado.lead) liberarMapa(false);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
