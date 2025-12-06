import getNodeScopedState from "#ehtml/getNodeScopedState.js?v=41ab2bfa";
import templateTriggerEventListener from "#ehtml/templateTriggerEventListener.js?v=5b49af76";

export default class EReusableTemplate extends HTMLTemplateElement {
  constructor() {
    super();
    this.ehtmlActivated = false;
  }

  connectedCallback() {
    this.addEventListener("ehtml:activated", this.onEHTMLActivated, { once: true });
    this.addEventListener("ehtml:template-triggered", this.onEHTMLTemplateTriggered);
  }

  disconnectedCallback() {
    this.removeEventListener("ehtml:template-triggered", this.onEHTMLTemplateTriggered);
  }

  onEHTMLActivated() {
    if (this.ehtmlActivated) {
      return;
    }
    if (!this.hasAttribute("data-object-name")) {
      throw new Error("e-reusable template must have \"data-object-name\" attribute");
    }
    this.ehtmlActivated = true;
    this.run();
  }

  run() {
    const releaseOnLoad = this.getAttribute("data-release-on-load") === "true";
    if (!releaseOnLoad) {
      return;
    }

    const state = {};
    if (this.internalState) {
      state[this.getAttribute("data-object-name")] = this.internalState;
    } else {
      state[this.getAttribute("data-object-name")] = {};
    }

    this.onEHTMLTemplateTriggered({
      target: this,
      detail: { state: state }
    });
  }

  onEHTMLTemplateTriggered(event) {
    const template = event?.target ?? this;
    const state = event?.detail?.state ?? getNodeScopedState(this);

    templateTriggerEventListener(template, state);
  }
}

customElements.define("e-reusable", EReusableTemplate, { extends: "template" });
