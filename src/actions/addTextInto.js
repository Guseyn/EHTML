import elm from "#ehtml/elm.js?v=41b9eaba";

export default function addTextInto (elmSelectorOrElm, txt) {
  elm(elmSelectorOrElm).textContent += txt;
}

window.addTextInto = addTextInto;
