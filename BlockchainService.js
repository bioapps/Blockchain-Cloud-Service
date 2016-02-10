'use strict';

require('colors');

const blockchain = require('blockchain.info');
const BitcoinUtils = require('biopay-bitcoins-lib').BitcoinUtils;
const LocalWalletService = require('local-wallet-service');

const baseConfig = {
	callbackUrl: null,
	confirmationEndpoint: '',
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

	makeTransaction(walletCredentials, xPubReceiveAddress, amountInBtc) {
		const amountInSatoshi = BitcoinUtils.btcToSatoshi(amountInBtc);
		const receiver = new blockchain.Receive(xPubReceiveAddress, this.config.callbackUrl + this.config.confirmationEndpoint, this.config.receiveApiCode);
		
		return receiver.generate()
			.then(addressResponse => {
				const generatedAddress = addressResponse.address;
				return this.walletService.makePayment(walletCredentials, generatedAddress, amountInSatoshi);
			});
	}
};
