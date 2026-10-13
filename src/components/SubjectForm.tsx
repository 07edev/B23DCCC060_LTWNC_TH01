import { useState, type FormEvent } from 'react';
import { BookPlus, X } from 'lucide-react';

interface Props { onSubmit: (name: string) => void; onClose: () => void }
export function SubjectForm({ onSubmit, onClose }: Props) {
  const [name, setName] = useState('');
  const submit = (event: FormEvent) => { event.preventDefault(); onSubmit(name.trim()); onClose(); };
  return <div className="modal-backdrop" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
    <form className="modal compact-modal" onSubmit={submit}>
      <div className="modal-header"><div><span className="eyebrow">HỌC KỲ MỚI</span><h2>Thêm môn học</h2></div><button type="button" className="icon-button" onClick={onClose} aria-label="Đóng"><X size={20} /></button></div>
      <p className="modal-description">Tạo môn học trước, sau đó bạn có thể thêm nhiều deadline thuộc môn này.</p>
      <label>Tên môn học<input autoFocus required value={name} onChange={(event) => setName(event.target.value)} placeholder="Ví dụ: Phát triển ứng dụng di động" /></label>
      <div className="modal-actions"><button type="button" className="button ghost" onClick={onClose}>Huỷ</button><button type="submit" className="button primary"><BookPlus size={17} /> Thêm môn học</button></div>
    </form>
  </div>;
}
