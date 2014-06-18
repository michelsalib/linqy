function e(array) {
    if (typeof array === "undefined") { array = []; }
    var enumerable = null;

    if (array instanceof Enumerable || array instanceof Array) {
        enumerable = [].slice.call(array, 0);
    } else {
        throw new Error('Unsupported input type, use array or Enumerable.');
    }

    enumerable.__proto__ = Enumerable.prototype;

    return enumerable;
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

var Order;
(function (Order) {
    Order[Order["ASC"] = 1] = "ASC";
    Order[Order["DESC"] = -1] = "DESC";
})(Order || (Order = {}));
