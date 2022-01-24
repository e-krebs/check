# The need to use `beforeEach`
let's say we test `addOne` that adds 1 to the number it receives:
```ts
const addOne = (value: number): number => value + 1;
```

## test failing in jest
You could write your tests like this:

```ts
import { addOne } from './addOne';

describe('addOne Fail', () => {
  let param: number;

  describe('when param = 0', () => {
    param = 0;

    it('should return 1', () => {
      expect(addOne(param)).toEqual(1);
    });
  });

  describe('when param = 1', () => {
    param = 1;

    it('should return 2', () => {
      expect(addOne(param)).toEqual(2);
    });
  });
});
```

You expect jest to run this test like this:
```ts
import { addOne } from './addOne';
let param: number;
param = 0;
expect(addOne(param)).toEqual(1);
param = 1;
expect(addOne(param)).toEqual(2);
```

But it actually runs it like this:
```ts
import { addOne } from './addOne';
let param: number;
param = 0;
param = 1;
expect(addOne(param)).toEqual(1);
expect(addOne(param)).toEqual(2);
```

which results in the first test failing.


## test succeeding in jest

instead, you have to write it using `beforeEach`:
```ts
import { myFunction } from './myFunction';

describe('addOne success', () => {
  let param: number;

  describe('when param = 0', () => {
    beforeEach(() => {
      param = 0;
    });

    it('should return 1', () => {
      expect(addOne(param)).toEqual(1);
    });
  });

  describe('when param = 1', () => {
    beforeEach(() => {
      param = 1;
    });

    it('should return 2', () => {
      expect(addOne(param)).toEqual(2);
    });
  });
});
```

Which results in jest to run this test like this, which succeeds:
```ts
import { addOne } from './addOne';
let param: number;
param = 0;
expect(addOne(param)).toEqual(1);
param = 1;
expect(addOne(param)).toEqual(2);
```

# using check

using check
- each test is run in its own new context (no variable leak between tests),
- all the code you pass through from the top of the file to reach that test branch is executed,

so using the first example above,

```ts
import { addOne } from './addOne';

describe('addOne Fail', () => {
  let param: number;

  describe('when param = 0', () => {
    param = 0;

    it('should return 1', () => {
      expect(addOne(param)).toEqual(1);
    });
  });

  describe('when param = 1', () => {
    param = 1;

    it('should return 2', () => {
      expect(addOne(param)).toEqual(2);
    });
  });
});
```

those tests would run like this:

```ts
import { addOne } from './addOne';
let param: number;
param = 0;
expect(addOne(param)).toEqual(1);
// initializing new context
import { addOne } from './addOne';
let param: number;
param = 1;
expect(addOne(param)).toEqual(2);

```