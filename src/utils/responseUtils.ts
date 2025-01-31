import { Response } from "express";

/**
 * **Error Responses Mapping**
 * A mapping of error codes to their corresponding messages and HTTP status codes.
 * This allows for consistent error handling and response formatting across the application.
 */
const errorResponses: { [key: string]: { message: string; status: number } } = {
    '00': { message: 'Success', status: 200 }, // Indicates a successful operation
    '01': { message: 'Internal Server Error', status: 400 }, // Generic error for server issues
    '02': { message: 'Client not found', status: 404 }, // Error when a client is not found
    '03': { message: 'Insufficient balance', status: 400 }, // Error for insufficient funds
    '04': { message: 'Invalid token', status: 400 }, // Error for invalid token during operations
};

/**
 * **sendResponse**
 * A utility function to send standardized responses in the app.
 * 
 * @param res - The Express `Response` object used to send the HTTP response.
 * @param success - A boolean indicating whether the operation was successful.
 * @param cod_error - A string representing the error code (e.g., '00', '01', etc.).
 * @param message_error - (Optional) A custom error message to override the default message.
 * @param data - (Optional) Any additional data to include in the response payload.
 * 
 * This function uses the `errorResponses` mapping to determine the appropriate HTTP status code
 * and message for the given error code. If the error code is not found, it defaults to an "Unknown error".
 */
export function sendResponse(
    res: Response,
    success: boolean,
    cod_error: string,
    message_error?: string,
    data: any = null
) {
    // Retrieve the response details for the given error code, or use a default response
    const response = errorResponses[cod_error] || { message: 'Unknown error', status: 400 };
    
    // Send the response with the appropriate status code and payload
    return res.status(success ? response.status : response.status).json({
        success, // Indicates whether the operation was successful
        cod_error, // The error code for the response
        message_error: message_error || response.message, // Custom or default error message
        data // Additional data to include in the response
    });
}