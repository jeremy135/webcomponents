(function() {

  const KEYCODE = {
    SPACE: 32,
  };

  const template = document.createElement('template');

  template.innerHTML = `
    <style>
      :host {
        display: inline-block;
        background: url('./images/unchecked-checkbox.png') no-repeat;
        background-size: contain;
        width: 24px;
        height: 24px;
      }
      :host([hidden]) {
        display: none;
      }
      :host([checked]) {
        background: url('./images/checked-checkbox.png') no-repeat;
        background-size: contain;
      }
      :host([disabled]) {
        background: url('./images/unchecked-checkbox-disabled.svg') no-repeat;
        background-size: contain;
      }
      :host([checked][disabled]) {
        background: url('./images/checked-checkbox-disabled.svg') no-repeat;
        background-size: contain;
      }
    </style>
  `;


  class JCheckbox extends HTMLElement {
    static get observedAttributes() {
      return ['checked', 'disabled'];
    }


    constructor() {
      super();
      this.attachShadow({ mode: 'open' });
      this.shadowRoot.appendChild(template.content.cloneNode(true));
    }


    /**
     * connectedCallback() fires when the element is inserted into the DOM.
     * It's a good place to set the initial role, tabindex, internal state, and install event listeners.
     */
    connectedCallback() {
      if (!this.hasAttribute('role')) {
        this.setAttribute('role', 'checkbox');
      }

      if (!this.hasAttribute('tabindex')) {
        this.setAttribute('tabindex', 0);
      }

      this._upgradeProperty('checked');
      this._upgradeProperty('disabled');

      this.addEventListener('keyup', this._onKeyUp);
      this.addEventListener('click', this._onClick);
    }


    /**
     *
     */
    _upgradeProperty(prop) {
      if (this.hasOwnProperty(prop)) {
        let value = this[prop];
        delete this[prop];
        this[prop] = value;
      }
    }


    /**
     * disconnectedCallback() fires when the element is removed from the DOM.
     * It's a good place to do clean up work like releasing references and removing event listeners.
     */
    disconnectedCallback() {
      this.removeEventListener('keyup', this._onKeyUp);
      this.removeEventListener('click', this._onClick);
    }

    set checked(value) {
      const isChecked = Boolean(value);
      if (isChecked) {
        this.setAttribute('checked', '');
      } else {
        this.removeAttribute('checked');
      }
    }

    get checked() {
      return this.hasAttribute('checked');
    }

    set disabled(value) {
      const isDisabled = Boolean(value);
      if (isDisabled) {
        this.setAttribute('disabled', '');
      } else {
        this.removeAttribute('disabled');
      }
    }
  }

  window.customElements.define('j-checkbox', JCheckbox);

})();
