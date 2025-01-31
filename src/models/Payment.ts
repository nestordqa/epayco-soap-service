import { Schema, model, Document } from 'mongoose';

interface IPayment extends Document {
    sessionId: string;
    clientId: string; // ID del cliente relacionado
    amount: number;
    token: number | null; // Token utilizado para el pago
    createdAt: Date;
}

const PaymentSchema = new Schema({
    sessionId: { type: String, required: true },
    clientId: { type: Schema.Types.ObjectId, ref: 'Client', required: true },
    amount: { type: Number, required: true },
    token: { type: Number, required: false },
    createdAt: { type: Date, default: Date.now }
});

export default model<IPayment>('Payment', PaymentSchema);
