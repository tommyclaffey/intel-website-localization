/* ============================================================
   Newsletter form.

   Validation with messages people can SEE, READ in their own
   language, and HEAR with a screen reader. The browser's native
   bubbles do none of those reliably, so the form is novalidate
   and this file does the reporting instead.

   There is no backend. On success the form says so honestly
   rather than pretending something was sent.
   ============================================================ */

(function () {
  'use strict';

  const form = document.getElementById('subscribe-form');
  const status = document.getElementById('subscribe-status');
  if (!form || !status) return;

  const fields = Array.prototype.slice.call(form.querySelectorAll('input[required]'));

  /* aria-invalid is what a screen reader announces as "invalid entry".
     Bootstrap's red border is visual only -- colour alone never carries
     an error, so the message text and this attribute carry it too. */
  function mark(field) {
    const ok = field.checkValidity();
    field.setAttribute('aria-invalid', ok ? 'false' : 'true');
    field.classList.toggle('is-invalid', !ok);
    return ok;
  }

  // Once someone has tried to submit, re-check each field as they fix it.
  fields.forEach(function (field) {
    const evt = field.type === 'checkbox' ? 'change' : 'input';
    field.addEventListener(evt, function () {
      if (form.dataset.attempted) mark(field);
    });
  });

  form.addEventListener('submit', function (event) {
    event.preventDefault();
    form.dataset.attempted = 'true';

    const invalid = fields.filter(function (field) { return !mark(field); });

    if (invalid.length) {
      /* Focus the FIRST broken field. Its aria-describedby points at the
         error text, so focusing it reads the problem out -- no separate
         announcement needed, and the keyboard user is already where the
         fix happens. */
      status.removeAttribute('data-i18n');
      status.textContent = '';
      status.classList.remove('is-success');
      invalid[0].focus();
      return;
    }

    /* data-i18n on the status, not a hard-coded string: switch language
       after subscribing and the confirmation re-translates with the page. */
    status.setAttribute('data-i18n', 'sub.success');
    const lang = document.documentElement.getAttribute('lang') || 'en';
    const dict = window.I18N.TRANSLATIONS[lang] || window.I18N.TRANSLATIONS.en;
    status.textContent = dict['sub.success'];
    status.classList.add('is-success');

    form.reset();
    delete form.dataset.attempted;
    fields.forEach(function (field) {
      field.removeAttribute('aria-invalid');
      field.classList.remove('is-invalid');
    });
  });
})();
