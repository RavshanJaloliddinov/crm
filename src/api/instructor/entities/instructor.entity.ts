export class InstructorEntity {
    id: number;
    name: string;
    email: string;
    bio?: string;

    constructor(partial: Partial<InstructorEntity>) {
        Object.assign(this, partial);
    }
}
