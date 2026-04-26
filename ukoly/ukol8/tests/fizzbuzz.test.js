import test from 'ava';
import { fizzbuzz } from '../src/fizzbuzz.js';

test('return fizz on 3', (t) => {
    return t.is(fizzbuzz(3), 'fizz');
});
