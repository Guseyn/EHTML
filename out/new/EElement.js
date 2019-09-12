"use strict";
'use strcit';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var _require = require('@page-libs/cutie'),
    browserified = _require.browserified;

var _browserified = browserified(require('@cuties/object')),
    TheSameObjectWithValue = _browserified.TheSameObjectWithValue;

var EAttributes = require('./EAttributes');

var EActions = require('./EActions');

var EElement =
/*#__PURE__*/
function () {
  function EElement(elm, observedAttributes, supportedActions) {
    _classCallCheck(this, EElement);

    this.elm = elm;
    this.elm.attrs = new EAttributes(this.elm);
    this.elm.observedAttributes = observedAttributes;
    this.elm.supportedActions = supportedActions;
    this.elm.rendered = false;
    this.elm.attrValue = this.attrValue;
    this.elm.appliedActions = this.appliedActions;
    this.elm.connectedCallback = this.connectedCallback;
    return this.elm;
  }

  _createClass(EElement, [{
    key: "attrValue",
    value: function attrValue(name) {
      return this.elm.attrs.value(name);
    }
  }, {
    key: "appliedActions",
    value: function appliedActions(value) {
      var OBJ = {};
      return new TheSameObjectWithValue(OBJ, this.elm.attrs.value('data-object') || 'OBJECT_NAME', value).after(new EActions(this.elm.tagName, this.elm.attrs.value('data-object'), this.elm.supportedActions).asAsyncTree(OBJ));
    }
  }, {
    key: "connectedCallback",
    value: function connectedCallback(render) {
      var _this = this;

      this.attrs.each(function (attr) {
        if (!attr.is('data-actions')) {
          attr.applyStorageVariables();
        }
      });
      setTimeout(function () {
        if (!_this.elm.rendered) {
          render();
          _this.elm.rendered = true;
        }
      });
    }
  }]);

  return EElement;
}();

module.exports = EElement;
