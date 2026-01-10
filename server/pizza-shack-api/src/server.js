import app from './app.js';

const PORT = process.env.PORT || 3000;
const NODE_ENV = process.env.NODE_ENV || 'development';
const API_VERSION = process.env.API_VERSION || 'v1';

const server = app.listen(PORT, () => {
  console.log('╔════════════════════════════════════════════╗');
  console.log('║      🍕 Pizza Shack API Server 🍕         ║');
  console.log('╚════════════════════════════════════════════╝');
  console.log(`\n✓ Server running in ${NODE_ENV} mode`);
  console.log(`✓ Listening on port ${PORT}`);
  console.log(`✓ API version: ${API_VERSION}`);
  console.log(`\n📍 Endpoints:`);
  console.log(
    `   - Health: http://localhost:${PORT}/api/${API_VERSION}/health`
  );
  console.log(`   - Menu:   http://localhost:${PORT}/api/${API_VERSION}/menu`);
  console.log(
    `   - Orders: http://localhost:${PORT}/api/${API_VERSION}/orders`
  );
  console.log('\n🚀 Ready to serve delicious pizzas!\n');
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('\n⏳ SIGTERM received. Shutting down gracefully...');
  server.close(() => {
    console.log('✓ Server closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('\n⏳ SIGINT received. Shutting down gracefully...');
  server.close(() => {
    console.log('✓ Server closed');
    process.exit(0);
  });
});
