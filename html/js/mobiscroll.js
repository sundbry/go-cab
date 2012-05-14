/*!
 * jQuery MobiScroll v2.0
 * http://mobiscroll.com
 *
 * Copyright 2010-2011, Acid Media
 * Licensed under the MIT license.
 *
 */
(function ($) {

    function Scroller(elm, settings) {
        var that = this,
            e = elm,
            elm = $(e),
            theme,
            s = $.extend({}, defaults),
            m,
            dw,
            iv = {},
            tv = {},
            input = elm.is('input'),
            visible = false;

        // Private functions

        function getDocHeight() {
            var body = document.body,
                html = document.documentElement;
            return Math.max(body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight);
        }

        function setGlobals(t) {
            min = $('li.dw-v', t).eq(0).index();
            max = $('li.dw-v', t).eq(-1).index();
            h = s.height;
            inst = that;
        }

        function formatHeader(v) {
            var t = s.headerText;
            return t ? (typeof(t) == 'function' ? t.call(e, v) : t.replace(/{value}/i, v)) : '';
        }

        function read() {
            that.temp = ((input && that.val !== null && that.val != elm.val()) || that.values === null) ? s.parseValue(elm.val() ? elm.val() : '', that) : that.values.slice(0);
            that.setValue(true);
        }

        function scrollToPos(time, orig, index, manual, dir) {
            // Initial validate
            s.validate.call(e, dw, index);

            // Set scrollers to position
            $('.dww ul', dw).each(function(i) {
                var t = $(this),
                    cell = $('li[data-val="' + that.temp[i] + '"]', t),
                    x = cell.index(),
                    v = scrollToValid(cell, x, i, dir);
                if (x != v || i == index || index === undefined)
                    that.scroll($(this), v, (i == index ? time : 0), orig, i);
            });

            // Reformat value if validation changed something
            that.change(manual);
        }

        function scrollToValid(cell, val, i, dir) {
            // Process invalid cells
            if (!cell.hasClass('dw-v')) {
                var cell1 = cell,
                    cell2 = cell,
                    dist1 = 0,
                    dist2 = 0;
                while (cell1.prev().length && !cell1.hasClass('dw-v')) {
                    cell1 = cell1.prev();
                    dist1++;
                }
                while (cell2.next().length && !cell2.hasClass('dw-v')) {
                    cell2 = cell2.next();
                    dist2++;
                }
                // If we have direction (+/- or mouse wheel), the distance does not count
                if ((dist2 < dist1 && dist2 && !dir == 1) || !dist1 || !cell1.hasClass('dw-v') || dir == 1) {
                    cell = cell2;
                    val = val + dist2;
                }
                else {
                    cell = cell1;
                    val = val - dist1;
                }
                that.temp[i] = cell.data('val');
            }
            return val;
        }

        function position() {
            var totalw = 0,
                minw = 0,
                ww = $(window).width(),
                wh = $(window).height(),
                st = $(window).scrollTop(),
                o = $('.dwo', dw),
                d = $('.dw', dw),
                w,
                h;
            $('.dwc', dw).each(function() {
                w = $(this).outerWidth(true);
                totalw += w;
                minw = (w > minw) ? w : minw;
            });
            w = totalw > ww ? minw : totalw;
            d.width(w);
            w = d.outerWidth();
            h = d.outerHeight();
            d.css({ left: (ww - w) / 2, top: st + (wh - h) / 2 });
            //o.height(0).height($(document).height());
            o.height(0).height(getDocHeight());
        }

        function plus(t) {
            var p = +t.data('pos'),
                val = p + 1;
            calc(t, val > max ? min : val, 1);
        }

        function minus(t) {
            var p = +t.data('pos'),
                val = p - 1;
            calc(t, val < min ? max : val, 2);
        }

        // Public functions

        /**
        * Enables the scroller and the associated input.
        */
        that.enable = function() {
            s.disabled = false;
            if (input)
                elm.prop('disabled', false);
        }

        /**
        * Disables the scroller and the associated input.
        */
        that.disable = function() {
            s.disabled = true;
            if (input)
                elm.prop('disabled', true);
        }

        /**
        * Scrolls target to the specified position
        * @param {Object} t - Target wheel jQuery object.
        * @param {Number} val - Value.
        * @param {Number} [time] - Duration of the animation, optional.
        */
        that.scroll = function(t, val, time, orig, index) {
            var px = (m - val) * s.height;
            t.attr('style', (time ? (prefix + '-transition:all ' + time.toFixed(1) + 's ease-out;') : '') + (has3d ? (prefix + '-transform:translate3d(0,' + px + 'px,0);') : ('top:' + px + 'px;')));

            function getVal(t, b, c, d) {
                return c * Math.sin(t/d * (Math.PI/2)) + b;
            }

            if (time) {
                var i = 0;
                clearInterval(iv[index]);
                iv[index] = setInterval(function() {
                    i += 0.1;
                    t.data('pos', Math.round(getVal(i, orig, val - orig, time)));
                    if (i >= time) {
                        clearInterval(iv[index]);
                        t.data('pos', val);
                    }
                }, 100);
                // Show +/- buttons
                clearTimeout(tv[index]);
                tv[index] = setTimeout(function() {
                    if (s.mode == 'mixed' && !t.hasClass('dwa'))
                        t.closest('.dwwl').find('.dwwb').fadeIn('fast');
                }, time * 1000);
            }
            else
                t.data('pos', val)
        }

        /**
        * Gets the selected wheel values, formats it, and set the value of the scroller instance.
        * If input parameter is true, populates the associated input element.
        * @param {Boolean} [fill] - Also set the value of the associated input element. Default is true.
        */
        that.setValue = function (sc, fill, time) {
            var v = s.formatResult(that.temp);
            that.val = v;
            that.values = that.temp.slice(0);
            if (visible && sc) scrollToPos(time);
            if (fill && input) elm.val(v).trigger('change');
        }

        /**
        * Checks if the current selected values are valid together.
        * In case of date presets it checks the number of days in a month.
        * @param {Integer} i - Currently changed wheel index, -1 if initial validation.
        */
        that.validate = function(time, orig, i, dir) {
            scrollToPos(time, orig, i, true, dir);
        }

        /**
         *
         */
        that.change = function (manual) {
            var v = s.formatResult(that.temp);
            if (s.display == 'inline')
                that.setValue(false, manual);
            else
                $('.dwv', dw).html(formatHeader(v));
            if (manual)
                s.onChange.call(e, v, that);
        }

        /**
        * Hides the scroller instance.
        */
        that.hide = function () {
            // If onClose handler returns false, prevent hide
            if (s.onClose.call(e, that.val, that) === false) return false;
            // Re-enable temporary disabled fields
            $('.dwtd').prop('disabled', false).removeClass('dwtd');
            elm.blur();
            // Hide wheels and overlay
            if (dw)
                dw.remove();
            visible = false;
            // Stop positioning on window resize
            $(window).unbind('.dw');
        }

        /**
        * Shows the scroller instance.
        */
        that.show = function () {
            if (s.disabled || visible) return false;

            var hi = s.height,
                thi = s.rows * hi;

            // Parse value from input
            read();

            // Create wheels containers
            var html = '<div class="' + s.theme + '">' + (s.display == 'inline' ? '<div class="dw dwbg dwi"><div class="dwwr">' : '<div class="dwo"></div><div class="dw dwbg"><div class="dwwr">' + (s.headerText ? '<div class="dwv"></div>' : ''));
            for (var i = 0; i < s.wheels.length; i++) {
                html += '<div class="dwc' + (s.mode != 'scroller' ? ' dwpm' : ' dwsc') + (s.showLabel ? '' : ' dwhl') + '"><div class="dwwc dwrc"><table cellpadding="0" cellspacing="0"><tr>';
                // Create wheels
                for (var label in s.wheels[i]) {
                    html += '<td><div class="dwwl dwrc">' + (s.mode != 'scroller' ? '<div class="dwwb dwwbp" style="height:' + hi + 'px;line-height:' + hi + 'px;"><span>+</span></div><div class="dwwb dwwbm" style="height:' + hi + 'px;line-height:' + hi + 'px;"><span>&ndash;</span></div>' : '') + '<div class="dwl">' + label + '</div><div class="dww dwrc" style="height:' + thi + 'px;min-width:' + s.width + 'px;"><ul>';
                    // Create wheel values
                    for (var j in s.wheels[i][label]) {
                        html += '<li class="dw-v" data-val="' + j + '" style="height:' + hi + 'px;line-height:' + hi + 'px;">' + s.wheels[i][label][j] + '</li>';
                    }
                    html += '</ul><div class="dwwo"></div></div><div class="dwwol"></div></div></td>';
                }
                html += '</tr></table></div></div>';
            }
            html += (s.display != 'inline' ? '<div class="dwbc"><span class="dwbw dwb-s"><a href="#" class="dwb">' + s.setText + '</a></span><span class="dwbw dwb-c"><a href="#" class="dwb">' + s.cancelText + '</a></span></div>' : '<div class="dwcc"></div>') + '</div></div></div>';

            dw = $(html);

            scrollToPos();

            // Show
            s.display != 'inline' ? dw.appendTo('body') : elm.is('div') ? elm.html(dw) : dw.insertAfter(elm);
            visible = true;

            // Theme init
            theme.init(dw, that);

            if (s.display != 'inline') {
                // Init buttons
                $('.dwb-s a', dw).click(function () {
                    that.setValue(false, true);
                    that.hide();
                    s.onSelect.call(e, that.val, that);
                    return false;
                });

                $('.dwb-c a', dw).click(function () {
                    that.hide();
                    s.onCancel.call(e, that.val, that);
                    return false;
                });

                // Disable inputs to prevent bleed through (Android bug)
                $('input,select').each(function() {
                    if (!$(this).prop('disabled'))
                        $(this).addClass('dwtd');
                });
                $('input,select').prop('disabled', true);

                // Set position
                position();
                $(window).bind('resize.dw', position);
            }

            // Events
            dw.delegate('.dwwl', 'DOMMouseScroll mousewheel', function (e) {
                if (!s.readonly) {
                    e.preventDefault();
                    e = e.originalEvent;
                    var delta = e.wheelDelta ? (e.wheelDelta / 120) : (e.detail ? (-e.detail / 3) : 0),
                        t = $('ul', this),
                        p = +t.data('pos'),
                        val = Math.round(p - delta);
                    setGlobals(t);
                    calc(t, val, delta < 0 ? 1 : 2);
                }
            }).delegate('.dwb, .dwwb', START_EVENT, function (e) {
                // Active button
                $(this).addClass('dwb-a');
            }).delegate('.dwwb', START_EVENT, function (e) {
                if (!s.readonly) {
                    // + Button
                    e.preventDefault();
                    e.stopPropagation();
                    var t = $(this).closest('.dwwl').find('ul')
                        func = $(this).hasClass('dwwbp') ? plus : minus;
                    setGlobals(t);
                    clearInterval(timer);
                    timer = setInterval(function() { func(t); }, s.delay);
                    func(t);
                }
            }).delegate('.dwwl', START_EVENT, function (e) {
                // Scroll start
                if (!move && s.mode != 'clickpick' && !s.readonly) {
                    e.preventDefault();
                    move = true;
                    target = $('ul', this).addClass('dwa');
                    if (s.mode == 'mixed')
                        $('.dwwb', this).fadeOut('fast');
                    pos = +target.data('pos');
                    setGlobals(target);
                    start = getY(e);
                    startTime = new Date();
                    stop = start;
                    that.scroll(target, pos);
                }
            });

            s.onShow.call(e, dw, that);
        }

        /**
        * Scroller initialization.
        */
        that.init = function(ss) {
            // Get theme defaults
            theme = $.extend({ defaults: {}, init: empty }, $.scroller.themes[ss.theme ? ss.theme : s.theme]);

            $.extend(s, theme.defaults, ss);

            that.settings = s;

            m = Math.floor(s.rows / 2);

            var preset = $.scroller.presets[s.preset];

            elm.unbind('.dw');

            if (preset) {
                var p = preset.call(e, that)
                $.extend(s, p, ss)
                // Extend core methods
                $.extend(methods, p.methods);
            }

            if (elm.data('dwro') !== undefined)
                e.readOnly = bool(elm.data('dwro'));

            if (visible)
                that.hide();

            if (s.display == 'inline') {
                that.show();
            }
            else {
                read();
                if (input && s.showOnFocus) {
                    // Set element readonly, save original state
                    elm.data('dwro', e.readOnly);
                    e.readOnly = true;
                    // Init show datewheel
                    elm.bind('focus.dw', that.show);
                }
            }
        }

        that.values = null;
        that.val = null;
        that.temp = null;

        that.init(settings);
    }

    function testProps(props) {
        for (var i in props) {
            if (mod[props[i]] !== undefined ) {
                return true;
            }
        }
        return false;
    }

    function testPrefix() {
        var prefixes = ['Webkit', 'Moz', 'O', 'ms'];
        for (var p in prefixes) {
            if (testProps([prefixes[p] + 'Transform']))
                return '-' + prefixes[p].toLowerCase();
        }
        return '';
    }

    function getInst(e) {
        return scrollers[e.id];
    }

    function getY(e) {
        return touch ? (e.originalEvent ? e.originalEvent.changedTouches[0].pageY : e.changedTouches[0].pageY) : e.pageY;
    }

    function bool(v) {
        return (v === true || v == 'true');
    }

    function calc(t, val, dir, anim, orig) {
        var i = t.closest('.dwwr').find('ul').index(t);

        val = val > max ? max : val;
        val = val < min ? min : val;

        var cell = $('li', t).eq(val);
        // Set selected scroller value
        inst.temp[i] = cell.data('val');

        // Validate
        //val = inst.validate(i, val, cell);

        // Call scroll with animation (calc animation time)
        //inst.scroll(t, val, anim ? (val == orig ? 0.1 : Math.abs((val - orig) * 0.1)) : 0, orig, i);
        inst.validate(anim ? (val == orig ? 0.1 : Math.abs((val - orig) * 0.1)) : 0, orig, i, dir);

        // Set value text
        //inst.change(true);
    }

    var scrollers = {},
        timer,
        empty = function() {},
        h,
        min,
        max,
        inst, // Current instance
        date = new Date(),
        uuid = date.getTime(),
        move = false,
        target = null,
        start,
        stop,
        startTime,
        endTime,
        pos,
        mod = document.createElement(mod).style,
        has3d = testProps(['perspectiveProperty', 'WebkitPerspective', 'MozPerspective', 'OPerspective', 'msPerspective']) && 'webkitPerspective' in document.documentElement.style,
        prefix = testPrefix(),
        touch = ('ontouchstart' in window),
        START_EVENT = touch ? 'touchstart' : 'mousedown',
        MOVE_EVENT = touch ? 'touchmove' : 'mousemove',
        END_EVENT = touch ? 'touchend' : 'mouseup',
        defaults = {
            // Options
            width: 70,
            height: 40,
            rows: 3,
            delay: 300,
            disabled: false,
            readonly: false,
            showOnFocus: true,
            showLabel: true,
            wheels: [],
            theme: '',
            headerText: '{value}',
            display: 'modal',
            mode: 'scroller',
            preset: '',
            setText: 'Set',
            cancelText: 'Cancel',
            // Events
            onShow: empty,
            onClose: empty,
            onSelect: empty,
            onCancel: empty,
            onChange: empty,
            formatResult: function(d) {
                var out = '';
                for (var i = 0; i < d.length; i++) {
                    out += (i > 0 ? ' ' : '') + d[i];
                }
                return out;
            },
            parseValue: function(val, inst) {
                var w = inst.settings.wheels,
                    val = val.split(' '),
                    ret = [],
                    j = 0;
                for (var i = 0; i < w.length; i++) {
                    for (var l in w[i]) {
                        if (w[i][l][val[j]] !== undefined)
                            ret.push(val[j])
                        else
                            // Select first value from wheel
                            for (var v in w[i][l]) {
                                ret.push(v);
                                break;
                            }
                        j++;
                    }
                }
                return ret;
            },
            validate: empty
        },

        methods = {
            init: function (options) {
                if (options === undefined) options = {};
                return this.each(function () {
                    if (!this.id) {
                        uuid += 1;
                        this.id = 'scoller' + uuid;
                    }
                    scrollers[this.id] = new Scroller(this, options);
                });
            },
            enable: function() {
                return this.each(function () {
                    var inst = getInst(this);
                    if (inst) inst.enable();
                });
            },
            disable: function() {
                return this.each(function () {
                    var inst = getInst(this);
                    if (inst) inst.disable();
                });
            },
            isDisabled: function() {
                var inst = getInst(this[0]);
                if (inst)
                    return inst.settings.disabled;
            },
            option: function(option, value) {
                return this.each(function () {
                    var inst = getInst(this);
                    if (inst) {
                        var obj = {};
                        if (typeof option === 'object')
                            obj = option;
                        else
                            obj[option] = value;
                        inst.init(obj);
                    }
                });
            },
            setValue: function(d, fill, time) {
                return this.each(function () {
                    var inst = getInst(this);
                    if (inst) {
                        inst.temp = d;
                        inst.setValue(true, fill, time);
                    }
                });
            },
            getInst: function() {
                return getInst(this[0]);
            },
            getValue: function() {
                var inst = getInst(this[0]);
                if (inst)
                    return inst.values;
            },
            show: function() {
                var inst = getInst(this[0]);
                if (inst)
                    return inst.show();
            },
            hide: function() {
                return this.each(function () {
                    var inst = getInst(this);
                    if (inst)
                        inst.hide();
                });
            },
            destroy: function() {
                return this.each(function () {
                    var inst = getInst(this);
                    if (inst) {
                        inst.hide();
                        $(this).unbind('.dw');
                        delete scrollers[this.id];
                        if ($(this).is('input'))
                            this.readOnly = bool($(this).data('dwro'));
                    }
                });
            }
        };

    $(document).bind(MOVE_EVENT, function (e) {
        if (move) {
            e.preventDefault();
            stop = getY(e);
            var val = pos + (start - stop) / h;
            val = val > (max + 1) ? (max + 1) : val;
            val = val < (min - 1) ? (min - 1) : val;
            inst.scroll(target, val);
        }
    });

    $(document).bind(END_EVENT, function (e) {
        if (move) {
            e.preventDefault();
            target.removeClass('dwa');
            var time = new Date() - startTime,
                val = pos + (start - stop) / h;
            val = val > (max + 1) ? (max + 1) : val;
            val = val < (min - 1) ? (min - 1) : val;

            if (time < 300) {
                var speed = (stop - start) / time;
                var dist = (speed * speed) / (2 * 0.0006);
                if (stop - start < 0) dist = -dist;
            }
            else {
                var dist = stop - start;
            }
            calc(target, Math.round(pos - dist / h), 0, true, Math.round(val));
            move = false;
            target = null;
        }
        clearInterval(timer);
        $('.dwb-a').removeClass('dwb-a');
    });

    $.fn.scroller = function (method) {
        if (methods[method]) {
            return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
        }
        else if (typeof method === 'object' || !method) {
            return methods.init.apply(this, arguments);
        }
        else {
            $.error('Unknown method');
        }
    }

    $.scroller = {
        /**
        * Set settings for all instances.
        * @param {Object} o - New default settings.
        */
        setDefaults: function(o) {
            $.extend(defaults, o);
        },
        presets: {},
        themes: {}
    };

})(jQuery);
(function ($) {

    var date = new Date(),
        defaults = {
            dateFormat: 'mm/dd/yy',
            dateOrder: 'mmddy',
            timeWheels: 'hhiiA',
            timeFormat: 'hh:ii A',
            startYear: date.getFullYear() - 100,
            endYear: date.getFullYear() + 1,
            monthNames: ['January','February','March','April','May','June', 'July','August','September','October','November','December'],
            monthNamesShort: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            dayNames: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
            dayNamesShort: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
            shortYearCutoff: '+10',
            monthText: 'Month',
            dayText: 'Day',
            yearText: 'Year',
            hourText: 'Hours',
            minuteText: 'Minutes',
            secText: 'Seconds',
            ampmText: '&nbsp;',
            stepHour: 1,
            stepMinute: 1,
            stepSecond: 1,
            separator: ' '
        },
        preset = function(inst) {
            var that = $(this),
                format;
            // Force format for html5 date inputs (experimental)
            if (that.is('input')) {
                switch (that.attr('type')) {
                    case 'date':
                        format = 'yy-mm-dd';
                        break;
                    case 'datetime':
                        format = 'yy-mm-ddTHH:ii:ssZ';
                        break;
                    case 'datetime-local':
                        format = 'yy-mm-ddTHH:ii:ss';
                        break;
                    case 'month':
                        format = 'yy-mm';
                        defaults.dateOrder = 'mmyy';
                        break;
                    case 'time':
                        format = 'HH:ii:ss';
                        break;
                }
                // Check for min/max attributes
                var min = that.attr('min'),
                    max = that.attr('max');
                if (min)
                    defaults.minDate = $.scroller.parseDate(format, min);
                if (max)
                    defaults.maxDate = $.scroller.parseDate(format, max);
            }

            // Set year-month-day order
            var s = $.extend({}, defaults, inst.settings),
                offset = 0,
                wheels = [],
                ord = [],
                o = {},
                f = { y: 'getFullYear', m: 'getMonth', d: 'getDate', h: getHour, i: getMinute, s: getSecond, ap: getAmPm },
                p = s.preset,
                dord = s.dateOrder,
                tord = s.timeWheels,
                regen = dord.match(/D/),
                ampm = tord.match(/a/i),
                hampm = tord.match(/h/),
                hformat = p == 'datetime' ? s.dateFormat + s.separator + s.timeFormat : p == 'time' ? s.timeFormat : s.dateFormat,
                defd = new Date(),
                stepH = s.stepHour,
                stepM = s.stepMinute,
                stepS = s.stepSecond,
                mind = s.minDate,
                maxd = s.maxDate;

            format = format ? format : hformat;

            if (p.match(/date/i)) {

                // Determine the order of year, month, day wheels
                $.each(['y', 'm', 'd'], function(i, v) {
                    var i = dord.search(new RegExp(v, 'i'));
                    if (i > -1)
                        ord.push({ o: i, v: v });
                });
                ord.sort(function(a, b) { return a.o > b.o ? 1 : -1; });
                $.each(ord, function(i, v) {
                    o[v.v] = i;
                });

                var w = {};
                for (var k = 0; k < 3; k++) {
                    if (k == o.y) {
                        offset++;
                        w[s.yearText] = {};
                        var start = mind ? mind.getFullYear() : s.startYear,
                            end = maxd ? maxd.getFullYear() : s.endYear;
                        for (var i = start; i <= end; i++)
                            w[s.yearText][i] = dord.match(/yy/i) ? i : (i + '').substr(2, 2);
                    }
                    else if (k == o.m) {
                        offset++;
                        w[s.monthText] = {};
                        for (var i = 0; i < 12; i++)
                            w[s.monthText][i] =
                                dord.match(/MM/) ? s.monthNames[i] :
                                dord.match(/M/) ? s.monthNamesShort[i] :
                                dord.match(/mm/) && i < 9 ? '0' + (i + 1) : i + 1;
                    }
                    else if (k == o.d) {
                        offset++;
                        w[s.dayText] = {};
                        for (var i = 1; i < 32; i++)
                            w[s.dayText][i] = dord.match(/dd/i) && i < 10 ? '0' + i : i;
                    }
                }
                wheels.push(w);
            }
            if (p.match(/time/i)) {
                var w = {};
                if (tord.match(/h/i)) {
                    o.h = offset++; // Hours wheel order
                    w[s.hourText] = {};
                    for (var i = 0; i < (hampm ? 12 : 24); i += stepH)
                        w[s.hourText][i] = hampm && i == 0 ? 12 : tord.match(/hh/i) && i < 10 ? '0' + i : i;
                }
                if (tord.match(/i/)) {
                    o.i = offset++; // Minutes wheel order
                    w[s.minuteText] = {};
                    for (var i = 0; i < 60; i += stepM)
                        w[s.minuteText][i] = tord.match(/ii/) && i < 10 ? '0' + i : i;
                }
                if (tord.match(/s/)) {
                    o.s = offset++; // Seconds wheel order
                    w[s.secText] = {};
                    for (var i = 0; i < 60; i += stepS)
                        w[s.secText][i] = tord.match(/ss/) && i < 10 ? '0' + i : i;
                }
                if (ampm) {
                    o.ap = offset++; // ampm wheel order
                    var upper = tord.match(/A/);
                    w[s.ampmText] = { 0: upper ? 'AM' : 'am', 1: upper ? 'PM' : 'pm' };
                }
                wheels.push(w);
            }

            function get(d, i, def) {
                if (o[i] !== undefined)
                    return +d[o[i]];
                if (def !== undefined)
                    return def;
                return defd[f[i]] ? defd[f[i]]() : f[i](defd);
            }

            function step(v, step) {
                return Math.floor(v / step) * step;
            }

            function getHour(d) {
                var hour = d.getHours();
                hour = hampm && hour >= 12 ? hour - 12 : hour;
                return step(hour, stepH);
            }

            function getMinute(d) {
                return step(d.getMinutes(), stepM);
            }

            function getSecond(d) {
                return step(d.getSeconds(), stepS);
            }

            function getAmPm(d) {
                return ampm && d.getHours() > 11 ? 1 : 0;
            }

            function getDate(d) {
                var hour = get(d, 'h', 0);
                return new Date(get(d, 'y'), get(d, 'm'), get(d, 'd'), get(d, 'ap') ? hour + 12 : hour, get(d, 'i', 0), get(d, 's', 0));
            }

            return {
                wheels: wheels,
                headerText: function(v) {
                    return $.scroller.formatDate(hformat, getDate(inst.temp), s);
                },
                /**
                 * Builds a date object from the wheel selections and formats it to the given date/time format
                 * @param {Array} d - An array containing the selected wheel values
                 * @return {String} - The formatted date string
                 */
                formatResult: function(d) {
                    return $.scroller.formatDate(format, getDate(d), s);
                },
                /**
                 * Builds a date object from the input value and returns an array to set wheel values
                 * @return {Array} - An array containing the wheel values to set
                 */
                parseValue: function(val) {
                    var d = new Date(),
                        result = [];
                    try {
                        d = $.scroller.parseDate(format, val, s);
                    }
                    catch (e) {
                    }
                    // Set wheels
                    for (var i in o)
                        result[o[i]] = d[f[i]] ? d[f[i]]() : f[i](d);
                    return result;
                },
                /**
                 * Validates the selected date to be in the minDate / maxDate range and sets unselectable values to disabled
                 * @param {Object} dw - jQuery object containing the generated html
                 * @param {Integer} [i] - Index of the changed wheel, not set for initial validation
                 */
                validate: function(dw, i) {
                    var temp = inst.temp,
                        mins = { m: 0, d: 1, h: 0, i: 0, s: 0, ap: 0 },
                        maxs = { m: 11, d: 31, h: step(hampm ? 11 : 23, stepH), i: step(59, stepM), s: step(59, stepS), ap: 1 },
                        w = (mind || maxd) ? ['y', 'm', 'd', 'ap', 'h', 'i', 's'] : ((i == o.y || i == o.m || i === undefined) ? ['d'] : []), // Validate day only, if no min/max date set
                        minprop = true,
                        maxprop = true;
                    $.each(w, function(x, i) {
                        if (o[i] !== undefined) {
                            var min = mins[i],
                                max = maxs[i],
                                maxdays = 31,
                                val = get(temp, i),
                                t = $('ul', dw).eq(o[i]),
                                y, m;
                            if (i == 'd') {
                                y = get(temp, 'y'),
                                m = get(temp, 'm');
                                maxdays = 32 - new Date(y, m, 32).getDate();
                                max = maxdays;
                                if (regen)
                                    $('li', t).each(function() {
                                        var that = $(this),
                                            d = that.data('val'),
                                            w = new Date(y, m, d).getDay();
                                        that.html(dord.replace(/[my]/gi, '').replace(/dd/, d < 10 ? '0' + d : d).replace(/d/, d).replace(/DD/, s.dayNames[w]).replace(/D/, s.dayNamesShort[w]));
                                    });
                            }
                            if (minprop && mind) {
                                min = mind[f[i]] ? mind[f[i]]() : f[i](mind);
                            }
                            if (maxprop && maxd) {
                                max = maxd[f[i]] ? maxd[f[i]]() : f[i](maxd);
                            }
                            if (i != 'y') {
                                var i1 = $('li[data-val="' + min + '"]', t).index(),
                                    i2 = $('li[data-val="' + max + '"]', t).index();
                                $('li', t).removeClass('dw-v').slice(i1, i2 + 1).addClass('dw-v');
                                if (i == 'd') { // Hide days not in month
                                    $('li', t).removeClass('dw-h').slice(maxdays).addClass('dw-h');
                                }
                                if (val < min)
                                    val = min;
                                if (val > max)
                                    val = max;
                            }
                            if (minprop)
                                minprop = val == min;
                            if (maxprop)
                                maxprop = val == max;
                            // Disable some days
                            if (s.invalid && i == 'd') {
                                var idx = [];
                                // Disable exact dates
                                if (s.invalid.dates)
                                    $.each(s.invalid.dates, function(i, v) {
                                        if (v.getFullYear() == y && v.getMonth() == m) {
                                            idx.push(v.getDate() - 1);
                                        }
                                    });
                                // Disable days of week
                                if (s.invalid.daysOfWeek) {
                                    var first = new Date(y, m, 1).getDay();
                                    $.each(s.invalid.daysOfWeek, function(i, v) {
                                        for (var j = v - first; j < maxdays; j += 7)
                                            if (j >= 0)
                                                idx.push(j);
                                    });
                                }
                                // Disable days of month
                                if (s.invalid.daysOfMonth)
                                    $.each(s.invalid.daysOfMonth, function(i, v) {
                                        v = (v + '').split('/');
                                        if (v[1]) {
                                            if (v[0] - 1 == m)
                                                idx.push(v[1] - 1);
                                        }
                                        else
                                            idx.push(v[0] - 1);
                                    });
                                $.each(idx, function(i, v) {
                                    $('li', t).eq(v).removeClass('dw-v');
                                });
                            }
                        }
                    });
                },
                methods: {
                    /**
                    * Returns the currently selected date.
                    * @param {Boolean} temp - If true, return the currently shown date on the picker, otherwise the last selected one
                    * @return {Date}
                    */
                    getDate: function(temp) {
                        //var inst = $(this).data('scroller');
                        var inst = $(this).scroller('getInst');
                        if (inst)
                            return getDate(temp ? inst.temp : inst.values);
                    },
                    /**
                    * Sets the selected date
                    * @param {Date} d - Date to select.
                    * @param {Boolean} [fill] - Also set the value of the associated input element. Default is true.
                    * @return {Object} - jQuery object to maintain chainability
                    */
                    setDate: function(d, fill, time) {
                        if (fill == undefined) fill = false;
                        return this.each(function () {
                            var inst = $(this).scroller('getInst');
                            if (inst) {
                                // Set wheels
                                for (var i in o)
                                    inst.temp[o[i]] = d[f[i]] ? d[f[i]]() : f[i](d);
                                inst.setValue(true, fill, time);
                            }
                        });
                    }
                }
            }
        };

    $.scroller.presets.date = preset;
    $.scroller.presets.datetime = preset;
    $.scroller.presets.time = preset;

    /**
    * Format a date into a string value with a specified format.
    * @param {String} format - Output format.
    * @param {Date} date - Date to format.
    * @param {Object} settings - Settings.
    * @return {String} - Returns the formatted date string.
    */
    $.scroller.formatDate = function (format, date, settings) {
        if (!date) return null;
        var s = $.extend({}, defaults, settings),
            // Check whether a format character is doubled
            look = function(m) {
                var n = 0;
                while (i + 1 < format.length && format.charAt(i + 1) == m) { n++; i++; };
                return n;
            },
            // Format a number, with leading zero if necessary
            f1 = function(m, val, len) {
                var n = '' + val;
                if (look(m))
                    while (n.length < len)
                        n = '0' + n;
                return n;
            },
            // Format a name, short or long as requested
            f2 = function(m, val, s, l) {
                return (look(m) ? l[val] : s[val]);
            },
            output = '',
            literal = false;
        for (var i = 0; i < format.length; i++) {
            if (literal)
                if (format.charAt(i) == "'" && !look("'"))
                    literal = false;
                else
                    output += format.charAt(i);
            else
                switch (format.charAt(i)) {
                    case 'd':
                        output += f1('d', date.getDate(), 2);
                        break;
                    case 'D':
                        output += f2('D', date.getDay(), s.dayNamesShort, s.dayNames);
                        break;
                    case 'o':
                        output += f1('o', (date.getTime() - new Date(date.getFullYear(), 0, 0).getTime()) / 86400000, 3);
                        break;
                    case 'm':
                        output += f1('m', date.getMonth() + 1, 2);
                        break;
                    case 'M':
                        output += f2('M', date.getMonth(), s.monthNamesShort, s.monthNames);
                        break;
                    case 'y':
                        output += (look('y') ? date.getFullYear() : (date.getYear() % 100 < 10 ? '0' : '') + date.getYear() % 100);
                        break;
                    case 'h':
                        var h = date.getHours();
                        output += f1('h', (h > 12 ? (h - 12) : (h == 0 ? 12 : h)), 2);
                        break;
                    case 'H':
                        output += f1('H', date.getHours(), 2);
                        break;
                    case 'i':
                        output += f1('i', date.getMinutes(), 2);
                        break;
                    case 's':
                        output += f1('s', date.getSeconds(), 2);
                        break;
                    case 'a':
                        output += date.getHours() > 11 ? 'pm' : 'am';
                        break;
                    case 'A':
                        output += date.getHours() > 11 ? 'PM' : 'AM';
                        break;
                    case "'":
                        if (look("'"))
                            output += "'";
                        else
                            literal = true;
                        break;
                    default:
                        output += format.charAt(i);
                }
        }
        return output;
    }

    /**
    * Extract a date from a string value with a specified format.
    * @param {String} format - Input format.
    * @param {String} value - String to parse.
    * @param {Object} settings - Settings.
    * @return {Date} - Returns the extracted date.
    */
    $.scroller.parseDate = function (format, value, settings) {
        var def = new Date();
        if (!format || !value) return def;
        value = (typeof value == 'object' ? value.toString() : value + '');
        var s = $.extend({}, defaults, settings),
            year = def.getFullYear(),
            month = def.getMonth() + 1,
            day = def.getDate(),
            doy = -1,
            hours = def.getHours(),
            minutes = def.getMinutes(),
            seconds = 0, //def.getSeconds(),
            ampm = -1,
            literal = false,
            // Check whether a format character is doubled
            lookAhead = function(match) {
                var matches = (iFormat + 1 < format.length && format.charAt(iFormat + 1) == match);
                if (matches)
                    iFormat++;
                return matches;
            },
            // Extract a number from the string value
            getNumber = function(match) {
                lookAhead(match);
                var size = (match == '@' ? 14 : (match == '!' ? 20 :
                    (match == 'y' ? 4 : (match == 'o' ? 3 : 2))));
                var digits = new RegExp('^\\d{1,' + size + '}');
                var num = value.substr(iValue).match(digits);
                if (!num)
                    return 0;
                    //throw 'Missing number at position ' + iValue;
                iValue += num[0].length;
                return parseInt(num[0], 10);
            },
            // Extract a name from the string value and convert to an index
            getName = function(match, s, l) {
                var names = (lookAhead(match) ? l : s);
                for (var i = 0; i < names.length; i++) {
                    if (value.substr(iValue, names[i].length).toLowerCase() == names[i].toLowerCase()) {
                        iValue += names[i].length;
                        return i + 1;
                    }
                }
                return 0;
                //throw 'Unknown name at position ' + iValue;
            },
            // Confirm that a literal character matches the string value
            checkLiteral = function() {
                //if (value.charAt(iValue) != format.charAt(iFormat))
                    //throw 'Unexpected literal at position ' + iValue;
                iValue++;
            },
            iValue = 0;

        for (var iFormat = 0; iFormat < format.length; iFormat++) {
            if (literal)
                if (format.charAt(iFormat) == "'" && !lookAhead("'"))
                    literal = false;
                else
                    checkLiteral();
            else
                switch (format.charAt(iFormat)) {
                    case 'd':
                        day = getNumber('d');
                        break;
                    case 'D':
                        getName('D', s.dayNamesShort, s.dayNames);
                        break;
                    case 'o':
                        doy = getNumber('o');
                        break;
                    case 'm':
                        month = getNumber('m');
                        break;
                    case 'M':
                        month = getName('M', s.monthNamesShort, s.monthNames);
                        break;
                    case 'y':
                        year = getNumber('y');
                        break;
                    case 'H':
                        hours = getNumber('H');
                        break;
                    case 'h':
                        hours = getNumber('h');
                        break;
                    case 'i':
                        minutes = getNumber('i');
                        break;
                    case 's':
                        seconds = getNumber('s');
                        break;
                    case 'a':
                        ampm = getName('a', ['am', 'pm'], ['am', 'pm']) - 1;
                        break;
                    case 'A':
                        ampm = getName('A', ['am', 'pm'], ['am', 'pm']) - 1;
                        break;
                    case "'":
                        if (lookAhead("'"))
                            checkLiteral();
                        else
                            literal = true;
                        break;
                    default:
                        checkLiteral();
                }
        }
        if (year < 100)
            year += new Date().getFullYear() - new Date().getFullYear() % 100 +
                (year <= s.shortYearCutoff ? 0 : -100);
        if (doy > -1) {
            month = 1;
            day = doy;
            do {
                var dim = 32 - new Date(year, month - 1, 32).getDate();
                if (day <= dim)
                    break;
                month++;
                day -= dim;
            } while (true);
        }
        hours = (ampm == -1) ? hours : ((ampm && hours < 12) ? (hours + 12) : (!ampm && hours == 12 ? 0 : hours));
        var date = new Date(year, month - 1, day, hours, minutes, seconds);
        if (date.getFullYear() != year || date.getMonth() + 1 != month || date.getDate() != day)
            throw 'Invalid date';
        return date;
    }

})(jQuery);
(function ($) {

    var defaults = {
        inputClass: ''
    }

    $.scroller.presets.select = function(inst) {
        var s = $.extend({}, defaults, inst.settings),
            elm = $(this),
            id = this.id + '_dummy',
            l1 = $('label[for="' + this.id + '"]').attr('for', id),
            l2 = $('label[for="' + id + '"]'),
            label = l2.length ? l2.text() : elm.attr('name'),
            invalid = [],
            w = [{}];

        w[0][label] = {};

        var main = w[0][label];

        $('option', elm).each(function() {
            var v = $(this).attr('value');
            main[v] = $(this).text();
            if ($(this).prop('disabled')) invalid.push(v);
        });

        $('#' + id).remove();

        var input = $('<input type="text" id="' + id + '" value="' + main[elm.val()] + '" class="' + s.inputClass + '" readonly />').insertBefore(elm);

        if (s.showOnFocus)
            input.focus(function() { inst.show() });

        elm.hide().closest('.ui-field-contain').trigger('create');

        return {
            width: 200,
            wheels: w,
            headerText: false,
            formatResult: function(d) {
                return main[d[0]];
            },
            parseValue: function() {
                return [elm.val()];
            },
            validate: function(dw) {
                $.each(invalid, function(i, v) {
                    $('li[data-val="' + v + '"]', dw).removeClass('dw-v');
                });
            },
            onSelect: function(v, inst) {
                input.val(v);
                elm.val(inst.values[0]).trigger('change');
            },
            onChange: function(v, inst) {
                if (s.display == 'inline') {
                    input.val(v);
                    elm.val(inst.temp[0]).trigger('change');
                }
            },
            onClose: function() {
                input.blur();
            }
        }
    }

})(jQuery);
(function ($) {

    $.scroller.themes.jqm = {
        defaults: {
            jqmBody: 'c',
            jqmHeader:'b',
            jqmWheel: 'd',
            jqmClickPick: 'c',
            jqmSet: 'b',
            jqmCancel: 'c'
        },
        init: function(elm, inst) {
            var s = inst.settings;
            $('.dw', elm).removeClass('dwbg').addClass('ui-overlay-shadow ui-corner-all ui-body-a');
            $('.dwb-s a', elm).attr('data-role', 'button').attr('data-theme', s.jqmSet);
            $('.dwb-c a', elm).attr('data-role', 'button').attr('data-theme', s.jqmCancel);
            $('.dwwb', elm).attr('data-role', 'button').attr('data-theme', s.jqmClickPick);
            $('.dwv', elm).addClass('ui-header ui-bar-' + s.jqmHeader);
            $('.dwwr', elm).addClass('ui-body-' + s.jqmBody);
            $('.dwpm .dww', elm).addClass('ui-body-' + s.jqmWheel);
            if (s.display != 'inline')
                $('.dw', elm).addClass('pop in');
            elm.trigger('create');
            // Hide on overlay click
            $('.dwo', elm).click(function() { inst.hide(); });
        }
    }

})(jQuery);
