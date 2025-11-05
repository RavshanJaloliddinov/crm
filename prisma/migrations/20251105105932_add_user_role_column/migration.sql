-- CreateEnum
CREATE TYPE "UserRoles" AS ENUM ('super_admin', 'admin');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "role" "UserRoles" NOT NULL DEFAULT 'admin';
