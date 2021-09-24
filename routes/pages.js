const express = require('express');
const mysql = require('mysql');
const router = express.Router();

//start the database
const db = mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE
});

router.get('/', (req,res)=>{
    res.render('index');
});

router.get('/register', (req,res)=>{
    res.render('register');
});

router.get('/login', (req,res)=>{
    res.render('login');
});

router.get('/customer', function (req, res) {
   res.render('customer');
  });


router.get('/petreg', (req, res) =>{
   res.render('petreg');
  });


  router.get('/addPetreg', (req,res)=>{
      res.render('addPetreg');
  })


//STATIC PAGES
router.get('/missionVision', (req,res)=>{
    res.render('missionVision');
})


router.get('/theTeam', (req,res)=>{
    res.render('theTeam');
})

router.get('/listServices', (req,res)=>{
    res.render('listServices');
})

router.get('/booking', (req,res)=>{
    res.render('booking');
});

module.exports = router;

