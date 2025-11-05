export class StudentEntity {
    id: number;
    name: string;
    email: string;
    enrolledAt: Date;

    constructor(partial: Partial<StudentEntity>) {
        Object.assign(this, partial);
    }

    getEnrollmentInfo(): string {
        return `Talaba ${this.name} ${this.enrolledAt.toLocaleDateString()} sanasida ro‘yxatdan o‘tgan`;
    }
}
