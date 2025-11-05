
export class BaseEntity {
    id!: string

    is_active: boolean;

    is_deleted: boolean;

    created_at: Date;

    updated_at: Date;

    deleted_at: Date;

    created_by: string;

    updated_by: string;

    deleted_by: string;
}