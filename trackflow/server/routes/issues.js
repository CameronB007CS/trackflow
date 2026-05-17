const router = require('express').Router();
const pool = require('../db/pool');
const auth = require('../middleware/auth');

const ISSUE_SELECT = `
  SELECT i.*, 
    u.name AS assignee_name, u.initials AS assignee_initials, u.color AS assignee_color,
    r.name AS reporter_name
  FROM issues i
  LEFT JOIN users u ON i.assignee_id = u.id
  LEFT JOIN users r ON i.reporter_id = r.id
`;

// GET /api/issues
router.get('/', auth, async (req, res) => {
  try {
    const { status, priority, assignee_id, q } = req.query;
    let conditions = [];
    let params = [];
    let idx = 1;

    if (status)      { conditions.push(`i.status=$${idx++}`);      params.push(status); }
    if (priority)    { conditions.push(`i.priority=$${idx++}`);    params.push(priority); }
    if (assignee_id) { conditions.push(`i.assignee_id=$${idx++}`); params.push(assignee_id); }
    if (q)           { conditions.push(`i.title ILIKE $${idx++}`); params.push(`%${q}%`); }

    const where = conditions.length ? 'WHERE ' + conditions.join(' AND ') : '';
    const result = await pool.query(`${ISSUE_SELECT} ${where} ORDER BY i.created_at DESC`, params);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/issues/:id
router.get('/:id', auth, async (req, res) => {
  try {
    const result = await pool.query(`${ISSUE_SELECT} WHERE i.id=$1`, [req.params.id]);
    if (!result.rows.length) return res.status(404).json({ error: 'Issue not found' });

    const comments = await pool.query(
      `SELECT c.*, u.name AS author_name, u.initials, u.color FROM comments c
       LEFT JOIN users u ON c.author_id=u.id WHERE c.issue_id=$1 ORDER BY c.created_at ASC`,
      [req.params.id]
    );
    res.json({ ...result.rows[0], comments: comments.rows });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/issues
router.post('/', auth, async (req, res) => {
  const { title, description, type, priority, status, assignee_id } = req.body;
  if (!title) return res.status(400).json({ error: 'Title is required' });

  try {
    const count = await pool.query('SELECT COUNT(*) FROM issues');
    const key = `TK-${parseInt(count.rows[0].count) + 1}`;

    const result = await pool.query(
      `INSERT INTO issues (key, title, description, type, priority, status, assignee_id, reporter_id)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *`,
      [key, title, description, type||'Task', priority||'Medium', status||'todo', assignee_id||null, req.user.id]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PATCH /api/issues/:id
router.patch('/:id', auth, async (req, res) => {
  const allowed = ['title','description','type','priority','status','assignee_id'];
  const fields = Object.keys(req.body).filter(k => allowed.includes(k));
  if (!fields.length) return res.status(400).json({ error: 'No valid fields to update' });

  const sets = fields.map((f, i) => `${f}=$${i + 1}`).join(', ');
  const values = fields.map(f => req.body[f]);

  try {
    const result = await pool.query(
      `UPDATE issues SET ${sets} WHERE id=$${fields.length + 1} RETURNING *`,
      [...values, req.params.id]
    );
    if (!result.rows.length) return res.status(404).json({ error: 'Issue not found' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/issues/:id
router.delete('/:id', auth, async (req, res) => {
  try {
    await pool.query('DELETE FROM issues WHERE id=$1', [req.params.id]);
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/issues/:id/comments
router.post('/:id/comments', auth, async (req, res) => {
  const { body } = req.body;
  if (!body) return res.status(400).json({ error: 'Comment body required' });

  try {
    const result = await pool.query(
      `INSERT INTO comments (issue_id, author_id, body) VALUES ($1,$2,$3) RETURNING *`,
      [req.params.id, req.user.id, body]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
