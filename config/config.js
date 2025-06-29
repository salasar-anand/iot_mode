import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: 'info.axogenix@gmail.com',  // Your email
        pass: 'gcdi rmvy gibx ovtn'   // Your email password
        // pass: 'hA7@eR1#s'   // Your email password
    }
});

export default transporter;
