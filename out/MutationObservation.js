'use strict';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var _require = require('./string/exports'),
    StringWithMappedObjectAndAppliedVariables = _require.StringWithMappedObjectAndAppliedVariables;

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

                  _this.activateNodeWithItsChildNodes(_this.withMappedVariablesToAttributes(node));
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
    key: "withMappedVariablesToAttributes",
    value: function withMappedVariablesToAttributes(node) {
      if (node.getAttribute) {
        for (var i = 0; i < node.attributes.length; i++) {
          var attrName = node.attributes[i].name;
          var attrValue = node.attributes[i].value;

          if (this.isForApplying(node, attrName)) {
            node.setAttribute(attrName, new StringWithMappedObjectAndAppliedVariables(attrValue).value());

            if (attrName === 'data-text') {
              this.handleDataTextAttribute(node);
            } else if (attrName === 'data-value') {
              this.handleDataValueAttribute(node);
            }
          }
        }
      }

      return node;
    }
  }, {
    key: "handleDataTextAttribute",
    value: function handleDataTextAttribute(node) {
      if (!this.hasParamsInAttributeToApply(node, 'data-text')) {
        this.insertTextIntoElm(node, node.getAttribute('data-text'));
        node.removeAttribute('data-text');
      }
    }
  }, {
    key: "handleDataValueAttribute",
    value: function handleDataValueAttribute(node) {
      if (!this.hasParamsInAttributeToApply(node, 'data-value')) {
        node.value = node.getAttribute('data-value');
        node.removeAttribute('data-value');
      }
    }
  }, {
    key: "insertTextIntoElm",
    value: function insertTextIntoElm(node, text) {
      var textNode = document.createTextNode(text);

      if (node.childNodes.length === 0) {
        node.appendChild(textNode);
      } else {
        node.insertBefore(textNode, node.childNodes[0]);
      }
    }
  }, {
    key: "hasParamsInAttributeToApply",
    value: function hasParamsInAttributeToApply(node, attrName) {
      return /\$\{([^${}]+)\}/g.test(node.getAttribute(attrName));
    }
  }, {
    key: "isForApplying",
    value: function isForApplying(node, attrName) {
      var attributesForNotApplying = ['data-list-to-iterate', 'data-condition-to-display'];
      return attributesForNotApplying.indexOf(attrName) === -1 && this.hasParamsInAttributeToApply(node, attrName);
    }
  }, {
    key: "isBody",
    value: function isBody(node) {
      return node.nodeName.toLowerCase() === 'body';
    }
  }, {
    key: "isEPageWithUrl",
    value: function isEPageWithUrl(node) {
      return node.nodeName.toLowerCase() === 'template' && node.getAttribute('is').toLowerCase() === 'e-page-with-url';
    }
  }]);

  return MutationObservation;
}();

new MutationObservation().run();
