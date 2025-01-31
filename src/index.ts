import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import * as soap from 'soap'; // Importación corregida
import mongoose from 'mongoose';
import clientRoutes from './routes/clientRoutes';
import { createServer } from 'http';
import { readFileSync } from 'fs';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const isUsingDocker = process.env.IS_USING_DOCKER;
const dbUrl = isUsingDocker === 'true' ? process.env.MONGO_URI_DOCKER : process.env.MONGO_URI;
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect(dbUrl!, {})
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Could not connect to MongoDB', err));

app.use('/api', clientRoutes);

const service = {
  ClientService: {
    ClientPort: {
      registerClient: require('./controllers/clientController').registerClient,
      rechargeWallet: require('./controllers/clientController').rechargeWallet,
      pay: require('./controllers/clientController').pay,
      confirmPayment: require('./controllers/clientController').confirmPayment,
      checkBalance: require('./controllers/clientController').checkBalance
    }
  }
};

const xml = readFileSync('clientService.wsdl', 'utf8');

const server = createServer(app);
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    soap.listen(server, '/wsdl', service, xml); // Uso correcto de soap.listen
});