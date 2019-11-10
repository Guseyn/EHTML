'use strict';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var _require = require('./dom/exports'),
    ElementWithUpdatedAttributesWithVariablesAndMappedObject = _require.ElementWithUpdatedAttributesWithVariablesAndMappedObject;

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

                  _this.activateNodeWithItsChildNodes(new ElementWithUpdatedAttributesWithVariablesAndMappedObject(node).value());
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
    key: "nodeName",
    value: function nodeName(node) {
      return this.isEPageWithUrl(node) ? 'e-page-with-url' : node.nodeName.toLowerCase();
    }
  }, {
    key: "isForApplying",
    value: function isForApplying(node, attrName) {
      var attributesForNotApplying = ['data-list-to-iterate', 'data-condition-to-display'];
      return attributesForNotApplying.indexOf(attrName) === -1;
    }
  }, {
    key: "isEPageWithUrl",
    value: function isEPageWithUrl(node) {
      if (node.nodeName.toLowerCase() === 'e-page-with-url') {
        throw new Error('e-page-with-url must be <template>');
      }

      return node.nodeName.toLowerCase() === 'template' && node.getAttribute('is').toLowerCase() === 'e-page-with-url';
    }
  }]);

  return MutationObservation;
}();

new MutationObservation().run();
