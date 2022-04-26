const nodemailer = require('nodemailer');

class SMTP {
    constructor() {
        this.__smtpConfig = {
            'host': global.CONFIG['SMTP']['host'],
            'port': global.CONFIG['SMTP']['port'],
            'secure': global.CONFIG['SMTP']['secureConnection']
        };

        if (global.CONFIG['SMTP']['username']) {
            this.__smtpConfig['auth'] = {
                'user': global.CONFIG['SMTP']['username'],
                'pass': global.CONFIG['SMTP']['password']
            };
        }

        this.transporter = nodemailer.createTransport(this.__smtpConfig);

        // verify connection configuration
        this.transporter.verify(function (error) {
            if (error) {
                console.info(error);
            } else {
                console.info('SMTP Server is ready to take our messages');
            }
        });
    }
}

module.exports = SMTP;
