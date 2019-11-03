'use strict'

class ShowFileReaderProgressEvent {
  constructor (progressBar) {
    if (progressBar) {
      return (event) => {
        if (event.lengthComputable) {
          progressBar.style.display = ''
          const percentComplete = parseInt((event.loaded / event.total) * 100)
          progressBar.value = percentComplete
        }
      }
    }
    return () => {}
  }
}

module.exports = ShowFileReaderProgressEvent
