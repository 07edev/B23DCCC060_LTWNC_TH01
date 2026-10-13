import { useEffect, useMemo, useState } from 'react';
import { BookOpen, BookMarked, CheckCircle2, CircleAlert, LayoutDashboard, ListTodo, Plus, Sparkles, Trash2 } from 'lucide-react';
import { useAppDispatch, useAppSelector } from './app/hooks';
import { addDeadline, addSubject, deleteDeadline, deleteSubject, loadDeadlines, toggleDeadline } from './features/deadlines/deadlinesSlice';
import type { Filter } from './features/deadlines/deadlinesTypes';
import { useDeadlineFilters } from './hooks/useDeadlineFilters';
import { DeadlineForm } from './components/DeadlineForm';
import { DeadlineCard } from './components/DeadlineCard';
import { FilterTabs } from './components/FilterTabs';
import { SubjectForm } from './components/SubjectForm';

export function App() {
  const dispatch = useAppDispatch();
  const { items, subjects, status, error } = useAppSelector((state) => state.deadlines);
  const [showForm, setShowForm] = useState(false);
  const [showSubjectForm, setShowSubjectForm] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
  useEffect(() => { if (status === 'idle') void dispatch(loadDeadlines()); }, [dispatch, status]);
  const scopedItems = useMemo(() => selectedSubject ? items.filter((item) => item.subject === selectedSubject) : items, [items, selectedSubject]);
  const subjectStats = useMemo(() => subjects.map((subject) => {
    const subjectItems = items.filter((item) => item.subject === subject);
    return { name: subject, total: subjectItems.length, completed: subjectItems.filter((item) => item.completed).length, overdue: subjectItems.filter((item) => !item.completed && new Date(`${item.dueDate}T23:59:59`) < new Date()).length };
  }), [items, subjects]);
  const { filter, setFilter, filteredItems } = useDeadlineFilters(scopedItems);
  const handleSubjectDelete = (subject: string) => {
    const remaining = items.filter((item) => item.subject === subject && !item.completed).length;
    const warning = remaining > 0
      ? `Môn "${subject}" còn ${remaining} deadline chưa hoàn thành. Nếu xoá, toàn bộ deadline của môn này cũng sẽ bị xoá. Bạn đã học xong kỳ và muốn tiếp tục?`
      : `Môn "${subject}" không còn deadline chưa hoàn thành. Toàn bộ deadline thuộc môn này sẽ bị xoá. Bạn đã học xong kỳ và muốn tiếp tục?`;
    if (window.confirm(warning)) {
      dispatch(deleteSubject(subject));
      if (selectedSubject === subject) setSelectedSubject(null);
    }
  };
  const counts = useMemo<Record<Filter, number>>(() => ({
    all: scopedItems.length,
    pending: scopedItems.filter((item) => !item.completed && new Date(`${item.dueDate}T23:59:59`) >= new Date()).length,
    overdue: scopedItems.filter((item) => !item.completed && new Date(`${item.dueDate}T23:59:59`) < new Date()).length,
    completed: scopedItems.filter((item) => item.completed).length,
  }), [scopedItems]);
  const completed = counts.completed;
  return <div className="app-shell">
    <header className="topbar"><div className="brand"><div className="brand-mark"><BookOpen size={21} /></div><span>Deadline<span className="brand-accent">.</span></span></div><div className="profile"><div className="avatar">SV</div><span>Sinh viên</span></div></header>
    <main className="container">
      <section className="hero"><div><div className="eyebrow"><Sparkles size={14} /> KHÔNG BỎ LỠ DEADLINE</div><h1>Xin chào, sinh viên! <span>👋</span></h1><p>Tập trung vào việc học, chúng tôi sẽ giúp bạn nhớ deadline.</p></div><button className="button primary add-button" onClick={() => setShowForm(true)}><Plus size={19} /> Thêm bài tập</button></section>
      <div className="workspace">
        <aside className="course-sidebar">
          <div className="sidebar-label">KHÔNG GIAN HỌC TẬP</div>
          <button className={`nav-item ${selectedSubject === null ? 'active' : ''}`} onClick={() => setSelectedSubject(null)}><LayoutDashboard size={17} /><span>Tổng quan</span><b>{items.length}</b></button>
          <div className="sidebar-label subject-label">MÔN HỌC <span>{subjects.length}</span></div>
          <div className="course-nav">{subjects.map((subject) => <div className="course-row" key={subject}><button className={`nav-item ${selectedSubject === subject ? 'active' : ''}`} onClick={() => setSelectedSubject(subject)}><BookMarked size={17} /><span>{subject}</span><b>{items.filter((item) => item.subject === subject).length}</b></button><button className="subject-delete" onClick={() => handleSubjectDelete(subject)} aria-label={`Xoá môn ${subject}`}><Trash2 size={13} /></button></div>)}</div>
          <button className="add-subject-button" onClick={() => setShowSubjectForm(true)}><Plus size={14} /> Thêm môn học</button>
          <div className="sidebar-tip"><Sparkles size={16} /><p><strong>Giữ nhịp học tập</strong><br />Hoàn thành từng deadline nhỏ mỗi ngày.</p></div>
        </aside>
        <div className="dashboard-content">
        <section className="stats"><div className="stat-card"><div className="stat-icon blue"><ListTodo size={21} /></div><div><strong>{scopedItems.length}</strong><span>{selectedSubject ? 'Bài tập môn này' : 'Tổng bài tập'}</span></div></div><div className="stat-card"><div className="stat-icon orange"><CircleAlert size={21} /></div><div><strong>{counts.overdue}</strong><span>Đang quá hạn</span></div></div><div className="stat-card"><div className="stat-icon green"><CheckCircle2 size={21} /></div><div><strong>{completed}</strong><span>Đã hoàn thành</span></div></div></section>
        {selectedSubject === null && <section className="subject-overview"><div className="overview-heading"><div><h2>Tổng quan môn học</h2><p>Chọn một môn để xem riêng các deadline</p></div><span className="course-total">{subjects.length} môn học</span></div><div className="subject-grid">{subjectStats.map((subject) => <button className="subject-card" key={subject.name} onClick={() => setSelectedSubject(subject.name)}><div className="subject-card-icon"><BookMarked size={19} /></div><div className="subject-card-body"><strong>{subject.name}</strong><span>{subject.completed}/{subject.total} bài đã hoàn thành</span><div className="progress-track"><i style={{ width: `${subject.total ? (subject.completed / subject.total) * 100 : 0}%` }} /></div></div><div className="subject-count">{subject.overdue > 0 ? `${subject.overdue} quá hạn` : 'Đang theo dõi'}</div></button>)}</div></section>}
        <section className="content-card"><div className="section-heading"><div><div className="section-kicker">{selectedSubject ? 'MÔN HỌC ĐANG CHỌN' : 'TẤT CẢ DEADLINE'}</div><h2>{selectedSubject ?? 'Danh sách bài tập'}</h2><p>{selectedSubject ? 'Các deadline thuộc môn học này' : 'Theo dõi tiến độ và thời hạn của bạn'}</p></div><FilterTabs.Root value={filter} onChange={setFilter} counts={counts}><FilterTabs.Item value="all" label="Tất cả" /><FilterTabs.Item value="pending" label="Chưa hoàn thành" /><FilterTabs.Item value="overdue" label="Quá hạn" /><FilterTabs.Item value="completed" label="Đã hoàn thành" /></FilterTabs.Root></div>
        {status === 'loading' && <div className="state-message"><div className="spinner" />Đang tải bài tập mẫu...</div>}
        {status === 'failed' && <div className="state-message error">{error}</div>}
        {status === 'succeeded' && filteredItems.length === 0 && <div className="empty"><CheckCircle2 size={42} /><h3>Không có bài tập nào</h3><p>Thử chọn bộ lọc khác hoặc thêm bài tập mới.</p></div>}
        <div className="deadline-list">{filteredItems.map((item) => <DeadlineCard key={item.id} deadline={item} onToggle={() => dispatch(toggleDeadline(item.id))} onDelete={() => dispatch(deleteDeadline(item.id))} />)}</div>
        </section>
        </div>
      </div>
    </main>
    {showForm && <DeadlineForm subjects={subjects} initialSubject={selectedSubject} onSubmit={(deadline) => dispatch(addDeadline(deadline))} onClose={() => setShowForm(false)} />}
    {showSubjectForm && <SubjectForm onSubmit={(name) => dispatch(addSubject(name))} onClose={() => setShowSubjectForm(false)} />}
  </div>;
}
