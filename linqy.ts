export function e<T>(array?:T[]):Enumerable<T>;
export function e<T>(enumerable?:Enumerable<T>):Enumerable<T>;
export function e(text:Enumerable<string>):String;
export function e(text:string):String;

export function e<T>(input:any = null):any {

    if (typeof input == 'string') {
        var enumerable:any = (<string>input).split('');
        enumerable.__proto__ = String.prototype;
        return enumerable;
    }

    if (input instanceof Enumerable) {
        var enumerable:any = [].slice.call(input, 0);

        if (input.all(i => typeof i == 'string')) {
            enumerable.__proto__ = String.prototype;
            return enumerable;
        }

        var enumerable:any = [].slice.call(input, 0);
        enumerable.__proto__ = Enumerable.prototype;
        return enumerable;
    }

    if (input instanceof Array) {
        var enumerable:any = [].slice.call(input, 0);

        if (input.every(i => typeof i == 'string')) {
            enumerable.__proto__ = String.prototype;
            return enumerable;
        }

        var enumerable:any = [].slice.call(input, 0);
        enumerable.__proto__ = Enumerable.prototype;
        return enumerable;
    }

    if (input === null) {
        var enumerable:any = [];
        enumerable.__proto__ = Enumerable.prototype;
        return enumerable;
    }

    throw new Error('Unsupported input type, use array, string or Enumerable.');
}

export class Enumerable<T> {

    aggregate<U>(predicate:(workingSentence:U, item:T) => U, seed?:U):U {
        return [].reduce.call(this, predicate, seed);
    }

    all(predicate:(item:T) => boolean):boolean {
        return [].every.call(this, predicate);
    }

    any(predicate:(item:T) => boolean):boolean {
        return [].some.call(this, predicate);
    }

    average(predicate:(item:T) => number = i => <any>i):number {
        return this.sum(predicate) / this.count();
    }

    cast<U>():Enumerable<U> {
        return <any>e(this);
    }

    concat(enumerable:Enumerable<T>):Enumerable<T> {
        return e([].concat.call(this, enumerable));
    }

    contains(item:T):boolean {
        return -1 != [].indexOf.call(this, item);
    }

    count<U>(predicate?:(item:T) => boolean):number {
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

    distinct(predicate?:(item:T) => any):Enumerable<T> {
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

    elementAt(index:number):T {
        return this[index];
    }

    empty():Enumerable<T> {
        return e([]);
    }

    except(enumerable:Enumerable<T>):Enumerable<T> {
        return this.where(item => -1 == [].indexOf.call(enumerable, item));
    }

    first(predicate?:(item:T) => boolean):T {
        for (var i = 0; i < this.count(); i++) {
            if (!predicate || predicate(this[i])) {
                return this[i];
            }
        }

        return undefined;
    }

    forEach(action:(item:T) => void):void {
        [].forEach.call(this, action);
    }

    groupBy<U>(predicate:(item:T) => U):Enumerable<Grouping<U, T>> {
        var res = e<Grouping<U, T>>();

        this.forEach(item => {
            var key = predicate(item);
            var group = res.first(g => g.key == key);

            if (!group) {
                group = e();
                group.key = key;

                [].push.call(res, group);
            }

            [].push.call(group, item);
        });

        return res;
    }

    intersect(enumerable:Enumerable<T>):Enumerable<T> {
        return this.where(item => -1 != [].indexOf.call(enumerable, item));
    }

    join<U, V, W>(inner:Enumerable<U>, outerSelector:(item:T) => V, innerSelector:(item:U) => V, resultSelector:(outerItem:T, innerItem:U) => W):Enumerable<W> {
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

    last(predicate?:(item:T) => boolean):T {
        return this.reverse().first(predicate);
    }

    max(predicate?:(item:T) => number):T {
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

    min(predicate?:(item:T) => number):T {
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

    orderBy(predicate?:(item:T) => any):Enumerable<T> {
        return this.order([
            {
                direction: Order.ASC,
                predicate: predicate
            }
        ]);
    }

    orderByDescending(predicate?:(item:T) => any):Enumerable<T> {
        return this.order([
            {
                direction: Order.DESC,
                predicate: predicate
            }
        ]);
    }

    reverse():Enumerable<T> {
        return e([].reverse.call(this.toArray()));
    }

    select<U>(predicate:(item:T) => U):Enumerable<U> {
        return e([].map.call(this, predicate));
    }

    selectMany<U>(predicate:(item:T) => U = i => <any>i):Enumerable<U> {
        return e([].concat.apply([], this.select(predicate)));
    }

    single(predicate?:(item:T) => boolean):T {
        var result:T;

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
    }

    skip(count:number):Enumerable<T> {
        return e([].slice.call(this, count));
    }

    skipWhile(predicate:(item:T) => boolean):Enumerable<T> {
        var res = [];
        var skipping = true;

        for (var i = 0; i < this.count(); i++) {
            var item = this[i];

            if (skipping && predicate(item)) {
                continue;
            }
            else {
                skipping = false;
            }

            res.push(item);
        }

        return e(res);
    }

    sum<U>(predicate:(item:T) => number = i => <any>i):number {
        var transformed = this.select(predicate);

        return transformed.aggregate<number>((i, j) => i + j, 0);
    }

    take(count:number):Enumerable<T> {
        return e([].slice.call(this, 0, count));
    }

    takeWhile(predicate:(item:T) => boolean):Enumerable<T> {
        var res = [];

        for (var i = 0; i < this.count(); i++) {
            var item = this[i];

            if (!predicate(item)) {
                break;
            }

            res.push(item);
        }

        return e(res);
    }

    thenBy(predicate?:(item:T) => any):Enumerable<T> {
        return this.order(this.orderingSequence.concat([
            {
                direction: Order.ASC,
                predicate: predicate
            }
        ]));
    }

    thenByDescending(predicate?:(item:T) => any):Enumerable<T> {
        return this.order(this.orderingSequence.concat([
            {
                direction: Order.DESC,
                predicate: predicate
            }
        ]));
    }

    union(enumerable:Enumerable<T>):Enumerable<T> {
        return this.concat(enumerable).distinct();
    }

    toArray():T[] {
        return [].slice.call(this, 0);
    }

    where(predicate:(item:T) => boolean):Enumerable<T> {
        return e([].filter.call(this, predicate));
    }

    zip<U,V>(enumerable:Enumerable<U>, resultSelector:(first:T, second:U) => V):Enumerable<V> {
        var res = [];

        for (var i = 0; i < this.count() && i < e(<any>enumerable).count(); i++) {
            res.push(resultSelector(this[i], enumerable[i]));
        }

        return e(res);
    }

    private orderingSequence:Ordering<T>[] = [];

    private order(orderingSequence:Ordering<T>[]):Enumerable<T> {
        var result = this.toArray().sort((a:T, b:T) => {
            for (var i in orderingSequence) {
                var order = orderingSequence[i];
                var predicate = order.predicate || (i => i);
                var aValue = predicate(a);
                var bValue = predicate(b);

                if (aValue > bValue) {
                    return order.direction;
                }
                else if (aValue < bValue) {
                    return -order.direction;
                }
            }

            return 0;
        });

        var enumerable = e(result);
        enumerable.orderingSequence = orderingSequence;

        return enumerable;
    }

}

export class String extends Enumerable<string> {

    contains(text:string):boolean;

    contains(text:String):boolean;

    contains(text:any):boolean {
        return -1 != this.toString().indexOf(text.toString());
    }

    compare(text:string, caseInsensitive?:boolean):number;

    compare(text:String, caseInsensitive?:boolean):number;

    compare(text:any, caseInsensitive:boolean = false):number {
        var self = this.toString();
        text = text.toString();

        if (caseInsensitive) {
            text = text.toLocaleLowerCase();
            self = self.toLocaleLowerCase();
        }

        return self.localeCompare(text);
    }

    endsWith(text:string, caseInsensitive?:boolean):boolean;

    endsWith(text:String, caseInsensitive?:boolean):boolean;

    endsWith(text:any, caseInsensitive:boolean = false):boolean {
        var self = this.toString();
        text = text.toString();

        if (caseInsensitive) {
            text = text.toLocaleLowerCase();
            self = self.toLocaleLowerCase();
        }

        return -1 !== self.indexOf(text, self.length - text.length);
    }

    equals(text:string, caseInsensitive?:boolean):boolean;

    equals(text:String, caseInsensitive?:boolean):boolean;

    equals(text:any, caseInsensitive:boolean = false):boolean {
        var self = this.toString();
        text = text.toString();

        if (caseInsensitive) {
            text = text.toLocaleLowerCase();
            self = self.toLocaleLowerCase();
        }

        return self == text;
    }

    static format(text:string, ...args:any[]):String;

    static format(text:String, ...args:any[]):String;

    static format(text:any, ...args:any[]):String {
        return e(text.toString().replace(/{(\d+)}/g, (match, index) => args[index].toString()));
    }

    indexOf(text:string, caseInsensitive?:boolean):number;

    indexOf(text:String, caseInsensitive?:boolean):number;

    indexOf(text:any, caseInsensitive:boolean = false):number {
        var self = this.toString();
        text = text.toString();

        if (caseInsensitive) {
            text = text.toLocaleLowerCase();
            self = self.toLocaleLowerCase();
        }

        return self.indexOf(text);
    }

    indexOfAny(text:string, caseInsensitive?:boolean):number;

    indexOfAny(text:String, caseInsensitive?:boolean):number;

    indexOfAny(text:any, caseInsensitive:boolean = false):number {
        var self = this.toString();
        var text = text.toString();

        if (caseInsensitive) {
            text = text.toLocaleLowerCase();
            self = self.toLocaleLowerCase();
        }

        var needles = text.toString().split('');

        for (var i = 0; i < self.length; i++) {
            if (needles.some(n => n == self[i])) {
                return i;
            }
        }

        return -1;
    }

    insert(position:number, text:string):String;

    insert(position:number, text:String):String;

    insert(position:number, text:any):String {
        var self = this.toString();
        var text = text.toString();

        return e(self.substr(0, position) + text + self.substr(position));
    }

    static isNullOrEmpty(text:string):boolean;

    static isNullOrEmpty(text:String):boolean;

    static isNullOrEmpty(text:any):boolean {
        return !!(!text || /^$/.test(text));
    }

    static isNullOrWhiteSpace(text:string):boolean;

    static isNullOrWhiteSpace(text:String):boolean;

    static isNullOrWhiteSpace(text:any):boolean {
        return !!(!text || /^\s*$/.test(text));
    }

    static join(glue:string, parts:any[]):String;

    static join(glue:String, parts:any[]):String;

    static join(glue:any, parts:any[]):String {
        return e(parts.join(glue));
    }

    lastIndexOf(text:string, caseInsensitive?:boolean):number;

    lastIndexOf(text:String, caseInsensitive?:boolean):number;

    lastIndexOf(text:any, caseInsensitive:boolean = false):number {
        var self = this.toString();
        text = text.toString();

        if (caseInsensitive) {
            text = text.toLocaleLowerCase();
            self = self.toLocaleLowerCase();
        }

        return self.lastIndexOf(text);
    }

    lastIndexOfAny(text:string, caseInsensitive?:boolean):number;

    lastIndexOfAny(text:String, caseInsensitive?:boolean):number;

    lastIndexOfAny(text:any, caseInsensitive:boolean = false):number {
        var self = this.toString();
        var text = text.toString();

        if (caseInsensitive) {
            text = text.toLocaleLowerCase();
            self = self.toLocaleLowerCase();
        }

        var needles = text.toString().split('');

        for (var i = self.length - 1; i >= 0; i--) {
            if (needles.some(n => n == self[i])) {
                return i;
            }
        }

        return -1;
    }

    padLeft(pad:number, char?:string):String;

    padLeft(pad:number, char?:String):String;

    padLeft(pad:number, char:any = ' '):String {
        return e(Array(pad - this.toString().length + 1).join(char) + this.toString());
    }

    padRight(pad:number, char?:string):String;

    padRight(pad:number, char?:String):String;

    padRight(pad:number, char:any = ' '):String {
        return e(this.toString() + Array(pad - this.toString().length + 1).join(char));
    }

    remove(from:number, to?:number):String {
        return e(this.toString().substr(from, to));
    }

    replace(searchValue:string, replaceValue:string):String;

    replace(searchValue:String, replaceValue:String):String;

    replace(searchValue:any, replaceValue:any):String {
        return e(this.toString().split(searchValue).join(replaceValue));
    }

    split(separator:string):string[];

    split(separator:RegExp):string[];

    split(separator:any):string[] {
        return this.toString().split(separator);
    }

    startsWith(text:string, caseInsensitive?:boolean):boolean;

    startsWith(text:String, caseInsensitive?:boolean):boolean;

    startsWith(text:any, caseInsensitive:boolean = false):boolean {
        var self = this.toString();
        text = text.toString();

        if (caseInsensitive) {
            text = text.toLocaleLowerCase();
            self = self.toLocaleLowerCase();
        }

        return text == self.substr(0, text.length);
    }

    substring(from:number, to?:number):String {
        return e(this.toString().substr(from, to));
    }

    toCharArray():string[] {
        return ''.split.call(this, '');
    }

    toLower():String {
        return e(''.toLocaleLowerCase.call(this));
    }

    toUpper():String {
        return e(''.toLocaleUpperCase.call(this));
    }

    trim(...chars: string[]):String {
        return this.doTrim(chars, '^__*|__*$');
    }

    trimEnd(...chars: string[]):String {
        return this.doTrim(chars, '__*$');
    }

    trimStart(...chars: string[]):String {
        return this.doTrim(chars, '^__*');
    }

    private doTrim(chars: string[], template: string): String {
        if (chars.length == 0) {
            chars = [' '];
        }

        var regexClass = '[' + chars.join('').replace(/[$-\/?[-^{|}]/g, '\\$&') + ']';

        var trimRule = new RegExp(template.replace(/__/g, regexClass), 'g');

        return e(this.toString().replace(trimRule, ''));
    }

    toString():string {
        return [].join.call(this, '');
    }

}

export interface Grouping <U, T> extends Enumerable<T> {
    key:U;
}

enum Order {
    ASC = 1,
    DESC = -1,
}

interface Ordering<T> {
    direction: Order;
    predicate?: (item:T) => any;
}
