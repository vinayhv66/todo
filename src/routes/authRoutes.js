import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import db from '../db.js';

const router = express.Router();

// User registration
router.post('/register', (req, res) => {
  const { username, password } = req.body;

// encrypt the password using bcrypt
const hashedPasword = bcrypt.hashSync(password, 8)

//save the new user and hashed password to the db 
try{

} catch (err){
  console.log(err.message)
  res.sendStatus(503)
}


console.log(hashedPasword)

}
)

router.post('/login', (req, res) => {


})


export default router;