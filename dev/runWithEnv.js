'use strict';

const fork = require('child_process').fork;
const path = require('path');

const env = {
	CRYPT_PUBLIC_KEY: '-----BEGIN PUBLIC KEY-----\nMFwwDQYJKoZIhvcNAQEBBQADSwAwSAJBALAuAVkF+BpQtsivA/Cdwn64xEDQxuHB\n6zdB5/EVT4B2zeqZu4XO3zX+Ua2M641hGjqG0pcuovraVJLrFu0MFLMCAwEAAQ==\n-----END PUBLIC KEY-----',
	CRYPT_PRIVATE_KEY: '-----BEGIN RSA PRIVATE KEY-----\nMIIBOgIBAAJBALAuAVkF+BpQtsivA/Cdwn64xEDQxuHB6zdB5/EVT4B2zeqZu4XO\n3zX+Ua2M641hGjqG0pcuovraVJLrFu0MFLMCAwEAAQJAe5/cnD4/CSAoEowUpKve\nxZMbSyv00oeDaOPbQGUmw0nve7F44sMiBVR5I95meurAwaCIiWNXYGZwvxp/55W6\nAQIhAOSYCHtZvYzA1vQZoZiLV1KmoJ1v6m7SjDD4tbdILJcBAiEAxU1I5VfT/nUv\nNkvwCCTc3OycKa+s/R65zjiy/9P1f7MCIQCeLm5AHRtDWPXluA7QZiuo79DY4ObS\nhTOpd5EXIQRqAQIgAi03F6ifYxhB3BR8YmqdsSY/FsqkWuqC3D6N4vqgo7cCID3R\nF5pQiWKAW+abSTxhsChJPNVVZbIX1VR7zyY0kAAK\n-----END RSA PRIVATE KEY-----',
	CALLBACK_URL: 'http://google.com',
	RECEIVE_API_CODE: 'dce008a8-ebf3-42d3-a5bc-9ccc978dc794',
	WALLET_API_CODE: 'd8c625ee-bba7-4c20-9e17-49bb0860105d',
	PORT: 9000
};

const scriptSrc = path.join(__dirname, '../app.js');
fork(scriptSrc, [], { env });
