import {reactive} from "../lib/petite-vue.es";


export const Breakpoints = reactive({
    xs: 0,
    sm: 600,
    md: 960,
    lg: 1264,
    xl: 1904,
    window_width: window.innerWidth,
    is_xs: false,
    is_sm: false,
    is_md: false,
    is_lg: false,
    is_xl: false,
    is_xs_and_up: false,
    is_sm_and_up: false,
    is_sm_and_down: false,
    is_md_and_up: false,
    is_md_and_down: false,
    is_lg_and_up: false,
    is_lg_and_down: false,
    is_xl_and_up: false,
    is_xl_and_down: false,
    update() {
        this.window_width = window.innerWidth;
        this.set_is_xs();
        this.set_is_sm();
        this.set_is_md();
        this.set_is_lg();
        this.set_is_xl();
        this.set_is_xs_and_up();
        this.set_is_sm_and_up();
        this.set_is_sm_and_down();
        this.set_is_md_and_up();
        this.set_is_md_and_down();
        this.set_is_lg_and_up();
        this.set_is_lg_and_down();
        this.set_is_xl_and_up();
        this.set_is_xl_and_down();
    },
    set_is_xs() {
        this.is_xs = this.window_width < this.sm;
    },
    set_is_sm() {
        this.is_sm = this.window_width >= this.sm && this.window_width < this.md;
    },
    set_is_md() {
        this.is_md = this.window_width >= this.md && this.window_width < this.lg;
    },
    set_is_lg() {
        this.is_lg = this.window_width >= this.lg && this.window_width < this.xl;
    },
    set_is_xl() {
        this.is_xl = this.window_width >= this.xl;
    },
    set_is_xs_and_up() {
        this.is_xs_and_up = this.window_width >= this.xs;
    },
    set_is_sm_and_up() {
        this.is_sm_and_up = this.window_width >= this.sm;
    },
    set_is_sm_and_down() {
        this.is_sm_and_down = this.window_width < this.md;
    },
    set_is_md_and_up() {
        this.is_md_and_up = this.window_width >= this.md;
    },
    set_is_md_and_down() {
        this.is_md_and_down = this.window_width < this.lg;
    },
    set_is_lg_and_up() {
        this.is_lg_and_up = this.window_width >= this.lg;
    },
    set_is_lg_and_down() {
        this.is_lg_and_down = this.window_width < this.xl;
    },
    set_is_xl_and_up() {
        this.is_xl_and_up = this.window_width >= this.xl;
    },
    set_is_xl_and_down() {
        this.is_xl_and_down = this.window_width < this.xl;
    },
});

let is_init = false;

function init(Breakpoints) {
    if (is_init) {
        return;
    }
    is_init = true;
    window.addEventListener('resize', () => {
        Breakpoints.update();
    });
    Breakpoints.update();
}

init(Breakpoints);
