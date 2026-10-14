const mysql = require('mysql2');

// The password is read from the environment variable DB_PASSWORD.
// If it is not set, the placeholder below is used, which must be replaced
// with your own MySQL root password before running the server.
const connection = mysql.createConnection({
  host: '127.0.0.1',
  user: 'root',
  password: process.env.DB_PASSWORD || 'your_password_here',
  database: 'charityevents_db',
  dateStrings: true
});

connection.connect((err) => {
  if (err) throw err;
  console.log('Connected to charityevents_db database');
});

module.exports = connection;