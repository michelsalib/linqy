/// <reference path="./definitions.d.ts" />

import linqy = require('../linqy');
import chai = require('chai');

var assert = chai.assert;
var e = linqy.e;

describe('linqy', () => {

    describe('enumerable', () => {
        it('produces Enumerable objects', () => {
            assert.isTrue(e([1, 3, 5]) instanceof linqy.Enumerable);
            assert.isTrue(e(<any>e([1, 3, 5])) instanceof linqy.Enumerable);
        });

        it('working as an array access', () => {
            var res = e([1, 3, 5]);

            assert.equal(res[1], 3);
        });

        it('aggregate', () => {
            var res = e(['Hello', ' ', 'world', '!']).aggregate((current, next) => current + next, '');

            assert.deepEqual(res, 'Hello world!');
        });

        it('all', () => {
            assert.isTrue(e([1, 2, 3]).all(i => i > 0));
            assert.isFalse(e([1, 2, 3]).all(i => i > 1));
        });

        it('any', () => {
            assert.isTrue(e([1, 2, 3]).any(i => i > 2));
            assert.isFalse(e([1, 2, 3]).any(i => i > 3));
        });

        it('average', () => {
            assert.equal(e([1, 2, 3]).average(), 2);
            assert.equal(e([1, 2, 3]).average(i => i * 2), 4);
        });

        it('concat', () => {
            assert.deepEqual(e([1, 2, 3]).concat(<any>[4, 5, 6]).toArray(), [1, 2, 3, 4, 5, 6]);
            assert.deepEqual(e([1, 2, 3]).concat(e([4, 5, 6])).toArray(), [1, 2, 3, 4, 5, 6]);
            assert.deepEqual(e([1, 2, 3, 4]).concat(e([4, 5, 6])).toArray(), [1, 2, 3, 4, 4, 5, 6]);
        });

        it('contains', () => {
            assert.isTrue(e([1, 2, 3]).contains(2));
            assert.isFalse(e([1, 2, 3]).contains(4));
        });

        it('count', () => {
            assert.equal(e([1, 2, 3]).count(), 3);
            assert.equal(e([1, 2, 3]).count(i => 0 == i % 2), 1);
        });

        it('distinct', () => {
            assert.deepEqual(e([1, 2, 3, 2, 1]).distinct().toArray(), [1, 2, 3]);
            assert.deepEqual(e([1, 2, 3, 2, 1]).distinct(i => i % 2).toArray(), [1, 2]);
        });

        it('elementAt', () => {
            assert.equal(e([1, 3, 5]).elementAt(1), 3);
        });

        it('empty', () => {
            assert.equal(e([1, 3, 5]).empty().count(), 0);
        });

        it('except', () => {
            assert.deepEqual(e([1, 3, 5]).except(e([3, 7])).toArray(), [1, 5]);
            assert.deepEqual(e([1, 3, 5]).except(<any>[3, 7]).toArray(), [1, 5]);
        });

        it('first', () => {
            assert.equal(e([]).first(), undefined);
            assert.equal(e([1, 2, 3]).first(), 1);
            assert.equal(e([1, 2, 3]).first(i => 0 == i % 2), 2);
        });

        it('groupBy', () => {
            var res = e([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]).groupBy(i => i % 2 ? 'odd' : 'even');

            assert.equal(res.count(), 2);
            assert.deepEqual(res.select(g => g.key).toArray(), ['odd', 'even']);
            assert.deepEqual(res.first(g => g.key == 'odd').toArray(), [1, 3, 5, 7, 9]);
            assert.deepEqual(res.first(g => g.key == 'even').toArray(), [2, 4, 6, 8, 10]);
        });

        it('intersect', () => {
            assert.deepEqual(e([1, 3, 5]).intersect(e([3, 7])).toArray(), [3]);
            assert.deepEqual(e([1, 3, 5]).intersect(<any>[3, 7]).toArray(), [3]);
        });

        it('join', () => {
            var res = e([
                {name: 'Obama', country: 'US'},
                {name: 'Hollande', country: 'FR'}
            ]).join(<any>[
                    {name: 'French', country: 'FR'},
                    {name: 'English', country: 'US'}
                ],
                i => (<any>i).country,
                i => (<any>i).country,
                (i:any, j:any) => {
                    return {
                        name: i.name,
                        language: j.name
                    }
                }
            );

            assert.deepEqual(res.toArray(), [
                {name: 'Obama', language: 'English'},
                {name: 'Hollande', language: 'French'}
            ]);
        });

        it('last', () => {
            assert.equal(e([1, 2, 3]).last(), 3);
            assert.equal(e([1, 2, 3]).last(i => 0 == i % 2), 2);
        });

        it('max', () => {
            assert.equal(e([1, 2, 3]).max(), 3);
            assert.equal(e([1, 2, 3]).max(i => i % 3), 2);
        });

        it('orderBy', () => {
            assert.deepEqual(e([1, 3, 2]).orderBy().toArray(), [1, 2, 3]);
            assert.deepEqual(e([1, 3, 2]).orderBy(i => i == 3 ? 0 : i).toArray(), [3, 1, 2]);
        });

        it('orderByDescending', () => {
            assert.deepEqual(e([1, 3, 2]).orderByDescending().toArray(), [3, 2, 1]);
            assert.deepEqual(e([1, 3, 2]).orderByDescending(i => i == 3 ? 0 : i).toArray(), [2, 1, 3]);
        });

        it('reverse', () => {
            var original = e([1, 2, 3]);

            var reversed = original.reverse();

            assert.deepEqual(original.toArray(), [1, 2, 3]);
            assert.deepEqual(reversed.toArray(), [3, 2, 1]);
        });

        it('select', () => {
            var res = e([1, 2, 3]).select(i => i * i);

            assert.deepEqual(res.toArray(), [1, 4, 9]);
        });

        it('selectMany', () => {
            assert.deepEqual(e([
                [1, 2, 3],
                [4, 5, 6]
            ]).selectMany().toArray(), [1, 2, 3, 4, 5, 6]);
            assert.deepEqual(e([1, 4, 7]).selectMany(i => [i, i + 1, i + 2]).toArray(), [1, 2, 3, 4, 5, 6, 7, 8, 9]);
        });

        it('single', () => {
            assert.throws(() => e().single(), new RegExp('^The enumerable does not contain any element.$'));
            assert.throws(() => e([1, 2, 3]).single(), new RegExp('^The enumerable contains more than one element.$'));
            assert.throws(() => e([1, 2, 3, 4]).single(i => 0 == i % 2), new RegExp('^The enumerable contains more than one element satisfying the predicate.$'));
            assert.equal(e([1]).single(), 1);
            assert.equal(e([1, 2, 3]).single(i => 0 == i % 2), 2);
        });

        it('skip', () => {
            assert.deepEqual(e([1, 2, 3]).skip(2).toArray(), [3]);
        });

        it('skipWhile', () => {
            assert.deepEqual(e([1, 2, 3]).skipWhile(i => i < 2).toArray(), [2, 3]);
        });

        it('sum', () => {
            assert.equal(e([1, 2, 3]).sum(), 6);
            assert.equal(e([1, 2, 3]).sum(i => i * 2), 12);
        });

        it('take', () => {
            assert.deepEqual(e([1, 2, 3]).take(1).toArray(), [1]);
        });

        it('takeWhile', () => {
            assert.deepEqual(e([1, 2, 3]).takeWhile(i => i != 3).toArray(), [1, 2]);
        });

        it('thenBy', () => {
            assert.deepEqual(e([1, 2, 3, 4, 5]).orderBy(i => i % 2).thenBy().toArray(), [2, 4, 1, 3, 5]);
        });

        it('thenByDescending', () => {
            assert.deepEqual(e([1, 2, 3, 4, 5]).orderBy(i => i % 2).thenByDescending().toArray(), [4, 2, 5, 3, 1]);
        });

        it('toArray', () => {
            var res = e([1, 3, 5]).toArray();

            assert.isTrue(res instanceof Array);
            assert.deepEqual(res, [1, 3, 5]);
        });

        it('union', () => {
            var a = e([5, 3, 9, 7, 5, 9, 3, 7]);
            var b = e([8, 3, 6, 4, 4, 9, 1, 0]);

            assert.deepEqual(a.union(b).toArray(), [5, 3, 9, 7, 8, 6, 4, 1, 0]);
        });

        it('where', () => {
            var res = e([1, 2, 3, 4, 5, 6]).where(i => 0 == i % 2);

            assert.deepEqual(res.toArray(), [2, 4, 6]);
        });

        it('zip', () => {
            var a = e([1, 2, 3, 4]);
            var b = e(['one', 'two', 'three']);

            assert.deepEqual(a.zip(b, (first, second) => first + ' ' + second).toArray(), ['1 one', '2 two', '3 three']);
        });

        it('isn\'t impacted by modification of the original source', () => {
            var original = [1, 3, 5];

            var enumerable = e(original);

            original.push(7);

            assert.deepEqual(enumerable.toArray(), [1, 3, 5]);
        });
    });

    describe('string', () => {
        it('produces Sring objects', () => {
            assert.isTrue(e('Hello') instanceof linqy.String);
        });

        it('working as an array access', () => {
            var res = e('hello');

            assert.equal(res[1], 'e');
        });

        it('aggregate', () => {
            var res = e('Hello').aggregate((current, next) => current + next.toUpperCase(), '');

            assert.deepEqual(res, 'HELLO');
        });

        it('all', () => {
            assert.isTrue(e('aaaaa').all(i => i == 'a'));
            assert.isFalse(e('aaaabaaa').all(i => i == 'a'));
        });

        it('any', () => {
            assert.isTrue(e('aaaab').any(i => i == 'b'));
            assert.isFalse(e('aaaaaa').any(i => i == 'b'));
        });

        it('average', () => {
            assert.equal(e('aabb').average(i => i == 'a' ? 1 : 2), 1.5);
        });

        it('concat', () => {
            assert.deepEqual(e('abc').concat(e('d')).toString(), 'abcd');
            assert.deepEqual(e('abc').concat(<any>'d').toString(), 'abcd');
        });

        it('contains', () => {
            assert.isTrue(e('abc').contains('bc'));
        });

        it('count', () => {
            assert.equal(e('abc').count(), 3);
            assert.equal(e('abc').count(i => i == 'a'), 1);
        });

        it('distinct', () => {
            assert.deepEqual(e('abcbaA').distinct().toString(), 'abcA');
            assert.deepEqual(e('abcABC').distinct(i => i.toUpperCase()).toString(), 'abc');
        });

        it('elementAt', () => {
            assert.equal(e('abc').elementAt(1), 'b');
        });

        it('empty', () => {
            assert.equal(e('any').empty().toString(), '');
        });

        it('except', () => {
            assert.deepEqual(e('abc').except(e('ad')).toString(), 'bc');
        });

        it('first', () => {
            assert.equal(e('').first(), undefined);
            assert.equal(e('abc').first(), 'a');
            assert.equal(e('abc').first(i => i == 'b'), 'b');
        });

        it('groupBy', () => {
            var res = e('abcABC').groupBy(i => i >= 'a' && i <= 'z' ? 'min' : 'maj');

            assert.equal(res.count(), 2);
            assert.deepEqual(res.select(g => g.key).toArray(), ['min', 'maj']);
            assert.deepEqual(res.first(g => g.key == 'min').toArray(), ['a', 'b', 'c']);
            assert.deepEqual(res.first(g => g.key == 'maj').toArray(), ['A', 'B', 'C']);
        });

        it('intersect', () => {
            assert.deepEqual(e('abc').intersect(e('c')).toString(), 'c');
        });

        it('join', () => {
            var res = e('b').join(<any>[
                    {name: 'Mike', grade: 'A'},
                    {name: 'Matt', grade: 'B'},
                    {name: 'Nick', grade: 'B'}
                ],
                i => (<any>i).toUpperCase(),
                i => (<any>i).grade,
                (i:any, j:any) => {
                    return j.name
                }
            );

            assert.deepEqual(res.toArray(), [ 'Matt', 'Nick' ]);
        });

        it('last', () => {
            assert.equal(e('abc').last(), 'c');
            assert.equal(e('abc').last(i => i == 'a'), 'a');
        });

        it('max', () => {
            assert.equal(e('ab').max(i => i == 'b' ? 1 : 2), 'a');
        });

        it('orderBy', () => {
            assert.equal(e('acb').orderBy().toString(), 'abc');
            assert.equal(e('abc').orderBy(i => i == 'c' ? 'a' : i).toString(), 'acb');
        });

        it('reverse', () => {
            var original = e('abc');

            var reversed = original.reverse();

            assert.deepEqual(original.toString(), 'abc');
            assert.deepEqual(reversed.toString(), 'cba');
        });

        it('select', () => {
            var res = e('abc').select(i => i.toUpperCase());

            assert.deepEqual(res.toString(), 'ABC');
        });

        it('selectMany', () => {
            assert.equal(e('abc').selectMany(i => [i, i.toUpperCase()]).toString(), 'aAbBcC');
        });

        it('single', () => {
            assert.throws(() => e().single(), new RegExp('^The enumerable does not contain any element.$'));
            assert.throws(() => e('abc').single(), new RegExp('^The enumerable contains more than one element.$'));
            assert.throws(() => e('abcb').single(i => 'b' == i), new RegExp('^The enumerable contains more than one element satisfying the predicate.$'));
            assert.equal(e('a').single(), 'a');
            assert.equal(e('abc').single(i => 'b' == i), 'b');
        });

        it('skip', () => {
            assert.deepEqual(e('abc').skip(2).toString(), 'c');
        });

        it('skipWhile', () => {
            assert.deepEqual(e('abc').skipWhile(i => i != 'b').toString(), 'bc');
        });

        it('sum', () => {
            assert.equal(e('abc').sum(i => i == 'a' ? 2 : 1), 4);
        });

        it('take', () => {
            assert.deepEqual(e('abc').take(1).toString(), 'a');
        });

        it('takeWhile', () => {
            assert.deepEqual(e('abc').takeWhile(i => i != 'b').toString(), 'a');
        });

        it('thenBy', () => {
            assert.deepEqual(e('CabcAB').orderBy(i => i.toLowerCase()).thenBy().toString(), 'AaBbCc');
        });

        it('thenByDescending', () => {
            assert.deepEqual(e('CabcAB').orderBy(i => i.toLowerCase()).thenByDescending().toString(), 'aAbBcC');
        });

        it('toArray', () => {
            var res = e('abc').toArray();

            assert.isTrue(res instanceof Array);
            assert.deepEqual(res, ['a', 'b', 'c']);
        });

        it('toString', () => {
            var res = e('abc').toString();

            assert.isTrue(typeof res == 'string');
            assert.equal(res, 'abc');
        });

        it('union', () => {
            var a = e('abc');
            var b = e('cde');

            assert.deepEqual(a.union(b).toString(), 'abcde');
        });

        it('where', () => {
            var res = e('aBc').where(i => i != 'B');

            assert.deepEqual(res.toString(), 'ac');
        });

        it('zip', () => {
            var a = e('abc');
            var b = e('defg');

            assert.deepEqual(a.zip(b, (first, second) => first + ' ' + second).toArray(), ['a d', 'b e', 'c f']);
        });
    });
});
