import { IFormatter } from './services/formatters/IFormatter.formatter.service';
import {
  Callback,
  Context,
  ContextDictionnary,
  Dictionnary,
  IFormatterOptions,
  Nullable,
  OperationContext,
  OperationSecondsOptions,
  Opt,
  PrettyFunction
} from './types';
import { RunnerUtils } from './utils/runner.utils';
const DEFAULT_TIME: number = 5000;
export class BenchmarkRunner {
  /**
   * Exécute un benchmark de type opération par seconde.
   * @param {Function} fn - La fonction à benchmarker.
   * @param {string} timerName - Le nom du timer.
   * @param {number} totalTime - Le temps total d'exécution du benchmark (en ms).
   * @param {Dictionnary<Partial<OperationContext>>} context - Le contexte de benchmark.
   * @param {number} laps - Le nombre de tours de benchmark à effectuer.
   * @param {Callback} done - La fonction de callback appelée à la fin du benchmark.
   */
  private run_operation_per_second(
    fn: Function,
    timerName: string,
    totalTime = DEFAULT_TIME,
    context: Dictionnary<Partial<OperationContext>>,
    laps: number,
    done: Callback
  ) {
    return function () {
      let nbAction: number = 0;
      const start: number = Date.now() + totalTime;
      while (Date.now() < start) {
        nbAction++;
        fn(...arguments);
      }

      // Gestion des resultats
      const resultName: string = timerName !== undefined ? timerName : fn.name;
      if (!context[resultName]) {
        context[resultName] = {};
      }
      const ctx: Partial<OperationContext> = context[resultName];
      if (laps === 0) {
        ctx.fn = fn;
        ctx.name = resultName;
        ctx.time = totalTime;
      }

      if (!Array.isArray(ctx.raw_result)) ctx.raw_result = [];
      ctx.raw_result.push(nbAction);

      if (!ctx.result) ctx.result = [];
      ctx.result.push(nbAction / (totalTime / 1000)); // todo: surement bugger
      done(null);
    };
  }

  /**
   * Exécute plusieurs benchmarks de type opération par seconde.
   * @template T
   * @param {Array<OperationSecondsOptions<T>>} benchs - Les options de benchmark à exécuter.
   * @param {ContextDictionnary<OperationContext>} context - Le contexte de benchmark.
   * @param {Callback} done - La fonction de callback appelée à la fin des benchmarks.
   */
  public multiple_operation_per_second<T extends Function>(
    benchs: Array<OperationSecondsOptions<T>>,
    context: ContextDictionnary<OperationContext>,
    done: Callback
  ): void {
    context.type = 'OPS';
    for (let j: number = 0; j < 30; j++) {
      const shuffledArray: Array<OperationSecondsOptions<T>> = RunnerUtils.shuffleArray(benchs);
      for (let index: number = 0; index < shuffledArray.length; index++) {
        const { fn, name, args, ms } = shuffledArray[index];
        const functionToBench: Function = this.run_operation_per_second(fn, name, ms, context, j, done);
        functionToBench(args);
      }
    }
  }

  /**
   * Afficher les résultats de benchmark à l'écran.
   * @template T
   * @param {ContextDictionnary<T>} result - Les résultats de benchmark.
   * @param {Opt<PrettyFunction>} [pretty] - La fonction de formatage à utiliser pour afficher les données.
   */
  public print<T extends Context = Context>(result: ContextDictionnary<T>, pretty?: Opt<PrettyFunction>) {
    Object.entries(result).map(([key, value]: [string, string | Context]) => {
      if (pretty) return pretty(key, value);
      // eslint-disable-next-line no-console
      return console.log(key, value);
    });
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
