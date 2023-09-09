export const async_timeout = (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
};

export const async_interval = async (ms, callback) => {
    while (true) {
        await async_timeout(ms);
        let result = await callback();

        if (result === false) {
            break;
        }
    }
}

/**
 *
 * @param options {duration: number, draw: function}
 * @return {Promise<void>}
 */
export const async_animate = async (options) => {
    let duration = options.duration || 1000;
    let callback = options.draw || (() => {
        return false;
    });

    // use requestAnimationFrame
    return new Promise(resolve => {
        let start = performance.now();
        let animate = () => {
            let now = performance.now();
            let progress = (now - start) / duration;

            if (progress > 1) {
                progress = 1;
            }

            let result = callback(progress);

            if(result === false) {
                resolve();
                return;
            }

            if (progress === 1) {
                resolve();
            } else {
                requestAnimationFrame(animate);
            }
        };

        requestAnimationFrame(animate);
    });
    //
    // return async_interval(fps_interval, () => {
    //     let now = performance.now();
    //     let progress = (now - start) / duration;
    //
    //     if (progress > 1) {
    //         progress = 1;
    //     }
    //
    //     callback(progress);
    //
    //     if (progress === 1) {
    //         return false;
    //     }
    // });
}

// create some easing functions
async_animate.swing = (progress) => {
    return 0.5 - Math.cos(progress * Math.PI) / 2;
}

async_animate.linear = (progress) => {
    return progress;
}

async_animate.ease_in = (progress) => {
    return Math.pow(progress, 2);
}

async_animate.ease_out = (progress) => {
    return 1 - async_animate.ease_in(1 - progress);
}

async_animate.ease_in_out = (progress) => {
    return progress < 0.5 ? async_animate.ease_in(progress * 2) / 2 : 1 - async_animate.ease_in((1 - progress) * 2) / 2;
}

export const async_until = async (callback, ms = 100) => {
    while (true) {
        let result = await callback();

        if (result) {
            return result;
        }

        await async_timeout(ms);
    }
}

export default {
    async_timeout,
    async_interval,
    async_animate,
    async_until,
}