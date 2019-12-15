
(function(l, r) { if (l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (window.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.head.appendChild(r) })(window.document);
var app = (function () {
    'use strict';

    function noop() { }
    function assign(tar, src) {
        // @ts-ignore
        for (const k in src)
            tar[k] = src[k];
        return tar;
    }
    function add_location(element, file, line, column, char) {
        element.__svelte_meta = {
            loc: { file, line, column, char }
        };
    }
    function run(fn) {
        return fn();
    }
    function blank_object() {
        return Object.create(null);
    }
    function run_all(fns) {
        fns.forEach(run);
    }
    function is_function(thing) {
        return typeof thing === 'function';
    }
    function safe_not_equal(a, b) {
        return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
    }
    function create_slot(definition, ctx, $$scope, fn) {
        if (definition) {
            const slot_ctx = get_slot_context(definition, ctx, $$scope, fn);
            return definition[0](slot_ctx);
        }
    }
    function get_slot_context(definition, ctx, $$scope, fn) {
        return definition[1] && fn
            ? assign($$scope.ctx.slice(), definition[1](fn(ctx)))
            : $$scope.ctx;
    }
    function get_slot_changes(definition, $$scope, dirty, fn) {
        if (definition[2] && fn) {
            const lets = definition[2](fn(dirty));
            if ($$scope.dirty) {
                const merged = [];
                const len = Math.max($$scope.dirty.length, lets.length);
                for (let i = 0; i < len; i += 1) {
                    merged[i] = $$scope.dirty[i] | lets[i];
                }
                return merged;
            }
            return lets;
        }
        return $$scope.dirty;
    }

    function append(target, node) {
        target.appendChild(node);
    }
    function insert(target, node, anchor) {
        target.insertBefore(node, anchor || null);
    }
    function detach(node) {
        node.parentNode.removeChild(node);
    }
    function destroy_each(iterations, detaching) {
        for (let i = 0; i < iterations.length; i += 1) {
            if (iterations[i])
                iterations[i].d(detaching);
        }
    }
    function element(name) {
        return document.createElement(name);
    }
    function text(data) {
        return document.createTextNode(data);
    }
    function space() {
        return text(' ');
    }
    function listen(node, event, handler, options) {
        node.addEventListener(event, handler, options);
        return () => node.removeEventListener(event, handler, options);
    }
    function attr(node, attribute, value) {
        if (value == null)
            node.removeAttribute(attribute);
        else if (node.getAttribute(attribute) !== value)
            node.setAttribute(attribute, value);
    }
    function children(element) {
        return Array.from(element.childNodes);
    }
    function custom_event(type, detail) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, false, false, detail);
        return e;
    }

    let current_component;
    function set_current_component(component) {
        current_component = component;
    }
    function get_current_component() {
        if (!current_component)
            throw new Error(`Function called outside component initialization`);
        return current_component;
    }
    function beforeUpdate(fn) {
        get_current_component().$$.before_update.push(fn);
    }
    function onMount(fn) {
        get_current_component().$$.on_mount.push(fn);
    }
    function afterUpdate(fn) {
        get_current_component().$$.after_update.push(fn);
    }
    function onDestroy(fn) {
        get_current_component().$$.on_destroy.push(fn);
    }
    function createEventDispatcher() {
        const component = get_current_component();
        return (type, detail) => {
            const callbacks = component.$$.callbacks[type];
            if (callbacks) {
                // TODO are there situations where events could be dispatched
                // in a server (non-DOM) environment?
                const event = custom_event(type, detail);
                callbacks.slice().forEach(fn => {
                    fn.call(component, event);
                });
            }
        };
    }

    const dirty_components = [];
    const binding_callbacks = [];
    const render_callbacks = [];
    const flush_callbacks = [];
    const resolved_promise = Promise.resolve();
    let update_scheduled = false;
    function schedule_update() {
        if (!update_scheduled) {
            update_scheduled = true;
            resolved_promise.then(flush);
        }
    }
    function tick() {
        schedule_update();
        return resolved_promise;
    }
    function add_render_callback(fn) {
        render_callbacks.push(fn);
    }
    function flush() {
        const seen_callbacks = new Set();
        do {
            // first, call beforeUpdate functions
            // and update components
            while (dirty_components.length) {
                const component = dirty_components.shift();
                set_current_component(component);
                update(component.$$);
            }
            while (binding_callbacks.length)
                binding_callbacks.pop()();
            // then, once components are updated, call
            // afterUpdate functions. This may cause
            // subsequent updates...
            for (let i = 0; i < render_callbacks.length; i += 1) {
                const callback = render_callbacks[i];
                if (!seen_callbacks.has(callback)) {
                    callback();
                    // ...so guard against infinite loops
                    seen_callbacks.add(callback);
                }
            }
            render_callbacks.length = 0;
        } while (dirty_components.length);
        while (flush_callbacks.length) {
            flush_callbacks.pop()();
        }
        update_scheduled = false;
    }
    function update($$) {
        if ($$.fragment !== null) {
            $$.update();
            run_all($$.before_update);
            $$.fragment && $$.fragment.p($$.ctx, $$.dirty);
            $$.dirty = [-1];
            $$.after_update.forEach(add_render_callback);
        }
    }
    const outroing = new Set();
    let outros;
    function group_outros() {
        outros = {
            r: 0,
            c: [],
            p: outros // parent group
        };
    }
    function check_outros() {
        if (!outros.r) {
            run_all(outros.c);
        }
        outros = outros.p;
    }
    function transition_in(block, local) {
        if (block && block.i) {
            outroing.delete(block);
            block.i(local);
        }
    }
    function transition_out(block, local, detach, callback) {
        if (block && block.o) {
            if (outroing.has(block))
                return;
            outroing.add(block);
            outros.c.push(() => {
                outroing.delete(block);
                if (callback) {
                    if (detach)
                        block.d(1);
                    callback();
                }
            });
            block.o(local);
        }
    }

    function get_spread_update(levels, updates) {
        const update = {};
        const to_null_out = {};
        const accounted_for = { $$scope: 1 };
        let i = levels.length;
        while (i--) {
            const o = levels[i];
            const n = updates[i];
            if (n) {
                for (const key in o) {
                    if (!(key in n))
                        to_null_out[key] = 1;
                }
                for (const key in n) {
                    if (!accounted_for[key]) {
                        update[key] = n[key];
                        accounted_for[key] = 1;
                    }
                }
                levels[i] = n;
            }
            else {
                for (const key in o) {
                    accounted_for[key] = 1;
                }
            }
        }
        for (const key in to_null_out) {
            if (!(key in update))
                update[key] = undefined;
        }
        return update;
    }
    function get_spread_object(spread_props) {
        return typeof spread_props === 'object' && spread_props !== null ? spread_props : {};
    }
    function create_component(block) {
        block && block.c();
    }
    function mount_component(component, target, anchor) {
        const { fragment, on_mount, on_destroy, after_update } = component.$$;
        fragment && fragment.m(target, anchor);
        // onMount happens before the initial afterUpdate
        add_render_callback(() => {
            const new_on_destroy = on_mount.map(run).filter(is_function);
            if (on_destroy) {
                on_destroy.push(...new_on_destroy);
            }
            else {
                // Edge case - component was destroyed immediately,
                // most likely as a result of a binding initialising
                run_all(new_on_destroy);
            }
            component.$$.on_mount = [];
        });
        after_update.forEach(add_render_callback);
    }
    function destroy_component(component, detaching) {
        const $$ = component.$$;
        if ($$.fragment !== null) {
            run_all($$.on_destroy);
            $$.fragment && $$.fragment.d(detaching);
            // TODO null out other refs, including component.$$ (but need to
            // preserve final state?)
            $$.on_destroy = $$.fragment = null;
            $$.ctx = [];
        }
    }
    function make_dirty(component, i) {
        if (component.$$.dirty[0] === -1) {
            dirty_components.push(component);
            schedule_update();
            component.$$.dirty.fill(0);
        }
        component.$$.dirty[(i / 31) | 0] |= (1 << (i % 31));
    }
    function init(component, options, instance, create_fragment, not_equal, props, dirty = [-1]) {
        const parent_component = current_component;
        set_current_component(component);
        const prop_values = options.props || {};
        const $$ = component.$$ = {
            fragment: null,
            ctx: null,
            // state
            props,
            update: noop,
            not_equal,
            bound: blank_object(),
            // lifecycle
            on_mount: [],
            on_destroy: [],
            before_update: [],
            after_update: [],
            context: new Map(parent_component ? parent_component.$$.context : []),
            // everything else
            callbacks: blank_object(),
            dirty
        };
        let ready = false;
        $$.ctx = instance
            ? instance(component, prop_values, (i, ret, value = ret) => {
                if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
                    if ($$.bound[i])
                        $$.bound[i](value);
                    if (ready)
                        make_dirty(component, i);
                }
                return ret;
            })
            : [];
        $$.update();
        ready = true;
        run_all($$.before_update);
        // `false` as a special case of no DOM component
        $$.fragment = create_fragment ? create_fragment($$.ctx) : false;
        if (options.target) {
            if (options.hydrate) {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.l(children(options.target));
            }
            else {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.c();
            }
            if (options.intro)
                transition_in(component.$$.fragment);
            mount_component(component, options.target, options.anchor);
            flush();
        }
        set_current_component(parent_component);
    }
    class SvelteComponent {
        $destroy() {
            destroy_component(this, 1);
            this.$destroy = noop;
        }
        $on(type, callback) {
            const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
            callbacks.push(callback);
            return () => {
                const index = callbacks.indexOf(callback);
                if (index !== -1)
                    callbacks.splice(index, 1);
            };
        }
        $set() {
            // overridden by instance, if it has props
        }
    }

    function dispatch_dev(type, detail) {
        document.dispatchEvent(custom_event(type, detail));
    }
    function append_dev(target, node) {
        dispatch_dev("SvelteDOMInsert", { target, node });
        append(target, node);
    }
    function insert_dev(target, node, anchor) {
        dispatch_dev("SvelteDOMInsert", { target, node, anchor });
        insert(target, node, anchor);
    }
    function detach_dev(node) {
        dispatch_dev("SvelteDOMRemove", { node });
        detach(node);
    }
    function listen_dev(node, event, handler, options, has_prevent_default, has_stop_propagation) {
        const modifiers = options === true ? ["capture"] : options ? Array.from(Object.keys(options)) : [];
        if (has_prevent_default)
            modifiers.push('preventDefault');
        if (has_stop_propagation)
            modifiers.push('stopPropagation');
        dispatch_dev("SvelteDOMAddEventListener", { node, event, handler, modifiers });
        const dispose = listen(node, event, handler, options);
        return () => {
            dispatch_dev("SvelteDOMRemoveEventListener", { node, event, handler, modifiers });
            dispose();
        };
    }
    function attr_dev(node, attribute, value) {
        attr(node, attribute, value);
        if (value == null)
            dispatch_dev("SvelteDOMRemoveAttribute", { node, attribute });
        else
            dispatch_dev("SvelteDOMSetAttribute", { node, attribute, value });
    }
    function prop_dev(node, property, value) {
        node[property] = value;
        dispatch_dev("SvelteDOMSetProperty", { node, property, value });
    }
    function set_data_dev(text, data) {
        data = '' + data;
        if (text.data === data)
            return;
        dispatch_dev("SvelteDOMSetData", { node: text, data });
        text.data = data;
    }
    class SvelteComponentDev extends SvelteComponent {
        constructor(options) {
            if (!options || (!options.target && !options.$$inline)) {
                throw new Error(`'target' is a required option`);
            }
            super();
        }
        $destroy() {
            super.$destroy();
            this.$destroy = () => {
                console.warn(`Component was already destroyed`); // eslint-disable-line no-console
            };
        }
    }

    /* src/Product.svelte generated by Svelte v3.16.4 */
    const file = "src/Product.svelte";

    // (21:2) {#if bestseller}
    function create_if_block(ctx) {
    	let h4;

    	const block = {
    		c: function create() {
    			h4 = element("h4");
    			h4.textContent = "BEST SELLER!";
    			attr_dev(h4, "class", "svelte-1igm760");
    			add_location(h4, file, 21, 4, 634);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h4, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h4);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block.name,
    		type: "if",
    		source: "(21:2) {#if bestseller}",
    		ctx
    	});

    	return block;
    }

    function create_fragment(ctx) {
    	let article;
    	let h1;
    	let t0;
    	let t1;
    	let t2;
    	let h2;
    	let t3;
    	let t4;
    	let t5;
    	let button0;
    	let t7;
    	let button1;
    	let dispose;
    	let if_block = /*bestseller*/ ctx[3] && create_if_block(ctx);

    	const block = {
    		c: function create() {
    			article = element("article");
    			h1 = element("h1");
    			t0 = text(/*title*/ ctx[0]);
    			t1 = space();
    			if (if_block) if_block.c();
    			t2 = space();
    			h2 = element("h2");
    			t3 = text("$");
    			t4 = text(/*price*/ ctx[1]);
    			t5 = space();
    			button0 = element("button");
    			button0.textContent = "Add to Cart";
    			t7 = space();
    			button1 = element("button");
    			button1.textContent = "Delete";
    			add_location(h1, file, 19, 2, 594);
    			add_location(h2, file, 23, 2, 666);
    			add_location(button0, file, 24, 2, 686);
    			add_location(button1, file, 27, 2, 814);
    			add_location(article, file, 18, 0, 582);

    			dispose = [
    				listen_dev(button0, "click", /*addToCart*/ ctx[5], false, false, false),
    				listen_dev(button1, "click", /*click_handler*/ ctx[6], false, false, false)
    			];
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, article, anchor);
    			append_dev(article, h1);
    			append_dev(h1, t0);
    			append_dev(article, t1);
    			if (if_block) if_block.m(article, null);
    			append_dev(article, t2);
    			append_dev(article, h2);
    			append_dev(h2, t3);
    			append_dev(h2, t4);
    			append_dev(article, t5);
    			append_dev(article, button0);
    			append_dev(article, t7);
    			append_dev(article, button1);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*title*/ 1) set_data_dev(t0, /*title*/ ctx[0]);

    			if (/*bestseller*/ ctx[3]) {
    				if (!if_block) {
    					if_block = create_if_block(ctx);
    					if_block.c();
    					if_block.m(article, t2);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}

    			if (dirty[0] & /*price*/ 2) set_data_dev(t4, /*price*/ ctx[1]);
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(article);
    			if (if_block) if_block.d();
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance($$self, $$props, $$invalidate) {
    	const dispatch = createEventDispatcher();
    	let { title } = $$props;
    	let { price } = $$props;
    	let { id } = $$props;
    	let { bestseller = false } = $$props;

    	function addToCart() {
    		dispatch("add-to-cart", { id });
    	}

    	const writable_props = ["title", "price", "id", "bestseller"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Product> was created with unknown prop '${key}'`);
    	});

    	const click_handler = () => dispatch("delete", { id });

    	$$self.$set = $$props => {
    		if ("title" in $$props) $$invalidate(0, title = $$props.title);
    		if ("price" in $$props) $$invalidate(1, price = $$props.price);
    		if ("id" in $$props) $$invalidate(2, id = $$props.id);
    		if ("bestseller" in $$props) $$invalidate(3, bestseller = $$props.bestseller);
    	};

    	$$self.$capture_state = () => {
    		return { title, price, id, bestseller };
    	};

    	$$self.$inject_state = $$props => {
    		if ("title" in $$props) $$invalidate(0, title = $$props.title);
    		if ("price" in $$props) $$invalidate(1, price = $$props.price);
    		if ("id" in $$props) $$invalidate(2, id = $$props.id);
    		if ("bestseller" in $$props) $$invalidate(3, bestseller = $$props.bestseller);
    	};

    	return [title, price, id, bestseller, dispatch, addToCart, click_handler];
    }

    class Product extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance, create_fragment, safe_not_equal, { title: 0, price: 1, id: 2, bestseller: 3 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Product",
    			options,
    			id: create_fragment.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || ({});

    		if (/*title*/ ctx[0] === undefined && !("title" in props)) {
    			console.warn("<Product> was created without expected prop 'title'");
    		}

    		if (/*price*/ ctx[1] === undefined && !("price" in props)) {
    			console.warn("<Product> was created without expected prop 'price'");
    		}

    		if (/*id*/ ctx[2] === undefined && !("id" in props)) {
    			console.warn("<Product> was created without expected prop 'id'");
    		}
    	}

    	get title() {
    		throw new Error("<Product>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set title(value) {
    		throw new Error("<Product>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get price() {
    		throw new Error("<Product>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set price(value) {
    		throw new Error("<Product>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get id() {
    		throw new Error("<Product>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set id(value) {
    		throw new Error("<Product>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get bestseller() {
    		throw new Error("<Product>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set bestseller(value) {
    		throw new Error("<Product>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/Modal.svelte generated by Svelte v3.16.4 */

    const file$1 = "src/Modal.svelte";
    const get_footer_slot_changes = dirty => ({ didAgree: dirty[0] & /*agreed*/ 1 });
    const get_footer_slot_context = ctx => ({ didAgree: /*agreed*/ ctx[0] });
    const get_header_slot_changes = dirty => ({});
    const get_header_slot_context = ctx => ({});

    function create_fragment$1(ctx) {
    	let div0;
    	let t0;
    	let div3;
    	let header;
    	let t1;
    	let div1;
    	let t2;
    	let div2;
    	let h6;
    	let t4;
    	let button0;
    	let t6;
    	let footer;
    	let button1;
    	let t7;
    	let button1_disabled_value;
    	let dispose_footer_slot;
    	let current;
    	let dispose;
    	const header_slot_template = /*$$slots*/ ctx[5].header;
    	const header_slot = create_slot(header_slot_template, ctx, /*$$scope*/ ctx[4], get_header_slot_context);
    	const default_slot_template = /*$$slots*/ ctx[5].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[4], null);
    	const footer_slot_template = /*$$slots*/ ctx[5].footer;
    	const footer_slot = create_slot(footer_slot_template, ctx, /*$$scope*/ ctx[4], get_footer_slot_context);

    	const block = {
    		c: function create() {
    			div0 = element("div");
    			t0 = space();
    			div3 = element("div");
    			header = element("header");
    			if (header_slot) header_slot.c();
    			t1 = space();
    			div1 = element("div");
    			if (default_slot) default_slot.c();
    			t2 = space();
    			div2 = element("div");
    			h6 = element("h6");
    			h6.textContent = "Before you close, you must agree to our terms!";
    			t4 = space();
    			button0 = element("button");
    			button0.textContent = "Agree";
    			t6 = space();
    			footer = element("footer");

    			if (!footer_slot) {
    				button1 = element("button");
    				t7 = text("Close");
    			}

    			if (footer_slot) footer_slot.c();
    			attr_dev(div0, "class", "backdrop svelte-12l5c1e");
    			add_location(div0, file$1, 42, 0, 749);
    			add_location(header, file$1, 45, 4, 830);
    			add_location(div1, file$1, 48, 2, 881);
    			add_location(h6, file$1, 53, 4, 1067);
    			add_location(button0, file$1, 54, 4, 1127);
    			attr_dev(div2, "class", "disclaimer");
    			add_location(div2, file$1, 52, 2, 1038);

    			if (!footer_slot) {
    				button1.disabled = button1_disabled_value = !/*agreed*/ ctx[0];
    				add_location(button1, file$1, 62, 6, 1391);
    				dispose_footer_slot = listen_dev(button1, "click", /*click_handler_1*/ ctx[7], false, false, false);
    			}

    			add_location(footer, file$1, 58, 2, 1206);
    			attr_dev(div3, "class", "modal svelte-12l5c1e");
    			add_location(div3, file$1, 44, 2, 806);

    			dispose = [
    				listen_dev(div0, "click", /*closeModal*/ ctx[2], false, false, false),
    				listen_dev(button0, "click", /*click_handler*/ ctx[6], false, false, false)
    			];
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div0, anchor);
    			insert_dev(target, t0, anchor);
    			insert_dev(target, div3, anchor);
    			append_dev(div3, header);

    			if (header_slot) {
    				header_slot.m(header, null);
    			}

    			append_dev(div3, t1);
    			append_dev(div3, div1);

    			if (default_slot) {
    				default_slot.m(div1, null);
    			}

    			append_dev(div3, t2);
    			append_dev(div3, div2);
    			append_dev(div2, h6);
    			append_dev(div2, t4);
    			append_dev(div2, button0);
    			append_dev(div3, t6);
    			append_dev(div3, footer);

    			if (!footer_slot) {
    				append_dev(footer, button1);
    				append_dev(button1, t7);
    			}

    			if (footer_slot) {
    				footer_slot.m(footer, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (header_slot && header_slot.p && dirty[0] & /*$$scope*/ 16) {
    				header_slot.p(get_slot_context(header_slot_template, ctx, /*$$scope*/ ctx[4], get_header_slot_context), get_slot_changes(header_slot_template, /*$$scope*/ ctx[4], dirty, get_header_slot_changes));
    			}

    			if (default_slot && default_slot.p && dirty[0] & /*$$scope*/ 16) {
    				default_slot.p(get_slot_context(default_slot_template, ctx, /*$$scope*/ ctx[4], null), get_slot_changes(default_slot_template, /*$$scope*/ ctx[4], dirty, null));
    			}

    			if (!footer_slot) {
    				if (!current || dirty[0] & /*agreed*/ 1 && button1_disabled_value !== (button1_disabled_value = !/*agreed*/ ctx[0])) {
    					prop_dev(button1, "disabled", button1_disabled_value);
    				}
    			}

    			if (footer_slot && footer_slot.p && dirty[0] & /*$$scope, agreed*/ 17) {
    				footer_slot.p(get_slot_context(footer_slot_template, ctx, /*$$scope*/ ctx[4], get_footer_slot_context), get_slot_changes(footer_slot_template, /*$$scope*/ ctx[4], dirty, get_footer_slot_changes));
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(header_slot, local);
    			transition_in(default_slot, local);
    			transition_in(footer_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(header_slot, local);
    			transition_out(default_slot, local);
    			transition_out(footer_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div0);
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(div3);
    			if (header_slot) header_slot.d(detaching);
    			if (default_slot) default_slot.d(detaching);

    			if (!footer_slot) {
    				dispose_footer_slot();
    			}

    			if (footer_slot) footer_slot.d(detaching);
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$1.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$1($$self, $$props, $$invalidate) {
    	const dispatch = createEventDispatcher();

    	const closeModal = () => {
    		dispatch("cancel-modal");
    		console.log("Modal cancelled");
    	};

    	let agreed = false;
    	let autoscroll = false;
    	onMount(() => console.log("onMount"));

    	beforeUpdate(() => {
    		console.log("Before Update");
    		autoscroll = agreed;
    	});

    	afterUpdate(() => {
    		console.log("After Update");

    		if (autoscroll) {
    			const modal = document.querySelector(".modal");
    			modal.scrollTo(0, modal.scrollHeight);
    		}
    	});

    	onDestroy(() => console.log("onDestroy"));
    	console.table("Script executed");
    	let { $$slots = {}, $$scope } = $$props;
    	const click_handler = () => $$invalidate(0, agreed = true);
    	const click_handler_1 = () => dispatch("close-modal");

    	$$self.$set = $$props => {
    		if ("$$scope" in $$props) $$invalidate(4, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => {
    		return {};
    	};

    	$$self.$inject_state = $$props => {
    		if ("agreed" in $$props) $$invalidate(0, agreed = $$props.agreed);
    		if ("autoscroll" in $$props) autoscroll = $$props.autoscroll;
    	};

    	return [
    		agreed,
    		dispatch,
    		closeModal,
    		autoscroll,
    		$$scope,
    		$$slots,
    		click_handler,
    		click_handler_1
    	];
    }

    class Modal extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$1, create_fragment$1, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Modal",
    			options,
    			id: create_fragment$1.name
    		});
    	}
    }

    /* src/App.svelte generated by Svelte v3.16.4 */
    const file$2 = "src/App.svelte";

    function get_each_context(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[9] = list[i];
    	child_ctx[11] = i;
    	return child_ctx;
    }

    // (65:0) {#each products as product, index}
    function create_each_block(ctx) {
    	let current;
    	const product_spread_levels = [/*product*/ ctx[9]];
    	let product_props = {};

    	for (let i = 0; i < product_spread_levels.length; i += 1) {
    		product_props = assign(product_props, product_spread_levels[i]);
    	}

    	const product = new Product({ props: product_props, $$inline: true });
    	product.$on("add-to-cart", /*addToCart*/ ctx[3]);
    	product.$on("delete", deleteProduct);

    	const block = {
    		c: function create() {
    			create_component(product.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(product, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const product_changes = (dirty[0] & /*products*/ 4)
    			? get_spread_update(product_spread_levels, [get_spread_object(/*product*/ ctx[9])])
    			: {};

    			product.$set(product_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(product.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(product.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(product, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block.name,
    		type: "each",
    		source: "(65:0) {#each products as product, index}",
    		ctx
    	});

    	return block;
    }

    // (75:0) {#if modal}
    function create_if_block$1(ctx) {
    	let current;

    	const modal_1 = new Modal({
    			props: {
    				$$slots: {
    					default: [
    						create_default_slot,
    						({ didAgree: closable }) => ({ 5: closable }),
    						({ didAgree: closable }) => [closable ? 32 : 0]
    					],
    					footer: [
    						create_footer_slot,
    						({ didAgree: closable }) => ({ 5: closable }),
    						({ didAgree: closable }) => [closable ? 32 : 0]
    					],
    					header: [
    						create_header_slot,
    						({ didAgree: closable }) => ({ 5: closable }),
    						({ didAgree: closable }) => [closable ? 32 : 0]
    					]
    				},
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	modal_1.$on("cancel-modal", /*cancel_modal_handler*/ ctx[7]);
    	modal_1.$on("close-modal", /*close_modal_handler*/ ctx[8]);

    	const block = {
    		c: function create() {
    			create_component(modal_1.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(modal_1, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const modal_1_changes = {};

    			if (dirty[0] & /*$$scope, closable, modal*/ 4130) {
    				modal_1_changes.$$scope = { dirty, ctx };
    			}

    			modal_1.$set(modal_1_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(modal_1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(modal_1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(modal_1, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$1.name,
    		type: "if",
    		source: "(75:0) {#if modal}",
    		ctx
    	});

    	return block;
    }

    // (82:4) <h1 slot="header">
    function create_header_slot(ctx) {
    	let h1;

    	const block = {
    		c: function create() {
    			h1 = element("h1");
    			h1.textContent = "Here's a test!";
    			attr_dev(h1, "slot", "header");
    			add_location(h1, file$2, 81, 4, 1902);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h1, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_header_slot.name,
    		type: "slot",
    		source: "(82:4) <h1 slot=\\\"header\\\">",
    		ctx
    	});

    	return block;
    }

    // (85:4) <button slot="footer"       on:click={() => modal = false}       disabled={!closable}>
    function create_footer_slot(ctx) {
    	let button;
    	let t;
    	let button_disabled_value;
    	let dispose;

    	const block = {
    		c: function create() {
    			button = element("button");
    			t = text("Confirm");
    			attr_dev(button, "slot", "footer");
    			button.disabled = button_disabled_value = !/*closable*/ ctx[5];
    			add_location(button, file$2, 84, 4, 2030);
    			dispose = listen_dev(button, "click", /*click_handler*/ ctx[6], false, false, false);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);
    			append_dev(button, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*closable*/ 32 && button_disabled_value !== (button_disabled_value = !/*closable*/ ctx[5])) {
    				prop_dev(button, "disabled", button_disabled_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_footer_slot.name,
    		type: "slot",
    		source: "(85:4) <button slot=\\\"footer\\\"       on:click={() => modal = false}       disabled={!closable}>",
    		ctx
    	});

    	return block;
    }

    // (77:2) <Modal   on:cancel-modal={() => modal = false}   on:close-modal={() => modal = false}   let:didAgree={closable}   >
    function create_default_slot(ctx) {
    	let t0;
    	let p;
    	let t2;
    	let t3;

    	const block = {
    		c: function create() {
    			t0 = space();
    			p = element("p");
    			p.textContent = "This is a test for slots, homie.";
    			t2 = space();
    			t3 = text("gss");
    			add_location(p, file$2, 82, 4, 1944);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t0, anchor);
    			insert_dev(target, p, anchor);
    			insert_dev(target, t2, anchor);
    			insert_dev(target, t3, anchor);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(p);
    			if (detaching) detach_dev(t2);
    			if (detaching) detach_dev(t3);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot.name,
    		type: "slot",
    		source: "(77:2) <Modal   on:cancel-modal={() => modal = false}   on:close-modal={() => modal = false}   let:didAgree={closable}   >",
    		ctx
    	});

    	return block;
    }

    function create_fragment$2(ctx) {
    	let t0;
    	let t1;
    	let textarea;
    	let current;
    	let dispose;
    	let each_value = /*products*/ ctx[2];
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	let if_block = /*modal*/ ctx[1] && create_if_block$1(ctx);

    	const block = {
    		c: function create() {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t0 = space();
    			if (if_block) if_block.c();
    			t1 = space();
    			textarea = element("textarea");
    			attr_dev(textarea, "rows", "5");
    			textarea.value = /*text*/ ctx[0];
    			add_location(textarea, file$2, 91, 0, 2159);
    			dispose = listen_dev(textarea, "keydown", /*transform*/ ctx[4], false, false, false);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(target, anchor);
    			}

    			insert_dev(target, t0, anchor);
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, textarea, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*products, addToCart*/ 12) {
    				each_value = /*products*/ ctx[2];
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(t0.parentNode, t0);
    					}
    				}

    				group_outros();

    				for (i = each_value.length; i < each_blocks.length; i += 1) {
    					out(i);
    				}

    				check_outros();
    			}

    			if (/*modal*/ ctx[1]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    					transition_in(if_block, 1);
    				} else {
    					if_block = create_if_block$1(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(t1.parentNode, t1);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}

    			if (!current || dirty[0] & /*text*/ 1) {
    				prop_dev(textarea, "value", /*text*/ ctx[0]);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			each_blocks = each_blocks.filter(Boolean);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_each(each_blocks, detaching);
    			if (detaching) detach_dev(t0);
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(textarea);
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$2.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function deleteProduct(event) {
    	console.log(event.detail);
    }

    function instance$2($$self, $$props, $$invalidate) {
    	let products = [
    		{
    			id: "product1",
    			title: "An Old Book",
    			price: 7.99
    		},
    		{
    			id: "product2",
    			title: "A New Book",
    			bestseller: true,
    			price: 8.99
    		},
    		{
    			id: "product3",
    			title: "A Dumb Book",
    			price: 3.99
    		}
    	];

    	let text = "This is the text";
    	let modal = false;
    	let closable = false;

    	function addToCart(event) {
    		console.log(event.detail);
    		$$invalidate(1, modal = true);
    	}

    	function transform(event) {
    		if (event.which !== 9) {
    			return;
    		}

    		event.preventDefault();
    		const selectionStart = event.target.selectionStart;
    		const selectionEnd = event.target.selectionEnd;
    		const value = event.target.value;
    		$$invalidate(0, text = value.slice(0, selectionStart) + value.slice(selectionStart, selectionEnd).toUpperCase() + value.slice(selectionEnd));

    		tick().then(() => {
    			event.target.selectionStart = selectionStart;
    			event.target.selectionEnd = selectionEnd;
    		});
    	}

    	const click_handler = () => $$invalidate(1, modal = false);
    	const cancel_modal_handler = () => $$invalidate(1, modal = false);
    	const close_modal_handler = () => $$invalidate(1, modal = false);

    	$$self.$capture_state = () => {
    		return {};
    	};

    	$$self.$inject_state = $$props => {
    		if ("products" in $$props) $$invalidate(2, products = $$props.products);
    		if ("text" in $$props) $$invalidate(0, text = $$props.text);
    		if ("modal" in $$props) $$invalidate(1, modal = $$props.modal);
    		if ("closable" in $$props) $$invalidate(5, closable = $$props.closable);
    	};

    	return [
    		text,
    		modal,
    		products,
    		addToCart,
    		transform,
    		closable,
    		click_handler,
    		cancel_modal_handler,
    		close_modal_handler
    	];
    }

    class App extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$2, create_fragment$2, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "App",
    			options,
    			id: create_fragment$2.name
    		});
    	}
    }

    const app = new App({
    	target: document.body,
    });

    return app;

}());
//# sourceMappingURL=bundle.js.map
