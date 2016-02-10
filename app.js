'use strict';

const Api = require('./Api');
const BlockchainService = require('./BlockchainService');
const Crypto = require('biopay-bitcoins-lib').Crypto;

const confirmationEndpoint = '/confirmation';

const cryptoService = new Crypto({
	publicKey: process.env.CRYPT_PUBLIC_KEY,
	privateKey: process.env.CRYPT_PRIVATE_KEY
});

const blockchainService = new BlockchainService({
	confirmationEndpoint,
	callbackUrl: process.env.CALLBACK_URL,
	receiveApiCode: process.env.RECEIVE_API_CODE,
	walletApiCode: process.env.WALLET_API_CODE
});

new Api(blockchainService, cryptoService, {
	confirmationEndpoint,
	port: process.env.PORT
});
