# Bot para Servidor de Minecraft en Aternos

## Descripción
Bot automático que se mantiene conectado a un servidor de Minecraft en Aternos para evitar que se apague por inactividad.

## Características
- Conexión automática al servidor
- Reconexión automática si se pierde la conexión
- Logs de estado cada minuto
- Manejo de errores y desconexiones

## Configuración

1. Copia el archivo `.env.example` a `.env`:
```bash
cp .env.example .env
```

2. Edita el archivo `.env` con los datos de tu servidor:
```
SERVER_HOST=tuservidor.aternos.me
SERVER_PORT=25565
BOT_USERNAME=AternosBot
MINECRAFT_VERSION=
```

**Importante**: Reemplaza `tuservidor.aternos.me` con la dirección de tu servidor de Aternos.

## Tecnologías
- Node.js 20
- Mineflayer 4.20.1
- dotenv para gestión de configuración

## Estructura del Proyecto
```
.
├── bot.js           # Script principal del bot
├── package.json     # Dependencias del proyecto
├── .env            # Configuración (no incluido en git)
├── .env.example    # Plantilla de configuración
└── replit.md       # Este archivo
```

## Uso
El bot se ejecuta automáticamente. Simplemente configura el archivo `.env` con los datos de tu servidor de Aternos.

## Cambios Recientes
- 2025-11-03: Creación inicial del proyecto
- Bot con reconexión automática
- Sistema de logs para monitoreo

## Arquitectura del Proyecto
- Bot basado en Node.js usando la librería mineflayer
- Configuración mediante variables de entorno
- Sistema de reconexión automática en caso de desconexión
- Logs informativos cada 60 segundos para verificar que el bot está activo
