/* =====================================================================
 *                         EHTML — Entry Point
 * =====================================================================
 *
 * This file loads custom elements and actions, then starts the runtime.
 *
 *   activateNode(node)   — evaluates ${...}, fires ehtml:activated, wires templates
 *   MutationObserver     — calls activateNode on every newly inserted node
 *
 * On startup the observer is turned on first (synchronously, as this module
 * loads), then <body> is activated in a microtask so custom element definitions
 * finish registering first.
 *
 * The observer only reports nodes added *after* it starts — it does not process
 * HTML already on the page. That is why both the initial activateNode(body) walk
 * and the observer are needed.
 *
 * During bootstrap, elements like e-for-each and e-if insert new nodes while
 * activation is still running. Because the observer is already watching, those
 * nodes get processed. WebKit is especially strict about this — if the observer
 * starts after the bootstrap walk, inserted nodes can be missed entirely.
 *
 * =====================================================================
 */


/* ════════════════════════════════════════════════════════════════════════
 *              CUSTOM ELEMENTS POLYFILL (CROSS-BROWSER SUPPORT)
 * ════════════════════════════════════════════════════════════════════════
 *
 * WebKit (notably iOS) does not reliably upgrade customized built-in elements
 * like <template is="e-for-each">. This polyfill makes them behave consistently
 * so activation logic runs on every platform.
 *
 * ════════════════════════════════════════════════════════════════════════ */
import '#ehtml/third-party/custom-elements-polyfill.js'

/* ════════════════════════════════════════════════════════════════════════
 *                               ACTIVATE NODE
 * ════════════════════════════════════════════════════════════════════════ */
import activateNode from '#ehtml/activateNode.js'

/* ════════════════════════════════════════════════════════════════════════
 *                       EHTML NODE-SCOPED STATE MAP
 * ════════════════════════════════════════════════════════════════════════
 *
 * Templates and components store local data here. getNodeScopedState() walks
 * up the DOM tree to inherit the nearest parent scope.
 *
 * ════════════════════════════════════════════════════════════════════════ */
window.__EHTML_SCOPED_STATE__ = new WeakMap()

/* ════════════════════════════════════════════════════════════════════════
 *                      EHTML WEBSOCKET CONNECTION REGISTRY
 * ════════════════════════════════════════════════════════════════════════
 *
 * Named WebSocket connections for <e-json data-socket="..."> so multiple
 * elements can share one connection.
 *
 * ════════════════════════════════════════════════════════════════════════ */
window.__EHTML_WEB_SOCKETS__ = window.__EHTML_WEB_SOCKETS__ || []

/* ════════════════════════════════════════════════════════════════════════
 *                    EHTML MARKDOWN EXTENSION REGISTRY
 * ════════════════════════════════════════════════════════════════════════
 *
 * Optional Showdown extensions for <e-markdown>. Register once, used globally.
 *
 *   window.__EHTML_SHOWDOWN_EXTENSIONS__.push(myExtension)
 *
 * ════════════════════════════════════════════════════════════════════════ */
window.__EHTML_SHOWDOWN_EXTENSIONS__ = window.__EHTML_SHOWDOWN_EXTENSIONS__ || []

/* ════════════════════════════════════════════════════════════════════════
 *                          ELEMENTS & ACTIONS
 * ════════════════════════════════════════════════════════════════════════
 *
 * Side-effect imports: register all built-in custom elements (<e-json>,
 * <form is="e-form">, etc.) and action functions (mapToTemplate, showElms, …).
 *
 * ════════════════════════════════════════════════════════════════════════ */
import '#ehtml/E/exports.js'
import '#ehtml/actions/exports.js'

/* ====================================================================
 *                       MUTATION OBSERVER
 * ====================================================================
 *
 * Watches childList changes under <body> (not attribute changes).
 *
 * For each added node, activateNode:
 *   • evaluates ${...} in data-text, data-value, etc.
 *   • dispatches ehtml:activated to custom elements
 *   • attaches template-trigger listeners on native <template> elements
 *
 * After bootstrap, EHTML never walks the whole document again — only nodes
 * that are actually inserted.
 *
 * A plain <template>'s inner content stays inert until mapToTemplate()
 * releases it. Customized templates (e-if, e-for-each) run on activation
 * and may insert DOM immediately; the observer handles those insertions.
 *
 * ==================================================================== */
function mutationHandler(mutations) {
  for (const mut of mutations) {
    if (mut.type === 'childList') {
      for (const node of mut.addedNodes) {
        activateNode(node)
      }
    }
  }
}

let observer = new MutationObserver(mutationHandler)
let observerIsOn = false

/* ====================================================================
 *  PUBLIC API — ENABLE / DISABLE OBSERVER
 * ====================================================================
 *
 *  turnEhtmlObserverOn()
 *    Starts watching for newly inserted nodes. Safe to call more than once.
 *
 *  turnEhtmlObserverOff()
 *    Pauses watching. Useful during bulk DOM work; call turnEhtmlObserverOn()
 *    again afterward, or activateNode(node) manually to catch up.
 *
 *  Also exposed on window for app code and debugging.
 * ==================================================================== */
export function turnEhtmlObserverOn() {
  if (observerIsOn) {
    return
  }
  observer.observe(document.body, {
    childList: true,
    subtree: true
  })
  observerIsOn = true
}

export function turnEhtmlObserverOff() {
  if (!observerIsOn) {
    return
  }
  observer.disconnect()
  observerIsOn = false
}

window.turnEhtmlObserverOn = turnEhtmlObserverOn
window.turnEhtmlObserverOff = turnEhtmlObserverOff
window.activateNode = activateNode

/* ====================================================================
 *                   INITIAL ACTIVATION — BOOTSTRAP
 * ====================================================================
 *
 * Startup sequence:
 *
 *   1. turnEhtmlObserverOn()              — synchronous, as this module loads
 *   2. queueMicrotask(activateNode(body)) — deferred until imports finish
 *
 * The observer runs synchronously because WebKit requires it to be active
 * before the bootstrap walk begins. Components like e-for-each call
 * replaceWith() during activation; the observer catches those insertions.
 * Starting the observer inside the microtask — even before activateNode —
 * leaves a window where those nodes are not watched.
 *
 * activateNode(body) runs in a microtask so every custom element definition
 * above has finished registering before the first walk.
 *
 * ==================================================================== */
turnEhtmlObserverOn()
queueMicrotask(() => activateNode(document.body))
