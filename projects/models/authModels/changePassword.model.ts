export interface ChangePasswordModel {
    userId: any,
    currentPassword: string,
    newPassword: string,
    passwordReminder?: string
}