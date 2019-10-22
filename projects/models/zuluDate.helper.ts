export class ZuluDateHelper {
  public static getZuluDate(inputDate: Date): Date {
    return new Date(Date.UTC(inputDate.getUTCFullYear(), inputDate.getUTCMonth(), inputDate.getUTCDate(), inputDate.getUTCHours(), inputDate.getUTCMinutes(), inputDate.getUTCSeconds()));
  }

  public static getGMTDate(inputDate: Date): Date {
    const _userOffset = inputDate.getTimezoneOffset() * 60 * 1000;
    return new Date(inputDate.getTime() - _userOffset);
  }
}
