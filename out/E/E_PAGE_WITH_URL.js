'use strict';

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var E = require('./E');

var E_PAGE_WITH_URL =
/*#__PURE__*/
function (_E) {
  _inherits(E_PAGE_WITH_URL, _E);

  function E_PAGE_WITH_URL(node) {
    _classCallCheck(this, E_PAGE_WITH_URL);

    return _possibleConstructorReturn(this, _getPrototypeOf(E_PAGE_WITH_URL).call(this, node));
  }

  _createClass(E_PAGE_WITH_URL, [{
    key: "activate",
    value: function activate() {
      var urlParams = {};
      var urlPattern = this.node.getAttribute('data-url-pattern');
      var parsedUrlPattern = this.parsedUrlPattern(urlPattern);
      var locationPath = window.location.pathname;
      var locationSearch = window.location.search;
      var localtionPathParts = locationPath.split(/\//g).filter(function (part) {
        return part !== '';
      });
      var locationRequestParams = this.requestParamsOfLocationSearch(locationSearch);
      parsedUrlPattern.pathVariables.forEach(function (variable, index) {
        if (/\{([^{}\s.]+)}/gm.test(variable)) {
          urlParams[/\{([^{}\s.]+)}/gm.exec(variable)[1]] = localtionPathParts[index];
        }
      });
      parsedUrlPattern.requestParams.forEach(function (param) {
        if (/\{([^{}\s.]+)}/gm.test(param)) {
          var key = /\{([^{}\s.]+)}/gm.exec(param)[1];
          urlParams[key] = locationRequestParams[key];
        }
      });
      window.urlParams = urlParams;
      this.node.parentNode.replaceChild(document.importNode(this.node.content, true), this.node);
    }
  }, {
    key: "parsedUrlPattern",
    value: function parsedUrlPattern(url) {
      return {
        pathVariables: url.split(/\?/g)[0].split(/\//g).filter(function (part) {
          return part !== '';
        }),
        requestParams: url.split(/\?/g)[1].split(/&/g).filter(function (part) {
          return part !== '';
        })
      };
    }
  }, {
    key: "requestParamsOfLocationSearch",
    value: function requestParamsOfLocationSearch(locationSearch) {
      var requestParams = {};
      var searchPart = locationSearch.split('?')[1];

      if (searchPart) {
        searchPart.split('&').forEach(function (exp) {
          var parts = exp.split('=');

          if (parts[1] !== undefined) {
            console.log(parts[1]);
            requestParams[parts[0]] = parts[1];
          }
        });
      }

      return requestParams;
    }
  }]);

  return E_PAGE_WITH_URL;
}(E);

module.exports = E_PAGE_WITH_URL;
