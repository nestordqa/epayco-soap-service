import express from 'express';
import swaggerUi from 'swagger-ui-express';
import swaggerJsDoc from 'swagger-jsdoc';
import bodyParser from 'body-parser';
import cors from 'cors';
import * as soap from 'soap'; // Correct import for the SOAP library
import mongoose from 'mongoose';
import clientRoutes from './routes/clientRoutes';
import { createServer } from 'http';
import { readFileSync } from 'fs';
import dotenv from 'dotenv';

// Load environment variables from a .env file
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000; // Use the port from environment variables or default to 3000
const isUsingDocker = process.env.IS_USING_DOCKER; // Check if the app is running in a Docker environment
const dbUrl = isUsingDocker === 'true' ? process.env.MONGO_URI_DOCKER : process.env.MONGO_URI; // Use the appropriate MongoDB URI based on the environment

// Middleware setup
app.use(cors()); // Enable Cross-Origin Resource Sharing (CORS)
app.use(bodyParser.json()); // Parse incoming JSON requests
app.use(bodyParser.urlencoded({ extended: true })); // Parse URL-encoded data

// Connect to MongoDB
mongoose.connect(dbUrl!, {})
  .then(() => console.log('Connected to MongoDB')) // Log success message on successful connection
  .catch(err => console.error('Could not connect to MongoDB', err)); // Log error if connection fails

// Register client-related routes
app.use('/api', clientRoutes);

// Define the SOAP service with its operations
const service = {
  ClientService: {
    ClientPort: {
      registerClient: require('./controllers/clientController').registerClient, // SOAP operation for registering a client
      rechargeWallet: require('./controllers/clientController').rechargeWallet, // SOAP operation for recharging a wallet
      pay: require('./controllers/clientController').pay, // SOAP operation for making a payment
      confirmPayment: require('./controllers/clientController').confirmPayment, // SOAP operation for confirming a payment
      checkBalance: require('./controllers/clientController').checkBalance // SOAP operation for checking a client's balance
    }
  }
};

// Read the WSDL file for the SOAP service
const xml = readFileSync('clientService.wsdl', 'utf8'); // Load the WSDL file as a string

// Create an HTTP server for the Express app
const server = createServer(app);

// Swagger configuration for API documentation
const swaggerOptions = {
    swaggerDefinition: {
        openapi: '3.0.0', // Specify OpenAPI version
        info: {
            title: 'Epayco API SOAP', // Title of the API
            version: '1.0.0', // Version of the API
            description: 'API SOAP for managing clients and payments', // Brief description of the API
        },
        servers: [
            {
                url: `http://localhost:${PORT}`, // Base URL for the API
            },
        ],
    },
    apis: ['./src/routes/*.ts'], // Path to the route files for Swagger to generate documentation
};

// Generate Swagger documentation
const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs)); // Serve Swagger UI at the /api-docs endpoint

// Start the server and listen on the specified port
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    soap.listen(server, '/wsdl', service, xml); // Attach the SOAP service to the server at the /wsdl endpoint
});