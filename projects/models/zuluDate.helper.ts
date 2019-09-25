export class ZuluDateHelper {
  public static getZuluDate(inputDate: Date): Date {
    return new Date(Date.UTC(inputDate.getFullYear(), inputDate.getMonth(), inputDate.getDate(), inputDate.getHours(), inputDate.getMinutes(), inputDate.getSeconds()));
  }
}
