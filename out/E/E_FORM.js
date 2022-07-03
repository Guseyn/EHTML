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

var _require = require('./../cutie/exports'),
    as = _require.as;

var _require2 = require('./../async-ajax/exports'),
    ResponseFromAjaxRequest = _require2.ResponseFromAjaxRequest,
    ResponseBody = _require2.ResponseBody,
    ResponseHeaders = _require2.ResponseHeaders,
    ResponseStatusCode = _require2.ResponseStatusCode,
    JSResponseByHTTPReponseComponents = _require2.JSResponseByHTTPReponseComponents;

var _require3 = require('./../async-object/exports'),
    CreatedOptions = _require3.CreatedOptions;

var _require4 = require('./../async-dom/exports'),
    ShownElement = _require4.ShownElement,
    HiddenElement = _require4.HiddenElement,
    EnabledElement = _require4.EnabledElement,
    DisabledElement = _require4.DisabledElement,
    FirstParsedElmSelector = _require4.FirstParsedElmSelector,
    ButtonWithChangedTextAndAddedClass = _require4.ButtonWithChangedTextAndAddedClass,
    ButtonWithChangedToOriginalTextAndRemovedClass = _require4.ButtonWithChangedToOriginalTextAndRemovedClass;

var _require5 = require('./../async-json/exports'),
    ParsedJSON = _require5.ParsedJSON,
    StringifiedJSON = _require5.StringifiedJSON;

var _require6 = require('./../async-string/exports'),
    StringFromBuffer = _require6.StringFromBuffer;

var _require7 = require('./../actions/exports'),
    AppliedActionsOnResponse = _require7.AppliedActionsOnResponse;

var _require8 = require('./../file/exports'),
    FileInfo = _require8.FileInfo;

var _require9 = require('./../events/exports'),
    ShowProgressEvent = _require9.ShowProgressEvent,
    ShowFileReaderProgressEvent = _require9.ShowFileReaderProgressEvent,
    ShowFileReaderEndEvent = _require9.ShowFileReaderEndEvent;

var VALIDATION_PATTERNS = {
  date: /\d\d\d\d-\d\d-\d\d/,
  dateTime: /[0-3]\d\/[0-1]\d\/\d\d\d\d, \d\d:\d\d/,
  email: /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/,
  month: /^\d\d\d\d-\d\d$/,
  number: /(\d)+/,
  password: /^.*(?=.{8,})(?=.*[a-zA-Z])(?=.*\d)(?=.*[!#$%&? "]).*$/,
  tel: /[0-9]{0,14}$/,
  time: /\d\d:\d\d/,
  // eslint-disable-next-line  no-useless-escape
  url: /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[\-;:&=\+\$,\w]+@)?[A-Za-z0-9\.\-]+|(?:www\.|[\-;:&=\+\$,\w]+@)[A-Za-z0-9\.\-]+)((?:\/[\+~%\/\.\w\-_]*)?\??(?:[\-\+=&;%@\.\w_]*)#?(?:[\.\!\/\\\w]*))?)/
};

var E_FORM =
/*#__PURE__*/
function (_E) {
  _inherits(E_FORM, _E);

  function E_FORM(node) {
    _classCallCheck(this, E_FORM);

    return _possibleConstructorReturn(this, _getPrototypeOf(E_FORM).call(this, node));
  }

  _createClass(E_FORM, [{
    key: "activate",
    value: function activate() {
      this.setup();

      if (this.node.hasAttribute('data-request-url')) {
        this.submit(this.node, true);
      }
    }
  }, {
    key: "setup",
    value: function setup() {
      this.replaceWithForm();
      this.node.progressBars = this.node.getElementsByTagName('progress');
      this.node.inputs = this.node.getElementsByTagName('input');
      this.node.selects = this.node.getElementsByTagName('select');
      this.node.textareas = this.node.getElementsByTagName('textarea');
      this.node.localStorageValues = this.node.getElementsByTagName('e-local-storage-value');
      this.node.sessionStorageValues = this.node.getElementsByTagName('e-session-storage-value');
      this.node.dynamicValues = this.node.getElementsByTagName('e-form-dynamic-value');
      this.node.buttons = this.node.getElementsByTagName('button');
      this.tuneFileInputs(this.filteredFileInputs(this.node.inputs));
      this.prepareDifferentFormElements();
      this.prepareProgressBars(this.node.progressBars);
    }
  }, {
    key: "replaceWithForm",
    value: function replaceWithForm() {
      var form = document.createElement('form');
      form.setAttribute('novalidate', 'true');
      form.setAttribute('data-e-form', 'true');

      for (var i = 0; i < this.node.attributes.length; i++) {
        form.setAttribute(this.node.attributes[i].name, this.node.attributes[i].value);
      }

      form.onsubmit = function () {
        return false;
      };

      form.submit = this.submit;
      form.validationErrorBoxes = [];
      form.elementsWithValidationError = [];
      this.setupMethodsForForm(form);

      while (this.node.firstChild) {
        var child = this.node.removeChild(this.node.firstChild);
        form.appendChild(child);
      }

      this.node.parentNode.replaceChild(form, this.node);
      this.node = form;
    }
  }, {
    key: "setupMethodsForForm",
    value: function setupMethodsForForm(form) {
      form.requestBody = this.requestBody;
      form.retrievedValuesFromInputsForRequestBody = this.retrievedValuesFromInputsForRequestBody;
      form.retrievedValuesFromSelectsForRequestBody = this.retrievedValuesFromSelectsForRequestBody;
      form.retrievedValuesFromTextareasForRequestBody = this.retrievedValuesFromTextareasForRequestBody;
      form.retrievedValuesFromLocalStorageForRequestBody = this.retrievedValuesFromLocalStorageForRequestBody;
      form.retrievedValuesFromSessionStorageForRequestBody = this.retrievedValuesFromSessionStorageForRequestBody;
      form.retrievedDynamicValuesForRequestBody = this.retrievedDynamicValuesForRequestBody;
      form.hideAllErrorsForForm = this.hideAllErrorsForForm;
      form.validateDifferentFormElements = this.validateDifferentFormElements;
      form.validateFormElements = this.validateFormElements;
      form.validateFormElement = this.validateFormElement;
      form.isFormValid = this.isFormValid;
      form.isCheckbox = this.isCheckbox;
      form.isFile = this.isFile;
      form.scrollToFirstErrorBox = this.scrollToFirstErrorBox;
      form.showErrorForFormElement = this.showErrorForFormElement;
    }
  }, {
    key: "prepareDifferentFormElements",
    value: function prepareDifferentFormElements() {
      this.node.allElements = [];
      this.prepareFormElements(this.node.inputs);
      this.prepareFormElements(this.node.selects);
      this.prepareFormElements(this.node.textareas);
      this.prepareFormElements(this.node.localStorageValues);
      this.prepareFormElements(this.node.sessionStorageValues);
      this.prepareFormElements(this.node.dynamicValues);
      this.prepareFormElements(this.node.buttons);
    }
  }, {
    key: "prepareFormElements",
    value: function prepareFormElements(elms) {
      for (var index = 0; index < elms.length; index++) {
        var elm = elms[index];
        this.node.allElements.push(elm);
        var ajaxIcon = document.querySelector(elm.getAttribute('data-ajax-icon'));

        if (ajaxIcon) {
          ajaxIcon.style.display = 'none';
        }
      }
    }
  }, {
    key: "prepareProgressBars",
    value: function prepareProgressBars(progressBars) {
      for (var index = 0; index < progressBars.length; index++) {
        if (progressBars[index]) {
          var progressBar = progressBars[index];
          progressBar.max = 100;
          progressBar.value = 0;
          progressBar.style.display = 'none';
        }
      }
    }
  }, {
    key: "submit",
    value: function submit(target) {
      var isThisTarget = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

      if (!target) {
        throw new Error('you must pass target in submit method like: \'this.form.submit(this)\'');
      }

      var requestBody;
      var validations = [];
      var isFormValid;

      if (isThisTarget) {
        requestBody = this.requestBody(target);
        this.hideAllErrorsForForm(target);
        this.validateDifferentFormElements(target, requestBody, validations);
        isFormValid = this.isFormValid(target, validations);
      } else {
        requestBody = this.requestBody(this);
        this.hideAllErrorsForForm(this);
        this.validateDifferentFormElements(this, requestBody, validations);
        isFormValid = this.isFormValid(this, validations);
      }

      var downloadResponseBodyAsFileWithName = target.getAttribute('data-download-response-body-as-file-with-name');

      if (isFormValid) {
        new DisabledElement(target).after(new FirstParsedElmSelector(target.getAttribute('data-ajax-icon')).as('AJAX_ICON').after(new ShownElement(as('AJAX_ICON')).after(new ButtonWithChangedTextAndAddedClass(target, target.getAttribute('data-button-ajax-text'), target.getAttribute('data-button-ajax-class')).after(new ResponseFromAjaxRequest(new CreatedOptions('url', target.getAttribute('data-request-url'), 'headers', new ParsedJSON(target.getAttribute('data-request-headers') || '{}'), 'method', target.getAttribute('data-request-method') || 'POST', 'uploadProgressEvent', new ShowProgressEvent(new FirstParsedElmSelector(target.getAttribute('data-upload-progress-bar'))), 'progressEvent', new ShowProgressEvent(new FirstParsedElmSelector(target.getAttribute('data-progress-bar'))), 'downloadResponseBodyAsFileWithName', downloadResponseBodyAsFileWithName), new StringifiedJSON(requestBody)).as('RESPONSE').after(new EnabledElement(target).after(new HiddenElement(as('AJAX_ICON')).after(new ButtonWithChangedToOriginalTextAndRemovedClass(target, target.getAttribute('data-button-ajax-class')).after(new AppliedActionsOnResponse(target, target.tagName, target.getAttribute('data-response-name'), new JSResponseByHTTPReponseComponents(downloadResponseBodyAsFileWithName ? new ResponseBody(as('RESPONSE')) : new ParsedJSON(new StringFromBuffer(new ResponseBody(as('RESPONSE')))), new ResponseHeaders(as('RESPONSE')), new ResponseStatusCode(as('RESPONSE'))), target.getAttribute('data-actions-on-response')))))))))).call();
      } else {
        this.scrollToFirstErrorBox(this);
      }
    }
  }, {
    key: "isFormValid",
    value: function isFormValid(form, validations) {
      for (var i = 0; i < validations.length; i++) {
        if (!validations[i]) {
          form.showErrorForFormElement(form, form, form.getAttribute('data-validation-error-message'), form.getAttribute('data-validation-error-class-for-element'), form.getAttribute('data-validation-error-class-for-message-box'));
          return false;
        }
      }

      return true;
    }
  }, {
    key: "validateDifferentFormElements",
    value: function validateDifferentFormElements(form, requestBody, validations) {
      form.validateFormElements(form, form.inputs, requestBody, validations);
      form.validateFormElements(form, form.selects, requestBody, validations);
      form.validateFormElements(form, form.textareas, requestBody, validations);
      form.validateFormElements(form, form.localStorageValues, requestBody, validations);
      form.validateFormElements(form, form.sessionStorageValues, requestBody, validations);
    }
  }, {
    key: "validateFormElements",
    value: function validateFormElements(form, elements, requestBody, results) {
      for (var i = 0; i < elements.length; i++) {
        var element = elements[i];
        results.push(form.validateFormElement(form, element, requestBody));
      }
    }
  }, {
    key: "validateFormElement",
    value: function validateFormElement(form, element, requestBody) {
      var validationPatternAttribute = element.getAttribute('data-validation-pattern');
      var requiredAttribute = element.hasAttribute('required');
      var nameAttribute = element.getAttribute('name');
      var value = requestBody[nameAttribute];

      if (typeof value === 'string') {
        value = value.trim();
      }

      if (requiredAttribute) {
        if (!value) {
          form.showErrorForFormElement(form, element, element.getAttribute('data-validation-absence-error-message'), element.getAttribute('data-validation-error-class-for-element'), element.getAttribute('data-validation-error-class-for-message-box'));
          return false;
        }

        if (form.isFile(element)) {
          var minFilesNumber = element.getAttribute('data-validation-min-files-number') * 1 || 1;

          if (value.length < minFilesNumber) {
            form.showErrorForFormElement(form, element, element.getAttribute('data-validation-absence-error-message'), element.getAttribute('data-validation-error-class-for-element'), element.getAttribute('data-validation-error-class-for-message-box'));
            return false;
          }
        }

        if (form.isCheckbox(element)) {
          var checkboxValue = element.getAttribute('value');

          if (!checkboxValue) {
            throw new Error('checkbox must have \'value\' attribute');
          }

          if (value.indexOf(checkboxValue) === -1) {
            form.showErrorForFormElement(form, element, element.getAttribute('data-validation-absence-error-message'), element.getAttribute('data-validation-error-class-for-element'), element.getAttribute('data-validation-error-class-for-message-box'));
            return false;
          }
        }
      }

      if (validationPatternAttribute) {
        var validationPattern = VALIDATION_PATTERNS[validationPatternAttribute] || new RegExp(validationPatternAttribute, 'ig');

        if (!validationPattern.test(value)) {
          form.showErrorForFormElement(form, element, element.getAttribute('data-validation-bad-format-error-message'), element.getAttribute('data-validation-error-class-for-element'), element.getAttribute('data-validation-error-class-for-message-box'));
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
    value: function showErrorForFormElement(form, element, errorMessage, elementErrorClass, messageBoxErrorClass) {
      var elementWithErrorMessageBox;

      if (errorMessage) {
        elementWithErrorMessageBox = document.createElement('div');
        var messageBox = document.createElement('div');
        messageBox.innerText = errorMessage;
        element.parentNode.replaceChild(elementWithErrorMessageBox, element);
        elementWithErrorMessageBox.appendChild(element);
        elementWithErrorMessageBox.appendChild(messageBox);
        form.validationErrorBoxes.push(elementWithErrorMessageBox);

        if (messageBoxErrorClass) {
          messageBox.classList.add(messageBoxErrorClass);
        }
      }

      if (elementErrorClass) {
        element.classList.add(elementErrorClass);
        form.elementsWithValidationError.push(element);
      }

      var listener = function listener() {
        if (elementWithErrorMessageBox) {
          if (elementWithErrorMessageBox.parentNode) {
            elementWithErrorMessageBox.parentNode.replaceChild(element, elementWithErrorMessageBox);
          }
        }

        if (elementErrorClass) {
          element.classList.remove(elementErrorClass);
        }

        element.removeEventListener('focus', listener);
        element.focus();
        element.click();
      };

      element.addEventListener('focus', listener);
    }
  }, {
    key: "hideAllErrorsForForm",
    value: function hideAllErrorsForForm(form) {
      form.validationErrorBoxes.forEach(function (elementWithErrorMessageBox) {
        if (elementWithErrorMessageBox.parentNode) {
          elementWithErrorMessageBox.parentNode.replaceChild(elementWithErrorMessageBox.firstChild, elementWithErrorMessageBox);
        }
      });
      form.allElements.forEach(function (element) {
        var elementErrorClass = element.getAttribute('data-validation-error-class-for-element');

        if (elementErrorClass) {
          element.classList.remove(elementErrorClass);
        }
      });
      form.validationErrorBoxes = [];
      form.elementsWithValidationError = [];
    }
  }, {
    key: "scrollToFirstErrorBox",
    value: function scrollToFirstErrorBox(form) {
      if (form.validationErrorBoxes.length > 0) {
        form.validationErrorBoxes[0].scrollIntoView({
          behavior: 'smooth',
          block: 'center'
        });
      }

      if (form.elementsWithValidationError.length > 0) {
        if (form.validationErrorBoxes.length > 0) {
          if (form.elementsWithValidationError[0].getBoundingClientRect().top < form.validationErrorBoxes[0].getBoundingClientRect().top) {
            form.elementsWithValidationError[0].scrollIntoView({
              behavior: 'smooth',
              block: 'center'
            });
          }
        } else {
          form.elementsWithValidationError[0].scrollIntoView({
            behavior: 'smooth',
            block: 'center'
          });
        }
      }
    }
  }, {
    key: "requestBody",
    value: function requestBody(form) {
      var requestBody = {};
      form.retrievedValuesFromInputsForRequestBody(form.inputs, requestBody);
      form.retrievedValuesFromSelectsForRequestBody(form.selects, requestBody);
      form.retrievedValuesFromTextareasForRequestBody(form.textareas, requestBody);
      form.retrievedValuesFromLocalStorageForRequestBody(form.localStorageValues, requestBody);
      form.retrievedValuesFromSessionStorageForRequestBody(form.sessionStorageValues, requestBody);
      form.retrievedDynamicValuesForRequestBody(form.dynamicValues, requestBody);
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

          if (input.checked) {
            requestBody[input.name].push(inputValue);
          }
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
    key: "retrievedDynamicValuesForRequestBody",
    value: function retrievedDynamicValuesForRequestBody(dynamicValues, requestBody) {
      for (var index = 0; index < dynamicValues.length; index++) {
        var dynamicValue = dynamicValues[index];

        if (!dynamicValue.name) {
          throw new Error("dynamicValue ".concat(dynamicValue, " has no name"));
        }

        requestBody[dynamicValue.name] = dynamicValue.value();
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

      var readProgressBar = document.querySelector(fileInput.getAttribute('data-read-progress-bar'));
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
  }]);

  return E_FORM;
}(E);

module.exports = E_FORM;
