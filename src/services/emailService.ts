import nodemailer from 'nodemailer';

import dotenv from 'dotenv';

dotenv.config();

const { EMAIL_USER, EMAIL_PASS } = process.env;

// Configuración del transportador
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: EMAIL_USER,
        pass: EMAIL_PASS, // the app password Not your gmail password
    },
});

// Función para enviar el correo electrónico
export const sendEmail = async (to: string, subject: string, text: string) => {
    try {
        await transporter.sendMail({
            from: EMAIL_USER,
            to,
            subject,
            text
        });   
    } catch (error) {
        console.error(error);
    }
};
