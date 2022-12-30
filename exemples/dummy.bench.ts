import { MardownFormatter } from '../src/services/formatters/markdown.formatter.service';
import { BenchmarkRunner } from '../src/services/runner.services';
import { ContextDictionnary, Nullable } from '../src/types';

const arr1: Array<number> = new Array(1).fill(1);
const arr10: Array<number> = new Array(10).fill(1);
const arr100: Array<number> = new Array(100).fill(1);
const arr1000: Array<number> = new Array(1000).fill(1);
const arr10000: Array<number> = new Array(10000).fill(1);

function dummy1(arr: Array<number>) {
  const arr2: Array<number> = [];
  for (let index: number = 0; index < arr.length; index++) {
    arr2.push(arr[index]);
  }
}

function dummy10(arr: Array<number>) {
  const arr2: Array<number> = [];
  for (let index: number = 0; index < arr.length; index++) {
    arr2.push(arr[index]);
  }
}

function dummy100(arr: Array<number>) {
  const arr2: Array<number> = [];
  for (let index: number = 0; index < arr.length; index++) {
    arr2.push(arr[index]);
  }
}

function dummy1000(arr: Array<number>) {
  const arr2: Array<number> = [];
  for (let index: number = 0; index < arr.length; index++) {
    arr2.push(arr[index]);
  }
}

function dummy10000(arr: Array<number>) {
  const arr2: Array<number> = [];
  for (let index: number = 0; index < arr.length; index++) {
    arr2.push(arr[index]);
  }
}

const dummyContext: ContextDictionnary = {};

const Runner: BenchmarkRunner = new BenchmarkRunner({
  lap: 50,
  timeIsMs: 100
});

Runner.bench(
  [
    {
      fn: dummy1,
      name: dummy1.name,
      args: arr1
    },
    {
      fn: dummy10,
      name: dummy10.name,
      args: arr10
    },
    {
      fn: dummy100,
      name: dummy100.name,
      args: arr100
    },
    {
      fn: dummy1000,
      name: dummy1000.name,
      args: arr1000
    },
    {
      fn: dummy10000,
      name: dummy10000.name,
      args: arr10000
    }
  ],
  dummyContext,
  (error: Nullable<Error>) => {
    // eslint-disable-next-line no-console
    if (error) console.log(error);
  }
);

Runner.exportTo(new MardownFormatter(), { filename: 'dummy-bench', path: '../benchmarks' }, dummyContext, (error: Nullable<Error>) => {
  // eslint-disable-next-line no-console
  if (error) console.error(error);
});
