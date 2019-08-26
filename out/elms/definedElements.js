'use strict';

var definedElm = function definedElm(elmName, ELM_PROTOTYPE) {
  window.customElements.define(elmName, ELM_PROTOTYPE);
};

definedElm('e-form', require('./e-form'));
definedElm('e-google-oauth-button', require('./e-google-oauth-button'));
definedElm('e-html', require('./e-html'));
definedElm('e-json', require('./e-json'));
definedElm('e-local-storage-value', require('./e-local-storage-value'));
definedElm('e-memory-storage-value', require('./e-memory-storage-value'));
