'use strict';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ShowProgressEvent = function ShowProgressEvent(progressBar) {
  var removeProgressBarAfter = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

  _classCallCheck(this, ShowProgressEvent);

  if (progressBar) {
    return function (event) {
      if (event.lengthComputable) {
        progressBar.style.display = '';
        var percentComplete = parseInt(event.loaded / event.total * 100);
        progressBar.value = percentComplete;

        if (progressBar.value === 100) {
          if (removeProgressBarAfter) {
            progressBar.parentNode.removeChild(progressBar);
          } else {
            progressBar.style.display = 'none';
          }
        }
      }
    };
  }

  return function () {};
};

module.exports = ShowProgressEvent;
