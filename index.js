'use strict';

const Server = require('./Server');
const LocalWalletService = require('./LocalWalletService');

let server = new Server({
	port: process.env.PORT,
	crypt: {
		publicKey: process.env.CRYPT_PUBLIC_KEY,
		privateKey: process.env.CRYPT_PRIVATE_KEY
	}
	blockchain: {
		callbackUrl: process.env.CALLBACK_URL
	}
});

server.start();
