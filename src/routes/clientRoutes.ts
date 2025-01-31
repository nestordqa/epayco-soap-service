import express from 'express';
import { registerClient, rechargeWallet, confirmPayment, checkBalance, findClientByDocument } from '../controllers/clientController';
import { getAllPayments, getPaymentsByClientId, makePayment } from '../controllers/paymentController';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Clients
 *   description: API for managing clients.
 */

/**
 * @swagger
 * /registerClient:
 *   post:
 *     summary: Register a new client
 *     tags: [Clients]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               document:
 *                 type: string
 *               names:
 *                 type: string
 *               email:
 *                 type: string
 *               cellphone:
 *                 type: string
 *     responses:
 *       200:
 *         description: Client registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 cod_error:
 *                   type: string
 *                 message_error:
 *                   type: string
 *                 data:
 *                   type: object
 *       400:
 *         description: Client already exists or invalid data
 */
router.post('/registerClient', registerClient);

/**
 * @swagger
 * /rechargeWallet:
 *   post:
 *     summary: Recharge a client's wallet
 *     tags: [Clients]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               document:
 *                 type: string
 *               cellphone:
 *                 type: string
 *               amount:
 *                 type: number * 
 *     responses:
 *       200:
 *         description: Wallet recharged successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 cod_error:
 *                   type: string
 *                 message_error:
 *                   type: string
 *                 data:
 *                   type: object
 *       400:
 *         description: invalid data
 */
router.post('/rechargeWallet', rechargeWallet);

/**
 * @swagger
 * /confirmPayment:
 *   post:
 *     summary: ConfirmPayment
 *     tags: [Clients]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               sessionId:
 *                 type: string
 *               token:
 *                 type: string
 *     responses:
 *       200:
 *         description: Payment confirmed
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 cod_error:
 *                   type: string
 *                 message_error:
 *                   type: string
 *                 data:
 *                   type: object
 *       400:
 *         description: invalid data
 */
router.post('/confirmPayment', confirmPayment);

/**
 * @swagger
 * /checkBalance:
 *   post:
 *     summary: Check client balance
 *     tags: [Clients]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               document:
 *                 type: string
 *               cellphone:
 *                 type: string
 *     responses:
 *       200:
 *         description: Balance
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 cod_error:
 *                   type: string
 *                 message_error:
 *                   type: string
 *                 data:
 *                   type: object
 *       400:
 *         description: invalid data
 */
router.post('/checkBalance', checkBalance);

/**
 * @swagger
 * /client/:document:
 *   post:
 *     summary: Check client info
 *     tags: [Clients]
 *     responses:
 *       200:
 *         description: Balance
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 cod_error:
 *                   type: string
 *                 message_error:
 *                   type: string
 *                 data:
 *                   type: object
 *       400:
 *         description: invalid data
 */
router.get('/client/:document', findClientByDocument);

/**
* @swagger
* /payment:
*   post:
*     summary: Make a payment for a client.
*     tags: [Payments]
*     requestBody:
*       required: true
*       content:
*         application/json:
*           schema:
*             type: object
*             properties:
*               document:
*                 type: string
*               cellphone:
*                 type: string
*               amount:
*                 type: number
*     responses:
*       200:
*         description: Payment processed successfully with sessionId and token sent to email.
*         content:
*           application/json:
*             schema:
*               type: object
*               properties:
*                 success:
*                   type: boolean
*                 cod_error:
*                   type: string
*                 message_error:
*                   type: string
*                 data:
*                   type: object

*       400:
*         description: Client not found or insufficient balance.
*/
router.post('/payment', makePayment);

/**
 * @swagger
 * /payments/client/:clientId:
 *   get:
 *     summary: Get client payments
 *     tags: [Clients]
 *     responses:
 *       200:
 *         description: Balance
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 cod_error:
 *                   type: string
 *                 message_error:
 *                   type: string
 *                 data:
 *                   type: object
 *       400:
 *         description: invalid data
 */
router.get('/payments/client/:clientId', getPaymentsByClientId); // Obtener pagos por ID del cliente

/**
 * @swagger
 * /payments:
 *   get:
 *     summary: Get all payments
 *     tags: [Payments]
 *     responses:
 *       200:
 *         description: Payments
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 cod_error:
 *                   type: string
 *                 message_error:
 *                   type: string
 *                 data:
 *                   type: object
 *       400:
 *         description: invalid data
 */
router.get('/payments', getAllPayments); // Obtener todos los pagos

export default router;