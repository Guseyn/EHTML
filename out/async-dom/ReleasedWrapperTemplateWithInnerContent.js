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

var _require = require('./../cutie/exports'),
    AsyncObject = _require.AsyncObject;

var ReleasedWrapperTemplateWithInnerContent =
/*#__PURE__*/
function (_AsyncObject) {
  _inherits(ReleasedWrapperTemplateWithInnerContent, _AsyncObject);

  function ReleasedWrapperTemplateWithInnerContent(html, wrapperTemplate) {
    _classCallCheck(this, ReleasedWrapperTemplateWithInnerContent);

    return _possibleConstructorReturn(this, _getPrototypeOf(ReleasedWrapperTemplateWithInnerContent).call(this, html, wrapperTemplate));
  }

  _createClass(ReleasedWrapperTemplateWithInnerContent, [{
    key: "syncCall",
    value: function syncCall() {
      return function (html, wrapperTemplate) {
        var placeholderSelector = wrapperTemplate.getAttribute('data-where-to-place');
        var wayToPlace = wrapperTemplate.getAttribute('data-how-to-place') || 'after'; // also possible 'before' and 'instead'

        var wrapperTemplateReplacement = document.createElement('template');
        wrapperTemplateReplacement.innerHTML = html;
        var wrapperTemplateReplacementContentNode = document.importNode(wrapperTemplateReplacement.content, true);
        wrapperTemplate.parentNode.insertBefore(wrapperTemplateReplacementContentNode, wrapperTemplate);
        var placeholderElement = wrapperTemplate.parentNode.querySelector(placeholderSelector);

        if (!placeholderElement) {
          throw new Error('element is not found by the selector in the attribute "data-where-to-place"');
        }

        var wrapperTemplateContentNode = document.importNode(wrapperTemplate.content, true);

        if (wayToPlace === 'before') {
          placeholderElement.parentNode.insertBefore(wrapperTemplateContentNode, placeholderElement);
        } else if (wayToPlace === 'after') {
          if (placeholderElement.nextSibling) {
            placeholderElement.parentNode.insertBefore(wrapperTemplateContentNode, placeholderElement.nextSibling);
          } else {
            placeholderElement.parentNode.append(wrapperTemplateContentNode);
          }
        } else {
          placeholderElement.parentNode.replaceChild(wrapperTemplateContentNode, placeholderElement);
        }

        return wrapperTemplateContentNode;
      };
    }
  }]);

  return ReleasedWrapperTemplateWithInnerContent;
}(AsyncObject);

module.exports = ReleasedWrapperTemplateWithInnerContent;
