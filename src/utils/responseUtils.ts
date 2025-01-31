import { Response } from "express";

const errorResponses: { [key: string]: { message: string; status: number } } = {
    '00': { message: 'Success', status: 200 },
    '01': { message: 'Internal Server Error', status: 400 },
    '02': { message: 'Client not found', status: 404 },
    '03': { message: 'Insufficient balance', status: 400 },
    '04': { message: 'Invalid token', status: 400 },
};

export function sendResponse(
    res: Response,
    success: boolean,
    cod_error: string,
    message_error?: string,
    data: any = null
) {
    const response = errorResponses[cod_error] || { message: 'Unknown error', status: 400 };
    
    return res.status(success ? response.status : response.status).json({
        success,
        cod_error,
        message_error: message_error || response.message,
        data
    });
}
