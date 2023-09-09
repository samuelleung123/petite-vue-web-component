# web component
This is a library that use petite-vue to create web components.

## Demo
Please check the [demo.html](dist%2Fdemo.html)

## Installation

### ESM
copy [web-component.esm.js](dist%2Fweb-component.esm.js) to your project and import it.
```js
import {Web_Component, WC_Directives} from "./web-component.esm.js";
```

### Global
copy [web-component.js](dist%2Fweb-component.js) to your project and import it.
```html
<script src="./web-component.js"></script>
<script>
    const {Web_Component, WC_Directives} = window.Web_Component;
</script>
```

## How to use

#### JS

```js
import {WC_Directives, Web_Component} from "./web-component.esm.js";

const ChildComponent = {
    name: 'child-component',
    template: `
        <div>
            <h1>Child Component</h1>
            <div>
                <button @click="minus">-</button>
                {{ props.count }}
                <button @click="add">+</button>
            </div>
        </div>
    `,
    props: {
        count: Number,
    },
    data(props, el) {
        return {
            add() {
                el.$emit('update:count', props.count + 1);
            },
            minus() {
                el.$emit('update:count', props.count - 1);
            }
        }
    }
}

const DemoComponent = {
    name: 'demo-component',
    components: {
        ChildComponent,
    },
    directives: {
        ...WC_Directives,
    },
    template: `
        <div>
            <h1>v-model</h1>
            <input type="number" v-model="count"/>
            <div>
                {{ count }}
            </div>
        </div>

        <div>
            <h1>v-on (Press Enter)</h1>
            <input type="number" @keyup.enter="count = $event.target.value"/>
            <div>
                {{ count }}
            </div>
        </div>

        <div>
            <h1>Props</h1>
            <div>
                prop_1: {{ props.prop_1 }} <br>
                prop_2: {{ props.prop_2 }} <br>
                typeof prop_2: {{ typeof props.prop_2 }}
            </div>
        </div>

        <child-component v-wc-model:count="count"></child-component>

    `,
    props: {
        prop_1: String,
        prop_2: Object,
    },
    data(props, el) {
        console.log({
            props,
            el
        })
        return {
            count: 0,
        }
    }
}

Web_Component.register(DemoComponent);
```

#### HTML
```html
<demo-component prop_1="hi" prop_2='{"key": "value"}'></demo-component>
```

## Props
Only support these types:  
1. `Boolean`: `"false"`, `"0"`, `"null"`, `"undefined"`, `"NaN"`, `""` will be converted to `false`, otherwise `true`.
1. `Number`: `Number(value)` will be called.
1. `String`: `String(value)` will be called.
1. `Object`: a valid json. `{key: "value"}` is not a valid json, but `{"key": "value"}` is.
1. `Array`: a valid json. `['a', 'b']` is not a valid json, but `["a", "b"]` is.

```html
<script type="module">
    import {Web_Component} from "./web-component.esm.js";
    
    Web_Component.register({
        name: 'props-component',
        template: `html...`,
        props: {
            prop_1: String,
            prop_2: Object,
        },
        data(props, el) {
            console.log({props}); // {prop_1: "hi", prop_2: {key: "value"}}
            return {};
        }
    });
</script>

<props-component prop_1="hi" prop_2='{"key": "value"}'></props-component>
```

## Lifecycle

```js
export const MountUnmountComponent = {
    name: 'mount-unmount-component',
    template: `html...`,
    data() {
        return {
            mounted() {
                console.log('mounted');
            },
            unmounted() {
                console.log('unmounted');
            },
        }
    }
}
```

## Expose component functions

```js
export const ExposeComponent = {
    name: 'expose-component',
    template: `html...`,
    data(props, el) {
        return {
            mounted() {
                el.expose_function = this.expose_function.bind(this);
            },
            expose_function() {
                console.log('function_need_to_expose');
            },
        }
    }
}
```

```html
<expose-component id="expose-component"></expose-component>
<script type="module">
    import {async_until} from "./web-component.esm.js";

    const expose_component = document.getElementById('expose-component');
    await async_until(() => expose_component.isConnected); // wait until component is mounted
    expose_component.expose_function();
</script>
```

## Directives
```js
import {WC_Directives} from "./web-component.esm.js";

const DirectiveComponent = {
    name: 'directive-component',
    directives: {
        ...WC_Directives,
    },
    template: `html...`
}
```

### v-wc-model

`v-wc-model` is a directive that can be used to bind a value to a web component.

Default bind to property `value` and event `update:value`.
```html
<child-component v-wc-model="count"/>
```

Bind to custom property `count` and event `update:count`.
```html
<child-component v-wc-model:count="count"/>
```

### v-wc-breakpoints

`v-wc-breakpoints` is a directive that can be used to bind breakpoints to a web component to check the width of the component.  
When the `width` of the web component changes, the breakpoints will be updated.  
It is useful when you want to use breakpoints in the web component.

```vue
<child-component v-wc-breakpoints="child_component_breakpoints">
    <div v-if="child_component_breakpoints.is_xs">Test</div>
</child-component>
```

## Breakpoints

`Breakpoints` is a reactive object that can be used to check the width of the window.

```vue
<div v-if="Breakpoints.is_xs">
    xs
</div>
<div v-if="Breakpoints.is_sm">
    sm
</div>
```

```js
import {Breakpoints} from "./web-component.esm.js";

const BreakpointsComponent = {
    name: 'breakpoints-component',
    template: `html...`,
    data() {
        return {
            Breakpoints,
        }
    }
}
```

## petite-vue
https://github.com/vuejs/petite-vue 

You can use petite-vue function in the web component.

For example, you can use `reactive` to create a reactive object.

```js
import {reactive} from "./web-component.esm.js";

const state = reactive({
    count: 0,
});
```

## Helper functions

### async_timeout

```js
import {async_timeout} from "./web-component.esm.js";

async function test() {
    await async_timeout(1000);
    console.log('1s later');
}
```

### async_interval

```js
import {async_interval} from "./web-component.esm.js";

async function test() {
    let count = 0;
    await async_interval(1000, () => {
        console.log('1s later');
        count++;
        if (count === 3) {
            return false; // return false to stop
        }
    });
}
```

### async_animate
```js
import {async_animate} from "./web-component.esm.js";

async function test() {
    await async_animate({
        duration: 1000,
        draw: (progress) => {
            console.log(progress);
        }
    });
}
```

### async_until
```js
import {async_until, async_interval} from "./web-component.esm.js";

async function test() {
    let count = 0;
    
    async_interval(1000, () => {
        console.log('1s later');
        count++;
        if(count === 10) {
            return false;
        }
    });
    
    await async_until(() => {
        return count === 3;
    });
    
    console.log('count is 3');
}
```

### observe_dom
https://developer.mozilla.org/en-US/docs/Web/API/MutationObserver

```js
import {observe_dom} from "./web-component.esm.js";

let destory = observe_dom(document.body, (mutations) => {
    console.log(mutations);
},{
    attributes: true,
    childList: true,
    characterData: true,
    subtree: true,
});

// some code

destory();
```

### observe_dom_size
https://developer.mozilla.org/en-US/docs/Web/API/ResizeObserver

```js
import {observe_dom_size} from "./web-component.esm.js";

let destory = observe_dom_size(document.body, (size) => {
    console.log(size);
});

// some code

destory();
```

### observe_dom_intersect
https://developer.mozilla.org/en-US/docs/Web/API/IntersectionObserver

```js
import {observe_dom_intersect} from "./web-component.esm.js";

let destory = observe_dom_intersect(document.body, (entries) => {
    console.log(entries);
});

// some code

destory();
```