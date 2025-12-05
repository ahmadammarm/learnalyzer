/*
  Warnings:

  - You are about to drop the column `comprehensionConfidence` on the `LearningFatigueMetric` table. All the data in the column will be lost.
  - You are about to drop the column `courseId` on the `LearningFatigueMetric` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `LearningFatigueMetric` table. All the data in the column will be lost.
  - You are about to drop the column `distractionEvents` on the `LearningFatigueMetric` table. All the data in the column will be lost.
  - You are about to drop the column `durationMinutes` on the `LearningFatigueMetric` table. All the data in the column will be lost.
  - You are about to drop the column `instructionMethod` on the `LearningFatigueMetric` table. All the data in the column will be lost.
  - You are about to drop the column `moduleId` on the `LearningFatigueMetric` table. All the data in the column will be lost.
  - You are about to drop the column `moodAfter` on the `LearningFatigueMetric` table. All the data in the column will be lost.
  - You are about to drop the column `moodBefore` on the `LearningFatigueMetric` table. All the data in the column will be lost.
  - You are about to drop the column `numAttemptsQuiz` on the `LearningFatigueMetric` table. All the data in the column will be lost.
  - You are about to drop the column `numPauses` on the `LearningFatigueMetric` table. All the data in the column will be lost.
  - You are about to drop the column `openedFeedback` on the `LearningFatigueMetric` table. All the data in the column will be lost.
  - You are about to drop the column `perceivedCognitiveLoad` on the `LearningFatigueMetric` table. All the data in the column will be lost.
  - You are about to drop the column `quizScore` on the `LearningFatigueMetric` table. All the data in the column will be lost.
  - You are about to drop the column `sleepHoursPrevNight` on the `LearningFatigueMetric` table. All the data in the column will be lost.
  - You are about to drop the column `startTime` on the `LearningFatigueMetric` table. All the data in the column will be lost.
  - You are about to drop the column `stressLevel` on the `LearningFatigueMetric` table. All the data in the column will be lost.
  - You are about to drop the column `studentId` on the `LearningFatigueMetric` table. All the data in the column will be lost.
  - You are about to drop the column `taskDifficultyRating` on the `LearningFatigueMetric` table. All the data in the column will be lost.
  - You are about to drop the column `timeToCompleteQuizSeconds` on the `LearningFatigueMetric` table. All the data in the column will be lost.
  - You are about to drop the column `timeToOpenFeedbackHours` on the `LearningFatigueMetric` table. All the data in the column will be lost.
  - Added the required column `comprehension_confidence` to the `LearningFatigueMetric` table without a default value. This is not possible if the table is not empty.
  - Added the required column `course_id` to the `LearningFatigueMetric` table without a default value. This is not possible if the table is not empty.
  - Added the required column `distraction_events` to the `LearningFatigueMetric` table without a default value. This is not possible if the table is not empty.
  - Added the required column `duration_minutes` to the `LearningFatigueMetric` table without a default value. This is not possible if the table is not empty.
  - Added the required column `instruction_method` to the `LearningFatigueMetric` table without a default value. This is not possible if the table is not empty.
  - Added the required column `module_id` to the `LearningFatigueMetric` table without a default value. This is not possible if the table is not empty.
  - Added the required column `mood_after` to the `LearningFatigueMetric` table without a default value. This is not possible if the table is not empty.
  - Added the required column `mood_before` to the `LearningFatigueMetric` table without a default value. This is not possible if the table is not empty.
  - Added the required column `num_attempts_quiz` to the `LearningFatigueMetric` table without a default value. This is not possible if the table is not empty.
  - Added the required column `num_pauses` to the `LearningFatigueMetric` table without a default value. This is not possible if the table is not empty.
  - Added the required column `opened_feedback` to the `LearningFatigueMetric` table without a default value. This is not possible if the table is not empty.
  - Added the required column `perceived_cognitive_load` to the `LearningFatigueMetric` table without a default value. This is not possible if the table is not empty.
  - Added the required column `quiz_score` to the `LearningFatigueMetric` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sleep_hours_prev_night` to the `LearningFatigueMetric` table without a default value. This is not possible if the table is not empty.
  - Added the required column `start_time` to the `LearningFatigueMetric` table without a default value. This is not possible if the table is not empty.
  - Added the required column `stress_level` to the `LearningFatigueMetric` table without a default value. This is not possible if the table is not empty.
  - Added the required column `student_id` to the `LearningFatigueMetric` table without a default value. This is not possible if the table is not empty.
  - Added the required column `task_difficulty_rating` to the `LearningFatigueMetric` table without a default value. This is not possible if the table is not empty.
  - Added the required column `time_to_complete_quiz_seconds` to the `LearningFatigueMetric` table without a default value. This is not possible if the table is not empty.
  - Added the required column `time_to_open_feedback_hours` to the `LearningFatigueMetric` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "LearningFatigueMetric" DROP COLUMN "comprehensionConfidence",
DROP COLUMN "courseId",
DROP COLUMN "createdAt",
DROP COLUMN "distractionEvents",
DROP COLUMN "durationMinutes",
DROP COLUMN "instructionMethod",
DROP COLUMN "moduleId",
DROP COLUMN "moodAfter",
DROP COLUMN "moodBefore",
DROP COLUMN "numAttemptsQuiz",
DROP COLUMN "numPauses",
DROP COLUMN "openedFeedback",
DROP COLUMN "perceivedCognitiveLoad",
DROP COLUMN "quizScore",
DROP COLUMN "sleepHoursPrevNight",
DROP COLUMN "startTime",
DROP COLUMN "stressLevel",
DROP COLUMN "studentId",
DROP COLUMN "taskDifficultyRating",
DROP COLUMN "timeToCompleteQuizSeconds",
DROP COLUMN "timeToOpenFeedbackHours",
ADD COLUMN     "comprehension_confidence" INTEGER NOT NULL,
ADD COLUMN     "course_id" TEXT NOT NULL,
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "distraction_events" INTEGER NOT NULL,
ADD COLUMN     "duration_minutes" INTEGER NOT NULL,
ADD COLUMN     "instruction_method" TEXT NOT NULL,
ADD COLUMN     "module_id" TEXT NOT NULL,
ADD COLUMN     "mood_after" TEXT NOT NULL,
ADD COLUMN     "mood_before" TEXT NOT NULL,
ADD COLUMN     "num_attempts_quiz" INTEGER NOT NULL,
ADD COLUMN     "num_pauses" INTEGER NOT NULL,
ADD COLUMN     "opened_feedback" BOOLEAN NOT NULL,
ADD COLUMN     "perceived_cognitive_load" INTEGER NOT NULL,
ADD COLUMN     "quiz_score" INTEGER NOT NULL,
ADD COLUMN     "sleep_hours_prev_night" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "start_time" TIME NOT NULL,
ADD COLUMN     "stress_level" INTEGER NOT NULL,
ADD COLUMN     "student_id" TEXT NOT NULL,
ADD COLUMN     "task_difficulty_rating" INTEGER NOT NULL,
ADD COLUMN     "time_to_complete_quiz_seconds" INTEGER NOT NULL,
ADD COLUMN     "time_to_open_feedback_hours" DOUBLE PRECISION NOT NULL;
