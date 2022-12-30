import { DEFAULT_LAPS, DEFAULT_TIME } from '../constants';
import { IFormatter } from './formatters/IFormatter.formatter.service';
import {
  BenchmarkConfig,
  BenchOptions,
  Callback,
  Context,
  ContextDictionnary,
  Dictionnary,
  FunctionVoid,
  IFormatterOptions,
  Nullable,
  Opt,
  PrettyFunction
} from '../types';
import { RunnerUtils } from '../utils/runner.utils';

export class BenchmarkRunner {
  private config: BenchmarkConfig;

  constructor(config: Partial<BenchmarkConfig> = {}) {
    this.config = this.validateConfig(config);
  }

  private validateConfig(config: Partial<BenchmarkConfig>): BenchmarkConfig {
    if (!config.lap) config.lap = DEFAULT_LAPS;
    if (!config.timeIsMs) config.timeIsMs = DEFAULT_TIME;
    return config as BenchmarkConfig;
  }

  /**
   * Exécute un benchmark de type opération par seconde.
   * @param {Function} fn - La fonction à benchmarker.
   * @param {string} timerName - Le nom du timer.
   * @param {Dictionnary<Partial<OperationContext>>} context - Le contexte de benchmark.
   * @param {Callback} done - La fonction de callback appelée à la fin du benchmark.
   */
  private prepareBench(fn: Function, timerName: string, context: Dictionnary<Partial<Context>>, done: Callback) {
    const timeInMs: number = this.config.timeIsMs;
    return function () {
      let nbActions: number = 0;
      const start: number = Date.now() + timeInMs;
      while (Date.now() < start) {
        nbActions++;
        fn(...arguments);
      }

      // Gestion des resultats
      const resultName: string = timerName || fn.name;
      const ctx: Partial<Context> = context[resultName];

      ctx.raw_result!.push(nbActions);
      ctx.result!.push(RunnerUtils.getNbActionsSeconds(nbActions, timeInMs));
      done(null);
    };
  }

  /**
   * Exécute plusieurs benchmarks de type opération par seconde.
   * @template T
   * @param {Array<BenchOptions<T>>} benchs - Les options de benchmark à exécuter.
   * @param {ContextDictionnary<OperationContext>} context - Le contexte de benchmark.
   * @param {Callback} done - La fonction de callback appelée à la fin des benchmarks.
   */
  public bench<T extends Function>(benchs: Array<BenchOptions<T>>, context: ContextDictionnary<Context>, done: Callback): void {
    this.prepareContext(benchs, context);
    for (let laps: number = 0; laps < this.config.lap; laps++) {
      const shuffledArray: Array<BenchOptions<T>> = RunnerUtils.shuffleArray(benchs);
      for (let index: number = 0; index < shuffledArray.length; index++) {
        const { fn, name, args } = shuffledArray[index];
        const runnableBenchmark: FunctionVoid = this.prepareBench(fn, name, context, done);
        runnableBenchmark(args);
      }
    }
  }

  private prepareContext<T extends Function>(benchs: Array<BenchOptions<T>>, context: ContextDictionnary<Context>): void {
    for (let index: number = 0; index < benchs.length; index++) {
      const bench: BenchOptions<T> = benchs[index];
      const name: string = bench.name || bench.fn.name;
      context[name] = {
        raw_result: [],
        result: [],
        fn: bench.fn,
        name: name,
        time: this.config.timeIsMs
      } as unknown as Context;
    }
  }

  /**
   * Afficher les résultats de benchmark à l'écran.
   * @template T
   * @param {ContextDictionnary<T>} result - Les résultats de benchmark.
   * @param {Opt<PrettyFunction>} [pretty] - La fonction de formatage à utiliser pour afficher les données.
   */
  public print<T extends Context = Context>(result: ContextDictionnary<T>, pretty?: Opt<PrettyFunction>) {
    const entries: Array<[string, T]> = Object.entries(result);
    for (let index: number = 0; index < entries.length; index++) {
      const [key, context]: [string, T] = entries[index];
      if (pretty) pretty(key, context);
      // eslint-disable-next-line no-console
      else console.log(key, context);
    }
  }

  /**
   * Exporter les données dans un ou plusieurs formatteurs.
   *
   * @param {IFormatter|Array<IFormatter>} formatters - Le formatteur ou les formatteurs à utiliser.
   * @param {Callback} done - La fonction de callback appelée une fois que l'exportation est terminée.
   */
  public exportTo<T extends Context = Context>(
    formatters: IFormatter | Array<IFormatter>,
    options: IFormatterOptions,
    context: ContextDictionnary<T>,
    done: Callback
  ): void {
    if (!Array.isArray(formatters)) return this.export<T>(formatters, options, context, done);
    const formatter: Opt<IFormatter> = formatters.pop();
    if (!formatter) return done(null, null);
    return this.export(formatter, options, context, (error: Nullable<Error>) => {
      if (error) return done(error);
      return this.exportTo<T>(formatters, options, context, done);
    });
  }

  /**
   * Exporter les résultats de benchmark au format spécifié.
   * @template T
   * @param {IFormatter} formatter - Le formateur à utiliser pour exporter les données.
   * @param {IFormatterOptions} options - Les options de formatage.
   * @param {ContextDictionnary<T>} context - Le contexte de benchmark.
   * @param {Callback} done - La fonction de callback appelée à la fin de l'exportation.
   */
  private export<T extends Context = Context>(formatter: IFormatter, options: IFormatterOptions, context: ContextDictionnary<T>, done: Callback): void {
    formatter.format<T>(context, options, (error: Nullable<Error>) => {
      return done(error, null);
    });
  }
}
