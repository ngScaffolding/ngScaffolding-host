export class ErrorModel {
    public errorId: number;
    public source: string;
    public message: string;
    public dateRecorded: Date;
    public stackTrace: string;
    public userId: string;

    constructor(err: Error) {
        this.message = err.message;
        this.dateRecorded = new Date();
    }
}
