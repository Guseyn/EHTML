(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
'use strict';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var HTMLTemplate = require('./templates/HTMLTemplate');

var TEMPLATES = {
  'html': HTMLTemplate
};

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

                _this.activateAllTemplatesInNode(node);
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
        attributes: true,
        childList: true,
        subtree: true
      });
    }
  }, {
    key: "activateAllTemplatesInNode",
    value: function activateAllTemplatesInNode(node) {
      if (this.isTemplate(node)) {
        var nodeName = node.getAttribute('name');

        if (nodeName && TEMPLATES[nodeName] && !node.activated) {
          new TEMPLATES[nodeName](node).activate();
          node.activated = true;
        }
      }

      var childNodes = node.childNodes;

      for (var i = 0; i < childNodes.length; i++) {
        this.activateAllTemplatesInNode(childNodes[i]);
      }
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

},{"./templates/HTMLTemplate":23}],2:[function(require,module,exports){
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
    AsyncObject = _require.AsyncObject; // Represented result is object


var CreatedOptions =
/*#__PURE__*/
function (_AsyncObject) {
  _inherits(CreatedOptions, _AsyncObject);

  function CreatedOptions() {
    var _getPrototypeOf2;

    _classCallCheck(this, CreatedOptions);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _possibleConstructorReturn(this, (_getPrototypeOf2 = _getPrototypeOf(CreatedOptions)).call.apply(_getPrototypeOf2, [this].concat(args)));
  }

  _createClass(CreatedOptions, [{
    key: "syncCall",
    value: function syncCall() {
      return function () {
        var options = {};

        for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
          args[_key2] = arguments[_key2];
        }

        if (args.length % 2 !== 0) {
          throw new Error('odd number of parameters for options');
        }

        for (var i = 0; i < args.length - 1; i += 2) {
          options[args[i]] = args[i + 1];
        }

        return options;
      };
    }
  }]);

  return CreatedOptions;
}(AsyncObject);

module.exports = CreatedOptions;

},{"./../cutie/exports":22}],3:[function(require,module,exports){
"use strict";

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

var ResponseBody =
/*#__PURE__*/
function (_AsyncObject) {
  _inherits(ResponseBody, _AsyncObject);

  function ResponseBody(response) {
    _classCallCheck(this, ResponseBody);

    return _possibleConstructorReturn(this, _getPrototypeOf(ResponseBody).call(this, response));
  }

  _createClass(ResponseBody, [{
    key: "syncCall",
    value: function syncCall() {
      return function (response) {
        return response.body;
      };
    }
  }]);

  return ResponseBody;
}(AsyncObject);

module.exports = ResponseBody;

},{"./../cutie/exports":22}],4:[function(require,module,exports){
"use strict";

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

var responseFromAjaxRequest = require('./custom-calls/responseFromAjaxRequest'); // Represented result is {statusCode, headers, body}


var ResponseFromAjaxRequest =
/*#__PURE__*/
function (_AsyncObject) {
  _inherits(ResponseFromAjaxRequest, _AsyncObject);

  function ResponseFromAjaxRequest(options, requestBody) {
    _classCallCheck(this, ResponseFromAjaxRequest);

    return _possibleConstructorReturn(this, _getPrototypeOf(ResponseFromAjaxRequest).call(this, options, requestBody || null));
  }

  _createClass(ResponseFromAjaxRequest, [{
    key: "asyncCall",
    value: function asyncCall() {
      return responseFromAjaxRequest;
    }
  }]);

  return ResponseFromAjaxRequest;
}(AsyncObject);

module.exports = ResponseFromAjaxRequest;

},{"./../cutie/exports":22,"./custom-calls/responseFromAjaxRequest":5}],5:[function(require,module,exports){
"use strict";

// custom call
// err, {statusCode, headers, body} in callback
// options: {url, method, headers, mimeType, withCredentials, user, password, timeout, progressEvent, uploadProgressEvent}
var responseFromAjaxRequest = function responseFromAjaxRequest(options, requestBody, callback) {
  var resObj = {};
  var req = new XMLHttpRequest();
  req.withCredentials = options.withCredentials || false;
  req.timeout = options.timeout || 0;

  if (options.overrideMimeType !== undefined) {
    req.overrideMimeType(options.overrideMimeType);
  }

  var headers = options.headers || {};

  for (var headerName in headers) {
    req.setRequestHeader(headerName, headers[headerName]);
  }

  req.onreadystatechange = function () {
    if (req.readyState === req.DONE) {
      var allHeadersStr = req.getAllResponseHeaders().trim();
      var headerMap = {};

      var _headers = allHeadersStr.split(/[\r\n]+/);

      _headers.forEach(function (line) {
        var parts = line.split(/:\s*/);
        var header = parts.shift();
        var value = parts.join(': ');
        headerMap[header] = value;
      });

      resObj.statusCode = req.status;
      resObj.headers = headerMap;
      resObj.body = req.response;
      callback(null, resObj);
    }
  };

  req.addEventListener('progress', options.progressEvent);
  req.upload.addEventListener('progress', options.uploadProgressEvent);
  req.open(options.method, options.url, true, options.user || null, options.password || null);
  req.send(requestBody);
};

module.exports = responseFromAjaxRequest;

},{}],6:[function(require,module,exports){
"use strict";

module.exports = {
  CreatedOptions: require('./CreatedOptions'),
  ResponseBody: require('./ResponseBody'),
  ResponseFromAjaxRequest: require('./ResponseFromAjaxRequest')
};

},{"./CreatedOptions":2,"./ResponseBody":3,"./ResponseFromAjaxRequest":4}],7:[function(require,module,exports){
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

var ElementWithInnerHTML =
/*#__PURE__*/
function (_AsyncObject) {
  _inherits(ElementWithInnerHTML, _AsyncObject);

  function ElementWithInnerHTML(elm, html) {
    _classCallCheck(this, ElementWithInnerHTML);

    return _possibleConstructorReturn(this, _getPrototypeOf(ElementWithInnerHTML).call(this, elm, html));
  }

  _createClass(ElementWithInnerHTML, [{
    key: "syncCall",
    value: function syncCall() {
      return function (elm, html) {
        elm.innerHTML = html;
        return elm;
      };
    }
  }]);

  return ElementWithInnerHTML;
}(AsyncObject);

module.exports = ElementWithInnerHTML;

},{"./../cutie/exports":22}],8:[function(require,module,exports){
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
    AsyncObject = _require.AsyncObject; // remove parent without removing childen


var UnwrappedChildrenOfParent =
/*#__PURE__*/
function (_AsyncObject) {
  _inherits(UnwrappedChildrenOfParent, _AsyncObject);

  function UnwrappedChildrenOfParent(parent) {
    _classCallCheck(this, UnwrappedChildrenOfParent);

    return _possibleConstructorReturn(this, _getPrototypeOf(UnwrappedChildrenOfParent).call(this, parent));
  }

  _createClass(UnwrappedChildrenOfParent, [{
    key: "syncCall",
    value: function syncCall() {
      return function (parent) {
        var docFrag = document.createDocumentFragment();

        while (parent.firstChild) {
          var child = parent.removeChild(parent.firstChild);
          docFrag.appendChild(child);
        }

        parent.parentNode.replaceChild(docFrag, parent);
        return docFrag;
      };
    }
  }]);

  return UnwrappedChildrenOfParent;
}(AsyncObject);

module.exports = UnwrappedChildrenOfParent;

},{"./../cutie/exports":22}],9:[function(require,module,exports){
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

var UnwrappedTemplate =
/*#__PURE__*/
function (_AsyncObject) {
  _inherits(UnwrappedTemplate, _AsyncObject);

  function UnwrappedTemplate(template) {
    _classCallCheck(this, UnwrappedTemplate);

    return _possibleConstructorReturn(this, _getPrototypeOf(UnwrappedTemplate).call(this, parent));
  }

  _createClass(UnwrappedTemplate, [{
    key: "syncCall",
    value: function syncCall() {
      return function (template) {
        var fragment = template.content.cloneNode(true);
        template.parentNode.replaceChild(fragment, template);
        return fragment;
      };
    }
  }]);

  return UnwrappedTemplate;
}(AsyncObject);

module.exports = UnwrappedTemplate;

},{"./../cutie/exports":22}],10:[function(require,module,exports){
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

var UnwrappedTemplate =
/*#__PURE__*/
function (_AsyncObject) {
  _inherits(UnwrappedTemplate, _AsyncObject);

  function UnwrappedTemplate(template) {
    _classCallCheck(this, UnwrappedTemplate);

    return _possibleConstructorReturn(this, _getPrototypeOf(UnwrappedTemplate).call(this, template));
  }

  _createClass(UnwrappedTemplate, [{
    key: "syncCall",
    value: function syncCall() {
      return function (template) {
        var fragment = template.content.cloneNode(true);
        template.parentNode.replaceChild(fragment, template);
        return fragment;
      };
    }
  }]);

  return UnwrappedTemplate;
}(AsyncObject);

module.exports = UnwrappedTemplate;

},{"./../cutie/exports":22}],11:[function(require,module,exports){
"use strict";

module.exports = {
  ElementWithInnerHTML: require('./ElementWithInnerHTML'),
  UnwrappedTemplate: require('./UnwrappedTemplate')
};

},{"./ElementWithInnerHTML":7,"./UnwrappedTemplate":10}],12:[function(require,module,exports){
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
    AsyncObject = _require.AsyncObject; // Represented result is json


var ParsedJSON =
/*#__PURE__*/
function (_AsyncObject) {
  _inherits(ParsedJSON, _AsyncObject);

  function ParsedJSON(string) {
    _classCallCheck(this, ParsedJSON);

    return _possibleConstructorReturn(this, _getPrototypeOf(ParsedJSON).call(this, string));
  }

  _createClass(ParsedJSON, [{
    key: "syncCall",
    value: function syncCall() {
      return JSON.parse;
    }
  }]);

  return ParsedJSON;
}(AsyncObject);

module.exports = ParsedJSON;

},{"./../cutie/exports":22}],13:[function(require,module,exports){
"use strict";

module.exports = {
  ParsedJSON: require('./ParsedJSON')
};

},{"./ParsedJSON":12}],14:[function(require,module,exports){
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

var AsyncObject = require('./AsyncObject');

var As =
/*#__PURE__*/
function (_AsyncObject) {
  _inherits(As, _AsyncObject);

  function As(key) {
    _classCallCheck(this, As);

    return _possibleConstructorReturn(this, _getPrototypeOf(As).call(this, key));
  }

  _createClass(As, [{
    key: "syncCall",
    value: function syncCall() {
      var _this = this;

      return function (key) {
        var result = _this.cache[key];

        if (result === undefined) {
          throw new Error("There is no value that is cached with key: ".concat(key));
        }

        return result;
      };
    }
  }]);

  return As;
}(AsyncObject);

module.exports = function (key) {
  return new As(key);
};

},{"./AsyncObject":15}],15:[function(require,module,exports){
'use strict';

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var AsyncTree = require('./AsyncTree');
/* abstract class */


var AsyncObject =
/*#__PURE__*/
function () {
  /*
    args: any type (including AsyncObject)
  */
  function AsyncObject() {
    _classCallCheck(this, AsyncObject);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    this.args = args;
    this.cache = {};
    this.next = undefined;
    this.asKey = undefined;
  } // TO BE OVERRIDDEN


  _createClass(AsyncObject, [{
    key: "asyncCall",
    value: function asyncCall() {
      throw new Error('asyncCall or syncCall must be defined');
    }
  }, {
    key: "syncCall",
    value: function syncCall() {
      throw new Error('asyncCall or syncCall must be defined');
    }
  }, {
    key: "onError",
    value: function onError(error) {
      throw error;
    }
  }, {
    key: "onResult",
    value: function onResult(result) {
      return result;
    }
    /*
      Works only if this.continueAfterFail returns true
        (in that case this.onError and this.onResult will be ignored),
    */

  }, {
    key: "onErrorAndResult",
    value: function onErrorAndResult(error, result) {
      return error || result;
    }
    /*
      If it returns true, then this.onError and this.onResult will be ignored,
      and the represented result of this object
      will be returned by this.onErrorAndResult.
    */

  }, {
    key: "continueAfterFail",
    value: function continueAfterFail() {
      return false;
    }
  }, {
    key: "callbackWithError",
    value: function callbackWithError() {
      return true;
    } // PUBLIC API

  }, {
    key: "call",
    value: function call() {
      this.propagateCache(this);
      new AsyncTree(this).create().call();
    }
  }, {
    key: "after",
    value: function after(asyncObject) {
      this.next = asyncObject;
      return this;
    }
  }, {
    key: "as",
    value: function as(key) {
      this.asKey = key;
      return this;
    } // NOT ALLOWED TO BE OVERRIDDEN

  }, {
    key: "iterateArgs",
    value: function iterateArgs(func) {
      var _this = this;

      this.args.forEach(function (arg, index) {
        func(arg, index, _this.isAsyncObject(arg), _this.isEvent(arg));
      });
    }
  }, {
    key: "hasNoArgs",
    value: function hasNoArgs() {
      return this.args.length === 0;
    }
  }, {
    key: "readyToBeInvoked",
    value: function readyToBeInvoked(readyResultsNum) {
      return this.args.length === readyResultsNum;
    }
  }, {
    key: "callNextTreeIfExists",
    value: function callNextTreeIfExists() {
      if (this.next) {
        this.propagateCache(this.next);
        new AsyncTree(this.next).create().call();
      }
    }
  }, {
    key: "propagateCache",
    value: function propagateCache(arg) {
      var _this2 = this;

      if (this.isAsyncObject(arg)) {
        arg.withCache(this.cache);
        arg.iterateArgs(function (arg) {
          return _this2.propagateCache(arg);
        });
      }
    }
  }, {
    key: "withCache",
    value: function withCache(cache) {
      this.cache = cache;
      return this;
    }
  }, {
    key: "saveValueIntoCacheIfNeeded",
    value: function saveValueIntoCacheIfNeeded(value) {
      if (this.asKey) {
        this.cache[this.asKey] = value;
      }

      return this;
    }
  }, {
    key: "isAsyncObject",
    value: function isAsyncObject(arg) {
      return this.classChain(arg).indexOf('AsyncObject') !== -1;
    }
  }, {
    key: "isEvent",
    value: function isEvent(arg) {
      return this.classChain(arg).indexOf('Event') !== -1;
    }
  }, {
    key: "classChain",
    value: function classChain(obj, chain) {
      if (!chain) {
        chain = [];
      }

      if (typeof obj === 'function') {
        if (!obj.name || obj === Object) {
          return chain;
        }

        return this.classChain(Object.getPrototypeOf(obj), chain.concat(obj.name));
      }

      if (_typeof(obj) === 'object' && obj !== null) {
        return this.classChain(obj.constructor, chain);
      }

      return chain;
    }
  }]);

  return AsyncObject;
}();

module.exports = AsyncObject;

},{"./AsyncTree":16}],16:[function(require,module,exports){
'use strict';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var SimpleTreeNode = require('./SimpleTreeNode');

var AsyncTreeNode = require('./AsyncTreeNode');

var NotDefinedAsyncTreeNode = require('./NotDefinedAsyncTreeNode');

var AsyncTree =
/*#__PURE__*/
function () {
  /*
    rootField: AsyncObject
  */
  function AsyncTree(rootField) {
    _classCallCheck(this, AsyncTree);

    this.rootField = rootField;
    this.nodes = [];
  } // PUBLIC


  _createClass(AsyncTree, [{
    key: "create",
    value: function create() {
      this.createAsyncTreeNode(this.rootField, new NotDefinedAsyncTreeNode(), 0);
      return this;
    }
  }, {
    key: "call",
    value: function call() {
      var leaves = this.nodes.filter(function (node) {
        return node.isLeaf();
      });
      leaves.forEach(function (leaf) {
        leaf.call();
      });
    } // PRIVATE

  }, {
    key: "createChildNodes",
    value: function createChildNodes(field, parent) {
      var _this = this;

      field.iterateArgs(function (argAsField, index, isAsyncObject, isEvent) {
        if (isAsyncObject) {
          _this.createAsyncTreeNode(argAsField, parent, index);
        } else if (isEvent) {
          _this.createSimpleTreeNode(function () {
            argAsField.body.apply(argAsField, arguments);
          }, parent, index);
        } else {
          _this.createSimpleTreeNode(argAsField, parent, index);
        }
      });
    }
  }, {
    key: "createAsyncTreeNode",
    value: function createAsyncTreeNode(field, parent, index) {
      var asyncTreeNode = new AsyncTreeNode(field, parent, index);
      this.nodes.push(asyncTreeNode);
      this.createChildNodes(field, asyncTreeNode);
    }
  }, {
    key: "createSimpleTreeNode",
    value: function createSimpleTreeNode(field, parent, index) {
      var treeNode = new SimpleTreeNode(field, parent, index);
      this.nodes.push(treeNode);
    }
  }]);

  return AsyncTree;
}();

module.exports = AsyncTree;

},{"./AsyncTreeNode":17,"./NotDefinedAsyncTreeNode":19,"./SimpleTreeNode":20}],17:[function(require,module,exports){
'use strict';

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _get(target, property, receiver) { if (typeof Reflect !== "undefined" && Reflect.get) { _get = Reflect.get; } else { _get = function _get(target, property, receiver) { var base = _superPropBase(target, property); if (!base) return; var desc = Object.getOwnPropertyDescriptor(base, property); if (desc.get) { return desc.get.call(receiver); } return desc.value; }; } return _get(target, property, receiver || target); }

function _superPropBase(object, property) { while (!Object.prototype.hasOwnProperty.call(object, property)) { object = _getPrototypeOf(object); if (object === null) break; } return object; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var TreeNode = require('./TreeNode');

var AsyncTreeNode =
/*#__PURE__*/
function (_TreeNode) {
  _inherits(AsyncTreeNode, _TreeNode);

  /*
    field: AsyncObject
    parent: AsyncTreeNode or NotDefinedAsyncTree
    position: int
  */
  function AsyncTreeNode(field, parent, position) {
    var _this;

    _classCallCheck(this, AsyncTreeNode);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(AsyncTreeNode).call(this, field, parent, position));
    _this.argResults = [];
    _this.readyResultsNum = 0;
    return _this;
  } // PUBLIC


  _createClass(AsyncTreeNode, [{
    key: "call",
    value: function call() {
      var args = this.argResults;

      try {
        var asyncCall = this.field.asyncCall();

        if (this.field.callbackWithError()) {
          this.invokeAsyncCallWithError.apply(this, [asyncCall].concat(_toConsumableArray(args)));
        } else {
          this.invokeAsyncCallWithoutError.apply(this, [asyncCall].concat(_toConsumableArray(args)));
        }
      } catch (error) {
        if (error.message !== 'asyncCall or syncCall must be defined') {
          if (this.field.continueAfterFail()) {
            this.field.onErrorAndResult(error);
          } else {
            this.field.onError(error);
          }
        } else {
          var syncCall = this.field.syncCall();
          this.invokeSyncCall.apply(this, [syncCall].concat(_toConsumableArray(args)));
        }
      }
    }
  }, {
    key: "isLeaf",
    value: function isLeaf() {
      return this.field.hasNoArgs();
    }
  }, {
    key: "readyToBeInvoked",
    value: function readyToBeInvoked() {
      return this.field.readyToBeInvoked(this.readyResultsNum);
    }
  }, {
    key: "hasParent",
    value: function hasParent() {
      return this.parent instanceof AsyncTreeNode;
    }
  }, {
    key: "insertArgumentResult",
    value: function insertArgumentResult(position, result) {
      this.argResults[position] = result;
      this.readyResultsNum += 1;
    } // PRIVATE

  }, {
    key: "invokeAsyncCallWithError",
    value: function invokeAsyncCallWithError(asyncCall) {
      var _this2 = this;

      for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        args[_key - 1] = arguments[_key];
      }

      asyncCall.apply(void 0, args.concat([function (error) {
        for (var _len2 = arguments.length, results = new Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
          results[_key2 - 1] = arguments[_key2];
        }

        if (!_this2.processedError.apply(_this2, [error].concat(results))) {
          _this2.processedResult.apply(_this2, results);
        }
      }]));
    }
  }, {
    key: "invokeAsyncCallWithoutError",
    value: function invokeAsyncCallWithoutError(asyncCall) {
      var _this3 = this;

      for (var _len3 = arguments.length, args = new Array(_len3 > 1 ? _len3 - 1 : 0), _key3 = 1; _key3 < _len3; _key3++) {
        args[_key3 - 1] = arguments[_key3];
      }

      asyncCall.apply(void 0, args.concat([function () {
        _this3.processedResult.apply(_this3, arguments);
      }]));
    }
  }, {
    key: "invokeSyncCall",
    value: function invokeSyncCall(syncCall) {
      try {
        for (var _len4 = arguments.length, args = new Array(_len4 > 1 ? _len4 - 1 : 0), _key4 = 1; _key4 < _len4; _key4++) {
          args[_key4 - 1] = arguments[_key4];
        }

        var syncCallResult = syncCall.apply(void 0, args);
        this.processedResult(syncCallResult);
      } catch (error) {
        this.processedError(error);
      }
    }
  }, {
    key: "processedError",
    value: function processedError(error) {
      var isProcessed = false; // It's not possible to get rid of null here :(

      if (error != null) {
        if (this.field.continueAfterFail()) {
          var _this$field;

          for (var _len5 = arguments.length, results = new Array(_len5 > 1 ? _len5 - 1 : 0), _key5 = 1; _key5 < _len5; _key5++) {
            results[_key5 - 1] = arguments[_key5];
          }

          var totalResult = (_this$field = this.field).onErrorAndResult.apply(_this$field, [error].concat(results));

          this.field.saveValueIntoCacheIfNeeded(totalResult);

          if (this.hasParent()) {
            _get(_getPrototypeOf(AsyncTreeNode.prototype), "callParent", this).call(this, totalResult);
          } else {
            this.field.callNextTreeIfExists();
          }
        } else {
          this.field.onError(error);
        }

        isProcessed = true;
      }

      return isProcessed;
    }
  }, {
    key: "processedResult",
    value: function processedResult() {
      var totalResult;

      for (var _len6 = arguments.length, results = new Array(_len6), _key6 = 0; _key6 < _len6; _key6++) {
        results[_key6] = arguments[_key6];
      }

      if (this.field.continueAfterFail()) {
        var _this$field2;

        totalResult = (_this$field2 = this.field).onErrorAndResult.apply(_this$field2, [null].concat(results));
      } else {
        var _this$field3;

        totalResult = (_this$field3 = this.field).onResult.apply(_this$field3, results);
      }

      this.field.saveValueIntoCacheIfNeeded(totalResult);

      if (this.hasParent()) {
        _get(_getPrototypeOf(AsyncTreeNode.prototype), "callParent", this).call(this, totalResult);
      } else {
        this.field.callNextTreeIfExists();
      }

      return true;
    }
  }]);

  return AsyncTreeNode;
}(TreeNode);

module.exports = AsyncTreeNode;

},{"./TreeNode":21}],18:[function(require,module,exports){
'use strict';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var Event =
/*#__PURE__*/
function () {
  function Event() {
    _classCallCheck(this, Event);
  } // TO BE OVERRIDDEN


  _createClass(Event, [{
    key: "body",
    value: function body() {
      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      throw new Error("Method body must be overriden with arguments ".concat(args, " of the event/eventListener you call"));
    }
  }]);

  return Event;
}();

module.exports = Event;

},{}],19:[function(require,module,exports){
'use strict';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var NotDefinedAsyncTreeNode = function NotDefinedAsyncTreeNode() {
  _classCallCheck(this, NotDefinedAsyncTreeNode);
};

module.exports = NotDefinedAsyncTreeNode;

},{}],20:[function(require,module,exports){
'use strict';

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _get(target, property, receiver) { if (typeof Reflect !== "undefined" && Reflect.get) { _get = Reflect.get; } else { _get = function _get(target, property, receiver) { var base = _superPropBase(target, property); if (!base) return; var desc = Object.getOwnPropertyDescriptor(base, property); if (desc.get) { return desc.get.call(receiver); } return desc.value; }; } return _get(target, property, receiver || target); }

function _superPropBase(object, property) { while (!Object.prototype.hasOwnProperty.call(object, property)) { object = _getPrototypeOf(object); if (object === null) break; } return object; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var TreeNode = require('./TreeNode');

var SimpleTreeNode =
/*#__PURE__*/
function (_TreeNode) {
  _inherits(SimpleTreeNode, _TreeNode);

  /*
    field: simple argument (not AsyncObject, can be Event)
    parent: AsyncTreeNode or NotDefinedAsyncTree
    position: int
  */
  function SimpleTreeNode(field, parent, position) {
    _classCallCheck(this, SimpleTreeNode);

    return _possibleConstructorReturn(this, _getPrototypeOf(SimpleTreeNode).call(this, field, parent, position));
  } // PUBLIC


  _createClass(SimpleTreeNode, [{
    key: "call",
    value: function call() {
      _get(_getPrototypeOf(SimpleTreeNode.prototype), "callParent", this).call(this, this.field);
    }
  }, {
    key: "isLeaf",
    value: function isLeaf() {
      return true;
    }
  }]);

  return SimpleTreeNode;
}(TreeNode);

module.exports = SimpleTreeNode;

},{"./TreeNode":21}],21:[function(require,module,exports){
'use strict';
/* abstract class */

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var TreeNode =
/*#__PURE__*/
function () {
  /*
    field: just some value (argument), also can be Event
    parent: AsyncTreeNode
    position: int
  */
  function TreeNode(field, parent, position) {
    _classCallCheck(this, TreeNode);

    this.field = field;
    this.parent = parent;
    this.position = position;
  } // TO BE OVERRIDEN


  _createClass(TreeNode, [{
    key: "call",
    value: function call(result) {
      result = result || '';
      throw new Error("call must be overridden and insert result ".concat(result, " into parent node"));
    }
  }, {
    key: "isLeaf",
    value: function isLeaf() {
      throw new Error('isLeaf must be overridden');
    } // NOT ALLOWED TO BE OVERRIDDEN

  }, {
    key: "callParent",
    value: function callParent(result) {
      this.parent.insertArgumentResult(this.position, result);

      if (this.parent.readyToBeInvoked()) {
        this.parent.call();
      }
    }
  }]);

  return TreeNode;
}();

module.exports = TreeNode;

},{}],22:[function(require,module,exports){
"use strict";

module.exports = {
  AsyncObject: require('./AsyncObject'),
  Event: require('./Event'),
  as: require('./As')
};

},{"./As":14,"./AsyncObject":15,"./Event":18}],23:[function(require,module,exports){
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

var Template = require('./Template');

var _require = require('./../async-dom/exports'),
    UnwrappedTemplate = _require.UnwrappedTemplate,
    ElementWithInnerHTML = _require.ElementWithInnerHTML;

var _require2 = require('./../async-ajax/exports'),
    ResponseBody = _require2.ResponseBody,
    ResponseFromAjaxRequest = _require2.ResponseFromAjaxRequest,
    CreatedOptions = _require2.CreatedOptions;

var _require3 = require('./../async-json/exports'),
    ParsedJSON = _require3.ParsedJSON;

var HTMLTemplate =
/*#__PURE__*/
function (_Template) {
  _inherits(HTMLTemplate, _Template);

  function HTMLTemplate(node) {
    _classCallCheck(this, HTMLTemplate);

    return _possibleConstructorReturn(this, _getPrototypeOf(HTMLTemplate).call(this, node));
  }

  _createClass(HTMLTemplate, [{
    key: "activate",
    value: function activate() {
      new UnwrappedTemplate(new ElementWithInnerHTML(this.node, new ResponseBody(new ResponseFromAjaxRequest(new CreatedOptions('url', this.node.getAttribute('data-src'), 'method', 'GET', 'headers', new ParsedJSON(this.node.getAttribute('data-headers') || '{}')))))).call();
    }
  }]);

  return HTMLTemplate;
}(Template);

module.exports = HTMLTemplate;

},{"./../async-ajax/exports":6,"./../async-dom/exports":11,"./../async-json/exports":13,"./Template":24}],24:[function(require,module,exports){
'use strict';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var Template =
/*#__PURE__*/
function () {
  function Template(node) {
    _classCallCheck(this, Template);

    this.node = node;
  }

  _createClass(Template, [{
    key: "activate",
    value: function activate() {
      throw new Error('activate function must be defined');
    }
  }]);

  return Template;
}();

module.exports = Template;

},{}]},{},[2,5,6,3,4,7,11,8,9,10,13,12,14,15,16,17,18,22,19,20,21,1,23,24]);
