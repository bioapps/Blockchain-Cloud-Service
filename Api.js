'use strict';

require('colors');

const express = require('express');

const baseConfig = {
	confirmationEndpoint: '',
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

		app.get(this.config.confirmationEndpoint, this.confirmation.bind(this));
		app.get('/transaction', this.transaction.bind(this));
		app.get('/unsafeTransaction', this.unsafeTransaction.bind(this));
		app.get('/publickey', this.publickey.bind(this));
		app.get('/encryptcredentials', this.encryptcredentials.bind(this));
	}


	/**
	 * @api {get} /transaction Makes a transaction to an address using wallet credentials
	 *
	 * @apiParam {String} credentials 		String containing encrypted credentials.
	 * @apiParam {String} tagId				Id of the nfc-tag.
	 * @apiParam {String} [pinCode]			Optional pin code.
	 * @apiParam {Number} amount			Amount to transfer.
	 * @apiParam {String} receiveAddress	Address that will receive the transaction. xPub-format.
	 */
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

		const walletCredentials = this.bitcoinsCrypto.decryptWalletCredentials(credentialsHash, tagId, pinCode);
		this.blockchainService.makeTransaction(walletCredentials, receiveAddress, amountInBtc)
			.then(result => res.json(result))
			.catch(error => {
				console.error('Payment error', error);
				res.status(500).json(error);
				res.end();
			});
	}


	/**
	 * @api {get} /unsafeTransaction Makes a transaction to target address using wallet credentials. Credentials are not encrypted.
	 * 
	 * @apiParam {String} identifier		Wallet identifier.
	 * @apiParam {String} password			Wallet password.
	 * @apiParam {Number} amount			Amount to transfer.
	 * @apiParam {String} receiveAddress	Address that will receive the transaction. xPub-format.
	 */
	unsafeTransaction(req, res) {
		const identifier = req.query.identifier;
		const password = req.query.password;

		const receiveAddress = req.query.receiveAddress;
		const amountInBtc = req.query.amount;

		if (!identifier || !password || !receiveAddress || !amountInBtc) {
			console.error(req.query);
			res.status(400).end(`Need to supply identifier, password, amount > 0.0 and receive address.`);
			return;
		}

		const walletCredentials = { identifier, password };
		this.blockchainService.makeTransaction(walletCredentials, receiveAddress, amountInBtc)
			.then(result => res.json(result))
			.catch(error => {
				console.error('Payment error', error);
				res.status(500).json(error);
				res.end();
			});
	}


	/**
	 * @api {get} /confirmation Responds to blockchain callback. Always return "*ok*"
	 * 
	 * @apiSuccessExample {text} Success-Response: "*ok*"
	 */
	confirmation(req, res) {
		res.status(200).end('*ok*');
	}


	/**
	 * @api {get} /publickey Get public key used for encryption
	 * 
	 * @apiParam  {String} [format='pkcs1']	Format of public key, allowed types ['pkcs1', 'pkcs8'].
	 * 
	 * @apiSuccess  {String} key 	Public key in format.
	 * @apiSuccess  {String} format Format of returned key.
	 */
	publickey(req, res) {
		const allowedFormats = ['pkcs1', 'pkcs8'];
		let format = (typeof req.query.format === 'string' ? req.query.format : '').toLowerCase();

		if (allowedFormats.indexOf(format) === -1) {
			format = allowedFormats[0];
		}

		const key = this.bitcoinsCrypto.publicKey.exportKey(`${format}-public`);

		res.json({
			format,
			key
		});
		res.end();
	}


	/**
	 * @api {get} /encryptcredentials Encrypt wallet credentials with the servers public key.
	 * 
	 * @apiParam {String} identifier	Wallet identifier
	 * @apiParam {String} password		Wallet password
	 * @apiParam {String} tagId			Nfc tag id
	 *
	 * @apiSuccess {String} encryptedCredentials	Encrypted credentials.
	 */
	encryptcredentials(req, res) {
		const identifier = req.query.identifier;
		const password = req.query.password;
		const tagId = req.query.tagId;

		if (!identifier || !password || !tagId) {
			res.status(400).end('Insufficient parameters');
			return;
		}

		const encryptedCredentials = this.bitcoinsCrypto.encryptWalletCredentials({ identifier, password }, tagId);
		res.json({
			encryptedCredentials
		});
		res.end();
	}
};
