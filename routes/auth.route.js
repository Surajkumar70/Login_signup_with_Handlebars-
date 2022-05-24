const router = require('express').Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')
const {generateToken}=require('../middlewares/auth.middlewares')

router.get('/signup', async (req, res) => {
  res.render('signup');
});

router.post('/data', async (req, res) => {
  const { fname, lname, phone, email, password } = req.body;
  try {
    const salt = await bcrypt.genSalt(8)
    const hashedPassword = await bcrypt.hash(password, salt)
    const user = await prisma.user.create({
      data: { fname, lname, phone, email, password:hashedPassword }
    })
    console.log(user)
    res.redirect('/auth/login');
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message })
  }
});



//rander login page 

router.get("/login", (req, res) => {
  res.render("login")
})


router.post("/login", async(req,res) => {
  const { email, password } = req.body
  console.log(req.body)
  try {
    const user = await prisma.user.findUnique({
      where: { 
        email
      }
    })
    console.log(user)
    const isPasswordMatched = await bcrypt.compare(password, user.password)
    if(isPasswordMatched) {
      const token = generateToken(user.id)
      res.cookie("token", token)
      res.redirect('/')
    }else{
      res.status(500).json({ status: 'error', message: error.message })
    }
  } catch(error) {
    res.status(500).json({ status: 'error', message: error.message })
  }
})



module.exports = router;
