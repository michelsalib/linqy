/// <reference path="./tests.d.ts" />

import linq = require('../linq');
import chai = require('chai');

var assert = chai.assert;
var e = linq.e;

describe('linq', () => {
    it('produces Enumerable objects', () => {
        assert.isTrue(e([1, 3, 5]) instanceof linq.Enumerable);
        assert.isTrue(e(<any>e([1, 3, 5])) instanceof linq.Enumerable);
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
        assert.equal(e([1, 2, 3]).average(i => i*2), 4);
    });

    it('concat', () => {
        assert.deepEqual(e([1, 2, 3]).concat(<any>[4, 5, 6]).toArray(), [1, 2, 3, 4, 5, 6]);
        assert.deepEqual(e([1, 2, 3]).concat(e([4, 5, 6])).toArray(), [1, 2, 3, 4, 5, 6]);
    });

    it('contains', () => {
        assert.isTrue(e([1, 2, 3]).contains(2));
        assert.isFalse(e([1, 2, 3]).contains(4));
    });

    it('count', () => {
        assert.equal(e([1, 2, 3]).count(), 3);
        assert.equal(e([1, 2, 3]).count(i => 0 == i%2), 1);
    });

    it('distinct', () => {
        assert.deepEqual(e([1, 2, 3, 2, 1]).distinct().toArray(), [1, 2, 3]);
        assert.deepEqual(e([1, 2, 3, 2, 1]).distinct(i => i%2).toArray(), [1, 2]);
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
        assert.equal(e([1, 2, 3]).first(), 1);
        assert.equal(e([1, 2, 3]).first(i => 0 == i%2), 2);
    });

    it('groupBy', () => {
        var res = e([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]).groupBy(i => i%2 ? 'odd' : 'even');

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
            (i: any, j: any) => {
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
        assert.equal(e([1, 2, 3]).last(i => 0 == i%2), 2);
    });

    it('max', () => {
        assert.equal(e([1, 2, 3]).max(), 3);
        assert.equal(e([1, 2, 3]).max(i => i%3), 2);
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

    it('sum', () => {
        assert.equal(e([1, 2, 3]).sum(), 6);
        assert.equal(e([1, 2, 3]).sum(i => i*2), 12);
    });

    it('where', () => {
        var res = e([1, 2, 3, 4, 5, 6]).where(i => 0 == i%2);

        assert.deepEqual(res.toArray(), [2, 4, 6]);
    });

    it('toArray', () => {
        var res = e([1, 3, 5]).toArray();

        assert.isTrue(res instanceof Array);
        assert.deepEqual(res, [1, 3, 5]);
    });

    it('isn\'t impacted by modification of the original source', () => {
        var original = [1, 3, 5];

        var enumerable = e(original);

        original.push(7);

        assert.deepEqual(enumerable.toArray(), [1, 3, 5]);
    });
});
