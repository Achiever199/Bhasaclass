-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "googleId" TEXT,
    "name" TEXT,
    "email" TEXT NOT NULL,
    "emailVerified" TIMESTAMP(3),
    "image" TEXT,
    "avatarUrl" TEXT,
    "hasOnboarded" BOOLEAN NOT NULL DEFAULT false,
    "onboardingStep" INTEGER NOT NULL DEFAULT 1,
    "preferredUiLanguage" TEXT NOT NULL DEFAULT 'en',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);
CREATE TABLE "Account" (
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "token_type" TEXT,
    "scope" TEXT,
    "id_token" TEXT,
    "session_state" TEXT,
    CONSTRAINT "Account_pkey" PRIMARY KEY ("provider","providerAccountId")
);
CREATE TABLE "Session" (
    "sessionToken" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL
);
CREATE TABLE "VerificationToken" (
    "identifier" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL
);
CREATE TABLE "SourceLesson" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "grade" INTEGER NOT NULL,
    "subject" TEXT NOT NULL,
    "bodyText" TEXT NOT NULL,
    "sourceUrl" TEXT NOT NULL,
    "license" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "SourceLesson_pkey" PRIMARY KEY ("id")
);
CREATE TABLE "Resource" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "grade" INTEGER NOT NULL,
    "subject" TEXT NOT NULL,
    "targetLanguage" TEXT NOT NULL,
    "resourceType" TEXT NOT NULL,
    "learningObjective" TEXT NOT NULL,
    "sourceLessonId" TEXT,
    "authorId" TEXT NOT NULL,
    "content" JSONB NOT NULL,
    "localizedNotes" JSONB NOT NULL,
    "qualityChecks" JSONB NOT NULL,
    "verified" BOOLEAN NOT NULL DEFAULT false,
    "published" BOOLEAN NOT NULL DEFAULT false,
    "editedBeforePublish" BOOLEAN NOT NULL DEFAULT false,
    "duplicatedFromId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "Resource_pkey" PRIMARY KEY ("id")
);
CREATE TABLE "ResourceUsage" (
    "id" TEXT NOT NULL,
    "resourceId" TEXT NOT NULL,
    "userId" TEXT,
    "action" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "ResourceUsage_pkey" PRIMARY KEY ("id")
);
CREATE TABLE "Draft" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "step" INTEGER NOT NULL DEFAULT 1,
    "state" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "Draft_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "User_googleId_key" ON "User"("googleId");
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
CREATE INDEX "Account_userId_idx" ON "Account"("userId");
CREATE UNIQUE INDEX "Session_sessionToken_key" ON "Session"("sessionToken");
CREATE INDEX "Session_userId_idx" ON "Session"("userId");
CREATE UNIQUE INDEX "VerificationToken_token_key" ON "VerificationToken"("token");
CREATE UNIQUE INDEX "VerificationToken_identifier_token_key" ON "VerificationToken"("identifier","token");
CREATE INDEX "SourceLesson_grade_subject_idx" ON "SourceLesson"("grade","subject");
CREATE INDEX "Resource_authorId_updatedAt_idx" ON "Resource"("authorId","updatedAt");
CREATE INDEX "Resource_published_verified_updatedAt_idx" ON "Resource"("published","verified","updatedAt");
CREATE INDEX "Resource_targetLanguage_idx" ON "Resource"("targetLanguage");
CREATE INDEX "ResourceUsage_resourceId_action_idx" ON "ResourceUsage"("resourceId","action");
CREATE INDEX "ResourceUsage_userId_createdAt_idx" ON "ResourceUsage"("userId","createdAt");
CREATE INDEX "Draft_userId_updatedAt_idx" ON "Draft"("userId","updatedAt");
ALTER TABLE "Account" ADD CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Resource" ADD CONSTRAINT "Resource_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Resource" ADD CONSTRAINT "Resource_sourceLessonId_fkey" FOREIGN KEY ("sourceLessonId") REFERENCES "SourceLesson"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "ResourceUsage" ADD CONSTRAINT "ResourceUsage_resourceId_fkey" FOREIGN KEY ("resourceId") REFERENCES "Resource"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "ResourceUsage" ADD CONSTRAINT "ResourceUsage_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "Draft" ADD CONSTRAINT "Draft_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
