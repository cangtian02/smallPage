define(function(require) {	
	! function(t, n) {
		function i(t) {
			return t.replace(/([a-z])([A-Z])/, "$1-$2").toLowerCase()
		}
	
		function e(t) {
			return a ? a + t : t.toLowerCase()
		}
		var a, s, o, r, f, u, c, d, l, m, p = "",
			h = {
				Webkit: "webkit",
				Moz: "",
				O: "o"
			},
			y = document.createElement("div"),
			x = /^((translate|rotate|scale)(X|Y|Z|3d)?|matrix(3d)?|perspective|skew(X|Y)?)$/i,
			b = {};
		t.each(h, function(t, i) {
			return y.style[t + "TransitionProperty"] !== n ? (p = "-" + t.toLowerCase() + "-", a = i, !1) : void 0
		}), s = p + "transform", b[o = p + "transition-property"] = b[r = p + "transition-duration"] = b[u = p + "transition-delay"] = b[f = p + "transition-timing-function"] = b[c = p + "animation-name"] = b[d = p + "animation-duration"] = b[m = p + "animation-delay"] = b[l = p + "animation-timing-function"] = "", t.fx = {
			off: a === n && y.style.transitionProperty === n,
			speeds: {
				_default: 400,
				fast: 200,
				slow: 600
			},
			cssPrefix: p,
			transitionEnd: e("TransitionEnd"),
			animationEnd: e("AnimationEnd")
		}, t.fn.animate = function(i, e, a, s, o) {
			return t.isFunction(e) && (s = e, a = n, e = n), t.isFunction(a) && (s = a, a = n), t.isPlainObject(e) && (a = e.easing, s = e.complete, o = e.delay, e = e.duration), e && (e = ("number" == typeof e ? e : t.fx.speeds[e] || t.fx.speeds._default) / 1e3), o && (o = parseFloat(o) / 1e3), this.anim(i, e, a, s, o)
		}, t.fn.anim = function(e, a, p, h, y) {
			var g, E, w, v = {},
				T = "",
				L = this,
				P = t.fx.transitionEnd,
				j = !1;
			if(a === n && (a = t.fx.speeds._default / 1e3), y === n && (y = 0), t.fx.off && (a = 0), "string" == typeof e) v[c] = e, v[d] = a + "s", v[m] = y + "s", v[l] = p || "linear", P = t.fx.animationEnd;
			else {
				E = [];
				for(g in e) x.test(g) ? T += g + "(" + e[g] + ") " : (v[g] = e[g], E.push(i(g)));
				T && (v[s] = T, E.push(s)), a > 0 && "object" == typeof e && (v[o] = E.join(", "), v[r] = a + "s", v[u] = y + "s", v[f] = p || "linear")
			}
			return w = function(n) {
				if("undefined" != typeof n) {
					if(n.target !== n.currentTarget) return;
					t(n.target).unbind(P, w)
				} else t(this).unbind(P, w);
				j = !0, t(this).css(b), h && h.call(this)
			}, a > 0 && (this.bind(P, w), setTimeout(function() {
				j || w.call(L)
			}, 1e3 * (a + y) + 25)), this.size() && this.get(0).clientLeft, this.css(v), 0 >= a && setTimeout(function() {
				L.each(function() {
					w.call(this)
				})
			}, 0), this
		}, y = null
	}(Zepto);
});