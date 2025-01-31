import express from 'express';
import { registerClient, rechargeWallet, confirmPayment, checkBalance, findClientByDocument } from '../controllers/clientController';
import { getAllPayments, getPaymentsByClientId, makePayment } from '../controllers/paymentController';

const router = express.Router();

router.post('/registerClient', registerClient);
router.post('/rechargeWallet', rechargeWallet);
router.post('/confirmPayment', confirmPayment);
router.post('/checkBalance', checkBalance);
// Nueva ruta para buscar un cliente por documento
router.get('/client/:document', findClientByDocument);

// Nueva ruta para hacer un pago
router.post('/payment', makePayment);

// Rutas para acceder a los pagos
router.get('/payments/client/:clientId', getPaymentsByClientId); // Obtener pagos por ID del cliente
router.get('/payments', getAllPayments); // Obtener todos los pagos

export default router;