function _mergeNamespaces(n2, m2) {
  for (var i = 0; i < m2.length; i++) {
    const e = m2[i];
    if (typeof e !== "string" && !Array.isArray(e)) {
      for (const k2 in e) {
        if (k2 !== "default" && !(k2 in n2)) {
          const d = Object.getOwnPropertyDescriptor(e, k2);
          if (d) {
            Object.defineProperty(n2, k2, d.get ? d : {
              enumerable: true,
              get: () => e[k2]
            });
          }
        }
      }
    }
  }
  return Object.freeze(Object.defineProperty(n2, Symbol.toStringTag, { value: "Module" }));
}
function getDefaultExportFromCjs(x2) {
  return x2 && x2.__esModule && Object.prototype.hasOwnProperty.call(x2, "default") ? x2["default"] : x2;
}
var jsxRuntime = { exports: {} };
var reactJsxRuntime_production_min = {};
var react = { exports: {} };
var react_production_min = {};
/**
 * @license React
 * react.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var l$1 = Symbol.for("react.element"), n$1 = Symbol.for("react.portal"), p$2 = Symbol.for("react.fragment"), q$1 = Symbol.for("react.strict_mode"), r = Symbol.for("react.profiler"), t = Symbol.for("react.provider"), u = Symbol.for("react.context"), v$1 = Symbol.for("react.forward_ref"), w = Symbol.for("react.suspense"), x = Symbol.for("react.memo"), y = Symbol.for("react.lazy"), z$1 = Symbol.iterator;
function A$1(a) {
  if (null === a || "object" !== typeof a) return null;
  a = z$1 && a[z$1] || a["@@iterator"];
  return "function" === typeof a ? a : null;
}
var B$1 = { isMounted: function() {
  return false;
}, enqueueForceUpdate: function() {
}, enqueueReplaceState: function() {
}, enqueueSetState: function() {
} }, C$1 = Object.assign, D$1 = {};
function E$1(a, b, e) {
  this.props = a;
  this.context = b;
  this.refs = D$1;
  this.updater = e || B$1;
}
E$1.prototype.isReactComponent = {};
E$1.prototype.setState = function(a, b) {
  if ("object" !== typeof a && "function" !== typeof a && null != a) throw Error("setState(...): takes an object of state variables to update or a function which returns an object of state variables.");
  this.updater.enqueueSetState(this, a, b, "setState");
};
E$1.prototype.forceUpdate = function(a) {
  this.updater.enqueueForceUpdate(this, a, "forceUpdate");
};
function F() {
}
F.prototype = E$1.prototype;
function G$1(a, b, e) {
  this.props = a;
  this.context = b;
  this.refs = D$1;
  this.updater = e || B$1;
}
var H$1 = G$1.prototype = new F();
H$1.constructor = G$1;
C$1(H$1, E$1.prototype);
H$1.isPureReactComponent = true;
var I$1 = Array.isArray, J = Object.prototype.hasOwnProperty, K$1 = { current: null }, L$1 = { key: true, ref: true, __self: true, __source: true };
function M$1(a, b, e) {
  var d, c = {}, k2 = null, h = null;
  if (null != b) for (d in void 0 !== b.ref && (h = b.ref), void 0 !== b.key && (k2 = "" + b.key), b) J.call(b, d) && !L$1.hasOwnProperty(d) && (c[d] = b[d]);
  var g = arguments.length - 2;
  if (1 === g) c.children = e;
  else if (1 < g) {
    for (var f2 = Array(g), m2 = 0; m2 < g; m2++) f2[m2] = arguments[m2 + 2];
    c.children = f2;
  }
  if (a && a.defaultProps) for (d in g = a.defaultProps, g) void 0 === c[d] && (c[d] = g[d]);
  return { $$typeof: l$1, type: a, key: k2, ref: h, props: c, _owner: K$1.current };
}
function N$1(a, b) {
  return { $$typeof: l$1, type: a.type, key: b, ref: a.ref, props: a.props, _owner: a._owner };
}
function O$1(a) {
  return "object" === typeof a && null !== a && a.$$typeof === l$1;
}
function escape(a) {
  var b = { "=": "=0", ":": "=2" };
  return "$" + a.replace(/[=:]/g, function(a2) {
    return b[a2];
  });
}
var P$1 = /\/+/g;
function Q$1(a, b) {
  return "object" === typeof a && null !== a && null != a.key ? escape("" + a.key) : b.toString(36);
}
function R$1(a, b, e, d, c) {
  var k2 = typeof a;
  if ("undefined" === k2 || "boolean" === k2) a = null;
  var h = false;
  if (null === a) h = true;
  else switch (k2) {
    case "string":
    case "number":
      h = true;
      break;
    case "object":
      switch (a.$$typeof) {
        case l$1:
        case n$1:
          h = true;
      }
  }
  if (h) return h = a, c = c(h), a = "" === d ? "." + Q$1(h, 0) : d, I$1(c) ? (e = "", null != a && (e = a.replace(P$1, "$&/") + "/"), R$1(c, b, e, "", function(a2) {
    return a2;
  })) : null != c && (O$1(c) && (c = N$1(c, e + (!c.key || h && h.key === c.key ? "" : ("" + c.key).replace(P$1, "$&/") + "/") + a)), b.push(c)), 1;
  h = 0;
  d = "" === d ? "." : d + ":";
  if (I$1(a)) for (var g = 0; g < a.length; g++) {
    k2 = a[g];
    var f2 = d + Q$1(k2, g);
    h += R$1(k2, b, e, f2, c);
  }
  else if (f2 = A$1(a), "function" === typeof f2) for (a = f2.call(a), g = 0; !(k2 = a.next()).done; ) k2 = k2.value, f2 = d + Q$1(k2, g++), h += R$1(k2, b, e, f2, c);
  else if ("object" === k2) throw b = String(a), Error("Objects are not valid as a React child (found: " + ("[object Object]" === b ? "object with keys {" + Object.keys(a).join(", ") + "}" : b) + "). If you meant to render a collection of children, use an array instead.");
  return h;
}
function S$1(a, b, e) {
  if (null == a) return a;
  var d = [], c = 0;
  R$1(a, d, "", "", function(a2) {
    return b.call(e, a2, c++);
  });
  return d;
}
function T$1(a) {
  if (-1 === a._status) {
    var b = a._result;
    b = b();
    b.then(function(b2) {
      if (0 === a._status || -1 === a._status) a._status = 1, a._result = b2;
    }, function(b2) {
      if (0 === a._status || -1 === a._status) a._status = 2, a._result = b2;
    });
    -1 === a._status && (a._status = 0, a._result = b);
  }
  if (1 === a._status) return a._result.default;
  throw a._result;
}
var U$1 = { current: null }, V$1 = { transition: null }, W$1 = { ReactCurrentDispatcher: U$1, ReactCurrentBatchConfig: V$1, ReactCurrentOwner: K$1 };
function X$1() {
  throw Error("act(...) is not supported in production builds of React.");
}
react_production_min.Children = { map: S$1, forEach: function(a, b, e) {
  S$1(a, function() {
    b.apply(this, arguments);
  }, e);
}, count: function(a) {
  var b = 0;
  S$1(a, function() {
    b++;
  });
  return b;
}, toArray: function(a) {
  return S$1(a, function(a2) {
    return a2;
  }) || [];
}, only: function(a) {
  if (!O$1(a)) throw Error("React.Children.only expected to receive a single React element child.");
  return a;
} };
react_production_min.Component = E$1;
react_production_min.Fragment = p$2;
react_production_min.Profiler = r;
react_production_min.PureComponent = G$1;
react_production_min.StrictMode = q$1;
react_production_min.Suspense = w;
react_production_min.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED = W$1;
react_production_min.act = X$1;
react_production_min.cloneElement = function(a, b, e) {
  if (null === a || void 0 === a) throw Error("React.cloneElement(...): The argument must be a React element, but you passed " + a + ".");
  var d = C$1({}, a.props), c = a.key, k2 = a.ref, h = a._owner;
  if (null != b) {
    void 0 !== b.ref && (k2 = b.ref, h = K$1.current);
    void 0 !== b.key && (c = "" + b.key);
    if (a.type && a.type.defaultProps) var g = a.type.defaultProps;
    for (f2 in b) J.call(b, f2) && !L$1.hasOwnProperty(f2) && (d[f2] = void 0 === b[f2] && void 0 !== g ? g[f2] : b[f2]);
  }
  var f2 = arguments.length - 2;
  if (1 === f2) d.children = e;
  else if (1 < f2) {
    g = Array(f2);
    for (var m2 = 0; m2 < f2; m2++) g[m2] = arguments[m2 + 2];
    d.children = g;
  }
  return { $$typeof: l$1, type: a.type, key: c, ref: k2, props: d, _owner: h };
};
react_production_min.createContext = function(a) {
  a = { $$typeof: u, _currentValue: a, _currentValue2: a, _threadCount: 0, Provider: null, Consumer: null, _defaultValue: null, _globalName: null };
  a.Provider = { $$typeof: t, _context: a };
  return a.Consumer = a;
};
react_production_min.createElement = M$1;
react_production_min.createFactory = function(a) {
  var b = M$1.bind(null, a);
  b.type = a;
  return b;
};
react_production_min.createRef = function() {
  return { current: null };
};
react_production_min.forwardRef = function(a) {
  return { $$typeof: v$1, render: a };
};
react_production_min.isValidElement = O$1;
react_production_min.lazy = function(a) {
  return { $$typeof: y, _payload: { _status: -1, _result: a }, _init: T$1 };
};
react_production_min.memo = function(a, b) {
  return { $$typeof: x, type: a, compare: void 0 === b ? null : b };
};
react_production_min.startTransition = function(a) {
  var b = V$1.transition;
  V$1.transition = {};
  try {
    a();
  } finally {
    V$1.transition = b;
  }
};
react_production_min.unstable_act = X$1;
react_production_min.useCallback = function(a, b) {
  return U$1.current.useCallback(a, b);
};
react_production_min.useContext = function(a) {
  return U$1.current.useContext(a);
};
react_production_min.useDebugValue = function() {
};
react_production_min.useDeferredValue = function(a) {
  return U$1.current.useDeferredValue(a);
};
react_production_min.useEffect = function(a, b) {
  return U$1.current.useEffect(a, b);
};
react_production_min.useId = function() {
  return U$1.current.useId();
};
react_production_min.useImperativeHandle = function(a, b, e) {
  return U$1.current.useImperativeHandle(a, b, e);
};
react_production_min.useInsertionEffect = function(a, b) {
  return U$1.current.useInsertionEffect(a, b);
};
react_production_min.useLayoutEffect = function(a, b) {
  return U$1.current.useLayoutEffect(a, b);
};
react_production_min.useMemo = function(a, b) {
  return U$1.current.useMemo(a, b);
};
react_production_min.useReducer = function(a, b, e) {
  return U$1.current.useReducer(a, b, e);
};
react_production_min.useRef = function(a) {
  return U$1.current.useRef(a);
};
react_production_min.useState = function(a) {
  return U$1.current.useState(a);
};
react_production_min.useSyncExternalStore = function(a, b, e) {
  return U$1.current.useSyncExternalStore(a, b, e);
};
react_production_min.useTransition = function() {
  return U$1.current.useTransition();
};
react_production_min.version = "18.3.1";
{
  react.exports = react_production_min;
}
var reactExports = react.exports;
const React = /* @__PURE__ */ getDefaultExportFromCjs(reactExports);
const React$1 = /* @__PURE__ */ _mergeNamespaces({
  __proto__: null,
  default: React
}, [reactExports]);
/**
 * @license React
 * react-jsx-runtime.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var f = reactExports, k = Symbol.for("react.element"), l = Symbol.for("react.fragment"), m$1 = Object.prototype.hasOwnProperty, n = f.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner, p$1 = { key: true, ref: true, __self: true, __source: true };
function q(c, a, g) {
  var b, d = {}, e = null, h = null;
  void 0 !== g && (e = "" + g);
  void 0 !== a.key && (e = "" + a.key);
  void 0 !== a.ref && (h = a.ref);
  for (b in a) m$1.call(a, b) && !p$1.hasOwnProperty(b) && (d[b] = a[b]);
  if (c && c.defaultProps) for (b in a = c.defaultProps, a) void 0 === d[b] && (d[b] = a[b]);
  return { $$typeof: k, type: c, key: e, ref: h, props: d, _owner: n.current };
}
reactJsxRuntime_production_min.Fragment = l;
reactJsxRuntime_production_min.jsx = q;
reactJsxRuntime_production_min.jsxs = q;
{
  jsxRuntime.exports = reactJsxRuntime_production_min;
}
var jsxRuntimeExports = jsxRuntime.exports;
var client = {};
var reactDom = { exports: {} };
var reactDom_production_min = {};
var scheduler = { exports: {} };
var scheduler_production_min = {};
/**
 * @license React
 * scheduler.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
(function(exports) {
  function f2(a, b) {
    var c = a.length;
    a.push(b);
    a: for (; 0 < c; ) {
      var d = c - 1 >>> 1, e = a[d];
      if (0 < g(e, b)) a[d] = b, a[c] = e, c = d;
      else break a;
    }
  }
  function h(a) {
    return 0 === a.length ? null : a[0];
  }
  function k2(a) {
    if (0 === a.length) return null;
    var b = a[0], c = a.pop();
    if (c !== b) {
      a[0] = c;
      a: for (var d = 0, e = a.length, w2 = e >>> 1; d < w2; ) {
        var m2 = 2 * (d + 1) - 1, C2 = a[m2], n2 = m2 + 1, x2 = a[n2];
        if (0 > g(C2, c)) n2 < e && 0 > g(x2, C2) ? (a[d] = x2, a[n2] = c, d = n2) : (a[d] = C2, a[m2] = c, d = m2);
        else if (n2 < e && 0 > g(x2, c)) a[d] = x2, a[n2] = c, d = n2;
        else break a;
      }
    }
    return b;
  }
  function g(a, b) {
    var c = a.sortIndex - b.sortIndex;
    return 0 !== c ? c : a.id - b.id;
  }
  if ("object" === typeof performance && "function" === typeof performance.now) {
    var l2 = performance;
    exports.unstable_now = function() {
      return l2.now();
    };
  } else {
    var p2 = Date, q2 = p2.now();
    exports.unstable_now = function() {
      return p2.now() - q2;
    };
  }
  var r2 = [], t2 = [], u2 = 1, v2 = null, y2 = 3, z2 = false, A2 = false, B2 = false, D2 = "function" === typeof setTimeout ? setTimeout : null, E2 = "function" === typeof clearTimeout ? clearTimeout : null, F2 = "undefined" !== typeof setImmediate ? setImmediate : null;
  "undefined" !== typeof navigator && void 0 !== navigator.scheduling && void 0 !== navigator.scheduling.isInputPending && navigator.scheduling.isInputPending.bind(navigator.scheduling);
  function G2(a) {
    for (var b = h(t2); null !== b; ) {
      if (null === b.callback) k2(t2);
      else if (b.startTime <= a) k2(t2), b.sortIndex = b.expirationTime, f2(r2, b);
      else break;
      b = h(t2);
    }
  }
  function H2(a) {
    B2 = false;
    G2(a);
    if (!A2) if (null !== h(r2)) A2 = true, I2(J2);
    else {
      var b = h(t2);
      null !== b && K2(H2, b.startTime - a);
    }
  }
  function J2(a, b) {
    A2 = false;
    B2 && (B2 = false, E2(L2), L2 = -1);
    z2 = true;
    var c = y2;
    try {
      G2(b);
      for (v2 = h(r2); null !== v2 && (!(v2.expirationTime > b) || a && !M2()); ) {
        var d = v2.callback;
        if ("function" === typeof d) {
          v2.callback = null;
          y2 = v2.priorityLevel;
          var e = d(v2.expirationTime <= b);
          b = exports.unstable_now();
          "function" === typeof e ? v2.callback = e : v2 === h(r2) && k2(r2);
          G2(b);
        } else k2(r2);
        v2 = h(r2);
      }
      if (null !== v2) var w2 = true;
      else {
        var m2 = h(t2);
        null !== m2 && K2(H2, m2.startTime - b);
        w2 = false;
      }
      return w2;
    } finally {
      v2 = null, y2 = c, z2 = false;
    }
  }
  var N2 = false, O2 = null, L2 = -1, P2 = 5, Q2 = -1;
  function M2() {
    return exports.unstable_now() - Q2 < P2 ? false : true;
  }
  function R2() {
    if (null !== O2) {
      var a = exports.unstable_now();
      Q2 = a;
      var b = true;
      try {
        b = O2(true, a);
      } finally {
        b ? S2() : (N2 = false, O2 = null);
      }
    } else N2 = false;
  }
  var S2;
  if ("function" === typeof F2) S2 = function() {
    F2(R2);
  };
  else if ("undefined" !== typeof MessageChannel) {
    var T2 = new MessageChannel(), U2 = T2.port2;
    T2.port1.onmessage = R2;
    S2 = function() {
      U2.postMessage(null);
    };
  } else S2 = function() {
    D2(R2, 0);
  };
  function I2(a) {
    O2 = a;
    N2 || (N2 = true, S2());
  }
  function K2(a, b) {
    L2 = D2(function() {
      a(exports.unstable_now());
    }, b);
  }
  exports.unstable_IdlePriority = 5;
  exports.unstable_ImmediatePriority = 1;
  exports.unstable_LowPriority = 4;
  exports.unstable_NormalPriority = 3;
  exports.unstable_Profiling = null;
  exports.unstable_UserBlockingPriority = 2;
  exports.unstable_cancelCallback = function(a) {
    a.callback = null;
  };
  exports.unstable_continueExecution = function() {
    A2 || z2 || (A2 = true, I2(J2));
  };
  exports.unstable_forceFrameRate = function(a) {
    0 > a || 125 < a ? console.error("forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported") : P2 = 0 < a ? Math.floor(1e3 / a) : 5;
  };
  exports.unstable_getCurrentPriorityLevel = function() {
    return y2;
  };
  exports.unstable_getFirstCallbackNode = function() {
    return h(r2);
  };
  exports.unstable_next = function(a) {
    switch (y2) {
      case 1:
      case 2:
      case 3:
        var b = 3;
        break;
      default:
        b = y2;
    }
    var c = y2;
    y2 = b;
    try {
      return a();
    } finally {
      y2 = c;
    }
  };
  exports.unstable_pauseExecution = function() {
  };
  exports.unstable_requestPaint = function() {
  };
  exports.unstable_runWithPriority = function(a, b) {
    switch (a) {
      case 1:
      case 2:
      case 3:
      case 4:
      case 5:
        break;
      default:
        a = 3;
    }
    var c = y2;
    y2 = a;
    try {
      return b();
    } finally {
      y2 = c;
    }
  };
  exports.unstable_scheduleCallback = function(a, b, c) {
    var d = exports.unstable_now();
    "object" === typeof c && null !== c ? (c = c.delay, c = "number" === typeof c && 0 < c ? d + c : d) : c = d;
    switch (a) {
      case 1:
        var e = -1;
        break;
      case 2:
        e = 250;
        break;
      case 5:
        e = 1073741823;
        break;
      case 4:
        e = 1e4;
        break;
      default:
        e = 5e3;
    }
    e = c + e;
    a = { id: u2++, callback: b, priorityLevel: a, startTime: c, expirationTime: e, sortIndex: -1 };
    c > d ? (a.sortIndex = c, f2(t2, a), null === h(r2) && a === h(t2) && (B2 ? (E2(L2), L2 = -1) : B2 = true, K2(H2, c - d))) : (a.sortIndex = e, f2(r2, a), A2 || z2 || (A2 = true, I2(J2)));
    return a;
  };
  exports.unstable_shouldYield = M2;
  exports.unstable_wrapCallback = function(a) {
    var b = y2;
    return function() {
      var c = y2;
      y2 = b;
      try {
        return a.apply(this, arguments);
      } finally {
        y2 = c;
      }
    };
  };
})(scheduler_production_min);
{
  scheduler.exports = scheduler_production_min;
}
var schedulerExports = scheduler.exports;
/**
 * @license React
 * react-dom.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var aa = reactExports, ca = schedulerExports;
function p(a) {
  for (var b = "https://reactjs.org/docs/error-decoder.html?invariant=" + a, c = 1; c < arguments.length; c++) b += "&args[]=" + encodeURIComponent(arguments[c]);
  return "Minified React error #" + a + "; visit " + b + " for the full message or use the non-minified dev environment for full errors and additional helpful warnings.";
}
var da = /* @__PURE__ */ new Set(), ea = {};
function fa(a, b) {
  ha(a, b);
  ha(a + "Capture", b);
}
function ha(a, b) {
  ea[a] = b;
  for (a = 0; a < b.length; a++) da.add(b[a]);
}
var ia = !("undefined" === typeof window || "undefined" === typeof window.document || "undefined" === typeof window.document.createElement), ja = Object.prototype.hasOwnProperty, ka = /^[:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD][:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\-.0-9\u00B7\u0300-\u036F\u203F-\u2040]*$/, la = {}, ma = {};
function oa(a) {
  if (ja.call(ma, a)) return true;
  if (ja.call(la, a)) return false;
  if (ka.test(a)) return ma[a] = true;
  la[a] = true;
  return false;
}
function pa(a, b, c, d) {
  if (null !== c && 0 === c.type) return false;
  switch (typeof b) {
    case "function":
    case "symbol":
      return true;
    case "boolean":
      if (d) return false;
      if (null !== c) return !c.acceptsBooleans;
      a = a.toLowerCase().slice(0, 5);
      return "data-" !== a && "aria-" !== a;
    default:
      return false;
  }
}
function qa(a, b, c, d) {
  if (null === b || "undefined" === typeof b || pa(a, b, c, d)) return true;
  if (d) return false;
  if (null !== c) switch (c.type) {
    case 3:
      return !b;
    case 4:
      return false === b;
    case 5:
      return isNaN(b);
    case 6:
      return isNaN(b) || 1 > b;
  }
  return false;
}
function v(a, b, c, d, e, f2, g) {
  this.acceptsBooleans = 2 === b || 3 === b || 4 === b;
  this.attributeName = d;
  this.attributeNamespace = e;
  this.mustUseProperty = c;
  this.propertyName = a;
  this.type = b;
  this.sanitizeURL = f2;
  this.removeEmptyString = g;
}
var z = {};
"children dangerouslySetInnerHTML defaultValue defaultChecked innerHTML suppressContentEditableWarning suppressHydrationWarning style".split(" ").forEach(function(a) {
  z[a] = new v(a, 0, false, a, null, false, false);
});
[["acceptCharset", "accept-charset"], ["className", "class"], ["htmlFor", "for"], ["httpEquiv", "http-equiv"]].forEach(function(a) {
  var b = a[0];
  z[b] = new v(b, 1, false, a[1], null, false, false);
});
["contentEditable", "draggable", "spellCheck", "value"].forEach(function(a) {
  z[a] = new v(a, 2, false, a.toLowerCase(), null, false, false);
});
["autoReverse", "externalResourcesRequired", "focusable", "preserveAlpha"].forEach(function(a) {
  z[a] = new v(a, 2, false, a, null, false, false);
});
"allowFullScreen async autoFocus autoPlay controls default defer disabled disablePictureInPicture disableRemotePlayback formNoValidate hidden loop noModule noValidate open playsInline readOnly required reversed scoped seamless itemScope".split(" ").forEach(function(a) {
  z[a] = new v(a, 3, false, a.toLowerCase(), null, false, false);
});
["checked", "multiple", "muted", "selected"].forEach(function(a) {
  z[a] = new v(a, 3, true, a, null, false, false);
});
["capture", "download"].forEach(function(a) {
  z[a] = new v(a, 4, false, a, null, false, false);
});
["cols", "rows", "size", "span"].forEach(function(a) {
  z[a] = new v(a, 6, false, a, null, false, false);
});
["rowSpan", "start"].forEach(function(a) {
  z[a] = new v(a, 5, false, a.toLowerCase(), null, false, false);
});
var ra = /[\-:]([a-z])/g;
function sa(a) {
  return a[1].toUpperCase();
}
"accent-height alignment-baseline arabic-form baseline-shift cap-height clip-path clip-rule color-interpolation color-interpolation-filters color-profile color-rendering dominant-baseline enable-background fill-opacity fill-rule flood-color flood-opacity font-family font-size font-size-adjust font-stretch font-style font-variant font-weight glyph-name glyph-orientation-horizontal glyph-orientation-vertical horiz-adv-x horiz-origin-x image-rendering letter-spacing lighting-color marker-end marker-mid marker-start overline-position overline-thickness paint-order panose-1 pointer-events rendering-intent shape-rendering stop-color stop-opacity strikethrough-position strikethrough-thickness stroke-dasharray stroke-dashoffset stroke-linecap stroke-linejoin stroke-miterlimit stroke-opacity stroke-width text-anchor text-decoration text-rendering underline-position underline-thickness unicode-bidi unicode-range units-per-em v-alphabetic v-hanging v-ideographic v-mathematical vector-effect vert-adv-y vert-origin-x vert-origin-y word-spacing writing-mode xmlns:xlink x-height".split(" ").forEach(function(a) {
  var b = a.replace(
    ra,
    sa
  );
  z[b] = new v(b, 1, false, a, null, false, false);
});
"xlink:actuate xlink:arcrole xlink:role xlink:show xlink:title xlink:type".split(" ").forEach(function(a) {
  var b = a.replace(ra, sa);
  z[b] = new v(b, 1, false, a, "http://www.w3.org/1999/xlink", false, false);
});
["xml:base", "xml:lang", "xml:space"].forEach(function(a) {
  var b = a.replace(ra, sa);
  z[b] = new v(b, 1, false, a, "http://www.w3.org/XML/1998/namespace", false, false);
});
["tabIndex", "crossOrigin"].forEach(function(a) {
  z[a] = new v(a, 1, false, a.toLowerCase(), null, false, false);
});
z.xlinkHref = new v("xlinkHref", 1, false, "xlink:href", "http://www.w3.org/1999/xlink", true, false);
["src", "href", "action", "formAction"].forEach(function(a) {
  z[a] = new v(a, 1, false, a.toLowerCase(), null, true, true);
});
function ta(a, b, c, d) {
  var e = z.hasOwnProperty(b) ? z[b] : null;
  if (null !== e ? 0 !== e.type : d || !(2 < b.length) || "o" !== b[0] && "O" !== b[0] || "n" !== b[1] && "N" !== b[1]) qa(b, c, e, d) && (c = null), d || null === e ? oa(b) && (null === c ? a.removeAttribute(b) : a.setAttribute(b, "" + c)) : e.mustUseProperty ? a[e.propertyName] = null === c ? 3 === e.type ? false : "" : c : (b = e.attributeName, d = e.attributeNamespace, null === c ? a.removeAttribute(b) : (e = e.type, c = 3 === e || 4 === e && true === c ? "" : "" + c, d ? a.setAttributeNS(d, b, c) : a.setAttribute(b, c)));
}
var ua = aa.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED, va = Symbol.for("react.element"), wa = Symbol.for("react.portal"), ya = Symbol.for("react.fragment"), za = Symbol.for("react.strict_mode"), Aa = Symbol.for("react.profiler"), Ba = Symbol.for("react.provider"), Ca = Symbol.for("react.context"), Da = Symbol.for("react.forward_ref"), Ea = Symbol.for("react.suspense"), Fa = Symbol.for("react.suspense_list"), Ga = Symbol.for("react.memo"), Ha = Symbol.for("react.lazy");
var Ia = Symbol.for("react.offscreen");
var Ja = Symbol.iterator;
function Ka(a) {
  if (null === a || "object" !== typeof a) return null;
  a = Ja && a[Ja] || a["@@iterator"];
  return "function" === typeof a ? a : null;
}
var A = Object.assign, La;
function Ma(a) {
  if (void 0 === La) try {
    throw Error();
  } catch (c) {
    var b = c.stack.trim().match(/\n( *(at )?)/);
    La = b && b[1] || "";
  }
  return "\n" + La + a;
}
var Na = false;
function Oa(a, b) {
  if (!a || Na) return "";
  Na = true;
  var c = Error.prepareStackTrace;
  Error.prepareStackTrace = void 0;
  try {
    if (b) if (b = function() {
      throw Error();
    }, Object.defineProperty(b.prototype, "props", { set: function() {
      throw Error();
    } }), "object" === typeof Reflect && Reflect.construct) {
      try {
        Reflect.construct(b, []);
      } catch (l2) {
        var d = l2;
      }
      Reflect.construct(a, [], b);
    } else {
      try {
        b.call();
      } catch (l2) {
        d = l2;
      }
      a.call(b.prototype);
    }
    else {
      try {
        throw Error();
      } catch (l2) {
        d = l2;
      }
      a();
    }
  } catch (l2) {
    if (l2 && d && "string" === typeof l2.stack) {
      for (var e = l2.stack.split("\n"), f2 = d.stack.split("\n"), g = e.length - 1, h = f2.length - 1; 1 <= g && 0 <= h && e[g] !== f2[h]; ) h--;
      for (; 1 <= g && 0 <= h; g--, h--) if (e[g] !== f2[h]) {
        if (1 !== g || 1 !== h) {
          do
            if (g--, h--, 0 > h || e[g] !== f2[h]) {
              var k2 = "\n" + e[g].replace(" at new ", " at ");
              a.displayName && k2.includes("<anonymous>") && (k2 = k2.replace("<anonymous>", a.displayName));
              return k2;
            }
          while (1 <= g && 0 <= h);
        }
        break;
      }
    }
  } finally {
    Na = false, Error.prepareStackTrace = c;
  }
  return (a = a ? a.displayName || a.name : "") ? Ma(a) : "";
}
function Pa(a) {
  switch (a.tag) {
    case 5:
      return Ma(a.type);
    case 16:
      return Ma("Lazy");
    case 13:
      return Ma("Suspense");
    case 19:
      return Ma("SuspenseList");
    case 0:
    case 2:
    case 15:
      return a = Oa(a.type, false), a;
    case 11:
      return a = Oa(a.type.render, false), a;
    case 1:
      return a = Oa(a.type, true), a;
    default:
      return "";
  }
}
function Qa(a) {
  if (null == a) return null;
  if ("function" === typeof a) return a.displayName || a.name || null;
  if ("string" === typeof a) return a;
  switch (a) {
    case ya:
      return "Fragment";
    case wa:
      return "Portal";
    case Aa:
      return "Profiler";
    case za:
      return "StrictMode";
    case Ea:
      return "Suspense";
    case Fa:
      return "SuspenseList";
  }
  if ("object" === typeof a) switch (a.$$typeof) {
    case Ca:
      return (a.displayName || "Context") + ".Consumer";
    case Ba:
      return (a._context.displayName || "Context") + ".Provider";
    case Da:
      var b = a.render;
      a = a.displayName;
      a || (a = b.displayName || b.name || "", a = "" !== a ? "ForwardRef(" + a + ")" : "ForwardRef");
      return a;
    case Ga:
      return b = a.displayName || null, null !== b ? b : Qa(a.type) || "Memo";
    case Ha:
      b = a._payload;
      a = a._init;
      try {
        return Qa(a(b));
      } catch (c) {
      }
  }
  return null;
}
function Ra(a) {
  var b = a.type;
  switch (a.tag) {
    case 24:
      return "Cache";
    case 9:
      return (b.displayName || "Context") + ".Consumer";
    case 10:
      return (b._context.displayName || "Context") + ".Provider";
    case 18:
      return "DehydratedFragment";
    case 11:
      return a = b.render, a = a.displayName || a.name || "", b.displayName || ("" !== a ? "ForwardRef(" + a + ")" : "ForwardRef");
    case 7:
      return "Fragment";
    case 5:
      return b;
    case 4:
      return "Portal";
    case 3:
      return "Root";
    case 6:
      return "Text";
    case 16:
      return Qa(b);
    case 8:
      return b === za ? "StrictMode" : "Mode";
    case 22:
      return "Offscreen";
    case 12:
      return "Profiler";
    case 21:
      return "Scope";
    case 13:
      return "Suspense";
    case 19:
      return "SuspenseList";
    case 25:
      return "TracingMarker";
    case 1:
    case 0:
    case 17:
    case 2:
    case 14:
    case 15:
      if ("function" === typeof b) return b.displayName || b.name || null;
      if ("string" === typeof b) return b;
  }
  return null;
}
function Sa(a) {
  switch (typeof a) {
    case "boolean":
    case "number":
    case "string":
    case "undefined":
      return a;
    case "object":
      return a;
    default:
      return "";
  }
}
function Ta(a) {
  var b = a.type;
  return (a = a.nodeName) && "input" === a.toLowerCase() && ("checkbox" === b || "radio" === b);
}
function Ua(a) {
  var b = Ta(a) ? "checked" : "value", c = Object.getOwnPropertyDescriptor(a.constructor.prototype, b), d = "" + a[b];
  if (!a.hasOwnProperty(b) && "undefined" !== typeof c && "function" === typeof c.get && "function" === typeof c.set) {
    var e = c.get, f2 = c.set;
    Object.defineProperty(a, b, { configurable: true, get: function() {
      return e.call(this);
    }, set: function(a2) {
      d = "" + a2;
      f2.call(this, a2);
    } });
    Object.defineProperty(a, b, { enumerable: c.enumerable });
    return { getValue: function() {
      return d;
    }, setValue: function(a2) {
      d = "" + a2;
    }, stopTracking: function() {
      a._valueTracker = null;
      delete a[b];
    } };
  }
}
function Va(a) {
  a._valueTracker || (a._valueTracker = Ua(a));
}
function Wa(a) {
  if (!a) return false;
  var b = a._valueTracker;
  if (!b) return true;
  var c = b.getValue();
  var d = "";
  a && (d = Ta(a) ? a.checked ? "true" : "false" : a.value);
  a = d;
  return a !== c ? (b.setValue(a), true) : false;
}
function Xa(a) {
  a = a || ("undefined" !== typeof document ? document : void 0);
  if ("undefined" === typeof a) return null;
  try {
    return a.activeElement || a.body;
  } catch (b) {
    return a.body;
  }
}
function Ya(a, b) {
  var c = b.checked;
  return A({}, b, { defaultChecked: void 0, defaultValue: void 0, value: void 0, checked: null != c ? c : a._wrapperState.initialChecked });
}
function Za(a, b) {
  var c = null == b.defaultValue ? "" : b.defaultValue, d = null != b.checked ? b.checked : b.defaultChecked;
  c = Sa(null != b.value ? b.value : c);
  a._wrapperState = { initialChecked: d, initialValue: c, controlled: "checkbox" === b.type || "radio" === b.type ? null != b.checked : null != b.value };
}
function ab(a, b) {
  b = b.checked;
  null != b && ta(a, "checked", b, false);
}
function bb(a, b) {
  ab(a, b);
  var c = Sa(b.value), d = b.type;
  if (null != c) if ("number" === d) {
    if (0 === c && "" === a.value || a.value != c) a.value = "" + c;
  } else a.value !== "" + c && (a.value = "" + c);
  else if ("submit" === d || "reset" === d) {
    a.removeAttribute("value");
    return;
  }
  b.hasOwnProperty("value") ? cb(a, b.type, c) : b.hasOwnProperty("defaultValue") && cb(a, b.type, Sa(b.defaultValue));
  null == b.checked && null != b.defaultChecked && (a.defaultChecked = !!b.defaultChecked);
}
function db(a, b, c) {
  if (b.hasOwnProperty("value") || b.hasOwnProperty("defaultValue")) {
    var d = b.type;
    if (!("submit" !== d && "reset" !== d || void 0 !== b.value && null !== b.value)) return;
    b = "" + a._wrapperState.initialValue;
    c || b === a.value || (a.value = b);
    a.defaultValue = b;
  }
  c = a.name;
  "" !== c && (a.name = "");
  a.defaultChecked = !!a._wrapperState.initialChecked;
  "" !== c && (a.name = c);
}
function cb(a, b, c) {
  if ("number" !== b || Xa(a.ownerDocument) !== a) null == c ? a.defaultValue = "" + a._wrapperState.initialValue : a.defaultValue !== "" + c && (a.defaultValue = "" + c);
}
var eb = Array.isArray;
function fb(a, b, c, d) {
  a = a.options;
  if (b) {
    b = {};
    for (var e = 0; e < c.length; e++) b["$" + c[e]] = true;
    for (c = 0; c < a.length; c++) e = b.hasOwnProperty("$" + a[c].value), a[c].selected !== e && (a[c].selected = e), e && d && (a[c].defaultSelected = true);
  } else {
    c = "" + Sa(c);
    b = null;
    for (e = 0; e < a.length; e++) {
      if (a[e].value === c) {
        a[e].selected = true;
        d && (a[e].defaultSelected = true);
        return;
      }
      null !== b || a[e].disabled || (b = a[e]);
    }
    null !== b && (b.selected = true);
  }
}
function gb(a, b) {
  if (null != b.dangerouslySetInnerHTML) throw Error(p(91));
  return A({}, b, { value: void 0, defaultValue: void 0, children: "" + a._wrapperState.initialValue });
}
function hb(a, b) {
  var c = b.value;
  if (null == c) {
    c = b.children;
    b = b.defaultValue;
    if (null != c) {
      if (null != b) throw Error(p(92));
      if (eb(c)) {
        if (1 < c.length) throw Error(p(93));
        c = c[0];
      }
      b = c;
    }
    null == b && (b = "");
    c = b;
  }
  a._wrapperState = { initialValue: Sa(c) };
}
function ib(a, b) {
  var c = Sa(b.value), d = Sa(b.defaultValue);
  null != c && (c = "" + c, c !== a.value && (a.value = c), null == b.defaultValue && a.defaultValue !== c && (a.defaultValue = c));
  null != d && (a.defaultValue = "" + d);
}
function jb(a) {
  var b = a.textContent;
  b === a._wrapperState.initialValue && "" !== b && null !== b && (a.value = b);
}
function kb(a) {
  switch (a) {
    case "svg":
      return "http://www.w3.org/2000/svg";
    case "math":
      return "http://www.w3.org/1998/Math/MathML";
    default:
      return "http://www.w3.org/1999/xhtml";
  }
}
function lb(a, b) {
  return null == a || "http://www.w3.org/1999/xhtml" === a ? kb(b) : "http://www.w3.org/2000/svg" === a && "foreignObject" === b ? "http://www.w3.org/1999/xhtml" : a;
}
var mb, nb = function(a) {
  return "undefined" !== typeof MSApp && MSApp.execUnsafeLocalFunction ? function(b, c, d, e) {
    MSApp.execUnsafeLocalFunction(function() {
      return a(b, c, d, e);
    });
  } : a;
}(function(a, b) {
  if ("http://www.w3.org/2000/svg" !== a.namespaceURI || "innerHTML" in a) a.innerHTML = b;
  else {
    mb = mb || document.createElement("div");
    mb.innerHTML = "<svg>" + b.valueOf().toString() + "</svg>";
    for (b = mb.firstChild; a.firstChild; ) a.removeChild(a.firstChild);
    for (; b.firstChild; ) a.appendChild(b.firstChild);
  }
});
function ob(a, b) {
  if (b) {
    var c = a.firstChild;
    if (c && c === a.lastChild && 3 === c.nodeType) {
      c.nodeValue = b;
      return;
    }
  }
  a.textContent = b;
}
var pb = {
  animationIterationCount: true,
  aspectRatio: true,
  borderImageOutset: true,
  borderImageSlice: true,
  borderImageWidth: true,
  boxFlex: true,
  boxFlexGroup: true,
  boxOrdinalGroup: true,
  columnCount: true,
  columns: true,
  flex: true,
  flexGrow: true,
  flexPositive: true,
  flexShrink: true,
  flexNegative: true,
  flexOrder: true,
  gridArea: true,
  gridRow: true,
  gridRowEnd: true,
  gridRowSpan: true,
  gridRowStart: true,
  gridColumn: true,
  gridColumnEnd: true,
  gridColumnSpan: true,
  gridColumnStart: true,
  fontWeight: true,
  lineClamp: true,
  lineHeight: true,
  opacity: true,
  order: true,
  orphans: true,
  tabSize: true,
  widows: true,
  zIndex: true,
  zoom: true,
  fillOpacity: true,
  floodOpacity: true,
  stopOpacity: true,
  strokeDasharray: true,
  strokeDashoffset: true,
  strokeMiterlimit: true,
  strokeOpacity: true,
  strokeWidth: true
}, qb = ["Webkit", "ms", "Moz", "O"];
Object.keys(pb).forEach(function(a) {
  qb.forEach(function(b) {
    b = b + a.charAt(0).toUpperCase() + a.substring(1);
    pb[b] = pb[a];
  });
});
function rb(a, b, c) {
  return null == b || "boolean" === typeof b || "" === b ? "" : c || "number" !== typeof b || 0 === b || pb.hasOwnProperty(a) && pb[a] ? ("" + b).trim() : b + "px";
}
function sb(a, b) {
  a = a.style;
  for (var c in b) if (b.hasOwnProperty(c)) {
    var d = 0 === c.indexOf("--"), e = rb(c, b[c], d);
    "float" === c && (c = "cssFloat");
    d ? a.setProperty(c, e) : a[c] = e;
  }
}
var tb = A({ menuitem: true }, { area: true, base: true, br: true, col: true, embed: true, hr: true, img: true, input: true, keygen: true, link: true, meta: true, param: true, source: true, track: true, wbr: true });
function ub(a, b) {
  if (b) {
    if (tb[a] && (null != b.children || null != b.dangerouslySetInnerHTML)) throw Error(p(137, a));
    if (null != b.dangerouslySetInnerHTML) {
      if (null != b.children) throw Error(p(60));
      if ("object" !== typeof b.dangerouslySetInnerHTML || !("__html" in b.dangerouslySetInnerHTML)) throw Error(p(61));
    }
    if (null != b.style && "object" !== typeof b.style) throw Error(p(62));
  }
}
function vb(a, b) {
  if (-1 === a.indexOf("-")) return "string" === typeof b.is;
  switch (a) {
    case "annotation-xml":
    case "color-profile":
    case "font-face":
    case "font-face-src":
    case "font-face-uri":
    case "font-face-format":
    case "font-face-name":
    case "missing-glyph":
      return false;
    default:
      return true;
  }
}
var wb = null;
function xb(a) {
  a = a.target || a.srcElement || window;
  a.correspondingUseElement && (a = a.correspondingUseElement);
  return 3 === a.nodeType ? a.parentNode : a;
}
var yb = null, zb = null, Ab = null;
function Bb(a) {
  if (a = Cb(a)) {
    if ("function" !== typeof yb) throw Error(p(280));
    var b = a.stateNode;
    b && (b = Db(b), yb(a.stateNode, a.type, b));
  }
}
function Eb(a) {
  zb ? Ab ? Ab.push(a) : Ab = [a] : zb = a;
}
function Fb() {
  if (zb) {
    var a = zb, b = Ab;
    Ab = zb = null;
    Bb(a);
    if (b) for (a = 0; a < b.length; a++) Bb(b[a]);
  }
}
function Gb(a, b) {
  return a(b);
}
function Hb() {
}
var Ib = false;
function Jb(a, b, c) {
  if (Ib) return a(b, c);
  Ib = true;
  try {
    return Gb(a, b, c);
  } finally {
    if (Ib = false, null !== zb || null !== Ab) Hb(), Fb();
  }
}
function Kb(a, b) {
  var c = a.stateNode;
  if (null === c) return null;
  var d = Db(c);
  if (null === d) return null;
  c = d[b];
  a: switch (b) {
    case "onClick":
    case "onClickCapture":
    case "onDoubleClick":
    case "onDoubleClickCapture":
    case "onMouseDown":
    case "onMouseDownCapture":
    case "onMouseMove":
    case "onMouseMoveCapture":
    case "onMouseUp":
    case "onMouseUpCapture":
    case "onMouseEnter":
      (d = !d.disabled) || (a = a.type, d = !("button" === a || "input" === a || "select" === a || "textarea" === a));
      a = !d;
      break a;
    default:
      a = false;
  }
  if (a) return null;
  if (c && "function" !== typeof c) throw Error(p(231, b, typeof c));
  return c;
}
var Lb = false;
if (ia) try {
  var Mb = {};
  Object.defineProperty(Mb, "passive", { get: function() {
    Lb = true;
  } });
  window.addEventListener("test", Mb, Mb);
  window.removeEventListener("test", Mb, Mb);
} catch (a) {
  Lb = false;
}
function Nb(a, b, c, d, e, f2, g, h, k2) {
  var l2 = Array.prototype.slice.call(arguments, 3);
  try {
    b.apply(c, l2);
  } catch (m2) {
    this.onError(m2);
  }
}
var Ob = false, Pb = null, Qb = false, Rb = null, Sb = { onError: function(a) {
  Ob = true;
  Pb = a;
} };
function Tb(a, b, c, d, e, f2, g, h, k2) {
  Ob = false;
  Pb = null;
  Nb.apply(Sb, arguments);
}
function Ub(a, b, c, d, e, f2, g, h, k2) {
  Tb.apply(this, arguments);
  if (Ob) {
    if (Ob) {
      var l2 = Pb;
      Ob = false;
      Pb = null;
    } else throw Error(p(198));
    Qb || (Qb = true, Rb = l2);
  }
}
function Vb(a) {
  var b = a, c = a;
  if (a.alternate) for (; b.return; ) b = b.return;
  else {
    a = b;
    do
      b = a, 0 !== (b.flags & 4098) && (c = b.return), a = b.return;
    while (a);
  }
  return 3 === b.tag ? c : null;
}
function Wb(a) {
  if (13 === a.tag) {
    var b = a.memoizedState;
    null === b && (a = a.alternate, null !== a && (b = a.memoizedState));
    if (null !== b) return b.dehydrated;
  }
  return null;
}
function Xb(a) {
  if (Vb(a) !== a) throw Error(p(188));
}
function Yb(a) {
  var b = a.alternate;
  if (!b) {
    b = Vb(a);
    if (null === b) throw Error(p(188));
    return b !== a ? null : a;
  }
  for (var c = a, d = b; ; ) {
    var e = c.return;
    if (null === e) break;
    var f2 = e.alternate;
    if (null === f2) {
      d = e.return;
      if (null !== d) {
        c = d;
        continue;
      }
      break;
    }
    if (e.child === f2.child) {
      for (f2 = e.child; f2; ) {
        if (f2 === c) return Xb(e), a;
        if (f2 === d) return Xb(e), b;
        f2 = f2.sibling;
      }
      throw Error(p(188));
    }
    if (c.return !== d.return) c = e, d = f2;
    else {
      for (var g = false, h = e.child; h; ) {
        if (h === c) {
          g = true;
          c = e;
          d = f2;
          break;
        }
        if (h === d) {
          g = true;
          d = e;
          c = f2;
          break;
        }
        h = h.sibling;
      }
      if (!g) {
        for (h = f2.child; h; ) {
          if (h === c) {
            g = true;
            c = f2;
            d = e;
            break;
          }
          if (h === d) {
            g = true;
            d = f2;
            c = e;
            break;
          }
          h = h.sibling;
        }
        if (!g) throw Error(p(189));
      }
    }
    if (c.alternate !== d) throw Error(p(190));
  }
  if (3 !== c.tag) throw Error(p(188));
  return c.stateNode.current === c ? a : b;
}
function Zb(a) {
  a = Yb(a);
  return null !== a ? $b(a) : null;
}
function $b(a) {
  if (5 === a.tag || 6 === a.tag) return a;
  for (a = a.child; null !== a; ) {
    var b = $b(a);
    if (null !== b) return b;
    a = a.sibling;
  }
  return null;
}
var ac = ca.unstable_scheduleCallback, bc = ca.unstable_cancelCallback, cc = ca.unstable_shouldYield, dc = ca.unstable_requestPaint, B = ca.unstable_now, ec = ca.unstable_getCurrentPriorityLevel, fc = ca.unstable_ImmediatePriority, gc = ca.unstable_UserBlockingPriority, hc = ca.unstable_NormalPriority, ic = ca.unstable_LowPriority, jc = ca.unstable_IdlePriority, kc = null, lc = null;
function mc(a) {
  if (lc && "function" === typeof lc.onCommitFiberRoot) try {
    lc.onCommitFiberRoot(kc, a, void 0, 128 === (a.current.flags & 128));
  } catch (b) {
  }
}
var oc = Math.clz32 ? Math.clz32 : nc, pc = Math.log, qc = Math.LN2;
function nc(a) {
  a >>>= 0;
  return 0 === a ? 32 : 31 - (pc(a) / qc | 0) | 0;
}
var rc = 64, sc = 4194304;
function tc(a) {
  switch (a & -a) {
    case 1:
      return 1;
    case 2:
      return 2;
    case 4:
      return 4;
    case 8:
      return 8;
    case 16:
      return 16;
    case 32:
      return 32;
    case 64:
    case 128:
    case 256:
    case 512:
    case 1024:
    case 2048:
    case 4096:
    case 8192:
    case 16384:
    case 32768:
    case 65536:
    case 131072:
    case 262144:
    case 524288:
    case 1048576:
    case 2097152:
      return a & 4194240;
    case 4194304:
    case 8388608:
    case 16777216:
    case 33554432:
    case 67108864:
      return a & 130023424;
    case 134217728:
      return 134217728;
    case 268435456:
      return 268435456;
    case 536870912:
      return 536870912;
    case 1073741824:
      return 1073741824;
    default:
      return a;
  }
}
function uc(a, b) {
  var c = a.pendingLanes;
  if (0 === c) return 0;
  var d = 0, e = a.suspendedLanes, f2 = a.pingedLanes, g = c & 268435455;
  if (0 !== g) {
    var h = g & ~e;
    0 !== h ? d = tc(h) : (f2 &= g, 0 !== f2 && (d = tc(f2)));
  } else g = c & ~e, 0 !== g ? d = tc(g) : 0 !== f2 && (d = tc(f2));
  if (0 === d) return 0;
  if (0 !== b && b !== d && 0 === (b & e) && (e = d & -d, f2 = b & -b, e >= f2 || 16 === e && 0 !== (f2 & 4194240))) return b;
  0 !== (d & 4) && (d |= c & 16);
  b = a.entangledLanes;
  if (0 !== b) for (a = a.entanglements, b &= d; 0 < b; ) c = 31 - oc(b), e = 1 << c, d |= a[c], b &= ~e;
  return d;
}
function vc(a, b) {
  switch (a) {
    case 1:
    case 2:
    case 4:
      return b + 250;
    case 8:
    case 16:
    case 32:
    case 64:
    case 128:
    case 256:
    case 512:
    case 1024:
    case 2048:
    case 4096:
    case 8192:
    case 16384:
    case 32768:
    case 65536:
    case 131072:
    case 262144:
    case 524288:
    case 1048576:
    case 2097152:
      return b + 5e3;
    case 4194304:
    case 8388608:
    case 16777216:
    case 33554432:
    case 67108864:
      return -1;
    case 134217728:
    case 268435456:
    case 536870912:
    case 1073741824:
      return -1;
    default:
      return -1;
  }
}
function wc(a, b) {
  for (var c = a.suspendedLanes, d = a.pingedLanes, e = a.expirationTimes, f2 = a.pendingLanes; 0 < f2; ) {
    var g = 31 - oc(f2), h = 1 << g, k2 = e[g];
    if (-1 === k2) {
      if (0 === (h & c) || 0 !== (h & d)) e[g] = vc(h, b);
    } else k2 <= b && (a.expiredLanes |= h);
    f2 &= ~h;
  }
}
function xc(a) {
  a = a.pendingLanes & -1073741825;
  return 0 !== a ? a : a & 1073741824 ? 1073741824 : 0;
}
function yc() {
  var a = rc;
  rc <<= 1;
  0 === (rc & 4194240) && (rc = 64);
  return a;
}
function zc(a) {
  for (var b = [], c = 0; 31 > c; c++) b.push(a);
  return b;
}
function Ac(a, b, c) {
  a.pendingLanes |= b;
  536870912 !== b && (a.suspendedLanes = 0, a.pingedLanes = 0);
  a = a.eventTimes;
  b = 31 - oc(b);
  a[b] = c;
}
function Bc(a, b) {
  var c = a.pendingLanes & ~b;
  a.pendingLanes = b;
  a.suspendedLanes = 0;
  a.pingedLanes = 0;
  a.expiredLanes &= b;
  a.mutableReadLanes &= b;
  a.entangledLanes &= b;
  b = a.entanglements;
  var d = a.eventTimes;
  for (a = a.expirationTimes; 0 < c; ) {
    var e = 31 - oc(c), f2 = 1 << e;
    b[e] = 0;
    d[e] = -1;
    a[e] = -1;
    c &= ~f2;
  }
}
function Cc(a, b) {
  var c = a.entangledLanes |= b;
  for (a = a.entanglements; c; ) {
    var d = 31 - oc(c), e = 1 << d;
    e & b | a[d] & b && (a[d] |= b);
    c &= ~e;
  }
}
var C = 0;
function Dc(a) {
  a &= -a;
  return 1 < a ? 4 < a ? 0 !== (a & 268435455) ? 16 : 536870912 : 4 : 1;
}
var Ec, Fc, Gc, Hc, Ic, Jc = false, Kc = [], Lc = null, Mc = null, Nc = null, Oc = /* @__PURE__ */ new Map(), Pc = /* @__PURE__ */ new Map(), Qc = [], Rc = "mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset submit".split(" ");
function Sc(a, b) {
  switch (a) {
    case "focusin":
    case "focusout":
      Lc = null;
      break;
    case "dragenter":
    case "dragleave":
      Mc = null;
      break;
    case "mouseover":
    case "mouseout":
      Nc = null;
      break;
    case "pointerover":
    case "pointerout":
      Oc.delete(b.pointerId);
      break;
    case "gotpointercapture":
    case "lostpointercapture":
      Pc.delete(b.pointerId);
  }
}
function Tc(a, b, c, d, e, f2) {
  if (null === a || a.nativeEvent !== f2) return a = { blockedOn: b, domEventName: c, eventSystemFlags: d, nativeEvent: f2, targetContainers: [e] }, null !== b && (b = Cb(b), null !== b && Fc(b)), a;
  a.eventSystemFlags |= d;
  b = a.targetContainers;
  null !== e && -1 === b.indexOf(e) && b.push(e);
  return a;
}
function Uc(a, b, c, d, e) {
  switch (b) {
    case "focusin":
      return Lc = Tc(Lc, a, b, c, d, e), true;
    case "dragenter":
      return Mc = Tc(Mc, a, b, c, d, e), true;
    case "mouseover":
      return Nc = Tc(Nc, a, b, c, d, e), true;
    case "pointerover":
      var f2 = e.pointerId;
      Oc.set(f2, Tc(Oc.get(f2) || null, a, b, c, d, e));
      return true;
    case "gotpointercapture":
      return f2 = e.pointerId, Pc.set(f2, Tc(Pc.get(f2) || null, a, b, c, d, e)), true;
  }
  return false;
}
function Vc(a) {
  var b = Wc(a.target);
  if (null !== b) {
    var c = Vb(b);
    if (null !== c) {
      if (b = c.tag, 13 === b) {
        if (b = Wb(c), null !== b) {
          a.blockedOn = b;
          Ic(a.priority, function() {
            Gc(c);
          });
          return;
        }
      } else if (3 === b && c.stateNode.current.memoizedState.isDehydrated) {
        a.blockedOn = 3 === c.tag ? c.stateNode.containerInfo : null;
        return;
      }
    }
  }
  a.blockedOn = null;
}
function Xc(a) {
  if (null !== a.blockedOn) return false;
  for (var b = a.targetContainers; 0 < b.length; ) {
    var c = Yc(a.domEventName, a.eventSystemFlags, b[0], a.nativeEvent);
    if (null === c) {
      c = a.nativeEvent;
      var d = new c.constructor(c.type, c);
      wb = d;
      c.target.dispatchEvent(d);
      wb = null;
    } else return b = Cb(c), null !== b && Fc(b), a.blockedOn = c, false;
    b.shift();
  }
  return true;
}
function Zc(a, b, c) {
  Xc(a) && c.delete(b);
}
function $c() {
  Jc = false;
  null !== Lc && Xc(Lc) && (Lc = null);
  null !== Mc && Xc(Mc) && (Mc = null);
  null !== Nc && Xc(Nc) && (Nc = null);
  Oc.forEach(Zc);
  Pc.forEach(Zc);
}
function ad(a, b) {
  a.blockedOn === b && (a.blockedOn = null, Jc || (Jc = true, ca.unstable_scheduleCallback(ca.unstable_NormalPriority, $c)));
}
function bd(a) {
  function b(b2) {
    return ad(b2, a);
  }
  if (0 < Kc.length) {
    ad(Kc[0], a);
    for (var c = 1; c < Kc.length; c++) {
      var d = Kc[c];
      d.blockedOn === a && (d.blockedOn = null);
    }
  }
  null !== Lc && ad(Lc, a);
  null !== Mc && ad(Mc, a);
  null !== Nc && ad(Nc, a);
  Oc.forEach(b);
  Pc.forEach(b);
  for (c = 0; c < Qc.length; c++) d = Qc[c], d.blockedOn === a && (d.blockedOn = null);
  for (; 0 < Qc.length && (c = Qc[0], null === c.blockedOn); ) Vc(c), null === c.blockedOn && Qc.shift();
}
var cd = ua.ReactCurrentBatchConfig, dd = true;
function ed(a, b, c, d) {
  var e = C, f2 = cd.transition;
  cd.transition = null;
  try {
    C = 1, fd(a, b, c, d);
  } finally {
    C = e, cd.transition = f2;
  }
}
function gd(a, b, c, d) {
  var e = C, f2 = cd.transition;
  cd.transition = null;
  try {
    C = 4, fd(a, b, c, d);
  } finally {
    C = e, cd.transition = f2;
  }
}
function fd(a, b, c, d) {
  if (dd) {
    var e = Yc(a, b, c, d);
    if (null === e) hd(a, b, d, id, c), Sc(a, d);
    else if (Uc(e, a, b, c, d)) d.stopPropagation();
    else if (Sc(a, d), b & 4 && -1 < Rc.indexOf(a)) {
      for (; null !== e; ) {
        var f2 = Cb(e);
        null !== f2 && Ec(f2);
        f2 = Yc(a, b, c, d);
        null === f2 && hd(a, b, d, id, c);
        if (f2 === e) break;
        e = f2;
      }
      null !== e && d.stopPropagation();
    } else hd(a, b, d, null, c);
  }
}
var id = null;
function Yc(a, b, c, d) {
  id = null;
  a = xb(d);
  a = Wc(a);
  if (null !== a) if (b = Vb(a), null === b) a = null;
  else if (c = b.tag, 13 === c) {
    a = Wb(b);
    if (null !== a) return a;
    a = null;
  } else if (3 === c) {
    if (b.stateNode.current.memoizedState.isDehydrated) return 3 === b.tag ? b.stateNode.containerInfo : null;
    a = null;
  } else b !== a && (a = null);
  id = a;
  return null;
}
function jd(a) {
  switch (a) {
    case "cancel":
    case "click":
    case "close":
    case "contextmenu":
    case "copy":
    case "cut":
    case "auxclick":
    case "dblclick":
    case "dragend":
    case "dragstart":
    case "drop":
    case "focusin":
    case "focusout":
    case "input":
    case "invalid":
    case "keydown":
    case "keypress":
    case "keyup":
    case "mousedown":
    case "mouseup":
    case "paste":
    case "pause":
    case "play":
    case "pointercancel":
    case "pointerdown":
    case "pointerup":
    case "ratechange":
    case "reset":
    case "resize":
    case "seeked":
    case "submit":
    case "touchcancel":
    case "touchend":
    case "touchstart":
    case "volumechange":
    case "change":
    case "selectionchange":
    case "textInput":
    case "compositionstart":
    case "compositionend":
    case "compositionupdate":
    case "beforeblur":
    case "afterblur":
    case "beforeinput":
    case "blur":
    case "fullscreenchange":
    case "focus":
    case "hashchange":
    case "popstate":
    case "select":
    case "selectstart":
      return 1;
    case "drag":
    case "dragenter":
    case "dragexit":
    case "dragleave":
    case "dragover":
    case "mousemove":
    case "mouseout":
    case "mouseover":
    case "pointermove":
    case "pointerout":
    case "pointerover":
    case "scroll":
    case "toggle":
    case "touchmove":
    case "wheel":
    case "mouseenter":
    case "mouseleave":
    case "pointerenter":
    case "pointerleave":
      return 4;
    case "message":
      switch (ec()) {
        case fc:
          return 1;
        case gc:
          return 4;
        case hc:
        case ic:
          return 16;
        case jc:
          return 536870912;
        default:
          return 16;
      }
    default:
      return 16;
  }
}
var kd = null, ld = null, md = null;
function nd() {
  if (md) return md;
  var a, b = ld, c = b.length, d, e = "value" in kd ? kd.value : kd.textContent, f2 = e.length;
  for (a = 0; a < c && b[a] === e[a]; a++) ;
  var g = c - a;
  for (d = 1; d <= g && b[c - d] === e[f2 - d]; d++) ;
  return md = e.slice(a, 1 < d ? 1 - d : void 0);
}
function od(a) {
  var b = a.keyCode;
  "charCode" in a ? (a = a.charCode, 0 === a && 13 === b && (a = 13)) : a = b;
  10 === a && (a = 13);
  return 32 <= a || 13 === a ? a : 0;
}
function pd() {
  return true;
}
function qd() {
  return false;
}
function rd(a) {
  function b(b2, d, e, f2, g) {
    this._reactName = b2;
    this._targetInst = e;
    this.type = d;
    this.nativeEvent = f2;
    this.target = g;
    this.currentTarget = null;
    for (var c in a) a.hasOwnProperty(c) && (b2 = a[c], this[c] = b2 ? b2(f2) : f2[c]);
    this.isDefaultPrevented = (null != f2.defaultPrevented ? f2.defaultPrevented : false === f2.returnValue) ? pd : qd;
    this.isPropagationStopped = qd;
    return this;
  }
  A(b.prototype, { preventDefault: function() {
    this.defaultPrevented = true;
    var a2 = this.nativeEvent;
    a2 && (a2.preventDefault ? a2.preventDefault() : "unknown" !== typeof a2.returnValue && (a2.returnValue = false), this.isDefaultPrevented = pd);
  }, stopPropagation: function() {
    var a2 = this.nativeEvent;
    a2 && (a2.stopPropagation ? a2.stopPropagation() : "unknown" !== typeof a2.cancelBubble && (a2.cancelBubble = true), this.isPropagationStopped = pd);
  }, persist: function() {
  }, isPersistent: pd });
  return b;
}
var sd = { eventPhase: 0, bubbles: 0, cancelable: 0, timeStamp: function(a) {
  return a.timeStamp || Date.now();
}, defaultPrevented: 0, isTrusted: 0 }, td = rd(sd), ud = A({}, sd, { view: 0, detail: 0 }), vd = rd(ud), wd, xd, yd, Ad = A({}, ud, { screenX: 0, screenY: 0, clientX: 0, clientY: 0, pageX: 0, pageY: 0, ctrlKey: 0, shiftKey: 0, altKey: 0, metaKey: 0, getModifierState: zd, button: 0, buttons: 0, relatedTarget: function(a) {
  return void 0 === a.relatedTarget ? a.fromElement === a.srcElement ? a.toElement : a.fromElement : a.relatedTarget;
}, movementX: function(a) {
  if ("movementX" in a) return a.movementX;
  a !== yd && (yd && "mousemove" === a.type ? (wd = a.screenX - yd.screenX, xd = a.screenY - yd.screenY) : xd = wd = 0, yd = a);
  return wd;
}, movementY: function(a) {
  return "movementY" in a ? a.movementY : xd;
} }), Bd = rd(Ad), Cd = A({}, Ad, { dataTransfer: 0 }), Dd = rd(Cd), Ed = A({}, ud, { relatedTarget: 0 }), Fd = rd(Ed), Gd = A({}, sd, { animationName: 0, elapsedTime: 0, pseudoElement: 0 }), Hd = rd(Gd), Id = A({}, sd, { clipboardData: function(a) {
  return "clipboardData" in a ? a.clipboardData : window.clipboardData;
} }), Jd = rd(Id), Kd = A({}, sd, { data: 0 }), Ld = rd(Kd), Md = {
  Esc: "Escape",
  Spacebar: " ",
  Left: "ArrowLeft",
  Up: "ArrowUp",
  Right: "ArrowRight",
  Down: "ArrowDown",
  Del: "Delete",
  Win: "OS",
  Menu: "ContextMenu",
  Apps: "ContextMenu",
  Scroll: "ScrollLock",
  MozPrintableKey: "Unidentified"
}, Nd = {
  8: "Backspace",
  9: "Tab",
  12: "Clear",
  13: "Enter",
  16: "Shift",
  17: "Control",
  18: "Alt",
  19: "Pause",
  20: "CapsLock",
  27: "Escape",
  32: " ",
  33: "PageUp",
  34: "PageDown",
  35: "End",
  36: "Home",
  37: "ArrowLeft",
  38: "ArrowUp",
  39: "ArrowRight",
  40: "ArrowDown",
  45: "Insert",
  46: "Delete",
  112: "F1",
  113: "F2",
  114: "F3",
  115: "F4",
  116: "F5",
  117: "F6",
  118: "F7",
  119: "F8",
  120: "F9",
  121: "F10",
  122: "F11",
  123: "F12",
  144: "NumLock",
  145: "ScrollLock",
  224: "Meta"
}, Od = { Alt: "altKey", Control: "ctrlKey", Meta: "metaKey", Shift: "shiftKey" };
function Pd(a) {
  var b = this.nativeEvent;
  return b.getModifierState ? b.getModifierState(a) : (a = Od[a]) ? !!b[a] : false;
}
function zd() {
  return Pd;
}
var Qd = A({}, ud, { key: function(a) {
  if (a.key) {
    var b = Md[a.key] || a.key;
    if ("Unidentified" !== b) return b;
  }
  return "keypress" === a.type ? (a = od(a), 13 === a ? "Enter" : String.fromCharCode(a)) : "keydown" === a.type || "keyup" === a.type ? Nd[a.keyCode] || "Unidentified" : "";
}, code: 0, location: 0, ctrlKey: 0, shiftKey: 0, altKey: 0, metaKey: 0, repeat: 0, locale: 0, getModifierState: zd, charCode: function(a) {
  return "keypress" === a.type ? od(a) : 0;
}, keyCode: function(a) {
  return "keydown" === a.type || "keyup" === a.type ? a.keyCode : 0;
}, which: function(a) {
  return "keypress" === a.type ? od(a) : "keydown" === a.type || "keyup" === a.type ? a.keyCode : 0;
} }), Rd = rd(Qd), Sd = A({}, Ad, { pointerId: 0, width: 0, height: 0, pressure: 0, tangentialPressure: 0, tiltX: 0, tiltY: 0, twist: 0, pointerType: 0, isPrimary: 0 }), Td = rd(Sd), Ud = A({}, ud, { touches: 0, targetTouches: 0, changedTouches: 0, altKey: 0, metaKey: 0, ctrlKey: 0, shiftKey: 0, getModifierState: zd }), Vd = rd(Ud), Wd = A({}, sd, { propertyName: 0, elapsedTime: 0, pseudoElement: 0 }), Xd = rd(Wd), Yd = A({}, Ad, {
  deltaX: function(a) {
    return "deltaX" in a ? a.deltaX : "wheelDeltaX" in a ? -a.wheelDeltaX : 0;
  },
  deltaY: function(a) {
    return "deltaY" in a ? a.deltaY : "wheelDeltaY" in a ? -a.wheelDeltaY : "wheelDelta" in a ? -a.wheelDelta : 0;
  },
  deltaZ: 0,
  deltaMode: 0
}), Zd = rd(Yd), $d = [9, 13, 27, 32], ae = ia && "CompositionEvent" in window, be = null;
ia && "documentMode" in document && (be = document.documentMode);
var ce = ia && "TextEvent" in window && !be, de = ia && (!ae || be && 8 < be && 11 >= be), ee = String.fromCharCode(32), fe = false;
function ge(a, b) {
  switch (a) {
    case "keyup":
      return -1 !== $d.indexOf(b.keyCode);
    case "keydown":
      return 229 !== b.keyCode;
    case "keypress":
    case "mousedown":
    case "focusout":
      return true;
    default:
      return false;
  }
}
function he(a) {
  a = a.detail;
  return "object" === typeof a && "data" in a ? a.data : null;
}
var ie = false;
function je(a, b) {
  switch (a) {
    case "compositionend":
      return he(b);
    case "keypress":
      if (32 !== b.which) return null;
      fe = true;
      return ee;
    case "textInput":
      return a = b.data, a === ee && fe ? null : a;
    default:
      return null;
  }
}
function ke(a, b) {
  if (ie) return "compositionend" === a || !ae && ge(a, b) ? (a = nd(), md = ld = kd = null, ie = false, a) : null;
  switch (a) {
    case "paste":
      return null;
    case "keypress":
      if (!(b.ctrlKey || b.altKey || b.metaKey) || b.ctrlKey && b.altKey) {
        if (b.char && 1 < b.char.length) return b.char;
        if (b.which) return String.fromCharCode(b.which);
      }
      return null;
    case "compositionend":
      return de && "ko" !== b.locale ? null : b.data;
    default:
      return null;
  }
}
var le = { color: true, date: true, datetime: true, "datetime-local": true, email: true, month: true, number: true, password: true, range: true, search: true, tel: true, text: true, time: true, url: true, week: true };
function me(a) {
  var b = a && a.nodeName && a.nodeName.toLowerCase();
  return "input" === b ? !!le[a.type] : "textarea" === b ? true : false;
}
function ne(a, b, c, d) {
  Eb(d);
  b = oe(b, "onChange");
  0 < b.length && (c = new td("onChange", "change", null, c, d), a.push({ event: c, listeners: b }));
}
var pe = null, qe = null;
function re(a) {
  se(a, 0);
}
function te(a) {
  var b = ue(a);
  if (Wa(b)) return a;
}
function ve(a, b) {
  if ("change" === a) return b;
}
var we = false;
if (ia) {
  var xe;
  if (ia) {
    var ye = "oninput" in document;
    if (!ye) {
      var ze = document.createElement("div");
      ze.setAttribute("oninput", "return;");
      ye = "function" === typeof ze.oninput;
    }
    xe = ye;
  } else xe = false;
  we = xe && (!document.documentMode || 9 < document.documentMode);
}
function Ae() {
  pe && (pe.detachEvent("onpropertychange", Be), qe = pe = null);
}
function Be(a) {
  if ("value" === a.propertyName && te(qe)) {
    var b = [];
    ne(b, qe, a, xb(a));
    Jb(re, b);
  }
}
function Ce(a, b, c) {
  "focusin" === a ? (Ae(), pe = b, qe = c, pe.attachEvent("onpropertychange", Be)) : "focusout" === a && Ae();
}
function De(a) {
  if ("selectionchange" === a || "keyup" === a || "keydown" === a) return te(qe);
}
function Ee(a, b) {
  if ("click" === a) return te(b);
}
function Fe(a, b) {
  if ("input" === a || "change" === a) return te(b);
}
function Ge(a, b) {
  return a === b && (0 !== a || 1 / a === 1 / b) || a !== a && b !== b;
}
var He = "function" === typeof Object.is ? Object.is : Ge;
function Ie(a, b) {
  if (He(a, b)) return true;
  if ("object" !== typeof a || null === a || "object" !== typeof b || null === b) return false;
  var c = Object.keys(a), d = Object.keys(b);
  if (c.length !== d.length) return false;
  for (d = 0; d < c.length; d++) {
    var e = c[d];
    if (!ja.call(b, e) || !He(a[e], b[e])) return false;
  }
  return true;
}
function Je(a) {
  for (; a && a.firstChild; ) a = a.firstChild;
  return a;
}
function Ke(a, b) {
  var c = Je(a);
  a = 0;
  for (var d; c; ) {
    if (3 === c.nodeType) {
      d = a + c.textContent.length;
      if (a <= b && d >= b) return { node: c, offset: b - a };
      a = d;
    }
    a: {
      for (; c; ) {
        if (c.nextSibling) {
          c = c.nextSibling;
          break a;
        }
        c = c.parentNode;
      }
      c = void 0;
    }
    c = Je(c);
  }
}
function Le(a, b) {
  return a && b ? a === b ? true : a && 3 === a.nodeType ? false : b && 3 === b.nodeType ? Le(a, b.parentNode) : "contains" in a ? a.contains(b) : a.compareDocumentPosition ? !!(a.compareDocumentPosition(b) & 16) : false : false;
}
function Me() {
  for (var a = window, b = Xa(); b instanceof a.HTMLIFrameElement; ) {
    try {
      var c = "string" === typeof b.contentWindow.location.href;
    } catch (d) {
      c = false;
    }
    if (c) a = b.contentWindow;
    else break;
    b = Xa(a.document);
  }
  return b;
}
function Ne(a) {
  var b = a && a.nodeName && a.nodeName.toLowerCase();
  return b && ("input" === b && ("text" === a.type || "search" === a.type || "tel" === a.type || "url" === a.type || "password" === a.type) || "textarea" === b || "true" === a.contentEditable);
}
function Oe(a) {
  var b = Me(), c = a.focusedElem, d = a.selectionRange;
  if (b !== c && c && c.ownerDocument && Le(c.ownerDocument.documentElement, c)) {
    if (null !== d && Ne(c)) {
      if (b = d.start, a = d.end, void 0 === a && (a = b), "selectionStart" in c) c.selectionStart = b, c.selectionEnd = Math.min(a, c.value.length);
      else if (a = (b = c.ownerDocument || document) && b.defaultView || window, a.getSelection) {
        a = a.getSelection();
        var e = c.textContent.length, f2 = Math.min(d.start, e);
        d = void 0 === d.end ? f2 : Math.min(d.end, e);
        !a.extend && f2 > d && (e = d, d = f2, f2 = e);
        e = Ke(c, f2);
        var g = Ke(
          c,
          d
        );
        e && g && (1 !== a.rangeCount || a.anchorNode !== e.node || a.anchorOffset !== e.offset || a.focusNode !== g.node || a.focusOffset !== g.offset) && (b = b.createRange(), b.setStart(e.node, e.offset), a.removeAllRanges(), f2 > d ? (a.addRange(b), a.extend(g.node, g.offset)) : (b.setEnd(g.node, g.offset), a.addRange(b)));
      }
    }
    b = [];
    for (a = c; a = a.parentNode; ) 1 === a.nodeType && b.push({ element: a, left: a.scrollLeft, top: a.scrollTop });
    "function" === typeof c.focus && c.focus();
    for (c = 0; c < b.length; c++) a = b[c], a.element.scrollLeft = a.left, a.element.scrollTop = a.top;
  }
}
var Pe = ia && "documentMode" in document && 11 >= document.documentMode, Qe = null, Re = null, Se = null, Te = false;
function Ue(a, b, c) {
  var d = c.window === c ? c.document : 9 === c.nodeType ? c : c.ownerDocument;
  Te || null == Qe || Qe !== Xa(d) || (d = Qe, "selectionStart" in d && Ne(d) ? d = { start: d.selectionStart, end: d.selectionEnd } : (d = (d.ownerDocument && d.ownerDocument.defaultView || window).getSelection(), d = { anchorNode: d.anchorNode, anchorOffset: d.anchorOffset, focusNode: d.focusNode, focusOffset: d.focusOffset }), Se && Ie(Se, d) || (Se = d, d = oe(Re, "onSelect"), 0 < d.length && (b = new td("onSelect", "select", null, b, c), a.push({ event: b, listeners: d }), b.target = Qe)));
}
function Ve(a, b) {
  var c = {};
  c[a.toLowerCase()] = b.toLowerCase();
  c["Webkit" + a] = "webkit" + b;
  c["Moz" + a] = "moz" + b;
  return c;
}
var We = { animationend: Ve("Animation", "AnimationEnd"), animationiteration: Ve("Animation", "AnimationIteration"), animationstart: Ve("Animation", "AnimationStart"), transitionend: Ve("Transition", "TransitionEnd") }, Xe = {}, Ye = {};
ia && (Ye = document.createElement("div").style, "AnimationEvent" in window || (delete We.animationend.animation, delete We.animationiteration.animation, delete We.animationstart.animation), "TransitionEvent" in window || delete We.transitionend.transition);
function Ze(a) {
  if (Xe[a]) return Xe[a];
  if (!We[a]) return a;
  var b = We[a], c;
  for (c in b) if (b.hasOwnProperty(c) && c in Ye) return Xe[a] = b[c];
  return a;
}
var $e = Ze("animationend"), af = Ze("animationiteration"), bf = Ze("animationstart"), cf = Ze("transitionend"), df = /* @__PURE__ */ new Map(), ef = "abort auxClick cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel".split(" ");
function ff(a, b) {
  df.set(a, b);
  fa(b, [a]);
}
for (var gf = 0; gf < ef.length; gf++) {
  var hf = ef[gf], jf = hf.toLowerCase(), kf = hf[0].toUpperCase() + hf.slice(1);
  ff(jf, "on" + kf);
}
ff($e, "onAnimationEnd");
ff(af, "onAnimationIteration");
ff(bf, "onAnimationStart");
ff("dblclick", "onDoubleClick");
ff("focusin", "onFocus");
ff("focusout", "onBlur");
ff(cf, "onTransitionEnd");
ha("onMouseEnter", ["mouseout", "mouseover"]);
ha("onMouseLeave", ["mouseout", "mouseover"]);
ha("onPointerEnter", ["pointerout", "pointerover"]);
ha("onPointerLeave", ["pointerout", "pointerover"]);
fa("onChange", "change click focusin focusout input keydown keyup selectionchange".split(" "));
fa("onSelect", "focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange".split(" "));
fa("onBeforeInput", ["compositionend", "keypress", "textInput", "paste"]);
fa("onCompositionEnd", "compositionend focusout keydown keypress keyup mousedown".split(" "));
fa("onCompositionStart", "compositionstart focusout keydown keypress keyup mousedown".split(" "));
fa("onCompositionUpdate", "compositionupdate focusout keydown keypress keyup mousedown".split(" "));
var lf = "abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting".split(" "), mf = new Set("cancel close invalid load scroll toggle".split(" ").concat(lf));
function nf(a, b, c) {
  var d = a.type || "unknown-event";
  a.currentTarget = c;
  Ub(d, b, void 0, a);
  a.currentTarget = null;
}
function se(a, b) {
  b = 0 !== (b & 4);
  for (var c = 0; c < a.length; c++) {
    var d = a[c], e = d.event;
    d = d.listeners;
    a: {
      var f2 = void 0;
      if (b) for (var g = d.length - 1; 0 <= g; g--) {
        var h = d[g], k2 = h.instance, l2 = h.currentTarget;
        h = h.listener;
        if (k2 !== f2 && e.isPropagationStopped()) break a;
        nf(e, h, l2);
        f2 = k2;
      }
      else for (g = 0; g < d.length; g++) {
        h = d[g];
        k2 = h.instance;
        l2 = h.currentTarget;
        h = h.listener;
        if (k2 !== f2 && e.isPropagationStopped()) break a;
        nf(e, h, l2);
        f2 = k2;
      }
    }
  }
  if (Qb) throw a = Rb, Qb = false, Rb = null, a;
}
function D(a, b) {
  var c = b[of];
  void 0 === c && (c = b[of] = /* @__PURE__ */ new Set());
  var d = a + "__bubble";
  c.has(d) || (pf(b, a, 2, false), c.add(d));
}
function qf(a, b, c) {
  var d = 0;
  b && (d |= 4);
  pf(c, a, d, b);
}
var rf = "_reactListening" + Math.random().toString(36).slice(2);
function sf(a) {
  if (!a[rf]) {
    a[rf] = true;
    da.forEach(function(b2) {
      "selectionchange" !== b2 && (mf.has(b2) || qf(b2, false, a), qf(b2, true, a));
    });
    var b = 9 === a.nodeType ? a : a.ownerDocument;
    null === b || b[rf] || (b[rf] = true, qf("selectionchange", false, b));
  }
}
function pf(a, b, c, d) {
  switch (jd(b)) {
    case 1:
      var e = ed;
      break;
    case 4:
      e = gd;
      break;
    default:
      e = fd;
  }
  c = e.bind(null, b, c, a);
  e = void 0;
  !Lb || "touchstart" !== b && "touchmove" !== b && "wheel" !== b || (e = true);
  d ? void 0 !== e ? a.addEventListener(b, c, { capture: true, passive: e }) : a.addEventListener(b, c, true) : void 0 !== e ? a.addEventListener(b, c, { passive: e }) : a.addEventListener(b, c, false);
}
function hd(a, b, c, d, e) {
  var f2 = d;
  if (0 === (b & 1) && 0 === (b & 2) && null !== d) a: for (; ; ) {
    if (null === d) return;
    var g = d.tag;
    if (3 === g || 4 === g) {
      var h = d.stateNode.containerInfo;
      if (h === e || 8 === h.nodeType && h.parentNode === e) break;
      if (4 === g) for (g = d.return; null !== g; ) {
        var k2 = g.tag;
        if (3 === k2 || 4 === k2) {
          if (k2 = g.stateNode.containerInfo, k2 === e || 8 === k2.nodeType && k2.parentNode === e) return;
        }
        g = g.return;
      }
      for (; null !== h; ) {
        g = Wc(h);
        if (null === g) return;
        k2 = g.tag;
        if (5 === k2 || 6 === k2) {
          d = f2 = g;
          continue a;
        }
        h = h.parentNode;
      }
    }
    d = d.return;
  }
  Jb(function() {
    var d2 = f2, e2 = xb(c), g2 = [];
    a: {
      var h2 = df.get(a);
      if (void 0 !== h2) {
        var k3 = td, n2 = a;
        switch (a) {
          case "keypress":
            if (0 === od(c)) break a;
          case "keydown":
          case "keyup":
            k3 = Rd;
            break;
          case "focusin":
            n2 = "focus";
            k3 = Fd;
            break;
          case "focusout":
            n2 = "blur";
            k3 = Fd;
            break;
          case "beforeblur":
          case "afterblur":
            k3 = Fd;
            break;
          case "click":
            if (2 === c.button) break a;
          case "auxclick":
          case "dblclick":
          case "mousedown":
          case "mousemove":
          case "mouseup":
          case "mouseout":
          case "mouseover":
          case "contextmenu":
            k3 = Bd;
            break;
          case "drag":
          case "dragend":
          case "dragenter":
          case "dragexit":
          case "dragleave":
          case "dragover":
          case "dragstart":
          case "drop":
            k3 = Dd;
            break;
          case "touchcancel":
          case "touchend":
          case "touchmove":
          case "touchstart":
            k3 = Vd;
            break;
          case $e:
          case af:
          case bf:
            k3 = Hd;
            break;
          case cf:
            k3 = Xd;
            break;
          case "scroll":
            k3 = vd;
            break;
          case "wheel":
            k3 = Zd;
            break;
          case "copy":
          case "cut":
          case "paste":
            k3 = Jd;
            break;
          case "gotpointercapture":
          case "lostpointercapture":
          case "pointercancel":
          case "pointerdown":
          case "pointermove":
          case "pointerout":
          case "pointerover":
          case "pointerup":
            k3 = Td;
        }
        var t2 = 0 !== (b & 4), J2 = !t2 && "scroll" === a, x2 = t2 ? null !== h2 ? h2 + "Capture" : null : h2;
        t2 = [];
        for (var w2 = d2, u2; null !== w2; ) {
          u2 = w2;
          var F2 = u2.stateNode;
          5 === u2.tag && null !== F2 && (u2 = F2, null !== x2 && (F2 = Kb(w2, x2), null != F2 && t2.push(tf(w2, F2, u2))));
          if (J2) break;
          w2 = w2.return;
        }
        0 < t2.length && (h2 = new k3(h2, n2, null, c, e2), g2.push({ event: h2, listeners: t2 }));
      }
    }
    if (0 === (b & 7)) {
      a: {
        h2 = "mouseover" === a || "pointerover" === a;
        k3 = "mouseout" === a || "pointerout" === a;
        if (h2 && c !== wb && (n2 = c.relatedTarget || c.fromElement) && (Wc(n2) || n2[uf])) break a;
        if (k3 || h2) {
          h2 = e2.window === e2 ? e2 : (h2 = e2.ownerDocument) ? h2.defaultView || h2.parentWindow : window;
          if (k3) {
            if (n2 = c.relatedTarget || c.toElement, k3 = d2, n2 = n2 ? Wc(n2) : null, null !== n2 && (J2 = Vb(n2), n2 !== J2 || 5 !== n2.tag && 6 !== n2.tag)) n2 = null;
          } else k3 = null, n2 = d2;
          if (k3 !== n2) {
            t2 = Bd;
            F2 = "onMouseLeave";
            x2 = "onMouseEnter";
            w2 = "mouse";
            if ("pointerout" === a || "pointerover" === a) t2 = Td, F2 = "onPointerLeave", x2 = "onPointerEnter", w2 = "pointer";
            J2 = null == k3 ? h2 : ue(k3);
            u2 = null == n2 ? h2 : ue(n2);
            h2 = new t2(F2, w2 + "leave", k3, c, e2);
            h2.target = J2;
            h2.relatedTarget = u2;
            F2 = null;
            Wc(e2) === d2 && (t2 = new t2(x2, w2 + "enter", n2, c, e2), t2.target = u2, t2.relatedTarget = J2, F2 = t2);
            J2 = F2;
            if (k3 && n2) b: {
              t2 = k3;
              x2 = n2;
              w2 = 0;
              for (u2 = t2; u2; u2 = vf(u2)) w2++;
              u2 = 0;
              for (F2 = x2; F2; F2 = vf(F2)) u2++;
              for (; 0 < w2 - u2; ) t2 = vf(t2), w2--;
              for (; 0 < u2 - w2; ) x2 = vf(x2), u2--;
              for (; w2--; ) {
                if (t2 === x2 || null !== x2 && t2 === x2.alternate) break b;
                t2 = vf(t2);
                x2 = vf(x2);
              }
              t2 = null;
            }
            else t2 = null;
            null !== k3 && wf(g2, h2, k3, t2, false);
            null !== n2 && null !== J2 && wf(g2, J2, n2, t2, true);
          }
        }
      }
      a: {
        h2 = d2 ? ue(d2) : window;
        k3 = h2.nodeName && h2.nodeName.toLowerCase();
        if ("select" === k3 || "input" === k3 && "file" === h2.type) var na = ve;
        else if (me(h2)) if (we) na = Fe;
        else {
          na = De;
          var xa = Ce;
        }
        else (k3 = h2.nodeName) && "input" === k3.toLowerCase() && ("checkbox" === h2.type || "radio" === h2.type) && (na = Ee);
        if (na && (na = na(a, d2))) {
          ne(g2, na, c, e2);
          break a;
        }
        xa && xa(a, h2, d2);
        "focusout" === a && (xa = h2._wrapperState) && xa.controlled && "number" === h2.type && cb(h2, "number", h2.value);
      }
      xa = d2 ? ue(d2) : window;
      switch (a) {
        case "focusin":
          if (me(xa) || "true" === xa.contentEditable) Qe = xa, Re = d2, Se = null;
          break;
        case "focusout":
          Se = Re = Qe = null;
          break;
        case "mousedown":
          Te = true;
          break;
        case "contextmenu":
        case "mouseup":
        case "dragend":
          Te = false;
          Ue(g2, c, e2);
          break;
        case "selectionchange":
          if (Pe) break;
        case "keydown":
        case "keyup":
          Ue(g2, c, e2);
      }
      var $a;
      if (ae) b: {
        switch (a) {
          case "compositionstart":
            var ba = "onCompositionStart";
            break b;
          case "compositionend":
            ba = "onCompositionEnd";
            break b;
          case "compositionupdate":
            ba = "onCompositionUpdate";
            break b;
        }
        ba = void 0;
      }
      else ie ? ge(a, c) && (ba = "onCompositionEnd") : "keydown" === a && 229 === c.keyCode && (ba = "onCompositionStart");
      ba && (de && "ko" !== c.locale && (ie || "onCompositionStart" !== ba ? "onCompositionEnd" === ba && ie && ($a = nd()) : (kd = e2, ld = "value" in kd ? kd.value : kd.textContent, ie = true)), xa = oe(d2, ba), 0 < xa.length && (ba = new Ld(ba, a, null, c, e2), g2.push({ event: ba, listeners: xa }), $a ? ba.data = $a : ($a = he(c), null !== $a && (ba.data = $a))));
      if ($a = ce ? je(a, c) : ke(a, c)) d2 = oe(d2, "onBeforeInput"), 0 < d2.length && (e2 = new Ld("onBeforeInput", "beforeinput", null, c, e2), g2.push({ event: e2, listeners: d2 }), e2.data = $a);
    }
    se(g2, b);
  });
}
function tf(a, b, c) {
  return { instance: a, listener: b, currentTarget: c };
}
function oe(a, b) {
  for (var c = b + "Capture", d = []; null !== a; ) {
    var e = a, f2 = e.stateNode;
    5 === e.tag && null !== f2 && (e = f2, f2 = Kb(a, c), null != f2 && d.unshift(tf(a, f2, e)), f2 = Kb(a, b), null != f2 && d.push(tf(a, f2, e)));
    a = a.return;
  }
  return d;
}
function vf(a) {
  if (null === a) return null;
  do
    a = a.return;
  while (a && 5 !== a.tag);
  return a ? a : null;
}
function wf(a, b, c, d, e) {
  for (var f2 = b._reactName, g = []; null !== c && c !== d; ) {
    var h = c, k2 = h.alternate, l2 = h.stateNode;
    if (null !== k2 && k2 === d) break;
    5 === h.tag && null !== l2 && (h = l2, e ? (k2 = Kb(c, f2), null != k2 && g.unshift(tf(c, k2, h))) : e || (k2 = Kb(c, f2), null != k2 && g.push(tf(c, k2, h))));
    c = c.return;
  }
  0 !== g.length && a.push({ event: b, listeners: g });
}
var xf = /\r\n?/g, yf = /\u0000|\uFFFD/g;
function zf(a) {
  return ("string" === typeof a ? a : "" + a).replace(xf, "\n").replace(yf, "");
}
function Af(a, b, c) {
  b = zf(b);
  if (zf(a) !== b && c) throw Error(p(425));
}
function Bf() {
}
var Cf = null, Df = null;
function Ef(a, b) {
  return "textarea" === a || "noscript" === a || "string" === typeof b.children || "number" === typeof b.children || "object" === typeof b.dangerouslySetInnerHTML && null !== b.dangerouslySetInnerHTML && null != b.dangerouslySetInnerHTML.__html;
}
var Ff = "function" === typeof setTimeout ? setTimeout : void 0, Gf = "function" === typeof clearTimeout ? clearTimeout : void 0, Hf = "function" === typeof Promise ? Promise : void 0, Jf = "function" === typeof queueMicrotask ? queueMicrotask : "undefined" !== typeof Hf ? function(a) {
  return Hf.resolve(null).then(a).catch(If);
} : Ff;
function If(a) {
  setTimeout(function() {
    throw a;
  });
}
function Kf(a, b) {
  var c = b, d = 0;
  do {
    var e = c.nextSibling;
    a.removeChild(c);
    if (e && 8 === e.nodeType) if (c = e.data, "/$" === c) {
      if (0 === d) {
        a.removeChild(e);
        bd(b);
        return;
      }
      d--;
    } else "$" !== c && "$?" !== c && "$!" !== c || d++;
    c = e;
  } while (c);
  bd(b);
}
function Lf(a) {
  for (; null != a; a = a.nextSibling) {
    var b = a.nodeType;
    if (1 === b || 3 === b) break;
    if (8 === b) {
      b = a.data;
      if ("$" === b || "$!" === b || "$?" === b) break;
      if ("/$" === b) return null;
    }
  }
  return a;
}
function Mf(a) {
  a = a.previousSibling;
  for (var b = 0; a; ) {
    if (8 === a.nodeType) {
      var c = a.data;
      if ("$" === c || "$!" === c || "$?" === c) {
        if (0 === b) return a;
        b--;
      } else "/$" === c && b++;
    }
    a = a.previousSibling;
  }
  return null;
}
var Nf = Math.random().toString(36).slice(2), Of = "__reactFiber$" + Nf, Pf = "__reactProps$" + Nf, uf = "__reactContainer$" + Nf, of = "__reactEvents$" + Nf, Qf = "__reactListeners$" + Nf, Rf = "__reactHandles$" + Nf;
function Wc(a) {
  var b = a[Of];
  if (b) return b;
  for (var c = a.parentNode; c; ) {
    if (b = c[uf] || c[Of]) {
      c = b.alternate;
      if (null !== b.child || null !== c && null !== c.child) for (a = Mf(a); null !== a; ) {
        if (c = a[Of]) return c;
        a = Mf(a);
      }
      return b;
    }
    a = c;
    c = a.parentNode;
  }
  return null;
}
function Cb(a) {
  a = a[Of] || a[uf];
  return !a || 5 !== a.tag && 6 !== a.tag && 13 !== a.tag && 3 !== a.tag ? null : a;
}
function ue(a) {
  if (5 === a.tag || 6 === a.tag) return a.stateNode;
  throw Error(p(33));
}
function Db(a) {
  return a[Pf] || null;
}
var Sf = [], Tf = -1;
function Uf(a) {
  return { current: a };
}
function E(a) {
  0 > Tf || (a.current = Sf[Tf], Sf[Tf] = null, Tf--);
}
function G(a, b) {
  Tf++;
  Sf[Tf] = a.current;
  a.current = b;
}
var Vf = {}, H = Uf(Vf), Wf = Uf(false), Xf = Vf;
function Yf(a, b) {
  var c = a.type.contextTypes;
  if (!c) return Vf;
  var d = a.stateNode;
  if (d && d.__reactInternalMemoizedUnmaskedChildContext === b) return d.__reactInternalMemoizedMaskedChildContext;
  var e = {}, f2;
  for (f2 in c) e[f2] = b[f2];
  d && (a = a.stateNode, a.__reactInternalMemoizedUnmaskedChildContext = b, a.__reactInternalMemoizedMaskedChildContext = e);
  return e;
}
function Zf(a) {
  a = a.childContextTypes;
  return null !== a && void 0 !== a;
}
function $f() {
  E(Wf);
  E(H);
}
function ag(a, b, c) {
  if (H.current !== Vf) throw Error(p(168));
  G(H, b);
  G(Wf, c);
}
function bg(a, b, c) {
  var d = a.stateNode;
  b = b.childContextTypes;
  if ("function" !== typeof d.getChildContext) return c;
  d = d.getChildContext();
  for (var e in d) if (!(e in b)) throw Error(p(108, Ra(a) || "Unknown", e));
  return A({}, c, d);
}
function cg(a) {
  a = (a = a.stateNode) && a.__reactInternalMemoizedMergedChildContext || Vf;
  Xf = H.current;
  G(H, a);
  G(Wf, Wf.current);
  return true;
}
function dg(a, b, c) {
  var d = a.stateNode;
  if (!d) throw Error(p(169));
  c ? (a = bg(a, b, Xf), d.__reactInternalMemoizedMergedChildContext = a, E(Wf), E(H), G(H, a)) : E(Wf);
  G(Wf, c);
}
var eg = null, fg = false, gg = false;
function hg(a) {
  null === eg ? eg = [a] : eg.push(a);
}
function ig(a) {
  fg = true;
  hg(a);
}
function jg() {
  if (!gg && null !== eg) {
    gg = true;
    var a = 0, b = C;
    try {
      var c = eg;
      for (C = 1; a < c.length; a++) {
        var d = c[a];
        do
          d = d(true);
        while (null !== d);
      }
      eg = null;
      fg = false;
    } catch (e) {
      throw null !== eg && (eg = eg.slice(a + 1)), ac(fc, jg), e;
    } finally {
      C = b, gg = false;
    }
  }
  return null;
}
var kg = [], lg = 0, mg = null, ng = 0, og = [], pg = 0, qg = null, rg = 1, sg = "";
function tg(a, b) {
  kg[lg++] = ng;
  kg[lg++] = mg;
  mg = a;
  ng = b;
}
function ug(a, b, c) {
  og[pg++] = rg;
  og[pg++] = sg;
  og[pg++] = qg;
  qg = a;
  var d = rg;
  a = sg;
  var e = 32 - oc(d) - 1;
  d &= ~(1 << e);
  c += 1;
  var f2 = 32 - oc(b) + e;
  if (30 < f2) {
    var g = e - e % 5;
    f2 = (d & (1 << g) - 1).toString(32);
    d >>= g;
    e -= g;
    rg = 1 << 32 - oc(b) + e | c << e | d;
    sg = f2 + a;
  } else rg = 1 << f2 | c << e | d, sg = a;
}
function vg(a) {
  null !== a.return && (tg(a, 1), ug(a, 1, 0));
}
function wg(a) {
  for (; a === mg; ) mg = kg[--lg], kg[lg] = null, ng = kg[--lg], kg[lg] = null;
  for (; a === qg; ) qg = og[--pg], og[pg] = null, sg = og[--pg], og[pg] = null, rg = og[--pg], og[pg] = null;
}
var xg = null, yg = null, I = false, zg = null;
function Ag(a, b) {
  var c = Bg(5, null, null, 0);
  c.elementType = "DELETED";
  c.stateNode = b;
  c.return = a;
  b = a.deletions;
  null === b ? (a.deletions = [c], a.flags |= 16) : b.push(c);
}
function Cg(a, b) {
  switch (a.tag) {
    case 5:
      var c = a.type;
      b = 1 !== b.nodeType || c.toLowerCase() !== b.nodeName.toLowerCase() ? null : b;
      return null !== b ? (a.stateNode = b, xg = a, yg = Lf(b.firstChild), true) : false;
    case 6:
      return b = "" === a.pendingProps || 3 !== b.nodeType ? null : b, null !== b ? (a.stateNode = b, xg = a, yg = null, true) : false;
    case 13:
      return b = 8 !== b.nodeType ? null : b, null !== b ? (c = null !== qg ? { id: rg, overflow: sg } : null, a.memoizedState = { dehydrated: b, treeContext: c, retryLane: 1073741824 }, c = Bg(18, null, null, 0), c.stateNode = b, c.return = a, a.child = c, xg = a, yg = null, true) : false;
    default:
      return false;
  }
}
function Dg(a) {
  return 0 !== (a.mode & 1) && 0 === (a.flags & 128);
}
function Eg(a) {
  if (I) {
    var b = yg;
    if (b) {
      var c = b;
      if (!Cg(a, b)) {
        if (Dg(a)) throw Error(p(418));
        b = Lf(c.nextSibling);
        var d = xg;
        b && Cg(a, b) ? Ag(d, c) : (a.flags = a.flags & -4097 | 2, I = false, xg = a);
      }
    } else {
      if (Dg(a)) throw Error(p(418));
      a.flags = a.flags & -4097 | 2;
      I = false;
      xg = a;
    }
  }
}
function Fg(a) {
  for (a = a.return; null !== a && 5 !== a.tag && 3 !== a.tag && 13 !== a.tag; ) a = a.return;
  xg = a;
}
function Gg(a) {
  if (a !== xg) return false;
  if (!I) return Fg(a), I = true, false;
  var b;
  (b = 3 !== a.tag) && !(b = 5 !== a.tag) && (b = a.type, b = "head" !== b && "body" !== b && !Ef(a.type, a.memoizedProps));
  if (b && (b = yg)) {
    if (Dg(a)) throw Hg(), Error(p(418));
    for (; b; ) Ag(a, b), b = Lf(b.nextSibling);
  }
  Fg(a);
  if (13 === a.tag) {
    a = a.memoizedState;
    a = null !== a ? a.dehydrated : null;
    if (!a) throw Error(p(317));
    a: {
      a = a.nextSibling;
      for (b = 0; a; ) {
        if (8 === a.nodeType) {
          var c = a.data;
          if ("/$" === c) {
            if (0 === b) {
              yg = Lf(a.nextSibling);
              break a;
            }
            b--;
          } else "$" !== c && "$!" !== c && "$?" !== c || b++;
        }
        a = a.nextSibling;
      }
      yg = null;
    }
  } else yg = xg ? Lf(a.stateNode.nextSibling) : null;
  return true;
}
function Hg() {
  for (var a = yg; a; ) a = Lf(a.nextSibling);
}
function Ig() {
  yg = xg = null;
  I = false;
}
function Jg(a) {
  null === zg ? zg = [a] : zg.push(a);
}
var Kg = ua.ReactCurrentBatchConfig;
function Lg(a, b, c) {
  a = c.ref;
  if (null !== a && "function" !== typeof a && "object" !== typeof a) {
    if (c._owner) {
      c = c._owner;
      if (c) {
        if (1 !== c.tag) throw Error(p(309));
        var d = c.stateNode;
      }
      if (!d) throw Error(p(147, a));
      var e = d, f2 = "" + a;
      if (null !== b && null !== b.ref && "function" === typeof b.ref && b.ref._stringRef === f2) return b.ref;
      b = function(a2) {
        var b2 = e.refs;
        null === a2 ? delete b2[f2] : b2[f2] = a2;
      };
      b._stringRef = f2;
      return b;
    }
    if ("string" !== typeof a) throw Error(p(284));
    if (!c._owner) throw Error(p(290, a));
  }
  return a;
}
function Mg(a, b) {
  a = Object.prototype.toString.call(b);
  throw Error(p(31, "[object Object]" === a ? "object with keys {" + Object.keys(b).join(", ") + "}" : a));
}
function Ng(a) {
  var b = a._init;
  return b(a._payload);
}
function Og(a) {
  function b(b2, c2) {
    if (a) {
      var d2 = b2.deletions;
      null === d2 ? (b2.deletions = [c2], b2.flags |= 16) : d2.push(c2);
    }
  }
  function c(c2, d2) {
    if (!a) return null;
    for (; null !== d2; ) b(c2, d2), d2 = d2.sibling;
    return null;
  }
  function d(a2, b2) {
    for (a2 = /* @__PURE__ */ new Map(); null !== b2; ) null !== b2.key ? a2.set(b2.key, b2) : a2.set(b2.index, b2), b2 = b2.sibling;
    return a2;
  }
  function e(a2, b2) {
    a2 = Pg(a2, b2);
    a2.index = 0;
    a2.sibling = null;
    return a2;
  }
  function f2(b2, c2, d2) {
    b2.index = d2;
    if (!a) return b2.flags |= 1048576, c2;
    d2 = b2.alternate;
    if (null !== d2) return d2 = d2.index, d2 < c2 ? (b2.flags |= 2, c2) : d2;
    b2.flags |= 2;
    return c2;
  }
  function g(b2) {
    a && null === b2.alternate && (b2.flags |= 2);
    return b2;
  }
  function h(a2, b2, c2, d2) {
    if (null === b2 || 6 !== b2.tag) return b2 = Qg(c2, a2.mode, d2), b2.return = a2, b2;
    b2 = e(b2, c2);
    b2.return = a2;
    return b2;
  }
  function k2(a2, b2, c2, d2) {
    var f3 = c2.type;
    if (f3 === ya) return m2(a2, b2, c2.props.children, d2, c2.key);
    if (null !== b2 && (b2.elementType === f3 || "object" === typeof f3 && null !== f3 && f3.$$typeof === Ha && Ng(f3) === b2.type)) return d2 = e(b2, c2.props), d2.ref = Lg(a2, b2, c2), d2.return = a2, d2;
    d2 = Rg(c2.type, c2.key, c2.props, null, a2.mode, d2);
    d2.ref = Lg(a2, b2, c2);
    d2.return = a2;
    return d2;
  }
  function l2(a2, b2, c2, d2) {
    if (null === b2 || 4 !== b2.tag || b2.stateNode.containerInfo !== c2.containerInfo || b2.stateNode.implementation !== c2.implementation) return b2 = Sg(c2, a2.mode, d2), b2.return = a2, b2;
    b2 = e(b2, c2.children || []);
    b2.return = a2;
    return b2;
  }
  function m2(a2, b2, c2, d2, f3) {
    if (null === b2 || 7 !== b2.tag) return b2 = Tg(c2, a2.mode, d2, f3), b2.return = a2, b2;
    b2 = e(b2, c2);
    b2.return = a2;
    return b2;
  }
  function q2(a2, b2, c2) {
    if ("string" === typeof b2 && "" !== b2 || "number" === typeof b2) return b2 = Qg("" + b2, a2.mode, c2), b2.return = a2, b2;
    if ("object" === typeof b2 && null !== b2) {
      switch (b2.$$typeof) {
        case va:
          return c2 = Rg(b2.type, b2.key, b2.props, null, a2.mode, c2), c2.ref = Lg(a2, null, b2), c2.return = a2, c2;
        case wa:
          return b2 = Sg(b2, a2.mode, c2), b2.return = a2, b2;
        case Ha:
          var d2 = b2._init;
          return q2(a2, d2(b2._payload), c2);
      }
      if (eb(b2) || Ka(b2)) return b2 = Tg(b2, a2.mode, c2, null), b2.return = a2, b2;
      Mg(a2, b2);
    }
    return null;
  }
  function r2(a2, b2, c2, d2) {
    var e2 = null !== b2 ? b2.key : null;
    if ("string" === typeof c2 && "" !== c2 || "number" === typeof c2) return null !== e2 ? null : h(a2, b2, "" + c2, d2);
    if ("object" === typeof c2 && null !== c2) {
      switch (c2.$$typeof) {
        case va:
          return c2.key === e2 ? k2(a2, b2, c2, d2) : null;
        case wa:
          return c2.key === e2 ? l2(a2, b2, c2, d2) : null;
        case Ha:
          return e2 = c2._init, r2(
            a2,
            b2,
            e2(c2._payload),
            d2
          );
      }
      if (eb(c2) || Ka(c2)) return null !== e2 ? null : m2(a2, b2, c2, d2, null);
      Mg(a2, c2);
    }
    return null;
  }
  function y2(a2, b2, c2, d2, e2) {
    if ("string" === typeof d2 && "" !== d2 || "number" === typeof d2) return a2 = a2.get(c2) || null, h(b2, a2, "" + d2, e2);
    if ("object" === typeof d2 && null !== d2) {
      switch (d2.$$typeof) {
        case va:
          return a2 = a2.get(null === d2.key ? c2 : d2.key) || null, k2(b2, a2, d2, e2);
        case wa:
          return a2 = a2.get(null === d2.key ? c2 : d2.key) || null, l2(b2, a2, d2, e2);
        case Ha:
          var f3 = d2._init;
          return y2(a2, b2, c2, f3(d2._payload), e2);
      }
      if (eb(d2) || Ka(d2)) return a2 = a2.get(c2) || null, m2(b2, a2, d2, e2, null);
      Mg(b2, d2);
    }
    return null;
  }
  function n2(e2, g2, h2, k3) {
    for (var l3 = null, m3 = null, u2 = g2, w2 = g2 = 0, x2 = null; null !== u2 && w2 < h2.length; w2++) {
      u2.index > w2 ? (x2 = u2, u2 = null) : x2 = u2.sibling;
      var n3 = r2(e2, u2, h2[w2], k3);
      if (null === n3) {
        null === u2 && (u2 = x2);
        break;
      }
      a && u2 && null === n3.alternate && b(e2, u2);
      g2 = f2(n3, g2, w2);
      null === m3 ? l3 = n3 : m3.sibling = n3;
      m3 = n3;
      u2 = x2;
    }
    if (w2 === h2.length) return c(e2, u2), I && tg(e2, w2), l3;
    if (null === u2) {
      for (; w2 < h2.length; w2++) u2 = q2(e2, h2[w2], k3), null !== u2 && (g2 = f2(u2, g2, w2), null === m3 ? l3 = u2 : m3.sibling = u2, m3 = u2);
      I && tg(e2, w2);
      return l3;
    }
    for (u2 = d(e2, u2); w2 < h2.length; w2++) x2 = y2(u2, e2, w2, h2[w2], k3), null !== x2 && (a && null !== x2.alternate && u2.delete(null === x2.key ? w2 : x2.key), g2 = f2(x2, g2, w2), null === m3 ? l3 = x2 : m3.sibling = x2, m3 = x2);
    a && u2.forEach(function(a2) {
      return b(e2, a2);
    });
    I && tg(e2, w2);
    return l3;
  }
  function t2(e2, g2, h2, k3) {
    var l3 = Ka(h2);
    if ("function" !== typeof l3) throw Error(p(150));
    h2 = l3.call(h2);
    if (null == h2) throw Error(p(151));
    for (var u2 = l3 = null, m3 = g2, w2 = g2 = 0, x2 = null, n3 = h2.next(); null !== m3 && !n3.done; w2++, n3 = h2.next()) {
      m3.index > w2 ? (x2 = m3, m3 = null) : x2 = m3.sibling;
      var t3 = r2(e2, m3, n3.value, k3);
      if (null === t3) {
        null === m3 && (m3 = x2);
        break;
      }
      a && m3 && null === t3.alternate && b(e2, m3);
      g2 = f2(t3, g2, w2);
      null === u2 ? l3 = t3 : u2.sibling = t3;
      u2 = t3;
      m3 = x2;
    }
    if (n3.done) return c(
      e2,
      m3
    ), I && tg(e2, w2), l3;
    if (null === m3) {
      for (; !n3.done; w2++, n3 = h2.next()) n3 = q2(e2, n3.value, k3), null !== n3 && (g2 = f2(n3, g2, w2), null === u2 ? l3 = n3 : u2.sibling = n3, u2 = n3);
      I && tg(e2, w2);
      return l3;
    }
    for (m3 = d(e2, m3); !n3.done; w2++, n3 = h2.next()) n3 = y2(m3, e2, w2, n3.value, k3), null !== n3 && (a && null !== n3.alternate && m3.delete(null === n3.key ? w2 : n3.key), g2 = f2(n3, g2, w2), null === u2 ? l3 = n3 : u2.sibling = n3, u2 = n3);
    a && m3.forEach(function(a2) {
      return b(e2, a2);
    });
    I && tg(e2, w2);
    return l3;
  }
  function J2(a2, d2, f3, h2) {
    "object" === typeof f3 && null !== f3 && f3.type === ya && null === f3.key && (f3 = f3.props.children);
    if ("object" === typeof f3 && null !== f3) {
      switch (f3.$$typeof) {
        case va:
          a: {
            for (var k3 = f3.key, l3 = d2; null !== l3; ) {
              if (l3.key === k3) {
                k3 = f3.type;
                if (k3 === ya) {
                  if (7 === l3.tag) {
                    c(a2, l3.sibling);
                    d2 = e(l3, f3.props.children);
                    d2.return = a2;
                    a2 = d2;
                    break a;
                  }
                } else if (l3.elementType === k3 || "object" === typeof k3 && null !== k3 && k3.$$typeof === Ha && Ng(k3) === l3.type) {
                  c(a2, l3.sibling);
                  d2 = e(l3, f3.props);
                  d2.ref = Lg(a2, l3, f3);
                  d2.return = a2;
                  a2 = d2;
                  break a;
                }
                c(a2, l3);
                break;
              } else b(a2, l3);
              l3 = l3.sibling;
            }
            f3.type === ya ? (d2 = Tg(f3.props.children, a2.mode, h2, f3.key), d2.return = a2, a2 = d2) : (h2 = Rg(f3.type, f3.key, f3.props, null, a2.mode, h2), h2.ref = Lg(a2, d2, f3), h2.return = a2, a2 = h2);
          }
          return g(a2);
        case wa:
          a: {
            for (l3 = f3.key; null !== d2; ) {
              if (d2.key === l3) if (4 === d2.tag && d2.stateNode.containerInfo === f3.containerInfo && d2.stateNode.implementation === f3.implementation) {
                c(a2, d2.sibling);
                d2 = e(d2, f3.children || []);
                d2.return = a2;
                a2 = d2;
                break a;
              } else {
                c(a2, d2);
                break;
              }
              else b(a2, d2);
              d2 = d2.sibling;
            }
            d2 = Sg(f3, a2.mode, h2);
            d2.return = a2;
            a2 = d2;
          }
          return g(a2);
        case Ha:
          return l3 = f3._init, J2(a2, d2, l3(f3._payload), h2);
      }
      if (eb(f3)) return n2(a2, d2, f3, h2);
      if (Ka(f3)) return t2(a2, d2, f3, h2);
      Mg(a2, f3);
    }
    return "string" === typeof f3 && "" !== f3 || "number" === typeof f3 ? (f3 = "" + f3, null !== d2 && 6 === d2.tag ? (c(a2, d2.sibling), d2 = e(d2, f3), d2.return = a2, a2 = d2) : (c(a2, d2), d2 = Qg(f3, a2.mode, h2), d2.return = a2, a2 = d2), g(a2)) : c(a2, d2);
  }
  return J2;
}
var Ug = Og(true), Vg = Og(false), Wg = Uf(null), Xg = null, Yg = null, Zg = null;
function $g() {
  Zg = Yg = Xg = null;
}
function ah(a) {
  var b = Wg.current;
  E(Wg);
  a._currentValue = b;
}
function bh(a, b, c) {
  for (; null !== a; ) {
    var d = a.alternate;
    (a.childLanes & b) !== b ? (a.childLanes |= b, null !== d && (d.childLanes |= b)) : null !== d && (d.childLanes & b) !== b && (d.childLanes |= b);
    if (a === c) break;
    a = a.return;
  }
}
function ch(a, b) {
  Xg = a;
  Zg = Yg = null;
  a = a.dependencies;
  null !== a && null !== a.firstContext && (0 !== (a.lanes & b) && (dh = true), a.firstContext = null);
}
function eh(a) {
  var b = a._currentValue;
  if (Zg !== a) if (a = { context: a, memoizedValue: b, next: null }, null === Yg) {
    if (null === Xg) throw Error(p(308));
    Yg = a;
    Xg.dependencies = { lanes: 0, firstContext: a };
  } else Yg = Yg.next = a;
  return b;
}
var fh = null;
function gh(a) {
  null === fh ? fh = [a] : fh.push(a);
}
function hh(a, b, c, d) {
  var e = b.interleaved;
  null === e ? (c.next = c, gh(b)) : (c.next = e.next, e.next = c);
  b.interleaved = c;
  return ih(a, d);
}
function ih(a, b) {
  a.lanes |= b;
  var c = a.alternate;
  null !== c && (c.lanes |= b);
  c = a;
  for (a = a.return; null !== a; ) a.childLanes |= b, c = a.alternate, null !== c && (c.childLanes |= b), c = a, a = a.return;
  return 3 === c.tag ? c.stateNode : null;
}
var jh = false;
function kh(a) {
  a.updateQueue = { baseState: a.memoizedState, firstBaseUpdate: null, lastBaseUpdate: null, shared: { pending: null, interleaved: null, lanes: 0 }, effects: null };
}
function lh(a, b) {
  a = a.updateQueue;
  b.updateQueue === a && (b.updateQueue = { baseState: a.baseState, firstBaseUpdate: a.firstBaseUpdate, lastBaseUpdate: a.lastBaseUpdate, shared: a.shared, effects: a.effects });
}
function mh(a, b) {
  return { eventTime: a, lane: b, tag: 0, payload: null, callback: null, next: null };
}
function nh(a, b, c) {
  var d = a.updateQueue;
  if (null === d) return null;
  d = d.shared;
  if (0 !== (K & 2)) {
    var e = d.pending;
    null === e ? b.next = b : (b.next = e.next, e.next = b);
    d.pending = b;
    return ih(a, c);
  }
  e = d.interleaved;
  null === e ? (b.next = b, gh(d)) : (b.next = e.next, e.next = b);
  d.interleaved = b;
  return ih(a, c);
}
function oh(a, b, c) {
  b = b.updateQueue;
  if (null !== b && (b = b.shared, 0 !== (c & 4194240))) {
    var d = b.lanes;
    d &= a.pendingLanes;
    c |= d;
    b.lanes = c;
    Cc(a, c);
  }
}
function ph(a, b) {
  var c = a.updateQueue, d = a.alternate;
  if (null !== d && (d = d.updateQueue, c === d)) {
    var e = null, f2 = null;
    c = c.firstBaseUpdate;
    if (null !== c) {
      do {
        var g = { eventTime: c.eventTime, lane: c.lane, tag: c.tag, payload: c.payload, callback: c.callback, next: null };
        null === f2 ? e = f2 = g : f2 = f2.next = g;
        c = c.next;
      } while (null !== c);
      null === f2 ? e = f2 = b : f2 = f2.next = b;
    } else e = f2 = b;
    c = { baseState: d.baseState, firstBaseUpdate: e, lastBaseUpdate: f2, shared: d.shared, effects: d.effects };
    a.updateQueue = c;
    return;
  }
  a = c.lastBaseUpdate;
  null === a ? c.firstBaseUpdate = b : a.next = b;
  c.lastBaseUpdate = b;
}
function qh(a, b, c, d) {
  var e = a.updateQueue;
  jh = false;
  var f2 = e.firstBaseUpdate, g = e.lastBaseUpdate, h = e.shared.pending;
  if (null !== h) {
    e.shared.pending = null;
    var k2 = h, l2 = k2.next;
    k2.next = null;
    null === g ? f2 = l2 : g.next = l2;
    g = k2;
    var m2 = a.alternate;
    null !== m2 && (m2 = m2.updateQueue, h = m2.lastBaseUpdate, h !== g && (null === h ? m2.firstBaseUpdate = l2 : h.next = l2, m2.lastBaseUpdate = k2));
  }
  if (null !== f2) {
    var q2 = e.baseState;
    g = 0;
    m2 = l2 = k2 = null;
    h = f2;
    do {
      var r2 = h.lane, y2 = h.eventTime;
      if ((d & r2) === r2) {
        null !== m2 && (m2 = m2.next = {
          eventTime: y2,
          lane: 0,
          tag: h.tag,
          payload: h.payload,
          callback: h.callback,
          next: null
        });
        a: {
          var n2 = a, t2 = h;
          r2 = b;
          y2 = c;
          switch (t2.tag) {
            case 1:
              n2 = t2.payload;
              if ("function" === typeof n2) {
                q2 = n2.call(y2, q2, r2);
                break a;
              }
              q2 = n2;
              break a;
            case 3:
              n2.flags = n2.flags & -65537 | 128;
            case 0:
              n2 = t2.payload;
              r2 = "function" === typeof n2 ? n2.call(y2, q2, r2) : n2;
              if (null === r2 || void 0 === r2) break a;
              q2 = A({}, q2, r2);
              break a;
            case 2:
              jh = true;
          }
        }
        null !== h.callback && 0 !== h.lane && (a.flags |= 64, r2 = e.effects, null === r2 ? e.effects = [h] : r2.push(h));
      } else y2 = { eventTime: y2, lane: r2, tag: h.tag, payload: h.payload, callback: h.callback, next: null }, null === m2 ? (l2 = m2 = y2, k2 = q2) : m2 = m2.next = y2, g |= r2;
      h = h.next;
      if (null === h) if (h = e.shared.pending, null === h) break;
      else r2 = h, h = r2.next, r2.next = null, e.lastBaseUpdate = r2, e.shared.pending = null;
    } while (1);
    null === m2 && (k2 = q2);
    e.baseState = k2;
    e.firstBaseUpdate = l2;
    e.lastBaseUpdate = m2;
    b = e.shared.interleaved;
    if (null !== b) {
      e = b;
      do
        g |= e.lane, e = e.next;
      while (e !== b);
    } else null === f2 && (e.shared.lanes = 0);
    rh |= g;
    a.lanes = g;
    a.memoizedState = q2;
  }
}
function sh(a, b, c) {
  a = b.effects;
  b.effects = null;
  if (null !== a) for (b = 0; b < a.length; b++) {
    var d = a[b], e = d.callback;
    if (null !== e) {
      d.callback = null;
      d = c;
      if ("function" !== typeof e) throw Error(p(191, e));
      e.call(d);
    }
  }
}
var th = {}, uh = Uf(th), vh = Uf(th), wh = Uf(th);
function xh(a) {
  if (a === th) throw Error(p(174));
  return a;
}
function yh(a, b) {
  G(wh, b);
  G(vh, a);
  G(uh, th);
  a = b.nodeType;
  switch (a) {
    case 9:
    case 11:
      b = (b = b.documentElement) ? b.namespaceURI : lb(null, "");
      break;
    default:
      a = 8 === a ? b.parentNode : b, b = a.namespaceURI || null, a = a.tagName, b = lb(b, a);
  }
  E(uh);
  G(uh, b);
}
function zh() {
  E(uh);
  E(vh);
  E(wh);
}
function Ah(a) {
  xh(wh.current);
  var b = xh(uh.current);
  var c = lb(b, a.type);
  b !== c && (G(vh, a), G(uh, c));
}
function Bh(a) {
  vh.current === a && (E(uh), E(vh));
}
var L = Uf(0);
function Ch(a) {
  for (var b = a; null !== b; ) {
    if (13 === b.tag) {
      var c = b.memoizedState;
      if (null !== c && (c = c.dehydrated, null === c || "$?" === c.data || "$!" === c.data)) return b;
    } else if (19 === b.tag && void 0 !== b.memoizedProps.revealOrder) {
      if (0 !== (b.flags & 128)) return b;
    } else if (null !== b.child) {
      b.child.return = b;
      b = b.child;
      continue;
    }
    if (b === a) break;
    for (; null === b.sibling; ) {
      if (null === b.return || b.return === a) return null;
      b = b.return;
    }
    b.sibling.return = b.return;
    b = b.sibling;
  }
  return null;
}
var Dh = [];
function Eh() {
  for (var a = 0; a < Dh.length; a++) Dh[a]._workInProgressVersionPrimary = null;
  Dh.length = 0;
}
var Fh = ua.ReactCurrentDispatcher, Gh = ua.ReactCurrentBatchConfig, Hh = 0, M = null, N = null, O = null, Ih = false, Jh = false, Kh = 0, Lh = 0;
function P() {
  throw Error(p(321));
}
function Mh(a, b) {
  if (null === b) return false;
  for (var c = 0; c < b.length && c < a.length; c++) if (!He(a[c], b[c])) return false;
  return true;
}
function Nh(a, b, c, d, e, f2) {
  Hh = f2;
  M = b;
  b.memoizedState = null;
  b.updateQueue = null;
  b.lanes = 0;
  Fh.current = null === a || null === a.memoizedState ? Oh : Ph;
  a = c(d, e);
  if (Jh) {
    f2 = 0;
    do {
      Jh = false;
      Kh = 0;
      if (25 <= f2) throw Error(p(301));
      f2 += 1;
      O = N = null;
      b.updateQueue = null;
      Fh.current = Qh;
      a = c(d, e);
    } while (Jh);
  }
  Fh.current = Rh;
  b = null !== N && null !== N.next;
  Hh = 0;
  O = N = M = null;
  Ih = false;
  if (b) throw Error(p(300));
  return a;
}
function Sh() {
  var a = 0 !== Kh;
  Kh = 0;
  return a;
}
function Th() {
  var a = { memoizedState: null, baseState: null, baseQueue: null, queue: null, next: null };
  null === O ? M.memoizedState = O = a : O = O.next = a;
  return O;
}
function Uh() {
  if (null === N) {
    var a = M.alternate;
    a = null !== a ? a.memoizedState : null;
  } else a = N.next;
  var b = null === O ? M.memoizedState : O.next;
  if (null !== b) O = b, N = a;
  else {
    if (null === a) throw Error(p(310));
    N = a;
    a = { memoizedState: N.memoizedState, baseState: N.baseState, baseQueue: N.baseQueue, queue: N.queue, next: null };
    null === O ? M.memoizedState = O = a : O = O.next = a;
  }
  return O;
}
function Vh(a, b) {
  return "function" === typeof b ? b(a) : b;
}
function Wh(a) {
  var b = Uh(), c = b.queue;
  if (null === c) throw Error(p(311));
  c.lastRenderedReducer = a;
  var d = N, e = d.baseQueue, f2 = c.pending;
  if (null !== f2) {
    if (null !== e) {
      var g = e.next;
      e.next = f2.next;
      f2.next = g;
    }
    d.baseQueue = e = f2;
    c.pending = null;
  }
  if (null !== e) {
    f2 = e.next;
    d = d.baseState;
    var h = g = null, k2 = null, l2 = f2;
    do {
      var m2 = l2.lane;
      if ((Hh & m2) === m2) null !== k2 && (k2 = k2.next = { lane: 0, action: l2.action, hasEagerState: l2.hasEagerState, eagerState: l2.eagerState, next: null }), d = l2.hasEagerState ? l2.eagerState : a(d, l2.action);
      else {
        var q2 = {
          lane: m2,
          action: l2.action,
          hasEagerState: l2.hasEagerState,
          eagerState: l2.eagerState,
          next: null
        };
        null === k2 ? (h = k2 = q2, g = d) : k2 = k2.next = q2;
        M.lanes |= m2;
        rh |= m2;
      }
      l2 = l2.next;
    } while (null !== l2 && l2 !== f2);
    null === k2 ? g = d : k2.next = h;
    He(d, b.memoizedState) || (dh = true);
    b.memoizedState = d;
    b.baseState = g;
    b.baseQueue = k2;
    c.lastRenderedState = d;
  }
  a = c.interleaved;
  if (null !== a) {
    e = a;
    do
      f2 = e.lane, M.lanes |= f2, rh |= f2, e = e.next;
    while (e !== a);
  } else null === e && (c.lanes = 0);
  return [b.memoizedState, c.dispatch];
}
function Xh(a) {
  var b = Uh(), c = b.queue;
  if (null === c) throw Error(p(311));
  c.lastRenderedReducer = a;
  var d = c.dispatch, e = c.pending, f2 = b.memoizedState;
  if (null !== e) {
    c.pending = null;
    var g = e = e.next;
    do
      f2 = a(f2, g.action), g = g.next;
    while (g !== e);
    He(f2, b.memoizedState) || (dh = true);
    b.memoizedState = f2;
    null === b.baseQueue && (b.baseState = f2);
    c.lastRenderedState = f2;
  }
  return [f2, d];
}
function Yh() {
}
function Zh(a, b) {
  var c = M, d = Uh(), e = b(), f2 = !He(d.memoizedState, e);
  f2 && (d.memoizedState = e, dh = true);
  d = d.queue;
  $h(ai.bind(null, c, d, a), [a]);
  if (d.getSnapshot !== b || f2 || null !== O && O.memoizedState.tag & 1) {
    c.flags |= 2048;
    bi(9, ci.bind(null, c, d, e, b), void 0, null);
    if (null === Q) throw Error(p(349));
    0 !== (Hh & 30) || di(c, b, e);
  }
  return e;
}
function di(a, b, c) {
  a.flags |= 16384;
  a = { getSnapshot: b, value: c };
  b = M.updateQueue;
  null === b ? (b = { lastEffect: null, stores: null }, M.updateQueue = b, b.stores = [a]) : (c = b.stores, null === c ? b.stores = [a] : c.push(a));
}
function ci(a, b, c, d) {
  b.value = c;
  b.getSnapshot = d;
  ei(b) && fi(a);
}
function ai(a, b, c) {
  return c(function() {
    ei(b) && fi(a);
  });
}
function ei(a) {
  var b = a.getSnapshot;
  a = a.value;
  try {
    var c = b();
    return !He(a, c);
  } catch (d) {
    return true;
  }
}
function fi(a) {
  var b = ih(a, 1);
  null !== b && gi(b, a, 1, -1);
}
function hi(a) {
  var b = Th();
  "function" === typeof a && (a = a());
  b.memoizedState = b.baseState = a;
  a = { pending: null, interleaved: null, lanes: 0, dispatch: null, lastRenderedReducer: Vh, lastRenderedState: a };
  b.queue = a;
  a = a.dispatch = ii.bind(null, M, a);
  return [b.memoizedState, a];
}
function bi(a, b, c, d) {
  a = { tag: a, create: b, destroy: c, deps: d, next: null };
  b = M.updateQueue;
  null === b ? (b = { lastEffect: null, stores: null }, M.updateQueue = b, b.lastEffect = a.next = a) : (c = b.lastEffect, null === c ? b.lastEffect = a.next = a : (d = c.next, c.next = a, a.next = d, b.lastEffect = a));
  return a;
}
function ji() {
  return Uh().memoizedState;
}
function ki(a, b, c, d) {
  var e = Th();
  M.flags |= a;
  e.memoizedState = bi(1 | b, c, void 0, void 0 === d ? null : d);
}
function li(a, b, c, d) {
  var e = Uh();
  d = void 0 === d ? null : d;
  var f2 = void 0;
  if (null !== N) {
    var g = N.memoizedState;
    f2 = g.destroy;
    if (null !== d && Mh(d, g.deps)) {
      e.memoizedState = bi(b, c, f2, d);
      return;
    }
  }
  M.flags |= a;
  e.memoizedState = bi(1 | b, c, f2, d);
}
function mi(a, b) {
  return ki(8390656, 8, a, b);
}
function $h(a, b) {
  return li(2048, 8, a, b);
}
function ni(a, b) {
  return li(4, 2, a, b);
}
function oi(a, b) {
  return li(4, 4, a, b);
}
function pi(a, b) {
  if ("function" === typeof b) return a = a(), b(a), function() {
    b(null);
  };
  if (null !== b && void 0 !== b) return a = a(), b.current = a, function() {
    b.current = null;
  };
}
function qi(a, b, c) {
  c = null !== c && void 0 !== c ? c.concat([a]) : null;
  return li(4, 4, pi.bind(null, b, a), c);
}
function ri() {
}
function si(a, b) {
  var c = Uh();
  b = void 0 === b ? null : b;
  var d = c.memoizedState;
  if (null !== d && null !== b && Mh(b, d[1])) return d[0];
  c.memoizedState = [a, b];
  return a;
}
function ti(a, b) {
  var c = Uh();
  b = void 0 === b ? null : b;
  var d = c.memoizedState;
  if (null !== d && null !== b && Mh(b, d[1])) return d[0];
  a = a();
  c.memoizedState = [a, b];
  return a;
}
function ui(a, b, c) {
  if (0 === (Hh & 21)) return a.baseState && (a.baseState = false, dh = true), a.memoizedState = c;
  He(c, b) || (c = yc(), M.lanes |= c, rh |= c, a.baseState = true);
  return b;
}
function vi(a, b) {
  var c = C;
  C = 0 !== c && 4 > c ? c : 4;
  a(true);
  var d = Gh.transition;
  Gh.transition = {};
  try {
    a(false), b();
  } finally {
    C = c, Gh.transition = d;
  }
}
function wi() {
  return Uh().memoizedState;
}
function xi(a, b, c) {
  var d = yi(a);
  c = { lane: d, action: c, hasEagerState: false, eagerState: null, next: null };
  if (zi(a)) Ai(b, c);
  else if (c = hh(a, b, c, d), null !== c) {
    var e = R();
    gi(c, a, d, e);
    Bi(c, b, d);
  }
}
function ii(a, b, c) {
  var d = yi(a), e = { lane: d, action: c, hasEagerState: false, eagerState: null, next: null };
  if (zi(a)) Ai(b, e);
  else {
    var f2 = a.alternate;
    if (0 === a.lanes && (null === f2 || 0 === f2.lanes) && (f2 = b.lastRenderedReducer, null !== f2)) try {
      var g = b.lastRenderedState, h = f2(g, c);
      e.hasEagerState = true;
      e.eagerState = h;
      if (He(h, g)) {
        var k2 = b.interleaved;
        null === k2 ? (e.next = e, gh(b)) : (e.next = k2.next, k2.next = e);
        b.interleaved = e;
        return;
      }
    } catch (l2) {
    } finally {
    }
    c = hh(a, b, e, d);
    null !== c && (e = R(), gi(c, a, d, e), Bi(c, b, d));
  }
}
function zi(a) {
  var b = a.alternate;
  return a === M || null !== b && b === M;
}
function Ai(a, b) {
  Jh = Ih = true;
  var c = a.pending;
  null === c ? b.next = b : (b.next = c.next, c.next = b);
  a.pending = b;
}
function Bi(a, b, c) {
  if (0 !== (c & 4194240)) {
    var d = b.lanes;
    d &= a.pendingLanes;
    c |= d;
    b.lanes = c;
    Cc(a, c);
  }
}
var Rh = { readContext: eh, useCallback: P, useContext: P, useEffect: P, useImperativeHandle: P, useInsertionEffect: P, useLayoutEffect: P, useMemo: P, useReducer: P, useRef: P, useState: P, useDebugValue: P, useDeferredValue: P, useTransition: P, useMutableSource: P, useSyncExternalStore: P, useId: P, unstable_isNewReconciler: false }, Oh = { readContext: eh, useCallback: function(a, b) {
  Th().memoizedState = [a, void 0 === b ? null : b];
  return a;
}, useContext: eh, useEffect: mi, useImperativeHandle: function(a, b, c) {
  c = null !== c && void 0 !== c ? c.concat([a]) : null;
  return ki(
    4194308,
    4,
    pi.bind(null, b, a),
    c
  );
}, useLayoutEffect: function(a, b) {
  return ki(4194308, 4, a, b);
}, useInsertionEffect: function(a, b) {
  return ki(4, 2, a, b);
}, useMemo: function(a, b) {
  var c = Th();
  b = void 0 === b ? null : b;
  a = a();
  c.memoizedState = [a, b];
  return a;
}, useReducer: function(a, b, c) {
  var d = Th();
  b = void 0 !== c ? c(b) : b;
  d.memoizedState = d.baseState = b;
  a = { pending: null, interleaved: null, lanes: 0, dispatch: null, lastRenderedReducer: a, lastRenderedState: b };
  d.queue = a;
  a = a.dispatch = xi.bind(null, M, a);
  return [d.memoizedState, a];
}, useRef: function(a) {
  var b = Th();
  a = { current: a };
  return b.memoizedState = a;
}, useState: hi, useDebugValue: ri, useDeferredValue: function(a) {
  return Th().memoizedState = a;
}, useTransition: function() {
  var a = hi(false), b = a[0];
  a = vi.bind(null, a[1]);
  Th().memoizedState = a;
  return [b, a];
}, useMutableSource: function() {
}, useSyncExternalStore: function(a, b, c) {
  var d = M, e = Th();
  if (I) {
    if (void 0 === c) throw Error(p(407));
    c = c();
  } else {
    c = b();
    if (null === Q) throw Error(p(349));
    0 !== (Hh & 30) || di(d, b, c);
  }
  e.memoizedState = c;
  var f2 = { value: c, getSnapshot: b };
  e.queue = f2;
  mi(ai.bind(
    null,
    d,
    f2,
    a
  ), [a]);
  d.flags |= 2048;
  bi(9, ci.bind(null, d, f2, c, b), void 0, null);
  return c;
}, useId: function() {
  var a = Th(), b = Q.identifierPrefix;
  if (I) {
    var c = sg;
    var d = rg;
    c = (d & ~(1 << 32 - oc(d) - 1)).toString(32) + c;
    b = ":" + b + "R" + c;
    c = Kh++;
    0 < c && (b += "H" + c.toString(32));
    b += ":";
  } else c = Lh++, b = ":" + b + "r" + c.toString(32) + ":";
  return a.memoizedState = b;
}, unstable_isNewReconciler: false }, Ph = {
  readContext: eh,
  useCallback: si,
  useContext: eh,
  useEffect: $h,
  useImperativeHandle: qi,
  useInsertionEffect: ni,
  useLayoutEffect: oi,
  useMemo: ti,
  useReducer: Wh,
  useRef: ji,
  useState: function() {
    return Wh(Vh);
  },
  useDebugValue: ri,
  useDeferredValue: function(a) {
    var b = Uh();
    return ui(b, N.memoizedState, a);
  },
  useTransition: function() {
    var a = Wh(Vh)[0], b = Uh().memoizedState;
    return [a, b];
  },
  useMutableSource: Yh,
  useSyncExternalStore: Zh,
  useId: wi,
  unstable_isNewReconciler: false
}, Qh = { readContext: eh, useCallback: si, useContext: eh, useEffect: $h, useImperativeHandle: qi, useInsertionEffect: ni, useLayoutEffect: oi, useMemo: ti, useReducer: Xh, useRef: ji, useState: function() {
  return Xh(Vh);
}, useDebugValue: ri, useDeferredValue: function(a) {
  var b = Uh();
  return null === N ? b.memoizedState = a : ui(b, N.memoizedState, a);
}, useTransition: function() {
  var a = Xh(Vh)[0], b = Uh().memoizedState;
  return [a, b];
}, useMutableSource: Yh, useSyncExternalStore: Zh, useId: wi, unstable_isNewReconciler: false };
function Ci(a, b) {
  if (a && a.defaultProps) {
    b = A({}, b);
    a = a.defaultProps;
    for (var c in a) void 0 === b[c] && (b[c] = a[c]);
    return b;
  }
  return b;
}
function Di(a, b, c, d) {
  b = a.memoizedState;
  c = c(d, b);
  c = null === c || void 0 === c ? b : A({}, b, c);
  a.memoizedState = c;
  0 === a.lanes && (a.updateQueue.baseState = c);
}
var Ei = { isMounted: function(a) {
  return (a = a._reactInternals) ? Vb(a) === a : false;
}, enqueueSetState: function(a, b, c) {
  a = a._reactInternals;
  var d = R(), e = yi(a), f2 = mh(d, e);
  f2.payload = b;
  void 0 !== c && null !== c && (f2.callback = c);
  b = nh(a, f2, e);
  null !== b && (gi(b, a, e, d), oh(b, a, e));
}, enqueueReplaceState: function(a, b, c) {
  a = a._reactInternals;
  var d = R(), e = yi(a), f2 = mh(d, e);
  f2.tag = 1;
  f2.payload = b;
  void 0 !== c && null !== c && (f2.callback = c);
  b = nh(a, f2, e);
  null !== b && (gi(b, a, e, d), oh(b, a, e));
}, enqueueForceUpdate: function(a, b) {
  a = a._reactInternals;
  var c = R(), d = yi(a), e = mh(c, d);
  e.tag = 2;
  void 0 !== b && null !== b && (e.callback = b);
  b = nh(a, e, d);
  null !== b && (gi(b, a, d, c), oh(b, a, d));
} };
function Fi(a, b, c, d, e, f2, g) {
  a = a.stateNode;
  return "function" === typeof a.shouldComponentUpdate ? a.shouldComponentUpdate(d, f2, g) : b.prototype && b.prototype.isPureReactComponent ? !Ie(c, d) || !Ie(e, f2) : true;
}
function Gi(a, b, c) {
  var d = false, e = Vf;
  var f2 = b.contextType;
  "object" === typeof f2 && null !== f2 ? f2 = eh(f2) : (e = Zf(b) ? Xf : H.current, d = b.contextTypes, f2 = (d = null !== d && void 0 !== d) ? Yf(a, e) : Vf);
  b = new b(c, f2);
  a.memoizedState = null !== b.state && void 0 !== b.state ? b.state : null;
  b.updater = Ei;
  a.stateNode = b;
  b._reactInternals = a;
  d && (a = a.stateNode, a.__reactInternalMemoizedUnmaskedChildContext = e, a.__reactInternalMemoizedMaskedChildContext = f2);
  return b;
}
function Hi(a, b, c, d) {
  a = b.state;
  "function" === typeof b.componentWillReceiveProps && b.componentWillReceiveProps(c, d);
  "function" === typeof b.UNSAFE_componentWillReceiveProps && b.UNSAFE_componentWillReceiveProps(c, d);
  b.state !== a && Ei.enqueueReplaceState(b, b.state, null);
}
function Ii(a, b, c, d) {
  var e = a.stateNode;
  e.props = c;
  e.state = a.memoizedState;
  e.refs = {};
  kh(a);
  var f2 = b.contextType;
  "object" === typeof f2 && null !== f2 ? e.context = eh(f2) : (f2 = Zf(b) ? Xf : H.current, e.context = Yf(a, f2));
  e.state = a.memoizedState;
  f2 = b.getDerivedStateFromProps;
  "function" === typeof f2 && (Di(a, b, f2, c), e.state = a.memoizedState);
  "function" === typeof b.getDerivedStateFromProps || "function" === typeof e.getSnapshotBeforeUpdate || "function" !== typeof e.UNSAFE_componentWillMount && "function" !== typeof e.componentWillMount || (b = e.state, "function" === typeof e.componentWillMount && e.componentWillMount(), "function" === typeof e.UNSAFE_componentWillMount && e.UNSAFE_componentWillMount(), b !== e.state && Ei.enqueueReplaceState(e, e.state, null), qh(a, c, e, d), e.state = a.memoizedState);
  "function" === typeof e.componentDidMount && (a.flags |= 4194308);
}
function Ji(a, b) {
  try {
    var c = "", d = b;
    do
      c += Pa(d), d = d.return;
    while (d);
    var e = c;
  } catch (f2) {
    e = "\nError generating stack: " + f2.message + "\n" + f2.stack;
  }
  return { value: a, source: b, stack: e, digest: null };
}
function Ki(a, b, c) {
  return { value: a, source: null, stack: null != c ? c : null, digest: null != b ? b : null };
}
function Li(a, b) {
  try {
    console.error(b.value);
  } catch (c) {
    setTimeout(function() {
      throw c;
    });
  }
}
var Mi = "function" === typeof WeakMap ? WeakMap : Map;
function Ni(a, b, c) {
  c = mh(-1, c);
  c.tag = 3;
  c.payload = { element: null };
  var d = b.value;
  c.callback = function() {
    Oi || (Oi = true, Pi = d);
    Li(a, b);
  };
  return c;
}
function Qi(a, b, c) {
  c = mh(-1, c);
  c.tag = 3;
  var d = a.type.getDerivedStateFromError;
  if ("function" === typeof d) {
    var e = b.value;
    c.payload = function() {
      return d(e);
    };
    c.callback = function() {
      Li(a, b);
    };
  }
  var f2 = a.stateNode;
  null !== f2 && "function" === typeof f2.componentDidCatch && (c.callback = function() {
    Li(a, b);
    "function" !== typeof d && (null === Ri ? Ri = /* @__PURE__ */ new Set([this]) : Ri.add(this));
    var c2 = b.stack;
    this.componentDidCatch(b.value, { componentStack: null !== c2 ? c2 : "" });
  });
  return c;
}
function Si(a, b, c) {
  var d = a.pingCache;
  if (null === d) {
    d = a.pingCache = new Mi();
    var e = /* @__PURE__ */ new Set();
    d.set(b, e);
  } else e = d.get(b), void 0 === e && (e = /* @__PURE__ */ new Set(), d.set(b, e));
  e.has(c) || (e.add(c), a = Ti.bind(null, a, b, c), b.then(a, a));
}
function Ui(a) {
  do {
    var b;
    if (b = 13 === a.tag) b = a.memoizedState, b = null !== b ? null !== b.dehydrated ? true : false : true;
    if (b) return a;
    a = a.return;
  } while (null !== a);
  return null;
}
function Vi(a, b, c, d, e) {
  if (0 === (a.mode & 1)) return a === b ? a.flags |= 65536 : (a.flags |= 128, c.flags |= 131072, c.flags &= -52805, 1 === c.tag && (null === c.alternate ? c.tag = 17 : (b = mh(-1, 1), b.tag = 2, nh(c, b, 1))), c.lanes |= 1), a;
  a.flags |= 65536;
  a.lanes = e;
  return a;
}
var Wi = ua.ReactCurrentOwner, dh = false;
function Xi(a, b, c, d) {
  b.child = null === a ? Vg(b, null, c, d) : Ug(b, a.child, c, d);
}
function Yi(a, b, c, d, e) {
  c = c.render;
  var f2 = b.ref;
  ch(b, e);
  d = Nh(a, b, c, d, f2, e);
  c = Sh();
  if (null !== a && !dh) return b.updateQueue = a.updateQueue, b.flags &= -2053, a.lanes &= ~e, Zi(a, b, e);
  I && c && vg(b);
  b.flags |= 1;
  Xi(a, b, d, e);
  return b.child;
}
function $i(a, b, c, d, e) {
  if (null === a) {
    var f2 = c.type;
    if ("function" === typeof f2 && !aj(f2) && void 0 === f2.defaultProps && null === c.compare && void 0 === c.defaultProps) return b.tag = 15, b.type = f2, bj(a, b, f2, d, e);
    a = Rg(c.type, null, d, b, b.mode, e);
    a.ref = b.ref;
    a.return = b;
    return b.child = a;
  }
  f2 = a.child;
  if (0 === (a.lanes & e)) {
    var g = f2.memoizedProps;
    c = c.compare;
    c = null !== c ? c : Ie;
    if (c(g, d) && a.ref === b.ref) return Zi(a, b, e);
  }
  b.flags |= 1;
  a = Pg(f2, d);
  a.ref = b.ref;
  a.return = b;
  return b.child = a;
}
function bj(a, b, c, d, e) {
  if (null !== a) {
    var f2 = a.memoizedProps;
    if (Ie(f2, d) && a.ref === b.ref) if (dh = false, b.pendingProps = d = f2, 0 !== (a.lanes & e)) 0 !== (a.flags & 131072) && (dh = true);
    else return b.lanes = a.lanes, Zi(a, b, e);
  }
  return cj(a, b, c, d, e);
}
function dj(a, b, c) {
  var d = b.pendingProps, e = d.children, f2 = null !== a ? a.memoizedState : null;
  if ("hidden" === d.mode) if (0 === (b.mode & 1)) b.memoizedState = { baseLanes: 0, cachePool: null, transitions: null }, G(ej, fj), fj |= c;
  else {
    if (0 === (c & 1073741824)) return a = null !== f2 ? f2.baseLanes | c : c, b.lanes = b.childLanes = 1073741824, b.memoizedState = { baseLanes: a, cachePool: null, transitions: null }, b.updateQueue = null, G(ej, fj), fj |= a, null;
    b.memoizedState = { baseLanes: 0, cachePool: null, transitions: null };
    d = null !== f2 ? f2.baseLanes : c;
    G(ej, fj);
    fj |= d;
  }
  else null !== f2 ? (d = f2.baseLanes | c, b.memoizedState = null) : d = c, G(ej, fj), fj |= d;
  Xi(a, b, e, c);
  return b.child;
}
function gj(a, b) {
  var c = b.ref;
  if (null === a && null !== c || null !== a && a.ref !== c) b.flags |= 512, b.flags |= 2097152;
}
function cj(a, b, c, d, e) {
  var f2 = Zf(c) ? Xf : H.current;
  f2 = Yf(b, f2);
  ch(b, e);
  c = Nh(a, b, c, d, f2, e);
  d = Sh();
  if (null !== a && !dh) return b.updateQueue = a.updateQueue, b.flags &= -2053, a.lanes &= ~e, Zi(a, b, e);
  I && d && vg(b);
  b.flags |= 1;
  Xi(a, b, c, e);
  return b.child;
}
function hj(a, b, c, d, e) {
  if (Zf(c)) {
    var f2 = true;
    cg(b);
  } else f2 = false;
  ch(b, e);
  if (null === b.stateNode) ij(a, b), Gi(b, c, d), Ii(b, c, d, e), d = true;
  else if (null === a) {
    var g = b.stateNode, h = b.memoizedProps;
    g.props = h;
    var k2 = g.context, l2 = c.contextType;
    "object" === typeof l2 && null !== l2 ? l2 = eh(l2) : (l2 = Zf(c) ? Xf : H.current, l2 = Yf(b, l2));
    var m2 = c.getDerivedStateFromProps, q2 = "function" === typeof m2 || "function" === typeof g.getSnapshotBeforeUpdate;
    q2 || "function" !== typeof g.UNSAFE_componentWillReceiveProps && "function" !== typeof g.componentWillReceiveProps || (h !== d || k2 !== l2) && Hi(b, g, d, l2);
    jh = false;
    var r2 = b.memoizedState;
    g.state = r2;
    qh(b, d, g, e);
    k2 = b.memoizedState;
    h !== d || r2 !== k2 || Wf.current || jh ? ("function" === typeof m2 && (Di(b, c, m2, d), k2 = b.memoizedState), (h = jh || Fi(b, c, h, d, r2, k2, l2)) ? (q2 || "function" !== typeof g.UNSAFE_componentWillMount && "function" !== typeof g.componentWillMount || ("function" === typeof g.componentWillMount && g.componentWillMount(), "function" === typeof g.UNSAFE_componentWillMount && g.UNSAFE_componentWillMount()), "function" === typeof g.componentDidMount && (b.flags |= 4194308)) : ("function" === typeof g.componentDidMount && (b.flags |= 4194308), b.memoizedProps = d, b.memoizedState = k2), g.props = d, g.state = k2, g.context = l2, d = h) : ("function" === typeof g.componentDidMount && (b.flags |= 4194308), d = false);
  } else {
    g = b.stateNode;
    lh(a, b);
    h = b.memoizedProps;
    l2 = b.type === b.elementType ? h : Ci(b.type, h);
    g.props = l2;
    q2 = b.pendingProps;
    r2 = g.context;
    k2 = c.contextType;
    "object" === typeof k2 && null !== k2 ? k2 = eh(k2) : (k2 = Zf(c) ? Xf : H.current, k2 = Yf(b, k2));
    var y2 = c.getDerivedStateFromProps;
    (m2 = "function" === typeof y2 || "function" === typeof g.getSnapshotBeforeUpdate) || "function" !== typeof g.UNSAFE_componentWillReceiveProps && "function" !== typeof g.componentWillReceiveProps || (h !== q2 || r2 !== k2) && Hi(b, g, d, k2);
    jh = false;
    r2 = b.memoizedState;
    g.state = r2;
    qh(b, d, g, e);
    var n2 = b.memoizedState;
    h !== q2 || r2 !== n2 || Wf.current || jh ? ("function" === typeof y2 && (Di(b, c, y2, d), n2 = b.memoizedState), (l2 = jh || Fi(b, c, l2, d, r2, n2, k2) || false) ? (m2 || "function" !== typeof g.UNSAFE_componentWillUpdate && "function" !== typeof g.componentWillUpdate || ("function" === typeof g.componentWillUpdate && g.componentWillUpdate(d, n2, k2), "function" === typeof g.UNSAFE_componentWillUpdate && g.UNSAFE_componentWillUpdate(d, n2, k2)), "function" === typeof g.componentDidUpdate && (b.flags |= 4), "function" === typeof g.getSnapshotBeforeUpdate && (b.flags |= 1024)) : ("function" !== typeof g.componentDidUpdate || h === a.memoizedProps && r2 === a.memoizedState || (b.flags |= 4), "function" !== typeof g.getSnapshotBeforeUpdate || h === a.memoizedProps && r2 === a.memoizedState || (b.flags |= 1024), b.memoizedProps = d, b.memoizedState = n2), g.props = d, g.state = n2, g.context = k2, d = l2) : ("function" !== typeof g.componentDidUpdate || h === a.memoizedProps && r2 === a.memoizedState || (b.flags |= 4), "function" !== typeof g.getSnapshotBeforeUpdate || h === a.memoizedProps && r2 === a.memoizedState || (b.flags |= 1024), d = false);
  }
  return jj(a, b, c, d, f2, e);
}
function jj(a, b, c, d, e, f2) {
  gj(a, b);
  var g = 0 !== (b.flags & 128);
  if (!d && !g) return e && dg(b, c, false), Zi(a, b, f2);
  d = b.stateNode;
  Wi.current = b;
  var h = g && "function" !== typeof c.getDerivedStateFromError ? null : d.render();
  b.flags |= 1;
  null !== a && g ? (b.child = Ug(b, a.child, null, f2), b.child = Ug(b, null, h, f2)) : Xi(a, b, h, f2);
  b.memoizedState = d.state;
  e && dg(b, c, true);
  return b.child;
}
function kj(a) {
  var b = a.stateNode;
  b.pendingContext ? ag(a, b.pendingContext, b.pendingContext !== b.context) : b.context && ag(a, b.context, false);
  yh(a, b.containerInfo);
}
function lj(a, b, c, d, e) {
  Ig();
  Jg(e);
  b.flags |= 256;
  Xi(a, b, c, d);
  return b.child;
}
var mj = { dehydrated: null, treeContext: null, retryLane: 0 };
function nj(a) {
  return { baseLanes: a, cachePool: null, transitions: null };
}
function oj(a, b, c) {
  var d = b.pendingProps, e = L.current, f2 = false, g = 0 !== (b.flags & 128), h;
  (h = g) || (h = null !== a && null === a.memoizedState ? false : 0 !== (e & 2));
  if (h) f2 = true, b.flags &= -129;
  else if (null === a || null !== a.memoizedState) e |= 1;
  G(L, e & 1);
  if (null === a) {
    Eg(b);
    a = b.memoizedState;
    if (null !== a && (a = a.dehydrated, null !== a)) return 0 === (b.mode & 1) ? b.lanes = 1 : "$!" === a.data ? b.lanes = 8 : b.lanes = 1073741824, null;
    g = d.children;
    a = d.fallback;
    return f2 ? (d = b.mode, f2 = b.child, g = { mode: "hidden", children: g }, 0 === (d & 1) && null !== f2 ? (f2.childLanes = 0, f2.pendingProps = g) : f2 = pj(g, d, 0, null), a = Tg(a, d, c, null), f2.return = b, a.return = b, f2.sibling = a, b.child = f2, b.child.memoizedState = nj(c), b.memoizedState = mj, a) : qj(b, g);
  }
  e = a.memoizedState;
  if (null !== e && (h = e.dehydrated, null !== h)) return rj(a, b, g, d, h, e, c);
  if (f2) {
    f2 = d.fallback;
    g = b.mode;
    e = a.child;
    h = e.sibling;
    var k2 = { mode: "hidden", children: d.children };
    0 === (g & 1) && b.child !== e ? (d = b.child, d.childLanes = 0, d.pendingProps = k2, b.deletions = null) : (d = Pg(e, k2), d.subtreeFlags = e.subtreeFlags & 14680064);
    null !== h ? f2 = Pg(h, f2) : (f2 = Tg(f2, g, c, null), f2.flags |= 2);
    f2.return = b;
    d.return = b;
    d.sibling = f2;
    b.child = d;
    d = f2;
    f2 = b.child;
    g = a.child.memoizedState;
    g = null === g ? nj(c) : { baseLanes: g.baseLanes | c, cachePool: null, transitions: g.transitions };
    f2.memoizedState = g;
    f2.childLanes = a.childLanes & ~c;
    b.memoizedState = mj;
    return d;
  }
  f2 = a.child;
  a = f2.sibling;
  d = Pg(f2, { mode: "visible", children: d.children });
  0 === (b.mode & 1) && (d.lanes = c);
  d.return = b;
  d.sibling = null;
  null !== a && (c = b.deletions, null === c ? (b.deletions = [a], b.flags |= 16) : c.push(a));
  b.child = d;
  b.memoizedState = null;
  return d;
}
function qj(a, b) {
  b = pj({ mode: "visible", children: b }, a.mode, 0, null);
  b.return = a;
  return a.child = b;
}
function sj(a, b, c, d) {
  null !== d && Jg(d);
  Ug(b, a.child, null, c);
  a = qj(b, b.pendingProps.children);
  a.flags |= 2;
  b.memoizedState = null;
  return a;
}
function rj(a, b, c, d, e, f2, g) {
  if (c) {
    if (b.flags & 256) return b.flags &= -257, d = Ki(Error(p(422))), sj(a, b, g, d);
    if (null !== b.memoizedState) return b.child = a.child, b.flags |= 128, null;
    f2 = d.fallback;
    e = b.mode;
    d = pj({ mode: "visible", children: d.children }, e, 0, null);
    f2 = Tg(f2, e, g, null);
    f2.flags |= 2;
    d.return = b;
    f2.return = b;
    d.sibling = f2;
    b.child = d;
    0 !== (b.mode & 1) && Ug(b, a.child, null, g);
    b.child.memoizedState = nj(g);
    b.memoizedState = mj;
    return f2;
  }
  if (0 === (b.mode & 1)) return sj(a, b, g, null);
  if ("$!" === e.data) {
    d = e.nextSibling && e.nextSibling.dataset;
    if (d) var h = d.dgst;
    d = h;
    f2 = Error(p(419));
    d = Ki(f2, d, void 0);
    return sj(a, b, g, d);
  }
  h = 0 !== (g & a.childLanes);
  if (dh || h) {
    d = Q;
    if (null !== d) {
      switch (g & -g) {
        case 4:
          e = 2;
          break;
        case 16:
          e = 8;
          break;
        case 64:
        case 128:
        case 256:
        case 512:
        case 1024:
        case 2048:
        case 4096:
        case 8192:
        case 16384:
        case 32768:
        case 65536:
        case 131072:
        case 262144:
        case 524288:
        case 1048576:
        case 2097152:
        case 4194304:
        case 8388608:
        case 16777216:
        case 33554432:
        case 67108864:
          e = 32;
          break;
        case 536870912:
          e = 268435456;
          break;
        default:
          e = 0;
      }
      e = 0 !== (e & (d.suspendedLanes | g)) ? 0 : e;
      0 !== e && e !== f2.retryLane && (f2.retryLane = e, ih(a, e), gi(d, a, e, -1));
    }
    tj();
    d = Ki(Error(p(421)));
    return sj(a, b, g, d);
  }
  if ("$?" === e.data) return b.flags |= 128, b.child = a.child, b = uj.bind(null, a), e._reactRetry = b, null;
  a = f2.treeContext;
  yg = Lf(e.nextSibling);
  xg = b;
  I = true;
  zg = null;
  null !== a && (og[pg++] = rg, og[pg++] = sg, og[pg++] = qg, rg = a.id, sg = a.overflow, qg = b);
  b = qj(b, d.children);
  b.flags |= 4096;
  return b;
}
function vj(a, b, c) {
  a.lanes |= b;
  var d = a.alternate;
  null !== d && (d.lanes |= b);
  bh(a.return, b, c);
}
function wj(a, b, c, d, e) {
  var f2 = a.memoizedState;
  null === f2 ? a.memoizedState = { isBackwards: b, rendering: null, renderingStartTime: 0, last: d, tail: c, tailMode: e } : (f2.isBackwards = b, f2.rendering = null, f2.renderingStartTime = 0, f2.last = d, f2.tail = c, f2.tailMode = e);
}
function xj(a, b, c) {
  var d = b.pendingProps, e = d.revealOrder, f2 = d.tail;
  Xi(a, b, d.children, c);
  d = L.current;
  if (0 !== (d & 2)) d = d & 1 | 2, b.flags |= 128;
  else {
    if (null !== a && 0 !== (a.flags & 128)) a: for (a = b.child; null !== a; ) {
      if (13 === a.tag) null !== a.memoizedState && vj(a, c, b);
      else if (19 === a.tag) vj(a, c, b);
      else if (null !== a.child) {
        a.child.return = a;
        a = a.child;
        continue;
      }
      if (a === b) break a;
      for (; null === a.sibling; ) {
        if (null === a.return || a.return === b) break a;
        a = a.return;
      }
      a.sibling.return = a.return;
      a = a.sibling;
    }
    d &= 1;
  }
  G(L, d);
  if (0 === (b.mode & 1)) b.memoizedState = null;
  else switch (e) {
    case "forwards":
      c = b.child;
      for (e = null; null !== c; ) a = c.alternate, null !== a && null === Ch(a) && (e = c), c = c.sibling;
      c = e;
      null === c ? (e = b.child, b.child = null) : (e = c.sibling, c.sibling = null);
      wj(b, false, e, c, f2);
      break;
    case "backwards":
      c = null;
      e = b.child;
      for (b.child = null; null !== e; ) {
        a = e.alternate;
        if (null !== a && null === Ch(a)) {
          b.child = e;
          break;
        }
        a = e.sibling;
        e.sibling = c;
        c = e;
        e = a;
      }
      wj(b, true, c, null, f2);
      break;
    case "together":
      wj(b, false, null, null, void 0);
      break;
    default:
      b.memoizedState = null;
  }
  return b.child;
}
function ij(a, b) {
  0 === (b.mode & 1) && null !== a && (a.alternate = null, b.alternate = null, b.flags |= 2);
}
function Zi(a, b, c) {
  null !== a && (b.dependencies = a.dependencies);
  rh |= b.lanes;
  if (0 === (c & b.childLanes)) return null;
  if (null !== a && b.child !== a.child) throw Error(p(153));
  if (null !== b.child) {
    a = b.child;
    c = Pg(a, a.pendingProps);
    b.child = c;
    for (c.return = b; null !== a.sibling; ) a = a.sibling, c = c.sibling = Pg(a, a.pendingProps), c.return = b;
    c.sibling = null;
  }
  return b.child;
}
function yj(a, b, c) {
  switch (b.tag) {
    case 3:
      kj(b);
      Ig();
      break;
    case 5:
      Ah(b);
      break;
    case 1:
      Zf(b.type) && cg(b);
      break;
    case 4:
      yh(b, b.stateNode.containerInfo);
      break;
    case 10:
      var d = b.type._context, e = b.memoizedProps.value;
      G(Wg, d._currentValue);
      d._currentValue = e;
      break;
    case 13:
      d = b.memoizedState;
      if (null !== d) {
        if (null !== d.dehydrated) return G(L, L.current & 1), b.flags |= 128, null;
        if (0 !== (c & b.child.childLanes)) return oj(a, b, c);
        G(L, L.current & 1);
        a = Zi(a, b, c);
        return null !== a ? a.sibling : null;
      }
      G(L, L.current & 1);
      break;
    case 19:
      d = 0 !== (c & b.childLanes);
      if (0 !== (a.flags & 128)) {
        if (d) return xj(a, b, c);
        b.flags |= 128;
      }
      e = b.memoizedState;
      null !== e && (e.rendering = null, e.tail = null, e.lastEffect = null);
      G(L, L.current);
      if (d) break;
      else return null;
    case 22:
    case 23:
      return b.lanes = 0, dj(a, b, c);
  }
  return Zi(a, b, c);
}
var zj, Aj, Bj, Cj;
zj = function(a, b) {
  for (var c = b.child; null !== c; ) {
    if (5 === c.tag || 6 === c.tag) a.appendChild(c.stateNode);
    else if (4 !== c.tag && null !== c.child) {
      c.child.return = c;
      c = c.child;
      continue;
    }
    if (c === b) break;
    for (; null === c.sibling; ) {
      if (null === c.return || c.return === b) return;
      c = c.return;
    }
    c.sibling.return = c.return;
    c = c.sibling;
  }
};
Aj = function() {
};
Bj = function(a, b, c, d) {
  var e = a.memoizedProps;
  if (e !== d) {
    a = b.stateNode;
    xh(uh.current);
    var f2 = null;
    switch (c) {
      case "input":
        e = Ya(a, e);
        d = Ya(a, d);
        f2 = [];
        break;
      case "select":
        e = A({}, e, { value: void 0 });
        d = A({}, d, { value: void 0 });
        f2 = [];
        break;
      case "textarea":
        e = gb(a, e);
        d = gb(a, d);
        f2 = [];
        break;
      default:
        "function" !== typeof e.onClick && "function" === typeof d.onClick && (a.onclick = Bf);
    }
    ub(c, d);
    var g;
    c = null;
    for (l2 in e) if (!d.hasOwnProperty(l2) && e.hasOwnProperty(l2) && null != e[l2]) if ("style" === l2) {
      var h = e[l2];
      for (g in h) h.hasOwnProperty(g) && (c || (c = {}), c[g] = "");
    } else "dangerouslySetInnerHTML" !== l2 && "children" !== l2 && "suppressContentEditableWarning" !== l2 && "suppressHydrationWarning" !== l2 && "autoFocus" !== l2 && (ea.hasOwnProperty(l2) ? f2 || (f2 = []) : (f2 = f2 || []).push(l2, null));
    for (l2 in d) {
      var k2 = d[l2];
      h = null != e ? e[l2] : void 0;
      if (d.hasOwnProperty(l2) && k2 !== h && (null != k2 || null != h)) if ("style" === l2) if (h) {
        for (g in h) !h.hasOwnProperty(g) || k2 && k2.hasOwnProperty(g) || (c || (c = {}), c[g] = "");
        for (g in k2) k2.hasOwnProperty(g) && h[g] !== k2[g] && (c || (c = {}), c[g] = k2[g]);
      } else c || (f2 || (f2 = []), f2.push(
        l2,
        c
      )), c = k2;
      else "dangerouslySetInnerHTML" === l2 ? (k2 = k2 ? k2.__html : void 0, h = h ? h.__html : void 0, null != k2 && h !== k2 && (f2 = f2 || []).push(l2, k2)) : "children" === l2 ? "string" !== typeof k2 && "number" !== typeof k2 || (f2 = f2 || []).push(l2, "" + k2) : "suppressContentEditableWarning" !== l2 && "suppressHydrationWarning" !== l2 && (ea.hasOwnProperty(l2) ? (null != k2 && "onScroll" === l2 && D("scroll", a), f2 || h === k2 || (f2 = [])) : (f2 = f2 || []).push(l2, k2));
    }
    c && (f2 = f2 || []).push("style", c);
    var l2 = f2;
    if (b.updateQueue = l2) b.flags |= 4;
  }
};
Cj = function(a, b, c, d) {
  c !== d && (b.flags |= 4);
};
function Dj(a, b) {
  if (!I) switch (a.tailMode) {
    case "hidden":
      b = a.tail;
      for (var c = null; null !== b; ) null !== b.alternate && (c = b), b = b.sibling;
      null === c ? a.tail = null : c.sibling = null;
      break;
    case "collapsed":
      c = a.tail;
      for (var d = null; null !== c; ) null !== c.alternate && (d = c), c = c.sibling;
      null === d ? b || null === a.tail ? a.tail = null : a.tail.sibling = null : d.sibling = null;
  }
}
function S(a) {
  var b = null !== a.alternate && a.alternate.child === a.child, c = 0, d = 0;
  if (b) for (var e = a.child; null !== e; ) c |= e.lanes | e.childLanes, d |= e.subtreeFlags & 14680064, d |= e.flags & 14680064, e.return = a, e = e.sibling;
  else for (e = a.child; null !== e; ) c |= e.lanes | e.childLanes, d |= e.subtreeFlags, d |= e.flags, e.return = a, e = e.sibling;
  a.subtreeFlags |= d;
  a.childLanes = c;
  return b;
}
function Ej(a, b, c) {
  var d = b.pendingProps;
  wg(b);
  switch (b.tag) {
    case 2:
    case 16:
    case 15:
    case 0:
    case 11:
    case 7:
    case 8:
    case 12:
    case 9:
    case 14:
      return S(b), null;
    case 1:
      return Zf(b.type) && $f(), S(b), null;
    case 3:
      d = b.stateNode;
      zh();
      E(Wf);
      E(H);
      Eh();
      d.pendingContext && (d.context = d.pendingContext, d.pendingContext = null);
      if (null === a || null === a.child) Gg(b) ? b.flags |= 4 : null === a || a.memoizedState.isDehydrated && 0 === (b.flags & 256) || (b.flags |= 1024, null !== zg && (Fj(zg), zg = null));
      Aj(a, b);
      S(b);
      return null;
    case 5:
      Bh(b);
      var e = xh(wh.current);
      c = b.type;
      if (null !== a && null != b.stateNode) Bj(a, b, c, d, e), a.ref !== b.ref && (b.flags |= 512, b.flags |= 2097152);
      else {
        if (!d) {
          if (null === b.stateNode) throw Error(p(166));
          S(b);
          return null;
        }
        a = xh(uh.current);
        if (Gg(b)) {
          d = b.stateNode;
          c = b.type;
          var f2 = b.memoizedProps;
          d[Of] = b;
          d[Pf] = f2;
          a = 0 !== (b.mode & 1);
          switch (c) {
            case "dialog":
              D("cancel", d);
              D("close", d);
              break;
            case "iframe":
            case "object":
            case "embed":
              D("load", d);
              break;
            case "video":
            case "audio":
              for (e = 0; e < lf.length; e++) D(lf[e], d);
              break;
            case "source":
              D("error", d);
              break;
            case "img":
            case "image":
            case "link":
              D(
                "error",
                d
              );
              D("load", d);
              break;
            case "details":
              D("toggle", d);
              break;
            case "input":
              Za(d, f2);
              D("invalid", d);
              break;
            case "select":
              d._wrapperState = { wasMultiple: !!f2.multiple };
              D("invalid", d);
              break;
            case "textarea":
              hb(d, f2), D("invalid", d);
          }
          ub(c, f2);
          e = null;
          for (var g in f2) if (f2.hasOwnProperty(g)) {
            var h = f2[g];
            "children" === g ? "string" === typeof h ? d.textContent !== h && (true !== f2.suppressHydrationWarning && Af(d.textContent, h, a), e = ["children", h]) : "number" === typeof h && d.textContent !== "" + h && (true !== f2.suppressHydrationWarning && Af(
              d.textContent,
              h,
              a
            ), e = ["children", "" + h]) : ea.hasOwnProperty(g) && null != h && "onScroll" === g && D("scroll", d);
          }
          switch (c) {
            case "input":
              Va(d);
              db(d, f2, true);
              break;
            case "textarea":
              Va(d);
              jb(d);
              break;
            case "select":
            case "option":
              break;
            default:
              "function" === typeof f2.onClick && (d.onclick = Bf);
          }
          d = e;
          b.updateQueue = d;
          null !== d && (b.flags |= 4);
        } else {
          g = 9 === e.nodeType ? e : e.ownerDocument;
          "http://www.w3.org/1999/xhtml" === a && (a = kb(c));
          "http://www.w3.org/1999/xhtml" === a ? "script" === c ? (a = g.createElement("div"), a.innerHTML = "<script><\/script>", a = a.removeChild(a.firstChild)) : "string" === typeof d.is ? a = g.createElement(c, { is: d.is }) : (a = g.createElement(c), "select" === c && (g = a, d.multiple ? g.multiple = true : d.size && (g.size = d.size))) : a = g.createElementNS(a, c);
          a[Of] = b;
          a[Pf] = d;
          zj(a, b, false, false);
          b.stateNode = a;
          a: {
            g = vb(c, d);
            switch (c) {
              case "dialog":
                D("cancel", a);
                D("close", a);
                e = d;
                break;
              case "iframe":
              case "object":
              case "embed":
                D("load", a);
                e = d;
                break;
              case "video":
              case "audio":
                for (e = 0; e < lf.length; e++) D(lf[e], a);
                e = d;
                break;
              case "source":
                D("error", a);
                e = d;
                break;
              case "img":
              case "image":
              case "link":
                D(
                  "error",
                  a
                );
                D("load", a);
                e = d;
                break;
              case "details":
                D("toggle", a);
                e = d;
                break;
              case "input":
                Za(a, d);
                e = Ya(a, d);
                D("invalid", a);
                break;
              case "option":
                e = d;
                break;
              case "select":
                a._wrapperState = { wasMultiple: !!d.multiple };
                e = A({}, d, { value: void 0 });
                D("invalid", a);
                break;
              case "textarea":
                hb(a, d);
                e = gb(a, d);
                D("invalid", a);
                break;
              default:
                e = d;
            }
            ub(c, e);
            h = e;
            for (f2 in h) if (h.hasOwnProperty(f2)) {
              var k2 = h[f2];
              "style" === f2 ? sb(a, k2) : "dangerouslySetInnerHTML" === f2 ? (k2 = k2 ? k2.__html : void 0, null != k2 && nb(a, k2)) : "children" === f2 ? "string" === typeof k2 ? ("textarea" !== c || "" !== k2) && ob(a, k2) : "number" === typeof k2 && ob(a, "" + k2) : "suppressContentEditableWarning" !== f2 && "suppressHydrationWarning" !== f2 && "autoFocus" !== f2 && (ea.hasOwnProperty(f2) ? null != k2 && "onScroll" === f2 && D("scroll", a) : null != k2 && ta(a, f2, k2, g));
            }
            switch (c) {
              case "input":
                Va(a);
                db(a, d, false);
                break;
              case "textarea":
                Va(a);
                jb(a);
                break;
              case "option":
                null != d.value && a.setAttribute("value", "" + Sa(d.value));
                break;
              case "select":
                a.multiple = !!d.multiple;
                f2 = d.value;
                null != f2 ? fb(a, !!d.multiple, f2, false) : null != d.defaultValue && fb(
                  a,
                  !!d.multiple,
                  d.defaultValue,
                  true
                );
                break;
              default:
                "function" === typeof e.onClick && (a.onclick = Bf);
            }
            switch (c) {
              case "button":
              case "input":
              case "select":
              case "textarea":
                d = !!d.autoFocus;
                break a;
              case "img":
                d = true;
                break a;
              default:
                d = false;
            }
          }
          d && (b.flags |= 4);
        }
        null !== b.ref && (b.flags |= 512, b.flags |= 2097152);
      }
      S(b);
      return null;
    case 6:
      if (a && null != b.stateNode) Cj(a, b, a.memoizedProps, d);
      else {
        if ("string" !== typeof d && null === b.stateNode) throw Error(p(166));
        c = xh(wh.current);
        xh(uh.current);
        if (Gg(b)) {
          d = b.stateNode;
          c = b.memoizedProps;
          d[Of] = b;
          if (f2 = d.nodeValue !== c) {
            if (a = xg, null !== a) switch (a.tag) {
              case 3:
                Af(d.nodeValue, c, 0 !== (a.mode & 1));
                break;
              case 5:
                true !== a.memoizedProps.suppressHydrationWarning && Af(d.nodeValue, c, 0 !== (a.mode & 1));
            }
          }
          f2 && (b.flags |= 4);
        } else d = (9 === c.nodeType ? c : c.ownerDocument).createTextNode(d), d[Of] = b, b.stateNode = d;
      }
      S(b);
      return null;
    case 13:
      E(L);
      d = b.memoizedState;
      if (null === a || null !== a.memoizedState && null !== a.memoizedState.dehydrated) {
        if (I && null !== yg && 0 !== (b.mode & 1) && 0 === (b.flags & 128)) Hg(), Ig(), b.flags |= 98560, f2 = false;
        else if (f2 = Gg(b), null !== d && null !== d.dehydrated) {
          if (null === a) {
            if (!f2) throw Error(p(318));
            f2 = b.memoizedState;
            f2 = null !== f2 ? f2.dehydrated : null;
            if (!f2) throw Error(p(317));
            f2[Of] = b;
          } else Ig(), 0 === (b.flags & 128) && (b.memoizedState = null), b.flags |= 4;
          S(b);
          f2 = false;
        } else null !== zg && (Fj(zg), zg = null), f2 = true;
        if (!f2) return b.flags & 65536 ? b : null;
      }
      if (0 !== (b.flags & 128)) return b.lanes = c, b;
      d = null !== d;
      d !== (null !== a && null !== a.memoizedState) && d && (b.child.flags |= 8192, 0 !== (b.mode & 1) && (null === a || 0 !== (L.current & 1) ? 0 === T && (T = 3) : tj()));
      null !== b.updateQueue && (b.flags |= 4);
      S(b);
      return null;
    case 4:
      return zh(), Aj(a, b), null === a && sf(b.stateNode.containerInfo), S(b), null;
    case 10:
      return ah(b.type._context), S(b), null;
    case 17:
      return Zf(b.type) && $f(), S(b), null;
    case 19:
      E(L);
      f2 = b.memoizedState;
      if (null === f2) return S(b), null;
      d = 0 !== (b.flags & 128);
      g = f2.rendering;
      if (null === g) if (d) Dj(f2, false);
      else {
        if (0 !== T || null !== a && 0 !== (a.flags & 128)) for (a = b.child; null !== a; ) {
          g = Ch(a);
          if (null !== g) {
            b.flags |= 128;
            Dj(f2, false);
            d = g.updateQueue;
            null !== d && (b.updateQueue = d, b.flags |= 4);
            b.subtreeFlags = 0;
            d = c;
            for (c = b.child; null !== c; ) f2 = c, a = d, f2.flags &= 14680066, g = f2.alternate, null === g ? (f2.childLanes = 0, f2.lanes = a, f2.child = null, f2.subtreeFlags = 0, f2.memoizedProps = null, f2.memoizedState = null, f2.updateQueue = null, f2.dependencies = null, f2.stateNode = null) : (f2.childLanes = g.childLanes, f2.lanes = g.lanes, f2.child = g.child, f2.subtreeFlags = 0, f2.deletions = null, f2.memoizedProps = g.memoizedProps, f2.memoizedState = g.memoizedState, f2.updateQueue = g.updateQueue, f2.type = g.type, a = g.dependencies, f2.dependencies = null === a ? null : { lanes: a.lanes, firstContext: a.firstContext }), c = c.sibling;
            G(L, L.current & 1 | 2);
            return b.child;
          }
          a = a.sibling;
        }
        null !== f2.tail && B() > Gj && (b.flags |= 128, d = true, Dj(f2, false), b.lanes = 4194304);
      }
      else {
        if (!d) if (a = Ch(g), null !== a) {
          if (b.flags |= 128, d = true, c = a.updateQueue, null !== c && (b.updateQueue = c, b.flags |= 4), Dj(f2, true), null === f2.tail && "hidden" === f2.tailMode && !g.alternate && !I) return S(b), null;
        } else 2 * B() - f2.renderingStartTime > Gj && 1073741824 !== c && (b.flags |= 128, d = true, Dj(f2, false), b.lanes = 4194304);
        f2.isBackwards ? (g.sibling = b.child, b.child = g) : (c = f2.last, null !== c ? c.sibling = g : b.child = g, f2.last = g);
      }
      if (null !== f2.tail) return b = f2.tail, f2.rendering = b, f2.tail = b.sibling, f2.renderingStartTime = B(), b.sibling = null, c = L.current, G(L, d ? c & 1 | 2 : c & 1), b;
      S(b);
      return null;
    case 22:
    case 23:
      return Hj(), d = null !== b.memoizedState, null !== a && null !== a.memoizedState !== d && (b.flags |= 8192), d && 0 !== (b.mode & 1) ? 0 !== (fj & 1073741824) && (S(b), b.subtreeFlags & 6 && (b.flags |= 8192)) : S(b), null;
    case 24:
      return null;
    case 25:
      return null;
  }
  throw Error(p(156, b.tag));
}
function Ij(a, b) {
  wg(b);
  switch (b.tag) {
    case 1:
      return Zf(b.type) && $f(), a = b.flags, a & 65536 ? (b.flags = a & -65537 | 128, b) : null;
    case 3:
      return zh(), E(Wf), E(H), Eh(), a = b.flags, 0 !== (a & 65536) && 0 === (a & 128) ? (b.flags = a & -65537 | 128, b) : null;
    case 5:
      return Bh(b), null;
    case 13:
      E(L);
      a = b.memoizedState;
      if (null !== a && null !== a.dehydrated) {
        if (null === b.alternate) throw Error(p(340));
        Ig();
      }
      a = b.flags;
      return a & 65536 ? (b.flags = a & -65537 | 128, b) : null;
    case 19:
      return E(L), null;
    case 4:
      return zh(), null;
    case 10:
      return ah(b.type._context), null;
    case 22:
    case 23:
      return Hj(), null;
    case 24:
      return null;
    default:
      return null;
  }
}
var Jj = false, U = false, Kj = "function" === typeof WeakSet ? WeakSet : Set, V = null;
function Lj(a, b) {
  var c = a.ref;
  if (null !== c) if ("function" === typeof c) try {
    c(null);
  } catch (d) {
    W(a, b, d);
  }
  else c.current = null;
}
function Mj(a, b, c) {
  try {
    c();
  } catch (d) {
    W(a, b, d);
  }
}
var Nj = false;
function Oj(a, b) {
  Cf = dd;
  a = Me();
  if (Ne(a)) {
    if ("selectionStart" in a) var c = { start: a.selectionStart, end: a.selectionEnd };
    else a: {
      c = (c = a.ownerDocument) && c.defaultView || window;
      var d = c.getSelection && c.getSelection();
      if (d && 0 !== d.rangeCount) {
        c = d.anchorNode;
        var e = d.anchorOffset, f2 = d.focusNode;
        d = d.focusOffset;
        try {
          c.nodeType, f2.nodeType;
        } catch (F2) {
          c = null;
          break a;
        }
        var g = 0, h = -1, k2 = -1, l2 = 0, m2 = 0, q2 = a, r2 = null;
        b: for (; ; ) {
          for (var y2; ; ) {
            q2 !== c || 0 !== e && 3 !== q2.nodeType || (h = g + e);
            q2 !== f2 || 0 !== d && 3 !== q2.nodeType || (k2 = g + d);
            3 === q2.nodeType && (g += q2.nodeValue.length);
            if (null === (y2 = q2.firstChild)) break;
            r2 = q2;
            q2 = y2;
          }
          for (; ; ) {
            if (q2 === a) break b;
            r2 === c && ++l2 === e && (h = g);
            r2 === f2 && ++m2 === d && (k2 = g);
            if (null !== (y2 = q2.nextSibling)) break;
            q2 = r2;
            r2 = q2.parentNode;
          }
          q2 = y2;
        }
        c = -1 === h || -1 === k2 ? null : { start: h, end: k2 };
      } else c = null;
    }
    c = c || { start: 0, end: 0 };
  } else c = null;
  Df = { focusedElem: a, selectionRange: c };
  dd = false;
  for (V = b; null !== V; ) if (b = V, a = b.child, 0 !== (b.subtreeFlags & 1028) && null !== a) a.return = b, V = a;
  else for (; null !== V; ) {
    b = V;
    try {
      var n2 = b.alternate;
      if (0 !== (b.flags & 1024)) switch (b.tag) {
        case 0:
        case 11:
        case 15:
          break;
        case 1:
          if (null !== n2) {
            var t2 = n2.memoizedProps, J2 = n2.memoizedState, x2 = b.stateNode, w2 = x2.getSnapshotBeforeUpdate(b.elementType === b.type ? t2 : Ci(b.type, t2), J2);
            x2.__reactInternalSnapshotBeforeUpdate = w2;
          }
          break;
        case 3:
          var u2 = b.stateNode.containerInfo;
          1 === u2.nodeType ? u2.textContent = "" : 9 === u2.nodeType && u2.documentElement && u2.removeChild(u2.documentElement);
          break;
        case 5:
        case 6:
        case 4:
        case 17:
          break;
        default:
          throw Error(p(163));
      }
    } catch (F2) {
      W(b, b.return, F2);
    }
    a = b.sibling;
    if (null !== a) {
      a.return = b.return;
      V = a;
      break;
    }
    V = b.return;
  }
  n2 = Nj;
  Nj = false;
  return n2;
}
function Pj(a, b, c) {
  var d = b.updateQueue;
  d = null !== d ? d.lastEffect : null;
  if (null !== d) {
    var e = d = d.next;
    do {
      if ((e.tag & a) === a) {
        var f2 = e.destroy;
        e.destroy = void 0;
        void 0 !== f2 && Mj(b, c, f2);
      }
      e = e.next;
    } while (e !== d);
  }
}
function Qj(a, b) {
  b = b.updateQueue;
  b = null !== b ? b.lastEffect : null;
  if (null !== b) {
    var c = b = b.next;
    do {
      if ((c.tag & a) === a) {
        var d = c.create;
        c.destroy = d();
      }
      c = c.next;
    } while (c !== b);
  }
}
function Rj(a) {
  var b = a.ref;
  if (null !== b) {
    var c = a.stateNode;
    switch (a.tag) {
      case 5:
        a = c;
        break;
      default:
        a = c;
    }
    "function" === typeof b ? b(a) : b.current = a;
  }
}
function Sj(a) {
  var b = a.alternate;
  null !== b && (a.alternate = null, Sj(b));
  a.child = null;
  a.deletions = null;
  a.sibling = null;
  5 === a.tag && (b = a.stateNode, null !== b && (delete b[Of], delete b[Pf], delete b[of], delete b[Qf], delete b[Rf]));
  a.stateNode = null;
  a.return = null;
  a.dependencies = null;
  a.memoizedProps = null;
  a.memoizedState = null;
  a.pendingProps = null;
  a.stateNode = null;
  a.updateQueue = null;
}
function Tj(a) {
  return 5 === a.tag || 3 === a.tag || 4 === a.tag;
}
function Uj(a) {
  a: for (; ; ) {
    for (; null === a.sibling; ) {
      if (null === a.return || Tj(a.return)) return null;
      a = a.return;
    }
    a.sibling.return = a.return;
    for (a = a.sibling; 5 !== a.tag && 6 !== a.tag && 18 !== a.tag; ) {
      if (a.flags & 2) continue a;
      if (null === a.child || 4 === a.tag) continue a;
      else a.child.return = a, a = a.child;
    }
    if (!(a.flags & 2)) return a.stateNode;
  }
}
function Vj(a, b, c) {
  var d = a.tag;
  if (5 === d || 6 === d) a = a.stateNode, b ? 8 === c.nodeType ? c.parentNode.insertBefore(a, b) : c.insertBefore(a, b) : (8 === c.nodeType ? (b = c.parentNode, b.insertBefore(a, c)) : (b = c, b.appendChild(a)), c = c._reactRootContainer, null !== c && void 0 !== c || null !== b.onclick || (b.onclick = Bf));
  else if (4 !== d && (a = a.child, null !== a)) for (Vj(a, b, c), a = a.sibling; null !== a; ) Vj(a, b, c), a = a.sibling;
}
function Wj(a, b, c) {
  var d = a.tag;
  if (5 === d || 6 === d) a = a.stateNode, b ? c.insertBefore(a, b) : c.appendChild(a);
  else if (4 !== d && (a = a.child, null !== a)) for (Wj(a, b, c), a = a.sibling; null !== a; ) Wj(a, b, c), a = a.sibling;
}
var X = null, Xj = false;
function Yj(a, b, c) {
  for (c = c.child; null !== c; ) Zj(a, b, c), c = c.sibling;
}
function Zj(a, b, c) {
  if (lc && "function" === typeof lc.onCommitFiberUnmount) try {
    lc.onCommitFiberUnmount(kc, c);
  } catch (h) {
  }
  switch (c.tag) {
    case 5:
      U || Lj(c, b);
    case 6:
      var d = X, e = Xj;
      X = null;
      Yj(a, b, c);
      X = d;
      Xj = e;
      null !== X && (Xj ? (a = X, c = c.stateNode, 8 === a.nodeType ? a.parentNode.removeChild(c) : a.removeChild(c)) : X.removeChild(c.stateNode));
      break;
    case 18:
      null !== X && (Xj ? (a = X, c = c.stateNode, 8 === a.nodeType ? Kf(a.parentNode, c) : 1 === a.nodeType && Kf(a, c), bd(a)) : Kf(X, c.stateNode));
      break;
    case 4:
      d = X;
      e = Xj;
      X = c.stateNode.containerInfo;
      Xj = true;
      Yj(a, b, c);
      X = d;
      Xj = e;
      break;
    case 0:
    case 11:
    case 14:
    case 15:
      if (!U && (d = c.updateQueue, null !== d && (d = d.lastEffect, null !== d))) {
        e = d = d.next;
        do {
          var f2 = e, g = f2.destroy;
          f2 = f2.tag;
          void 0 !== g && (0 !== (f2 & 2) ? Mj(c, b, g) : 0 !== (f2 & 4) && Mj(c, b, g));
          e = e.next;
        } while (e !== d);
      }
      Yj(a, b, c);
      break;
    case 1:
      if (!U && (Lj(c, b), d = c.stateNode, "function" === typeof d.componentWillUnmount)) try {
        d.props = c.memoizedProps, d.state = c.memoizedState, d.componentWillUnmount();
      } catch (h) {
        W(c, b, h);
      }
      Yj(a, b, c);
      break;
    case 21:
      Yj(a, b, c);
      break;
    case 22:
      c.mode & 1 ? (U = (d = U) || null !== c.memoizedState, Yj(a, b, c), U = d) : Yj(a, b, c);
      break;
    default:
      Yj(a, b, c);
  }
}
function ak(a) {
  var b = a.updateQueue;
  if (null !== b) {
    a.updateQueue = null;
    var c = a.stateNode;
    null === c && (c = a.stateNode = new Kj());
    b.forEach(function(b2) {
      var d = bk.bind(null, a, b2);
      c.has(b2) || (c.add(b2), b2.then(d, d));
    });
  }
}
function ck(a, b) {
  var c = b.deletions;
  if (null !== c) for (var d = 0; d < c.length; d++) {
    var e = c[d];
    try {
      var f2 = a, g = b, h = g;
      a: for (; null !== h; ) {
        switch (h.tag) {
          case 5:
            X = h.stateNode;
            Xj = false;
            break a;
          case 3:
            X = h.stateNode.containerInfo;
            Xj = true;
            break a;
          case 4:
            X = h.stateNode.containerInfo;
            Xj = true;
            break a;
        }
        h = h.return;
      }
      if (null === X) throw Error(p(160));
      Zj(f2, g, e);
      X = null;
      Xj = false;
      var k2 = e.alternate;
      null !== k2 && (k2.return = null);
      e.return = null;
    } catch (l2) {
      W(e, b, l2);
    }
  }
  if (b.subtreeFlags & 12854) for (b = b.child; null !== b; ) dk(b, a), b = b.sibling;
}
function dk(a, b) {
  var c = a.alternate, d = a.flags;
  switch (a.tag) {
    case 0:
    case 11:
    case 14:
    case 15:
      ck(b, a);
      ek(a);
      if (d & 4) {
        try {
          Pj(3, a, a.return), Qj(3, a);
        } catch (t2) {
          W(a, a.return, t2);
        }
        try {
          Pj(5, a, a.return);
        } catch (t2) {
          W(a, a.return, t2);
        }
      }
      break;
    case 1:
      ck(b, a);
      ek(a);
      d & 512 && null !== c && Lj(c, c.return);
      break;
    case 5:
      ck(b, a);
      ek(a);
      d & 512 && null !== c && Lj(c, c.return);
      if (a.flags & 32) {
        var e = a.stateNode;
        try {
          ob(e, "");
        } catch (t2) {
          W(a, a.return, t2);
        }
      }
      if (d & 4 && (e = a.stateNode, null != e)) {
        var f2 = a.memoizedProps, g = null !== c ? c.memoizedProps : f2, h = a.type, k2 = a.updateQueue;
        a.updateQueue = null;
        if (null !== k2) try {
          "input" === h && "radio" === f2.type && null != f2.name && ab(e, f2);
          vb(h, g);
          var l2 = vb(h, f2);
          for (g = 0; g < k2.length; g += 2) {
            var m2 = k2[g], q2 = k2[g + 1];
            "style" === m2 ? sb(e, q2) : "dangerouslySetInnerHTML" === m2 ? nb(e, q2) : "children" === m2 ? ob(e, q2) : ta(e, m2, q2, l2);
          }
          switch (h) {
            case "input":
              bb(e, f2);
              break;
            case "textarea":
              ib(e, f2);
              break;
            case "select":
              var r2 = e._wrapperState.wasMultiple;
              e._wrapperState.wasMultiple = !!f2.multiple;
              var y2 = f2.value;
              null != y2 ? fb(e, !!f2.multiple, y2, false) : r2 !== !!f2.multiple && (null != f2.defaultValue ? fb(
                e,
                !!f2.multiple,
                f2.defaultValue,
                true
              ) : fb(e, !!f2.multiple, f2.multiple ? [] : "", false));
          }
          e[Pf] = f2;
        } catch (t2) {
          W(a, a.return, t2);
        }
      }
      break;
    case 6:
      ck(b, a);
      ek(a);
      if (d & 4) {
        if (null === a.stateNode) throw Error(p(162));
        e = a.stateNode;
        f2 = a.memoizedProps;
        try {
          e.nodeValue = f2;
        } catch (t2) {
          W(a, a.return, t2);
        }
      }
      break;
    case 3:
      ck(b, a);
      ek(a);
      if (d & 4 && null !== c && c.memoizedState.isDehydrated) try {
        bd(b.containerInfo);
      } catch (t2) {
        W(a, a.return, t2);
      }
      break;
    case 4:
      ck(b, a);
      ek(a);
      break;
    case 13:
      ck(b, a);
      ek(a);
      e = a.child;
      e.flags & 8192 && (f2 = null !== e.memoizedState, e.stateNode.isHidden = f2, !f2 || null !== e.alternate && null !== e.alternate.memoizedState || (fk = B()));
      d & 4 && ak(a);
      break;
    case 22:
      m2 = null !== c && null !== c.memoizedState;
      a.mode & 1 ? (U = (l2 = U) || m2, ck(b, a), U = l2) : ck(b, a);
      ek(a);
      if (d & 8192) {
        l2 = null !== a.memoizedState;
        if ((a.stateNode.isHidden = l2) && !m2 && 0 !== (a.mode & 1)) for (V = a, m2 = a.child; null !== m2; ) {
          for (q2 = V = m2; null !== V; ) {
            r2 = V;
            y2 = r2.child;
            switch (r2.tag) {
              case 0:
              case 11:
              case 14:
              case 15:
                Pj(4, r2, r2.return);
                break;
              case 1:
                Lj(r2, r2.return);
                var n2 = r2.stateNode;
                if ("function" === typeof n2.componentWillUnmount) {
                  d = r2;
                  c = r2.return;
                  try {
                    b = d, n2.props = b.memoizedProps, n2.state = b.memoizedState, n2.componentWillUnmount();
                  } catch (t2) {
                    W(d, c, t2);
                  }
                }
                break;
              case 5:
                Lj(r2, r2.return);
                break;
              case 22:
                if (null !== r2.memoizedState) {
                  gk(q2);
                  continue;
                }
            }
            null !== y2 ? (y2.return = r2, V = y2) : gk(q2);
          }
          m2 = m2.sibling;
        }
        a: for (m2 = null, q2 = a; ; ) {
          if (5 === q2.tag) {
            if (null === m2) {
              m2 = q2;
              try {
                e = q2.stateNode, l2 ? (f2 = e.style, "function" === typeof f2.setProperty ? f2.setProperty("display", "none", "important") : f2.display = "none") : (h = q2.stateNode, k2 = q2.memoizedProps.style, g = void 0 !== k2 && null !== k2 && k2.hasOwnProperty("display") ? k2.display : null, h.style.display = rb("display", g));
              } catch (t2) {
                W(a, a.return, t2);
              }
            }
          } else if (6 === q2.tag) {
            if (null === m2) try {
              q2.stateNode.nodeValue = l2 ? "" : q2.memoizedProps;
            } catch (t2) {
              W(a, a.return, t2);
            }
          } else if ((22 !== q2.tag && 23 !== q2.tag || null === q2.memoizedState || q2 === a) && null !== q2.child) {
            q2.child.return = q2;
            q2 = q2.child;
            continue;
          }
          if (q2 === a) break a;
          for (; null === q2.sibling; ) {
            if (null === q2.return || q2.return === a) break a;
            m2 === q2 && (m2 = null);
            q2 = q2.return;
          }
          m2 === q2 && (m2 = null);
          q2.sibling.return = q2.return;
          q2 = q2.sibling;
        }
      }
      break;
    case 19:
      ck(b, a);
      ek(a);
      d & 4 && ak(a);
      break;
    case 21:
      break;
    default:
      ck(
        b,
        a
      ), ek(a);
  }
}
function ek(a) {
  var b = a.flags;
  if (b & 2) {
    try {
      a: {
        for (var c = a.return; null !== c; ) {
          if (Tj(c)) {
            var d = c;
            break a;
          }
          c = c.return;
        }
        throw Error(p(160));
      }
      switch (d.tag) {
        case 5:
          var e = d.stateNode;
          d.flags & 32 && (ob(e, ""), d.flags &= -33);
          var f2 = Uj(a);
          Wj(a, f2, e);
          break;
        case 3:
        case 4:
          var g = d.stateNode.containerInfo, h = Uj(a);
          Vj(a, h, g);
          break;
        default:
          throw Error(p(161));
      }
    } catch (k2) {
      W(a, a.return, k2);
    }
    a.flags &= -3;
  }
  b & 4096 && (a.flags &= -4097);
}
function hk(a, b, c) {
  V = a;
  ik(a);
}
function ik(a, b, c) {
  for (var d = 0 !== (a.mode & 1); null !== V; ) {
    var e = V, f2 = e.child;
    if (22 === e.tag && d) {
      var g = null !== e.memoizedState || Jj;
      if (!g) {
        var h = e.alternate, k2 = null !== h && null !== h.memoizedState || U;
        h = Jj;
        var l2 = U;
        Jj = g;
        if ((U = k2) && !l2) for (V = e; null !== V; ) g = V, k2 = g.child, 22 === g.tag && null !== g.memoizedState ? jk(e) : null !== k2 ? (k2.return = g, V = k2) : jk(e);
        for (; null !== f2; ) V = f2, ik(f2), f2 = f2.sibling;
        V = e;
        Jj = h;
        U = l2;
      }
      kk(a);
    } else 0 !== (e.subtreeFlags & 8772) && null !== f2 ? (f2.return = e, V = f2) : kk(a);
  }
}
function kk(a) {
  for (; null !== V; ) {
    var b = V;
    if (0 !== (b.flags & 8772)) {
      var c = b.alternate;
      try {
        if (0 !== (b.flags & 8772)) switch (b.tag) {
          case 0:
          case 11:
          case 15:
            U || Qj(5, b);
            break;
          case 1:
            var d = b.stateNode;
            if (b.flags & 4 && !U) if (null === c) d.componentDidMount();
            else {
              var e = b.elementType === b.type ? c.memoizedProps : Ci(b.type, c.memoizedProps);
              d.componentDidUpdate(e, c.memoizedState, d.__reactInternalSnapshotBeforeUpdate);
            }
            var f2 = b.updateQueue;
            null !== f2 && sh(b, f2, d);
            break;
          case 3:
            var g = b.updateQueue;
            if (null !== g) {
              c = null;
              if (null !== b.child) switch (b.child.tag) {
                case 5:
                  c = b.child.stateNode;
                  break;
                case 1:
                  c = b.child.stateNode;
              }
              sh(b, g, c);
            }
            break;
          case 5:
            var h = b.stateNode;
            if (null === c && b.flags & 4) {
              c = h;
              var k2 = b.memoizedProps;
              switch (b.type) {
                case "button":
                case "input":
                case "select":
                case "textarea":
                  k2.autoFocus && c.focus();
                  break;
                case "img":
                  k2.src && (c.src = k2.src);
              }
            }
            break;
          case 6:
            break;
          case 4:
            break;
          case 12:
            break;
          case 13:
            if (null === b.memoizedState) {
              var l2 = b.alternate;
              if (null !== l2) {
                var m2 = l2.memoizedState;
                if (null !== m2) {
                  var q2 = m2.dehydrated;
                  null !== q2 && bd(q2);
                }
              }
            }
            break;
          case 19:
          case 17:
          case 21:
          case 22:
          case 23:
          case 25:
            break;
          default:
            throw Error(p(163));
        }
        U || b.flags & 512 && Rj(b);
      } catch (r2) {
        W(b, b.return, r2);
      }
    }
    if (b === a) {
      V = null;
      break;
    }
    c = b.sibling;
    if (null !== c) {
      c.return = b.return;
      V = c;
      break;
    }
    V = b.return;
  }
}
function gk(a) {
  for (; null !== V; ) {
    var b = V;
    if (b === a) {
      V = null;
      break;
    }
    var c = b.sibling;
    if (null !== c) {
      c.return = b.return;
      V = c;
      break;
    }
    V = b.return;
  }
}
function jk(a) {
  for (; null !== V; ) {
    var b = V;
    try {
      switch (b.tag) {
        case 0:
        case 11:
        case 15:
          var c = b.return;
          try {
            Qj(4, b);
          } catch (k2) {
            W(b, c, k2);
          }
          break;
        case 1:
          var d = b.stateNode;
          if ("function" === typeof d.componentDidMount) {
            var e = b.return;
            try {
              d.componentDidMount();
            } catch (k2) {
              W(b, e, k2);
            }
          }
          var f2 = b.return;
          try {
            Rj(b);
          } catch (k2) {
            W(b, f2, k2);
          }
          break;
        case 5:
          var g = b.return;
          try {
            Rj(b);
          } catch (k2) {
            W(b, g, k2);
          }
      }
    } catch (k2) {
      W(b, b.return, k2);
    }
    if (b === a) {
      V = null;
      break;
    }
    var h = b.sibling;
    if (null !== h) {
      h.return = b.return;
      V = h;
      break;
    }
    V = b.return;
  }
}
var lk = Math.ceil, mk = ua.ReactCurrentDispatcher, nk = ua.ReactCurrentOwner, ok = ua.ReactCurrentBatchConfig, K = 0, Q = null, Y = null, Z = 0, fj = 0, ej = Uf(0), T = 0, pk = null, rh = 0, qk = 0, rk = 0, sk = null, tk = null, fk = 0, Gj = Infinity, uk = null, Oi = false, Pi = null, Ri = null, vk = false, wk = null, xk = 0, yk = 0, zk = null, Ak = -1, Bk = 0;
function R() {
  return 0 !== (K & 6) ? B() : -1 !== Ak ? Ak : Ak = B();
}
function yi(a) {
  if (0 === (a.mode & 1)) return 1;
  if (0 !== (K & 2) && 0 !== Z) return Z & -Z;
  if (null !== Kg.transition) return 0 === Bk && (Bk = yc()), Bk;
  a = C;
  if (0 !== a) return a;
  a = window.event;
  a = void 0 === a ? 16 : jd(a.type);
  return a;
}
function gi(a, b, c, d) {
  if (50 < yk) throw yk = 0, zk = null, Error(p(185));
  Ac(a, c, d);
  if (0 === (K & 2) || a !== Q) a === Q && (0 === (K & 2) && (qk |= c), 4 === T && Ck(a, Z)), Dk(a, d), 1 === c && 0 === K && 0 === (b.mode & 1) && (Gj = B() + 500, fg && jg());
}
function Dk(a, b) {
  var c = a.callbackNode;
  wc(a, b);
  var d = uc(a, a === Q ? Z : 0);
  if (0 === d) null !== c && bc(c), a.callbackNode = null, a.callbackPriority = 0;
  else if (b = d & -d, a.callbackPriority !== b) {
    null != c && bc(c);
    if (1 === b) 0 === a.tag ? ig(Ek.bind(null, a)) : hg(Ek.bind(null, a)), Jf(function() {
      0 === (K & 6) && jg();
    }), c = null;
    else {
      switch (Dc(d)) {
        case 1:
          c = fc;
          break;
        case 4:
          c = gc;
          break;
        case 16:
          c = hc;
          break;
        case 536870912:
          c = jc;
          break;
        default:
          c = hc;
      }
      c = Fk(c, Gk.bind(null, a));
    }
    a.callbackPriority = b;
    a.callbackNode = c;
  }
}
function Gk(a, b) {
  Ak = -1;
  Bk = 0;
  if (0 !== (K & 6)) throw Error(p(327));
  var c = a.callbackNode;
  if (Hk() && a.callbackNode !== c) return null;
  var d = uc(a, a === Q ? Z : 0);
  if (0 === d) return null;
  if (0 !== (d & 30) || 0 !== (d & a.expiredLanes) || b) b = Ik(a, d);
  else {
    b = d;
    var e = K;
    K |= 2;
    var f2 = Jk();
    if (Q !== a || Z !== b) uk = null, Gj = B() + 500, Kk(a, b);
    do
      try {
        Lk();
        break;
      } catch (h) {
        Mk(a, h);
      }
    while (1);
    $g();
    mk.current = f2;
    K = e;
    null !== Y ? b = 0 : (Q = null, Z = 0, b = T);
  }
  if (0 !== b) {
    2 === b && (e = xc(a), 0 !== e && (d = e, b = Nk(a, e)));
    if (1 === b) throw c = pk, Kk(a, 0), Ck(a, d), Dk(a, B()), c;
    if (6 === b) Ck(a, d);
    else {
      e = a.current.alternate;
      if (0 === (d & 30) && !Ok(e) && (b = Ik(a, d), 2 === b && (f2 = xc(a), 0 !== f2 && (d = f2, b = Nk(a, f2))), 1 === b)) throw c = pk, Kk(a, 0), Ck(a, d), Dk(a, B()), c;
      a.finishedWork = e;
      a.finishedLanes = d;
      switch (b) {
        case 0:
        case 1:
          throw Error(p(345));
        case 2:
          Pk(a, tk, uk);
          break;
        case 3:
          Ck(a, d);
          if ((d & 130023424) === d && (b = fk + 500 - B(), 10 < b)) {
            if (0 !== uc(a, 0)) break;
            e = a.suspendedLanes;
            if ((e & d) !== d) {
              R();
              a.pingedLanes |= a.suspendedLanes & e;
              break;
            }
            a.timeoutHandle = Ff(Pk.bind(null, a, tk, uk), b);
            break;
          }
          Pk(a, tk, uk);
          break;
        case 4:
          Ck(a, d);
          if ((d & 4194240) === d) break;
          b = a.eventTimes;
          for (e = -1; 0 < d; ) {
            var g = 31 - oc(d);
            f2 = 1 << g;
            g = b[g];
            g > e && (e = g);
            d &= ~f2;
          }
          d = e;
          d = B() - d;
          d = (120 > d ? 120 : 480 > d ? 480 : 1080 > d ? 1080 : 1920 > d ? 1920 : 3e3 > d ? 3e3 : 4320 > d ? 4320 : 1960 * lk(d / 1960)) - d;
          if (10 < d) {
            a.timeoutHandle = Ff(Pk.bind(null, a, tk, uk), d);
            break;
          }
          Pk(a, tk, uk);
          break;
        case 5:
          Pk(a, tk, uk);
          break;
        default:
          throw Error(p(329));
      }
    }
  }
  Dk(a, B());
  return a.callbackNode === c ? Gk.bind(null, a) : null;
}
function Nk(a, b) {
  var c = sk;
  a.current.memoizedState.isDehydrated && (Kk(a, b).flags |= 256);
  a = Ik(a, b);
  2 !== a && (b = tk, tk = c, null !== b && Fj(b));
  return a;
}
function Fj(a) {
  null === tk ? tk = a : tk.push.apply(tk, a);
}
function Ok(a) {
  for (var b = a; ; ) {
    if (b.flags & 16384) {
      var c = b.updateQueue;
      if (null !== c && (c = c.stores, null !== c)) for (var d = 0; d < c.length; d++) {
        var e = c[d], f2 = e.getSnapshot;
        e = e.value;
        try {
          if (!He(f2(), e)) return false;
        } catch (g) {
          return false;
        }
      }
    }
    c = b.child;
    if (b.subtreeFlags & 16384 && null !== c) c.return = b, b = c;
    else {
      if (b === a) break;
      for (; null === b.sibling; ) {
        if (null === b.return || b.return === a) return true;
        b = b.return;
      }
      b.sibling.return = b.return;
      b = b.sibling;
    }
  }
  return true;
}
function Ck(a, b) {
  b &= ~rk;
  b &= ~qk;
  a.suspendedLanes |= b;
  a.pingedLanes &= ~b;
  for (a = a.expirationTimes; 0 < b; ) {
    var c = 31 - oc(b), d = 1 << c;
    a[c] = -1;
    b &= ~d;
  }
}
function Ek(a) {
  if (0 !== (K & 6)) throw Error(p(327));
  Hk();
  var b = uc(a, 0);
  if (0 === (b & 1)) return Dk(a, B()), null;
  var c = Ik(a, b);
  if (0 !== a.tag && 2 === c) {
    var d = xc(a);
    0 !== d && (b = d, c = Nk(a, d));
  }
  if (1 === c) throw c = pk, Kk(a, 0), Ck(a, b), Dk(a, B()), c;
  if (6 === c) throw Error(p(345));
  a.finishedWork = a.current.alternate;
  a.finishedLanes = b;
  Pk(a, tk, uk);
  Dk(a, B());
  return null;
}
function Qk(a, b) {
  var c = K;
  K |= 1;
  try {
    return a(b);
  } finally {
    K = c, 0 === K && (Gj = B() + 500, fg && jg());
  }
}
function Rk(a) {
  null !== wk && 0 === wk.tag && 0 === (K & 6) && Hk();
  var b = K;
  K |= 1;
  var c = ok.transition, d = C;
  try {
    if (ok.transition = null, C = 1, a) return a();
  } finally {
    C = d, ok.transition = c, K = b, 0 === (K & 6) && jg();
  }
}
function Hj() {
  fj = ej.current;
  E(ej);
}
function Kk(a, b) {
  a.finishedWork = null;
  a.finishedLanes = 0;
  var c = a.timeoutHandle;
  -1 !== c && (a.timeoutHandle = -1, Gf(c));
  if (null !== Y) for (c = Y.return; null !== c; ) {
    var d = c;
    wg(d);
    switch (d.tag) {
      case 1:
        d = d.type.childContextTypes;
        null !== d && void 0 !== d && $f();
        break;
      case 3:
        zh();
        E(Wf);
        E(H);
        Eh();
        break;
      case 5:
        Bh(d);
        break;
      case 4:
        zh();
        break;
      case 13:
        E(L);
        break;
      case 19:
        E(L);
        break;
      case 10:
        ah(d.type._context);
        break;
      case 22:
      case 23:
        Hj();
    }
    c = c.return;
  }
  Q = a;
  Y = a = Pg(a.current, null);
  Z = fj = b;
  T = 0;
  pk = null;
  rk = qk = rh = 0;
  tk = sk = null;
  if (null !== fh) {
    for (b = 0; b < fh.length; b++) if (c = fh[b], d = c.interleaved, null !== d) {
      c.interleaved = null;
      var e = d.next, f2 = c.pending;
      if (null !== f2) {
        var g = f2.next;
        f2.next = e;
        d.next = g;
      }
      c.pending = d;
    }
    fh = null;
  }
  return a;
}
function Mk(a, b) {
  do {
    var c = Y;
    try {
      $g();
      Fh.current = Rh;
      if (Ih) {
        for (var d = M.memoizedState; null !== d; ) {
          var e = d.queue;
          null !== e && (e.pending = null);
          d = d.next;
        }
        Ih = false;
      }
      Hh = 0;
      O = N = M = null;
      Jh = false;
      Kh = 0;
      nk.current = null;
      if (null === c || null === c.return) {
        T = 1;
        pk = b;
        Y = null;
        break;
      }
      a: {
        var f2 = a, g = c.return, h = c, k2 = b;
        b = Z;
        h.flags |= 32768;
        if (null !== k2 && "object" === typeof k2 && "function" === typeof k2.then) {
          var l2 = k2, m2 = h, q2 = m2.tag;
          if (0 === (m2.mode & 1) && (0 === q2 || 11 === q2 || 15 === q2)) {
            var r2 = m2.alternate;
            r2 ? (m2.updateQueue = r2.updateQueue, m2.memoizedState = r2.memoizedState, m2.lanes = r2.lanes) : (m2.updateQueue = null, m2.memoizedState = null);
          }
          var y2 = Ui(g);
          if (null !== y2) {
            y2.flags &= -257;
            Vi(y2, g, h, f2, b);
            y2.mode & 1 && Si(f2, l2, b);
            b = y2;
            k2 = l2;
            var n2 = b.updateQueue;
            if (null === n2) {
              var t2 = /* @__PURE__ */ new Set();
              t2.add(k2);
              b.updateQueue = t2;
            } else n2.add(k2);
            break a;
          } else {
            if (0 === (b & 1)) {
              Si(f2, l2, b);
              tj();
              break a;
            }
            k2 = Error(p(426));
          }
        } else if (I && h.mode & 1) {
          var J2 = Ui(g);
          if (null !== J2) {
            0 === (J2.flags & 65536) && (J2.flags |= 256);
            Vi(J2, g, h, f2, b);
            Jg(Ji(k2, h));
            break a;
          }
        }
        f2 = k2 = Ji(k2, h);
        4 !== T && (T = 2);
        null === sk ? sk = [f2] : sk.push(f2);
        f2 = g;
        do {
          switch (f2.tag) {
            case 3:
              f2.flags |= 65536;
              b &= -b;
              f2.lanes |= b;
              var x2 = Ni(f2, k2, b);
              ph(f2, x2);
              break a;
            case 1:
              h = k2;
              var w2 = f2.type, u2 = f2.stateNode;
              if (0 === (f2.flags & 128) && ("function" === typeof w2.getDerivedStateFromError || null !== u2 && "function" === typeof u2.componentDidCatch && (null === Ri || !Ri.has(u2)))) {
                f2.flags |= 65536;
                b &= -b;
                f2.lanes |= b;
                var F2 = Qi(f2, h, b);
                ph(f2, F2);
                break a;
              }
          }
          f2 = f2.return;
        } while (null !== f2);
      }
      Sk(c);
    } catch (na) {
      b = na;
      Y === c && null !== c && (Y = c = c.return);
      continue;
    }
    break;
  } while (1);
}
function Jk() {
  var a = mk.current;
  mk.current = Rh;
  return null === a ? Rh : a;
}
function tj() {
  if (0 === T || 3 === T || 2 === T) T = 4;
  null === Q || 0 === (rh & 268435455) && 0 === (qk & 268435455) || Ck(Q, Z);
}
function Ik(a, b) {
  var c = K;
  K |= 2;
  var d = Jk();
  if (Q !== a || Z !== b) uk = null, Kk(a, b);
  do
    try {
      Tk();
      break;
    } catch (e) {
      Mk(a, e);
    }
  while (1);
  $g();
  K = c;
  mk.current = d;
  if (null !== Y) throw Error(p(261));
  Q = null;
  Z = 0;
  return T;
}
function Tk() {
  for (; null !== Y; ) Uk(Y);
}
function Lk() {
  for (; null !== Y && !cc(); ) Uk(Y);
}
function Uk(a) {
  var b = Vk(a.alternate, a, fj);
  a.memoizedProps = a.pendingProps;
  null === b ? Sk(a) : Y = b;
  nk.current = null;
}
function Sk(a) {
  var b = a;
  do {
    var c = b.alternate;
    a = b.return;
    if (0 === (b.flags & 32768)) {
      if (c = Ej(c, b, fj), null !== c) {
        Y = c;
        return;
      }
    } else {
      c = Ij(c, b);
      if (null !== c) {
        c.flags &= 32767;
        Y = c;
        return;
      }
      if (null !== a) a.flags |= 32768, a.subtreeFlags = 0, a.deletions = null;
      else {
        T = 6;
        Y = null;
        return;
      }
    }
    b = b.sibling;
    if (null !== b) {
      Y = b;
      return;
    }
    Y = b = a;
  } while (null !== b);
  0 === T && (T = 5);
}
function Pk(a, b, c) {
  var d = C, e = ok.transition;
  try {
    ok.transition = null, C = 1, Wk(a, b, c, d);
  } finally {
    ok.transition = e, C = d;
  }
  return null;
}
function Wk(a, b, c, d) {
  do
    Hk();
  while (null !== wk);
  if (0 !== (K & 6)) throw Error(p(327));
  c = a.finishedWork;
  var e = a.finishedLanes;
  if (null === c) return null;
  a.finishedWork = null;
  a.finishedLanes = 0;
  if (c === a.current) throw Error(p(177));
  a.callbackNode = null;
  a.callbackPriority = 0;
  var f2 = c.lanes | c.childLanes;
  Bc(a, f2);
  a === Q && (Y = Q = null, Z = 0);
  0 === (c.subtreeFlags & 2064) && 0 === (c.flags & 2064) || vk || (vk = true, Fk(hc, function() {
    Hk();
    return null;
  }));
  f2 = 0 !== (c.flags & 15990);
  if (0 !== (c.subtreeFlags & 15990) || f2) {
    f2 = ok.transition;
    ok.transition = null;
    var g = C;
    C = 1;
    var h = K;
    K |= 4;
    nk.current = null;
    Oj(a, c);
    dk(c, a);
    Oe(Df);
    dd = !!Cf;
    Df = Cf = null;
    a.current = c;
    hk(c);
    dc();
    K = h;
    C = g;
    ok.transition = f2;
  } else a.current = c;
  vk && (vk = false, wk = a, xk = e);
  f2 = a.pendingLanes;
  0 === f2 && (Ri = null);
  mc(c.stateNode);
  Dk(a, B());
  if (null !== b) for (d = a.onRecoverableError, c = 0; c < b.length; c++) e = b[c], d(e.value, { componentStack: e.stack, digest: e.digest });
  if (Oi) throw Oi = false, a = Pi, Pi = null, a;
  0 !== (xk & 1) && 0 !== a.tag && Hk();
  f2 = a.pendingLanes;
  0 !== (f2 & 1) ? a === zk ? yk++ : (yk = 0, zk = a) : yk = 0;
  jg();
  return null;
}
function Hk() {
  if (null !== wk) {
    var a = Dc(xk), b = ok.transition, c = C;
    try {
      ok.transition = null;
      C = 16 > a ? 16 : a;
      if (null === wk) var d = false;
      else {
        a = wk;
        wk = null;
        xk = 0;
        if (0 !== (K & 6)) throw Error(p(331));
        var e = K;
        K |= 4;
        for (V = a.current; null !== V; ) {
          var f2 = V, g = f2.child;
          if (0 !== (V.flags & 16)) {
            var h = f2.deletions;
            if (null !== h) {
              for (var k2 = 0; k2 < h.length; k2++) {
                var l2 = h[k2];
                for (V = l2; null !== V; ) {
                  var m2 = V;
                  switch (m2.tag) {
                    case 0:
                    case 11:
                    case 15:
                      Pj(8, m2, f2);
                  }
                  var q2 = m2.child;
                  if (null !== q2) q2.return = m2, V = q2;
                  else for (; null !== V; ) {
                    m2 = V;
                    var r2 = m2.sibling, y2 = m2.return;
                    Sj(m2);
                    if (m2 === l2) {
                      V = null;
                      break;
                    }
                    if (null !== r2) {
                      r2.return = y2;
                      V = r2;
                      break;
                    }
                    V = y2;
                  }
                }
              }
              var n2 = f2.alternate;
              if (null !== n2) {
                var t2 = n2.child;
                if (null !== t2) {
                  n2.child = null;
                  do {
                    var J2 = t2.sibling;
                    t2.sibling = null;
                    t2 = J2;
                  } while (null !== t2);
                }
              }
              V = f2;
            }
          }
          if (0 !== (f2.subtreeFlags & 2064) && null !== g) g.return = f2, V = g;
          else b: for (; null !== V; ) {
            f2 = V;
            if (0 !== (f2.flags & 2048)) switch (f2.tag) {
              case 0:
              case 11:
              case 15:
                Pj(9, f2, f2.return);
            }
            var x2 = f2.sibling;
            if (null !== x2) {
              x2.return = f2.return;
              V = x2;
              break b;
            }
            V = f2.return;
          }
        }
        var w2 = a.current;
        for (V = w2; null !== V; ) {
          g = V;
          var u2 = g.child;
          if (0 !== (g.subtreeFlags & 2064) && null !== u2) u2.return = g, V = u2;
          else b: for (g = w2; null !== V; ) {
            h = V;
            if (0 !== (h.flags & 2048)) try {
              switch (h.tag) {
                case 0:
                case 11:
                case 15:
                  Qj(9, h);
              }
            } catch (na) {
              W(h, h.return, na);
            }
            if (h === g) {
              V = null;
              break b;
            }
            var F2 = h.sibling;
            if (null !== F2) {
              F2.return = h.return;
              V = F2;
              break b;
            }
            V = h.return;
          }
        }
        K = e;
        jg();
        if (lc && "function" === typeof lc.onPostCommitFiberRoot) try {
          lc.onPostCommitFiberRoot(kc, a);
        } catch (na) {
        }
        d = true;
      }
      return d;
    } finally {
      C = c, ok.transition = b;
    }
  }
  return false;
}
function Xk(a, b, c) {
  b = Ji(c, b);
  b = Ni(a, b, 1);
  a = nh(a, b, 1);
  b = R();
  null !== a && (Ac(a, 1, b), Dk(a, b));
}
function W(a, b, c) {
  if (3 === a.tag) Xk(a, a, c);
  else for (; null !== b; ) {
    if (3 === b.tag) {
      Xk(b, a, c);
      break;
    } else if (1 === b.tag) {
      var d = b.stateNode;
      if ("function" === typeof b.type.getDerivedStateFromError || "function" === typeof d.componentDidCatch && (null === Ri || !Ri.has(d))) {
        a = Ji(c, a);
        a = Qi(b, a, 1);
        b = nh(b, a, 1);
        a = R();
        null !== b && (Ac(b, 1, a), Dk(b, a));
        break;
      }
    }
    b = b.return;
  }
}
function Ti(a, b, c) {
  var d = a.pingCache;
  null !== d && d.delete(b);
  b = R();
  a.pingedLanes |= a.suspendedLanes & c;
  Q === a && (Z & c) === c && (4 === T || 3 === T && (Z & 130023424) === Z && 500 > B() - fk ? Kk(a, 0) : rk |= c);
  Dk(a, b);
}
function Yk(a, b) {
  0 === b && (0 === (a.mode & 1) ? b = 1 : (b = sc, sc <<= 1, 0 === (sc & 130023424) && (sc = 4194304)));
  var c = R();
  a = ih(a, b);
  null !== a && (Ac(a, b, c), Dk(a, c));
}
function uj(a) {
  var b = a.memoizedState, c = 0;
  null !== b && (c = b.retryLane);
  Yk(a, c);
}
function bk(a, b) {
  var c = 0;
  switch (a.tag) {
    case 13:
      var d = a.stateNode;
      var e = a.memoizedState;
      null !== e && (c = e.retryLane);
      break;
    case 19:
      d = a.stateNode;
      break;
    default:
      throw Error(p(314));
  }
  null !== d && d.delete(b);
  Yk(a, c);
}
var Vk;
Vk = function(a, b, c) {
  if (null !== a) if (a.memoizedProps !== b.pendingProps || Wf.current) dh = true;
  else {
    if (0 === (a.lanes & c) && 0 === (b.flags & 128)) return dh = false, yj(a, b, c);
    dh = 0 !== (a.flags & 131072) ? true : false;
  }
  else dh = false, I && 0 !== (b.flags & 1048576) && ug(b, ng, b.index);
  b.lanes = 0;
  switch (b.tag) {
    case 2:
      var d = b.type;
      ij(a, b);
      a = b.pendingProps;
      var e = Yf(b, H.current);
      ch(b, c);
      e = Nh(null, b, d, a, e, c);
      var f2 = Sh();
      b.flags |= 1;
      "object" === typeof e && null !== e && "function" === typeof e.render && void 0 === e.$$typeof ? (b.tag = 1, b.memoizedState = null, b.updateQueue = null, Zf(d) ? (f2 = true, cg(b)) : f2 = false, b.memoizedState = null !== e.state && void 0 !== e.state ? e.state : null, kh(b), e.updater = Ei, b.stateNode = e, e._reactInternals = b, Ii(b, d, a, c), b = jj(null, b, d, true, f2, c)) : (b.tag = 0, I && f2 && vg(b), Xi(null, b, e, c), b = b.child);
      return b;
    case 16:
      d = b.elementType;
      a: {
        ij(a, b);
        a = b.pendingProps;
        e = d._init;
        d = e(d._payload);
        b.type = d;
        e = b.tag = Zk(d);
        a = Ci(d, a);
        switch (e) {
          case 0:
            b = cj(null, b, d, a, c);
            break a;
          case 1:
            b = hj(null, b, d, a, c);
            break a;
          case 11:
            b = Yi(null, b, d, a, c);
            break a;
          case 14:
            b = $i(null, b, d, Ci(d.type, a), c);
            break a;
        }
        throw Error(p(
          306,
          d,
          ""
        ));
      }
      return b;
    case 0:
      return d = b.type, e = b.pendingProps, e = b.elementType === d ? e : Ci(d, e), cj(a, b, d, e, c);
    case 1:
      return d = b.type, e = b.pendingProps, e = b.elementType === d ? e : Ci(d, e), hj(a, b, d, e, c);
    case 3:
      a: {
        kj(b);
        if (null === a) throw Error(p(387));
        d = b.pendingProps;
        f2 = b.memoizedState;
        e = f2.element;
        lh(a, b);
        qh(b, d, null, c);
        var g = b.memoizedState;
        d = g.element;
        if (f2.isDehydrated) if (f2 = { element: d, isDehydrated: false, cache: g.cache, pendingSuspenseBoundaries: g.pendingSuspenseBoundaries, transitions: g.transitions }, b.updateQueue.baseState = f2, b.memoizedState = f2, b.flags & 256) {
          e = Ji(Error(p(423)), b);
          b = lj(a, b, d, c, e);
          break a;
        } else if (d !== e) {
          e = Ji(Error(p(424)), b);
          b = lj(a, b, d, c, e);
          break a;
        } else for (yg = Lf(b.stateNode.containerInfo.firstChild), xg = b, I = true, zg = null, c = Vg(b, null, d, c), b.child = c; c; ) c.flags = c.flags & -3 | 4096, c = c.sibling;
        else {
          Ig();
          if (d === e) {
            b = Zi(a, b, c);
            break a;
          }
          Xi(a, b, d, c);
        }
        b = b.child;
      }
      return b;
    case 5:
      return Ah(b), null === a && Eg(b), d = b.type, e = b.pendingProps, f2 = null !== a ? a.memoizedProps : null, g = e.children, Ef(d, e) ? g = null : null !== f2 && Ef(d, f2) && (b.flags |= 32), gj(a, b), Xi(a, b, g, c), b.child;
    case 6:
      return null === a && Eg(b), null;
    case 13:
      return oj(a, b, c);
    case 4:
      return yh(b, b.stateNode.containerInfo), d = b.pendingProps, null === a ? b.child = Ug(b, null, d, c) : Xi(a, b, d, c), b.child;
    case 11:
      return d = b.type, e = b.pendingProps, e = b.elementType === d ? e : Ci(d, e), Yi(a, b, d, e, c);
    case 7:
      return Xi(a, b, b.pendingProps, c), b.child;
    case 8:
      return Xi(a, b, b.pendingProps.children, c), b.child;
    case 12:
      return Xi(a, b, b.pendingProps.children, c), b.child;
    case 10:
      a: {
        d = b.type._context;
        e = b.pendingProps;
        f2 = b.memoizedProps;
        g = e.value;
        G(Wg, d._currentValue);
        d._currentValue = g;
        if (null !== f2) if (He(f2.value, g)) {
          if (f2.children === e.children && !Wf.current) {
            b = Zi(a, b, c);
            break a;
          }
        } else for (f2 = b.child, null !== f2 && (f2.return = b); null !== f2; ) {
          var h = f2.dependencies;
          if (null !== h) {
            g = f2.child;
            for (var k2 = h.firstContext; null !== k2; ) {
              if (k2.context === d) {
                if (1 === f2.tag) {
                  k2 = mh(-1, c & -c);
                  k2.tag = 2;
                  var l2 = f2.updateQueue;
                  if (null !== l2) {
                    l2 = l2.shared;
                    var m2 = l2.pending;
                    null === m2 ? k2.next = k2 : (k2.next = m2.next, m2.next = k2);
                    l2.pending = k2;
                  }
                }
                f2.lanes |= c;
                k2 = f2.alternate;
                null !== k2 && (k2.lanes |= c);
                bh(
                  f2.return,
                  c,
                  b
                );
                h.lanes |= c;
                break;
              }
              k2 = k2.next;
            }
          } else if (10 === f2.tag) g = f2.type === b.type ? null : f2.child;
          else if (18 === f2.tag) {
            g = f2.return;
            if (null === g) throw Error(p(341));
            g.lanes |= c;
            h = g.alternate;
            null !== h && (h.lanes |= c);
            bh(g, c, b);
            g = f2.sibling;
          } else g = f2.child;
          if (null !== g) g.return = f2;
          else for (g = f2; null !== g; ) {
            if (g === b) {
              g = null;
              break;
            }
            f2 = g.sibling;
            if (null !== f2) {
              f2.return = g.return;
              g = f2;
              break;
            }
            g = g.return;
          }
          f2 = g;
        }
        Xi(a, b, e.children, c);
        b = b.child;
      }
      return b;
    case 9:
      return e = b.type, d = b.pendingProps.children, ch(b, c), e = eh(e), d = d(e), b.flags |= 1, Xi(a, b, d, c), b.child;
    case 14:
      return d = b.type, e = Ci(d, b.pendingProps), e = Ci(d.type, e), $i(a, b, d, e, c);
    case 15:
      return bj(a, b, b.type, b.pendingProps, c);
    case 17:
      return d = b.type, e = b.pendingProps, e = b.elementType === d ? e : Ci(d, e), ij(a, b), b.tag = 1, Zf(d) ? (a = true, cg(b)) : a = false, ch(b, c), Gi(b, d, e), Ii(b, d, e, c), jj(null, b, d, true, a, c);
    case 19:
      return xj(a, b, c);
    case 22:
      return dj(a, b, c);
  }
  throw Error(p(156, b.tag));
};
function Fk(a, b) {
  return ac(a, b);
}
function $k(a, b, c, d) {
  this.tag = a;
  this.key = c;
  this.sibling = this.child = this.return = this.stateNode = this.type = this.elementType = null;
  this.index = 0;
  this.ref = null;
  this.pendingProps = b;
  this.dependencies = this.memoizedState = this.updateQueue = this.memoizedProps = null;
  this.mode = d;
  this.subtreeFlags = this.flags = 0;
  this.deletions = null;
  this.childLanes = this.lanes = 0;
  this.alternate = null;
}
function Bg(a, b, c, d) {
  return new $k(a, b, c, d);
}
function aj(a) {
  a = a.prototype;
  return !(!a || !a.isReactComponent);
}
function Zk(a) {
  if ("function" === typeof a) return aj(a) ? 1 : 0;
  if (void 0 !== a && null !== a) {
    a = a.$$typeof;
    if (a === Da) return 11;
    if (a === Ga) return 14;
  }
  return 2;
}
function Pg(a, b) {
  var c = a.alternate;
  null === c ? (c = Bg(a.tag, b, a.key, a.mode), c.elementType = a.elementType, c.type = a.type, c.stateNode = a.stateNode, c.alternate = a, a.alternate = c) : (c.pendingProps = b, c.type = a.type, c.flags = 0, c.subtreeFlags = 0, c.deletions = null);
  c.flags = a.flags & 14680064;
  c.childLanes = a.childLanes;
  c.lanes = a.lanes;
  c.child = a.child;
  c.memoizedProps = a.memoizedProps;
  c.memoizedState = a.memoizedState;
  c.updateQueue = a.updateQueue;
  b = a.dependencies;
  c.dependencies = null === b ? null : { lanes: b.lanes, firstContext: b.firstContext };
  c.sibling = a.sibling;
  c.index = a.index;
  c.ref = a.ref;
  return c;
}
function Rg(a, b, c, d, e, f2) {
  var g = 2;
  d = a;
  if ("function" === typeof a) aj(a) && (g = 1);
  else if ("string" === typeof a) g = 5;
  else a: switch (a) {
    case ya:
      return Tg(c.children, e, f2, b);
    case za:
      g = 8;
      e |= 8;
      break;
    case Aa:
      return a = Bg(12, c, b, e | 2), a.elementType = Aa, a.lanes = f2, a;
    case Ea:
      return a = Bg(13, c, b, e), a.elementType = Ea, a.lanes = f2, a;
    case Fa:
      return a = Bg(19, c, b, e), a.elementType = Fa, a.lanes = f2, a;
    case Ia:
      return pj(c, e, f2, b);
    default:
      if ("object" === typeof a && null !== a) switch (a.$$typeof) {
        case Ba:
          g = 10;
          break a;
        case Ca:
          g = 9;
          break a;
        case Da:
          g = 11;
          break a;
        case Ga:
          g = 14;
          break a;
        case Ha:
          g = 16;
          d = null;
          break a;
      }
      throw Error(p(130, null == a ? a : typeof a, ""));
  }
  b = Bg(g, c, b, e);
  b.elementType = a;
  b.type = d;
  b.lanes = f2;
  return b;
}
function Tg(a, b, c, d) {
  a = Bg(7, a, d, b);
  a.lanes = c;
  return a;
}
function pj(a, b, c, d) {
  a = Bg(22, a, d, b);
  a.elementType = Ia;
  a.lanes = c;
  a.stateNode = { isHidden: false };
  return a;
}
function Qg(a, b, c) {
  a = Bg(6, a, null, b);
  a.lanes = c;
  return a;
}
function Sg(a, b, c) {
  b = Bg(4, null !== a.children ? a.children : [], a.key, b);
  b.lanes = c;
  b.stateNode = { containerInfo: a.containerInfo, pendingChildren: null, implementation: a.implementation };
  return b;
}
function al(a, b, c, d, e) {
  this.tag = b;
  this.containerInfo = a;
  this.finishedWork = this.pingCache = this.current = this.pendingChildren = null;
  this.timeoutHandle = -1;
  this.callbackNode = this.pendingContext = this.context = null;
  this.callbackPriority = 0;
  this.eventTimes = zc(0);
  this.expirationTimes = zc(-1);
  this.entangledLanes = this.finishedLanes = this.mutableReadLanes = this.expiredLanes = this.pingedLanes = this.suspendedLanes = this.pendingLanes = 0;
  this.entanglements = zc(0);
  this.identifierPrefix = d;
  this.onRecoverableError = e;
  this.mutableSourceEagerHydrationData = null;
}
function bl(a, b, c, d, e, f2, g, h, k2) {
  a = new al(a, b, c, h, k2);
  1 === b ? (b = 1, true === f2 && (b |= 8)) : b = 0;
  f2 = Bg(3, null, null, b);
  a.current = f2;
  f2.stateNode = a;
  f2.memoizedState = { element: d, isDehydrated: c, cache: null, transitions: null, pendingSuspenseBoundaries: null };
  kh(f2);
  return a;
}
function cl(a, b, c) {
  var d = 3 < arguments.length && void 0 !== arguments[3] ? arguments[3] : null;
  return { $$typeof: wa, key: null == d ? null : "" + d, children: a, containerInfo: b, implementation: c };
}
function dl(a) {
  if (!a) return Vf;
  a = a._reactInternals;
  a: {
    if (Vb(a) !== a || 1 !== a.tag) throw Error(p(170));
    var b = a;
    do {
      switch (b.tag) {
        case 3:
          b = b.stateNode.context;
          break a;
        case 1:
          if (Zf(b.type)) {
            b = b.stateNode.__reactInternalMemoizedMergedChildContext;
            break a;
          }
      }
      b = b.return;
    } while (null !== b);
    throw Error(p(171));
  }
  if (1 === a.tag) {
    var c = a.type;
    if (Zf(c)) return bg(a, c, b);
  }
  return b;
}
function el(a, b, c, d, e, f2, g, h, k2) {
  a = bl(c, d, true, a, e, f2, g, h, k2);
  a.context = dl(null);
  c = a.current;
  d = R();
  e = yi(c);
  f2 = mh(d, e);
  f2.callback = void 0 !== b && null !== b ? b : null;
  nh(c, f2, e);
  a.current.lanes = e;
  Ac(a, e, d);
  Dk(a, d);
  return a;
}
function fl(a, b, c, d) {
  var e = b.current, f2 = R(), g = yi(e);
  c = dl(c);
  null === b.context ? b.context = c : b.pendingContext = c;
  b = mh(f2, g);
  b.payload = { element: a };
  d = void 0 === d ? null : d;
  null !== d && (b.callback = d);
  a = nh(e, b, g);
  null !== a && (gi(a, e, g, f2), oh(a, e, g));
  return g;
}
function gl(a) {
  a = a.current;
  if (!a.child) return null;
  switch (a.child.tag) {
    case 5:
      return a.child.stateNode;
    default:
      return a.child.stateNode;
  }
}
function hl(a, b) {
  a = a.memoizedState;
  if (null !== a && null !== a.dehydrated) {
    var c = a.retryLane;
    a.retryLane = 0 !== c && c < b ? c : b;
  }
}
function il(a, b) {
  hl(a, b);
  (a = a.alternate) && hl(a, b);
}
function jl() {
  return null;
}
var kl = "function" === typeof reportError ? reportError : function(a) {
  console.error(a);
};
function ll(a) {
  this._internalRoot = a;
}
ml.prototype.render = ll.prototype.render = function(a) {
  var b = this._internalRoot;
  if (null === b) throw Error(p(409));
  fl(a, b, null, null);
};
ml.prototype.unmount = ll.prototype.unmount = function() {
  var a = this._internalRoot;
  if (null !== a) {
    this._internalRoot = null;
    var b = a.containerInfo;
    Rk(function() {
      fl(null, a, null, null);
    });
    b[uf] = null;
  }
};
function ml(a) {
  this._internalRoot = a;
}
ml.prototype.unstable_scheduleHydration = function(a) {
  if (a) {
    var b = Hc();
    a = { blockedOn: null, target: a, priority: b };
    for (var c = 0; c < Qc.length && 0 !== b && b < Qc[c].priority; c++) ;
    Qc.splice(c, 0, a);
    0 === c && Vc(a);
  }
};
function nl(a) {
  return !(!a || 1 !== a.nodeType && 9 !== a.nodeType && 11 !== a.nodeType);
}
function ol(a) {
  return !(!a || 1 !== a.nodeType && 9 !== a.nodeType && 11 !== a.nodeType && (8 !== a.nodeType || " react-mount-point-unstable " !== a.nodeValue));
}
function pl() {
}
function ql(a, b, c, d, e) {
  if (e) {
    if ("function" === typeof d) {
      var f2 = d;
      d = function() {
        var a2 = gl(g);
        f2.call(a2);
      };
    }
    var g = el(b, d, a, 0, null, false, false, "", pl);
    a._reactRootContainer = g;
    a[uf] = g.current;
    sf(8 === a.nodeType ? a.parentNode : a);
    Rk();
    return g;
  }
  for (; e = a.lastChild; ) a.removeChild(e);
  if ("function" === typeof d) {
    var h = d;
    d = function() {
      var a2 = gl(k2);
      h.call(a2);
    };
  }
  var k2 = bl(a, 0, false, null, null, false, false, "", pl);
  a._reactRootContainer = k2;
  a[uf] = k2.current;
  sf(8 === a.nodeType ? a.parentNode : a);
  Rk(function() {
    fl(b, k2, c, d);
  });
  return k2;
}
function rl(a, b, c, d, e) {
  var f2 = c._reactRootContainer;
  if (f2) {
    var g = f2;
    if ("function" === typeof e) {
      var h = e;
      e = function() {
        var a2 = gl(g);
        h.call(a2);
      };
    }
    fl(b, g, a, e);
  } else g = ql(c, b, a, e, d);
  return gl(g);
}
Ec = function(a) {
  switch (a.tag) {
    case 3:
      var b = a.stateNode;
      if (b.current.memoizedState.isDehydrated) {
        var c = tc(b.pendingLanes);
        0 !== c && (Cc(b, c | 1), Dk(b, B()), 0 === (K & 6) && (Gj = B() + 500, jg()));
      }
      break;
    case 13:
      Rk(function() {
        var b2 = ih(a, 1);
        if (null !== b2) {
          var c2 = R();
          gi(b2, a, 1, c2);
        }
      }), il(a, 1);
  }
};
Fc = function(a) {
  if (13 === a.tag) {
    var b = ih(a, 134217728);
    if (null !== b) {
      var c = R();
      gi(b, a, 134217728, c);
    }
    il(a, 134217728);
  }
};
Gc = function(a) {
  if (13 === a.tag) {
    var b = yi(a), c = ih(a, b);
    if (null !== c) {
      var d = R();
      gi(c, a, b, d);
    }
    il(a, b);
  }
};
Hc = function() {
  return C;
};
Ic = function(a, b) {
  var c = C;
  try {
    return C = a, b();
  } finally {
    C = c;
  }
};
yb = function(a, b, c) {
  switch (b) {
    case "input":
      bb(a, c);
      b = c.name;
      if ("radio" === c.type && null != b) {
        for (c = a; c.parentNode; ) c = c.parentNode;
        c = c.querySelectorAll("input[name=" + JSON.stringify("" + b) + '][type="radio"]');
        for (b = 0; b < c.length; b++) {
          var d = c[b];
          if (d !== a && d.form === a.form) {
            var e = Db(d);
            if (!e) throw Error(p(90));
            Wa(d);
            bb(d, e);
          }
        }
      }
      break;
    case "textarea":
      ib(a, c);
      break;
    case "select":
      b = c.value, null != b && fb(a, !!c.multiple, b, false);
  }
};
Gb = Qk;
Hb = Rk;
var sl = { usingClientEntryPoint: false, Events: [Cb, ue, Db, Eb, Fb, Qk] }, tl = { findFiberByHostInstance: Wc, bundleType: 0, version: "18.3.1", rendererPackageName: "react-dom" };
var ul = { bundleType: tl.bundleType, version: tl.version, rendererPackageName: tl.rendererPackageName, rendererConfig: tl.rendererConfig, overrideHookState: null, overrideHookStateDeletePath: null, overrideHookStateRenamePath: null, overrideProps: null, overridePropsDeletePath: null, overridePropsRenamePath: null, setErrorHandler: null, setSuspenseHandler: null, scheduleUpdate: null, currentDispatcherRef: ua.ReactCurrentDispatcher, findHostInstanceByFiber: function(a) {
  a = Zb(a);
  return null === a ? null : a.stateNode;
}, findFiberByHostInstance: tl.findFiberByHostInstance || jl, findHostInstancesForRefresh: null, scheduleRefresh: null, scheduleRoot: null, setRefreshHandler: null, getCurrentFiber: null, reconcilerVersion: "18.3.1-next-f1338f8080-20240426" };
if ("undefined" !== typeof __REACT_DEVTOOLS_GLOBAL_HOOK__) {
  var vl = __REACT_DEVTOOLS_GLOBAL_HOOK__;
  if (!vl.isDisabled && vl.supportsFiber) try {
    kc = vl.inject(ul), lc = vl;
  } catch (a) {
  }
}
reactDom_production_min.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED = sl;
reactDom_production_min.createPortal = function(a, b) {
  var c = 2 < arguments.length && void 0 !== arguments[2] ? arguments[2] : null;
  if (!nl(b)) throw Error(p(200));
  return cl(a, b, null, c);
};
reactDom_production_min.createRoot = function(a, b) {
  if (!nl(a)) throw Error(p(299));
  var c = false, d = "", e = kl;
  null !== b && void 0 !== b && (true === b.unstable_strictMode && (c = true), void 0 !== b.identifierPrefix && (d = b.identifierPrefix), void 0 !== b.onRecoverableError && (e = b.onRecoverableError));
  b = bl(a, 1, false, null, null, c, false, d, e);
  a[uf] = b.current;
  sf(8 === a.nodeType ? a.parentNode : a);
  return new ll(b);
};
reactDom_production_min.findDOMNode = function(a) {
  if (null == a) return null;
  if (1 === a.nodeType) return a;
  var b = a._reactInternals;
  if (void 0 === b) {
    if ("function" === typeof a.render) throw Error(p(188));
    a = Object.keys(a).join(",");
    throw Error(p(268, a));
  }
  a = Zb(b);
  a = null === a ? null : a.stateNode;
  return a;
};
reactDom_production_min.flushSync = function(a) {
  return Rk(a);
};
reactDom_production_min.hydrate = function(a, b, c) {
  if (!ol(b)) throw Error(p(200));
  return rl(null, a, b, true, c);
};
reactDom_production_min.hydrateRoot = function(a, b, c) {
  if (!nl(a)) throw Error(p(405));
  var d = null != c && c.hydratedSources || null, e = false, f2 = "", g = kl;
  null !== c && void 0 !== c && (true === c.unstable_strictMode && (e = true), void 0 !== c.identifierPrefix && (f2 = c.identifierPrefix), void 0 !== c.onRecoverableError && (g = c.onRecoverableError));
  b = el(b, null, a, 1, null != c ? c : null, e, false, f2, g);
  a[uf] = b.current;
  sf(a);
  if (d) for (a = 0; a < d.length; a++) c = d[a], e = c._getVersion, e = e(c._source), null == b.mutableSourceEagerHydrationData ? b.mutableSourceEagerHydrationData = [c, e] : b.mutableSourceEagerHydrationData.push(
    c,
    e
  );
  return new ml(b);
};
reactDom_production_min.render = function(a, b, c) {
  if (!ol(b)) throw Error(p(200));
  return rl(null, a, b, false, c);
};
reactDom_production_min.unmountComponentAtNode = function(a) {
  if (!ol(a)) throw Error(p(40));
  return a._reactRootContainer ? (Rk(function() {
    rl(null, null, a, false, function() {
      a._reactRootContainer = null;
      a[uf] = null;
    });
  }), true) : false;
};
reactDom_production_min.unstable_batchedUpdates = Qk;
reactDom_production_min.unstable_renderSubtreeIntoContainer = function(a, b, c, d) {
  if (!ol(c)) throw Error(p(200));
  if (null == a || void 0 === a._reactInternals) throw Error(p(38));
  return rl(a, b, c, false, d);
};
reactDom_production_min.version = "18.3.1-next-f1338f8080-20240426";
function checkDCE() {
  if (typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ === "undefined" || typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE !== "function") {
    return;
  }
  try {
    __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(checkDCE);
  } catch (err) {
    console.error(err);
  }
}
{
  checkDCE();
  reactDom.exports = reactDom_production_min;
}
var reactDomExports = reactDom.exports;
var m = reactDomExports;
{
  client.createRoot = m.createRoot;
  client.hydrateRoot = m.hydrateRoot;
}
/**
 * @remix-run/router v1.23.4
 *
 * Copyright (c) Remix Software Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.md file in the root directory of this source tree.
 *
 * @license MIT
 */
function _extends$2() {
  return _extends$2 = Object.assign ? Object.assign.bind() : function(n2) {
    for (var e = 1; e < arguments.length; e++) {
      var t2 = arguments[e];
      for (var r2 in t2) ({}).hasOwnProperty.call(t2, r2) && (n2[r2] = t2[r2]);
    }
    return n2;
  }, _extends$2.apply(null, arguments);
}
var Action;
(function(Action2) {
  Action2["Pop"] = "POP";
  Action2["Push"] = "PUSH";
  Action2["Replace"] = "REPLACE";
})(Action || (Action = {}));
const PopStateEventType = "popstate";
function createHashHistory(options) {
  if (options === void 0) {
    options = {};
  }
  function createHashLocation(window2, globalHistory) {
    let {
      pathname = "/",
      search = "",
      hash = ""
    } = parsePath(window2.location.hash.substr(1));
    if (!pathname.startsWith("/") && !pathname.startsWith(".")) {
      pathname = "/" + pathname;
    }
    return createLocation(
      "",
      {
        pathname,
        search,
        hash
      },
      // state defaults to `null` because `window.history.state` does
      globalHistory.state && globalHistory.state.usr || null,
      globalHistory.state && globalHistory.state.key || "default"
    );
  }
  function createHashHref(window2, to) {
    let base = window2.document.querySelector("base");
    let href = "";
    if (base && base.getAttribute("href")) {
      let url = window2.location.href;
      let hashIndex = url.indexOf("#");
      href = hashIndex === -1 ? url : url.slice(0, hashIndex);
    }
    return href + "#" + (typeof to === "string" ? to : createPath(to));
  }
  function validateHashLocation(location, to) {
    warning(location.pathname.charAt(0) === "/", "relative pathnames are not supported in hash history.push(" + JSON.stringify(to) + ")");
  }
  return getUrlBasedHistory(createHashLocation, createHashHref, validateHashLocation, options);
}
function invariant(value, message) {
  if (value === false || value === null || typeof value === "undefined") {
    throw new Error(message);
  }
}
function warning(cond, message) {
  if (!cond) {
    if (typeof console !== "undefined") console.warn(message);
    try {
      throw new Error(message);
    } catch (e) {
    }
  }
}
function createKey() {
  return Math.random().toString(36).substr(2, 8);
}
function getHistoryState(location, index) {
  return {
    usr: location.state,
    key: location.key,
    idx: index
  };
}
function createLocation(current, to, state, key) {
  if (state === void 0) {
    state = null;
  }
  let location = _extends$2({
    pathname: typeof current === "string" ? current : current.pathname,
    search: "",
    hash: ""
  }, typeof to === "string" ? parsePath(to) : to, {
    state,
    // TODO: This could be cleaned up.  push/replace should probably just take
    // full Locations now and avoid the need to run through this flow at all
    // But that's a pretty big refactor to the current test suite so going to
    // keep as is for the time being and just let any incoming keys take precedence
    key: to && to.key || key || createKey()
  });
  return location;
}
function createPath(_ref) {
  let {
    pathname = "/",
    search = "",
    hash = ""
  } = _ref;
  if (search && search !== "?") pathname += search.charAt(0) === "?" ? search : "?" + search;
  if (hash && hash !== "#") pathname += hash.charAt(0) === "#" ? hash : "#" + hash;
  return pathname;
}
function parsePath(path) {
  let parsedPath = {};
  if (path) {
    let hashIndex = path.indexOf("#");
    if (hashIndex >= 0) {
      parsedPath.hash = path.substr(hashIndex);
      path = path.substr(0, hashIndex);
    }
    let searchIndex = path.indexOf("?");
    if (searchIndex >= 0) {
      parsedPath.search = path.substr(searchIndex);
      path = path.substr(0, searchIndex);
    }
    if (path) {
      parsedPath.pathname = path;
    }
  }
  return parsedPath;
}
function getUrlBasedHistory(getLocation, createHref, validateLocation, options) {
  if (options === void 0) {
    options = {};
  }
  let {
    window: window2 = document.defaultView,
    v5Compat = false
  } = options;
  let globalHistory = window2.history;
  let action = Action.Pop;
  let listener = null;
  let index = getIndex();
  if (index == null) {
    index = 0;
    globalHistory.replaceState(_extends$2({}, globalHistory.state, {
      idx: index
    }), "");
  }
  function getIndex() {
    let state = globalHistory.state || {
      idx: null
    };
    return state.idx;
  }
  function handlePop() {
    action = Action.Pop;
    let nextIndex = getIndex();
    let delta = nextIndex == null ? null : nextIndex - index;
    index = nextIndex;
    if (listener) {
      listener({
        action,
        location: history.location,
        delta
      });
    }
  }
  function push(to, state) {
    action = Action.Push;
    let location = createLocation(history.location, to, state);
    if (validateLocation) validateLocation(location, to);
    index = getIndex() + 1;
    let historyState = getHistoryState(location, index);
    let url = history.createHref(location);
    try {
      globalHistory.pushState(historyState, "", url);
    } catch (error) {
      if (error instanceof DOMException && error.name === "DataCloneError") {
        throw error;
      }
      window2.location.assign(url);
    }
    if (v5Compat && listener) {
      listener({
        action,
        location: history.location,
        delta: 1
      });
    }
  }
  function replace(to, state) {
    action = Action.Replace;
    let location = createLocation(history.location, to, state);
    if (validateLocation) validateLocation(location, to);
    index = getIndex();
    let historyState = getHistoryState(location, index);
    let url = history.createHref(location);
    globalHistory.replaceState(historyState, "", url);
    if (v5Compat && listener) {
      listener({
        action,
        location: history.location,
        delta: 0
      });
    }
  }
  function createURL(to) {
    let base = window2.location.origin !== "null" ? window2.location.origin : window2.location.href;
    let href = typeof to === "string" ? to : createPath(to);
    href = href.replace(/ $/, "%20");
    invariant(base, "No window.location.(origin|href) available to create URL for href: " + href);
    return new URL(href, base);
  }
  let history = {
    get action() {
      return action;
    },
    get location() {
      return getLocation(window2, globalHistory);
    },
    listen(fn) {
      if (listener) {
        throw new Error("A history only accepts one active listener");
      }
      window2.addEventListener(PopStateEventType, handlePop);
      listener = fn;
      return () => {
        window2.removeEventListener(PopStateEventType, handlePop);
        listener = null;
      };
    },
    createHref(to) {
      return createHref(window2, to);
    },
    createURL,
    encodeLocation(to) {
      let url = createURL(to);
      return {
        pathname: url.pathname,
        search: url.search,
        hash: url.hash
      };
    },
    push,
    replace,
    go(n2) {
      return globalHistory.go(n2);
    }
  };
  return history;
}
var ResultType;
(function(ResultType2) {
  ResultType2["data"] = "data";
  ResultType2["deferred"] = "deferred";
  ResultType2["redirect"] = "redirect";
  ResultType2["error"] = "error";
})(ResultType || (ResultType = {}));
function matchRoutes(routes, locationArg, basename) {
  if (basename === void 0) {
    basename = "/";
  }
  return matchRoutesImpl(routes, locationArg, basename);
}
function matchRoutesImpl(routes, locationArg, basename, allowPartial) {
  let location = typeof locationArg === "string" ? parsePath(locationArg) : locationArg;
  let pathname = stripBasename(location.pathname || "/", basename);
  if (pathname == null) {
    return null;
  }
  let branches = flattenRoutes(routes);
  rankRouteBranches(branches);
  let matches = null;
  let decoded = decodePath(pathname);
  for (let i = 0; matches == null && i < branches.length; ++i) {
    matches = matchRouteBranch(branches[i], decoded);
  }
  return matches;
}
function flattenRoutes(routes, branches, parentsMeta, parentPath) {
  if (branches === void 0) {
    branches = [];
  }
  if (parentsMeta === void 0) {
    parentsMeta = [];
  }
  if (parentPath === void 0) {
    parentPath = "";
  }
  let flattenRoute = (route, index, relativePath) => {
    let meta2 = {
      relativePath: relativePath === void 0 ? route.path || "" : relativePath,
      caseSensitive: route.caseSensitive === true,
      childrenIndex: index,
      route
    };
    if (meta2.relativePath.startsWith("/")) {
      invariant(meta2.relativePath.startsWith(parentPath), 'Absolute route path "' + meta2.relativePath + '" nested under path ' + ('"' + parentPath + '" is not valid. An absolute child route path ') + "must start with the combined path of all its parent routes.");
      meta2.relativePath = meta2.relativePath.slice(parentPath.length);
    }
    let path = joinPaths([parentPath, meta2.relativePath]);
    let routesMeta = parentsMeta.concat(meta2);
    if (route.children && route.children.length > 0) {
      invariant(
        // Our types know better, but runtime JS may not!
        // @ts-expect-error
        route.index !== true,
        "Index routes must not have child routes. Please remove " + ('all child routes from route path "' + path + '".')
      );
      flattenRoutes(route.children, branches, routesMeta, path);
    }
    if (route.path == null && !route.index) {
      return;
    }
    branches.push({
      path,
      score: computeScore(path, route.index),
      routesMeta
    });
  };
  routes.forEach((route, index) => {
    var _route$path;
    if (route.path === "" || !((_route$path = route.path) != null && _route$path.includes("?"))) {
      flattenRoute(route, index);
    } else {
      for (let exploded of explodeOptionalSegments(route.path)) {
        flattenRoute(route, index, exploded);
      }
    }
  });
  return branches;
}
function explodeOptionalSegments(path) {
  let segments = path.split("/");
  if (segments.length === 0) return [];
  let [first, ...rest] = segments;
  let isOptional = first.endsWith("?");
  let required = first.replace(/\?$/, "");
  if (rest.length === 0) {
    return isOptional ? [required, ""] : [required];
  }
  let restExploded = explodeOptionalSegments(rest.join("/"));
  let result = [];
  result.push(...restExploded.map((subpath) => subpath === "" ? required : [required, subpath].join("/")));
  if (isOptional) {
    result.push(...restExploded);
  }
  return result.map((exploded) => path.startsWith("/") && exploded === "" ? "/" : exploded);
}
function rankRouteBranches(branches) {
  branches.sort((a, b) => a.score !== b.score ? b.score - a.score : compareIndexes(a.routesMeta.map((meta2) => meta2.childrenIndex), b.routesMeta.map((meta2) => meta2.childrenIndex)));
}
const paramRe = /^:[\w-]+$/;
const dynamicSegmentValue = 3;
const indexRouteValue = 2;
const emptySegmentValue = 1;
const staticSegmentValue = 10;
const splatPenalty = -2;
const isSplat = (s) => s === "*";
function computeScore(path, index) {
  let segments = path.split("/");
  let initialScore = segments.length;
  if (segments.some(isSplat)) {
    initialScore += splatPenalty;
  }
  if (index) {
    initialScore += indexRouteValue;
  }
  return segments.filter((s) => !isSplat(s)).reduce((score, segment) => score + (paramRe.test(segment) ? dynamicSegmentValue : segment === "" ? emptySegmentValue : staticSegmentValue), initialScore);
}
function compareIndexes(a, b) {
  let siblings = a.length === b.length && a.slice(0, -1).every((n2, i) => n2 === b[i]);
  return siblings ? (
    // If two routes are siblings, we should try to match the earlier sibling
    // first. This allows people to have fine-grained control over the matching
    // behavior by simply putting routes with identical paths in the order they
    // want them tried.
    a[a.length - 1] - b[b.length - 1]
  ) : (
    // Otherwise, it doesn't really make sense to rank non-siblings by index,
    // so they sort equally.
    0
  );
}
function matchRouteBranch(branch, pathname, allowPartial) {
  let {
    routesMeta
  } = branch;
  let matchedParams = {};
  let matchedPathname = "/";
  let matches = [];
  for (let i = 0; i < routesMeta.length; ++i) {
    let meta2 = routesMeta[i];
    let end = i === routesMeta.length - 1;
    let remainingPathname = matchedPathname === "/" ? pathname : pathname.slice(matchedPathname.length) || "/";
    let match = matchPath({
      path: meta2.relativePath,
      caseSensitive: meta2.caseSensitive,
      end
    }, remainingPathname);
    let route = meta2.route;
    if (!match) {
      return null;
    }
    Object.assign(matchedParams, match.params);
    matches.push({
      // TODO: Can this as be avoided?
      params: matchedParams,
      pathname: joinPaths([matchedPathname, match.pathname]),
      pathnameBase: normalizePathname(joinPaths([matchedPathname, match.pathnameBase])),
      route
    });
    if (match.pathnameBase !== "/") {
      matchedPathname = joinPaths([matchedPathname, match.pathnameBase]);
    }
  }
  return matches;
}
function matchPath(pattern, pathname) {
  if (typeof pattern === "string") {
    pattern = {
      path: pattern,
      caseSensitive: false,
      end: true
    };
  }
  let [matcher, compiledParams] = compilePath(pattern.path, pattern.caseSensitive, pattern.end);
  let match = pathname.match(matcher);
  if (!match) return null;
  let matchedPathname = match[0];
  let pathnameBase = matchedPathname.replace(/(.)\/+$/, "$1");
  let captureGroups = match.slice(1);
  let params = compiledParams.reduce((memo, _ref, index) => {
    let {
      paramName,
      isOptional
    } = _ref;
    if (paramName === "*") {
      let splatValue = captureGroups[index] || "";
      pathnameBase = matchedPathname.slice(0, matchedPathname.length - splatValue.length).replace(/(.)\/+$/, "$1");
    }
    const value = captureGroups[index];
    if (isOptional && !value) {
      memo[paramName] = void 0;
    } else {
      memo[paramName] = (value || "").replace(/%2F/g, "/");
    }
    return memo;
  }, {});
  return {
    params,
    pathname: matchedPathname,
    pathnameBase,
    pattern
  };
}
function compilePath(path, caseSensitive, end) {
  if (caseSensitive === void 0) {
    caseSensitive = false;
  }
  if (end === void 0) {
    end = true;
  }
  warning(path === "*" || !path.endsWith("*") || path.endsWith("/*"), 'Route path "' + path + '" will be treated as if it were ' + ('"' + path.replace(/\*$/, "/*") + '" because the `*` character must ') + "always follow a `/` in the pattern. To get rid of this warning, " + ('please change the route path to "' + path.replace(/\*$/, "/*") + '".'));
  let params = [];
  let regexpSource = "^" + path.replace(/\/*\*?$/, "").replace(/^\/*/, "/").replace(/[\\.*+^${}|()[\]]/g, "\\$&").replace(/\/:([\w-]+)(\?)?/g, (_, paramName, isOptional) => {
    params.push({
      paramName,
      isOptional: isOptional != null
    });
    return isOptional ? "/?([^\\/]+)?" : "/([^\\/]+)";
  });
  if (path.endsWith("*")) {
    params.push({
      paramName: "*"
    });
    regexpSource += path === "*" || path === "/*" ? "(.*)$" : "(?:\\/(.+)|\\/*)$";
  } else if (end) {
    regexpSource += "\\/*$";
  } else if (path !== "" && path !== "/") {
    regexpSource += "(?:(?=\\/|$))";
  } else ;
  let matcher = new RegExp(regexpSource, caseSensitive ? void 0 : "i");
  return [matcher, params];
}
function decodePath(value) {
  try {
    return value.split("/").map((v2) => decodeURIComponent(v2).replace(/\//g, "%2F")).join("/");
  } catch (error) {
    warning(false, 'The URL path "' + value + '" could not be decoded because it is is a malformed URL segment. This is probably due to a bad percent ' + ("encoding (" + error + ")."));
    return value;
  }
}
function stripBasename(pathname, basename) {
  if (basename === "/") return pathname;
  if (!pathname.toLowerCase().startsWith(basename.toLowerCase())) {
    return null;
  }
  let startIndex = basename.endsWith("/") ? basename.length - 1 : basename.length;
  let nextChar = pathname.charAt(startIndex);
  if (nextChar && nextChar !== "/") {
    return null;
  }
  return pathname.slice(startIndex) || "/";
}
function resolvePath(to, fromPathname) {
  if (fromPathname === void 0) {
    fromPathname = "/";
  }
  let {
    pathname: toPathname,
    search = "",
    hash = ""
  } = typeof to === "string" ? parsePath(to) : to;
  let pathname;
  if (toPathname) {
    toPathname = removeDoubleSlashes(toPathname);
    if (toPathname.startsWith("/")) {
      pathname = resolvePathname(toPathname.substring(1), "/");
    } else {
      pathname = resolvePathname(toPathname, fromPathname);
    }
  } else {
    pathname = fromPathname;
  }
  return {
    pathname,
    search: normalizeSearch(search),
    hash: normalizeHash(hash)
  };
}
function resolvePathname(relativePath, fromPathname) {
  let segments = fromPathname.replace(/\/+$/, "").split("/");
  let relativeSegments = relativePath.split("/");
  relativeSegments.forEach((segment) => {
    if (segment === "..") {
      if (segments.length > 1) segments.pop();
    } else if (segment !== ".") {
      segments.push(segment);
    }
  });
  return segments.length > 1 ? segments.join("/") : "/";
}
function getInvalidPathError(char, field, dest, path) {
  return "Cannot include a '" + char + "' character in a manually specified " + ("`to." + field + "` field [" + JSON.stringify(path) + "].  Please separate it out to the ") + ("`to." + dest + "` field. Alternatively you may provide the full path as ") + 'a string in <Link to="..."> and the router will parse it for you.';
}
function getPathContributingMatches(matches) {
  return matches.filter((match, index) => index === 0 || match.route.path && match.route.path.length > 0);
}
function getResolveToMatches(matches, v7_relativeSplatPath) {
  let pathMatches = getPathContributingMatches(matches);
  if (v7_relativeSplatPath) {
    return pathMatches.map((match, idx) => idx === pathMatches.length - 1 ? match.pathname : match.pathnameBase);
  }
  return pathMatches.map((match) => match.pathnameBase);
}
function resolveTo(toArg, routePathnames, locationPathname, isPathRelative) {
  if (isPathRelative === void 0) {
    isPathRelative = false;
  }
  let to;
  if (typeof toArg === "string") {
    to = parsePath(toArg);
  } else {
    to = _extends$2({}, toArg);
    invariant(!to.pathname || !to.pathname.includes("?"), getInvalidPathError("?", "pathname", "search", to));
    invariant(!to.pathname || !to.pathname.includes("#"), getInvalidPathError("#", "pathname", "hash", to));
    invariant(!to.search || !to.search.includes("#"), getInvalidPathError("#", "search", "hash", to));
  }
  let isEmptyPath = toArg === "" || to.pathname === "";
  let toPathname = isEmptyPath ? "/" : to.pathname;
  let from;
  if (toPathname == null) {
    from = locationPathname;
  } else {
    let routePathnameIndex = routePathnames.length - 1;
    if (!isPathRelative && toPathname.startsWith("..")) {
      let toSegments = toPathname.split("/");
      while (toSegments[0] === "..") {
        toSegments.shift();
        routePathnameIndex -= 1;
      }
      to.pathname = toSegments.join("/");
    }
    from = routePathnameIndex >= 0 ? routePathnames[routePathnameIndex] : "/";
  }
  let path = resolvePath(to, from);
  let hasExplicitTrailingSlash = toPathname && toPathname !== "/" && toPathname.endsWith("/");
  let hasCurrentTrailingSlash = (isEmptyPath || toPathname === ".") && locationPathname.endsWith("/");
  if (!path.pathname.endsWith("/") && (hasExplicitTrailingSlash || hasCurrentTrailingSlash)) {
    path.pathname += "/";
  }
  return path;
}
const removeDoubleSlashes = (path) => path.replace(/\/\/+/g, "/");
const joinPaths = (paths) => removeDoubleSlashes(paths.join("/"));
const normalizePathname = (pathname) => pathname.replace(/\/+$/, "").replace(/^\/*/, "/");
const normalizeSearch = (search) => !search || search === "?" ? "" : search.startsWith("?") ? search : "?" + search;
const normalizeHash = (hash) => !hash || hash === "#" ? "" : hash.startsWith("#") ? hash : "#" + hash;
function isRouteErrorResponse(error) {
  return error != null && typeof error.status === "number" && typeof error.statusText === "string" && typeof error.internal === "boolean" && "data" in error;
}
const validMutationMethodsArr = ["post", "put", "patch", "delete"];
new Set(validMutationMethodsArr);
const validRequestMethodsArr = ["get", ...validMutationMethodsArr];
new Set(validRequestMethodsArr);
/**
 * React Router v6.30.6
 *
 * Copyright (c) Remix Software Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.md file in the root directory of this source tree.
 *
 * @license MIT
 */
function _extends$1() {
  return _extends$1 = Object.assign ? Object.assign.bind() : function(n2) {
    for (var e = 1; e < arguments.length; e++) {
      var t2 = arguments[e];
      for (var r2 in t2) ({}).hasOwnProperty.call(t2, r2) && (n2[r2] = t2[r2]);
    }
    return n2;
  }, _extends$1.apply(null, arguments);
}
const DataRouterContext = /* @__PURE__ */ reactExports.createContext(null);
const DataRouterStateContext = /* @__PURE__ */ reactExports.createContext(null);
const NavigationContext = /* @__PURE__ */ reactExports.createContext(null);
const LocationContext = /* @__PURE__ */ reactExports.createContext(null);
const RouteContext = /* @__PURE__ */ reactExports.createContext({
  outlet: null,
  matches: [],
  isDataRoute: false
});
const RouteErrorContext = /* @__PURE__ */ reactExports.createContext(null);
function useHref(to, _temp) {
  let {
    relative
  } = _temp === void 0 ? {} : _temp;
  !useInRouterContext() ? invariant(false) : void 0;
  let {
    basename,
    navigator: navigator2
  } = reactExports.useContext(NavigationContext);
  let {
    hash,
    pathname,
    search
  } = useResolvedPath(to, {
    relative
  });
  let joinedPathname = pathname;
  if (basename !== "/") {
    joinedPathname = pathname === "/" ? basename : joinPaths([basename, pathname]);
  }
  return navigator2.createHref({
    pathname: joinedPathname,
    search,
    hash
  });
}
function useInRouterContext() {
  return reactExports.useContext(LocationContext) != null;
}
function useLocation() {
  !useInRouterContext() ? invariant(false) : void 0;
  return reactExports.useContext(LocationContext).location;
}
function useIsomorphicLayoutEffect(cb2) {
  let isStatic = reactExports.useContext(NavigationContext).static;
  if (!isStatic) {
    reactExports.useLayoutEffect(cb2);
  }
}
function useNavigate() {
  let {
    isDataRoute
  } = reactExports.useContext(RouteContext);
  return isDataRoute ? useNavigateStable() : useNavigateUnstable();
}
function useNavigateUnstable() {
  !useInRouterContext() ? invariant(false) : void 0;
  let dataRouterContext = reactExports.useContext(DataRouterContext);
  let {
    basename,
    future,
    navigator: navigator2
  } = reactExports.useContext(NavigationContext);
  let {
    matches
  } = reactExports.useContext(RouteContext);
  let {
    pathname: locationPathname
  } = useLocation();
  let routePathnamesJson = JSON.stringify(getResolveToMatches(matches, future.v7_relativeSplatPath));
  let activeRef = reactExports.useRef(false);
  useIsomorphicLayoutEffect(() => {
    activeRef.current = true;
  });
  let navigate = reactExports.useCallback(function(to, options) {
    if (options === void 0) {
      options = {};
    }
    if (!activeRef.current) return;
    if (typeof to === "number") {
      navigator2.go(to);
      return;
    }
    let path = resolveTo(to, JSON.parse(routePathnamesJson), locationPathname, options.relative === "path");
    if (dataRouterContext == null && basename !== "/") {
      path.pathname = path.pathname === "/" ? basename : joinPaths([basename, path.pathname]);
    }
    (!!options.replace ? navigator2.replace : navigator2.push)(path, options.state, options);
  }, [basename, navigator2, routePathnamesJson, locationPathname, dataRouterContext]);
  return navigate;
}
function useResolvedPath(to, _temp2) {
  let {
    relative
  } = _temp2 === void 0 ? {} : _temp2;
  let {
    future
  } = reactExports.useContext(NavigationContext);
  let {
    matches
  } = reactExports.useContext(RouteContext);
  let {
    pathname: locationPathname
  } = useLocation();
  let routePathnamesJson = JSON.stringify(getResolveToMatches(matches, future.v7_relativeSplatPath));
  return reactExports.useMemo(() => resolveTo(to, JSON.parse(routePathnamesJson), locationPathname, relative === "path"), [to, routePathnamesJson, locationPathname, relative]);
}
function useRoutes(routes, locationArg) {
  return useRoutesImpl(routes, locationArg);
}
function useRoutesImpl(routes, locationArg, dataRouterState, future) {
  !useInRouterContext() ? invariant(false) : void 0;
  let {
    navigator: navigator2
  } = reactExports.useContext(NavigationContext);
  let {
    matches: parentMatches
  } = reactExports.useContext(RouteContext);
  let routeMatch = parentMatches[parentMatches.length - 1];
  let parentParams = routeMatch ? routeMatch.params : {};
  routeMatch ? routeMatch.pathname : "/";
  let parentPathnameBase = routeMatch ? routeMatch.pathnameBase : "/";
  routeMatch && routeMatch.route;
  let locationFromContext = useLocation();
  let location;
  if (locationArg) {
    var _parsedLocationArg$pa;
    let parsedLocationArg = typeof locationArg === "string" ? parsePath(locationArg) : locationArg;
    !(parentPathnameBase === "/" || ((_parsedLocationArg$pa = parsedLocationArg.pathname) == null ? void 0 : _parsedLocationArg$pa.startsWith(parentPathnameBase))) ? invariant(false) : void 0;
    location = parsedLocationArg;
  } else {
    location = locationFromContext;
  }
  let pathname = location.pathname || "/";
  let remainingPathname = pathname;
  if (parentPathnameBase !== "/") {
    let parentSegments = parentPathnameBase.replace(/^\//, "").split("/");
    let segments = pathname.replace(/^\//, "").split("/");
    remainingPathname = "/" + segments.slice(parentSegments.length).join("/");
  }
  let matches = matchRoutes(routes, {
    pathname: remainingPathname
  });
  let renderedMatches = _renderMatches(matches && matches.map((match) => Object.assign({}, match, {
    params: Object.assign({}, parentParams, match.params),
    pathname: joinPaths([
      parentPathnameBase,
      // Re-encode pathnames that were decoded inside matchRoutes
      navigator2.encodeLocation ? navigator2.encodeLocation(match.pathname).pathname : match.pathname
    ]),
    pathnameBase: match.pathnameBase === "/" ? parentPathnameBase : joinPaths([
      parentPathnameBase,
      // Re-encode pathnames that were decoded inside matchRoutes
      navigator2.encodeLocation ? navigator2.encodeLocation(match.pathnameBase).pathname : match.pathnameBase
    ])
  })), parentMatches, dataRouterState, future);
  if (locationArg && renderedMatches) {
    return /* @__PURE__ */ reactExports.createElement(LocationContext.Provider, {
      value: {
        location: _extends$1({
          pathname: "/",
          search: "",
          hash: "",
          state: null,
          key: "default"
        }, location),
        navigationType: Action.Pop
      }
    }, renderedMatches);
  }
  return renderedMatches;
}
function DefaultErrorComponent() {
  let error = useRouteError();
  let message = isRouteErrorResponse(error) ? error.status + " " + error.statusText : error instanceof Error ? error.message : JSON.stringify(error);
  let stack = error instanceof Error ? error.stack : null;
  let lightgrey = "rgba(200,200,200, 0.5)";
  let preStyles = {
    padding: "0.5rem",
    backgroundColor: lightgrey
  };
  let devInfo = null;
  return /* @__PURE__ */ reactExports.createElement(reactExports.Fragment, null, /* @__PURE__ */ reactExports.createElement("h2", null, "Unexpected Application Error!"), /* @__PURE__ */ reactExports.createElement("h3", {
    style: {
      fontStyle: "italic"
    }
  }, message), stack ? /* @__PURE__ */ reactExports.createElement("pre", {
    style: preStyles
  }, stack) : null, devInfo);
}
const defaultErrorElement = /* @__PURE__ */ reactExports.createElement(DefaultErrorComponent, null);
class RenderErrorBoundary extends reactExports.Component {
  constructor(props) {
    super(props);
    this.state = {
      location: props.location,
      revalidation: props.revalidation,
      error: props.error
    };
  }
  static getDerivedStateFromError(error) {
    return {
      error
    };
  }
  static getDerivedStateFromProps(props, state) {
    if (state.location !== props.location || state.revalidation !== "idle" && props.revalidation === "idle") {
      return {
        error: props.error,
        location: props.location,
        revalidation: props.revalidation
      };
    }
    return {
      error: props.error !== void 0 ? props.error : state.error,
      location: state.location,
      revalidation: props.revalidation || state.revalidation
    };
  }
  componentDidCatch(error, errorInfo) {
    console.error("React Router caught the following error during render", error, errorInfo);
  }
  render() {
    return this.state.error !== void 0 ? /* @__PURE__ */ reactExports.createElement(RouteContext.Provider, {
      value: this.props.routeContext
    }, /* @__PURE__ */ reactExports.createElement(RouteErrorContext.Provider, {
      value: this.state.error,
      children: this.props.component
    })) : this.props.children;
  }
}
function RenderedRoute(_ref) {
  let {
    routeContext,
    match,
    children
  } = _ref;
  let dataRouterContext = reactExports.useContext(DataRouterContext);
  if (dataRouterContext && dataRouterContext.static && dataRouterContext.staticContext && (match.route.errorElement || match.route.ErrorBoundary)) {
    dataRouterContext.staticContext._deepestRenderedBoundaryId = match.route.id;
  }
  return /* @__PURE__ */ reactExports.createElement(RouteContext.Provider, {
    value: routeContext
  }, children);
}
function _renderMatches(matches, parentMatches, dataRouterState, future) {
  var _dataRouterState;
  if (parentMatches === void 0) {
    parentMatches = [];
  }
  if (dataRouterState === void 0) {
    dataRouterState = null;
  }
  if (future === void 0) {
    future = null;
  }
  if (matches == null) {
    var _future;
    if (!dataRouterState) {
      return null;
    }
    if (dataRouterState.errors) {
      matches = dataRouterState.matches;
    } else if ((_future = future) != null && _future.v7_partialHydration && parentMatches.length === 0 && !dataRouterState.initialized && dataRouterState.matches.length > 0) {
      matches = dataRouterState.matches;
    } else {
      return null;
    }
  }
  let renderedMatches = matches;
  let errors = (_dataRouterState = dataRouterState) == null ? void 0 : _dataRouterState.errors;
  if (errors != null) {
    let errorIndex = renderedMatches.findIndex((m2) => m2.route.id && (errors == null ? void 0 : errors[m2.route.id]) !== void 0);
    !(errorIndex >= 0) ? invariant(false) : void 0;
    renderedMatches = renderedMatches.slice(0, Math.min(renderedMatches.length, errorIndex + 1));
  }
  let renderFallback = false;
  let fallbackIndex = -1;
  if (dataRouterState && future && future.v7_partialHydration) {
    for (let i = 0; i < renderedMatches.length; i++) {
      let match = renderedMatches[i];
      if (match.route.HydrateFallback || match.route.hydrateFallbackElement) {
        fallbackIndex = i;
      }
      if (match.route.id) {
        let {
          loaderData,
          errors: errors2
        } = dataRouterState;
        let needsToRunLoader = match.route.loader && loaderData[match.route.id] === void 0 && (!errors2 || errors2[match.route.id] === void 0);
        if (match.route.lazy || needsToRunLoader) {
          renderFallback = true;
          if (fallbackIndex >= 0) {
            renderedMatches = renderedMatches.slice(0, fallbackIndex + 1);
          } else {
            renderedMatches = [renderedMatches[0]];
          }
          break;
        }
      }
    }
  }
  return renderedMatches.reduceRight((outlet, match, index) => {
    let error;
    let shouldRenderHydrateFallback = false;
    let errorElement = null;
    let hydrateFallbackElement = null;
    if (dataRouterState) {
      error = errors && match.route.id ? errors[match.route.id] : void 0;
      errorElement = match.route.errorElement || defaultErrorElement;
      if (renderFallback) {
        if (fallbackIndex < 0 && index === 0) {
          warningOnce("route-fallback");
          shouldRenderHydrateFallback = true;
          hydrateFallbackElement = null;
        } else if (fallbackIndex === index) {
          shouldRenderHydrateFallback = true;
          hydrateFallbackElement = match.route.hydrateFallbackElement || null;
        }
      }
    }
    let matches2 = parentMatches.concat(renderedMatches.slice(0, index + 1));
    let getChildren = () => {
      let children;
      if (error) {
        children = errorElement;
      } else if (shouldRenderHydrateFallback) {
        children = hydrateFallbackElement;
      } else if (match.route.Component) {
        children = /* @__PURE__ */ reactExports.createElement(match.route.Component, null);
      } else if (match.route.element) {
        children = match.route.element;
      } else {
        children = outlet;
      }
      return /* @__PURE__ */ reactExports.createElement(RenderedRoute, {
        match,
        routeContext: {
          outlet,
          matches: matches2,
          isDataRoute: dataRouterState != null
        },
        children
      });
    };
    return dataRouterState && (match.route.ErrorBoundary || match.route.errorElement || index === 0) ? /* @__PURE__ */ reactExports.createElement(RenderErrorBoundary, {
      location: dataRouterState.location,
      revalidation: dataRouterState.revalidation,
      component: errorElement,
      error,
      children: getChildren(),
      routeContext: {
        outlet: null,
        matches: matches2,
        isDataRoute: true
      }
    }) : getChildren();
  }, null);
}
var DataRouterHook$1 = /* @__PURE__ */ function(DataRouterHook2) {
  DataRouterHook2["UseBlocker"] = "useBlocker";
  DataRouterHook2["UseRevalidator"] = "useRevalidator";
  DataRouterHook2["UseNavigateStable"] = "useNavigate";
  return DataRouterHook2;
}(DataRouterHook$1 || {});
var DataRouterStateHook$1 = /* @__PURE__ */ function(DataRouterStateHook2) {
  DataRouterStateHook2["UseBlocker"] = "useBlocker";
  DataRouterStateHook2["UseLoaderData"] = "useLoaderData";
  DataRouterStateHook2["UseActionData"] = "useActionData";
  DataRouterStateHook2["UseRouteError"] = "useRouteError";
  DataRouterStateHook2["UseNavigation"] = "useNavigation";
  DataRouterStateHook2["UseRouteLoaderData"] = "useRouteLoaderData";
  DataRouterStateHook2["UseMatches"] = "useMatches";
  DataRouterStateHook2["UseRevalidator"] = "useRevalidator";
  DataRouterStateHook2["UseNavigateStable"] = "useNavigate";
  DataRouterStateHook2["UseRouteId"] = "useRouteId";
  return DataRouterStateHook2;
}(DataRouterStateHook$1 || {});
function useDataRouterContext$1(hookName) {
  let ctx = reactExports.useContext(DataRouterContext);
  !ctx ? invariant(false) : void 0;
  return ctx;
}
function useDataRouterState(hookName) {
  let state = reactExports.useContext(DataRouterStateContext);
  !state ? invariant(false) : void 0;
  return state;
}
function useRouteContext(hookName) {
  let route = reactExports.useContext(RouteContext);
  !route ? invariant(false) : void 0;
  return route;
}
function useCurrentRouteId(hookName) {
  let route = useRouteContext();
  let thisRoute = route.matches[route.matches.length - 1];
  !thisRoute.route.id ? invariant(false) : void 0;
  return thisRoute.route.id;
}
function useRouteError() {
  var _state$errors;
  let error = reactExports.useContext(RouteErrorContext);
  let state = useDataRouterState();
  let routeId = useCurrentRouteId();
  if (error !== void 0) {
    return error;
  }
  return (_state$errors = state.errors) == null ? void 0 : _state$errors[routeId];
}
function useNavigateStable() {
  let {
    router
  } = useDataRouterContext$1(DataRouterHook$1.UseNavigateStable);
  let id2 = useCurrentRouteId(DataRouterStateHook$1.UseNavigateStable);
  let activeRef = reactExports.useRef(false);
  useIsomorphicLayoutEffect(() => {
    activeRef.current = true;
  });
  let navigate = reactExports.useCallback(function(to, options) {
    if (options === void 0) {
      options = {};
    }
    if (!activeRef.current) return;
    if (typeof to === "number") {
      router.navigate(to);
    } else {
      router.navigate(to, _extends$1({
        fromRouteId: id2
      }, options));
    }
  }, [router, id2]);
  return navigate;
}
const alreadyWarned$1 = {};
function warningOnce(key, cond, message) {
  if (!alreadyWarned$1[key]) {
    alreadyWarned$1[key] = true;
  }
}
function logV6DeprecationWarnings(renderFuture, routerFuture) {
  if ((renderFuture == null ? void 0 : renderFuture.v7_startTransition) === void 0) ;
  if ((renderFuture == null ? void 0 : renderFuture.v7_relativeSplatPath) === void 0 && true) ;
}
function Navigate(_ref4) {
  let {
    to,
    replace: replace2,
    state,
    relative
  } = _ref4;
  !useInRouterContext() ? invariant(false) : void 0;
  let {
    future,
    static: isStatic
  } = reactExports.useContext(NavigationContext);
  let {
    matches
  } = reactExports.useContext(RouteContext);
  let {
    pathname: locationPathname
  } = useLocation();
  let navigate = useNavigate();
  let path = resolveTo(to, getResolveToMatches(matches, future.v7_relativeSplatPath), locationPathname, relative === "path");
  let jsonPath = JSON.stringify(path);
  reactExports.useEffect(() => navigate(JSON.parse(jsonPath), {
    replace: replace2,
    state,
    relative
  }), [navigate, jsonPath, relative, replace2, state]);
  return null;
}
function Route(_props) {
  invariant(false);
}
function Router(_ref5) {
  let {
    basename: basenameProp = "/",
    children = null,
    location: locationProp,
    navigationType = Action.Pop,
    navigator: navigator2,
    static: staticProp = false,
    future
  } = _ref5;
  !!useInRouterContext() ? invariant(false) : void 0;
  let basename = basenameProp.replace(/^\/*/, "/");
  let navigationContext = reactExports.useMemo(() => ({
    basename,
    navigator: navigator2,
    static: staticProp,
    future: _extends$1({
      v7_relativeSplatPath: false
    }, future)
  }), [basename, future, navigator2, staticProp]);
  if (typeof locationProp === "string") {
    locationProp = parsePath(locationProp);
  }
  let {
    pathname = "/",
    search = "",
    hash = "",
    state = null,
    key = "default"
  } = locationProp;
  let locationContext = reactExports.useMemo(() => {
    let trailingPathname = stripBasename(pathname, basename);
    if (trailingPathname == null) {
      return null;
    }
    return {
      location: {
        pathname: trailingPathname,
        search,
        hash,
        state,
        key
      },
      navigationType
    };
  }, [basename, pathname, search, hash, state, key, navigationType]);
  if (locationContext == null) {
    return null;
  }
  return /* @__PURE__ */ reactExports.createElement(NavigationContext.Provider, {
    value: navigationContext
  }, /* @__PURE__ */ reactExports.createElement(LocationContext.Provider, {
    children,
    value: locationContext
  }));
}
function Routes(_ref6) {
  let {
    children,
    location
  } = _ref6;
  return useRoutes(createRoutesFromChildren(children), location);
}
new Promise(() => {
});
function createRoutesFromChildren(children, parentPath) {
  if (parentPath === void 0) {
    parentPath = [];
  }
  let routes = [];
  reactExports.Children.forEach(children, (element, index) => {
    if (!/* @__PURE__ */ reactExports.isValidElement(element)) {
      return;
    }
    let treePath = [...parentPath, index];
    if (element.type === reactExports.Fragment) {
      routes.push.apply(routes, createRoutesFromChildren(element.props.children, treePath));
      return;
    }
    !(element.type === Route) ? invariant(false) : void 0;
    !(!element.props.index || !element.props.children) ? invariant(false) : void 0;
    let route = {
      id: element.props.id || treePath.join("-"),
      caseSensitive: element.props.caseSensitive,
      element: element.props.element,
      Component: element.props.Component,
      index: element.props.index,
      path: element.props.path,
      loader: element.props.loader,
      action: element.props.action,
      errorElement: element.props.errorElement,
      ErrorBoundary: element.props.ErrorBoundary,
      hasErrorBoundary: element.props.ErrorBoundary != null || element.props.errorElement != null,
      shouldRevalidate: element.props.shouldRevalidate,
      handle: element.props.handle,
      lazy: element.props.lazy
    };
    if (element.props.children) {
      route.children = createRoutesFromChildren(element.props.children, treePath);
    }
    routes.push(route);
  });
  return routes;
}
/**
 * React Router DOM v6.30.6
 *
 * Copyright (c) Remix Software Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.md file in the root directory of this source tree.
 *
 * @license MIT
 */
function _extends() {
  return _extends = Object.assign ? Object.assign.bind() : function(n2) {
    for (var e = 1; e < arguments.length; e++) {
      var t2 = arguments[e];
      for (var r2 in t2) ({}).hasOwnProperty.call(t2, r2) && (n2[r2] = t2[r2]);
    }
    return n2;
  }, _extends.apply(null, arguments);
}
function _objectWithoutPropertiesLoose(r2, e) {
  if (null == r2) return {};
  var t2 = {};
  for (var n2 in r2) if ({}.hasOwnProperty.call(r2, n2)) {
    if (-1 !== e.indexOf(n2)) continue;
    t2[n2] = r2[n2];
  }
  return t2;
}
function isModifiedEvent(event) {
  return !!(event.metaKey || event.altKey || event.ctrlKey || event.shiftKey);
}
function shouldProcessLinkClick(event, target) {
  return event.button === 0 && // Ignore everything but left clicks
  (!target || target === "_self") && // Let browser handle "target=_blank" etc.
  !isModifiedEvent(event);
}
const _excluded = ["onClick", "relative", "reloadDocument", "replace", "state", "target", "to", "preventScrollReset", "viewTransition"], _excluded2 = ["aria-current", "caseSensitive", "className", "end", "style", "to", "viewTransition", "children"];
const REACT_ROUTER_VERSION = "6";
try {
  window.__reactRouterVersion = REACT_ROUTER_VERSION;
} catch (e) {
}
const ViewTransitionContext = /* @__PURE__ */ reactExports.createContext({
  isTransitioning: false
});
const START_TRANSITION = "startTransition";
const startTransitionImpl = React$1[START_TRANSITION];
function HashRouter(_ref5) {
  let {
    basename,
    children,
    future,
    window: window2
  } = _ref5;
  let historyRef = reactExports.useRef();
  if (historyRef.current == null) {
    historyRef.current = createHashHistory({
      window: window2,
      v5Compat: true
    });
  }
  let history = historyRef.current;
  let [state, setStateImpl] = reactExports.useState({
    action: history.action,
    location: history.location
  });
  let {
    v7_startTransition
  } = future || {};
  let setState = reactExports.useCallback((newState) => {
    v7_startTransition && startTransitionImpl ? startTransitionImpl(() => setStateImpl(newState)) : setStateImpl(newState);
  }, [setStateImpl, v7_startTransition]);
  reactExports.useLayoutEffect(() => history.listen(setState), [history, setState]);
  reactExports.useEffect(() => logV6DeprecationWarnings(future), [future]);
  return /* @__PURE__ */ reactExports.createElement(Router, {
    basename,
    children,
    location: state.location,
    navigationType: state.action,
    navigator: history,
    future
  });
}
const isBrowser = typeof window !== "undefined" && typeof window.document !== "undefined" && typeof window.document.createElement !== "undefined";
const ABSOLUTE_URL_REGEX = /^(?:[a-z][a-z0-9+.-]*:|\/\/)/i;
const Link = /* @__PURE__ */ reactExports.forwardRef(function LinkWithRef(_ref7, ref) {
  let {
    onClick,
    relative,
    reloadDocument,
    replace: replace2,
    state,
    target,
    to,
    preventScrollReset,
    viewTransition
  } = _ref7, rest = _objectWithoutPropertiesLoose(_ref7, _excluded);
  let {
    basename
  } = reactExports.useContext(NavigationContext);
  let absoluteHref;
  let isExternal = false;
  if (typeof to === "string" && ABSOLUTE_URL_REGEX.test(to)) {
    absoluteHref = to;
    if (isBrowser) {
      try {
        let currentUrl = new URL(window.location.href);
        let targetUrl = to.startsWith("//") ? new URL(currentUrl.protocol + to) : new URL(to);
        let path = stripBasename(targetUrl.pathname, basename);
        if (targetUrl.origin === currentUrl.origin && path != null) {
          to = path + targetUrl.search + targetUrl.hash;
        } else {
          isExternal = true;
        }
      } catch (e) {
      }
    }
  }
  let href = useHref(to, {
    relative
  });
  let internalOnClick = useLinkClickHandler(to, {
    replace: replace2,
    state,
    target,
    preventScrollReset,
    relative,
    viewTransition
  });
  function handleClick(event) {
    if (onClick) onClick(event);
    if (!event.defaultPrevented) {
      internalOnClick(event);
    }
  }
  return (
    // eslint-disable-next-line jsx-a11y/anchor-has-content
    /* @__PURE__ */ reactExports.createElement("a", _extends({}, rest, {
      href: absoluteHref || href,
      onClick: isExternal || reloadDocument ? onClick : handleClick,
      ref,
      target
    }))
  );
});
const NavLink = /* @__PURE__ */ reactExports.forwardRef(function NavLinkWithRef(_ref8, ref) {
  let {
    "aria-current": ariaCurrentProp = "page",
    caseSensitive = false,
    className: classNameProp = "",
    end = false,
    style: styleProp,
    to,
    viewTransition,
    children
  } = _ref8, rest = _objectWithoutPropertiesLoose(_ref8, _excluded2);
  let path = useResolvedPath(to, {
    relative: rest.relative
  });
  let location = useLocation();
  let routerState = reactExports.useContext(DataRouterStateContext);
  let {
    navigator: navigator2,
    basename
  } = reactExports.useContext(NavigationContext);
  let isTransitioning = routerState != null && // Conditional usage is OK here because the usage of a data router is static
  // eslint-disable-next-line react-hooks/rules-of-hooks
  useViewTransitionState(path) && viewTransition === true;
  let toPathname = navigator2.encodeLocation ? navigator2.encodeLocation(path).pathname : path.pathname;
  let locationPathname = location.pathname;
  let nextLocationPathname = routerState && routerState.navigation && routerState.navigation.location ? routerState.navigation.location.pathname : null;
  if (!caseSensitive) {
    locationPathname = locationPathname.toLowerCase();
    nextLocationPathname = nextLocationPathname ? nextLocationPathname.toLowerCase() : null;
    toPathname = toPathname.toLowerCase();
  }
  if (nextLocationPathname && basename) {
    nextLocationPathname = stripBasename(nextLocationPathname, basename) || nextLocationPathname;
  }
  const endSlashPosition = toPathname !== "/" && toPathname.endsWith("/") ? toPathname.length - 1 : toPathname.length;
  let isActive = locationPathname === toPathname || !end && locationPathname.startsWith(toPathname) && locationPathname.charAt(endSlashPosition) === "/";
  let isPending = nextLocationPathname != null && (nextLocationPathname === toPathname || !end && nextLocationPathname.startsWith(toPathname) && nextLocationPathname.charAt(toPathname.length) === "/");
  let renderProps = {
    isActive,
    isPending,
    isTransitioning
  };
  let ariaCurrent = isActive ? ariaCurrentProp : void 0;
  let className;
  if (typeof classNameProp === "function") {
    className = classNameProp(renderProps);
  } else {
    className = [classNameProp, isActive ? "active" : null, isPending ? "pending" : null, isTransitioning ? "transitioning" : null].filter(Boolean).join(" ");
  }
  let style = typeof styleProp === "function" ? styleProp(renderProps) : styleProp;
  return /* @__PURE__ */ reactExports.createElement(Link, _extends({}, rest, {
    "aria-current": ariaCurrent,
    className,
    ref,
    style,
    to,
    viewTransition
  }), typeof children === "function" ? children(renderProps) : children);
});
var DataRouterHook;
(function(DataRouterHook2) {
  DataRouterHook2["UseScrollRestoration"] = "useScrollRestoration";
  DataRouterHook2["UseSubmit"] = "useSubmit";
  DataRouterHook2["UseSubmitFetcher"] = "useSubmitFetcher";
  DataRouterHook2["UseFetcher"] = "useFetcher";
  DataRouterHook2["useViewTransitionState"] = "useViewTransitionState";
})(DataRouterHook || (DataRouterHook = {}));
var DataRouterStateHook;
(function(DataRouterStateHook2) {
  DataRouterStateHook2["UseFetcher"] = "useFetcher";
  DataRouterStateHook2["UseFetchers"] = "useFetchers";
  DataRouterStateHook2["UseScrollRestoration"] = "useScrollRestoration";
})(DataRouterStateHook || (DataRouterStateHook = {}));
function useDataRouterContext(hookName) {
  let ctx = reactExports.useContext(DataRouterContext);
  !ctx ? invariant(false) : void 0;
  return ctx;
}
function useLinkClickHandler(to, _temp) {
  let {
    target,
    replace: replaceProp,
    state,
    preventScrollReset,
    relative,
    viewTransition
  } = _temp === void 0 ? {} : _temp;
  let navigate = useNavigate();
  let location = useLocation();
  let path = useResolvedPath(to, {
    relative
  });
  return reactExports.useCallback((event) => {
    if (shouldProcessLinkClick(event, target)) {
      event.preventDefault();
      let replace2 = replaceProp !== void 0 ? replaceProp : createPath(location) === createPath(path);
      navigate(to, {
        replace: replace2,
        state,
        preventScrollReset,
        relative,
        viewTransition
      });
    }
  }, [location, navigate, path, replaceProp, state, target, to, preventScrollReset, relative, viewTransition]);
}
function useViewTransitionState(to, opts) {
  if (opts === void 0) {
    opts = {};
  }
  let vtContext = reactExports.useContext(ViewTransitionContext);
  !(vtContext != null) ? invariant(false) : void 0;
  let {
    basename
  } = useDataRouterContext(DataRouterHook.useViewTransitionState);
  let path = useResolvedPath(to, {
    relative: opts.relative
  });
  if (!vtContext.isTransitioning) {
    return false;
  }
  let currentPath = stripBasename(vtContext.currentLocation.pathname, basename) || vtContext.currentLocation.pathname;
  let nextPath = stripBasename(vtContext.nextLocation.pathname, basename) || vtContext.nextLocation.pathname;
  return matchPath(path.pathname, nextPath) != null || matchPath(path.pathname, currentPath) != null;
}
const currentUser$1 = {
  id: "EMP-0001",
  name: "Sarah Jenkins",
  role: "Super Admin / HR Director",
  email: "s.jenkins@vanguardops.com",
  department: "Executive Operations",
  avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuAz_1IElxGVAr-brgy0EQUmBVyqhHTB0sZ7PKLe_AS0eVgbljLVFKAU80T7xdImGy0yi0R2OQKXSMfu-m8_aUgCi4Zn1VYbhpxYgaNGwyVa1v-JVdYJFWOg4MzTmvPeuOOBXhEzZV0iq3Yam8WPew3edwP2xojx7WSF1Cn4Ob9voIcPhjM2FIM6dHNNrjvYgX_c6MwKo-zgjznxWlDa4cDZEgtlcVhK5BhTZ8Y32vc",
  permissions: [
    "roster.read",
    "roster.write",
    "attendance.audit",
    "fleet.dispatch",
    "alert.broadcast"
  ],
  sessionStartedAt: "2024-10-24T07:58:00+07:00"
};
const notifications$1 = [
  {
    id: "NTF-1041",
    severity: "high",
    category: "geofence",
    title: "Geofence breach detected",
    body: "Dimas Pratama (EMP-7742) left the HQ perimeter by 420m.",
    timestamp: "2024-10-24T10:41:12+07:00",
    read: false
  },
  {
    id: "NTF-1040",
    severity: "medium",
    category: "fleet",
    title: "Low fuel threshold reached",
    body: "Unit B 9781 KJA dropped to 18% fuel while en route to the client complex.",
    timestamp: "2024-10-24T10:38:04+07:00",
    read: false
  },
  {
    id: "NTF-1039",
    severity: "low",
    category: "attendance",
    title: "Attendance sync completed",
    body: "128 punch records reconciled against the audit server.",
    timestamp: "2024-10-24T10:30:00+07:00",
    read: true
  },
  {
    id: "NTF-1038",
    severity: "low",
    category: "system",
    title: "Device fleet health nominal",
    body: "126 of 128 devices reporting normally.",
    timestamp: "2024-10-24T09:55:24+07:00",
    read: true
  }
];
const broadcastTemplates$1 = [
  {
    id: "tpl-rollcall",
    label: "Emergency muster roll",
    severity: "critical",
    message: "Initiate zone roll call and report to your muster point immediately."
  },
  {
    id: "tpl-evac",
    label: "Evacuation order",
    severity: "critical",
    message: "Evacuate the building via the nearest stairwell and proceed to the assembly area."
  },
  {
    id: "tpl-weather",
    label: "Weather advisory",
    severity: "warning",
    message: "Severe weather expected. Suspend all field deployments until further notice."
  },
  {
    id: "tpl-system",
    label: "System maintenance",
    severity: "info",
    message: "Scheduled maintenance window tonight from 22:00 to 23:30 WIB."
  }
];
const workspace = {
  currentUser: currentUser$1,
  notifications: notifications$1,
  broadcastTemplates: broadcastTemplates$1
};
let currentUser = workspace.currentUser;
const listeners$1 = /* @__PURE__ */ new Set();
const emit$1 = () => listeners$1.forEach((listener) => listener());
const subscribeSession = (listener) => {
  listeners$1.add(listener);
  return () => listeners$1.delete(listener);
};
const getSessionUser = () => currentUser;
const signOut = () => {
  if (!currentUser) return false;
  currentUser = null;
  emit$1();
  return true;
};
const sessionDurationLabel = () => {
  if (!currentUser) return "—";
  const started = new Date(currentUser.sessionStartedAt).getTime();
  if (Number.isNaN(started)) return "—";
  const minutes = Math.max(0, Math.round((Date.now() - started) / 6e4));
  const h = Math.floor(minutes / 60);
  const m2 = minutes % 60;
  return h > 0 ? `${h}h ${m2}m` : `${m2}m`;
};
const __vite_import_meta_env__ = {};
const BASE_URL = (__vite_import_meta_env__?.VITE_API_BASE_URL ?? "").trim();
const isApiConfigured = () => BASE_URL.length > 0;
class ApiError extends Error {
  status;
  code;
  constructor(message, status = 0, code = "UNKNOWN") {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.code = code;
  }
}
const request = async (path, init) => {
  let response;
  try {
    response = await fetch(`${BASE_URL}${path}`, {
      ...init,
      headers: { "Content-Type": "application/json", ...init?.headers ?? {} }
    });
  } catch {
    throw new ApiError("Network unreachable", 0, "NETWORK");
  }
  if (!response.ok) {
    throw new ApiError(`Request failed with status ${response.status}`, response.status, "HTTP");
  }
  const envelope = await response.json();
  if (!envelope.success) {
    throw new ApiError(envelope.error?.message ?? "Request failed", response.status, envelope.error?.code);
  }
  return envelope.data;
};
const apiGet = (path) => {
  return request(path, void 0);
};
const apiPost = (path, body) => {
  return request(path, {
    method: "POST",
    headers: {
      ...{},
      // Required by the attendance contract so a retry cannot create a duplicate punch.
      "Idempotency-Key": body?.idempotencyKey ?? ""
    },
    body: JSON.stringify(body)
  });
};
const apiPatch = (path, body) => {
  return request(path, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      ...{}
    },
    body: JSON.stringify(body)
  });
};
const apiDelete = async (path) => {
  await request(path, {
    method: "DELETE",
    headers: void 0
  });
};
const pad = (value, length = 2) => String(value).padStart(length, "0");
const nowServer = (offsetMs = 0) => new Date(Date.now() + offsetMs);
const formatTimestamp = (input, offsetMs = 0) => {
  const date = input instanceof Date ? new Date(input.getTime() + offsetMs) : new Date(input);
  if (Number.isNaN(date.getTime())) return "-";
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
};
const formatLongDate = (input, offsetMs = 0) => {
  const date = input instanceof Date ? new Date(input.getTime() + offsetMs) : new Date(input);
  if (Number.isNaN(date.getTime())) return "-";
  return date.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric"
  });
};
const formatDuration = (minutes) => {
  const safe = Math.max(0, Math.round(minutes));
  const h = Math.floor(safe / 60);
  const m2 = safe % 60;
  return h > 0 ? `${h}h ${m2}m` : `${m2}m`;
};
const formatPercent = (value, fractionDigits = 1, mode = "round") => {
  const factor = 10 ** fractionDigits;
  const adjusted = mode === "floor" ? Math.floor(value * factor) / factor : value;
  return `${adjusted.toFixed(fractionDigits)}%`;
};
const formatSignedPercent = (value, fractionDigits = 1) => `${value > 0 ? "+" : ""}${value.toFixed(fractionDigits)}%`;
const formatCount = (value) => value.toLocaleString("en-US", { maximumFractionDigits: 0 });
let notifications = workspace.notifications.map((n2) => ({
  ...n2,
  // Re-stamp onto the feed day so the panel reads as live.
  timestamp: `${(/* @__PURE__ */ new Date()).toISOString().slice(0, 10)}T${n2.timestamp.slice(11, 19)}`
}));
const listeners = /* @__PURE__ */ new Set();
const emit = () => listeners.forEach((listener) => listener());
const subscribeNotifications = (listener) => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};
const getNotifications = () => notifications;
const getUnreadCount = () => notifications.filter((n2) => !n2.read).length;
const markAllRead = () => {
  notifications = notifications.map((n2) => ({ ...n2, read: true }));
  emit();
};
const markRead = (id2) => {
  notifications = notifications.map((n2) => n2.id === id2 ? { ...n2, read: true } : n2);
  emit();
};
const pushNotification = (input) => {
  const created = {
    ...input,
    id: `NTF-LIVE-${Date.now()}`,
    timestamp: (/* @__PURE__ */ new Date()).toISOString(),
    read: false
  };
  notifications = [created, ...notifications].slice(0, 50);
  emit();
  return created;
};
const notificationTime = (item, offsetMs = 0) => formatTimestamp(item.timestamp, offsetMs);
const broadcastTemplates = () => workspace.broadcastTemplates;
const sendBroadcast = async (payload) => {
  if (isApiConfigured()) {
    await apiGet("/dashboard/broadcast");
  }
  return pushNotification({
    severity: payload.severity,
    category: "broadcast",
    title: payload.severity === "critical" ? "Emergency broadcast dispatched" : "Broadcast alert dispatched",
    body: `${payload.message} — audience: ${payload.audience.toUpperCase()}`
  });
};
const navItems = [
  { path: "/dashboard", icon: "dashboard", label: "Dashboard" },
  { path: "/live-monitoring", icon: "radar", label: "Live Monitoring" },
  { path: "/employees", icon: "badge", label: "Employees" },
  { path: "/attendance", icon: "how_to_reg", label: "Attendance" },
  { path: "/location", icon: "near_me", label: "Location" },
  { path: "/reports", icon: "analytics", label: "Reports" },
  { path: "/settings", icon: "tune", label: "Settings" }
];
const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const user = reactExports.useSyncExternalStore(subscribeSession, getSessionUser, getSessionUser);
  const [showProfile, setShowProfile] = reactExports.useState(false);
  const [confirmSignOut, setConfirmSignOut] = reactExports.useState(false);
  const [toast, setToast] = reactExports.useState(null);
  const unread = getUnreadCount();
  const showToast = (message) => {
    setToast(message);
    window.setTimeout(() => setToast(null), 3e3);
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("aside", { className: "sidebar", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "sidebar-top", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "sidebar-logo", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "img",
          {
            src: "https://lh3.googleusercontent.com/aida/AEtjO1UWJ4fBfypplT2TfmlLL_wArhrhdXTTny7jvpx3yzxK4gEz79BpmH78o0Lgk05AZYZC3CkRiKF2hS7RLnQXs7MGZlSEKEFuPIi5WAbSEGDK9xR3BXW2UBzyRApO9M5uiMN0ueH-K3TRn1-wt11Jfvodc_KW6o8mMk85HfVwuw5OSnuIioN2XnOpYugfw8e5fbcYTojG9JEnUFHq8AoO5zVRj0AI9_-H9m0obeTrL6Nz",
            alt: "Vanguard FieldOps Logo",
            className: "sidebar-logo-img",
            onError: (e) => {
              e.target.style.display = "none";
            }
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "sidebar-logo-text", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "sidebar-logo-name", children: "Vanguard FieldOps" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "sidebar-logo-sub", children: "Enterprise Attendance & Live GPS" })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "sidebar-divider" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("nav", { className: "sidebar-nav", children: navItems.map((item) => {
        const isActive = location.pathname === item.path || item.path !== "/" && location.pathname.startsWith(item.path);
        return /* @__PURE__ */ jsxRuntimeExports.jsxs(
          NavLink,
          {
            to: item.path,
            className: `sidebar-nav-item ${isActive ? "active" : ""}`,
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "material-symbols-outlined sidebar-nav-icon", children: item.icon }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "sidebar-nav-label", children: item.label })
            ]
          },
          item.path
        );
      }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "sidebar-footer", children: [
      toast && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "toast-notice", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "material-symbols-outlined icon-md", style: { color: "var(--color-tertiary-fixed)" }, children: "check_circle" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: toast })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "sidebar-user", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "img",
          {
            src: user?.avatar ?? "",
            alt: user?.name ?? "Signed out",
            className: "sidebar-user-avatar",
            onError: (e) => {
              const el2 = e.target;
              el2.style.display = "none";
              const fallback = el2.nextElementSibling;
              if (fallback) fallback.style.display = "flex";
            }
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "sidebar-user-avatar-fallback", style: { display: "none" }, children: "SJ" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "sidebar-user-info", onClick: () => setShowProfile(true), style: { cursor: "pointer" }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "sidebar-user-name", children: user?.name ?? "Sarah Jenkins" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "sidebar-user-role", children: user?.role ?? "Super Admin / HR Director" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "sidebar-user-actions", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            NavLink,
            {
              to: "/settings",
              className: "sidebar-user-action-btn",
              title: "Settings",
              onClick: (e) => {
                e.preventDefault();
                showToast("Settings module is not enabled in this build");
              },
              children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "material-symbols-outlined icon-sm", children: "settings" })
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "sidebar-user-action-btn logout", title: "Logout", onClick: () => setConfirmSignOut(true), children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "material-symbols-outlined icon-sm", children: "logout" }) })
        ] })
      ] })
    ] }),
    showProfile && user && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "emp-modal-backdrop", onClick: () => setShowProfile(false), children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "emp-modal-card", onClick: (e) => e.stopPropagation(), children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "emp-modal-header", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "emp-modal-title", children: "Account" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", className: "telemetry-tool-btn", onClick: () => setShowProfile(false), children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "material-symbols-outlined icon-md", children: "close" }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "emp-modal-body", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", alignItems: "center", gap: 14 }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "img",
            {
              src: user.avatar,
              alt: user.name,
              style: { width: 56, height: 56, borderRadius: "50%", objectFit: "cover" }
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { style: { margin: 0, fontSize: "var(--fs-title-md)", fontWeight: 700 }, children: user.name }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontSize: "var(--fs-body-sm)", color: "var(--color-outline)" }, children: user.email }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", gap: 6, marginTop: 4 }, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "telemetry-badge-id", children: user.id }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "telemetry-dept", children: user.department })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginTop: 10 }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { padding: 10, background: "var(--color-surface-container-low)", borderRadius: "var(--radius-base)" }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontSize: 11, color: "var(--color-outline)", display: "block" }, children: "Role" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { style: { fontSize: 13 }, children: user.role })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { padding: 10, background: "var(--color-surface-container-low)", borderRadius: "var(--radius-base)" }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontSize: 11, color: "var(--color-outline)", display: "block" }, children: "Session" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { style: { fontSize: 13 }, children: sessionDurationLabel() })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { padding: 10, background: "var(--color-surface-container-low)", borderRadius: "var(--radius-base)", gridColumn: "1/-1" }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontSize: 11, color: "var(--color-outline)", display: "block" }, children: "Permissions" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { display: "flex", flexWrap: "wrap", gap: 4, marginTop: 4 }, children: user.permissions.map((permission) => /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "emp-geofence-tag", style: { fontSize: 11 }, children: permission }, permission)) })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "emp-modal-footer", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", className: "btn btn-secondary", onClick: () => setShowProfile(false), children: "Close" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            type: "button",
            className: "btn btn-primary",
            onClick: () => {
              markAllRead();
              setShowProfile(false);
              showToast(`${unread} notification(s) cleared`);
            },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "material-symbols-outlined icon-sm", children: "notifications" }),
              "Clear Notifications"
            ]
          }
        )
      ] })
    ] }) }),
    confirmSignOut && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "emp-modal-backdrop", onClick: () => setConfirmSignOut(false), children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "emp-modal-card", onClick: (e) => e.stopPropagation(), children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "emp-modal-header", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "emp-modal-title", children: "End Session" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", className: "telemetry-tool-btn", onClick: () => setConfirmSignOut(false), children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "material-symbols-outlined icon-md", children: "close" }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "emp-modal-body", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", gap: 10, alignItems: "flex-start" }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "material-symbols-outlined icon-lg", style: { color: "var(--color-error)" }, children: "logout" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", flexDirection: "column", gap: 4 }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "Sign out of Vanguard FieldOps?" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { style: { fontSize: "var(--fs-body-sm)", color: "var(--color-on-surface-variant)" }, children: [
            "Live telemetry streams will keep recording on the server, but this console will stop receiving updates. Active shift ",
            sessionDurationLabel(),
            "."
          ] })
        ] })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "emp-modal-footer", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", className: "btn btn-secondary", onClick: () => setConfirmSignOut(false), children: "Stay Signed In" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            type: "button",
            className: "btn btn-primary",
            style: { background: "var(--color-error)", color: "var(--color-on-error)" },
            onClick: () => {
              signOut();
              setConfirmSignOut(false);
              showToast("Session ended — re-authentication required");
              navigate("/dashboard");
            },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "material-symbols-outlined icon-sm", children: "logout" }),
              "Sign Out"
            ]
          }
        )
      ] })
    ] }) })
  ] });
};
const meta$3 = {
  generatedAt: "2024-10-24T10:45:00+07:00",
  totalHeadcount: 128,
  fullTime: 120,
  contractFleet: 8,
  geofencedPersonnel: 114,
  zoneIntegrityPercent: 94.2,
  remoteFieldFleet: 14,
  deviceHealthPercent: 98.2,
  activePings: 126,
  totalDevices: 128,
  verifiedInside: 112,
  perimeterBreaches: 2,
  verifiedShiftPercent: 98.3,
  heartbeatLatencyMs: 84
};
const employees = [
  {
    id: "EMP-8821",
    name: "Ahmad Rahman",
    email: "a.rahman@vanguardops.com",
    empId: "EMP-8821",
    rfidToken: "RFID-0912",
    department: "IT Engineering",
    role: "Lead Development Engineer",
    geofence: "HQ Central Hub",
    attendanceStatus: "present",
    attendanceTime: "Present â€¢ 08:02",
    locationState: "online",
    locationDetail: "Online (Working)",
    lastPing: "12s ago",
    avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuASMPmc7m9v3AbVl3DsBO-t8KCIN8woGXSUvZsqXSaGkWNUfPVYxmaiiKQFJc-p4oGd5rqDrVwdX08zYOvrz-W2k3EHgNazMbbSNEXH4xFHQ6lqdd021G8Y7ee0Mm2A718Afu0gmjiAcaLjdsTJUydaGu60Wc7TPb_7nPdM7bGunzpy-TTzh_M9uQLBtxhqwawWuKYtSlx0OJX-NDEKSH2RMc-4kDs8wBA0PYlG6m0",
    gps: {
      lat: -6.208612,
      lng: 106.845694,
      accuracy: 3.2
    },
    updatedAt: "2024-10-24T10:44:52+07:00",
    distanceMeters: 85
  },
  {
    id: "EMP-9014",
    name: "Budi Setiawan",
    email: "b.setiawan@vanguardops.com",
    empId: "EMP-9014",
    rfidToken: "RFID-1128",
    department: "Design & Product",
    role: "Sr UI/UX Designer",
    geofence: "HQ Central Hub",
    attendanceStatus: "present",
    attendanceTime: "Present â€¢ 08:07",
    locationState: "online",
    locationDetail: "Online (Working)",
    lastPing: "44s ago",
    avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuAUEUcfu8zAGnSsAc5NK0DS28aKsDQjpgSTVcZIl36fIRYEbFaF942LB4ppb1E-49Y4o_7Vii-cnHyb_RNy1sGUSiiWESO-lsarTjjip-TjKHVoI9RMwixjNsv21mDWfwf5n-ZfkDRVgw50kEWp751ggPWpWLPoQELrjku2fMc5pisYQG_2rxhsTIgTt3a3i7MV7oWsmziIxw8LuRF3TaVLItca-smAhh5MGVgNTHE",
    gps: {
      lat: -6.209258,
      lng: 106.844984,
      accuracy: 2.8
    },
    updatedAt: "2024-10-24T10:44:52+07:00",
    distanceMeters: 120
  },
  {
    id: "EMP-7742",
    name: "Dimas Pratama",
    email: "d.pratama@vanguardops.com",
    empId: "EMP-7742",
    rfidToken: "RFID-4401",
    department: "Growth Marketing",
    role: "Performance Specialist",
    geofence: "HQ Central Hub",
    attendanceStatus: "late",
    attendanceTime: "Late â€¢ 08:24",
    locationState: "breach",
    locationDetail: "Outside Zone (+420m)",
    lastPing: "1m ago",
    avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuAWf5FPRarHiQoZ7ajM_gF4HfKJjzkMu5KAAvtmQorjbzzvuPQqrmnXQO2b2jH_6QWat5zvcLEDcqUM5_hXZEFMDUyMQTq_Dfzg5irlPJRpxGdu0yA2VzzNS9SPMzwQesaBavOU9girV6X1r-L-0S4YyIM6KI5Rz_dmwQuwPfno3kym6XYCxek0AIeO-S5Xh_kcaByl2MJIrJH6Ha64ejL76LmraMLUsPeq3eKMqTc",
    gps: {
      lat: -6.207579,
      lng: 106.84266,
      accuracy: 4.1
    },
    updatedAt: "2024-10-24T10:44:52+07:00",
    distanceMeters: 410
  },
  {
    id: "EMP-4412",
    name: "Siti Nurhaliza",
    email: "s.nurhaliza@vanguardops.com",
    empId: "EMP-4412",
    rfidToken: "RFID-8089",
    department: "Finance & Control",
    role: "Head of Finance",
    geofence: "HQ Central Hub",
    attendanceStatus: "present",
    attendanceTime: "Present â€¢ 08:14",
    locationState: "online",
    locationDetail: "Online (Working)",
    lastPing: "3s ago",
    avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuDxxbtS4S__irTJZiJIMNPclJIYVP-vqP2bx2BUTLANHtEXwaEln92j6Jtg0_5mrxTpOR1hZIpd-1nzSuRuaPHOIWq6n0RWFQYWFC5lWKu7oyogRmTUzqNGwZIopybwhdVXlN4m7oU-9Tinup8QeCVku2DpeFCzB7OITtKz3LV2zvah4UN8Iq-O_ssnEg2nD6wGFIWFzq7dvBpM2yqnqSA5aQfuiJTdrsg1czRNmng",
    gps: {
      lat: -6.208483,
      lng: 106.844596,
      accuracy: 3.5
    },
    updatedAt: "2024-10-24T10:44:52+07:00",
    distanceMeters: 95
  },
  {
    id: "EMP-6320",
    name: "Rizky Ananda",
    email: "r.ananda@vanguardops.com",
    empId: "EMP-6320",
    rfidToken: "RFID-5521",
    department: "IT Engineering",
    role: "DevOps Specialist",
    geofence: "HQ Central Hub",
    attendanceStatus: "present",
    attendanceTime: "Present â€¢ 08:00",
    locationState: "online",
    locationDetail: "Online (Working)",
    lastPing: "18s ago",
    avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuB2nJah6zp5HbCed-s1aAYGr3w48SfXYYnFb8iDG1qSQ5nZ4lVbn2BGa0v3P2Fy8jS7k7QBeV1-KJlSrbthfBac462lsFF1I2pYgsR9zaAHWEB6LOTcJ7jlQ3heQ4ZnBQZx1YtaFIsbnGbnMEpL8t6TDyvVz0OlR9p82KgQazr154SSr0B5wMXQGLYnrIbNOWI27mHVzAJtalC9XGg1a_WaOOdIaxX7VXD5QjvERlo",
    gps: {
      lat: -6.209388,
      lng: 106.846016,
      accuracy: 2.1
    },
    updatedAt: "2024-10-24T10:44:52+07:00",
    distanceMeters: 40
  },
  {
    id: "EMP-5519",
    name: "Maya Indah",
    email: "m.indah@vanguardops.com",
    empId: "EMP-5519",
    rfidToken: "RFID-6712",
    department: "HR & People Ops",
    role: "HR Operations Lead",
    geofence: "HQ Central Hub",
    attendanceStatus: "present",
    attendanceTime: "Present â€¢ 08:12",
    locationState: "online",
    locationDetail: "Online (Working)",
    lastPing: "2m ago",
    avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuAnsaGPIT_9UGqO37DWWNR6RJNNt029ll-3var7e1Sy7qFnoKho6ZL5RJu9Cf_SjhtBJz08fnl1_yTfwjTmrE3jUNts4hnpqVGNxKAbJ_I80T-t-vViwbVw-vTqAFOM1W_hSEG_kUYZ9WEWsj3zm7hP__1_JbGQgocf7JCcL_xJ8qjZGunfiYlELu--zCyFFq2R_O3Wmk4ICFOfE99dlGMjx9MVAcsqMzMWi2YhZuc",
    gps: {
      lat: -6.208548,
      lng: 106.846404,
      accuracy: 5
    },
    updatedAt: "2024-10-24T10:44:52+07:00",
    distanceMeters: 70
  },
  {
    id: "EMP-4389",
    name: "Fajar Nugraha",
    email: "f.nugraha@vanguardops.com",
    empId: "EMP-4389",
    rfidToken: "GPS-FLEET-31",
    department: "Client Ops / Field",
    role: "Client Account Exec",
    geofence: "Field Mobile Unit",
    attendanceStatus: "present",
    attendanceTime: "Present â€¢ 08:45",
    locationState: "field",
    locationDetail: "Field Verified",
    lastPing: "5s ago",
    avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuAM4auTmNrPKEIJZz8g6q74n41ZKy4YMV69MxIWPJiEC02yjI6Fef9FunVFV8ExN5vgrJ7Mk0Uk7jGpxSxhIuY1GcoIEQ-8WQf3EtLL3mbdH_nyXNyTmcokoVgglhKTH3paLSOoBhJpngPvB3Vq9qR553vsXpySQMleWdAFMxXI1orl7gbiyB6nzEJh7rw67duDRPmDfKNJBWYlaKx5HOuj9GoV7OhnKc9rrRTBOlU",
    gps: {
      lat: -6.212015,
      lng: 106.85052,
      accuracy: 5
    },
    updatedAt: "2024-10-24T10:44:52+07:00",
    distanceMeters: 2400
  },
  {
    id: "EMP-3108",
    name: "Dian Kusuma",
    email: "d.kusuma@vanguardops.com",
    empId: "EMP-3108",
    rfidToken: "RFID-2009",
    department: "Supply Chain",
    role: "Logistics Coordinator",
    geofence: "South Hub",
    attendanceStatus: "leave",
    attendanceTime: "Approved Leave",
    locationState: "offline",
    locationDetail: "Offline (On Leave)",
    lastPing: "Yesterday",
    avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuCaZkhwMcimzL1_GoVGROEGBgY7E4FOGndSXfTUye4jgAaYDv82ZHhHUGNikRFUTMlALsXhXyeOmSBThrj6XFbv0aAeQLQcaNiIz4S44QO8l3MkjkITa9R-f3QzA0a4g7NeNkmkhjnfp00c8StHk9EDxesDo3ySqoIb_Kkyz70G9QHDIzHzFW8q1edazVXlX3tCgAk1kwqOG5GhOZqHhycsBJNyMeUMzy9cvbic_T8",
    gps: null,
    updatedAt: "2024-10-23T17:02:11+07:00",
    distanceMeters: null
  }
];
const fleet$1 = [
  {
    id: "FLEET-01",
    plate: "B 9123 KJA",
    model: "Isuzu Traga 4x4",
    status: "moving",
    fuelPercent: 72,
    odometerKm: 84210,
    speedKmh: 46,
    driver: "Yusuf Maulana",
    driverEmpId: null,
    geofence: "HQ Central Hub",
    gps: {
      lat: -6.2089,
      lng: 106.8461,
      accuracy: 3.4
    },
    updatedAt: "10:44:40",
    nextServiceKm: 85e3
  },
  {
    id: "FLEET-02",
    plate: "B 9455 KJC",
    model: "Mitsubishi L300",
    status: "idling",
    fuelPercent: 41,
    odometerKm: 119304,
    speedKmh: 0,
    driver: "Ratna Sari",
    driverEmpId: null,
    geofence: "HQ Central Hub",
    gps: {
      lat: -6.2094,
      lng: 106.8451,
      accuracy: 2.9
    },
    updatedAt: "10:44:55",
    nextServiceKm: 12e4
  },
  {
    id: "FLEET-03",
    plate: "B 9781 KJA",
    model: "Toyota Hilux",
    status: "moving",
    fuelPercent: 18,
    odometerKm: 56780,
    speedKmh: 62,
    driver: "Agus Prasetyo",
    driverEmpId: "EMP-4389",
    geofence: "Client Ops / Field",
    gps: {
      lat: -6.2117,
      lng: 106.8498,
      accuracy: 6.2
    },
    updatedAt: "10:45:02",
    nextServiceKm: 6e4
  },
  {
    id: "FLEET-04",
    plate: "B 9002 KJB",
    model: "Suzuki Carry",
    status: "maintenance",
    fuelPercent: 64,
    odometerKm: 73902,
    speedKmh: 0,
    driver: "Dewi Lestari",
    driverEmpId: null,
    geofence: "South Hub",
    gps: {
      lat: -6.2059,
      lng: 106.8557,
      accuracy: 4.7
    },
    updatedAt: "08:12:44",
    nextServiceKm: 74e3
  },
  {
    id: "FLEET-05",
    plate: "B 9907 KJC",
    model: "Isuzu Elf",
    status: "offline",
    fuelPercent: 9,
    odometerKm: 143670,
    speedKmh: 0,
    driver: "Bagas Wijaya",
    driverEmpId: null,
    geofence: "Field Mobile Unit",
    gps: {
      lat: -6.2301,
      lng: 106.8702,
      accuracy: 12
    },
    updatedAt: "06:40:18",
    nextServiceKm: 145e3
  },
  {
    id: "FLEET-06",
    plate: "B 9311 KJA",
    model: "Daihatsu Gran Max",
    status: "idling",
    fuelPercent: 88,
    odometerKm: 30241,
    speedKmh: 0,
    driver: "Hendra Wijaya",
    driverEmpId: null,
    geofence: "HQ Central Hub",
    gps: {
      lat: -6.2082,
      lng: 106.8448,
      accuracy: 3
    },
    updatedAt: "10:44:31",
    nextServiceKm: 5e4
  }
];
const mockSnapshot$3 = {
  meta: meta$3,
  employees,
  fleet: fleet$1
};
const asEntry = (raw) => raw;
const ALL_EMPLOYEES = mockSnapshot$3.employees.map(asEntry);
const FIELD_WEIGHT = {
  name: 0,
  id: 1,
  email: 2,
  department: 3,
  role: 4
};
const resolveMatch = (employee, query) => {
  const q2 = query.trim().toLowerCase();
  if (!q2) return null;
  const candidates = [
    ["name", employee.name],
    ["id", `${employee.empId} ${employee.rfidToken}`],
    ["email", employee.email],
    ["department", employee.department],
    ["role", employee.role]
  ];
  let best = null;
  let bestScore = Number.POSITIVE_INFINITY;
  candidates.forEach(([field, value]) => {
    const lower = value.toLowerCase();
    if (!lower.includes(q2)) return;
    const score = FIELD_WEIGHT[field] * 2 + (lower.startsWith(q2) ? 0 : 1);
    if (score < bestScore) {
      bestScore = score;
      best = { employee, matchField: field };
    }
  });
  return best;
};
const useGlobalSearch = (limit = 6) => {
  const [query, setQuery] = reactExports.useState("");
  const [isOpen, setIsOpen] = reactExports.useState(false);
  const [shortcutActive, setShortcutActive] = reactExports.useState(false);
  const inputRef = reactExports.useRef(null);
  reactExports.useEffect(() => {
    const onKeyDown = (event) => {
      const isShortcut = (event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k";
      if (!isShortcut) return;
      event.preventDefault();
      setIsOpen(true);
      setShortcutActive(true);
      window.setTimeout(() => inputRef.current?.focus(), 0);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);
  const results = reactExports.useMemo(() => {
    if (!query.trim()) return [];
    return ALL_EMPLOYEES.map((employee) => resolveMatch(employee, query)).filter((entry) => entry !== null).slice(0, limit);
  }, [query, limit]);
  const clear = reactExports.useCallback(() => {
    setQuery("");
    setIsOpen(false);
  }, []);
  return {
    query,
    setQuery: reactExports.useCallback((value) => {
      setQuery(value);
      setIsOpen(true);
    }, []),
    results,
    isOpen,
    open: reactExports.useCallback(() => setIsOpen(true), []),
    close: reactExports.useCallback(() => setIsOpen(false), []),
    clear,
    shortcutActive,
    inputRef
  };
};
const SEVERITY_ICON = {
  critical: "crisis_alert",
  high: "warning",
  warning: "campaign",
  medium: "sensors",
  low: "check_circle",
  info: "info"
};
const SEVERITY_COLOR = {
  critical: "var(--color-error)",
  high: "var(--color-error)",
  warning: "var(--color-secondary)",
  medium: "var(--color-secondary)",
  low: "var(--color-primary)",
  info: "var(--color-primary)"
};
const Header = () => {
  const navigate = useNavigate();
  const [now, setNow] = reactExports.useState(/* @__PURE__ */ new Date());
  const search = useGlobalSearch();
  const [notifOpen, setNotifOpen] = reactExports.useState(false);
  const [profileOpen, setProfileOpen] = reactExports.useState(false);
  const notifications2 = reactExports.useSyncExternalStore(subscribeNotifications, getNotifications, getNotifications);
  const user = reactExports.useSyncExternalStore(subscribeSession, getSessionUser, getSessionUser);
  const unread = notifications2.filter((n2) => !n2.read).length;
  reactExports.useEffect(() => {
    const timer = setInterval(() => setNow(/* @__PURE__ */ new Date()), 1e3);
    return () => clearInterval(timer);
  }, []);
  reactExports.useEffect(() => {
    const onPointerDown = (event) => {
      const target = event.target;
      if (!target.closest(".header-search") && !target.closest(".header-notif-btn") && !target.closest(".att-export-menu")) {
        search.close();
        setNotifOpen(false);
      }
      if (!target.closest(".header-avatar-wrap") && !target.closest(".att-export-menu")) {
        setProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", onPointerDown);
    return () => document.removeEventListener("mousedown", onPointerDown);
  }, [search]);
  const formatDate = (d) => d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
  const formatTime = (d) => d.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", second: "2-digit" });
  const openResult = (employeeId) => {
    search.clear();
    navigate(`/employees?q=${encodeURIComponent(employeeId)}`);
  };
  const handleSignOut = () => {
    signOut();
    setProfileOpen(false);
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx("header", { className: "app-header", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "header-inner", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "header-status-group", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "header-status-pill header-status-online", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "header-status-dot", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "header-status-dot-ping animate-ping" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "header-status-dot-core" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "header-status-label", children: "System Online" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "header-status-pill header-status-connected", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "header-status-dot-static connected" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "header-status-label", children: "Realtime Connected (10s ago)" })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "header-right", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "header-search", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "material-symbols-outlined header-search-icon icon-md", children: "search" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "input",
          {
            ref: search.inputRef,
            className: "header-search-input",
            type: "text",
            placeholder: "Search employee, department...",
            value: search.query,
            onChange: (e) => search.setQuery(e.target.value),
            onFocus: search.open,
            onKeyDown: (e) => {
              if (e.key === "Escape") search.clear();
              if (e.key === "Enter" && search.results.length > 0) {
                openResult(search.results[0].employee.empId);
              }
            }
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx("kbd", { className: "header-search-kbd", children: "⌘K" }),
        search.isOpen && search.query.trim().length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "att-export-menu", style: { right: 0, top: "100%", zIndex: 60 }, children: search.results.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "att-export-item", style: { cursor: "default" }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "material-symbols-outlined icon-sm", style: { color: "var(--color-outline)" }, children: "search_off" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
            "No match for “",
            search.query,
            "”"
          ] })
        ] }) : search.results.map((result) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            className: "att-export-item",
            type: "button",
            onClick: () => openResult(result.employee.empId),
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "material-symbols-outlined icon-sm", style: { color: "var(--color-primary-container)" }, children: "person" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { style: { display: "flex", flexDirection: "column", alignItems: "flex-start", lineHeight: 1.25 }, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: result.employee.name }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { style: { fontSize: 11, color: "var(--color-outline)" }, children: [
                  result.matchField === "id" ? result.employee.empId : result.employee.role,
                  " •",
                  " ",
                  result.employee.department
                ] })
              ] })
            ]
          },
          result.employee.empId
        )) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "header-clock", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "header-clock-date", children: formatDate(now) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "header-clock-time font-tabular", children: formatTime(now) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "button",
        {
          className: "header-notif-btn",
          type: "button",
          title: "Notifications",
          onClick: () => {
            setNotifOpen((prev) => !prev);
            setProfileOpen(false);
          },
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "material-symbols-outlined icon-md", children: "notifications" }),
            unread > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "header-notif-badge", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "animate-ping", style: {
                position: "absolute",
                inset: 0,
                borderRadius: "50%",
                background: "var(--color-error)",
                opacity: 0.75
              } }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: {
                position: "relative",
                display: "inline-flex",
                width: 8,
                height: 8,
                borderRadius: "50%",
                background: "var(--color-error)"
              } })
            ] })
          ]
        }
      ),
      notifOpen && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "att-export-menu", style: { position: "fixed", right: 190, top: 56, width: 320, zIndex: 60 }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { padding: "10px 12px", borderBottom: "1px solid var(--color-outline-variant)", display: "flex", justifyContent: "space-between", alignItems: "center" }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontWeight: 700, fontSize: "var(--fs-label-md)" }, children: "Notifications" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { style: { fontSize: 11, color: "var(--color-outline)" }, children: [
            unread,
            " unread"
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { maxHeight: 320, overflowY: "auto" }, children: notifications2.map((item) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            className: "att-export-item",
            type: "button",
            style: { opacity: item.read ? 0.6 : 1 },
            onClick: () => markRead(item.id),
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "material-symbols-outlined icon-sm", style: { color: SEVERITY_COLOR[item.severity] }, children: SEVERITY_ICON[item.severity] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { style: { display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 2, whiteSpace: "normal" }, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontWeight: 600 }, children: item.title }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontSize: 11, color: "var(--color-on-surface-variant)" }, children: item.body }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontSize: 10, color: "var(--color-outline)", fontFeatureSettings: '"tnum" 1' }, children: notificationTime(item) })
              ] })
            ]
          },
          item.id
        )) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { padding: 8, borderTop: "1px solid var(--color-outline-variant)" }, children: /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "btn btn-secondary", style: { width: "100%", justifyContent: "center" }, type: "button", onClick: markAllRead, children: "Mark all as read" }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: "header-avatar-wrap",
          role: "button",
          tabIndex: 0,
          onClick: () => {
            setProfileOpen((prev) => !prev);
            setNotifOpen(false);
          },
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "img",
              {
                className: "header-avatar",
                src: user?.avatar ?? "",
                alt: user?.name ?? "Profile",
                onError: (e) => {
                  e.target.src = "";
                }
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "material-symbols-outlined icon-sm", style: { color: "var(--color-outline)" }, children: "arrow_drop_down" }),
            profileOpen && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "att-export-menu", style: { position: "fixed", right: 24, top: 56, width: 240, zIndex: 60 }, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { padding: "10px 12px", display: "flex", flexDirection: "column", gap: 2, borderBottom: "1px solid var(--color-outline-variant)" }, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontWeight: 700 }, children: user?.name ?? "Signed out" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontSize: 11, color: "var(--color-outline)" }, children: user?.role ?? "—" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontSize: 11, color: "var(--color-on-surface-variant)" }, children: user?.email ?? "—" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: "att-export-item", type: "button", onClick: () => {
                setProfileOpen(false);
                navigate("/employees");
              }, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "material-symbols-outlined icon-sm", style: { color: "var(--color-primary-container)" }, children: "badge" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Employee Directory" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: "att-export-item", type: "button", onClick: handleSignOut, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "material-symbols-outlined icon-sm", style: { color: "var(--color-error)" }, children: "logout" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Sign out" })
              ] })
            ] })
          ]
        }
      )
    ] })
  ] }) });
};
const AppShell = ({ children }) => {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "app-shell", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Sidebar, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "app-content", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Header, {}),
      /* @__PURE__ */ jsxRuntimeExports.jsx("main", { className: "app-main", children })
    ] })
  ] });
};
const meta$2 = {
  generatedAt: "2024-10-24T10:42:31+07:00",
  shift: {
    code: "A",
    start: "08:00",
    end: "17:00"
  }
};
const kpi = {
  totalEmployees: {
    value: 128,
    delta: 4,
    direction: "up"
  },
  presentToday: {
    value: 104,
    ratePercent: 81.25,
    vsYesterdayPercent: 3.2
  },
  lateToday: {
    value: 12,
    deltaFromYesterday: -2,
    sharePercent: 9.3
  },
  absentToday: {
    value: 12,
    approved: 8,
    unexcused: 4
  },
  currentlyWorking: {
    value: 87
  }
};
const geo = {
  insideGeofence: 82,
  outsidePerimeter: 5,
  breach: 0,
  geofenceRadiusMeters: 250
};
const attendanceSummary = {
  averageCompletionPercent: 92.4
};
const weeklyAttendance = [
  {
    label: "Mon",
    date: "2024-10-21",
    onTime: 95,
    late: 25,
    isNow: false
  },
  {
    label: "Tue",
    date: "2024-10-22",
    onTime: 105,
    late: 20,
    isNow: false
  },
  {
    label: "Wed",
    date: "2024-10-23",
    onTime: 110,
    late: 15,
    isNow: false
  },
  {
    label: "Thu",
    date: "2024-10-24",
    onTime: 100,
    late: 22,
    isNow: true
  },
  {
    label: "Fri",
    date: "2024-10-25",
    onTime: 85,
    late: 18,
    isNow: false
  }
];
const statusBreakdown = [
  {
    key: "on-time",
    label: "Present",
    value: 104,
    colorToken: "var(--color-primary)"
  },
  {
    key: "late",
    label: "Late",
    value: 12,
    colorToken: "var(--color-secondary-container)"
  },
  {
    key: "absent",
    label: "Absent",
    value: 8,
    colorToken: "var(--color-surface-container-highest)"
  },
  {
    key: "on-leave",
    label: "On Leave",
    value: 4,
    colorToken: "var(--color-tertiary-fixed-dim)"
  }
];
const shiftCoverage = [
  {
    department: "Engineering & IT",
    present: 34,
    total: 38,
    colorToken: "var(--color-primary)"
  },
  {
    department: "Product & Design",
    present: 18,
    total: 20,
    colorToken: "var(--color-secondary-container)"
  },
  {
    department: "Marketing & Sales",
    present: 22,
    total: 28,
    colorToken: "var(--color-tertiary-fixed)"
  },
  {
    department: "Finance & Legal",
    present: 14,
    total: 16,
    colorToken: "var(--color-secondary)"
  },
  {
    department: "Field Operations",
    present: 16,
    total: 26,
    colorToken: "var(--color-on-tertiary-container)"
  }
];
const attendanceLog = [
  {
    id: "log-0001",
    employeeId: "EMP-8821",
    name: "Ahmad Rahman",
    initials: "AR",
    checkInAt: "2024-10-24T08:02:00+07:00",
    status: "on-time",
    geoStatus: "verified",
    department: "IT",
    locationLabel: "Zone 3, Floor 2",
    workDurationMinutes: 161
  },
  {
    id: "log-0002",
    employeeId: "EMP-7712",
    name: "Budi Setiawan",
    initials: "BS",
    checkInAt: "2024-10-24T08:07:00+07:00",
    status: "on-time",
    geoStatus: "verified",
    department: "Design",
    locationLabel: "Zone 1, Floor 3",
    workDurationMinutes: 156
  },
  {
    id: "log-0003",
    employeeId: "EMP-6634",
    name: "Dimas Pratama",
    initials: "DP",
    checkInAt: "2024-10-24T08:24:00+07:00",
    status: "late",
    geoStatus: "outside",
    department: "Marketing",
    locationLabel: "External (410m)",
    workDurationMinutes: 139
  },
  {
    id: "log-0004",
    employeeId: "EMP-5521",
    name: "Siti Nurhaliza",
    initials: "SN",
    checkInAt: "2024-10-24T08:14:00+07:00",
    status: "on-time",
    geoStatus: "verified",
    department: "Finance",
    locationLabel: "Zone 2, Floor 1",
    workDurationMinutes: 149
  },
  {
    id: "log-0005",
    employeeId: "EMP-4480",
    name: "Rizky Ananda",
    initials: "RA",
    checkInAt: "2024-10-24T08:00:00+07:00",
    status: "early",
    geoStatus: "verified",
    department: "DevOps",
    locationLabel: "Zone 3, Floor 2",
    workDurationMinutes: 163
  }
];
const mockSnapshot$2 = {
  meta: meta$2,
  kpi,
  geo,
  attendanceSummary,
  weeklyAttendance,
  statusBreakdown,
  shiftCoverage,
  attendanceLog
};
const DASHBOARD_ENDPOINT = "/dashboard/overview";
const POLL_INTERVAL_MS = 1e4;
let mockState = null;
const stampLogDates = (snapshot, serverNow) => {
  const pad2 = (value) => String(value).padStart(2, "0");
  const dayKey = `${serverNow.getFullYear()}-${pad2(serverNow.getMonth() + 1)}-${pad2(serverNow.getDate())}`;
  snapshot.attendanceLog.forEach((entry) => {
    const clock = entry.checkInAt.slice(11, 19);
    const stamped = `${dayKey}T${clock}`;
    entry.checkInAt = Number.isNaN(new Date(stamped).getTime()) ? entry.checkInAt : stamped;
  });
};
const cloneMock = () => {
  const snapshot = JSON.parse(JSON.stringify(mockSnapshot$2));
  const serverNow = /* @__PURE__ */ new Date();
  snapshot.meta.generatedAt = serverNow.toISOString();
  stampLogDates(snapshot, serverNow);
  return snapshot;
};
const tickMock = (previous) => {
  const next = cloneMock();
  const drift2 = Math.floor(Math.random() * 5) - 2;
  const working = Math.max(0, next.kpi.currentlyWorking.value + drift2);
  const inside = Math.max(0, next.geo.insideGeofence + drift2);
  const outside = Math.max(0, next.geo.outsidePerimeter - drift2);
  next.kpi.currentlyWorking.value = working;
  next.geo.insideGeofence = inside;
  next.geo.outsidePerimeter = outside;
  next.attendanceLog = previous.attendanceLog.map((row) => ({
    ...row,
    workDurationMinutes: row.workDurationMinutes + 1
  }));
  next.meta.generatedAt = new Date(Date.now()).toISOString();
  return next;
};
const fetchFromMock$3 = () => new Promise((resolve) => {
  setTimeout(() => {
    mockState = mockState ? tickMock(mockState) : cloneMock();
    resolve(JSON.parse(JSON.stringify(mockState)));
  }, 150);
});
const fetchDashboardSnapshot = async () => {
  if (!isApiConfigured()) return fetchFromMock$3();
  return apiGet(DASHBOARD_ENDPOINT);
};
const useDashboardData = (pollIntervalMs = POLL_INTERVAL_MS) => {
  const [data, setData] = reactExports.useState(null);
  const [status, setStatus] = reactExports.useState("idle");
  const [error, setError] = reactExports.useState(null);
  const [msSinceSync, setMsSinceSync] = reactExports.useState(POLL_INTERVAL_MS);
  const [serverOffsetMs, setServerOffsetMs] = reactExports.useState(0);
  const lastSyncRef = reactExports.useRef(0);
  const offsetRef = reactExports.useRef(0);
  const mountedRef = reactExports.useRef(true);
  const load = reactExports.useCallback(async () => {
    try {
      const snapshot = await fetchDashboardSnapshot();
      const serverTime = new Date(snapshot.meta.generatedAt).getTime();
      if (offsetRef.current === 0 && !Number.isNaN(serverTime)) {
        offsetRef.current = serverTime - Date.now();
        setServerOffsetMs(offsetRef.current);
      }
      if (!mountedRef.current) return;
      setData(snapshot);
      lastSyncRef.current = Date.now();
      setMsSinceSync(0);
      setStatus("ready");
      setError(null);
    } catch (err) {
      if (!mountedRef.current) return;
      setStatus("error");
      setError(err instanceof Error ? err.message : "Failed to load dashboard data");
    }
  }, []);
  reactExports.useEffect(() => {
    mountedRef.current = true;
    void load();
    return () => {
      mountedRef.current = false;
    };
  }, [load]);
  reactExports.useEffect(() => {
    const poller = window.setInterval(() => {
      void load();
    }, pollIntervalMs);
    return () => window.clearInterval(poller);
  }, [load, pollIntervalMs]);
  reactExports.useEffect(() => {
    const ticker = window.setInterval(() => {
      setMsSinceSync(lastSyncRef.current === 0 ? pollIntervalMs : Date.now() - lastSyncRef.current);
    }, 1e3);
    return () => window.clearInterval(ticker);
  }, [pollIntervalMs]);
  return reactExports.useMemo(
    () => ({ data, status, error, msSinceSync, serverOffsetMs, refresh: load }),
    [data, status, error, msSinceSync, serverOffsetMs, load]
  );
};
const toCsvCell = (value) => {
  const text = String(value ?? "");
  return /[",\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
};
const rowsToCsv = (rows) => {
  if (rows.length === 0) return "";
  const headers = Object.keys(rows[0]);
  const lines = [headers.join(",")];
  rows.forEach((row) => lines.push(headers.map((key) => toCsvCell(row[key])).join(",")));
  return lines.join("\n");
};
const triggerDownload = (filename, mime, content) => {
  const blob = new Blob([content], { type: `${mime};charset=utf-8;` });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  window.setTimeout(() => URL.revokeObjectURL(url), 1e3);
};
const stamp = () => {
  const now = /* @__PURE__ */ new Date();
  const pad2 = (v2) => String(v2).padStart(2, "0");
  return `${now.getFullYear()}${pad2(now.getMonth() + 1)}${pad2(now.getDate())}-${pad2(now.getHours())}${pad2(now.getMinutes())}`;
};
const downloadCsv = (baseName, rows) => {
  const filename = `${baseName}-${stamp()}.csv`;
  triggerDownload(filename, "text/csv", rowsToCsv(rows));
  return filename;
};
const EARTH_RADIUS_M = 63710088e-1;
const METERS_PER_DEGREE_LAT = 110574;
const METERS_PER_DEGREE_LNG_AT_EQUATOR = 111320;
const toRad = (deg) => deg * Math.PI / 180;
const haversineDistance = (a, b) => {
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const lat1 = toRad(a.lat);
  const lat2 = toRad(b.lat);
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
  return 2 * EARTH_RADIUS_M * Math.asin(Math.min(1, Math.sqrt(h)));
};
const evaluateGeofence = (point, site, maxTrustworthyAccuracy = 100) => {
  const distanceMeters = Math.round(haversineDistance(point, site));
  const accuracy = Math.max(0, point.accuracy || 0);
  const insideBuffer = distanceMeters - accuracy;
  const lowConfidence = accuracy > maxTrustworthyAccuracy;
  const borderline = Math.abs(distanceMeters - site.radiusMeters) <= Math.max(accuracy, 20);
  let status = "outside";
  if (insideBuffer <= site.radiusMeters) status = "inside";
  if (!lowConfidence && borderline) status = "borderline";
  return { status, distanceMeters, radiusMeters: site.radiusMeters, lowConfidence };
};
const geofenceLabel = (decision) => {
  if (!decision) return "No Punch Recorded";
  if (decision.status === "inside") return "Punch Inside Perimeter";
  if (decision.status === "borderline") return "Punch On Geofence Boundary";
  return "Punch Outside Permitted Geofence";
};
const DRAWER_MAP_FRAME = {
  width: 500,
  height: 240,
  centerX: 250,
  centerY: 120,
  fenceRadiusPx: 70,
  margin: 24
};
const clamp$1 = (value, min, max) => Math.min(max, Math.max(min, value));
const projectToMapFrame = (point, site, frame = DRAWER_MAP_FRAME) => {
  const metersPerPixel = site.radiusMeters / frame.fenceRadiusPx;
  const northMeters = (point.lat - site.lat) * METERS_PER_DEGREE_LAT;
  const eastMeters = (point.lng - site.lng) * METERS_PER_DEGREE_LNG_AT_EQUATOR * Math.cos(toRad(site.lat));
  const rawX = frame.centerX + eastMeters / metersPerPixel;
  const rawY = frame.centerY - northMeters / metersPerPixel;
  const x2 = clamp$1(rawX, frame.margin, frame.width - frame.margin);
  const y2 = clamp$1(rawY, frame.margin, frame.height - frame.margin);
  return {
    x: x2,
    y: y2,
    metersPerPixel,
    clamped: x2 !== rawX || y2 !== rawY,
    // ~120px is the width of the longest pin caption in the tactical frame.
    labelSide: x2 > frame.width - 120 ? "left" : "right"
  };
};
const formatGpsCoordinate = (lat, lng) => `${Math.abs(lat).toFixed(4)}° ${lat >= 0 ? "N" : "S"}, ${Math.abs(lng).toFixed(4)}° ${lng >= 0 ? "E" : "W"}`;
const HQ_SITE = {
  lat: -6.209,
  lng: 106.8455,
  radiusMeters: 250
};
const DASHBOARD_MAP_FRAME = {
  width: 940,
  height: 600,
  centerX: 430,
  centerY: 250,
  fenceRadiusPx: 175,
  margin: 20
};
const SHIFT_A = ["EMP-8821", "EMP-9014", "EMP-7742", "EMP-4412", "EMP-6320", "EMP-5519", "EMP-3108"];
const initialsOf = (name) => name.split(" ").map((part) => part[0]).join("").toUpperCase();
const shortDepartment = (department) => department.split(" & ")[0];
const formatCheckin = (attendanceTime) => {
  const [prefix, time] = attendanceTime.split(/(\d{1,2}:\d{2}(?::\d{2})?)/);
  if (!time) return attendanceTime;
  const label = prefix.replace(/[^\w\s]/g, "").trim();
  return label ? `${label} (${time})` : `(${time})`;
};
const ZONE_DETAIL = {
  "HQ Central Hub": "Working inside office area (Zone 3 • Floor 2)",
  "Field Mobile Unit": "Assigned field itinerary • client complex",
  "South Hub": "South regional hub"
};
const buildPersonnel = (employee) => {
  if (!employee.gps) return null;
  const decision = evaluateGeofence(employee.gps, HQ_SITE);
  const metersPerPixel = HQ_SITE.radiusMeters / DASHBOARD_MAP_FRAME.fenceRadiusPx;
  const north = (employee.gps.lat - HQ_SITE.lat) * 110574;
  const east = (employee.gps.lng - HQ_SITE.lng) * 111320 * Math.cos(HQ_SITE.lat * Math.PI / 180);
  const clamp2 = (value, min, max) => Math.min(max, Math.max(min, value));
  return {
    id: employee.id,
    empId: employee.empId,
    name: employee.name,
    role: employee.role,
    department: employee.department,
    initials: initialsOf(employee.name),
    avatar: employee.avatar,
    state: employee.locationState,
    stateLabel: employee.locationDetail,
    distanceLabel: employee.distanceMeters == null ? "—" : employee.locationState === "field" ? `${(employee.distanceMeters / 1e3).toFixed(1)} km` : employee.locationState === "breach" ? `${employee.distanceMeters}m (Ext)` : `${employee.distanceMeters}m HQ`,
    distanceMeters: employee.distanceMeters ?? decision.distanceMeters,
    haversineMeters: decision.distanceMeters,
    gps: employee.gps,
    position: {
      x: clamp2(DASHBOARD_MAP_FRAME.centerX + east / metersPerPixel, DASHBOARD_MAP_FRAME.margin, DASHBOARD_MAP_FRAME.width - DASHBOARD_MAP_FRAME.margin),
      y: clamp2(DASHBOARD_MAP_FRAME.centerY - north / metersPerPixel, DASHBOARD_MAP_FRAME.margin, DASHBOARD_MAP_FRAME.height - DASHBOARD_MAP_FRAME.margin)
    },
    shift: SHIFT_A.includes(employee.id) ? "A" : "B",
    // "Present - 08:02" -> "Present (08:02)", independent of the separator glyph.
    checkinLabel: formatCheckin(employee.attendanceTime),
    zoneDetail: ZONE_DETAIL[employee.geofence] ?? employee.geofence,
    departmentLabel: shortDepartment(employee.department)
  };
};
const RAW = mockSnapshot$3.employees.map((raw) => raw);
const DISPLAY_ORDER = [
  "EMP-8821",
  "EMP-9014",
  "EMP-7742",
  "EMP-6320",
  "EMP-4412",
  "EMP-5519",
  "EMP-4389"
];
const fetchMapPersonnel = async () => {
  const projected = RAW.map(buildPersonnel).filter((entry) => entry !== null);
  projected.sort((a, b) => {
    const ai2 = DISPLAY_ORDER.indexOf(a.id);
    const bi2 = DISPLAY_ORDER.indexOf(b.id);
    return (ai2 === -1 ? 99 : ai2) - (bi2 === -1 ? 99 : bi2);
  });
  return new Promise((resolve) => setTimeout(() => resolve(projected), 80));
};
const matchesScope = (person, scope) => {
  if (scope === "all") return true;
  if (scope === "hq") return person.state === "online" || person.state === "breach";
  if (scope === "field") return person.state === "field";
  return person.shift === "A";
};
const SCOPE_LABEL = {
  all: "All Departments",
  hq: "Headquarters (HQ)",
  field: "On-Field Units",
  shift1: "Shift 1"
};
const summarizeMap = (personnel) => ({
  inside: personnel.filter((p2) => p2.state === "online").length,
  outside: personnel.filter((p2) => p2.state === "breach" || p2.state === "field").length,
  breach: personnel.filter((p2) => p2.state === "breach").length
});
const STATUS_LABEL = {
  "on-time": "On-Time",
  late: "Late",
  early: "Early",
  absent: "Absent",
  "on-leave": "On Leave"
};
const STATUS_COLOR = {
  "on-time": "var(--color-primary)",
  late: "var(--color-secondary)",
  early: "var(--color-tertiary-container)",
  absent: "var(--color-outline)",
  "on-leave": "var(--color-outline)"
};
const STATUS_CHIP_BG = {
  "on-time": "rgba(58,78,251,0.1)",
  late: "var(--color-secondary-fixed)",
  early: "rgba(212,240,41,0.15)",
  absent: "var(--color-surface-container-high)",
  "on-leave": "var(--color-surface-container-high)"
};
const GEO_LABEL = {
  verified: "Verified",
  outside: "Outside",
  unverified: "Unverified"
};
const GEO_ICON = {
  verified: "verified",
  outside: "location_off",
  unverified: "help"
};
const PLOT_LEFT = 40;
const PLOT_RIGHT = 400;
const PLOT_BASELINE = 140;
const PLOT_HEIGHT = 110;
const ON_TIME_OFFSET = 25;
const LATE_OFFSET = 41;
const LABEL_OFFSET = 35;
const DONUT_RADIUS = 40;
const DONUT_CIRCUMFERENCE = 2 * Math.PI * DONUT_RADIUS;
const barHeight = (value, scaleMax) => scaleMax <= 0 ? 0 : Math.round(value / scaleMax * PLOT_HEIGHT);
const barBaseY = (value, scaleMax) => PLOT_BASELINE - barHeight(value, scaleMax);
const isFuturePoint = (point, todayKey) => point.date > todayKey;
const pointFill = (point, todayKey) => {
  if (point.isNow) return "#3a4efb";
  return isFuturePoint(point, todayKey) ? "#dee0ff" : "#152de4";
};
const pointLateFill = (point, todayKey) => isFuturePoint(point, todayKey) ? "#dee0ff" : "#3ca9ff";
const Dashboard = () => {
  const { data, msSinceSync, serverOffsetMs, refresh } = useDashboardData();
  if (!data) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "page-container" });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    DashboardContent,
    {
      data,
      msSinceSync,
      serverOffsetMs,
      onRefresh: refresh
    }
  );
};
const DashboardContent = ({ data, msSinceSync, serverOffsetMs, onRefresh }) => {
  const navigate = useNavigate();
  const panelSearchRef = reactExports.useRef(null);
  const [personnel, setPersonnel] = reactExports.useState([]);
  const [selectedId, setSelectedId] = reactExports.useState("EMP-8821");
  const [scope, setScope] = reactExports.useState("all");
  const [mapLayer, setMapLayer] = reactExports.useState("geofence");
  const [panelTab, setPanelTab] = reactExports.useState("all");
  const [panelSearch, setPanelSearch] = reactExports.useState("");
  const [zoom, setZoom] = reactExports.useState(1);
  const [toast, setToast] = reactExports.useState(null);
  const [broadcastOpen, setBroadcastOpen] = reactExports.useState(false);
  const [broadcastTemplate, setBroadcastTemplate] = reactExports.useState("tpl-rollcall");
  const [broadcastMessage, setBroadcastMessage] = reactExports.useState("");
  const [broadcastSeverity, setBroadcastSeverity] = reactExports.useState("critical");
  const [broadcastAudience, setBroadcastAudience] = reactExports.useState("all");
  reactExports.useEffect(() => {
    let active = true;
    void fetchMapPersonnel().then((list) => {
      if (active) setPersonnel(list);
    });
    return () => {
      active = false;
    };
  }, []);
  const showToast = (message) => {
    setToast(message);
    window.setTimeout(() => setToast(null), 3e3);
  };
  const pinPosition = (person) => {
    const cx = 430;
    const cy = 250;
    return {
      left: Math.round(cx + (person.position.x - cx) * zoom),
      top: Math.round(cy + (person.position.y - cy) * zoom)
    };
  };
  const scopedPersonnel = reactExports.useMemo(
    () => personnel.filter((person) => matchesScope(person, scope)),
    [personnel, scope]
  );
  const panelPersonnel = reactExports.useMemo(() => {
    const query = panelSearch.trim().toLowerCase();
    return scopedPersonnel.filter((person) => {
      if (panelTab === "inside" && person.state !== "online") return false;
      if (panelTab === "outside" && person.state !== "breach" && person.state !== "field") return false;
      if (!query) return true;
      return person.name.toLowerCase().includes(query) || person.empId.toLowerCase().includes(query) || person.role.toLowerCase().includes(query);
    });
  }, [scopedPersonnel, panelTab, panelSearch]);
  const selectedPerson = reactExports.useMemo(
    () => personnel.find((person) => person.id === selectedId) ?? scopedPersonnel[0] ?? null,
    [personnel, scopedPersonnel, selectedId]
  );
  const mapSummary = reactExports.useMemo(() => summarizeMap(scopedPersonnel), [scopedPersonnel]);
  const todayKey = formatTimestamp(nowServer(serverOffsetMs)).slice(0, 10);
  const syncSeconds = Math.max(0, Math.round(msSinceSync / 1e3));
  const { kpi: kpi2, geo: geo2, meta: meta2 } = data;
  const chartPoints = data.weeklyAttendance;
  const chartScaleMax = Math.max(
    1,
    ...chartPoints.flatMap((p2) => [p2.onTime, p2.late])
  );
  const chartSlot = (PLOT_RIGHT - PLOT_LEFT) / Math.max(1, chartPoints.length);
  const donutTotal = data.statusBreakdown.reduce((sum, slice) => sum + slice.value, 0);
  const donutSlices = data.statusBreakdown.map((slice, index) => {
    const consumedBefore = data.statusBreakdown.slice(0, index).reduce((sum, item) => sum + item.value, 0);
    const toArc = (value) => donutTotal > 0 ? value / donutTotal * DONUT_CIRCUMFERENCE : 0;
    return {
      key: slice.key,
      colorToken: slice.colorToken,
      dasharray: `${toArc(slice.value).toFixed(1)} ${(DONUT_CIRCUMFERENCE - toArc(slice.value)).toFixed(1)}`,
      dashoffset: (-toArc(consumedBefore)).toFixed(1)
    };
  });
  const donutPresent = data.statusBreakdown.find((s) => s.key === "on-time");
  const donutPresentRate = donutTotal > 0 && donutPresent ? donutPresent.value / donutTotal * 100 : 0;
  const avgCompletion = data.attendanceSummary?.averageCompletionPercent ?? 0;
  const handleExportDailyLog = () => {
    const filename = downloadCsv(
      "vanguard-daily-log",
      data.attendanceLog.map((row) => ({
        employee_id: row.employeeId,
        name: row.name,
        check_in: formatTimestamp(row.checkInAt, serverOffsetMs),
        status: STATUS_LABEL[row.status],
        gps: GEO_LABEL[row.geoStatus],
        department: row.department,
        location: row.locationLabel,
        work_minutes: row.workDurationMinutes
      }))
    );
    void onRefresh();
    showToast(`Exported ${data.attendanceLog.length} punch records → ${filename}`);
  };
  const handleBroadcast = async (event) => {
    event.preventDefault();
    const message = broadcastMessage.trim() || broadcastTemplates()[0]?.message || "";
    await sendBroadcast({
      message,
      severity: broadcastSeverity,
      audience: broadcastAudience
    });
    setBroadcastOpen(false);
    setBroadcastMessage("");
    showToast("Broadcast alert dispatched to the selected audience");
  };
  const renderLogRow = (emp) => /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("td", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", alignItems: "center", gap: 10 }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "div",
        {
          style: {
            width: 32,
            height: 32,
            borderRadius: "50%",
            background: "var(--color-primary-fixed)",
            color: "var(--color-on-primary-fixed)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontWeight: 700,
            fontSize: "var(--fs-label-sm)",
            flexShrink: 0
          },
          children: emp.initials
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            style: {
              fontWeight: 600,
              fontSize: "var(--fs-body-sm)",
              color: "var(--color-on-surface)"
            },
            children: emp.name
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: 11, color: "var(--color-outline)" }, children: emp.employeeId })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("td", { style: { fontFamily: "var(--font-body)", fontFeatureSettings: '"tnum" 1' }, children: formatTimestamp(emp.checkInAt, serverOffsetMs) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("td", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      "span",
      {
        style: {
          display: "inline-flex",
          alignItems: "center",
          gap: 4,
          padding: "2px 8px",
          borderRadius: "var(--radius-full)",
          background: STATUS_CHIP_BG[emp.status],
          color: STATUS_COLOR[emp.status],
          fontSize: "var(--fs-label-sm)",
          fontWeight: 600
        },
        children: STATUS_LABEL[emp.status]
      }
    ) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("td", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "span",
      {
        style: {
          display: "inline-flex",
          alignItems: "center",
          gap: 4,
          fontSize: "var(--fs-label-sm)",
          fontWeight: 600,
          color: emp.geoStatus === "verified" ? "var(--color-primary)" : "var(--color-secondary)"
        },
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "material-symbols-outlined", style: { fontSize: 14 }, children: GEO_ICON[emp.geoStatus] }),
          GEO_LABEL[emp.geoStatus]
        ]
      }
    ) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("td", { style: { color: "var(--color-on-surface-variant)" }, children: emp.department }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("td", { style: { fontSize: "var(--fs-body-sm)", color: "var(--color-on-surface-variant)" }, children: emp.locationLabel }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "td",
      {
        style: {
          fontFamily: "var(--font-body)",
          fontFeatureSettings: '"tnum" 1',
          fontWeight: 500
        },
        children: formatDuration(emp.workDurationMinutes)
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx("td", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      "button",
      {
        className: "btn",
        style: {
          padding: "4px 10px",
          background: "var(--color-surface-container)",
          color: "var(--color-on-surface)",
          fontSize: "var(--fs-label-sm)"
        },
        children: "View"
      }
    ) })
  ] }, emp.employeeId);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "page-container", children: [
    toast && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "toast-notice", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "material-symbols-outlined icon-md", style: { color: "var(--color-tertiary-fixed)" }, children: "check_circle" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: toast })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "dash-banner card", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "dash-banner-left", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "dash-banner-title-row", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "dash-title", children: "Good morning, Admin" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "chip chip-secondary", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "material-symbols-outlined icon-sm", style: { color: "var(--color-secondary-container)" }, children: "schedule" }),
            formatLongDate(nowServer(serverOffsetMs)),
            " • Shift ",
            meta2.shift.code,
            " (",
            meta2.shift.start,
            " - ",
            meta2.shift.end,
            ")"
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "dash-subtitle", children: "Here's today's real-time attendance telemetry & distributed workforce deployment." }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "dash-filter-chips", children: Object.keys(SCOPE_LABEL).map((option) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            className: `filter-chip ${scope === option ? "active" : ""}`,
            type: "button",
            onClick: () => {
              setScope(option);
              setPanelTab("all");
            },
            children: [
              SCOPE_LABEL[option],
              scope === option && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "filter-chip-dot" })
            ]
          },
          option
        )) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "dash-banner-actions", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: "btn btn-secondary", type: "button", onClick: handleExportDailyLog, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "material-symbols-outlined icon-sm", style: { color: "var(--color-secondary)" }, children: "file_download" }),
          "Export Daily Log"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: "btn btn-primary", type: "button", onClick: () => setBroadcastOpen(true), children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "material-symbols-outlined icon-sm", children: "campaign" }),
          "Broadcast Alert"
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "dash-kpi-grid", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "kpi-card card", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "kpi-card-header", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "kpi-label", children: "Total Employees" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "kpi-icon-box", style: { background: "var(--color-secondary-fixed)", color: "var(--color-on-secondary-fixed)" }, children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "material-symbols-outlined icon-md", children: "group" }) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "kpi-metric", children: formatCount(kpi2.totalEmployees.value) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "kpi-trend trend-up", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "material-symbols-outlined icon-sm", children: "trending_up" }),
          kpi2.totalEmployees.delta > 0 ? "+" : "",
          formatCount(kpi2.totalEmployees.delta),
          " this month"
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "kpi-card card", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "kpi-card-header", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "kpi-label", children: "Present Today" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "kpi-icon-box", style: { background: "var(--color-surface-container-high)", color: "var(--color-primary)" }, children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "material-symbols-outlined icon-md", children: "check_circle" }) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "kpi-metric", children: formatCount(kpi2.presentToday.value) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "kpi-trend-row", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "chip chip-live", style: { fontSize: "var(--fs-label-sm)" }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "live-dot", style: { width: 6, height: 6 } }),
            formatPercent(kpi2.presentToday.ratePercent, 2)
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "kpi-vs", style: { color: "var(--color-on-surface-variant)" }, children: [
            formatSignedPercent(kpi2.presentToday.vsYesterdayPercent),
            " vs y'day"
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "kpi-card card", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "kpi-card-header", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "kpi-label", children: "Late Today" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "kpi-icon-box", style: { background: "var(--color-surface-container)", color: "var(--color-secondary)" }, children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "material-symbols-outlined icon-md", children: "alarm_on" }) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "kpi-metric", children: formatCount(kpi2.lateToday.value) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "kpi-trend", style: { color: "var(--color-secondary)" }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "material-symbols-outlined icon-sm", children: "arrow_drop_down" }),
          kpi2.lateToday.deltaFromYesterday > 0 ? "+" : "",
          formatCount(kpi2.lateToday.deltaFromYesterday),
          " from yesterday (",
          formatPercent(kpi2.lateToday.sharePercent),
          ")"
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "kpi-card card", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "kpi-card-header", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "kpi-label", children: "Absent Today" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "kpi-icon-box", style: { background: "var(--color-surface-container-highest)", color: "var(--color-outline)" }, children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "material-symbols-outlined icon-md", children: "person_off" }) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "kpi-metric", children: formatCount(kpi2.absentToday.value) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "kpi-sub", children: [
          formatCount(kpi2.absentToday.approved),
          " approved, ",
          formatCount(kpi2.absentToday.unexcused),
          " unexcused"
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "kpi-card card kpi-card-dark", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "kpi-card-header", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "kpi-label", style: { color: "var(--color-surface-dim)" }, children: "Currently Working" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "kpi-icon-box", style: { background: "rgba(255,255,255,0.1)", color: "var(--color-tertiary-fixed)" }, children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "material-symbols-outlined icon-md", children: "sensors" }) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "kpi-metric", style: { color: "var(--color-inverse-on-surface)" }, children: formatCount(kpi2.currentlyWorking.value) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "kpi-trend-row", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { style: {
          display: "inline-flex",
          alignItems: "center",
          gap: 6,
          padding: "2px 8px",
          borderRadius: "var(--radius-full)",
          background: "rgba(255,255,255,0.1)",
          color: "var(--color-tertiary-fixed)",
          fontSize: "var(--fs-label-sm)",
          fontWeight: 600
        }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "animate-pulse", style: {
            width: 8,
            height: 8,
            borderRadius: "50%",
            background: "var(--color-tertiary-fixed)",
            display: "inline-block"
          } }),
          formatCount(kpi2.currentlyWorking.value),
          " Active Now"
        ] }) })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "dash-main-grid", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "dash-map-card card", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "dash-map-header", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "dash-map-title-row", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "dash-section-title", children: "Live Employee Monitoring" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "chip chip-live", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "live-dot", style: { width: 6, height: 6 } }),
              "LIVE"
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "dash-geofence-label chip chip-secondary", children: [
            "HQ Geofence Active (Radius ",
            formatCount(geo2.geofenceRadiusMeters),
            "m)"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "dash-map-layer-toggle", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                className: `layer-btn ${mapLayer === "geofence" ? "active" : ""}`,
                type: "button",
                onClick: () => setMapLayer("geofence"),
                children: "Geofence"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                className: `layer-btn ${mapLayer === "heatmap" ? "active" : ""}`,
                type: "button",
                onClick: () => setMapLayer("heatmap"),
                children: "Heatmap"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                className: `layer-btn ${mapLayer === "traffic" ? "active" : ""}`,
                type: "button",
                onClick: () => setMapLayer("traffic"),
                children: "Traffic"
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "dash-map-canvas", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("svg", { className: "dash-map-bg", xmlns: "http://www.w3.org/2000/svg", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("defs", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("pattern", { id: "map-grid", width: "60", height: "60", patternUnits: "userSpaceOnUse", children: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M 60 0 L 0 0 0 60", fill: "none", stroke: "var(--color-surface-container-high)", strokeWidth: "0.75" }) }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("rect", { width: "100%", height: "100%", fill: "url(#map-grid)" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M -50 180 L 900 240", fill: "none", stroke: "var(--color-surface-variant)", strokeWidth: "24" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M 280 -20 L 410 600", fill: "none", stroke: "var(--color-surface-variant)", strokeWidth: "28" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M 120 450 C 300 420, 520 480, 850 380", fill: "none", stroke: "var(--color-surface-variant)", strokeWidth: "18" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M 520 -40 L 590 600", fill: "none", stroke: "var(--color-surface-container-high)", strokeWidth: "14" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("polygon", { points: "340,190 480,180 500,280 360,300", fill: "#cfe5ff", fillOpacity: "0.6", stroke: "var(--color-secondary-container)", strokeWidth: "2" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("polygon", { points: "495,290 560,285 550,350 485,355", fill: "#edecff", fillOpacity: "0.8", stroke: "var(--color-primary-container)", strokeWidth: "1.5" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("polygon", { points: "260,220 310,215 300,270 250,275", fill: "#edecff", fillOpacity: "0.7", stroke: "var(--color-surface-variant)", strokeWidth: "1.5" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { cx: "430", cy: "250", r: "175", fill: "var(--color-secondary-container)", fillOpacity: "0.08", stroke: "var(--color-primary)", strokeWidth: "2", strokeDasharray: "8 6", opacity: mapLayer === "traffic" ? 0.35 : 1 }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { cx: "430", cy: "250", r: "177", fill: "none", stroke: "var(--color-tertiary-fixed)", strokeWidth: "1", strokeDasharray: "2 8", opacity: "0.6" }),
            mapLayer === "heatmap" && personnel.map((person) => /* @__PURE__ */ jsxRuntimeExports.jsx(
              "circle",
              {
                cx: person.position.x,
                cy: person.position.y,
                r: "70",
                fill: person.state === "breach" ? "#ba1a1a" : "var(--color-primary)",
                fillOpacity: "0.18",
                style: { filter: "blur(14px)" }
              },
              `heat-${person.id}`
            )),
            mapLayer === "traffic" && /* @__PURE__ */ jsxRuntimeExports.jsxs("g", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M -50 180 L 900 240", fill: "none", stroke: "#ba1a1a", strokeWidth: "24", opacity: "0.25" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M 280 -20 L 410 600", fill: "none", stroke: "#d4f029", strokeWidth: "28", opacity: "0.22" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M 120 450 C 300 420, 520 480, 850 380", fill: "none", stroke: "#d4f029", strokeWidth: "18", opacity: "0.22" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M 520 -40 L 590 600", fill: "none", stroke: "#ba1a1a", strokeWidth: "14", opacity: "0.25" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("text", { x: "520", y: "210", fill: "var(--color-error)", fontSize: "12", fontWeight: "700", textAnchor: "middle", children: "Congested" })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "map-telemetry-overlay", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "span",
              {
                className: "map-telemetry-chip",
                style: {
                  background: "var(--color-surface-container-high)",
                  color: "var(--color-primary)",
                  cursor: "pointer",
                  outline: panelTab === "inside" ? "2px solid var(--color-primary)" : "none"
                },
                onClick: () => setPanelTab(panelTab === "inside" ? "all" : "inside"),
                title: `${mapSummary.inside} node(s) currently inside — click to filter`,
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { width: 8, height: 8, borderRadius: "50%", background: "var(--color-primary)", display: "inline-block" } }),
                  formatCount(geo2.insideGeofence),
                  " Inside Geofence"
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "span",
              {
                className: "map-telemetry-chip",
                style: {
                  background: "var(--color-secondary-fixed)",
                  color: "var(--color-on-secondary-fixed)",
                  cursor: "pointer",
                  outline: panelTab === "outside" ? "2px solid var(--color-secondary)" : "none"
                },
                onClick: () => setPanelTab(panelTab === "outside" ? "all" : "outside"),
                title: `${mapSummary.outside} node(s) outside the perimeter — click to filter`,
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { width: 8, height: 8, borderRadius: "50%", background: "var(--color-secondary)", display: "inline-block" } }),
                  formatCount(geo2.outsidePerimeter),
                  " Outside Perimeter"
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "span",
              {
                className: "map-telemetry-chip",
                style: {
                  background: "var(--color-surface-container)",
                  color: "var(--color-on-surface-variant)",
                  cursor: "pointer",
                  outline: panelTab === "all" && scope === "all" ? "none" : "2px solid var(--color-tertiary-fixed-dim)"
                },
                onClick: () => {
                  setPanelTab("all");
                  setScope("all");
                },
                title: `${mapSummary.breach} active breach alert(s) in the current scope`,
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "material-symbols-outlined", style: { fontSize: 14, color: "var(--color-tertiary-fixed-dim)" }, children: "verified" }),
                  formatCount(geo2.breach),
                  " Breach Alerts"
                ]
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "map-zoom-controls", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "map-ctrl-btn", title: "Zoom In", type: "button", onClick: () => setZoom((z2) => Math.min(2, Number((z2 + 0.25).toFixed(2)))), children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "material-symbols-outlined icon-sm", children: "add" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "map-ctrl-divider" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "map-ctrl-btn", title: "Zoom Out", type: "button", onClick: () => setZoom((z2) => Math.max(1, Number((z2 - 0.25).toFixed(2)))), children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "material-symbols-outlined icon-sm", children: "remove" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "map-ctrl-divider" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "map-ctrl-btn", title: "Recenter", type: "button", onClick: () => {
              setZoom(1);
              showToast("Map recentered on Vanguard Central HQ");
            }, children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "material-symbols-outlined icon-sm", children: "my_location" }) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "map-hq-beacon", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "map-hq-dot" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "map-hq-label", children: "HQ HUB" })
          ] }),
          personnel.filter((person) => person.state !== "field").map((person) => {
            const spot = pinPosition(person);
            const isSelected = selectedPerson?.id === person.id;
            const inScope = scopedPersonnel.some((p2) => p2.id === person.id);
            return /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                className: `map-pin ${isSelected ? "selected" : ""}`,
                style: {
                  left: spot.left,
                  top: spot.top,
                  opacity: inScope ? 1 : 0.35,
                  cursor: "pointer"
                },
                onClick: () => setSelectedId(person.id),
                children: [
                  isSelected && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "map-pin-ping animate-ping" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `map-pin-avatar ${person.state === "breach" ? "outside" : "primary"}${isSelected ? "" : " sm"}`, children: person.initials }),
                  isSelected ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "map-pin-card", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "map-pin-card-header", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { color: "var(--color-tertiary-fixed)", fontWeight: 700, fontSize: "var(--fs-label-sm)" }, children: person.name }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontSize: 10, color: "var(--color-surface-dim)" }, children: person.distanceLabel })
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { fontSize: 11, color: "var(--color-surface-dim)" }, children: [
                      person.role,
                      " • ",
                      person.empId
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", alignItems: "center", gap: 4, marginTop: 4, fontSize: 10, color: "var(--color-on-tertiary-container)" }, children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { width: 6, height: 6, borderRadius: "50%", background: "var(--color-tertiary-fixed)", display: "inline-block" } }),
                      person.stateLabel
                    ] })
                  ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "map-pin-tooltip", children: [
                    person.name,
                    " (",
                    person.departmentLabel,
                    ") • ",
                    person.distanceLabel
                  ] })
                ]
              },
              person.id
            );
          })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "dash-emp-panel card", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "emp-panel-header", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", alignItems: "center", gap: 8 }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "dash-section-title", children: "Active Employees" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: {
              padding: "2px 8px",
              borderRadius: "var(--radius-full)",
              background: "var(--color-surface-container)",
              color: "var(--color-primary)",
              fontFamily: "var(--font-body)",
              fontSize: "var(--fs-label-sm)",
              fontWeight: 600
            }, children: "87" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "icon-btn", type: "button", title: "Focus Search", onClick: () => panelSearchRef.current?.focus(), children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "material-symbols-outlined icon-md", children: "tune" }) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", style: { position: "relative" }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "material-symbols-outlined", style: {
            position: "absolute",
            left: 12,
            top: "50%",
            transform: "translateY(-50%)",
            color: "var(--color-outline)",
            fontSize: 20,
            pointerEvents: "none"
          }, children: "search" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "input",
            {
              ref: panelSearchRef,
              className: "input",
              type: "text",
              placeholder: "Search employee or ID...",
              style: { paddingLeft: 40 },
              value: panelSearch,
              onChange: (e) => setPanelSearch(e.target.value)
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "emp-panel-tabs", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: `emp-tab ${panelTab === "all" ? "active" : ""}`, type: "button", onClick: () => setPanelTab("all"), children: "All (87)" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: `emp-tab ${panelTab === "inside" ? "active" : ""}`, type: "button", onClick: () => setPanelTab("inside"), children: "Inside (82)" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: `emp-tab ${panelTab === "outside" ? "active" : ""}`, type: "button", onClick: () => setPanelTab("outside"), children: "Outside (5)" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "emp-selected-card", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "emp-selected-header", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", alignItems: "center", gap: 12 }, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "img",
                {
                  src: selectedPerson?.avatar ?? "",
                  alt: selectedPerson?.name ?? "",
                  style: { width: 44, height: 44, borderRadius: "50%", objectFit: "cover", border: "2px solid var(--color-tertiary-fixed)" },
                  onError: (e) => {
                    e.target.style.display = "none";
                  }
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontFamily: "var(--font-heading)", fontSize: "var(--fs-title-md)", fontWeight: 700, color: "var(--color-inverse-on-surface)" }, children: selectedPerson?.name ?? "—" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { fontSize: "var(--fs-body-sm)", color: "var(--color-surface-dim)" }, children: [
                  selectedPerson?.role,
                  " • ",
                  selectedPerson?.empId
                ] })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "chip chip-live", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "animate-pulse", style: { width: 6, height: 6, borderRadius: "50%", background: "var(--color-tertiary-fixed)", display: "inline-block" } }),
              "LIVE"
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "emp-selected-grid", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "emp-field-label", children: "Check-in Status" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { color: "var(--color-tertiary-fixed)", fontWeight: 600, fontSize: "var(--fs-label-md)" }, children: selectedPerson?.checkinLabel ?? "—" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "emp-field-label", children: "Distance to HQ" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { color: "var(--color-inverse-on-surface)", fontFamily: "var(--font-body)", fontWeight: 500, fontSize: "var(--fs-label-md)" }, children: selectedPerson ? `${selectedPerson.distanceMeters} meters` : "—" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { gridColumn: "1/-1" }, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "emp-field-label", children: "Live Position Telemetry" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: "var(--fs-body-sm)", color: "var(--color-surface-dim)" }, children: selectedPerson?.zoneDetail ?? "—" })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: 4 }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { style: { fontSize: "var(--fs-label-sm)", color: "var(--color-surface-dim)", display: "flex", alignItems: "center", gap: 4 }, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "material-symbols-outlined", style: { fontSize: 14, color: "var(--color-tertiary-fixed)" }, children: "sensors" }),
              "Pinged 10s ago"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", gap: 8 }, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  className: "btn",
                  style: { padding: "4px 10px", background: "rgba(255,255,255,0.1)", color: "var(--color-inverse-on-surface)", fontSize: "var(--fs-label-sm)" },
                  type: "button",
                  onClick: () => selectedPerson && navigate(`/employees?q=${encodeURIComponent(selectedPerson.empId)}`),
                  children: "Details"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "button",
                {
                  className: "btn btn-primary-container",
                  style: { padding: "4px 10px", fontSize: "var(--fs-label-sm)" },
                  type: "button",
                  onClick: () => selectedPerson && showToast(`Focused on ${selectedPerson.name} at ${selectedPerson.gps.lat.toFixed(4)}, ${selectedPerson.gps.lng.toFixed(4)}`),
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "material-symbols-outlined", style: { fontSize: 14 }, children: "my_location" }),
                    "Focus"
                  ]
                }
              )
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "emp-list", children: panelPersonnel.filter((person) => person.id !== selectedPerson?.id).map((person) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "emp-list-item",
            onClick: () => setSelectedId(person.id),
            title: "Show on map",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", alignItems: "center", gap: 10, minWidth: 0 }, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `emp-list-avatar ${person.state !== "online" ? "secondary" : "primary"}`, children: person.initials }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { minWidth: 0 }, children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: "var(--fs-label-md)", fontWeight: 600, color: "var(--color-on-surface)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }, children: person.name }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { fontSize: 11, color: person.state !== "online" ? "var(--color-secondary)" : "var(--color-on-surface-variant)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }, children: [
                    person.department,
                    " • ",
                    person.checkinLabel
                  ] })
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "emp-dist-chip", style: {
                background: person.state !== "online" ? "var(--color-secondary-fixed)" : "var(--color-surface-container-high)",
                color: person.state !== "online" ? "var(--color-secondary)" : "var(--color-primary)"
              }, children: person.distanceLabel })
            ]
          },
          person.id
        )) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: "emp-view-all-btn", type: "button", onClick: () => navigate("/live-monitoring"), children: [
          "View All 87 Active Telemetries",
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "material-symbols-outlined icon-md", children: "arrow_forward" })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "dash-analytics-grid", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "card dash-chart-card", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "dash-chart-header", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "dash-section-title", style: { fontSize: "var(--fs-title-md)" }, children: "Weekly Attendance Dynamics" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { style: { fontSize: "var(--fs-body-sm)", color: "var(--color-on-surface-variant)", marginTop: 4 }, children: "Comparative rates across 5 workdays" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "dash-chart-period-toggle", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "period-btn", type: "button", children: "Day" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "period-btn active", type: "button", children: "Week" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "period-btn", type: "button", children: "Month" })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "dash-bar-chart", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("svg", { width: "100%", height: "160", viewBox: "0 0 420 160", fill: "none", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("line", { x1: "40", x2: "400", y1: "20", y2: "20", stroke: "#edecff", strokeDasharray: "4 4", strokeWidth: "1" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("line", { x1: "40", x2: "400", y1: "60", y2: "60", stroke: "#edecff", strokeDasharray: "4 4", strokeWidth: "1" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("line", { x1: "40", x2: "400", y1: "100", y2: "100", stroke: "#edecff", strokeDasharray: "4 4", strokeWidth: "1" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("line", { x1: "40", x2: "400", y1: "140", y2: "140", stroke: "#dee0ff", strokeWidth: "1" }),
          chartPoints.map((point, index) => {
            const slotLeft = PLOT_LEFT + chartSlot * index;
            const labelX = slotLeft + LABEL_OFFSET;
            return /* @__PURE__ */ jsxRuntimeExports.jsxs(React.Fragment, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "rect",
                {
                  x: slotLeft + ON_TIME_OFFSET,
                  y: barBaseY(point.onTime, chartScaleMax),
                  width: 14,
                  height: barHeight(point.onTime, chartScaleMax),
                  rx: 3,
                  fill: pointFill(point, todayKey)
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "rect",
                {
                  x: slotLeft + LATE_OFFSET,
                  y: barBaseY(point.late, chartScaleMax),
                  width: 10,
                  height: barHeight(point.late, chartScaleMax),
                  rx: 2,
                  fill: pointLateFill(point, todayKey)
                }
              ),
              point.isNow && /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { cx: slotLeft + ON_TIME_OFFSET + 7, cy: 30, r: 3, fill: "#b9d300" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "text",
                {
                  x: labelX,
                  y: 155,
                  textAnchor: "middle",
                  fill: point.isNow ? "#161a33" : "#757688",
                  fontSize: "11",
                  fontFamily: "Inter",
                  fontWeight: point.isNow ? 600 : 400,
                  children: point.isNow ? `${point.label} (Now)` : point.label
                }
              )
            ] }, point.date);
          })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "dash-chart-legend", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", alignItems: "center", gap: 16 }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { style: { display: "flex", alignItems: "center", gap: 6, fontSize: "var(--fs-label-sm)" }, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { width: 12, height: 12, borderRadius: 2, background: "var(--color-primary)", display: "inline-block" } }),
              "On-Time Present"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { style: { display: "flex", alignItems: "center", gap: 6, fontSize: "var(--fs-label-sm)", color: "var(--color-on-surface-variant)" }, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { width: 12, height: 12, borderRadius: 2, background: "var(--color-secondary-container)", display: "inline-block" } }),
              "Late Arrivals"
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { style: { fontFamily: "var(--font-body)", fontSize: "var(--fs-label-sm)", color: "var(--color-secondary)", fontWeight: 500 }, children: [
            "Avg. ",
            formatPercent(avgCompletion),
            " Completion"
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "card dash-donut-card", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "dash-section-title", style: { fontSize: "var(--fs-title-md)" }, children: "Status Breakdown" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { style: { fontSize: "var(--fs-body-sm)", color: "var(--color-on-surface-variant)", marginTop: 4 }, children: "Daily head-count distribution" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "dash-donut-wrap", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("svg", { width: "144", height: "144", viewBox: "0 0 100 100", style: { transform: "rotate(-90deg)" }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { cx: "50", cy: "50", r: "40", fill: "none", stroke: "#f4f2ff", strokeWidth: "12" }),
            donutSlices.map((slice) => /* @__PURE__ */ jsxRuntimeExports.jsx(
              "circle",
              {
                cx: "50",
                cy: "50",
                r: "40",
                fill: "none",
                stroke: slice.colorToken,
                strokeWidth: "12",
                strokeDasharray: slice.dasharray,
                strokeDashoffset: slice.dashoffset
              },
              slice.key
            ))
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "dash-donut-center", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontFamily: "var(--font-heading)", fontSize: 28, fontWeight: 700, color: "var(--color-on-surface)", lineHeight: 1 }, children: formatPercent(donutPresentRate, 1, "floor") }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontSize: "var(--fs-label-sm)", textTransform: "uppercase", color: "var(--color-outline)", letterSpacing: "0.05em", marginTop: 2 }, children: "Present" })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "dash-donut-legend", children: data.statusBreakdown.map((r2) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", alignItems: "center", justifyContent: "space-between" }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { style: { display: "flex", alignItems: "center", gap: 6, fontSize: "var(--fs-body-sm)", color: "var(--color-on-surface-variant)" }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { width: 10, height: 10, borderRadius: "50%", background: r2.colorToken, display: "inline-block" } }),
            r2.label
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontFamily: "var(--font-body)", fontSize: "var(--fs-label-sm)", fontWeight: 600, color: "var(--color-on-surface)", fontFeatureSettings: '"tnum" 1' }, children: formatCount(r2.value) })
        ] }, r2.label)) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "card dash-shift-card", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "dash-section-title", style: { fontSize: "var(--fs-title-md)" }, children: "Shift Coverage" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { style: { fontSize: "var(--fs-body-sm)", color: "var(--color-on-surface-variant)", marginTop: 4 }, children: "Department workforce deployment today" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "dash-shift-list", children: data.shiftCoverage.map((s) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "shift-row", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 4 }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontSize: "var(--fs-body-sm)", color: "var(--color-on-surface)", fontWeight: 500 }, children: s.department }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { style: { fontFamily: "var(--font-body)", fontSize: "var(--fs-label-sm)", fontWeight: 600, color: "var(--color-on-surface)", fontFeatureSettings: '"tnum" 1' }, children: [
              s.present,
              "/",
              s.total
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "shift-bar-track", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "shift-bar-fill", style: { width: `${s.present / s.total * 100}%`, background: s.colorToken } }) })
        ] }, s.department)) })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "card dash-table-card", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { padding: "var(--space-md)", display: "flex", alignItems: "center", justifyContent: "space-between" }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "dash-section-title", style: { fontSize: "var(--fs-title-md)" }, children: "Today's Attendance Log" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { style: { fontSize: "var(--fs-body-sm)", color: "var(--color-on-surface-variant)", marginTop: 2 }, children: [
            "Real-time check-in/out telemetry feed — Last sync: ",
            syncSeconds,
            "s ago"
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: "btn btn-secondary", style: { gap: 6 }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "material-symbols-outlined icon-sm", children: "file_download" }),
          "Export"
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { overflowX: "auto" }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { children: "Employee" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { children: "Check-in" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { children: "Status" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { children: "GPS Verified" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { children: "Dept" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { children: "Location" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { children: "Work Duration" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { children: "Actions" })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: data.attendanceLog.map(renderLogRow) })
      ] }) })
    ] }),
    broadcastOpen && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "emp-modal-backdrop", onClick: () => setBroadcastOpen(false), children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "emp-modal-card", onClick: (e) => e.stopPropagation(), children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "emp-modal-header", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "emp-modal-title", children: "Broadcast Alert" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", className: "telemetry-tool-btn", onClick: () => setBroadcastOpen(false), children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "material-symbols-outlined icon-md", children: "close" }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleBroadcast, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "emp-modal-body", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "emp-form-group", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "emp-form-label", children: "Template" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "select",
              {
                className: "emp-form-select",
                value: broadcastTemplate,
                onChange: (e) => {
                  setBroadcastTemplate(e.target.value);
                  const found = broadcastTemplates().find((t2) => t2.id === e.target.value);
                  if (found) {
                    setBroadcastMessage(found.message);
                    setBroadcastSeverity(
                      found.severity === "critical" ? "critical" : found.severity === "warning" ? "warning" : "info"
                    );
                  }
                },
                children: broadcastTemplates().map((template) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: template.id, children: template.label }, template.id))
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "emp-form-group", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "emp-form-label", children: "Message" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "textarea",
              {
                className: "emp-form-input",
                rows: 3,
                placeholder: "Compose the alert broadcast to personnel...",
                value: broadcastMessage,
                onChange: (e) => setBroadcastMessage(e.target.value)
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "emp-form-group", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "emp-form-label", children: "Severity" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "select",
              {
                className: "emp-form-select",
                value: broadcastSeverity,
                onChange: (e) => setBroadcastSeverity(e.target.value),
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "critical", children: "Critical — immediate action" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "warning", children: "Warning — advisory" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "info", children: "Informational" })
                ]
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "emp-form-group", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "emp-form-label", children: "Audience" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "select",
              {
                className: "emp-form-select",
                value: broadcastAudience,
                onChange: (e) => setBroadcastAudience(e.target.value),
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "all", children: "All personnel (87)" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "hq", children: "Headquarters only (82)" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "field", children: "Field units only (5)" })
                ]
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "emp-modal-footer", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", className: "btn btn-secondary", onClick: () => setBroadcastOpen(false), children: "Cancel" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { type: "submit", className: "btn btn-primary", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "material-symbols-outlined icon-sm", children: "campaign" }),
            "Dispatch Alert"
          ] })
        ] })
      ] })
    ] }) })
  ] });
};
const meta$1 = {
  generatedAt: "2024-10-24T10:45:00+07:00",
  nodesOnline: 108,
  pollingSeconds: 5,
  geofenceRadiusMeters: 250,
  activeGeofences: 3,
  totalLiveUnits: 87,
  insideCount: 82,
  outsideCount: 5,
  flaggedCount: 2,
  verifiedFieldCount: 1,
  liveBreachAlerts: 5,
  hqCapacityUsed: 82,
  hqCapacityTotal: 100,
  fleetEfficiencyPercent: 98.4,
  gpsDriftMeters: 2.8
};
const sites$1 = [
  {
    id: "hq",
    name: "Vanguard Central HQ",
    lat: -6.209,
    lng: 106.8455,
    radiusMeters: 250,
    frame: {
      centerX: 460,
      centerY: 380,
      fenceRadiusPx: 180
    }
  },
  {
    id: "hub-2",
    name: "North Logistics Hub",
    lat: -6.2057,
    lng: 106.856,
    radiusMeters: 150,
    frame: {
      centerX: 740,
      centerY: 180,
      fenceRadiusPx: 85
    }
  },
  {
    id: "client-complex",
    name: "Authorized Client Complex",
    lat: -6.212015,
    lng: 106.85052,
    radiusMeters: 300,
    frame: {
      centerX: 860,
      centerY: 620,
      fenceRadiusPx: 60
    }
  }
];
const entities = [
  {
    id: "1",
    empId: "EMP-8821",
    name: "Ahmad Rahman",
    role: "Senior Systems Engineer",
    dept: "IT & Infrastructure",
    avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuAEsqnEAzUM1cLRv4sKJNy6rP7utUIXqOlkJhws5EepCWosnsXamgk7UDYWlNt8yuPuOQVWgzIKdn9GzImee5BoGH99_mfPnMneJY9sCUqIlSQoUNjTKTnVitFHQNRj2bB1ogRxFa0FIfaKOdbHt6M0HtPA-wHMo1JYyIpcMpghX9oHoK2XEcXEXtRVZoqwyBO32noWBLU2feWHPfUWmBO1lz4wekNrSrl3stgONUk",
    siteId: "hq",
    statusType: "inside",
    statusLabel: "Active Target",
    checkinTime: "08:02 AM",
    isTarget: true,
    distanceLabel: "85m",
    gps: {
      lat: -6.20856,
      lng: 106.845249,
      accuracy: 3.2
    },
    accuracyLabel: "High (±3.2m)",
    battery: "84% (Fast)",
    network: "5G • Android 14",
    complianceZone: "Floor 2, Server Room Zone B",
    complianceSub: "85m from central base beacon",
    timeline: [
      {
        time: "08:02 AM",
        title: "Gate 1 Check-In",
        detail: "RFID Turnstile Verified"
      },
      {
        time: "08:05 AM",
        title: "Entered IT Dept Zone",
        detail: "Beacon ID #B-201 Handshake",
        dotClass: "step-2"
      },
      {
        time: "10:15 AM",
        title: "Break Lounge (Inside HQ)",
        detail: "Zone C Presence logged",
        dotClass: "step-3"
      },
      {
        time: "10:45 AM",
        title: "Workstation Active",
        detail: "Currently stationed at Desk B-14",
        dotClass: "step-4"
      }
    ]
  },
  {
    id: "2",
    empId: "EMP-9014",
    name: "Budi Setiawan",
    role: "Sr UI/UX Designer",
    dept: "Product Design",
    avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuBZ5kWLtqA2yE6C11cG864SHILDQICLMfPEiCutylkcc_H1hGqrmjQjrfFEhwAgpz5EMMu92Z5jnzK7GQlyggrOtaFm61ZaQp5dhRUj_rrI7iEGjuWwEHROtxiFssBIMI6ibI9216tRDs3T_R9ZgtXikKx3byulbkC8JbrKzFR2sqH-YiYdg3jSkN6fqO-oHW28QQBdiKuITcxpgfmxuDXamoYJKY4gP3CYIdwYNfk",
    siteId: "hq",
    statusType: "inside",
    statusLabel: "Inside Perimeter",
    checkinTime: "08:07 AM",
    distanceLabel: "120m",
    gps: {
      lat: -6.210005,
      lng: 106.846504,
      accuracy: 2.8
    },
    accuracyLabel: "High (±2.8m)",
    battery: "92%",
    network: "5G • Android 14",
    complianceZone: "Design Studio 3B",
    complianceSub: "120m from central base beacon",
    timeline: [
      {
        time: "08:07 AM",
        title: "Main Turnstile Pass",
        detail: "Biometric Facial Verified"
      },
      {
        time: "08:12 AM",
        title: "Design Lab Check-In",
        detail: "Zone A Beacon Handshake",
        dotClass: "step-2"
      },
      {
        time: "11:00 AM",
        title: "Creative Session",
        detail: "Design Hub Room 4",
        dotClass: "step-4"
      }
    ]
  },
  {
    id: "3",
    empId: "EMP-7742",
    name: "Dimas Pratama",
    role: "Marketing Specialist",
    dept: "Marketing & Growth",
    avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuCpZ4xBKoiH1ZahEaemutRsE0hC9Vu_t8O15YjsZDZ-FOoP3V4PU9lJETUpWYkRMxtnDlZYCu208HsgZwcTyTEyaA2ud3lfKwKKLcjSJehRMc1fUzpAdB66S-BzlfnTKpKQZOw7kC4z9gA2aAdFR6RI2QHdIQro4SpW1IHn0oTI3uBtgeFT9id_uUa6NRHUMWL2zmqUaggBK-7g2TcqZMP3GWIPH6TU0lbMt2Rqtcw",
    siteId: "hq",
    statusType: "breach",
    statusLabel: "Breach Alert",
    checkinTime: "08:24 AM",
    distanceLabel: "410m",
    gps: {
      lat: -6.20787,
      lng: 106.842613,
      accuracy: 4.1
    },
    accuracyLabel: "Degraded (±4.1m)",
    battery: "67%",
    network: "4G LTE • Android 13",
    complianceZone: "Outside Permitted Zone",
    complianceSub: "410m outside assigned HQ fence radius",
    timeline: [
      {
        time: "08:24 AM",
        title: "Perimeter Boundary Exit",
        detail: "Geofence Breach Event Triggered"
      },
      {
        time: "08:35 AM",
        title: "GPS Drift Anomaly",
        detail: "Outer Zone Telemetry Polled",
        dotClass: "step-2"
      },
      {
        time: "10:40 AM",
        title: "Active Alert Flagged",
        detail: "Pending HR Supervisor Review",
        dotClass: "step-4"
      }
    ]
  },
  {
    id: "4",
    empId: "EMP-6320",
    name: "Rizky Ananda",
    role: "DevOps Specialist",
    dept: "IT & Infrastructure",
    avatar: "",
    siteId: "hq",
    statusType: "inside",
    statusLabel: "Inside Perimeter",
    checkinTime: "08:00 AM",
    distanceLabel: "40m",
    gps: {
      lat: -6.209063,
      lng: 106.845877,
      accuracy: 2.1
    },
    accuracyLabel: "Optimal (±2.1m)",
    battery: "78%",
    network: "5G • WiFi 6 Mesh",
    complianceZone: "Server Ops Wing 1",
    complianceSub: "40m from base beacon",
    timeline: [
      {
        time: "08:00 AM",
        title: "Gate 1 Turnstile Pass",
        detail: "RFID Pass Synchronized"
      },
      {
        time: "08:04 AM",
        title: "NOC Terminal Sign-on",
        detail: "Workstation Node Online",
        dotClass: "step-4"
      }
    ]
  },
  {
    id: "5",
    empId: "EMP-5519",
    name: "Maya Indah",
    role: "HR Operations Lead",
    dept: "People & Culture",
    avatar: "",
    siteId: "hq",
    statusType: "inside",
    statusLabel: "Inside Perimeter",
    checkinTime: "08:12 AM",
    distanceLabel: "110m",
    gps: {
      lat: -6.209879,
      lng: 106.844747,
      accuracy: 3.5
    },
    accuracyLabel: "High (±3.5m)",
    battery: "88%",
    network: "5G • iOS 18",
    complianceZone: "Executive Suite Floor 3",
    complianceSub: "110m from base beacon",
    timeline: [
      {
        time: "08:12 AM",
        title: "Main Reception Clock-In",
        detail: "Facial Scan Verified"
      },
      {
        time: "09:00 AM",
        title: "HR Briefing Room",
        detail: "Zone B Presence Logged",
        dotClass: "step-4"
      }
    ]
  },
  {
    id: "6",
    empId: "EMP-4389",
    name: "Fajar Nugraha",
    role: "Sales Rep • Client Site",
    dept: "Client Operations",
    avatar: "",
    siteId: "client-complex",
    statusType: "field",
    statusLabel: "Field Verified",
    checkinTime: "08:45 AM",
    distanceLabel: "2.4 km",
    gps: {
      lat: -6.212015,
      lng: 106.85052,
      accuracy: 5
    },
    accuracyLabel: "Standard (±5.0m)",
    battery: "63%",
    network: "5G Mobile Roam",
    complianceZone: "Authorized Client Complex",
    complianceSub: "Assigned Field Itinerary Active",
    timeline: [
      {
        time: "08:45 AM",
        title: "Field Mobile Check-In",
        detail: "GPS + Photo Proof Verified"
      },
      {
        time: "10:00 AM",
        title: "Client Hub Arrival",
        detail: "Geofence Match Confirmed",
        dotClass: "step-4"
      }
    ]
  }
];
const fleet = [
  {
    id: "FLEET-01",
    plate: "B 9123 KJA",
    driver: "Yusuf Maulana",
    status: "en-route",
    siteId: "hq",
    gps: {
      lat: -6.2089,
      lng: 106.8461,
      accuracy: 3.4
    },
    updatedAt: "2024-10-24T10:44:40+07:00"
  },
  {
    id: "FLEET-02",
    plate: "B 9455 KJC",
    driver: "Ratna Sari",
    status: "loading",
    siteId: "hq",
    gps: {
      lat: -6.2094,
      lng: 106.8451,
      accuracy: 2.9
    },
    updatedAt: "2024-10-24T10:44:55+07:00"
  },
  {
    id: "FLEET-03",
    plate: "B 9781 KJA",
    driver: "Agus Prasetyo",
    status: "en-route",
    siteId: "client-complex",
    gps: {
      lat: -6.2117,
      lng: 106.8498,
      accuracy: 6.2
    },
    updatedAt: "2024-10-24T10:45:02+07:00"
  },
  {
    id: "FLEET-04",
    plate: "B 9002 KJB",
    driver: "Dewi Lestari",
    status: "idle",
    siteId: "hub-2",
    gps: {
      lat: -6.2059,
      lng: 106.8557,
      accuracy: 4.7
    },
    updatedAt: "2024-10-24T10:44:20+07:00"
  }
];
const breachLog = [
  {
    id: "BRH-0031",
    unitId: "FLEET-03",
    entityId: "fleet-03",
    entityName: "Unit B 9781 KJA (Agus Prasetyo)",
    kind: "fleet",
    siteId: "client-complex",
    distanceMeters: 612,
    detectedAt: "2024-10-24T10:41:12+07:00",
    severity: "medium",
    detail: "Exited authorized delivery corridor"
  },
  {
    id: "BRH-0030",
    unitId: "EMP-7742",
    entityId: "3",
    entityName: "Dimas Pratama",
    kind: "personnel",
    siteId: "hq",
    distanceMeters: 343,
    detectedAt: "2024-10-24T10:40:36+07:00",
    severity: "high",
    detail: "Perimeter breach sustained beyond grace window"
  },
  {
    id: "BRH-0029",
    unitId: "EMP-3388",
    entityId: "outside-01",
    entityName: "Bayu Anggara",
    kind: "personnel",
    siteId: "hq",
    distanceMeters: 388,
    detectedAt: "2024-10-24T10:38:04+07:00",
    severity: "high",
    detail: "Geofence exit detected on HQ perimeter"
  },
  {
    id: "BRH-0028",
    unitId: "FLEET-05",
    entityId: "fleet-05",
    entityName: "Unit B 9907 KJC (Bagas Wijaya)",
    kind: "fleet",
    siteId: "hq",
    distanceMeters: 255,
    detectedAt: "2024-10-24T10:34:51+07:00",
    severity: "low",
    detail: "Transient boundary crossing, auto-cleared"
  }
];
const mockSnapshot$1 = {
  meta: meta$1,
  sites: sites$1,
  entities,
  fleet,
  breachLog
};
const LIVE_ENDPOINT = "/live-monitoring/snapshot";
const LIVE_POLL_MS = 5e3;
const TACTICAL_MAP_FRAME = {
  width: 1e3,
  height: 700,
  centerX: 460,
  centerY: 380,
  fenceRadiusPx: 180,
  margin: 24
};
const frameForSite = (sites2, siteId) => {
  const site = sites2.find((s) => s.id === siteId);
  return site ? {
    ...TACTICAL_MAP_FRAME,
    centerX: site.frame?.centerX ?? TACTICAL_MAP_FRAME.centerX,
    centerY: site.frame?.centerY ?? TACTICAL_MAP_FRAME.centerY,
    fenceRadiusPx: site.frame?.fenceRadiusPx ?? TACTICAL_MAP_FRAME.fenceRadiusPx
  } : TACTICAL_MAP_FRAME;
};
const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
const projectCoords = (gps, site, frame) => {
  const metersPerPixel = site.radiusMeters / frame.fenceRadiusPx;
  const northMeters = (gps.lat - site.lat) * 110574;
  const eastMeters = (gps.lng - site.lng) * 111320 * Math.cos(site.lat * Math.PI / 180);
  return {
    x: clamp(frame.centerX + eastMeters / metersPerPixel, frame.margin, frame.width - frame.margin),
    y: clamp(frame.centerY - northMeters / metersPerPixel, frame.margin, frame.height - frame.margin)
  };
};
const drift = (seed, step) => step <= 1 ? 0 : Math.sin(step * 1.7 + seed * 2.3) * 1.6;
let tickCount = 0;
const projectEntity = (raw, sites2, index, step) => {
  const site = sites2.find((s) => s.id === raw.siteId);
  const gps = {
    lat: raw.gps.lat + drift(index, step) / 110574,
    lng: raw.gps.lng + drift(index + 5, step) / (111320 * Math.cos(raw.gps.lat * Math.PI / 180)),
    accuracy: raw.gps.accuracy
  };
  return {
    id: raw.id,
    empId: raw.empId,
    name: raw.name,
    role: raw.role,
    dept: raw.dept,
    avatar: raw.avatar,
    kind: "personnel",
    distanceLabel: raw.distanceLabel,
    statusType: raw.statusType,
    statusLabel: raw.statusLabel,
    checkinTime: raw.checkinTime,
    isTarget: raw.isTarget,
    gps,
    position: site ? projectCoords(gps, site, frameForSite(sites2, raw.siteId)) : { x: TACTICAL_MAP_FRAME.centerX, y: TACTICAL_MAP_FRAME.centerY },
    accuracyLabel: raw.accuracyLabel,
    battery: raw.battery,
    network: raw.network,
    complianceZone: raw.complianceZone,
    complianceSub: raw.complianceSub,
    siteId: raw.siteId,
    updatedAt: (/* @__PURE__ */ new Date()).toISOString(),
    geofence: site ? evaluateGeofence(gps, site) : { status: "outside", distanceMeters: 0, radiusMeters: 0, lowConfidence: false },
    timeline: raw.timeline
  };
};
const hydrate = () => {
  const raw = mockSnapshot$1;
  tickCount += 1;
  const now = /* @__PURE__ */ new Date();
  const offsetMs = now.getTime() - new Date(raw.meta.generatedAt).getTime();
  const breachLog2 = raw.breachLog.map((entry) => {
    const site = raw.sites.find((s) => s.id === entry.siteId);
    return {
      ...entry,
      siteName: site?.name ?? "Unknown Zone",
      radiusMeters: site?.radiusMeters ?? 0,
      timestamp: formatTimestamp(entry.detectedAt, offsetMs)
    };
  }).sort((a, b) => b.detectedAt.localeCompare(a.detectedAt));
  return {
    meta: { ...raw.meta, generatedAt: now.toISOString() },
    sites: raw.sites,
    entities: raw.entities.map((entity, index) => projectEntity(entity, raw.sites, index, tickCount)),
    fleet: raw.fleet.map((unit) => ({ ...unit, updatedAt: now.toISOString() })),
    breachLog: breachLog2
  };
};
const fetchFromMock$2 = () => new Promise((resolve) => {
  setTimeout(() => resolve(hydrate()), 120);
});
const fetchLiveSnapshot = async () => {
  if (!isApiConfigured()) return fetchFromMock$2();
  return apiGet(LIVE_ENDPOINT);
};
const buildBreachAlert = (entity, site, detectedAt, serverOffsetMs) => ({
  id: `BRH-LIVE-${entity.empId}`,
  unitId: entity.empId,
  entityId: entity.id,
  entityName: entity.name,
  kind: entity.kind,
  siteId: entity.siteId,
  siteName: site?.name ?? "Unknown Zone",
  distanceMeters: entity.geofence.distanceMeters,
  radiusMeters: entity.geofence.radiusMeters,
  detectedAt,
  timestamp: formatTimestamp(detectedAt, serverOffsetMs),
  severity: "high",
  detail: `Position left ${site?.name ?? "assigned"} fence radius`
});
const withDetectedBreach = (snapshot, alert) => ({
  ...snapshot,
  meta: { ...snapshot.meta, liveBreachAlerts: snapshot.meta.liveBreachAlerts + 1 },
  breachLog: [alert, ...snapshot.breachLog]
});
const useLiveTracking = (pollIntervalMs = LIVE_POLL_MS) => {
  const [snapshot, setSnapshot] = reactExports.useState(null);
  const [status, setStatus] = reactExports.useState("idle");
  const [error, setError] = reactExports.useState(null);
  const [selectedId, setSelectedId] = reactExports.useState(null);
  const [filter, setFilter] = reactExports.useState("all");
  const [searchQuery, setSearchQuery] = reactExports.useState("");
  const [latestAlert, setLatestAlert] = reactExports.useState(null);
  const [msSinceSync, setMsSinceSync] = reactExports.useState(pollIntervalMs);
  const [serverOffsetMs, setServerOffsetMs] = reactExports.useState(0);
  const mountedRef = reactExports.useRef(true);
  const lastSyncRef = reactExports.useRef(0);
  const offsetRef = reactExports.useRef(0);
  const knownBreachRef = reactExports.useRef(/* @__PURE__ */ new Set());
  const load = reactExports.useCallback(async () => {
    try {
      const next = await fetchLiveSnapshot();
      const feedTime = new Date(next.meta.generatedAt).getTime();
      if (offsetRef.current === 0 && !Number.isNaN(feedTime)) {
        offsetRef.current = feedTime - Date.now();
        if (mountedRef.current) setServerOffsetMs(offsetRef.current);
      }
      const freshBreaches = next.entities.filter(
        (entity) => entity.geofence.status === "outside" && !knownBreachRef.current.has(entity.empId)
      );
      if (freshBreaches.length > 0 && snapshot) {
        const alert = buildBreachAlert(
          freshBreaches[0],
          snapshot.sites.find((s) => s.id === freshBreaches[0].siteId),
          next.meta.generatedAt,
          offsetRef.current
        );
        if (mountedRef.current) {
          setSnapshot(withDetectedBreach(next, alert));
          setLatestAlert(alert);
        }
        freshBreaches.forEach((entity) => knownBreachRef.current.add(entity.empId));
      } else {
        freshBreaches.forEach((entity) => knownBreachRef.current.add(entity.empId));
      }
      if (!mountedRef.current) return;
      setSnapshot(next);
      lastSyncRef.current = Date.now();
      setMsSinceSync(0);
      setStatus("ready");
      setError(null);
    } catch (err) {
      if (!mountedRef.current) return;
      setStatus("error");
      setError(err instanceof Error ? err.message : "Failed to load telemetry feed");
    }
  }, [snapshot]);
  reactExports.useEffect(() => {
    mountedRef.current = true;
    void load();
    return () => {
      mountedRef.current = false;
    };
  }, []);
  reactExports.useEffect(() => {
    const poller = window.setInterval(() => {
      void load();
    }, pollIntervalMs);
    return () => window.clearInterval(poller);
  }, [load, pollIntervalMs]);
  reactExports.useEffect(() => {
    const ticker = window.setInterval(() => {
      setMsSinceSync(lastSyncRef.current === 0 ? pollIntervalMs : Date.now() - lastSyncRef.current);
    }, 1e3);
    return () => window.clearInterval(ticker);
  }, [pollIntervalMs]);
  const entities2 = reactExports.useMemo(() => snapshot?.entities ?? [], [snapshot]);
  const selected = reactExports.useMemo(
    () => entities2.find((e) => e.id === selectedId) ?? entities2[0] ?? null,
    [entities2, selectedId]
  );
  const filteredEntities = reactExports.useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return entities2.filter((entity) => {
      if (filter === "inside" && entity.statusType !== "inside") return false;
      if (filter === "outside" && entity.statusType !== "breach" && entity.statusType !== "field") return false;
      if (filter === "flagged" && entity.statusType !== "breach") return false;
      if (query) {
        return entity.name.toLowerCase().includes(query) || entity.empId.toLowerCase().includes(query) || entity.role.toLowerCase().includes(query) || entity.dept.toLowerCase().includes(query);
      }
      return true;
    });
  }, [entities2, filter, searchQuery]);
  const selectEntity = reactExports.useCallback((entity) => setSelectedId(entity.id), []);
  const dismissAlert = reactExports.useCallback(() => setLatestAlert(null), []);
  return {
    snapshot,
    entities: entities2,
    filteredEntities,
    breachLog: snapshot?.breachLog ?? [],
    latestAlert,
    dismissAlert,
    status,
    error,
    msSinceSync,
    serverOffsetMs,
    selected,
    selectEntity,
    filter,
    setFilter,
    searchQuery,
    setSearchQuery,
    refresh: load
  };
};
const LiveMonitoring = () => {
  const {
    snapshot,
    entities: entities2,
    filteredEntities,
    breachLog: breachLog2,
    latestAlert,
    msSinceSync,
    serverOffsetMs,
    selected,
    selectEntity,
    filter,
    setFilter,
    searchQuery,
    setSearchQuery,
    refresh
  } = useLiveTracking();
  const [mapStyle, setMapStyle] = reactExports.useState("standard");
  const [geofenceOn, setGeofenceOn] = reactExports.useState(true);
  const [heatmapOn, setHeatmapOn] = reactExports.useState(false);
  const [audioOn, setAudioOn] = reactExports.useState(true);
  const [isRefreshing, setIsRefreshing] = reactExports.useState(false);
  const [showRightPanel, setShowRightPanel] = reactExports.useState(true);
  const [toastMessage, setToastMessage] = reactExports.useState(null);
  const [zoomLevel, setZoomLevel] = reactExports.useState(1);
  const deptOptions = reactExports.useMemo(
    () => ["All Departments", ...Array.from(new Set(entities2.map((e) => e.dept)))],
    [entities2]
  );
  const [deptScope, setDeptScope] = reactExports.useState("All Departments");
  const cycleDeptScope = () => {
    const current = deptOptions.indexOf(deptScope);
    setDeptScope(deptOptions[(current + 1) % deptOptions.length]);
  };
  const visibleEntities = reactExports.useMemo(
    () => filteredEntities.filter((entity) => deptScope === "All Departments" || entity.dept === deptScope),
    [filteredEntities, deptScope]
  );
  const meta2 = snapshot?.meta;
  const selectedPersonnel = selected;
  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3e3);
  };
  const handleRefresh = () => {
    setIsRefreshing(true);
    void refresh().finally(() => {
      setTimeout(() => {
        setIsRefreshing(false);
        showToast(`Telematics feed refreshed (${meta2?.nodesOnline ?? 0} GPS Nodes Synced)`);
      }, 600);
    });
  };
  const byEmpId = (empId) => entities2.find((entity) => entity.empId === empId);
  const trailFor = (entity) => {
    const breaches = breachLog2.filter((entry) => entry.entityId === entity.id).map((entry) => ({
      time: entry.timestamp,
      title: `Geofence Breach � ${entry.unitId}`,
      detail: `${entry.detail} � ${entry.distanceMeters}m outside ${entry.siteName}`,
      dotClass: "step-4"
    }));
    return [...breaches, ...entity.timeline];
  };
  const syncSeconds = Math.max(0, Math.round(msSinceSync / 1e3));
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "live-mon-container", children: [
    (toastMessage || latestAlert) && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "toast-notice", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "material-symbols-outlined icon-md", style: { color: "var(--color-tertiary-fixed)" }, children: latestAlert ? "warning" : "check_circle" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: latestAlert ? `Live Breach Alert • ${latestAlert.unitId} • ${latestAlert.timestamp} • ${latestAlert.distanceMeters}m outside ${latestAlert.siteName}` : toastMessage })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "live-mon-subheader", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "live-mon-sub-left", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "live-mon-breadcrumb", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "live-mon-bc-main", children: "Live Monitoring" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "live-mon-bc-sep", children: "/" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "live-mon-bc-current", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "material-symbols-outlined icon-sm", children: "radar" }),
            "Real-Time GPS Tracking"
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "live-mon-divider" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "live-mon-pulse-pill", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "live-dot" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
            "Connected to GPS Fleet Telematics (",
            meta2?.nodesOnline ?? 0,
            " Nodes Online)"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "dim-sep", children: "•" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "polling-tag", children: [
            "Polling: ",
            meta2?.pollingSeconds ?? 0,
            "s"
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "live-mon-sub-actions", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "live-mon-action-pill", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "material-symbols-outlined icon-sm", style: { color: "var(--color-primary-container)" }, children: "shield" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Geofence:" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("strong", { children: [
            "Strict (",
            meta2?.geofenceRadiusMeters ?? 0,
            "m) • ",
            meta2?.activeGeofences ?? 0,
            " Active"
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            className: "live-mon-btn-audio",
            type: "button",
            onClick: () => {
              setAudioOn(!audioOn);
              showToast(audioOn ? "Tactical Audio Muted" : "Tactical Audio: Enabled");
            },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "material-symbols-outlined icon-sm", style: { color: "var(--color-secondary)" }, children: audioOn ? "volume_up" : "volume_off" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                "Audio: ",
                audioOn ? "On" : "Off"
              ] })
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            className: "live-mon-btn-refresh",
            type: "button",
            onClick: handleRefresh,
            title: "Refresh Feed",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `material-symbols-outlined icon-sm ${isRefreshing ? "rotate-anim" : ""}`, children: "sync" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Refresh Feed" })
            ]
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "live-mon-workspace", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("aside", { className: "trackers-panel", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "trackers-header", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "trackers-title-wrap", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "trackers-title", children: "Active Trackers" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "live-dot", style: { width: 9, height: 9 } })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "trackers-badge-live", children: [
            meta2?.totalLiveUnits ?? 0,
            " Live"
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "trackers-search-wrap", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "material-symbols-outlined icon-md trackers-search-icon", children: "search" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "input",
            {
              type: "text",
              className: "trackers-search-input",
              placeholder: "Filter by name, ID, role...",
              value: searchQuery,
              onChange: (e) => setSearchQuery(e.target.value)
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "trackers-filter-chips", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              className: `trackers-filter-chip ${filter === "all" ? "active" : ""}`,
              type: "button",
              onClick: () => setFilter("all"),
              children: [
                "All (",
                meta2?.totalLiveUnits ?? 0,
                ")"
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              className: `trackers-filter-chip ${filter === "inside" ? "active" : ""}`,
              type: "button",
              onClick: () => setFilter("inside"),
              children: [
                "Inside (",
                meta2?.insideCount ?? 0,
                ")"
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              className: `trackers-filter-chip chip-error ${filter === "outside" ? "active" : ""}`,
              type: "button",
              onClick: () => setFilter("outside"),
              children: [
                "Outside (",
                meta2?.outsideCount ?? 0,
                ")"
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              className: `trackers-filter-chip ${filter === "flagged" ? "active" : ""}`,
              type: "button",
              onClick: () => setFilter("flagged"),
              children: [
                "Flagged (",
                meta2?.flaggedCount ?? 0,
                ")"
              ]
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "trackers-scope-selector", onClick: cycleDeptScope, title: "Click to switch department scope", style: { cursor: "pointer" }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { style: { display: "inline-flex", alignItems: "center", gap: 4 }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "material-symbols-outlined icon-sm", children: "filter_alt" }),
            " Scope:"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "trackers-scope-val", children: [
            deptScope === "All Departments" ? "All Departments" : deptScope,
            " ",
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "material-symbols-outlined icon-sm", children: "expand_more" })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "trackers-stream", children: visibleEntities.map((person) => {
          const isSelected = selectedPersonnel?.id === person.id;
          const isBreach = person.statusType === "breach";
          const isField = person.statusType === "field";
          return /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: `tracker-card ${isSelected ? "active" : ""} ${isBreach ? "breach" : ""} ${isField ? "field" : ""}`,
              onClick: () => {
                selectEntity(person);
                if (!showRightPanel) setShowRightPanel(true);
              },
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "tracker-card-top", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "tracker-card-person", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "tracker-avatar-wrap", children: [
                      person.avatar ? /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "img",
                        {
                          src: person.avatar,
                          alt: person.name,
                          className: "tracker-avatar",
                          onError: (e) => {
                            e.target.style.display = "none";
                            const fb2 = e.target.nextElementSibling;
                            if (fb2) fb2.style.display = "flex";
                          }
                        }
                      ) : null,
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "div",
                        {
                          className: "tracker-avatar-fallback",
                          style: { display: person.avatar ? "none" : "flex" },
                          children: person.name.split(" ").map((n2) => n2[0]).join("")
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "span",
                        {
                          className: `tracker-avatar-dot ${isBreach ? "breach" : isField ? "field" : ""}`
                        }
                      )
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "tracker-info", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "tracker-name-row", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "tracker-name", children: person.name }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "tracker-id", children: person.empId })
                      ] }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `tracker-role ${isBreach ? "text-error" : ""}`, children: person.role })
                    ] })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "span",
                    {
                      className: `tracker-dist ${isBreach ? "dist-error" : isField ? "dist-secondary" : ""}`,
                      children: person.distanceLabel
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "tracker-card-bottom", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "tracker-time", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "material-symbols-outlined icon-sm", children: isBreach ? "warning" : isField ? "verified" : "login" }),
                    person.checkinTime
                  ] }),
                  isSelected ? /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "tracker-tag-active", children: "Active Target" }) : isBreach ? /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "tracker-tag-warning", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "material-symbols-outlined", style: { fontSize: 11 }, children: "warning" }),
                    "Breach Alert"
                  ] }) : isField ? /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "tracker-tag-secondary", children: "Field Verified" }) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "tracker-status-text", children: "Inside Perimeter" })
                ] })
              ]
            },
            person.id
          );
        }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("main", { className: "tactical-map-panel", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "map-cmd-bar", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "map-style-switcher", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                className: `map-style-btn ${mapStyle === "standard" ? "active" : ""}`,
                type: "button",
                onClick: () => setMapStyle("standard"),
                children: "Standard"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                className: `map-style-btn ${mapStyle === "satellite" ? "active" : ""}`,
                type: "button",
                onClick: () => setMapStyle("satellite"),
                children: "Satellite"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                className: `map-style-btn ${mapStyle === "dark" ? "active" : ""}`,
                type: "button",
                onClick: () => setMapStyle("dark"),
                children: "Dark Grid"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "map-layer-toggles", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "button",
              {
                className: `layer-toggle-btn ${geofenceOn ? "active" : ""}`,
                type: "button",
                onClick: () => setGeofenceOn(!geofenceOn),
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "material-symbols-outlined icon-sm", children: "fence" }),
                  "Geofence: ",
                  geofenceOn ? "ON" : "OFF"
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "button",
              {
                className: `layer-toggle-btn ${heatmapOn ? "active" : ""}`,
                type: "button",
                onClick: () => setHeatmapOn(!heatmapOn),
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "material-symbols-outlined icon-sm", style: { color: "var(--color-secondary)" }, children: "local_fire_department" }),
                  "Heatmap"
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                className: "layer-icon-btn",
                type: "button",
                title: "Toggle Telemetry Sidebar",
                onClick: () => setShowRightPanel(!showRightPanel),
                children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "material-symbols-outlined icon-md", children: showRightPanel ? "dock_to_right" : "dock_to_right" })
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "tactical-map-canvas",
            style: {
              filter: mapStyle === "satellite" ? "contrast(1.1) saturate(1.2)" : "none"
            },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "svg",
                {
                  className: "tactical-svg",
                  viewBox: "0 0 1000 700",
                  preserveAspectRatio: "xMidYMid slice",
                  xmlns: "http://www.w3.org/2000/svg",
                  style: {
                    transform: `scale(${zoomLevel})`,
                    transformOrigin: "460px 380px",
                    transition: "transform 0.3s ease"
                  },
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("defs", { children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("pattern", { id: "tacCityGrid", width: "60", height: "60", patternUnits: "userSpaceOnUse", children: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M 60 0 L 0 0 0 60", fill: "none", stroke: "#252943", strokeWidth: "0.8", strokeOpacity: "0.35" }) }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("radialGradient", { id: "tacGeofenceGlow", cx: "50%", cy: "50%", r: "50%", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "0%", stopColor: "#3ca9ff", stopOpacity: "0.28" }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "85%", stopColor: "#3a4efb", stopOpacity: "0.12" }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "100%", stopColor: "#152de4", stopOpacity: "0.0" })
                      ] }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("radialGradient", { id: "tacBranchGlow", cx: "50%", cy: "50%", r: "50%", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "0%", stopColor: "#d4f029", stopOpacity: "0.2" }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "100%", stopColor: "#5f6d00", stopOpacity: "0.0" })
                      ] })
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("rect", { width: "1000", height: "700", fill: mapStyle === "dark" ? "#0d1024" : "#161a33" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("rect", { width: "1000", height: "700", fill: "url(#tacCityGrid)" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "path",
                      {
                        d: "M-50,600 C 200,560 320,460 480,390 C 650,330 760,190 950,130 L 1050,140 L 1050,750 L -50,750 Z",
                        fill: "#003c63",
                        opacity: "0.35"
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M 0,200 L 1000,300", stroke: "#2b2f49", strokeWidth: "8", opacity: "0.8" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M 0,200 L 1000,300", stroke: "#dee0ff", strokeWidth: "2", strokeDasharray: "8 6", opacity: "0.6" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M 280,0 L 460,700", stroke: "#2b2f49", strokeWidth: "7", opacity: "0.8" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M 720,0 L 590,700", stroke: "#2b2f49", strokeWidth: "6", opacity: "0.8" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M 100,470 L 900,470", stroke: "#252943", strokeWidth: "2.5", opacity: "0.9" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M 150,90 L 850,650", stroke: "#252943", strokeWidth: "2", opacity: "0.9" }),
                    heatmapOn && /* @__PURE__ */ jsxRuntimeExports.jsxs("g", { opacity: "0.45", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { cx: "460", cy: "380", r: "140", fill: "#3ca9ff", filter: "blur(25px)" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { cx: "480", cy: "360", r: "80", fill: "#d7f32d", filter: "blur(20px)" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { cx: "230", cy: "270", r: "60", fill: "#ba1a1a", filter: "blur(18px)" })
                    ] }),
                    geofenceOn && /* @__PURE__ */ jsxRuntimeExports.jsxs("g", { transform: "translate(740, 180)", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { r: "85", fill: "url(#tacBranchGlow)" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { r: "85", fill: "none", stroke: "#d4f029", strokeWidth: "1.5", strokeDasharray: "4 4", opacity: "0.7" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("rect", { x: "-18", y: "-18", width: "36", height: "36", rx: "6", fill: "#2b2f49", stroke: "#d4f029", strokeWidth: "2" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("text", { x: "0", y: "4", textAnchor: "middle", fill: "#d7f32d", fontFamily: "Plus Jakarta Sans", fontSize: "10", fontWeight: "700", children: "HUB-2" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("text", { x: "0", y: "30", textAnchor: "middle", fill: "#ffffff", fontFamily: "Inter", fontSize: "11", fontWeight: "600", opacity: "0.9", children: "North Logistics Hub (150m)" })
                    ] }),
                    geofenceOn && /* @__PURE__ */ jsxRuntimeExports.jsxs("g", { transform: "translate(460, 380)", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { r: "180", fill: "url(#tacGeofenceGlow)", children: /* @__PURE__ */ jsxRuntimeExports.jsx("animate", { attributeName: "r", values: "178;184;178", dur: "4s", repeatCount: "indefinite" }) }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { r: "180", fill: "none", stroke: "#3ca9ff", strokeWidth: "2", strokeDasharray: "6 4", opacity: "0.8" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { r: "180", fill: "none", stroke: "#3a4efb", strokeWidth: "1", opacity: "0.4" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("rect", { x: "-24", y: "-24", width: "48", height: "48", rx: "10", fill: "#152de4", filter: "drop-shadow(0 4px 8px rgba(0,0,0,0.5))" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("polygon", { points: "-8,-4 0,-14 8,-4", fill: "#ffffff" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("rect", { x: "-7", y: "-2", width: "14", height: "12", fill: "#ffffff" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("text", { x: "0", y: "40", textAnchor: "middle", fill: "#ffffff", fontFamily: "Plus Jakarta Sans", fontSize: "13", fontWeight: "700", children: "Vanguard Central HQ" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("text", { x: "0", y: "55", textAnchor: "middle", fill: "#d7f32d", fontFamily: "Inter", fontSize: "10", fontWeight: "600", children: "STRICT GEOFENCE 250M" })
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("g", { transform: "translate(435, 340)", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { r: "6", fill: "#00629e", opacity: "0.9" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { r: "2", fill: "#fff" })
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("g", { transform: "translate(460, 440)", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { r: "6", fill: "#00629e", opacity: "0.9" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { r: "2", fill: "#fff" })
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("g", { transform: "translate(380, 360)", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { r: "6", fill: "#00629e", opacity: "0.9" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { r: "2", fill: "#fff" })
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("g", { transform: "translate(515, 320)", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { r: "6", fill: "#00629e", opacity: "0.9" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { r: "2", fill: "#fff" })
                    ] }),
                    byEmpId("EMP-6320") && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      "g",
                      {
                        transform: `translate(${byEmpId("EMP-6320")?.position.x}, ${byEmpId("EMP-6320")?.position.y})`,
                        style: { cursor: "pointer" },
                        onClick: () => selectEntity(byEmpId("EMP-6320")),
                        children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { r: "9", fill: "#3a4efb", stroke: "#ffffff", strokeWidth: "2" }),
                          /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { r: "3", fill: "#ffffff" })
                        ]
                      }
                    ),
                    byEmpId("EMP-9014") && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      "g",
                      {
                        transform: `translate(${byEmpId("EMP-9014")?.position.x}, ${byEmpId("EMP-9014")?.position.y})`,
                        style: { cursor: "pointer" },
                        onClick: () => selectEntity(byEmpId("EMP-9014")),
                        children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { r: "9", fill: "#3a4efb", stroke: "#ffffff", strokeWidth: "2" }),
                          /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { r: "3", fill: "#ffffff" })
                        ]
                      }
                    ),
                    byEmpId("EMP-5519") && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      "g",
                      {
                        transform: `translate(${byEmpId("EMP-5519")?.position.x}, ${byEmpId("EMP-5519")?.position.y})`,
                        style: { cursor: "pointer" },
                        onClick: () => selectEntity(byEmpId("EMP-5519")),
                        children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { r: "9", fill: "#3a4efb", stroke: "#ffffff", strokeWidth: "2" }),
                          /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { r: "3", fill: "#ffffff" })
                        ]
                      }
                    ),
                    byEmpId("EMP-7742") && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      "g",
                      {
                        transform: `translate(${byEmpId("EMP-7742")?.position.x}, ${byEmpId("EMP-7742")?.position.y})`,
                        style: { cursor: "pointer" },
                        onClick: () => selectEntity(byEmpId("EMP-7742")),
                        children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsxs("circle", { r: "18", fill: "none", stroke: "#ba1a1a", strokeWidth: "2", opacity: "0.8", children: [
                            /* @__PURE__ */ jsxRuntimeExports.jsx("animate", { attributeName: "r", values: "14;24;14", dur: "2s", repeatCount: "indefinite" }),
                            /* @__PURE__ */ jsxRuntimeExports.jsx("animate", { attributeName: "opacity", values: "0.9;0.1;0.9", dur: "2s", repeatCount: "indefinite" })
                          ] }),
                          /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { r: "13", fill: "#ba1a1a", stroke: "#ffffff", strokeWidth: "2" }),
                          /* @__PURE__ */ jsxRuntimeExports.jsx("text", { x: "0", y: "4", textAnchor: "middle", fill: "#ffffff", fontFamily: "Plus Jakarta Sans", fontSize: "11", fontWeight: "800", children: "!" }),
                          /* @__PURE__ */ jsxRuntimeExports.jsx("rect", { x: "18", y: "-16", width: "130", height: "26", rx: "4", fill: "#2b2f49", stroke: "#ba1a1a", strokeWidth: "1.5" }),
                          /* @__PURE__ */ jsxRuntimeExports.jsxs("text", { x: "24", y: "-3", fill: "#ffdad6", fontFamily: "Inter", fontSize: "10", fontWeight: "700", children: [
                            "Dimas P. (",
                            byEmpId("EMP-7742")?.distanceLabel,
                            " Out)"
                          ] }),
                          /* @__PURE__ */ jsxRuntimeExports.jsx("text", { x: "24", y: "6", fill: "#ffffff", fontFamily: "Inter", fontSize: "8", fontWeight: "500", children: "Outside Permitted Zone" })
                        ]
                      }
                    ),
                    byEmpId("EMP-4389") && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      "g",
                      {
                        transform: `translate(${byEmpId("EMP-4389")?.position.x}, ${byEmpId("EMP-4389")?.position.y})`,
                        style: { cursor: "pointer" },
                        onClick: () => selectEntity(byEmpId("EMP-4389")),
                        children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { r: "12", fill: "#00629e", stroke: "#cfe5ff", strokeWidth: "2" }),
                          /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { r: "4", fill: "#d4f029" }),
                          /* @__PURE__ */ jsxRuntimeExports.jsx("rect", { x: "-60", y: "16", width: "120", height: "20", rx: "4", fill: "#161a33", stroke: "#3ca9ff", strokeWidth: "1", opacity: "0.9" }),
                          /* @__PURE__ */ jsxRuntimeExports.jsxs("text", { x: "0", y: "30", textAnchor: "middle", fill: "#ffffff", fontFamily: "Inter", fontSize: "9", fontWeight: "600", children: [
                            "Fajar N. • Client Visit (",
                            byEmpId("EMP-4389")?.distanceLabel,
                            ")"
                          ] })
                        ]
                      }
                    ),
                    selectedPersonnel && /* @__PURE__ */ jsxRuntimeExports.jsxs("g", { transform: `translate(${selectedPersonnel.position.x}, ${selectedPersonnel.position.y})`, children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("circle", { r: "26", fill: "none", stroke: "#d7f32d", strokeWidth: "2", opacity: "0.9", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx("animate", { attributeName: "r", values: "20;34;20", dur: "2.2s", repeatCount: "indefinite" }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("animate", { attributeName: "opacity", values: "0.9;0.2;0.9", dur: "2.2s", repeatCount: "indefinite" })
                      ] }),
                      selectedPersonnel.statusType === "inside" && /* @__PURE__ */ jsxRuntimeExports.jsx("line", { x1: "0", y1: "0", x2: 460 - selectedPersonnel.position.x, y2: 380 - selectedPersonnel.position.y, stroke: "#d7f32d", strokeWidth: "1.5", strokeDasharray: "3 3", opacity: "0.75" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { r: "14", fill: "#152de4", stroke: "#ffffff", strokeWidth: "2.5", filter: "drop-shadow(0 3px 6px rgba(0,0,0,0.6))" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { r: "5", fill: "#d7f32d" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("g", { transform: "translate(-85, -54)", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx("rect", { width: "170", height: "42", rx: "8", fill: "#161a33", stroke: "#3a4efb", strokeWidth: "2", filter: "drop-shadow(0 6px 14px rgba(0,0,0,0.6))" }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { cx: "20", cy: "21", r: "10", fill: "#3a4efb" }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("text", { x: "20", y: "25", textAnchor: "middle", fill: "#ffffff", fontFamily: "Inter", fontSize: "10", fontWeight: "700", children: selectedPersonnel.name.split(" ").map((n2) => n2[0]).join("") }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("text", { x: "36", y: "18", fill: "#ffffff", fontFamily: "Plus Jakarta Sans", fontSize: "11", fontWeight: "700", children: selectedPersonnel.name }),
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("text", { x: "36", y: "31", fill: "#d7f32d", fontFamily: "Inter", fontSize: "10", fontWeight: "600", children: [
                          selectedPersonnel.distanceLabel,
                          " from Base Beacon"
                        ] })
                      ] })
                    ] })
                  ]
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "map-float-nav", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "map-zoom-group", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "button",
                    {
                      className: "map-nav-btn",
                      type: "button",
                      title: "Zoom In",
                      onClick: () => setZoomLevel((z2) => Math.min(1.8, z2 + 0.15)),
                      children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "material-symbols-outlined icon-md", children: "add" })
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { height: 1, background: "var(--color-outline-variant)" } }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "button",
                    {
                      className: "map-nav-btn",
                      type: "button",
                      title: "Zoom Out",
                      onClick: () => setZoomLevel((z2) => Math.max(0.7, z2 - 0.15)),
                      children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "material-symbols-outlined icon-md", children: "remove" })
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    className: "map-nav-single-btn",
                    type: "button",
                    title: "Center Map on Base HQ",
                    onClick: () => setZoomLevel(1),
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "material-symbols-outlined icon-md", children: "my_location" })
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    className: "map-nav-single-btn",
                    type: "button",
                    title: "Compass Orientation",
                    onClick: () => showToast("Orientation locked to True North (360°)"),
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "material-symbols-outlined icon-md", style: { color: "var(--color-on-surface)" }, children: "explore" })
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "map-float-legend", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "legend-row-top", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "legend-title", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "material-symbols-outlined icon-sm", children: "adjust" }),
                    " Dynamic Boundary"
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { style: { color: "#fff", fontFeatureSettings: '"tnum" 1' }, children: [
                    meta2?.geofenceRadiusMeters ?? 0,
                    "m Active"
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "legend-progress-bar", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "legend-progress-fill", style: { width: "50%" } }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "legend-indicators", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    "span",
                    {
                      className: "legend-dot-item",
                      onClick: () => setFilter(filter === "inside" ? "all" : "inside"),
                      style: { cursor: "pointer", opacity: filter === "inside" ? 1 : 0.85 },
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "legend-dot", style: { background: "var(--color-primary-container)" } }),
                        "In-HQ (",
                        meta2?.insideCount ?? 0,
                        ")"
                      ]
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    "span",
                    {
                      className: "legend-dot-item",
                      onClick: () => setFilter(filter === "flagged" ? "all" : "flagged"),
                      style: { cursor: "pointer", opacity: filter === "flagged" ? 1 : 0.85 },
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "legend-dot", style: { background: "var(--color-error)" } }),
                        "Breach (",
                        meta2?.liveBreachAlerts ?? 0,
                        ")"
                      ]
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    "span",
                    {
                      className: "legend-dot-item",
                      onClick: () => setFilter(filter === "outside" ? "all" : "outside"),
                      style: { cursor: "pointer", opacity: filter === "outside" ? 1 : 0.85 },
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "legend-dot", style: { background: "var(--color-tertiary-fixed)" } }),
                        "Verified (",
                        meta2?.verifiedFieldCount ?? 0,
                        ")"
                      ]
                    }
                  )
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "map-bottom-strip", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "strip-stats", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "strip-stat-item", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "material-symbols-outlined icon-sm", style: { color: "var(--color-secondary-container)" }, children: "domain" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                      "HQ Capacity: ",
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("strong", { children: [
                        meta2?.hqCapacityUsed ?? 0,
                        " / ",
                        meta2?.hqCapacityTotal ?? 0
                      ] })
                    ] })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { color: "var(--color-surface-dim)", opacity: 0.4 }, children: "•" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "strip-stat-item", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "material-symbols-outlined icon-sm", style: { color: "var(--color-tertiary-fixed)" }, children: "speed" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                      "Fleet Efficiency: ",
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("strong", { children: [
                        meta2?.fleetEfficiencyPercent ?? 0,
                        "%"
                      ] })
                    ] })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { color: "var(--color-surface-dim)", opacity: 0.4 }, children: "•" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "strip-stat-item", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "material-symbols-outlined icon-sm", style: { color: "var(--color-secondary-fixed)" }, children: "satellite_alt" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                      "GPS Drift: ",
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("strong", { children: [
                        "±",
                        meta2?.gpsDriftMeters ?? 0,
                        "m"
                      ] })
                    ] })
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "strip-sync", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "live-dot", style: { width: 6, height: 6 } }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                    "Last Sync: ",
                    syncSeconds,
                    "s ago"
                  ] })
                ] })
              ] })
            ]
          }
        )
      ] }),
      showRightPanel && selectedPersonnel && /* @__PURE__ */ jsxRuntimeExports.jsxs("aside", { className: "telemetry-panel", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "telemetry-header", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "telemetry-title-wrap", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "material-symbols-outlined icon-md", style: { color: "var(--color-primary-container)" }, children: "person_pin_circle" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "telemetry-title", children: "Telemetry Detail" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "telemetry-tools", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                className: "telemetry-tool-btn",
                type: "button",
                title: "Refresh Node",
                onClick: () => showToast(`Pinging telemetry node for ${selectedPersonnel.name}`),
                children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "material-symbols-outlined icon-md", children: "refresh" })
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                className: "telemetry-tool-btn",
                type: "button",
                title: "Close Panel",
                onClick: () => setShowRightPanel(false),
                children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "material-symbols-outlined icon-md", children: "close" })
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "telemetry-profile-card", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "telemetry-avatar-wrap", children: [
            selectedPersonnel.avatar ? /* @__PURE__ */ jsxRuntimeExports.jsx(
              "img",
              {
                src: selectedPersonnel.avatar,
                alt: selectedPersonnel.name,
                className: "telemetry-avatar",
                onError: (e) => {
                  e.target.style.display = "none";
                  const fb2 = e.target.nextElementSibling;
                  if (fb2) fb2.style.display = "flex";
                }
              }
            ) : null,
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                className: "telemetry-avatar-fallback",
                style: { display: selectedPersonnel.avatar ? "none" : "flex" },
                children: selectedPersonnel.name.split(" ").map((n2) => n2[0]).join("")
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "telemetry-profile-info", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "telemetry-name", children: selectedPersonnel.name }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "telemetry-job", children: selectedPersonnel.role }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "telemetry-tags", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "telemetry-badge-id", children: selectedPersonnel.empId }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "telemetry-dept", children: selectedPersonnel.dept })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "telemetry-feed-group", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "telemetry-section-label", children: "Realtime Telemetry Feed" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "telemetry-card-block", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "telemetry-block-header", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "telemetry-block-header-left", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "material-symbols-outlined icon-sm", style: { color: "var(--color-primary-container)" }, children: "how_to_reg" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Attendance Status" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "telemetry-block-tag", children: "Present" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "telemetry-block-main", children: [
              "Check-in: ",
              selectedPersonnel.checkinTime,
              " WIB"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "telemetry-block-sub", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "material-symbols-outlined icon-sm", style: { color: "var(--color-primary)" }, children: "verified" }),
              "Biometric Facial + GPS Verified"
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "telemetry-card-block", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "telemetry-block-header", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "telemetry-block-header-left", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "material-symbols-outlined icon-sm", style: { color: "var(--color-secondary)" }, children: "share_location" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Geofence Compliance" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "span",
                {
                  className: `telemetry-block-tag ${selectedPersonnel.statusType === "breach" ? "outside" : "inside"}`,
                  children: selectedPersonnel.statusType === "breach" ? "OUTSIDE PERIMETER" : "INSIDE PERIMETER"
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "telemetry-block-main", children: selectedPersonnel.complianceZone }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "telemetry-block-sub", children: selectedPersonnel.complianceSub })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "telemetry-specs-grid", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "telemetry-spec-item", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "spec-label", children: "GPS Coordinate" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "spec-val font-tabular", children: [
                formatGpsCoordinate(selectedPersonnel.gps.lat, selectedPersonnel.gps.lng),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { style: { display: "block", fontSize: 10, color: "var(--color-outline)" }, children: [
                  "Updated ",
                  formatTimestamp(selectedPersonnel.updatedAt, serverOffsetMs)
                ] })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "telemetry-spec-item", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "spec-label", children: "Accuracy Deviation" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "spec-val", style: { color: "var(--color-secondary)" }, children: selectedPersonnel.accuracyLabel })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "telemetry-spec-item", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "spec-label", children: "Device Battery" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "spec-val", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "material-symbols-outlined icon-sm", style: { color: "var(--color-tertiary-fixed-dim)" }, children: "battery_charging_80" }),
                selectedPersonnel.battery
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "telemetry-spec-item", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "spec-label", children: "Connection" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "spec-val", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "material-symbols-outlined icon-sm", style: { color: "var(--color-primary)" }, children: "5g" }),
                selectedPersonnel.network
              ] })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "telemetry-feed-group", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", alignItems: "center", justifyContent: "space-between" }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "telemetry-section-label", children: "Activity Trail (Today)" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { style: { fontSize: 11, color: "var(--color-outline)" }, children: [
              trailFor(selectedPersonnel).length,
              " checkpoints"
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "telemetry-timeline", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "telemetry-timeline-line" }),
            trailFor(selectedPersonnel).map((step, idx) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "timeline-step", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `timeline-dot ${step.dotClass || ""}` }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "timeline-step-row", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "timeline-time", children: step.time }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "timeline-label", children: step.title })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "timeline-sub", children: step.detail })
            ] }, idx))
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "telemetry-actions", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              className: "btn-ping-device",
              type: "button",
              onClick: () => showToast(`Sent High-Frequency GPS Ping to ${selectedPersonnel.empId}`),
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "material-symbols-outlined icon-sm", children: "near_me" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Ping Device Location" })
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "telemetry-action-subrow", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "button",
              {
                className: "btn-route",
                type: "button",
                onClick: () => showToast(`Loaded GPS Breadcrumb Route for ${selectedPersonnel.name}`),
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "material-symbols-outlined icon-sm", style: { color: "var(--color-primary)" }, children: "route" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "View Historical Route" })
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                className: "btn-chat",
                type: "button",
                title: "Contact Employee directly",
                onClick: () => showToast(`Direct intercom opened with ${selectedPersonnel.name}`),
                children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "material-symbols-outlined icon-sm", children: "chat" })
              }
            )
          ] })
        ] })
      ] })
    ] })
  ] });
};
const DIRECTORY_ENDPOINT = "/employees";
const DIRECTORY_POLL_MS = 3e4;
const VEHICLE_STATUS_LABEL = {
  moving: "Moving",
  idling: "Idling",
  maintenance: "Maintenance",
  offline: "Offline"
};
const VEHICLE_STATUS_BADGE = {
  moving: "emp-att-badge present",
  idling: "emp-att-badge field",
  maintenance: "emp-att-badge leave",
  offline: "emp-att-badge late"
};
const VEHICLE_STATUS_ICON = {
  moving: "navigation",
  idling: "pause_circle",
  maintenance: "build",
  offline: "cloud_off"
};
let cache = null;
const clone = () => JSON.parse(JSON.stringify(mockSnapshot$3));
const composeVehicleFix = (serverNow, clock) => {
  const [h = "0", m2 = "0", s = "0"] = clock.split(":");
  const date = new Date(serverNow.getTime());
  date.setHours(Number(h), Number(m2), Number(s), 0);
  return date.toISOString();
};
const stampFleet = (fleet2, serverNow) => fleet2.map((vehicle) => ({
  ...vehicle,
  gps: vehicle.gps,
  updatedAt: composeVehicleFix(serverNow, vehicle.updatedAt)
}));
const advanceFleet = (previous) => previous.map((vehicle) => {
  if (vehicle.status === "offline" || vehicle.status === "maintenance") return { ...vehicle };
  const running = vehicle.status === "moving";
  const fuel = Math.max(0, vehicle.fuelPercent - (running ? 0.1 : 0.02));
  const odometer = Math.round((vehicle.odometerKm + (running ? 0.06 : 0)) * 100) / 100;
  const speed = vehicle.status === "moving" ? Math.max(8, Math.min(78, vehicle.speedKmh + Math.sin(Date.now() / 2e4 + vehicle.odometerKm) * 6)) : 0;
  return { ...vehicle, fuelPercent: Math.round(fuel * 10) / 10, odometerKm: odometer, speedKmh: Math.round(speed) };
});
const fetchFromMock$1 = () => new Promise((resolve) => {
  setTimeout(() => {
    const serverNow = /* @__PURE__ */ new Date();
    if (!cache) cache = clone();
    cache = {
      ...cache,
      meta: { ...cache.meta, generatedAt: serverNow.toISOString() },
      fleet: stampFleet(advanceFleet(cache.fleet), serverNow)
    };
    resolve(JSON.parse(JSON.stringify(cache)));
  }, 130);
});
const fetchDirectorySnapshot = async () => {
  if (!isApiConfigured()) return fetchFromMock$1();
  return apiGet(DIRECTORY_ENDPOINT);
};
const summarizeFleet = (fleet2) => {
  const count = (status) => fleet2.filter((vehicle) => vehicle.status === status).length;
  const totalFuel = fleet2.reduce((sum, vehicle) => sum + vehicle.fuelPercent, 0);
  const totalOdometer = fleet2.reduce((sum, vehicle) => sum + vehicle.odometerKm, 0);
  return {
    totalVehicles: fleet2.length,
    moving: count("moving"),
    idling: count("idling"),
    maintenance: count("maintenance"),
    offline: count("offline"),
    averageFuelPercent: fleet2.length > 0 ? Math.round(totalFuel / fleet2.length * 10) / 10 : 0,
    totalOdometerKm: Math.round(totalOdometer),
    lowFuelCount: fleet2.filter((vehicle) => vehicle.fuelPercent < 20).length
  };
};
const withGeneratedIds = (input) => {
  const serial = Math.floor(1e3 + Math.random() * 9e3);
  return {
    id: `EMP-${serial}`,
    empId: `EMP-${serial}`,
    name: input.name,
    email: input.email || `${input.name.toLowerCase().replace(/\s+/g, ".")}@vanguardops.com`,
    rfidToken: `RFID-${serial}`,
    department: input.department,
    role: input.role || "Field Operator",
    geofence: input.geofence,
    attendanceStatus: "present",
    attendanceTime: "Registered Today",
    locationState: "online",
    locationDetail: "Online (Enrolled)",
    lastPing: "Just now",
    avatar: "",
    gps: null,
    distanceMeters: null,
    updatedAt: (/* @__PURE__ */ new Date()).toISOString()
  };
};
const createEmployee = async (input) => {
  if (!isApiConfigured()) {
    const record = withGeneratedIds(input);
    if (cache) cache = { ...cache, employees: [record, ...cache.employees] };
    return record;
  }
  return apiPost(DIRECTORY_ENDPOINT, input);
};
const updateEmployee = async (id2, input) => {
  if (!isApiConfigured()) {
    if (!cache) return null;
    let updated = null;
    cache = {
      ...cache,
      employees: cache.employees.map((employee) => {
        if (employee.id !== id2) return employee;
        updated = { ...employee, ...input, updatedAt: (/* @__PURE__ */ new Date()).toISOString() };
        return updated;
      })
    };
    return updated;
  }
  return apiPatch(`${DIRECTORY_ENDPOINT}/${encodeURIComponent(id2)}`, input);
};
const deleteEmployee = async (id2) => {
  if (!isApiConfigured()) {
    if (!cache) return false;
    const before = cache.employees.length;
    cache = { ...cache, employees: cache.employees.filter((employee) => employee.id !== id2) };
    return cache.employees.length < before;
  }
  await apiDelete(`${DIRECTORY_ENDPOINT}/${encodeURIComponent(id2)}`);
  return true;
};
const importEmployeesFromCsv = async (text) => {
  const lines = text.split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
  if (lines.length < 2) return { imported: 0, skipped: 0 };
  const splitRow = (row) => {
    const cells = [];
    let current = "";
    let quoted = false;
    for (let i = 0; i < row.length; i += 1) {
      const char = row[i];
      if (char === '"') {
        if (quoted && row[i + 1] === '"') {
          current += '"';
          i += 1;
        } else {
          quoted = !quoted;
        }
      } else if (char === "," && !quoted) {
        cells.push(current);
        current = "";
      } else {
        current += char;
      }
    }
    cells.push(current);
    return cells.map((cell) => cell.trim());
  };
  const header = splitRow(lines[0]).map((cell) => cell.toLowerCase());
  const columnOf = (...names) => header.findIndex((cell) => names.some((name) => cell.includes(name)));
  const nameIdx = columnOf("name");
  const emailIdx = columnOf("email");
  const deptIdx = columnOf("department", "division", "dept");
  const roleIdx = columnOf("role", "title", "position");
  const zoneIdx = columnOf("geofence", "zone", "site");
  if (nameIdx === -1) return { imported: 0, skipped: lines.length - 1 };
  let imported = 0;
  let skipped = 0;
  for (const line of lines.slice(1)) {
    const cells = splitRow(line);
    const name = cells[nameIdx];
    if (!name) {
      skipped += 1;
      continue;
    }
    const record = withGeneratedIds({
      name,
      email: emailIdx >= 0 ? cells[emailIdx] : "",
      department: deptIdx >= 0 && cells[deptIdx] ? cells[deptIdx] : "IT Engineering",
      role: roleIdx >= 0 ? cells[roleIdx] : "Field Operator",
      geofence: zoneIdx >= 0 && cells[zoneIdx] ? cells[zoneIdx] : "HQ Central Hub"
    });
    if (!cache) cache = clone();
    cache = { ...cache, employees: [record, ...cache.employees] };
    imported += 1;
  }
  return { imported, skipped };
};
const vehicleUpdatedAt = (vehicle, offsetMs = 0) => formatTimestamp(vehicle.updatedAt, offsetMs);
const formatOdometer = (km) => `${Math.round(km).toLocaleString("en-US")} km`;
const ALL_DEPARTMENTS = "All Departments";
const ALL_STATUSES = "All Statuses";
const ALL_ZONES = "All Geofence Zones";
const DEFAULT_FILTERS$1 = {
  search: "",
  department: ALL_DEPARTMENTS,
  status: ALL_STATUSES,
  zone: ALL_ZONES
};
const matchesStatus$1 = (employee, status) => {
  if (status === ALL_STATUSES) return true;
  if (status === "Active / On Duty") return employee.locationState === "online";
  if (status === "Late Arrival") return employee.attendanceStatus === "late";
  if (status === "Outside Zone Breach") return employee.locationState === "breach";
  if (status === "On Approved Leave") return employee.attendanceStatus === "leave";
  return true;
};
const matchesZone = (employee, zone) => {
  if (zone === ALL_ZONES) return true;
  return employee.geofence.toLowerCase().includes(zone.toLowerCase().replace(" complex", ""));
};
const matchesSearch = (employee, rawQuery) => {
  const q2 = rawQuery.trim().toLowerCase();
  if (!q2) return true;
  return employee.name.toLowerCase().includes(q2) || employee.empId.toLowerCase().includes(q2) || employee.email.toLowerCase().includes(q2) || employee.department.toLowerCase().includes(q2) || employee.role.toLowerCase().includes(q2);
};
const useEmployeeDirectory = (pollIntervalMs = DIRECTORY_POLL_MS) => {
  const [meta2, setMeta] = reactExports.useState(null);
  const [employees2, setEmployees] = reactExports.useState([]);
  const [fleet2, setFleet] = reactExports.useState([]);
  const [status, setStatus] = reactExports.useState("idle");
  const [error, setError] = reactExports.useState(null);
  const [filters, setFilters] = reactExports.useState(DEFAULT_FILTERS$1);
  const [rowsPerPage, setRowsPerPageState] = reactExports.useState(10);
  const [currentPage, setCurrentPage] = reactExports.useState(1);
  const mountedRef = reactExports.useRef(true);
  const refresh = reactExports.useCallback(async () => {
    try {
      const snapshot = await fetchDirectorySnapshot();
      if (!mountedRef.current) return;
      setMeta(snapshot.meta);
      setEmployees(snapshot.employees);
      setFleet(snapshot.fleet);
      setStatus("ready");
      setError(null);
    } catch (err) {
      if (!mountedRef.current) return;
      setStatus("error");
      setError(err instanceof Error ? err.message : "Failed to load directory");
    }
  }, []);
  reactExports.useEffect(() => {
    mountedRef.current = true;
    void refresh();
    return () => {
      mountedRef.current = false;
    };
  }, [refresh]);
  reactExports.useEffect(() => {
    const poller = window.setInterval(() => {
      void refresh();
    }, pollIntervalMs);
    return () => window.clearInterval(poller);
  }, [refresh, pollIntervalMs]);
  const filteredEmployees = reactExports.useMemo(
    () => employees2.filter(
      (employee) => matchesSearch(employee, filters.search) && (filters.department === ALL_DEPARTMENTS || employee.department === filters.department) && matchesStatus$1(employee, filters.status) && matchesZone(employee, filters.zone)
    ),
    [employees2, filters]
  );
  const pageCount = Math.max(1, Math.ceil(filteredEmployees.length / rowsPerPage));
  const pagedEmployees = reactExports.useMemo(() => {
    const start = (currentPage - 1) * rowsPerPage;
    return filteredEmployees.slice(start, start + rowsPerPage);
  }, [filteredEmployees, currentPage, rowsPerPage]);
  reactExports.useEffect(() => {
    setCurrentPage((page) => Math.min(page, pageCount));
  }, [pageCount]);
  const setSearch = reactExports.useCallback((value) => {
    setFilters((prev) => ({ ...prev, search: value }));
    setCurrentPage(1);
  }, []);
  const patchFilter = reactExports.useCallback((key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setCurrentPage(1);
  }, []);
  const setDepartment = reactExports.useCallback((value) => patchFilter("department", value), [patchFilter]);
  const setStatusFilter = reactExports.useCallback((value) => patchFilter("status", value), [patchFilter]);
  const setZoneFilter = reactExports.useCallback((value) => patchFilter("zone", value), [patchFilter]);
  const resetFilters = reactExports.useCallback(() => {
    setFilters(DEFAULT_FILTERS$1);
    setCurrentPage(1);
  }, []);
  const setRowsPerPage = reactExports.useCallback((value) => {
    setRowsPerPageState(value);
    setCurrentPage(1);
  }, []);
  const addEmployee = reactExports.useCallback(async (input) => {
    const record = await createEmployee(input);
    setEmployees((prev) => [record, ...prev]);
    return record;
  }, []);
  const editEmployee = reactExports.useCallback(async (id2, input) => {
    const updated = await updateEmployee(id2, input);
    if (updated) {
      setEmployees((prev) => prev.map((employee) => employee.id === id2 ? updated : employee));
    }
    return updated;
  }, []);
  const removeEmployee = reactExports.useCallback(async (id2) => {
    const removed = await deleteEmployee(id2);
    if (removed) {
      setEmployees((prev) => prev.filter((employee) => employee.id !== id2));
    }
    return removed;
  }, []);
  const fleetSummary = reactExports.useMemo(() => summarizeFleet(fleet2), [fleet2]);
  return {
    meta: meta2,
    employees: employees2,
    filteredEmployees,
    fleet: fleet2,
    fleetSummary,
    status,
    error,
    filters,
    setSearch,
    setDepartment,
    setStatusFilter,
    setZoneFilter,
    resetFilters,
    rowsPerPage,
    setRowsPerPage,
    currentPage,
    setCurrentPage,
    pageCount,
    pagedEmployees,
    addEmployee,
    editEmployee,
    removeEmployee,
    refresh
  };
};
const VEHICLE_STATUS_DOT = {
  moving: "var(--color-tertiary-fixed)",
  idling: "var(--color-secondary-container)",
  maintenance: "var(--color-outline)",
  offline: "var(--color-error)"
};
const Employees = () => {
  const navigate = useNavigate();
  const {
    meta: meta2,
    filteredEmployees,
    pagedEmployees,
    fleet: fleet2,
    fleetSummary,
    filters,
    setSearch,
    setDepartment,
    setStatusFilter,
    setZoneFilter,
    resetFilters,
    rowsPerPage,
    setRowsPerPage,
    currentPage,
    setCurrentPage,
    pageCount,
    addEmployee,
    editEmployee,
    removeEmployee,
    refresh
  } = useEmployeeDirectory();
  const [selectedIds, setSelectedIds] = reactExports.useState(["EMP-8821", "EMP-9014"]);
  const [showAddModal, setShowAddModal] = reactExports.useState(false);
  const [showProfileModal, setShowProfileModal] = reactExports.useState(null);
  const [editingEmployee, setEditingEmployee] = reactExports.useState(null);
  const [toastMessage, setToastMessage] = reactExports.useState(null);
  const [newEmpName, setNewEmpName] = reactExports.useState("");
  const [newEmpEmail, setNewEmpEmail] = reactExports.useState("");
  const [newEmpDept, setNewEmpDept] = reactExports.useState("IT Engineering");
  const [newEmpRole, setNewEmpRole] = reactExports.useState("");
  const [newEmpZone, setNewEmpZone] = reactExports.useState("HQ Central Hub");
  const [formError, setFormError] = reactExports.useState(null);
  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3e3);
  };
  const toggleSelect = (id2) => {
    if (selectedIds.includes(id2)) {
      setSelectedIds(selectedIds.filter((item) => item !== id2));
    } else {
      setSelectedIds([...selectedIds, id2]);
    }
  };
  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedIds(filteredEmployees.map((emp) => emp.id));
    } else {
      setSelectedIds([]);
    }
  };
  const handleResetFilters = () => {
    resetFilters();
    showToast("Filters reset to default");
  };
  const openCreateModal = () => {
    setEditingEmployee(null);
    setNewEmpName("");
    setNewEmpEmail("");
    setNewEmpDept("IT Engineering");
    setNewEmpRole("");
    setNewEmpZone("HQ Central Hub");
    setFormError(null);
    setShowAddModal(true);
  };
  const openEditModal = (employee) => {
    setEditingEmployee(employee);
    setNewEmpName(employee.name);
    setNewEmpEmail(employee.email);
    setNewEmpDept(employee.department);
    setNewEmpRole(employee.role);
    setNewEmpZone(employee.geofence);
    setFormError(null);
    setShowProfileModal(null);
    setShowAddModal(true);
  };
  const handleAddEmployee = async (e) => {
    e.preventDefault();
    if (!newEmpName.trim()) {
      setFormError("Employee name is required");
      return;
    }
    const input = {
      name: newEmpName,
      email: newEmpEmail,
      department: newEmpDept,
      role: newEmpRole || "Field Operator",
      geofence: newEmpZone
    };
    if (editingEmployee) {
      const updated = await editEmployee(editingEmployee.id, input);
      setShowAddModal(false);
      showToast(
        updated ? `Employee ${updated.name} updated successfully!` : `Update for ${editingEmployee.empId} failed`
      );
      return;
    }
    const record = await addEmployee(input);
    setShowAddModal(false);
    setNewEmpName("");
    setNewEmpEmail("");
    setNewEmpRole("");
    showToast(`Employee ${record.name} added successfully!`);
  };
  const handleDeleteSelected = async () => {
    const ids = [...selectedIds];
    for (const id2 of ids) {
      await removeEmployee(id2);
    }
    setSelectedIds([]);
    showToast(`${ids.length} employee record(s) removed from the directory`);
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "emp-container", children: [
    toastMessage && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "toast-notice", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "material-symbols-outlined icon-md", style: { color: "var(--color-tertiary-fixed)" }, children: "check_circle" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: toastMessage })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "emp-title-canvas", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "emp-title-badge-row", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "emp-ops-pill", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "live-dot", style: { width: 6, height: 6 } }),
            "Ops Telemetry Live"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "emp-sync-id", children: "SYNC-ID: #VF-9041" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "emp-title", children: "Employee Management Directory" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "emp-subtitle", children: [
          "Manage ",
          meta2?.totalHeadcount ?? 0,
          " registered personnel, monitoring permissions, and branch assignments."
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "emp-top-actions", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            className: "emp-btn-top",
            type: "button",
            onClick: () => {
              const picker = document.createElement("input");
              picker.type = "file";
              picker.accept = ".csv,text/csv";
              picker.onchange = async () => {
                const file = picker.files?.[0];
                if (!file) return;
                const result = await importEmployeesFromCsv(await file.text());
                await refresh();
                showToast(
                  `Imported ${result.imported} employee(s)` + (result.skipped > 0 ? ` • ${result.skipped} row(s) skipped` : "")
                );
              };
              picker.click();
            },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "material-symbols-outlined icon-sm", children: "upload_file" }),
              "Import CSV"
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            className: "emp-btn-top",
            type: "button",
            onClick: () => {
              const filename = downloadCsv(
                "vanguard-roster",
                filteredEmployees.map((emp) => ({
                  employee_id: emp.empId,
                  name: emp.name,
                  email: emp.email,
                  rfid_token: emp.rfidToken,
                  department: emp.department,
                  role: emp.role,
                  geofence: emp.geofence,
                  attendance: emp.attendanceTime,
                  location_state: emp.locationDetail,
                  last_ping: emp.lastPing
                }))
              );
              showToast(`Exported ${filteredEmployees.length} roster row(s) → ${filename}`);
            },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "material-symbols-outlined icon-sm", children: "file_download" }),
              "Export Roster"
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            className: "emp-btn-top emp-btn-top-primary",
            type: "button",
            onClick: openCreateModal,
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "material-symbols-outlined icon-sm", children: "person_add" }),
              "Add New Employee"
            ]
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "emp-kpi-grid", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "emp-kpi-card", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "emp-kpi-header", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "emp-kpi-label", children: "Total Headcount" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "emp-kpi-metric-row", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "emp-kpi-metric", children: meta2?.totalHeadcount ?? 0 }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "emp-kpi-unit", children: "Staff Units" })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "emp-kpi-icon-box", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "material-symbols-outlined icon-lg", children: "badge" }) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "emp-kpi-footer-sub", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
            meta2?.fullTime ?? 0,
            " Full-time"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { color: "var(--color-outline)" }, children: "•" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
            meta2?.contractFleet ?? 0,
            " Contract Fleet"
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "emp-kpi-card", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "emp-kpi-header", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "emp-kpi-label", children: "Geofenced Personnel" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "emp-kpi-metric-row", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "emp-kpi-metric", children: meta2?.geofencedPersonnel ?? 0 }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "emp-kpi-unit", style: { color: "var(--color-secondary-container)" }, children: "Assigned" })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "emp-kpi-icon-box", style: { color: "var(--color-secondary)" }, children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "material-symbols-outlined icon-lg", children: "share_location" }) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "emp-progress-wrap", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "emp-progress-label-row", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { color: "var(--color-on-surface-variant)" }, children: "Zone Integrity" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { style: { color: "var(--color-primary)", fontWeight: 600 }, children: [
              meta2?.zoneIntegrityPercent ?? 0,
              "%"
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "emp-progress-track", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "emp-progress-bar", style: { width: `${meta2?.zoneIntegrityPercent ?? 0}%` } }) })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "emp-kpi-card", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "emp-kpi-header", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "emp-kpi-label", children: "Remote / Field Fleet" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "emp-kpi-metric-row", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "emp-kpi-metric", children: meta2?.remoteFieldFleet ?? 0 }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "emp-kpi-unit", style: { color: "var(--color-on-surface-variant)" }, children: "Active Units" })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "emp-kpi-icon-box", style: { color: "var(--color-secondary-container)" }, children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "material-symbols-outlined icon-lg", children: "route" }) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", alignItems: "center", gap: 8, fontSize: "var(--fs-body-sm)", color: "var(--color-on-surface-variant)" }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "live-dot", style: { width: 7, height: 7 } }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Mobile GPS Uplink Connected" })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "emp-kpi-card card-dark", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "emp-kpi-header", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "emp-kpi-label", children: "Device Fleet Health" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "emp-kpi-metric-row", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "emp-kpi-metric", children: [
              meta2?.deviceHealthPercent ?? 0,
              "%"
            ] }) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              style: {
                display: "inline-flex",
                alignItems: "center",
                gap: 4,
                padding: "4px 8px",
                borderRadius: "var(--radius-full)",
                background: "rgba(222, 224, 255, 0.15)",
                color: "var(--color-tertiary-fixed)",
                fontSize: 11,
                fontWeight: 700
              },
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "live-dot", style: { width: 5, height: 5 } }),
                "OPTIMAL"
              ]
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", alignItems: "center", justifyContent: "space-between", fontSize: "var(--fs-body-sm)", color: "var(--color-surface-dim)" }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Active Pings (Telemetry)" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { style: { color: "var(--color-tertiary-fixed)", fontWeight: 600 }, children: [
            meta2?.activePings ?? 0,
            "/",
            meta2?.totalDevices ?? 0,
            " OK"
          ] })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "emp-filter-bar", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "emp-search-wrap", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "material-symbols-outlined icon-md emp-search-icon", children: "search" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "input",
          {
            type: "text",
            className: "emp-search-input",
            placeholder: "Search by employee name, ID, email, or department...",
            value: filters.search,
            onChange: (e) => setSearch(e.target.value)
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "emp-select-group", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "emp-select-wrap", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "select",
            {
              className: "emp-select",
              value: filters.department,
              onChange: (e) => setDepartment(e.target.value),
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { children: "All Departments" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { children: "IT Engineering" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { children: "Design & Product" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { children: "Growth Marketing" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { children: "Finance & Control" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { children: "HR & People Ops" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { children: "Client Ops / Field" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { children: "Supply Chain" })
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "material-symbols-outlined icon-sm emp-select-arrow", children: "expand_more" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "emp-select-wrap", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "select",
            {
              className: "emp-select",
              value: filters.status,
              onChange: (e) => setStatusFilter(e.target.value),
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { children: "All Statuses" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { children: "Active / On Duty" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { children: "Late Arrival" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { children: "Outside Zone Breach" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { children: "On Approved Leave" })
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "material-symbols-outlined icon-sm emp-select-arrow", children: "expand_more" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "emp-select-wrap", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "select",
            {
              className: "emp-select",
              value: filters.zone,
              onChange: (e) => setZoneFilter(e.target.value),
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { children: "All Geofence Zones" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { children: "HQ Central Hub" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { children: "South Hub" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { children: "Field Mobile Unit" })
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "material-symbols-outlined icon-sm emp-select-arrow", children: "expand_more" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            className: "emp-btn-reset-filters",
            type: "button",
            title: "Reset Filters",
            onClick: handleResetFilters,
            children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "material-symbols-outlined icon-md", children: "filter_list_off" })
          }
        )
      ] })
    ] }),
    selectedIds.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "emp-selection-bar", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "emp-selection-left", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "emp-selection-badge", children: selectedIds.length }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontSize: "var(--fs-label-md)", fontWeight: 600 }, children: "Personnel records currently selected" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "emp-selection-actions", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            className: "emp-btn-selection",
            type: "button",
            onClick: () => showToast(`Assigning geofence boundary to ${selectedIds.length} employees`),
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "material-symbols-outlined icon-sm", children: "share_location" }),
              "Assign Geofence"
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            className: "emp-btn-selection",
            type: "button",
            onClick: () => showToast(`Exported CSV for ${selectedIds.length} selected employees`),
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "material-symbols-outlined icon-sm", children: "download" }),
              "Export Selected"
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            className: "emp-btn-selection btn-deactivate",
            type: "button",
            onClick: handleDeleteSelected,
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "material-symbols-outlined icon-sm", children: "block" }),
              "Deactivate"
            ]
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "emp-table-container", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "emp-table-wrapper", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "emp-table", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { style: { width: 44, textAlign: "center" }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            "input",
            {
              type: "checkbox",
              checked: filteredEmployees.length > 0 && filteredEmployees.every((emp) => selectedIds.includes(emp.id)),
              onChange: handleSelectAll,
              style: { cursor: "pointer", accentColor: "var(--color-primary-container)" }
            }
          ) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { children: "Employee Name" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { children: "ID & Telemetry Token" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { children: "Dept & Role" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { children: "Assigned Geofence" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { children: "Today Attendance" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { children: "Live Location State" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { children: "Last Ping" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { style: { textAlign: "right" }, children: "Actions" })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: pagedEmployees.map((emp) => {
          const isChecked = selectedIds.includes(emp.id);
          const isBreach = emp.locationState === "breach";
          const isField = emp.locationState === "field";
          const isLeave = emp.attendanceStatus === "leave";
          return /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: isChecked ? "row-selected" : "", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { style: { textAlign: "center" }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              "input",
              {
                type: "checkbox",
                checked: isChecked,
                onChange: () => toggleSelect(emp.id),
                style: { cursor: "pointer", accentColor: "var(--color-primary-container)" }
              }
            ) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "emp-cell-person", children: [
              emp.avatar ? /* @__PURE__ */ jsxRuntimeExports.jsx(
                "img",
                {
                  src: emp.avatar,
                  alt: emp.name,
                  className: "emp-table-avatar",
                  onError: (e) => {
                    e.target.style.display = "none";
                    const fb2 = e.target.nextElementSibling;
                    if (fb2) fb2.style.display = "flex";
                  }
                }
              ) : null,
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  className: "emp-table-avatar-fallback",
                  style: { display: emp.avatar ? "none" : "flex" },
                  children: emp.name.split(" ").map((n2) => n2[0]).join("")
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "emp-person-meta", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "emp-person-name", children: emp.name }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "emp-person-email", children: emp.email })
              ] })
            ] }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "emp-cell-token", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "emp-token-id", children: emp.empId }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "emp-token-rfid", children: emp.rfidToken })
            ] }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "emp-cell-dept", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "emp-dept-title", children: emp.department }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "emp-role-sub", children: emp.role })
            ] }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: `emp-geofence-tag ${isField ? "field-tag" : ""}`, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "material-symbols-outlined icon-sm", style: { color: isField ? "var(--color-secondary-container)" : "var(--color-primary)" }, children: isField ? "navigation" : "corporate_fare" }),
              emp.geofence
            ] }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: `emp-att-badge ${emp.attendanceStatus}`, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "span",
                {
                  className: "live-dot",
                  style: {
                    width: 6,
                    height: 6,
                    display: isLeave ? "none" : "inline-flex"
                  }
                }
              ),
              emp.attendanceTime
            ] }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { children: isBreach ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "emp-loc-state breach", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "material-symbols-outlined icon-sm", children: "warning" }),
              emp.locationDetail
            ] }) : isField ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "emp-loc-state field", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "material-symbols-outlined icon-sm", children: "near_me" }),
              emp.locationDetail
            ] }) : isLeave ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "emp-loc-state leave", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "live-dot", style: { width: 6, height: 6, background: "var(--color-outline)" } }),
              emp.locationDetail
            ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "emp-loc-state online", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "live-dot", style: { width: 6, height: 6 } }),
              emp.locationDetail
            ] }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { style: { color: "var(--color-outline)", fontFeatureSettings: '"tnum" 1' }, children: emp.lastPing }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "emp-row-actions", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  className: `emp-btn-action ${isBreach ? "alert-btn" : "radar-btn"}`,
                  type: "button",
                  title: isBreach ? "Inspect Breach Radar" : "Live Radar Track",
                  onClick: () => navigate("/live-monitoring"),
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "material-symbols-outlined icon-md", children: isBreach ? "fmd_bad" : "radar" })
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  className: "emp-btn-action",
                  type: "button",
                  title: "View Profile",
                  onClick: () => setShowProfileModal(emp),
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "material-symbols-outlined icon-md", children: "visibility" })
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  className: "emp-btn-action",
                  type: "button",
                  title: "Edit Employee",
                  onClick: () => openEditModal(emp),
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "material-symbols-outlined icon-md", children: "edit" })
                }
              )
            ] }) })
          ] }, emp.id);
        }) })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "emp-pagination-footer", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "emp-pag-left", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
            "Showing ",
            /* @__PURE__ */ jsxRuntimeExports.jsxs("strong", { children: [
              filteredEmployees.length === 0 ? 0 : (currentPage - 1) * rowsPerPage + 1,
              " - ",
              (currentPage - 1) * rowsPerPage + pagedEmployees.length
            ] }),
            " of ",
            /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: meta2?.totalHeadcount ?? 0 }),
            " employees"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", alignItems: "center", gap: 6 }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { color: "var(--color-outline)" }, children: "Rows per page:" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "select",
              {
                className: "emp-pag-select",
                value: String(rowsPerPage),
                onChange: (e) => setRowsPerPage(Number(e.target.value)),
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("option", { children: "8" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("option", { children: "10" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("option", { children: "25" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("option", { children: "50" })
                ]
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "emp-pag-right", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              className: "emp-btn-page",
              type: "button",
              disabled: currentPage === 1,
              style: { opacity: currentPage === 1 ? 0.4 : 1 },
              onClick: () => setCurrentPage(Math.max(1, currentPage - 1)),
              children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "material-symbols-outlined icon-sm", children: "chevron_left" })
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              className: `emp-btn-page ${currentPage === 1 ? "active" : ""}`,
              type: "button",
              onClick: () => setCurrentPage(1),
              children: "1"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              className: `emp-btn-page ${currentPage === 2 ? "active" : ""}`,
              type: "button",
              onClick: () => setCurrentPage(2),
              disabled: pageCount < 2,
              style: pageCount < 2 ? { opacity: 0.4 } : void 0,
              children: "2"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              className: `emp-btn-page ${currentPage === 3 ? "active" : ""}`,
              type: "button",
              onClick: () => setCurrentPage(3),
              disabled: pageCount < 3,
              style: pageCount < 3 ? { opacity: 0.4 } : void 0,
              children: "3"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { padding: "0 4px", color: "var(--color-outline)" }, children: "..." }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              className: "emp-btn-page",
              type: "button",
              onClick: () => setCurrentPage(pageCount),
              disabled: pageCount < 4,
              style: pageCount < 4 ? { opacity: 0.4 } : void 0,
              children: pageCount
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              className: "emp-btn-page",
              type: "button",
              onClick: () => setCurrentPage(Math.min(pageCount, currentPage + 1)),
              disabled: currentPage >= pageCount,
              style: currentPage >= pageCount ? { opacity: 0.4 } : void 0,
              children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "material-symbols-outlined icon-sm", children: "chevron_right" })
            }
          )
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "emp-bottom-grid", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "emp-bottom-card", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "emp-bottom-header", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { className: "emp-bottom-title", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "material-symbols-outlined icon-md", style: { color: "var(--color-primary)" }, children: "local_shipping" }),
            "Fleet Status Matrix"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { style: { fontSize: 11, fontWeight: 700, padding: "2px 8px", borderRadius: "var(--radius-sm)", background: "var(--color-surface-container)", color: "var(--color-outline)" }, children: [
            fleetSummary.totalVehicles,
            " UNITS"
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "emp-bottom-desc", children: [
          fleetSummary.moving,
          " moving, ",
          fleetSummary.idling,
          " idling, ",
          fleetSummary.maintenance,
          " in maintenance, ",
          fleetSummary.offline,
          " offline across the registered fleet."
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", alignItems: "center", justifyContent: "space-between", fontSize: "var(--fs-label-sm)" }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { style: { fontWeight: 600, color: "var(--color-on-surface)" }, children: [
            fleetSummary.totalOdometerKm.toLocaleString("en-US"),
            " km fleet mileage"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { style: { fontWeight: 600, color: fleetSummary.lowFuelCount > 0 ? "var(--color-error)" : "var(--color-primary)" }, children: [
            fleetSummary.lowFuelCount,
            " Low Fuel"
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "emp-bottom-card", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "emp-bottom-header", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { className: "emp-bottom-title", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "material-symbols-outlined icon-md", style: { color: "var(--color-secondary-container)" }, children: "local_gas_station" }),
            "Fuel Telemetry Average"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "live-dot", style: { width: 7, height: 7 } })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "emp-bottom-desc", children: "Average fuel level across all units, sampled from the vehicle telematics feed." }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", alignItems: "center", gap: 8, fontSize: "var(--fs-label-sm)" }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { style: { fontWeight: 600, color: "var(--color-on-surface)", fontFamily: "var(--font-body)", fontFeatureSettings: '"tnum" 1' }, children: [
            fleetSummary.averageFuelPercent,
            "%"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "emp-progress-track", style: { flex: 1 }, children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "emp-progress-bar", style: { width: `${fleetSummary.averageFuelPercent}%` } }) })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "emp-bottom-card card-dark", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "emp-bottom-header", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { className: "emp-bottom-title", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "material-symbols-outlined icon-md", style: { color: "var(--color-tertiary-fixed)" }, children: "gps_fixed" }),
            "Latest Position Fix"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontSize: 11, fontWeight: 700, padding: "2px 8px", borderRadius: "var(--radius-sm)", background: "rgba(215, 243, 45, 0.15)", color: "var(--color-tertiary-fixed)" }, children: "GPS" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "emp-bottom-desc", children: fleet2.length > 0 ? `${fleet2[0].plate} reported ${formatGpsCoordinate(fleet2[0].gps.lat, fleet2[0].gps.lng)} at ${vehicleUpdatedAt(fleet2[0])}.` : "No vehicle position received yet." }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", alignItems: "center", justifyContent: "space-between", fontSize: "var(--fs-label-sm)" }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { color: "var(--color-outline)" }, children: "Active Telematics Nodes" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { style: { fontWeight: 600, color: "var(--color-tertiary-fixed)" }, children: [
            fleet2.filter((v2) => v2.status !== "offline").length,
            "/",
            fleet2.length
          ] })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "emp-table-container", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "emp-table-wrapper", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "emp-table", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { children: "Vehicle & Plate" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { children: "Status" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { children: "Driver" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { children: "Fuel Level" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { children: "Odometer / Speed" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { children: "Assigned Geofence" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { children: "Last Known Location" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { children: "Location Update" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { style: { textAlign: "right" }, children: "Actions" })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: fleet2.map((vehicle) => /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "emp-cell-token", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "emp-token-id", children: vehicle.plate }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "emp-token-rfid", children: vehicle.model })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: VEHICLE_STATUS_BADGE[vehicle.status], children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "material-symbols-outlined", style: { fontSize: 12 }, children: VEHICLE_STATUS_ICON[vehicle.status] }),
          VEHICLE_STATUS_LABEL[vehicle.status]
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "emp-cell-dept", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "emp-dept-title", children: vehicle.driver }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "emp-role-sub", children: vehicle.id })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", flexDirection: "column", gap: 4, minWidth: 96 }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { style: { fontSize: "var(--fs-label-sm)", fontWeight: 600, color: vehicle.fuelPercent < 20 ? "var(--color-error)" : "var(--color-on-surface)", fontFeatureSettings: '"tnum" 1' }, children: [
            vehicle.fuelPercent,
            "%"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "emp-progress-track", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: "emp-progress-bar",
              style: { width: `${vehicle.fuelPercent}%`, background: vehicle.fuelPercent < 20 ? "var(--color-error)" : "var(--color-primary)" }
            }
          ) })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "emp-cell-token", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "emp-token-id", children: formatOdometer(vehicle.odometerKm) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "emp-token-rfid", children: [
            vehicle.speedKmh,
            " km/h"
          ] })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "emp-geofence-tag", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "material-symbols-outlined icon-sm", style: { color: "var(--color-primary)" }, children: "corporate_fare" }),
          vehicle.geofence
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", flexDirection: "column" }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "emp-loc-state online", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "span",
              {
                className: "live-dot",
                style: { width: 6, height: 6, background: VEHICLE_STATUS_DOT[vehicle.status] }
              }
            ),
            vehicle.gps.lat.toFixed(4),
            ", ",
            vehicle.gps.lng.toFixed(4)
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { style: { fontSize: 11, color: "var(--color-outline)", fontFeatureSettings: '"tnum" 1' }, children: [
            "±",
            vehicle.gps.accuracy,
            "m accuracy"
          ] })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { style: { color: "var(--color-outline)", fontFeatureSettings: '"tnum" 1' }, children: vehicleUpdatedAt(vehicle) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "emp-row-actions", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              className: "emp-btn-action radar-btn",
              type: "button",
              title: "Ping Vehicle Telematics",
              onClick: () => showToast(`High-frequency GPS ping sent to ${vehicle.plate}`),
              children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "material-symbols-outlined icon-md", children: "radar" })
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              className: `emp-btn-action ${vehicle.status === "offline" ? "alert-btn" : ""}`,
              type: "button",
              title: "View Vehicle Telemetry",
              onClick: () => showToast(`${vehicle.plate}: ${vehicle.fuelPercent}% fuel, ${vehicle.odometerKm.toLocaleString("en-US")} km, ${VEHICLE_STATUS_LABEL[vehicle.status]}`),
              children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "material-symbols-outlined icon-md", children: "visibility" })
            }
          )
        ] }) })
      ] }, vehicle.id)) })
    ] }) }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "emp-bottom-grid", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "emp-bottom-card", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "emp-bottom-header", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { className: "emp-bottom-title", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "material-symbols-outlined icon-md", style: { color: "var(--color-primary)" }, children: "security" }),
            "Zone Verification Status"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontSize: 11, fontWeight: 700, padding: "2px 8px", borderRadius: "var(--radius-sm)", background: "var(--color-surface-container)", color: "var(--color-outline)" }, children: "LIVE" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "emp-bottom-desc", children: [
          meta2?.verifiedShiftPercent ?? 0,
          "% of logged shifts are currently verified inside authenticated boundaries."
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", alignItems: "center", justifyContent: "space-between", fontSize: "var(--fs-label-sm)" }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { style: { fontWeight: 600, color: "var(--color-on-surface)" }, children: [
            meta2?.verifiedInside ?? 0,
            " Verified Inside"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { style: { fontWeight: 600, color: "var(--color-error)" }, children: [
            meta2?.perimeterBreaches ?? 0,
            " Perimeter Breaches"
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "emp-bottom-card", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "emp-bottom-header", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { className: "emp-bottom-title", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "material-symbols-outlined icon-md", style: { color: "var(--color-secondary-container)" }, children: "bolt" }),
            "Auto-Geofence Sync"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "live-dot", style: { width: 7, height: 7 } })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "emp-bottom-desc", children: "Sub-second delta checks are executing on Jakarta HQ & Surabaya regional gates." }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", alignItems: "center", justifyContent: "space-between", fontSize: "var(--fs-label-sm)" }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { color: "var(--color-outline)" }, children: "Heartbeat Latency" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { style: { fontWeight: 600, color: "var(--color-on-surface)" }, children: [
            meta2?.heartbeatLatencyMs ?? 0,
            "ms avg"
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "emp-bottom-card card-dark", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "emp-bottom-header", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { className: "emp-bottom-title", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "material-symbols-outlined icon-md", style: { color: "var(--color-tertiary-fixed)" }, children: "emergency" }),
            "Priority Protocol"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontSize: 11, fontWeight: 700, padding: "2px 8px", borderRadius: "var(--radius-sm)", background: "rgba(215, 243, 45, 0.15)", color: "var(--color-tertiary-fixed)" }, children: "READY" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "emp-bottom-desc", children: "Broadcast muster roll or instant push-notification alert to all active personnel in case of incident." }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            className: "emp-btn-rollcall",
            type: "button",
            onClick: () => showToast("Muster roll alert broadcasted to all active personnel"),
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "material-symbols-outlined icon-sm", style: { color: "var(--color-tertiary-fixed)" }, children: "crisis_alert" }),
              "Initiate Zone Roll Call"
            ]
          }
        )
      ] })
    ] }),
    showAddModal && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "emp-modal-backdrop", onClick: () => setShowAddModal(false), children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "emp-modal-card", onClick: (e) => e.stopPropagation(), children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "emp-modal-header", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "emp-modal-title", children: editingEmployee ? "Edit Employee" : "Add New Employee" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            type: "button",
            className: "telemetry-tool-btn",
            onClick: () => setShowAddModal(false),
            children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "material-symbols-outlined icon-md", children: "close" })
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleAddEmployee, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "emp-modal-body", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "emp-form-group", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "emp-form-label", children: "Full Name" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "input",
              {
                type: "text",
                className: "emp-form-input",
                placeholder: "e.g. Hendra Wijaya",
                required: true,
                value: newEmpName,
                onChange: (e) => setNewEmpName(e.target.value)
              }
            ),
            formError && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "emp-form-label", style: { color: "var(--color-error)" }, children: formError })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "emp-form-group", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "emp-form-label", children: "Corporate Email" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "input",
              {
                type: "email",
                className: "emp-form-input",
                placeholder: "h.wijaya@vanguardops.com",
                value: newEmpEmail,
                onChange: (e) => setNewEmpEmail(e.target.value)
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "emp-form-group", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "emp-form-label", children: "Department" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "select",
              {
                className: "emp-form-select",
                value: newEmpDept,
                onChange: (e) => setNewEmpDept(e.target.value),
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("option", { children: "IT Engineering" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("option", { children: "Design & Product" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("option", { children: "Growth Marketing" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("option", { children: "Finance & Control" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("option", { children: "HR & People Ops" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("option", { children: "Client Ops / Field" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("option", { children: "Supply Chain" })
                ]
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "emp-form-group", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "emp-form-label", children: "Job Role / Title" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "input",
              {
                type: "text",
                className: "emp-form-input",
                placeholder: "e.g. Senior Security Auditor",
                value: newEmpRole,
                onChange: (e) => setNewEmpRole(e.target.value)
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "emp-form-group", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "emp-form-label", children: "Assigned Geofence" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "select",
              {
                className: "emp-form-select",
                value: newEmpZone,
                onChange: (e) => setNewEmpZone(e.target.value),
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("option", { children: "HQ Central Hub" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("option", { children: "South Hub" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("option", { children: "Field Mobile Unit" })
                ]
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "emp-modal-footer", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              className: "btn btn-secondary",
              onClick: () => setShowAddModal(false),
              children: "Cancel"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "submit", className: "btn btn-primary", children: editingEmployee ? "Update & Save" : "Save & Enroll" })
        ] })
      ] })
    ] }) }),
    showProfileModal && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "emp-modal-backdrop", onClick: () => setShowProfileModal(null), children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "emp-modal-card", onClick: (e) => e.stopPropagation(), children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "emp-modal-header", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "emp-modal-title", children: "Employee Profile" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            type: "button",
            className: "telemetry-tool-btn",
            onClick: () => setShowProfileModal(null),
            children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "material-symbols-outlined icon-md", children: "close" })
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "emp-modal-body", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", alignItems: "center", gap: 14 }, children: [
          showProfileModal.avatar ? /* @__PURE__ */ jsxRuntimeExports.jsx(
            "img",
            {
              src: showProfileModal.avatar,
              alt: showProfileModal.name,
              style: { width: 56, height: 56, borderRadius: "50%", objectFit: "cover" }
            }
          ) : /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              style: {
                width: 56,
                height: 56,
                borderRadius: "50%",
                background: "var(--color-surface-container-high)",
                color: "var(--color-primary)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: 700,
                fontSize: 18
              },
              children: showProfileModal.name.split(" ").map((n2) => n2[0]).join("")
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { style: { margin: 0, fontSize: "var(--fs-title-md)", fontWeight: 700 }, children: showProfileModal.name }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontSize: "var(--fs-body-sm)", color: "var(--color-outline)" }, children: showProfileModal.email }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", gap: 6, marginTop: 4 }, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "telemetry-badge-id", children: showProfileModal.empId }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "telemetry-dept", children: showProfileModal.rfidToken })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginTop: 10 }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { padding: 10, background: "var(--color-surface-container-low)", borderRadius: "var(--radius-base)" }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontSize: 11, color: "var(--color-outline)", display: "block" }, children: "Department" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { style: { fontSize: 13 }, children: showProfileModal.department })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { padding: 10, background: "var(--color-surface-container-low)", borderRadius: "var(--radius-base)" }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontSize: 11, color: "var(--color-outline)", display: "block" }, children: "Role" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { style: { fontSize: 13 }, children: showProfileModal.role })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { padding: 10, background: "var(--color-surface-container-low)", borderRadius: "var(--radius-base)" }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontSize: 11, color: "var(--color-outline)", display: "block" }, children: "Assigned Zone" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { style: { fontSize: 13 }, children: showProfileModal.geofence })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { padding: 10, background: "var(--color-surface-container-low)", borderRadius: "var(--radius-base)" }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontSize: 11, color: "var(--color-outline)", display: "block" }, children: "Live Status" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { style: { fontSize: 13 }, children: showProfileModal.locationDetail })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "emp-modal-footer", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            type: "button",
            className: "btn btn-secondary",
            onClick: () => setShowProfileModal(null),
            children: "Close"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            type: "button",
            className: "btn btn-primary",
            onClick: () => {
              setShowProfileModal(null);
              navigate("/live-monitoring");
            },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "material-symbols-outlined icon-sm", children: "radar" }),
              "Track on Radar"
            ]
          }
        )
      ] })
    ] }) })
  ] });
};
const meta = {
  generatedAt: "2024-10-24T10:42:31+07:00",
  expectedShiftStart: "08:00",
  gracePeriodMinutes: 15,
  totalEmployees: 128,
  organizationCounts: {
    present: 92,
    late: 12,
    absent: 18,
    leave: 6
  },
  punctualityScore: 89.6,
  punctualityTrendPercent: 0,
  attendanceRatePercent: 81.25,
  attendanceRateTrendPercent: 4.2,
  avgCheckInLabel: "08:09 AM",
  workHoursLogged: 682.5,
  workHoursExpected: 832
};
const sites = [
  {
    id: "hq-lobby-gate-2",
    name: "HQ Lobby Gate 2",
    lat: -6.1465,
    lng: 106.8451,
    radiusMeters: 100
  },
  {
    id: "hq-north-terminal",
    name: "HQ North Terminal",
    lat: -6.1458,
    lng: 106.846,
    radiusMeters: 100
  },
  {
    id: "substation-4",
    name: "Remote Substation #4",
    lat: 35.4871,
    lng: -119.0125,
    radiusMeters: 250
  },
  {
    id: "substation-east",
    name: "Substation East Grid",
    lat: -6.1472,
    lng: 106.8475,
    radiusMeters: 100
  },
  {
    id: "dock-14",
    name: "Dock 14 Inbound",
    lat: -6.1462,
    lng: 106.8449,
    radiusMeters: 100
  },
  {
    id: "hq-core",
    name: "HQ Core",
    lat: -6.1461,
    lng: 106.8456,
    radiusMeters: 100
  }
];
const records = [
  {
    dayOffset: 0,
    empId: "EMP-88410",
    name: "Marcus Vance",
    avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuBMf5XuXsjmn1aZ2rgUkQLb70gbStLzdjyTf5TcutNDc1g_ArUvkVEN3gtOURUimEkCELlGrQdqaddTmBDzq_ATZyE0Jx7Es2V8xl_8KiaPbeU6e06tdoARl4-TzBd_puUUz8N0FOr5wbv1n4fv7M55r3vV4bZa0JKjjJpUDDrq0ndtqnameBZi4fhJsd7HQ7BOQZy28swIe8Sk6TNs3LKGwQ_ottTppzZxdO8zKiw",
    department: "Field Logistics",
    shiftName: "Shift Alpha",
    shiftSchedule: "08:00 – 17:00",
    clockIn: "07:54:12",
    clockOut: null,
    durationMinutes: 168,
    checkinMethod: "Facial Match 99.4%",
    checkinMethodIcon: "face",
    statusType: "present",
    statusLabel: "Present",
    siteId: "hq-lobby-gate-2",
    locationDistance: "38m from core (Pass)",
    verifType: "match",
    verifLabel: "GPS Geofence Match",
    verifIcon: "verified_user",
    coords: {
      lat: -6.1465,
      lng: 106.8451,
      accuracy: 2.4
    },
    distanceMeters: 38,
    insideFence: true,
    toleranceRadius: "100m",
    varianceDetail: "38m radius match",
    terminalNode: "HQ Lobby Gate 2",
    deviceBatterySignal: "91% • 5G (LTE Band 7)",
    livenessPassed: true,
    shaProof: "SHA256: 8f4b...199a Verified",
    notes: "Facial Biometric & Telemetry Verified"
  },
  {
    dayOffset: 0,
    empId: "EMP-90214",
    name: "Dr. Aris Thorne",
    avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuADk4G9caec8jgJfkidSvZOBKE5QQmKZm048n8kVk8Yp5jhReA4dgVHz1MAonUb4Mu6H8OzcP3qrA9QTm4Vi4wl6qO8JybNc-coPUpjOe5CYx8YKrifeoMa4jEU2NUR0fN71nzoK7hn8YK7W-STe9o-0nc7AAO-TAx4S68--G8GaWBCU_mStU9y1bK41rb1he9jXddg_s9l2s13yvfh-P2wd_j8FBzgVj1EBa1LoU8",
    department: "Facility Safety",
    shiftName: "Shift Alpha",
    shiftSchedule: "08:00 – 17:00",
    clockIn: "08:24:05",
    clockOut: null,
    durationMinutes: 138,
    checkinMethod: "Facial Match 98.7%",
    checkinMethodIcon: "face",
    statusType: "late",
    statusLabel: "Late (24m)",
    siteId: "hq-north-terminal",
    locationDistance: "14m from core (Pass)",
    verifType: "match",
    verifLabel: "GPS Geofence Match",
    verifIcon: "verified_user",
    coords: {
      lat: -6.1458,
      lng: 106.846,
      accuracy: 3.1
    },
    distanceMeters: 14,
    insideFence: true,
    toleranceRadius: "100m",
    varianceDetail: "14m radius match",
    terminalNode: "HQ North Terminal",
    deviceBatterySignal: "84% • 5G",
    livenessPassed: true,
    shaProof: "SHA256: 3c1a...772d Verified",
    notes: "Late arrival verification submitted"
  },
  {
    dayOffset: 0,
    empId: "EMP-77149",
    name: "Devon Castillo",
    avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuBgRNo9UykegK93szuH71CNb1wFojKlB9somJzqKufizg4eXGLr3wo10HB9Xq4k4_AUymNGtZenSkCze2afDIbHRBAHi8bnfiER2CZrgjMt8t54ZKvpb3Jp9I2Y2HGDOq8ezF62qhguCPFWZ1gbe5rsMpAjO34u5ON3GZpy_y670jp04WEINoRMgiyP0EBAIIaZbdyfRX2B_xZff3tBm3xSDUT2FAkmM-sehOCql1E",
    department: "Field Engineering",
    shiftName: "Remote Patrol Beta",
    shiftSchedule: "07:00 – 16:00",
    clockIn: "06:58:30",
    clockOut: null,
    durationMinutes: 224,
    checkinMethod: "Satellite Ping",
    checkinMethodIcon: "cell_tower",
    statusType: "present",
    statusLabel: "Present",
    siteId: "substation-4",
    locationDistance: "35.4871, -119.0125",
    verifType: "remote",
    verifLabel: "Remote GPS Verified",
    verifIcon: "cloud_done",
    coords: {
      lat: 35.4871,
      lng: -119.0125,
      accuracy: 5
    },
    distanceMeters: 0,
    insideFence: true,
    toleranceRadius: "250m",
    varianceDetail: "Coordinates matched perimeter boundary",
    terminalNode: "Substation Zone #4",
    deviceBatterySignal: "78% • SatLink High Gain",
    livenessPassed: true,
    shaProof: "SHA256: 9e0b...4411 Verified",
    notes: "Satellite GPS telemetry + Biometric check"
  },
  {
    dayOffset: 0,
    empId: "EMP-65302",
    name: "Kavita Narang",
    avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuAxvS7kjBINV8Uvh6gEWDns7A8X5CeSk41H0NzjYFI9P4PC-ahywimMeb6G58r2l4FrK_OTc7oj12dqQKP7bzCGft4Ca2wX5oLSqZF29jrmYxc9knw27aGKMzLYxCWNWWZXGgH-9vvhcjmFQ-P9vaKjlixLG6NH2kEJK_lVl1dYZgVRh64Q6ulITIyy2Ah8cO_ucQkWgU4002uOP4TKZhNbg5pP6ik8aU_2ofB2kjo",
    department: "Site Logistics",
    shiftName: "Shift Alpha",
    shiftSchedule: "08:00 – 17:00",
    clockIn: "08:02:19",
    clockOut: null,
    durationMinutes: 160,
    checkinMethod: "Photo Skipped",
    checkinMethodIcon: "no_photography",
    statusType: "breach",
    statusLabel: "Breach Flagged",
    siteId: "hq-core",
    locationName: "External GPS Point",
    locationDistance: "420m outside geofence",
    verifType: "pending",
    verifLabel: "Pending Review",
    verifIcon: "warning",
    coords: {
      lat: -6.1512,
      lng: 106.8495,
      accuracy: 8.7
    },
    distanceMeters: 420,
    insideFence: false,
    toleranceRadius: "100m",
    varianceDetail: "420m outside assigned HQ fence radius",
    terminalNode: "External Coordinate Breach",
    deviceBatterySignal: "65% • 4G LTE",
    livenessPassed: false,
    shaProof: "SHA256: Invalid Hash (Drift Anomaly)",
    notes: "High Drift Anomaly - Biometric not matching device footprint"
  },
  {
    dayOffset: 0,
    empId: "EMP-33108",
    name: "Lucas Brandt",
    avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuDNgCjDfCdPPKgX86dmFetVliyg5bksXf-wMUi4elqu4AUD-dyEoUXNjgaqNQLx1ZeA2N2krdTwi7vp97sJMJJdzkCq28xr4IFikJZ9KSfI5LqY5y8uQc9sdhdnN6SF9IgYLowceun44UcGmSHhm5FdRXX1ed3wKupcUTuRgs0rU9bc2TAa4kVEkX2H0sgnAIrCoLsHvDSCgI1d23tIGQjD5WWb_XwPnBeKt83WV8Q",
    department: "Site Logistics",
    shiftName: "Shift Alpha",
    shiftSchedule: "08:00 – 17:00",
    clockIn: "08:00:00",
    clockOut: null,
    durationMinutes: 162,
    checkinMethod: "Override Pass",
    checkinMethodIcon: "admin_panel_settings",
    statusType: "present",
    statusLabel: "Present",
    siteId: "dock-14",
    locationDistance: "Supervisor Manual Sig",
    verifType: "override",
    verifLabel: "Manual Override",
    verifIcon: "rule",
    coords: {
      lat: -6.1462,
      lng: 106.8449,
      accuracy: 4.2
    },
    distanceMeters: null,
    insideFence: true,
    toleranceRadius: "100m",
    varianceDetail: "Manual override by Director Sarah Jenkins",
    terminalNode: "Dock 14 Inbound",
    deviceBatterySignal: "92% • WiFi 6",
    livenessPassed: true,
    shaProof: "AUTH: Override-Sig #ADMIN-SJ-99",
    notes: "Biometric scanner hardware failure at Gate C"
  },
  {
    dayOffset: 0,
    empId: "EMP-11942",
    name: "Ananya Rao",
    avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuCuNCNSXA15_y5k7Lu_rvoi8EhcIWUdRqaR866HGl9TtZRQtCQGzPk1QoGRtUzPvFyNEV8rTv_ZcqmGQB-RBn-HSf098GnHjd9C7SrBhAa7oY9jf5ZnpzGXgu2UyBs5kwHjaiBbg77V5XDwd-BrAcV5vnsVNNHNJebeF8xLMVwJBIx-9-aDnQUG2WSAWmiSZihZKihFB7dOv6PCXWNL2h_sbSndzg7j3im3fr4y_mU",
    department: "Tech QA",
    shiftName: "Shift Alpha",
    shiftSchedule: "08:00 – 17:00",
    clockIn: null,
    clockOut: null,
    durationMinutes: 0,
    checkinDisplay: "—",
    checkinMethod: "None",
    checkinMethodIcon: "",
    checkoutDisplay: "—",
    statusType: "leave",
    statusLabel: "Approved Leave",
    siteId: null,
    locationDistance: "HR Verified",
    verifType: "leave",
    verifLabel: "HR Portal Pre-Approved",
    verifIcon: "task_alt",
    coords: null,
    distanceMeters: null,
    insideFence: null,
    toleranceRadius: "N/A",
    varianceDetail: "Pre-Approved PTO",
    terminalNode: "Remote / Medical",
    deviceBatterySignal: "Off Duty",
    livenessPassed: false,
    shaProof: "HR-PORTAL-CERT-892",
    notes: "Official Medical Leave registered"
  },
  {
    dayOffset: 0,
    empId: "EMP-45091",
    name: "Simon O'Connor",
    avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuCXtuMHzAkaOrBd-C5DtwvxOHYMKPAoaurCBO1HA0IvC65RT8WDrl4Ai7aPDBVr6iQKa7dEGkgXa4MgaCCbwDmsEN4ug1-PaFj0RgsrN9Cmd4AJ-ACcRugGK7ZKy_22g-8a3I2Rr-CtwCGX0KuOaDhfJ4BcxAs0-hDjrmeDC6vw1YG9kZLu0VwZYb4L6qwAe6w2Z6CraBERvJzrcjY77aMeZ4riE6HqQqDdMbLCvmk",
    department: "Field Engineering",
    shiftName: "Early Dawn Shift",
    shiftSchedule: "05:00 – 13:00",
    clockIn: "04:52:10",
    clockOut: "10:40:02",
    durationMinutes: 348,
    checkinMethod: "Facial Match 99.8%",
    checkinMethodIcon: "face",
    statusType: "early",
    statusLabel: "Completed Early",
    siteId: "substation-east",
    locationDistance: "12m from pole (Pass)",
    verifType: "match",
    verifLabel: "GPS Geofence Match",
    verifIcon: "verified_user",
    coords: {
      lat: -6.1472,
      lng: 106.8475,
      accuracy: 2
    },
    distanceMeters: 12,
    insideFence: true,
    toleranceRadius: "100m",
    varianceDetail: "12m inside radius fence",
    terminalNode: "Substation East Grid",
    deviceBatterySignal: "54% • 5G",
    livenessPassed: true,
    shaProof: "SHA256: 7d2f...882e Verified",
    notes: "Full Biometric + Check-out GPS telemetry synced"
  },
  {
    dayOffset: 0,
    empId: "EMP-99341",
    name: "Jocelyn Liu",
    avatar: "",
    department: "Tech QA",
    shiftName: "Shift Alpha",
    shiftSchedule: "08:00 – 17:00",
    clockIn: null,
    clockOut: null,
    durationMinutes: 0,
    checkinDisplay: "No Clock-In",
    checkinMethod: "None",
    checkinMethodIcon: "",
    checkoutDisplay: "—",
    statusType: "absent",
    statusLabel: "Absent",
    siteId: null,
    locationDistance: "Missed Shift",
    verifType: "unverified",
    verifLabel: "Unverified Absence",
    verifIcon: "block",
    coords: null,
    distanceMeters: null,
    insideFence: null,
    toleranceRadius: "N/A",
    varianceDetail: "No Signal Recorded within Shift Grace Window",
    terminalNode: "Unregistered",
    deviceBatterySignal: "Disconnected",
    livenessPassed: false,
    shaProof: "ERR-NO-PUNCH-LOGGED",
    notes: "Absence Notice Issued to Employee"
  },
  {
    dayOffset: -1,
    empId: "EMP-22870",
    name: "Priya Raman",
    avatar: "",
    department: "Facility Safety",
    shiftName: "Shift Alpha",
    shiftSchedule: "08:00 – 17:00",
    clockIn: "07:58:40",
    clockOut: "17:04:12",
    durationMinutes: 545,
    checkinMethod: "Facial Match 99.1%",
    checkinMethodIcon: "face",
    statusType: "present",
    statusLabel: "Present",
    siteId: "hq-lobby-gate-2",
    locationDistance: "22m from core (Pass)",
    verifType: "match",
    verifLabel: "GPS Geofence Match",
    verifIcon: "verified_user",
    coords: {
      lat: -6.1465,
      lng: 106.8451,
      accuracy: 3.6
    },
    distanceMeters: 22,
    insideFence: true,
    toleranceRadius: "100m",
    varianceDetail: "22m radius match",
    terminalNode: "HQ Lobby Gate 2",
    deviceBatterySignal: "88% • 5G",
    livenessPassed: true,
    shaProof: "SHA256: 4a11...0c73 Verified",
    notes: "Full day punch verified"
  },
  {
    dayOffset: -1,
    empId: "EMP-31544",
    name: "Tobias Werner",
    avatar: "",
    department: "Field Engineering",
    shiftName: "Shift Alpha",
    shiftSchedule: "08:00 – 17:00",
    clockIn: "08:41:03",
    clockOut: null,
    durationMinutes: 120,
    checkinMethod: "Facial Match 97.9%",
    checkinMethodIcon: "face",
    statusType: "late",
    statusLabel: "Late (41m)",
    siteId: "substation-east",
    locationDistance: "58m from pole (Pass)",
    verifType: "match",
    verifLabel: "GPS Geofence Match",
    verifIcon: "verified_user",
    coords: {
      lat: -6.1472,
      lng: 106.8475,
      accuracy: 4
    },
    distanceMeters: 58,
    insideFence: true,
    toleranceRadius: "100m",
    varianceDetail: "58m radius match",
    terminalNode: "Substation East Grid",
    deviceBatterySignal: "71% • 4G LTE",
    livenessPassed: true,
    shaProof: "SHA256: c8d2...4410 Verified",
    notes: "Late arrival within tolerance"
  },
  {
    dayOffset: -2,
    empId: "EMP-70412",
    name: "Naomi Adeyemi",
    avatar: "",
    department: "Site Logistics",
    shiftName: "Shift Alpha",
    shiftSchedule: "08:00 – 17:00",
    clockIn: "08:06:55",
    clockOut: "17:11:40",
    durationMinutes: 545,
    checkinMethod: "Facial Match 98.5%",
    checkinMethodIcon: "face",
    statusType: "present",
    statusLabel: "Present",
    siteId: "dock-14",
    locationDistance: "31m from core (Pass)",
    verifType: "match",
    verifLabel: "GPS Geofence Match",
    verifIcon: "verified_user",
    coords: {
      lat: -6.1462,
      lng: 106.8449,
      accuracy: 2.8
    },
    distanceMeters: 31,
    insideFence: true,
    toleranceRadius: "100m",
    varianceDetail: "31m radius match",
    terminalNode: "Dock 14 Inbound",
    deviceBatterySignal: "83% • WiFi 6",
    livenessPassed: true,
    shaProof: "SHA256: 51aa...9b02 Verified",
    notes: "Full day punch verified"
  },
  {
    dayOffset: -3,
    empId: "EMP-58903",
    name: "Hana Kusuma",
    avatar: "",
    department: "Tech QA",
    shiftName: "Remote Patrol Beta",
    shiftSchedule: "07:00 – 16:00",
    clockIn: "07:11:02",
    clockOut: "16:02:30",
    durationMinutes: 531,
    checkinMethod: "Satellite Ping",
    checkinMethodIcon: "cell_tower",
    statusType: "present",
    statusLabel: "Present",
    siteId: "substation-4",
    locationDistance: "35.4871, -119.0125",
    verifType: "remote",
    verifLabel: "Remote GPS Verified",
    verifIcon: "cloud_done",
    coords: {
      lat: 35.4871,
      lng: -119.0125,
      accuracy: 6.3
    },
    distanceMeters: 0,
    insideFence: true,
    toleranceRadius: "250m",
    varianceDetail: "Coordinates matched perimeter boundary",
    terminalNode: "Substation Zone #4",
    deviceBatterySignal: "76% • SatLink High Gain",
    livenessPassed: true,
    shaProof: "SHA256: 2b77...cc19 Verified",
    notes: "Satellite GPS telemetry + Biometric check"
  },
  {
    dayOffset: -5,
    empId: "EMP-41266",
    name: "Rafael Ortiz",
    avatar: "",
    department: "Field Logistics",
    shiftName: "Shift Alpha",
    shiftSchedule: "08:00 – 17:00",
    clockIn: null,
    clockOut: null,
    durationMinutes: 0,
    checkinDisplay: "No Clock-In",
    checkinMethod: "None",
    checkinMethodIcon: "",
    checkoutDisplay: "—",
    statusType: "absent",
    statusLabel: "Absent",
    siteId: null,
    locationDistance: "Missed Shift",
    verifType: "unverified",
    verifLabel: "Unverified Absence",
    verifIcon: "block",
    coords: null,
    distanceMeters: null,
    insideFence: null,
    toleranceRadius: "N/A",
    varianceDetail: "No Signal Recorded within Shift Grace Window",
    terminalNode: "Unregistered",
    deviceBatterySignal: "Disconnected",
    livenessPassed: false,
    shaProof: "ERR-NO-PUNCH-LOGGED",
    notes: "Absence Notice Issued to Employee"
  }
];
const mockSnapshot = {
  meta,
  sites,
  records
};
const ATTENDANCE_ENDPOINT = "/attendance/records";
const ATTENDANCE_POLL_MS = 15e3;
const composeTimestamp = (serverNow, dayOffset, clock) => {
  if (!clock) return null;
  const date = new Date(serverNow.getTime());
  date.setDate(date.getDate() + dayOffset);
  const [h = "0", m2 = "0", s = "0"] = clock.split(":");
  date.setHours(Number(h), Number(m2), Number(s), 0);
  const pad2 = (value) => String(value).padStart(2, "0");
  const dateKey = `${date.getFullYear()}-${pad2(date.getMonth() + 1)}-${pad2(date.getDate())}`;
  return { iso: date.toISOString(), dateKey };
};
const formatClock = (iso) => {
  if (!iso) return "—";
  const date = new Date(iso);
  return date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true
  });
};
const hydrateMock = () => {
  const raw = mockSnapshot;
  const serverNow = /* @__PURE__ */ new Date();
  const records2 = raw.records.map((row) => {
    const checkInStamp = composeTimestamp(serverNow, row.dayOffset, row.clockIn);
    const checkOutStamp = composeTimestamp(serverNow, row.dayOffset, row.clockOut);
    const checkInAt = checkInStamp?.iso ?? null;
    const checkOutAt = checkOutStamp?.iso ?? null;
    const fallbackKey = (() => {
      const date = new Date(serverNow.getTime());
      date.setDate(date.getDate() + row.dayOffset);
      const pad2 = (value) => String(value).padStart(2, "0");
      return `${date.getFullYear()}-${pad2(date.getMonth() + 1)}-${pad2(date.getDate())}`;
    })();
    const punchDate = checkInStamp?.dateKey ?? checkOutStamp?.dateKey ?? fallbackKey;
    const record = {
      id: row.empId,
      name: row.name,
      empId: row.empId,
      avatar: row.avatar,
      department: row.department,
      shiftName: row.shiftName,
      shiftSchedule: row.shiftSchedule,
      checkinTime: row.checkinDisplay ?? formatClock(checkInAt),
      checkinMethod: row.checkinMethod,
      checkinMethodIcon: row.checkinMethodIcon,
      checkoutTime: row.checkoutDisplay ?? (checkOutAt ? formatClock(checkOutAt) : "In Progress"),
      duration: formatDuration(row.durationMinutes),
      statusType: row.statusType,
      statusLabel: row.statusLabel,
      locationName: row.locationName ?? (row.siteId ? raw.sites.find((s) => s.id === row.siteId)?.name ?? "Unknown Site" : "—"),
      locationDistance: row.locationDistance,
      verifType: row.verifType,
      verifLabel: row.verifLabel,
      verifIcon: row.verifIcon,
      coords: row.coords ? { lat: row.coords.lat, lng: row.coords.lng } : { lat: 0, lng: 0 },
      toleranceRadius: row.toleranceRadius,
      varianceDetail: row.varianceDetail,
      terminalNode: row.terminalNode,
      deviceBatterySignal: row.deviceBatterySignal,
      livenessPassed: row.livenessPassed,
      shaProof: row.shaProof,
      notes: row.notes
    };
    return {
      ...record,
      checkInAt,
      checkOutAt,
      durationMinutes: row.durationMinutes,
      distanceMeters: row.distanceMeters,
      accuracyMeters: row.coords ? row.coords.accuracy : null,
      insideFence: row.insideFence,
      siteId: row.siteId,
      punchDate
    };
  });
  return { meta: { ...raw.meta, generatedAt: serverNow.toISOString() }, sites: raw.sites, records: records2 };
};
const fetchFromMock = () => new Promise((resolve) => {
  setTimeout(() => resolve(hydrateMock()), 150);
});
const fetchAttendanceSnapshot = async () => {
  if (!isApiConfigured()) return fetchFromMock();
  return apiGet(ATTENDANCE_ENDPOINT);
};
const FILTER_ALL_DEPARTMENTS = "All Departments (6 Total)";
const FILTER_ALL_STATUSES = "All Statuses (Present, Late, Absent, Leave)";
const FILTER_ALL_VERIFICATION = "All Verification Protocols";
const DEFAULT_FILTERS = {
  dateScope: "Today",
  department: FILTER_ALL_DEPARTMENTS,
  status: FILTER_ALL_STATUSES,
  verification: FILTER_ALL_VERIFICATION
};
const startOfDay = (date) => new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();
const matchesDateScope = (record, scope, serverNow) => {
  const reference = startOfDay(serverNow);
  const day = startOfDay(/* @__PURE__ */ new Date(`${record.punchDate}T00:00:00`));
  const diffDays = Math.round((reference - day) / 864e5);
  switch (scope) {
    case "Today":
      return diffDays === 0;
    case "Yesterday":
      return diffDays === 1;
    case "This Week":
      return diffDays >= 0 && diffDays <= 6;
    case "This Month":
      return diffDays >= 0 && diffDays <= 29;
    default:
      return true;
  }
};
const matchesStatus = (record, status) => {
  if (status === FILTER_ALL_STATUSES) return true;
  if (status.startsWith("Present")) return record.statusType === "present" || record.statusType === "early";
  if (status.startsWith("Late")) return record.statusType === "late";
  if (status.startsWith("Approved")) return record.statusType === "leave";
  if (status.startsWith("Absent")) return record.statusType === "absent";
  return true;
};
const matchesVerification = (record, verification) => {
  if (verification === FILTER_ALL_VERIFICATION) return true;
  if (verification.includes("GPS + Biometric")) return record.verifType === "match";
  if (verification.includes("GPS Telemetry Only")) return record.verifType === "remote";
  if (verification.includes("Manual Supervisor")) return record.verifType === "override";
  if (verification.includes("Anomalous")) return record.statusType === "breach";
  return true;
};
const useAttendanceData = (pollIntervalMs = ATTENDANCE_POLL_MS) => {
  const [snapshot, setSnapshot] = reactExports.useState(null);
  const [status, setStatus] = reactExports.useState("idle");
  const [error, setError] = reactExports.useState(null);
  const [filters, setFilters] = reactExports.useState(DEFAULT_FILTERS);
  const [serverOffsetMs, setServerOffsetMs] = reactExports.useState(0);
  const offsetRef = reactExports.useRef(0);
  const mountedRef = reactExports.useRef(true);
  const load = reactExports.useCallback(async () => {
    try {
      const next = await fetchAttendanceSnapshot();
      const serverTime = new Date(next.meta.generatedAt).getTime();
      if (offsetRef.current === 0 && !Number.isNaN(serverTime)) {
        offsetRef.current = serverTime - Date.now();
        setServerOffsetMs(offsetRef.current);
      }
      if (!mountedRef.current) return;
      setSnapshot(next);
      setStatus("ready");
      setError(null);
    } catch (err) {
      if (!mountedRef.current) return;
      setStatus("error");
      setError(err instanceof Error ? err.message : "Failed to load attendance records");
    }
  }, []);
  reactExports.useEffect(() => {
    mountedRef.current = true;
    void load();
    return () => {
      mountedRef.current = false;
    };
  }, [load]);
  reactExports.useEffect(() => {
    const poller = window.setInterval(() => {
      void load();
    }, pollIntervalMs);
    return () => window.clearInterval(poller);
  }, [load, pollIntervalMs]);
  const setFilter = reactExports.useCallback(
    (key, value) => {
      setFilters((prev) => ({ ...prev, [key]: value }));
    },
    []
  );
  const resetFilters = reactExports.useCallback(() => setFilters(DEFAULT_FILTERS), []);
  const filteredRecords = reactExports.useMemo(() => {
    if (!snapshot) return [];
    const serverNow = new Date(Date.now() + offsetRef.current);
    return snapshot.records.filter(
      (record) => matchesDateScope(record, filters.dateScope, serverNow) && (filters.department === FILTER_ALL_DEPARTMENTS || record.department.includes(filters.department)) && matchesStatus(record, filters.status) && matchesVerification(record, filters.verification)
    );
  }, [snapshot, filters]);
  return reactExports.useMemo(
    () => ({
      snapshot,
      records: snapshot?.records ?? [],
      filteredRecords,
      sites: snapshot?.sites ?? [],
      status,
      error,
      filters,
      serverOffsetMs,
      setFilter,
      resetFilters,
      refresh: load
    }),
    [snapshot, filteredRecords, status, error, filters, serverOffsetMs, setFilter, resetFilters, load]
  );
};
const Attendance = () => {
  const { snapshot, filteredRecords, sites: sites2, filters, serverOffsetMs, setFilter, resetFilters } = useAttendanceData();
  const [showExportMenu, setShowExportMenu] = reactExports.useState(false);
  const [inspectDrawerRecord, setInspectDrawerRecord] = reactExports.useState(null);
  const [toastMessage, setToastMessage] = reactExports.useState(null);
  const [adjustRecord, setAdjustRecord] = reactExports.useState(null);
  const [adjustTime, setAdjustTime] = reactExports.useState("");
  const [adjustReason, setAdjustReason] = reactExports.useState("");
  const meta2 = snapshot?.meta;
  const dateScope = filters.dateScope;
  const deptFilter = filters.department;
  const statusFilter = filters.status;
  const verifFilter = filters.verification;
  const setDateScope = (scope) => setFilter("dateScope", scope);
  const drawerSite = inspectDrawerRecord?.siteId != null ? sites2.find((s) => s.id === inspectDrawerRecord.siteId) ?? null : null;
  const drawerPin = inspectDrawerRecord && drawerSite ? projectToMapFrame(
    {
      lat: inspectDrawerRecord.coords.lat,
      lng: inspectDrawerRecord.coords.lng,
      accuracy: inspectDrawerRecord.accuracyMeters ?? 0
    },
    drawerSite
  ) : null;
  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3e3);
  };
  const handleExport = (format) => {
    setShowExportMenu(false);
    const rows = filteredRecords.map((r2) => ({
      employee_id: r2.empId,
      name: r2.name,
      department: r2.department,
      shift: r2.shiftName,
      check_in: r2.checkInAt ? formatTimestamp(r2.checkInAt, serverOffsetMs) : "—",
      check_out: r2.checkOutAt ? formatTimestamp(r2.checkOutAt, serverOffsetMs) : "—",
      duration_minutes: r2.durationMinutes,
      status: r2.statusLabel,
      location: `${r2.locationName} (${r2.locationDistance})`,
      verification: r2.verifLabel
    }));
    if (format === "Excel XLSX" || format === "PDF Audit Report") {
      showToast(`${format} falls back to CSV in this build`);
    }
    const filename = downloadCsv("vanguard-timesheet", rows);
    showToast(`Exported ${rows.length} record(s) → ${filename}`);
  };
  const handleResetFilters = () => {
    resetFilters();
    showToast("Filters reset to nominal");
  };
  const submitAdjustment = (event) => {
    event.preventDefault();
    if (!adjustRecord) return;
    if (!adjustReason.trim()) {
      showToast("A justification is required for a timesheet adjustment");
      return;
    }
    setAdjustRecord(null);
    showToast(
      `Adjustment queued for ${adjustRecord.empId}: ${adjustTime || "—"} (${adjustReason.trim()})`
    );
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "att-container", children: [
    toastMessage && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "toast-notice", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "material-symbols-outlined icon-md", style: { color: "var(--color-tertiary-fixed)" }, children: "check_circle" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: toastMessage })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "att-header-row", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "att-meta-label-row", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "att-telemetry-pill", children: "TELEMETRY & COMPLIANCE" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "att-live-sync-pill", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "live-dot", style: { width: 6, height: 6 } }),
            "LIVE AUDIT SYNC"
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "att-title", children: "Attendance Audit & Timesheet Logs" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "att-subtitle", children: "Real-time check-in records, GPS geofence verifications, and shift duration telemetry." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "att-header-controls", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "att-date-scope-switcher", children: ["Today", "Yesterday", "This Week", "This Month"].map((scope) => /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            className: `att-scope-btn ${dateScope === scope ? "active" : ""}`,
            type: "button",
            onClick: () => setDateScope(scope),
            children: scope
          },
          scope
        )) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "att-export-wrap", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              className: "att-btn-export",
              type: "button",
              onClick: () => setShowExportMenu(!showExportMenu),
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "material-symbols-outlined icon-sm", children: "ios_share" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Export Logs" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "material-symbols-outlined icon-sm", children: "expand_more" })
              ]
            }
          ),
          showExportMenu && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "att-export-menu", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "button",
              {
                className: "att-export-item",
                type: "button",
                onClick: () => handleExport("CSV"),
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "material-symbols-outlined icon-sm", style: { color: "var(--color-primary-container)" }, children: "table_chart" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Export CSV" })
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "button",
              {
                className: "att-export-item",
                type: "button",
                onClick: () => handleExport("Excel XLSX"),
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "material-symbols-outlined icon-sm", style: { color: "var(--color-secondary-container)" }, children: "grid_on" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Export Excel (XLSX)" })
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "button",
              {
                className: "att-export-item",
                type: "button",
                onClick: () => handleExport("PDF Audit Report"),
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "material-symbols-outlined icon-sm", style: { color: "var(--color-error)" }, children: "picture_as_pdf" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Export PDF Audit Report" })
                ]
              }
            )
          ] })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "att-kpi-grid", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "att-kpi-card", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "att-kpi-card-header", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "att-kpi-title", children: "Today's Attendance" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "att-kpi-icon-box", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "material-symbols-outlined icon-md", children: "supervised_user_circle" }) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "att-kpi-metric-row", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "att-kpi-metric", children: meta2 ? `${meta2.attendanceRatePercent}%` : "—" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "att-kpi-badge", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "material-symbols-outlined icon-sm", children: "trending_up" }),
            "+",
            meta2?.attendanceRateTrendPercent ?? 0,
            "%"
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "att-kpi-sub-row", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: meta2 ? `${meta2.organizationCounts.present + meta2.organizationCounts.late} of ${meta2.totalEmployees} clocked in` : "—" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { color: "var(--color-outline)" }, children: meta2 ? `${meta2.totalEmployees - meta2.organizationCounts.present - meta2.organizationCounts.late} pending` : "—" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "att-kpi-progress-track", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "att-kpi-progress-fill", style: { width: `${meta2?.attendanceRatePercent ?? 0}%` } }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "att-kpi-card", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "att-kpi-card-header", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "att-kpi-title", children: "Punctuality Score" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "att-kpi-icon-box", style: { color: "var(--color-secondary)" }, children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "material-symbols-outlined icon-md", children: "timer" }) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "att-kpi-metric-row", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "att-kpi-metric", children: meta2 ? `${meta2.punctualityScore}%` : "—" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontSize: "var(--fs-label-sm)", fontWeight: 600, color: "var(--color-secondary-container)" }, children: "Standard" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "att-kpi-sub-row", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
            meta2?.organizationCounts.present ?? 0,
            " On Time"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { style: { color: "var(--color-error)", fontWeight: 600 }, children: [
            meta2?.organizationCounts.late ?? 0,
            " Late arrivals"
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "att-kpi-dual-progress", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { width: `${meta2?.punctualityScore ?? 0}%`, background: "var(--color-secondary-container)" } }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { width: `${100 - (meta2?.punctualityScore ?? 0)}%`, background: "var(--color-error)" } })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "att-kpi-card", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "att-kpi-card-header", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "att-kpi-title", children: "Avg Check-in Time" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "att-kpi-icon-box", style: { color: "var(--color-tertiary)" }, children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "material-symbols-outlined icon-md", children: "schedule" }) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "att-kpi-metric-row", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "att-kpi-metric", children: meta2?.avgCheckInLabel ?? "—" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "span",
            {
              style: {
                fontSize: 11,
                padding: "2px 6px",
                borderRadius: "var(--radius-sm)",
                background: "var(--color-surface-container-high)",
                color: "var(--color-on-surface-variant)"
              },
              children: "±15m grace"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "att-kpi-sub-row", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
            "Expected shift start: ",
            meta2?.expectedShiftStart ?? "—",
            " AM"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { color: "var(--color-tertiary)", fontWeight: 600 }, children: "Nominal" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "att-kpi-progress-track", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: "att-kpi-progress-fill",
            style: { width: "68%", background: "var(--color-tertiary-fixed-dim)" }
          }
        ) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "att-kpi-card card-dark", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "att-kpi-card-header", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "att-kpi-title", children: "Work Hours Logged" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "att-kpi-icon-box", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "material-symbols-outlined icon-md", children: "hourglass_top" }) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "att-kpi-metric-row", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "att-kpi-metric", children: meta2 ? `${meta2.workHoursLogged.toFixed(1)} hrs` : "—" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontSize: "var(--fs-label-sm)", fontWeight: 600, color: "var(--color-on-tertiary-container)" }, children: "Active Run" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "att-kpi-sub-row", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
            "Expected daily: ",
            meta2 ? `${meta2.workHoursExpected.toFixed(1)} hrs` : "—"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { color: "var(--color-secondary-fixed)" }, children: meta2 && meta2.workHoursExpected > 0 ? `${Math.round(meta2.workHoursLogged / meta2.workHoursExpected * 100)}% cycle` : "—" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "att-kpi-progress-track", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: "att-kpi-progress-fill",
            style: { width: `${meta2 && meta2.workHoursExpected > 0 ? meta2.workHoursLogged / meta2.workHoursExpected * 100 : 0}%`, background: "var(--color-tertiary-fixed)" }
          }
        ) })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "att-filter-card", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "att-filter-grid", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "att-field-group", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "att-field-label", children: "Date Scope" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "att-field-input-wrap", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "material-symbols-outlined icon-sm att-field-icon", children: "calendar_today" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "input",
              {
                type: "text",
                className: "att-field-input",
                readOnly: true,
                value: `Today: ${meta2 ? formatTimestamp(/* @__PURE__ */ new Date(), serverOffsetMs).slice(0, 11) : "—"} (${dateScope})`
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "att-field-group", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "att-field-label", children: "Department" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "att-field-input-wrap", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "select",
              {
                className: "att-field-select",
                value: deptFilter,
                onChange: (e) => setFilter("department", e.target.value),
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("option", { children: "All Departments (6 Total)" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("option", { children: "Field Engineering" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("option", { children: "Site Logistics" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("option", { children: "Facility Safety" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("option", { children: "Tech QA" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("option", { children: "Executive Operations" })
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "material-symbols-outlined icon-sm att-field-arrow", children: "expand_more" })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "att-field-group", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "att-field-label", children: "Attendance Status" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "att-field-input-wrap", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "select",
              {
                className: "att-field-select",
                value: statusFilter,
                onChange: (e) => setFilter("status", e.target.value),
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("option", { children: "All Statuses (Present, Late, Absent, Leave)" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("option", { children: "Present (Punctual)" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("option", { children: "Late Arrival" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("option", { children: "Approved Leave" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("option", { children: "Absent / Missed" })
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "material-symbols-outlined icon-sm att-field-arrow", children: "expand_more" })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "att-field-group", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "att-field-label", children: "Verification Method" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "att-field-input-wrap", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "select",
              {
                className: "att-field-select",
                value: verifFilter,
                onChange: (e) => setFilter("verification", e.target.value),
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("option", { children: "All Verification Protocols" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("option", { children: "GPS + Biometric Pass" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("option", { children: "GPS Telemetry Only" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("option", { children: "Manual Supervisor Override" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("option", { children: "Anomalous / Breached Fence" })
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "material-symbols-outlined icon-sm att-field-arrow", children: "expand_more" })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "att-filter-summary-strip", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "att-counter-items", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "att-counter-pill", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "att-dot", style: { background: "var(--color-inverse-surface)" } }),
            "Present: ",
            /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: meta2?.organizationCounts.present ?? 0 })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { color: "var(--color-outline)" }, children: "/" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "att-counter-pill", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "att-dot", style: { background: "var(--color-secondary)" } }),
            "Late: ",
            /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: meta2?.organizationCounts.late ?? 0 })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { color: "var(--color-outline)" }, children: "/" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "att-counter-pill", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "att-dot", style: { background: "var(--color-error)" } }),
            "Absent: ",
            /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: meta2?.organizationCounts.absent ?? 0 })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { color: "var(--color-outline)" }, children: "/" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "att-counter-pill", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "att-dot", style: { background: "var(--color-surface-dim)" } }),
            "Leave: ",
            /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: meta2?.organizationCounts.leave ?? 0 })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "att-filter-actions", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              className: "att-btn-filter-reset",
              type: "button",
              onClick: handleResetFilters,
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "material-symbols-outlined icon-sm", children: "filter_alt_off" }),
                "Reset Filters"
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { width: 1, height: 16, background: "var(--color-outline-variant)" } }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              className: "att-btn-adv-query",
              type: "button",
              onClick: () => showToast("Advanced SQL/Telemetry Query Builder ready"),
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "material-symbols-outlined icon-sm", children: "tune" }),
                "Advanced Query"
              ]
            }
          )
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "att-table-card", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "att-table-header-strip", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "att-table-header-title-wrap", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "att-table-title", children: "Verified Punch Audit Log" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "span",
            {
              style: {
                fontSize: 11,
                padding: "2px 8px",
                borderRadius: "var(--radius-full)",
                background: "var(--color-surface-container)",
                color: "var(--color-outline)"
              },
              children: [
                "Showing ",
                filteredRecords.length,
                " of ",
                meta2?.totalEmployees ?? 0,
                " personnel"
              ]
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "att-crypto-tag", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "material-symbols-outlined icon-sm", style: { color: "var(--color-secondary)" }, children: "verified" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Cryptographic GPS Hash Active (SHA-256)" })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "att-table-scroll", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "att-table", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { children: "Employee & ID" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { children: "Department" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { children: "Shift & Schedule" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { children: "Check-in" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { children: "Check-out" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { children: "Duration" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { children: "Status" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { children: "Location & Geofence" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { children: "Verification" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { style: { textAlign: "right" }, children: "Actions" })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: filteredRecords.map((r2) => {
          const isBreach = r2.statusType === "breach";
          return /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: isBreach ? "row-flagged" : "", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "att-person-cell", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "att-person-avatar-wrap", children: [
                r2.avatar ? /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "img",
                  {
                    src: r2.avatar,
                    alt: r2.name,
                    className: "att-person-avatar",
                    onError: (e) => {
                      e.target.style.display = "none";
                      const fb2 = e.target.nextElementSibling;
                      if (fb2) fb2.style.display = "flex";
                    }
                  }
                ) : null,
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "div",
                  {
                    className: "att-person-avatar-fallback",
                    style: { display: r2.avatar ? "none" : "flex" },
                    children: r2.name.split(" ").map((n2) => n2[0]).join("")
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "att-person-dot", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "span",
                  {
                    className: "att-person-dot-core",
                    style: {
                      background: isBreach ? "var(--color-error)" : r2.statusType === "leave" ? "var(--color-outline)" : "var(--color-tertiary-fixed)"
                    }
                  }
                ) })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", flexDirection: "column" }, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontWeight: 600, color: "var(--color-on-surface)" }, children: r2.name }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontSize: 11, color: "var(--color-outline)", fontFeatureSettings: '"tnum" 1' }, children: r2.empId })
              ] })
            ] }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "att-dept-tag", children: r2.department }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "att-shift-cell", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontWeight: 500 }, children: r2.shiftName }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontSize: 11, color: "var(--color-outline)" }, children: r2.shiftSchedule })
            ] }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "att-time-cell", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "span",
                {
                  style: {
                    fontWeight: 600,
                    color: isBreach || r2.statusType === "absent" ? "var(--color-error)" : "inherit"
                  },
                  children: r2.checkinTime
                }
              ),
              r2.checkinMethodIcon && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "att-method-label", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "material-symbols-outlined", style: { fontSize: 12 }, children: r2.checkinMethodIcon }),
                r2.checkinMethod
              ] })
            ] }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { children: r2.checkoutTime === "In Progress" ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "span",
              {
                style: {
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 5,
                  padding: "2px 8px",
                  borderRadius: "var(--radius-full)",
                  background: "var(--color-surface-container)",
                  fontSize: 11,
                  color: "var(--color-secondary)"
                },
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "live-dot", style: { width: 5, height: 5 } }),
                  "In Progress"
                ]
              }
            ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "att-time-cell", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontWeight: 500 }, children: r2.checkoutTime }) }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontWeight: 600, fontFeatureSettings: '"tnum" 1' }, children: r2.duration }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: `att-status-badge ${r2.statusType}`, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "span",
                {
                  className: "att-dot",
                  style: {
                    width: 6,
                    height: 6,
                    background: r2.statusType === "breach" || r2.statusType === "absent" ? "#fff" : r2.statusType === "late" ? "var(--color-error)" : r2.statusType === "early" ? "var(--color-secondary)" : "var(--color-tertiary-fixed)"
                  }
                }
              ),
              r2.statusLabel
            ] }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", flexDirection: "column" }, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontWeight: 500, color: isBreach ? "var(--color-error)" : "inherit" }, children: r2.locationName }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "span",
                {
                  style: {
                    fontSize: 11,
                    color: isBreach ? "var(--color-error)" : "var(--color-tertiary)"
                  },
                  children: r2.locationDistance
                }
              )
            ] }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: `att-verif-badge ${r2.verifType}`, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "material-symbols-outlined icon-sm", children: r2.verifIcon }),
              r2.verifLabel
            ] }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 4 }, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  className: `att-btn-radar-inspect ${isBreach ? "btn-alert" : ""}`,
                  type: "button",
                  title: "Inspect Spatial GPS Log",
                  onClick: () => setInspectDrawerRecord(r2),
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "material-symbols-outlined icon-md", children: isBreach ? "fmd_bad" : "radar" })
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  className: "att-btn-radar-inspect",
                  type: "button",
                  title: "Adjust Timesheet",
                  onClick: () => {
                    setAdjustRecord(r2);
                    setAdjustTime(r2.checkinTime);
                    setAdjustReason("");
                  },
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "material-symbols-outlined icon-md", children: "edit_calendar" })
                }
              )
            ] }) })
          ] }, r2.id);
        }) })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "att-table-footer", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", alignItems: "center", gap: 12, fontSize: "var(--fs-body-sm)", color: "var(--color-on-surface-variant)" }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
            "Displaying ",
            /* @__PURE__ */ jsxRuntimeExports.jsxs("strong", { children: [
              "1 - ",
              filteredRecords.length
            ] }),
            " of ",
            /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: meta2?.totalEmployees ?? 0 }),
            " entries"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { color: "var(--color-outline)" }, children: "|" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
            "Cumulative shift coverage: ",
            /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "94.2%" })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", alignItems: "center", gap: 4 }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              className: "emp-btn-page",
              type: "button",
              disabled: true,
              style: { opacity: 0.4 },
              children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "material-symbols-outlined icon-sm", children: "chevron_left" })
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "emp-btn-page active", type: "button", children: "1" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "emp-btn-page", type: "button", children: "2" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "emp-btn-page", type: "button", children: "3" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { padding: "0 4px", color: "var(--color-outline)" }, children: "..." }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "emp-btn-page", type: "button", children: "16" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "emp-btn-page", type: "button", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "material-symbols-outlined icon-sm", children: "chevron_right" }) })
        ] })
      ] })
    ] }),
    inspectDrawerRecord && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "att-drawer-backdrop", onClick: () => setInspectDrawerRecord(null), children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "att-drawer-panel", onClick: (e) => e.stopPropagation(), children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "att-drawer-header", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "att-drawer-title-wrap", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "att-drawer-title-row", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "material-symbols-outlined icon-md", style: { color: "var(--color-tertiary-fixed)" }, children: "radar" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "att-drawer-title", children: "Spatial Verification Audit" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "att-drawer-sub", children: "High-Precision Biometric & Geofence Log" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            className: "att-btn-drawer-close",
            type: "button",
            onClick: () => setInspectDrawerRecord(null),
            children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "material-symbols-outlined icon-md", children: "close" })
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "att-drawer-body", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "att-target-card", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "att-target-card-left", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "att-target-icon-box", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "material-symbols-outlined icon-lg", children: "person_pin" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { style: { margin: 0, fontSize: "var(--fs-title-md)", fontWeight: 700 }, children: inspectDrawerRecord.name }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { style: { fontSize: 11, color: "var(--color-outline)", fontFeatureSettings: '"tnum" 1' }, children: [
                inspectDrawerRecord.empId,
                " • ",
                inspectDrawerRecord.department
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "span",
            {
              style: {
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                padding: "3px 10px",
                borderRadius: "var(--radius-full)",
                background: "var(--color-inverse-surface)",
                color: "var(--color-tertiary-fixed)",
                fontSize: 11,
                fontWeight: 700
              },
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "live-dot", style: { width: 6, height: 6 } }),
                "Live Geohash"
              ]
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "att-drawer-map-box", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", alignItems: "center", justifyContent: "space-between", fontSize: 11 }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontWeight: 600, color: "var(--color-outline)", textTransform: "uppercase" }, children: "Geofence Boundary Map" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { style: { color: "var(--color-secondary)", fontWeight: 600 }, children: [
              "Tolerance Radius: ",
              inspectDrawerRecord.toleranceRadius
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "att-drawer-map-frame", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("svg", { className: "tactical-svg", viewBox: "0 0 500 240", xmlns: "http://www.w3.org/2000/svg", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("rect", { width: "500", height: "240", fill: "#161a33" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("pattern", { id: "drwGrid", width: "30", height: "30", patternUnits: "userSpaceOnUse", children: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M 30 0 L 0 0 0 30", fill: "none", stroke: "#252943", strokeWidth: "0.6", strokeOpacity: "0.4" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("rect", { width: "500", height: "240", fill: "url(#drwGrid)" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { cx: "250", cy: "120", r: "70", fill: "rgba(60, 169, 255, 0.15)", stroke: "#3ca9ff", strokeWidth: "1.5", strokeDasharray: "4 3" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { cx: "250", cy: "120", r: "12", fill: "#152de4", stroke: "#fff", strokeWidth: "2" }),
              inspectDrawerRecord.statusType === "breach" ? /* @__PURE__ */ jsxRuntimeExports.jsxs("g", { transform: `translate(${drawerPin?.x ?? 370}, ${drawerPin?.y ?? 70})`, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { r: "14", fill: "#ba1a1a", opacity: "0.4", children: /* @__PURE__ */ jsxRuntimeExports.jsx("animate", { attributeName: "r", values: "10;20;10", dur: "2s", repeatCount: "indefinite" }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { r: "8", fill: "#ba1a1a", stroke: "#fff", strokeWidth: "2" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("text", { x: "0", y: "3", textAnchor: "middle", fill: "#fff", fontSize: "9", fontWeight: "bold", children: "!" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "text",
                  {
                    x: drawerPin?.labelSide === "left" ? -12 : 12,
                    y: "4",
                    textAnchor: drawerPin?.labelSide === "left" ? "end" : void 0,
                    fill: "#ffdad6",
                    fontSize: "9",
                    fontWeight: "bold",
                    children: [
                      "Punch Location (+",
                      inspectDrawerRecord.distanceMeters ?? 0,
                      "m)"
                    ]
                  }
                )
              ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("g", { transform: `translate(${drawerPin?.x ?? 265}, ${drawerPin?.y ?? 110})`, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { r: "12", fill: "#d7f32d", opacity: "0.4", children: /* @__PURE__ */ jsxRuntimeExports.jsx("animate", { attributeName: "r", values: "8;16;8", dur: "2s", repeatCount: "indefinite" }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { r: "6", fill: "#d7f32d", stroke: "#161a33", strokeWidth: "1.5" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("text", { x: "10", y: "4", fill: "#d7f32d", fontSize: "9", fontWeight: "bold", children: "Verified Punch Point" })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "att-drawer-map-overlay", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "att-drawer-map-hud-top", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "att-drawer-hud-chip", children: [
                  "LAT: ",
                  inspectDrawerRecord.coords.lat,
                  " | LNG: ",
                  inspectDrawerRecord.coords.lng
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "span",
                  {
                    style: {
                      padding: "4px 10px",
                      borderRadius: "var(--radius-sm)",
                      background: "rgba(255, 255, 255, 0.95)",
                      color: "#161a33",
                      fontSize: 11,
                      fontWeight: 600
                    },
                    children: [
                      "Accuracy: ±",
                      inspectDrawerRecord.accuracyMeters ?? 0,
                      "m"
                    ]
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "att-drawer-map-hud-bottom", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", alignItems: "center", gap: 6 }, children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "span",
                    {
                      className: "live-dot",
                      style: {
                        width: 8,
                        height: 8,
                        background: inspectDrawerRecord.statusType === "breach" ? "var(--color-error)" : "var(--color-tertiary-fixed)"
                      }
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontSize: 12, fontWeight: 600 }, children: geofenceLabel(
                    inspectDrawerRecord.insideFence == null ? null : {
                      status: inspectDrawerRecord.insideFence ? "inside" : "outside",
                      distanceMeters: inspectDrawerRecord.distanceMeters ?? 0
                    }
                  ) })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontSize: 11, opacity: 0.8 }, children: "Sync: Galileo+GLONASS" })
              ] })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "att-drawer-telemetry-grid", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "att-telemetry-grid-item", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "att-telemetry-grid-label", children: "Check-in Timestamp" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "att-telemetry-grid-val", style: { fontFeatureSettings: '"tnum" 1' }, children: inspectDrawerRecord.checkInAt ? formatTimestamp(inspectDrawerRecord.checkInAt, serverOffsetMs) : "—" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "att-telemetry-grid-item", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "att-telemetry-grid-label", children: "Perimeter Variance" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "span",
              {
                className: "att-telemetry-grid-val",
                style: {
                  color: inspectDrawerRecord.statusType === "breach" ? "var(--color-error)" : "var(--color-tertiary)"
                },
                children: inspectDrawerRecord.varianceDetail
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "att-telemetry-grid-item", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "att-telemetry-grid-label", children: "Terminal / Access Node" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "att-telemetry-grid-val", children: inspectDrawerRecord.terminalNode })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "att-telemetry-grid-item", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "att-telemetry-grid-label", children: "Device Battery & Signal" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "att-telemetry-grid-val", children: inspectDrawerRecord.deviceBatterySignal })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "att-liveness-card", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "att-field-label", children: "Facial Recognition Liveness Proof" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "att-liveness-body", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "img",
              {
                src: "https://lh3.googleusercontent.com/aida-public/AB6AXuACSxNSqJd9XcoEa24rC1GymPQ0igjZCtlRAyqySm8bMlGjg1xwWdZ83LMlpDa9OwWlKAYXFR8YHJEsGIjjIf5NskLhyu0H4G5oNMg4qxWoInPPZFmFSJlfHa9yeOMuEIuiHK0CZoMNZ5J4nlFl3A8l0IHZXvl_1MMkReYEuotcny3qzn6cPHCX4J4oOzf9jhAlIQt38nBpkU6qCKX2dexH0NVqcbvGKjcgJtGODFo",
                alt: "Facial Liveness Proof",
                className: "att-liveness-img",
                onError: (e) => {
                  e.target.src = "";
                }
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "att-liveness-info", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { style: { fontSize: "var(--fs-label-md)", fontWeight: 600, color: "var(--color-on-surface)" }, children: [
                "Liveness Verification: ",
                inspectDrawerRecord.livenessPassed ? "100% Passed" : "Flagged Anomaly"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontSize: 11, color: "var(--color-on-surface-variant)" }, children: inspectDrawerRecord.livenessPassed ? "Anti-spoof algorithm confirmed 3D depth and retinal motion. No synthetic spoof detected." : "Biometric capture skipped or anomalous drift observed beyond acceptable threshold." }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontSize: 11, fontWeight: 600, color: "var(--color-secondary)", fontFeatureSettings: '"tnum" 1' }, children: inspectDrawerRecord.shaProof })
            ] })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "att-drawer-footer", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            type: "button",
            className: "btn btn-secondary",
            onClick: () => setInspectDrawerRecord(null),
            children: "Close Inspector"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", alignItems: "center", gap: 8 }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              className: "btn btn-secondary",
              style: { color: "var(--color-error)" },
              onClick: () => {
                showToast(`Dispute logged for ${inspectDrawerRecord.empId}`);
                setInspectDrawerRecord(null);
              },
              children: "Dispute Timestamp"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              className: "btn btn-primary",
              onClick: () => {
                showToast(`Record ${inspectDrawerRecord.empId} confirmed and cryptographically locked`);
                setInspectDrawerRecord(null);
              },
              children: "Confirm & Lock Record"
            }
          )
        ] })
      ] })
    ] }) }),
    adjustRecord && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "emp-modal-backdrop", onClick: () => setAdjustRecord(null), children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "emp-modal-card", onClick: (e) => e.stopPropagation(), children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "emp-modal-header", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "emp-modal-title", children: "Adjust Timesheet" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", className: "telemetry-tool-btn", onClick: () => setAdjustRecord(null), children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "material-symbols-outlined icon-md", children: "close" }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: submitAdjustment, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "emp-modal-body", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", flexDirection: "column", gap: 4, marginBottom: 10 }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: adjustRecord.name }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { style: { fontSize: 11, color: "var(--color-outline)", fontFeatureSettings: '"tnum" 1' }, children: [
              adjustRecord.empId,
              " • ",
              adjustRecord.department,
              " • recorded ",
              adjustRecord.checkinTime
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "emp-form-group", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "att-field-label", children: "Corrected Check-in" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "input",
              {
                type: "text",
                className: "emp-form-input",
                placeholder: "HH:mm:ss",
                value: adjustTime,
                onChange: (e) => setAdjustTime(e.target.value)
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "emp-form-group", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "att-field-label", children: "Justification" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "textarea",
              {
                className: "emp-form-input",
                rows: 3,
                placeholder: "Reason for the manual correction (recorded in the audit trail)",
                value: adjustReason,
                onChange: (e) => setAdjustReason(e.target.value)
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "emp-modal-footer", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", className: "btn btn-secondary", onClick: () => setAdjustRecord(null), children: "Cancel" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { type: "submit", className: "btn btn-primary", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "material-symbols-outlined icon-sm", children: "save" }),
            "Submit Adjustment"
          ] })
        ] })
      ] })
    ] }) })
  ] });
};
const App = () => {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(AppShell, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Routes, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Route, { path: "/", element: /* @__PURE__ */ jsxRuntimeExports.jsx(Navigate, { to: "/dashboard", replace: true }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Route, { path: "/dashboard", element: /* @__PURE__ */ jsxRuntimeExports.jsx(Dashboard, {}) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Route, { path: "/live-monitoring", element: /* @__PURE__ */ jsxRuntimeExports.jsx(LiveMonitoring, {}) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Route, { path: "/employees", element: /* @__PURE__ */ jsxRuntimeExports.jsx(Employees, {}) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Route, { path: "/attendance", element: /* @__PURE__ */ jsxRuntimeExports.jsx(Attendance, {}) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Route, { path: "*", element: /* @__PURE__ */ jsxRuntimeExports.jsx(Navigate, { to: "/dashboard", replace: true }) })
  ] }) });
};
client.createRoot(document.getElementById("root")).render(
  /* @__PURE__ */ jsxRuntimeExports.jsx(React.StrictMode, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(HashRouter, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(App, {}) }) })
);
