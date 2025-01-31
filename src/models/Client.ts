import { Schema, model, Document } from 'mongoose';

interface IClient extends Document {
    document: string;
    names: string;
    email: string;
    cellphone: string;
    balance: number;
    token?: string | null;
    amount?: number;
}

const ClientSchema = new Schema({
    document: { type: String, required: true, unique: true },
    names: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    cellphone: { type: String, required: true, unique: true },
    balance: { type: Number, default: 0 },
    token: { type: String },
    amount: { type: Number }
});

export default model<IClient>('Client', ClientSchema);