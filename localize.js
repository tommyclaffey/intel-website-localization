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

  const isRTL = (lang) => RTL_LANGS.indexOf(lang) !== -1;

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
    root.setAttribute('dir', dir);

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
})();
