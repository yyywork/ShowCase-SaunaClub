
(function(l, r) { if (!l || l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (self.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(self.document);
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
    let src_url_equal_anchor;
    function src_url_equal(element_src, url) {
        if (!src_url_equal_anchor) {
            src_url_equal_anchor = document.createElement('a');
        }
        src_url_equal_anchor.href = url;
        return element_src === src_url_equal_anchor.href;
    }
    function is_empty(obj) {
        return Object.keys(obj).length === 0;
    }
    function validate_store(store, name) {
        if (store != null && typeof store.subscribe !== 'function') {
            throw new Error(`'${name}' is not a store with a 'subscribe' method`);
        }
    }
    function subscribe(store, ...callbacks) {
        if (store == null) {
            return noop;
        }
        const unsub = store.subscribe(...callbacks);
        return unsub.unsubscribe ? () => unsub.unsubscribe() : unsub;
    }
    function component_subscribe(component, store, callback) {
        component.$$.on_destroy.push(subscribe(store, callback));
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
            if ($$scope.dirty === undefined) {
                return lets;
            }
            if (typeof lets === 'object') {
                const merged = [];
                const len = Math.max($$scope.dirty.length, lets.length);
                for (let i = 0; i < len; i += 1) {
                    merged[i] = $$scope.dirty[i] | lets[i];
                }
                return merged;
            }
            return $$scope.dirty | lets;
        }
        return $$scope.dirty;
    }
    function update_slot_base(slot, slot_definition, ctx, $$scope, slot_changes, get_slot_context_fn) {
        if (slot_changes) {
            const slot_context = get_slot_context(slot_definition, ctx, $$scope, get_slot_context_fn);
            slot.p(slot_context, slot_changes);
        }
    }
    function get_all_dirty_from_scope($$scope) {
        if ($$scope.ctx.length > 32) {
            const dirty = [];
            const length = $$scope.ctx.length / 32;
            for (let i = 0; i < length; i++) {
                dirty[i] = -1;
            }
            return dirty;
        }
        return -1;
    }
    function exclude_internal_props(props) {
        const result = {};
        for (const k in props)
            if (k[0] !== '$')
                result[k] = props[k];
        return result;
    }
    function compute_rest_props(props, keys) {
        const rest = {};
        keys = new Set(keys);
        for (const k in props)
            if (!keys.has(k) && k[0] !== '$')
                rest[k] = props[k];
        return rest;
    }
    function compute_slots(slots) {
        const result = {};
        for (const key in slots) {
            result[key] = true;
        }
        return result;
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
    function svg_element(name) {
        return document.createElementNS('http://www.w3.org/2000/svg', name);
    }
    function text(data) {
        return document.createTextNode(data);
    }
    function space() {
        return text(' ');
    }
    function empty() {
        return text('');
    }
    function listen(node, event, handler, options) {
        node.addEventListener(event, handler, options);
        return () => node.removeEventListener(event, handler, options);
    }
    function prevent_default(fn) {
        return function (event) {
            event.preventDefault();
            // @ts-ignore
            return fn.call(this, event);
        };
    }
    function stop_propagation(fn) {
        return function (event) {
            event.stopPropagation();
            // @ts-ignore
            return fn.call(this, event);
        };
    }
    function attr(node, attribute, value) {
        if (value == null)
            node.removeAttribute(attribute);
        else if (node.getAttribute(attribute) !== value)
            node.setAttribute(attribute, value);
    }
    function set_attributes(node, attributes) {
        // @ts-ignore
        const descriptors = Object.getOwnPropertyDescriptors(node.__proto__);
        for (const key in attributes) {
            if (attributes[key] == null) {
                node.removeAttribute(key);
            }
            else if (key === 'style') {
                node.style.cssText = attributes[key];
            }
            else if (key === '__value') {
                node.value = node[key] = attributes[key];
            }
            else if (descriptors[key] && descriptors[key].set) {
                node[key] = attributes[key];
            }
            else {
                attr(node, key, attributes[key]);
            }
        }
    }
    function set_svg_attributes(node, attributes) {
        for (const key in attributes) {
            attr(node, key, attributes[key]);
        }
    }
    function children(element) {
        return Array.from(element.childNodes);
    }
    function set_style(node, key, value, important) {
        node.style.setProperty(key, value, important ? 'important' : '');
    }
    function toggle_class(element, name, toggle) {
        element.classList[toggle ? 'add' : 'remove'](name);
    }
    function custom_event(type, detail, bubbles = false) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, bubbles, false, detail);
        return e;
    }

    let current_component;
    function set_current_component(component) {
        current_component = component;
    }
    function get_current_component() {
        if (!current_component)
            throw new Error('Function called outside component initialization');
        return current_component;
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
    function setContext(key, context) {
        get_current_component().$$.context.set(key, context);
    }
    function getContext(key) {
        return get_current_component().$$.context.get(key);
    }
    // TODO figure out if we still want to support
    // shorthand events, or if we want to implement
    // a real bubbling mechanism
    function bubble(component, event) {
        const callbacks = component.$$.callbacks[event.type];
        if (callbacks) {
            // @ts-ignore
            callbacks.slice().forEach(fn => fn.call(this, event));
        }
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
    function add_flush_callback(fn) {
        flush_callbacks.push(fn);
    }
    let flushing = false;
    const seen_callbacks = new Set();
    function flush() {
        if (flushing)
            return;
        flushing = true;
        do {
            // first, call beforeUpdate functions
            // and update components
            for (let i = 0; i < dirty_components.length; i += 1) {
                const component = dirty_components[i];
                set_current_component(component);
                update(component.$$);
            }
            set_current_component(null);
            dirty_components.length = 0;
            while (binding_callbacks.length)
                binding_callbacks.pop()();
            // then, once components are updated, call
            // afterUpdate functions. This may cause
            // subsequent updates...
            for (let i = 0; i < render_callbacks.length; i += 1) {
                const callback = render_callbacks[i];
                if (!seen_callbacks.has(callback)) {
                    // ...so guard against infinite loops
                    seen_callbacks.add(callback);
                    callback();
                }
            }
            render_callbacks.length = 0;
        } while (dirty_components.length);
        while (flush_callbacks.length) {
            flush_callbacks.pop()();
        }
        update_scheduled = false;
        flushing = false;
        seen_callbacks.clear();
    }
    function update($$) {
        if ($$.fragment !== null) {
            $$.update();
            run_all($$.before_update);
            const dirty = $$.dirty;
            $$.dirty = [-1];
            $$.fragment && $$.fragment.p($$.ctx, dirty);
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
    function mount_component(component, target, anchor, customElement) {
        const { fragment, on_mount, on_destroy, after_update } = component.$$;
        fragment && fragment.m(target, anchor);
        if (!customElement) {
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
        }
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
    function init(component, options, instance, create_fragment, not_equal, props, append_styles, dirty = [-1]) {
        const parent_component = current_component;
        set_current_component(component);
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
            on_disconnect: [],
            before_update: [],
            after_update: [],
            context: new Map(parent_component ? parent_component.$$.context : options.context || []),
            // everything else
            callbacks: blank_object(),
            dirty,
            skip_bound: false,
            root: options.target || parent_component.$$.root
        };
        append_styles && append_styles($$.root);
        let ready = false;
        $$.ctx = instance
            ? instance(component, options.props || {}, (i, ret, ...rest) => {
                const value = rest.length ? rest[0] : ret;
                if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
                    if (!$$.skip_bound && $$.bound[i])
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
                const nodes = children(options.target);
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.l(nodes);
                nodes.forEach(detach);
            }
            else {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.c();
            }
            if (options.intro)
                transition_in(component.$$.fragment);
            mount_component(component, options.target, options.anchor, options.customElement);
            flush();
        }
        set_current_component(parent_component);
    }
    /**
     * Base class for Svelte components. Used when dev=false.
     */
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
        $set($$props) {
            if (this.$$set && !is_empty($$props)) {
                this.$$.skip_bound = true;
                this.$$set($$props);
                this.$$.skip_bound = false;
            }
        }
    }

    function dispatch_dev(type, detail) {
        document.dispatchEvent(custom_event(type, Object.assign({ version: '3.42.4' }, detail), true));
    }
    function append_dev(target, node) {
        dispatch_dev('SvelteDOMInsert', { target, node });
        append(target, node);
    }
    function insert_dev(target, node, anchor) {
        dispatch_dev('SvelteDOMInsert', { target, node, anchor });
        insert(target, node, anchor);
    }
    function detach_dev(node) {
        dispatch_dev('SvelteDOMRemove', { node });
        detach(node);
    }
    function listen_dev(node, event, handler, options, has_prevent_default, has_stop_propagation) {
        const modifiers = options === true ? ['capture'] : options ? Array.from(Object.keys(options)) : [];
        if (has_prevent_default)
            modifiers.push('preventDefault');
        if (has_stop_propagation)
            modifiers.push('stopPropagation');
        dispatch_dev('SvelteDOMAddEventListener', { node, event, handler, modifiers });
        const dispose = listen(node, event, handler, options);
        return () => {
            dispatch_dev('SvelteDOMRemoveEventListener', { node, event, handler, modifiers });
            dispose();
        };
    }
    function attr_dev(node, attribute, value) {
        attr(node, attribute, value);
        if (value == null)
            dispatch_dev('SvelteDOMRemoveAttribute', { node, attribute });
        else
            dispatch_dev('SvelteDOMSetAttribute', { node, attribute, value });
    }
    function prop_dev(node, property, value) {
        node[property] = value;
        dispatch_dev('SvelteDOMSetProperty', { node, property, value });
    }
    function set_data_dev(text, data) {
        data = '' + data;
        if (text.wholeText === data)
            return;
        dispatch_dev('SvelteDOMSetData', { node: text, data });
        text.data = data;
    }
    function validate_each_argument(arg) {
        if (typeof arg !== 'string' && !(arg && typeof arg === 'object' && 'length' in arg)) {
            let msg = '{#each} only iterates over array-like objects.';
            if (typeof Symbol === 'function' && arg && Symbol.iterator in arg) {
                msg += ' You can use a spread to convert this iterable into an array.';
            }
            throw new Error(msg);
        }
    }
    function validate_slots(name, slot, keys) {
        for (const slot_key of Object.keys(slot)) {
            if (!~keys.indexOf(slot_key)) {
                console.warn(`<${name}> received an unexpected slot "${slot_key}".`);
            }
        }
    }
    /**
     * Base class for Svelte components with some minor dev-enhancements. Used when dev=true.
     */
    class SvelteComponentDev extends SvelteComponent {
        constructor(options) {
            if (!options || (!options.target && !options.$$inline)) {
                throw new Error("'target' is a required option");
            }
            super();
        }
        $destroy() {
            super.$destroy();
            this.$destroy = () => {
                console.warn('Component was already destroyed'); // eslint-disable-line no-console
            };
        }
        $capture_state() { }
        $inject_state() { }
    }

    /* node_modules\carbon-icons-svelte\lib\Close20\Close20.svelte generated by Svelte v3.42.4 */

    const file$x = "node_modules\\carbon-icons-svelte\\lib\\Close20\\Close20.svelte";

    // (40:4) {#if title}
    function create_if_block$m(ctx) {
    	let title_1;
    	let t;

    	const block = {
    		c: function create() {
    			title_1 = svg_element("title");
    			t = text(/*title*/ ctx[2]);
    			add_location(title_1, file$x, 40, 6, 1148);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, title_1, anchor);
    			append_dev(title_1, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*title*/ 4) set_data_dev(t, /*title*/ ctx[2]);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(title_1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$m.name,
    		type: "if",
    		source: "(40:4) {#if title}",
    		ctx
    	});

    	return block;
    }

    // (39:8)      
    function fallback_block$d(ctx) {
    	let if_block_anchor;
    	let if_block = /*title*/ ctx[2] && create_if_block$m(ctx);

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (/*title*/ ctx[2]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block$m(ctx);
    					if_block.c();
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}
    		},
    		d: function destroy(detaching) {
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: fallback_block$d.name,
    		type: "fallback",
    		source: "(39:8)      ",
    		ctx
    	});

    	return block;
    }

    function create_fragment$x(ctx) {
    	let svg;
    	let path;
    	let current;
    	let mounted;
    	let dispose;
    	const default_slot_template = /*#slots*/ ctx[11].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[10], null);
    	const default_slot_or_fallback = default_slot || fallback_block$d(ctx);

    	let svg_levels = [
    		{ "data-carbon-icon": "Close20" },
    		{ xmlns: "http://www.w3.org/2000/svg" },
    		{ viewBox: "0 0 32 32" },
    		{ fill: "currentColor" },
    		{ width: "20" },
    		{ height: "20" },
    		{ class: /*className*/ ctx[0] },
    		{ preserveAspectRatio: "xMidYMid meet" },
    		{ style: /*style*/ ctx[3] },
    		{ id: /*id*/ ctx[1] },
    		/*attributes*/ ctx[4]
    	];

    	let svg_data = {};

    	for (let i = 0; i < svg_levels.length; i += 1) {
    		svg_data = assign(svg_data, svg_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			svg = svg_element("svg");
    			path = svg_element("path");
    			if (default_slot_or_fallback) default_slot_or_fallback.c();
    			attr_dev(path, "d", "M24 9.4L22.6 8 16 14.6 9.4 8 8 9.4 14.6 16 8 22.6 9.4 24 16 17.4 22.6 24 24 22.6 17.4 16 24 9.4z");
    			add_location(path, file$x, 37, 2, 1002);
    			set_svg_attributes(svg, svg_data);
    			add_location(svg, file$x, 23, 0, 690);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, svg, anchor);
    			append_dev(svg, path);

    			if (default_slot_or_fallback) {
    				default_slot_or_fallback.m(svg, null);
    			}

    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(svg, "click", /*click_handler*/ ctx[12], false, false, false),
    					listen_dev(svg, "mouseover", /*mouseover_handler*/ ctx[13], false, false, false),
    					listen_dev(svg, "mouseenter", /*mouseenter_handler*/ ctx[14], false, false, false),
    					listen_dev(svg, "mouseleave", /*mouseleave_handler*/ ctx[15], false, false, false),
    					listen_dev(svg, "keyup", /*keyup_handler*/ ctx[16], false, false, false),
    					listen_dev(svg, "keydown", /*keydown_handler*/ ctx[17], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 1024)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[10],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[10])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[10], dirty, null),
    						null
    					);
    				}
    			} else {
    				if (default_slot_or_fallback && default_slot_or_fallback.p && (!current || dirty & /*title*/ 4)) {
    					default_slot_or_fallback.p(ctx, !current ? -1 : dirty);
    				}
    			}

    			set_svg_attributes(svg, svg_data = get_spread_update(svg_levels, [
    				{ "data-carbon-icon": "Close20" },
    				{ xmlns: "http://www.w3.org/2000/svg" },
    				{ viewBox: "0 0 32 32" },
    				{ fill: "currentColor" },
    				{ width: "20" },
    				{ height: "20" },
    				(!current || dirty & /*className*/ 1) && { class: /*className*/ ctx[0] },
    				{ preserveAspectRatio: "xMidYMid meet" },
    				(!current || dirty & /*style*/ 8) && { style: /*style*/ ctx[3] },
    				(!current || dirty & /*id*/ 2) && { id: /*id*/ ctx[1] },
    				dirty & /*attributes*/ 16 && /*attributes*/ ctx[4]
    			]));
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot_or_fallback, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot_or_fallback, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(svg);
    			if (default_slot_or_fallback) default_slot_or_fallback.d(detaching);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$x.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$x($$self, $$props, $$invalidate) {
    	let ariaLabel;
    	let ariaLabelledBy;
    	let labelled;
    	let attributes;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Close20', slots, ['default']);
    	let { class: className = undefined } = $$props;
    	let { id = undefined } = $$props;
    	let { tabindex = undefined } = $$props;
    	let { focusable = false } = $$props;
    	let { title = undefined } = $$props;
    	let { style = undefined } = $$props;

    	function click_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function mouseover_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function mouseenter_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function mouseleave_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function keyup_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function keydown_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	$$self.$$set = $$new_props => {
    		$$invalidate(18, $$props = assign(assign({}, $$props), exclude_internal_props($$new_props)));
    		if ('class' in $$new_props) $$invalidate(0, className = $$new_props.class);
    		if ('id' in $$new_props) $$invalidate(1, id = $$new_props.id);
    		if ('tabindex' in $$new_props) $$invalidate(5, tabindex = $$new_props.tabindex);
    		if ('focusable' in $$new_props) $$invalidate(6, focusable = $$new_props.focusable);
    		if ('title' in $$new_props) $$invalidate(2, title = $$new_props.title);
    		if ('style' in $$new_props) $$invalidate(3, style = $$new_props.style);
    		if ('$$scope' in $$new_props) $$invalidate(10, $$scope = $$new_props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		className,
    		id,
    		tabindex,
    		focusable,
    		title,
    		style,
    		labelled,
    		ariaLabelledBy,
    		ariaLabel,
    		attributes
    	});

    	$$self.$inject_state = $$new_props => {
    		$$invalidate(18, $$props = assign(assign({}, $$props), $$new_props));
    		if ('className' in $$props) $$invalidate(0, className = $$new_props.className);
    		if ('id' in $$props) $$invalidate(1, id = $$new_props.id);
    		if ('tabindex' in $$props) $$invalidate(5, tabindex = $$new_props.tabindex);
    		if ('focusable' in $$props) $$invalidate(6, focusable = $$new_props.focusable);
    		if ('title' in $$props) $$invalidate(2, title = $$new_props.title);
    		if ('style' in $$props) $$invalidate(3, style = $$new_props.style);
    		if ('labelled' in $$props) $$invalidate(7, labelled = $$new_props.labelled);
    		if ('ariaLabelledBy' in $$props) $$invalidate(8, ariaLabelledBy = $$new_props.ariaLabelledBy);
    		if ('ariaLabel' in $$props) $$invalidate(9, ariaLabel = $$new_props.ariaLabel);
    		if ('attributes' in $$props) $$invalidate(4, attributes = $$new_props.attributes);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		$$invalidate(9, ariaLabel = $$props['aria-label']);
    		$$invalidate(8, ariaLabelledBy = $$props['aria-labelledby']);

    		if ($$self.$$.dirty & /*ariaLabel, ariaLabelledBy, title*/ 772) {
    			$$invalidate(7, labelled = ariaLabel || ariaLabelledBy || title);
    		}

    		if ($$self.$$.dirty & /*ariaLabel, ariaLabelledBy, labelled, tabindex, focusable*/ 992) {
    			$$invalidate(4, attributes = {
    				'aria-label': ariaLabel,
    				'aria-labelledby': ariaLabelledBy,
    				'aria-hidden': labelled ? undefined : true,
    				role: labelled ? 'img' : undefined,
    				focusable: tabindex === '0' ? true : focusable,
    				tabindex
    			});
    		}
    	};

    	$$props = exclude_internal_props($$props);

    	return [
    		className,
    		id,
    		title,
    		style,
    		attributes,
    		tabindex,
    		focusable,
    		labelled,
    		ariaLabelledBy,
    		ariaLabel,
    		$$scope,
    		slots,
    		click_handler,
    		mouseover_handler,
    		mouseenter_handler,
    		mouseleave_handler,
    		keyup_handler,
    		keydown_handler
    	];
    }

    class Close20 extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$x, create_fragment$x, safe_not_equal, {
    			class: 0,
    			id: 1,
    			tabindex: 5,
    			focusable: 6,
    			title: 2,
    			style: 3
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Close20",
    			options,
    			id: create_fragment$x.name
    		});
    	}

    	get class() {
    		throw new Error("<Close20>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set class(value) {
    		throw new Error("<Close20>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get id() {
    		throw new Error("<Close20>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set id(value) {
    		throw new Error("<Close20>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get tabindex() {
    		throw new Error("<Close20>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set tabindex(value) {
    		throw new Error("<Close20>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get focusable() {
    		throw new Error("<Close20>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set focusable(value) {
    		throw new Error("<Close20>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get title() {
    		throw new Error("<Close20>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set title(value) {
    		throw new Error("<Close20>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get style() {
    		throw new Error("<Close20>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set style(value) {
    		throw new Error("<Close20>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    var Close20$1 = Close20;

    /* node_modules\carbon-icons-svelte\lib\Menu20\Menu20.svelte generated by Svelte v3.42.4 */

    const file$w = "node_modules\\carbon-icons-svelte\\lib\\Menu20\\Menu20.svelte";

    // (40:4) {#if title}
    function create_if_block$l(ctx) {
    	let title_1;
    	let t;

    	const block = {
    		c: function create() {
    			title_1 = svg_element("title");
    			t = text(/*title*/ ctx[2]);
    			add_location(title_1, file$w, 40, 6, 1143);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, title_1, anchor);
    			append_dev(title_1, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*title*/ 4) set_data_dev(t, /*title*/ ctx[2]);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(title_1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$l.name,
    		type: "if",
    		source: "(40:4) {#if title}",
    		ctx
    	});

    	return block;
    }

    // (39:8)      
    function fallback_block$c(ctx) {
    	let if_block_anchor;
    	let if_block = /*title*/ ctx[2] && create_if_block$l(ctx);

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (/*title*/ ctx[2]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block$l(ctx);
    					if_block.c();
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}
    		},
    		d: function destroy(detaching) {
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: fallback_block$c.name,
    		type: "fallback",
    		source: "(39:8)      ",
    		ctx
    	});

    	return block;
    }

    function create_fragment$w(ctx) {
    	let svg;
    	let path;
    	let current;
    	let mounted;
    	let dispose;
    	const default_slot_template = /*#slots*/ ctx[11].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[10], null);
    	const default_slot_or_fallback = default_slot || fallback_block$c(ctx);

    	let svg_levels = [
    		{ "data-carbon-icon": "Menu20" },
    		{ xmlns: "http://www.w3.org/2000/svg" },
    		{ viewBox: "0 0 20 20" },
    		{ fill: "currentColor" },
    		{ width: "20" },
    		{ height: "20" },
    		{ class: /*className*/ ctx[0] },
    		{ preserveAspectRatio: "xMidYMid meet" },
    		{ style: /*style*/ ctx[3] },
    		{ id: /*id*/ ctx[1] },
    		/*attributes*/ ctx[4]
    	];

    	let svg_data = {};

    	for (let i = 0; i < svg_levels.length; i += 1) {
    		svg_data = assign(svg_data, svg_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			svg = svg_element("svg");
    			path = svg_element("path");
    			if (default_slot_or_fallback) default_slot_or_fallback.c();
    			attr_dev(path, "d", "M2 14.8H18V16H2zM2 11.2H18V12.399999999999999H2zM2 7.6H18V8.799999999999999H2zM2 4H18V5.2H2z");
    			add_location(path, file$w, 37, 2, 1001);
    			set_svg_attributes(svg, svg_data);
    			add_location(svg, file$w, 23, 0, 690);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, svg, anchor);
    			append_dev(svg, path);

    			if (default_slot_or_fallback) {
    				default_slot_or_fallback.m(svg, null);
    			}

    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(svg, "click", /*click_handler*/ ctx[12], false, false, false),
    					listen_dev(svg, "mouseover", /*mouseover_handler*/ ctx[13], false, false, false),
    					listen_dev(svg, "mouseenter", /*mouseenter_handler*/ ctx[14], false, false, false),
    					listen_dev(svg, "mouseleave", /*mouseleave_handler*/ ctx[15], false, false, false),
    					listen_dev(svg, "keyup", /*keyup_handler*/ ctx[16], false, false, false),
    					listen_dev(svg, "keydown", /*keydown_handler*/ ctx[17], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 1024)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[10],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[10])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[10], dirty, null),
    						null
    					);
    				}
    			} else {
    				if (default_slot_or_fallback && default_slot_or_fallback.p && (!current || dirty & /*title*/ 4)) {
    					default_slot_or_fallback.p(ctx, !current ? -1 : dirty);
    				}
    			}

    			set_svg_attributes(svg, svg_data = get_spread_update(svg_levels, [
    				{ "data-carbon-icon": "Menu20" },
    				{ xmlns: "http://www.w3.org/2000/svg" },
    				{ viewBox: "0 0 20 20" },
    				{ fill: "currentColor" },
    				{ width: "20" },
    				{ height: "20" },
    				(!current || dirty & /*className*/ 1) && { class: /*className*/ ctx[0] },
    				{ preserveAspectRatio: "xMidYMid meet" },
    				(!current || dirty & /*style*/ 8) && { style: /*style*/ ctx[3] },
    				(!current || dirty & /*id*/ 2) && { id: /*id*/ ctx[1] },
    				dirty & /*attributes*/ 16 && /*attributes*/ ctx[4]
    			]));
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot_or_fallback, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot_or_fallback, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(svg);
    			if (default_slot_or_fallback) default_slot_or_fallback.d(detaching);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$w.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$w($$self, $$props, $$invalidate) {
    	let ariaLabel;
    	let ariaLabelledBy;
    	let labelled;
    	let attributes;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Menu20', slots, ['default']);
    	let { class: className = undefined } = $$props;
    	let { id = undefined } = $$props;
    	let { tabindex = undefined } = $$props;
    	let { focusable = false } = $$props;
    	let { title = undefined } = $$props;
    	let { style = undefined } = $$props;

    	function click_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function mouseover_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function mouseenter_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function mouseleave_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function keyup_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function keydown_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	$$self.$$set = $$new_props => {
    		$$invalidate(18, $$props = assign(assign({}, $$props), exclude_internal_props($$new_props)));
    		if ('class' in $$new_props) $$invalidate(0, className = $$new_props.class);
    		if ('id' in $$new_props) $$invalidate(1, id = $$new_props.id);
    		if ('tabindex' in $$new_props) $$invalidate(5, tabindex = $$new_props.tabindex);
    		if ('focusable' in $$new_props) $$invalidate(6, focusable = $$new_props.focusable);
    		if ('title' in $$new_props) $$invalidate(2, title = $$new_props.title);
    		if ('style' in $$new_props) $$invalidate(3, style = $$new_props.style);
    		if ('$$scope' in $$new_props) $$invalidate(10, $$scope = $$new_props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		className,
    		id,
    		tabindex,
    		focusable,
    		title,
    		style,
    		labelled,
    		ariaLabelledBy,
    		ariaLabel,
    		attributes
    	});

    	$$self.$inject_state = $$new_props => {
    		$$invalidate(18, $$props = assign(assign({}, $$props), $$new_props));
    		if ('className' in $$props) $$invalidate(0, className = $$new_props.className);
    		if ('id' in $$props) $$invalidate(1, id = $$new_props.id);
    		if ('tabindex' in $$props) $$invalidate(5, tabindex = $$new_props.tabindex);
    		if ('focusable' in $$props) $$invalidate(6, focusable = $$new_props.focusable);
    		if ('title' in $$props) $$invalidate(2, title = $$new_props.title);
    		if ('style' in $$props) $$invalidate(3, style = $$new_props.style);
    		if ('labelled' in $$props) $$invalidate(7, labelled = $$new_props.labelled);
    		if ('ariaLabelledBy' in $$props) $$invalidate(8, ariaLabelledBy = $$new_props.ariaLabelledBy);
    		if ('ariaLabel' in $$props) $$invalidate(9, ariaLabel = $$new_props.ariaLabel);
    		if ('attributes' in $$props) $$invalidate(4, attributes = $$new_props.attributes);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		$$invalidate(9, ariaLabel = $$props['aria-label']);
    		$$invalidate(8, ariaLabelledBy = $$props['aria-labelledby']);

    		if ($$self.$$.dirty & /*ariaLabel, ariaLabelledBy, title*/ 772) {
    			$$invalidate(7, labelled = ariaLabel || ariaLabelledBy || title);
    		}

    		if ($$self.$$.dirty & /*ariaLabel, ariaLabelledBy, labelled, tabindex, focusable*/ 992) {
    			$$invalidate(4, attributes = {
    				'aria-label': ariaLabel,
    				'aria-labelledby': ariaLabelledBy,
    				'aria-hidden': labelled ? undefined : true,
    				role: labelled ? 'img' : undefined,
    				focusable: tabindex === '0' ? true : focusable,
    				tabindex
    			});
    		}
    	};

    	$$props = exclude_internal_props($$props);

    	return [
    		className,
    		id,
    		title,
    		style,
    		attributes,
    		tabindex,
    		focusable,
    		labelled,
    		ariaLabelledBy,
    		ariaLabel,
    		$$scope,
    		slots,
    		click_handler,
    		mouseover_handler,
    		mouseenter_handler,
    		mouseleave_handler,
    		keyup_handler,
    		keydown_handler
    	];
    }

    class Menu20 extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$w, create_fragment$w, safe_not_equal, {
    			class: 0,
    			id: 1,
    			tabindex: 5,
    			focusable: 6,
    			title: 2,
    			style: 3
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Menu20",
    			options,
    			id: create_fragment$w.name
    		});
    	}

    	get class() {
    		throw new Error("<Menu20>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set class(value) {
    		throw new Error("<Menu20>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get id() {
    		throw new Error("<Menu20>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set id(value) {
    		throw new Error("<Menu20>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get tabindex() {
    		throw new Error("<Menu20>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set tabindex(value) {
    		throw new Error("<Menu20>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get focusable() {
    		throw new Error("<Menu20>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set focusable(value) {
    		throw new Error("<Menu20>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get title() {
    		throw new Error("<Menu20>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set title(value) {
    		throw new Error("<Menu20>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get style() {
    		throw new Error("<Menu20>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set style(value) {
    		throw new Error("<Menu20>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    var Menu20$1 = Menu20;

    const subscriber_queue = [];
    /**
     * Creates a `Readable` store that allows reading by subscription.
     * @param value initial value
     * @param {StartStopNotifier}start start and stop notifications for subscriptions
     */
    function readable(value, start) {
        return {
            subscribe: writable(value, start).subscribe
        };
    }
    /**
     * Create a `Writable` store that allows both updating and reading by subscription.
     * @param {*=}value initial value
     * @param {StartStopNotifier=}start start and stop notifications for subscriptions
     */
    function writable(value, start = noop) {
        let stop;
        const subscribers = new Set();
        function set(new_value) {
            if (safe_not_equal(value, new_value)) {
                value = new_value;
                if (stop) { // store is ready
                    const run_queue = !subscriber_queue.length;
                    for (const subscriber of subscribers) {
                        subscriber[1]();
                        subscriber_queue.push(subscriber, value);
                    }
                    if (run_queue) {
                        for (let i = 0; i < subscriber_queue.length; i += 2) {
                            subscriber_queue[i][0](subscriber_queue[i + 1]);
                        }
                        subscriber_queue.length = 0;
                    }
                }
            }
        }
        function update(fn) {
            set(fn(value));
        }
        function subscribe(run, invalidate = noop) {
            const subscriber = [run, invalidate];
            subscribers.add(subscriber);
            if (subscribers.size === 1) {
                stop = start(set) || noop;
            }
            run(value);
            return () => {
                subscribers.delete(subscriber);
                if (subscribers.size === 0) {
                    stop();
                    stop = null;
                }
            };
        }
        return { set, update, subscribe };
    }
    function derived(stores, fn, initial_value) {
        const single = !Array.isArray(stores);
        const stores_array = single
            ? [stores]
            : stores;
        const auto = fn.length < 2;
        return readable(initial_value, (set) => {
            let inited = false;
            const values = [];
            let pending = 0;
            let cleanup = noop;
            const sync = () => {
                if (pending) {
                    return;
                }
                cleanup();
                const result = fn(single ? values[0] : values, set);
                if (auto) {
                    set(result);
                }
                else {
                    cleanup = is_function(result) ? result : noop;
                }
            };
            const unsubscribers = stores_array.map((store, i) => subscribe(store, (value) => {
                values[i] = value;
                pending &= ~(1 << i);
                if (inited) {
                    sync();
                }
            }, () => {
                pending |= (1 << i);
            }));
            inited = true;
            sync();
            return function stop() {
                run_all(unsubscribers);
                cleanup();
            };
        });
    }

    const shouldRenderHamburgerMenu = writable(false);

    /* node_modules\carbon-components-svelte\src\UIShell\SideNav\HamburgerMenu.svelte generated by Svelte v3.42.4 */
    const file$v = "node_modules\\carbon-components-svelte\\src\\UIShell\\SideNav\\HamburgerMenu.svelte";

    function create_fragment$v(ctx) {
    	let button;
    	let switch_instance;
    	let current;
    	let mounted;
    	let dispose;

    	var switch_value = /*isOpen*/ ctx[0]
    	? /*iconClose*/ ctx[4]
    	: /*iconMenu*/ ctx[3];

    	function switch_props(ctx) {
    		return { $$inline: true };
    	}

    	if (switch_value) {
    		switch_instance = new switch_value(switch_props());
    	}

    	let button_levels = [
    		{ type: "button" },
    		{ title: /*ariaLabel*/ ctx[2] },
    		{ "aria-label": /*ariaLabel*/ ctx[2] },
    		/*$$restProps*/ ctx[5]
    	];

    	let button_data = {};

    	for (let i = 0; i < button_levels.length; i += 1) {
    		button_data = assign(button_data, button_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			button = element("button");
    			if (switch_instance) create_component(switch_instance.$$.fragment);
    			set_attributes(button, button_data);
    			toggle_class(button, "bx--header__action", true);
    			toggle_class(button, "bx--header__menu-trigger", true);
    			toggle_class(button, "bx--header__menu-toggle", true);
    			add_location(button, file$v, 31, 0, 859);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);

    			if (switch_instance) {
    				mount_component(switch_instance, button, null);
    			}

    			if (button.autofocus) button.focus();
    			/*button_binding*/ ctx[7](button);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(button, "click", /*click_handler*/ ctx[6], false, false, false),
    					listen_dev(button, "click", /*click_handler_1*/ ctx[8], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (switch_value !== (switch_value = /*isOpen*/ ctx[0]
    			? /*iconClose*/ ctx[4]
    			: /*iconMenu*/ ctx[3])) {
    				if (switch_instance) {
    					group_outros();
    					const old_component = switch_instance;

    					transition_out(old_component.$$.fragment, 1, 0, () => {
    						destroy_component(old_component, 1);
    					});

    					check_outros();
    				}

    				if (switch_value) {
    					switch_instance = new switch_value(switch_props());
    					create_component(switch_instance.$$.fragment);
    					transition_in(switch_instance.$$.fragment, 1);
    					mount_component(switch_instance, button, null);
    				} else {
    					switch_instance = null;
    				}
    			}

    			set_attributes(button, button_data = get_spread_update(button_levels, [
    				{ type: "button" },
    				(!current || dirty & /*ariaLabel*/ 4) && { title: /*ariaLabel*/ ctx[2] },
    				(!current || dirty & /*ariaLabel*/ 4) && { "aria-label": /*ariaLabel*/ ctx[2] },
    				dirty & /*$$restProps*/ 32 && /*$$restProps*/ ctx[5]
    			]));

    			toggle_class(button, "bx--header__action", true);
    			toggle_class(button, "bx--header__menu-trigger", true);
    			toggle_class(button, "bx--header__menu-toggle", true);
    		},
    		i: function intro(local) {
    			if (current) return;
    			if (switch_instance) transition_in(switch_instance.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			if (switch_instance) transition_out(switch_instance.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    			if (switch_instance) destroy_component(switch_instance);
    			/*button_binding*/ ctx[7](null);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$v.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$v($$self, $$props, $$invalidate) {
    	const omit_props_names = ["ariaLabel","isOpen","iconMenu","iconClose","ref"];
    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('HamburgerMenu', slots, []);
    	let { ariaLabel = undefined } = $$props;
    	let { isOpen = false } = $$props;
    	let { iconMenu = Menu20$1 } = $$props;
    	let { iconClose = Close20$1 } = $$props;
    	let { ref = null } = $$props;

    	function click_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function button_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			ref = $$value;
    			$$invalidate(1, ref);
    		});
    	}

    	const click_handler_1 = () => $$invalidate(0, isOpen = !isOpen);

    	$$self.$$set = $$new_props => {
    		$$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
    		$$invalidate(5, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ('ariaLabel' in $$new_props) $$invalidate(2, ariaLabel = $$new_props.ariaLabel);
    		if ('isOpen' in $$new_props) $$invalidate(0, isOpen = $$new_props.isOpen);
    		if ('iconMenu' in $$new_props) $$invalidate(3, iconMenu = $$new_props.iconMenu);
    		if ('iconClose' in $$new_props) $$invalidate(4, iconClose = $$new_props.iconClose);
    		if ('ref' in $$new_props) $$invalidate(1, ref = $$new_props.ref);
    	};

    	$$self.$capture_state = () => ({
    		ariaLabel,
    		isOpen,
    		iconMenu,
    		iconClose,
    		ref,
    		Close20: Close20$1,
    		Menu20: Menu20$1
    	});

    	$$self.$inject_state = $$new_props => {
    		if ('ariaLabel' in $$props) $$invalidate(2, ariaLabel = $$new_props.ariaLabel);
    		if ('isOpen' in $$props) $$invalidate(0, isOpen = $$new_props.isOpen);
    		if ('iconMenu' in $$props) $$invalidate(3, iconMenu = $$new_props.iconMenu);
    		if ('iconClose' in $$props) $$invalidate(4, iconClose = $$new_props.iconClose);
    		if ('ref' in $$props) $$invalidate(1, ref = $$new_props.ref);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		isOpen,
    		ref,
    		ariaLabel,
    		iconMenu,
    		iconClose,
    		$$restProps,
    		click_handler,
    		button_binding,
    		click_handler_1
    	];
    }

    class HamburgerMenu extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$v, create_fragment$v, safe_not_equal, {
    			ariaLabel: 2,
    			isOpen: 0,
    			iconMenu: 3,
    			iconClose: 4,
    			ref: 1
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "HamburgerMenu",
    			options,
    			id: create_fragment$v.name
    		});
    	}

    	get ariaLabel() {
    		throw new Error("<HamburgerMenu>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set ariaLabel(value) {
    		throw new Error("<HamburgerMenu>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get isOpen() {
    		throw new Error("<HamburgerMenu>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set isOpen(value) {
    		throw new Error("<HamburgerMenu>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get iconMenu() {
    		throw new Error("<HamburgerMenu>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set iconMenu(value) {
    		throw new Error("<HamburgerMenu>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get iconClose() {
    		throw new Error("<HamburgerMenu>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set iconClose(value) {
    		throw new Error("<HamburgerMenu>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get ref() {
    		throw new Error("<HamburgerMenu>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set ref(value) {
    		throw new Error("<HamburgerMenu>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    var HamburgerMenu$1 = HamburgerMenu;

    /* node_modules\carbon-components-svelte\src\UIShell\GlobalHeader\Header.svelte generated by Svelte v3.42.4 */
    const file$u = "node_modules\\carbon-components-svelte\\src\\UIShell\\GlobalHeader\\Header.svelte";
    const get_platform_slot_changes = dirty => ({});
    const get_platform_slot_context = ctx => ({});
    const get_skip_to_content_slot_changes = dirty => ({});
    const get_skip_to_content_slot_context = ctx => ({});

    // (83:2) {#if ($shouldRenderHamburgerMenu && winWidth < expansionBreakpoint) || persistentHamburgerMenu}
    function create_if_block_1$5(ctx) {
    	let hamburgermenu;
    	let updating_isOpen;
    	let current;

    	function hamburgermenu_isOpen_binding(value) {
    		/*hamburgermenu_isOpen_binding*/ ctx[19](value);
    	}

    	let hamburgermenu_props = {
    		iconClose: /*iconClose*/ ctx[8],
    		iconMenu: /*iconMenu*/ ctx[7]
    	};

    	if (/*isSideNavOpen*/ ctx[0] !== void 0) {
    		hamburgermenu_props.isOpen = /*isSideNavOpen*/ ctx[0];
    	}

    	hamburgermenu = new HamburgerMenu$1({
    			props: hamburgermenu_props,
    			$$inline: true
    		});

    	binding_callbacks.push(() => bind(hamburgermenu, 'isOpen', hamburgermenu_isOpen_binding));

    	const block = {
    		c: function create() {
    			create_component(hamburgermenu.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(hamburgermenu, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const hamburgermenu_changes = {};
    			if (dirty & /*iconClose*/ 256) hamburgermenu_changes.iconClose = /*iconClose*/ ctx[8];
    			if (dirty & /*iconMenu*/ 128) hamburgermenu_changes.iconMenu = /*iconMenu*/ ctx[7];

    			if (!updating_isOpen && dirty & /*isSideNavOpen*/ 1) {
    				updating_isOpen = true;
    				hamburgermenu_changes.isOpen = /*isSideNavOpen*/ ctx[0];
    				add_flush_callback(() => updating_isOpen = false);
    			}

    			hamburgermenu.$set(hamburgermenu_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(hamburgermenu.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(hamburgermenu.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(hamburgermenu, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$5.name,
    		type: "if",
    		source: "(83:2) {#if ($shouldRenderHamburgerMenu && winWidth < expansionBreakpoint) || persistentHamburgerMenu}",
    		ctx
    	});

    	return block;
    }

    // (97:4) {#if company}
    function create_if_block$k(ctx) {
    	let span;
    	let t0;
    	let t1;

    	const block = {
    		c: function create() {
    			span = element("span");
    			t0 = text(/*company*/ ctx[3]);
    			t1 = text(" ");
    			toggle_class(span, "bx--header__name--prefix", true);
    			add_location(span, file$u, 97, 6, 2652);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span, anchor);
    			append_dev(span, t0);
    			append_dev(span, t1);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*company*/ 8) set_data_dev(t0, /*company*/ ctx[3]);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(span);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$k.name,
    		type: "if",
    		source: "(97:4) {#if company}",
    		ctx
    	});

    	return block;
    }

    // (100:26) {platformName}
    function fallback_block$b(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text(/*platformName*/ ctx[4]);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*platformName*/ 16) set_data_dev(t, /*platformName*/ ctx[4]);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: fallback_block$b.name,
    		type: "fallback",
    		source: "(100:26) {platformName}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$u(ctx) {
    	let header;
    	let t0;
    	let t1;
    	let a;
    	let t2;
    	let t3;
    	let current;
    	let mounted;
    	let dispose;
    	add_render_callback(/*onwindowresize*/ ctx[18]);
    	const skip_to_content_slot_template = /*#slots*/ ctx[16]["skip-to-content"];
    	const skip_to_content_slot = create_slot(skip_to_content_slot_template, ctx, /*$$scope*/ ctx[15], get_skip_to_content_slot_context);
    	let if_block0 = (/*$shouldRenderHamburgerMenu*/ ctx[11] && /*winWidth*/ ctx[9] < /*expansionBreakpoint*/ ctx[6] || /*persistentHamburgerMenu*/ ctx[5]) && create_if_block_1$5(ctx);
    	let if_block1 = /*company*/ ctx[3] && create_if_block$k(ctx);
    	const platform_slot_template = /*#slots*/ ctx[16].platform;
    	const platform_slot = create_slot(platform_slot_template, ctx, /*$$scope*/ ctx[15], get_platform_slot_context);
    	const platform_slot_or_fallback = platform_slot || fallback_block$b(ctx);
    	let a_levels = [{ href: /*href*/ ctx[2] }, /*$$restProps*/ ctx[12]];
    	let a_data = {};

    	for (let i = 0; i < a_levels.length; i += 1) {
    		a_data = assign(a_data, a_levels[i]);
    	}

    	const default_slot_template = /*#slots*/ ctx[16].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[15], null);

    	const block = {
    		c: function create() {
    			header = element("header");
    			if (skip_to_content_slot) skip_to_content_slot.c();
    			t0 = space();
    			if (if_block0) if_block0.c();
    			t1 = space();
    			a = element("a");
    			if (if_block1) if_block1.c();
    			t2 = space();
    			if (platform_slot_or_fallback) platform_slot_or_fallback.c();
    			t3 = space();
    			if (default_slot) default_slot.c();
    			set_attributes(a, a_data);
    			toggle_class(a, "bx--header__name", true);
    			add_location(a, file$u, 89, 2, 2511);
    			attr_dev(header, "role", "banner");
    			attr_dev(header, "aria-label", /*ariaLabel*/ ctx[10]);
    			toggle_class(header, "bx--header", true);
    			add_location(header, file$u, 80, 0, 2175);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, header, anchor);

    			if (skip_to_content_slot) {
    				skip_to_content_slot.m(header, null);
    			}

    			append_dev(header, t0);
    			if (if_block0) if_block0.m(header, null);
    			append_dev(header, t1);
    			append_dev(header, a);
    			if (if_block1) if_block1.m(a, null);
    			append_dev(a, t2);

    			if (platform_slot_or_fallback) {
    				platform_slot_or_fallback.m(a, null);
    			}

    			/*a_binding*/ ctx[20](a);
    			append_dev(header, t3);

    			if (default_slot) {
    				default_slot.m(header, null);
    			}

    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(window, "resize", /*onwindowresize*/ ctx[18]),
    					listen_dev(a, "click", /*click_handler*/ ctx[17], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (skip_to_content_slot) {
    				if (skip_to_content_slot.p && (!current || dirty & /*$$scope*/ 32768)) {
    					update_slot_base(
    						skip_to_content_slot,
    						skip_to_content_slot_template,
    						ctx,
    						/*$$scope*/ ctx[15],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[15])
    						: get_slot_changes(skip_to_content_slot_template, /*$$scope*/ ctx[15], dirty, get_skip_to_content_slot_changes),
    						get_skip_to_content_slot_context
    					);
    				}
    			}

    			if (/*$shouldRenderHamburgerMenu*/ ctx[11] && /*winWidth*/ ctx[9] < /*expansionBreakpoint*/ ctx[6] || /*persistentHamburgerMenu*/ ctx[5]) {
    				if (if_block0) {
    					if_block0.p(ctx, dirty);

    					if (dirty & /*$shouldRenderHamburgerMenu, winWidth, expansionBreakpoint, persistentHamburgerMenu*/ 2656) {
    						transition_in(if_block0, 1);
    					}
    				} else {
    					if_block0 = create_if_block_1$5(ctx);
    					if_block0.c();
    					transition_in(if_block0, 1);
    					if_block0.m(header, t1);
    				}
    			} else if (if_block0) {
    				group_outros();

    				transition_out(if_block0, 1, 1, () => {
    					if_block0 = null;
    				});

    				check_outros();
    			}

    			if (/*company*/ ctx[3]) {
    				if (if_block1) {
    					if_block1.p(ctx, dirty);
    				} else {
    					if_block1 = create_if_block$k(ctx);
    					if_block1.c();
    					if_block1.m(a, t2);
    				}
    			} else if (if_block1) {
    				if_block1.d(1);
    				if_block1 = null;
    			}

    			if (platform_slot) {
    				if (platform_slot.p && (!current || dirty & /*$$scope*/ 32768)) {
    					update_slot_base(
    						platform_slot,
    						platform_slot_template,
    						ctx,
    						/*$$scope*/ ctx[15],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[15])
    						: get_slot_changes(platform_slot_template, /*$$scope*/ ctx[15], dirty, get_platform_slot_changes),
    						get_platform_slot_context
    					);
    				}
    			} else {
    				if (platform_slot_or_fallback && platform_slot_or_fallback.p && (!current || dirty & /*platformName*/ 16)) {
    					platform_slot_or_fallback.p(ctx, !current ? -1 : dirty);
    				}
    			}

    			set_attributes(a, a_data = get_spread_update(a_levels, [
    				(!current || dirty & /*href*/ 4) && { href: /*href*/ ctx[2] },
    				dirty & /*$$restProps*/ 4096 && /*$$restProps*/ ctx[12]
    			]));

    			toggle_class(a, "bx--header__name", true);

    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 32768)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[15],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[15])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[15], dirty, null),
    						null
    					);
    				}
    			}

    			if (!current || dirty & /*ariaLabel*/ 1024) {
    				attr_dev(header, "aria-label", /*ariaLabel*/ ctx[10]);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(skip_to_content_slot, local);
    			transition_in(if_block0);
    			transition_in(platform_slot_or_fallback, local);
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(skip_to_content_slot, local);
    			transition_out(if_block0);
    			transition_out(platform_slot_or_fallback, local);
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(header);
    			if (skip_to_content_slot) skip_to_content_slot.d(detaching);
    			if (if_block0) if_block0.d();
    			if (if_block1) if_block1.d();
    			if (platform_slot_or_fallback) platform_slot_or_fallback.d(detaching);
    			/*a_binding*/ ctx[20](null);
    			if (default_slot) default_slot.d(detaching);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$u.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$u($$self, $$props, $$invalidate) {
    	let ariaLabel;

    	const omit_props_names = [
    		"expandedByDefault","isSideNavOpen","uiShellAriaLabel","href","company","platformName","persistentHamburgerMenu","expansionBreakpoint","ref","iconMenu","iconClose"
    	];

    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let $shouldRenderHamburgerMenu;
    	validate_store(shouldRenderHamburgerMenu, 'shouldRenderHamburgerMenu');
    	component_subscribe($$self, shouldRenderHamburgerMenu, $$value => $$invalidate(11, $shouldRenderHamburgerMenu = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Header', slots, ['skip-to-content','platform','default']);
    	let { expandedByDefault = true } = $$props;
    	let { isSideNavOpen = false } = $$props;
    	let { uiShellAriaLabel = undefined } = $$props;
    	let { href = undefined } = $$props;
    	let { company = undefined } = $$props;
    	let { platformName = "" } = $$props;
    	let { persistentHamburgerMenu = false } = $$props;
    	let { expansionBreakpoint = 1056 } = $$props;
    	let { ref = null } = $$props;
    	let { iconMenu = Menu20$1 } = $$props;
    	let { iconClose = Close20$1 } = $$props;
    	let winWidth = undefined;

    	function click_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function onwindowresize() {
    		$$invalidate(9, winWidth = window.innerWidth);
    	}

    	function hamburgermenu_isOpen_binding(value) {
    		isSideNavOpen = value;
    		(((($$invalidate(0, isSideNavOpen), $$invalidate(13, expandedByDefault)), $$invalidate(9, winWidth)), $$invalidate(6, expansionBreakpoint)), $$invalidate(5, persistentHamburgerMenu));
    	}

    	function a_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			ref = $$value;
    			$$invalidate(1, ref);
    		});
    	}

    	$$self.$$set = $$new_props => {
    		$$invalidate(21, $$props = assign(assign({}, $$props), exclude_internal_props($$new_props)));
    		$$invalidate(12, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ('expandedByDefault' in $$new_props) $$invalidate(13, expandedByDefault = $$new_props.expandedByDefault);
    		if ('isSideNavOpen' in $$new_props) $$invalidate(0, isSideNavOpen = $$new_props.isSideNavOpen);
    		if ('uiShellAriaLabel' in $$new_props) $$invalidate(14, uiShellAriaLabel = $$new_props.uiShellAriaLabel);
    		if ('href' in $$new_props) $$invalidate(2, href = $$new_props.href);
    		if ('company' in $$new_props) $$invalidate(3, company = $$new_props.company);
    		if ('platformName' in $$new_props) $$invalidate(4, platformName = $$new_props.platformName);
    		if ('persistentHamburgerMenu' in $$new_props) $$invalidate(5, persistentHamburgerMenu = $$new_props.persistentHamburgerMenu);
    		if ('expansionBreakpoint' in $$new_props) $$invalidate(6, expansionBreakpoint = $$new_props.expansionBreakpoint);
    		if ('ref' in $$new_props) $$invalidate(1, ref = $$new_props.ref);
    		if ('iconMenu' in $$new_props) $$invalidate(7, iconMenu = $$new_props.iconMenu);
    		if ('iconClose' in $$new_props) $$invalidate(8, iconClose = $$new_props.iconClose);
    		if ('$$scope' in $$new_props) $$invalidate(15, $$scope = $$new_props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		expandedByDefault,
    		isSideNavOpen,
    		uiShellAriaLabel,
    		href,
    		company,
    		platformName,
    		persistentHamburgerMenu,
    		expansionBreakpoint,
    		ref,
    		iconMenu,
    		iconClose,
    		Close20: Close20$1,
    		Menu20: Menu20$1,
    		shouldRenderHamburgerMenu,
    		HamburgerMenu: HamburgerMenu$1,
    		winWidth,
    		ariaLabel,
    		$shouldRenderHamburgerMenu
    	});

    	$$self.$inject_state = $$new_props => {
    		$$invalidate(21, $$props = assign(assign({}, $$props), $$new_props));
    		if ('expandedByDefault' in $$props) $$invalidate(13, expandedByDefault = $$new_props.expandedByDefault);
    		if ('isSideNavOpen' in $$props) $$invalidate(0, isSideNavOpen = $$new_props.isSideNavOpen);
    		if ('uiShellAriaLabel' in $$props) $$invalidate(14, uiShellAriaLabel = $$new_props.uiShellAriaLabel);
    		if ('href' in $$props) $$invalidate(2, href = $$new_props.href);
    		if ('company' in $$props) $$invalidate(3, company = $$new_props.company);
    		if ('platformName' in $$props) $$invalidate(4, platformName = $$new_props.platformName);
    		if ('persistentHamburgerMenu' in $$props) $$invalidate(5, persistentHamburgerMenu = $$new_props.persistentHamburgerMenu);
    		if ('expansionBreakpoint' in $$props) $$invalidate(6, expansionBreakpoint = $$new_props.expansionBreakpoint);
    		if ('ref' in $$props) $$invalidate(1, ref = $$new_props.ref);
    		if ('iconMenu' in $$props) $$invalidate(7, iconMenu = $$new_props.iconMenu);
    		if ('iconClose' in $$props) $$invalidate(8, iconClose = $$new_props.iconClose);
    		if ('winWidth' in $$props) $$invalidate(9, winWidth = $$new_props.winWidth);
    		if ('ariaLabel' in $$props) $$invalidate(10, ariaLabel = $$new_props.ariaLabel);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*expandedByDefault, winWidth, expansionBreakpoint, persistentHamburgerMenu*/ 8800) {
    			$$invalidate(0, isSideNavOpen = expandedByDefault && winWidth >= expansionBreakpoint && !persistentHamburgerMenu);
    		}

    		$$invalidate(10, ariaLabel = company
    		? `${company} `
    		: "" + (uiShellAriaLabel || $$props["aria-label"] || platformName));
    	};

    	$$props = exclude_internal_props($$props);

    	return [
    		isSideNavOpen,
    		ref,
    		href,
    		company,
    		platformName,
    		persistentHamburgerMenu,
    		expansionBreakpoint,
    		iconMenu,
    		iconClose,
    		winWidth,
    		ariaLabel,
    		$shouldRenderHamburgerMenu,
    		$$restProps,
    		expandedByDefault,
    		uiShellAriaLabel,
    		$$scope,
    		slots,
    		click_handler,
    		onwindowresize,
    		hamburgermenu_isOpen_binding,
    		a_binding
    	];
    }

    class Header extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$u, create_fragment$u, safe_not_equal, {
    			expandedByDefault: 13,
    			isSideNavOpen: 0,
    			uiShellAriaLabel: 14,
    			href: 2,
    			company: 3,
    			platformName: 4,
    			persistentHamburgerMenu: 5,
    			expansionBreakpoint: 6,
    			ref: 1,
    			iconMenu: 7,
    			iconClose: 8
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Header",
    			options,
    			id: create_fragment$u.name
    		});
    	}

    	get expandedByDefault() {
    		throw new Error("<Header>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set expandedByDefault(value) {
    		throw new Error("<Header>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get isSideNavOpen() {
    		throw new Error("<Header>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set isSideNavOpen(value) {
    		throw new Error("<Header>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get uiShellAriaLabel() {
    		throw new Error("<Header>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set uiShellAriaLabel(value) {
    		throw new Error("<Header>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get href() {
    		throw new Error("<Header>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set href(value) {
    		throw new Error("<Header>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get company() {
    		throw new Error("<Header>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set company(value) {
    		throw new Error("<Header>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get platformName() {
    		throw new Error("<Header>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set platformName(value) {
    		throw new Error("<Header>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get persistentHamburgerMenu() {
    		throw new Error("<Header>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set persistentHamburgerMenu(value) {
    		throw new Error("<Header>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get expansionBreakpoint() {
    		throw new Error("<Header>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set expansionBreakpoint(value) {
    		throw new Error("<Header>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get ref() {
    		throw new Error("<Header>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set ref(value) {
    		throw new Error("<Header>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get iconMenu() {
    		throw new Error("<Header>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set iconMenu(value) {
    		throw new Error("<Header>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get iconClose() {
    		throw new Error("<Header>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set iconClose(value) {
    		throw new Error("<Header>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    var Header$1 = Header;

    /* node_modules\carbon-components-svelte\src\UIShell\GlobalHeader\HeaderNav.svelte generated by Svelte v3.42.4 */

    const file$t = "node_modules\\carbon-components-svelte\\src\\UIShell\\GlobalHeader\\HeaderNav.svelte";

    function create_fragment$t(ctx) {
    	let nav;
    	let ul;
    	let current;
    	const default_slot_template = /*#slots*/ ctx[4].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[3], null);
    	let ul_levels = [/*props*/ ctx[0]];
    	let ul_data = {};

    	for (let i = 0; i < ul_levels.length; i += 1) {
    		ul_data = assign(ul_data, ul_levels[i]);
    	}

    	let nav_levels = [/*props*/ ctx[0], /*$$restProps*/ ctx[1]];
    	let nav_data = {};

    	for (let i = 0; i < nav_levels.length; i += 1) {
    		nav_data = assign(nav_data, nav_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			nav = element("nav");
    			ul = element("ul");
    			if (default_slot) default_slot.c();
    			set_attributes(ul, ul_data);
    			toggle_class(ul, "bx--header__menu-bar", true);
    			add_location(ul, file$t, 15, 2, 363);
    			set_attributes(nav, nav_data);
    			toggle_class(nav, "bx--header__nav", true);
    			add_location(nav, file$t, 14, 0, 296);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, nav, anchor);
    			append_dev(nav, ul);

    			if (default_slot) {
    				default_slot.m(ul, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 8)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[3],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[3])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[3], dirty, null),
    						null
    					);
    				}
    			}

    			set_attributes(ul, ul_data = get_spread_update(ul_levels, [dirty & /*props*/ 1 && /*props*/ ctx[0]]));
    			toggle_class(ul, "bx--header__menu-bar", true);

    			set_attributes(nav, nav_data = get_spread_update(nav_levels, [
    				dirty & /*props*/ 1 && /*props*/ ctx[0],
    				dirty & /*$$restProps*/ 2 && /*$$restProps*/ ctx[1]
    			]));

    			toggle_class(nav, "bx--header__nav", true);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(nav);
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$t.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$t($$self, $$props, $$invalidate) {
    	let props;
    	const omit_props_names = ["ariaLabel"];
    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('HeaderNav', slots, ['default']);
    	let { ariaLabel = undefined } = $$props;

    	$$self.$$set = $$new_props => {
    		$$invalidate(5, $$props = assign(assign({}, $$props), exclude_internal_props($$new_props)));
    		$$invalidate(1, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ('ariaLabel' in $$new_props) $$invalidate(2, ariaLabel = $$new_props.ariaLabel);
    		if ('$$scope' in $$new_props) $$invalidate(3, $$scope = $$new_props.$$scope);
    	};

    	$$self.$capture_state = () => ({ ariaLabel, props });

    	$$self.$inject_state = $$new_props => {
    		$$invalidate(5, $$props = assign(assign({}, $$props), $$new_props));
    		if ('ariaLabel' in $$props) $$invalidate(2, ariaLabel = $$new_props.ariaLabel);
    		if ('props' in $$props) $$invalidate(0, props = $$new_props.props);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		$$invalidate(0, props = {
    			"aria-label": ariaLabel || $$props["aria-label"],
    			"aria-labelledby": $$props["aria-labelledby"]
    		});
    	};

    	$$props = exclude_internal_props($$props);
    	return [props, $$restProps, ariaLabel, $$scope, slots];
    }

    class HeaderNav extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$t, create_fragment$t, safe_not_equal, { ariaLabel: 2 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "HeaderNav",
    			options,
    			id: create_fragment$t.name
    		});
    	}

    	get ariaLabel() {
    		throw new Error("<HeaderNav>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set ariaLabel(value) {
    		throw new Error("<HeaderNav>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    var HeaderNav$1 = HeaderNav;

    /* node_modules\carbon-components-svelte\src\UIShell\GlobalHeader\HeaderNavItem.svelte generated by Svelte v3.42.4 */

    const file$s = "node_modules\\carbon-components-svelte\\src\\UIShell\\GlobalHeader\\HeaderNavItem.svelte";

    function create_fragment$s(ctx) {
    	let li;
    	let a;
    	let span;
    	let t;
    	let a_rel_value;
    	let a_aria_current_value;
    	let mounted;
    	let dispose;

    	let a_levels = [
    		{ role: "menuitem" },
    		{ tabindex: "0" },
    		{ href: /*href*/ ctx[1] },
    		{
    			rel: a_rel_value = /*$$restProps*/ ctx[4].target === '_blank'
    			? 'noopener noreferrer'
    			: undefined
    		},
    		{
    			"aria-current": a_aria_current_value = /*isSelected*/ ctx[3] ? 'page' : undefined
    		},
    		/*$$restProps*/ ctx[4]
    	];

    	let a_data = {};

    	for (let i = 0; i < a_levels.length; i += 1) {
    		a_data = assign(a_data, a_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			li = element("li");
    			a = element("a");
    			span = element("span");
    			t = text(/*text*/ ctx[2]);
    			toggle_class(span, "bx--text-truncate--end", true);
    			add_location(span, file$s, 39, 4, 769);
    			set_attributes(a, a_data);
    			toggle_class(a, "bx--header__menu-item", true);
    			add_location(a, file$s, 21, 2, 367);
    			add_location(li, file$s, 20, 0, 360);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, li, anchor);
    			append_dev(li, a);
    			append_dev(a, span);
    			append_dev(span, t);
    			/*a_binding*/ ctx[13](a);

    			if (!mounted) {
    				dispose = [
    					listen_dev(a, "click", /*click_handler*/ ctx[5], false, false, false),
    					listen_dev(a, "mouseover", /*mouseover_handler*/ ctx[6], false, false, false),
    					listen_dev(a, "mouseenter", /*mouseenter_handler*/ ctx[7], false, false, false),
    					listen_dev(a, "mouseleave", /*mouseleave_handler*/ ctx[8], false, false, false),
    					listen_dev(a, "keyup", /*keyup_handler*/ ctx[9], false, false, false),
    					listen_dev(a, "keydown", /*keydown_handler*/ ctx[10], false, false, false),
    					listen_dev(a, "focus", /*focus_handler*/ ctx[11], false, false, false),
    					listen_dev(a, "blur", /*blur_handler*/ ctx[12], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*text*/ 4) set_data_dev(t, /*text*/ ctx[2]);

    			set_attributes(a, a_data = get_spread_update(a_levels, [
    				{ role: "menuitem" },
    				{ tabindex: "0" },
    				dirty & /*href*/ 2 && { href: /*href*/ ctx[1] },
    				dirty & /*$$restProps*/ 16 && a_rel_value !== (a_rel_value = /*$$restProps*/ ctx[4].target === '_blank'
    				? 'noopener noreferrer'
    				: undefined) && { rel: a_rel_value },
    				dirty & /*isSelected*/ 8 && a_aria_current_value !== (a_aria_current_value = /*isSelected*/ ctx[3] ? 'page' : undefined) && { "aria-current": a_aria_current_value },
    				dirty & /*$$restProps*/ 16 && /*$$restProps*/ ctx[4]
    			]));

    			toggle_class(a, "bx--header__menu-item", true);
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(li);
    			/*a_binding*/ ctx[13](null);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$s.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$s($$self, $$props, $$invalidate) {
    	const omit_props_names = ["href","text","isSelected","ref"];
    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('HeaderNavItem', slots, []);
    	let { href = undefined } = $$props;
    	let { text = undefined } = $$props;
    	let { isSelected = false } = $$props;
    	let { ref = null } = $$props;

    	function click_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function mouseover_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function mouseenter_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function mouseleave_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function keyup_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function keydown_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function focus_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function blur_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function a_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			ref = $$value;
    			$$invalidate(0, ref);
    		});
    	}

    	$$self.$$set = $$new_props => {
    		$$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
    		$$invalidate(4, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ('href' in $$new_props) $$invalidate(1, href = $$new_props.href);
    		if ('text' in $$new_props) $$invalidate(2, text = $$new_props.text);
    		if ('isSelected' in $$new_props) $$invalidate(3, isSelected = $$new_props.isSelected);
    		if ('ref' in $$new_props) $$invalidate(0, ref = $$new_props.ref);
    	};

    	$$self.$capture_state = () => ({ href, text, isSelected, ref });

    	$$self.$inject_state = $$new_props => {
    		if ('href' in $$props) $$invalidate(1, href = $$new_props.href);
    		if ('text' in $$props) $$invalidate(2, text = $$new_props.text);
    		if ('isSelected' in $$props) $$invalidate(3, isSelected = $$new_props.isSelected);
    		if ('ref' in $$props) $$invalidate(0, ref = $$new_props.ref);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		ref,
    		href,
    		text,
    		isSelected,
    		$$restProps,
    		click_handler,
    		mouseover_handler,
    		mouseenter_handler,
    		mouseleave_handler,
    		keyup_handler,
    		keydown_handler,
    		focus_handler,
    		blur_handler,
    		a_binding
    	];
    }

    class HeaderNavItem extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$s, create_fragment$s, safe_not_equal, { href: 1, text: 2, isSelected: 3, ref: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "HeaderNavItem",
    			options,
    			id: create_fragment$s.name
    		});
    	}

    	get href() {
    		throw new Error("<HeaderNavItem>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set href(value) {
    		throw new Error("<HeaderNavItem>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get text() {
    		throw new Error("<HeaderNavItem>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set text(value) {
    		throw new Error("<HeaderNavItem>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get isSelected() {
    		throw new Error("<HeaderNavItem>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set isSelected(value) {
    		throw new Error("<HeaderNavItem>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get ref() {
    		throw new Error("<HeaderNavItem>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set ref(value) {
    		throw new Error("<HeaderNavItem>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    var HeaderNavItem$1 = HeaderNavItem;

    /* node_modules\carbon-components-svelte\src\Grid\Grid.svelte generated by Svelte v3.42.4 */

    const file$r = "node_modules\\carbon-components-svelte\\src\\Grid\\Grid.svelte";
    const get_default_slot_changes$3 = dirty => ({ props: dirty & /*props*/ 2 });
    const get_default_slot_context$3 = ctx => ({ props: /*props*/ ctx[1] });

    // (54:0) {:else}
    function create_else_block$6(ctx) {
    	let div;
    	let current;
    	const default_slot_template = /*#slots*/ ctx[10].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[9], null);
    	let div_levels = [/*props*/ ctx[1]];
    	let div_data = {};

    	for (let i = 0; i < div_levels.length; i += 1) {
    		div_data = assign(div_data, div_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			div = element("div");
    			if (default_slot) default_slot.c();
    			set_attributes(div, div_data);
    			add_location(div, file$r, 54, 2, 1398);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			if (default_slot) {
    				default_slot.m(div, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 512)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[9],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[9])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[9], dirty, null),
    						null
    					);
    				}
    			}

    			set_attributes(div, div_data = get_spread_update(div_levels, [dirty & /*props*/ 2 && /*props*/ ctx[1]]));
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$6.name,
    		type: "else",
    		source: "(54:0) {:else}",
    		ctx
    	});

    	return block;
    }

    // (52:0) {#if as}
    function create_if_block$j(ctx) {
    	let current;
    	const default_slot_template = /*#slots*/ ctx[10].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[9], get_default_slot_context$3);

    	const block = {
    		c: function create() {
    			if (default_slot) default_slot.c();
    		},
    		m: function mount(target, anchor) {
    			if (default_slot) {
    				default_slot.m(target, anchor);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope, props*/ 514)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[9],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[9])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[9], dirty, get_default_slot_changes$3),
    						get_default_slot_context$3
    					);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$j.name,
    		type: "if",
    		source: "(52:0) {#if as}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$r(ctx) {
    	let current_block_type_index;
    	let if_block;
    	let if_block_anchor;
    	let current;
    	const if_block_creators = [create_if_block$j, create_else_block$6];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*as*/ ctx[0]) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if_blocks[current_block_type_index].m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				} else {
    					if_block.p(ctx, dirty);
    				}

    				transition_in(if_block, 1);
    				if_block.m(if_block_anchor.parentNode, if_block_anchor);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if_blocks[current_block_type_index].d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$r.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$r($$self, $$props, $$invalidate) {
    	let props;

    	const omit_props_names = [
    		"as","condensed","narrow","fullWidth","noGutter","noGutterLeft","noGutterRight","padding"
    	];

    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Grid', slots, ['default']);
    	let { as = false } = $$props;
    	let { condensed = false } = $$props;
    	let { narrow = false } = $$props;
    	let { fullWidth = false } = $$props;
    	let { noGutter = false } = $$props;
    	let { noGutterLeft = false } = $$props;
    	let { noGutterRight = false } = $$props;
    	let { padding = false } = $$props;

    	$$self.$$set = $$new_props => {
    		$$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
    		$$invalidate(11, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ('as' in $$new_props) $$invalidate(0, as = $$new_props.as);
    		if ('condensed' in $$new_props) $$invalidate(2, condensed = $$new_props.condensed);
    		if ('narrow' in $$new_props) $$invalidate(3, narrow = $$new_props.narrow);
    		if ('fullWidth' in $$new_props) $$invalidate(4, fullWidth = $$new_props.fullWidth);
    		if ('noGutter' in $$new_props) $$invalidate(5, noGutter = $$new_props.noGutter);
    		if ('noGutterLeft' in $$new_props) $$invalidate(6, noGutterLeft = $$new_props.noGutterLeft);
    		if ('noGutterRight' in $$new_props) $$invalidate(7, noGutterRight = $$new_props.noGutterRight);
    		if ('padding' in $$new_props) $$invalidate(8, padding = $$new_props.padding);
    		if ('$$scope' in $$new_props) $$invalidate(9, $$scope = $$new_props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		as,
    		condensed,
    		narrow,
    		fullWidth,
    		noGutter,
    		noGutterLeft,
    		noGutterRight,
    		padding,
    		props
    	});

    	$$self.$inject_state = $$new_props => {
    		if ('as' in $$props) $$invalidate(0, as = $$new_props.as);
    		if ('condensed' in $$props) $$invalidate(2, condensed = $$new_props.condensed);
    		if ('narrow' in $$props) $$invalidate(3, narrow = $$new_props.narrow);
    		if ('fullWidth' in $$props) $$invalidate(4, fullWidth = $$new_props.fullWidth);
    		if ('noGutter' in $$props) $$invalidate(5, noGutter = $$new_props.noGutter);
    		if ('noGutterLeft' in $$props) $$invalidate(6, noGutterLeft = $$new_props.noGutterLeft);
    		if ('noGutterRight' in $$props) $$invalidate(7, noGutterRight = $$new_props.noGutterRight);
    		if ('padding' in $$props) $$invalidate(8, padding = $$new_props.padding);
    		if ('props' in $$props) $$invalidate(1, props = $$new_props.props);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		$$invalidate(1, props = {
    			...$$restProps,
    			class: [
    				$$restProps.class,
    				"bx--grid",
    				condensed && "bx--grid--condensed",
    				narrow && "bx--grid--narrow",
    				fullWidth && "bx--grid--full-width",
    				noGutter && "bx--no-gutter",
    				noGutterLeft && "bx--no-gutter--left",
    				noGutterRight && "bx--no-gutter--right",
    				padding && "bx--row-padding"
    			].filter(Boolean).join(" ")
    		});
    	};

    	return [
    		as,
    		props,
    		condensed,
    		narrow,
    		fullWidth,
    		noGutter,
    		noGutterLeft,
    		noGutterRight,
    		padding,
    		$$scope,
    		slots
    	];
    }

    class Grid extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$r, create_fragment$r, safe_not_equal, {
    			as: 0,
    			condensed: 2,
    			narrow: 3,
    			fullWidth: 4,
    			noGutter: 5,
    			noGutterLeft: 6,
    			noGutterRight: 7,
    			padding: 8
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Grid",
    			options,
    			id: create_fragment$r.name
    		});
    	}

    	get as() {
    		throw new Error("<Grid>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set as(value) {
    		throw new Error("<Grid>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get condensed() {
    		throw new Error("<Grid>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set condensed(value) {
    		throw new Error("<Grid>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get narrow() {
    		throw new Error("<Grid>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set narrow(value) {
    		throw new Error("<Grid>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get fullWidth() {
    		throw new Error("<Grid>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set fullWidth(value) {
    		throw new Error("<Grid>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get noGutter() {
    		throw new Error("<Grid>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set noGutter(value) {
    		throw new Error("<Grid>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get noGutterLeft() {
    		throw new Error("<Grid>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set noGutterLeft(value) {
    		throw new Error("<Grid>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get noGutterRight() {
    		throw new Error("<Grid>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set noGutterRight(value) {
    		throw new Error("<Grid>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get padding() {
    		throw new Error("<Grid>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set padding(value) {
    		throw new Error("<Grid>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    var Grid$1 = Grid;

    /* node_modules\carbon-components-svelte\src\Grid\Row.svelte generated by Svelte v3.42.4 */

    const file$q = "node_modules\\carbon-components-svelte\\src\\Grid\\Row.svelte";
    const get_default_slot_changes$2 = dirty => ({ props: dirty & /*props*/ 2 });
    const get_default_slot_context$2 = ctx => ({ props: /*props*/ ctx[1] });

    // (50:0) {:else}
    function create_else_block$5(ctx) {
    	let div;
    	let current;
    	const default_slot_template = /*#slots*/ ctx[9].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[8], null);
    	let div_levels = [/*props*/ ctx[1]];
    	let div_data = {};

    	for (let i = 0; i < div_levels.length; i += 1) {
    		div_data = assign(div_data, div_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			div = element("div");
    			if (default_slot) default_slot.c();
    			set_attributes(div, div_data);
    			add_location(div, file$q, 50, 2, 1267);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			if (default_slot) {
    				default_slot.m(div, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 256)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[8],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[8])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[8], dirty, null),
    						null
    					);
    				}
    			}

    			set_attributes(div, div_data = get_spread_update(div_levels, [dirty & /*props*/ 2 && /*props*/ ctx[1]]));
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$5.name,
    		type: "else",
    		source: "(50:0) {:else}",
    		ctx
    	});

    	return block;
    }

    // (48:0) {#if as}
    function create_if_block$i(ctx) {
    	let current;
    	const default_slot_template = /*#slots*/ ctx[9].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[8], get_default_slot_context$2);

    	const block = {
    		c: function create() {
    			if (default_slot) default_slot.c();
    		},
    		m: function mount(target, anchor) {
    			if (default_slot) {
    				default_slot.m(target, anchor);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope, props*/ 258)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[8],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[8])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[8], dirty, get_default_slot_changes$2),
    						get_default_slot_context$2
    					);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$i.name,
    		type: "if",
    		source: "(48:0) {#if as}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$q(ctx) {
    	let current_block_type_index;
    	let if_block;
    	let if_block_anchor;
    	let current;
    	const if_block_creators = [create_if_block$i, create_else_block$5];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*as*/ ctx[0]) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if_blocks[current_block_type_index].m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				} else {
    					if_block.p(ctx, dirty);
    				}

    				transition_in(if_block, 1);
    				if_block.m(if_block_anchor.parentNode, if_block_anchor);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if_blocks[current_block_type_index].d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$q.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$q($$self, $$props, $$invalidate) {
    	let props;
    	const omit_props_names = ["as","condensed","narrow","noGutter","noGutterLeft","noGutterRight","padding"];
    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Row', slots, ['default']);
    	let { as = false } = $$props;
    	let { condensed = false } = $$props;
    	let { narrow = false } = $$props;
    	let { noGutter = false } = $$props;
    	let { noGutterLeft = false } = $$props;
    	let { noGutterRight = false } = $$props;
    	let { padding = false } = $$props;

    	$$self.$$set = $$new_props => {
    		$$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
    		$$invalidate(10, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ('as' in $$new_props) $$invalidate(0, as = $$new_props.as);
    		if ('condensed' in $$new_props) $$invalidate(2, condensed = $$new_props.condensed);
    		if ('narrow' in $$new_props) $$invalidate(3, narrow = $$new_props.narrow);
    		if ('noGutter' in $$new_props) $$invalidate(4, noGutter = $$new_props.noGutter);
    		if ('noGutterLeft' in $$new_props) $$invalidate(5, noGutterLeft = $$new_props.noGutterLeft);
    		if ('noGutterRight' in $$new_props) $$invalidate(6, noGutterRight = $$new_props.noGutterRight);
    		if ('padding' in $$new_props) $$invalidate(7, padding = $$new_props.padding);
    		if ('$$scope' in $$new_props) $$invalidate(8, $$scope = $$new_props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		as,
    		condensed,
    		narrow,
    		noGutter,
    		noGutterLeft,
    		noGutterRight,
    		padding,
    		props
    	});

    	$$self.$inject_state = $$new_props => {
    		if ('as' in $$props) $$invalidate(0, as = $$new_props.as);
    		if ('condensed' in $$props) $$invalidate(2, condensed = $$new_props.condensed);
    		if ('narrow' in $$props) $$invalidate(3, narrow = $$new_props.narrow);
    		if ('noGutter' in $$props) $$invalidate(4, noGutter = $$new_props.noGutter);
    		if ('noGutterLeft' in $$props) $$invalidate(5, noGutterLeft = $$new_props.noGutterLeft);
    		if ('noGutterRight' in $$props) $$invalidate(6, noGutterRight = $$new_props.noGutterRight);
    		if ('padding' in $$props) $$invalidate(7, padding = $$new_props.padding);
    		if ('props' in $$props) $$invalidate(1, props = $$new_props.props);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		$$invalidate(1, props = {
    			...$$restProps,
    			class: [
    				$$restProps.class,
    				"bx--row",
    				condensed && "bx--row--condensed",
    				narrow && "bx--row--narrow",
    				noGutter && "bx--no-gutter",
    				noGutterLeft && "bx--no-gutter--left",
    				noGutterRight && "bx--no-gutter--right",
    				padding && "bx--row-padding"
    			].filter(Boolean).join(" ")
    		});
    	};

    	return [
    		as,
    		props,
    		condensed,
    		narrow,
    		noGutter,
    		noGutterLeft,
    		noGutterRight,
    		padding,
    		$$scope,
    		slots
    	];
    }

    class Row extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$q, create_fragment$q, safe_not_equal, {
    			as: 0,
    			condensed: 2,
    			narrow: 3,
    			noGutter: 4,
    			noGutterLeft: 5,
    			noGutterRight: 6,
    			padding: 7
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Row",
    			options,
    			id: create_fragment$q.name
    		});
    	}

    	get as() {
    		throw new Error("<Row>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set as(value) {
    		throw new Error("<Row>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get condensed() {
    		throw new Error("<Row>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set condensed(value) {
    		throw new Error("<Row>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get narrow() {
    		throw new Error("<Row>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set narrow(value) {
    		throw new Error("<Row>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get noGutter() {
    		throw new Error("<Row>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set noGutter(value) {
    		throw new Error("<Row>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get noGutterLeft() {
    		throw new Error("<Row>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set noGutterLeft(value) {
    		throw new Error("<Row>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get noGutterRight() {
    		throw new Error("<Row>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set noGutterRight(value) {
    		throw new Error("<Row>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get padding() {
    		throw new Error("<Row>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set padding(value) {
    		throw new Error("<Row>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    var Row$1 = Row;

    /* node_modules\carbon-components-svelte\src\Grid\Column.svelte generated by Svelte v3.42.4 */

    const file$p = "node_modules\\carbon-components-svelte\\src\\Grid\\Column.svelte";
    const get_default_slot_changes$1 = dirty => ({ props: dirty & /*props*/ 2 });
    const get_default_slot_context$1 = ctx => ({ props: /*props*/ ctx[1] });

    // (115:0) {:else}
    function create_else_block$4(ctx) {
    	let div;
    	let current;
    	const default_slot_template = /*#slots*/ ctx[14].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[13], null);
    	let div_levels = [/*props*/ ctx[1]];
    	let div_data = {};

    	for (let i = 0; i < div_levels.length; i += 1) {
    		div_data = assign(div_data, div_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			div = element("div");
    			if (default_slot) default_slot.c();
    			set_attributes(div, div_data);
    			add_location(div, file$p, 115, 2, 2896);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			if (default_slot) {
    				default_slot.m(div, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 8192)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[13],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[13])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[13], dirty, null),
    						null
    					);
    				}
    			}

    			set_attributes(div, div_data = get_spread_update(div_levels, [dirty & /*props*/ 2 && /*props*/ ctx[1]]));
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$4.name,
    		type: "else",
    		source: "(115:0) {:else}",
    		ctx
    	});

    	return block;
    }

    // (113:0) {#if as}
    function create_if_block$h(ctx) {
    	let current;
    	const default_slot_template = /*#slots*/ ctx[14].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[13], get_default_slot_context$1);

    	const block = {
    		c: function create() {
    			if (default_slot) default_slot.c();
    		},
    		m: function mount(target, anchor) {
    			if (default_slot) {
    				default_slot.m(target, anchor);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope, props*/ 8194)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[13],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[13])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[13], dirty, get_default_slot_changes$1),
    						get_default_slot_context$1
    					);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$h.name,
    		type: "if",
    		source: "(113:0) {#if as}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$p(ctx) {
    	let current_block_type_index;
    	let if_block;
    	let if_block_anchor;
    	let current;
    	const if_block_creators = [create_if_block$h, create_else_block$4];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*as*/ ctx[0]) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if_blocks[current_block_type_index].m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				} else {
    					if_block.p(ctx, dirty);
    				}

    				transition_in(if_block, 1);
    				if_block.m(if_block_anchor.parentNode, if_block_anchor);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if_blocks[current_block_type_index].d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$p.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$p($$self, $$props, $$invalidate) {
    	let columnClass;
    	let props;

    	const omit_props_names = [
    		"as","noGutter","noGutterLeft","noGutterRight","padding","aspectRatio","sm","md","lg","xlg","max"
    	];

    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Column', slots, ['default']);
    	let { as = false } = $$props;
    	let { noGutter = false } = $$props;
    	let { noGutterLeft = false } = $$props;
    	let { noGutterRight = false } = $$props;
    	let { padding = false } = $$props;
    	let { aspectRatio = undefined } = $$props;
    	let { sm = undefined } = $$props;
    	let { md = undefined } = $$props;
    	let { lg = undefined } = $$props;
    	let { xlg = undefined } = $$props;
    	let { max = undefined } = $$props;
    	const breakpoints = ["sm", "md", "lg", "xlg", "max"];

    	$$self.$$set = $$new_props => {
    		$$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
    		$$invalidate(16, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ('as' in $$new_props) $$invalidate(0, as = $$new_props.as);
    		if ('noGutter' in $$new_props) $$invalidate(2, noGutter = $$new_props.noGutter);
    		if ('noGutterLeft' in $$new_props) $$invalidate(3, noGutterLeft = $$new_props.noGutterLeft);
    		if ('noGutterRight' in $$new_props) $$invalidate(4, noGutterRight = $$new_props.noGutterRight);
    		if ('padding' in $$new_props) $$invalidate(5, padding = $$new_props.padding);
    		if ('aspectRatio' in $$new_props) $$invalidate(6, aspectRatio = $$new_props.aspectRatio);
    		if ('sm' in $$new_props) $$invalidate(7, sm = $$new_props.sm);
    		if ('md' in $$new_props) $$invalidate(8, md = $$new_props.md);
    		if ('lg' in $$new_props) $$invalidate(9, lg = $$new_props.lg);
    		if ('xlg' in $$new_props) $$invalidate(10, xlg = $$new_props.xlg);
    		if ('max' in $$new_props) $$invalidate(11, max = $$new_props.max);
    		if ('$$scope' in $$new_props) $$invalidate(13, $$scope = $$new_props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		as,
    		noGutter,
    		noGutterLeft,
    		noGutterRight,
    		padding,
    		aspectRatio,
    		sm,
    		md,
    		lg,
    		xlg,
    		max,
    		breakpoints,
    		columnClass,
    		props
    	});

    	$$self.$inject_state = $$new_props => {
    		if ('as' in $$props) $$invalidate(0, as = $$new_props.as);
    		if ('noGutter' in $$props) $$invalidate(2, noGutter = $$new_props.noGutter);
    		if ('noGutterLeft' in $$props) $$invalidate(3, noGutterLeft = $$new_props.noGutterLeft);
    		if ('noGutterRight' in $$props) $$invalidate(4, noGutterRight = $$new_props.noGutterRight);
    		if ('padding' in $$props) $$invalidate(5, padding = $$new_props.padding);
    		if ('aspectRatio' in $$props) $$invalidate(6, aspectRatio = $$new_props.aspectRatio);
    		if ('sm' in $$props) $$invalidate(7, sm = $$new_props.sm);
    		if ('md' in $$props) $$invalidate(8, md = $$new_props.md);
    		if ('lg' in $$props) $$invalidate(9, lg = $$new_props.lg);
    		if ('xlg' in $$props) $$invalidate(10, xlg = $$new_props.xlg);
    		if ('max' in $$props) $$invalidate(11, max = $$new_props.max);
    		if ('columnClass' in $$props) $$invalidate(12, columnClass = $$new_props.columnClass);
    		if ('props' in $$props) $$invalidate(1, props = $$new_props.props);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*sm, md, lg, xlg, max*/ 3968) {
    			$$invalidate(12, columnClass = [sm, md, lg, xlg, max].map((breakpoint, i) => {
    				const name = breakpoints[i];

    				if (breakpoint === true) {
    					return `bx--col-${name}`;
    				} else if (typeof breakpoint === "number") {
    					return `bx--col-${name}-${breakpoint}`;
    				} else if (typeof breakpoint === "object") {
    					let bp = [];

    					if (typeof breakpoint.span === "number") {
    						bp = [...bp, `bx--col-${name}-${breakpoint.span}`];
    					} else if (breakpoint.span === true) {
    						bp = [...bp, `bx--col-${name}`];
    					}

    					if (typeof breakpoint.offset === "number") {
    						bp = [...bp, `bx--offset-${name}-${breakpoint.offset}`];
    					}

    					return bp.join(" ");
    				}
    			}).filter(Boolean).join(" "));
    		}

    		$$invalidate(1, props = {
    			...$$restProps,
    			class: [
    				$$restProps.class,
    				columnClass,
    				!columnClass && "bx--col",
    				noGutter && "bx--no-gutter",
    				noGutterLeft && "bx--no-gutter--left",
    				noGutterRight && "bx--no-gutter--right",
    				aspectRatio && `bx--aspect-ratio bx--aspect-ratio--${aspectRatio}`,
    				padding && "bx--col-padding"
    			].filter(Boolean).join(" ")
    		});
    	};

    	return [
    		as,
    		props,
    		noGutter,
    		noGutterLeft,
    		noGutterRight,
    		padding,
    		aspectRatio,
    		sm,
    		md,
    		lg,
    		xlg,
    		max,
    		columnClass,
    		$$scope,
    		slots
    	];
    }

    class Column extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$p, create_fragment$p, safe_not_equal, {
    			as: 0,
    			noGutter: 2,
    			noGutterLeft: 3,
    			noGutterRight: 4,
    			padding: 5,
    			aspectRatio: 6,
    			sm: 7,
    			md: 8,
    			lg: 9,
    			xlg: 10,
    			max: 11
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Column",
    			options,
    			id: create_fragment$p.name
    		});
    	}

    	get as() {
    		throw new Error("<Column>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set as(value) {
    		throw new Error("<Column>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get noGutter() {
    		throw new Error("<Column>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set noGutter(value) {
    		throw new Error("<Column>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get noGutterLeft() {
    		throw new Error("<Column>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set noGutterLeft(value) {
    		throw new Error("<Column>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get noGutterRight() {
    		throw new Error("<Column>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set noGutterRight(value) {
    		throw new Error("<Column>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get padding() {
    		throw new Error("<Column>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set padding(value) {
    		throw new Error("<Column>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get aspectRatio() {
    		throw new Error("<Column>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set aspectRatio(value) {
    		throw new Error("<Column>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get sm() {
    		throw new Error("<Column>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set sm(value) {
    		throw new Error("<Column>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get md() {
    		throw new Error("<Column>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set md(value) {
    		throw new Error("<Column>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get lg() {
    		throw new Error("<Column>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set lg(value) {
    		throw new Error("<Column>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get xlg() {
    		throw new Error("<Column>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set xlg(value) {
    		throw new Error("<Column>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get max() {
    		throw new Error("<Column>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set max(value) {
    		throw new Error("<Column>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    var Column$1 = Column;

    /* node_modules\carbon-icons-svelte\lib\ChevronDownGlyph\ChevronDownGlyph.svelte generated by Svelte v3.42.4 */

    const file$o = "node_modules\\carbon-icons-svelte\\lib\\ChevronDownGlyph\\ChevronDownGlyph.svelte";

    // (40:4) {#if title}
    function create_if_block$g(ctx) {
    	let title_1;
    	let t;

    	const block = {
    		c: function create() {
    			title_1 = svg_element("title");
    			t = text(/*title*/ ctx[2]);
    			add_location(title_1, file$o, 40, 6, 1095);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, title_1, anchor);
    			append_dev(title_1, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*title*/ 4) set_data_dev(t, /*title*/ ctx[2]);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(title_1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$g.name,
    		type: "if",
    		source: "(40:4) {#if title}",
    		ctx
    	});

    	return block;
    }

    // (39:8)      
    function fallback_block$a(ctx) {
    	let if_block_anchor;
    	let if_block = /*title*/ ctx[2] && create_if_block$g(ctx);

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (/*title*/ ctx[2]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block$g(ctx);
    					if_block.c();
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}
    		},
    		d: function destroy(detaching) {
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: fallback_block$a.name,
    		type: "fallback",
    		source: "(39:8)      ",
    		ctx
    	});

    	return block;
    }

    function create_fragment$o(ctx) {
    	let svg;
    	let path;
    	let current;
    	let mounted;
    	let dispose;
    	const default_slot_template = /*#slots*/ ctx[11].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[10], null);
    	const default_slot_or_fallback = default_slot || fallback_block$a(ctx);

    	let svg_levels = [
    		{ "data-carbon-icon": "ChevronDownGlyph" },
    		{ xmlns: "http://www.w3.org/2000/svg" },
    		{ viewBox: "0 0 10 6" },
    		{ fill: "currentColor" },
    		{ width: "10" },
    		{ height: "6" },
    		{ class: /*className*/ ctx[0] },
    		{ preserveAspectRatio: "xMidYMid meet" },
    		{ style: /*style*/ ctx[3] },
    		{ id: /*id*/ ctx[1] },
    		/*attributes*/ ctx[4]
    	];

    	let svg_data = {};

    	for (let i = 0; i < svg_levels.length; i += 1) {
    		svg_data = assign(svg_data, svg_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			svg = svg_element("svg");
    			path = svg_element("path");
    			if (default_slot_or_fallback) default_slot_or_fallback.c();
    			attr_dev(path, "d", "M5 6L0 1 0.7 0.3 5 4.6 9.3 0.3 10 1z");
    			add_location(path, file$o, 37, 2, 1009);
    			set_svg_attributes(svg, svg_data);
    			add_location(svg, file$o, 23, 0, 690);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, svg, anchor);
    			append_dev(svg, path);

    			if (default_slot_or_fallback) {
    				default_slot_or_fallback.m(svg, null);
    			}

    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(svg, "click", /*click_handler*/ ctx[12], false, false, false),
    					listen_dev(svg, "mouseover", /*mouseover_handler*/ ctx[13], false, false, false),
    					listen_dev(svg, "mouseenter", /*mouseenter_handler*/ ctx[14], false, false, false),
    					listen_dev(svg, "mouseleave", /*mouseleave_handler*/ ctx[15], false, false, false),
    					listen_dev(svg, "keyup", /*keyup_handler*/ ctx[16], false, false, false),
    					listen_dev(svg, "keydown", /*keydown_handler*/ ctx[17], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 1024)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[10],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[10])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[10], dirty, null),
    						null
    					);
    				}
    			} else {
    				if (default_slot_or_fallback && default_slot_or_fallback.p && (!current || dirty & /*title*/ 4)) {
    					default_slot_or_fallback.p(ctx, !current ? -1 : dirty);
    				}
    			}

    			set_svg_attributes(svg, svg_data = get_spread_update(svg_levels, [
    				{ "data-carbon-icon": "ChevronDownGlyph" },
    				{ xmlns: "http://www.w3.org/2000/svg" },
    				{ viewBox: "0 0 10 6" },
    				{ fill: "currentColor" },
    				{ width: "10" },
    				{ height: "6" },
    				(!current || dirty & /*className*/ 1) && { class: /*className*/ ctx[0] },
    				{ preserveAspectRatio: "xMidYMid meet" },
    				(!current || dirty & /*style*/ 8) && { style: /*style*/ ctx[3] },
    				(!current || dirty & /*id*/ 2) && { id: /*id*/ ctx[1] },
    				dirty & /*attributes*/ 16 && /*attributes*/ ctx[4]
    			]));
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot_or_fallback, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot_or_fallback, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(svg);
    			if (default_slot_or_fallback) default_slot_or_fallback.d(detaching);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$o.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$o($$self, $$props, $$invalidate) {
    	let ariaLabel;
    	let ariaLabelledBy;
    	let labelled;
    	let attributes;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('ChevronDownGlyph', slots, ['default']);
    	let { class: className = undefined } = $$props;
    	let { id = undefined } = $$props;
    	let { tabindex = undefined } = $$props;
    	let { focusable = false } = $$props;
    	let { title = undefined } = $$props;
    	let { style = undefined } = $$props;

    	function click_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function mouseover_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function mouseenter_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function mouseleave_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function keyup_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function keydown_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	$$self.$$set = $$new_props => {
    		$$invalidate(18, $$props = assign(assign({}, $$props), exclude_internal_props($$new_props)));
    		if ('class' in $$new_props) $$invalidate(0, className = $$new_props.class);
    		if ('id' in $$new_props) $$invalidate(1, id = $$new_props.id);
    		if ('tabindex' in $$new_props) $$invalidate(5, tabindex = $$new_props.tabindex);
    		if ('focusable' in $$new_props) $$invalidate(6, focusable = $$new_props.focusable);
    		if ('title' in $$new_props) $$invalidate(2, title = $$new_props.title);
    		if ('style' in $$new_props) $$invalidate(3, style = $$new_props.style);
    		if ('$$scope' in $$new_props) $$invalidate(10, $$scope = $$new_props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		className,
    		id,
    		tabindex,
    		focusable,
    		title,
    		style,
    		labelled,
    		ariaLabelledBy,
    		ariaLabel,
    		attributes
    	});

    	$$self.$inject_state = $$new_props => {
    		$$invalidate(18, $$props = assign(assign({}, $$props), $$new_props));
    		if ('className' in $$props) $$invalidate(0, className = $$new_props.className);
    		if ('id' in $$props) $$invalidate(1, id = $$new_props.id);
    		if ('tabindex' in $$props) $$invalidate(5, tabindex = $$new_props.tabindex);
    		if ('focusable' in $$props) $$invalidate(6, focusable = $$new_props.focusable);
    		if ('title' in $$props) $$invalidate(2, title = $$new_props.title);
    		if ('style' in $$props) $$invalidate(3, style = $$new_props.style);
    		if ('labelled' in $$props) $$invalidate(7, labelled = $$new_props.labelled);
    		if ('ariaLabelledBy' in $$props) $$invalidate(8, ariaLabelledBy = $$new_props.ariaLabelledBy);
    		if ('ariaLabel' in $$props) $$invalidate(9, ariaLabel = $$new_props.ariaLabel);
    		if ('attributes' in $$props) $$invalidate(4, attributes = $$new_props.attributes);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		$$invalidate(9, ariaLabel = $$props['aria-label']);
    		$$invalidate(8, ariaLabelledBy = $$props['aria-labelledby']);

    		if ($$self.$$.dirty & /*ariaLabel, ariaLabelledBy, title*/ 772) {
    			$$invalidate(7, labelled = ariaLabel || ariaLabelledBy || title);
    		}

    		if ($$self.$$.dirty & /*ariaLabel, ariaLabelledBy, labelled, tabindex, focusable*/ 992) {
    			$$invalidate(4, attributes = {
    				'aria-label': ariaLabel,
    				'aria-labelledby': ariaLabelledBy,
    				'aria-hidden': labelled ? undefined : true,
    				role: labelled ? 'img' : undefined,
    				focusable: tabindex === '0' ? true : focusable,
    				tabindex
    			});
    		}
    	};

    	$$props = exclude_internal_props($$props);

    	return [
    		className,
    		id,
    		title,
    		style,
    		attributes,
    		tabindex,
    		focusable,
    		labelled,
    		ariaLabelledBy,
    		ariaLabel,
    		$$scope,
    		slots,
    		click_handler,
    		mouseover_handler,
    		mouseenter_handler,
    		mouseleave_handler,
    		keyup_handler,
    		keydown_handler
    	];
    }

    class ChevronDownGlyph extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$o, create_fragment$o, safe_not_equal, {
    			class: 0,
    			id: 1,
    			tabindex: 5,
    			focusable: 6,
    			title: 2,
    			style: 3
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "ChevronDownGlyph",
    			options,
    			id: create_fragment$o.name
    		});
    	}

    	get class() {
    		throw new Error("<ChevronDownGlyph>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set class(value) {
    		throw new Error("<ChevronDownGlyph>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get id() {
    		throw new Error("<ChevronDownGlyph>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set id(value) {
    		throw new Error("<ChevronDownGlyph>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get tabindex() {
    		throw new Error("<ChevronDownGlyph>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set tabindex(value) {
    		throw new Error("<ChevronDownGlyph>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get focusable() {
    		throw new Error("<ChevronDownGlyph>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set focusable(value) {
    		throw new Error("<ChevronDownGlyph>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get title() {
    		throw new Error("<ChevronDownGlyph>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set title(value) {
    		throw new Error("<ChevronDownGlyph>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get style() {
    		throw new Error("<ChevronDownGlyph>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set style(value) {
    		throw new Error("<ChevronDownGlyph>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    var ChevronDownGlyph$1 = ChevronDownGlyph;

    /* node_modules\carbon-components-svelte\src\Tabs\Tabs.svelte generated by Svelte v3.42.4 */
    const file$n = "node_modules\\carbon-components-svelte\\src\\Tabs\\Tabs.svelte";
    const get_content_slot_changes = dirty => ({});
    const get_content_slot_context = ctx => ({});

    // (132:6) {#if currentTab}
    function create_if_block$f(ctx) {
    	let t_value = /*currentTab*/ ctx[3].label + "";
    	let t;

    	const block = {
    		c: function create() {
    			t = text(t_value);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*currentTab*/ 8 && t_value !== (t_value = /*currentTab*/ ctx[3].label + "")) set_data_dev(t, t_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$f.name,
    		type: "if",
    		source: "(132:6) {#if currentTab}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$n(ctx) {
    	let div1;
    	let div0;
    	let a;
    	let t0;
    	let chevrondownglyph;
    	let div0_aria_label_value;
    	let t1;
    	let ul;
    	let t2;
    	let current;
    	let mounted;
    	let dispose;
    	let if_block = /*currentTab*/ ctx[3] && create_if_block$f(ctx);

    	chevrondownglyph = new ChevronDownGlyph$1({
    			props: {
    				"aria-hidden": "true",
    				title: /*iconDescription*/ ctx[1]
    			},
    			$$inline: true
    		});

    	const default_slot_template = /*#slots*/ ctx[18].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[17], null);
    	let div1_levels = [{ role: "navigation" }, /*$$restProps*/ ctx[9]];
    	let div1_data = {};

    	for (let i = 0; i < div1_levels.length; i += 1) {
    		div1_data = assign(div1_data, div1_levels[i]);
    	}

    	const content_slot_template = /*#slots*/ ctx[18].content;
    	const content_slot = create_slot(content_slot_template, ctx, /*$$scope*/ ctx[17], get_content_slot_context);

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			div0 = element("div");
    			a = element("a");
    			if (if_block) if_block.c();
    			t0 = space();
    			create_component(chevrondownglyph.$$.fragment);
    			t1 = space();
    			ul = element("ul");
    			if (default_slot) default_slot.c();
    			t2 = space();
    			if (content_slot) content_slot.c();
    			attr_dev(a, "tabindex", "-1");
    			attr_dev(a, "href", /*triggerHref*/ ctx[2]);
    			toggle_class(a, "bx--tabs-trigger-text", true);
    			add_location(a, file$n, 122, 4, 2862);
    			attr_dev(div0, "role", "listbox");
    			attr_dev(div0, "tabindex", "0");
    			attr_dev(div0, "aria-label", div0_aria_label_value = /*$$props*/ ctx[10]['aria-label'] || 'listbox');
    			toggle_class(div0, "bx--tabs-trigger", true);
    			add_location(div0, file$n, 109, 2, 2562);
    			attr_dev(ul, "role", "tablist");
    			toggle_class(ul, "bx--tabs__nav", true);
    			toggle_class(ul, "bx--tabs__nav--hidden", /*dropdownHidden*/ ctx[4]);
    			add_location(ul, file$n, 135, 2, 3189);
    			set_attributes(div1, div1_data);
    			toggle_class(div1, "bx--tabs", true);
    			toggle_class(div1, "bx--tabs--container", /*type*/ ctx[0] === 'container');
    			add_location(div1, file$n, 103, 0, 2435);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, div0);
    			append_dev(div0, a);
    			if (if_block) if_block.m(a, null);
    			append_dev(div0, t0);
    			mount_component(chevrondownglyph, div0, null);
    			append_dev(div1, t1);
    			append_dev(div1, ul);

    			if (default_slot) {
    				default_slot.m(ul, null);
    			}

    			insert_dev(target, t2, anchor);

    			if (content_slot) {
    				content_slot.m(target, anchor);
    			}

    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(a, "click", /*click_handler*/ ctx[20], false, false, false),
    					listen_dev(a, "click", /*click_handler_1*/ ctx[21], false, false, false),
    					listen_dev(div0, "click", /*click_handler_2*/ ctx[22], false, false, false),
    					listen_dev(div0, "keypress", /*keypress_handler*/ ctx[19], false, false, false),
    					listen_dev(div0, "keypress", /*keypress_handler_1*/ ctx[23], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (/*currentTab*/ ctx[3]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block$f(ctx);
    					if_block.c();
    					if_block.m(a, null);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}

    			if (!current || dirty & /*triggerHref*/ 4) {
    				attr_dev(a, "href", /*triggerHref*/ ctx[2]);
    			}

    			const chevrondownglyph_changes = {};
    			if (dirty & /*iconDescription*/ 2) chevrondownglyph_changes.title = /*iconDescription*/ ctx[1];
    			chevrondownglyph.$set(chevrondownglyph_changes);

    			if (!current || dirty & /*$$props*/ 1024 && div0_aria_label_value !== (div0_aria_label_value = /*$$props*/ ctx[10]['aria-label'] || 'listbox')) {
    				attr_dev(div0, "aria-label", div0_aria_label_value);
    			}

    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 131072)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[17],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[17])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[17], dirty, null),
    						null
    					);
    				}
    			}

    			if (dirty & /*dropdownHidden*/ 16) {
    				toggle_class(ul, "bx--tabs__nav--hidden", /*dropdownHidden*/ ctx[4]);
    			}

    			set_attributes(div1, div1_data = get_spread_update(div1_levels, [
    				{ role: "navigation" },
    				dirty & /*$$restProps*/ 512 && /*$$restProps*/ ctx[9]
    			]));

    			toggle_class(div1, "bx--tabs", true);
    			toggle_class(div1, "bx--tabs--container", /*type*/ ctx[0] === 'container');

    			if (content_slot) {
    				if (content_slot.p && (!current || dirty & /*$$scope*/ 131072)) {
    					update_slot_base(
    						content_slot,
    						content_slot_template,
    						ctx,
    						/*$$scope*/ ctx[17],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[17])
    						: get_slot_changes(content_slot_template, /*$$scope*/ ctx[17], dirty, get_content_slot_changes),
    						get_content_slot_context
    					);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(chevrondownglyph.$$.fragment, local);
    			transition_in(default_slot, local);
    			transition_in(content_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(chevrondownglyph.$$.fragment, local);
    			transition_out(default_slot, local);
    			transition_out(content_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    			if (if_block) if_block.d();
    			destroy_component(chevrondownglyph);
    			if (default_slot) default_slot.d(detaching);
    			if (detaching) detach_dev(t2);
    			if (content_slot) content_slot.d(detaching);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$n.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$n($$self, $$props, $$invalidate) {
    	let currentTab;
    	let currentContent;
    	const omit_props_names = ["selected","type","iconDescription","triggerHref"];
    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let $selectedTab;
    	let $content;
    	let $tabs;
    	let $tabsById;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Tabs', slots, ['default','content']);
    	let { selected = 0 } = $$props;
    	let { type = "default" } = $$props;
    	let { iconDescription = "Show menu options" } = $$props;
    	let { triggerHref = "#" } = $$props;
    	const dispatch = createEventDispatcher();
    	const tabs = writable([]);
    	validate_store(tabs, 'tabs');
    	component_subscribe($$self, tabs, value => $$invalidate(16, $tabs = value));
    	const tabsById = derived(tabs, _ => _.reduce((a, c) => ({ ...a, [c.id]: c }), {}));
    	validate_store(tabsById, 'tabsById');
    	component_subscribe($$self, tabsById, value => $$invalidate(24, $tabsById = value));
    	const selectedTab = writable(undefined);
    	validate_store(selectedTab, 'selectedTab');
    	component_subscribe($$self, selectedTab, value => $$invalidate(14, $selectedTab = value));
    	const content = writable([]);
    	validate_store(content, 'content');
    	component_subscribe($$self, content, value => $$invalidate(15, $content = value));
    	const contentById = derived(content, _ => _.reduce((a, c) => ({ ...a, [c.id]: c }), {}));
    	const selectedContent = writable(undefined);

    	setContext("Tabs", {
    		tabs,
    		contentById,
    		selectedTab,
    		selectedContent,
    		add: data => {
    			tabs.update(_ => [..._, { ...data, index: _.length }]);
    		},
    		addContent: data => {
    			content.update(_ => [..._, { ...data, index: _.length }]);
    		},
    		update: id => {
    			$$invalidate(12, currentIndex = $tabsById[id].index);
    		},
    		change: direction => {
    			let index = currentIndex + direction;

    			if (index < 0) {
    				index = $tabs.length - 1;
    			} else if (index >= $tabs.length) {
    				index = 0;
    			}

    			let disabled = $tabs[index].disabled;

    			while (disabled) {
    				index = index + direction;

    				if (index < 0) {
    					index = $tabs.length - 1;
    				} else if (index >= $tabs.length) {
    					index = 0;
    				}

    				disabled = $tabs[index].disabled;
    			}

    			$$invalidate(12, currentIndex = index);
    		}
    	});

    	afterUpdate(() => {
    		$$invalidate(11, selected = currentIndex);
    	});

    	let dropdownHidden = true;
    	let currentIndex = selected;

    	function keypress_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function click_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	const click_handler_1 = () => {
    		$$invalidate(4, dropdownHidden = !dropdownHidden);
    	};

    	const click_handler_2 = () => {
    		$$invalidate(4, dropdownHidden = !dropdownHidden);
    	};

    	const keypress_handler_1 = () => {
    		$$invalidate(4, dropdownHidden = !dropdownHidden);
    	};

    	$$self.$$set = $$new_props => {
    		$$invalidate(10, $$props = assign(assign({}, $$props), exclude_internal_props($$new_props)));
    		$$invalidate(9, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ('selected' in $$new_props) $$invalidate(11, selected = $$new_props.selected);
    		if ('type' in $$new_props) $$invalidate(0, type = $$new_props.type);
    		if ('iconDescription' in $$new_props) $$invalidate(1, iconDescription = $$new_props.iconDescription);
    		if ('triggerHref' in $$new_props) $$invalidate(2, triggerHref = $$new_props.triggerHref);
    		if ('$$scope' in $$new_props) $$invalidate(17, $$scope = $$new_props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		selected,
    		type,
    		iconDescription,
    		triggerHref,
    		createEventDispatcher,
    		afterUpdate,
    		setContext,
    		writable,
    		derived,
    		ChevronDownGlyph: ChevronDownGlyph$1,
    		dispatch,
    		tabs,
    		tabsById,
    		selectedTab,
    		content,
    		contentById,
    		selectedContent,
    		dropdownHidden,
    		currentIndex,
    		currentContent,
    		currentTab,
    		$selectedTab,
    		$content,
    		$tabs,
    		$tabsById
    	});

    	$$self.$inject_state = $$new_props => {
    		$$invalidate(10, $$props = assign(assign({}, $$props), $$new_props));
    		if ('selected' in $$props) $$invalidate(11, selected = $$new_props.selected);
    		if ('type' in $$props) $$invalidate(0, type = $$new_props.type);
    		if ('iconDescription' in $$props) $$invalidate(1, iconDescription = $$new_props.iconDescription);
    		if ('triggerHref' in $$props) $$invalidate(2, triggerHref = $$new_props.triggerHref);
    		if ('dropdownHidden' in $$props) $$invalidate(4, dropdownHidden = $$new_props.dropdownHidden);
    		if ('currentIndex' in $$props) $$invalidate(12, currentIndex = $$new_props.currentIndex);
    		if ('currentContent' in $$props) $$invalidate(13, currentContent = $$new_props.currentContent);
    		if ('currentTab' in $$props) $$invalidate(3, currentTab = $$new_props.currentTab);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*selected*/ 2048) {
    			$$invalidate(12, currentIndex = selected);
    		}

    		if ($$self.$$.dirty & /*$tabs, currentIndex*/ 69632) {
    			$$invalidate(3, currentTab = $tabs[currentIndex] || undefined);
    		}

    		if ($$self.$$.dirty & /*$content, currentIndex*/ 36864) {
    			$$invalidate(13, currentContent = $content[currentIndex] || undefined);
    		}

    		if ($$self.$$.dirty & /*currentIndex, currentTab, currentContent*/ 12296) {
    			{
    				dispatch("change", currentIndex);

    				if (currentTab) {
    					selectedTab.set(currentTab.id);
    				}

    				if (currentContent) {
    					selectedContent.set(currentContent.id);
    				}
    			}
    		}

    		if ($$self.$$.dirty & /*$selectedTab*/ 16384) {
    			if ($selectedTab) {
    				$$invalidate(4, dropdownHidden = true);
    			}
    		}
    	};

    	$$props = exclude_internal_props($$props);

    	return [
    		type,
    		iconDescription,
    		triggerHref,
    		currentTab,
    		dropdownHidden,
    		tabs,
    		tabsById,
    		selectedTab,
    		content,
    		$$restProps,
    		$$props,
    		selected,
    		currentIndex,
    		currentContent,
    		$selectedTab,
    		$content,
    		$tabs,
    		$$scope,
    		slots,
    		keypress_handler,
    		click_handler,
    		click_handler_1,
    		click_handler_2,
    		keypress_handler_1
    	];
    }

    class Tabs extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$n, create_fragment$n, safe_not_equal, {
    			selected: 11,
    			type: 0,
    			iconDescription: 1,
    			triggerHref: 2
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Tabs",
    			options,
    			id: create_fragment$n.name
    		});
    	}

    	get selected() {
    		throw new Error("<Tabs>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set selected(value) {
    		throw new Error("<Tabs>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get type() {
    		throw new Error("<Tabs>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set type(value) {
    		throw new Error("<Tabs>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get iconDescription() {
    		throw new Error("<Tabs>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set iconDescription(value) {
    		throw new Error("<Tabs>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get triggerHref() {
    		throw new Error("<Tabs>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set triggerHref(value) {
    		throw new Error("<Tabs>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    var Tabs$1 = Tabs;

    /* node_modules\carbon-components-svelte\src\Tabs\Tab.svelte generated by Svelte v3.42.4 */
    const file$m = "node_modules\\carbon-components-svelte\\src\\Tabs\\Tab.svelte";

    // (85:10) {label}
    function fallback_block$9(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text(/*label*/ ctx[1]);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*label*/ 2) set_data_dev(t, /*label*/ ctx[1]);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: fallback_block$9.name,
    		type: "fallback",
    		source: "(85:10) {label}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$m(ctx) {
    	let li;
    	let a;
    	let a_tabindex_value;
    	let current;
    	let mounted;
    	let dispose;
    	const default_slot_template = /*#slots*/ ctx[13].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[12], null);
    	const default_slot_or_fallback = default_slot || fallback_block$9(ctx);
    	let li_levels = [{ tabindex: "-1" }, { role: "presentation" }, /*$$restProps*/ ctx[10]];
    	let li_data = {};

    	for (let i = 0; i < li_levels.length; i += 1) {
    		li_data = assign(li_data, li_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			li = element("li");
    			a = element("a");
    			if (default_slot_or_fallback) default_slot_or_fallback.c();
    			attr_dev(a, "role", "tab");
    			attr_dev(a, "tabindex", a_tabindex_value = /*disabled*/ ctx[3] ? '-1' : /*tabindex*/ ctx[4]);
    			attr_dev(a, "aria-selected", /*selected*/ ctx[6]);
    			attr_dev(a, "aria-disabled", /*disabled*/ ctx[3]);
    			attr_dev(a, "id", /*id*/ ctx[5]);
    			attr_dev(a, "href", /*href*/ ctx[2]);
    			toggle_class(a, "bx--tabs__nav-link", true);
    			add_location(a, file$m, 74, 2, 1619);
    			set_attributes(li, li_data);
    			toggle_class(li, "bx--tabs__nav-item", true);
    			toggle_class(li, "bx--tabs__nav-item--disabled", /*disabled*/ ctx[3]);
    			toggle_class(li, "bx--tabs__nav-item--selected", /*selected*/ ctx[6]);
    			add_location(li, file$m, 46, 0, 1003);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, li, anchor);
    			append_dev(li, a);

    			if (default_slot_or_fallback) {
    				default_slot_or_fallback.m(a, null);
    			}

    			/*a_binding*/ ctx[18](a);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(li, "click", prevent_default(/*click_handler*/ ctx[14]), false, true, false),
    					listen_dev(li, "click", prevent_default(/*click_handler_1*/ ctx[19]), false, true, false),
    					listen_dev(li, "mouseover", /*mouseover_handler*/ ctx[15], false, false, false),
    					listen_dev(li, "mouseenter", /*mouseenter_handler*/ ctx[16], false, false, false),
    					listen_dev(li, "mouseleave", /*mouseleave_handler*/ ctx[17], false, false, false),
    					listen_dev(li, "keydown", /*keydown_handler*/ ctx[20], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 4096)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[12],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[12])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[12], dirty, null),
    						null
    					);
    				}
    			} else {
    				if (default_slot_or_fallback && default_slot_or_fallback.p && (!current || dirty & /*label*/ 2)) {
    					default_slot_or_fallback.p(ctx, !current ? -1 : dirty);
    				}
    			}

    			if (!current || dirty & /*disabled, tabindex*/ 24 && a_tabindex_value !== (a_tabindex_value = /*disabled*/ ctx[3] ? '-1' : /*tabindex*/ ctx[4])) {
    				attr_dev(a, "tabindex", a_tabindex_value);
    			}

    			if (!current || dirty & /*selected*/ 64) {
    				attr_dev(a, "aria-selected", /*selected*/ ctx[6]);
    			}

    			if (!current || dirty & /*disabled*/ 8) {
    				attr_dev(a, "aria-disabled", /*disabled*/ ctx[3]);
    			}

    			if (!current || dirty & /*id*/ 32) {
    				attr_dev(a, "id", /*id*/ ctx[5]);
    			}

    			if (!current || dirty & /*href*/ 4) {
    				attr_dev(a, "href", /*href*/ ctx[2]);
    			}

    			set_attributes(li, li_data = get_spread_update(li_levels, [
    				{ tabindex: "-1" },
    				{ role: "presentation" },
    				dirty & /*$$restProps*/ 1024 && /*$$restProps*/ ctx[10]
    			]));

    			toggle_class(li, "bx--tabs__nav-item", true);
    			toggle_class(li, "bx--tabs__nav-item--disabled", /*disabled*/ ctx[3]);
    			toggle_class(li, "bx--tabs__nav-item--selected", /*selected*/ ctx[6]);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot_or_fallback, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot_or_fallback, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(li);
    			if (default_slot_or_fallback) default_slot_or_fallback.d(detaching);
    			/*a_binding*/ ctx[18](null);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$m.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$m($$self, $$props, $$invalidate) {
    	let selected;
    	const omit_props_names = ["label","href","disabled","tabindex","id","ref"];
    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let $selectedTab;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Tab', slots, ['default']);
    	let { label = "" } = $$props;
    	let { href = "#" } = $$props;
    	let { disabled = false } = $$props;
    	let { tabindex = "0" } = $$props;
    	let { id = "ccs-" + Math.random().toString(36) } = $$props;
    	let { ref = null } = $$props;
    	const { selectedTab, add, update, change } = getContext("Tabs");
    	validate_store(selectedTab, 'selectedTab');
    	component_subscribe($$self, selectedTab, value => $$invalidate(11, $selectedTab = value));
    	add({ id, label, disabled });
    	let didMount = false;

    	onMount(() => {
    		tick().then(() => {
    			didMount = true;
    		});
    	});

    	afterUpdate(() => {
    		if (didMount && selected && ref) {
    			ref.focus();
    		}
    	});

    	function click_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function mouseover_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function mouseenter_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function mouseleave_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function a_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			ref = $$value;
    			$$invalidate(0, ref);
    		});
    	}

    	const click_handler_1 = () => {
    		if (!disabled) {
    			update(id);
    		}
    	};

    	const keydown_handler = ({ key }) => {
    		if (!disabled) {
    			if (key === 'ArrowRight') {
    				change(1);
    			} else if (key === 'ArrowLeft') {
    				change(-1);
    			} else if (key === ' ' || key === 'Enter') {
    				update(id);
    			}
    		}
    	};

    	$$self.$$set = $$new_props => {
    		$$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
    		$$invalidate(10, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ('label' in $$new_props) $$invalidate(1, label = $$new_props.label);
    		if ('href' in $$new_props) $$invalidate(2, href = $$new_props.href);
    		if ('disabled' in $$new_props) $$invalidate(3, disabled = $$new_props.disabled);
    		if ('tabindex' in $$new_props) $$invalidate(4, tabindex = $$new_props.tabindex);
    		if ('id' in $$new_props) $$invalidate(5, id = $$new_props.id);
    		if ('ref' in $$new_props) $$invalidate(0, ref = $$new_props.ref);
    		if ('$$scope' in $$new_props) $$invalidate(12, $$scope = $$new_props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		label,
    		href,
    		disabled,
    		tabindex,
    		id,
    		ref,
    		onMount,
    		afterUpdate,
    		getContext,
    		tick,
    		selectedTab,
    		add,
    		update,
    		change,
    		didMount,
    		selected,
    		$selectedTab
    	});

    	$$self.$inject_state = $$new_props => {
    		if ('label' in $$props) $$invalidate(1, label = $$new_props.label);
    		if ('href' in $$props) $$invalidate(2, href = $$new_props.href);
    		if ('disabled' in $$props) $$invalidate(3, disabled = $$new_props.disabled);
    		if ('tabindex' in $$props) $$invalidate(4, tabindex = $$new_props.tabindex);
    		if ('id' in $$props) $$invalidate(5, id = $$new_props.id);
    		if ('ref' in $$props) $$invalidate(0, ref = $$new_props.ref);
    		if ('didMount' in $$props) didMount = $$new_props.didMount;
    		if ('selected' in $$props) $$invalidate(6, selected = $$new_props.selected);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*$selectedTab, id*/ 2080) {
    			$$invalidate(6, selected = $selectedTab === id);
    		}
    	};

    	return [
    		ref,
    		label,
    		href,
    		disabled,
    		tabindex,
    		id,
    		selected,
    		selectedTab,
    		update,
    		change,
    		$$restProps,
    		$selectedTab,
    		$$scope,
    		slots,
    		click_handler,
    		mouseover_handler,
    		mouseenter_handler,
    		mouseleave_handler,
    		a_binding,
    		click_handler_1,
    		keydown_handler
    	];
    }

    class Tab extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$m, create_fragment$m, safe_not_equal, {
    			label: 1,
    			href: 2,
    			disabled: 3,
    			tabindex: 4,
    			id: 5,
    			ref: 0
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Tab",
    			options,
    			id: create_fragment$m.name
    		});
    	}

    	get label() {
    		throw new Error("<Tab>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set label(value) {
    		throw new Error("<Tab>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get href() {
    		throw new Error("<Tab>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set href(value) {
    		throw new Error("<Tab>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get disabled() {
    		throw new Error("<Tab>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set disabled(value) {
    		throw new Error("<Tab>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get tabindex() {
    		throw new Error("<Tab>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set tabindex(value) {
    		throw new Error("<Tab>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get id() {
    		throw new Error("<Tab>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set id(value) {
    		throw new Error("<Tab>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get ref() {
    		throw new Error("<Tab>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set ref(value) {
    		throw new Error("<Tab>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    var Tab$1 = Tab;

    /* node_modules\carbon-components-svelte\src\Tabs\TabContent.svelte generated by Svelte v3.42.4 */
    const file$l = "node_modules\\carbon-components-svelte\\src\\Tabs\\TabContent.svelte";

    function create_fragment$l(ctx) {
    	let div;
    	let div_aria_hidden_value;
    	let div_hidden_value;
    	let current;
    	const default_slot_template = /*#slots*/ ctx[12].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[11], null);

    	let div_levels = [
    		{ role: "tabpanel" },
    		{ "aria-labelledby": /*tabId*/ ctx[1] },
    		{
    			"aria-hidden": div_aria_hidden_value = !/*selected*/ ctx[2]
    		},
    		{
    			hidden: div_hidden_value = /*selected*/ ctx[2] ? undefined : ''
    		},
    		{ id: /*id*/ ctx[0] },
    		/*$$restProps*/ ctx[6]
    	];

    	let div_data = {};

    	for (let i = 0; i < div_levels.length; i += 1) {
    		div_data = assign(div_data, div_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			div = element("div");
    			if (default_slot) default_slot.c();
    			set_attributes(div, div_data);
    			toggle_class(div, "bx--tab-content", true);
    			add_location(div, file$l, 15, 0, 374);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			if (default_slot) {
    				default_slot.m(div, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 2048)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[11],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[11])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[11], dirty, null),
    						null
    					);
    				}
    			}

    			set_attributes(div, div_data = get_spread_update(div_levels, [
    				{ role: "tabpanel" },
    				(!current || dirty & /*tabId*/ 2) && { "aria-labelledby": /*tabId*/ ctx[1] },
    				(!current || dirty & /*selected*/ 4 && div_aria_hidden_value !== (div_aria_hidden_value = !/*selected*/ ctx[2])) && { "aria-hidden": div_aria_hidden_value },
    				(!current || dirty & /*selected*/ 4 && div_hidden_value !== (div_hidden_value = /*selected*/ ctx[2] ? undefined : '')) && { hidden: div_hidden_value },
    				(!current || dirty & /*id*/ 1) && { id: /*id*/ ctx[0] },
    				dirty & /*$$restProps*/ 64 && /*$$restProps*/ ctx[6]
    			]));

    			toggle_class(div, "bx--tab-content", true);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$l.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$l($$self, $$props, $$invalidate) {
    	let selected;
    	let index;
    	let tabId;
    	const omit_props_names = ["id"];
    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let $tabs;
    	let $contentById;
    	let $selectedContent;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('TabContent', slots, ['default']);
    	let { id = "ccs-" + Math.random().toString(36) } = $$props;
    	const { selectedContent, addContent, tabs, contentById } = getContext("Tabs");
    	validate_store(selectedContent, 'selectedContent');
    	component_subscribe($$self, selectedContent, value => $$invalidate(10, $selectedContent = value));
    	validate_store(tabs, 'tabs');
    	component_subscribe($$self, tabs, value => $$invalidate(8, $tabs = value));
    	validate_store(contentById, 'contentById');
    	component_subscribe($$self, contentById, value => $$invalidate(9, $contentById = value));
    	addContent({ id });

    	$$self.$$set = $$new_props => {
    		$$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
    		$$invalidate(6, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ('id' in $$new_props) $$invalidate(0, id = $$new_props.id);
    		if ('$$scope' in $$new_props) $$invalidate(11, $$scope = $$new_props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		id,
    		getContext,
    		selectedContent,
    		addContent,
    		tabs,
    		contentById,
    		index,
    		tabId,
    		selected,
    		$tabs,
    		$contentById,
    		$selectedContent
    	});

    	$$self.$inject_state = $$new_props => {
    		if ('id' in $$props) $$invalidate(0, id = $$new_props.id);
    		if ('index' in $$props) $$invalidate(7, index = $$new_props.index);
    		if ('tabId' in $$props) $$invalidate(1, tabId = $$new_props.tabId);
    		if ('selected' in $$props) $$invalidate(2, selected = $$new_props.selected);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*$selectedContent, id*/ 1025) {
    			$$invalidate(2, selected = $selectedContent === id);
    		}

    		if ($$self.$$.dirty & /*$contentById, id*/ 513) {
    			$$invalidate(7, index = $contentById[id].index);
    		}

    		if ($$self.$$.dirty & /*$tabs, index*/ 384) {
    			$$invalidate(1, tabId = $tabs[index].id);
    		}
    	};

    	return [
    		id,
    		tabId,
    		selected,
    		selectedContent,
    		tabs,
    		contentById,
    		$$restProps,
    		index,
    		$tabs,
    		$contentById,
    		$selectedContent,
    		$$scope,
    		slots
    	];
    }

    class TabContent extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$l, create_fragment$l, safe_not_equal, { id: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "TabContent",
    			options,
    			id: create_fragment$l.name
    		});
    	}

    	get id() {
    		throw new Error("<TabContent>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set id(value) {
    		throw new Error("<TabContent>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    var TabContent$1 = TabContent;

    /* node_modules\carbon-components-svelte\src\Form\Form.svelte generated by Svelte v3.42.4 */

    const file$k = "node_modules\\carbon-components-svelte\\src\\Form\\Form.svelte";

    function create_fragment$k(ctx) {
    	let form;
    	let current;
    	let mounted;
    	let dispose;
    	const default_slot_template = /*#slots*/ ctx[2].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[1], null);
    	let form_levels = [/*$$restProps*/ ctx[0]];
    	let form_data = {};

    	for (let i = 0; i < form_levels.length; i += 1) {
    		form_data = assign(form_data, form_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			form = element("form");
    			if (default_slot) default_slot.c();
    			set_attributes(form, form_data);
    			toggle_class(form, "bx--form", true);
    			add_location(form, file$k, 1, 0, 57);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, form, anchor);

    			if (default_slot) {
    				default_slot.m(form, null);
    			}

    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(form, "click", /*click_handler*/ ctx[3], false, false, false),
    					listen_dev(form, "keydown", /*keydown_handler*/ ctx[4], false, false, false),
    					listen_dev(form, "mouseover", /*mouseover_handler*/ ctx[5], false, false, false),
    					listen_dev(form, "mouseenter", /*mouseenter_handler*/ ctx[6], false, false, false),
    					listen_dev(form, "mouseleave", /*mouseleave_handler*/ ctx[7], false, false, false),
    					listen_dev(form, "submit", prevent_default(/*submit_handler*/ ctx[8]), false, true, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 2)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[1],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[1])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[1], dirty, null),
    						null
    					);
    				}
    			}

    			set_attributes(form, form_data = get_spread_update(form_levels, [dirty & /*$$restProps*/ 1 && /*$$restProps*/ ctx[0]]));
    			toggle_class(form, "bx--form", true);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(form);
    			if (default_slot) default_slot.d(detaching);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$k.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$k($$self, $$props, $$invalidate) {
    	const omit_props_names = [];
    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Form', slots, ['default']);

    	function click_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function keydown_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function mouseover_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function mouseenter_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function mouseleave_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function submit_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	$$self.$$set = $$new_props => {
    		$$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
    		$$invalidate(0, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ('$$scope' in $$new_props) $$invalidate(1, $$scope = $$new_props.$$scope);
    	};

    	return [
    		$$restProps,
    		$$scope,
    		slots,
    		click_handler,
    		keydown_handler,
    		mouseover_handler,
    		mouseenter_handler,
    		mouseleave_handler,
    		submit_handler
    	];
    }

    class Form extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$k, create_fragment$k, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Form",
    			options,
    			id: create_fragment$k.name
    		});
    	}
    }

    var Form$1 = Form;

    /* node_modules\carbon-icons-svelte\lib\WarningFilled16\WarningFilled16.svelte generated by Svelte v3.42.4 */

    const file$j = "node_modules\\carbon-icons-svelte\\lib\\WarningFilled16\\WarningFilled16.svelte";

    // (40:4) {#if title}
    function create_if_block$e(ctx) {
    	let title_1;
    	let t;

    	const block = {
    		c: function create() {
    			title_1 = svg_element("title");
    			t = text(/*title*/ ctx[2]);
    			add_location(title_1, file$j, 40, 6, 1409);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, title_1, anchor);
    			append_dev(title_1, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*title*/ 4) set_data_dev(t, /*title*/ ctx[2]);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(title_1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$e.name,
    		type: "if",
    		source: "(40:4) {#if title}",
    		ctx
    	});

    	return block;
    }

    // (39:8)      
    function fallback_block$8(ctx) {
    	let if_block_anchor;
    	let if_block = /*title*/ ctx[2] && create_if_block$e(ctx);

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (/*title*/ ctx[2]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block$e(ctx);
    					if_block.c();
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}
    		},
    		d: function destroy(detaching) {
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: fallback_block$8.name,
    		type: "fallback",
    		source: "(39:8)      ",
    		ctx
    	});

    	return block;
    }

    function create_fragment$j(ctx) {
    	let svg;
    	let path0;
    	let path1;
    	let current;
    	let mounted;
    	let dispose;
    	const default_slot_template = /*#slots*/ ctx[11].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[10], null);
    	const default_slot_or_fallback = default_slot || fallback_block$8(ctx);

    	let svg_levels = [
    		{ "data-carbon-icon": "WarningFilled16" },
    		{ xmlns: "http://www.w3.org/2000/svg" },
    		{ viewBox: "0 0 16 16" },
    		{ fill: "currentColor" },
    		{ width: "16" },
    		{ height: "16" },
    		{ class: /*className*/ ctx[0] },
    		{ preserveAspectRatio: "xMidYMid meet" },
    		{ style: /*style*/ ctx[3] },
    		{ id: /*id*/ ctx[1] },
    		/*attributes*/ ctx[4]
    	];

    	let svg_data = {};

    	for (let i = 0; i < svg_levels.length; i += 1) {
    		svg_data = assign(svg_data, svg_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			svg = svg_element("svg");
    			path0 = svg_element("path");
    			path1 = svg_element("path");
    			if (default_slot_or_fallback) default_slot_or_fallback.c();
    			attr_dev(path0, "d", "M8,1C4.2,1,1,4.2,1,8s3.2,7,7,7s7-3.1,7-7S11.9,1,8,1z M7.5,4h1v5h-1C7.5,9,7.5,4,7.5,4z M8,12.2\tc-0.4,0-0.8-0.4-0.8-0.8s0.3-0.8,0.8-0.8c0.4,0,0.8,0.4,0.8,0.8S8.4,12.2,8,12.2z");
    			add_location(path0, file$j, 37, 2, 1010);
    			attr_dev(path1, "d", "M7.5,4h1v5h-1C7.5,9,7.5,4,7.5,4z M8,12.2c-0.4,0-0.8-0.4-0.8-0.8s0.3-0.8,0.8-0.8\tc0.4,0,0.8,0.4,0.8,0.8S8.4,12.2,8,12.2z");
    			attr_dev(path1, "data-icon-path", "inner-path");
    			attr_dev(path1, "opacity", "0");
    			add_location(path1, file$j, 37, 192, 1200);
    			set_svg_attributes(svg, svg_data);
    			add_location(svg, file$j, 23, 0, 690);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, svg, anchor);
    			append_dev(svg, path0);
    			append_dev(svg, path1);

    			if (default_slot_or_fallback) {
    				default_slot_or_fallback.m(svg, null);
    			}

    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(svg, "click", /*click_handler*/ ctx[12], false, false, false),
    					listen_dev(svg, "mouseover", /*mouseover_handler*/ ctx[13], false, false, false),
    					listen_dev(svg, "mouseenter", /*mouseenter_handler*/ ctx[14], false, false, false),
    					listen_dev(svg, "mouseleave", /*mouseleave_handler*/ ctx[15], false, false, false),
    					listen_dev(svg, "keyup", /*keyup_handler*/ ctx[16], false, false, false),
    					listen_dev(svg, "keydown", /*keydown_handler*/ ctx[17], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 1024)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[10],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[10])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[10], dirty, null),
    						null
    					);
    				}
    			} else {
    				if (default_slot_or_fallback && default_slot_or_fallback.p && (!current || dirty & /*title*/ 4)) {
    					default_slot_or_fallback.p(ctx, !current ? -1 : dirty);
    				}
    			}

    			set_svg_attributes(svg, svg_data = get_spread_update(svg_levels, [
    				{ "data-carbon-icon": "WarningFilled16" },
    				{ xmlns: "http://www.w3.org/2000/svg" },
    				{ viewBox: "0 0 16 16" },
    				{ fill: "currentColor" },
    				{ width: "16" },
    				{ height: "16" },
    				(!current || dirty & /*className*/ 1) && { class: /*className*/ ctx[0] },
    				{ preserveAspectRatio: "xMidYMid meet" },
    				(!current || dirty & /*style*/ 8) && { style: /*style*/ ctx[3] },
    				(!current || dirty & /*id*/ 2) && { id: /*id*/ ctx[1] },
    				dirty & /*attributes*/ 16 && /*attributes*/ ctx[4]
    			]));
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot_or_fallback, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot_or_fallback, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(svg);
    			if (default_slot_or_fallback) default_slot_or_fallback.d(detaching);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$j.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$j($$self, $$props, $$invalidate) {
    	let ariaLabel;
    	let ariaLabelledBy;
    	let labelled;
    	let attributes;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('WarningFilled16', slots, ['default']);
    	let { class: className = undefined } = $$props;
    	let { id = undefined } = $$props;
    	let { tabindex = undefined } = $$props;
    	let { focusable = false } = $$props;
    	let { title = undefined } = $$props;
    	let { style = undefined } = $$props;

    	function click_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function mouseover_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function mouseenter_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function mouseleave_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function keyup_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function keydown_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	$$self.$$set = $$new_props => {
    		$$invalidate(18, $$props = assign(assign({}, $$props), exclude_internal_props($$new_props)));
    		if ('class' in $$new_props) $$invalidate(0, className = $$new_props.class);
    		if ('id' in $$new_props) $$invalidate(1, id = $$new_props.id);
    		if ('tabindex' in $$new_props) $$invalidate(5, tabindex = $$new_props.tabindex);
    		if ('focusable' in $$new_props) $$invalidate(6, focusable = $$new_props.focusable);
    		if ('title' in $$new_props) $$invalidate(2, title = $$new_props.title);
    		if ('style' in $$new_props) $$invalidate(3, style = $$new_props.style);
    		if ('$$scope' in $$new_props) $$invalidate(10, $$scope = $$new_props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		className,
    		id,
    		tabindex,
    		focusable,
    		title,
    		style,
    		labelled,
    		ariaLabelledBy,
    		ariaLabel,
    		attributes
    	});

    	$$self.$inject_state = $$new_props => {
    		$$invalidate(18, $$props = assign(assign({}, $$props), $$new_props));
    		if ('className' in $$props) $$invalidate(0, className = $$new_props.className);
    		if ('id' in $$props) $$invalidate(1, id = $$new_props.id);
    		if ('tabindex' in $$props) $$invalidate(5, tabindex = $$new_props.tabindex);
    		if ('focusable' in $$props) $$invalidate(6, focusable = $$new_props.focusable);
    		if ('title' in $$props) $$invalidate(2, title = $$new_props.title);
    		if ('style' in $$props) $$invalidate(3, style = $$new_props.style);
    		if ('labelled' in $$props) $$invalidate(7, labelled = $$new_props.labelled);
    		if ('ariaLabelledBy' in $$props) $$invalidate(8, ariaLabelledBy = $$new_props.ariaLabelledBy);
    		if ('ariaLabel' in $$props) $$invalidate(9, ariaLabel = $$new_props.ariaLabel);
    		if ('attributes' in $$props) $$invalidate(4, attributes = $$new_props.attributes);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		$$invalidate(9, ariaLabel = $$props['aria-label']);
    		$$invalidate(8, ariaLabelledBy = $$props['aria-labelledby']);

    		if ($$self.$$.dirty & /*ariaLabel, ariaLabelledBy, title*/ 772) {
    			$$invalidate(7, labelled = ariaLabel || ariaLabelledBy || title);
    		}

    		if ($$self.$$.dirty & /*ariaLabel, ariaLabelledBy, labelled, tabindex, focusable*/ 992) {
    			$$invalidate(4, attributes = {
    				'aria-label': ariaLabel,
    				'aria-labelledby': ariaLabelledBy,
    				'aria-hidden': labelled ? undefined : true,
    				role: labelled ? 'img' : undefined,
    				focusable: tabindex === '0' ? true : focusable,
    				tabindex
    			});
    		}
    	};

    	$$props = exclude_internal_props($$props);

    	return [
    		className,
    		id,
    		title,
    		style,
    		attributes,
    		tabindex,
    		focusable,
    		labelled,
    		ariaLabelledBy,
    		ariaLabel,
    		$$scope,
    		slots,
    		click_handler,
    		mouseover_handler,
    		mouseenter_handler,
    		mouseleave_handler,
    		keyup_handler,
    		keydown_handler
    	];
    }

    class WarningFilled16 extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$j, create_fragment$j, safe_not_equal, {
    			class: 0,
    			id: 1,
    			tabindex: 5,
    			focusable: 6,
    			title: 2,
    			style: 3
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "WarningFilled16",
    			options,
    			id: create_fragment$j.name
    		});
    	}

    	get class() {
    		throw new Error("<WarningFilled16>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set class(value) {
    		throw new Error("<WarningFilled16>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get id() {
    		throw new Error("<WarningFilled16>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set id(value) {
    		throw new Error("<WarningFilled16>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get tabindex() {
    		throw new Error("<WarningFilled16>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set tabindex(value) {
    		throw new Error("<WarningFilled16>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get focusable() {
    		throw new Error("<WarningFilled16>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set focusable(value) {
    		throw new Error("<WarningFilled16>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get title() {
    		throw new Error("<WarningFilled16>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set title(value) {
    		throw new Error("<WarningFilled16>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get style() {
    		throw new Error("<WarningFilled16>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set style(value) {
    		throw new Error("<WarningFilled16>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    var WarningFilled16$1 = WarningFilled16;

    /* node_modules\carbon-icons-svelte\lib\WarningAltFilled16\WarningAltFilled16.svelte generated by Svelte v3.42.4 */

    const file$i = "node_modules\\carbon-icons-svelte\\lib\\WarningAltFilled16\\WarningAltFilled16.svelte";

    // (40:4) {#if title}
    function create_if_block$d(ctx) {
    	let title_1;
    	let t;

    	const block = {
    		c: function create() {
    			title_1 = svg_element("title");
    			t = text(/*title*/ ctx[2]);
    			add_location(title_1, file$i, 40, 6, 1495);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, title_1, anchor);
    			append_dev(title_1, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*title*/ 4) set_data_dev(t, /*title*/ ctx[2]);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(title_1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$d.name,
    		type: "if",
    		source: "(40:4) {#if title}",
    		ctx
    	});

    	return block;
    }

    // (39:8)      
    function fallback_block$7(ctx) {
    	let if_block_anchor;
    	let if_block = /*title*/ ctx[2] && create_if_block$d(ctx);

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (/*title*/ ctx[2]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block$d(ctx);
    					if_block.c();
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}
    		},
    		d: function destroy(detaching) {
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: fallback_block$7.name,
    		type: "fallback",
    		source: "(39:8)      ",
    		ctx
    	});

    	return block;
    }

    function create_fragment$i(ctx) {
    	let svg;
    	let path0;
    	let path1;
    	let path2;
    	let current;
    	let mounted;
    	let dispose;
    	const default_slot_template = /*#slots*/ ctx[11].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[10], null);
    	const default_slot_or_fallback = default_slot || fallback_block$7(ctx);

    	let svg_levels = [
    		{ "data-carbon-icon": "WarningAltFilled16" },
    		{ xmlns: "http://www.w3.org/2000/svg" },
    		{ viewBox: "0 0 32 32" },
    		{ fill: "currentColor" },
    		{ width: "16" },
    		{ height: "16" },
    		{ class: /*className*/ ctx[0] },
    		{ preserveAspectRatio: "xMidYMid meet" },
    		{ style: /*style*/ ctx[3] },
    		{ id: /*id*/ ctx[1] },
    		/*attributes*/ ctx[4]
    	];

    	let svg_data = {};

    	for (let i = 0; i < svg_levels.length; i += 1) {
    		svg_data = assign(svg_data, svg_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			svg = svg_element("svg");
    			path0 = svg_element("path");
    			path1 = svg_element("path");
    			path2 = svg_element("path");
    			if (default_slot_or_fallback) default_slot_or_fallback.c();
    			attr_dev(path0, "fill", "none");
    			attr_dev(path0, "d", "M16,26a1.5,1.5,0,1,1,1.5-1.5A1.5,1.5,0,0,1,16,26Zm-1.125-5h2.25V12h-2.25Z");
    			attr_dev(path0, "data-icon-path", "inner-path");
    			add_location(path0, file$i, 37, 2, 1013);
    			attr_dev(path1, "d", "M16.002,6.1714h-.004L4.6487,27.9966,4.6506,28H27.3494l.0019-.0034ZM14.875,12h2.25v9h-2.25ZM16,26a1.5,1.5,0,1,1,1.5-1.5A1.5,1.5,0,0,1,16,26Z");
    			add_location(path1, file$i, 37, 133, 1144);
    			attr_dev(path2, "d", "M29,30H3a1,1,0,0,1-.8872-1.4614l13-25a1,1,0,0,1,1.7744,0l13,25A1,1,0,0,1,29,30ZM4.6507,28H27.3493l.002-.0033L16.002,6.1714h-.004L4.6487,27.9967Z");
    			add_location(path2, file$i, 37, 290, 1301);
    			set_svg_attributes(svg, svg_data);
    			add_location(svg, file$i, 23, 0, 690);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, svg, anchor);
    			append_dev(svg, path0);
    			append_dev(svg, path1);
    			append_dev(svg, path2);

    			if (default_slot_or_fallback) {
    				default_slot_or_fallback.m(svg, null);
    			}

    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(svg, "click", /*click_handler*/ ctx[12], false, false, false),
    					listen_dev(svg, "mouseover", /*mouseover_handler*/ ctx[13], false, false, false),
    					listen_dev(svg, "mouseenter", /*mouseenter_handler*/ ctx[14], false, false, false),
    					listen_dev(svg, "mouseleave", /*mouseleave_handler*/ ctx[15], false, false, false),
    					listen_dev(svg, "keyup", /*keyup_handler*/ ctx[16], false, false, false),
    					listen_dev(svg, "keydown", /*keydown_handler*/ ctx[17], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 1024)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[10],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[10])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[10], dirty, null),
    						null
    					);
    				}
    			} else {
    				if (default_slot_or_fallback && default_slot_or_fallback.p && (!current || dirty & /*title*/ 4)) {
    					default_slot_or_fallback.p(ctx, !current ? -1 : dirty);
    				}
    			}

    			set_svg_attributes(svg, svg_data = get_spread_update(svg_levels, [
    				{ "data-carbon-icon": "WarningAltFilled16" },
    				{ xmlns: "http://www.w3.org/2000/svg" },
    				{ viewBox: "0 0 32 32" },
    				{ fill: "currentColor" },
    				{ width: "16" },
    				{ height: "16" },
    				(!current || dirty & /*className*/ 1) && { class: /*className*/ ctx[0] },
    				{ preserveAspectRatio: "xMidYMid meet" },
    				(!current || dirty & /*style*/ 8) && { style: /*style*/ ctx[3] },
    				(!current || dirty & /*id*/ 2) && { id: /*id*/ ctx[1] },
    				dirty & /*attributes*/ 16 && /*attributes*/ ctx[4]
    			]));
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot_or_fallback, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot_or_fallback, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(svg);
    			if (default_slot_or_fallback) default_slot_or_fallback.d(detaching);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$i.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$i($$self, $$props, $$invalidate) {
    	let ariaLabel;
    	let ariaLabelledBy;
    	let labelled;
    	let attributes;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('WarningAltFilled16', slots, ['default']);
    	let { class: className = undefined } = $$props;
    	let { id = undefined } = $$props;
    	let { tabindex = undefined } = $$props;
    	let { focusable = false } = $$props;
    	let { title = undefined } = $$props;
    	let { style = undefined } = $$props;

    	function click_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function mouseover_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function mouseenter_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function mouseleave_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function keyup_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function keydown_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	$$self.$$set = $$new_props => {
    		$$invalidate(18, $$props = assign(assign({}, $$props), exclude_internal_props($$new_props)));
    		if ('class' in $$new_props) $$invalidate(0, className = $$new_props.class);
    		if ('id' in $$new_props) $$invalidate(1, id = $$new_props.id);
    		if ('tabindex' in $$new_props) $$invalidate(5, tabindex = $$new_props.tabindex);
    		if ('focusable' in $$new_props) $$invalidate(6, focusable = $$new_props.focusable);
    		if ('title' in $$new_props) $$invalidate(2, title = $$new_props.title);
    		if ('style' in $$new_props) $$invalidate(3, style = $$new_props.style);
    		if ('$$scope' in $$new_props) $$invalidate(10, $$scope = $$new_props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		className,
    		id,
    		tabindex,
    		focusable,
    		title,
    		style,
    		labelled,
    		ariaLabelledBy,
    		ariaLabel,
    		attributes
    	});

    	$$self.$inject_state = $$new_props => {
    		$$invalidate(18, $$props = assign(assign({}, $$props), $$new_props));
    		if ('className' in $$props) $$invalidate(0, className = $$new_props.className);
    		if ('id' in $$props) $$invalidate(1, id = $$new_props.id);
    		if ('tabindex' in $$props) $$invalidate(5, tabindex = $$new_props.tabindex);
    		if ('focusable' in $$props) $$invalidate(6, focusable = $$new_props.focusable);
    		if ('title' in $$props) $$invalidate(2, title = $$new_props.title);
    		if ('style' in $$props) $$invalidate(3, style = $$new_props.style);
    		if ('labelled' in $$props) $$invalidate(7, labelled = $$new_props.labelled);
    		if ('ariaLabelledBy' in $$props) $$invalidate(8, ariaLabelledBy = $$new_props.ariaLabelledBy);
    		if ('ariaLabel' in $$props) $$invalidate(9, ariaLabel = $$new_props.ariaLabel);
    		if ('attributes' in $$props) $$invalidate(4, attributes = $$new_props.attributes);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		$$invalidate(9, ariaLabel = $$props['aria-label']);
    		$$invalidate(8, ariaLabelledBy = $$props['aria-labelledby']);

    		if ($$self.$$.dirty & /*ariaLabel, ariaLabelledBy, title*/ 772) {
    			$$invalidate(7, labelled = ariaLabel || ariaLabelledBy || title);
    		}

    		if ($$self.$$.dirty & /*ariaLabel, ariaLabelledBy, labelled, tabindex, focusable*/ 992) {
    			$$invalidate(4, attributes = {
    				'aria-label': ariaLabel,
    				'aria-labelledby': ariaLabelledBy,
    				'aria-hidden': labelled ? undefined : true,
    				role: labelled ? 'img' : undefined,
    				focusable: tabindex === '0' ? true : focusable,
    				tabindex
    			});
    		}
    	};

    	$$props = exclude_internal_props($$props);

    	return [
    		className,
    		id,
    		title,
    		style,
    		attributes,
    		tabindex,
    		focusable,
    		labelled,
    		ariaLabelledBy,
    		ariaLabel,
    		$$scope,
    		slots,
    		click_handler,
    		mouseover_handler,
    		mouseenter_handler,
    		mouseleave_handler,
    		keyup_handler,
    		keydown_handler
    	];
    }

    class WarningAltFilled16 extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$i, create_fragment$i, safe_not_equal, {
    			class: 0,
    			id: 1,
    			tabindex: 5,
    			focusable: 6,
    			title: 2,
    			style: 3
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "WarningAltFilled16",
    			options,
    			id: create_fragment$i.name
    		});
    	}

    	get class() {
    		throw new Error("<WarningAltFilled16>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set class(value) {
    		throw new Error("<WarningAltFilled16>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get id() {
    		throw new Error("<WarningAltFilled16>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set id(value) {
    		throw new Error("<WarningAltFilled16>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get tabindex() {
    		throw new Error("<WarningAltFilled16>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set tabindex(value) {
    		throw new Error("<WarningAltFilled16>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get focusable() {
    		throw new Error("<WarningAltFilled16>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set focusable(value) {
    		throw new Error("<WarningAltFilled16>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get title() {
    		throw new Error("<WarningAltFilled16>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set title(value) {
    		throw new Error("<WarningAltFilled16>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get style() {
    		throw new Error("<WarningAltFilled16>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set style(value) {
    		throw new Error("<WarningAltFilled16>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    var WarningAltFilled16$1 = WarningAltFilled16;

    /* node_modules\carbon-icons-svelte\lib\EditOff16\EditOff16.svelte generated by Svelte v3.42.4 */

    const file$h = "node_modules\\carbon-icons-svelte\\lib\\EditOff16\\EditOff16.svelte";

    // (40:4) {#if title}
    function create_if_block$c(ctx) {
    	let title_1;
    	let t;

    	const block = {
    		c: function create() {
    			title_1 = svg_element("title");
    			t = text(/*title*/ ctx[2]);
    			add_location(title_1, file$h, 40, 6, 1331);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, title_1, anchor);
    			append_dev(title_1, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*title*/ 4) set_data_dev(t, /*title*/ ctx[2]);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(title_1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$c.name,
    		type: "if",
    		source: "(40:4) {#if title}",
    		ctx
    	});

    	return block;
    }

    // (39:8)      
    function fallback_block$6(ctx) {
    	let if_block_anchor;
    	let if_block = /*title*/ ctx[2] && create_if_block$c(ctx);

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (/*title*/ ctx[2]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block$c(ctx);
    					if_block.c();
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}
    		},
    		d: function destroy(detaching) {
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: fallback_block$6.name,
    		type: "fallback",
    		source: "(39:8)      ",
    		ctx
    	});

    	return block;
    }

    function create_fragment$h(ctx) {
    	let svg;
    	let path;
    	let current;
    	let mounted;
    	let dispose;
    	const default_slot_template = /*#slots*/ ctx[11].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[10], null);
    	const default_slot_or_fallback = default_slot || fallback_block$6(ctx);

    	let svg_levels = [
    		{ "data-carbon-icon": "EditOff16" },
    		{ xmlns: "http://www.w3.org/2000/svg" },
    		{ viewBox: "0 0 32 32" },
    		{ fill: "currentColor" },
    		{ width: "16" },
    		{ height: "16" },
    		{ class: /*className*/ ctx[0] },
    		{ preserveAspectRatio: "xMidYMid meet" },
    		{ style: /*style*/ ctx[3] },
    		{ id: /*id*/ ctx[1] },
    		/*attributes*/ ctx[4]
    	];

    	let svg_data = {};

    	for (let i = 0; i < svg_levels.length; i += 1) {
    		svg_data = assign(svg_data, svg_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			svg = svg_element("svg");
    			path = svg_element("path");
    			if (default_slot_or_fallback) default_slot_or_fallback.c();
    			attr_dev(path, "d", "M30 28.6L3.4 2 2 3.4l10.1 10.1L4 21.6V28h6.4l8.1-8.1L28.6 30 30 28.6zM9.6 26H6v-3.6l7.5-7.5 3.6 3.6L9.6 26zM29.4 6.2L29.4 6.2l-3.6-3.6c-.8-.8-2-.8-2.8 0l0 0 0 0-8 8 1.4 1.4L20 8.4l3.6 3.6L20 15.6l1.4 1.4 8-8C30.2 8.2 30.2 7 29.4 6.2L29.4 6.2zM25 10.6L21.4 7l3-3L28 7.6 25 10.6z");
    			add_location(path, file$h, 37, 2, 1004);
    			set_svg_attributes(svg, svg_data);
    			add_location(svg, file$h, 23, 0, 690);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, svg, anchor);
    			append_dev(svg, path);

    			if (default_slot_or_fallback) {
    				default_slot_or_fallback.m(svg, null);
    			}

    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(svg, "click", /*click_handler*/ ctx[12], false, false, false),
    					listen_dev(svg, "mouseover", /*mouseover_handler*/ ctx[13], false, false, false),
    					listen_dev(svg, "mouseenter", /*mouseenter_handler*/ ctx[14], false, false, false),
    					listen_dev(svg, "mouseleave", /*mouseleave_handler*/ ctx[15], false, false, false),
    					listen_dev(svg, "keyup", /*keyup_handler*/ ctx[16], false, false, false),
    					listen_dev(svg, "keydown", /*keydown_handler*/ ctx[17], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 1024)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[10],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[10])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[10], dirty, null),
    						null
    					);
    				}
    			} else {
    				if (default_slot_or_fallback && default_slot_or_fallback.p && (!current || dirty & /*title*/ 4)) {
    					default_slot_or_fallback.p(ctx, !current ? -1 : dirty);
    				}
    			}

    			set_svg_attributes(svg, svg_data = get_spread_update(svg_levels, [
    				{ "data-carbon-icon": "EditOff16" },
    				{ xmlns: "http://www.w3.org/2000/svg" },
    				{ viewBox: "0 0 32 32" },
    				{ fill: "currentColor" },
    				{ width: "16" },
    				{ height: "16" },
    				(!current || dirty & /*className*/ 1) && { class: /*className*/ ctx[0] },
    				{ preserveAspectRatio: "xMidYMid meet" },
    				(!current || dirty & /*style*/ 8) && { style: /*style*/ ctx[3] },
    				(!current || dirty & /*id*/ 2) && { id: /*id*/ ctx[1] },
    				dirty & /*attributes*/ 16 && /*attributes*/ ctx[4]
    			]));
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot_or_fallback, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot_or_fallback, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(svg);
    			if (default_slot_or_fallback) default_slot_or_fallback.d(detaching);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$h.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$h($$self, $$props, $$invalidate) {
    	let ariaLabel;
    	let ariaLabelledBy;
    	let labelled;
    	let attributes;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('EditOff16', slots, ['default']);
    	let { class: className = undefined } = $$props;
    	let { id = undefined } = $$props;
    	let { tabindex = undefined } = $$props;
    	let { focusable = false } = $$props;
    	let { title = undefined } = $$props;
    	let { style = undefined } = $$props;

    	function click_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function mouseover_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function mouseenter_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function mouseleave_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function keyup_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function keydown_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	$$self.$$set = $$new_props => {
    		$$invalidate(18, $$props = assign(assign({}, $$props), exclude_internal_props($$new_props)));
    		if ('class' in $$new_props) $$invalidate(0, className = $$new_props.class);
    		if ('id' in $$new_props) $$invalidate(1, id = $$new_props.id);
    		if ('tabindex' in $$new_props) $$invalidate(5, tabindex = $$new_props.tabindex);
    		if ('focusable' in $$new_props) $$invalidate(6, focusable = $$new_props.focusable);
    		if ('title' in $$new_props) $$invalidate(2, title = $$new_props.title);
    		if ('style' in $$new_props) $$invalidate(3, style = $$new_props.style);
    		if ('$$scope' in $$new_props) $$invalidate(10, $$scope = $$new_props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		className,
    		id,
    		tabindex,
    		focusable,
    		title,
    		style,
    		labelled,
    		ariaLabelledBy,
    		ariaLabel,
    		attributes
    	});

    	$$self.$inject_state = $$new_props => {
    		$$invalidate(18, $$props = assign(assign({}, $$props), $$new_props));
    		if ('className' in $$props) $$invalidate(0, className = $$new_props.className);
    		if ('id' in $$props) $$invalidate(1, id = $$new_props.id);
    		if ('tabindex' in $$props) $$invalidate(5, tabindex = $$new_props.tabindex);
    		if ('focusable' in $$props) $$invalidate(6, focusable = $$new_props.focusable);
    		if ('title' in $$props) $$invalidate(2, title = $$new_props.title);
    		if ('style' in $$props) $$invalidate(3, style = $$new_props.style);
    		if ('labelled' in $$props) $$invalidate(7, labelled = $$new_props.labelled);
    		if ('ariaLabelledBy' in $$props) $$invalidate(8, ariaLabelledBy = $$new_props.ariaLabelledBy);
    		if ('ariaLabel' in $$props) $$invalidate(9, ariaLabel = $$new_props.ariaLabel);
    		if ('attributes' in $$props) $$invalidate(4, attributes = $$new_props.attributes);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		$$invalidate(9, ariaLabel = $$props['aria-label']);
    		$$invalidate(8, ariaLabelledBy = $$props['aria-labelledby']);

    		if ($$self.$$.dirty & /*ariaLabel, ariaLabelledBy, title*/ 772) {
    			$$invalidate(7, labelled = ariaLabel || ariaLabelledBy || title);
    		}

    		if ($$self.$$.dirty & /*ariaLabel, ariaLabelledBy, labelled, tabindex, focusable*/ 992) {
    			$$invalidate(4, attributes = {
    				'aria-label': ariaLabel,
    				'aria-labelledby': ariaLabelledBy,
    				'aria-hidden': labelled ? undefined : true,
    				role: labelled ? 'img' : undefined,
    				focusable: tabindex === '0' ? true : focusable,
    				tabindex
    			});
    		}
    	};

    	$$props = exclude_internal_props($$props);

    	return [
    		className,
    		id,
    		title,
    		style,
    		attributes,
    		tabindex,
    		focusable,
    		labelled,
    		ariaLabelledBy,
    		ariaLabel,
    		$$scope,
    		slots,
    		click_handler,
    		mouseover_handler,
    		mouseenter_handler,
    		mouseleave_handler,
    		keyup_handler,
    		keydown_handler
    	];
    }

    class EditOff16 extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$h, create_fragment$h, safe_not_equal, {
    			class: 0,
    			id: 1,
    			tabindex: 5,
    			focusable: 6,
    			title: 2,
    			style: 3
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "EditOff16",
    			options,
    			id: create_fragment$h.name
    		});
    	}

    	get class() {
    		throw new Error("<EditOff16>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set class(value) {
    		throw new Error("<EditOff16>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get id() {
    		throw new Error("<EditOff16>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set id(value) {
    		throw new Error("<EditOff16>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get tabindex() {
    		throw new Error("<EditOff16>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set tabindex(value) {
    		throw new Error("<EditOff16>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get focusable() {
    		throw new Error("<EditOff16>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set focusable(value) {
    		throw new Error("<EditOff16>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get title() {
    		throw new Error("<EditOff16>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set title(value) {
    		throw new Error("<EditOff16>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get style() {
    		throw new Error("<EditOff16>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set style(value) {
    		throw new Error("<EditOff16>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    var EditOff16$1 = EditOff16;

    /* node_modules\carbon-components-svelte\src\TextInput\TextInput.svelte generated by Svelte v3.42.4 */
    const file$g = "node_modules\\carbon-components-svelte\\src\\TextInput\\TextInput.svelte";
    const get_labelText_slot_changes_1 = dirty => ({});
    const get_labelText_slot_context_1 = ctx => ({});
    const get_labelText_slot_changes$2 = dirty => ({});
    const get_labelText_slot_context$2 = ctx => ({});

    // (92:2) {#if inline}
    function create_if_block_10$1(ctx) {
    	let div;
    	let t;
    	let current;
    	let if_block0 = /*labelText*/ ctx[10] && create_if_block_12(ctx);
    	let if_block1 = !/*isFluid*/ ctx[21] && /*helperText*/ ctx[7] && create_if_block_11(ctx);

    	const block = {
    		c: function create() {
    			div = element("div");
    			if (if_block0) if_block0.c();
    			t = space();
    			if (if_block1) if_block1.c();
    			toggle_class(div, "bx--text-input__label-helper-wrapper", true);
    			add_location(div, file$g, 92, 4, 2363);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			if (if_block0) if_block0.m(div, null);
    			append_dev(div, t);
    			if (if_block1) if_block1.m(div, null);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (/*labelText*/ ctx[10]) {
    				if (if_block0) {
    					if_block0.p(ctx, dirty);

    					if (dirty[0] & /*labelText*/ 1024) {
    						transition_in(if_block0, 1);
    					}
    				} else {
    					if_block0 = create_if_block_12(ctx);
    					if_block0.c();
    					transition_in(if_block0, 1);
    					if_block0.m(div, t);
    				}
    			} else if (if_block0) {
    				group_outros();

    				transition_out(if_block0, 1, 1, () => {
    					if_block0 = null;
    				});

    				check_outros();
    			}

    			if (!/*isFluid*/ ctx[21] && /*helperText*/ ctx[7]) {
    				if (if_block1) {
    					if_block1.p(ctx, dirty);
    				} else {
    					if_block1 = create_if_block_11(ctx);
    					if_block1.c();
    					if_block1.m(div, null);
    				}
    			} else if (if_block1) {
    				if_block1.d(1);
    				if_block1 = null;
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block0);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block0);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (if_block0) if_block0.d();
    			if (if_block1) if_block1.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_10$1.name,
    		type: "if",
    		source: "(92:2) {#if inline}",
    		ctx
    	});

    	return block;
    }

    // (94:6) {#if labelText}
    function create_if_block_12(ctx) {
    	let label;
    	let label_class_value;
    	let current;
    	const labelText_slot_template = /*#slots*/ ctx[24].labelText;
    	const labelText_slot = create_slot(labelText_slot_template, ctx, /*$$scope*/ ctx[23], get_labelText_slot_context$2);
    	const labelText_slot_or_fallback = labelText_slot || fallback_block_1$1(ctx);

    	const block = {
    		c: function create() {
    			label = element("label");
    			if (labelText_slot_or_fallback) labelText_slot_or_fallback.c();
    			attr_dev(label, "for", /*id*/ ctx[8]);
    			attr_dev(label, "class", label_class_value = /*inline*/ ctx[17] && !!/*size*/ ctx[2] && `bx--label--inline--${/*size*/ ctx[2]}`);
    			toggle_class(label, "bx--label", true);
    			toggle_class(label, "bx--visually-hidden", /*hideLabel*/ ctx[11]);
    			toggle_class(label, "bx--label--disabled", /*disabled*/ ctx[6]);
    			toggle_class(label, "bx--label--inline", /*inline*/ ctx[17]);
    			add_location(label, file$g, 94, 8, 2451);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, label, anchor);

    			if (labelText_slot_or_fallback) {
    				labelText_slot_or_fallback.m(label, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (labelText_slot) {
    				if (labelText_slot.p && (!current || dirty[0] & /*$$scope*/ 8388608)) {
    					update_slot_base(
    						labelText_slot,
    						labelText_slot_template,
    						ctx,
    						/*$$scope*/ ctx[23],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[23])
    						: get_slot_changes(labelText_slot_template, /*$$scope*/ ctx[23], dirty, get_labelText_slot_changes$2),
    						get_labelText_slot_context$2
    					);
    				}
    			} else {
    				if (labelText_slot_or_fallback && labelText_slot_or_fallback.p && (!current || dirty[0] & /*labelText*/ 1024)) {
    					labelText_slot_or_fallback.p(ctx, !current ? [-1, -1] : dirty);
    				}
    			}

    			if (!current || dirty[0] & /*id*/ 256) {
    				attr_dev(label, "for", /*id*/ ctx[8]);
    			}

    			if (!current || dirty[0] & /*inline, size*/ 131076 && label_class_value !== (label_class_value = /*inline*/ ctx[17] && !!/*size*/ ctx[2] && `bx--label--inline--${/*size*/ ctx[2]}`)) {
    				attr_dev(label, "class", label_class_value);
    			}

    			if (dirty[0] & /*inline, size*/ 131076) {
    				toggle_class(label, "bx--label", true);
    			}

    			if (dirty[0] & /*inline, size, hideLabel*/ 133124) {
    				toggle_class(label, "bx--visually-hidden", /*hideLabel*/ ctx[11]);
    			}

    			if (dirty[0] & /*inline, size, disabled*/ 131140) {
    				toggle_class(label, "bx--label--disabled", /*disabled*/ ctx[6]);
    			}

    			if (dirty[0] & /*inline, size, inline*/ 131076) {
    				toggle_class(label, "bx--label--inline", /*inline*/ ctx[17]);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(labelText_slot_or_fallback, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(labelText_slot_or_fallback, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(label);
    			if (labelText_slot_or_fallback) labelText_slot_or_fallback.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_12.name,
    		type: "if",
    		source: "(94:6) {#if labelText}",
    		ctx
    	});

    	return block;
    }

    // (103:33)              
    function fallback_block_1$1(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text(/*labelText*/ ctx[10]);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*labelText*/ 1024) set_data_dev(t, /*labelText*/ ctx[10]);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: fallback_block_1$1.name,
    		type: "fallback",
    		source: "(103:33)              ",
    		ctx
    	});

    	return block;
    }

    // (108:6) {#if !isFluid && helperText}
    function create_if_block_11(ctx) {
    	let div;
    	let t;

    	const block = {
    		c: function create() {
    			div = element("div");
    			t = text(/*helperText*/ ctx[7]);
    			toggle_class(div, "bx--form__helper-text", true);
    			toggle_class(div, "bx--form__helper-text--disabled", /*disabled*/ ctx[6]);
    			toggle_class(div, "bx--form__helper-text--inline", /*inline*/ ctx[17]);
    			add_location(div, file$g, 108, 8, 2885);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*helperText*/ 128) set_data_dev(t, /*helperText*/ ctx[7]);

    			if (dirty[0] & /*disabled*/ 64) {
    				toggle_class(div, "bx--form__helper-text--disabled", /*disabled*/ ctx[6]);
    			}

    			if (dirty[0] & /*inline*/ 131072) {
    				toggle_class(div, "bx--form__helper-text--inline", /*inline*/ ctx[17]);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_11.name,
    		type: "if",
    		source: "(108:6) {#if !isFluid && helperText}",
    		ctx
    	});

    	return block;
    }

    // (119:2) {#if !inline && labelText}
    function create_if_block_9$1(ctx) {
    	let label;
    	let label_class_value;
    	let current;
    	const labelText_slot_template = /*#slots*/ ctx[24].labelText;
    	const labelText_slot = create_slot(labelText_slot_template, ctx, /*$$scope*/ ctx[23], get_labelText_slot_context_1);
    	const labelText_slot_or_fallback = labelText_slot || fallback_block$5(ctx);

    	const block = {
    		c: function create() {
    			label = element("label");
    			if (labelText_slot_or_fallback) labelText_slot_or_fallback.c();
    			attr_dev(label, "for", /*id*/ ctx[8]);
    			attr_dev(label, "class", label_class_value = /*inline*/ ctx[17] && !!/*size*/ ctx[2] && `bx--label--inline--${/*size*/ ctx[2]}`);
    			toggle_class(label, "bx--label", true);
    			toggle_class(label, "bx--visually-hidden", /*hideLabel*/ ctx[11]);
    			toggle_class(label, "bx--label--disabled", /*disabled*/ ctx[6]);
    			toggle_class(label, "bx--label--inline", /*inline*/ ctx[17]);
    			add_location(label, file$g, 119, 4, 3167);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, label, anchor);

    			if (labelText_slot_or_fallback) {
    				labelText_slot_or_fallback.m(label, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (labelText_slot) {
    				if (labelText_slot.p && (!current || dirty[0] & /*$$scope*/ 8388608)) {
    					update_slot_base(
    						labelText_slot,
    						labelText_slot_template,
    						ctx,
    						/*$$scope*/ ctx[23],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[23])
    						: get_slot_changes(labelText_slot_template, /*$$scope*/ ctx[23], dirty, get_labelText_slot_changes_1),
    						get_labelText_slot_context_1
    					);
    				}
    			} else {
    				if (labelText_slot_or_fallback && labelText_slot_or_fallback.p && (!current || dirty[0] & /*labelText*/ 1024)) {
    					labelText_slot_or_fallback.p(ctx, !current ? [-1, -1] : dirty);
    				}
    			}

    			if (!current || dirty[0] & /*id*/ 256) {
    				attr_dev(label, "for", /*id*/ ctx[8]);
    			}

    			if (!current || dirty[0] & /*inline, size*/ 131076 && label_class_value !== (label_class_value = /*inline*/ ctx[17] && !!/*size*/ ctx[2] && `bx--label--inline--${/*size*/ ctx[2]}`)) {
    				attr_dev(label, "class", label_class_value);
    			}

    			if (dirty[0] & /*inline, size*/ 131076) {
    				toggle_class(label, "bx--label", true);
    			}

    			if (dirty[0] & /*inline, size, hideLabel*/ 133124) {
    				toggle_class(label, "bx--visually-hidden", /*hideLabel*/ ctx[11]);
    			}

    			if (dirty[0] & /*inline, size, disabled*/ 131140) {
    				toggle_class(label, "bx--label--disabled", /*disabled*/ ctx[6]);
    			}

    			if (dirty[0] & /*inline, size, inline*/ 131076) {
    				toggle_class(label, "bx--label--inline", /*inline*/ ctx[17]);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(labelText_slot_or_fallback, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(labelText_slot_or_fallback, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(label);
    			if (labelText_slot_or_fallback) labelText_slot_or_fallback.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_9$1.name,
    		type: "if",
    		source: "(119:2) {#if !inline && labelText}",
    		ctx
    	});

    	return block;
    }

    // (128:29)          
    function fallback_block$5(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text(/*labelText*/ ctx[10]);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*labelText*/ 1024) set_data_dev(t, /*labelText*/ ctx[10]);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: fallback_block$5.name,
    		type: "fallback",
    		source: "(128:29)          ",
    		ctx
    	});

    	return block;
    }

    // (143:6) {#if invalid}
    function create_if_block_8$1(ctx) {
    	let warningfilled16;
    	let current;

    	warningfilled16 = new WarningFilled16$1({
    			props: { class: "bx--text-input__invalid-icon" },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(warningfilled16.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(warningfilled16, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(warningfilled16.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(warningfilled16.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(warningfilled16, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_8$1.name,
    		type: "if",
    		source: "(143:6) {#if invalid}",
    		ctx
    	});

    	return block;
    }

    // (146:6) {#if !invalid && warn}
    function create_if_block_7$1(ctx) {
    	let warningaltfilled16;
    	let current;

    	warningaltfilled16 = new WarningAltFilled16$1({
    			props: {
    				class: "bx--text-input__invalid-icon\n            bx--text-input__invalid-icon--warning"
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(warningaltfilled16.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(warningaltfilled16, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(warningaltfilled16.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(warningaltfilled16.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(warningaltfilled16, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_7$1.name,
    		type: "if",
    		source: "(146:6) {#if !invalid && warn}",
    		ctx
    	});

    	return block;
    }

    // (152:6) {#if readonly}
    function create_if_block_6$1(ctx) {
    	let editoff16;
    	let current;

    	editoff16 = new EditOff16$1({
    			props: { class: "bx--text-input__readonly-icon" },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(editoff16.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(editoff16, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(editoff16.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(editoff16.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(editoff16, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_6$1.name,
    		type: "if",
    		source: "(152:6) {#if readonly}",
    		ctx
    	});

    	return block;
    }

    // (185:6) {#if isFluid}
    function create_if_block_5$1(ctx) {
    	let hr;

    	const block = {
    		c: function create() {
    			hr = element("hr");
    			toggle_class(hr, "bx--text-input__divider", true);
    			add_location(hr, file$g, 185, 8, 5163);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, hr, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(hr);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_5$1.name,
    		type: "if",
    		source: "(185:6) {#if isFluid}",
    		ctx
    	});

    	return block;
    }

    // (188:6) {#if isFluid && !inline && invalid}
    function create_if_block_4$2(ctx) {
    	let div;
    	let t;

    	const block = {
    		c: function create() {
    			div = element("div");
    			t = text(/*invalidText*/ ctx[13]);
    			attr_dev(div, "id", /*errorId*/ ctx[20]);
    			toggle_class(div, "bx--form-requirement", true);
    			add_location(div, file$g, 188, 8, 5271);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*invalidText*/ 8192) set_data_dev(t, /*invalidText*/ ctx[13]);

    			if (dirty[0] & /*errorId*/ 1048576) {
    				attr_dev(div, "id", /*errorId*/ ctx[20]);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_4$2.name,
    		type: "if",
    		source: "(188:6) {#if isFluid && !inline && invalid}",
    		ctx
    	});

    	return block;
    }

    // (193:6) {#if isFluid && !inline && warn}
    function create_if_block_3$3(ctx) {
    	let div;
    	let t;

    	const block = {
    		c: function create() {
    			div = element("div");
    			t = text(/*warnText*/ ctx[15]);
    			attr_dev(div, "id", /*warnId*/ ctx[19]);
    			toggle_class(div, "bx--form-requirement", true);
    			add_location(div, file$g, 193, 8, 5426);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*warnText*/ 32768) set_data_dev(t, /*warnText*/ ctx[15]);

    			if (dirty[0] & /*warnId*/ 524288) {
    				attr_dev(div, "id", /*warnId*/ ctx[19]);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_3$3.name,
    		type: "if",
    		source: "(193:6) {#if isFluid && !inline && warn}",
    		ctx
    	});

    	return block;
    }

    // (197:4) {#if !invalid && !warn && !isFluid && !inline && helperText}
    function create_if_block_2$3(ctx) {
    	let div;
    	let t;

    	const block = {
    		c: function create() {
    			div = element("div");
    			t = text(/*helperText*/ ctx[7]);
    			toggle_class(div, "bx--form__helper-text", true);
    			toggle_class(div, "bx--form__helper-text--disabled", /*disabled*/ ctx[6]);
    			toggle_class(div, "bx--form__helper-text--inline", /*inline*/ ctx[17]);
    			add_location(div, file$g, 197, 6, 5592);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*helperText*/ 128) set_data_dev(t, /*helperText*/ ctx[7]);

    			if (dirty[0] & /*disabled*/ 64) {
    				toggle_class(div, "bx--form__helper-text--disabled", /*disabled*/ ctx[6]);
    			}

    			if (dirty[0] & /*inline*/ 131072) {
    				toggle_class(div, "bx--form__helper-text--inline", /*inline*/ ctx[17]);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2$3.name,
    		type: "if",
    		source: "(197:4) {#if !invalid && !warn && !isFluid && !inline && helperText}",
    		ctx
    	});

    	return block;
    }

    // (206:4) {#if !isFluid && invalid}
    function create_if_block_1$4(ctx) {
    	let div;
    	let t;

    	const block = {
    		c: function create() {
    			div = element("div");
    			t = text(/*invalidText*/ ctx[13]);
    			attr_dev(div, "id", /*errorId*/ ctx[20]);
    			toggle_class(div, "bx--form-requirement", true);
    			add_location(div, file$g, 206, 6, 5844);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*invalidText*/ 8192) set_data_dev(t, /*invalidText*/ ctx[13]);

    			if (dirty[0] & /*errorId*/ 1048576) {
    				attr_dev(div, "id", /*errorId*/ ctx[20]);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$4.name,
    		type: "if",
    		source: "(206:4) {#if !isFluid && invalid}",
    		ctx
    	});

    	return block;
    }

    // (211:4) {#if !isFluid && !invalid && warn}
    function create_if_block$b(ctx) {
    	let div;
    	let t;

    	const block = {
    		c: function create() {
    			div = element("div");
    			t = text(/*warnText*/ ctx[15]);
    			attr_dev(div, "id", /*warnId*/ ctx[19]);
    			toggle_class(div, "bx--form-requirement", true);
    			add_location(div, file$g, 211, 6, 5991);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*warnText*/ 32768) set_data_dev(t, /*warnText*/ ctx[15]);

    			if (dirty[0] & /*warnId*/ 524288) {
    				attr_dev(div, "id", /*warnId*/ ctx[19]);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$b.name,
    		type: "if",
    		source: "(211:4) {#if !isFluid && !invalid && warn}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$g(ctx) {
    	let div2;
    	let t0;
    	let t1;
    	let div1;
    	let div0;
    	let t2;
    	let t3;
    	let t4;
    	let input;
    	let input_data_invalid_value;
    	let input_aria_invalid_value;
    	let input_data_warn_value;
    	let input_aria_describedby_value;
    	let input_class_value;
    	let t5;
    	let t6;
    	let t7;
    	let div0_data_invalid_value;
    	let div0_data_warn_value;
    	let t8;
    	let t9;
    	let t10;
    	let current;
    	let mounted;
    	let dispose;
    	let if_block0 = /*inline*/ ctx[17] && create_if_block_10$1(ctx);
    	let if_block1 = !/*inline*/ ctx[17] && /*labelText*/ ctx[10] && create_if_block_9$1(ctx);
    	let if_block2 = /*invalid*/ ctx[12] && create_if_block_8$1(ctx);
    	let if_block3 = !/*invalid*/ ctx[12] && /*warn*/ ctx[14] && create_if_block_7$1(ctx);
    	let if_block4 = /*readonly*/ ctx[18] && create_if_block_6$1(ctx);

    	let input_levels = [
    		{
    			"data-invalid": input_data_invalid_value = /*invalid*/ ctx[12] || undefined
    		},
    		{
    			"aria-invalid": input_aria_invalid_value = /*invalid*/ ctx[12] || undefined
    		},
    		{
    			"data-warn": input_data_warn_value = /*warn*/ ctx[14] || undefined
    		},
    		{
    			"aria-describedby": input_aria_describedby_value = /*invalid*/ ctx[12]
    			? /*errorId*/ ctx[20]
    			: /*warn*/ ctx[14] ? /*warnId*/ ctx[19] : undefined
    		},
    		{ disabled: /*disabled*/ ctx[6] },
    		{ id: /*id*/ ctx[8] },
    		{ name: /*name*/ ctx[9] },
    		{ placeholder: /*placeholder*/ ctx[4] },
    		{ type: /*type*/ ctx[3] },
    		{ value: /*value*/ ctx[0] },
    		{ required: /*required*/ ctx[16] },
    		{ readOnly: /*readonly*/ ctx[18] },
    		/*$$restProps*/ ctx[22],
    		{
    			class: input_class_value = /*size*/ ctx[2] && `bx--text-input--${/*size*/ ctx[2]}`
    		}
    	];

    	let input_data = {};

    	for (let i = 0; i < input_levels.length; i += 1) {
    		input_data = assign(input_data, input_levels[i]);
    	}

    	let if_block5 = /*isFluid*/ ctx[21] && create_if_block_5$1(ctx);
    	let if_block6 = /*isFluid*/ ctx[21] && !/*inline*/ ctx[17] && /*invalid*/ ctx[12] && create_if_block_4$2(ctx);
    	let if_block7 = /*isFluid*/ ctx[21] && !/*inline*/ ctx[17] && /*warn*/ ctx[14] && create_if_block_3$3(ctx);
    	let if_block8 = !/*invalid*/ ctx[12] && !/*warn*/ ctx[14] && !/*isFluid*/ ctx[21] && !/*inline*/ ctx[17] && /*helperText*/ ctx[7] && create_if_block_2$3(ctx);
    	let if_block9 = !/*isFluid*/ ctx[21] && /*invalid*/ ctx[12] && create_if_block_1$4(ctx);
    	let if_block10 = !/*isFluid*/ ctx[21] && !/*invalid*/ ctx[12] && /*warn*/ ctx[14] && create_if_block$b(ctx);

    	const block = {
    		c: function create() {
    			div2 = element("div");
    			if (if_block0) if_block0.c();
    			t0 = space();
    			if (if_block1) if_block1.c();
    			t1 = space();
    			div1 = element("div");
    			div0 = element("div");
    			if (if_block2) if_block2.c();
    			t2 = space();
    			if (if_block3) if_block3.c();
    			t3 = space();
    			if (if_block4) if_block4.c();
    			t4 = space();
    			input = element("input");
    			t5 = space();
    			if (if_block5) if_block5.c();
    			t6 = space();
    			if (if_block6) if_block6.c();
    			t7 = space();
    			if (if_block7) if_block7.c();
    			t8 = space();
    			if (if_block8) if_block8.c();
    			t9 = space();
    			if (if_block9) if_block9.c();
    			t10 = space();
    			if (if_block10) if_block10.c();
    			set_attributes(input, input_data);
    			toggle_class(input, "bx--text-input", true);
    			toggle_class(input, "bx--text-input--light", /*light*/ ctx[5]);
    			toggle_class(input, "bx--text-input--invalid", /*invalid*/ ctx[12]);
    			toggle_class(input, "bx--text-input--warn", /*warn*/ ctx[14]);
    			add_location(input, file$g, 154, 6, 4234);
    			attr_dev(div0, "data-invalid", div0_data_invalid_value = /*invalid*/ ctx[12] || undefined);
    			attr_dev(div0, "data-warn", div0_data_warn_value = /*warn*/ ctx[14] || undefined);
    			toggle_class(div0, "bx--text-input__field-wrapper", true);
    			toggle_class(div0, "bx--text-input__field-wrapper--warning", !/*invalid*/ ctx[12] && /*warn*/ ctx[14]);
    			add_location(div0, file$g, 136, 4, 3645);
    			toggle_class(div1, "bx--text-input__field-outer-wrapper", true);
    			toggle_class(div1, "bx--text-input__field-outer-wrapper--inline", /*inline*/ ctx[17]);
    			add_location(div1, file$g, 132, 2, 3512);
    			toggle_class(div2, "bx--form-item", true);
    			toggle_class(div2, "bx--text-input-wrapper", true);
    			toggle_class(div2, "bx--text-input-wrapper--inline", /*inline*/ ctx[17]);
    			toggle_class(div2, "bx--text-input-wrapper--light", /*light*/ ctx[5]);
    			toggle_class(div2, "bx--text-input-wrapper--readonly", /*readonly*/ ctx[18]);
    			add_location(div2, file$g, 80, 0, 2056);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div2, anchor);
    			if (if_block0) if_block0.m(div2, null);
    			append_dev(div2, t0);
    			if (if_block1) if_block1.m(div2, null);
    			append_dev(div2, t1);
    			append_dev(div2, div1);
    			append_dev(div1, div0);
    			if (if_block2) if_block2.m(div0, null);
    			append_dev(div0, t2);
    			if (if_block3) if_block3.m(div0, null);
    			append_dev(div0, t3);
    			if (if_block4) if_block4.m(div0, null);
    			append_dev(div0, t4);
    			append_dev(div0, input);
    			input.value = input_data.value;
    			if (input.autofocus) input.focus();
    			/*input_binding*/ ctx[35](input);
    			append_dev(div0, t5);
    			if (if_block5) if_block5.m(div0, null);
    			append_dev(div0, t6);
    			if (if_block6) if_block6.m(div0, null);
    			append_dev(div0, t7);
    			if (if_block7) if_block7.m(div0, null);
    			append_dev(div1, t8);
    			if (if_block8) if_block8.m(div1, null);
    			append_dev(div1, t9);
    			if (if_block9) if_block9.m(div1, null);
    			append_dev(div1, t10);
    			if (if_block10) if_block10.m(div1, null);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(input, "change", /*change_handler*/ ctx[29], false, false, false),
    					listen_dev(input, "input", /*input_handler*/ ctx[30], false, false, false),
    					listen_dev(input, "input", /*input_handler_1*/ ctx[36], false, false, false),
    					listen_dev(input, "keydown", /*keydown_handler*/ ctx[31], false, false, false),
    					listen_dev(input, "keyup", /*keyup_handler*/ ctx[32], false, false, false),
    					listen_dev(input, "focus", /*focus_handler*/ ctx[33], false, false, false),
    					listen_dev(input, "blur", /*blur_handler*/ ctx[34], false, false, false),
    					listen_dev(div2, "click", /*click_handler*/ ctx[25], false, false, false),
    					listen_dev(div2, "mouseover", /*mouseover_handler*/ ctx[26], false, false, false),
    					listen_dev(div2, "mouseenter", /*mouseenter_handler*/ ctx[27], false, false, false),
    					listen_dev(div2, "mouseleave", /*mouseleave_handler*/ ctx[28], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (/*inline*/ ctx[17]) {
    				if (if_block0) {
    					if_block0.p(ctx, dirty);

    					if (dirty[0] & /*inline*/ 131072) {
    						transition_in(if_block0, 1);
    					}
    				} else {
    					if_block0 = create_if_block_10$1(ctx);
    					if_block0.c();
    					transition_in(if_block0, 1);
    					if_block0.m(div2, t0);
    				}
    			} else if (if_block0) {
    				group_outros();

    				transition_out(if_block0, 1, 1, () => {
    					if_block0 = null;
    				});

    				check_outros();
    			}

    			if (!/*inline*/ ctx[17] && /*labelText*/ ctx[10]) {
    				if (if_block1) {
    					if_block1.p(ctx, dirty);

    					if (dirty[0] & /*inline, labelText*/ 132096) {
    						transition_in(if_block1, 1);
    					}
    				} else {
    					if_block1 = create_if_block_9$1(ctx);
    					if_block1.c();
    					transition_in(if_block1, 1);
    					if_block1.m(div2, t1);
    				}
    			} else if (if_block1) {
    				group_outros();

    				transition_out(if_block1, 1, 1, () => {
    					if_block1 = null;
    				});

    				check_outros();
    			}

    			if (/*invalid*/ ctx[12]) {
    				if (if_block2) {
    					if (dirty[0] & /*invalid*/ 4096) {
    						transition_in(if_block2, 1);
    					}
    				} else {
    					if_block2 = create_if_block_8$1(ctx);
    					if_block2.c();
    					transition_in(if_block2, 1);
    					if_block2.m(div0, t2);
    				}
    			} else if (if_block2) {
    				group_outros();

    				transition_out(if_block2, 1, 1, () => {
    					if_block2 = null;
    				});

    				check_outros();
    			}

    			if (!/*invalid*/ ctx[12] && /*warn*/ ctx[14]) {
    				if (if_block3) {
    					if (dirty[0] & /*invalid, warn*/ 20480) {
    						transition_in(if_block3, 1);
    					}
    				} else {
    					if_block3 = create_if_block_7$1(ctx);
    					if_block3.c();
    					transition_in(if_block3, 1);
    					if_block3.m(div0, t3);
    				}
    			} else if (if_block3) {
    				group_outros();

    				transition_out(if_block3, 1, 1, () => {
    					if_block3 = null;
    				});

    				check_outros();
    			}

    			if (/*readonly*/ ctx[18]) {
    				if (if_block4) {
    					if (dirty[0] & /*readonly*/ 262144) {
    						transition_in(if_block4, 1);
    					}
    				} else {
    					if_block4 = create_if_block_6$1(ctx);
    					if_block4.c();
    					transition_in(if_block4, 1);
    					if_block4.m(div0, t4);
    				}
    			} else if (if_block4) {
    				group_outros();

    				transition_out(if_block4, 1, 1, () => {
    					if_block4 = null;
    				});

    				check_outros();
    			}

    			set_attributes(input, input_data = get_spread_update(input_levels, [
    				(!current || dirty[0] & /*invalid*/ 4096 && input_data_invalid_value !== (input_data_invalid_value = /*invalid*/ ctx[12] || undefined)) && { "data-invalid": input_data_invalid_value },
    				(!current || dirty[0] & /*invalid*/ 4096 && input_aria_invalid_value !== (input_aria_invalid_value = /*invalid*/ ctx[12] || undefined)) && { "aria-invalid": input_aria_invalid_value },
    				(!current || dirty[0] & /*warn*/ 16384 && input_data_warn_value !== (input_data_warn_value = /*warn*/ ctx[14] || undefined)) && { "data-warn": input_data_warn_value },
    				(!current || dirty[0] & /*invalid, errorId, warn, warnId*/ 1593344 && input_aria_describedby_value !== (input_aria_describedby_value = /*invalid*/ ctx[12]
    				? /*errorId*/ ctx[20]
    				: /*warn*/ ctx[14] ? /*warnId*/ ctx[19] : undefined)) && {
    					"aria-describedby": input_aria_describedby_value
    				},
    				(!current || dirty[0] & /*disabled*/ 64) && { disabled: /*disabled*/ ctx[6] },
    				(!current || dirty[0] & /*id*/ 256) && { id: /*id*/ ctx[8] },
    				(!current || dirty[0] & /*name*/ 512) && { name: /*name*/ ctx[9] },
    				(!current || dirty[0] & /*placeholder*/ 16) && { placeholder: /*placeholder*/ ctx[4] },
    				(!current || dirty[0] & /*type*/ 8) && { type: /*type*/ ctx[3] },
    				(!current || dirty[0] & /*value*/ 1 && input.value !== /*value*/ ctx[0]) && { value: /*value*/ ctx[0] },
    				(!current || dirty[0] & /*required*/ 65536) && { required: /*required*/ ctx[16] },
    				(!current || dirty[0] & /*readonly*/ 262144) && { readOnly: /*readonly*/ ctx[18] },
    				dirty[0] & /*$$restProps*/ 4194304 && /*$$restProps*/ ctx[22],
    				(!current || dirty[0] & /*size*/ 4 && input_class_value !== (input_class_value = /*size*/ ctx[2] && `bx--text-input--${/*size*/ ctx[2]}`)) && { class: input_class_value }
    			]));

    			if ('value' in input_data) {
    				input.value = input_data.value;
    			}

    			toggle_class(input, "bx--text-input", true);
    			toggle_class(input, "bx--text-input--light", /*light*/ ctx[5]);
    			toggle_class(input, "bx--text-input--invalid", /*invalid*/ ctx[12]);
    			toggle_class(input, "bx--text-input--warn", /*warn*/ ctx[14]);

    			if (/*isFluid*/ ctx[21]) {
    				if (if_block5) ; else {
    					if_block5 = create_if_block_5$1(ctx);
    					if_block5.c();
    					if_block5.m(div0, t6);
    				}
    			} else if (if_block5) {
    				if_block5.d(1);
    				if_block5 = null;
    			}

    			if (/*isFluid*/ ctx[21] && !/*inline*/ ctx[17] && /*invalid*/ ctx[12]) {
    				if (if_block6) {
    					if_block6.p(ctx, dirty);
    				} else {
    					if_block6 = create_if_block_4$2(ctx);
    					if_block6.c();
    					if_block6.m(div0, t7);
    				}
    			} else if (if_block6) {
    				if_block6.d(1);
    				if_block6 = null;
    			}

    			if (/*isFluid*/ ctx[21] && !/*inline*/ ctx[17] && /*warn*/ ctx[14]) {
    				if (if_block7) {
    					if_block7.p(ctx, dirty);
    				} else {
    					if_block7 = create_if_block_3$3(ctx);
    					if_block7.c();
    					if_block7.m(div0, null);
    				}
    			} else if (if_block7) {
    				if_block7.d(1);
    				if_block7 = null;
    			}

    			if (!current || dirty[0] & /*invalid*/ 4096 && div0_data_invalid_value !== (div0_data_invalid_value = /*invalid*/ ctx[12] || undefined)) {
    				attr_dev(div0, "data-invalid", div0_data_invalid_value);
    			}

    			if (!current || dirty[0] & /*warn*/ 16384 && div0_data_warn_value !== (div0_data_warn_value = /*warn*/ ctx[14] || undefined)) {
    				attr_dev(div0, "data-warn", div0_data_warn_value);
    			}

    			if (dirty[0] & /*invalid, warn*/ 20480) {
    				toggle_class(div0, "bx--text-input__field-wrapper--warning", !/*invalid*/ ctx[12] && /*warn*/ ctx[14]);
    			}

    			if (!/*invalid*/ ctx[12] && !/*warn*/ ctx[14] && !/*isFluid*/ ctx[21] && !/*inline*/ ctx[17] && /*helperText*/ ctx[7]) {
    				if (if_block8) {
    					if_block8.p(ctx, dirty);
    				} else {
    					if_block8 = create_if_block_2$3(ctx);
    					if_block8.c();
    					if_block8.m(div1, t9);
    				}
    			} else if (if_block8) {
    				if_block8.d(1);
    				if_block8 = null;
    			}

    			if (!/*isFluid*/ ctx[21] && /*invalid*/ ctx[12]) {
    				if (if_block9) {
    					if_block9.p(ctx, dirty);
    				} else {
    					if_block9 = create_if_block_1$4(ctx);
    					if_block9.c();
    					if_block9.m(div1, t10);
    				}
    			} else if (if_block9) {
    				if_block9.d(1);
    				if_block9 = null;
    			}

    			if (!/*isFluid*/ ctx[21] && !/*invalid*/ ctx[12] && /*warn*/ ctx[14]) {
    				if (if_block10) {
    					if_block10.p(ctx, dirty);
    				} else {
    					if_block10 = create_if_block$b(ctx);
    					if_block10.c();
    					if_block10.m(div1, null);
    				}
    			} else if (if_block10) {
    				if_block10.d(1);
    				if_block10 = null;
    			}

    			if (dirty[0] & /*inline*/ 131072) {
    				toggle_class(div1, "bx--text-input__field-outer-wrapper--inline", /*inline*/ ctx[17]);
    			}

    			if (dirty[0] & /*inline*/ 131072) {
    				toggle_class(div2, "bx--text-input-wrapper--inline", /*inline*/ ctx[17]);
    			}

    			if (dirty[0] & /*light*/ 32) {
    				toggle_class(div2, "bx--text-input-wrapper--light", /*light*/ ctx[5]);
    			}

    			if (dirty[0] & /*readonly*/ 262144) {
    				toggle_class(div2, "bx--text-input-wrapper--readonly", /*readonly*/ ctx[18]);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block0);
    			transition_in(if_block1);
    			transition_in(if_block2);
    			transition_in(if_block3);
    			transition_in(if_block4);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block0);
    			transition_out(if_block1);
    			transition_out(if_block2);
    			transition_out(if_block3);
    			transition_out(if_block4);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div2);
    			if (if_block0) if_block0.d();
    			if (if_block1) if_block1.d();
    			if (if_block2) if_block2.d();
    			if (if_block3) if_block3.d();
    			if (if_block4) if_block4.d();
    			/*input_binding*/ ctx[35](null);
    			if (if_block5) if_block5.d();
    			if (if_block6) if_block6.d();
    			if (if_block7) if_block7.d();
    			if (if_block8) if_block8.d();
    			if (if_block9) if_block9.d();
    			if (if_block10) if_block10.d();
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$g.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$g($$self, $$props, $$invalidate) {
    	let isFluid;
    	let errorId;
    	let warnId;

    	const omit_props_names = [
    		"size","value","type","placeholder","light","disabled","helperText","id","name","labelText","hideLabel","invalid","invalidText","warn","warnText","ref","required","inline","readonly"
    	];

    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('TextInput', slots, ['labelText']);
    	let { size = undefined } = $$props;
    	let { value = "" } = $$props;
    	let { type = "" } = $$props;
    	let { placeholder = "" } = $$props;
    	let { light = false } = $$props;
    	let { disabled = false } = $$props;
    	let { helperText = "" } = $$props;
    	let { id = "ccs-" + Math.random().toString(36) } = $$props;
    	let { name = undefined } = $$props;
    	let { labelText = "" } = $$props;
    	let { hideLabel = false } = $$props;
    	let { invalid = false } = $$props;
    	let { invalidText = "" } = $$props;
    	let { warn = false } = $$props;
    	let { warnText = "" } = $$props;
    	let { ref = null } = $$props;
    	let { required = false } = $$props;
    	let { inline = false } = $$props;
    	let { readonly = false } = $$props;
    	const ctx = getContext("Form");

    	function click_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function mouseover_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function mouseenter_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function mouseleave_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function change_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function input_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function keydown_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function keyup_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function focus_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function blur_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function input_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			ref = $$value;
    			$$invalidate(1, ref);
    		});
    	}

    	const input_handler_1 = ({ target }) => {
    		$$invalidate(0, value = target.value);
    	};

    	$$self.$$set = $$new_props => {
    		$$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
    		$$invalidate(22, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ('size' in $$new_props) $$invalidate(2, size = $$new_props.size);
    		if ('value' in $$new_props) $$invalidate(0, value = $$new_props.value);
    		if ('type' in $$new_props) $$invalidate(3, type = $$new_props.type);
    		if ('placeholder' in $$new_props) $$invalidate(4, placeholder = $$new_props.placeholder);
    		if ('light' in $$new_props) $$invalidate(5, light = $$new_props.light);
    		if ('disabled' in $$new_props) $$invalidate(6, disabled = $$new_props.disabled);
    		if ('helperText' in $$new_props) $$invalidate(7, helperText = $$new_props.helperText);
    		if ('id' in $$new_props) $$invalidate(8, id = $$new_props.id);
    		if ('name' in $$new_props) $$invalidate(9, name = $$new_props.name);
    		if ('labelText' in $$new_props) $$invalidate(10, labelText = $$new_props.labelText);
    		if ('hideLabel' in $$new_props) $$invalidate(11, hideLabel = $$new_props.hideLabel);
    		if ('invalid' in $$new_props) $$invalidate(12, invalid = $$new_props.invalid);
    		if ('invalidText' in $$new_props) $$invalidate(13, invalidText = $$new_props.invalidText);
    		if ('warn' in $$new_props) $$invalidate(14, warn = $$new_props.warn);
    		if ('warnText' in $$new_props) $$invalidate(15, warnText = $$new_props.warnText);
    		if ('ref' in $$new_props) $$invalidate(1, ref = $$new_props.ref);
    		if ('required' in $$new_props) $$invalidate(16, required = $$new_props.required);
    		if ('inline' in $$new_props) $$invalidate(17, inline = $$new_props.inline);
    		if ('readonly' in $$new_props) $$invalidate(18, readonly = $$new_props.readonly);
    		if ('$$scope' in $$new_props) $$invalidate(23, $$scope = $$new_props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		size,
    		value,
    		type,
    		placeholder,
    		light,
    		disabled,
    		helperText,
    		id,
    		name,
    		labelText,
    		hideLabel,
    		invalid,
    		invalidText,
    		warn,
    		warnText,
    		ref,
    		required,
    		inline,
    		readonly,
    		getContext,
    		WarningFilled16: WarningFilled16$1,
    		WarningAltFilled16: WarningAltFilled16$1,
    		EditOff16: EditOff16$1,
    		ctx,
    		warnId,
    		errorId,
    		isFluid
    	});

    	$$self.$inject_state = $$new_props => {
    		if ('size' in $$props) $$invalidate(2, size = $$new_props.size);
    		if ('value' in $$props) $$invalidate(0, value = $$new_props.value);
    		if ('type' in $$props) $$invalidate(3, type = $$new_props.type);
    		if ('placeholder' in $$props) $$invalidate(4, placeholder = $$new_props.placeholder);
    		if ('light' in $$props) $$invalidate(5, light = $$new_props.light);
    		if ('disabled' in $$props) $$invalidate(6, disabled = $$new_props.disabled);
    		if ('helperText' in $$props) $$invalidate(7, helperText = $$new_props.helperText);
    		if ('id' in $$props) $$invalidate(8, id = $$new_props.id);
    		if ('name' in $$props) $$invalidate(9, name = $$new_props.name);
    		if ('labelText' in $$props) $$invalidate(10, labelText = $$new_props.labelText);
    		if ('hideLabel' in $$props) $$invalidate(11, hideLabel = $$new_props.hideLabel);
    		if ('invalid' in $$props) $$invalidate(12, invalid = $$new_props.invalid);
    		if ('invalidText' in $$props) $$invalidate(13, invalidText = $$new_props.invalidText);
    		if ('warn' in $$props) $$invalidate(14, warn = $$new_props.warn);
    		if ('warnText' in $$props) $$invalidate(15, warnText = $$new_props.warnText);
    		if ('ref' in $$props) $$invalidate(1, ref = $$new_props.ref);
    		if ('required' in $$props) $$invalidate(16, required = $$new_props.required);
    		if ('inline' in $$props) $$invalidate(17, inline = $$new_props.inline);
    		if ('readonly' in $$props) $$invalidate(18, readonly = $$new_props.readonly);
    		if ('warnId' in $$props) $$invalidate(19, warnId = $$new_props.warnId);
    		if ('errorId' in $$props) $$invalidate(20, errorId = $$new_props.errorId);
    		if ('isFluid' in $$props) $$invalidate(21, isFluid = $$new_props.isFluid);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty[0] & /*id*/ 256) {
    			$$invalidate(20, errorId = `error-${id}`);
    		}

    		if ($$self.$$.dirty[0] & /*id*/ 256) {
    			$$invalidate(19, warnId = `warn-${id}`);
    		}
    	};

    	$$invalidate(21, isFluid = !!ctx && ctx.isFluid);

    	return [
    		value,
    		ref,
    		size,
    		type,
    		placeholder,
    		light,
    		disabled,
    		helperText,
    		id,
    		name,
    		labelText,
    		hideLabel,
    		invalid,
    		invalidText,
    		warn,
    		warnText,
    		required,
    		inline,
    		readonly,
    		warnId,
    		errorId,
    		isFluid,
    		$$restProps,
    		$$scope,
    		slots,
    		click_handler,
    		mouseover_handler,
    		mouseenter_handler,
    		mouseleave_handler,
    		change_handler,
    		input_handler,
    		keydown_handler,
    		keyup_handler,
    		focus_handler,
    		blur_handler,
    		input_binding,
    		input_handler_1
    	];
    }

    class TextInput extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(
    			this,
    			options,
    			instance$g,
    			create_fragment$g,
    			safe_not_equal,
    			{
    				size: 2,
    				value: 0,
    				type: 3,
    				placeholder: 4,
    				light: 5,
    				disabled: 6,
    				helperText: 7,
    				id: 8,
    				name: 9,
    				labelText: 10,
    				hideLabel: 11,
    				invalid: 12,
    				invalidText: 13,
    				warn: 14,
    				warnText: 15,
    				ref: 1,
    				required: 16,
    				inline: 17,
    				readonly: 18
    			},
    			null,
    			[-1, -1]
    		);

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "TextInput",
    			options,
    			id: create_fragment$g.name
    		});
    	}

    	get size() {
    		throw new Error("<TextInput>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set size(value) {
    		throw new Error("<TextInput>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get value() {
    		throw new Error("<TextInput>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set value(value) {
    		throw new Error("<TextInput>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get type() {
    		throw new Error("<TextInput>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set type(value) {
    		throw new Error("<TextInput>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get placeholder() {
    		throw new Error("<TextInput>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set placeholder(value) {
    		throw new Error("<TextInput>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get light() {
    		throw new Error("<TextInput>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set light(value) {
    		throw new Error("<TextInput>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get disabled() {
    		throw new Error("<TextInput>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set disabled(value) {
    		throw new Error("<TextInput>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get helperText() {
    		throw new Error("<TextInput>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set helperText(value) {
    		throw new Error("<TextInput>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get id() {
    		throw new Error("<TextInput>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set id(value) {
    		throw new Error("<TextInput>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get name() {
    		throw new Error("<TextInput>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set name(value) {
    		throw new Error("<TextInput>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get labelText() {
    		throw new Error("<TextInput>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set labelText(value) {
    		throw new Error("<TextInput>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get hideLabel() {
    		throw new Error("<TextInput>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set hideLabel(value) {
    		throw new Error("<TextInput>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get invalid() {
    		throw new Error("<TextInput>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set invalid(value) {
    		throw new Error("<TextInput>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get invalidText() {
    		throw new Error("<TextInput>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set invalidText(value) {
    		throw new Error("<TextInput>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get warn() {
    		throw new Error("<TextInput>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set warn(value) {
    		throw new Error("<TextInput>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get warnText() {
    		throw new Error("<TextInput>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set warnText(value) {
    		throw new Error("<TextInput>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get ref() {
    		throw new Error("<TextInput>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set ref(value) {
    		throw new Error("<TextInput>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get required() {
    		throw new Error("<TextInput>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set required(value) {
    		throw new Error("<TextInput>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get inline() {
    		throw new Error("<TextInput>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set inline(value) {
    		throw new Error("<TextInput>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get readonly() {
    		throw new Error("<TextInput>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set readonly(value) {
    		throw new Error("<TextInput>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    var TextInput$1 = TextInput;

    /* node_modules\carbon-components-svelte\src\FormGroup\FormGroup.svelte generated by Svelte v3.42.4 */

    const file$f = "node_modules\\carbon-components-svelte\\src\\FormGroup\\FormGroup.svelte";

    // (38:2) {#if message}
    function create_if_block$a(ctx) {
    	let div;
    	let t;

    	const block = {
    		c: function create() {
    			div = element("div");
    			t = text(/*messageText*/ ctx[3]);
    			toggle_class(div, "bx--form__requirement", true);
    			add_location(div, file$f, 38, 4, 952);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*messageText*/ 8) set_data_dev(t, /*messageText*/ ctx[3]);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$a.name,
    		type: "if",
    		source: "(38:2) {#if message}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$f(ctx) {
    	let fieldset;
    	let legend;
    	let t0;
    	let legend_id_value;
    	let t1;
    	let t2;
    	let fieldset_data_invalid_value;
    	let fieldset_aria_labelledby_value;
    	let current;
    	let mounted;
    	let dispose;
    	const default_slot_template = /*#slots*/ ctx[8].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[7], null);
    	let if_block = /*message*/ ctx[2] && create_if_block$a(ctx);

    	let fieldset_levels = [
    		{
    			"data-invalid": fieldset_data_invalid_value = /*invalid*/ ctx[1] || undefined
    		},
    		{
    			"aria-labelledby": fieldset_aria_labelledby_value = /*$$restProps*/ ctx[6]['aria-labelledby'] || /*legendId*/ ctx[5]
    		},
    		/*$$restProps*/ ctx[6]
    	];

    	let fieldset_data = {};

    	for (let i = 0; i < fieldset_levels.length; i += 1) {
    		fieldset_data = assign(fieldset_data, fieldset_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			fieldset = element("fieldset");
    			legend = element("legend");
    			t0 = text(/*legendText*/ ctx[4]);
    			t1 = space();
    			if (default_slot) default_slot.c();
    			t2 = space();
    			if (if_block) if_block.c();
    			attr_dev(legend, "id", legend_id_value = /*legendId*/ ctx[5] || /*$$restProps*/ ctx[6]['aria-labelledby']);
    			toggle_class(legend, "bx--label", true);
    			add_location(legend, file$f, 32, 2, 805);
    			set_attributes(fieldset, fieldset_data);
    			toggle_class(fieldset, "bx--fieldset", true);
    			toggle_class(fieldset, "bx--fieldset--no-margin", /*noMargin*/ ctx[0]);
    			add_location(fieldset, file$f, 21, 0, 534);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, fieldset, anchor);
    			append_dev(fieldset, legend);
    			append_dev(legend, t0);
    			append_dev(fieldset, t1);

    			if (default_slot) {
    				default_slot.m(fieldset, null);
    			}

    			append_dev(fieldset, t2);
    			if (if_block) if_block.m(fieldset, null);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(fieldset, "click", /*click_handler*/ ctx[9], false, false, false),
    					listen_dev(fieldset, "mouseover", /*mouseover_handler*/ ctx[10], false, false, false),
    					listen_dev(fieldset, "mouseenter", /*mouseenter_handler*/ ctx[11], false, false, false),
    					listen_dev(fieldset, "mouseleave", /*mouseleave_handler*/ ctx[12], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (!current || dirty & /*legendText*/ 16) set_data_dev(t0, /*legendText*/ ctx[4]);

    			if (!current || dirty & /*legendId, $$restProps*/ 96 && legend_id_value !== (legend_id_value = /*legendId*/ ctx[5] || /*$$restProps*/ ctx[6]['aria-labelledby'])) {
    				attr_dev(legend, "id", legend_id_value);
    			}

    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 128)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[7],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[7])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[7], dirty, null),
    						null
    					);
    				}
    			}

    			if (/*message*/ ctx[2]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block$a(ctx);
    					if_block.c();
    					if_block.m(fieldset, null);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}

    			set_attributes(fieldset, fieldset_data = get_spread_update(fieldset_levels, [
    				(!current || dirty & /*invalid*/ 2 && fieldset_data_invalid_value !== (fieldset_data_invalid_value = /*invalid*/ ctx[1] || undefined)) && {
    					"data-invalid": fieldset_data_invalid_value
    				},
    				(!current || dirty & /*$$restProps, legendId*/ 96 && fieldset_aria_labelledby_value !== (fieldset_aria_labelledby_value = /*$$restProps*/ ctx[6]['aria-labelledby'] || /*legendId*/ ctx[5])) && {
    					"aria-labelledby": fieldset_aria_labelledby_value
    				},
    				dirty & /*$$restProps*/ 64 && /*$$restProps*/ ctx[6]
    			]));

    			toggle_class(fieldset, "bx--fieldset", true);
    			toggle_class(fieldset, "bx--fieldset--no-margin", /*noMargin*/ ctx[0]);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(fieldset);
    			if (default_slot) default_slot.d(detaching);
    			if (if_block) if_block.d();
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$f.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$f($$self, $$props, $$invalidate) {
    	const omit_props_names = ["noMargin","invalid","message","messageText","legendText","legendId"];
    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('FormGroup', slots, ['default']);
    	let { noMargin = false } = $$props;
    	let { invalid = false } = $$props;
    	let { message = false } = $$props;
    	let { messageText = "" } = $$props;
    	let { legendText = "" } = $$props;
    	let { legendId = "" } = $$props;

    	function click_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function mouseover_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function mouseenter_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function mouseleave_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	$$self.$$set = $$new_props => {
    		$$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
    		$$invalidate(6, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ('noMargin' in $$new_props) $$invalidate(0, noMargin = $$new_props.noMargin);
    		if ('invalid' in $$new_props) $$invalidate(1, invalid = $$new_props.invalid);
    		if ('message' in $$new_props) $$invalidate(2, message = $$new_props.message);
    		if ('messageText' in $$new_props) $$invalidate(3, messageText = $$new_props.messageText);
    		if ('legendText' in $$new_props) $$invalidate(4, legendText = $$new_props.legendText);
    		if ('legendId' in $$new_props) $$invalidate(5, legendId = $$new_props.legendId);
    		if ('$$scope' in $$new_props) $$invalidate(7, $$scope = $$new_props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		noMargin,
    		invalid,
    		message,
    		messageText,
    		legendText,
    		legendId
    	});

    	$$self.$inject_state = $$new_props => {
    		if ('noMargin' in $$props) $$invalidate(0, noMargin = $$new_props.noMargin);
    		if ('invalid' in $$props) $$invalidate(1, invalid = $$new_props.invalid);
    		if ('message' in $$props) $$invalidate(2, message = $$new_props.message);
    		if ('messageText' in $$props) $$invalidate(3, messageText = $$new_props.messageText);
    		if ('legendText' in $$props) $$invalidate(4, legendText = $$new_props.legendText);
    		if ('legendId' in $$props) $$invalidate(5, legendId = $$new_props.legendId);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		noMargin,
    		invalid,
    		message,
    		messageText,
    		legendText,
    		legendId,
    		$$restProps,
    		$$scope,
    		slots,
    		click_handler,
    		mouseover_handler,
    		mouseenter_handler,
    		mouseleave_handler
    	];
    }

    class FormGroup extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$f, create_fragment$f, safe_not_equal, {
    			noMargin: 0,
    			invalid: 1,
    			message: 2,
    			messageText: 3,
    			legendText: 4,
    			legendId: 5
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "FormGroup",
    			options,
    			id: create_fragment$f.name
    		});
    	}

    	get noMargin() {
    		throw new Error("<FormGroup>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set noMargin(value) {
    		throw new Error("<FormGroup>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get invalid() {
    		throw new Error("<FormGroup>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set invalid(value) {
    		throw new Error("<FormGroup>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get message() {
    		throw new Error("<FormGroup>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set message(value) {
    		throw new Error("<FormGroup>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get messageText() {
    		throw new Error("<FormGroup>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set messageText(value) {
    		throw new Error("<FormGroup>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get legendText() {
    		throw new Error("<FormGroup>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set legendText(value) {
    		throw new Error("<FormGroup>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get legendId() {
    		throw new Error("<FormGroup>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set legendId(value) {
    		throw new Error("<FormGroup>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    var FormGroup$1 = FormGroup;

    /* node_modules\carbon-components-svelte\src\TextArea\TextArea.svelte generated by Svelte v3.42.4 */
    const file$e = "node_modules\\carbon-components-svelte\\src\\TextArea\\TextArea.svelte";
    const get_labelText_slot_changes$1 = dirty => ({});
    const get_labelText_slot_context$1 = ctx => ({});

    // (60:2) {#if labelText && !hideLabel}
    function create_if_block_3$2(ctx) {
    	let label;
    	let current;
    	const labelText_slot_template = /*#slots*/ ctx[17].labelText;
    	const labelText_slot = create_slot(labelText_slot_template, ctx, /*$$scope*/ ctx[16], get_labelText_slot_context$1);
    	const labelText_slot_or_fallback = labelText_slot || fallback_block$4(ctx);

    	const block = {
    		c: function create() {
    			label = element("label");
    			if (labelText_slot_or_fallback) labelText_slot_or_fallback.c();
    			attr_dev(label, "for", /*id*/ ctx[12]);
    			toggle_class(label, "bx--label", true);
    			toggle_class(label, "bx--visually-hidden", /*hideLabel*/ ctx[9]);
    			toggle_class(label, "bx--label--disabled", /*disabled*/ ctx[6]);
    			add_location(label, file$e, 60, 4, 1391);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, label, anchor);

    			if (labelText_slot_or_fallback) {
    				labelText_slot_or_fallback.m(label, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (labelText_slot) {
    				if (labelText_slot.p && (!current || dirty & /*$$scope*/ 65536)) {
    					update_slot_base(
    						labelText_slot,
    						labelText_slot_template,
    						ctx,
    						/*$$scope*/ ctx[16],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[16])
    						: get_slot_changes(labelText_slot_template, /*$$scope*/ ctx[16], dirty, get_labelText_slot_changes$1),
    						get_labelText_slot_context$1
    					);
    				}
    			} else {
    				if (labelText_slot_or_fallback && labelText_slot_or_fallback.p && (!current || dirty & /*labelText*/ 256)) {
    					labelText_slot_or_fallback.p(ctx, !current ? -1 : dirty);
    				}
    			}

    			if (!current || dirty & /*id*/ 4096) {
    				attr_dev(label, "for", /*id*/ ctx[12]);
    			}

    			if (dirty & /*hideLabel*/ 512) {
    				toggle_class(label, "bx--visually-hidden", /*hideLabel*/ ctx[9]);
    			}

    			if (dirty & /*disabled*/ 64) {
    				toggle_class(label, "bx--label--disabled", /*disabled*/ ctx[6]);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(labelText_slot_or_fallback, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(labelText_slot_or_fallback, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(label);
    			if (labelText_slot_or_fallback) labelText_slot_or_fallback.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_3$2.name,
    		type: "if",
    		source: "(60:2) {#if labelText && !hideLabel}",
    		ctx
    	});

    	return block;
    }

    // (67:29)          
    function fallback_block$4(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text(/*labelText*/ ctx[8]);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*labelText*/ 256) set_data_dev(t, /*labelText*/ ctx[8]);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: fallback_block$4.name,
    		type: "fallback",
    		source: "(67:29)          ",
    		ctx
    	});

    	return block;
    }

    // (76:4) {#if invalid}
    function create_if_block_2$2(ctx) {
    	let warningfilled16;
    	let current;

    	warningfilled16 = new WarningFilled16$1({
    			props: { class: "bx--text-area__invalid-icon" },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(warningfilled16.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(warningfilled16, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(warningfilled16.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(warningfilled16.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(warningfilled16, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2$2.name,
    		type: "if",
    		source: "(76:4) {#if invalid}",
    		ctx
    	});

    	return block;
    }

    // (105:2) {#if !invalid && helperText}
    function create_if_block_1$3(ctx) {
    	let div;
    	let t;

    	const block = {
    		c: function create() {
    			div = element("div");
    			t = text(/*helperText*/ ctx[7]);
    			toggle_class(div, "bx--form__helper-text", true);
    			toggle_class(div, "bx--form__helper-text--disabled", /*disabled*/ ctx[6]);
    			add_location(div, file$e, 105, 4, 2551);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*helperText*/ 128) set_data_dev(t, /*helperText*/ ctx[7]);

    			if (dirty & /*disabled*/ 64) {
    				toggle_class(div, "bx--form__helper-text--disabled", /*disabled*/ ctx[6]);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$3.name,
    		type: "if",
    		source: "(105:2) {#if !invalid && helperText}",
    		ctx
    	});

    	return block;
    }

    // (113:2) {#if invalid}
    function create_if_block$9(ctx) {
    	let div;
    	let t;

    	const block = {
    		c: function create() {
    			div = element("div");
    			t = text(/*invalidText*/ ctx[11]);
    			attr_dev(div, "id", /*errorId*/ ctx[14]);
    			toggle_class(div, "bx--form-requirement", true);
    			add_location(div, file$e, 113, 4, 2720);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*invalidText*/ 2048) set_data_dev(t, /*invalidText*/ ctx[11]);

    			if (dirty & /*errorId*/ 16384) {
    				attr_dev(div, "id", /*errorId*/ ctx[14]);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$9.name,
    		type: "if",
    		source: "(113:2) {#if invalid}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$e(ctx) {
    	let div1;
    	let t0;
    	let div0;
    	let t1;
    	let textarea;
    	let textarea_aria_invalid_value;
    	let textarea_aria_describedby_value;
    	let textarea_readonly_value;
    	let div0_data_invalid_value;
    	let t2;
    	let t3;
    	let current;
    	let mounted;
    	let dispose;
    	let if_block0 = /*labelText*/ ctx[8] && !/*hideLabel*/ ctx[9] && create_if_block_3$2(ctx);
    	let if_block1 = /*invalid*/ ctx[10] && create_if_block_2$2(ctx);

    	let textarea_levels = [
    		{
    			"aria-invalid": textarea_aria_invalid_value = /*invalid*/ ctx[10] || undefined
    		},
    		{
    			"aria-describedby": textarea_aria_describedby_value = /*invalid*/ ctx[10] ? /*errorId*/ ctx[14] : undefined
    		},
    		{ disabled: /*disabled*/ ctx[6] },
    		{ id: /*id*/ ctx[12] },
    		{ name: /*name*/ ctx[13] },
    		{ cols: /*cols*/ ctx[3] },
    		{ rows: /*rows*/ ctx[4] },
    		{ value: /*value*/ ctx[0] },
    		{ placeholder: /*placeholder*/ ctx[2] },
    		/*$$restProps*/ ctx[15],
    		{
    			readOnly: textarea_readonly_value = /*$$restProps*/ ctx[15].readonly === true
    			? true
    			: undefined
    		}
    	];

    	let textarea_data = {};

    	for (let i = 0; i < textarea_levels.length; i += 1) {
    		textarea_data = assign(textarea_data, textarea_levels[i]);
    	}

    	let if_block2 = !/*invalid*/ ctx[10] && /*helperText*/ ctx[7] && create_if_block_1$3(ctx);
    	let if_block3 = /*invalid*/ ctx[10] && create_if_block$9(ctx);

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			if (if_block0) if_block0.c();
    			t0 = space();
    			div0 = element("div");
    			if (if_block1) if_block1.c();
    			t1 = space();
    			textarea = element("textarea");
    			t2 = space();
    			if (if_block2) if_block2.c();
    			t3 = space();
    			if (if_block3) if_block3.c();
    			set_attributes(textarea, textarea_data);
    			toggle_class(textarea, "bx--text-area", true);
    			toggle_class(textarea, "bx--text-area--light", /*light*/ ctx[5]);
    			toggle_class(textarea, "bx--text-area--invalid", /*invalid*/ ctx[10]);
    			add_location(textarea, file$e, 78, 4, 1817);
    			attr_dev(div0, "data-invalid", div0_data_invalid_value = /*invalid*/ ctx[10] || undefined);
    			toggle_class(div0, "bx--text-area__wrapper", true);
    			add_location(div0, file$e, 71, 2, 1630);
    			toggle_class(div1, "bx--form-item", true);
    			add_location(div1, file$e, 52, 0, 1259);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			if (if_block0) if_block0.m(div1, null);
    			append_dev(div1, t0);
    			append_dev(div1, div0);
    			if (if_block1) if_block1.m(div0, null);
    			append_dev(div0, t1);
    			append_dev(div0, textarea);
    			if (textarea.autofocus) textarea.focus();
    			/*textarea_binding*/ ctx[28](textarea);
    			append_dev(div1, t2);
    			if (if_block2) if_block2.m(div1, null);
    			append_dev(div1, t3);
    			if (if_block3) if_block3.m(div1, null);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(textarea, "change", /*change_handler*/ ctx[22], false, false, false),
    					listen_dev(textarea, "input", /*input_handler*/ ctx[23], false, false, false),
    					listen_dev(textarea, "input", /*input_handler_1*/ ctx[29], false, false, false),
    					listen_dev(textarea, "keydown", /*keydown_handler*/ ctx[24], false, false, false),
    					listen_dev(textarea, "keyup", /*keyup_handler*/ ctx[25], false, false, false),
    					listen_dev(textarea, "focus", /*focus_handler*/ ctx[26], false, false, false),
    					listen_dev(textarea, "blur", /*blur_handler*/ ctx[27], false, false, false),
    					listen_dev(div1, "click", /*click_handler*/ ctx[18], false, false, false),
    					listen_dev(div1, "mouseover", /*mouseover_handler*/ ctx[19], false, false, false),
    					listen_dev(div1, "mouseenter", /*mouseenter_handler*/ ctx[20], false, false, false),
    					listen_dev(div1, "mouseleave", /*mouseleave_handler*/ ctx[21], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (/*labelText*/ ctx[8] && !/*hideLabel*/ ctx[9]) {
    				if (if_block0) {
    					if_block0.p(ctx, dirty);

    					if (dirty & /*labelText, hideLabel*/ 768) {
    						transition_in(if_block0, 1);
    					}
    				} else {
    					if_block0 = create_if_block_3$2(ctx);
    					if_block0.c();
    					transition_in(if_block0, 1);
    					if_block0.m(div1, t0);
    				}
    			} else if (if_block0) {
    				group_outros();

    				transition_out(if_block0, 1, 1, () => {
    					if_block0 = null;
    				});

    				check_outros();
    			}

    			if (/*invalid*/ ctx[10]) {
    				if (if_block1) {
    					if (dirty & /*invalid*/ 1024) {
    						transition_in(if_block1, 1);
    					}
    				} else {
    					if_block1 = create_if_block_2$2(ctx);
    					if_block1.c();
    					transition_in(if_block1, 1);
    					if_block1.m(div0, t1);
    				}
    			} else if (if_block1) {
    				group_outros();

    				transition_out(if_block1, 1, 1, () => {
    					if_block1 = null;
    				});

    				check_outros();
    			}

    			set_attributes(textarea, textarea_data = get_spread_update(textarea_levels, [
    				(!current || dirty & /*invalid*/ 1024 && textarea_aria_invalid_value !== (textarea_aria_invalid_value = /*invalid*/ ctx[10] || undefined)) && {
    					"aria-invalid": textarea_aria_invalid_value
    				},
    				(!current || dirty & /*invalid, errorId*/ 17408 && textarea_aria_describedby_value !== (textarea_aria_describedby_value = /*invalid*/ ctx[10] ? /*errorId*/ ctx[14] : undefined)) && {
    					"aria-describedby": textarea_aria_describedby_value
    				},
    				(!current || dirty & /*disabled*/ 64) && { disabled: /*disabled*/ ctx[6] },
    				(!current || dirty & /*id*/ 4096) && { id: /*id*/ ctx[12] },
    				(!current || dirty & /*name*/ 8192) && { name: /*name*/ ctx[13] },
    				(!current || dirty & /*cols*/ 8) && { cols: /*cols*/ ctx[3] },
    				(!current || dirty & /*rows*/ 16) && { rows: /*rows*/ ctx[4] },
    				(!current || dirty & /*value*/ 1) && { value: /*value*/ ctx[0] },
    				(!current || dirty & /*placeholder*/ 4) && { placeholder: /*placeholder*/ ctx[2] },
    				dirty & /*$$restProps*/ 32768 && /*$$restProps*/ ctx[15],
    				(!current || dirty & /*$$restProps*/ 32768 && textarea_readonly_value !== (textarea_readonly_value = /*$$restProps*/ ctx[15].readonly === true
    				? true
    				: undefined)) && { readOnly: textarea_readonly_value }
    			]));

    			toggle_class(textarea, "bx--text-area", true);
    			toggle_class(textarea, "bx--text-area--light", /*light*/ ctx[5]);
    			toggle_class(textarea, "bx--text-area--invalid", /*invalid*/ ctx[10]);

    			if (!current || dirty & /*invalid*/ 1024 && div0_data_invalid_value !== (div0_data_invalid_value = /*invalid*/ ctx[10] || undefined)) {
    				attr_dev(div0, "data-invalid", div0_data_invalid_value);
    			}

    			if (!/*invalid*/ ctx[10] && /*helperText*/ ctx[7]) {
    				if (if_block2) {
    					if_block2.p(ctx, dirty);
    				} else {
    					if_block2 = create_if_block_1$3(ctx);
    					if_block2.c();
    					if_block2.m(div1, t3);
    				}
    			} else if (if_block2) {
    				if_block2.d(1);
    				if_block2 = null;
    			}

    			if (/*invalid*/ ctx[10]) {
    				if (if_block3) {
    					if_block3.p(ctx, dirty);
    				} else {
    					if_block3 = create_if_block$9(ctx);
    					if_block3.c();
    					if_block3.m(div1, null);
    				}
    			} else if (if_block3) {
    				if_block3.d(1);
    				if_block3 = null;
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block0);
    			transition_in(if_block1);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block0);
    			transition_out(if_block1);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    			if (if_block0) if_block0.d();
    			if (if_block1) if_block1.d();
    			/*textarea_binding*/ ctx[28](null);
    			if (if_block2) if_block2.d();
    			if (if_block3) if_block3.d();
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$e.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$e($$self, $$props, $$invalidate) {
    	let errorId;

    	const omit_props_names = [
    		"value","placeholder","cols","rows","light","disabled","helperText","labelText","hideLabel","invalid","invalidText","id","name","ref"
    	];

    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('TextArea', slots, ['labelText']);
    	let { value = "" } = $$props;
    	let { placeholder = "" } = $$props;
    	let { cols = 50 } = $$props;
    	let { rows = 4 } = $$props;
    	let { light = false } = $$props;
    	let { disabled = false } = $$props;
    	let { helperText = "" } = $$props;
    	let { labelText = "" } = $$props;
    	let { hideLabel = false } = $$props;
    	let { invalid = false } = $$props;
    	let { invalidText = "" } = $$props;
    	let { id = "ccs-" + Math.random().toString(36) } = $$props;
    	let { name = undefined } = $$props;
    	let { ref = null } = $$props;

    	function click_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function mouseover_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function mouseenter_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function mouseleave_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function change_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function input_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function keydown_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function keyup_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function focus_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function blur_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function textarea_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			ref = $$value;
    			$$invalidate(1, ref);
    		});
    	}

    	const input_handler_1 = ({ target }) => {
    		$$invalidate(0, value = target.value);
    	};

    	$$self.$$set = $$new_props => {
    		$$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
    		$$invalidate(15, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ('value' in $$new_props) $$invalidate(0, value = $$new_props.value);
    		if ('placeholder' in $$new_props) $$invalidate(2, placeholder = $$new_props.placeholder);
    		if ('cols' in $$new_props) $$invalidate(3, cols = $$new_props.cols);
    		if ('rows' in $$new_props) $$invalidate(4, rows = $$new_props.rows);
    		if ('light' in $$new_props) $$invalidate(5, light = $$new_props.light);
    		if ('disabled' in $$new_props) $$invalidate(6, disabled = $$new_props.disabled);
    		if ('helperText' in $$new_props) $$invalidate(7, helperText = $$new_props.helperText);
    		if ('labelText' in $$new_props) $$invalidate(8, labelText = $$new_props.labelText);
    		if ('hideLabel' in $$new_props) $$invalidate(9, hideLabel = $$new_props.hideLabel);
    		if ('invalid' in $$new_props) $$invalidate(10, invalid = $$new_props.invalid);
    		if ('invalidText' in $$new_props) $$invalidate(11, invalidText = $$new_props.invalidText);
    		if ('id' in $$new_props) $$invalidate(12, id = $$new_props.id);
    		if ('name' in $$new_props) $$invalidate(13, name = $$new_props.name);
    		if ('ref' in $$new_props) $$invalidate(1, ref = $$new_props.ref);
    		if ('$$scope' in $$new_props) $$invalidate(16, $$scope = $$new_props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		value,
    		placeholder,
    		cols,
    		rows,
    		light,
    		disabled,
    		helperText,
    		labelText,
    		hideLabel,
    		invalid,
    		invalidText,
    		id,
    		name,
    		ref,
    		WarningFilled16: WarningFilled16$1,
    		errorId
    	});

    	$$self.$inject_state = $$new_props => {
    		if ('value' in $$props) $$invalidate(0, value = $$new_props.value);
    		if ('placeholder' in $$props) $$invalidate(2, placeholder = $$new_props.placeholder);
    		if ('cols' in $$props) $$invalidate(3, cols = $$new_props.cols);
    		if ('rows' in $$props) $$invalidate(4, rows = $$new_props.rows);
    		if ('light' in $$props) $$invalidate(5, light = $$new_props.light);
    		if ('disabled' in $$props) $$invalidate(6, disabled = $$new_props.disabled);
    		if ('helperText' in $$props) $$invalidate(7, helperText = $$new_props.helperText);
    		if ('labelText' in $$props) $$invalidate(8, labelText = $$new_props.labelText);
    		if ('hideLabel' in $$props) $$invalidate(9, hideLabel = $$new_props.hideLabel);
    		if ('invalid' in $$props) $$invalidate(10, invalid = $$new_props.invalid);
    		if ('invalidText' in $$props) $$invalidate(11, invalidText = $$new_props.invalidText);
    		if ('id' in $$props) $$invalidate(12, id = $$new_props.id);
    		if ('name' in $$props) $$invalidate(13, name = $$new_props.name);
    		if ('ref' in $$props) $$invalidate(1, ref = $$new_props.ref);
    		if ('errorId' in $$props) $$invalidate(14, errorId = $$new_props.errorId);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*id*/ 4096) {
    			$$invalidate(14, errorId = `error-${id}`);
    		}
    	};

    	return [
    		value,
    		ref,
    		placeholder,
    		cols,
    		rows,
    		light,
    		disabled,
    		helperText,
    		labelText,
    		hideLabel,
    		invalid,
    		invalidText,
    		id,
    		name,
    		errorId,
    		$$restProps,
    		$$scope,
    		slots,
    		click_handler,
    		mouseover_handler,
    		mouseenter_handler,
    		mouseleave_handler,
    		change_handler,
    		input_handler,
    		keydown_handler,
    		keyup_handler,
    		focus_handler,
    		blur_handler,
    		textarea_binding,
    		input_handler_1
    	];
    }

    class TextArea extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$e, create_fragment$e, safe_not_equal, {
    			value: 0,
    			placeholder: 2,
    			cols: 3,
    			rows: 4,
    			light: 5,
    			disabled: 6,
    			helperText: 7,
    			labelText: 8,
    			hideLabel: 9,
    			invalid: 10,
    			invalidText: 11,
    			id: 12,
    			name: 13,
    			ref: 1
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "TextArea",
    			options,
    			id: create_fragment$e.name
    		});
    	}

    	get value() {
    		throw new Error("<TextArea>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set value(value) {
    		throw new Error("<TextArea>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get placeholder() {
    		throw new Error("<TextArea>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set placeholder(value) {
    		throw new Error("<TextArea>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get cols() {
    		throw new Error("<TextArea>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set cols(value) {
    		throw new Error("<TextArea>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get rows() {
    		throw new Error("<TextArea>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set rows(value) {
    		throw new Error("<TextArea>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get light() {
    		throw new Error("<TextArea>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set light(value) {
    		throw new Error("<TextArea>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get disabled() {
    		throw new Error("<TextArea>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set disabled(value) {
    		throw new Error("<TextArea>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get helperText() {
    		throw new Error("<TextArea>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set helperText(value) {
    		throw new Error("<TextArea>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get labelText() {
    		throw new Error("<TextArea>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set labelText(value) {
    		throw new Error("<TextArea>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get hideLabel() {
    		throw new Error("<TextArea>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set hideLabel(value) {
    		throw new Error("<TextArea>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get invalid() {
    		throw new Error("<TextArea>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set invalid(value) {
    		throw new Error("<TextArea>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get invalidText() {
    		throw new Error("<TextArea>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set invalidText(value) {
    		throw new Error("<TextArea>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get id() {
    		throw new Error("<TextArea>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set id(value) {
    		throw new Error("<TextArea>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get name() {
    		throw new Error("<TextArea>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set name(value) {
    		throw new Error("<TextArea>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get ref() {
    		throw new Error("<TextArea>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set ref(value) {
    		throw new Error("<TextArea>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    var TextArea$1 = TextArea;

    /* node_modules\carbon-icons-svelte\lib\ChevronDown16\ChevronDown16.svelte generated by Svelte v3.42.4 */

    const file$d = "node_modules\\carbon-icons-svelte\\lib\\ChevronDown16\\ChevronDown16.svelte";

    // (40:4) {#if title}
    function create_if_block$8(ctx) {
    	let title_1;
    	let t;

    	const block = {
    		c: function create() {
    			title_1 = svg_element("title");
    			t = text(/*title*/ ctx[2]);
    			add_location(title_1, file$d, 40, 6, 1096);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, title_1, anchor);
    			append_dev(title_1, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*title*/ 4) set_data_dev(t, /*title*/ ctx[2]);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(title_1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$8.name,
    		type: "if",
    		source: "(40:4) {#if title}",
    		ctx
    	});

    	return block;
    }

    // (39:8)      
    function fallback_block$3(ctx) {
    	let if_block_anchor;
    	let if_block = /*title*/ ctx[2] && create_if_block$8(ctx);

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (/*title*/ ctx[2]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block$8(ctx);
    					if_block.c();
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}
    		},
    		d: function destroy(detaching) {
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: fallback_block$3.name,
    		type: "fallback",
    		source: "(39:8)      ",
    		ctx
    	});

    	return block;
    }

    function create_fragment$d(ctx) {
    	let svg;
    	let path;
    	let current;
    	let mounted;
    	let dispose;
    	const default_slot_template = /*#slots*/ ctx[11].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[10], null);
    	const default_slot_or_fallback = default_slot || fallback_block$3(ctx);

    	let svg_levels = [
    		{ "data-carbon-icon": "ChevronDown16" },
    		{ xmlns: "http://www.w3.org/2000/svg" },
    		{ viewBox: "0 0 16 16" },
    		{ fill: "currentColor" },
    		{ width: "16" },
    		{ height: "16" },
    		{ class: /*className*/ ctx[0] },
    		{ preserveAspectRatio: "xMidYMid meet" },
    		{ style: /*style*/ ctx[3] },
    		{ id: /*id*/ ctx[1] },
    		/*attributes*/ ctx[4]
    	];

    	let svg_data = {};

    	for (let i = 0; i < svg_levels.length; i += 1) {
    		svg_data = assign(svg_data, svg_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			svg = svg_element("svg");
    			path = svg_element("path");
    			if (default_slot_or_fallback) default_slot_or_fallback.c();
    			attr_dev(path, "d", "M8 11L3 6 3.7 5.3 8 9.6 12.3 5.3 13 6z");
    			add_location(path, file$d, 37, 2, 1008);
    			set_svg_attributes(svg, svg_data);
    			add_location(svg, file$d, 23, 0, 690);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, svg, anchor);
    			append_dev(svg, path);

    			if (default_slot_or_fallback) {
    				default_slot_or_fallback.m(svg, null);
    			}

    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(svg, "click", /*click_handler*/ ctx[12], false, false, false),
    					listen_dev(svg, "mouseover", /*mouseover_handler*/ ctx[13], false, false, false),
    					listen_dev(svg, "mouseenter", /*mouseenter_handler*/ ctx[14], false, false, false),
    					listen_dev(svg, "mouseleave", /*mouseleave_handler*/ ctx[15], false, false, false),
    					listen_dev(svg, "keyup", /*keyup_handler*/ ctx[16], false, false, false),
    					listen_dev(svg, "keydown", /*keydown_handler*/ ctx[17], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 1024)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[10],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[10])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[10], dirty, null),
    						null
    					);
    				}
    			} else {
    				if (default_slot_or_fallback && default_slot_or_fallback.p && (!current || dirty & /*title*/ 4)) {
    					default_slot_or_fallback.p(ctx, !current ? -1 : dirty);
    				}
    			}

    			set_svg_attributes(svg, svg_data = get_spread_update(svg_levels, [
    				{ "data-carbon-icon": "ChevronDown16" },
    				{ xmlns: "http://www.w3.org/2000/svg" },
    				{ viewBox: "0 0 16 16" },
    				{ fill: "currentColor" },
    				{ width: "16" },
    				{ height: "16" },
    				(!current || dirty & /*className*/ 1) && { class: /*className*/ ctx[0] },
    				{ preserveAspectRatio: "xMidYMid meet" },
    				(!current || dirty & /*style*/ 8) && { style: /*style*/ ctx[3] },
    				(!current || dirty & /*id*/ 2) && { id: /*id*/ ctx[1] },
    				dirty & /*attributes*/ 16 && /*attributes*/ ctx[4]
    			]));
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot_or_fallback, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot_or_fallback, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(svg);
    			if (default_slot_or_fallback) default_slot_or_fallback.d(detaching);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$d.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$d($$self, $$props, $$invalidate) {
    	let ariaLabel;
    	let ariaLabelledBy;
    	let labelled;
    	let attributes;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('ChevronDown16', slots, ['default']);
    	let { class: className = undefined } = $$props;
    	let { id = undefined } = $$props;
    	let { tabindex = undefined } = $$props;
    	let { focusable = false } = $$props;
    	let { title = undefined } = $$props;
    	let { style = undefined } = $$props;

    	function click_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function mouseover_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function mouseenter_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function mouseleave_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function keyup_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function keydown_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	$$self.$$set = $$new_props => {
    		$$invalidate(18, $$props = assign(assign({}, $$props), exclude_internal_props($$new_props)));
    		if ('class' in $$new_props) $$invalidate(0, className = $$new_props.class);
    		if ('id' in $$new_props) $$invalidate(1, id = $$new_props.id);
    		if ('tabindex' in $$new_props) $$invalidate(5, tabindex = $$new_props.tabindex);
    		if ('focusable' in $$new_props) $$invalidate(6, focusable = $$new_props.focusable);
    		if ('title' in $$new_props) $$invalidate(2, title = $$new_props.title);
    		if ('style' in $$new_props) $$invalidate(3, style = $$new_props.style);
    		if ('$$scope' in $$new_props) $$invalidate(10, $$scope = $$new_props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		className,
    		id,
    		tabindex,
    		focusable,
    		title,
    		style,
    		labelled,
    		ariaLabelledBy,
    		ariaLabel,
    		attributes
    	});

    	$$self.$inject_state = $$new_props => {
    		$$invalidate(18, $$props = assign(assign({}, $$props), $$new_props));
    		if ('className' in $$props) $$invalidate(0, className = $$new_props.className);
    		if ('id' in $$props) $$invalidate(1, id = $$new_props.id);
    		if ('tabindex' in $$props) $$invalidate(5, tabindex = $$new_props.tabindex);
    		if ('focusable' in $$props) $$invalidate(6, focusable = $$new_props.focusable);
    		if ('title' in $$props) $$invalidate(2, title = $$new_props.title);
    		if ('style' in $$props) $$invalidate(3, style = $$new_props.style);
    		if ('labelled' in $$props) $$invalidate(7, labelled = $$new_props.labelled);
    		if ('ariaLabelledBy' in $$props) $$invalidate(8, ariaLabelledBy = $$new_props.ariaLabelledBy);
    		if ('ariaLabel' in $$props) $$invalidate(9, ariaLabel = $$new_props.ariaLabel);
    		if ('attributes' in $$props) $$invalidate(4, attributes = $$new_props.attributes);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		$$invalidate(9, ariaLabel = $$props['aria-label']);
    		$$invalidate(8, ariaLabelledBy = $$props['aria-labelledby']);

    		if ($$self.$$.dirty & /*ariaLabel, ariaLabelledBy, title*/ 772) {
    			$$invalidate(7, labelled = ariaLabel || ariaLabelledBy || title);
    		}

    		if ($$self.$$.dirty & /*ariaLabel, ariaLabelledBy, labelled, tabindex, focusable*/ 992) {
    			$$invalidate(4, attributes = {
    				'aria-label': ariaLabel,
    				'aria-labelledby': ariaLabelledBy,
    				'aria-hidden': labelled ? undefined : true,
    				role: labelled ? 'img' : undefined,
    				focusable: tabindex === '0' ? true : focusable,
    				tabindex
    			});
    		}
    	};

    	$$props = exclude_internal_props($$props);

    	return [
    		className,
    		id,
    		title,
    		style,
    		attributes,
    		tabindex,
    		focusable,
    		labelled,
    		ariaLabelledBy,
    		ariaLabel,
    		$$scope,
    		slots,
    		click_handler,
    		mouseover_handler,
    		mouseenter_handler,
    		mouseleave_handler,
    		keyup_handler,
    		keydown_handler
    	];
    }

    class ChevronDown16 extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$d, create_fragment$d, safe_not_equal, {
    			class: 0,
    			id: 1,
    			tabindex: 5,
    			focusable: 6,
    			title: 2,
    			style: 3
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "ChevronDown16",
    			options,
    			id: create_fragment$d.name
    		});
    	}

    	get class() {
    		throw new Error("<ChevronDown16>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set class(value) {
    		throw new Error("<ChevronDown16>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get id() {
    		throw new Error("<ChevronDown16>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set id(value) {
    		throw new Error("<ChevronDown16>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get tabindex() {
    		throw new Error("<ChevronDown16>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set tabindex(value) {
    		throw new Error("<ChevronDown16>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get focusable() {
    		throw new Error("<ChevronDown16>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set focusable(value) {
    		throw new Error("<ChevronDown16>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get title() {
    		throw new Error("<ChevronDown16>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set title(value) {
    		throw new Error("<ChevronDown16>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get style() {
    		throw new Error("<ChevronDown16>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set style(value) {
    		throw new Error("<ChevronDown16>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    var ChevronDown16$1 = ChevronDown16;

    /* node_modules\carbon-components-svelte\src\Select\Select.svelte generated by Svelte v3.42.4 */
    const file$c = "node_modules\\carbon-components-svelte\\src\\Select\\Select.svelte";
    const get_labelText_slot_changes = dirty => ({});
    const get_labelText_slot_context = ctx => ({});

    // (92:4) {#if !noLabel}
    function create_if_block_10(ctx) {
    	let label;
    	let current;
    	const labelText_slot_template = /*#slots*/ ctx[20].labelText;
    	const labelText_slot = create_slot(labelText_slot_template, ctx, /*$$scope*/ ctx[19], get_labelText_slot_context);
    	const labelText_slot_or_fallback = labelText_slot || fallback_block$2(ctx);

    	const block = {
    		c: function create() {
    			label = element("label");
    			if (labelText_slot_or_fallback) labelText_slot_or_fallback.c();
    			attr_dev(label, "for", /*id*/ ctx[5]);
    			toggle_class(label, "bx--label", true);
    			toggle_class(label, "bx--visually-hidden", /*hideLabel*/ ctx[14]);
    			toggle_class(label, "bx--label--disabled", /*disabled*/ ctx[4]);
    			add_location(label, file$c, 92, 6, 2435);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, label, anchor);

    			if (labelText_slot_or_fallback) {
    				labelText_slot_or_fallback.m(label, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (labelText_slot) {
    				if (labelText_slot.p && (!current || dirty[0] & /*$$scope*/ 524288)) {
    					update_slot_base(
    						labelText_slot,
    						labelText_slot_template,
    						ctx,
    						/*$$scope*/ ctx[19],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[19])
    						: get_slot_changes(labelText_slot_template, /*$$scope*/ ctx[19], dirty, get_labelText_slot_changes),
    						get_labelText_slot_context
    					);
    				}
    			} else {
    				if (labelText_slot_or_fallback && labelText_slot_or_fallback.p && (!current || dirty[0] & /*labelText*/ 8192)) {
    					labelText_slot_or_fallback.p(ctx, !current ? [-1, -1] : dirty);
    				}
    			}

    			if (!current || dirty[0] & /*id*/ 32) {
    				attr_dev(label, "for", /*id*/ ctx[5]);
    			}

    			if (dirty[0] & /*hideLabel*/ 16384) {
    				toggle_class(label, "bx--visually-hidden", /*hideLabel*/ ctx[14]);
    			}

    			if (dirty[0] & /*disabled*/ 16) {
    				toggle_class(label, "bx--label--disabled", /*disabled*/ ctx[4]);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(labelText_slot_or_fallback, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(labelText_slot_or_fallback, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(label);
    			if (labelText_slot_or_fallback) labelText_slot_or_fallback.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_10.name,
    		type: "if",
    		source: "(92:4) {#if !noLabel}",
    		ctx
    	});

    	return block;
    }

    // (99:31)            
    function fallback_block$2(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text(/*labelText*/ ctx[13]);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*labelText*/ 8192) set_data_dev(t, /*labelText*/ ctx[13]);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: fallback_block$2.name,
    		type: "fallback",
    		source: "(99:31)            ",
    		ctx
    	});

    	return block;
    }

    // (104:4) {#if inline}
    function create_if_block_6(ctx) {
    	let div1;
    	let div0;
    	let select;
    	let select_aria_describedby_value;
    	let select_aria_invalid_value;
    	let select_disabled_value;
    	let select_class_value;
    	let t0;
    	let chevrondown16;
    	let t1;
    	let div0_data_invalid_value;
    	let t2;
    	let t3;
    	let if_block2_anchor;
    	let current;
    	let mounted;
    	let dispose;
    	const default_slot_template = /*#slots*/ ctx[20].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[19], null);

    	chevrondown16 = new ChevronDown16$1({
    			props: { class: "bx--select__arrow" },
    			$$inline: true
    		});

    	let if_block0 = /*invalid*/ ctx[7] && create_if_block_9(ctx);
    	let if_block1 = /*invalid*/ ctx[7] && create_if_block_8(ctx);
    	let if_block2 = /*helperText*/ ctx[11] && create_if_block_7(ctx);

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			div0 = element("div");
    			select = element("select");
    			if (default_slot) default_slot.c();
    			t0 = space();
    			create_component(chevrondown16.$$.fragment);
    			t1 = space();
    			if (if_block0) if_block0.c();
    			t2 = space();
    			if (if_block1) if_block1.c();
    			t3 = space();
    			if (if_block2) if_block2.c();
    			if_block2_anchor = empty();
    			attr_dev(select, "aria-describedby", select_aria_describedby_value = /*invalid*/ ctx[7] ? /*errorId*/ ctx[15] : undefined);
    			attr_dev(select, "aria-invalid", select_aria_invalid_value = /*invalid*/ ctx[7] || undefined);
    			select.disabled = select_disabled_value = /*disabled*/ ctx[4] || undefined;
    			attr_dev(select, "id", /*id*/ ctx[5]);
    			attr_dev(select, "name", /*name*/ ctx[6]);
    			attr_dev(select, "class", select_class_value = /*size*/ ctx[1] && `bx--select-input--${/*size*/ ctx[1]}`);
    			toggle_class(select, "bx--select-input", true);
    			add_location(select, file$c, 109, 10, 2902);
    			attr_dev(div0, "data-invalid", div0_data_invalid_value = /*invalid*/ ctx[7] || undefined);
    			toggle_class(div0, "bx--select-input__wrapper", true);
    			add_location(div0, file$c, 105, 8, 2778);
    			toggle_class(div1, "bx--select-input--inline__wrapper", true);
    			add_location(div1, file$c, 104, 6, 2715);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, div0);
    			append_dev(div0, select);

    			if (default_slot) {
    				default_slot.m(select, null);
    			}

    			/*select_binding*/ ctx[27](select);
    			append_dev(div0, t0);
    			mount_component(chevrondown16, div0, null);
    			append_dev(div0, t1);
    			if (if_block0) if_block0.m(div0, null);
    			append_dev(div1, t2);
    			if (if_block1) if_block1.m(div1, null);
    			insert_dev(target, t3, anchor);
    			if (if_block2) if_block2.m(target, anchor);
    			insert_dev(target, if_block2_anchor, anchor);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(select, "change", /*change_handler*/ ctx[28], false, false, false),
    					listen_dev(select, "input", /*input_handler*/ ctx[24], false, false, false),
    					listen_dev(select, "focus", /*focus_handler*/ ctx[25], false, false, false),
    					listen_dev(select, "blur", /*blur_handler*/ ctx[26], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty[0] & /*$$scope*/ 524288)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[19],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[19])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[19], dirty, null),
    						null
    					);
    				}
    			}

    			if (!current || dirty[0] & /*invalid, errorId*/ 32896 && select_aria_describedby_value !== (select_aria_describedby_value = /*invalid*/ ctx[7] ? /*errorId*/ ctx[15] : undefined)) {
    				attr_dev(select, "aria-describedby", select_aria_describedby_value);
    			}

    			if (!current || dirty[0] & /*invalid*/ 128 && select_aria_invalid_value !== (select_aria_invalid_value = /*invalid*/ ctx[7] || undefined)) {
    				attr_dev(select, "aria-invalid", select_aria_invalid_value);
    			}

    			if (!current || dirty[0] & /*disabled*/ 16 && select_disabled_value !== (select_disabled_value = /*disabled*/ ctx[4] || undefined)) {
    				prop_dev(select, "disabled", select_disabled_value);
    			}

    			if (!current || dirty[0] & /*id*/ 32) {
    				attr_dev(select, "id", /*id*/ ctx[5]);
    			}

    			if (!current || dirty[0] & /*name*/ 64) {
    				attr_dev(select, "name", /*name*/ ctx[6]);
    			}

    			if (!current || dirty[0] & /*size*/ 2 && select_class_value !== (select_class_value = /*size*/ ctx[1] && `bx--select-input--${/*size*/ ctx[1]}`)) {
    				attr_dev(select, "class", select_class_value);
    			}

    			if (dirty[0] & /*size*/ 2) {
    				toggle_class(select, "bx--select-input", true);
    			}

    			if (/*invalid*/ ctx[7]) {
    				if (if_block0) {
    					if (dirty[0] & /*invalid*/ 128) {
    						transition_in(if_block0, 1);
    					}
    				} else {
    					if_block0 = create_if_block_9(ctx);
    					if_block0.c();
    					transition_in(if_block0, 1);
    					if_block0.m(div0, null);
    				}
    			} else if (if_block0) {
    				group_outros();

    				transition_out(if_block0, 1, 1, () => {
    					if_block0 = null;
    				});

    				check_outros();
    			}

    			if (!current || dirty[0] & /*invalid*/ 128 && div0_data_invalid_value !== (div0_data_invalid_value = /*invalid*/ ctx[7] || undefined)) {
    				attr_dev(div0, "data-invalid", div0_data_invalid_value);
    			}

    			if (/*invalid*/ ctx[7]) {
    				if (if_block1) {
    					if_block1.p(ctx, dirty);
    				} else {
    					if_block1 = create_if_block_8(ctx);
    					if_block1.c();
    					if_block1.m(div1, null);
    				}
    			} else if (if_block1) {
    				if_block1.d(1);
    				if_block1 = null;
    			}

    			if (/*helperText*/ ctx[11]) {
    				if (if_block2) {
    					if_block2.p(ctx, dirty);
    				} else {
    					if_block2 = create_if_block_7(ctx);
    					if_block2.c();
    					if_block2.m(if_block2_anchor.parentNode, if_block2_anchor);
    				}
    			} else if (if_block2) {
    				if_block2.d(1);
    				if_block2 = null;
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			transition_in(chevrondown16.$$.fragment, local);
    			transition_in(if_block0);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			transition_out(chevrondown16.$$.fragment, local);
    			transition_out(if_block0);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    			if (default_slot) default_slot.d(detaching);
    			/*select_binding*/ ctx[27](null);
    			destroy_component(chevrondown16);
    			if (if_block0) if_block0.d();
    			if (if_block1) if_block1.d();
    			if (detaching) detach_dev(t3);
    			if (if_block2) if_block2.d(detaching);
    			if (detaching) detach_dev(if_block2_anchor);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_6.name,
    		type: "if",
    		source: "(104:4) {#if inline}",
    		ctx
    	});

    	return block;
    }

    // (129:10) {#if invalid}
    function create_if_block_9(ctx) {
    	let warningfilled16;
    	let current;

    	warningfilled16 = new WarningFilled16$1({
    			props: { class: "bx--select__invalid-icon" },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(warningfilled16.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(warningfilled16, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(warningfilled16.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(warningfilled16.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(warningfilled16, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_9.name,
    		type: "if",
    		source: "(129:10) {#if invalid}",
    		ctx
    	});

    	return block;
    }

    // (133:8) {#if invalid}
    function create_if_block_8(ctx) {
    	let div;
    	let t;

    	const block = {
    		c: function create() {
    			div = element("div");
    			t = text(/*invalidText*/ ctx[8]);
    			attr_dev(div, "id", /*errorId*/ ctx[15]);
    			toggle_class(div, "bx--form-requirement", true);
    			add_location(div, file$c, 133, 10, 3676);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*invalidText*/ 256) set_data_dev(t, /*invalidText*/ ctx[8]);

    			if (dirty[0] & /*errorId*/ 32768) {
    				attr_dev(div, "id", /*errorId*/ ctx[15]);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_8.name,
    		type: "if",
    		source: "(133:8) {#if invalid}",
    		ctx
    	});

    	return block;
    }

    // (139:6) {#if helperText}
    function create_if_block_7(ctx) {
    	let div;
    	let t;

    	const block = {
    		c: function create() {
    			div = element("div");
    			t = text(/*helperText*/ ctx[11]);
    			toggle_class(div, "bx--form__helper-text", true);
    			toggle_class(div, "bx--form__helper-text--disabled", /*disabled*/ ctx[4]);
    			add_location(div, file$c, 139, 8, 3834);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*helperText*/ 2048) set_data_dev(t, /*helperText*/ ctx[11]);

    			if (dirty[0] & /*disabled*/ 16) {
    				toggle_class(div, "bx--form__helper-text--disabled", /*disabled*/ ctx[4]);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_7.name,
    		type: "if",
    		source: "(139:6) {#if helperText}",
    		ctx
    	});

    	return block;
    }

    // (148:4) {#if !inline}
    function create_if_block$7(ctx) {
    	let div;
    	let select;
    	let select_aria_describedby_value;
    	let select_disabled_value;
    	let select_aria_invalid_value;
    	let select_class_value;
    	let t0;
    	let chevrondown16;
    	let t1;
    	let t2;
    	let div_data_invalid_value;
    	let t3;
    	let t4;
    	let t5;
    	let if_block4_anchor;
    	let current;
    	let mounted;
    	let dispose;
    	const default_slot_template = /*#slots*/ ctx[20].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[19], null);

    	chevrondown16 = new ChevronDown16$1({
    			props: { class: "bx--select__arrow" },
    			$$inline: true
    		});

    	let if_block0 = /*invalid*/ ctx[7] && create_if_block_5(ctx);
    	let if_block1 = !/*invalid*/ ctx[7] && /*warn*/ ctx[9] && create_if_block_4$1(ctx);
    	let if_block2 = !/*invalid*/ ctx[7] && /*helperText*/ ctx[11] && create_if_block_3$1(ctx);
    	let if_block3 = /*invalid*/ ctx[7] && create_if_block_2$1(ctx);
    	let if_block4 = !/*invalid*/ ctx[7] && /*warn*/ ctx[9] && create_if_block_1$2(ctx);

    	const block = {
    		c: function create() {
    			div = element("div");
    			select = element("select");
    			if (default_slot) default_slot.c();
    			t0 = space();
    			create_component(chevrondown16.$$.fragment);
    			t1 = space();
    			if (if_block0) if_block0.c();
    			t2 = space();
    			if (if_block1) if_block1.c();
    			t3 = space();
    			if (if_block2) if_block2.c();
    			t4 = space();
    			if (if_block3) if_block3.c();
    			t5 = space();
    			if (if_block4) if_block4.c();
    			if_block4_anchor = empty();
    			attr_dev(select, "id", /*id*/ ctx[5]);
    			attr_dev(select, "name", /*name*/ ctx[6]);
    			attr_dev(select, "aria-describedby", select_aria_describedby_value = /*invalid*/ ctx[7] ? /*errorId*/ ctx[15] : undefined);
    			select.disabled = select_disabled_value = /*disabled*/ ctx[4] || undefined;
    			attr_dev(select, "aria-invalid", select_aria_invalid_value = /*invalid*/ ctx[7] || undefined);
    			attr_dev(select, "class", select_class_value = /*size*/ ctx[1] && `bx--select-input--${/*size*/ ctx[1]}`);
    			toggle_class(select, "bx--select-input", true);
    			add_location(select, file$c, 152, 8, 4157);
    			attr_dev(div, "data-invalid", div_data_invalid_value = /*invalid*/ ctx[7] || undefined);
    			toggle_class(div, "bx--select-input__wrapper", true);
    			add_location(div, file$c, 148, 6, 4041);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, select);

    			if (default_slot) {
    				default_slot.m(select, null);
    			}

    			/*select_binding_1*/ ctx[29](select);
    			append_dev(div, t0);
    			mount_component(chevrondown16, div, null);
    			append_dev(div, t1);
    			if (if_block0) if_block0.m(div, null);
    			append_dev(div, t2);
    			if (if_block1) if_block1.m(div, null);
    			insert_dev(target, t3, anchor);
    			if (if_block2) if_block2.m(target, anchor);
    			insert_dev(target, t4, anchor);
    			if (if_block3) if_block3.m(target, anchor);
    			insert_dev(target, t5, anchor);
    			if (if_block4) if_block4.m(target, anchor);
    			insert_dev(target, if_block4_anchor, anchor);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(select, "change", /*change_handler_1*/ ctx[30], false, false, false),
    					listen_dev(select, "input", /*input_handler_1*/ ctx[21], false, false, false),
    					listen_dev(select, "focus", /*focus_handler_1*/ ctx[22], false, false, false),
    					listen_dev(select, "blur", /*blur_handler_1*/ ctx[23], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty[0] & /*$$scope*/ 524288)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[19],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[19])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[19], dirty, null),
    						null
    					);
    				}
    			}

    			if (!current || dirty[0] & /*id*/ 32) {
    				attr_dev(select, "id", /*id*/ ctx[5]);
    			}

    			if (!current || dirty[0] & /*name*/ 64) {
    				attr_dev(select, "name", /*name*/ ctx[6]);
    			}

    			if (!current || dirty[0] & /*invalid, errorId*/ 32896 && select_aria_describedby_value !== (select_aria_describedby_value = /*invalid*/ ctx[7] ? /*errorId*/ ctx[15] : undefined)) {
    				attr_dev(select, "aria-describedby", select_aria_describedby_value);
    			}

    			if (!current || dirty[0] & /*disabled*/ 16 && select_disabled_value !== (select_disabled_value = /*disabled*/ ctx[4] || undefined)) {
    				prop_dev(select, "disabled", select_disabled_value);
    			}

    			if (!current || dirty[0] & /*invalid*/ 128 && select_aria_invalid_value !== (select_aria_invalid_value = /*invalid*/ ctx[7] || undefined)) {
    				attr_dev(select, "aria-invalid", select_aria_invalid_value);
    			}

    			if (!current || dirty[0] & /*size*/ 2 && select_class_value !== (select_class_value = /*size*/ ctx[1] && `bx--select-input--${/*size*/ ctx[1]}`)) {
    				attr_dev(select, "class", select_class_value);
    			}

    			if (dirty[0] & /*size*/ 2) {
    				toggle_class(select, "bx--select-input", true);
    			}

    			if (/*invalid*/ ctx[7]) {
    				if (if_block0) {
    					if (dirty[0] & /*invalid*/ 128) {
    						transition_in(if_block0, 1);
    					}
    				} else {
    					if_block0 = create_if_block_5(ctx);
    					if_block0.c();
    					transition_in(if_block0, 1);
    					if_block0.m(div, t2);
    				}
    			} else if (if_block0) {
    				group_outros();

    				transition_out(if_block0, 1, 1, () => {
    					if_block0 = null;
    				});

    				check_outros();
    			}

    			if (!/*invalid*/ ctx[7] && /*warn*/ ctx[9]) {
    				if (if_block1) {
    					if (dirty[0] & /*invalid, warn*/ 640) {
    						transition_in(if_block1, 1);
    					}
    				} else {
    					if_block1 = create_if_block_4$1(ctx);
    					if_block1.c();
    					transition_in(if_block1, 1);
    					if_block1.m(div, null);
    				}
    			} else if (if_block1) {
    				group_outros();

    				transition_out(if_block1, 1, 1, () => {
    					if_block1 = null;
    				});

    				check_outros();
    			}

    			if (!current || dirty[0] & /*invalid*/ 128 && div_data_invalid_value !== (div_data_invalid_value = /*invalid*/ ctx[7] || undefined)) {
    				attr_dev(div, "data-invalid", div_data_invalid_value);
    			}

    			if (!/*invalid*/ ctx[7] && /*helperText*/ ctx[11]) {
    				if (if_block2) {
    					if_block2.p(ctx, dirty);
    				} else {
    					if_block2 = create_if_block_3$1(ctx);
    					if_block2.c();
    					if_block2.m(t4.parentNode, t4);
    				}
    			} else if (if_block2) {
    				if_block2.d(1);
    				if_block2 = null;
    			}

    			if (/*invalid*/ ctx[7]) {
    				if (if_block3) {
    					if_block3.p(ctx, dirty);
    				} else {
    					if_block3 = create_if_block_2$1(ctx);
    					if_block3.c();
    					if_block3.m(t5.parentNode, t5);
    				}
    			} else if (if_block3) {
    				if_block3.d(1);
    				if_block3 = null;
    			}

    			if (!/*invalid*/ ctx[7] && /*warn*/ ctx[9]) {
    				if (if_block4) {
    					if_block4.p(ctx, dirty);
    				} else {
    					if_block4 = create_if_block_1$2(ctx);
    					if_block4.c();
    					if_block4.m(if_block4_anchor.parentNode, if_block4_anchor);
    				}
    			} else if (if_block4) {
    				if_block4.d(1);
    				if_block4 = null;
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			transition_in(chevrondown16.$$.fragment, local);
    			transition_in(if_block0);
    			transition_in(if_block1);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			transition_out(chevrondown16.$$.fragment, local);
    			transition_out(if_block0);
    			transition_out(if_block1);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (default_slot) default_slot.d(detaching);
    			/*select_binding_1*/ ctx[29](null);
    			destroy_component(chevrondown16);
    			if (if_block0) if_block0.d();
    			if (if_block1) if_block1.d();
    			if (detaching) detach_dev(t3);
    			if (if_block2) if_block2.d(detaching);
    			if (detaching) detach_dev(t4);
    			if (if_block3) if_block3.d(detaching);
    			if (detaching) detach_dev(t5);
    			if (if_block4) if_block4.d(detaching);
    			if (detaching) detach_dev(if_block4_anchor);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$7.name,
    		type: "if",
    		source: "(148:4) {#if !inline}",
    		ctx
    	});

    	return block;
    }

    // (172:8) {#if invalid}
    function create_if_block_5(ctx) {
    	let warningfilled16;
    	let current;

    	warningfilled16 = new WarningFilled16$1({
    			props: { class: "bx--select__invalid-icon" },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(warningfilled16.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(warningfilled16, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(warningfilled16.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(warningfilled16.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(warningfilled16, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_5.name,
    		type: "if",
    		source: "(172:8) {#if invalid}",
    		ctx
    	});

    	return block;
    }

    // (175:8) {#if !invalid && warn}
    function create_if_block_4$1(ctx) {
    	let warningaltfilled16;
    	let current;

    	warningaltfilled16 = new WarningAltFilled16$1({
    			props: {
    				class: "bx--select__invalid-icon bx--select__invalid-icon--warning"
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(warningaltfilled16.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(warningaltfilled16, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(warningaltfilled16.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(warningaltfilled16.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(warningaltfilled16, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_4$1.name,
    		type: "if",
    		source: "(175:8) {#if !invalid && warn}",
    		ctx
    	});

    	return block;
    }

    // (181:6) {#if !invalid && helperText}
    function create_if_block_3$1(ctx) {
    	let div;
    	let t;

    	const block = {
    		c: function create() {
    			div = element("div");
    			t = text(/*helperText*/ ctx[11]);
    			toggle_class(div, "bx--form__helper-text", true);
    			toggle_class(div, "bx--form__helper-text--disabled", /*disabled*/ ctx[4]);
    			add_location(div, file$c, 181, 8, 5065);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*helperText*/ 2048) set_data_dev(t, /*helperText*/ ctx[11]);

    			if (dirty[0] & /*disabled*/ 16) {
    				toggle_class(div, "bx--form__helper-text--disabled", /*disabled*/ ctx[4]);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_3$1.name,
    		type: "if",
    		source: "(181:6) {#if !invalid && helperText}",
    		ctx
    	});

    	return block;
    }

    // (189:6) {#if invalid}
    function create_if_block_2$1(ctx) {
    	let div;
    	let t;

    	const block = {
    		c: function create() {
    			div = element("div");
    			t = text(/*invalidText*/ ctx[8]);
    			attr_dev(div, "id", /*errorId*/ ctx[15]);
    			toggle_class(div, "bx--form-requirement", true);
    			add_location(div, file$c, 189, 8, 5266);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*invalidText*/ 256) set_data_dev(t, /*invalidText*/ ctx[8]);

    			if (dirty[0] & /*errorId*/ 32768) {
    				attr_dev(div, "id", /*errorId*/ ctx[15]);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2$1.name,
    		type: "if",
    		source: "(189:6) {#if invalid}",
    		ctx
    	});

    	return block;
    }

    // (194:6) {#if !invalid && warn}
    function create_if_block_1$2(ctx) {
    	let div;
    	let t;

    	const block = {
    		c: function create() {
    			div = element("div");
    			t = text(/*warnText*/ ctx[10]);
    			attr_dev(div, "id", /*errorId*/ ctx[15]);
    			toggle_class(div, "bx--form-requirement", true);
    			add_location(div, file$c, 194, 8, 5411);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*warnText*/ 1024) set_data_dev(t, /*warnText*/ ctx[10]);

    			if (dirty[0] & /*errorId*/ 32768) {
    				attr_dev(div, "id", /*errorId*/ ctx[15]);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$2.name,
    		type: "if",
    		source: "(194:6) {#if !invalid && warn}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$c(ctx) {
    	let div1;
    	let div0;
    	let t0;
    	let t1;
    	let current;
    	let if_block0 = !/*noLabel*/ ctx[12] && create_if_block_10(ctx);
    	let if_block1 = /*inline*/ ctx[2] && create_if_block_6(ctx);
    	let if_block2 = !/*inline*/ ctx[2] && create_if_block$7(ctx);
    	let div1_levels = [/*$$restProps*/ ctx[17]];
    	let div1_data = {};

    	for (let i = 0; i < div1_levels.length; i += 1) {
    		div1_data = assign(div1_data, div1_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			div0 = element("div");
    			if (if_block0) if_block0.c();
    			t0 = space();
    			if (if_block1) if_block1.c();
    			t1 = space();
    			if (if_block2) if_block2.c();
    			toggle_class(div0, "bx--select", true);
    			toggle_class(div0, "bx--select--inline", /*inline*/ ctx[2]);
    			toggle_class(div0, "bx--select--light", /*light*/ ctx[3]);
    			toggle_class(div0, "bx--select--invalid", /*invalid*/ ctx[7]);
    			toggle_class(div0, "bx--select--disabled", /*disabled*/ ctx[4]);
    			toggle_class(div0, "bx--select--warning", /*warn*/ ctx[9]);
    			add_location(div0, file$c, 83, 2, 2168);
    			set_attributes(div1, div1_data);
    			toggle_class(div1, "bx--form-item", true);
    			add_location(div1, file$c, 82, 0, 2114);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, div0);
    			if (if_block0) if_block0.m(div0, null);
    			append_dev(div0, t0);
    			if (if_block1) if_block1.m(div0, null);
    			append_dev(div0, t1);
    			if (if_block2) if_block2.m(div0, null);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (!/*noLabel*/ ctx[12]) {
    				if (if_block0) {
    					if_block0.p(ctx, dirty);

    					if (dirty[0] & /*noLabel*/ 4096) {
    						transition_in(if_block0, 1);
    					}
    				} else {
    					if_block0 = create_if_block_10(ctx);
    					if_block0.c();
    					transition_in(if_block0, 1);
    					if_block0.m(div0, t0);
    				}
    			} else if (if_block0) {
    				group_outros();

    				transition_out(if_block0, 1, 1, () => {
    					if_block0 = null;
    				});

    				check_outros();
    			}

    			if (/*inline*/ ctx[2]) {
    				if (if_block1) {
    					if_block1.p(ctx, dirty);

    					if (dirty[0] & /*inline*/ 4) {
    						transition_in(if_block1, 1);
    					}
    				} else {
    					if_block1 = create_if_block_6(ctx);
    					if_block1.c();
    					transition_in(if_block1, 1);
    					if_block1.m(div0, t1);
    				}
    			} else if (if_block1) {
    				group_outros();

    				transition_out(if_block1, 1, 1, () => {
    					if_block1 = null;
    				});

    				check_outros();
    			}

    			if (!/*inline*/ ctx[2]) {
    				if (if_block2) {
    					if_block2.p(ctx, dirty);

    					if (dirty[0] & /*inline*/ 4) {
    						transition_in(if_block2, 1);
    					}
    				} else {
    					if_block2 = create_if_block$7(ctx);
    					if_block2.c();
    					transition_in(if_block2, 1);
    					if_block2.m(div0, null);
    				}
    			} else if (if_block2) {
    				group_outros();

    				transition_out(if_block2, 1, 1, () => {
    					if_block2 = null;
    				});

    				check_outros();
    			}

    			if (dirty[0] & /*inline*/ 4) {
    				toggle_class(div0, "bx--select--inline", /*inline*/ ctx[2]);
    			}

    			if (dirty[0] & /*light*/ 8) {
    				toggle_class(div0, "bx--select--light", /*light*/ ctx[3]);
    			}

    			if (dirty[0] & /*invalid*/ 128) {
    				toggle_class(div0, "bx--select--invalid", /*invalid*/ ctx[7]);
    			}

    			if (dirty[0] & /*disabled*/ 16) {
    				toggle_class(div0, "bx--select--disabled", /*disabled*/ ctx[4]);
    			}

    			if (dirty[0] & /*warn*/ 512) {
    				toggle_class(div0, "bx--select--warning", /*warn*/ ctx[9]);
    			}

    			set_attributes(div1, div1_data = get_spread_update(div1_levels, [dirty[0] & /*$$restProps*/ 131072 && /*$$restProps*/ ctx[17]]));
    			toggle_class(div1, "bx--form-item", true);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block0);
    			transition_in(if_block1);
    			transition_in(if_block2);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block0);
    			transition_out(if_block1);
    			transition_out(if_block2);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    			if (if_block0) if_block0.d();
    			if (if_block1) if_block1.d();
    			if (if_block2) if_block2.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$c.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$c($$self, $$props, $$invalidate) {
    	let errorId;

    	const omit_props_names = [
    		"selected","size","inline","light","disabled","id","name","invalid","invalidText","warn","warnText","helperText","noLabel","labelText","hideLabel","ref"
    	];

    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let $selectedValue;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Select', slots, ['labelText','default']);
    	let { selected = undefined } = $$props;
    	let { size = undefined } = $$props;
    	let { inline = false } = $$props;
    	let { light = false } = $$props;
    	let { disabled = false } = $$props;
    	let { id = "ccs-" + Math.random().toString(36) } = $$props;
    	let { name = undefined } = $$props;
    	let { invalid = false } = $$props;
    	let { invalidText = "" } = $$props;
    	let { warn = false } = $$props;
    	let { warnText = "" } = $$props;
    	let { helperText = "" } = $$props;
    	let { noLabel = false } = $$props;
    	let { labelText = "" } = $$props;
    	let { hideLabel = false } = $$props;
    	let { ref = null } = $$props;
    	const dispatch = createEventDispatcher();
    	const selectedValue = writable(selected);
    	validate_store(selectedValue, 'selectedValue');
    	component_subscribe($$self, selectedValue, value => $$invalidate(31, $selectedValue = value));
    	setContext("Select", { selectedValue });

    	afterUpdate(() => {
    		$$invalidate(18, selected = $selectedValue);
    		dispatch("change", $selectedValue);
    	});

    	function input_handler_1(event) {
    		bubble.call(this, $$self, event);
    	}

    	function focus_handler_1(event) {
    		bubble.call(this, $$self, event);
    	}

    	function blur_handler_1(event) {
    		bubble.call(this, $$self, event);
    	}

    	function input_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function focus_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function blur_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function select_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			ref = $$value;
    			$$invalidate(0, ref);
    		});
    	}

    	const change_handler = ({ target }) => {
    		selectedValue.set(target.value);
    	};

    	function select_binding_1($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			ref = $$value;
    			$$invalidate(0, ref);
    		});
    	}

    	const change_handler_1 = ({ target }) => {
    		selectedValue.set(target.value);
    	};

    	$$self.$$set = $$new_props => {
    		$$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
    		$$invalidate(17, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ('selected' in $$new_props) $$invalidate(18, selected = $$new_props.selected);
    		if ('size' in $$new_props) $$invalidate(1, size = $$new_props.size);
    		if ('inline' in $$new_props) $$invalidate(2, inline = $$new_props.inline);
    		if ('light' in $$new_props) $$invalidate(3, light = $$new_props.light);
    		if ('disabled' in $$new_props) $$invalidate(4, disabled = $$new_props.disabled);
    		if ('id' in $$new_props) $$invalidate(5, id = $$new_props.id);
    		if ('name' in $$new_props) $$invalidate(6, name = $$new_props.name);
    		if ('invalid' in $$new_props) $$invalidate(7, invalid = $$new_props.invalid);
    		if ('invalidText' in $$new_props) $$invalidate(8, invalidText = $$new_props.invalidText);
    		if ('warn' in $$new_props) $$invalidate(9, warn = $$new_props.warn);
    		if ('warnText' in $$new_props) $$invalidate(10, warnText = $$new_props.warnText);
    		if ('helperText' in $$new_props) $$invalidate(11, helperText = $$new_props.helperText);
    		if ('noLabel' in $$new_props) $$invalidate(12, noLabel = $$new_props.noLabel);
    		if ('labelText' in $$new_props) $$invalidate(13, labelText = $$new_props.labelText);
    		if ('hideLabel' in $$new_props) $$invalidate(14, hideLabel = $$new_props.hideLabel);
    		if ('ref' in $$new_props) $$invalidate(0, ref = $$new_props.ref);
    		if ('$$scope' in $$new_props) $$invalidate(19, $$scope = $$new_props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		selected,
    		size,
    		inline,
    		light,
    		disabled,
    		id,
    		name,
    		invalid,
    		invalidText,
    		warn,
    		warnText,
    		helperText,
    		noLabel,
    		labelText,
    		hideLabel,
    		ref,
    		createEventDispatcher,
    		setContext,
    		afterUpdate,
    		writable,
    		ChevronDown16: ChevronDown16$1,
    		WarningFilled16: WarningFilled16$1,
    		WarningAltFilled16: WarningAltFilled16$1,
    		dispatch,
    		selectedValue,
    		errorId,
    		$selectedValue
    	});

    	$$self.$inject_state = $$new_props => {
    		if ('selected' in $$props) $$invalidate(18, selected = $$new_props.selected);
    		if ('size' in $$props) $$invalidate(1, size = $$new_props.size);
    		if ('inline' in $$props) $$invalidate(2, inline = $$new_props.inline);
    		if ('light' in $$props) $$invalidate(3, light = $$new_props.light);
    		if ('disabled' in $$props) $$invalidate(4, disabled = $$new_props.disabled);
    		if ('id' in $$props) $$invalidate(5, id = $$new_props.id);
    		if ('name' in $$props) $$invalidate(6, name = $$new_props.name);
    		if ('invalid' in $$props) $$invalidate(7, invalid = $$new_props.invalid);
    		if ('invalidText' in $$props) $$invalidate(8, invalidText = $$new_props.invalidText);
    		if ('warn' in $$props) $$invalidate(9, warn = $$new_props.warn);
    		if ('warnText' in $$props) $$invalidate(10, warnText = $$new_props.warnText);
    		if ('helperText' in $$props) $$invalidate(11, helperText = $$new_props.helperText);
    		if ('noLabel' in $$props) $$invalidate(12, noLabel = $$new_props.noLabel);
    		if ('labelText' in $$props) $$invalidate(13, labelText = $$new_props.labelText);
    		if ('hideLabel' in $$props) $$invalidate(14, hideLabel = $$new_props.hideLabel);
    		if ('ref' in $$props) $$invalidate(0, ref = $$new_props.ref);
    		if ('errorId' in $$props) $$invalidate(15, errorId = $$new_props.errorId);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty[0] & /*id*/ 32) {
    			$$invalidate(15, errorId = `error-${id}`);
    		}

    		if ($$self.$$.dirty[0] & /*selected*/ 262144) {
    			selectedValue.set(selected);
    		}
    	};

    	return [
    		ref,
    		size,
    		inline,
    		light,
    		disabled,
    		id,
    		name,
    		invalid,
    		invalidText,
    		warn,
    		warnText,
    		helperText,
    		noLabel,
    		labelText,
    		hideLabel,
    		errorId,
    		selectedValue,
    		$$restProps,
    		selected,
    		$$scope,
    		slots,
    		input_handler_1,
    		focus_handler_1,
    		blur_handler_1,
    		input_handler,
    		focus_handler,
    		blur_handler,
    		select_binding,
    		change_handler,
    		select_binding_1,
    		change_handler_1
    	];
    }

    class Select extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(
    			this,
    			options,
    			instance$c,
    			create_fragment$c,
    			safe_not_equal,
    			{
    				selected: 18,
    				size: 1,
    				inline: 2,
    				light: 3,
    				disabled: 4,
    				id: 5,
    				name: 6,
    				invalid: 7,
    				invalidText: 8,
    				warn: 9,
    				warnText: 10,
    				helperText: 11,
    				noLabel: 12,
    				labelText: 13,
    				hideLabel: 14,
    				ref: 0
    			},
    			null,
    			[-1, -1]
    		);

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Select",
    			options,
    			id: create_fragment$c.name
    		});
    	}

    	get selected() {
    		throw new Error("<Select>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set selected(value) {
    		throw new Error("<Select>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get size() {
    		throw new Error("<Select>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set size(value) {
    		throw new Error("<Select>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get inline() {
    		throw new Error("<Select>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set inline(value) {
    		throw new Error("<Select>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get light() {
    		throw new Error("<Select>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set light(value) {
    		throw new Error("<Select>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get disabled() {
    		throw new Error("<Select>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set disabled(value) {
    		throw new Error("<Select>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get id() {
    		throw new Error("<Select>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set id(value) {
    		throw new Error("<Select>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get name() {
    		throw new Error("<Select>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set name(value) {
    		throw new Error("<Select>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get invalid() {
    		throw new Error("<Select>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set invalid(value) {
    		throw new Error("<Select>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get invalidText() {
    		throw new Error("<Select>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set invalidText(value) {
    		throw new Error("<Select>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get warn() {
    		throw new Error("<Select>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set warn(value) {
    		throw new Error("<Select>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get warnText() {
    		throw new Error("<Select>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set warnText(value) {
    		throw new Error("<Select>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get helperText() {
    		throw new Error("<Select>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set helperText(value) {
    		throw new Error("<Select>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get noLabel() {
    		throw new Error("<Select>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set noLabel(value) {
    		throw new Error("<Select>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get labelText() {
    		throw new Error("<Select>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set labelText(value) {
    		throw new Error("<Select>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get hideLabel() {
    		throw new Error("<Select>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set hideLabel(value) {
    		throw new Error("<Select>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get ref() {
    		throw new Error("<Select>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set ref(value) {
    		throw new Error("<Select>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    var Select$1 = Select;

    /* node_modules\carbon-components-svelte\src\Select\SelectItem.svelte generated by Svelte v3.42.4 */
    const file$b = "node_modules\\carbon-components-svelte\\src\\Select\\SelectItem.svelte";

    function create_fragment$b(ctx) {
    	let option;
    	let t_value = (/*text*/ ctx[1] || /*value*/ ctx[0]) + "";
    	let t;
    	let option_class_value;
    	let option_style_value;

    	const block = {
    		c: function create() {
    			option = element("option");
    			t = text(t_value);
    			option.__value = /*value*/ ctx[0];
    			option.value = option.__value;
    			option.disabled = /*disabled*/ ctx[3];
    			option.hidden = /*hidden*/ ctx[2];
    			option.selected = /*selected*/ ctx[4];
    			attr_dev(option, "class", option_class_value = /*$$restProps*/ ctx[5].class);
    			attr_dev(option, "style", option_style_value = /*$$restProps*/ ctx[5].style);
    			toggle_class(option, "bx--select-option", true);
    			add_location(option, file$b, 28, 0, 595);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, option, anchor);
    			append_dev(option, t);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*text, value*/ 3 && t_value !== (t_value = (/*text*/ ctx[1] || /*value*/ ctx[0]) + "")) set_data_dev(t, t_value);

    			if (dirty & /*value*/ 1) {
    				prop_dev(option, "__value", /*value*/ ctx[0]);
    				option.value = option.__value;
    			}

    			if (dirty & /*disabled*/ 8) {
    				prop_dev(option, "disabled", /*disabled*/ ctx[3]);
    			}

    			if (dirty & /*hidden*/ 4) {
    				prop_dev(option, "hidden", /*hidden*/ ctx[2]);
    			}

    			if (dirty & /*selected*/ 16) {
    				prop_dev(option, "selected", /*selected*/ ctx[4]);
    			}

    			if (dirty & /*$$restProps*/ 32 && option_class_value !== (option_class_value = /*$$restProps*/ ctx[5].class)) {
    				attr_dev(option, "class", option_class_value);
    			}

    			if (dirty & /*$$restProps*/ 32 && option_style_value !== (option_style_value = /*$$restProps*/ ctx[5].style)) {
    				attr_dev(option, "style", option_style_value);
    			}

    			if (dirty & /*$$restProps*/ 32) {
    				toggle_class(option, "bx--select-option", true);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(option);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$b.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$b($$self, $$props, $$invalidate) {
    	const omit_props_names = ["value","text","hidden","disabled"];
    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('SelectItem', slots, []);
    	let { value = "" } = $$props;
    	let { text = "" } = $$props;
    	let { hidden = false } = $$props;
    	let { disabled = false } = $$props;
    	const ctx = getContext("Select") || getContext("TimePickerSelect");
    	let selected = false;

    	const unsubscribe = ctx.selectedValue.subscribe(currentValue => {
    		$$invalidate(4, selected = currentValue === value);
    	});

    	onDestroy(() => {
    		unsubscribe();
    	});

    	$$self.$$set = $$new_props => {
    		$$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
    		$$invalidate(5, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ('value' in $$new_props) $$invalidate(0, value = $$new_props.value);
    		if ('text' in $$new_props) $$invalidate(1, text = $$new_props.text);
    		if ('hidden' in $$new_props) $$invalidate(2, hidden = $$new_props.hidden);
    		if ('disabled' in $$new_props) $$invalidate(3, disabled = $$new_props.disabled);
    	};

    	$$self.$capture_state = () => ({
    		value,
    		text,
    		hidden,
    		disabled,
    		getContext,
    		onDestroy,
    		ctx,
    		selected,
    		unsubscribe
    	});

    	$$self.$inject_state = $$new_props => {
    		if ('value' in $$props) $$invalidate(0, value = $$new_props.value);
    		if ('text' in $$props) $$invalidate(1, text = $$new_props.text);
    		if ('hidden' in $$props) $$invalidate(2, hidden = $$new_props.hidden);
    		if ('disabled' in $$props) $$invalidate(3, disabled = $$new_props.disabled);
    		if ('selected' in $$props) $$invalidate(4, selected = $$new_props.selected);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [value, text, hidden, disabled, selected, $$restProps];
    }

    class SelectItem extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$b, create_fragment$b, safe_not_equal, {
    			value: 0,
    			text: 1,
    			hidden: 2,
    			disabled: 3
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "SelectItem",
    			options,
    			id: create_fragment$b.name
    		});
    	}

    	get value() {
    		throw new Error("<SelectItem>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set value(value) {
    		throw new Error("<SelectItem>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get text() {
    		throw new Error("<SelectItem>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set text(value) {
    		throw new Error("<SelectItem>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get hidden() {
    		throw new Error("<SelectItem>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set hidden(value) {
    		throw new Error("<SelectItem>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get disabled() {
    		throw new Error("<SelectItem>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set disabled(value) {
    		throw new Error("<SelectItem>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    var SelectItem$1 = SelectItem;

    /* node_modules\carbon-components-svelte\src\Button\ButtonSkeleton.svelte generated by Svelte v3.42.4 */

    const file$a = "node_modules\\carbon-components-svelte\\src\\Button\\ButtonSkeleton.svelte";

    // (41:0) {:else}
    function create_else_block$3(ctx) {
    	let div;
    	let mounted;
    	let dispose;
    	let div_levels = [/*$$restProps*/ ctx[3]];
    	let div_data = {};

    	for (let i = 0; i < div_levels.length; i += 1) {
    		div_data = assign(div_data, div_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			div = element("div");
    			set_attributes(div, div_data);
    			toggle_class(div, "bx--skeleton", true);
    			toggle_class(div, "bx--btn", true);
    			toggle_class(div, "bx--btn--field", /*size*/ ctx[1] === 'field');
    			toggle_class(div, "bx--btn--sm", /*size*/ ctx[1] === 'small' || /*small*/ ctx[2]);
    			toggle_class(div, "bx--btn--lg", /*size*/ ctx[1] === 'lg');
    			toggle_class(div, "bx--btn--xl", /*size*/ ctx[1] === 'xl');
    			add_location(div, file$a, 41, 2, 950);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			if (!mounted) {
    				dispose = [
    					listen_dev(div, "click", /*click_handler_1*/ ctx[8], false, false, false),
    					listen_dev(div, "mouseover", /*mouseover_handler_1*/ ctx[9], false, false, false),
    					listen_dev(div, "mouseenter", /*mouseenter_handler_1*/ ctx[10], false, false, false),
    					listen_dev(div, "mouseleave", /*mouseleave_handler_1*/ ctx[11], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			set_attributes(div, div_data = get_spread_update(div_levels, [dirty & /*$$restProps*/ 8 && /*$$restProps*/ ctx[3]]));
    			toggle_class(div, "bx--skeleton", true);
    			toggle_class(div, "bx--btn", true);
    			toggle_class(div, "bx--btn--field", /*size*/ ctx[1] === 'field');
    			toggle_class(div, "bx--btn--sm", /*size*/ ctx[1] === 'small' || /*small*/ ctx[2]);
    			toggle_class(div, "bx--btn--lg", /*size*/ ctx[1] === 'lg');
    			toggle_class(div, "bx--btn--xl", /*size*/ ctx[1] === 'xl');
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$3.name,
    		type: "else",
    		source: "(41:0) {:else}",
    		ctx
    	});

    	return block;
    }

    // (22:0) {#if href}
    function create_if_block$6(ctx) {
    	let a;
    	let t_value = "" + "";
    	let t;
    	let a_rel_value;
    	let mounted;
    	let dispose;

    	let a_levels = [
    		{ href: /*href*/ ctx[0] },
    		{
    			rel: a_rel_value = /*$$restProps*/ ctx[3].target === '_blank'
    			? 'noopener noreferrer'
    			: undefined
    		},
    		{ role: "button" },
    		/*$$restProps*/ ctx[3]
    	];

    	let a_data = {};

    	for (let i = 0; i < a_levels.length; i += 1) {
    		a_data = assign(a_data, a_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			a = element("a");
    			t = text(t_value);
    			set_attributes(a, a_data);
    			toggle_class(a, "bx--skeleton", true);
    			toggle_class(a, "bx--btn", true);
    			toggle_class(a, "bx--btn--field", /*size*/ ctx[1] === 'field');
    			toggle_class(a, "bx--btn--sm", /*size*/ ctx[1] === 'small' || /*small*/ ctx[2]);
    			toggle_class(a, "bx--btn--lg", /*size*/ ctx[1] === 'lg');
    			toggle_class(a, "bx--btn--xl", /*size*/ ctx[1] === 'xl');
    			add_location(a, file$a, 22, 2, 477);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, a, anchor);
    			append_dev(a, t);

    			if (!mounted) {
    				dispose = [
    					listen_dev(a, "click", /*click_handler*/ ctx[4], false, false, false),
    					listen_dev(a, "mouseover", /*mouseover_handler*/ ctx[5], false, false, false),
    					listen_dev(a, "mouseenter", /*mouseenter_handler*/ ctx[6], false, false, false),
    					listen_dev(a, "mouseleave", /*mouseleave_handler*/ ctx[7], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			set_attributes(a, a_data = get_spread_update(a_levels, [
    				dirty & /*href*/ 1 && { href: /*href*/ ctx[0] },
    				dirty & /*$$restProps*/ 8 && a_rel_value !== (a_rel_value = /*$$restProps*/ ctx[3].target === '_blank'
    				? 'noopener noreferrer'
    				: undefined) && { rel: a_rel_value },
    				{ role: "button" },
    				dirty & /*$$restProps*/ 8 && /*$$restProps*/ ctx[3]
    			]));

    			toggle_class(a, "bx--skeleton", true);
    			toggle_class(a, "bx--btn", true);
    			toggle_class(a, "bx--btn--field", /*size*/ ctx[1] === 'field');
    			toggle_class(a, "bx--btn--sm", /*size*/ ctx[1] === 'small' || /*small*/ ctx[2]);
    			toggle_class(a, "bx--btn--lg", /*size*/ ctx[1] === 'lg');
    			toggle_class(a, "bx--btn--xl", /*size*/ ctx[1] === 'xl');
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(a);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$6.name,
    		type: "if",
    		source: "(22:0) {#if href}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$a(ctx) {
    	let if_block_anchor;

    	function select_block_type(ctx, dirty) {
    		if (/*href*/ ctx[0]) return create_if_block$6;
    		return create_else_block$3;
    	}

    	let current_block_type = select_block_type(ctx);
    	let if_block = current_block_type(ctx);

    	const block = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    		},
    		p: function update(ctx, [dirty]) {
    			if (current_block_type === (current_block_type = select_block_type(ctx)) && if_block) {
    				if_block.p(ctx, dirty);
    			} else {
    				if_block.d(1);
    				if_block = current_block_type(ctx);

    				if (if_block) {
    					if_block.c();
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$a.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$a($$self, $$props, $$invalidate) {
    	const omit_props_names = ["href","size","small"];
    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('ButtonSkeleton', slots, []);
    	let { href = undefined } = $$props;
    	let { size = "default" } = $$props;
    	let { small = false } = $$props;

    	function click_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function mouseover_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function mouseenter_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function mouseleave_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function click_handler_1(event) {
    		bubble.call(this, $$self, event);
    	}

    	function mouseover_handler_1(event) {
    		bubble.call(this, $$self, event);
    	}

    	function mouseenter_handler_1(event) {
    		bubble.call(this, $$self, event);
    	}

    	function mouseleave_handler_1(event) {
    		bubble.call(this, $$self, event);
    	}

    	$$self.$$set = $$new_props => {
    		$$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
    		$$invalidate(3, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ('href' in $$new_props) $$invalidate(0, href = $$new_props.href);
    		if ('size' in $$new_props) $$invalidate(1, size = $$new_props.size);
    		if ('small' in $$new_props) $$invalidate(2, small = $$new_props.small);
    	};

    	$$self.$capture_state = () => ({ href, size, small });

    	$$self.$inject_state = $$new_props => {
    		if ('href' in $$props) $$invalidate(0, href = $$new_props.href);
    		if ('size' in $$props) $$invalidate(1, size = $$new_props.size);
    		if ('small' in $$props) $$invalidate(2, small = $$new_props.small);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		href,
    		size,
    		small,
    		$$restProps,
    		click_handler,
    		mouseover_handler,
    		mouseenter_handler,
    		mouseleave_handler,
    		click_handler_1,
    		mouseover_handler_1,
    		mouseenter_handler_1,
    		mouseleave_handler_1
    	];
    }

    class ButtonSkeleton extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$a, create_fragment$a, safe_not_equal, { href: 0, size: 1, small: 2 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "ButtonSkeleton",
    			options,
    			id: create_fragment$a.name
    		});
    	}

    	get href() {
    		throw new Error("<ButtonSkeleton>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set href(value) {
    		throw new Error("<ButtonSkeleton>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get size() {
    		throw new Error("<ButtonSkeleton>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set size(value) {
    		throw new Error("<ButtonSkeleton>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get small() {
    		throw new Error("<ButtonSkeleton>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set small(value) {
    		throw new Error("<ButtonSkeleton>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    var ButtonSkeleton$1 = ButtonSkeleton;

    /* node_modules\carbon-components-svelte\src\Button\Button.svelte generated by Svelte v3.42.4 */
    const file$9 = "node_modules\\carbon-components-svelte\\src\\Button\\Button.svelte";
    const get_default_slot_changes = dirty => ({ props: dirty[0] & /*buttonProps*/ 512 });
    const get_default_slot_context = ctx => ({ props: /*buttonProps*/ ctx[9] });

    // (168:0) {:else}
    function create_else_block$2(ctx) {
    	let button;
    	let t;
    	let switch_instance;
    	let current;
    	let mounted;
    	let dispose;
    	let if_block = /*hasIconOnly*/ ctx[0] && create_if_block_4(ctx);
    	const default_slot_template = /*#slots*/ ctx[19].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[18], null);
    	var switch_value = /*icon*/ ctx[3];

    	function switch_props(ctx) {
    		return {
    			props: {
    				"aria-hidden": "true",
    				class: "bx--btn__icon",
    				"aria-label": /*iconDescription*/ ctx[4]
    			},
    			$$inline: true
    		};
    	}

    	if (switch_value) {
    		switch_instance = new switch_value(switch_props(ctx));
    	}

    	let button_levels = [/*buttonProps*/ ctx[9]];
    	let button_data = {};

    	for (let i = 0; i < button_levels.length; i += 1) {
    		button_data = assign(button_data, button_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			button = element("button");
    			if (if_block) if_block.c();
    			t = space();
    			if (default_slot) default_slot.c();
    			if (switch_instance) create_component(switch_instance.$$.fragment);
    			set_attributes(button, button_data);
    			add_location(button, file$9, 168, 2, 4583);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);
    			if (if_block) if_block.m(button, null);
    			append_dev(button, t);

    			if (default_slot) {
    				default_slot.m(button, null);
    			}

    			if (switch_instance) {
    				mount_component(switch_instance, button, null);
    			}

    			if (button.autofocus) button.focus();
    			/*button_binding*/ ctx[33](button);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(button, "click", /*click_handler_2*/ ctx[24], false, false, false),
    					listen_dev(button, "mouseover", /*mouseover_handler_2*/ ctx[25], false, false, false),
    					listen_dev(button, "mouseenter", /*mouseenter_handler_2*/ ctx[26], false, false, false),
    					listen_dev(button, "mouseleave", /*mouseleave_handler_2*/ ctx[27], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (/*hasIconOnly*/ ctx[0]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block_4(ctx);
    					if_block.c();
    					if_block.m(button, t);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}

    			if (default_slot) {
    				if (default_slot.p && (!current || dirty[0] & /*$$scope*/ 262144)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[18],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[18])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[18], dirty, null),
    						null
    					);
    				}
    			}

    			const switch_instance_changes = {};
    			if (dirty[0] & /*iconDescription*/ 16) switch_instance_changes["aria-label"] = /*iconDescription*/ ctx[4];

    			if (switch_value !== (switch_value = /*icon*/ ctx[3])) {
    				if (switch_instance) {
    					group_outros();
    					const old_component = switch_instance;

    					transition_out(old_component.$$.fragment, 1, 0, () => {
    						destroy_component(old_component, 1);
    					});

    					check_outros();
    				}

    				if (switch_value) {
    					switch_instance = new switch_value(switch_props(ctx));
    					create_component(switch_instance.$$.fragment);
    					transition_in(switch_instance.$$.fragment, 1);
    					mount_component(switch_instance, button, null);
    				} else {
    					switch_instance = null;
    				}
    			} else if (switch_value) {
    				switch_instance.$set(switch_instance_changes);
    			}

    			set_attributes(button, button_data = get_spread_update(button_levels, [dirty[0] & /*buttonProps*/ 512 && /*buttonProps*/ ctx[9]]));
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			if (switch_instance) transition_in(switch_instance.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			if (switch_instance) transition_out(switch_instance.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    			if (if_block) if_block.d();
    			if (default_slot) default_slot.d(detaching);
    			if (switch_instance) destroy_component(switch_instance);
    			/*button_binding*/ ctx[33](null);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$2.name,
    		type: "else",
    		source: "(168:0) {:else}",
    		ctx
    	});

    	return block;
    }

    // (148:28) 
    function create_if_block_2(ctx) {
    	let a;
    	let t;
    	let switch_instance;
    	let current;
    	let mounted;
    	let dispose;
    	let if_block = /*hasIconOnly*/ ctx[0] && create_if_block_3(ctx);
    	const default_slot_template = /*#slots*/ ctx[19].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[18], null);
    	var switch_value = /*icon*/ ctx[3];

    	function switch_props(ctx) {
    		return {
    			props: {
    				"aria-hidden": "true",
    				class: "bx--btn__icon",
    				"aria-label": /*iconDescription*/ ctx[4]
    			},
    			$$inline: true
    		};
    	}

    	if (switch_value) {
    		switch_instance = new switch_value(switch_props(ctx));
    	}

    	let a_levels = [/*buttonProps*/ ctx[9]];
    	let a_data = {};

    	for (let i = 0; i < a_levels.length; i += 1) {
    		a_data = assign(a_data, a_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			a = element("a");
    			if (if_block) if_block.c();
    			t = space();
    			if (default_slot) default_slot.c();
    			if (switch_instance) create_component(switch_instance.$$.fragment);
    			set_attributes(a, a_data);
    			add_location(a, file$9, 149, 2, 4200);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, a, anchor);
    			if (if_block) if_block.m(a, null);
    			append_dev(a, t);

    			if (default_slot) {
    				default_slot.m(a, null);
    			}

    			if (switch_instance) {
    				mount_component(switch_instance, a, null);
    			}

    			/*a_binding*/ ctx[32](a);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(a, "click", /*click_handler_1*/ ctx[20], false, false, false),
    					listen_dev(a, "mouseover", /*mouseover_handler_1*/ ctx[21], false, false, false),
    					listen_dev(a, "mouseenter", /*mouseenter_handler_1*/ ctx[22], false, false, false),
    					listen_dev(a, "mouseleave", /*mouseleave_handler_1*/ ctx[23], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (/*hasIconOnly*/ ctx[0]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block_3(ctx);
    					if_block.c();
    					if_block.m(a, t);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}

    			if (default_slot) {
    				if (default_slot.p && (!current || dirty[0] & /*$$scope*/ 262144)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[18],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[18])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[18], dirty, null),
    						null
    					);
    				}
    			}

    			const switch_instance_changes = {};
    			if (dirty[0] & /*iconDescription*/ 16) switch_instance_changes["aria-label"] = /*iconDescription*/ ctx[4];

    			if (switch_value !== (switch_value = /*icon*/ ctx[3])) {
    				if (switch_instance) {
    					group_outros();
    					const old_component = switch_instance;

    					transition_out(old_component.$$.fragment, 1, 0, () => {
    						destroy_component(old_component, 1);
    					});

    					check_outros();
    				}

    				if (switch_value) {
    					switch_instance = new switch_value(switch_props(ctx));
    					create_component(switch_instance.$$.fragment);
    					transition_in(switch_instance.$$.fragment, 1);
    					mount_component(switch_instance, a, null);
    				} else {
    					switch_instance = null;
    				}
    			} else if (switch_value) {
    				switch_instance.$set(switch_instance_changes);
    			}

    			set_attributes(a, a_data = get_spread_update(a_levels, [dirty[0] & /*buttonProps*/ 512 && /*buttonProps*/ ctx[9]]));
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			if (switch_instance) transition_in(switch_instance.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			if (switch_instance) transition_out(switch_instance.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(a);
    			if (if_block) if_block.d();
    			if (default_slot) default_slot.d(detaching);
    			if (switch_instance) destroy_component(switch_instance);
    			/*a_binding*/ ctx[32](null);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2.name,
    		type: "if",
    		source: "(148:28) ",
    		ctx
    	});

    	return block;
    }

    // (146:13) 
    function create_if_block_1$1(ctx) {
    	let current;
    	const default_slot_template = /*#slots*/ ctx[19].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[18], get_default_slot_context);

    	const block = {
    		c: function create() {
    			if (default_slot) default_slot.c();
    		},
    		m: function mount(target, anchor) {
    			if (default_slot) {
    				default_slot.m(target, anchor);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty[0] & /*$$scope, buttonProps*/ 262656)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[18],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[18])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[18], dirty, get_default_slot_changes),
    						get_default_slot_context
    					);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$1.name,
    		type: "if",
    		source: "(146:13) ",
    		ctx
    	});

    	return block;
    }

    // (135:0) {#if skeleton}
    function create_if_block$5(ctx) {
    	let buttonskeleton;
    	let current;

    	const buttonskeleton_spread_levels = [
    		{ href: /*href*/ ctx[8] },
    		{ size: /*size*/ ctx[2] },
    		/*$$restProps*/ ctx[10],
    		{
    			style: /*hasIconOnly*/ ctx[0] && 'width: 3rem;'
    		}
    	];

    	let buttonskeleton_props = {};

    	for (let i = 0; i < buttonskeleton_spread_levels.length; i += 1) {
    		buttonskeleton_props = assign(buttonskeleton_props, buttonskeleton_spread_levels[i]);
    	}

    	buttonskeleton = new ButtonSkeleton$1({
    			props: buttonskeleton_props,
    			$$inline: true
    		});

    	buttonskeleton.$on("click", /*click_handler*/ ctx[28]);
    	buttonskeleton.$on("mouseover", /*mouseover_handler*/ ctx[29]);
    	buttonskeleton.$on("mouseenter", /*mouseenter_handler*/ ctx[30]);
    	buttonskeleton.$on("mouseleave", /*mouseleave_handler*/ ctx[31]);

    	const block = {
    		c: function create() {
    			create_component(buttonskeleton.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(buttonskeleton, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const buttonskeleton_changes = (dirty[0] & /*href, size, $$restProps, hasIconOnly*/ 1285)
    			? get_spread_update(buttonskeleton_spread_levels, [
    					dirty[0] & /*href*/ 256 && { href: /*href*/ ctx[8] },
    					dirty[0] & /*size*/ 4 && { size: /*size*/ ctx[2] },
    					dirty[0] & /*$$restProps*/ 1024 && get_spread_object(/*$$restProps*/ ctx[10]),
    					dirty[0] & /*hasIconOnly*/ 1 && {
    						style: /*hasIconOnly*/ ctx[0] && 'width: 3rem;'
    					}
    				])
    			: {};

    			buttonskeleton.$set(buttonskeleton_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(buttonskeleton.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(buttonskeleton.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(buttonskeleton, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$5.name,
    		type: "if",
    		source: "(135:0) {#if skeleton}",
    		ctx
    	});

    	return block;
    }

    // (177:4) {#if hasIconOnly}
    function create_if_block_4(ctx) {
    	let span;
    	let t;

    	const block = {
    		c: function create() {
    			span = element("span");
    			t = text(/*iconDescription*/ ctx[4]);
    			toggle_class(span, "bx--assistive-text", true);
    			add_location(span, file$9, 177, 6, 4732);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span, anchor);
    			append_dev(span, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*iconDescription*/ 16) set_data_dev(t, /*iconDescription*/ ctx[4]);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(span);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_4.name,
    		type: "if",
    		source: "(177:4) {#if hasIconOnly}",
    		ctx
    	});

    	return block;
    }

    // (158:4) {#if hasIconOnly}
    function create_if_block_3(ctx) {
    	let span;
    	let t;

    	const block = {
    		c: function create() {
    			span = element("span");
    			t = text(/*iconDescription*/ ctx[4]);
    			toggle_class(span, "bx--assistive-text", true);
    			add_location(span, file$9, 158, 6, 4344);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span, anchor);
    			append_dev(span, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*iconDescription*/ 16) set_data_dev(t, /*iconDescription*/ ctx[4]);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(span);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_3.name,
    		type: "if",
    		source: "(158:4) {#if hasIconOnly}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$9(ctx) {
    	let current_block_type_index;
    	let if_block;
    	let if_block_anchor;
    	let current;
    	const if_block_creators = [create_if_block$5, create_if_block_1$1, create_if_block_2, create_else_block$2];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*skeleton*/ ctx[6]) return 0;
    		if (/*as*/ ctx[5]) return 1;
    		if (/*href*/ ctx[8] && !/*disabled*/ ctx[7]) return 2;
    		return 3;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if_blocks[current_block_type_index].m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				} else {
    					if_block.p(ctx, dirty);
    				}

    				transition_in(if_block, 1);
    				if_block.m(if_block_anchor.parentNode, if_block_anchor);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if_blocks[current_block_type_index].d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$9.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$9($$self, $$props, $$invalidate) {
    	let buttonProps;

    	const omit_props_names = [
    		"kind","size","expressive","isSelected","hasIconOnly","icon","iconDescription","tooltipAlignment","tooltipPosition","as","skeleton","disabled","href","tabindex","type","ref"
    	];

    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Button', slots, ['default']);
    	const $$slots = compute_slots(slots);
    	let { kind = "primary" } = $$props;
    	let { size = "default" } = $$props;
    	let { expressive = false } = $$props;
    	let { isSelected = false } = $$props;
    	let { hasIconOnly = false } = $$props;
    	let { icon = undefined } = $$props;
    	let { iconDescription = undefined } = $$props;
    	let { tooltipAlignment = "center" } = $$props;
    	let { tooltipPosition = "bottom" } = $$props;
    	let { as = false } = $$props;
    	let { skeleton = false } = $$props;
    	let { disabled = false } = $$props;
    	let { href = undefined } = $$props;
    	let { tabindex = "0" } = $$props;
    	let { type = "button" } = $$props;
    	let { ref = null } = $$props;
    	const ctx = getContext("ComposedModal");

    	function click_handler_1(event) {
    		bubble.call(this, $$self, event);
    	}

    	function mouseover_handler_1(event) {
    		bubble.call(this, $$self, event);
    	}

    	function mouseenter_handler_1(event) {
    		bubble.call(this, $$self, event);
    	}

    	function mouseleave_handler_1(event) {
    		bubble.call(this, $$self, event);
    	}

    	function click_handler_2(event) {
    		bubble.call(this, $$self, event);
    	}

    	function mouseover_handler_2(event) {
    		bubble.call(this, $$self, event);
    	}

    	function mouseenter_handler_2(event) {
    		bubble.call(this, $$self, event);
    	}

    	function mouseleave_handler_2(event) {
    		bubble.call(this, $$self, event);
    	}

    	function click_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function mouseover_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function mouseenter_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function mouseleave_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function a_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			ref = $$value;
    			$$invalidate(1, ref);
    		});
    	}

    	function button_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			ref = $$value;
    			$$invalidate(1, ref);
    		});
    	}

    	$$self.$$set = $$new_props => {
    		$$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
    		$$invalidate(10, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ('kind' in $$new_props) $$invalidate(11, kind = $$new_props.kind);
    		if ('size' in $$new_props) $$invalidate(2, size = $$new_props.size);
    		if ('expressive' in $$new_props) $$invalidate(12, expressive = $$new_props.expressive);
    		if ('isSelected' in $$new_props) $$invalidate(13, isSelected = $$new_props.isSelected);
    		if ('hasIconOnly' in $$new_props) $$invalidate(0, hasIconOnly = $$new_props.hasIconOnly);
    		if ('icon' in $$new_props) $$invalidate(3, icon = $$new_props.icon);
    		if ('iconDescription' in $$new_props) $$invalidate(4, iconDescription = $$new_props.iconDescription);
    		if ('tooltipAlignment' in $$new_props) $$invalidate(14, tooltipAlignment = $$new_props.tooltipAlignment);
    		if ('tooltipPosition' in $$new_props) $$invalidate(15, tooltipPosition = $$new_props.tooltipPosition);
    		if ('as' in $$new_props) $$invalidate(5, as = $$new_props.as);
    		if ('skeleton' in $$new_props) $$invalidate(6, skeleton = $$new_props.skeleton);
    		if ('disabled' in $$new_props) $$invalidate(7, disabled = $$new_props.disabled);
    		if ('href' in $$new_props) $$invalidate(8, href = $$new_props.href);
    		if ('tabindex' in $$new_props) $$invalidate(16, tabindex = $$new_props.tabindex);
    		if ('type' in $$new_props) $$invalidate(17, type = $$new_props.type);
    		if ('ref' in $$new_props) $$invalidate(1, ref = $$new_props.ref);
    		if ('$$scope' in $$new_props) $$invalidate(18, $$scope = $$new_props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		kind,
    		size,
    		expressive,
    		isSelected,
    		hasIconOnly,
    		icon,
    		iconDescription,
    		tooltipAlignment,
    		tooltipPosition,
    		as,
    		skeleton,
    		disabled,
    		href,
    		tabindex,
    		type,
    		ref,
    		getContext,
    		ButtonSkeleton: ButtonSkeleton$1,
    		ctx,
    		buttonProps
    	});

    	$$self.$inject_state = $$new_props => {
    		if ('kind' in $$props) $$invalidate(11, kind = $$new_props.kind);
    		if ('size' in $$props) $$invalidate(2, size = $$new_props.size);
    		if ('expressive' in $$props) $$invalidate(12, expressive = $$new_props.expressive);
    		if ('isSelected' in $$props) $$invalidate(13, isSelected = $$new_props.isSelected);
    		if ('hasIconOnly' in $$props) $$invalidate(0, hasIconOnly = $$new_props.hasIconOnly);
    		if ('icon' in $$props) $$invalidate(3, icon = $$new_props.icon);
    		if ('iconDescription' in $$props) $$invalidate(4, iconDescription = $$new_props.iconDescription);
    		if ('tooltipAlignment' in $$props) $$invalidate(14, tooltipAlignment = $$new_props.tooltipAlignment);
    		if ('tooltipPosition' in $$props) $$invalidate(15, tooltipPosition = $$new_props.tooltipPosition);
    		if ('as' in $$props) $$invalidate(5, as = $$new_props.as);
    		if ('skeleton' in $$props) $$invalidate(6, skeleton = $$new_props.skeleton);
    		if ('disabled' in $$props) $$invalidate(7, disabled = $$new_props.disabled);
    		if ('href' in $$props) $$invalidate(8, href = $$new_props.href);
    		if ('tabindex' in $$props) $$invalidate(16, tabindex = $$new_props.tabindex);
    		if ('type' in $$props) $$invalidate(17, type = $$new_props.type);
    		if ('ref' in $$props) $$invalidate(1, ref = $$new_props.ref);
    		if ('buttonProps' in $$props) $$invalidate(9, buttonProps = $$new_props.buttonProps);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty[0] & /*ref*/ 2) {
    			if (ctx && ref) {
    				ctx.declareRef(ref);
    			}
    		}

    		if ($$self.$$.dirty[0] & /*icon*/ 8) {
    			$$invalidate(0, hasIconOnly = icon && !$$slots.default);
    		}

    		$$invalidate(9, buttonProps = {
    			type: href && !disabled ? undefined : type,
    			tabindex,
    			disabled: disabled === true ? true : undefined,
    			href,
    			"aria-pressed": hasIconOnly && kind === "ghost" ? isSelected : undefined,
    			...$$restProps,
    			class: [
    				"bx--btn",
    				expressive && "bx--btn--expressive",
    				(size === "small" && !expressive || size === "sm" && !expressive || size === "small" && !expressive) && "bx--btn--sm",
    				size === "field" && !expressive || size === "md" && !expressive && "bx--btn--md",
    				size === "field" && "bx--btn--field",
    				size === "small" && "bx--btn--sm",
    				size === "lg" && "bx--btn--lg",
    				size === "xl" && "bx--btn--xl",
    				kind && `bx--btn--${kind}`,
    				disabled && "bx--btn--disabled",
    				hasIconOnly && "bx--btn--icon-only",
    				hasIconOnly && "bx--tooltip__trigger",
    				hasIconOnly && "bx--tooltip--a11y",
    				hasIconOnly && tooltipPosition && `bx--btn--icon-only--${tooltipPosition}`,
    				hasIconOnly && tooltipAlignment && `bx--tooltip--align-${tooltipAlignment}`,
    				hasIconOnly && isSelected && kind === "ghost" && "bx--btn--selected",
    				$$restProps.class
    			].filter(Boolean).join(" ")
    		});
    	};

    	return [
    		hasIconOnly,
    		ref,
    		size,
    		icon,
    		iconDescription,
    		as,
    		skeleton,
    		disabled,
    		href,
    		buttonProps,
    		$$restProps,
    		kind,
    		expressive,
    		isSelected,
    		tooltipAlignment,
    		tooltipPosition,
    		tabindex,
    		type,
    		$$scope,
    		slots,
    		click_handler_1,
    		mouseover_handler_1,
    		mouseenter_handler_1,
    		mouseleave_handler_1,
    		click_handler_2,
    		mouseover_handler_2,
    		mouseenter_handler_2,
    		mouseleave_handler_2,
    		click_handler,
    		mouseover_handler,
    		mouseenter_handler,
    		mouseleave_handler,
    		a_binding,
    		button_binding
    	];
    }

    class Button extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(
    			this,
    			options,
    			instance$9,
    			create_fragment$9,
    			safe_not_equal,
    			{
    				kind: 11,
    				size: 2,
    				expressive: 12,
    				isSelected: 13,
    				hasIconOnly: 0,
    				icon: 3,
    				iconDescription: 4,
    				tooltipAlignment: 14,
    				tooltipPosition: 15,
    				as: 5,
    				skeleton: 6,
    				disabled: 7,
    				href: 8,
    				tabindex: 16,
    				type: 17,
    				ref: 1
    			},
    			null,
    			[-1, -1]
    		);

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Button",
    			options,
    			id: create_fragment$9.name
    		});
    	}

    	get kind() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set kind(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get size() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set size(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get expressive() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set expressive(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get isSelected() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set isSelected(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get hasIconOnly() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set hasIconOnly(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get icon() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set icon(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get iconDescription() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set iconDescription(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get tooltipAlignment() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set tooltipAlignment(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get tooltipPosition() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set tooltipPosition(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get as() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set as(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get skeleton() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set skeleton(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get disabled() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set disabled(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get href() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set href(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get tabindex() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set tabindex(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get type() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set type(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get ref() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set ref(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    var Button$1 = Button;

    /* node_modules\carbon-components-svelte\src\UIShell\SideNav\SideNav.svelte generated by Svelte v3.42.4 */
    const file$8 = "node_modules\\carbon-components-svelte\\src\\UIShell\\SideNav\\SideNav.svelte";

    // (51:0) {#if !fixed}
    function create_if_block$4(ctx) {
    	let div;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			div = element("div");
    			toggle_class(div, "bx--side-nav__overlay", true);
    			toggle_class(div, "bx--side-nav__overlay-active", /*isOpen*/ ctx[0]);
    			add_location(div, file$8, 51, 2, 1190);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			if (!mounted) {
    				dispose = listen_dev(div, "click", /*click_handler*/ ctx[11], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*isOpen*/ 1) {
    				toggle_class(div, "bx--side-nav__overlay-active", /*isOpen*/ ctx[0]);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$4.name,
    		type: "if",
    		source: "(51:0) {#if !fixed}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$8(ctx) {
    	let t;
    	let nav;
    	let nav_aria_hidden_value;
    	let current;
    	let mounted;
    	let dispose;
    	add_render_callback(/*onwindowresize*/ ctx[10]);
    	let if_block = !/*fixed*/ ctx[1] && create_if_block$4(ctx);
    	const default_slot_template = /*#slots*/ ctx[9].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[8], null);

    	let nav_levels = [
    		{
    			"aria-hidden": nav_aria_hidden_value = !/*isOpen*/ ctx[0]
    		},
    		{ "aria-label": /*ariaLabel*/ ctx[3] },
    		/*$$restProps*/ ctx[7]
    	];

    	let nav_data = {};

    	for (let i = 0; i < nav_levels.length; i += 1) {
    		nav_data = assign(nav_data, nav_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			t = space();
    			nav = element("nav");
    			if (default_slot) default_slot.c();
    			set_attributes(nav, nav_data);
    			toggle_class(nav, "bx--side-nav__navigation", true);
    			toggle_class(nav, "bx--side-nav", true);
    			toggle_class(nav, "bx--side-nav--ux", true);

    			toggle_class(nav, "bx--side-nav--expanded", /*rail*/ ctx[2] && /*winWidth*/ ctx[5] >= /*expansionBreakpoint*/ ctx[4]
    			? false
    			: /*isOpen*/ ctx[0]);

    			toggle_class(nav, "bx--side-nav--collapsed", !/*isOpen*/ ctx[0] && !/*rail*/ ctx[2]);
    			toggle_class(nav, "bx--side-nav--rail", /*rail*/ ctx[2]);
    			add_location(nav, file$8, 60, 0, 1388);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, t, anchor);
    			insert_dev(target, nav, anchor);

    			if (default_slot) {
    				default_slot.m(nav, null);
    			}

    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(window, "resize", /*onwindowresize*/ ctx[10]);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (!/*fixed*/ ctx[1]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block$4(ctx);
    					if_block.c();
    					if_block.m(t.parentNode, t);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}

    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 256)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[8],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[8])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[8], dirty, null),
    						null
    					);
    				}
    			}

    			set_attributes(nav, nav_data = get_spread_update(nav_levels, [
    				(!current || dirty & /*isOpen*/ 1 && nav_aria_hidden_value !== (nav_aria_hidden_value = !/*isOpen*/ ctx[0])) && { "aria-hidden": nav_aria_hidden_value },
    				(!current || dirty & /*ariaLabel*/ 8) && { "aria-label": /*ariaLabel*/ ctx[3] },
    				dirty & /*$$restProps*/ 128 && /*$$restProps*/ ctx[7]
    			]));

    			toggle_class(nav, "bx--side-nav__navigation", true);
    			toggle_class(nav, "bx--side-nav", true);
    			toggle_class(nav, "bx--side-nav--ux", true);

    			toggle_class(nav, "bx--side-nav--expanded", /*rail*/ ctx[2] && /*winWidth*/ ctx[5] >= /*expansionBreakpoint*/ ctx[4]
    			? false
    			: /*isOpen*/ ctx[0]);

    			toggle_class(nav, "bx--side-nav--collapsed", !/*isOpen*/ ctx[0] && !/*rail*/ ctx[2]);
    			toggle_class(nav, "bx--side-nav--rail", /*rail*/ ctx[2]);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(t);
    			if (detaching) detach_dev(nav);
    			if (default_slot) default_slot.d(detaching);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$8.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$8($$self, $$props, $$invalidate) {
    	const omit_props_names = ["fixed","rail","ariaLabel","isOpen","expansionBreakpoint"];
    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('SideNav', slots, ['default']);
    	let { fixed = false } = $$props;
    	let { rail = false } = $$props;
    	let { ariaLabel = undefined } = $$props;
    	let { isOpen = false } = $$props;
    	let { expansionBreakpoint = 1056 } = $$props;
    	const dispatch = createEventDispatcher();
    	let winWidth = undefined;

    	onMount(() => {
    		shouldRenderHamburgerMenu.set(true);
    		return () => shouldRenderHamburgerMenu.set(false);
    	});

    	function onwindowresize() {
    		$$invalidate(5, winWidth = window.innerWidth);
    	}

    	const click_handler = () => {
    		dispatch('click:overlay');
    		$$invalidate(0, isOpen = false);
    	};

    	$$self.$$set = $$new_props => {
    		$$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
    		$$invalidate(7, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ('fixed' in $$new_props) $$invalidate(1, fixed = $$new_props.fixed);
    		if ('rail' in $$new_props) $$invalidate(2, rail = $$new_props.rail);
    		if ('ariaLabel' in $$new_props) $$invalidate(3, ariaLabel = $$new_props.ariaLabel);
    		if ('isOpen' in $$new_props) $$invalidate(0, isOpen = $$new_props.isOpen);
    		if ('expansionBreakpoint' in $$new_props) $$invalidate(4, expansionBreakpoint = $$new_props.expansionBreakpoint);
    		if ('$$scope' in $$new_props) $$invalidate(8, $$scope = $$new_props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		fixed,
    		rail,
    		ariaLabel,
    		isOpen,
    		expansionBreakpoint,
    		onMount,
    		createEventDispatcher,
    		shouldRenderHamburgerMenu,
    		dispatch,
    		winWidth
    	});

    	$$self.$inject_state = $$new_props => {
    		if ('fixed' in $$props) $$invalidate(1, fixed = $$new_props.fixed);
    		if ('rail' in $$props) $$invalidate(2, rail = $$new_props.rail);
    		if ('ariaLabel' in $$props) $$invalidate(3, ariaLabel = $$new_props.ariaLabel);
    		if ('isOpen' in $$props) $$invalidate(0, isOpen = $$new_props.isOpen);
    		if ('expansionBreakpoint' in $$props) $$invalidate(4, expansionBreakpoint = $$new_props.expansionBreakpoint);
    		if ('winWidth' in $$props) $$invalidate(5, winWidth = $$new_props.winWidth);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*isOpen*/ 1) {
    			dispatch(isOpen ? "open" : "close");
    		}
    	};

    	return [
    		isOpen,
    		fixed,
    		rail,
    		ariaLabel,
    		expansionBreakpoint,
    		winWidth,
    		dispatch,
    		$$restProps,
    		$$scope,
    		slots,
    		onwindowresize,
    		click_handler
    	];
    }

    class SideNav extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$8, create_fragment$8, safe_not_equal, {
    			fixed: 1,
    			rail: 2,
    			ariaLabel: 3,
    			isOpen: 0,
    			expansionBreakpoint: 4
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "SideNav",
    			options,
    			id: create_fragment$8.name
    		});
    	}

    	get fixed() {
    		throw new Error("<SideNav>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set fixed(value) {
    		throw new Error("<SideNav>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get rail() {
    		throw new Error("<SideNav>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set rail(value) {
    		throw new Error("<SideNav>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get ariaLabel() {
    		throw new Error("<SideNav>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set ariaLabel(value) {
    		throw new Error("<SideNav>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get isOpen() {
    		throw new Error("<SideNav>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set isOpen(value) {
    		throw new Error("<SideNav>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get expansionBreakpoint() {
    		throw new Error("<SideNav>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set expansionBreakpoint(value) {
    		throw new Error("<SideNav>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    var SideNav$1 = SideNav;

    /* node_modules\carbon-components-svelte\src\UIShell\SideNav\SideNavItems.svelte generated by Svelte v3.42.4 */

    const file$7 = "node_modules\\carbon-components-svelte\\src\\UIShell\\SideNav\\SideNavItems.svelte";

    function create_fragment$7(ctx) {
    	let ul;
    	let current;
    	const default_slot_template = /*#slots*/ ctx[1].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[0], null);

    	const block = {
    		c: function create() {
    			ul = element("ul");
    			if (default_slot) default_slot.c();
    			toggle_class(ul, "bx--side-nav__items", true);
    			add_location(ul, file$7, 0, 0, 0);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, ul, anchor);

    			if (default_slot) {
    				default_slot.m(ul, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 1)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[0],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[0])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[0], dirty, null),
    						null
    					);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(ul);
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$7.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$7($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('SideNavItems', slots, ['default']);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<SideNavItems> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('$$scope' in $$props) $$invalidate(0, $$scope = $$props.$$scope);
    	};

    	return [$$scope, slots];
    }

    class SideNavItems extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$7, create_fragment$7, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "SideNavItems",
    			options,
    			id: create_fragment$7.name
    		});
    	}
    }

    var SideNavItems$1 = SideNavItems;

    /* node_modules\carbon-components-svelte\src\UIShell\SideNav\SideNavLink.svelte generated by Svelte v3.42.4 */

    const file$6 = "node_modules\\carbon-components-svelte\\src\\UIShell\\SideNav\\SideNavLink.svelte";

    // (38:4) {#if icon}
    function create_if_block$3(ctx) {
    	let div;
    	let switch_instance;
    	let current;
    	var switch_value = /*icon*/ ctx[4];

    	function switch_props(ctx) {
    		return { $$inline: true };
    	}

    	if (switch_value) {
    		switch_instance = new switch_value(switch_props());
    	}

    	const block = {
    		c: function create() {
    			div = element("div");
    			if (switch_instance) create_component(switch_instance.$$.fragment);
    			toggle_class(div, "bx--side-nav__icon", true);
    			toggle_class(div, "bx--side-nav__icon--small", true);
    			add_location(div, file$6, 38, 6, 899);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			if (switch_instance) {
    				mount_component(switch_instance, div, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (switch_value !== (switch_value = /*icon*/ ctx[4])) {
    				if (switch_instance) {
    					group_outros();
    					const old_component = switch_instance;

    					transition_out(old_component.$$.fragment, 1, 0, () => {
    						destroy_component(old_component, 1);
    					});

    					check_outros();
    				}

    				if (switch_value) {
    					switch_instance = new switch_value(switch_props());
    					create_component(switch_instance.$$.fragment);
    					transition_in(switch_instance.$$.fragment, 1);
    					mount_component(switch_instance, div, null);
    				} else {
    					switch_instance = null;
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			if (switch_instance) transition_in(switch_instance.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			if (switch_instance) transition_out(switch_instance.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (switch_instance) destroy_component(switch_instance);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$3.name,
    		type: "if",
    		source: "(38:4) {#if icon}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$6(ctx) {
    	let li;
    	let a;
    	let t0;
    	let span;
    	let t1;
    	let a_aria_current_value;
    	let a_rel_value;
    	let current;
    	let mounted;
    	let dispose;
    	let if_block = /*icon*/ ctx[4] && create_if_block$3(ctx);

    	let a_levels = [
    		{
    			"aria-current": a_aria_current_value = /*isSelected*/ ctx[1] ? 'page' : undefined
    		},
    		{ href: /*href*/ ctx[2] },
    		{
    			rel: a_rel_value = /*$$restProps*/ ctx[5].target === '_blank'
    			? 'noopener noreferrer'
    			: undefined
    		},
    		/*$$restProps*/ ctx[5]
    	];

    	let a_data = {};

    	for (let i = 0; i < a_levels.length; i += 1) {
    		a_data = assign(a_data, a_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			li = element("li");
    			a = element("a");
    			if (if_block) if_block.c();
    			t0 = space();
    			span = element("span");
    			t1 = text(/*text*/ ctx[3]);
    			toggle_class(span, "bx--side-nav__link-text", true);
    			add_location(span, file$6, 45, 4, 1073);
    			set_attributes(a, a_data);
    			toggle_class(a, "bx--side-nav__link", true);
    			toggle_class(a, "bx--side-nav__link--current", /*isSelected*/ ctx[1]);
    			add_location(a, file$6, 27, 2, 573);
    			toggle_class(li, "bx--side-nav__item", true);
    			add_location(li, file$6, 26, 0, 532);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, li, anchor);
    			append_dev(li, a);
    			if (if_block) if_block.m(a, null);
    			append_dev(a, t0);
    			append_dev(a, span);
    			append_dev(span, t1);
    			/*a_binding*/ ctx[7](a);
    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(a, "click", /*click_handler*/ ctx[6], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (/*icon*/ ctx[4]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty & /*icon*/ 16) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block$3(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(a, t0);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}

    			if (!current || dirty & /*text*/ 8) set_data_dev(t1, /*text*/ ctx[3]);

    			set_attributes(a, a_data = get_spread_update(a_levels, [
    				(!current || dirty & /*isSelected*/ 2 && a_aria_current_value !== (a_aria_current_value = /*isSelected*/ ctx[1] ? 'page' : undefined)) && { "aria-current": a_aria_current_value },
    				(!current || dirty & /*href*/ 4) && { href: /*href*/ ctx[2] },
    				(!current || dirty & /*$$restProps*/ 32 && a_rel_value !== (a_rel_value = /*$$restProps*/ ctx[5].target === '_blank'
    				? 'noopener noreferrer'
    				: undefined)) && { rel: a_rel_value },
    				dirty & /*$$restProps*/ 32 && /*$$restProps*/ ctx[5]
    			]));

    			toggle_class(a, "bx--side-nav__link", true);
    			toggle_class(a, "bx--side-nav__link--current", /*isSelected*/ ctx[1]);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(li);
    			if (if_block) if_block.d();
    			/*a_binding*/ ctx[7](null);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$6.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$6($$self, $$props, $$invalidate) {
    	const omit_props_names = ["isSelected","href","text","icon","ref"];
    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('SideNavLink', slots, []);
    	let { isSelected = false } = $$props;
    	let { href = undefined } = $$props;
    	let { text = undefined } = $$props;
    	let { icon = undefined } = $$props;
    	let { ref = null } = $$props;

    	function click_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function a_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			ref = $$value;
    			$$invalidate(0, ref);
    		});
    	}

    	$$self.$$set = $$new_props => {
    		$$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
    		$$invalidate(5, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ('isSelected' in $$new_props) $$invalidate(1, isSelected = $$new_props.isSelected);
    		if ('href' in $$new_props) $$invalidate(2, href = $$new_props.href);
    		if ('text' in $$new_props) $$invalidate(3, text = $$new_props.text);
    		if ('icon' in $$new_props) $$invalidate(4, icon = $$new_props.icon);
    		if ('ref' in $$new_props) $$invalidate(0, ref = $$new_props.ref);
    	};

    	$$self.$capture_state = () => ({ isSelected, href, text, icon, ref });

    	$$self.$inject_state = $$new_props => {
    		if ('isSelected' in $$props) $$invalidate(1, isSelected = $$new_props.isSelected);
    		if ('href' in $$props) $$invalidate(2, href = $$new_props.href);
    		if ('text' in $$props) $$invalidate(3, text = $$new_props.text);
    		if ('icon' in $$props) $$invalidate(4, icon = $$new_props.icon);
    		if ('ref' in $$props) $$invalidate(0, ref = $$new_props.ref);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [ref, isSelected, href, text, icon, $$restProps, click_handler, a_binding];
    }

    class SideNavLink extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$6, create_fragment$6, safe_not_equal, {
    			isSelected: 1,
    			href: 2,
    			text: 3,
    			icon: 4,
    			ref: 0
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "SideNavLink",
    			options,
    			id: create_fragment$6.name
    		});
    	}

    	get isSelected() {
    		throw new Error("<SideNavLink>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set isSelected(value) {
    		throw new Error("<SideNavLink>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get href() {
    		throw new Error("<SideNavLink>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set href(value) {
    		throw new Error("<SideNavLink>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get text() {
    		throw new Error("<SideNavLink>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set text(value) {
    		throw new Error("<SideNavLink>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get icon() {
    		throw new Error("<SideNavLink>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set icon(value) {
    		throw new Error("<SideNavLink>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get ref() {
    		throw new Error("<SideNavLink>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set ref(value) {
    		throw new Error("<SideNavLink>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    var SideNavLink$1 = SideNavLink;

    /* node_modules\carbon-icons-svelte\lib\Information16\Information16.svelte generated by Svelte v3.42.4 */

    const file$5 = "node_modules\\carbon-icons-svelte\\lib\\Information16\\Information16.svelte";

    // (40:4) {#if title}
    function create_if_block$2(ctx) {
    	let title_1;
    	let t;

    	const block = {
    		c: function create() {
    			title_1 = svg_element("title");
    			t = text(/*title*/ ctx[2]);
    			add_location(title_1, file$5, 40, 6, 1317);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, title_1, anchor);
    			append_dev(title_1, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*title*/ 4) set_data_dev(t, /*title*/ ctx[2]);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(title_1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$2.name,
    		type: "if",
    		source: "(40:4) {#if title}",
    		ctx
    	});

    	return block;
    }

    // (39:8)      
    function fallback_block$1(ctx) {
    	let if_block_anchor;
    	let if_block = /*title*/ ctx[2] && create_if_block$2(ctx);

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (/*title*/ ctx[2]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block$2(ctx);
    					if_block.c();
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}
    		},
    		d: function destroy(detaching) {
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: fallback_block$1.name,
    		type: "fallback",
    		source: "(39:8)      ",
    		ctx
    	});

    	return block;
    }

    function create_fragment$5(ctx) {
    	let svg;
    	let path0;
    	let path1;
    	let current;
    	let mounted;
    	let dispose;
    	const default_slot_template = /*#slots*/ ctx[11].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[10], null);
    	const default_slot_or_fallback = default_slot || fallback_block$1(ctx);

    	let svg_levels = [
    		{ "data-carbon-icon": "Information16" },
    		{ xmlns: "http://www.w3.org/2000/svg" },
    		{ viewBox: "0 0 16 16" },
    		{ fill: "currentColor" },
    		{ width: "16" },
    		{ height: "16" },
    		{ class: /*className*/ ctx[0] },
    		{ preserveAspectRatio: "xMidYMid meet" },
    		{ style: /*style*/ ctx[3] },
    		{ id: /*id*/ ctx[1] },
    		/*attributes*/ ctx[4]
    	];

    	let svg_data = {};

    	for (let i = 0; i < svg_levels.length; i += 1) {
    		svg_data = assign(svg_data, svg_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			svg = svg_element("svg");
    			path0 = svg_element("path");
    			path1 = svg_element("path");
    			if (default_slot_or_fallback) default_slot_or_fallback.c();
    			attr_dev(path0, "d", "M8.5 11L8.5 6.5 6.5 6.5 6.5 7.5 7.5 7.5 7.5 11 6 11 6 12 10 12 10 11zM8 3.5c-.4 0-.8.3-.8.8S7.6 5 8 5c.4 0 .8-.3.8-.8S8.4 3.5 8 3.5z");
    			add_location(path0, file$5, 37, 2, 1008);
    			attr_dev(path1, "d", "M8,15c-3.9,0-7-3.1-7-7s3.1-7,7-7s7,3.1,7,7S11.9,15,8,15z M8,2C4.7,2,2,4.7,2,8s2.7,6,6,6s6-2.7,6-6S11.3,2,8,2z");
    			add_location(path1, file$5, 37, 152, 1158);
    			set_svg_attributes(svg, svg_data);
    			add_location(svg, file$5, 23, 0, 690);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, svg, anchor);
    			append_dev(svg, path0);
    			append_dev(svg, path1);

    			if (default_slot_or_fallback) {
    				default_slot_or_fallback.m(svg, null);
    			}

    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(svg, "click", /*click_handler*/ ctx[12], false, false, false),
    					listen_dev(svg, "mouseover", /*mouseover_handler*/ ctx[13], false, false, false),
    					listen_dev(svg, "mouseenter", /*mouseenter_handler*/ ctx[14], false, false, false),
    					listen_dev(svg, "mouseleave", /*mouseleave_handler*/ ctx[15], false, false, false),
    					listen_dev(svg, "keyup", /*keyup_handler*/ ctx[16], false, false, false),
    					listen_dev(svg, "keydown", /*keydown_handler*/ ctx[17], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 1024)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[10],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[10])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[10], dirty, null),
    						null
    					);
    				}
    			} else {
    				if (default_slot_or_fallback && default_slot_or_fallback.p && (!current || dirty & /*title*/ 4)) {
    					default_slot_or_fallback.p(ctx, !current ? -1 : dirty);
    				}
    			}

    			set_svg_attributes(svg, svg_data = get_spread_update(svg_levels, [
    				{ "data-carbon-icon": "Information16" },
    				{ xmlns: "http://www.w3.org/2000/svg" },
    				{ viewBox: "0 0 16 16" },
    				{ fill: "currentColor" },
    				{ width: "16" },
    				{ height: "16" },
    				(!current || dirty & /*className*/ 1) && { class: /*className*/ ctx[0] },
    				{ preserveAspectRatio: "xMidYMid meet" },
    				(!current || dirty & /*style*/ 8) && { style: /*style*/ ctx[3] },
    				(!current || dirty & /*id*/ 2) && { id: /*id*/ ctx[1] },
    				dirty & /*attributes*/ 16 && /*attributes*/ ctx[4]
    			]));
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot_or_fallback, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot_or_fallback, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(svg);
    			if (default_slot_or_fallback) default_slot_or_fallback.d(detaching);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$5.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$5($$self, $$props, $$invalidate) {
    	let ariaLabel;
    	let ariaLabelledBy;
    	let labelled;
    	let attributes;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Information16', slots, ['default']);
    	let { class: className = undefined } = $$props;
    	let { id = undefined } = $$props;
    	let { tabindex = undefined } = $$props;
    	let { focusable = false } = $$props;
    	let { title = undefined } = $$props;
    	let { style = undefined } = $$props;

    	function click_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function mouseover_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function mouseenter_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function mouseleave_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function keyup_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function keydown_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	$$self.$$set = $$new_props => {
    		$$invalidate(18, $$props = assign(assign({}, $$props), exclude_internal_props($$new_props)));
    		if ('class' in $$new_props) $$invalidate(0, className = $$new_props.class);
    		if ('id' in $$new_props) $$invalidate(1, id = $$new_props.id);
    		if ('tabindex' in $$new_props) $$invalidate(5, tabindex = $$new_props.tabindex);
    		if ('focusable' in $$new_props) $$invalidate(6, focusable = $$new_props.focusable);
    		if ('title' in $$new_props) $$invalidate(2, title = $$new_props.title);
    		if ('style' in $$new_props) $$invalidate(3, style = $$new_props.style);
    		if ('$$scope' in $$new_props) $$invalidate(10, $$scope = $$new_props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		className,
    		id,
    		tabindex,
    		focusable,
    		title,
    		style,
    		labelled,
    		ariaLabelledBy,
    		ariaLabel,
    		attributes
    	});

    	$$self.$inject_state = $$new_props => {
    		$$invalidate(18, $$props = assign(assign({}, $$props), $$new_props));
    		if ('className' in $$props) $$invalidate(0, className = $$new_props.className);
    		if ('id' in $$props) $$invalidate(1, id = $$new_props.id);
    		if ('tabindex' in $$props) $$invalidate(5, tabindex = $$new_props.tabindex);
    		if ('focusable' in $$props) $$invalidate(6, focusable = $$new_props.focusable);
    		if ('title' in $$props) $$invalidate(2, title = $$new_props.title);
    		if ('style' in $$props) $$invalidate(3, style = $$new_props.style);
    		if ('labelled' in $$props) $$invalidate(7, labelled = $$new_props.labelled);
    		if ('ariaLabelledBy' in $$props) $$invalidate(8, ariaLabelledBy = $$new_props.ariaLabelledBy);
    		if ('ariaLabel' in $$props) $$invalidate(9, ariaLabel = $$new_props.ariaLabel);
    		if ('attributes' in $$props) $$invalidate(4, attributes = $$new_props.attributes);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		$$invalidate(9, ariaLabel = $$props['aria-label']);
    		$$invalidate(8, ariaLabelledBy = $$props['aria-labelledby']);

    		if ($$self.$$.dirty & /*ariaLabel, ariaLabelledBy, title*/ 772) {
    			$$invalidate(7, labelled = ariaLabel || ariaLabelledBy || title);
    		}

    		if ($$self.$$.dirty & /*ariaLabel, ariaLabelledBy, labelled, tabindex, focusable*/ 992) {
    			$$invalidate(4, attributes = {
    				'aria-label': ariaLabel,
    				'aria-labelledby': ariaLabelledBy,
    				'aria-hidden': labelled ? undefined : true,
    				role: labelled ? 'img' : undefined,
    				focusable: tabindex === '0' ? true : focusable,
    				tabindex
    			});
    		}
    	};

    	$$props = exclude_internal_props($$props);

    	return [
    		className,
    		id,
    		title,
    		style,
    		attributes,
    		tabindex,
    		focusable,
    		labelled,
    		ariaLabelledBy,
    		ariaLabel,
    		$$scope,
    		slots,
    		click_handler,
    		mouseover_handler,
    		mouseenter_handler,
    		mouseleave_handler,
    		keyup_handler,
    		keydown_handler
    	];
    }

    class Information16 extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$5, create_fragment$5, safe_not_equal, {
    			class: 0,
    			id: 1,
    			tabindex: 5,
    			focusable: 6,
    			title: 2,
    			style: 3
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Information16",
    			options,
    			id: create_fragment$5.name
    		});
    	}

    	get class() {
    		throw new Error("<Information16>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set class(value) {
    		throw new Error("<Information16>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get id() {
    		throw new Error("<Information16>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set id(value) {
    		throw new Error("<Information16>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get tabindex() {
    		throw new Error("<Information16>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set tabindex(value) {
    		throw new Error("<Information16>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get focusable() {
    		throw new Error("<Information16>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set focusable(value) {
    		throw new Error("<Information16>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get title() {
    		throw new Error("<Information16>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set title(value) {
    		throw new Error("<Information16>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get style() {
    		throw new Error("<Information16>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set style(value) {
    		throw new Error("<Information16>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    var Information16$1 = Information16;

    /* node_modules\carbon-components-svelte\src\Tooltip\Tooltip.svelte generated by Svelte v3.42.4 */
    const file$4 = "node_modules\\carbon-components-svelte\\src\\Tooltip\\Tooltip.svelte";
    const get_triggerText_slot_changes_1 = dirty => ({});
    const get_triggerText_slot_context_1 = ctx => ({});
    const get_icon_slot_changes = dirty => ({});
    const get_icon_slot_context = ctx => ({});
    const get_triggerText_slot_changes = dirty => ({});
    const get_triggerText_slot_context = ctx => ({});

    // (201:2) {:else}
    function create_else_block$1(ctx) {
    	let div;
    	let current;
    	let mounted;
    	let dispose;
    	const triggerText_slot_template = /*#slots*/ ctx[20].triggerText;
    	const triggerText_slot = create_slot(triggerText_slot_template, ctx, /*$$scope*/ ctx[19], get_triggerText_slot_context_1);
    	const triggerText_slot_or_fallback = triggerText_slot || fallback_block_2(ctx);
    	let div_levels = [/*buttonProps*/ ctx[12], { "aria-describedby": /*tooltipId*/ ctx[9] }];
    	let div_data = {};

    	for (let i = 0; i < div_levels.length; i += 1) {
    		div_data = assign(div_data, div_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			div = element("div");
    			if (triggerText_slot_or_fallback) triggerText_slot_or_fallback.c();
    			set_attributes(div, div_data);
    			add_location(div, file$4, 201, 4, 5347);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			if (triggerText_slot_or_fallback) {
    				triggerText_slot_or_fallback.m(div, null);
    			}

    			/*div_binding*/ ctx[26](div);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(div, "click", stop_propagation(prevent_default(/*openMenu*/ ctx[15])), false, true, true),
    					listen_dev(div, "focus", /*openMenu*/ ctx[15], false, false, false),
    					listen_dev(div, "blur", /*onBlur*/ ctx[14], false, false, false),
    					listen_dev(div, "keydown", /*onKeydown*/ ctx[13], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (triggerText_slot) {
    				if (triggerText_slot.p && (!current || dirty & /*$$scope*/ 524288)) {
    					update_slot_base(
    						triggerText_slot,
    						triggerText_slot_template,
    						ctx,
    						/*$$scope*/ ctx[19],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[19])
    						: get_slot_changes(triggerText_slot_template, /*$$scope*/ ctx[19], dirty, get_triggerText_slot_changes_1),
    						get_triggerText_slot_context_1
    					);
    				}
    			} else {
    				if (triggerText_slot_or_fallback && triggerText_slot_or_fallback.p && (!current || dirty & /*triggerText*/ 2048)) {
    					triggerText_slot_or_fallback.p(ctx, !current ? -1 : dirty);
    				}
    			}

    			set_attributes(div, div_data = get_spread_update(div_levels, [
    				dirty & /*buttonProps*/ 4096 && /*buttonProps*/ ctx[12],
    				(!current || dirty & /*tooltipId*/ 512) && { "aria-describedby": /*tooltipId*/ ctx[9] }
    			]));
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(triggerText_slot_or_fallback, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(triggerText_slot_or_fallback, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (triggerText_slot_or_fallback) triggerText_slot_or_fallback.d(detaching);
    			/*div_binding*/ ctx[26](null);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$1.name,
    		type: "else",
    		source: "(201:2) {:else}",
    		ctx
    	});

    	return block;
    }

    // (184:2) {#if !hideIcon}
    function create_if_block_1(ctx) {
    	let div1;
    	let t;
    	let div0;
    	let current;
    	let mounted;
    	let dispose;
    	const triggerText_slot_template = /*#slots*/ ctx[20].triggerText;
    	const triggerText_slot = create_slot(triggerText_slot_template, ctx, /*$$scope*/ ctx[19], get_triggerText_slot_context);
    	const triggerText_slot_or_fallback = triggerText_slot || fallback_block_1(ctx);
    	const icon_slot_template = /*#slots*/ ctx[20].icon;
    	const icon_slot = create_slot(icon_slot_template, ctx, /*$$scope*/ ctx[19], get_icon_slot_context);
    	const icon_slot_or_fallback = icon_slot || fallback_block(ctx);
    	let div0_levels = [/*buttonProps*/ ctx[12], { "aria-describedby": /*tooltipId*/ ctx[9] }];
    	let div0_data = {};

    	for (let i = 0; i < div0_levels.length; i += 1) {
    		div0_data = assign(div0_data, div0_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			if (triggerText_slot_or_fallback) triggerText_slot_or_fallback.c();
    			t = space();
    			div0 = element("div");
    			if (icon_slot_or_fallback) icon_slot_or_fallback.c();
    			set_attributes(div0, div0_data);
    			add_location(div0, file$4, 186, 6, 4945);
    			attr_dev(div1, "id", /*triggerId*/ ctx[10]);
    			toggle_class(div1, "bx--tooltip__label", true);
    			add_location(div1, file$4, 184, 4, 4812);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);

    			if (triggerText_slot_or_fallback) {
    				triggerText_slot_or_fallback.m(div1, null);
    			}

    			append_dev(div1, t);
    			append_dev(div1, div0);

    			if (icon_slot_or_fallback) {
    				icon_slot_or_fallback.m(div0, null);
    			}

    			/*div0_binding*/ ctx[24](div0);
    			/*div1_binding*/ ctx[25](div1);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(div0, "click", stop_propagation(prevent_default(/*openMenu*/ ctx[15])), false, true, true),
    					listen_dev(div0, "focus", /*openMenu*/ ctx[15], false, false, false),
    					listen_dev(div0, "blur", /*onBlur*/ ctx[14], false, false, false),
    					listen_dev(div0, "keydown", /*onKeydown*/ ctx[13], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (triggerText_slot) {
    				if (triggerText_slot.p && (!current || dirty & /*$$scope*/ 524288)) {
    					update_slot_base(
    						triggerText_slot,
    						triggerText_slot_template,
    						ctx,
    						/*$$scope*/ ctx[19],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[19])
    						: get_slot_changes(triggerText_slot_template, /*$$scope*/ ctx[19], dirty, get_triggerText_slot_changes),
    						get_triggerText_slot_context
    					);
    				}
    			} else {
    				if (triggerText_slot_or_fallback && triggerText_slot_or_fallback.p && (!current || dirty & /*triggerText*/ 2048)) {
    					triggerText_slot_or_fallback.p(ctx, !current ? -1 : dirty);
    				}
    			}

    			if (icon_slot) {
    				if (icon_slot.p && (!current || dirty & /*$$scope*/ 524288)) {
    					update_slot_base(
    						icon_slot,
    						icon_slot_template,
    						ctx,
    						/*$$scope*/ ctx[19],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[19])
    						: get_slot_changes(icon_slot_template, /*$$scope*/ ctx[19], dirty, get_icon_slot_changes),
    						get_icon_slot_context
    					);
    				}
    			} else {
    				if (icon_slot_or_fallback && icon_slot_or_fallback.p && (!current || dirty & /*icon, iconName*/ 384)) {
    					icon_slot_or_fallback.p(ctx, !current ? -1 : dirty);
    				}
    			}

    			set_attributes(div0, div0_data = get_spread_update(div0_levels, [
    				dirty & /*buttonProps*/ 4096 && /*buttonProps*/ ctx[12],
    				(!current || dirty & /*tooltipId*/ 512) && { "aria-describedby": /*tooltipId*/ ctx[9] }
    			]));

    			if (!current || dirty & /*triggerId*/ 1024) {
    				attr_dev(div1, "id", /*triggerId*/ ctx[10]);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(triggerText_slot_or_fallback, local);
    			transition_in(icon_slot_or_fallback, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(triggerText_slot_or_fallback, local);
    			transition_out(icon_slot_or_fallback, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    			if (triggerText_slot_or_fallback) triggerText_slot_or_fallback.d(detaching);
    			if (icon_slot_or_fallback) icon_slot_or_fallback.d(detaching);
    			/*div0_binding*/ ctx[24](null);
    			/*div1_binding*/ ctx[25](null);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1.name,
    		type: "if",
    		source: "(184:2) {#if !hideIcon}",
    		ctx
    	});

    	return block;
    }

    // (211:31) {triggerText}
    function fallback_block_2(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text(/*triggerText*/ ctx[11]);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*triggerText*/ 2048) set_data_dev(t, /*triggerText*/ ctx[11]);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: fallback_block_2.name,
    		type: "fallback",
    		source: "(211:31) {triggerText}",
    		ctx
    	});

    	return block;
    }

    // (186:31) {triggerText}
    function fallback_block_1(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text(/*triggerText*/ ctx[11]);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*triggerText*/ 2048) set_data_dev(t, /*triggerText*/ ctx[11]);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: fallback_block_1.name,
    		type: "fallback",
    		source: "(186:31) {triggerText}",
    		ctx
    	});

    	return block;
    }

    // (196:26)            
    function fallback_block(ctx) {
    	let switch_instance;
    	let switch_instance_anchor;
    	let current;
    	var switch_value = /*icon*/ ctx[7];

    	function switch_props(ctx) {
    		return {
    			props: { name: /*iconName*/ ctx[8] },
    			$$inline: true
    		};
    	}

    	if (switch_value) {
    		switch_instance = new switch_value(switch_props(ctx));
    	}

    	const block = {
    		c: function create() {
    			if (switch_instance) create_component(switch_instance.$$.fragment);
    			switch_instance_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if (switch_instance) {
    				mount_component(switch_instance, target, anchor);
    			}

    			insert_dev(target, switch_instance_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const switch_instance_changes = {};
    			if (dirty & /*iconName*/ 256) switch_instance_changes.name = /*iconName*/ ctx[8];

    			if (switch_value !== (switch_value = /*icon*/ ctx[7])) {
    				if (switch_instance) {
    					group_outros();
    					const old_component = switch_instance;

    					transition_out(old_component.$$.fragment, 1, 0, () => {
    						destroy_component(old_component, 1);
    					});

    					check_outros();
    				}

    				if (switch_value) {
    					switch_instance = new switch_value(switch_props(ctx));
    					create_component(switch_instance.$$.fragment);
    					transition_in(switch_instance.$$.fragment, 1);
    					mount_component(switch_instance, switch_instance_anchor.parentNode, switch_instance_anchor);
    				} else {
    					switch_instance = null;
    				}
    			} else if (switch_value) {
    				switch_instance.$set(switch_instance_changes);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			if (switch_instance) transition_in(switch_instance.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			if (switch_instance) transition_out(switch_instance.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(switch_instance_anchor);
    			if (switch_instance) destroy_component(switch_instance, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: fallback_block.name,
    		type: "fallback",
    		source: "(196:26)            ",
    		ctx
    	});

    	return block;
    }

    // (214:2) {#if open}
    function create_if_block$1(ctx) {
    	let div1;
    	let span;
    	let t;
    	let div0;
    	let current;
    	let mounted;
    	let dispose;
    	const default_slot_template = /*#slots*/ ctx[20].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[19], null);

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			span = element("span");
    			t = space();
    			div0 = element("div");
    			if (default_slot) default_slot.c();
    			toggle_class(span, "bx--tooltip__caret", true);
    			add_location(span, file$4, 228, 6, 6265);
    			attr_dev(div0, "tabindex", "-1");
    			attr_dev(div0, "role", "dialog");
    			toggle_class(div0, "bx--tooltip__content", true);
    			add_location(div0, file$4, 229, 6, 6319);
    			attr_dev(div1, "id", /*tooltipId*/ ctx[9]);
    			attr_dev(div1, "data-floating-menu-direction", /*direction*/ ctx[5]);
    			toggle_class(div1, "bx--tooltip", true);
    			toggle_class(div1, "bx--tooltip--shown", /*open*/ ctx[0]);
    			toggle_class(div1, "bx--tooltip--top", /*direction*/ ctx[5] === 'top');
    			toggle_class(div1, "bx--tooltip--right", /*direction*/ ctx[5] === 'right');
    			toggle_class(div1, "bx--tooltip--bottom", /*direction*/ ctx[5] === 'bottom');
    			toggle_class(div1, "bx--tooltip--left", /*direction*/ ctx[5] === 'left');
    			toggle_class(div1, "bx--tooltip--align-center", /*align*/ ctx[4] === 'center');
    			toggle_class(div1, "bx--tooltip--align-start", /*align*/ ctx[4] === 'start');
    			toggle_class(div1, "bx--tooltip--align-end", /*align*/ ctx[4] === 'end');
    			add_location(div1, file$4, 214, 4, 5673);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, span);
    			append_dev(div1, t);
    			append_dev(div1, div0);

    			if (default_slot) {
    				default_slot.m(div0, null);
    			}

    			/*div1_binding_1*/ ctx[27](div1);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(div0, "click", stop_propagation(/*click_handler*/ ctx[21]), false, false, true),
    					listen_dev(div0, "mousedown", stop_propagation(/*mousedown_handler*/ ctx[22]), false, false, true)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 524288)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[19],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[19])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[19], dirty, null),
    						null
    					);
    				}
    			}

    			if (!current || dirty & /*tooltipId*/ 512) {
    				attr_dev(div1, "id", /*tooltipId*/ ctx[9]);
    			}

    			if (!current || dirty & /*direction*/ 32) {
    				attr_dev(div1, "data-floating-menu-direction", /*direction*/ ctx[5]);
    			}

    			if (dirty & /*open*/ 1) {
    				toggle_class(div1, "bx--tooltip--shown", /*open*/ ctx[0]);
    			}

    			if (dirty & /*direction*/ 32) {
    				toggle_class(div1, "bx--tooltip--top", /*direction*/ ctx[5] === 'top');
    			}

    			if (dirty & /*direction*/ 32) {
    				toggle_class(div1, "bx--tooltip--right", /*direction*/ ctx[5] === 'right');
    			}

    			if (dirty & /*direction*/ 32) {
    				toggle_class(div1, "bx--tooltip--bottom", /*direction*/ ctx[5] === 'bottom');
    			}

    			if (dirty & /*direction*/ 32) {
    				toggle_class(div1, "bx--tooltip--left", /*direction*/ ctx[5] === 'left');
    			}

    			if (dirty & /*align*/ 16) {
    				toggle_class(div1, "bx--tooltip--align-center", /*align*/ ctx[4] === 'center');
    			}

    			if (dirty & /*align*/ 16) {
    				toggle_class(div1, "bx--tooltip--align-start", /*align*/ ctx[4] === 'start');
    			}

    			if (dirty & /*align*/ 16) {
    				toggle_class(div1, "bx--tooltip--align-end", /*align*/ ctx[4] === 'end');
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    			if (default_slot) default_slot.d(detaching);
    			/*div1_binding_1*/ ctx[27](null);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$1.name,
    		type: "if",
    		source: "(214:2) {#if open}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$4(ctx) {
    	let div;
    	let current_block_type_index;
    	let if_block0;
    	let t;
    	let div_style_value;
    	let current;
    	let mounted;
    	let dispose;
    	const if_block_creators = [create_if_block_1, create_else_block$1];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (!/*hideIcon*/ ctx[6]) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block0 = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    	let if_block1 = /*open*/ ctx[0] && create_if_block$1(ctx);

    	let div_levels = [
    		/*$$restProps*/ ctx[16],
    		{
    			style: div_style_value = "" + ((/*open*/ ctx[0] ? 'z-index: 1;' : '') + /*$$restProps*/ ctx[16].style + "; position: relative;")
    		}
    	];

    	let div_data = {};

    	for (let i = 0; i < div_levels.length; i += 1) {
    		div_data = assign(div_data, div_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			div = element("div");
    			if_block0.c();
    			t = space();
    			if (if_block1) if_block1.c();
    			set_attributes(div, div_data);
    			add_location(div, file$4, 179, 0, 4686);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			if_blocks[current_block_type_index].m(div, null);
    			append_dev(div, t);
    			if (if_block1) if_block1.m(div, null);
    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(window, "mousedown", /*mousedown_handler_1*/ ctx[23], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block0 = if_blocks[current_block_type_index];

    				if (!if_block0) {
    					if_block0 = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block0.c();
    				} else {
    					if_block0.p(ctx, dirty);
    				}

    				transition_in(if_block0, 1);
    				if_block0.m(div, t);
    			}

    			if (/*open*/ ctx[0]) {
    				if (if_block1) {
    					if_block1.p(ctx, dirty);

    					if (dirty & /*open*/ 1) {
    						transition_in(if_block1, 1);
    					}
    				} else {
    					if_block1 = create_if_block$1(ctx);
    					if_block1.c();
    					transition_in(if_block1, 1);
    					if_block1.m(div, null);
    				}
    			} else if (if_block1) {
    				group_outros();

    				transition_out(if_block1, 1, 1, () => {
    					if_block1 = null;
    				});

    				check_outros();
    			}

    			set_attributes(div, div_data = get_spread_update(div_levels, [
    				dirty & /*$$restProps*/ 65536 && /*$$restProps*/ ctx[16],
    				(!current || dirty & /*open, $$restProps*/ 65537 && div_style_value !== (div_style_value = "" + ((/*open*/ ctx[0] ? 'z-index: 1;' : '') + /*$$restProps*/ ctx[16].style + "; position: relative;"))) && { style: div_style_value }
    			]));
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block0);
    			transition_in(if_block1);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block0);
    			transition_out(if_block1);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if_blocks[current_block_type_index].d();
    			if (if_block1) if_block1.d();
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$4.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$4($$self, $$props, $$invalidate) {
    	let buttonProps;

    	const omit_props_names = [
    		"align","direction","open","hideIcon","icon","iconDescription","iconName","tabindex","tooltipId","triggerId","triggerText","ref","refTooltip","refIcon"
    	];

    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Tooltip', slots, ['triggerText','icon','default']);
    	let { align = "center" } = $$props;
    	let { direction = "bottom" } = $$props;
    	let { open = false } = $$props;
    	let { hideIcon = false } = $$props;
    	let { icon = Information16$1 } = $$props;
    	let { iconDescription = "" } = $$props;
    	let { iconName = "" } = $$props;
    	let { tabindex = "0" } = $$props;
    	let { tooltipId = "ccs-" + Math.random().toString(36) } = $$props;
    	let { triggerId = "ccs-" + Math.random().toString(36) } = $$props;
    	let { triggerText = "" } = $$props;
    	let { ref = null } = $$props;
    	let { refTooltip = null } = $$props;
    	let { refIcon = null } = $$props;
    	const dispatch = createEventDispatcher();
    	const tooltipOpen = writable(open);
    	setContext("Tooltip", { tooltipOpen });

    	function onKeydown(e) {
    		if (e.key === "Escape") {
    			e.stopPropagation();
    			$$invalidate(0, open = false);
    		} else if (e.key === " " || e.key === "Enter") {
    			e.stopPropagation();
    			e.preventDefault();
    			$$invalidate(0, open = true);
    		}
    	}

    	function onBlur({ relatedTarget }) {
    		if (refTooltip && !refTooltip.contains(relatedTarget)) {
    			$$invalidate(0, open = false);
    		}
    	}

    	function openMenu() {
    		$$invalidate(0, open = true);
    	}

    	afterUpdate(() => {
    		if (open) {
    			const button = ref.getBoundingClientRect();
    			const tooltip = refTooltip.getBoundingClientRect();
    			let iconWidth = 16;
    			let iconHeight = 16;

    			if (refIcon) {
    				const icon = refIcon.getBoundingClientRect();
    				iconWidth = icon.width;
    				iconHeight = icon.height;
    			}

    			let offsetX = 0;
    			let offsetY = 0;

    			switch (direction) {
    				case "bottom":
    					if (hideIcon) {
    						offsetX = -1 * (tooltip.width / 2 - button.width / 2);
    					} else {
    						offsetX = -1 * (tooltip.width / 2 - button.width + iconWidth / 2);
    					}
    					offsetY = iconHeight / 2;
    					break;
    				case "right":
    					offsetX = button.width + 6;
    					offsetY = -1 * (tooltip.height / 2 + iconWidth / 2 - 3);
    					break;
    				case "left":
    					if (hideIcon) {
    						offsetX = -1 * (tooltip.width + 6 + 1);
    					} else {
    						offsetX = -1 * (tooltip.width - button.width + iconWidth + 8);
    					}
    					offsetY = -1 * (tooltip.height / 2 + button.height) - 2;
    					break;
    				case "top":
    					if (hideIcon) {
    						offsetX = -1 * (tooltip.width / 2 - button.width / 2);
    					} else {
    						offsetX = -1 * (tooltip.width / 2 - button.width + iconWidth / 2 + 1);
    					}
    					offsetY = -1 * (tooltip.height + button.height + iconWidth / 2 - 1);
    					break;
    			}

    			$$invalidate(2, refTooltip.style.left = offsetX + "px", refTooltip);
    			$$invalidate(2, refTooltip.style.marginTop = offsetY + "px", refTooltip);
    		}
    	});

    	function click_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function mousedown_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	const mousedown_handler_1 = ({ target }) => {
    		if (open && target.contains(refTooltip)) {
    			if (refIcon) {
    				refIcon.focus();
    			} else if (ref) {
    				ref.focus();
    			}

    			$$invalidate(0, open = false);
    		}
    	};

    	function div0_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			refIcon = $$value;
    			$$invalidate(3, refIcon);
    		});
    	}

    	function div1_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			ref = $$value;
    			$$invalidate(1, ref);
    		});
    	}

    	function div_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			ref = $$value;
    			$$invalidate(1, ref);
    		});
    	}

    	function div1_binding_1($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			refTooltip = $$value;
    			$$invalidate(2, refTooltip);
    		});
    	}

    	$$self.$$set = $$new_props => {
    		$$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
    		$$invalidate(16, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ('align' in $$new_props) $$invalidate(4, align = $$new_props.align);
    		if ('direction' in $$new_props) $$invalidate(5, direction = $$new_props.direction);
    		if ('open' in $$new_props) $$invalidate(0, open = $$new_props.open);
    		if ('hideIcon' in $$new_props) $$invalidate(6, hideIcon = $$new_props.hideIcon);
    		if ('icon' in $$new_props) $$invalidate(7, icon = $$new_props.icon);
    		if ('iconDescription' in $$new_props) $$invalidate(17, iconDescription = $$new_props.iconDescription);
    		if ('iconName' in $$new_props) $$invalidate(8, iconName = $$new_props.iconName);
    		if ('tabindex' in $$new_props) $$invalidate(18, tabindex = $$new_props.tabindex);
    		if ('tooltipId' in $$new_props) $$invalidate(9, tooltipId = $$new_props.tooltipId);
    		if ('triggerId' in $$new_props) $$invalidate(10, triggerId = $$new_props.triggerId);
    		if ('triggerText' in $$new_props) $$invalidate(11, triggerText = $$new_props.triggerText);
    		if ('ref' in $$new_props) $$invalidate(1, ref = $$new_props.ref);
    		if ('refTooltip' in $$new_props) $$invalidate(2, refTooltip = $$new_props.refTooltip);
    		if ('refIcon' in $$new_props) $$invalidate(3, refIcon = $$new_props.refIcon);
    		if ('$$scope' in $$new_props) $$invalidate(19, $$scope = $$new_props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		align,
    		direction,
    		open,
    		hideIcon,
    		icon,
    		iconDescription,
    		iconName,
    		tabindex,
    		tooltipId,
    		triggerId,
    		triggerText,
    		ref,
    		refTooltip,
    		refIcon,
    		createEventDispatcher,
    		afterUpdate,
    		setContext,
    		writable,
    		Information16: Information16$1,
    		dispatch,
    		tooltipOpen,
    		onKeydown,
    		onBlur,
    		openMenu,
    		buttonProps
    	});

    	$$self.$inject_state = $$new_props => {
    		if ('align' in $$props) $$invalidate(4, align = $$new_props.align);
    		if ('direction' in $$props) $$invalidate(5, direction = $$new_props.direction);
    		if ('open' in $$props) $$invalidate(0, open = $$new_props.open);
    		if ('hideIcon' in $$props) $$invalidate(6, hideIcon = $$new_props.hideIcon);
    		if ('icon' in $$props) $$invalidate(7, icon = $$new_props.icon);
    		if ('iconDescription' in $$props) $$invalidate(17, iconDescription = $$new_props.iconDescription);
    		if ('iconName' in $$props) $$invalidate(8, iconName = $$new_props.iconName);
    		if ('tabindex' in $$props) $$invalidate(18, tabindex = $$new_props.tabindex);
    		if ('tooltipId' in $$props) $$invalidate(9, tooltipId = $$new_props.tooltipId);
    		if ('triggerId' in $$props) $$invalidate(10, triggerId = $$new_props.triggerId);
    		if ('triggerText' in $$props) $$invalidate(11, triggerText = $$new_props.triggerText);
    		if ('ref' in $$props) $$invalidate(1, ref = $$new_props.ref);
    		if ('refTooltip' in $$props) $$invalidate(2, refTooltip = $$new_props.refTooltip);
    		if ('refIcon' in $$props) $$invalidate(3, refIcon = $$new_props.refIcon);
    		if ('buttonProps' in $$props) $$invalidate(12, buttonProps = $$new_props.buttonProps);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*open*/ 1) {
    			tooltipOpen.set(open);
    		}

    		if ($$self.$$.dirty & /*open*/ 1) {
    			dispatch(open ? "open" : "close");
    		}

    		$$invalidate(12, buttonProps = {
    			role: "button",
    			"aria-haspopup": "true",
    			id: hideIcon ? triggerId : undefined,
    			class: hideIcon ? "bx--tooltip__label" : "bx--tooltip__trigger",
    			"aria-expanded": open,
    			"aria-describedby": open ? tooltipId : undefined,
    			"aria-labelledby": triggerText ? triggerId : undefined,
    			"aria-label": triggerText ? iconDescription : undefined,
    			tabindex,
    			style: hideIcon ? $$restProps.style : undefined
    		});
    	};

    	return [
    		open,
    		ref,
    		refTooltip,
    		refIcon,
    		align,
    		direction,
    		hideIcon,
    		icon,
    		iconName,
    		tooltipId,
    		triggerId,
    		triggerText,
    		buttonProps,
    		onKeydown,
    		onBlur,
    		openMenu,
    		$$restProps,
    		iconDescription,
    		tabindex,
    		$$scope,
    		slots,
    		click_handler,
    		mousedown_handler,
    		mousedown_handler_1,
    		div0_binding,
    		div1_binding,
    		div_binding,
    		div1_binding_1
    	];
    }

    class Tooltip extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$4, create_fragment$4, safe_not_equal, {
    			align: 4,
    			direction: 5,
    			open: 0,
    			hideIcon: 6,
    			icon: 7,
    			iconDescription: 17,
    			iconName: 8,
    			tabindex: 18,
    			tooltipId: 9,
    			triggerId: 10,
    			triggerText: 11,
    			ref: 1,
    			refTooltip: 2,
    			refIcon: 3
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Tooltip",
    			options,
    			id: create_fragment$4.name
    		});
    	}

    	get align() {
    		throw new Error("<Tooltip>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set align(value) {
    		throw new Error("<Tooltip>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get direction() {
    		throw new Error("<Tooltip>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set direction(value) {
    		throw new Error("<Tooltip>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get open() {
    		throw new Error("<Tooltip>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set open(value) {
    		throw new Error("<Tooltip>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get hideIcon() {
    		throw new Error("<Tooltip>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set hideIcon(value) {
    		throw new Error("<Tooltip>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get icon() {
    		throw new Error("<Tooltip>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set icon(value) {
    		throw new Error("<Tooltip>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get iconDescription() {
    		throw new Error("<Tooltip>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set iconDescription(value) {
    		throw new Error("<Tooltip>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get iconName() {
    		throw new Error("<Tooltip>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set iconName(value) {
    		throw new Error("<Tooltip>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get tabindex() {
    		throw new Error("<Tooltip>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set tabindex(value) {
    		throw new Error("<Tooltip>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get tooltipId() {
    		throw new Error("<Tooltip>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set tooltipId(value) {
    		throw new Error("<Tooltip>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get triggerId() {
    		throw new Error("<Tooltip>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set triggerId(value) {
    		throw new Error("<Tooltip>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get triggerText() {
    		throw new Error("<Tooltip>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set triggerText(value) {
    		throw new Error("<Tooltip>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get ref() {
    		throw new Error("<Tooltip>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set ref(value) {
    		throw new Error("<Tooltip>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get refTooltip() {
    		throw new Error("<Tooltip>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set refTooltip(value) {
    		throw new Error("<Tooltip>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get refIcon() {
    		throw new Error("<Tooltip>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set refIcon(value) {
    		throw new Error("<Tooltip>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    var Tooltip$1 = Tooltip;

    /* src\components\steam.svelte generated by Svelte v3.42.4 */

    const file$3 = "src\\components\\steam.svelte";

    function get_each_context$1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[3] = list[i];
    	child_ctx[5] = i;
    	return child_ctx;
    }

    // (10:8) {:else}
    function create_else_block(ctx) {
    	let div;

    	const block = {
    		c: function create() {
    			div = element("div");
    			attr_dev(div, "class", "fog svelte-ryq7eh");
    			set_style(div, "--fog-position", /*index*/ ctx[5] + 1);
    			add_location(div, file$3, 10, 12, 390);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block.name,
    		type: "else",
    		source: "(10:8) {:else}",
    		ctx
    	});

    	return block;
    }

    // (8:8) {#if (index%2) == 1 }
    function create_if_block(ctx) {
    	let div;

    	const block = {
    		c: function create() {
    			div = element("div");
    			attr_dev(div, "class", "fog grpA svelte-ryq7eh");
    			set_style(div, "--fog-position", /*index*/ ctx[5] + 1);
    			add_location(div, file$3, 8, 12, 298);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block.name,
    		type: "if",
    		source: "(8:8) {#if (index%2) == 1 }",
    		ctx
    	});

    	return block;
    }

    // (7:1) {#each {length:totalSteam} as item, index}
    function create_each_block$1(ctx) {
    	let if_block_anchor;

    	function select_block_type(ctx, dirty) {
    		if (/*index*/ ctx[5] % 2 == 1) return create_if_block;
    		return create_else_block;
    	}

    	let current_block_type = select_block_type(ctx);
    	let if_block = current_block_type(ctx);

    	const block = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$1.name,
    		type: "each",
    		source: "(7:1) {#each {length:totalSteam} as item, index}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$3(ctx) {
    	let div;
    	let mounted;
    	let dispose;
    	add_render_callback(/*onwindowresize*/ ctx[2]);
    	let each_value = { length: /*totalSteam*/ ctx[1] };
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$1(get_each_context$1(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			div = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(div, "id", "steamContainer");
    			set_style(div, "--totalSteam", /*totalSteam*/ ctx[1]);
    			attr_dev(div, "class", "svelte-ryq7eh");
    			add_location(div, file$3, 4, 2, 142);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div, null);
    			}

    			if (!mounted) {
    				dispose = listen_dev(window, "resize", /*onwindowresize*/ ctx[2]);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*totalSteam*/ 2) {
    				each_value = { length: /*totalSteam*/ ctx[1] };
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$1(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$1(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(div, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}

    			if (dirty & /*totalSteam*/ 2) {
    				set_style(div, "--totalSteam", /*totalSteam*/ ctx[1]);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_each(each_blocks, detaching);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$3.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$3($$self, $$props, $$invalidate) {
    	let totalSteam;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Steam', slots, []);
    	let innerWidth;
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Steam> was created with unknown prop '${key}'`);
    	});

    	function onwindowresize() {
    		$$invalidate(0, innerWidth = window.innerWidth);
    	}

    	$$self.$capture_state = () => ({ innerWidth, totalSteam });

    	$$self.$inject_state = $$props => {
    		if ('innerWidth' in $$props) $$invalidate(0, innerWidth = $$props.innerWidth);
    		if ('totalSteam' in $$props) $$invalidate(1, totalSteam = $$props.totalSteam);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*innerWidth*/ 1) {
    			$$invalidate(1, totalSteam = Math.floor(innerWidth / 100));
    		}
    	};

    	return [innerWidth, totalSteam, onwindowresize];
    }

    class Steam extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$3, create_fragment$3, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Steam",
    			options,
    			id: create_fragment$3.name
    		});
    	}
    }

    /* src\attr.svelte generated by Svelte v3.42.4 */

    const file$2 = "src\\attr.svelte";

    function create_fragment$2(ctx) {
    	let div1;
    	let div0;
    	let t0;
    	let a0;
    	let t2;
    	let a1;
    	let t4;
    	let a2;
    	let t6;
    	let a3;
    	let t8;
    	let a4;

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			div0 = element("div");
    			t0 = text("Icons made by ");
    			a0 = element("a");
    			a0.textContent = "Vectors Market";
    			t2 = text(" from ");
    			a1 = element("a");
    			a1.textContent = "www.flaticon.com";
    			t4 = space();
    			a2 = element("a");
    			a2.textContent = "Wood vector created by upklyak - www.freepik.com";
    			t6 = space();
    			a3 = element("a");
    			a3.textContent = "Cartoon vector created by macrovector - www.freepik.com";
    			t8 = space();
    			a4 = element("a");
    			a4.textContent = "Flower photo created by gpointstudio - www.freepik.com";
    			attr_dev(a0, "href", "https://www.flaticon.com/authors/vectors-market");
    			attr_dev(a0, "title", "Vectors Market");
    			add_location(a0, file$2, 1, 23, 67);
    			attr_dev(a1, "href", "https://www.flaticon.com/");
    			attr_dev(a1, "title", "Flaticon");
    			add_location(a1, file$2, 1, 128, 172);
    			add_location(div0, file$2, 1, 4, 48);
    			attr_dev(a2, "href", "https://www.freepik.com/vectors/wood");
    			add_location(a2, file$2, 2, 4, 257);
    			attr_dev(a3, "href", "https://www.freepik.com/vectors/cartoon");
    			add_location(a3, file$2, 3, 4, 362);
    			attr_dev(a4, "href", "https://www.freepik.com/photos/flower");
    			add_location(a4, file$2, 4, 4, 477);
    			attr_dev(div1, "stlye", "opacity: 0.01;display: flex;");
    			add_location(div1, file$2, 0, 0, 0);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, div0);
    			append_dev(div0, t0);
    			append_dev(div0, a0);
    			append_dev(div0, t2);
    			append_dev(div0, a1);
    			append_dev(div1, t4);
    			append_dev(div1, a2);
    			append_dev(div1, t6);
    			append_dev(div1, a3);
    			append_dev(div1, t8);
    			append_dev(div1, a4);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
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

    function instance$2($$self, $$props) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Attr', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Attr> was created with unknown prop '${key}'`);
    	});

    	return [];
    }

    class Attr extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$2, create_fragment$2, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Attr",
    			options,
    			id: create_fragment$2.name
    		});
    	}
    }

    /* src\components\stoneBorder.svelte generated by Svelte v3.42.4 */

    const file$1 = "src\\components\\stoneBorder.svelte";

    function get_each_context(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[3] = list[i];
    	child_ctx[5] = i;
    	return child_ctx;
    }

    // (7:1) {#each {length:totalStone} as item, index}
    function create_each_block(ctx) {
    	let div;

    	const block = {
    		c: function create() {
    			div = element("div");
    			attr_dev(div, "class", "stone svelte-gz2vyo");
    			set_style(div, "--stoneSpacing-x", "-" + /*index*/ ctx[5] % 3 * 49 + "px");
    			set_style(div, "--stoneSpacing-y", Math.floor(/*index*/ ctx[5] / 3) % 3 * 76 + "px");
    			add_location(div, file$1, 7, 4, 217);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block.name,
    		type: "each",
    		source: "(7:1) {#each {length:totalStone} as item, index}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$1(ctx) {
    	let div;
    	let mounted;
    	let dispose;
    	add_render_callback(/*onwindowresize*/ ctx[2]);
    	let each_value = { length: /*totalStone*/ ctx[1] };
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			div = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(div, "class", "stoneBorder svelte-gz2vyo");
    			add_location(div, file$1, 5, 0, 141);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div, null);
    			}

    			if (!mounted) {
    				dispose = listen_dev(window, "resize", /*onwindowresize*/ ctx[2]);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*Math, totalStone*/ 2) {
    				each_value = { length: /*totalStone*/ ctx[1] };
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(div, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_each(each_blocks, detaching);
    			mounted = false;
    			dispose();
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
    	let totalStone;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('StoneBorder', slots, []);
    	let innerWidth;
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<StoneBorder> was created with unknown prop '${key}'`);
    	});

    	function onwindowresize() {
    		$$invalidate(0, innerWidth = window.innerWidth);
    	}

    	$$self.$capture_state = () => ({ innerWidth, totalStone });

    	$$self.$inject_state = $$props => {
    		if ('innerWidth' in $$props) $$invalidate(0, innerWidth = $$props.innerWidth);
    		if ('totalStone' in $$props) $$invalidate(1, totalStone = $$props.totalStone);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*innerWidth*/ 1) {
    			$$invalidate(1, totalStone = Math.floor(innerWidth / 40));
    		}
    	};

    	return [innerWidth, totalStone, onwindowresize];
    }

    class StoneBorder extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$1, create_fragment$1, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "StoneBorder",
    			options,
    			id: create_fragment$1.name
    		});
    	}
    }

    /* src\App.svelte generated by Svelte v3.42.4 */
    const file = "src\\App.svelte";

    // (76:2) <HeaderNav>
    function create_default_slot_32(ctx) {
    	let headernavitem0;
    	let t0;
    	let headernavitem1;
    	let t1;
    	let headernavitem2;
    	let t2;
    	let headernavitem3;
    	let current;

    	headernavitem0 = new HeaderNavItem$1({
    			props: { href: "#p1", text: "Introduction" },
    			$$inline: true
    		});

    	headernavitem1 = new HeaderNavItem$1({
    			props: { href: "#p2", text: "Advantages" },
    			$$inline: true
    		});

    	headernavitem2 = new HeaderNavItem$1({
    			props: { href: "#p3", text: "Types" },
    			$$inline: true
    		});

    	headernavitem3 = new HeaderNavItem$1({
    			props: { href: "#p4", text: "Contact us" },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(headernavitem0.$$.fragment);
    			t0 = space();
    			create_component(headernavitem1.$$.fragment);
    			t1 = space();
    			create_component(headernavitem2.$$.fragment);
    			t2 = space();
    			create_component(headernavitem3.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(headernavitem0, target, anchor);
    			insert_dev(target, t0, anchor);
    			mount_component(headernavitem1, target, anchor);
    			insert_dev(target, t1, anchor);
    			mount_component(headernavitem2, target, anchor);
    			insert_dev(target, t2, anchor);
    			mount_component(headernavitem3, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(headernavitem0.$$.fragment, local);
    			transition_in(headernavitem1.$$.fragment, local);
    			transition_in(headernavitem2.$$.fragment, local);
    			transition_in(headernavitem3.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(headernavitem0.$$.fragment, local);
    			transition_out(headernavitem1.$$.fragment, local);
    			transition_out(headernavitem2.$$.fragment, local);
    			transition_out(headernavitem3.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(headernavitem0, detaching);
    			if (detaching) detach_dev(t0);
    			destroy_component(headernavitem1, detaching);
    			if (detaching) detach_dev(t1);
    			destroy_component(headernavitem2, detaching);
    			if (detaching) detach_dev(t2);
    			destroy_component(headernavitem3, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_32.name,
    		type: "slot",
    		source: "(76:2) <HeaderNav>",
    		ctx
    	});

    	return block;
    }

    // (75:0) <Header company="Sauna Club" platformName="Ying" bind:isSideNavOpen>
    function create_default_slot_31(ctx) {
    	let headernav;
    	let current;

    	headernav = new HeaderNav$1({
    			props: {
    				$$slots: { default: [create_default_slot_32] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(headernav.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(headernav, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const headernav_changes = {};

    			if (dirty & /*$$scope*/ 65536) {
    				headernav_changes.$$scope = { dirty, ctx };
    			}

    			headernav.$set(headernav_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(headernav.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(headernav.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(headernav, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_31.name,
    		type: "slot",
    		source: "(75:0) <Header company=\\\"Sauna Club\\\" platformName=\\\"Ying\\\" bind:isSideNavOpen>",
    		ctx
    	});

    	return block;
    }

    // (84:2) <SideNavItems>
    function create_default_slot_30(ctx) {
    	let sidenavlink0;
    	let t0;
    	let sidenavlink1;
    	let t1;
    	let sidenavlink2;
    	let t2;
    	let sidenavlink3;
    	let current;

    	sidenavlink0 = new SideNavLink$1({
    			props: { href: "#p1", text: "Introduction" },
    			$$inline: true
    		});

    	sidenavlink1 = new SideNavLink$1({
    			props: { href: "#p2", text: "Advantages" },
    			$$inline: true
    		});

    	sidenavlink2 = new SideNavLink$1({
    			props: { href: "#p3", text: "Types" },
    			$$inline: true
    		});

    	sidenavlink3 = new SideNavLink$1({
    			props: { href: "#p4", text: "Contact us" },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(sidenavlink0.$$.fragment);
    			t0 = space();
    			create_component(sidenavlink1.$$.fragment);
    			t1 = space();
    			create_component(sidenavlink2.$$.fragment);
    			t2 = space();
    			create_component(sidenavlink3.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(sidenavlink0, target, anchor);
    			insert_dev(target, t0, anchor);
    			mount_component(sidenavlink1, target, anchor);
    			insert_dev(target, t1, anchor);
    			mount_component(sidenavlink2, target, anchor);
    			insert_dev(target, t2, anchor);
    			mount_component(sidenavlink3, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(sidenavlink0.$$.fragment, local);
    			transition_in(sidenavlink1.$$.fragment, local);
    			transition_in(sidenavlink2.$$.fragment, local);
    			transition_in(sidenavlink3.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(sidenavlink0.$$.fragment, local);
    			transition_out(sidenavlink1.$$.fragment, local);
    			transition_out(sidenavlink2.$$.fragment, local);
    			transition_out(sidenavlink3.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(sidenavlink0, detaching);
    			if (detaching) detach_dev(t0);
    			destroy_component(sidenavlink1, detaching);
    			if (detaching) detach_dev(t1);
    			destroy_component(sidenavlink2, detaching);
    			if (detaching) detach_dev(t2);
    			destroy_component(sidenavlink3, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_30.name,
    		type: "slot",
    		source: "(84:2) <SideNavItems>",
    		ctx
    	});

    	return block;
    }

    // (83:0) <SideNav bind:isOpen={isSideNavOpen}>
    function create_default_slot_29(ctx) {
    	let sidenavitems;
    	let current;

    	sidenavitems = new SideNavItems$1({
    			props: {
    				$$slots: { default: [create_default_slot_30] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(sidenavitems.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(sidenavitems, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const sidenavitems_changes = {};

    			if (dirty & /*$$scope*/ 65536) {
    				sidenavitems_changes.$$scope = { dirty, ctx };
    			}

    			sidenavitems.$set(sidenavitems_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(sidenavitems.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(sidenavitems.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(sidenavitems, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_29.name,
    		type: "slot",
    		source: "(83:0) <SideNav bind:isOpen={isSideNavOpen}>",
    		ctx
    	});

    	return block;
    }

    // (103:8) <Column lg={6} md={6} sm={4} class="imgPart">
    function create_default_slot_28(ctx) {
    	let img;
    	let img_src_value;

    	const block = {
    		c: function create() {
    			img = element("img");
    			if (!src_url_equal(img.src, img_src_value = "../assets/images/relax/whatissauna.jpg")) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "What is sauna?");
    			add_location(img, file, 103, 10, 4023);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, img, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(img);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_28.name,
    		type: "slot",
    		source: "(103:8) <Column lg={6} md={6} sm={4} class=\\\"imgPart\\\">",
    		ctx
    	});

    	return block;
    }

    // (106:8) <Column lg={0} md={6} sm={4} class="textPart">
    function create_default_slot_27(ctx) {
    	let h2;
    	let t1;

    	const block = {
    		c: function create() {
    			h2 = element("h2");
    			h2.textContent = "What is Sauna?";
    			t1 = text("\n          A sauna , or sudatory, is a small room or building designed as a place to experience dry or wet heat sessions, or an establishment with one or more of these facilities. The steam and high heat make the bathers perspire. A thermometer in a sauna is typically used to measure heat, a hygrometer can be used to measure levels of humidity or steam.");
    			add_location(h2, file, 106, 10, 4179);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h2, anchor);
    			insert_dev(target, t1, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h2);
    			if (detaching) detach_dev(t1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_27.name,
    		type: "slot",
    		source: "(106:8) <Column lg={0} md={6} sm={4} class=\\\"textPart\\\">",
    		ctx
    	});

    	return block;
    }

    // (110:8) <Column lg={6} md={0} sm={0} class="textPart bigScreen">
    function create_default_slot_26(ctx) {
    	let h2;
    	let t1;

    	const block = {
    		c: function create() {
    			h2 = element("h2");
    			h2.textContent = "What is Sauna?";
    			t1 = text("\n          A sauna , or sudatory, is a small room or building designed as a place to experience dry or wet heat sessions, or an establishment with one or more of these facilities. The steam and high heat make the bathers perspire. A thermometer in a sauna is typically used to measure heat, a hygrometer can be used to measure levels of humidity or steam.");
    			add_location(h2, file, 110, 10, 4652);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h2, anchor);
    			insert_dev(target, t1, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h2);
    			if (detaching) detach_dev(t1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_26.name,
    		type: "slot",
    		source: "(110:8) <Column lg={6} md={0} sm={0} class=\\\"textPart bigScreen\\\">",
    		ctx
    	});

    	return block;
    }

    // (100:4) <Row as let:props class="twoParts" style="--odd-pos:{getPos(p1Top,'p1')};--odd-color:{getColor(p1Top,'p1')};">
    function create_default_slot_25(ctx) {
    	let div;
    	let a;
    	let t0;
    	let column0;
    	let t1;
    	let column1;
    	let t2;
    	let column2;
    	let current;

    	column0 = new Column$1({
    			props: {
    				lg: 6,
    				md: 6,
    				sm: 4,
    				class: "imgPart",
    				$$slots: { default: [create_default_slot_28] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	column1 = new Column$1({
    			props: {
    				lg: 0,
    				md: 6,
    				sm: 4,
    				class: "textPart",
    				$$slots: { default: [create_default_slot_27] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	column2 = new Column$1({
    			props: {
    				lg: 6,
    				md: 0,
    				sm: 0,
    				class: "textPart bigScreen",
    				$$slots: { default: [create_default_slot_26] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	let div_levels = [/*props*/ ctx[15]];
    	let div_data = {};

    	for (let i = 0; i < div_levels.length; i += 1) {
    		div_data = assign(div_data, div_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			div = element("div");
    			a = element("a");
    			t0 = space();
    			create_component(column0.$$.fragment);
    			t1 = space();
    			create_component(column1.$$.fragment);
    			t2 = space();
    			create_component(column2.$$.fragment);
    			attr_dev(a, "id", "p1");
    			attr_dev(a, "class", "anchor");
    			add_location(a, file, 101, 8, 3930);
    			set_attributes(div, div_data);
    			add_location(div, file, 100, 6, 3905);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, a);
    			append_dev(div, t0);
    			mount_component(column0, div, null);
    			append_dev(div, t1);
    			mount_component(column1, div, null);
    			append_dev(div, t2);
    			mount_component(column2, div, null);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const column0_changes = {};

    			if (dirty & /*$$scope*/ 65536) {
    				column0_changes.$$scope = { dirty, ctx };
    			}

    			column0.$set(column0_changes);
    			const column1_changes = {};

    			if (dirty & /*$$scope*/ 65536) {
    				column1_changes.$$scope = { dirty, ctx };
    			}

    			column1.$set(column1_changes);
    			const column2_changes = {};

    			if (dirty & /*$$scope*/ 65536) {
    				column2_changes.$$scope = { dirty, ctx };
    			}

    			column2.$set(column2_changes);
    			set_attributes(div, div_data = get_spread_update(div_levels, [dirty & /*props*/ 32768 && /*props*/ ctx[15]]));
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(column0.$$.fragment, local);
    			transition_in(column1.$$.fragment, local);
    			transition_in(column2.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(column0.$$.fragment, local);
    			transition_out(column1.$$.fragment, local);
    			transition_out(column2.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_component(column0);
    			destroy_component(column1);
    			destroy_component(column2);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_25.name,
    		type: "slot",
    		source: "(100:4) <Row as let:props class=\\\"twoParts\\\" style=\\\"--odd-pos:{getPos(p1Top,'p1')};--odd-color:{getColor(p1Top,'p1')};\\\">",
    		ctx
    	});

    	return block;
    }

    // (118:6) <Column lg={6} md={0} sm={0} class="textPart bigScreen">
    function create_default_slot_24(ctx) {
    	let h2;
    	let t1;

    	const block = {
    		c: function create() {
    			h2 = element("h2");
    			h2.textContent = "How good is Sauna?";
    			t1 = text("\n        Increased frequency of sauna bathing is associated with a reduced risk of sudden cardiac death, cardiovascular disease, and all-cause mortality. Its usage is also associated with lower markers of inflammation in the blood and a reduced risk of high blood pressure. In addition, it is associated with a decreased risk of pneumonia and may temporarily relieve symptoms of the common cold.It is also associated with a reduced risk of dementia and Alzheimer's disease.");
    			add_location(h2, file, 118, 8, 5286);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h2, anchor);
    			insert_dev(target, t1, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h2);
    			if (detaching) detach_dev(t1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_24.name,
    		type: "slot",
    		source: "(118:6) <Column lg={6} md={0} sm={0} class=\\\"textPart bigScreen\\\">",
    		ctx
    	});

    	return block;
    }

    // (122:6) <Column lg={6} md={6} sm={4} class="imgPart">
    function create_default_slot_23(ctx) {
    	let img;
    	let img_src_value;

    	const block = {
    		c: function create() {
    			img = element("img");
    			if (!src_url_equal(img.src, img_src_value = "../assets/images/relax/barrel.jpg")) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "How good is sauna?");
    			add_location(img, file, 122, 10, 5865);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, img, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(img);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_23.name,
    		type: "slot",
    		source: "(122:6) <Column lg={6} md={6} sm={4} class=\\\"imgPart\\\">",
    		ctx
    	});

    	return block;
    }

    // (125:8) <Column lg={0} md={6} sm={4} class="textPart">
    function create_default_slot_22(ctx) {
    	let h2;
    	let t1;

    	const block = {
    		c: function create() {
    			h2 = element("h2");
    			h2.textContent = "How good is Sauna?";
    			t1 = text("\n          Increased frequency of sauna bathing is associated with a reduced risk of sudden cardiac death, cardiovascular disease, and all-cause mortality. Its usage is also associated with lower markers of inflammation in the blood and a reduced risk of high blood pressure. In addition, it is associated with a decreased risk of pneumonia and may temporarily relieve symptoms of the common cold.It is also associated with a reduced risk of dementia and Alzheimer's disease.");
    			add_location(h2, file, 125, 10, 6021);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h2, anchor);
    			insert_dev(target, t1, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h2);
    			if (detaching) detach_dev(t1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_22.name,
    		type: "slot",
    		source: "(125:8) <Column lg={0} md={6} sm={4} class=\\\"textPart\\\">",
    		ctx
    	});

    	return block;
    }

    // (116:4) <Row class="twoParts" style="--even-pos:{getPos(p2Top,'p2')};--even-color:{getColor(p2Top,'p2')};">
    function create_default_slot_21(ctx) {
    	let a;
    	let t0;
    	let column0;
    	let t1;
    	let column1;
    	let t2;
    	let column2;
    	let current;

    	column0 = new Column$1({
    			props: {
    				lg: 6,
    				md: 0,
    				sm: 0,
    				class: "textPart bigScreen",
    				$$slots: { default: [create_default_slot_24] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	column1 = new Column$1({
    			props: {
    				lg: 6,
    				md: 6,
    				sm: 4,
    				class: "imgPart",
    				$$slots: { default: [create_default_slot_23] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	column2 = new Column$1({
    			props: {
    				lg: 0,
    				md: 6,
    				sm: 4,
    				class: "textPart",
    				$$slots: { default: [create_default_slot_22] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			a = element("a");
    			t0 = space();
    			create_component(column0.$$.fragment);
    			t1 = space();
    			create_component(column1.$$.fragment);
    			t2 = space();
    			create_component(column2.$$.fragment);
    			attr_dev(a, "id", "p2");
    			attr_dev(a, "class", "anchor");
    			add_location(a, file, 116, 6, 5184);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, a, anchor);
    			insert_dev(target, t0, anchor);
    			mount_component(column0, target, anchor);
    			insert_dev(target, t1, anchor);
    			mount_component(column1, target, anchor);
    			insert_dev(target, t2, anchor);
    			mount_component(column2, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const column0_changes = {};

    			if (dirty & /*$$scope*/ 65536) {
    				column0_changes.$$scope = { dirty, ctx };
    			}

    			column0.$set(column0_changes);
    			const column1_changes = {};

    			if (dirty & /*$$scope*/ 65536) {
    				column1_changes.$$scope = { dirty, ctx };
    			}

    			column1.$set(column1_changes);
    			const column2_changes = {};

    			if (dirty & /*$$scope*/ 65536) {
    				column2_changes.$$scope = { dirty, ctx };
    			}

    			column2.$set(column2_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(column0.$$.fragment, local);
    			transition_in(column1.$$.fragment, local);
    			transition_in(column2.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(column0.$$.fragment, local);
    			transition_out(column1.$$.fragment, local);
    			transition_out(column2.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(a);
    			if (detaching) detach_dev(t0);
    			destroy_component(column0, detaching);
    			if (detaching) detach_dev(t1);
    			destroy_component(column1, detaching);
    			if (detaching) detach_dev(t2);
    			destroy_component(column2, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_21.name,
    		type: "slot",
    		source: "(116:4) <Row class=\\\"twoParts\\\" style=\\\"--even-pos:{getPos(p2Top,'p2')};--even-color:{getColor(p2Top,'p2')};\\\">",
    		ctx
    	});

    	return block;
    }

    // (132:6) <Column lg={6} md={6} sm={4} class="imgPart">
    function create_default_slot_20(ctx) {
    	let img;
    	let img_src_value;

    	const block = {
    		c: function create() {
    			img = element("img");
    			if (!src_url_equal(img.src, img_src_value = "../assets/images/relax/smoke.jpg")) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "How to sauna?");
    			add_location(img, file, 132, 10, 6754);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, img, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(img);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_20.name,
    		type: "slot",
    		source: "(132:6) <Column lg={6} md={6} sm={4} class=\\\"imgPart\\\">",
    		ctx
    	});

    	return block;
    }

    // (135:8) <Column lg={0} md={6} sm={4} class="textPart">
    function create_default_slot_19(ctx) {
    	let h2;
    	let t1;

    	const block = {
    		c: function create() {
    			h2 = element("h2");
    			h2.textContent = "How to Sauna?";
    			t1 = text("\n          Increased frequency of sauna bathing is associated with a reduced risk of sudden cardiac death, cardiovascular disease, and all-cause mortality. Its usage is also associated with lower markers of inflammation in the blood and a reduced risk of high blood pressure. In addition, it is associated with a decreased risk of pneumonia and may temporarily relieve symptoms of the common cold.It is also associated with a reduced risk of dementia and Alzheimer's disease.");
    			add_location(h2, file, 135, 10, 6904);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h2, anchor);
    			insert_dev(target, t1, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h2);
    			if (detaching) detach_dev(t1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_19.name,
    		type: "slot",
    		source: "(135:8) <Column lg={0} md={6} sm={4} class=\\\"textPart\\\">",
    		ctx
    	});

    	return block;
    }

    // (140:10) <Tabs>
    function create_default_slot_18(ctx) {
    	let tab0;
    	let t0;
    	let tab1;
    	let t1;
    	let tab2;
    	let t2;
    	let tab3;
    	let current;

    	tab0 = new Tab$1({
    			props: { label: "Smoke" },
    			$$inline: true
    		});

    	tab1 = new Tab$1({
    			props: { label: "Heat storage" },
    			$$inline: true
    		});

    	tab2 = new Tab$1({
    			props: { label: "Continuous fire" },
    			$$inline: true
    		});

    	tab3 = new Tab$1({
    			props: { label: "Electric stove" },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(tab0.$$.fragment);
    			t0 = space();
    			create_component(tab1.$$.fragment);
    			t1 = space();
    			create_component(tab2.$$.fragment);
    			t2 = space();
    			create_component(tab3.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(tab0, target, anchor);
    			insert_dev(target, t0, anchor);
    			mount_component(tab1, target, anchor);
    			insert_dev(target, t1, anchor);
    			mount_component(tab2, target, anchor);
    			insert_dev(target, t2, anchor);
    			mount_component(tab3, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(tab0.$$.fragment, local);
    			transition_in(tab1.$$.fragment, local);
    			transition_in(tab2.$$.fragment, local);
    			transition_in(tab3.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(tab0.$$.fragment, local);
    			transition_out(tab1.$$.fragment, local);
    			transition_out(tab2.$$.fragment, local);
    			transition_out(tab3.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(tab0, detaching);
    			if (detaching) detach_dev(t0);
    			destroy_component(tab1, detaching);
    			if (detaching) detach_dev(t1);
    			destroy_component(tab2, detaching);
    			if (detaching) detach_dev(t2);
    			destroy_component(tab3, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_18.name,
    		type: "slot",
    		source: "(140:10) <Tabs>",
    		ctx
    	});

    	return block;
    }

    // (146:14) <TabContent>
    function create_default_slot_17(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Smoke sauna (Finnish savusauna, Estonian suitsusaun, Võro savvusann) is one of the earliest forms of the sauna. It is simply a room containing a pile of rocks, but without a chimney. A fire is lit directly under the rocks and after a while the fire is extinguished. The heat retained in the rocks, and the earlier fire, becomes the main source for heating the sauna.");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_17.name,
    		type: "slot",
    		source: "(146:14) <TabContent>",
    		ctx
    	});

    	return block;
    }

    // (149:14) <TabContent>
    function create_default_slot_16(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("The smoke-sauna stove is also used with a sealed stone compartment and chimney (a heat storage-stove) which eliminates the smoke odour and eye irritation of the smoke sauna. A heat storage stove does not give up much heat in the sauna before bathing since the stone compartment has an insulated lid. When the sauna bath is started and the löyly shutter opened a soft warmth flow into the otherwise relatively cold (60 °C; 140 °F) sauna.");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_16.name,
    		type: "slot",
    		source: "(149:14) <TabContent>",
    		ctx
    	});

    	return block;
    }

    // (152:14) <TabContent>
    function create_default_slot_15(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("A continuous fire stove, instead of stored heat, is a relatively recent invention. There is a firebox and a smokestack, and stones are placed in a compartment directly above the firebox. It takes a shorter time to heat than the heat-storage sauna, about one hour. A fire-heated sauna requires manual labor in the form of maintaining the fire during bathing; the fire can also be seen as a hazard.");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_15.name,
    		type: "slot",
    		source: "(152:14) <TabContent>",
    		ctx
    	});

    	return block;
    }

    // (155:14) <TabContent>
    function create_default_slot_14(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("The most common modern sauna types are those with electric stoves. The stones are heated up and kept on temperature using electric heating elements. There is a thermostat and a timer (typically with eight hours' maximum delay time, followed by one hour's continuous heating time) on the stove. This type of heating is generally used only in urban saunas.");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_14.name,
    		type: "slot",
    		source: "(155:14) <TabContent>",
    		ctx
    	});

    	return block;
    }

    // (145:12) 
    function create_content_slot(ctx) {
    	let div;
    	let tabcontent0;
    	let t0;
    	let tabcontent1;
    	let t1;
    	let tabcontent2;
    	let t2;
    	let tabcontent3;
    	let current;

    	tabcontent0 = new TabContent$1({
    			props: {
    				$$slots: { default: [create_default_slot_17] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	tabcontent1 = new TabContent$1({
    			props: {
    				$$slots: { default: [create_default_slot_16] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	tabcontent2 = new TabContent$1({
    			props: {
    				$$slots: { default: [create_default_slot_15] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	tabcontent3 = new TabContent$1({
    			props: {
    				$$slots: { default: [create_default_slot_14] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			div = element("div");
    			create_component(tabcontent0.$$.fragment);
    			t0 = space();
    			create_component(tabcontent1.$$.fragment);
    			t1 = space();
    			create_component(tabcontent2.$$.fragment);
    			t2 = space();
    			create_component(tabcontent3.$$.fragment);
    			attr_dev(div, "slot", "content");
    			add_location(div, file, 144, 12, 7676);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			mount_component(tabcontent0, div, null);
    			append_dev(div, t0);
    			mount_component(tabcontent1, div, null);
    			append_dev(div, t1);
    			mount_component(tabcontent2, div, null);
    			append_dev(div, t2);
    			mount_component(tabcontent3, div, null);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const tabcontent0_changes = {};

    			if (dirty & /*$$scope*/ 65536) {
    				tabcontent0_changes.$$scope = { dirty, ctx };
    			}

    			tabcontent0.$set(tabcontent0_changes);
    			const tabcontent1_changes = {};

    			if (dirty & /*$$scope*/ 65536) {
    				tabcontent1_changes.$$scope = { dirty, ctx };
    			}

    			tabcontent1.$set(tabcontent1_changes);
    			const tabcontent2_changes = {};

    			if (dirty & /*$$scope*/ 65536) {
    				tabcontent2_changes.$$scope = { dirty, ctx };
    			}

    			tabcontent2.$set(tabcontent2_changes);
    			const tabcontent3_changes = {};

    			if (dirty & /*$$scope*/ 65536) {
    				tabcontent3_changes.$$scope = { dirty, ctx };
    			}

    			tabcontent3.$set(tabcontent3_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(tabcontent0.$$.fragment, local);
    			transition_in(tabcontent1.$$.fragment, local);
    			transition_in(tabcontent2.$$.fragment, local);
    			transition_in(tabcontent3.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(tabcontent0.$$.fragment, local);
    			transition_out(tabcontent1.$$.fragment, local);
    			transition_out(tabcontent2.$$.fragment, local);
    			transition_out(tabcontent3.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_component(tabcontent0);
    			destroy_component(tabcontent1);
    			destroy_component(tabcontent2);
    			destroy_component(tabcontent3);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_content_slot.name,
    		type: "slot",
    		source: "(145:12) ",
    		ctx
    	});

    	return block;
    }

    // (139:8) <Column lg={6} md={0} sm={0} class="textPart bigScreen">
    function create_default_slot_13(ctx) {
    	let tabs;
    	let current;

    	tabs = new Tabs$1({
    			props: {
    				$$slots: {
    					content: [create_content_slot],
    					default: [create_default_slot_18]
    				},
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(tabs.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(tabs, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const tabs_changes = {};

    			if (dirty & /*$$scope*/ 65536) {
    				tabs_changes.$$scope = { dirty, ctx };
    			}

    			tabs.$set(tabs_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(tabs.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(tabs.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(tabs, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_13.name,
    		type: "slot",
    		source: "(139:8) <Column lg={6} md={0} sm={0} class=\\\"textPart bigScreen\\\">",
    		ctx
    	});

    	return block;
    }

    // (130:4) <Row class="twoParts" style="--odd-pos:{getPos(p3Top,'p3')};--odd-color:{getColor(p3Top,'p3')};">
    function create_default_slot_12(ctx) {
    	let a;
    	let t0;
    	let column0;
    	let t1;
    	let column1;
    	let t2;
    	let column2;
    	let current;

    	column0 = new Column$1({
    			props: {
    				lg: 6,
    				md: 6,
    				sm: 4,
    				class: "imgPart",
    				$$slots: { default: [create_default_slot_20] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	column1 = new Column$1({
    			props: {
    				lg: 0,
    				md: 6,
    				sm: 4,
    				class: "textPart",
    				$$slots: { default: [create_default_slot_19] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	column2 = new Column$1({
    			props: {
    				lg: 6,
    				md: 0,
    				sm: 0,
    				class: "textPart bigScreen",
    				$$slots: { default: [create_default_slot_13] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			a = element("a");
    			t0 = space();
    			create_component(column0.$$.fragment);
    			t1 = space();
    			create_component(column1.$$.fragment);
    			t2 = space();
    			create_component(column2.$$.fragment);
    			attr_dev(a, "id", "p3");
    			attr_dev(a, "class", "anchor");
    			add_location(a, file, 130, 6, 6661);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, a, anchor);
    			insert_dev(target, t0, anchor);
    			mount_component(column0, target, anchor);
    			insert_dev(target, t1, anchor);
    			mount_component(column1, target, anchor);
    			insert_dev(target, t2, anchor);
    			mount_component(column2, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const column0_changes = {};

    			if (dirty & /*$$scope*/ 65536) {
    				column0_changes.$$scope = { dirty, ctx };
    			}

    			column0.$set(column0_changes);
    			const column1_changes = {};

    			if (dirty & /*$$scope*/ 65536) {
    				column1_changes.$$scope = { dirty, ctx };
    			}

    			column1.$set(column1_changes);
    			const column2_changes = {};

    			if (dirty & /*$$scope*/ 65536) {
    				column2_changes.$$scope = { dirty, ctx };
    			}

    			column2.$set(column2_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(column0.$$.fragment, local);
    			transition_in(column1.$$.fragment, local);
    			transition_in(column2.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(column0.$$.fragment, local);
    			transition_out(column1.$$.fragment, local);
    			transition_out(column2.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(a);
    			if (detaching) detach_dev(t0);
    			destroy_component(column0, detaching);
    			if (detaching) detach_dev(t1);
    			destroy_component(column1, detaching);
    			if (detaching) detach_dev(t2);
    			destroy_component(column2, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_12.name,
    		type: "slot",
    		source: "(130:4) <Row class=\\\"twoParts\\\" style=\\\"--odd-pos:{getPos(p3Top,'p3')};--odd-color:{getColor(p3Top,'p3')};\\\">",
    		ctx
    	});

    	return block;
    }

    // (168:10) <FormGroup legendText="What is your name?" noMargin>
    function create_default_slot_11(ctx) {
    	let textinput;
    	let current;

    	textinput = new TextInput$1({
    			props: {
    				placeholder: "Enter name here...",
    				pattern: String.raw`.+`,
    				type: "text",
    				required: true
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(textinput.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(textinput, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(textinput.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(textinput.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(textinput, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_11.name,
    		type: "slot",
    		source: "(168:10) <FormGroup legendText=\\\"What is your name?\\\" noMargin>",
    		ctx
    	});

    	return block;
    }

    // (171:10) <FormGroup legendText="What is your email?" noMargin>
    function create_default_slot_10(ctx) {
    	let textinput;
    	let current;

    	textinput = new TextInput$1({
    			props: {
    				placeholder: "Enter email here...",
    				type: "email",
    				required: true
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(textinput.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(textinput, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(textinput.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(textinput.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(textinput, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_10.name,
    		type: "slot",
    		source: "(171:10) <FormGroup legendText=\\\"What is your email?\\\" noMargin>",
    		ctx
    	});

    	return block;
    }

    // (175:12) <Select noLabel selected="">
    function create_default_slot_9(ctx) {
    	let selectitem0;
    	let t0;
    	let selectitem1;
    	let t1;
    	let selectitem2;
    	let t2;
    	let selectitem3;
    	let current;

    	selectitem0 = new SelectItem$1({
    			props: {
    				value: "sauna_service",
    				text: "Sauna Service"
    			},
    			$$inline: true
    		});

    	selectitem1 = new SelectItem$1({
    			props: { value: "locations", text: "Locations" },
    			$$inline: true
    		});

    	selectitem2 = new SelectItem$1({
    			props: { value: "site", text: "Official Site" },
    			$$inline: true
    		});

    	selectitem3 = new SelectItem$1({
    			props: { value: "other", text: "Other" },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(selectitem0.$$.fragment);
    			t0 = space();
    			create_component(selectitem1.$$.fragment);
    			t1 = space();
    			create_component(selectitem2.$$.fragment);
    			t2 = space();
    			create_component(selectitem3.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(selectitem0, target, anchor);
    			insert_dev(target, t0, anchor);
    			mount_component(selectitem1, target, anchor);
    			insert_dev(target, t1, anchor);
    			mount_component(selectitem2, target, anchor);
    			insert_dev(target, t2, anchor);
    			mount_component(selectitem3, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(selectitem0.$$.fragment, local);
    			transition_in(selectitem1.$$.fragment, local);
    			transition_in(selectitem2.$$.fragment, local);
    			transition_in(selectitem3.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(selectitem0.$$.fragment, local);
    			transition_out(selectitem1.$$.fragment, local);
    			transition_out(selectitem2.$$.fragment, local);
    			transition_out(selectitem3.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(selectitem0, detaching);
    			if (detaching) detach_dev(t0);
    			destroy_component(selectitem1, detaching);
    			if (detaching) detach_dev(t1);
    			destroy_component(selectitem2, detaching);
    			if (detaching) detach_dev(t2);
    			destroy_component(selectitem3, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_9.name,
    		type: "slot",
    		source: "(175:12) <Select noLabel selected=\\\"\\\">",
    		ctx
    	});

    	return block;
    }

    // (174:10) <FormGroup legendText="What is it about?" noMargin>
    function create_default_slot_8(ctx) {
    	let select;
    	let current;

    	select = new Select$1({
    			props: {
    				noLabel: true,
    				selected: "",
    				$$slots: { default: [create_default_slot_9] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(select.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(select, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const select_changes = {};

    			if (dirty & /*$$scope*/ 65536) {
    				select_changes.$$scope = { dirty, ctx };
    			}

    			select.$set(select_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(select.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(select.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(select, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_8.name,
    		type: "slot",
    		source: "(174:10) <FormGroup legendText=\\\"What is it about?\\\" noMargin>",
    		ctx
    	});

    	return block;
    }

    // (183:10) <FormGroup legendText="What is your questions?" noMargin>
    function create_default_slot_7(ctx) {
    	let textarea;
    	let current;

    	textarea = new TextArea$1({
    			props: {
    				required: true,
    				placeholder: "questions, comment or anything you want to speak to me..."
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(textarea.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(textarea, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(textarea.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(textarea.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(textarea, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_7.name,
    		type: "slot",
    		source: "(183:10) <FormGroup legendText=\\\"What is your questions?\\\" noMargin>",
    		ctx
    	});

    	return block;
    }

    // (187:12) <Button type="submit">
    function create_default_slot_6(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Submit");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_6.name,
    		type: "slot",
    		source: "(187:12) <Button type=\\\"submit\\\">",
    		ctx
    	});

    	return block;
    }

    // (186:10) <FormGroup id="formFooter">
    function create_default_slot_5(ctx) {
    	let button;
    	let current;

    	button = new Button$1({
    			props: {
    				type: "submit",
    				$$slots: { default: [create_default_slot_6] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(button.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(button, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const button_changes = {};

    			if (dirty & /*$$scope*/ 65536) {
    				button_changes.$$scope = { dirty, ctx };
    			}

    			button.$set(button_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(button.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(button.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(button, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_5.name,
    		type: "slot",
    		source: "(186:10) <FormGroup id=\\\"formFooter\\\">",
    		ctx
    	});

    	return block;
    }

    // (167:8) <Form>
    function create_default_slot_4(ctx) {
    	let formgroup0;
    	let t0;
    	let formgroup1;
    	let t1;
    	let formgroup2;
    	let t2;
    	let formgroup3;
    	let t3;
    	let formgroup4;
    	let current;

    	formgroup0 = new FormGroup$1({
    			props: {
    				legendText: "What is your name?",
    				noMargin: true,
    				$$slots: { default: [create_default_slot_11] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	formgroup1 = new FormGroup$1({
    			props: {
    				legendText: "What is your email?",
    				noMargin: true,
    				$$slots: { default: [create_default_slot_10] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	formgroup2 = new FormGroup$1({
    			props: {
    				legendText: "What is it about?",
    				noMargin: true,
    				$$slots: { default: [create_default_slot_8] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	formgroup3 = new FormGroup$1({
    			props: {
    				legendText: "What is your questions?",
    				noMargin: true,
    				$$slots: { default: [create_default_slot_7] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	formgroup4 = new FormGroup$1({
    			props: {
    				id: "formFooter",
    				$$slots: { default: [create_default_slot_5] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(formgroup0.$$.fragment);
    			t0 = space();
    			create_component(formgroup1.$$.fragment);
    			t1 = space();
    			create_component(formgroup2.$$.fragment);
    			t2 = space();
    			create_component(formgroup3.$$.fragment);
    			t3 = space();
    			create_component(formgroup4.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(formgroup0, target, anchor);
    			insert_dev(target, t0, anchor);
    			mount_component(formgroup1, target, anchor);
    			insert_dev(target, t1, anchor);
    			mount_component(formgroup2, target, anchor);
    			insert_dev(target, t2, anchor);
    			mount_component(formgroup3, target, anchor);
    			insert_dev(target, t3, anchor);
    			mount_component(formgroup4, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const formgroup0_changes = {};

    			if (dirty & /*$$scope*/ 65536) {
    				formgroup0_changes.$$scope = { dirty, ctx };
    			}

    			formgroup0.$set(formgroup0_changes);
    			const formgroup1_changes = {};

    			if (dirty & /*$$scope*/ 65536) {
    				formgroup1_changes.$$scope = { dirty, ctx };
    			}

    			formgroup1.$set(formgroup1_changes);
    			const formgroup2_changes = {};

    			if (dirty & /*$$scope*/ 65536) {
    				formgroup2_changes.$$scope = { dirty, ctx };
    			}

    			formgroup2.$set(formgroup2_changes);
    			const formgroup3_changes = {};

    			if (dirty & /*$$scope*/ 65536) {
    				formgroup3_changes.$$scope = { dirty, ctx };
    			}

    			formgroup3.$set(formgroup3_changes);
    			const formgroup4_changes = {};

    			if (dirty & /*$$scope*/ 65536) {
    				formgroup4_changes.$$scope = { dirty, ctx };
    			}

    			formgroup4.$set(formgroup4_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(formgroup0.$$.fragment, local);
    			transition_in(formgroup1.$$.fragment, local);
    			transition_in(formgroup2.$$.fragment, local);
    			transition_in(formgroup3.$$.fragment, local);
    			transition_in(formgroup4.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(formgroup0.$$.fragment, local);
    			transition_out(formgroup1.$$.fragment, local);
    			transition_out(formgroup2.$$.fragment, local);
    			transition_out(formgroup3.$$.fragment, local);
    			transition_out(formgroup4.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(formgroup0, detaching);
    			if (detaching) detach_dev(t0);
    			destroy_component(formgroup1, detaching);
    			if (detaching) detach_dev(t1);
    			destroy_component(formgroup2, detaching);
    			if (detaching) detach_dev(t2);
    			destroy_component(formgroup3, detaching);
    			if (detaching) detach_dev(t3);
    			destroy_component(formgroup4, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_4.name,
    		type: "slot",
    		source: "(167:8) <Form>",
    		ctx
    	});

    	return block;
    }

    // (165:6) <Column lg={6} md={6} sm={12}>
    function create_default_slot_3(ctx) {
    	let div;
    	let t1;
    	let form;
    	let current;

    	form = new Form$1({
    			props: {
    				$$slots: { default: [create_default_slot_4] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			div = element("div");
    			div.textContent = "Contact Us";
    			t1 = space();
    			create_component(form.$$.fragment);
    			attr_dev(div, "class", "formTitle");
    			add_location(div, file, 165, 8, 9808);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			insert_dev(target, t1, anchor);
    			mount_component(form, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const form_changes = {};

    			if (dirty & /*$$scope*/ 65536) {
    				form_changes.$$scope = { dirty, ctx };
    			}

    			form.$set(form_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(form.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(form.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (detaching) detach_dev(t1);
    			destroy_component(form, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_3.name,
    		type: "slot",
    		source: "(165:6) <Column lg={6} md={6} sm={12}>",
    		ctx
    	});

    	return block;
    }

    // (163:4) <Row class="twoParts" style="--even-pos:{getPos(p4Top,'p4')};--even-color:{getColor(p4Top,'p4')};">
    function create_default_slot_2(ctx) {
    	let a;
    	let t;
    	let column;
    	let current;

    	column = new Column$1({
    			props: {
    				lg: 6,
    				md: 6,
    				sm: 12,
    				$$slots: { default: [create_default_slot_3] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			a = element("a");
    			t = space();
    			create_component(column.$$.fragment);
    			attr_dev(a, "id", "p4");
    			attr_dev(a, "class", "anchor");
    			add_location(a, file, 163, 6, 9732);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, a, anchor);
    			insert_dev(target, t, anchor);
    			mount_component(column, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const column_changes = {};

    			if (dirty & /*$$scope*/ 65536) {
    				column_changes.$$scope = { dirty, ctx };
    			}

    			column.$set(column_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(column.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(column.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(a);
    			if (detaching) detach_dev(t);
    			destroy_component(column, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_2.name,
    		type: "slot",
    		source: "(163:4) <Row class=\\\"twoParts\\\" style=\\\"--even-pos:{getPos(p4Top,'p4')};--even-color:{getColor(p4Top,'p4')};\\\">",
    		ctx
    	});

    	return block;
    }

    // (99:2) <Grid noGutter={false} style="overflow-x: hidden;">
    function create_default_slot_1(ctx) {
    	let row0;
    	let t0;
    	let row1;
    	let t1;
    	let row2;
    	let t2;
    	let row3;
    	let current;

    	row0 = new Row$1({
    			props: {
    				as: true,
    				class: "twoParts",
    				style: "--odd-pos:" + /*getPos*/ ctx[9](/*p1Top*/ ctx[7], 'p1') + ";--odd-color:" + /*getColor*/ ctx[8](/*p1Top*/ ctx[7], 'p1') + ";",
    				$$slots: {
    					default: [
    						create_default_slot_25,
    						({ props }) => ({ 15: props }),
    						({ props }) => props ? 32768 : 0
    					]
    				},
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	row1 = new Row$1({
    			props: {
    				class: "twoParts",
    				style: "--even-pos:" + /*getPos*/ ctx[9](/*p2Top*/ ctx[6], 'p2') + ";--even-color:" + /*getColor*/ ctx[8](/*p2Top*/ ctx[6], 'p2') + ";",
    				$$slots: { default: [create_default_slot_21] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	row2 = new Row$1({
    			props: {
    				class: "twoParts",
    				style: "--odd-pos:" + /*getPos*/ ctx[9](/*p3Top*/ ctx[5], 'p3') + ";--odd-color:" + /*getColor*/ ctx[8](/*p3Top*/ ctx[5], 'p3') + ";",
    				$$slots: { default: [create_default_slot_12] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	row3 = new Row$1({
    			props: {
    				class: "twoParts",
    				style: "--even-pos:" + /*getPos*/ ctx[9](/*p4Top*/ ctx[4], 'p4') + ";--even-color:" + /*getColor*/ ctx[8](/*p4Top*/ ctx[4], 'p4') + ";",
    				$$slots: { default: [create_default_slot_2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(row0.$$.fragment);
    			t0 = space();
    			create_component(row1.$$.fragment);
    			t1 = space();
    			create_component(row2.$$.fragment);
    			t2 = space();
    			create_component(row3.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(row0, target, anchor);
    			insert_dev(target, t0, anchor);
    			mount_component(row1, target, anchor);
    			insert_dev(target, t1, anchor);
    			mount_component(row2, target, anchor);
    			insert_dev(target, t2, anchor);
    			mount_component(row3, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const row0_changes = {};
    			if (dirty & /*p1Top*/ 128) row0_changes.style = "--odd-pos:" + /*getPos*/ ctx[9](/*p1Top*/ ctx[7], 'p1') + ";--odd-color:" + /*getColor*/ ctx[8](/*p1Top*/ ctx[7], 'p1') + ";";

    			if (dirty & /*$$scope, props*/ 98304) {
    				row0_changes.$$scope = { dirty, ctx };
    			}

    			row0.$set(row0_changes);
    			const row1_changes = {};
    			if (dirty & /*p2Top*/ 64) row1_changes.style = "--even-pos:" + /*getPos*/ ctx[9](/*p2Top*/ ctx[6], 'p2') + ";--even-color:" + /*getColor*/ ctx[8](/*p2Top*/ ctx[6], 'p2') + ";";

    			if (dirty & /*$$scope*/ 65536) {
    				row1_changes.$$scope = { dirty, ctx };
    			}

    			row1.$set(row1_changes);
    			const row2_changes = {};
    			if (dirty & /*p3Top*/ 32) row2_changes.style = "--odd-pos:" + /*getPos*/ ctx[9](/*p3Top*/ ctx[5], 'p3') + ";--odd-color:" + /*getColor*/ ctx[8](/*p3Top*/ ctx[5], 'p3') + ";";

    			if (dirty & /*$$scope*/ 65536) {
    				row2_changes.$$scope = { dirty, ctx };
    			}

    			row2.$set(row2_changes);
    			const row3_changes = {};
    			if (dirty & /*p4Top*/ 16) row3_changes.style = "--even-pos:" + /*getPos*/ ctx[9](/*p4Top*/ ctx[4], 'p4') + ";--even-color:" + /*getColor*/ ctx[8](/*p4Top*/ ctx[4], 'p4') + ";";

    			if (dirty & /*$$scope*/ 65536) {
    				row3_changes.$$scope = { dirty, ctx };
    			}

    			row3.$set(row3_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(row0.$$.fragment, local);
    			transition_in(row1.$$.fragment, local);
    			transition_in(row2.$$.fragment, local);
    			transition_in(row3.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(row0.$$.fragment, local);
    			transition_out(row1.$$.fragment, local);
    			transition_out(row2.$$.fragment, local);
    			transition_out(row3.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(row0, detaching);
    			if (detaching) detach_dev(t0);
    			destroy_component(row1, detaching);
    			if (detaching) detach_dev(t1);
    			destroy_component(row2, detaching);
    			if (detaching) detach_dev(t2);
    			destroy_component(row3, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1.name,
    		type: "slot",
    		source: "(99:2) <Grid noGutter={false} style=\\\"overflow-x: hidden;\\\">",
    		ctx
    	});

    	return block;
    }

    // (194:6) <Tooltip direction="top" triggerText="Attribute">
    function create_default_slot(ctx) {
    	let p;
    	let attr_1;
    	let current;
    	attr_1 = new Attr({ $$inline: true });

    	const block = {
    		c: function create() {
    			p = element("p");
    			create_component(attr_1.$$.fragment);
    			add_location(p, file, 194, 8, 11129);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, p, anchor);
    			mount_component(attr_1, p, null);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(attr_1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(attr_1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(p);
    			destroy_component(attr_1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot.name,
    		type: "slot",
    		source: "(194:6) <Tooltip direction=\\\"top\\\" triggerText=\\\"Attribute\\\">",
    		ctx
    	});

    	return block;
    }

    function create_fragment(ctx) {
    	let scrolling = false;

    	let clear_scrolling = () => {
    		scrolling = false;
    	};

    	let scrolling_timeout;
    	let header;
    	let updating_isSideNavOpen;
    	let t0;
    	let sidenav;
    	let updating_isOpen;
    	let t1;
    	let main;
    	let div1;
    	let steam0;
    	let t2;
    	let div0;
    	let t4;
    	let div4;
    	let stone;
    	let t5;
    	let steam1;
    	let t6;
    	let grid;
    	let t7;
    	let div3;
    	let tooltip;
    	let t8;
    	let div2;
    	let current;
    	let mounted;
    	let dispose;
    	add_render_callback(/*onwindowscroll*/ ctx[10]);
    	add_render_callback(/*onwindowresize*/ ctx[11]);

    	function header_isSideNavOpen_binding(value) {
    		/*header_isSideNavOpen_binding*/ ctx[12](value);
    	}

    	let header_props = {
    		company: "Sauna Club",
    		platformName: "Ying",
    		$$slots: { default: [create_default_slot_31] },
    		$$scope: { ctx }
    	};

    	if (/*isSideNavOpen*/ ctx[1] !== void 0) {
    		header_props.isSideNavOpen = /*isSideNavOpen*/ ctx[1];
    	}

    	header = new Header$1({ props: header_props, $$inline: true });
    	binding_callbacks.push(() => bind(header, 'isSideNavOpen', header_isSideNavOpen_binding));

    	function sidenav_isOpen_binding(value) {
    		/*sidenav_isOpen_binding*/ ctx[13](value);
    	}

    	let sidenav_props = {
    		$$slots: { default: [create_default_slot_29] },
    		$$scope: { ctx }
    	};

    	if (/*isSideNavOpen*/ ctx[1] !== void 0) {
    		sidenav_props.isOpen = /*isSideNavOpen*/ ctx[1];
    	}

    	sidenav = new SideNav$1({ props: sidenav_props, $$inline: true });
    	binding_callbacks.push(() => bind(sidenav, 'isOpen', sidenav_isOpen_binding));
    	steam0 = new Steam({ $$inline: true });
    	stone = new StoneBorder({ $$inline: true });
    	steam1 = new Steam({ $$inline: true });

    	grid = new Grid$1({
    			props: {
    				noGutter: false,
    				style: "overflow-x: hidden;",
    				$$slots: { default: [create_default_slot_1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	tooltip = new Tooltip$1({
    			props: {
    				direction: "top",
    				triggerText: "Attribute",
    				$$slots: { default: [create_default_slot] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(header.$$.fragment);
    			t0 = space();
    			create_component(sidenav.$$.fragment);
    			t1 = space();
    			main = element("main");
    			div1 = element("div");
    			create_component(steam0.$$.fragment);
    			t2 = space();
    			div0 = element("div");
    			div0.textContent = "Sauna";
    			t4 = space();
    			div4 = element("div");
    			create_component(stone.$$.fragment);
    			t5 = space();
    			create_component(steam1.$$.fragment);
    			t6 = space();
    			create_component(grid.$$.fragment);
    			t7 = space();
    			div3 = element("div");
    			create_component(tooltip.$$.fragment);
    			t8 = space();
    			div2 = element("div");
    			div2.textContent = "Copyright © 2021 Ying";
    			attr_dev(div0, "id", "floatingText");
    			add_location(div0, file, 93, 2, 3636);
    			attr_dev(div1, "id", "banner");
    			add_location(div1, file, 91, 0, 3604);
    			add_location(div2, file, 198, 6, 11188);
    			set_style(div3, "display", "flex");
    			set_style(div3, "justify-content", "space-between");
    			add_location(div3, file, 192, 4, 11006);
    			attr_dev(div4, "id", "contentContainer");
    			add_location(div4, file, 95, 0, 3678);
    			add_location(main, file, 90, 0, 3597);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(header, target, anchor);
    			insert_dev(target, t0, anchor);
    			mount_component(sidenav, target, anchor);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, main, anchor);
    			append_dev(main, div1);
    			mount_component(steam0, div1, null);
    			append_dev(div1, t2);
    			append_dev(div1, div0);
    			append_dev(main, t4);
    			append_dev(main, div4);
    			mount_component(stone, div4, null);
    			append_dev(div4, t5);
    			mount_component(steam1, div4, null);
    			append_dev(div4, t6);
    			mount_component(grid, div4, null);
    			append_dev(div4, t7);
    			append_dev(div4, div3);
    			mount_component(tooltip, div3, null);
    			append_dev(div3, t8);
    			append_dev(div3, div2);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(window, "scroll", () => {
    						scrolling = true;
    						clearTimeout(scrolling_timeout);
    						scrolling_timeout = setTimeout(clear_scrolling, 100);
    						/*onwindowscroll*/ ctx[10]();
    					}),
    					listen_dev(window, "resize", /*onwindowresize*/ ctx[11])
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*y*/ 1 && !scrolling) {
    				scrolling = true;
    				clearTimeout(scrolling_timeout);
    				scrollTo(window.pageXOffset, /*y*/ ctx[0]);
    				scrolling_timeout = setTimeout(clear_scrolling, 100);
    			}

    			const header_changes = {};

    			if (dirty & /*$$scope*/ 65536) {
    				header_changes.$$scope = { dirty, ctx };
    			}

    			if (!updating_isSideNavOpen && dirty & /*isSideNavOpen*/ 2) {
    				updating_isSideNavOpen = true;
    				header_changes.isSideNavOpen = /*isSideNavOpen*/ ctx[1];
    				add_flush_callback(() => updating_isSideNavOpen = false);
    			}

    			header.$set(header_changes);
    			const sidenav_changes = {};

    			if (dirty & /*$$scope*/ 65536) {
    				sidenav_changes.$$scope = { dirty, ctx };
    			}

    			if (!updating_isOpen && dirty & /*isSideNavOpen*/ 2) {
    				updating_isOpen = true;
    				sidenav_changes.isOpen = /*isSideNavOpen*/ ctx[1];
    				add_flush_callback(() => updating_isOpen = false);
    			}

    			sidenav.$set(sidenav_changes);
    			const grid_changes = {};

    			if (dirty & /*$$scope, p4Top, p3Top, p2Top, p1Top*/ 65776) {
    				grid_changes.$$scope = { dirty, ctx };
    			}

    			grid.$set(grid_changes);
    			const tooltip_changes = {};

    			if (dirty & /*$$scope*/ 65536) {
    				tooltip_changes.$$scope = { dirty, ctx };
    			}

    			tooltip.$set(tooltip_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(header.$$.fragment, local);
    			transition_in(sidenav.$$.fragment, local);
    			transition_in(steam0.$$.fragment, local);
    			transition_in(stone.$$.fragment, local);
    			transition_in(steam1.$$.fragment, local);
    			transition_in(grid.$$.fragment, local);
    			transition_in(tooltip.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(header.$$.fragment, local);
    			transition_out(sidenav.$$.fragment, local);
    			transition_out(steam0.$$.fragment, local);
    			transition_out(stone.$$.fragment, local);
    			transition_out(steam1.$$.fragment, local);
    			transition_out(grid.$$.fragment, local);
    			transition_out(tooltip.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(header, detaching);
    			if (detaching) detach_dev(t0);
    			destroy_component(sidenav, detaching);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(main);
    			destroy_component(steam0);
    			destroy_component(stone);
    			destroy_component(steam1);
    			destroy_component(grid);
    			destroy_component(tooltip);
    			mounted = false;
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

    function getTop(p, y) {
    	let ph = document.getElementById(p);
    	let pTop = null;
    	if (ph) pTop = ph.getBoundingClientRect().top;
    	return pTop;
    }

    function instance($$self, $$props, $$invalidate) {
    	let p1Top;
    	let p2Top;
    	let p3Top;
    	let p4Top;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('App', slots, []);

    	onMount(() => {
    		getTop('p1');
    		getTop('p2');
    		getTop('p3');
    		getTop('p4');
    	});

    	let isSideNavOpen = true;
    	let y, totalH, totalW;

    	function getColor(pTop, which) {
    		let result = 0;
    		if (pStop[which]) return 1;

    		if (pTop > totalH / 2) {
    			result = Math.min(pTop / totalH, 0.5);
    		} else {
    			result = Math.min(1 - pTop / totalH, 1);
    		}

    		return result;
    	}

    	function getPos(pTop, which) {
    		let result = 0;
    		if (pStop[which]) return 0 + "%";

    		if (pTop > totalH / 2) {
    			result = Math.min(pTop / totalH * 100, pTop / totalH * 100) * -1;
    		} else {
    			result = Math.max(pTop / totalH * 100 - 20, 0) * -1;
    		}

    		if (result === 0) pStop[which] = true;
    		return result + '%';
    	}

    	let pStop = {
    		p1: false,
    		p2: false,
    		p3: false,
    		p4: false
    	};

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	function onwindowscroll() {
    		$$invalidate(0, y = window.pageYOffset);
    	}

    	function onwindowresize() {
    		$$invalidate(2, totalH = window.innerHeight);
    		$$invalidate(3, totalW = window.innerWidth);
    	}

    	function header_isSideNavOpen_binding(value) {
    		isSideNavOpen = value;
    		$$invalidate(1, isSideNavOpen);
    	}

    	function sidenav_isOpen_binding(value) {
    		isSideNavOpen = value;
    		$$invalidate(1, isSideNavOpen);
    	}

    	$$self.$capture_state = () => ({
    		onMount,
    		Header: Header$1,
    		HeaderNav: HeaderNav$1,
    		HeaderNavItem: HeaderNavItem$1,
    		Grid: Grid$1,
    		Row: Row$1,
    		Column: Column$1,
    		Tabs: Tabs$1,
    		Tab: Tab$1,
    		TabContent: TabContent$1,
    		Form: Form$1,
    		TextInput: TextInput$1,
    		FormGroup: FormGroup$1,
    		TextArea: TextArea$1,
    		Select: Select$1,
    		SelectItem: SelectItem$1,
    		Button: Button$1,
    		SideNav: SideNav$1,
    		SideNavItems: SideNavItems$1,
    		SideNavLink: SideNavLink$1,
    		Tooltip: Tooltip$1,
    		Steam,
    		Attr,
    		Stone: StoneBorder,
    		isSideNavOpen,
    		y,
    		totalH,
    		totalW,
    		getTop,
    		getColor,
    		getPos,
    		pStop,
    		p4Top,
    		p3Top,
    		p2Top,
    		p1Top
    	});

    	$$self.$inject_state = $$props => {
    		if ('isSideNavOpen' in $$props) $$invalidate(1, isSideNavOpen = $$props.isSideNavOpen);
    		if ('y' in $$props) $$invalidate(0, y = $$props.y);
    		if ('totalH' in $$props) $$invalidate(2, totalH = $$props.totalH);
    		if ('totalW' in $$props) $$invalidate(3, totalW = $$props.totalW);
    		if ('pStop' in $$props) pStop = $$props.pStop;
    		if ('p4Top' in $$props) $$invalidate(4, p4Top = $$props.p4Top);
    		if ('p3Top' in $$props) $$invalidate(5, p3Top = $$props.p3Top);
    		if ('p2Top' in $$props) $$invalidate(6, p2Top = $$props.p2Top);
    		if ('p1Top' in $$props) $$invalidate(7, p1Top = $$props.p1Top);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*y*/ 1) {
    			$$invalidate(7, p1Top = getTop('p1'));
    		}

    		if ($$self.$$.dirty & /*y*/ 1) {
    			$$invalidate(6, p2Top = getTop('p2'));
    		}

    		if ($$self.$$.dirty & /*y*/ 1) {
    			$$invalidate(5, p3Top = getTop('p3'));
    		}

    		if ($$self.$$.dirty & /*y*/ 1) {
    			$$invalidate(4, p4Top = getTop('p4'));
    		}
    	};

    	return [
    		y,
    		isSideNavOpen,
    		totalH,
    		totalW,
    		p4Top,
    		p3Top,
    		p2Top,
    		p1Top,
    		getColor,
    		getPos,
    		onwindowscroll,
    		onwindowresize,
    		header_isSideNavOpen_binding,
    		sidenav_isOpen_binding
    	];
    }

    class App extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance, create_fragment, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "App",
    			options,
    			id: create_fragment.name
    		});
    	}
    }

    const app = new App({
        target: document.body,
        props: {
            name: 'world'
        }
    });

    return app;

}());
//# sourceMappingURL=bundle.js.map
