(window.webpackJsonp = window.webpackJsonp || []).push([
  [0],
  [
    ,
    ,
    ,
    ,
    ,
    function(e, t, n) {
      'use strict';
      var r =
        (this && this.__importStar) ||
        function(e) {
          if (e && e.__esModule) return e;
          var t = {};
          if (null != e) for (var n in e) Object.hasOwnProperty.call(e, n) && (t[n] = e[n]);
          return (t.default = e), t;
        };
      Object.defineProperty(t, '__esModule', { value: !0 });
      var a, i;
      t.default = {
        activeWhen:
          ((a = '/events'),
          function(e) {
            return i && i.exact ? e.pathname === a : e.pathname.startsWith(''.concat(a));
          }),
        loadingFn: function() {
          return Promise.resolve().then(function() {
            return r(n(9));
          });
        },
        name: 'ui-plugin-events',
        services: []
      };
    },
    function(e, t, n) {
      'use strict';
      var r = n(3),
        a = n(4),
        i =
          (this && this.__importStar) ||
          function(e) {
            if (e && e.__esModule) return e;
            var t = {};
            if (null != e) for (var n in e) Object.hasOwnProperty.call(e, n) && (t[n] = e[n]);
            return (t.default = e), t;
          };
      Object.defineProperty(t, '__esModule', { value: !0 });
      var o = i(n(23)),
        u = (function() {
          function e(t) {
            r(this, e), (this.config = t), (this.plugins = []);
          }
          return (
            a(e, [
              {
                key: 'registerPlugin',
                value: function(e, t) {
                  if ((this.plugins.push(e), !this._validatePlugin(e)))
                    throw new Error(
                      '[@akashaproject/ui-plugin-loader]: Plugin '.concat(e.name, ' is not valid')
                    );
                  var n = e.name.toLowerCase().replace(' ', '-'),
                    r = document.getElementById(''.concat(n)),
                    a = document.getElementById('root');
                  !r && a && (((r = document.createElement('div')).id = n), a.appendChild(r)),
                    o.registerApplication(
                      e.name,
                      e.loadingFn,
                      e.activeWhen,
                      Object.assign({}, this.config, t, { domElement: r })
                    ),
                    console.info(
                      '[@akashaproject/ui-plugin-loader]: '.concat(e.name, ' registered!')
                    );
                }
              },
              {
                key: 'start',
                value: function() {
                  console.info('[@akashaproject/ui-plugin-loader]: starting single spa'), o.start();
                }
              },
              {
                key: '_validatePlugin',
                value: function(e) {
                  return Array.isArray(e.services), !0;
                }
              }
            ]),
            e
          );
        })();
      t.default = u;
    },
    function(e, t, n) {
      e.exports = n(8);
    },
    function(e, t, n) {
      'use strict';
      n.r(t);
      var r = n(5),
        a = n.n(r),
        i = n(6),
        o = new (n.n(i)).a({});
      o.registerPlugin(a.a), o.start();
    },
    function(e, t, n) {
      'use strict';
      var r =
        (this && this.__importDefault) ||
        function(e) {
          return e && e.__esModule ? e : { default: e };
        };
      Object.defineProperty(t, '__esModule', { value: !0 });
      var a = r(n(0)),
        i = r(n(11)),
        o = r(n(15)),
        u = r(n(16)),
        s = o.default({ React: a.default, ReactDOM: i.default, rootComponent: u.default });
      (t.bootstrap = s.bootstrap), (t.mount = s.mount), (t.unmount = s.unmount);
    },
    ,
    ,
    ,
    ,
    ,
    ,
    function(e, t, n) {
      'use strict';
      var r = n(3),
        a = n(4),
        i = n(17),
        o = n(20),
        u = n(21),
        s =
          (this && this.__importDefault) ||
          function(e) {
            return e && e.__esModule ? e : { default: e };
          };
      Object.defineProperty(t, '__esModule', { value: !0 });
      var l = n(0),
        c = s(n(0)),
        d = (function(e) {
          function t(e) {
            var n;
            return r(this, t), ((n = i(this, o(t).call(this, e))).state = { hasErrors: !1 }), n;
          }
          return (
            u(t, e),
            a(t, [
              {
                key: 'componentDidCatch',
                value: function(e, t) {
                  this.setState({ hasErrors: !0 }), console.error(e, t);
                }
              },
              {
                key: 'render',
                value: function() {
                  return this.state.hasErrors
                    ? c.default.createElement(
                        'div',
                        null,
                        'Oh no, something went wrong in ',
                        'events-app'
                      )
                    : c.default.createElement('div', null, 'Events plugin loaded!');
                }
              }
            ]),
            t
          );
        })(l.Component);
      t.default = d;
    }
  ],
  [[7, 1, 2]]
]);
//# sourceMappingURL=main.1dc6aba1.chunk.js.map
