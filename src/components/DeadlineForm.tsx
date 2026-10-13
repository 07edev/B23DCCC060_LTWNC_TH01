import { useState, type FormEvent } from 'react';
import { CalendarPlus, X } from 'lucide-react';
import { isPriority, type NewDeadline } from '../features/deadlines/deadlinesTypes';

interface Props { subjects: string[]; initialSubject?: string | null; onSubmit: (deadline: NewDeadline) => void; onClose: () => void }
export function DeadlineForm({ subjects, initialSubject, onSubmit, onClose }: Props) {
  const [form, setForm] = useState<NewDeadline>({ subject: initialSubject && subjects.includes(initialSubject) ? initialSubject : subjects[0] ?? '', title: '', dueDate: '', priority: 'medium' });
  const update = <K extends keyof NewDeadline>(key: K, value: NewDeadline[K]) => setForm((current) => ({ ...current, [key]: value }));
  const submit = (event: FormEvent) => { event.preventDefault(); onSubmit(form); onClose(); };
  return <div className="modal-backdrop" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
    <form className="modal" onSubmit={submit}>
      <div className="modal-header"><div><span className="eyebrow">MỚI</span><h2>Thêm bài tập</h2></div><button type="button" className="icon-button" onClick={onClose} aria-label="Đóng"><X size={20} /></button></div>
      <label>Môn học<select required value={form.subject} onChange={(e) => update('subject', e.target.value)}>{subjects.map((subject) => <option key={subject} value={subject}>{subject}</option>)}</select></label>
      <label>Tên bài tập<input required value={form.title} onChange={(e) => update('title', e.target.value)} placeholder="Bạn cần hoàn thành việc gì?" /></label>
      <div className="form-grid"><label>Hạn nộp<input required type="date" value={form.dueDate} onChange={(e) => update('dueDate', e.target.value)} /></label>
      <label>Độ ưu tiên<select value={form.priority} onChange={(e) => { if (isPriority(e.target.value)) update('priority', e.target.value); }}><option value="high">Cao</option><option value="medium">Trung bình</option><option value="low">Thấp</option></select></label></div>
      <div className="modal-actions"><button type="button" className="button ghost" onClick={onClose}>Huỷ</button><button type="submit" className="button primary"><CalendarPlus size={17} /> Thêm bài tập</button></div>
    </form>
  </div>;
}
