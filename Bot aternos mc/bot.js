require('dotenv').config();
const mineflayer = require('mineflayer');

const config = {
  host: process.env.SERVER_HOST || 'localhost',
  port: parseInt(process.env.SERVER_PORT || '25565'),
  username: process.env.BOT_USERNAME || 'AternosBot',
  version: process.env.MINECRAFT_VERSION || false,
  auth: 'offline',
};

console.log('🤖 Iniciando bot de Minecraft...');
console.log(`📡 Conectando a ${config.host}:${config.port}`);
console.log(`👤 Nombre de usuario: ${config.username}`);
console.log(`🔐 Modo de autenticación: ${config.auth}`);

let reconnectAttempts = 0;

function createBot() {
  reconnectAttempts++;
  console.log(`\n🔄 Intento de conexión #${reconnectAttempts}...`);
  
  const bot = mineflayer.createBot(config);

  bot._client.on('packet', (data, metadata) => {
    if (metadata.state === 'configuration') {
      if (metadata.name === 'registry_data' || metadata.name === 'finish_configuration') {
        try {
          bot._client.write('settings', {
            locale: 'en_US',
            viewDistance: 10,
            chatFlags: 0,
            chatColors: true,
            skinParts: 127,
            mainHand: 1,
            enableTextFiltering: false,
            enableServerListing: true
          });
          console.log('📦 Paquete de configuración enviado');
        } catch (err) {
          console.error('❌ Error enviando configuración:', err.message);
        }
      }
    }
  });

  bot.on('login', () => {
    reconnectAttempts = 0;
    console.log('✅ Bot conectado exitosamente!');
    console.log(`👤 Usuario: ${bot.username}`);
    console.log(`🌍 Servidor: ${config.host}:${config.port}`);
    if (bot.game) {
      console.log(`🎮 Versión del servidor: ${bot.game.version}`);
      console.log(`📊 Modo de juego: ${bot.game.gameMode}`);
    }
  });

  bot.on('spawn', () => {
    console.log('🎮 Bot ha aparecido en el mundo');
    console.log('⏰ Manteniendo servidor activo...');
  });

  bot.on('chat', (username, message) => {
    if (username === bot.username) return;
    console.log(`💬 ${username}: ${message}`);
  });

  bot.on('error', (err) => {
    console.error('❌ Error completo:', err);
    console.error('📝 Mensaje de error:', err.message);
    
    if (err.message.includes('Invalid credentials') || err.message.includes('authentication')) {
      console.error('\n⚠️  PROBLEMA DE AUTENTICACIÓN:');
      console.error('   El servidor requiere una cuenta de Minecraft premium.');
      console.error('   Los bots gratuitos no pueden conectarse a servidores en modo online.');
    } else if (err.message.includes('ENOTFOUND') || err.message.includes('ECONNREFUSED')) {
      console.error('\n⚠️  PROBLEMA DE CONEXIÓN:');
      console.error('   No se puede alcanzar el servidor.');
      console.error('   Verifica que el servidor esté encendido en Aternos.');
    } else if (err.message.includes('whitelist')) {
      console.error('\n⚠️  PROBLEMA DE WHITELIST:');
      console.error('   El bot necesita estar en la whitelist del servidor.');
    }
  });

  bot.on('kicked', (reason) => {
    console.log('⚠️  Bot expulsado del servidor');
    console.log('📝 Razón:', JSON.stringify(reason));
    
    const reasonText = JSON.stringify(reason).toLowerCase();
    if (reasonText.includes('whitelist') || reasonText.includes('lista blanca')) {
      console.log('\n⚠️  SOLUCIÓN: Agrega el bot a la whitelist con:');
      console.log(`   /whitelist add ${config.username}`);
    } else if (reasonText.includes('banned') || reasonText.includes('baneado')) {
      console.log('\n⚠️  El bot está baneado del servidor');
    }
    
    console.log('🔄 Reintentando conexión en 30 segundos...');
    setTimeout(createBot, 30000);
  });

  bot.on('end', (reason) => {
    console.log('🔌 Conexión perdida');
    if (reason) {
      console.log('📝 Razón:', reason);
    }
    console.log('🔄 Reintentando conexión en 10 segundos...');
    setTimeout(createBot, 10000);
  });

  bot.on('health', () => {
    if (bot.health <= 6) {
      console.log(`⚠️  Vida baja: ${bot.health}/20`);
    }
  });

  setInterval(() => {
    if (bot.entity) {
      console.log(`💓 Bot activo - Vida: ${bot.health}/20, Comida: ${bot.food}/20`);
    }
  }, 60000);
}

createBot();

process.on('SIGINT', () => {
  console.log('\n👋 Deteniendo bot...');
  process.exit(0);
});
