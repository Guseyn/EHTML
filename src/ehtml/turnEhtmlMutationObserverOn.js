export default function (observer) {
  if (!observer.isOn) {
    observer.observe(document, { childList: true, subtree: true })
    observer.isOn = true
  }
}
