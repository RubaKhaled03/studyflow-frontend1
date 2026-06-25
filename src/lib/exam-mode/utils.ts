import { ExamPreparationTopic } from "@/types/exam-mode";

/**
 * ملاحظة: تخزين بيانات Exam Mode (الـ topics والـ notes) مسؤولية الباك إند
 * عبر DataService (راجع src/services/data.service.ts).
 * هاد الملف  فيه فقط منطق العرض المحلي البحت (حساب نسبة التقدم).
 */

export function calcRevisionProgress(topics: ExamPreparationTopic[]): number {
  if (topics.length === 0) return 0;
  return Math.round((topics.filter((t) => t.completed).length / topics.length) * 100);
}