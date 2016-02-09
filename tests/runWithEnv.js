'use strict';

const fork = require('child_process').fork;
const path = require('path');

const env = {
	CRYPT_PUBLIC_KEY: '',
	CRYPT_PRIVATE_KEY: '',
	CALLBACK_URL: '',
	RECEIVE_API_CODE: '',
	WALLET_API_CODE: ''
};

const scriptSrc = path.join(__dirname, '../app.js');
fork(scriptSrc, [], { env });
