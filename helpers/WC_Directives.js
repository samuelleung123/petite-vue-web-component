import {WC_Breakpoints} from "./WC_Breakpoints";

export const wc_model = (ctx) => {
    // console.log(ctx);
    let arg = ctx.arg || 'value';
    let cb = (e) => {
        // console.log('update:' + arg, e.detail);
        let setter = ctx.get(`(val) => {${ctx.exp} = val}`);
        setter(e.detail);
    };
    ctx.el.addEventListener('update:' + arg, cb);

    ctx.effect(() => {
        // console.log('wc_model effect', arg, ctx.get());
        ctx.el.set_prop(arg, ctx.get());
    });

    return () => {
        ctx.el.removeEventListener('update:' + arg, cb);
    }
}

export const wc_watch = (ctx) => {
    // console.log(ctx.arg);
    let arg = ctx.arg;
    if(arg.indexOf(':') > -1) {
        arg = arg.split(':').join('.');
    }
    let old_value = ctx.get(`${arg}`);

    ctx.effect(() => {
        let new_value = ctx.get(`${arg}`);

        let watcher = ctx.get(`(old_value, new_value) => {${ctx.exp}(old_value, new_value)}`);
        // console.log({watcher})
        watcher(old_value, new_value);

        old_value = new_value;
    });
}

export const wc_breakpoints = (ctx) => {

    let setter = ctx.get(`(val) => {${ctx.exp} = val;}`);

    let breakpoints = WC_Breakpoints(ctx.el, setter);

    return () => {
        breakpoints = null;
    }
};

/**
 * @description v-wc-breakpoints="breakpoints"
 * @description v-wc-model="value"
 */
export default {
    'wc-breakpoints': wc_breakpoints,
    'wc-model': wc_model,
    'wc-watch': wc_watch,
}