import { Request, Response } from 'express';
import crypto from 'crypto';
import Client from '../models/Client';
import { sendResponse } from '../utils/responseUtils';
import Payment from '../models/Payment';
import { sendEmail } from '../services/emailService';

/**
 * **registerClient**
 * Registers a new client in the database.
 * 
 * @param req - HTTP request object containing client data (document, names, email, cellphone).
 * @param res - HTTP response object to send the response back to the client.
 * 
 * This method generates a unique token for the client, saves it in the database, and returns a success response.
 */
export const registerClient = async (req: Request, res: Response): Promise<void> => {
    const { document, names, email, cellphone } = req.body;
    try {
        // Generate a unique and secure token for the client
        const token = crypto.randomBytes(16).toString('hex');
        
        // Create a new client instance with the provided data
        const client = new Client({ document, names, email, cellphone, token });
        
        // Save the client in the database
        await client.save();
        
        // Send a success response
        sendResponse(res, true, '00', 'Client registered successfully', client);
    } catch (error) {
        const err = error as Error;
        // Handle errors and send a response with the error message
        sendResponse(res, false, '01', err.message, null);
    }
};

/**
 * **rechargeWallet**
 * Recharges the wallet balance of a client.
 * 
 * @param req - HTTP request object containing the document, cellphone, and amount to recharge.
 * @param res - HTTP response object to send the response back to the client.
 * 
 * This method finds the client by document and cellphone, updates their balance, and saves the changes.
 */
export const rechargeWallet = async (req: Request, res: Response): Promise<void> => {
    const { document, cellphone, amount } = req.body;
    try {
        // Find the client in the database
        const client = await Client.findOne({ document, cellphone });
        
        if (!client) {
            // If the client is not found, send an error response
            sendResponse(res, false, '02', 'Client not found', null);
            return;
        }

        // Update the client's balance
        client.balance += amount;
        await client.save();

        // Send a success response
        sendResponse(res, true, '00', 'Wallet recharged successfully', client);
    } catch (error) {
        const err = error as Error;
        // Handle errors
        sendResponse(res, false, '01', err.message, null);
    }
};

/**
 * **confirmPayment**
 * Confirms a payment made by a client.
 * 
 * @param req - HTTP request object containing the sessionId and token of the payment.
 * @param res - HTTP response object to send the response back to the client.
 * 
 * This method verifies the payment token, updates the client's balance, and sends a confirmation email.
 */
export const confirmPayment = async (req: Request, res: Response): Promise<void> => {
    const { sessionId, token } = req.body;
    try {
        // Find the payment by sessionId
        const payment = await Payment.findOne({ sessionId });
        if (!payment) {
            sendResponse(res, false, '02', 'Payment not found', null);
            return;
        }

        // Verify that the provided token matches the payment's token
        if (payment.token !== Number(token)) {
            sendResponse(res, false, '04', 'Invalid token', null);
            return;
        }

        // Find the client associated with the payment
        const client = await Client.findById(payment.clientId);
        if (!client) {
            sendResponse(res, false, '02', 'Client not found', null);
            return;
        }

        // Update the client's balance by subtracting the payment amount
        client.balance -= payment.amount;
        await client.save();

        // Clear the payment token after confirmation
        payment.token = null;
        await payment.save();

        // Send a confirmation email to the client
        await sendEmail(client.email, 'Payment Confirmed', 'Your payment has been successfully confirmed!');
        
        // Send a success response
        sendResponse(res, true, '00', 'Payment confirmed successfully', client);
    } catch (error) {
        const err = error as Error;
        sendResponse(res, false, '01', err.message, null);
    }
};

/**
 * **checkBalance**
 * Retrieves the current balance of a client.
 * 
 * @param req - HTTP request object containing the document and cellphone of the client.
 * @param res - HTTP response object to send the response back to the client.
 * 
 * This method finds the client by document and cellphone and returns their current balance.
 */
export const checkBalance = async (req: Request, res: Response): Promise<void> => {
    const { document, cellphone } = req.body;
    try {
        // Find the client in the database
        const client = await Client.findOne({ document, cellphone });
        
        if (!client) {
            sendResponse(res, false, '02', 'Client not found', null);
            return;
        }

        // Send the client's balance in the response
        sendResponse(res, true, '00', 'Balance retrieved successfully', { balance: client.balance });
    } catch (error) {
        const err = error as Error;
        sendResponse(res, false, '01', err.message, null);
    }
};

/**
 * **findClientByDocument**
 * Finds a client by their document.
 * 
 * @param req - HTTP request object containing the document as a URL parameter.
 * @param res - HTTP response object to send the response back to the client.
 * 
 * This method finds the client by their document and returns their data.
 */
export const findClientByDocument = async (req: Request, res: Response): Promise<void> => {
    const { document } = req.params; // Get the document from the URL parameters
    try {
        // Find the client in the database
        const client = await Client.findOne({ document });
        
        if (!client) {
            sendResponse(res, false, '02', 'Client not found', null);
            return;
        }

        // Send the client's data in the response
        sendResponse(res, true, '00', 'Client retrieved successfully', client);
    } catch (error) {
        const err = error as Error;
        sendResponse(res, false, '01', err.message, null);
    }
};