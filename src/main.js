/* =====================================================================
 *                   EHTML — Core Runtime Architecture
 * =====================================================================
 *
 * This file connects the three parts of the EHTML engine:
 *
 *   1. Custom Element Definitions  
 *   2. The Activation Pipeline (activateNode)  
 *   3. The Global Mutation Observer  
 *
 * Together they form the loop that turns plain HTML into a live,
 * declarative UI without frameworks, a virtual DOM, or a build step.
 *
 * ---------------------------------------------------------------------
 * 1. Custom Element Definitions
 * ---------------------------------------------------------------------
 * All built-in EHTML components (<e-json>, <e-if>, <e-for-each>, etc.)
 * are registered up front. They remain inert until the engine dispatches
 * the synthetic `"ehtml:activated"` lifecycle event onto them.
 *
 * ---------------------------------------------------------------------
 * 2. Activation Pipeline (activateNode)
 * ---------------------------------------------------------------------
 * Every node that enters the DOM goes through activation. This handles:
 *
 *   • evaluating `${...}` expressions with scoped state  
 *   • dispatching `"ehtml:activated"` to custom elements  
 *   • wiring template triggers for mapToTemplate()  
 *
 * Activation is recursive and always runs top-down.
 *
 * ---------------------------------------------------------------------
 * 3. Mutation Observer
 * ---------------------------------------------------------------------
 * EHTML listens only for new DOM nodes (`childList` mutations).  
 * When a node is inserted, it is passed through the activation pipeline.
 * Attribute changes are ignored — they are evaluated only once on insert.
 *
 * ---------------------------------------------------------------------
 * 4. Initial Activation
 * ---------------------------------------------------------------------
 * On page load, the engine activates `<body>` once and then enables the
 * MutationObserver. All subsequent DOM updates flow through the same,
 * unified activation path.
 *
 * ---------------------------------------------------------------------
 * Summary
 * ---------------------------------------------------------------------
 * EHTML’s model is simple:
 *
 *   • HTML is the component system  
 *   • Expressions are evaluated once  
 *   • Custom elements activate via explicit events  
 *   • All dynamic DOM passes through a single activation pipeline  
 *
 * The browser does the rendering; EHTML handles only the wiring.
 *
 * =====================================================================
 */


/* ════════════════════════════════════════════════════════════════════════
 *              CUSTOM ELEMENTS POLYFILL (CROSS-BROWSER SUPPORT)
 * ════════════════════════════════════════════════════════════════════════
 *
 * Some browsers—especially iOS Safari—fail to upgrade customized built-in
 * elements like <template is="e-for-each">, causing lifecycle callbacks and
 * activation logic to never run. This polyfill restores consistent Custom
 * Elements behavior across all environments so EHTML’s template components
 * initialize and activate reliably on every platform.
 *
 * ════════════════════════════════════════════════════════════════════════ */
import '#ehtml/third-party/custom-elements-polyfill.js'

/* ════════════════════════════════════════════════════════════════════════
 *                               ACTIVATE NODE
 * ════════════════════════════════════════════════════════════════════════
 *
 * `activateNode` is the entry point for EHTML’s manual activation flow.  
 * Whenever a node enters the DOM—whether created by templates, loops,
 * <e-json>, or user scripts—this function prepares it for EHTML behavior.
 *
 * Activation performs three jobs:
 *
 *   • evaluate `${...}` expressions using the correct scoped state  
 *   • dispatch the `"ehtml:activated"` event so components can run their logic  
 *   • attach `"ehtml:template-triggered"` to native <template> elements
 *       (those without `is="..."`) so mapToTemplate() can release them  
 *
 * EHTML uses an explicit event-based activation model not as a workaround,
 * but by design: dispatching `"ehtml:activated"` decouples component behavior
 * from native Custom Element lifecycles and allows any node—custom element or
 * plain HTML—to opt into EHTML's initialization in a flexible, uniform way.
 *
 * This guarantees predictable, platform-independent behavior and keeps the
 * declaration of components completely open and extensible.
 *
 * ════════════════════════════════════════════════════════════════════════ */
import activateNode from '#ehtml/activateNode.js'

/* ════════════════════════════════════════════════════════════════════════
 *                       EHTML NODE-SCOPED STATE MAP
 * ════════════════════════════════════════════════════════════════════════
 *
 * This WeakMap stores the **scoped state** for DOM nodes. Templates,
 * loops, <e-json>, and other EHTML components place their local data here.
 *
 * `getNodeScopedState(node)` walks up the DOM to inherit the nearest
 * parent scope, giving EHTML a simple lexical-style state model directly
 * in the DOM tree.
 *
 * WeakMap storage ensures automatic cleanup when nodes are removed and
 * keeps scoped state predictable, lightweight, and composable.
 *
 * Exposed globally as `__EHTML_SCOPED_STATE__` for use across all EHTML
 * internals.
 *
 * ════════════════════════════════════════════════════════════════════════ */
window.__EHTML_SCOPED_STATE__ = new WeakMap()

/* ════════════════════════════════════════════════════════════════════════
 *                      EHTML WEBSOCKET CONNECTION REGISTRY
 * ════════════════════════════════════════════════════════════════════════
 *
 * This array stores all active WebSocket instances used by components like
 * `<e-json data-socket="...">`. Sockets are indexed by name so multiple
 * elements can share the same connection instead of reopening new ones.
 *
 * The registry is global by design—connections stay visible and reusable,
 * avoiding redundant WebSockets and enabling efficient real-time updates.
 *
 * ════════════════════════════════════════════════════════════════════════ */
window.__EHTML_WEB_SOCKETS__ = window.__EHTML_WEB_SOCKETS__ || [];

/* ════════════════════════════════════════════════════════════════════════
 *                    EHTML MARKDOWN EXTENSION REGISTRY
 * ════════════════════════════════════════════════════════════════════════
 *
 * This array stores all **Showdown (Markdown) extensions** registered for
 * use by the `<e-markdown>` element. Extensions placed here are picked up
 * automatically by every markdown-conversion operation performed on the page.
 *
 * Benefits:
 *   • Extensions are defined once and reused globally.
 *   • Avoids repeated setup inside individual <e-markdown> components.
 *   • Ensures consistent markdown rendering behavior across the entire app.
 *
 * Typical usage:
 *   window.__EHTML_SHOWDOWN_EXTENSIONS__.push(myCustomMarkdownExtension);
 *
 * `<e-markdown>` will read from this registry each time it performs a
 * markdown → HTML conversion.
 * ════════════════════════════════════════════════════════════════════════ */
window.__EHTML_SHOWDOWN_EXTENSIONS__ = window.__EHTML_SHOWDOWN_EXTENSIONS__ || []

/* ════════════════════════════════════════════════════════════════════════
 *                               EHTML ELEMENTS
 * ════════════════════════════════════════════════════════════════════════
 *
 * This module loads all built-in EHTML custom elements: <e-json>, <e-if>,
 * <e-for-each>, <e-html>, <e-wrapper>, <e-reusable>, <e-form>, <e-markdown>,
 * and others. Each element defines its own behavior declaratively and is
 * activated by the EHTML runtime through `"ehtml:activated"` events.
 *
 * Importing this module ensures every EHTML component is registered with
 * the browser and available for activation.
 *
 * ════════════════════════════════════════════════════════════════════════ */
import '#ehtml/E/exports.js'

/* ════════════════════════════════════════════════════════════════════════
 *                               EHTML ACTIONS
 * ════════════════════════════════════════════════════════════════════════
 *
 * This module registers all **built-in EHTML actions**—the imperative
 * operations that templates can trigger via attributes like:
 *
 *   data-actions-on-response="mapToTemplate(#foo, obj)"
 *
 * Each import below is a self-contained action function. Examples include:
 *
 *   • addHTMLInto / insertHTMLInto / addTextInto / insertTextInto
 *   • hideElms / showElms / toggleElms / removeElms
 *   • disableElms / enableElms / changeValueOf / updateAttributeOf
 *   • loadHTMLInto / loadTextInto / loadAndAddHTMLInto / loadAndAddTextInto
 *   • mapToTemplate / releaseTemplate
 *   • scrollIntoViewOf / scrollToHash
 *   • redirect / reload
 *
 * These actions are plain JavaScript functions used by the EHTML runtime
 * to manipulate the DOM and perform side effects in response to declarative
 * HTML attributes. They provide the “do something” layer for EHTML templates,
 * without requiring user-land JavaScript wiring.
 *
 * Importing and exporting them as a single object makes it easy for the
 * EHTML engine to look them up by name and invoke them at runtime.
 * ════════════════════════════════════════════════════════════════════════ */
import '#ehtml/actions/exports.js'

/* ====================================================================
 *                       MUTATION OBSERVER CALLBACK
 * ====================================================================
 *
 *  After the initial page load, EHTML does NOT walk or diff the entire
 *  DOM again. The only full-tree activation happens exactly once:
 *
 *        → activateNode(document.body)
 *
 *  This is the initial bootstrap to process the server-rendered/static
 *  HTML. After that moment, EHTML reacts ONLY to *newly added nodes*
 *  via the MutationObserver.
 *
 * --------------------------------------------------------------------
 *  WHAT THE OBSERVER WATCHES
 * --------------------------------------------------------------------
 *
 *  We observe:
 *
 *      { childList: true, subtree: true }
 *
 *  This means:
 *    • Only additions/removals of children are reported
 *    • No attribute changes
 *    • No text/characterData changes
 *    • No deep scans — the browser tells us exactly which nodes changed
 *
 *  For each added node:
 *
 *      1. evaluate attribute expressions on that node
 *      2. activate custom elements once
 *      3. attach template-trigger listeners for native templates
 *      4. recursively activate the node’s own children
 *
 * --------------------------------------------------------------------
 *  PERFORMANCE CHARACTERISTICS
 * --------------------------------------------------------------------
 *
 *  • **Initial Cost:**  
 *      The very first call `activateNode(document.body)` performs a
 *      depth-first walk of the entire static DOM. This is equivalent to
 *      your initial page load cost and happens exactly once.
 *
 *  • **Afterward:**  
 *      EHTML NEVER re-scans the whole document again. Everything is
 *      incremental and reactive to actual DOM insertions.
 *
 *  • **Recursion Scope:**  
 *      activateNode(node) only descends into *the subtree of that node*.
 *
 *      Cost per mutation is:
 *
 *            O(size_of_inserted_subtree)
 *
 *      This is the minimum possible work required to process the DOM
 *      you just inserted.
 *
 * --------------------------------------------------------------------
 *  TEMPLATE-DRIVEN PERFORMANCE ADVANTAGE
 * --------------------------------------------------------------------
 *
 *  EHTML apps rely heavily on `<template>` elements:
 *
 *      e-if, e-for-each, e-reusable, e-wrapper, e-page-with-url, …
 *
 *  Templates remain inert until “released”:
 *
 *      • They are not activated while sitting inside the DOM
 *      • They hold no event listeners
 *      • They run no logic
 *
 *  When released, a template inserts a fragment into the DOM, and the
 *  observer activates only that newly inserted fragment.
 *
 *  Benefits:
 *
 *      ✓ Lazy DOM activation  
 *      ✓ No overhead for unused UI branches  
 *      ✓ Large UI blocks can be released in constant-time operations  
 *      ✓ MutationObserver workload stays tightly bounded  
 *
 * --------------------------------------------------------------------
 *  WHY THIS MATTERS
 * --------------------------------------------------------------------
 *
 *  EHTML’s model avoids:
 *
 *      ✗ virtual DOM diffing  
 *      ✗ global invalidation  
 *      ✗ full-document rescans (after bootstrap)  
 *      ✗ heavy reactivity frameworks  
 *
 *  Instead, it uses:
 *
 *      ✓ deterministic one-time activation  
 *      ✓ subtree-only work  
 *      ✓ browser-native notifications  
 *      ✓ template-based lazy rendering  
 *
 *  This makes EHTML extremely predictable and efficient for real apps.
 *
 * ==================================================================== */
function mutationHandler(mutations) {
  for (const mut of mutations) {
    if (mut.type === "childList") {
      for (const node of mut.addedNodes) {
        activateNode(node)
      }
    }
  }
}

/* ====================================================================
 *                     CREATE MUTATION OBSERVER INSTANCE
 * ====================================================================
 *
 * We observe:
 *   - childList: true   → detect inserted DOM nodes
 *   - subtree: true     → detect nodes inserted anywhere under body
 * ==================================================================== */
let observer = new MutationObserver(mutationHandler)

/* ====================================================================
 *  PUBLIC API — ENABLE OBSERVER
 * ====================================================================
 *
 *  turnEhtmlObserverOn()
 *
 *  Starts the global MutationObserver that powers incremental EHTML
 *  activation. Once enabled, every newly inserted DOM node is routed
 *  through `activateNode()`, triggering:
 *
 *       • expression evaluation (data-text, data-value, etc.)
 *       • custom element activation (e-json, e-if, e-for-each, …)
 *       • native <template> release handlers
 *       • scoped-state propagation for templates
 *
 *  IMPORTANT:
 *      - This does NOT rescan the whole document.
 *      - It only processes nodes that the browser reports as "added".
 *
 *  The observer is typically ON at all times after page load.
 * ==================================================================== */
export function turnEhtmlObserverOn() {
  observer.observe(document.body, {
    childList: true,
    subtree: true
  })
}

/* ====================================================================
 *                     PUBLIC API — DISABLE OBSERVER
 * ====================================================================
 *
 *  turnEhtmlObserverOff()
 *
 *  Completely detaches the MutationObserver. When the observer is OFF:
 *
 *      • New DOM nodes will NOT be auto-activated
 *      • Attribute expressions will NOT be evaluated
 *      • Templates inserted dynamically will NOT release
 *      • Custom elements must be manually activated (via activateNode)
 *
 *  This is useful when performing large or sensitive DOM operations
 *  where activation must be deferred until a final stable structure
 *  is ready. Example scenarios:
 *
 *      - bulk inserting thousands of nodes
 *      - building large template fragments before attaching them
 *      - executing batch DOM updates inside a shadow root
 *
 *  After completing such work, you may re-enable the observer or call:
 *
 *        activateNode(rootNode)
 *
 *  to manually run activation once.
 * ==================================================================== */
export function turnEhtmlObserverOff() {
  observer.disconnect()
}

/* ====================================================================
 *                  GLOBAL EXPOSURE — ADVANCED CONTROL
 * ====================================================================
 *
 *  These globals allow applications, debugging tools, and testing
 *  environments to manipulate EHTML’s activation pipeline directly.
 *
 *      window.turnEhtmlObserverOn()   → resume automatic activation
 *      window.turnEhtmlObserverOff()  → pause automatic activation
 *      window.activateNode(node)      → manually activate a subtree
 *
 *  This makes EHTML highly predictable and debuggable:
 *      every activation step is deliberate and observable.
 * ==================================================================== */
window.turnEhtmlObserverOn = turnEhtmlObserverOn
window.turnEhtmlObserverOff = turnEhtmlObserverOff
window.activateNode = activateNode

/* ====================================================================
 *                   INITIAL ACTIVATION — BOOTSTRAP PHASE
 * ====================================================================
 *
 *  On page load:
 *
 *        1. We run a full-tree activation on <body>.
 *           This is the *only* time EHTML walks the entire DOM.
 *
 *        2. Then the MutationObserver is turned ON.
 *
 *  After this bootstrap:
 *
 *      • All subsequent activations are incremental.
 *      • No rescans of the full document ever occur again.
 *      • Only newly added DOM nodes are inspected and activated.
 *
 *  This pattern is what enables EHTML to be both:
 *      - declarative and HTML-first
 *      - extremely performant during runtime
 *
 * ==================================================================== */
queueMicrotask(() => activateNode(document.body))   // one-time full-tree activation
turnEhtmlObserverOn()                               // incremental activation from now on
