import { Request, Response } from 'express';
import crypto from 'crypto';
import Payment from '../models/Payment'; // Asegúrate de importar el modelo de Payment
import Client from '../models/Client';
import { sendResponse } from '../utils/responseUtils';
import { sendEmail } from '../services/emailService';

const generateToken = (): string => {
    return Math.floor(100000 + Math.random() * 900000).toString(); // Genera un token de 6 dígitos
};

export const makePayment = async (req: Request, res: Response): Promise<void> => {
    const { document, cellphone, amount } = req.body;
    try {
        const client = await Client.findOne({ document, cellphone });
        if (!client) {
            sendResponse(res, false, '02', 'Client not found', null);
            return;
        }
        if (client.balance < amount) {
            sendResponse(res, false, '03', 'Insufficient balance', null);
            return;
        }

        // Generar sessionId y token
        const sessionId = crypto.randomBytes(16).toString('hex');
        const token = generateToken(); // Generar un token de 6 dígitos

        // Crear el pago
        const payment = new Payment({
            sessionId,
            clientId: client._id,
            amount,
            token // Guardar el token en el modelo de pago
        });
        
        await payment.save();

        // Actualizar balance del cliente
        client.balance -= amount;
        await client.save();

        // Enviar el token al correo electrónico del cliente
        await sendEmail(client.email, 'Token de Pago', `Tu token es ${token}. Usa este token para confirmar tu pago con el ID de sesión ${sessionId}.`);

        sendResponse(res, true, '00', 'Payment processed successfully', { sessionId, token });
    } catch (error) {
        const err = error as Error;
        sendResponse(res, false, '01', err.message, null);
    }
};

export const getPaymentsByClientId = async (req: Request, res: Response): Promise<void> => {
    const { clientId } = req.params; 
    try {
        const payments = await Payment.find({ clientId }).populate('clientId'); // Poblamos la información del cliente si es necesario
        sendResponse(res, true, '00', 'Payments retrieved successfully', payments);
    } catch (error) {
        const err = error as Error;
        sendResponse(res, false, '01', err.message, null);
    }
};

export const getAllPayments = async (req: Request, res: Response): Promise<void> => {
    try {
        const payments = await Payment.find().populate('clientId');
        sendResponse(res, true, '00', 'All payments retrieved successfully', payments);
    } catch (error) {
        const err = error as Error;
        sendResponse(res, false, '01', err.message, null);
    }
};
    