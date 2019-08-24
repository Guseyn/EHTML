'use strict';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var MemoryStorage =
/*#__PURE__*/
function () {
  function MemoryStorage() {
    _classCallCheck(this, MemoryStorage);

    this.items = {};
  }

  _createClass(MemoryStorage, [{
    key: "getItem",
    value: function getItem(keyPath) {
      var keyParts = keyPath.split('.');
      var key = keyParts[0];
      var pathOfValue = keyParts.splice(1).join('.');

      if (pathOfValue.length === 0) {
        return this.items[key];
      } // eslint-disable-next-line no-eval


      return eval("this.items['".concat(key, "'].").concat(pathOfValue));
    }
  }, {
    key: "setItem",
    value: function setItem(keyPath, value) {
      var keyParts = keyPath.split('.');
      var key = keyParts[0];
      var pathOfValue = keyParts.splice(1).join('.');

      if (pathOfValue.length === 0) {
        this.items[key] = value;
      } else {
        // eslint-disable-next-line no-eval
        eval("this.items['".concat(key, "'].").concat(pathOfValue, " = value"));
      }
    }
  }]);

  return MemoryStorage;
}();

module.exports = MemoryStorage;
