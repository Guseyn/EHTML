'use strict';

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

var StringWithAppliedStorageVariables = require('./util/StringWithAppliedStorageVariables');

var StringWithAppliedUrlParams = require('./util/StringWithAppliedUrlParams');

function E(name, ELEMENT, renderImmediately, options) {
  ELEMENT.prototype.rendered = false;

  if (renderImmediately && _typeof(renderImmediately) === 'object') {
    options = renderImmediately;
    ELEMENT.prototype.renderImmediately = false;
  } else {
    ELEMENT.prototype.renderImmediately = renderImmediately;
  }

  ELEMENT.prototype.render = function () {
    if (!this.rendered) {
      if (!this.onRender) {
        throw new Error('render function must be defined');
      }

      this.onRender();
      this.rendered = true;
    }
  };

  ELEMENT.prototype.applyStorageValuesAndUrlParamsToAttributes = function () {
    for (var i = 0; i < this.attributes.length; i++) {
      this.setAttribute(this.attributes[i].name, new StringWithAppliedStorageVariables(new StringWithAppliedUrlParams(this.attributes[i].value).value()).value());
    }
  };

  ELEMENT.prototype.connectedCallback = function () {
    var _this = this;

    this.applyStorageValuesAndUrlParamsToAttributes();

    if (!this.renderImmediately) {
      setTimeout(function () {
        _this.render();
      });
    } else {
      this.render();
    }
  };

  window.customElements.define(name, ELEMENT, options);
  return ELEMENT;
}

module.exports = E;
