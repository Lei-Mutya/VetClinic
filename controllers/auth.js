const mysql = require('mysql');
const jwt = require('jsonwebtoken');
const cookie = require('cookie-parser');
const bcrypt = require('bcryptjs'); 


//start the database
const db = mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE
});


//LOGIN
exports.login = (req, res)=>{
    const {email, password} = req.body;

    if(!email || !password)
    {
        return res.status(400).render('login', {message: 'Please enter a valid Email and/or password'});
    }

    db.query('SELECT * FROM users where email = ?', [email], async(err, result)=>{
        if(!result || !(await bcrypt.compare(password, result[0].password))){
            console.log(err);
            res.status(401).render('login', {message: 'email or password is incorrect!'});
        }
        else{
            const id = result[0].userID;
            const token = jwt.sign({id}, process.env.JWT_SECRET, {expiresIn:process.env.JWT_EXPIRES_IN});
            console.log(token);
            const cookieOptions = {
                expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000),
                httpOnly:true
            }
            res.cookie('jwt', token, cookieOptions);
            //res.status(200.redirect('/'));

           

            db.query('SELECT * FROM users WHERE email = ?',[email], (err, results)=>{
                if(err) throw err;
                res.render('customer',{title: 'List of Accounts', userData : results});
            });
            //return res.render('login', {message: 'User Logged In'});
        }
    });
};




//REGISTRATION CUSTOMERS
exports.register = (req, res)=>{
    //request body what's coming from the registration form
    console.log(req.body);

    //test if the entered password is correct

        /*const firstname = req.body.firstname; //req.body- name assigned on the form
        const lastname = req.body.lastname;
        const email = req.body.email;
        const password = req.body.password;
        const cPassword = req.body.password;*/
    
    const { firstname, lastname, email, password, passwordConfirm} = req.body;

    db.query('SELECT email FROM users WHERE email = ?', [email], async(error, results)=>{
        if(error)
        {
            console.log(error)
        }

        //Check if email is already registered
        if(results.length >0 )
        {
            return res.render('register', {
                message: 'That email is already in use!'
            });
        }
        //Check if password and password confirm is the same
        else if(password !== passwordConfirm)
        {
            return res.render('register',{
                message: 'Passwords do not match!'
            });
        }
        let hashedPassword = await bcrypt.hash(password, 8);
        console.log(hashedPassword);
       // res.send("testing");
        db.query('INSERT INTO users SET ?', {firstname: firstname, lastname: lastname, email: email, password:hashedPassword}, ()=>{
                                              //db field name: form name
            if(error)
            {
                console.log(error);
            }
            else{
                console.log(results);
                return res.render('register', {
                    message: 'User registered'
                });
            }

        }); //EOF dbquery INSERT
                                          
    });//EOF dbquery SELECT

    // /res.send('Form submitted');
}




//ADD PETS
exports.petreg = (req,res)=>{
    const userID = req.params.userID;
    db.query('SELECT * FROM users WHERE userID = ?', [userID], (err,results)=>{
        if(err) throw err;
        res.render('petreg', {title:'Add Pets', userData: results[0]});
    });
};

exports.addPetreg = (req,res)=>{
    const { petName, petGender, petBdate, petBreed, user_ID} = req.body;
    db.query('INSERT INTO pets SET ?', {petName: petName, petGender: petGender, petBdate: petBdate, petBreed: petBreed, userID: user_ID}, (err,results)=>{

        if(err)
        {
            console.log(err);
        }
        else{
            console.log(results);
            return res.render('petreg', {
                message: 'Pet Registered'
            });
        }
    }); //EOF dbquery INSERT

};
