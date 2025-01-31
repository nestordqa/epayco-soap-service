import { Request, Response } from 'express';
import crypto from 'crypto';
import Payment from '../models/Payment'; // Ensure the Payment model is imported
import Client from '../models/Client';
import { sendResponse } from '../utils/responseUtils';
import { sendEmail } from '../services/emailService';

/**
 * **generateToken**
 * Generates a 6-digit numeric token.
 * 
 * @returns A string representing a 6-digit token.
 */
const generateToken = (): string => {
    return Math.floor(100000 + Math.random() * 900000).toString(); // Generate a 6-digit token
};

/**
 * **makePayment**
 * Processes a payment for a client.
 * 
 * @param req - HTTP request object containing the client's document, cellphone, and payment amount.
 * @param res - HTTP response object to send the response back to the client.
 * 
 * This method verifies the client's existence and balance, generates a session ID and token, creates a payment record, updates the client's balance, and sends the token to the client's email.
 */
export const makePayment = async (req: Request, res: Response): Promise<void> => {
    const { document, cellphone, amount } = req.body;
    try {
        // Find the client in the database
        const client = await Client.findOne({ document, cellphone });
        if (!client) {
            sendResponse(res, false, '02', 'Client not found', null);
            return;
        }

        // Check if the client has sufficient balance
        if (client.balance < amount) {
            sendResponse(res, false, '03', 'Insufficient balance', null);
            return;
        }

        // Generate a session ID and a 6-digit token
        const sessionId = crypto.randomBytes(16).toString('hex');
        const token = generateToken();

        // Create a new payment record
        const payment = new Payment({
            sessionId,
            clientId: client._id,
            amount,
            token // Save the token in the payment model
        });
        
        await payment.save();
        await client.save();

        // Send the token to the client's email
        await sendEmail(client.email, 'Payment Token', `Your token is ${token}. Use this token to confirm your payment with the session ID ${sessionId}.`);

        // Send a success response with the session ID and token
        sendResponse(res, true, '00', 'Payment processed successfully', { sessionId, token });
    } catch (error) {
        const err = error as Error;
        sendResponse(res, false, '01', err.message, null);
    }
};

/**
 * **getPaymentsByClientId**
 * Retrieves all payments made by a specific client.
 * 
 * @param req - HTTP request object containing the client ID as a URL parameter.
 * @param res - HTTP response object to send the response back to the client.
 * 
 * This method fetches all payments associated with the provided client ID and optionally populates client details.
 */
export const getPaymentsByClientId = async (req: Request, res: Response): Promise<void> => {
    const { clientId } = req.params; 
    try {
        // Find all payments for the given client ID and populate client details if necessary
        const payments = await Payment.find({ clientId }).populate('clientId');
        
        // Send a success response with the list of payments
        sendResponse(res, true, '00', 'Payments retrieved successfully', payments);
    } catch (error) {
        const err = error as Error;
        sendResponse(res, false, '01', err.message, null);
    }
};

/**
 * **getAllPayments**
 * Retrieves all payments in the system.
 * 
 * @param req - HTTP request object.
 * @param res - HTTP response object to send the response back to the client.
 * 
 * This method fetches all payment records from the database and optionally populates client details.
 */
export const getAllPayments = async (req: Request, res: Response): Promise<void> => {
    try {
        // Retrieve all payments and populate client details if necessary
        const payments = await Payment.find().populate('clientId');
        
        // Send a success response with the list of all payments
        sendResponse(res, true, '00', 'All payments retrieved successfully', payments);
    } catch (error) {
        const err = error as Error;
        sendResponse(res, false, '01', err.message, null);
    }
};