#!/bin/bash

# Levantar MongoDB en un contenedor de Docker
echo "Iniciando MongoDB en un contenedor de Docker..."
docker run -d --name epayco-mongo -p 27017:27017 \
  -e MONGO_INITDB_ROOT_USERNAME=root \
  -e MONGO_INITDB_ROOT_PASSWORD=example \
  mongo

# Esperar a que MongoDB esté listo
echo "Esperando a que MongoDB esté listo..."
sleep 5

# Instalar dependencias de Node.js
echo "Instalando dependencias de Node.js..."
npm install

# Compilar TypeScript
echo "Compilando TypeScript..."
npm run build

# Ejecutar la API localmente
echo "Iniciando la API..."
npm start