/* eslint-disable no-console */
import { BenchmarkRunner } from '../../src/services/runner.services';
import { MardownFormatter } from '../../src/services/formatters/markdown.formatter.service';
import { Context, ContextDictionnary, Nullable } from '../../src/types';

function removeDuplicate<T extends string | number>(array: Array<T>) {
  return [...new Set(array)];
}

function removeDuplicateWithMap<T extends string | number>(array: Array<T>) {
  const arrayWithoutDuplicate: Array<T> = [];
  const map: { [key: string]: boolean } = {};

  for (let index: number = 0; index < array.length; index++) {
    const element: T = array[index];
    if (!map[element]) continue;
    map[element] = true;
    array.push(element);
  }
  return arrayWithoutDuplicate;
}

function removeDuplicateWithArray<T extends string | number>(array: Array<T>) {
  const arrayWithoutDuplicate: Array<T> = [];
  for (let index: number = 0; index < array.length; index++) {
    const element: T = array[index];
    if (array.includes(element)) continue;
    array.push(element);
  }
  return arrayWithoutDuplicate;
}

describe('SYSTEM::RUNNER', () => {
  it('should run benchmark', () => {
    const bench_duration: number = 100;
    const benchmark: BenchmarkRunner = new BenchmarkRunner({
      lap: 30,
      timeIsMs: bench_duration
    });
    const sample: Array<number> = [1, 2, 3, 3, 3, 3, 3, 3];
    const context: ContextDictionnary<Context> = {};

    benchmark.bench<typeof removeDuplicate>(
      [
        {
          fn: removeDuplicateWithMap,
          name: 'removeDuplicateWithMap',
          args: [...sample]
        },
        {
          fn: removeDuplicateWithArray,
          name: 'removeDuplicateWithArray',
          args: [...sample]
        },
        {
          fn: removeDuplicate,
          name: 'removeDuplicate',
          args: [...sample]
        }
      ],
      context,

      (error: Nullable<Error>) => {
        expect(error).toBeNull();
      }
    );

    const Formatter: MardownFormatter = new MardownFormatter();

    benchmark.exportTo(Formatter, { path: './', filename: 'Comparatif-Remove-Duplicate-Function' }, context, (error: Nullable<Error>) => {
      expect(error).toBeNull();
    });
    console.log(context);
  });
  it('should run and print', () => {
    const benchmark: BenchmarkRunner = new BenchmarkRunner({
      timeIsMs: 10
    });
    const spyPrint: jest.SpyInstance = jest.spyOn(benchmark, 'print');
    const context: ContextDictionnary<Context> = {};
    function twoSum(nums: number[], target: number): number[] {
      for (let index: number = 0; index < nums.length; index++) {
        for (let index2: number = 1; index2 < nums.length; index2++) {
          if (index === index2) continue;
          if (nums[index] + nums[index2] === target) return [index, index2];
        }
      }
      return [0, 0];
    }

    benchmark.bench<typeof twoSum>(
      [
        {
          fn: twoSum,
          name: 'removeDuplicate',
          args: [[1, 2, 3, 3], 6]
        }
      ],
      context,
      (error: Nullable<Error>) => {
        expect(error).toBeNull();
      }
    );

    benchmark.print(context);
    expect(spyPrint).toHaveBeenCalledTimes(1);
  });
});
