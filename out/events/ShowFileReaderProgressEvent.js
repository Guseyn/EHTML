'use strict';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ShowFileReaderProgressEvent = function ShowFileReaderProgressEvent(progressBar) {
  _classCallCheck(this, ShowFileReaderProgressEvent);

  if (progressBar) {
    return function (event) {
      if (event.lengthComputable) {
        progressBar.style.display = '';
        var percentComplete = parseInt(event.loaded / event.total * 100);
        progressBar.value = percentComplete;
      }
    };
  }

  return function () {};
};

module.exports = ShowFileReaderProgressEvent;
