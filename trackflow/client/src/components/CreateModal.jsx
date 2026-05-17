import { useState } from 'react';

const COLUMNS = [['todo','To Do'],['inprogress','In Progress'],['review','In Review'],['done','Done']];

export default function CreateModal({ users, defaultStatus, onClose, onCreate }) {
  const [form, setForm] = useState({ title: '', description: '', type: 'Task', priority: 'Medium', status: defaultStatus, assignee_id: '' });
  const [error, setError] = useState('');

  const handle = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const submit = async () => {
    if (!form.title.trim()) { setError('Title is required'); return; }
    try {
      await onCreate({ ...form, assignee_id: form.assignee_id || null });
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div onClick={e => e.target === e.currentTarget && onClose()}
      style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50 }}>
      <div style={{ background: '#fff', borderRadius: 12, padding: '1.5rem', width: 440, maxWidth: '95vw', maxHeight: '90vh', overflowY: 'auto' }}>
        <h2 style={{ fontSize: 16, fontWeight: 600, marginBottom: '1rem' }}>Create Issue</h2>

        <div style={{ marginBottom: 12 }}>
          <label style={{ fontSize: 12, color: '#6b6b67', display: 'block', marginBottom: 4 }}>Title *</label>
          <input name="title" value={form.title} onChange={handle} placeholder="Describe the issue..." />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 12 }}>
          <div>
            <label style={{ fontSize: 12, color: '#6b6b67', display: 'block', marginBottom: 4 }}>Type</label>
            <select name="type" value={form.type} onChange={handle}>
              {['Bug','Feature','Task','Story'].map(t => <option key={t}>{t}</option>)}
            </select>
          </div>
          <div>
            <label style={{ fontSize: 12, color: '#6b6b67', display: 'block', marginBottom: 4 }}>Priority</label>
            <select name="priority" value={form.priority} onChange={handle}>
              {['Critical','High','Medium','Low'].map(p => <option key={p}>{p}</option>)}
            </select>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 12 }}>
          <div>
            <label style={{ fontSize: 12, color: '#6b6b67', display: 'block', marginBottom: 4 }}>Status</label>
            <select name="status" value={form.status} onChange={handle}>
              {COLUMNS.map(([v,l]) => <option key={v} value={v}>{l}</option>)}
            </select>
          </div>
          <div>
            <label style={{ fontSize: 12, color: '#6b6b67', display: 'block', marginBottom: 4 }}>Assignee</label>
            <select name="assignee_id" value={form.assignee_id} onChange={handle}>
              <option value="">Unassigned</option>
              {users.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
            </select>
          </div>
        </div>

        <div style={{ marginBottom: 12 }}>
          <label style={{ fontSize: 12, color: '#6b6b67', display: 'block', marginBottom: 4 }}>Description</label>
          <textarea name="description" value={form.description} onChange={handle} placeholder="Add more details..." rows={4} />
        </div>

        {error && <div style={{ color: '#E24B4A', fontSize: 13, marginBottom: 12 }}>{error}</div>}

        <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
          <button className="btn" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" onClick={submit}>Create Issue</button>
        </div>
      </div>
    </div>
  );
}
