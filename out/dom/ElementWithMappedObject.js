'use strict';

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var ElementWithMappedObject =
/*#__PURE__*/
function () {
  function ElementWithMappedObject(elm, obj) {
    _classCallCheck(this, ElementWithMappedObject);

    this.elm = elm;
    this.obj = obj;
  }

  _createClass(ElementWithMappedObject, [{
    key: "value",
    value: function value() {
      if (this.elm == null) {
        throw new Error('Mapping element is not found');
      }

      if (!this.isTemplate(this.elm)) {
        throw new Error('Mapping element must be <template>');
      }

      var elmContentNode = document.importNode(this.elm.content, true);
      var objName = this.elm.getAttribute('data-object-name');

      if (!objName) {
        throw new Error('Mapping element must have attribute "data-object-name"');
      }

      var initialization = "const ".concat(objName, " = obj");
      this.map(elmContentNode, this.obj, initialization);
      this.releaseTemplate(elmContentNode);
      return this.elm;
    }
  }, {
    key: "releaseTemplate",
    value: function releaseTemplate(elmContentNode) {
      if (this.isTemplate(this.elm, 'e-reusable')) {
        if (this.elm.hasAttribute('data-prepend-to')) {
          var parentNode = document.querySelector(this.elm.getAttribute('data-prepend-to'));

          if (!parentNode) {
            throw new Error('element is not found by the selector in the attribute "data-prepend-to"');
          }

          parentNode.prepend(elmContentNode);
        } else if (this.elm.hasAttribute('data-append-to')) {
          var _parentNode = document.querySelector(this.elm.getAttribute('data-append-to'));

          if (!_parentNode) {
            throw new Error('element is not found by the selector in the attribute "data-append-to"');
          }

          _parentNode.append(elmContentNode);
        } else {
          this.elm.parentNode.insertBefore(elmContentNode, this.elm);
        }
      } else {
        this.elm.parentNode.replaceChild(elmContentNode, this.elm);
      }
    }
  }, {
    key: "map",
    value: function map(elm, obj, initialization) {
      var _this = this;

      this.iterateChildNodes(elm, function (node) {
        if (_this.isTemplate(node, 'e-for-each')) {
          _this.activateEForEach(node, obj, initialization);
        } else if (_this.isTemplate(node, 'e-if')) {
          _this.activateEIf(node, obj, initialization);
        } else {
          _this.iterateAttributes(node, function (attr) {
            if (_this.isForProcessing(attr)) {
              node.setAttribute(attr.name, // eslint-disable-next-line no-eval
              _this.appliedExpressionsInString(attr.value, initialization, obj));
            }

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
          });
        }
      });
    }
  }, {
    key: "iterateChildNodes",
    value: function iterateChildNodes(elm, func) {
      var _this2 = this;

      var childNodes = Array.from(elm.childNodes);
      childNodes.forEach(function (node) {
        func(node);

        if (node.childNodes.length !== 0) {
          _this2.iterateChildNodes(node, func);
        }
      });
    }
  }, {
    key: "iterateAttributes",
    value: function iterateAttributes(elm, func) {
      if (elm.attributes) {
        var elmAttributes = Array.from(elm.attributes);
        elmAttributes.forEach(function (attr) {
          func(attr);
        });
      }
    }
  }, {
    key: "isForProcessing",
    value: function isForProcessing(attr) {
      return ['data-actions-on-response', 'data-list-to-iterate', 'data-item-name'].indexOf(attr.name) === -1 && /\$\{([^${}]+)\}/gm.test(attr.value);
    }
  }, {
    key: "isTemplate",
    value: function isTemplate(node, type) {
      var nodeName = node.nodeName.toLowerCase();

      if (!type) {
        return nodeName === 'template';
      }

      return nodeName === 'template' && node.getAttribute('is') === type;
    }
  }, {
    key: "activateEIf",
    value: function activateEIf(node, obj, initialization) {
      var toDisplayExpression = node.getAttribute('data-condition-to-display');

      if (!toDisplayExpression) {
        throw new Error('e-if must have "data-condition-to-display" attribute');
      }

      var toDisplay = this.appliedExpressionsInString(toDisplayExpression, initialization, obj).trim();

      if (toDisplay === 'true') {
        var contentNode = document.importNode(node.content, true);
        this.map(contentNode, obj, initialization);
        node.parentNode.insertBefore(contentNode, node);
      }

      node.parentNode.removeChild(node);
    }
  }, {
    key: "activateEForEach",
    value: function activateEForEach(node, obj, initialization) {
      var _this3 = this;

      var listDefinitionExpression = node.getAttribute('data-list-to-iterate');
      var itemName = node.getAttribute('data-item-name');

      if (!listDefinitionExpression) {
        throw new Error('e-for-each must have "data-list-to-iterate" attribute');
      }

      if (!itemName) {
        throw new Error('e-for-each must have "data-item-name" attribute');
      }

      var listDefinitionExpressionBody = this.getBodyOfExpression(listDefinitionExpression); // eslint-disable-next-line no-eval

      var list = eval("\n        ".concat(initialization, "\n        ").concat(listDefinitionExpressionBody, "\n      "));
      var listFragment = document.createDocumentFragment();
      list.forEach(function (item, index) {
        item.index = index + 1;
        var itemInitialization = "\n        ".concat(initialization, "\n        const ").concat(itemName, " = ").concat(listDefinitionExpressionBody, "[").concat(index, "]\n      ");
        var itemContentNode = document.importNode(node.content, true);

        _this3.map(itemContentNode, obj, itemInitialization);

        listFragment.appendChild(itemContentNode);
      });
      node.parentNode.replaceChild(listFragment, node);
    }
  }, {
    key: "appliedExpressionsInString",
    value: function appliedExpressionsInString(string, initialization, obj) {
      return string.replace(/\$\{([^${}]+)\}/gm, function (match, p1) {
        // eslint-disable-next-line no-eval
        var appliedExpression = eval("\n          ".concat(initialization, "\n          ").concat(p1, "\n        "));

        if (_typeof(appliedExpression) === 'object') {
          return JSON.stringify(appliedExpression);
        }

        return appliedExpression;
      });
    }
  }, {
    key: "getBodyOfExpression",
    value: function getBodyOfExpression(expression) {
      return expression.replace(/\$\{([^${}]+)\}/gm, function (match, p1) {
        return p1;
      });
    }
  }]);

  return ElementWithMappedObject;
}();

module.exports = ElementWithMappedObject;
