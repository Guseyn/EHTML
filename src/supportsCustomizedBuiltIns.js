export default function supportsCustomizedBuiltIns() {
  try {
    class EButton extends HTMLButtonElement {}
    customElements.define('e-button', EButton, { extends: 'button' })

    const el = document.createElement('button', { is: 'e-button' })
    return el instanceof EButton
  } catch (e) {
    return false
  }
}
