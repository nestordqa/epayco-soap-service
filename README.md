# Epayco API SOAP

Bienvenido a la documentación de la API SOAP Epayco, una solución robusta para gestionar clientes y pagos utilizando Node.js, Express, node-soap y MongoDB. Esta API permite registrar clientes, procesar pagos, recargar monederos y confirmar transacciones de manera eficiente.

## Tabla de Contenidos

- [Instalación](#instalación)
- [Variables de Entorno](#variables-de-entorno)
- [Scripts](#scripts)
- [Uso](#uso)
- [Documentación Swagger](#documentación-swagger)

## Instalación

Para comenzar con este proyecto, clona el repositorio e instala las dependencias:

```bash
git clone https://github.com/nestordqa/epayco-soap-service.git
cd epayco-soap-service
npm install
```

## Variables de Entorno

Antes de ejecutar la aplicación, es necesario configurar las variables de entorno. Crea un archivo `.env` en la raíz del proyecto con el siguiente contenido:

```plaintext
# Cadenas de conexión a MongoDB
MONGO_URI=mongodb://epayco:epayco-password@localhost:27017
MONGO_URI_DOCKER=mongodb://epayco:epayco-password@mongo:27017
IS_USING_DOCKER=true

# Configuración del correo electrónico
EMAIL_USER=tu_correo@gmail.com
EMAIL_PASS=tu_contraseña_de_aplicación  # Usa una contraseña de aplicación si usas Gmail con 2FA habilitada

# Puerto de la aplicación
PORT=3000
```

### Nota:
Si necesitas probar el servicio de envío de correos electrónicos, asegúrate de cambiar estas variables según sea necesario.

## Scripts

Puedes usar los siguientes scripts para gestionar tu aplicación:

- Para iniciar la aplicación **sin Docker**:

```bash
npm start
```

- Para ejecutar la aplicación **con Docker**:

```bash
npm run docker:up  # Iniciar contenedores
npm run docker:down  # Detener contenedores
```

## Uso

Una vez que la aplicación esté en funcionamiento, puedes acceder a los endpoints API. La API soporta las siguientes funcionalidades:

1. **Registrar un Cliente**: `POST /api/registerClient`
2. **Recargar Monedero**: `POST /api/rechargeWallet`
3. **Realizar un Pago**: `POST /api/payment`
4. **Confirmar Pago**: `POST /api/confirmPayment`
5. **Consultar Saldo**: `POST /api/checkBalance`
6. **Buscar Cliente por Documento**: `GET /api/client/{document}`
7. **Obtener Pagos por ID del Cliente**: `GET /api/payments/client/{clientId}`
8. **Obtener Todos los Pagos**: `GET /api/payments`

### Documentación Swagger

Después de iniciar la aplicación, puedes ver la documentación API a través de Swagger en:

```
http://localhost:3000/api-docs/
```
