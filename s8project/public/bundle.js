
(function(l, r) { if (l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (window.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.head.appendChild(r) })(window.document);
var app = (function () {
    'use strict';

    function noop() { }
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

    function append(target, node) {
        target.appendChild(node);
    }
    function insert(target, node, anchor) {
        target.insertBefore(node, anchor || null);
    }
    function detach(node) {
        node.parentNode.removeChild(node);
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
    function to_number(value) {
        return value === '' ? undefined : +value;
    }
    function children(element) {
        return Array.from(element.childNodes);
    }
    function set_input_value(input, value) {
        if (value != null || input.value) {
            input.value = value;
        }
    }
    function select_option(select, value) {
        for (let i = 0; i < select.options.length; i += 1) {
            const option = select.options[i];
            if (option.__value === value) {
                option.selected = true;
                return;
            }
        }
    }
    function select_value(select) {
        const selected_option = select.querySelector(':checked') || select.options[0];
        return selected_option && selected_option.__value;
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
    function add_render_callback(fn) {
        render_callbacks.push(fn);
    }
    function add_flush_callback(fn) {
        flush_callbacks.push(fn);
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

    function bind(component, name, callback) {
        const index = component.$$.props[name];
        if (index !== undefined) {
            component.$$.bound[index] = callback;
            callback(component.$$.ctx[index]);
        }
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

    /* src/CustomInput.svelte generated by Svelte v3.16.4 */

    const file = "src/CustomInput.svelte";

    function create_fragment(ctx) {
    	let input;
    	let dispose;

    	const block = {
    		c: function create() {
    			input = element("input");
    			attr_dev(input, "type", "text");
    			attr_dev(input, "name", "");
    			add_location(input, file, 6, 2, 42);
    			dispose = listen_dev(input, "input", /*input_input_handler*/ ctx[1]);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, input, anchor);
    			set_input_value(input, /*val*/ ctx[0]);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*val*/ 1 && input.value !== /*val*/ ctx[0]) {
    				set_input_value(input, /*val*/ ctx[0]);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(input);
    			dispose();
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
    	let { val } = $$props;
    	const writable_props = ["val"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<CustomInput> was created with unknown prop '${key}'`);
    	});

    	function input_input_handler() {
    		val = this.value;
    		$$invalidate(0, val);
    	}

    	$$self.$set = $$props => {
    		if ("val" in $$props) $$invalidate(0, val = $$props.val);
    	};

    	$$self.$capture_state = () => {
    		return { val };
    	};

    	$$self.$inject_state = $$props => {
    		if ("val" in $$props) $$invalidate(0, val = $$props.val);
    	};

    	return [val, input_input_handler];
    }

    class CustomInput extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance, create_fragment, safe_not_equal, { val: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "CustomInput",
    			options,
    			id: create_fragment.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || ({});

    		if (/*val*/ ctx[0] === undefined && !("val" in props)) {
    			console.warn("<CustomInput> was created without expected prop 'val'");
    		}
    	}

    	get val() {
    		throw new Error("<CustomInput>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set val(value) {
    		throw new Error("<CustomInput>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/App.svelte generated by Svelte v3.16.4 */
    const file$1 = "src/App.svelte";

    function create_fragment$1(ctx) {
    	let updating_val;
    	let t0;
    	let input0;
    	let input0_updating = false;
    	let t1;
    	let label0;
    	let input1;
    	let t2;
    	let t3;
    	let label1;
    	let input2;
    	let t4;
    	let t5;
    	let label2;
    	let input3;
    	let t6;
    	let t7;
    	let label3;
    	let input4;
    	let t8;
    	let t9;
    	let select;
    	let option0;
    	let option1;
    	let option2;
    	let t13;
    	let input5;
    	let t14;
    	let button;
    	let current;
    	let dispose;

    	function custominput_val_binding(value) {
    		/*custominput_val_binding*/ ctx[7].call(null, value);
    	}

    	let custominput_props = {};

    	if (/*val*/ ctx[0] !== void 0) {
    		custominput_props.val = /*val*/ ctx[0];
    	}

    	const custominput = new CustomInput({ props: custominput_props, $$inline: true });
    	binding_callbacks.push(() => bind(custominput, "val", custominput_val_binding));

    	function input0_input_handler() {
    		input0_updating = true;
    		/*input0_input_handler*/ ctx[8].call(input0);
    	}

    	const block = {
    		c: function create() {
    			create_component(custominput.$$.fragment);
    			t0 = space();
    			input0 = element("input");
    			t1 = space();
    			label0 = element("label");
    			input1 = element("input");
    			t2 = text("\n  Agree to terms");
    			t3 = space();
    			label1 = element("label");
    			input2 = element("input");
    			t4 = text("\n    Red");
    			t5 = space();
    			label2 = element("label");
    			input3 = element("input");
    			t6 = text("\n    Green");
    			t7 = space();
    			label3 = element("label");
    			input4 = element("input");
    			t8 = text("\n    Blue");
    			t9 = space();
    			select = element("select");
    			option0 = element("option");
    			option0.textContent = "Red";
    			option1 = element("option");
    			option1.textContent = "Green";
    			option2 = element("option");
    			option2.textContent = "Blue";
    			t13 = space();
    			input5 = element("input");
    			t14 = space();
    			button = element("button");
    			button.textContent = "Save";
    			attr_dev(input0, "type", "number");
    			add_location(input0, file$1, 33, 0, 544);
    			attr_dev(input1, "type", "checkbox");
    			attr_dev(input1, "name", "");
    			attr_dev(input1, "id", "");
    			add_location(input1, file$1, 37, 2, 600);
    			add_location(label0, file$1, 36, 2, 590);
    			attr_dev(input2, "type", "radio");
    			attr_dev(input2, "name", "color");
    			input2.__value = "red";
    			input2.value = input2.__value;
    			/*$$binding_groups*/ ctx[11][0].push(input2);
    			add_location(input2, file$1, 41, 2, 698);
    			add_location(label1, file$1, 40, 2, 688);
    			attr_dev(input3, "type", "radio");
    			attr_dev(input3, "name", "color");
    			input3.__value = "green";
    			input3.value = input3.__value;
    			/*$$binding_groups*/ ctx[11][0].push(input3);
    			add_location(input3, file$1, 47, 2, 803);
    			add_location(label2, file$1, 46, 2, 793);
    			attr_dev(input4, "type", "radio");
    			attr_dev(input4, "name", "color");
    			input4.__value = "blue";
    			input4.value = input4.__value;
    			/*$$binding_groups*/ ctx[11][0].push(input4);
    			add_location(input4, file$1, 53, 2, 912);
    			add_location(label3, file$1, 52, 2, 902);
    			option0.__value = "red";
    			option0.value = option0.__value;
    			add_location(option0, file$1, 59, 4, 1045);
    			option1.__value = "green";
    			option1.value = option1.__value;
    			add_location(option1, file$1, 60, 4, 1082);
    			option2.__value = "blue";
    			option2.value = option2.__value;
    			add_location(option2, file$1, 61, 4, 1123);
    			if (/*faveColor*/ ctx[3] === void 0) add_render_callback(() => /*select_change_handler*/ ctx[14].call(select));
    			add_location(select, file$1, 58, 2, 1009);
    			attr_dev(input5, "type", "text");
    			attr_dev(input5, "id", "username");
    			add_location(input5, file$1, 66, 2, 1248);
    			add_location(button, file$1, 67, 2, 1310);

    			dispose = [
    				listen_dev(input0, "input", input0_input_handler),
    				listen_dev(input1, "change", /*input1_change_handler*/ ctx[9]),
    				listen_dev(input2, "change", /*input2_change_handler*/ ctx[10]),
    				listen_dev(input3, "change", /*input3_change_handler*/ ctx[12]),
    				listen_dev(input4, "change", /*input4_change_handler*/ ctx[13]),
    				listen_dev(select, "change", /*select_change_handler*/ ctx[14]),
    				listen_dev(button, "click", /*saveData*/ ctx[5], false, false, false)
    			];
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(custominput, target, anchor);
    			insert_dev(target, t0, anchor);
    			insert_dev(target, input0, anchor);
    			set_input_value(input0, /*price*/ ctx[1]);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, label0, anchor);
    			append_dev(label0, input1);
    			input1.checked = /*agreed*/ ctx[2];
    			append_dev(label0, t2);
    			insert_dev(target, t3, anchor);
    			insert_dev(target, label1, anchor);
    			append_dev(label1, input2);
    			input2.checked = input2.__value === /*faveColor*/ ctx[3];
    			append_dev(label1, t4);
    			insert_dev(target, t5, anchor);
    			insert_dev(target, label2, anchor);
    			append_dev(label2, input3);
    			input3.checked = input3.__value === /*faveColor*/ ctx[3];
    			append_dev(label2, t6);
    			insert_dev(target, t7, anchor);
    			insert_dev(target, label3, anchor);
    			append_dev(label3, input4);
    			input4.checked = input4.__value === /*faveColor*/ ctx[3];
    			append_dev(label3, t8);
    			insert_dev(target, t9, anchor);
    			insert_dev(target, select, anchor);
    			append_dev(select, option0);
    			append_dev(select, option1);
    			append_dev(select, option2);
    			select_option(select, /*faveColor*/ ctx[3]);
    			insert_dev(target, t13, anchor);
    			insert_dev(target, input5, anchor);
    			/*input5_binding*/ ctx[15](input5);
    			insert_dev(target, t14, anchor);
    			insert_dev(target, button, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const custominput_changes = {};

    			if (!updating_val && dirty[0] & /*val*/ 1) {
    				updating_val = true;
    				custominput_changes.val = /*val*/ ctx[0];
    				add_flush_callback(() => updating_val = false);
    			}

    			custominput.$set(custominput_changes);

    			if (!input0_updating && dirty[0] & /*price*/ 2) {
    				set_input_value(input0, /*price*/ ctx[1]);
    			}

    			input0_updating = false;

    			if (dirty[0] & /*agreed*/ 4) {
    				input1.checked = /*agreed*/ ctx[2];
    			}

    			if (dirty[0] & /*faveColor*/ 8) {
    				input2.checked = input2.__value === /*faveColor*/ ctx[3];
    			}

    			if (dirty[0] & /*faveColor*/ 8) {
    				input3.checked = input3.__value === /*faveColor*/ ctx[3];
    			}

    			if (dirty[0] & /*faveColor*/ 8) {
    				input4.checked = input4.__value === /*faveColor*/ ctx[3];
    			}

    			if (dirty[0] & /*faveColor*/ 8) {
    				select_option(select, /*faveColor*/ ctx[3]);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(custominput.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(custominput.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(custominput, detaching);
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(input0);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(label0);
    			if (detaching) detach_dev(t3);
    			if (detaching) detach_dev(label1);
    			/*$$binding_groups*/ ctx[11][0].splice(/*$$binding_groups*/ ctx[11][0].indexOf(input2), 1);
    			if (detaching) detach_dev(t5);
    			if (detaching) detach_dev(label2);
    			/*$$binding_groups*/ ctx[11][0].splice(/*$$binding_groups*/ ctx[11][0].indexOf(input3), 1);
    			if (detaching) detach_dev(t7);
    			if (detaching) detach_dev(label3);
    			/*$$binding_groups*/ ctx[11][0].splice(/*$$binding_groups*/ ctx[11][0].indexOf(input4), 1);
    			if (detaching) detach_dev(t9);
    			if (detaching) detach_dev(select);
    			if (detaching) detach_dev(t13);
    			if (detaching) detach_dev(input5);
    			/*input5_binding*/ ctx[15](null);
    			if (detaching) detach_dev(t14);
    			if (detaching) detach_dev(button);
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
    	let val = "";
    	let price = 0;
    	let agreed;
    	let faveColor;
    	let usernameInput;

    	function setValue(event) {
    		$$invalidate(0, val = event.target.value);
    	}

    	function saveData() {
    		console.log(usernameInput.value);
    	}

    	const $$binding_groups = [[]];

    	function custominput_val_binding(value) {
    		val = value;
    		$$invalidate(0, val);
    	}

    	function input0_input_handler() {
    		price = to_number(this.value);
    		$$invalidate(1, price);
    	}

    	function input1_change_handler() {
    		agreed = this.checked;
    		$$invalidate(2, agreed);
    	}

    	function input2_change_handler() {
    		faveColor = this.__value;
    		$$invalidate(3, faveColor);
    	}

    	function input3_change_handler() {
    		faveColor = this.__value;
    		$$invalidate(3, faveColor);
    	}

    	function input4_change_handler() {
    		faveColor = this.__value;
    		$$invalidate(3, faveColor);
    	}

    	function select_change_handler() {
    		faveColor = select_value(this);
    		$$invalidate(3, faveColor);
    	}

    	function input5_binding($$value) {
    		binding_callbacks[$$value ? "unshift" : "push"](() => {
    			$$invalidate(4, usernameInput = $$value);
    		});
    	}

    	$$self.$capture_state = () => {
    		return {};
    	};

    	$$self.$inject_state = $$props => {
    		if ("val" in $$props) $$invalidate(0, val = $$props.val);
    		if ("price" in $$props) $$invalidate(1, price = $$props.price);
    		if ("agreed" in $$props) $$invalidate(2, agreed = $$props.agreed);
    		if ("faveColor" in $$props) $$invalidate(3, faveColor = $$props.faveColor);
    		if ("usernameInput" in $$props) $$invalidate(4, usernameInput = $$props.usernameInput);
    	};

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty[0] & /*val*/ 1) {
    			 console.log(val);
    		}

    		if ($$self.$$.dirty[0] & /*price*/ 2) {
    			 console.log(price);
    		}

    		if ($$self.$$.dirty[0] & /*agreed*/ 4) {
    			 console.log(agreed);
    		}

    		if ($$self.$$.dirty[0] & /*faveColor*/ 8) {
    			 console.log(faveColor);
    		}
    	};

    	return [
    		val,
    		price,
    		agreed,
    		faveColor,
    		usernameInput,
    		saveData,
    		setValue,
    		custominput_val_binding,
    		input0_input_handler,
    		input1_change_handler,
    		input2_change_handler,
    		$$binding_groups,
    		input3_change_handler,
    		input4_change_handler,
    		select_change_handler,
    		input5_binding
    	];
    }

    class App extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$1, create_fragment$1, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "App",
    			options,
    			id: create_fragment$1.name
    		});
    	}
    }

    const app = new App({
      target: document.body
    });

    return app;

}());
//# sourceMappingURL=bundle.js.map
