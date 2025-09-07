import { DatabaseSync } from 'node:sqlite';
const db = new DatabaseSync(':memory:');

// execute sql statements from strings  
db.exec(`
  CREATE TABLE users (
  id INTEGER primary key AUTOINCREMENT ,
  username TEXT UNIQUE,
  password TEXT
);
`);
db.exec(`
  create TABLE todos (
  id INTEGER primary key AUTOINCREMENT ,
  user_id INTEGER,
  task TEXT,
  completed BOOLEAN DEFAULT 0,
  FOREIGN KEY (user_id) REFERENCES users(id)
);
`); 

export default db;