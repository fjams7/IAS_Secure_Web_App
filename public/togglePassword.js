/* ── public/togglePassword.js ─────────────────────────────────────
   Usage:  <script src="/togglePassword.js"></script>
           initToggle('password');          // bare input id
           initToggle('editPassword');      // works on any password input
   Call initToggle() any time after the target <input> is in the DOM.   */

(function () {
  /* ── suppress the browser's native eye icon (once) ──── */
  let cssInjected = false;
  function injectCSS() {
    if (cssInjected) return;
    const s = document.createElement('style');
    s.textContent =
      'input[type="password"]::-webkit-credentials-auto-fill-button,' +
      'input[type="password"]::-webkit-contacts-auto-fill-button {' +
      '  display:none !important; }' +
      'input[type="password"]::-ms-clear,' +
      'input[type="password"]::-ms-reveal {' +
      '  display:none !important; }';
    document.head.appendChild(s);
    cssInjected = true;
  }

  /* ── SVG icons ─────────────────────────────────────── */
  const EYE =
    '<svg width="18" height="18" viewBox="0 0 24 24" fill="none"' +
    ' stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' +
    '<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>' +
    '<circle cx="12" cy="12" r="3"/></svg>';

  const EYE_OFF =
    '<svg width="18" height="18" viewBox="0 0 24 24" fill="none"' +
    ' stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' +
    '<path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94"/>' +
    '<path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19"/>' +
    '<line x1="1" y1="1" x2="23" y2="23"/></svg>';

  /* ── public API ────────────────────────────────────── */
  window.initToggle = function (inputId) {
    injectCSS();

    const input = document.getElementById(inputId);
    if (!input) return;                          // silently skip if not in DOM yet

    /* already initialised? */
    if (input.dataset.toggleInit === 'true') return;
    input.dataset.toggleInit = 'true';

    /* wrap input in a positioning container if not already wrapped */
    let wrapper = input.parentElement;
    if (wrapper.style.position !== 'relative') {
      wrapper.style.position = 'relative';
    }

    /* push the input's right edge inward so text doesn't hide behind the icon */
    input.style.paddingRight = '38px';

    /* create the toggle button */
    const btn = document.createElement('button');
    btn.type        = 'button';
    btn.innerHTML   = EYE;                       // starts as "show" (password is hidden)
    btn.style.cssText =
      'position:absolute;right:10px;top:50%;transform:translateY(-50%);' +
      'background:none;border:none;cursor:pointer;' +
      'color:var(--text-dim);padding:0;' +
      'display:flex;align-items:center;justify-content:center;' +
      'line-height:1;';

    btn.addEventListener('click', function () {
      const visible = input.type === 'text';
      input.type    = visible ? 'password' : 'text';
      btn.innerHTML = visible ? EYE : EYE_OFF;
    });

    /* insert button right after the input, inside the same wrapper */
    input.parentNode.insertBefore(btn, input.nextSibling);
  };
})();