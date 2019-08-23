'use strict';

var defineElm = function defineElm(elmName, ELM_PROTOTYPE) {
  if (!customElements.get(elmName)) {
    window.customElements.define(elmName, ELM_PROTOTYPE);
  }
};

defineElm('e-form', require('./e-form'));
defineElm('e-google-oauth-button', require('./e-google-oauth-button'));
defineElm('e-html', require('./e-html'));
defineElm('e-json', require('./e-json'));
