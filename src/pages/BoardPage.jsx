import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../supabase';
import IssueCard from '../components/IssueCard';
import IssueModal from '../components/IssueModal';
import CreateModal from '../components/CreateModal';

const COLUMNS = [
  { id: 'todo',       label: 'To Do',       color: '#378ADD' },
  { id: 'inprogress', label: 'In Progress',  color: '#EF9F27' },
  { id: 'review',     label: 'In Review',    color: '#7F77DD' },
  { id: 'done',       label: 'Done',         color: '#639922' },
];

export default function BoardPage() {
  const { user, logout } = useAuth();
  const [issues, setIssues] = useState([]);
  const [search, setSearch] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [showCreate, setShowCreate] = useState(false);
  const [createStatus, setCreateStatus] = useState('todo');
  const [dragId, setDragId] = useState(null);

  const load = useCallback(async () => {
    let query = supabase.from('issues').select('*').order('created_at', { ascending: false });
    if (priorityFilter) query = query.eq('priority', priorityFilter);
    if (search) query = query.ilike('title', `%${search}%`);
    const { data } = await query;
    setIssues(data || []);
  }, [search, priorityFilter]);

  useEffect(() => { load(); }, [load]);

  const handleDrop = async (colId) => {
    if (!dragId) return;
    const issue = issues.find(i => i.id === dragId);
    if (!issue || issue.status === colId) return;
    setIssues(prev => prev.map(i => i.id === dragId ? { ...i, status: colId } : i));
    await supabase.from('issues').update({ status: colId }).eq('id', dragId);
    setDragId(null);
  };

  const handleCreate = async (data) => {
    const count = issues.length;
    const newIssue = { ...data, key: `TK-${count + 1}`, reporter_id: user.id };
    const { data: created } = await supabase.from('issues').insert(newIssue).select().single();
    if (created) setIssues(prev => [created, ...prev]);
    setShowCreate(false);
  };

  const handleUpdate = async (id, data) => {
    await supabase.from('issues').update(data).eq('id', id);
    setIssues(prev => prev.map(i => i.id === id ? { ...i, ...data } : i));
  };

  const handleDelete = async (id) => {
    await supabase.from('issues').delete().eq('id', id);
    setIssues(prev => prev.filter(i => i.id !== id));
    setSelectedIssue(null);
  };

  const stats = {
    total: issues.length,
    open: issues.filter(i => i.status !== 'done').length,
    done: issues.filter(i => i.status === 'done').length,
    critical: issues.filter(i => i.priority === 'Critical' && i.status !== 'done').length,
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f5f5f3', padding: '1.5rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: '1.25rem', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 32, height: 32, background: '#185FA5', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 600, fontSize: 13 }}>TK</div>
          <div>
            <div style={{ fontWeight: 600, fontSize: 16 }}>TrackFlow</div>
            <div style={{ fontSize: 11, color: '#6b6b67' }}>Sprint 4 · May 2026</div>
          </div>
        </div>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 8, alignItems: 'center' }}>
          <span style={{ fontSize: 13, color: '#6b6b67' }}>{user?.email}</span>
          <button className="btn" onClick={logout} style={{ fontSize: 12 }}>Sign out</button>
          <button className="btn btn-primary" onClick={() => { setCreateStatus('todo'); setShowCreate(true); }}>+ Create Issue</button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10, marginBottom: '1.25rem' }}>
        {[['Total Issues', stats.total], ['Open', stats.open], ['Completed', stats.done], ['Critical Open', stats.critical]].map(([label, val]) => (
          <div key={label} style={{ background: '#fff', borderRadius: 8, border: '1px solid rgba(0,0,0,0.08)', padding: '10px 14px' }}>
            <div style={{ fontSize: 11, color: '#6b6b67', marginBottom: 2 }}>{label}</div>
            <div style={{ fontSize: 22, fontWeight: 600 }}>{val}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap' }}>
        <input placeholder="Search issues..." value={search} onChange={e => setSearch(e.target.value)} style={{ width: 200 }} />
        <select value={priorityFilter} onChange={e => setPriorityFilter(e.target.value)} style={{ width: 'auto' }}>
          <option value="">All priorities</option>
          {['Critical','High','Medium','Low'].map(p => <option key={p}>{p}</option>)}
        </select>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: 12 }}>
        {COLUMNS.map(col => {
          const colIssues = issues.filter(i => i.status === col.id);
          return (
            <div key={col.id}
              style={{ background: 'rgba(0,0,0,0.04)', borderRadius: 12, padding: 10, minHeight: 400 }}
              onDragOver={e => e.preventDefault()}
              onDrop={() => handleDrop(col.id)}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 10 }}>
                <div style={{ width: 10, height: 10, borderRadius: '50%', background: col.color }} />
                <span style={{ fontSize: 12, fontWeight: 500, color: '#6b6b67', flex: 1 }}>{col.label}</span>
                <span style={{ fontSize: 11, color: '#999', background: '#fff', borderRadius: 10, padding: '1px 7px', border: '1px solid rgba(0,0,0,0.08)' }}>{colIssues.length}</span>
                <button style={{ background: 'none', border: 'none', color: '#999', fontSize: 18, lineHeight: 1 }}
                  onClick={() => { setCreateStatus(col.id); setShowCreate(true); }}>+</button>
              </div>
              {colIssues.map(issue => (
                <IssueCard key={issue.id} issue={issue}
                  onDragStart={() => setDragId(issue.id)}
                  onClick={() => setSelectedIssue(issue)} />
              ))}
            </div>
          );
        })}
      </div>

      {showCreate && <CreateModal defaultStatus={createStatus} onClose={() => setShowCreate(false)} onCreate={handleCreate} />}
      {selectedIssue && <IssueModal issue={selectedIssue} onClose={() => setSelectedIssue(null)} onUpdate={handleUpdate} onDelete={handleDelete} />}
    </div>
  );
}
