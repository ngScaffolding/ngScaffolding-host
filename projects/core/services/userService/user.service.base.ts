import { IUserModel, ChangePasswordModel } from 'ngscaffolding-models';
import { Observable } from 'rxjs';

export abstract class  UserServiceBase {
    abstract getUser(userId: string): Observable<IUserModel>;
    abstract saveUser(user: IUserModel): Observable<IUserModel>;

    abstract getUsers(): Observable<IUserModel[]>;
    abstract createUser(user: IUserModel): Observable<IUserModel>;
    abstract deleteUser(userId: any): Observable<null>;

    abstract changePassword(changePasswordModel: ChangePasswordModel): Observable<null>;
    abstract resetPassword(userId: any): Observable<null>;
}
