"use strict";

// custom call
// err, {statusCode, headers, body} in callback
// options: {url, method, headers, mimeType, withCredentials, user, password, timeout, progressEvent, uploadProgressEvent}
var responseFromAjaxRequest = function responseFromAjaxRequest(options, requestBody, callback) {
  var resObj = {};
  var req = new XMLHttpRequest();
  req.open(options.method, options.url, true, options.user || null, options.password || null);
  req.withCredentials = options.withCredentials || false;
  req.timeout = options.timeout || 0;

  if (options.downloadResponseBodyAsFileWithName) {
    req.responseType = 'blob';
  }

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

      if (options.downloadResponseBodyAsFileWithName) {
        if (resObj.statusCode === 200) {
          var fileURL = window.URL.createObjectURL(resObj.body);
          var anchor = document.createElement('a');
          anchor.href = fileURL;
          anchor.download = options.downloadResponseBodyAsFileWithName;
          document.body.appendChild(anchor);
          anchor.click();
          anchor.remove();
        } else {
          req.response.text().then(function (value) {
            try {
              resObj.body = JSON.parse(value);
            } catch (error) {
              resObj.body = value;
            }

            callback(null, resObj);
          });
        }
      } else {
        callback(null, resObj);
      }
    }
  };

  req.addEventListener('progress', options.progressEvent);
  req.upload.addEventListener('progress', options.uploadProgressEvent);
  req.send(requestBody);
};

module.exports = responseFromAjaxRequest;
