'use strict';

require('colors');

const blockchain = require('blockchain.info');
const BitcoinUtils = require('./utils/BitcoinUtils');
const LocalWalletService = require('./LocalWalletService');

const baseConfig = {
	callbackUrl: null,
	receiveApiCode: null,
	walletApiCode: null
};

module.exports = class BlockchainService {
	constructor(config) {
		this.config = Object.assign({}, baseConfig, config);

		if (!this.config.callbackUrl) {
			throw new Error('No callback url supplied to BlockchainService.');
		}

		if (!this.config.receiveApiCode) {
			throw new Error('No receive api code supplied to BlockchainService.');
		}

		if (!this.config.walletApiCode) {
			throw new Error('No wallet api code supplied to BlockchainService.');
		}

		this.setupWalletService();

		console.log(`Created BlockchainService payment service`.yellow);
	}

	setupWalletService() {
		this.walletService = new LocalWalletService({
			apiCode: this.config.walletApiCode
		});
	}

	makeTransaction(walletCredentials, xPubReceiveAddress, amount) {
		const amountInSatoshi = BitcoinUtils.btcToSatoshi(amount);
		const receiver = new blockchain.Receive(xPubReceiveAddress, this.config.callbackUrl, this.config.receiveApiCode);
		
		receiver.generate()
			.then(addressResponse => {
				const generatedAddress = addressResponse.address;
				return this.walletService.makePayment(walletCredentials, generatedAddress, amountInSatoshi);
			});
	}
};
