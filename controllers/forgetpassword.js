const uuid = require('uuid');
require('dotenv').config() 
const sgMail = require('@sendgrid/mail');
const bcrypt = require('bcrypt');

const User = require('../models/user');
const Forgotpassword = require('../models/password');

const forgotpassword = async (req, res) => {
    try {
        const { email } =  req.body;
        console.log(email + "this is eamil");
        const user = await User.findOne({where : { email }});
        if(user){
            const id = uuid.v4();
            user.createForgotpassword({ id , active: true })
                .catch(err => {
                    throw new Error(err)
                })

            sgMail.setApiKey(process.env.SENGRID_API_KEY)

            const msg = {
                to: 'sunilrana1730@gmail.com', 
                from: 'yj.rocks.2411@gmail.com', 
                subject: 'Resetpassword link ',
                text: 'click here is to resetyour password',
                html: `<a href="http://localhost:3000/password/resetpassword/${id}">Reset password</a>`,
            }

            sgMail
            .send(msg)
            .then((response) => {

               
                return res.status(response[0].statusCode).json({message: 'Link to reset password sent to your mail ', sucess: true})

            })
            .catch((error) => {
                throw new Error(error);
            })

            //send mail
        }else {
            throw new Error('User doesnt exist')
        }
    } catch(err){
        console.error(err)
        return res.json({ message: err, sucess: false });
    }

}

const resetpassword = (req, res) => {
    const id =  req.params.id;
    Forgotpassword.findOne({ where : { id }}).then(forgotpasswordrequest => {
        if(forgotpasswordrequest){
            forgotpasswordrequest.update({ active: false});
            res.status(200).send(`<html>
                                    <script>
                                        function formsubmitted(e){
                                            e.preventDefault();
                                            console.log('called')
                                        }
                                    </script>

                                    <form action="/password/updatepassword/${id}" method="get">
                                        <label for="newpassword">Enter New password</label>
                                        <input name="newpassword" type="password" required></input>
                                        <button>reset password</button>
                                    </form>
                                </html>`
                                )
            res.end()

        }
    })
}

const updatepassword = (req, res) => {

    try {
        const { newpassword } = req.query;
        const { resetpasswordid } = req.params;
        Forgotpassword.findOne({ where : { id: resetpasswordid }}).then(resetpasswordrequest => {
            User.findOne({where: { id : resetpasswordrequest.userId}}).then(user => {
              
                if(user) {


                    const saltRounds = 10;
                    bcrypt.genSalt(saltRounds, function(err, salt) {
                        if(err){
                            console.log(err);
                            throw new Error(err);
                        }
                        bcrypt.hash(newpassword, salt, function(err, hash) {
                          
                            if(err){
                                console.log(err);
                                throw new Error(err);
                            }
                            user.update({ password: hash }).then(() => {
                                res.status(201).json({message: 'Successfuly update the new password'})
                            })
                        });
                    });
            } else{
                return res.status(404).json({ error: 'No user Exists', success: false})
            }
            })
        })
    } catch(error){
        return res.status(403).json({ error, success: false } )
    }

}


module.exports = {
    forgotpassword,
    updatepassword,
    resetpassword
}