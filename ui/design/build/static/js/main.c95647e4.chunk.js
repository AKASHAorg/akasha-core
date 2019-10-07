(window['webpackJsonp@akashaproject/design-system'] =
  window['webpackJsonp@akashaproject/design-system'] || []).push([
  [0],
  {
    20: function(n, e, t) {
      n.exports = t(42);
    },
    42: function(n, e, t) {
      'use strict';
      t.r(e);
      var r = t(0),
        o = t(2),
        c = t(1);
      function i(n) {
        var e = '';
        return n.margin
          ? (e = ''.concat(n.margin))
          : (n.top && (e += ''.concat(n.top, ' ')),
            n.left && (e += ''.concat(n.left, ' ')),
            n.bottom && (e += ''.concat(n.bottom, ' ')),
            n.right && (e += ''.concat(n.right)),
            e);
      }
      function a() {
        var n = Object(o.a)([
          '\n      background: ',
          '\n      margin: ',
          '\n      border-radius: ',
          '\n    ',
        ]);
        return (
          (a = function() {
            return n;
          }),
          n
        );
      }
      function u() {
        var n = Object(o.a)([
          '\n  ',
          '\n  overflow: hidden;\n  width: ',
          ';\n  img {\n    display: block;\n    width: 100%;\n    height: 100%;\n  }\n',
        ]);
        return (
          (u = function() {
            return n;
          }),
          n
        );
      }
      var d = c.default.div(
        u(),
        function(n) {
          var e = n.margin,
            t = n.backgroundColor,
            r = n.roundedCorners,
            o = e ? i(e) : '0px',
            u = r ? n.theme.shapes.borderRadius : '';
          return Object(c.css)(
            a(),
            function(n) {
              return t || n.theme.colors.white;
            },
            o,
            u,
          );
        },
        function(n) {
          return n.theme.spacing.components.avatar.sizes[n.size]
            ? n.theme.spacing.components.avatar.sizes[n.size]
            : '100%';
        },
      );
      d.defaultProps = { roundedCorners: !1 };
      var s = d,
        l = function(n) {
          var e = 'function' === typeof n.onClick;
          return r.createElement(
            s,
            {
              roundedCorners: n.roundedCorners,
              onClick: n.onClick,
              size: n.size,
              isClickable: e,
              margin: n.margin,
              backgroundColor: n.backgroundColor,
            },
            r.createElement('img', { src: n.src, alt: n.alt }),
          );
        };
      l.defaultProps = { size: 'xs', roundedCorners: !0 };
      var p = l;
      function f() {
        var n = Object(o.a)(['\n            width: 100%;\n          ']);
        return (
          (f = function() {
            return n;
          }),
          n
        );
      }
      function b() {
        var n = Object(o.a)([
          '\n            &:hover {\n              background-color: ',
          ';\n              border-color: ',
          ';\n              color: ',
          ';\n            }\n          ',
        ]);
        return (
          (b = function() {
            return n;
          }),
          n
        );
      }
      function h() {
        var n = Object(o.a)([
          '\n      background-color: ',
          ';\n      border-color: ',
          ';\n      color: ',
          ';\n      cursor: ',
          ';\n      margin: ',
          ';\n      ',
          '\n\n      ',
          '\n    ',
        ]);
        return (
          (h = function() {
            return n;
          }),
          n
        );
      }
      function g() {
        var n = Object(o.a)([
          '\n  ',
          ';\n\n  align-items: center;\n\n  border-radius: ',
          ';\n  border-style: solid;\n  border-width: ',
          ';\n\n  display: inline-flex;\n  font-size: ',
          ';\n  font-family: ',
          ';\n  font-weight: ',
          ';\n  justify-content: center;\n\n  padding: ',
          ';\n\n  user-select: none;\n',
        ]);
        return (
          (g = function() {
            return n;
          }),
          n
        );
      }
      var m = c.default.button(
        g(),
        function(n) {
          var e = n.theme.colors,
            t = n.buttonType,
            r = n.ghost,
            o = n.disabled,
            a = n.fullWidth,
            u = n.margin,
            d = n.backgroundColor,
            s = e.grey,
            l = e.darkGrey;
          switch (t) {
            case 'alert':
              (s = e.red), (l = e.darkRed);
              break;
            case 'primary':
              (s = e.blue), (l = e.darkBlue);
          }
          var p = '0px';
          return (
            u && (p = i(u)),
            d && (s = d),
            Object(c.css)(
              h(),
              r ? 'transparent' : s,
              s,
              r ? s : e.white,
              o ? 'not-allowed' : 'pointer',
              p,
              o
                ? 'opacity: '.concat(e.disabledOpacity)
                : Object(c.css)(b(), r ? 'transparent' : l, l, r ? l : e.white),
              a ? Object(c.css)(f()) : '',
            )
          );
        },
        function(n) {
          return n.theme.shapes.borderRadius;
        },
        function(n) {
          return n.theme.spacing.components.button.borderWidth;
        },
        function(n) {
          return n.small
            ? n.theme.spacing.components.button.fontSize.small
            : n.theme.spacing.components.button.fontSize.normal;
        },
        function(n) {
          return n.theme.shapes.fontFamily;
        },
        function(n) {
          return n.theme.shapes.fontWeight.regular;
        },
        function(n) {
          return n.small
            ? n.theme.spacing.components.button.padding.small
            : n.theme.spacing.components.button.padding.normal;
        },
      );
      m.defaultProps = { ghost: !1, disabled: !1, small: !1, fullWidth: !1 };
      var x = m,
        v = function() {};
      x.defaultProps = { buttonType: 'regular', ghost: !1, disabled: !1, small: !1, fullWidth: !1 };
      var y = function(n) {
          var e = n.buttonType,
            t = n.ghost,
            o = n.disabled,
            c = n.small,
            i = n.fullWidth,
            a = n.onClick,
            u = n.margin,
            d = n.backgroundColor;
          return r.createElement(
            x,
            {
              buttonType: e,
              ghost: t,
              disabled: o,
              small: c,
              fullWidth: i,
              onClick: o ? v : a,
              margin: u,
              backgroundColor: d,
            },
            n.children,
          );
        },
        k = t(5),
        O = t.n(k),
        j = t(4),
        w = t(6);
      function C(n, e) {
        var t = Object.keys(n);
        if (Object.getOwnPropertySymbols) {
          var r = Object.getOwnPropertySymbols(n);
          e &&
            (r = r.filter(function(e) {
              return Object.getOwnPropertyDescriptor(n, e).enumerable;
            })),
            t.push.apply(t, r);
        }
        return t;
      }
      function z(n) {
        for (var e = 1; e < arguments.length; e++) {
          var t = null != arguments[e] ? arguments[e] : {};
          e % 2
            ? C(t, !0).forEach(function(e) {
                Object(j.a)(n, e, t[e]);
              })
            : Object.getOwnPropertyDescriptors
            ? Object.defineProperties(n, Object.getOwnPropertyDescriptors(t))
            : C(t).forEach(function(e) {
                Object.defineProperty(n, e, Object.getOwnPropertyDescriptor(t, e));
              });
        }
        return n;
      }
      var E = r.createContext({
          tabs: [],
          prevActiveTab: { id: -1 },
          activeTab: { id: -1 },
          addTab: function(n) {},
          removeTab: function(n) {},
          onClick: function(n) {
            return function(n) {};
          },
        }),
        P = function(n) {
          var e = r.useState({ tabs: [], prevActiveTab: { id: -1 }, activeTab: n.activeTab }),
            t = Object(w.a)(e, 2),
            o = t[0],
            c = t[1];
          return r.createElement(
            E.Provider,
            {
              value: z({}, o, {
                addTab: function(n) {
                  if (
                    !(
                      o.tabs.findIndex(function(e) {
                        return e.id === n.id;
                      }) > -1
                    )
                  )
                    return c(function(e) {
                      return z({}, e, { tabs: e.tabs.concat(n) });
                    });
                },
                removeTab: function(n) {
                  c(function(e) {
                    return z({}, e, {
                      tabs: e.tabs.filter(function(e) {
                        return e.id !== n;
                      }),
                    });
                  });
                },
                onClick: function(n) {
                  return function(e) {
                    c(function(e) {
                      return { tabs: e.tabs, prevActiveTab: e.activeTab, activeTab: n };
                    });
                  };
                },
              }),
            },
            n.children,
          );
        },
        T = function(n) {
          var e = r.useContext(E),
            t = n.id,
            o = n.title,
            c = n.children;
          return (
            r.useEffect(
              function() {
                e.addTab({ id: t, title: o });
              },
              [t, o, e],
            ),
            e.activeTab.id === t ? c : r.createElement(r.Fragment, null)
          );
        };
      T.propTypes = {
        id: O.a.number.isRequired,
        title: O.a.string.isRequired,
        children: O.a.element.isRequired,
      };
      var F = T,
        S = t(12);
      function D() {
        var n = Object(o.a)([
          '\n  animation: ',
          ' 1.4s linear infinite;\n  width: ',
          'px;\n  height: ',
          'px;\n',
        ]);
        return (
          (D = function() {
            return n;
          }),
          n
        );
      }
      function B() {
        var n = Object(o.a)([
          '\n  stroke-dasharray: 187;\n  stroke-dashoffset: 0;\n  transform-origin: center;\n  stroke: ',
          ';\n  animation: ',
          ' 1.4s ease-in-out infinite;\n',
        ]);
        return (
          (B = function() {
            return n;
          }),
          n
        );
      }
      function W() {
        var n = Object(o.a)([
          '\n  0% {\n    stroke-dashoffset: 187;\n  }\n  50% {\n    stroke-dashoffset: ',
          ';\n    transform: rotate(135deg);\n  }\n  100% {\n    stroke-dashoffset: 187;\n    transform: rotate(450deg);\n  }\n',
        ]);
        return (
          (W = function() {
            return n;
          }),
          n
        );
      }
      function R() {
        var n = Object(o.a)([
          '\n  0% {\n    transform: rotate(0deg);\n  }\n  100% {\n    transform: rotate(270deg);\n  }\n',
        ]);
        return (
          (R = function() {
            return n;
          }),
          n
        );
      }
      function A() {
        var n = Object(o.a)([
          '\n  width: 100%;\n  display: flex;\n  min-height: ',
          'px;\n  justify-content: center;\n  padding: 10px 0 0 0;\n',
        ]);
        return (
          (A = function() {
            return n;
          }),
          n
        );
      }
      var G = c.default.div(A(), function(n) {
          return n.minHeight;
        }),
        H = Object(c.keyframes)(R()),
        I = Object(c.keyframes)(W(), 46.75),
        L = Object(c.default)(function(n) {
          var e = n.className;
          return r.createElement('circle', {
            className: e,
            fill: 'none',
            strokeWidth: '6',
            strokeLinecap: 'round',
            cx: '33',
            cy: '33',
            r: '30',
          });
        })(
          B(),
          function(n) {
            return n.theme.colors.border;
          },
          I,
        ),
        q = c.default.svg(
          D(),
          H,
          function(n) {
            return n.width;
          },
          function(n) {
            return n.width;
          },
        ),
        J = function(n) {
          var e = n.size,
            t = void 0 === e ? 50 : e;
          return r.createElement(
            G,
            { minHeight: t },
            r.createElement(
              q,
              { width: t, height: t, viewBox: '0 0 66 66' },
              r.createElement(L, null),
            ),
          );
        };
      function M() {
        var n = Object(o.a)(['\n  user-select: none;\n']);
        return (
          (M = function() {
            return n;
          }),
          n
        );
      }
      function N() {
        var n = Object(o.a)(['\n  background-color: ', ';\n  padding: 1em;\n  color: ', ';\n']);
        return (
          (N = function() {
            return n;
          }),
          n
        );
      }
      function K() {
        var n = Object(o.a)([
          '\n        transition: all 300ms cubic-bezier(0.4, 0, 0.2, 1);\n        cursor: default;\n        opacity: 1;\n        background-color: ',
          ';\n        color: ',
          ';\n      ',
        ]);
        return (
          (K = function() {
            return n;
          }),
          n
        );
      }
      function Q() {
        var n = Object(o.a)([
          '\n  display: inline-block;\n  transition: opacity 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;\n  padding: ',
          ';\n  cursor: pointer;\n  opacity: 0.8;\n  color: ',
          ';\n  border-top: 1px solid ',
          ';\n  border-right: 1px solid ',
          ';\n  border-bottom: ',
          ';\n  text-transform: uppercase;\n  margin-bottom: ',
          ';\n  &:hover {\n    opacity: 1;\n  }\n  ',
          '\n',
        ]);
        return (
          (Q = function() {
            return n;
          }),
          n
        );
      }
      function U() {
        var n = Object(o.a)([
          '\n  padding-left: 0;\n  list-style: none;\n  margin: 0;\n  padding-top: 2px;\n  background: ',
          ';\n  font-size: 0.875em;\n  display: flex;\n  flex-direction: row;\n  justify-content: ',
          ';\n  li:first-of-type,\n  li:last-child {\n    border-left: 0;\n  }\n',
        ]);
        return (
          (U = function() {
            return n;
          }),
          n
        );
      }
      function V() {
        var n = Object(o.a)(['']);
        return (
          (V = function() {
            return n;
          }),
          n
        );
      }
      function X() {
        var n = Object(o.a)(['\n  position: relative;\n']);
        return (
          (X = function() {
            return n;
          }),
          n
        );
      }
      var Y = c.default.div(X()),
        Z = c.default.div(V()),
        $ = c.default.ul(
          U(),
          function(n) {
            return n.theme.colors.darkBackground;
          },
          function(n) {
            return n.center ? 'center' : 'flex-start';
          },
        ),
        _ = c.default.li(
          Q(),
          function(n) {
            return n.theme.spacing.padding.tabs.titleItem;
          },
          function(n) {
            return n.theme.colors.darkGrey;
          },
          function(n) {
            return n.theme.colors.border;
          },
          function(n) {
            return n.theme.colors.border;
          },
          function(n) {
            return n.isActiveTab ? '0' : '1px solid '.concat(n.theme.colors.border);
          },
          function(n) {
            return n.isActiveTab ? '0' : '-1px';
          },
          function(n) {
            return (
              n.isActiveTab &&
              Object(c.css)(
                K(),
                function(n) {
                  return n.theme.colors.background;
                },
                function(n) {
                  return n.theme.colors.dark;
                },
              )
            );
          },
        ),
        nn = c.default.div(
          N(),
          function(n) {
            return n.theme.colors.background;
          },
          function(n) {
            return n.theme.colors.dark;
          },
        ),
        en = c.default.div(M()),
        tn = function(n) {
          var e = r.useState([]),
            t = Object(w.a)(e, 2),
            o = t[0],
            c = t[1],
            i = r.useState(),
            a = Object(w.a)(i, 2),
            u = a[0],
            d = a[1];
          r.useEffect(function() {
            'function' === typeof n.beforeChange &&
              u &&
              n.beforeChange(u).then(function() {
                'function' === typeof n.onChange && n.onChange(u), d(void 0);
              });
          });
          var s = function(e, t) {
            return function(r) {
              if ('function' === typeof n.beforeChange)
                return d(t), e.onClick(t)(r), void r.persist();
              'function' === typeof n.onChange && n.onChange(t), e.onClick(t)(r);
            };
          };
          return r.createElement(
            P,
            { activeTab: n.activeTab },
            r.createElement(E.Consumer, null, function(e) {
              return r.createElement(
                Y,
                null,
                r.createElement(
                  Z,
                  null,
                  r.createElement(
                    $,
                    { center: n.center },
                    e.tabs.map(function(n) {
                      return r.createElement(
                        _,
                        {
                          key: ''.concat(n.id),
                          onClick: s(e, n),
                          id: ''.concat(n.id),
                          isActiveTab: e.activeTab.id === n.id,
                          innerRef: function(e) {
                            o[n.id] ||
                              c(function(t) {
                                return [].concat(
                                  Object(S.a)(t.slice(0, n.id)),
                                  [e],
                                  Object(S.a)(t.slice(n.id)),
                                );
                              });
                          },
                        },
                        r.createElement(en, null, n.title),
                      );
                    }),
                  ),
                ),
                r.createElement(
                  nn,
                  null,
                  !u && n.children,
                  u && u.id === e.activeTab.id && n.spinnerComponent,
                ),
              );
            }),
          );
        };
      tn.defaultProps = { spinnerComponent: r.createElement(J, null) };
      var rn = tn,
        on = {
          disabledOpacity: '0.5',
          dark: '#2E3747',
          darkGrey: '#778390',
          grey: '#B4BCC8',
          lightGrey: '#D8DCDF',
          darkBackground: '#EFEFF1',
          border: '#EEEEEE',
          background: '#F8F8F8',
          blue: '#0598FF',
          darkBlue: '#0588E6',
          red: '#F96A6A',
          darkRed: '#E66363',
          green: '#7ACC80',
          yellow: '#FFC02F',
          white: '#FFF',
        },
        cn = {
          borderRadius: '3px',
          fontFamily: 'Content-font, Roboto, sans-serif',
          fontWeight: { regular: 500, bold: 600 },
          shadow0: '0px 1px 4px 0px',
          shadow1: '0px 1px 4px 0px',
          shadow2: '0px 1px 4px 0px',
          shadow3: '0px 1px 4px 0px',
        },
        an = {
          fontSize: '14px',
          lineHeight: '21px',
          components: {
            avatar: { sizes: { xs: '24px', sm: '32px', md: '40px', lg: '48px' } },
            button: {
              padding: { normal: '7px 10px', small: '2px 8px' },
              borderWidth: '2px',
              fontSize: { normal: '16px', small: '14px' },
            },
            checkbox: { borderWidth: '1px', gap: '8px', size: '18px', checkedIconSize: '18px' },
            input: { padding: '8px', fontSize: '16px', iconPadding: '8px', borderSize: '1px' },
            radiobutton: { borderWidth: '1px', gap: '8px', size: '18px' },
            list: { rowPadding: '8px', iconGap: '4px' },
            popover: {
              borderWidth: '1px',
              width: '300px',
              searchPopover: {
                padding: '4px',
                maxHeight: '100px',
                iconSize: '18px',
                iconGap: '8px',
              },
              actionPopover: { padding: '16px', buttonGap: '8px' },
            },
            modal: { padding: '16px', headerGap: '8px', buttonGap: '8px', maxWidth: '380px' },
          },
          padding: {
            base: ''.concat(4, 'px'),
            tabs: { titleItem: ''.concat(12, 'px ').concat(24, 'px') },
            modal: { header: '16px 24px', body: '24px', footer: '10px 16px' },
          },
          margin: { base: '4px', list: { form: '0 12px' }, modal: { footer: '10px' } },
          defaultMargin: '8px',
          borderWidth: {
            base: '1px',
            textInput: { middleRow: '1px', suggestions: '1px' },
            modal: '1px',
          },
          sizes: {
            text: { base: '12px' },
            list: {
              text: '13px',
              searchHeight: '36px',
              iconWidth: '12px',
              iconHeight: '12px',
              buttonHeight: '30px',
            },
            modal: {
              headerText: '20px',
              headerLineHeight: '22px',
              bodyText: '14px',
              bodyLineHeight: '1.5',
              closeButtonTop: '15px',
              closeButtonRight: '15px',
              closeButtonLineHeight: '1',
            },
          },
        },
        un = t(3),
        dn = t(47),
        sn = function(n) {
          return {
            checkBox: {
              border: {
                color: 'light-6',
                width: n.spacing.components.checkbox.borderWidth,
                radius: n.shapes.borderRadius,
              },
              check: {
                extend: function(n) {
                  var e = 'light-1';
                  return (
                    n.checked && (e = 'neutral-3'),
                    n.disabled && (e = 'light-2'),
                    'background-color: '.concat(Object(un.normalizeColor)(e, n.theme), ';')
                  );
                },
              },
              color: 'light-1',
              gap: n.spacing.components.checkbox.gap,
              hover: { border: { color: 'neutral-3' } },
              icon: { size: n.spacing.components.checkbox.checkedIconSize },
              icons: { checked: dn.a },
              size: n.spacing.components.checkbox.size,
              extend: function(n) {
                var e = n.checked && !n.disabled ? 'dark-1' : 'dark-3';
                return '\n        opacity: 1;\n        color: '
                  .concat(
                    Object(un.normalizeColor)(e, n.theme),
                    ';\n        input[type=checkbox]:disabled + div {\n          border-color: ',
                  )
                  .concat(
                    Object(un.normalizeColor)('light-6', n.theme),
                    ';\n        }\n        input[type=checkbox]:checked:not([disabled]) + div {\n          border-color: ',
                  )
                  .concat(
                    Object(un.normalizeColor)('neutral-3', n.theme),
                    ';\n        }\n        input[type=checkbox]:checked:disabled + div > svg {\n          stroke: ',
                  )
                  .concat(Object(un.normalizeColor)('light-6', n.theme), ';\n        }\n      ');
              },
            },
          };
        },
        ln = function(n) {
          return {
            icon: {
              extend: function() {
                return '\n    & * {\n        stroke: '.concat(
                  n.colors.background,
                  ' !important;\n      }\n    ',
                );
              },
            },
          };
        },
        pn = function(n) {
          return {
            radioButton: {
              border: { color: 'light-6', width: n.spacing.components.radiobutton.borderWidth },
              check: { color: 'neutral-3' },
              color: 'neutral-3',
              gap: n.spacing.components.radiobutton.gap,
              hover: { border: { color: 'neutral-3' } },
              size: n.spacing.components.radiobutton.size,
              extend: function(n) {
                return '\n        opacity: 1;\n        color: '
                  .concat(
                    Object(un.normalizeColor)('dark-3', n.theme),
                    ';\n\n        input[type=radio]:disabled + div {\n          border-color: ',
                  )
                  .concat(
                    Object(un.normalizeColor)('light-6', n.theme),
                    ';\n        }\n        input[type=radio]:disabled + div > svg > circle {\n          fill: ',
                  )
                  .concat(
                    Object(un.normalizeColor)('light-6', n.theme),
                    ';\n        }\n\n        &:has(input[type=radio]:checked) > span {\n          color: ',
                  )
                  .concat(Object(un.normalizeColor)('dark-1', n.theme), ';\n        }\n      ');
              },
            },
          };
        },
        fn = function(n) {
          return {
            textInput: {
              extend: function() {
                return '\n      border: '
                  .concat(n.spacing.components.input.borderSize, ' solid ')
                  .concat(function(n) {
                    return Object(un.normalizeColor)('light-6', n.theme);
                  }, ';\n      opacity: 1;\n      font-size: ')
                  .concat(
                    n.spacing.components.input.fontSize,
                    ';\n      width: 100%;\n      padding: ',
                  )
                  .concat(n.spacing.components.input.padding, ';\n    ');
              },
              container: {
                extend: function() {
                  return '\n      ';
                },
              },
              placeholder: {
                extend: function() {
                  return '\n        width: 100%;\n        color: '.concat(
                    n.colors.grey,
                    ';\n      ',
                  );
                },
              },
              focus: { border: { color: 'neutral-3' } },
            },
          };
        };
      function bn(n, e) {
        var t = Object.keys(n);
        if (Object.getOwnPropertySymbols) {
          var r = Object.getOwnPropertySymbols(n);
          e &&
            (r = r.filter(function(e) {
              return Object.getOwnPropertyDescriptor(n, e).enumerable;
            })),
            t.push.apply(t, r);
        }
        return t;
      }
      var hn = function(n) {
        return Object(un.deepMerge)(
          n,
          (function(n) {
            for (var e = 1; e < arguments.length; e++) {
              var t = null != arguments[e] ? arguments[e] : {};
              e % 2
                ? bn(t, !0).forEach(function(e) {
                    Object(j.a)(n, e, t[e]);
                  })
                : Object.getOwnPropertyDescriptors
                ? Object.defineProperties(n, Object.getOwnPropertyDescriptors(t))
                : bn(t).forEach(function(e) {
                    Object.defineProperty(n, e, Object.getOwnPropertyDescriptor(t, e));
                  });
            }
            return n;
          })(
            {
              global: {
                input: { weight: 400 },
                font: { family: n.shapes.fontFamily, size: n.spacing.fontSize },
                colors: {
                  border: 'light-6',
                  'light-1': n.colors.white,
                  'light-2': n.colors.background,
                  'light-6': n.colors.lightGrey,
                  'dark-1': n.colors.dark,
                  'dark-2': n.colors.darkGrey,
                  'dark-3': n.colors.grey,
                  'accent-2': n.colors.border,
                  'neutral-1': n.colors.green,
                  'neutral-3': n.colors.blue,
                  control: { light: n.colors.border, dark: n.colors.border },
                  text: { light: n.colors.dark, dark: n.colors.dark },
                },
                control: { border: { radius: n.shapes.borderRadius } },
                focus: { border: { color: 'neutral-3' } },
              },
              text: { medium: { size: '13px', height: '26px' } },
              select: { control: { extend: 'padding: 3px 6px;' } },
              grommet: {
                extend: function() {
                  return '\n        color: '.concat(n.colors.dark, '\n      ');
                },
              },
            },
            fn(n),
            {},
            sn(n),
            {},
            pn(n),
            {},
            ln(n),
          ),
        );
      };
      function gn(n, e) {
        var t = Object.keys(n);
        if (Object.getOwnPropertySymbols) {
          var r = Object.getOwnPropertySymbols(n);
          e &&
            (r = r.filter(function(e) {
              return Object.getOwnPropertyDescriptor(n, e).enumerable;
            })),
            t.push.apply(t, r);
        }
        return t;
      }
      function mn(n) {
        var e = (function(n) {
          for (var e = 1; e < arguments.length; e++) {
            var t = null != arguments[e] ? arguments[e] : {};
            e % 2
              ? gn(t, !0).forEach(function(e) {
                  Object(j.a)(n, e, t[e]);
                })
              : Object.getOwnPropertyDescriptors
              ? Object.defineProperties(n, Object.getOwnPropertyDescriptors(t))
              : gn(t).forEach(function(e) {
                  Object.defineProperty(n, e, Object.getOwnPropertyDescriptor(t, e));
                });
          }
          return n;
        })({ colors: on, spacing: an, shapes: cn }, n);
        return hn(e);
      }
      function xn(n, e) {
        var t = Object.keys(n);
        if (Object.getOwnPropertySymbols) {
          var r = Object.getOwnPropertySymbols(n);
          e &&
            (r = r.filter(function(e) {
              return Object.getOwnPropertyDescriptor(n, e).enumerable;
            })),
            t.push.apply(t, r);
        }
        return t;
      }
      var vn = mn({
          colors: (function(n) {
            for (var e = 1; e < arguments.length; e++) {
              var t = null != arguments[e] ? arguments[e] : {};
              e % 2
                ? xn(t, !0).forEach(function(e) {
                    Object(j.a)(n, e, t[e]);
                  })
                : Object.getOwnPropertyDescriptors
                ? Object.defineProperties(n, Object.getOwnPropertyDescriptors(t))
                : xn(t).forEach(function(e) {
                    Object.defineProperty(n, e, Object.getOwnPropertyDescriptor(t, e));
                  });
            }
            return n;
          })(
            {},
            {
              disabledOpacity: '0.5',
              dark: '#0E1012',
              darkGrey: '#131517',
              grey: '#181C1F',
              lightGrey: '#272B2E',
              darkBackground: '#4B555E',
              border: '#8B8F94',
              background: '#F8F8F8',
              blue: '#0598FF',
              darkBlue: '#0588E6',
              red: '#F96A6A',
              darkRed: '#E66363',
              green: '#7ACC80',
              yellow: '#FFC02F',
              white: '#FFF',
            },
          ),
          name: 'Dark-Theme',
          dark: !0,
        }),
        yn = mn({ name: 'Light-Theme' });
      t.d(e, 'Avatar', function() {
        return p;
      }),
        t.d(e, 'Button', function() {
          return y;
        }),
        t.d(e, 'Tabs', function() {
          return rn;
        }),
        t.d(e, 'Tab', function() {
          return F;
        }),
        t.d(e, 'lightTheme', function() {
          return yn;
        }),
        t.d(e, 'darkTheme', function() {
          return vn;
        }),
        t.d(e, 'createTheme', function() {
          return mn;
        });
    },
  },
  [[20, 1, 2]],
]);
//# sourceMappingURL=main.c95647e4.chunk.js.map
