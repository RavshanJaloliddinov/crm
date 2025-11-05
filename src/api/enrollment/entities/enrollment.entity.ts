export class EnrollmentEntity {
    id: number;
    studentId: number;
    courseId: number;
    enrolledDate: Date;
    completed: boolean;
    completionDate?: Date | null;

    constructor(partial: Partial<EnrollmentEntity>) {
        Object.assign(this, partial);
    }

    complete() {
        if (this.completed) {
            throw new Error('Bu enrollment allaqachon yakunlangan');
        }
        this.completed = true;
        this.completionDate = new Date();
    }

    cancel() {
        if (this.completed) {
            throw new Error('Yakunlangan enrollmentni bekor qilib bo‘lmaydi');
        }
    }
}
