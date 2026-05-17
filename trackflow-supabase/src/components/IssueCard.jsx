const TYPE_COLORS = { Bug: ['#FCEBEB','#A32D2D'], Feature: ['#E6F1FB','#185FA5'], Task: ['#EAF3DE','#3B6D11'], Story: ['#EEEDFE','#3C3489'] };
const PRIORITY_COLORS = { Critical: '#E24B4A', High: '#EF9F27', Medium: '#378ADD', Low: '#639922' };

export default function IssueCard({ issue, onDragStart, onClick }) {
  const [bg, color] = TYPE_COLORS[issue.type] || ['#eee','#333'];
  const pColor = PRIORITY_COLORS[issue.priority] || '#888';

  return (
    <div draggable onDragStart={onDragStart} onClick={onClick}
      style={{ background: '#fff', borderRadius: 8, border: '1px solid rgba(0,0,0,0.08)', padding: '10px 12px', marginBottom: 8, cursor: 'grab' }}
      onMouseEnter={e => e.currentTarget.style.borderColor='rgba(0,0,0,0.2)'}
      onMouseLeave={e => e.currentTarget.style.borderColor='rgba(0,0,0,0.08)'}>
      <div style={{ fontSize: 11, color: '#999', fontFamily: 'monospace', marginBottom: 3 }}>{issue.key}</div>
      <div style={{ fontSize: 13, lineHeight: 1.4, marginBottom: 8 }}>{issue.title}</div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <span style={{ background: bg, color, fontSize: 11, padding: '2px 7px', borderRadius: 4 }}>{issue.type}</span>
        <div style={{ width: 8, height: 8, borderRadius: '50%', background: pColor }} />
        <span style={{ fontSize: 11, color: '#999' }}>{issue.priority}</span>
      </div>
    </div>
  );
}
