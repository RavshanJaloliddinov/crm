export class UserEntity {
    id: number;
    name: string;
    email: string;
    password: string;

    constructor(partial: Partial<UserEntity>) {
        Object.assign(this, partial);
    }
}
