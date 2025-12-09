export default function evaluateStringWithActionsOnCloseConnection (string, e, node) {
  // Create a function using the Function constructor
   
  const func = new Function(
    'thisElement',
    'event',
    `
      (() => {
        ${string}
      })()
    `
  )
  /* ──────────────────────────────────────────────────────────────────────────────
    We schedule action execution as a microtask to preserve the correct EHTML
    lifecycle for <template> elements.

    When the DOM changes, templates must first be discovered by the
    MutationObserver, then activated by activateNode(), and only after that
    do they attach their "template-triggered" event listeners.

    If we executed actions synchronously, they could fire *before* those
    listeners exist, causing template-triggered events to be missed.

    The microtask ensures:
        1) DOM mutations complete
        2) MutationObserver processes new templates
        3) activateNode() attaches template-triggered handlers
        4) actions run safely afterward

    In short: “mutation first → activation second → actions last.”
  ────────────────────────────────────────────────────────────────────────────── */
  queueMicrotask(() => {
    func(node, e)
  })
}
