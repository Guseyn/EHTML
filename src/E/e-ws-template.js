import getNodeScopedState from "#ehtml/getNodeScopedState.js?v=41ab2bfa";
import evaluatedStringWithParamsFromState from "#ehtml/evaluatedStringWithParamsFromState.js?v=01fa3e7e";
import evaluateActionsOnProgress from "#ehtml/evaluateActionsOnProgress.js?v=c7f83d7b";
import evaluateActionsOnOpenConnection from "#ehtml/evaluateActionsOnOpenConnection.js?v=4f2d2e81";
import evaluateActionsOnCloseConnection from "#ehtml/evaluateActionsOnCloseConnection.js?v=85da1111";

export default class EWs extends HTMLTemplateElement {
  constructor () {
    super();
    this.ehtmlActivated = false;
  }

  connectedCallback () {
    this.addEventListener(
      "ehtml:activated",
      this.onEHTMLActivated
    );
  }

  disconnectedCallback () {
    this.removeEventListener(
      "ehtml:activated",
      this.onEHTMLActivated
    );
  }

  onEHTMLActivated () {
    if (this.ehtmlActivated) {
      return;
    }
    this.ehtmlActivated = true;
    this.run();
  }

  run () {
    const state = getNodeScopedState(this);

    if (!this.hasAttribute("data-src")) {
      throw new Error("e-ws must have \"data-src\" attribute");
    }

    const socketUrl = evaluatedStringWithParamsFromState(
      this.getAttribute("data-src"),
      state,
      this
    );

    const socketName = evaluatedStringWithParamsFromState(
      this.getAttribute("data-socket-name"),
      state,
      this
    );

    if (!socketName) {
      throw new Error("e-ws must have \"data-socket-name\" attribute");
    }

    const connectionIconSelector = this.getAttribute("data-connection-icon");
    const connectionIcon = connectionIconSelector
      ? document.querySelector(connectionIconSelector)
      : null;

    if (connectionIcon) {
      connectionIcon.style.display = "";
    }

    const socket = new WebSocket(socketUrl);

    // global EHTML storage
    window.__EHTML_WEB_SOCKETS__ =
      window.__EHTML_WEB_SOCKETS__ || {};

    window.__EHTML_WEB_SOCKETS__[socketName] = socket;

    if (this.hasAttribute("data-actions-on-progress-start")) {
      evaluateActionsOnProgress(
        this.getAttribute("data-actions-on-progress-start"),
        this,
        state
      );
    }

    socket.addEventListener("open", event => {
      if (connectionIcon) {
        connectionIcon.style.display = "none";
      }

      if (this.hasAttribute("data-actions-on-open-connection")) {
        evaluateActionsOnOpenConnection(
          this.getAttribute("data-actions-on-open-connection"),
          event,
          this,
          state
        );
      }

      // Replace <template is="e-ws"> with its content
      this.parentNode.replaceChild(
        this.content.cloneNode(true),
        this
      );

      if (this.hasAttribute("data-actions-on-progress-end")) {
        evaluateActionsOnProgress(
          this.getAttribute("data-actions-on-progress-end"),
          this,
          state
        );
      }
    });

    socket.addEventListener("close", event => {
      if (this.hasAttribute("data-actions-on-close-connection")) {
        evaluateActionsOnCloseConnection(
          this.getAttribute("data-actions-on-close-connection"),
          event,
          this,
          state
        );
      }
    });
  }
}

customElements.define("e-ws", EWs, { extends: "template" });
