export class ZuluDateHelper {
    public static getZuluDate(inputDate: Date): Date {
      if (!inputDate) {
        return null;
    }
    return new Date(
            Date.UTC(
                inputDate.getUTCFullYear(),
                inputDate.getUTCMonth(),
                inputDate.getUTCDate(),
                inputDate.getUTCHours(),
                inputDate.getUTCMinutes(),
                inputDate.getUTCSeconds()
            )
        );
    }

    public static getGMTDate(inputDate: Date): Date {
        if (!inputDate) {
            return null;
        }
        const _userOffset = inputDate.getTimezoneOffset() * 60 * 1000;
        return new Date(inputDate.getTime() - _userOffset);
    }
}
