export default function (observer) {
  if (observer.isOn) {
    observer.disconnect()
    observer.isOn = false
  }
}
