/**
 * @deprecated
 */
export class TimeManager {
  public static startTimer(): [number, number] {
    const time: [number, number] = process.hrtime();
    return time;
  }

  public static endTimer(time: [number, number]): number {
    const diff: [number, number] = process.hrtime(time);
    const NS_PER_SEC: number = 1e9;
    const result: number = diff[0] * NS_PER_SEC + diff[1]; // Result in Nanoseconds
    const elapsed: number = result * 0.000001;
    return this.roundTo(6, elapsed); // Result in milliseconds
  }

  private static roundTo(decimalPlaces: number, numberToRound: number): number {
    const exponent: string = `e+${decimalPlaces}`;
    return +(Math.round(+numberToRound + +exponent) + `e-${decimalPlaces}`);
  }
}
