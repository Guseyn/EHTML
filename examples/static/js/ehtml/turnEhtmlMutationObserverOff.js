export default (observer) => {
  if (observer.isOn) {
    observer.disconnect()
    observer.isOn = false
  }
}
