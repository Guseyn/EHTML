'use strict';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var PreparedProgressBars =
/*#__PURE__*/
function () {
  function PreparedProgressBars(progressBars) {
    _classCallCheck(this, PreparedProgressBars);

    this.progressBars = progressBars;
  }

  _createClass(PreparedProgressBars, [{
    key: "value",
    value: function value() {
      for (var index = 0; index < this.progressBars.length; index++) {
        if (this.progressBars[index]) {
          var progressBar = this.progressBars[index];
          progressBar.max = 100;
          progressBar.value = 0;
          progressBar.style.display = 'none';
        }
      }

      return this.progressBars;
    }
  }]);

  return PreparedProgressBars;
}();

module.exports = PreparedProgressBars;
