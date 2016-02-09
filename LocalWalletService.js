'use strict';

const spawn = require('cross-spawn-async');

class LocalWalletService {
	constructor() {
		this.process = spawn('blockchain-wallet-service', ['start']);
	}
}

if (require.main === module) {
	new LocalWalletService();
}

module.exports = LocalWalletService;
