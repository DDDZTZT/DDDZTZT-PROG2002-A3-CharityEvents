var express = require('express');
var app = express();

const db = require('./event_db');

// CORS is needed because the client/admin websites run on a different port
// (e.g. Angular dev server on 4200) than this API (3000).
const cors = require('cors');
app.use(cors());

// Parse JSON request bodies so POST/PUT can read req.body.
app.use(express.json());

// GET /api/events
//   - no query param  : active events in the future (used by the client home page)
//   - ?all=true       : every event regardless of status (used by the admin list)

app.get('/api/events', (req, res) => {
  const all = req.query.all === 'true';
  let sql = "SELECT * FROM events";
  if (!all) {
    sql += " WHERE status = 'active' AND event_date >= CURDATE()";
  }
  sql += " ORDER BY event_date";

  db.query(sql, (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Database query failed: ' + err.message });
    }
    res.json(results);
  });
});

// GET /api/categories - unchanged from A2

app.get('/api/categories', (req, res) => {
  db.query("SELECT * FROM categories", (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Database query failed: ' + err.message });
    }
    res.json(results);
  });
});

// GET /api/organisations - used by the admin form to pick an organisation

app.get('/api/organisations', (req, res) => {
  db.query("SELECT * FROM organisations", (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Database query failed: ' + err.message });
    }
    res.json(results);
  });
});

// GET /api/events/search - unchanged from A2.
// NOTE: must be declared BEFORE /api/events/:id so "search" is not treated
// as an id value by the :id route.

app.get('/api/events/search', (req, res) => {
    const date = req.query.date;
    const location = req.query.location;
    const category = req.query.category;
    const conditions = [];
    const params = [];

    if (date != null && date !== '') {
        conditions.push("event_date = ?");
        params.push(date);
    }
    if (location != null && location !== '') {
        conditions.push("city LIKE ?");
        params.push("%" + location + "%");
    }
    if (category != null && category !== '') {
        conditions.push("categories_category_id = ?");
        params.push(category);
    }

    let sql = "SELECT * FROM events WHERE status = 'active'";
    if (conditions.length > 0) {
        sql += " AND " + conditions.join(" AND ");
    }
    sql += " ORDER BY event_date";

    db.query(sql, params, (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Database query failed: ' + err.message });
        }
        res.json(results);
    });
});

// GET /api/events/:id
//   Returns one event PLUS its registrations (sorted newest first).
//   Response shape: { ...event fields..., registrations: [ ... ] }

app.get('/api/events/:id', (req, res) => {
  const id = req.params.id;

  db.query("SELECT * FROM events WHERE event_id = ?", [id], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Database query failed: ' + err.message });
    }
    if (results.length === 0) {
      return res.status(404).json({ error: 'Event not found' });
    }

    const event = results[0];

    db.query(
      "SELECT * FROM registrations WHERE event_id = ? ORDER BY registration_date DESC",
      [id],
      (err, registrations) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ error: 'Database query failed: ' + err.message });
        }
        res.json({ ...event, registrations: registrations });
      }
    );
  });
});

// POST /api/events - insert a new charity event (admin "create" feature)

app.post('/api/events', (req, res) => {
  const b = req.body;

  if (!b.event_name || !b.event_date || !b.categories_category_id || !b.organisations_org_id) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const sql = `INSERT INTO events
    (event_name, description, event_date, start_time, location_name, address, city,
     ticket_price, is_free, status, image_url, goal_amount, raised_amount,
     organisations_org_id, categories_category_id)
    VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`;

  const params = [
    b.event_name, b.description, b.event_date, b.start_time, b.location_name,
    b.address, b.city, b.ticket_price, b.is_free, b.status, b.image_url,
    b.goal_amount, b.raised_amount, b.organisations_org_id, b.categories_category_id
  ];

  db.query(sql, params, (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Database query failed: ' + err.message });
    }
    res.status(201).json({ message: 'Event created', event_id: result.insertId });
  });
});

// PUT /api/events/:id - update an existing event (admin "update" feature)

app.put('/api/events/:id', (req, res) => {
  const id = req.params.id;
  const b = req.body;

  if (!b.event_name || !b.event_date || !b.categories_category_id || !b.organisations_org_id) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const sql = `UPDATE events SET
    event_name=?, description=?, event_date=?, start_time=?, location_name=?, address=?, city=?,
    ticket_price=?, is_free=?, status=?, image_url=?, goal_amount=?, raised_amount=?,
    organisations_org_id=?, categories_category_id=?
    WHERE event_id=?`;

  const params = [
    b.event_name, b.description, b.event_date, b.start_time, b.location_name,
    b.address, b.city, b.ticket_price, b.is_free, b.status, b.image_url,
    b.goal_amount, b.raised_amount, b.organisations_org_id, b.categories_category_id, id
  ];

  db.query(sql, params, (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Database query failed: ' + err.message });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Event not found' });
    }
    res.json({ message: 'Event updated' });
  });
});

// DELETE /api/events/:id - delete an event (admin "delete" feature).
// Data integrity rule: an event with registrations cannot be deleted.

app.delete('/api/events/:id', (req, res) => {
  const id = req.params.id;

  db.query("SELECT COUNT(*) AS cnt FROM registrations WHERE event_id = ?", [id], (err, rows) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Database query failed: ' + err.message });
    }

    if (rows[0].cnt > 0) {
      return res.status(409).json({ error: 'Cannot delete event: it has registrations' });
    }

    db.query("DELETE FROM events WHERE event_id = ?", [id], (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Database query failed: ' + err.message });
      }
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: 'Event not found' });
      }
      res.json({ message: 'Event deleted' });
    });
  });
});

// POST /api/registrations - create a new registration (client registration page)
// Duplicate registration (same email + same event) is blocked by the
// UNIQUE(email, event_id) constraint in the database -> ER_DUP_ENTRY -> 409.

app.post('/api/registrations', (req, res) => {
  const b = req.body;

  if (!b.full_name || !b.email || !b.tickets || !b.event_id) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const sql = `INSERT INTO registrations (full_name, email, phone, tickets, event_id)
               VALUES (?,?,?,?,?)`;

  db.query(sql, [b.full_name, b.email, b.phone, b.tickets, b.event_id], (err, result) => {
    if (err) {
      if (err.code === 'ER_DUP_ENTRY') {
        return res.status(409).json({ error: 'You have already registered for this event' });
      }
      console.error(err);
      return res.status(500).json({ error: 'Database query failed: ' + err.message });
    }
    res.status(201).json({ message: 'Registration created', registration_id: result.insertId });
  });
});

// On cPanel, Passenger provides the port through process.env.PORT.
// Locally it falls back to 3000.
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log('API server running on port ' + PORT);
});
