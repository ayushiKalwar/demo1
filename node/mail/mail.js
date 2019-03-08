var nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
    host: 'smtp.office365.com',
    port: 587,
    auth: {
        user: 'chetan.c01@mphasis.com',
        pass: 'muncar.51'
    }
});

module.exports = function(params) {
    this.from = 'chetan.c01@mphasis.com';

    this.send = function(){
        var options = {
            from : this.from,
            to : params.to,
            subject : params.subject,
            html : params.message,
			attachments: params.attachments
        };

        transporter.sendMail(options, function(err, suc){
            err ? params.errorCallback(err) : params.successCallback(suc);
        });
    }
}