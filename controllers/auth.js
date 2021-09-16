const mysql = require('mysql');
const jwt = require('jsonwebtoken');
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
    const { email, password } = req.body;
    db.query('SELECT * FROM users WHERE email = ? ', [email] , async function(error, results, fields){
        if(error){
            res.send({
                "code":400,
                "failed": "error occured"
            })
        }
        else{
            if(results.length>0){
                const comparison = await bcrypt.compare(password, results[0].password)
                if(comparison){
                    /*res.send({
                        "code":200,
                        "success": "login successful!"
                    })*/

                    return res.render('customer', {
                        message: 'Log-In Successful!'
                    });
                }
                else{
                    /*res.send({
                        "code": 204,
                        "success":"Email and password do not match"
                    })*/

                    return res.render('login', {
                        message: 'Email and password do not match'
                    });
                }
            }
            else{
                /*res.send({
                    "code": 206,
                    "success": "Email does not exists"
                });*/

                return res.render('login', {
                    message: 'Email does not exist'
                });
            }
        }
    });
}




//REGISTRATION
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