'use strict';

const Server = require('./Server');

const server = new Server({
	port: process.env.PORT,
	crypt: {
		publicKey: process.env.CRYPT_PUBLIC_KEY,
		privateKey: process.env.CRYPT_PRIVATE_KEY
	},
	blockchain: {
		callbackUrl: process.env.CALLBACK_URL,
		receiveApiCode: process.env.RECEIVE_API_CODE,
		walletApiCode: process.env.WALLET_API_CODE
	}
});

server.start();
