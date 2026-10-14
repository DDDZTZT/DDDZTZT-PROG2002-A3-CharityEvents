var express = require('express');
var app = express();

const db = require('./event_db');

//api run in port 3000, frontend run in localhost:5500? can not get data from api
//cors is needed because the frontend is running in a different port
const cors = require('cors');
app.use(cors());  

app.get('/api/events', (req, res) => {
  db.query("SELECT * FROM events WHERE status = 'active' AND event_date >= CURDATE() ORDER BY event_date", (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Database query failed' });
    }
    res.json(results);
  });
});

app.get('/api/categories', (req, res) => {
  db.query("SELECT * FROM categories", (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Database query failed' });
    }
    res.json(results);
  });
});

app.get('/api/events/search', (req, res) => {
    const date = req.query.date;
    const location = req.query.location;
    const category = req.query.category;
    const conditions = [];
    const params = [];

    if (date != null) {
        conditions.push("event_date = ?");
        params.push(date);
    }
    if (location != null) {
        conditions.push("city LIKE ?");
        params.push("%" + location + "%");
    }
    if (category != null) {
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
      return res.status(500).json({ error: 'Database query failed' });
    }
    res.json(results);
  });
});

app.get('/api/events/:id', (req, res) => {
  db.query("SELECT * FROM events WHERE event_id = ?", [req.params.id], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Database query failed' });
    }
    if (results.length > 0) {
      res.json(results[0]);
    } else {
      res.status(404).json({ error: 'Event not found' });
    }
  });
});

app.listen(3000, () => {
  console.log('API server running on http://localhost:3000');
});