'use strict';

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var ELEMENTS = require('./E/exports');

var MutationObservation =
/*#__PURE__*/
function () {
  function MutationObservation() {
    _classCallCheck(this, MutationObservation);

    this.targetNode = document;
  }

  _createClass(MutationObservation, [{
    key: "run",
    value: function run() {
      var _this = this;

      var observer = new MutationObserver(function (mutationsList, observer) {
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
          for (var _iterator = mutationsList[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var mutation = _step.value;

            if (mutation.type === 'childList') {
              for (var i = 0; i < mutation.addedNodes.length; i++) {
                var node = mutation.addedNodes[i];

                if (!node.observedByEHTML) {
                  node.observedByEHTML = true;

                  _this.activateNodeWithItsChildNodes(node);
                }
              }
            }
          }
        } catch (err) {
          _didIteratorError = true;
          _iteratorError = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion && _iterator["return"] != null) {
              _iterator["return"]();
            }
          } finally {
            if (_didIteratorError) {
              throw _iteratorError;
            }
          }
        }
      });
      observer.observe(this.targetNode, {
        childList: true,
        subtree: true
      });
    }
  }, {
    key: "activateNodeWithItsChildNodes",
    value: function activateNodeWithItsChildNodes(node) {
      var nodeName = this.nodeName(node);
      node = this.nodeWithProcessedAttributes(node);

      if (ELEMENTS[nodeName]) {
        if (!node.activatedByEHTML) {
          node.activatedByEHTML = true;
          new ELEMENTS[nodeName](node).activate();
        }
      }

      var childNodes = node.childNodes;

      for (var i = 0; i < childNodes.length; i++) {
        this.activateNodeWithItsChildNodes(childNodes[i]);
      }
    }
  }, {
    key: "nodeWithProcessedAttributes",
    value: function nodeWithProcessedAttributes(node) {
      if (node.attributes) {
        for (var i = 0; i < node.attributes.length; i++) {
          var attr = node.attributes[i];

          if (this.isForProcessing(attr)) {
            node.setAttribute(attr.name, attr.value.replace(/\$\{([^${}]+)\}/g, function (match, p1) {
              // eslint-disable-next-line no-eval
              var appliedExpression = eval(p1);

              if (_typeof(appliedExpression) === 'object') {
                return JSON.stringify(appliedExpression);
              }

              return appliedExpression;
            }));

            if (attr.name === 'data-text') {
              var textNode = document.createTextNode(attr.value);

              if (node.childNodes.length === 0) {
                node.appendChild(textNode);
              } else {
                node.insertBefore(textNode, node.childNodes[0]);
              }

              node.removeAttribute('data-text');
            } else if (attr.name === 'data-value') {
              node.value = attr.value;
              node.removeAttribute('data-value');
            }
          }
        }
      }

      return node;
    }
  }, {
    key: "isForProcessing",
    value: function isForProcessing(attr) {
      return ['data-actions-on-response', 'data-list-to-iterate', 'data-item-name'].indexOf(attr.name) === -1 && /\$\{([^${}]+)\}/g.test(attr.value);
    }
  }, {
    key: "nodeName",
    value: function nodeName(node) {
      return this.isEPageWithUrl(node) ? 'e-page-with-url' : node.nodeName.toLowerCase();
    }
  }, {
    key: "isEPageWithUrl",
    value: function isEPageWithUrl(node) {
      if (node.nodeName.toLowerCase() === 'e-page-with-url') {
        throw new Error('e-page-with-url must be <template>');
      }

      if (this.isTemplate(node)) {
        var templateType = node.getAttribute('is');

        if (templateType) {
          return templateType === 'e-page-with-url';
        }

        return false;
      }

      return false;
    }
  }, {
    key: "isTemplate",
    value: function isTemplate(node) {
      return node.nodeName.toLowerCase() === 'template';
    }
  }]);

  return MutationObservation;
}();

new MutationObservation().run();
