export const observe_dom = (el, cb, options = {
    attributes: true,
    childList: true,
    characterData: true,
    subtree: true,
}) => {
    let observer = new MutationObserver(cb);

    if (!Array.isArray(el)) {
        el = [el];
    }
    el.forEach(el => {
        observer.observe(el, options);
    });

    return () => {
        console.log('observer disconnect');
        el.forEach(el => {
            observer.unobserve(el);
        });
        observer.disconnect();
    };
}

export const observe_dom_size = (el, cb) => {

    const resizeObserver = new ResizeObserver((entries) => {
        for (const entry of entries) {
            const {width, height} = entry.contentRect;
            cb({width, height});
        }
        // console.log("Size changed");
    });

    if (!Array.isArray(el)) {
        el = [el];
    }
    el.forEach(el => {
        resizeObserver.observe(el);
    });

    return () => {
        el.forEach(el => {
            resizeObserver.unobserve(el);
        });
        resizeObserver.disconnect();
        // console.log('observer disconnect');
    }
}

/**
 *
 * @param el
 * @param cb
 * @param options Object{root: null, rootMargin: '0px', threshold: 0.0}
 * @return {(function(): void)|*}
 */
export const observe_dom_intersect = (el, cb, options = null) => {
    const observer = new IntersectionObserver(cb, options);
    if (!Array.isArray(el)) {
        el = [el];
    }
    el.forEach(el => {
        observer.observe(el);
    });

    return () => {
        el.forEach(el => {
            observer.unobserve(el);
        });
        observer.disconnect();
    }
};

export default {
    observe_dom,
    observe_dom_size,
    observe_dom_intersect,
}