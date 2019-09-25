'use strict';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ShowProgressEvent = function ShowProgressEvent(progressBar) {
  _classCallCheck(this, ShowProgressEvent);

  if (progressBar) {
    return function (event) {
      if (event.lengthComputable) {
        progressBar.style.display = '';
        var percentComplete = parseInt(event.loaded / event.total * 100);
        progressBar.value = percentComplete;

        if (progressBar.value === 100) {
          progressBar.style.display = 'none';
        }
      }
    };
  }

  return function () {};
};

module.exports = ShowProgressEvent;
