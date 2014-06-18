# Linqy

Portage of [.NET Enumerable class](http://msdn.microsoft.com/eu-US/library/system.linq.enumerable.aspx) of linq to nodejs.

[![NPM version](https://badge.fury.io/js/linqy.png)](http://badge.fury.io/js/linqy)
[![Build Status](https://travis-ci.org/michelsalib/linqy.png?branch=master)](https://travis-ci.org/michelsalib/linqy)

## Intallation

```
npm install linqy
```

## Usage

### Node

```javascript
var linqy = require('linqy');

var e = linqy.e;
```

## API

To use the API the first thing you want to do, is transform your array into an enumerable:

```javascript
var enumerable = e([1,2,3,4,5]);
```

> Note that if you are using *typescript*, the type of enumerable will be inferred to *linqy.Enumerable<number>*. 

Then with an enumerable you can call a load of useful functions:

### .aggregate(predicate, seed)

Apply an accumulator function, starting with the seed.

- predicate: a function taking two arguments, the aggregate so far and the current element to aggregate, and returning the aggregated result.
- seed *optional*: the seed to start aggregating against.

Returns: the final aggregate.

### .all(predicate)

Determines whether all elements satisfy a condition.

- predicate: a function taking the current element to test, returning a boolean.

Returns: a boolean.

### .any(predicate)

Determines whether any elements satisfy a condition.

- predicate: a function taking the current element to test, returning a boolean.

Returns: a boolean.

### .average(predicate)

Computes the average value of the elements.

- predicate *optional*: a function taking the current element to transform to a number, returning that number.

Returns: a number.

### .cast<U>()

**Typescript usage only**.

Cast the generic type of the enumerable.

- U: the type to cast to.

Returns: a linqy.Enumerable<U>.

### .concat(enumerable)

Concatenates with another enumerable.

- enumerable: an enumerable or simple array to concatenate.

Returns: a linqy enumerable.

### .contains(item)

Determines whether an item is contained.

- item: an item to check.

Returns: a boolean.

### .count(predicate)

Returns the number of elements satisfying a predicate.

- predicate *optional*: a function taking the current element to test, returning a boolean.

Returns: a number.

### .distinct(predicate)

Returns distinct elements by using a predicate to establish the distinction criterion.

- predicate *optional*: a function taking the current element to transform to its distinction criterion.

Returns: a linqy enumerable.

### .elementAt(index)

Returns the element at the given position.

Returns: the item.

### .empty()

Returns an empty enumerable. Very handy in a typescript context.

Returns: an empty linqy enumerable.

### .except(enumerable)

Produces the difference with another enumerable, containing items not available in the two enumerables.

- enumerable: an enumerable or simple array to compare with.

Returns: A linqy enumerable.

### .first(predicate)

Returns the first element satisfying a predicate.

- predicate: a function taking the current element to test, returning a boolean.

Returns: the item.

### .forEach(action)

Calls a function on every items.

- action: a function taking the current element.

Returns: nothing.

### .groupBy(predicate)

Groups the elements by using a predicate to establish the grouping value.

- predicate: a function taking the current element to transform to its grouping value.

Returns: a linqy enumerable of grouping object. The grouping object has a key field representing the grouping value, it is an linqy enumerable itself of the items within the group.

### .intersect(enumerable)

Produces the intersection with another enumerable, containing items only available in the two enumerables.

- enumerable: an enumerable or simple array to compare with.

Returns: A linqy enumerable.

### .join(inner, outerSelector, innerSelector, resultSelector)

Correlates the elements with another enumerable by using predicates to establish matching keys and result.

- inner: an enumerable or simple array to compare with.
- outerSelector: a function taking the current outer element to transform to its matching value.
- innerSelector: a function taking the current inner element to transform to its grouping value.
- resultSelector: a function taking two arguments, the matching outer and inner items, and returning the joined result.

Returns: A linqy enumerable.

### .last(predicate)

Returns the last element satisfying a predicate.

- predicate: a function taking the current element to test, returning a boolean.

Returns: the item.

### .max(predicate)

Returns the item having the maximum decimal value by using a predicate to establish the decimal value.
 
- predicate *optional*: a function taking the current element to evaluate, returning a number.

Returns: the item.

### .min(predicate)

Returns the item having the minimum decimal value by using a predicate to establish the decimal value.
 
- predicate *optional*: a function taking the current element to evaluate, returning a number.

Returns: the item.

### .orderBy(predicate)

Sorts the items in an ascending order by using a predicate to establish the sorting value.
 
- predicate *optional*: a function taking the current element to transform to its sorting value.

Returns: a linqy enumerable.

### .orderByDescending(predicate)

Sorts the items in a descending order by using a predicate to establish the sorting value.
 
- predicate *optional*: a function taking the current element to transform to its sorting value.

Returns: a linqy enumerable.

### .reverse()

Inverts the order of the items.

Returns: a linqy enumerable.

### .select(predicate)

Transforms each items by using a predicate.

- predicate: a function taking the current element to transform to its projected value.

Returns: a linqy enumerable.

### .selectMany(predicate)

Transforms each items by using a predicate and flattens it into a single enumerable.
 
- predicate: a function taking the current element to transform to its projected enumerable value.

Return: a linqy enumerable.

### .single(predicate)

Returns the only element satisfying a predicate, throwing an exception if no or more that on element is available.

- predicate: a function taking the current element to test, returning a boolean.

Returns: the item.

### .skip(number)

Bypasses the specified number of elements, keeping the remaining ones.

- number: the number of items to skip.

Return: a linqy enumerable.

### .skipWhile(predicate)

Bypasses the elements while they are satisfying a predicate, keeping the remaining ones.

- predicate: a function taking the current element to test, returning a boolean.

Return: a linqy enumerable.

### .sum(predicate)

Computes the sum of the elements.

- predicate *optional*: a function taking the current element to transform to a number, returning that number.

Returns: a number.

### .take(number)

Keeps the specified number of elements, ignoring the remaining ones.

- number: the number of items to take.

Return: a linqy enumerable.

### .takeWhile(predicate)

Keeps the elements while they are satisfying a predicate, ignoring the remaining ones.

- predicate: a function taking the current element to test, returning a boolean.

Return: a linqy enumerable.

### .thenBy(predicate)

Subsequent sorts the items in an ascending order by using a predicate to establish the sorting value.
 
- predicate *optional*: a function taking the current element to transform to its sorting value.

Returns: a linqy enumerable.

### .thenByDescending(predicate)

Subsequent sorts the items in a descending order by using a predicate to establish the sorting value.
 
- predicate *optional*: a function taking the current element to transform to its sorting value.

Returns: a linqy enumerable.

### .union(enumerable)

Produces the union with another enumerable, containing distinct items available in the two enumerables.

- enumerable: an enumerable or simple array to compare with.

Returns: A linqy enumerable.

### .toArray()

Creates an array from the current enumerable.

Returns: plain array.

### .where(predicate)

Filter the items by keeping elements satisfying a condition.

- predicate: a function taking the current element to test, returning a boolean.

Returns: a linqy enumerable.

### .zip(enumerable, resultSelector)

Merge with another enumerable by using a predicate.

- enumerable: an enumerable or simple array to compare with.
- resultSelector: a function taking two arguments, the items at the same positions, and returning the joined result.

Returns: a linqy enumerable.
