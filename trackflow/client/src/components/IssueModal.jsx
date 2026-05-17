import { useState, useEffect } from 'react';
import { useApi } from '../hooks/useApi';
import { useAuth } from '../context/AuthContext';

const PRIORITY_COLORS = { Critical: '#E24B4A', High: '#EF9F27', Medium: '#378ADD', Low: '#639922' };
const TYPE_COLORS = { Bug: ['#FCEBEB','#A32D2D'], Feature: ['#E6F1FB','#185FA5'], Task: ['#EAF3DE','#3B6D11'], Story: ['#EEEDFE','#3C3489'] };
const COLUMNS = [['todo','To Do'],['inprogress','In Progress'],['review','In Review'],['done','Done']];

export default function IssueModal({ issue, users, onClose, onUpdate, onDelete }) {
  const api = useApi();
  const { user } = useAuth();
  const [full, setFull] = useState(null);
  const [comment, setComment] = useState('');

  useEffect(() => {
    api.get(`/issues/${issue.id}`).then(setFull);
  }, [issue.id]);

  const change = async (field, value) => {
    await onUpdate(issue.id, { [field]: value });
    setFull(f => f ? { ...f, [field]: value } : f);
  };

  const postComment = async () => {
    if (!comment.trim()) return;
    const c = await api.post(`/issues/${issue.id}/comments`, { body: comment });
    setFull(f => f ? { ...f, comments: [...(f.comments||[]), { ...c, author_name: user.name, initials: user.initials, color: user.color }] } : f);
    setComment('');
  };

  const data = full || issue;
  const [typeBg, typeColor] = TYPE_COLORS[data.type] || ['#eee','#333'];

  return (
    <div onClick={e => e.target === e.currentTarget && onClose()}
      style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'flex-start', justifyContent: 'center', zIndex: 50, paddingTop: '3rem', overflowY: 'auto' }}>
      <div style={{ background: '#fff', borderRadius: 12, padding: '1.5rem', width: 620, maxWidth: '95vw', marginBottom: '3rem' }}>

        <div style={{ display: 'flex', gap: 10, marginBottom: '1rem' }}>
          <div style={{ background: typeBg, color: typeColor, borderRadius: 6, width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, flexShrink: 0 }}>
            {data.type?.[0]}
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 11, color: '#999', fontFamily: 'monospace' }}>{data.key}</div>
            <div style={{ fontSize: 17, fontWeight: 600, marginTop: 2 }}>{data.title}</div>
          </div>
          <button className="btn btn-danger" style={{ fontSize: 12 }} onClick={() => { if (confirm('Delete this issue?')) onDelete(issue.id); }}>Delete</button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 180px', gap: '1.25rem' }}>
          <div>
            <p style={{ fontSize: 13, color: '#6b6b67', lineHeight: 1.6, marginBottom: '1rem' }}>
              {data.description || <em>No description.</em>}
            </p>

            <div style={{ borderTop: '1px solid rgba(0,0,0,0.08)', paddingTop: '1rem' }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: '#6b6b67', marginBottom: 10 }}>
                Activity ({full?.comments?.length || 0})
              </div>
              {full?.comments?.map((c, i) => (
                <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 10 }}>
                  <div style={{ width: 24, height: 24, borderRadius: '50%', background: (c.color||'#185FA5')+'22', color: c.color||'#185FA5', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 9, fontWeight: 600, flexShrink: 0 }}>
                    {c.initials||'?'}
                  </div>
                  <div>
                    <span style={{ fontSize: 12, fontWeight: 600 }}>{c.author_name}</span>
                    <span style={{ fontSize: 11, color: '#999', marginLeft: 6 }}>{new Date(c.created_at).toLocaleDateString()}</span>
                    <div style={{ fontSize: 12, color: '#6b6b67', marginTop: 2 }}>{c.body}</div>
                  </div>
                </div>
              ))}
              <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                <input value={comment} onChange={e => setComment(e.target.value)} placeholder="Add a comment..."
                  onKeyDown={e => e.key === 'Enter' && postComment()} />
                <button className="btn btn-primary" onClick={postComment} style={{ whiteSpace: 'nowrap' }}>Post</button>
              </div>
            </div>
          </div>

          <div>
            <div style={{ marginBottom: 14 }}>
              <label style={{ fontSize: 11, color: '#999', textTransform: 'uppercase', letterSpacing: '0.04em', display: 'block', marginBottom: 4 }}>Status</label>
              <select value={data.status} onChange={e => change('status', e.target.value)} style={{ fontSize: 12 }}>
                {COLUMNS.map(([v,l]) => <option key={v} value={v}>{l}</option>)}
              </select>
            </div>
            <div style={{ marginBottom: 14 }}>
              <label style={{ fontSize: 11, color: '#999', textTransform: 'uppercase', letterSpacing: '0.04em', display: 'block', marginBottom: 6 }}>Priority</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: PRIORITY_COLORS[data.priority] }} />
                <span style={{ fontSize: 13 }}>{data.priority}</span>
              </div>
            </div>
            <div style={{ marginBottom: 14 }}>
              <label style={{ fontSize: 11, color: '#999', textTransform: 'uppercase', letterSpacing: '0.04em', display: 'block', marginBottom: 4 }}>Assignee</label>
              <select value={data.assignee_id||''} onChange={e => change('assignee_id', e.target.value||null)} style={{ fontSize: 12 }}>
                <option value="">Unassigned</option>
                {users.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
              </select>
            </div>
            <div>
              <label style={{ fontSize: 11, color: '#999', textTransform: 'uppercase', letterSpacing: '0.04em', display: 'block', marginBottom: 6 }}>Type</label>
              <span style={{ background: typeBg, color: typeColor, fontSize: 12, padding: '2px 8px', borderRadius: 4 }}>{data.type}</span>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1.25rem' }}>
          <button className="btn" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
}
