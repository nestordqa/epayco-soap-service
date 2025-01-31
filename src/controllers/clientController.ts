import { Request, Response } from 'express';
import crypto from 'crypto';
import Client from '../models/Client';
import { sendResponse } from '../utils/responseUtils';
import Payment from '../models/Payment';
import { sendEmail } from '../services/emailService';

export const registerClient = async (req: Request, res: Response): Promise<void> => {
    const { document, names, email, cellphone } = req.body;
    try {
        const token = crypto.randomBytes(16).toString('hex'); // Generar un token seguro
        const client = new Client({ document, names, email, cellphone, token }); // Agregar token al cliente
        await client.save();
        sendResponse(res, true, '00', 'Client registered successfully', client);
    } catch (error) {
        const err = error as Error;
        sendResponse(res, false, '01', err.message, null);
    }
};
export const rechargeWallet = async (req: Request, res: Response): Promise<void> => {
    const { document, cellphone, amount } = req.body;
    try {
        const client = await Client.findOne({ document, cellphone });
        if (!client) sendResponse(res, false, '02', 'Client not found', null);
        if (client) {
            client.balance += amount;
            await client.save();
            sendResponse(res, true, '00', 'Wallet recharged successfully', client);
        }
    } catch (error) {
        const err = error as Error;
        sendResponse(res, false, '01', err.message, null);
    }
};

export const confirmPayment = async (req: Request, res: Response): Promise<void> => {
    const { sessionId, token } = req.body;
    try {
        // Buscar el pago por sessionId
        const payment = await Payment.findOne({ sessionId });
        if (!payment) {
            sendResponse(res, false, '02', 'Payment not found', null);
            return;
        }

        // Verificar que el token coincida
        if (payment.token !== Number(token)) {
            sendResponse(res, false, '04', 'Invalid token', null);
            return;
        }

        // Actualizar el saldo del cliente
        const client = await Client.findById(payment.clientId);
        if (!client) {
            sendResponse(res, false, '02', 'Client not found', null);
            return;
        }

        // Asumiendo que amount se guarda en el modelo Payment
        client.balance -= payment.amount;
        await client.save();

        payment.token = null; // Limpiar el token después de confirmar
        await payment.save();

        await sendEmail(client.email, 'Pago confirmado', 'Tu pago ha sido confirmado con éxito!');
        sendResponse(res, true, '00', 'Payment confirmed successfully', client);
    } catch (error) {
        const err = error as Error;
        sendResponse(res, false, '01', err.message, null);
    }
};

export const checkBalance = async (req: Request, res: Response): Promise<void> => {
    const { document, cellphone } = req.body;
    try {
        const client = await Client.findOne({ document, cellphone });
        if (!client) sendResponse(res, false, '02', 'Client not found', null);
        if (client) {
            sendResponse(res, true, '00', 'Balance retrieved successfully', { balance: client.balance });
        }
    } catch (error) {
        const err = error as Error;
        sendResponse(res, false, '01', err.message, null);
    }
};

export const findClientByDocument = async (req: Request, res: Response): Promise<void> => {
    const { document } = req.params; // Obtener el documento de los parámetros de la URL
    try {
        const client = await Client.findOne({ document });
        if (!client) {
            sendResponse(res, false, '02', 'Client not found', null);
            return; // Asegúrate de salir después de enviar la respuesta
        }
        sendResponse(res, true, '00', 'Client retrieved successfully', client);
    } catch (error) {
        const err = error as Error;
        sendResponse(res, false, '01', err.message, null);
    }
};

