import OpenCrypto from 'opencrypto'

const encoder = new TextEncoder();
const salt = encoder.encode('ppkpdsaltscrubhub');

const rsaParams: RsaHashedKeyGenParams = {
	name: 'RSA-OAEP',
	hash: 'SHA-256',
	modulusLength: 4096,
	publicExponent: new Uint8Array([0x01, 0x00, 0x01]),
}
const aesKeyParams: AesKeyAlgorithm = {
	name: 'AES-GCM',
	length: 256,
}

/**
 * Generates a RSA key pair, and uses the given password to encrypt the private key.
 */
export async function generateKeys(password: string) {
	// can't be used to encrypt, only derive
	const pair = await crypto.subtle.generateKey(rsaParams, true, ['encrypt', 'decrypt']);
	const publicKey = crypto.subtle.exportKey('spki', pair.publicKey);

	// I was unable to use wrapKey to encrypt the private key.
	// While investigating why, I found this library that does the job.
	const oc = new OpenCrypto();
	const privateKey: Promise<string> = oc.encryptPrivateKey(pair.privateKey, password + salt, 100000, 'SHA-256', 'AES-GCM', 256);

	return {
		public: await publicKey,
		private: await privateKey,
	}
}

export async function decryptPrivateKey(key: string, password: string): Promise<CryptoKey> {
	const oc = new OpenCrypto();
	return await oc.decryptPrivateKey(key, password + salt, {
		name: 'RSA-OAEP',
		hash: 'SHA-256',
		usages: ['decrypt', 'unwrapKey'],
		isExtractable: true
	});
}

export async function generateConversationKey() {
	const key = await crypto.subtle.generateKey(aesKeyParams, true, ['encrypt', 'decrypt']);
	return await crypto.subtle.exportKey('raw', key);
}
