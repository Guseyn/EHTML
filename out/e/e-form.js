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

var VALIDATION_PATTERNS = {
  date: /\\/g,
  dateTime: /\\/g,
  email: /\\/g,
  month: /\\/g,
  number: /\\/g,
  password: /\\/g,
  tel: /\\/g,
  time: /\\/g,
  url: /\\/g,
  week: /\\/g
};
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
      this.setAttribute('novalidate', 'true');
      this.validationErrorBoxes = [];

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
      this.prepareDifferentFormElements();
    }
  }, {
    key: "prepareDifferentFormElements",
    value: function prepareDifferentFormElements() {
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
      var requestBody = this.requestBody();
      this.hideAllErrorsForForm();
      var validations = [];
      this.validateDifferentFormElements(requestBody, validations);

      if (this.isFormValid(validations)) {
        target.setAttribute('disabled', 'true');
        new ShownElement(ajaxIcon).after(new ResponseFromAjaxRequest(new CreatedOptions('url', target.getAttribute('data-request-url'), 'headers', new ParsedJSON(target.getAttribute('data-request-headers') || '{}'), 'method', target.getAttribute('data-request-method') || 'POST', 'uploadProgressEvent', new ShowProgressEvent(uploadProgressBar), 'progressEvent', new ShowProgressEvent(progressBar)), new StringifiedJSON(requestBody)).as('RESPONSE').after(new EnabledElement(target).after(new AppliedActionsOnResponse(target.tagName, target.getAttribute('data-response-object-name') || 'responseObject', new ParsedJSON(new StringFromBuffer(new ResponseBody(as('RESPONSE')))), target.getAttribute('data-response-headers-name') || 'responseHeaders', new ResponseHeaders(as('RESPONSE')), target.getAttribute('data-response-status-code-name') || 'responseStatusCode', new ResponseStatusCode(as('RESPONSE')), "hideElms('".concat(target.getAttribute('data-ajax-icon'), "');").concat(target.getAttribute('data-actions-on-response') || ''))))).call();
      } else {
        this.scrollToFirstErrorBox();
      }
    }
  }, {
    key: "isFormValid",
    value: function isFormValid(validations) {
      for (var i = 0; i < validations.length; i++) {
        if (!validations[i]) {
          this.showErrorForFormElement(this, this.getAttribute('data-validation-error-message') || "the form is invalid");
          return false;
        }
      }

      return true;
    }
  }, {
    key: "validateDifferentFormElements",
    value: function validateDifferentFormElements(requestBody, validations) {
      this.validateFormElements(this.inputs, requestBody, validations);
      this.validateFormElements(this.selects, requestBody, validations);
      this.validateFormElements(this.textareas, requestBody, validations);
      this.validateFormElements(this.localStorageValues, requestBody, validations);
      this.validateFormElements(this.sessionStorageValues, requestBody, validations);
    }
  }, {
    key: "validateFormElements",
    value: function validateFormElements(elements, requestBody, results) {
      for (var i = 0; i < elements.length; i++) {
        var element = elements[i];
        results.push(this.validateFormElement(element, requestBody));
      }
    }
  }, {
    key: "validateFormElement",
    value: function validateFormElement(element, requestBody) {
      var validationPatternAttribute = element.getAttribute('data-validate-as');
      var requiredAttribute = element.hasAttribute('required');
      var nameAttribute = element.getAttribute('name');
      var value = requestBody[nameAttribute];

      if (typeof value === 'string') {
        value = value.trim();
      }

      if (requiredAttribute) {
        if (!value) {
          this.showErrorForFormElement(element, element.getAttribute('data-validation-absence-error-message') || "".concat(nameAttribute, " is required"), element.getAttribute('data-validation-error-class-for-element'), element.getAttribute('data-validation-error-class-for-message-box'));
          return false;
        }

        if (this.isFile(element)) {
          if (value.length <= (element.getAttribute('data-validation-min-file-number') || 0)) {
            this.showErrorForFormElement(element, element.getAttribute('data-validation-absence-error-message') || "".concat(nameAttribute, " is required"), element.getAttribute('data-validation-error-class-for-element'), element.getAttribute('data-validation-error-class-for-message-box'));
            return false;
          }
        }

        if (this.isCheckbox(element)) {// TODO: check if the value is true for the name (as it's required)
          // TODO: check if number (data-validation-min-selected-number) is valid
        }
      }

      if (validationPatternAttribute) {
        var validationPattern = VALIDATION_PATTERNS[validationPatternAttribute] || new RegExp(validationPatternAttribute);

        if (!validationPattern.test(value)) {
          this.showErrorForFormElement(element, element.getAttribute('data-validation-error-message') || "".concat(nameAttribute, " must have format ").concat(validationPattern), element.getAttribute('data-validation-error-class-for-element'), element.getAttribute('data-validation-error-class-for-message-box'));
          return false;
        }
      }

      return true;
    }
  }, {
    key: "isCheckbox",
    value: function isCheckbox(element) {
      return element instanceof HTMLInputElement && element.type.toLowerCase() === 'checkbox';
    }
  }, {
    key: "isFile",
    value: function isFile(element) {
      return element instanceof HTMLInputElement && element.type.toLowerCase() === 'file';
    }
  }, {
    key: "showErrorForFormElement",
    value: function showErrorForFormElement(element, errorMessage, elementErrorClass, messageBoxErrorClass) {
      var elementWithErrorMessageBox = document.createElement('div');
      var messageBox = document.createElement('div');
      messageBox.innerText = errorMessage;
      element.parentNode.replaceChild(elementWithErrorMessageBox, element);
      elementWithErrorMessageBox.appendChild(element);
      elementWithErrorMessageBox.appendChild(messageBox);

      if (elementErrorClass) {
        element.classList.toggle(elementErrorClass);
      }

      if (messageBoxErrorClass) {
        messageBox.classList.toggle(messageBoxErrorClass);
      }

      this.validationErrorBoxes.push({
        elementWithErrorMessageBox: elementWithErrorMessageBox,
        element: element
      });

      var listener = function listener() {
        if (elementWithErrorMessageBox.parentNode) {
          elementWithErrorMessageBox.parentNode.replaceChild(element, elementWithErrorMessageBox);

          if (elementErrorClass) {
            element.classList.toggle(elementErrorClass);
          }
        }

        element.removeEventListener('focus', listener);
      };

      element.addEventListener('focus', listener);
    }
  }, {
    key: "hideAllErrorsForForm",
    value: function hideAllErrorsForForm() {
      this.validationErrorBoxes.forEach(function (errorBox) {
        errorBox.elementWithErrorMessageBox.parentNode.replaceChild(errorBox.element, errorBox.elementWithErrorMessageBox);
        var elementErrorClass = errorBox.element.getAttribute('data-validation-error-class-for-element');

        if (elementErrorClass) {
          errorBox.element.classList.toggle(elementErrorClass);
        }
      });
      this.validationErrorBoxes = [];
    }
  }, {
    key: "scrollToFirstErrorBox",
    value: function scrollToFirstErrorBox() {
      this.validationErrorBoxes[0].elementWithErrorMessageBox.scrollIntoView();
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
          if (!requestBody[input.name]) {
            requestBody[input.name] = [];
          }

          var inputValue = input.value;

          if (!inputValue) {
            throw new Error('checkbox must have \'value\' attribute');
          }

          var inputValueObj = {};
          inputValueObj[inputValue] = input.checked;
          requestBody[input.name].push(inputValueObj);
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
