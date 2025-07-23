
const nodemailer = require('nodemailer');
const mailSender = async (email,title,body)=>{
  console.log("Sending Mail 1");
    
try{
    require('dotenv').config();
    let transporter = nodemailer.createTransport({
        host:process.env.MAIL_HOST,
        auth:{
            user:process.env.MAIL_USER,
            pass:process.env.MAIL_PASS,
        }
    })
    console.log("Sending Mail 2");
     
    let info = await transporter.sendMail(
        {
            from:'WCE - ClassNotify (A class reminder application)' ,
            to:email,
            subject:title ,
            html:`
            <img src="https://ibb.co/VWPfGrfp"></img>
            <h2> ${body} </h2>
            ` ,
            

        }

    )
    console.log("Sending Mail 3");
    console.log(" Mail Info-->" , info);
    return info;
}
catch(e){
    console.log("Isuues :",e);
}
}
// exports.sendMail = 

module.exports = mailSender;





