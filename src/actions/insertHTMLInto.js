import elm from "#ehtml/elm.js?v=41b9eaba";

export default function insertHTMLInto (elmSelector, html) {
  elm(elmSelector).innerHTML = html;
}

window.insertHTMLInto = insertHTMLInto;
