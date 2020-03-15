const sgMail = require('@sendgrid/mail')

sgMail.setApiKey(process.env.SENDGRID_API_KEY)

const sendWelcomeEmail = (email,name)=>{
    sgMail.send({
        to:email,
        from:'no-reply@yunisdev.io',
        subject:'Thanks for joining us!',
        text:`Hi ${name}.Thanks for joining our Task Manager platform`,
    })
}
const sendCancelEmail = (email,name)=>{
    sgMail.send({
        to:email,
        from:'no-reply@yunisdev.io',
        subject:'Account deleted',
        text:`Dear ${name}.We are sad to hear about that.We will be happy if you say why you left.Have a nice day!`
    })
}
module.exports = {
    sendWelcomeEmail,sendCancelEmail
}