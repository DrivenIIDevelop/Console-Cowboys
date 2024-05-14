import Cookies from 'universal-cookie';
import { createContext } from "react";

const cookies = new Cookies();

type LoggedInUser = {
	firstName: string,
	lastName: string,
	id: number,
}
export function isLoggedInUser(obj?: {[key: string]: unknown}): obj is LoggedInUser {
	return !!(
		obj &&
		typeof obj.firstName === 'string' &&
		typeof obj.lastName === 'string' &&
		typeof obj.id === 'number'
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
			}
		}
	} else {
		return { loggedIn: LoginState.UNKNOWN };
	}
}
export function PutInfoInLocalStorage(loginInfo: LoginInfo) {
	if (loginInfo.loggedIn === LoginState.IN && loginInfo.user) {
		localStorage.setItem('userId', loginInfo.user.id.toString());
		localStorage.setItem('firstName', loginInfo.user.firstName);
		localStorage.setItem('lastName', loginInfo.user.lastName);
	} else if (loginInfo.loggedIn === LoginState.OUT) {
		localStorage.setItem('userId', '-1');
		localStorage.removeItem('firstName');
		localStorage.removeItem('lastName');
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

export const LoginContext = createContext<LoginInfo>({ loggedIn: LoginState.UNKNOWN });
