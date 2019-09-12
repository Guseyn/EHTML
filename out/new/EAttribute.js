'use strict';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var EAttribute =
/*#__PURE__*/
function () {
  function EAttribute(elm, name, value) {
    _classCallCheck(this, EAttribute);

    this.elm = elm;
    this.name = name;
    this.value = value;
  }

  _createClass(EAttribute, [{
    key: "is",
    value: function is(name) {
      return this.name === name;
    }
  }, {
    key: "applyStorageVariables",
    value: function applyStorageVariables() {
      this.applyLocalStorageVariables();
      this.applyMemoryStorageVariables();
    }
  }, {
    key: "applyLocalStorageVariables",
    value: function applyLocalStorageVariables() {
      this.elm.setAttribute(this.name, this.value.replace(/\$\{localStorage\.(.+)\}/g, function (match, p1, offset, string) {
        return localStorage.getItem(p1);
      }));
    }
  }, {
    key: "applyMemoryStorageVariables",
    value: function applyMemoryStorageVariables() {
      this.elm.setAttribute(this.name, this.value.replace(/\$\{memoryStorage\.(.+)\}/g, function (match, p1, offset, string) {
        // eslint-disable-next-line no-undef
        return memoryStorage.getItem(p1);
      }));
    }
  }]);

  return EAttribute;
}();

module.exports = EAttribute;
