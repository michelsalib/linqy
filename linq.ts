
export function e<T>(array: T[]): Enumerable<T> {
    var enumerable = null;

    if (array instanceof Enumerable || array instanceof Array) {
        enumerable = [].slice.call(array, 0);
    }
    else {
        throw new Error('Unsupported input type, use array or Enumerable.');
    }

    enumerable.__proto__ = Enumerable.prototype;

    return enumerable;
}

export class Enumerable<T> {

    aggregate<U>(predicate: (workingSentence: U, item: T) => U, seed?: U): U {
        return [].reduce.call(this, predicate, seed);
    }

    all(predicate: (item: T) => boolean): boolean {
        return [].every.call(this, predicate);
    }

    any(predicate: (item: T) => boolean): boolean {
        return [].some.call(this, predicate);
    }

    average(predicate: (item: T) => number = i => <any>i): number {
        return this.sum(predicate) / this.count();
    }

    cast<U>(): Enumerable<U> {
        return e(<any>this);
    }

    concat(enumerable: Enumerable<T>): Enumerable<T> {
        return e([].concat.call(this, enumerable));
    }

    contains(item: T): boolean {
        return -1 != [].indexOf.call(this, item);
    }

    count<U>(predicate?: (item: T) => boolean): number {
        if (!predicate) {
            return this.toArray().length;
        }

        return this.aggregate<number>((res, item) => {
            if (predicate(item)) {
                res++;
            }
            return res;
        }, 0);
    }

    distinct(predicate?: (item: T) => any): Enumerable<T> {
        var metValues = [];
        var res = [];

        this.forEach(item => {
            var key = predicate ? predicate(item) : item;

            if (-1 == metValues.indexOf(key)) {
                metValues.push(key);
                res.push(item);
            }
        });

        return e(res);
    }

    elementAt(index: number): T {
        return this[index];
    }

    empty(): Enumerable<T> {
        return e([]);
    }

    except(enumerable: Enumerable<T>): Enumerable<T> {
        return this.where(item => -1 == [].indexOf.call(enumerable, item));
    }

    first(predicate?: (item: T) => boolean): T {
        for (var i in this) {
            if (!predicate || predicate(this[i])) {
                return this[i];
            }
        }

        return undefined;
    }

    forEach(action: (item: T) => void): void {
        [].forEach.call(this, action);
    }

    groupBy<U>(predicate: (item: T) => U): Enumerable<Grouping<U, T>> {
        var res = [];

        this.forEach(item => {
            var key = predicate(item);
            var group = this.first.call(res, g => g.key == key);

            if (!group) {
                group = e([]);
                group.key = key;

                res.push(group);
            }

            [].push.call(group, item);
        });

        return e(res);
    }

    intersect(enumerable: Enumerable<T>): Enumerable<T> {
        return this.where(item => -1 != [].indexOf.call(enumerable, item));
    }

    join<U, V, W>(
        inner: Enumerable<U>,
        outerSelector: (item: T) => V,
        innerSelector: (item: U) => V,
        resultSelector: (outerItem: T, innerItem: U) => W
    ): Enumerable<W> {
        var res = [];

        this.forEach(outerItem => {
            var outerKey = outerSelector(outerItem);

            this.forEach.call(inner, innerItem => {
                var innerKey = innerSelector(innerItem);

                if (outerKey == innerKey) {
                    res.push(resultSelector(outerItem, innerItem));
                }
            });
        });

        return e(res);
    }

    last(predicate?: (item: T) => boolean): T {
        return this.reverse().first(predicate);
    }

    max(predicate?: (item: T) => number): T {
        var max = Number.MIN_VALUE;
        var res = undefined;

        this.forEach(item => {
            var representation = predicate ? predicate(item) : <any>item;

            if (representation > max) {
                max = representation;
                res = item;
            }
        });

        return res;
    }

    min(predicate?: (item: T) => number): T {
        var min = Number.MAX_VALUE;
        var res = undefined;

        this.forEach(item => {
            var representation = predicate ? predicate(item) : <any>item;

            if (representation < min) {
                min = representation;
                res = item;
            }
        });

        return res;
    }

    reverse(): Enumerable<T> {
        return e([].reverse.call(this.toArray()));
    }

    select<U>(predicate: (item: T) => U): Enumerable<U> {
        return e([].map.call(this, predicate));
    }

    sum<U>(predicate: (item: T) => number = i => <any>i): number {
        var transformed = this.select(predicate);

        return transformed.aggregate<number>((i, j) => i + j, 0);
    }

    toArray(): T[] {
        return [].slice.call(this, 0);
    }

    where(predicate: (item: T) => boolean): Enumerable<T> {
        return e([].filter.call(this, predicate));
    }

}

export class Grouping <U, T> extends Enumerable<T> {
    key: U;
}
