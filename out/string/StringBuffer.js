'use strict';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var StringBuffer =
/*#__PURE__*/
function () {
  function StringBuffer() {
    _classCallCheck(this, StringBuffer);

    this.strings = [];
  }

  _createClass(StringBuffer, [{
    key: "append",
    value: function append(string) {
      this.strings.push(string);
    }
  }, {
    key: "toString",
    value: function toString() {
      return this.strings.join('');
    }
  }]);

  return StringBuffer;
}();

module.exports = StringBuffer;
