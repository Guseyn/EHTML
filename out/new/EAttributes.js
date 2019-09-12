'use strict';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var EAttribute = require('./EAttribute');

var EAttributes =
/*#__PURE__*/
function () {
  function EAttributes(elm) {
    _classCallCheck(this, EAttributes);

    this.elm = elm;
    this.attrs = this.attributesAsArray();
  }

  _createClass(EAttributes, [{
    key: "value",
    value: function value(name) {
      return this.elm.getAttribute(name);
    }
  }, {
    key: "each",
    value: function each(attrFunc) {
      this.attrs.forEach(attrFunc);
    }
  }, {
    key: "attributesAsArray",
    value: function attributesAsArray() {
      var attrs = [];

      for (var i = 0; i < this.elm.attributes.length; i++) {
        attrs.push(new EAttribute(this.elm, this.elm.attributes[i].name, this.elm.attributes[i].value));
      }

      return attrs;
    }
  }]);

  return EAttributes;
}();

module.exports = EAttributes;
