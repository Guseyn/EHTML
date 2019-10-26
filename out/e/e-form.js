'use strict';

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _wrapNativeSuper(Class) { var _cache = typeof Map === "function" ? new Map() : undefined; _wrapNativeSuper = function _wrapNativeSuper(Class) { if (Class === null || !_isNativeFunction(Class)) return Class; if (typeof Class !== "function") { throw new TypeError("Super expression must either be null or a function"); } if (typeof _cache !== "undefined") { if (_cache.has(Class)) return _cache.get(Class); _cache.set(Class, Wrapper); } function Wrapper() { return _construct(Class, arguments, _getPrototypeOf(this).constructor); } Wrapper.prototype = Object.create(Class.prototype, { constructor: { value: Wrapper, enumerable: false, writable: true, configurable: true } }); return _setPrototypeOf(Wrapper, Class); }; return _wrapNativeSuper(Class); }

function isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _construct(Parent, args, Class) { if (isNativeReflectConstruct()) { _construct = Reflect.construct; } else { _construct = function _construct(Parent, args, Class) { var a = [null]; a.push.apply(a, args); var Constructor = Function.bind.apply(Parent, a); var instance = new Constructor(); if (Class) _setPrototypeOf(instance, Class.prototype); return instance; }; } return _construct.apply(null, arguments); }

function _isNativeFunction(fn) { return Function.toString.call(fn).indexOf("[native code]") !== -1; }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

var _require = require('@page-libs/cutie'),
    browserified = _require.browserified,
    as = _require.as;

var _require2 = require('@page-libs/ajax'),
    ResponseFromAjaxRequest = _require2.ResponseFromAjaxRequest,
    ResponseBody = _require2.ResponseBody,
    ResponseHeaders = _require2.ResponseHeaders,
    ResponseStatusCode = _require2.ResponseStatusCode;

var _browserified = browserified(require('@cuties/object')),
    CreatedOptions = _browserified.CreatedOptions;

var _browserified2 = browserified(require('@cuties/json')),
    ParsedJSON = _browserified2.ParsedJSON,
    StringifiedJSON = _browserified2.StringifiedJSON;

var _browserified3 = browserified(require('@cuties/buffer')),
    StringFromBuffer = _browserified3.StringFromBuffer;

var AppliedActionsOnResponse = require('./../async/AppliedActionsOnResponse');

var ShownElement = require('./../async/ShownElement');

var EnabledElement = require('./../async/EnabledElement');

var ParsedElmSelectors = require('./../util/ParsedElmSelectors');

var FileInfo = require('./../util/FileInfo');

var ShowProgressEvent = require('./../util/ShowProgressEvent');

var ShowFileReaderProgressEvent = require('./../util/ShowFileReaderProgressEvent');

var ShowFileReaderEndEvent = require('./../util/ShowFileReaderEndEvent');

var PreparedProgressBars = require('./../util/PreparedProgressBars');

var E = require('./../E');

E('e-form',
/*#__PURE__*/
function (_HTMLFormElement) {
  _inherits(_class, _HTMLFormElement);

  function _class() {
    _classCallCheck(this, _class);

    return _possibleConstructorReturn(this, _getPrototypeOf(_class).call(this));
  }

  _createClass(_class, [{
    key: "onRender",
    value: function onRender() {
      this.onsubmit = function () {
        return false;
      };

      this.progressBars = new PreparedProgressBars(this.getElementsByTagName('progress')).value();
      this.inputs = this.getElementsByTagName('input');
      this.selects = this.getElementsByTagName('select');
      this.textareas = this.getElementsByTagName('textarea');
      this.localStorageValues = this.getElementsByTagName('e-local-storage-value');
      this.sessionStorageValues = this.getElementsByTagName('e-session-storage-value');
      this.buttons = this.getElementsByTagName('button');
      this.tuneFileInputs(this.filteredFileInputs(this.inputs));
      this.prepareFormElements(this.inputs);
      this.prepareFormElements(this.selects);
      this.prepareFormElements(this.textareas);
      this.prepareFormElements(this.localStorageValues);
      this.prepareFormElements(this.sessionStorageValues);
      this.prepareFormElements(this.buttons);
    }
  }, {
    key: "prepareFormElements",
    value: function prepareFormElements(elms) {
      for (var index = 0; index < elms.length; index++) {
        var elm = elms[index];
        var ajaxIcon = new ParsedElmSelectors(elm.getAttribute('data-ajax-icon')).value()[0];

        if (ajaxIcon) {
          ajaxIcon.style.display = 'none';
        }
      }
    }
  }, {
    key: "submit",
    value: function submit(target) {
      var uploadProgressBar = new ParsedElmSelectors(target.getAttribute('data-upload-progress-bar')).value()[0];
      var progressBar = new ParsedElmSelectors(target.getAttribute('data-progress-bar')).value()[0];
      var ajaxIcon = new ParsedElmSelectors(target.getAttribute('data-ajax-icon')).value()[0];
      target.setAttribute('disabled', 'true');
      var requestBody = this.requestBody();
      new ShownElement(ajaxIcon).after(new ResponseFromAjaxRequest(new CreatedOptions('url', target.getAttribute('data-request-url'), 'headers', new ParsedJSON(target.getAttribute('data-request-headers') || '{}'), 'method', target.getAttribute('data-request-method') || 'POST', 'uploadProgressEvent', new ShowProgressEvent(uploadProgressBar), 'progressEvent', new ShowProgressEvent(progressBar)), new StringifiedJSON(requestBody)).as('RESPONSE').after(new EnabledElement(target).after(new AppliedActionsOnResponse(target.tagName, target.getAttribute('data-response-object-name') || 'responseObject', new ParsedJSON(new StringFromBuffer(new ResponseBody(as('RESPONSE')))), target.getAttribute('data-response-headers-name') || 'responseHeaders', new ResponseHeaders(as('RESPONSE')), target.getAttribute('data-response-status-code-name') || 'responseStatusCode', new ResponseStatusCode(as('RESPONSE')), "hideElms('".concat(target.getAttribute('data-ajax-icon'), "');").concat(target.getAttribute('data-actions-on-response') || ''))))).call();
    }
  }, {
    key: "requestBody",
    value: function requestBody() {
      var requestBody = {};
      this.retrievedValuesFromInputsForRequestBody(this.inputs, requestBody);
      this.retrievedValuesFromSelectsForRequestBody(this.selects, requestBody);
      this.retrievedValuesFromTextareasForRequestBody(this.textareas, requestBody);
      this.retrievedValuesFromLocalStorageForRequestBody(this.localStorageValues, requestBody);
      this.retrievedValuesFromSessionStorageForRequestBody(this.sessionStorageValues, requestBody);
      return requestBody;
    }
  }, {
    key: "retrievedValuesFromInputsForRequestBody",
    value: function retrievedValuesFromInputsForRequestBody(inputs, requestBody) {
      for (var index = 0; index < inputs.length; index++) {
        var input = inputs[index];

        if (!input.name) {
          throw new Error("input ".concat(input, " has no name"));
        }

        if (input.type.toLowerCase() === 'radio') {
          if (input.checked) {
            requestBody[input.name] = input.value;
          }
        } else if (input.type.toLowerCase() === 'checkbox') {
          requestBody[input.name] = input.checked;
        } else if (input.type.toLowerCase() === 'file') {
          requestBody[input.name] = input.filesInfo;
        } else {
          requestBody[input.name] = input.value;
        }
      }
    }
  }, {
    key: "retrievedValuesFromSelectsForRequestBody",
    value: function retrievedValuesFromSelectsForRequestBody(selects, requestBody) {
      for (var index = 0; index < selects.length; index++) {
        var select = selects[index];

        if (!select.name) {
          throw new Error("select ".concat(select, " has no name"));
        }

        requestBody[select.name] = select.value;
      }
    }
  }, {
    key: "retrievedValuesFromTextareasForRequestBody",
    value: function retrievedValuesFromTextareasForRequestBody(textareas, requestBody) {
      for (var index = 0; index < textareas.length; index++) {
        var textarea = textareas[index];

        if (!textarea.name) {
          throw new Error("textarea ".concat(textarea, " has no name"));
        }

        requestBody[textarea.name] = textarea.value;
      }
    }
  }, {
    key: "retrievedValuesFromLocalStorageForRequestBody",
    value: function retrievedValuesFromLocalStorageForRequestBody(localStorageValues, requestBody) {
      for (var index = 0; index < localStorageValues.length; index++) {
        var localStorageValue = localStorageValues[index];

        if (!localStorageValue.name) {
          throw new Error("localStorageValue ".concat(localStorageValue, " has no name"));
        }

        requestBody[localStorageValue.name] = localStorageValue.value();
      }
    }
  }, {
    key: "retrievedValuesFromSessionStorageForRequestBody",
    value: function retrievedValuesFromSessionStorageForRequestBody(sessionStorageValues, requestBody) {
      for (var index = 0; index < sessionStorageValues.length; index++) {
        var sessionStorageValue = sessionStorageValues[index];

        if (!sessionStorageValue.name) {
          throw new Error("sessionStorageValue ".concat(sessionStorageValue, " has no name"));
        }

        requestBody[sessionStorageValue.name] = sessionStorageValue.value();
      }
    }
  }, {
    key: "tuneFileInputs",
    value: function tuneFileInputs(fileInputs) {
      for (var index = 0; index < fileInputs.length; index++) {
        this.tuneFileInput(fileInputs[index]);
      }
    }
  }, {
    key: "tuneFileInput",
    value: function tuneFileInput(fileInput) {
      var _this = this;

      var readProgressBar = new ParsedElmSelectors(fileInput.getAttribute('data-read-progress-bar')).value()[0];
      fileInput.addEventListener('change', function () {
        _this.readFilesContentForRequestBody(fileInput, readProgressBar);
      });
    }
  }, {
    key: "readFilesContentForRequestBody",
    value: function readFilesContentForRequestBody(fileInput, readProgressBar) {
      fileInput.filesInfo = [];
      var filesRead = {
        count: 0
      };

      for (var index = 0; index < fileInput.files.length; index++) {
        this.readFileContentForRequestBody(fileInput, readProgressBar, index, filesRead, fileInput.files.length);
      }
    }
  }, {
    key: "readFileContentForRequestBody",
    value: function readFileContentForRequestBody(fileInput, readProgressBar, index, filesRead, filesLength) {
      var file = fileInput.files[index];
      var reader = new FileReader();
      reader.readAsDataURL(file);

      reader.onload = function () {
        fileInput.filesInfo[index] = new FileInfo(file.name, file.size, file.type, reader.result, file.lastModifiedDate);
      };

      reader.onprogress = new ShowFileReaderProgressEvent(readProgressBar);
      reader.onloadend = new ShowFileReaderEndEvent(readProgressBar, filesRead, filesLength);

      reader.onerror = function () {
        throw new Error("cound not read file ".concat(file.name));
      };
    }
  }, {
    key: "filteredFileInputs",
    value: function filteredFileInputs(inputs) {
      var fileInputs = {
        length: 0
      };

      for (var index = 0; index < inputs.length; index++) {
        if (inputs[index].type.toLowerCase() === 'file') {
          fileInputs[fileInputs.length] = inputs[index];
          fileInputs.length += 1;
        }
      }

      return fileInputs;
    }
  }], [{
    key: "observedAttributes",
    get: function get() {
      return [];
    }
  }]);

  return _class;
}(_wrapNativeSuper(HTMLFormElement)), {
  "extends": 'form'
});
