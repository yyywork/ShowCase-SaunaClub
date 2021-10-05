
(function(l, r) { if (!l || l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (self.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(self.document);
System.register(['./App.svelte.js'], function (exports) {
    'use strict';
    var App;
    return {
        setters: [function (module) {
            App = module.default;
        }],
        execute: function () {

            const app = exports('default', new App({
                target: document.body,
                props: {
                    name: 'world'
                }
            }));

        }
    };
});
//# sourceMappingURL=main.js.map
