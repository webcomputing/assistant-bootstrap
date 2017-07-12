// For stack traces on promise rejections. Pretty useful in tests.
process.on('unhandledRejection', r => console.log(r));