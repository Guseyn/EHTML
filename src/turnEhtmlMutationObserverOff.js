module.exports = (observer) => {
  if (observer.isOn) {
    observer.disconnect()
    observer.isOn = false
  }
}
