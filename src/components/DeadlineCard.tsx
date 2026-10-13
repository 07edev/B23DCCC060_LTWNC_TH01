import { CalendarDays, Check, Circle, Clock3, Trash2 } from 'lucide-react';
import { getDaysLabel, getUrgency } from '../hooks/useDeadlineFilters';
import { priorityLabels, type Deadline } from '../features/deadlines/deadlinesTypes';
interface Props { deadline: Deadline; onToggle: () => void; onDelete: () => void }
export function DeadlineCard({ deadline, onToggle, onDelete }: Props) {
  const due = getDaysLabel(deadline.dueDate);
  const urgency = getUrgency(deadline);
  const urgencyLabel = urgency === 'overdue' ? 'Cần xử lý ngay' : urgency === 'urgent' ? 'Sắp đến hạn' : null;
  return <article className={`deadline-card ${deadline.completed ? 'is-complete' : ''} urgency-${urgency}`}>
    <button className={`check ${deadline.completed ? 'checked' : ''}`} onClick={onToggle} aria-label="Đổi trạng thái">{deadline.completed ? <Check size={17} /> : <Circle size={19} />}</button>
    <div className="deadline-main"><div className="card-top"><span className="subject">{deadline.subject}</span><span className={`priority ${deadline.priority}`}>{priorityLabels[deadline.priority]}</span>{urgencyLabel && <span className={`urgency-label ${urgency}`}>{urgencyLabel}</span>}</div><h3>{deadline.title}</h3><div className="meta"><span><CalendarDays size={15} />{new Date(`${deadline.dueDate}T12:00:00`).toLocaleDateString('vi-VN')}</span><span className={due.overdue && !deadline.completed ? 'overdue' : ''}><Clock3 size={15} />{deadline.completed ? 'Đã hoàn thành' : due.text}</span></div></div>
    <button className="delete-button" onClick={onDelete} aria-label="Xoá bài tập"><Trash2 size={18} /></button>
  </article>;
}
