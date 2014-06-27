var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
function e(input) {
    if (typeof input === "undefined") { input = null; }
    if (typeof input == 'string') {
        var enumerable = input.split('');
        enumerable.__proto__ = String.prototype;
        return enumerable;
    }

    if (input instanceof Enumerable) {
        var enumerable = [].slice.call(input, 0);

        if (input.all(function (i) {
            return typeof i == 'string';
        })) {
            enumerable.__proto__ = String.prototype;
            return enumerable;
        }

        var enumerable = [].slice.call(input, 0);
        enumerable.__proto__ = Enumerable.prototype;
        return enumerable;
    }

    if (input instanceof Array) {
        var enumerable = [].slice.call(input, 0);

        if (input.every(function (i) {
            return typeof i == 'string';
        })) {
            enumerable.__proto__ = String.prototype;
            return enumerable;
        }

        var enumerable = [].slice.call(input, 0);
        enumerable.__proto__ = Enumerable.prototype;
        return enumerable;
    }

    if (input === null) {
        var enumerable = [];
        enumerable.__proto__ = Enumerable.prototype;
        return enumerable;
    }

    throw new Error('Unsupported input type, use array, string or Enumerable.');
}
exports.e = e;

var Enumerable = (function () {
    function Enumerable() {
        this.orderingSequence = [];
    }
    Enumerable.prototype.aggregate = function (predicate, seed) {
        return [].reduce.call(this, predicate, seed);
    };

    Enumerable.prototype.all = function (predicate) {
        return [].every.call(this, predicate);
    };

    Enumerable.prototype.any = function (predicate) {
        return [].some.call(this, predicate);
    };

    Enumerable.prototype.average = function (predicate) {
        if (typeof predicate === "undefined") { predicate = function (i) {
            return i;
        }; }
        return this.sum(predicate) / this.count();
    };

    Enumerable.prototype.cast = function () {
        return exports.e(this);
    };

    Enumerable.prototype.concat = function (enumerable) {
        return exports.e([].concat.call(this, enumerable));
    };

    Enumerable.prototype.contains = function (item) {
        return -1 != [].indexOf.call(this, item);
    };

    Enumerable.prototype.count = function (predicate) {
        if (!predicate) {
            return this.toArray().length;
        }

        return this.aggregate(function (res, item) {
            if (predicate(item)) {
                res++;
            }
            return res;
        }, 0);
    };

    Enumerable.prototype.distinct = function (predicate) {
        var metValues = [];
        var res = [];

        this.forEach(function (item) {
            var key = predicate ? predicate(item) : item;

            if (-1 == metValues.indexOf(key)) {
                metValues.push(key);
                res.push(item);
            }
        });

        return exports.e(res);
    };

    Enumerable.prototype.elementAt = function (index) {
        return this[index];
    };

    Enumerable.prototype.empty = function () {
        return exports.e([]);
    };

    Enumerable.prototype.except = function (enumerable) {
        return this.where(function (item) {
            return -1 == [].indexOf.call(enumerable, item);
        });
    };

    Enumerable.prototype.first = function (predicate) {
        for (var i = 0; i < this.count(); i++) {
            if (!predicate || predicate(this[i])) {
                return this[i];
            }
        }

        return undefined;
    };

    Enumerable.prototype.forEach = function (action) {
        [].forEach.call(this, action);
    };

    Enumerable.prototype.groupBy = function (predicate) {
        var res = exports.e();

        this.forEach(function (item) {
            var key = predicate(item);
            var group = res.first(function (g) {
                return g.key == key;
            });

            if (!group) {
                group = exports.e();
                group.key = key;

                [].push.call(res, group);
            }

            [].push.call(group, item);
        });

        return res;
    };

    Enumerable.prototype.intersect = function (enumerable) {
        return this.where(function (item) {
            return -1 != [].indexOf.call(enumerable, item);
        });
    };

    Enumerable.prototype.join = function (inner, outerSelector, innerSelector, resultSelector) {
        var _this = this;
        var res = [];

        this.forEach(function (outerItem) {
            var outerKey = outerSelector(outerItem);

            _this.forEach.call(inner, function (innerItem) {
                var innerKey = innerSelector(innerItem);

                if (outerKey == innerKey) {
                    res.push(resultSelector(outerItem, innerItem));
                }
            });
        });

        return exports.e(res);
    };

    Enumerable.prototype.last = function (predicate) {
        return this.reverse().first(predicate);
    };

    Enumerable.prototype.max = function (predicate) {
        var max = Number.MIN_VALUE;
        var res = undefined;

        this.forEach(function (item) {
            var representation = predicate ? predicate(item) : item;

            if (representation > max) {
                max = representation;
                res = item;
            }
        });

        return res;
    };

    Enumerable.prototype.min = function (predicate) {
        var min = Number.MAX_VALUE;
        var res = undefined;

        this.forEach(function (item) {
            var representation = predicate ? predicate(item) : item;

            if (representation < min) {
                min = representation;
                res = item;
            }
        });

        return res;
    };

    Enumerable.prototype.orderBy = function (predicate) {
        return this.order([
            {
                direction: 1 /* ASC */,
                predicate: predicate
            }
        ]);
    };

    Enumerable.prototype.orderByDescending = function (predicate) {
        return this.order([
            {
                direction: -1 /* DESC */,
                predicate: predicate
            }
        ]);
    };

    Enumerable.prototype.reverse = function () {
        return exports.e([].reverse.call(this.toArray()));
    };

    Enumerable.prototype.select = function (predicate) {
        return exports.e([].map.call(this, predicate));
    };

    Enumerable.prototype.selectMany = function (predicate) {
        if (typeof predicate === "undefined") { predicate = function (i) {
            return i;
        }; }
        return exports.e([].concat.apply([], this.select(predicate)));
    };

    Enumerable.prototype.single = function (predicate) {
        var result;

        for (var i = 0; i < this.count(); i++) {
            if (!predicate || predicate(this[i])) {
                if (typeof result != 'undefined') {
                    throw new Error('The enumerable contains more than one element' + (predicate ? ' satisfying the predicate.' : '.'));
                }
                result = this[i];
            }
        }

        if (typeof result == 'undefined') {
            throw new Error('The enumerable does not contain any element' + (predicate ? ' satisfying the predicate.' : '.'));
        }

        return result;
    };

    Enumerable.prototype.skip = function (count) {
        return exports.e([].slice.call(this, count));
    };

    Enumerable.prototype.skipWhile = function (predicate) {
        var res = [];
        var skipping = true;

        for (var i = 0; i < this.count(); i++) {
            var item = this[i];

            if (skipping && predicate(item)) {
                continue;
            } else {
                skipping = false;
            }

            res.push(item);
        }

        return exports.e(res);
    };

    Enumerable.prototype.sum = function (predicate) {
        if (typeof predicate === "undefined") { predicate = function (i) {
            return i;
        }; }
        var transformed = this.select(predicate);

        return transformed.aggregate(function (i, j) {
            return i + j;
        }, 0);
    };

    Enumerable.prototype.take = function (count) {
        return exports.e([].slice.call(this, 0, count));
    };

    Enumerable.prototype.takeWhile = function (predicate) {
        var res = [];

        for (var i = 0; i < this.count(); i++) {
            var item = this[i];

            if (!predicate(item)) {
                break;
            }

            res.push(item);
        }

        return exports.e(res);
    };

    Enumerable.prototype.thenBy = function (predicate) {
        return this.order(this.orderingSequence.concat([
            {
                direction: 1 /* ASC */,
                predicate: predicate
            }
        ]));
    };

    Enumerable.prototype.thenByDescending = function (predicate) {
        return this.order(this.orderingSequence.concat([
            {
                direction: -1 /* DESC */,
                predicate: predicate
            }
        ]));
    };

    Enumerable.prototype.union = function (enumerable) {
        return this.concat(enumerable).distinct();
    };

    Enumerable.prototype.toArray = function () {
        return [].slice.call(this, 0);
    };

    Enumerable.prototype.where = function (predicate) {
        return exports.e([].filter.call(this, predicate));
    };

    Enumerable.prototype.zip = function (enumerable, resultSelector) {
        var res = [];

        for (var i = 0; i < this.count() && i < exports.e(enumerable).count(); i++) {
            res.push(resultSelector(this[i], enumerable[i]));
        }

        return exports.e(res);
    };

    Enumerable.prototype.order = function (orderingSequence) {
        var result = this.toArray().sort(function (a, b) {
            for (var i in orderingSequence) {
                var order = orderingSequence[i];
                var predicate = order.predicate || (function (i) {
                    return i;
                });
                var aValue = predicate(a);
                var bValue = predicate(b);

                if (aValue > bValue) {
                    return order.direction;
                } else if (aValue < bValue) {
                    return -order.direction;
                }
            }

            return 0;
        });

        var enumerable = exports.e(result);
        enumerable.orderingSequence = orderingSequence;

        return enumerable;
    };
    return Enumerable;
})();
exports.Enumerable = Enumerable;

var String = (function (_super) {
    __extends(String, _super);
    function String() {
        _super.apply(this, arguments);
    }
    String.prototype.contains = function (text) {
        return -1 != this.toString().indexOf(text.toString());
    };

    String.prototype.compare = function (text, caseInsensitive) {
        if (typeof caseInsensitive === "undefined") { caseInsensitive = false; }
        var self = this.toString();
        text = text.toString();

        if (caseInsensitive) {
            text = text.toLocaleLowerCase();
            self = self.toLocaleLowerCase();
        }

        return self.localeCompare(text);
    };

    String.prototype.endsWith = function (text, caseInsensitive) {
        if (typeof caseInsensitive === "undefined") { caseInsensitive = false; }
        var self = this.toString();
        text = text.toString();

        if (caseInsensitive) {
            text = text.toLocaleLowerCase();
            self = self.toLocaleLowerCase();
        }

        return -1 !== self.indexOf(text, self.length - text.length);
    };

    String.prototype.equals = function (text, caseInsensitive) {
        if (typeof caseInsensitive === "undefined") { caseInsensitive = false; }
        var self = this.toString();
        text = text.toString();

        if (caseInsensitive) {
            text = text.toLocaleLowerCase();
            self = self.toLocaleLowerCase();
        }

        return self == text;
    };

    String.format = function (text) {
        var args = [];
        for (var _i = 0; _i < (arguments.length - 1); _i++) {
            args[_i] = arguments[_i + 1];
        }
        return exports.e(text.toString().replace(/{(\d+)}/g, function (match, index) {
            return args[index].toString();
        }));
    };

    String.prototype.indexOf = function (text, caseInsensitive) {
        if (typeof caseInsensitive === "undefined") { caseInsensitive = false; }
        var self = this.toString();
        text = text.toString();

        if (caseInsensitive) {
            text = text.toLocaleLowerCase();
            self = self.toLocaleLowerCase();
        }

        return self.indexOf(text);
    };

    String.prototype.indexOfAny = function (text, caseInsensitive) {
        if (typeof caseInsensitive === "undefined") { caseInsensitive = false; }
        var self = this.toString();
        var text = text.toString();

        if (caseInsensitive) {
            text = text.toLocaleLowerCase();
            self = self.toLocaleLowerCase();
        }

        var needles = text.toString().split('');

        for (var i = 0; i < self.length; i++) {
            if (needles.some(function (n) {
                return n == self[i];
            })) {
                return i;
            }
        }

        return -1;
    };

    String.prototype.insert = function (position, text) {
        var self = this.toString();
        var text = text.toString();

        return exports.e(self.substr(0, position) + text + self.substr(position));
    };

    String.isNullOrEmpty = function (text) {
        return !!(!text || /^$/.test(text));
    };

    String.isNullOrWhiteSpace = function (text) {
        return !!(!text || /^\s*$/.test(text));
    };

    String.join = function (glue, parts) {
        return exports.e(parts.join(glue));
    };

    String.prototype.lastIndexOf = function (text, caseInsensitive) {
        if (typeof caseInsensitive === "undefined") { caseInsensitive = false; }
        var self = this.toString();
        text = text.toString();

        if (caseInsensitive) {
            text = text.toLocaleLowerCase();
            self = self.toLocaleLowerCase();
        }

        return self.lastIndexOf(text);
    };

    String.prototype.lastIndexOfAny = function (text, caseInsensitive) {
        if (typeof caseInsensitive === "undefined") { caseInsensitive = false; }
        var self = this.toString();
        var text = text.toString();

        if (caseInsensitive) {
            text = text.toLocaleLowerCase();
            self = self.toLocaleLowerCase();
        }

        var needles = text.toString().split('');

        for (var i = self.length - 1; i >= 0; i--) {
            if (needles.some(function (n) {
                return n == self[i];
            })) {
                return i;
            }
        }

        return -1;
    };

    String.prototype.padLeft = function (pad, char) {
        if (typeof char === "undefined") { char = ' '; }
        return exports.e(Array(pad - this.toString().length + 1).join(char) + this.toString());
    };

    String.prototype.padRight = function (pad, char) {
        if (typeof char === "undefined") { char = ' '; }
        return exports.e(this.toString() + Array(pad - this.toString().length + 1).join(char));
    };

    String.prototype.remove = function (from, to) {
        return exports.e(this.toString().substr(from, to));
    };

    String.prototype.replace = function (searchValue, replaceValue) {
        return exports.e(this.toString().split(searchValue).join(replaceValue));
    };

    String.prototype.split = function (separator) {
        return this.toString().split(separator);
    };

    String.prototype.startsWith = function (text, caseInsensitive) {
        if (typeof caseInsensitive === "undefined") { caseInsensitive = false; }
        var self = this.toString();
        text = text.toString();

        if (caseInsensitive) {
            text = text.toLocaleLowerCase();
            self = self.toLocaleLowerCase();
        }

        return text == self.substr(0, text.length);
    };

    String.prototype.substring = function (from, to) {
        return exports.e(this.toString().substr(from, to));
    };

    String.prototype.toCharArray = function () {
        return ''.split.call(this, '');
    };

    String.prototype.toLower = function () {
        return exports.e(''.toLocaleLowerCase.call(this));
    };

    String.prototype.toUpper = function () {
        return exports.e(''.toLocaleUpperCase.call(this));
    };

    String.prototype.trim = function () {
        var chars = [];
        for (var _i = 0; _i < (arguments.length - 0); _i++) {
            chars[_i] = arguments[_i + 0];
        }
        return this.doTrim(chars, '^__*|__*$');
    };

    String.prototype.trimEnd = function () {
        var chars = [];
        for (var _i = 0; _i < (arguments.length - 0); _i++) {
            chars[_i] = arguments[_i + 0];
        }
        return this.doTrim(chars, '__*$');
    };

    String.prototype.trimStart = function () {
        var chars = [];
        for (var _i = 0; _i < (arguments.length - 0); _i++) {
            chars[_i] = arguments[_i + 0];
        }
        return this.doTrim(chars, '^__*');
    };

    String.prototype.doTrim = function (chars, template) {
        if (chars.length == 0) {
            chars = [' '];
        }

        var regexClass = '[' + chars.join('').replace(/[$-\/?[-^{|}]/g, '\\$&') + ']';

        var trimRule = new RegExp(template.replace(/__/g, regexClass), 'g');

        return exports.e(this.toString().replace(trimRule, ''));
    };

    String.prototype.toString = function () {
        return [].join.call(this, '');
    };
    return String;
})(Enumerable);
exports.String = String;

var Order;
(function (Order) {
    Order[Order["ASC"] = 1] = "ASC";
    Order[Order["DESC"] = -1] = "DESC";
})(Order || (Order = {}));
