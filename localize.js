/* ============================================================
   Localization engine.

   Reads the dictionary in i18n.js and applies it to the DOM.
   Nothing here knows any English — swap the dictionary and this
   file still works.
   ============================================================ */

(function () {
  'use strict';

  const { TRANSLATIONS, RTL_LANGS, DEFAULT_LANG, STORAGE_KEY } = window.I18N;

  /**
   * Which language to open in.
   *
   * Order matters: a saved choice beats the browser, because it is the only
   * signal the person gave DELIBERATELY. Reading navigator first would
   * silently overrule someone who picked Spanish on a machine set to English.
   */
  function initialLang() {
    /* ?lang=ar in the URL beats everything. It is the only way to SHARE a
       specific language -- "send the Arabic version to the Dubai team" is a
       link, not a set of instructions for using the dropdown. */
    const param = new URLSearchParams(window.location.search).get('lang');
    if (param && TRANSLATIONS[param.toLowerCase()]) return param.toLowerCase();

    let saved = null;
    try { saved = localStorage.getItem(STORAGE_KEY); } catch (e) { /* private mode */ }
    if (saved && TRANSLATIONS[saved]) return saved;

    /* navigator.languages is ordered by preference and can be ["en-GB","fr"].
       Only the BASE tag is matched: someone on en-GB should get English, not
       fall through to the default because "en-GB" is not a key. */
    const tags = navigator.languages || [navigator.language || ''];
    for (let i = 0; i < tags.length; i += 1) {
      const base = String(tags[i]).toLowerCase().split('-')[0];
      if (TRANSLATIONS[base]) return base;
    }
    return DEFAULT_LANG;
  }

  const isRTL = (lang) => RTL_LANGS.indexOf(String(lang).toLowerCase().split('-')[0]) !== -1;

  /* ---- Bootstrap has two builds, and direction decides which one loads ----

     dir="rtl" flips flexbox and text alignment for free. It does NOT flip the
     physical left/right values Bootstrap is full of -- form-check padding, the
     select arrow, the close button, the validation icons. Bootstrap ships a
     mirrored RTL build for exactly that, so the stylesheet is swapped rather
     than patched.

     integrity is set BEFORE href. The browser checks the hash against the file
     it is about to load; set href first and it fetches the RTL file while the
     LTR hash is still on the element, and refuses it. */
  const BOOTSTRAP = {
    ltr: {
      href: 'https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css',
      integrity: 'sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH'
    },
    rtl: {
      href: 'https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.rtl.min.css',
      integrity: 'sha384-dpuaG1suU0eT09tx5plTaGMLBsfDLzUCCUXOY2j/LSvXYuG6Bqs43ALlhIqAJVRb'
    }
  };

  function applyDirection(dir) {
    const root = document.documentElement;
    if (root.getAttribute('dir') !== dir) root.setAttribute('dir', dir);

    const link = document.getElementById('bootstrap-css');
    if (link && link.getAttribute('href') !== BOOTSTRAP[dir].href) {
      link.setAttribute('integrity', BOOTSTRAP[dir].integrity);
      link.setAttribute('href', BOOTSTRAP[dir].href);
    }
  }

  function apply(lang) {
    const dict = TRANSLATIONS[lang] || TRANSLATIONS[DEFAULT_LANG];
    const dir = isRTL(lang) ? 'rtl' : 'ltr';
    const root = document.documentElement;

    /* BOTH attributes, every time.

       `lang` is what a screen reader uses to choose a voice — without it,
       Arabic gets read aloud by an English synthesiser and is unintelligible.
       `dir` is what flips the layout. They are separate concerns and setting
       only one is the classic half-done localization. */
    root.setAttribute('lang', lang);
    applyDirection(dir);

    document.title = dict['doc.title'];

    // Visible text.
    document.querySelectorAll('[data-i18n]').forEach(function (el) {
      const key = el.getAttribute('data-i18n');
      if (dict[key] != null) el.textContent = dict[key];
    });

    /* Text that is NOT visible still has to be translated. Alt text and
       aria-labels are the whole interface for some people, and they are the
       first thing a localization pass forgets. */
    document.querySelectorAll('[data-i18n-alt]').forEach(function (el) {
      const key = el.getAttribute('data-i18n-alt');
      if (dict[key] != null) el.setAttribute('alt', dict[key]);
    });
    document.querySelectorAll('[data-i18n-aria-label]').forEach(function (el) {
      const key = el.getAttribute('data-i18n-aria-label');
      if (dict[key] != null) el.setAttribute('aria-label', dict[key]);
    });

    /* ⚠️ Years are NUMBERS, not text, so they are formatted rather than
       translated. Intl renders 1968 as ١٩٦٨ in Arabic — a translated page
       that still shows Western digits is only half localized.

       useGrouping: false because a year is not a quantity. Without it,
       en-US renders 2,030. */
    const nf = new Intl.NumberFormat(lang, { useGrouping: false });
    document.querySelectorAll('[data-year]').forEach(function (el) {
      el.textContent = nf.format(Number(el.getAttribute('data-year')));
    });

    try { localStorage.setItem(STORAGE_KEY, lang); } catch (e) { /* ignore */ }

    // Keep the dropdown honest if the language changed some other way.
    const select = document.getElementById('lang-select');
    if (select && select.value !== lang) select.value = lang;

    /* script.js owns the progress rail and has to recompute after a direction
       change — every measurement in it is horizontal. An event rather than a
       direct call, so neither file has to import the other. */
    document.dispatchEvent(new CustomEvent('languagechange', {
      detail: { lang: lang, dir: dir }
    }));
  }

  function buildSwitcher() {
    const select = document.getElementById('lang-select');
    if (!select) return;

    Object.keys(TRANSLATIONS).forEach(function (code) {
      const option = document.createElement('option');
      option.value = code;
      /* The name of each language IS WRITTEN IN THAT LANGUAGE — 日本語, not
         "Japanese". Someone who cannot read the current language still has to
         be able to find their own, which is the entire point of the control. */
      option.textContent = TRANSLATIONS[code]['lang.label'];
      option.lang = code;
      select.appendChild(option);
    });

    select.addEventListener('change', function () { apply(select.value); });
    return select;
  }

  const select = buildSwitcher();
  const lang = initialLang();
  if (select) select.value = lang;
  apply(lang);

  /* ---- Auto-detect: watch <html lang> and follow it (LevelUp) ----

     The dropdown is not the only thing that can change the page's language.
     Browser translation (Chrome's "Translate to Arabic") rewrites the lang
     attribute on <html> and nothing else -- the text turns Arabic while the
     layout stays left-to-right.

     A MutationObserver watches that one attribute. Whenever it changes, by
     anything, direction is recomputed from it. The page's layout follows the
     language it is actually in, not the language it was last told. */
  /* Two signals, because translators do not all use the same one:
     - Chrome's built-in translate and the Google Translate widget both rewrite
       <html lang> to the target language
     - Google Translate also adds a class to <html>: `translated-rtl` or
       `translated-ltr`. When present it is the most direct answer, so it wins. */
  let lastKey = null;
  new MutationObserver(function () {
    const root = document.documentElement;
    const current = root.getAttribute('lang') || DEFAULT_LANG;
    const cls = root.classList.contains('translated-rtl') ? 'rtl'
              : root.classList.contains('translated-ltr') ? 'ltr' : '';
    const key = current + '|' + cls;
    if (key === lastKey) return;
    lastKey = key;

    const dir = cls || (isRTL(current) ? 'rtl' : 'ltr');
    applyDirection(dir);
    document.dispatchEvent(new CustomEvent('languagechange', {
      detail: { lang: current, dir: dir }
    }));
  }).observe(document.documentElement, { attributes: true, attributeFilter: ['lang', 'class'] });
})();
