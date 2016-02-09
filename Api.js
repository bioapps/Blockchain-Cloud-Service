'use strict';

require('colors');

const express = require('express');

const baseConfig = {
	port: 9001
};

module.exports = class Api {
	constructor(blockchainService, bitcoinsCrypto, config) {
		this.blockchainService = blockchainService;
		this.bitcoinsCrypto = bitcoinsCrypto;

		this.config = Object.assign({}, baseConfig, config);

		this.app = express();
		this.setupApi();
		this.app.listen(this.config.port);

		console.log(`Started Api at port:${this.config.port}`.green);
	}

	setupApi() {
		const app = this.app;

		app.get('/transaction', this.transaction.bind(this));
		app.get('/confirmation', this.confirmation.bind(this));
		app.get('/cryptkey', this.cryptkey.bind(this));
	}


	//
	// API
	//
	transaction(req, res) {
		const credentialsHash = req.query.credentials; // Encrypted
		const tagId = req.query.tagId;
		const pinCode = req.query.pinCode;

		const receiveAddress = req.query.receiveAddress;
		const amountInBtc = req.query.amount;

		if (!credentialsHash || !tagId || !amountInBtc || !receiveAddress) {
			console.error(req.query);
			res.status(400).end(`Need to supply credentials, tagId, amount > 0.0 and receive address.`);
			return;
		}

		this.bitcoinsCrypto.decryptWalletCredentials(credentialsHash, tagId, pinCode)
			.then(walletCredentials => this.blockchainService.makeTransaction(walletCredentials, receiveAddress, amountInBtc))
			.then(result => res.json(result))
			.catch(error => {
				console.error('Payment error', error);
				res.status(500).json(error);
				res.end();
			});
	}

	confirmation(req, res) {
		res.status(200).end('*ok*');
	}

	cryptkey(req, res) {
		res.set('Content-Type', 'text/plain');
		res.end(this.bitcoinsCrypto.publicKey);
	}
};
