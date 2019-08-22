'use strict';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var MemoryStorage =
/*#__PURE__*/
function () {
  function MemoryStorage() {
    _classCallCheck(this, MemoryStorage);

    this.items = [];
  }

  _createClass(MemoryStorage, [{
    key: "getItem",
    value: function getItem(key) {
      return this.items[key];
    }
  }, {
    key: "setItem",
    value: function setItem(key, value) {
      this.items[key] = value;
    }
  }]);

  return MemoryStorage;
}();

window.memoryStorage = new MemoryStorage();
module.exports = MemoryStorage;
