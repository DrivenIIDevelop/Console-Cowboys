import Cookies from 'universal-cookie';
import { createContext } from "react";
import { toBase64 } from './base64';
import { decryptPrivateKey, generateKeys, getCurrentPrivateKey } from './encryption';
import { Anything, ErrorResult } from './models/types';

const cookies = new Cookies();

type LoggedInUser = {
	firstName: string,
	lastName: string,
	id: number,
	privateKey: Promise<CryptoKey>,
}
function isLoggedInUser(obj: Anything): obj is LoggedInUser { // TODO: TEST NEW CHANGES WITH TYPE GUARDS
	return !!(
		obj &&
		typeof obj.firstName === 'string' &&
		typeof obj.lastName === 'string' &&
		typeof obj.id === 'number' &&
		obj.privateKey instanceof Promise
	);
}

export enum LoginState { IN, OUT, UNKNOWN }
export type LoginInfo = {
	loggedIn: LoginState,
	user?: LoggedInUser,
}
export function GetUserInfo(): LoginInfo {
	const loggedInId = localStorage.getItem('userId');
	if (loggedInId) {
		if (loggedInId === '-1') {
			return { loggedIn: LoginState.OUT };
		}
		return {
			loggedIn: LoginState.IN,
			user: {
				// TODO: If this info isn't in localStorage, something weird happened. Force log out the user?
				firstName: localStorage.getItem('firstName') ?? '???',
				lastName: localStorage.getItem('lastName') ?? '???',
				id: parseInt(loggedInId),
				privateKey: getCurrentPrivateKey(),
			}
		}
	} else {
		return { loggedIn: LoginState.UNKNOWN };
	}
}
export async function PutInfoInLocalStorage(loginInfo: LoginInfo) {
	if (loginInfo.loggedIn === LoginState.IN && loginInfo.user) {
		localStorage.setItem('userId', loginInfo.user.id.toString());
		localStorage.setItem('firstName', loginInfo.user.firstName);
		localStorage.setItem('lastName', loginInfo.user.lastName);
		// It's probably not a good idea to store a private key like this on a shared device.
		// TODO: Find something better.
		const exported = await crypto.subtle.exportKey("pkcs8", await loginInfo.user.privateKey);
		localStorage.setItem('key', toBase64(exported));

	} else if (loginInfo.loggedIn === LoginState.OUT) {
		localStorage.setItem('userId', '-1');
		localStorage.removeItem('firstName');
		localStorage.removeItem('lastName');
		localStorage.removeItem('key');
	}
}

export async function LogOut() {
	try {
		const response = await fetch('/authenticate/logout/', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'X-CSRFToken': cookies.get('csrftoken'),
			},
			credentials: 'same-origin',
		});
		if (response.ok) {
			PutInfoInLocalStorage({loggedIn: LoginState.OUT});
			window.location.href = `${location.protocol}//${location.host}/authenticate/login`;
		} else {
			// TODO: Something nicer?
			throw new Error('Failed to logout');
		}
	}
	catch (error) {
		console.error('Error:', error);
	}
}

export async function LogIn(email: string, password: string): Promise<ErrorResult | { success: boolean }>  {
	try {
		const response = await fetch("/authenticate/login/", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				"X-CSRFToken": cookies.get("csrftoken"),
			},
			credentials: "same-origin",
			body: JSON.stringify({ email, password }),
		});

		if (!response.ok)
			return { error: 'Failed to fetch user data' };

		const data = await response.json();
		if (data.privateKey === null) {
			// Create one. (We might get null if the user registerd before keys were used.)
			const keys = await generateKeys(password);
			const postData = new FormData();
			postData.append('public_key', new Blob([keys.public]));
			postData.append('private_key', keys.private);
			const newKeyResponse = await fetch("/authenticate/set-keys/", {
				method: "POST",
				headers: { "X-CSRFToken": cookies.get("csrftoken") },
				credentials: "same-origin",
				body: postData,
			});
			if (!newKeyResponse.ok)
				return { error: 'An error ocurred. Please try again.' };
			data.privateKey = keys.private;
		}
		if (typeof data.privateKey === 'string') {
			// Decrypt and convert to (promise for) CryptoKey object.
			data.privateKey = decryptPrivateKey(data.privateKey as string, password);
		}
		// Last, validate we have the expected data.
		if (isLoggedInUser(data)) {
			await PutInfoInLocalStorage({
				user: data,
				loggedIn: LoginState.IN,
			});
			return { success: true };
		} else
			return { error: data.detail ?? 'An error ocurred. Please try again.' };
	}
	catch (error) {
		console.error('Error:', error);
		return { error: 'Login failed, please check your credentials.' };
	}
}

/**
 * If the user is logged in, returns the LoggedInUser object from the given LoginInfo.
 * Throw an exception and redirecto to login page if the user is not logged in.
 *
 * Note that although login-protected pages should be unavailable to users who aren't logged in,
 * a user being logged in does not strictly imply that a LoggedInUser object is available.
 * This is because the information is populated from localStorage. Thus, login-protected pages
 * should use this function instead of assuming that info.user is not undefined.
 */
export function EnsureLoggedIn(info: LoginInfo): LoggedInUser {
	if (!info.user || info.loggedIn !== LoginState.IN) {
		window.location.href = `${location.protocol}//${location.host}/authenticate/login`;
		throw 'Not logged in';
	}
	return info.user;
}

export const LoginContext = createContext<LoginInfo>({ loggedIn: LoginState.UNKNOWN });
