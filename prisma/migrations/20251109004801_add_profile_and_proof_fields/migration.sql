-- AlterTable
ALTER TABLE "expenses" ADD COLUMN     "proofImageUrl" TEXT;

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "pixKey" TEXT,
ADD COLUMN     "profileImageUrl" TEXT;
