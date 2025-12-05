/*
  Warnings:

  - You are about to drop the `Activity` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `PreprocessingResult` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Activity" DROP CONSTRAINT "Activity_userId_fkey";

-- DropForeignKey
ALTER TABLE "PreprocessingResult" DROP CONSTRAINT "PreprocessingResult_activityId_fkey";

-- DropTable
DROP TABLE "Activity";

-- DropTable
DROP TABLE "PreprocessingResult";

-- CreateTable
CREATE TABLE "LearningFatigueMetric" (
    "id" SERIAL NOT NULL,
    "studentId" TEXT NOT NULL,
    "courseId" TEXT NOT NULL,
    "moduleId" TEXT NOT NULL,
    "date" DATE NOT NULL,
    "startTime" TIME NOT NULL,
    "durationMinutes" INTEGER NOT NULL,
    "instructionMethod" TEXT NOT NULL,
    "perceivedCognitiveLoad" INTEGER NOT NULL,
    "taskDifficultyRating" INTEGER NOT NULL,
    "comprehensionConfidence" INTEGER NOT NULL,
    "quizScore" INTEGER NOT NULL,
    "timeToCompleteQuizSeconds" INTEGER NOT NULL,
    "numAttemptsQuiz" INTEGER NOT NULL,
    "numPauses" INTEGER NOT NULL,
    "distractionEvents" INTEGER NOT NULL,
    "sleepHoursPrevNight" DOUBLE PRECISION NOT NULL,
    "stressLevel" INTEGER NOT NULL,
    "moodBefore" TEXT NOT NULL,
    "moodAfter" TEXT NOT NULL,
    "openedFeedback" BOOLEAN NOT NULL,
    "timeToOpenFeedbackHours" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "LearningFatigueMetric_pkey" PRIMARY KEY ("id")
);
