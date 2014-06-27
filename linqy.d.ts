export declare function e<T>(array?: T[]): Enumerable<T>;
export declare function e<T>(enumerable?: Enumerable<T>): Enumerable<T>;
export declare function e(text: string): String;
export declare class Enumerable<T> {
    public aggregate<U>(predicate: (workingSentence: U, item: T) => U, seed?: U): U;
    public all(predicate: (item: T) => boolean): boolean;
    public any(predicate: (item: T) => boolean): boolean;
    public average(predicate?: (item: T) => number): number;
    public cast<U>(): Enumerable<U>;
    public concat(enumerable: Enumerable<T>): Enumerable<T>;
    public contains(item: T): boolean;
    public count<U>(predicate?: (item: T) => boolean): number;
    public distinct(predicate?: (item: T) => any): Enumerable<T>;
    public elementAt(index: number): T;
    public empty(): Enumerable<T>;
    public except(enumerable: Enumerable<T>): Enumerable<T>;
    public first(predicate?: (item: T) => boolean): T;
    public forEach(action: (item: T) => void): void;
    public groupBy<U>(predicate: (item: T) => U): Enumerable<Grouping<U, T>>;
    public intersect(enumerable: Enumerable<T>): Enumerable<T>;
    public join<U, V, W>(inner: Enumerable<U>, outerSelector: (item: T) => V, innerSelector: (item: U) => V, resultSelector: (outerItem: T, innerItem: U) => W): Enumerable<W>;
    public last(predicate?: (item: T) => boolean): T;
    public max(predicate?: (item: T) => number): T;
    public min(predicate?: (item: T) => number): T;
    public orderBy(predicate?: (item: T) => any): Enumerable<T>;
    public orderByDescending(predicate?: (item: T) => any): Enumerable<T>;
    public reverse(): Enumerable<T>;
    public select<U>(predicate: (item: T) => U): Enumerable<U>;
    public selectMany<U>(predicate?: (item: T) => U): Enumerable<U>;
    public single(predicate?: (item: T) => boolean): T;
    public skip(count: number): Enumerable<T>;
    public skipWhile(predicate: (item: T) => boolean): Enumerable<T>;
    public sum<U>(predicate?: (item: T) => number): number;
    public take(count: number): Enumerable<T>;
    public takeWhile(predicate: (item: T) => boolean): Enumerable<T>;
    public thenBy(predicate?: (item: T) => any): Enumerable<T>;
    public thenByDescending(predicate?: (item: T) => any): Enumerable<T>;
    public union(enumerable: Enumerable<T>): Enumerable<T>;
    public toArray(): T[];
    public where(predicate: (item: T) => boolean): Enumerable<T>;
    public zip<U, V>(enumerable: Enumerable<U>, resultSelector: (first: T, second: U) => V): Enumerable<V>;
    private orderingSequence;
    private order(orderingSequence);
}
export declare class String extends Enumerable<string> {
    public contains(text: any): boolean;
    public toString(): string;
}
export interface Grouping<U, T> extends Enumerable<T> {
    key: U;
}
