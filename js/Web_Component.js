import {createApp, reactive} from "../lib/petite-vue.es.js";

export const Web_Component = {

    registered_components: {},

    /**
     * Register a web component
     * @param options
     * @param {string} [options.name = ''] - The name of the web component
     * @param {string} [options.template = ''] - The template of the web component
     * @param {Object|function} [options.data = () => ({})] - The data of the web component
     * @param {Object<string, options>} [options.components = null] - The components of the web component
     * @param {Object<string, function>} [options.directives = null] - The directives of the web component
     * @param {Object<string, Boolean|Number|String|Object|Array>} [options.props = null] - The props of the web component
     */
    register(options) {

        if (options.name === '') {
            throw new Error("Web_Component.register: name is required.");
        }

        if (this.registered_components[options.name]) {
            // console.warn(`Web_Component.register: ${options.name} is already registered.`);
            return;
        }
        this.registered_components[options.name] = options;

        if (options.components) {
            for (let component in options.components) {
                this.register(options.components[component]);
            }
        }

        customElements.define(
            options.name,
            class extends HTMLElement {

                data = {};
                _vue_id = null;
                app = null;
                props = null;

                constructor() {
                    super();

                    let props = {};
                    for (let i = 0; i < this.attributes.length; i++) {
                        props[this.attributes[i].name] = this.attributes[i].value;
                    }

                    this.props = reactive(props);

                    let data = options.data;
                    if (typeof data === 'function') {
                        data = data(this.props, this);
                    }

                    this.data = data;
                    this.data.$el = this;
                    this.data.props = this.props;
                    this.data.$set = function (name, value) {
                        this[name] = value;
                        return this;
                    }
                    this.app = createApp(this.data).directive('get-ctx', (ctx) => {
                        // console.log(ctx);
                        this.effect = ctx.effect;
                        this.data = ctx.ctx.scope;
                    });

                    this._vue_id = "app_" + Math.random().toString(36).substring(2);

                    if (options.directives) {
                        for (let directive in options.directives) {
                            this.app.directive(directive, options.directives[directive]);
                        }
                    }

                }

                init_template() {
                    let mounted_command = this.data.mounted ? '@mounted="mounted()"' : '';
                    let unmounted_command = this.data.unmounted ? '@unmounted="unmounted()"' : '';
                    // console.log('template init', this);
                    const shadowRoot = this.attachShadow({mode: "open"});
                    shadowRoot.innerHTML = `<style>[v-clock]{display: none !important;} * {box-sizing: border-box;}</style><div v-get-ctx id="${this._vue_id}" ${mounted_command} ${unmounted_command} class="web-component-app-host">${options.template}</div>`;
                }

                connectedCallback() {
                    if (!this.isConnected) {
                        return;
                    }
                    // console.log('connected', this);
                    this.init_template();
                    let shadowRoot = this.shadowRoot;
                    this.app.mount(shadowRoot.querySelector('#' + this._vue_id));

                }

                adoptedCallback() {
                    // console.log('adopted', this);
                }

                disconnectedCallback() {
                    if (!this.isConnected) {
                        // console.log('disconnected', this);
                        this.app.unmount();
                    }
                }

                attributeChangedCallback(name, old_value, new_value) {
                    this.set_prop(name, new_value);
                }

                set_prop(name, value) {
                    let allowed_props = this.constructor.observedAttributes;
                    if (!allowed_props.includes(name)) {
                        return;
                    }

                    if (!Array.isArray(options.props) && typeof options.props === 'object') {
                        if (options.props[name]) {
                            let type = options.props[name];

                            if (type === Boolean) {
                                value = ![
                                    'false',
                                    '0',
                                    'null',
                                    'undefined',
                                    'NaN',
                                    ''
                                ].includes(value);
                            } else if (type === Number) {
                                value = Number(value);
                            } else if (type === String) {
                                value = String(value);
                            } else if (type === Object && typeof value === 'string') {
                                value = JSON.parse(value);
                            } else if (type === Array && typeof value === 'string') {
                                value = JSON.parse(value);
                            }
                        }
                    }

                    this.props[name] = value;
                }

                static get observedAttributes() {
                    let props = options.props || [];

                    if (!Array.isArray(props) && typeof props === 'object') {
                        props = Object.keys(props);
                    }

                    return props;
                }

                $emit(event_name, detail = null) {
                    this.dispatchEvent(new CustomEvent(event_name, {detail}));
                }
            }
        );
    }
}