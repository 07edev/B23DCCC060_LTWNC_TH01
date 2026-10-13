import type { Deadline } from './deadlinesTypes';

const sampleDeadlines: Deadline[] = [
  { id: '1', subject: 'Lập trình Web', title: 'Hoàn thiện Student Tracker', dueDate: '2026-10-18', priority: 'high', completed: false },
  { id: '2', subject: 'Cơ sở dữ liệu', title: 'Thiết kế ERD chương 4', dueDate: '2026-10-15', priority: 'medium', completed: false },
  { id: '3', subject: 'Tiếng Anh chuyên ngành', title: 'Nộp bài thuyết trình nhóm', dueDate: '2026-10-11', priority: 'high', completed: false },
  { id: '4', subject: 'Kỹ năng mềm', title: 'Nhật ký phát triển bản thân', dueDate: '2026-10-23', priority: 'low', completed: true },
  { id: '5', subject: 'Toán rời rạc', title: 'Bài tập quan hệ và hàm', dueDate: '2026-10-08', priority: 'medium', completed: false },
];

export const fetchSampleDeadlines = async (): Promise<Deadline[]> => {
  await new Promise((resolve) => setTimeout(resolve, 650));
  return sampleDeadlines;
};

export const sampleSubjects = sampleDeadlines.map((item) => item.subject);
