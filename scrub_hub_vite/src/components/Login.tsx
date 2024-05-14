import React, { useState } from 'react';
import Cookies from 'universal-cookie';
import scrubHubLogo from "../assets/scrubHubLogo.png"
import scrubPeople from "../assets/scrubPeople.png"

const cookies = new Cookies();

const Login = () => {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [error, setError] = useState('');
	const [checkbox, setCheckBox] = useState(false);
	//Login the user
	const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
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

			if (!response.ok) {
				throw new Error('Failed to fetch user data');
			}

			const data = await response.json();
			if (data.detail === "Succesfully logged in!") { //Can change later in API and match here

				window.location.href = `${location.protocol}//${location.host}/authenticate/dashboard`;
			} else {
				setError("Username or password did not match.");
			}
		}

		catch(error) {
			console.error('Error:', error);
			setError("Login failed, please check your credentials.");
		}
	};

	return (
		<div className="flex h-screen">
			<div className="flex-1">
				<img className= "w-full h-full object-cover" src={scrubPeople} alt="Scrub People" />
			</div>
			<div className="flex-1 justify-center flex-col">
				<div className="px-48 space-y-1">
					<div className="max-w-sm mx-auto justify-center mt-1">
						<img className="w-[250px] h-[250px] mx-auto" src={scrubHubLogo} alt="Scrub Hub Logo" />
					</div>
					<h2 className="font-fira-condensed font-bold text-[48px]">Login</h2>
					<div className="text-gray-500/75 font-semibold">Login your account in seconds</div>

					<form className="space-y-5" onSubmit={handleLogin}>
						<input type="email" name="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email Address" required className="block w-full rounded-md border-0 py-2 pl-3 shadow-sm ring-2 ring-inset ring-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 leading-9 bg-[#F1F1F1] placeholder:text-gray-500 placeholder:font-semibold"/>
						<input type="password" name="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" required className="block w-full rounded-md border-0 py-2 pl-3 shadow-sm ring-2 ring-inset ring-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 leading-9 bg-[#F1F1F1] placeholder:text-gray-500 placeholder:font-semibold"/>
						<div className="flex items-center justify-between mb-24 font-semibold">
							<label className="flex items-center">
								<input
									className="h-5 w-5 rounded accent-[#63C7B2]"
									type="checkbox"
									checked={checkbox}
									onChange={(e) => setCheckBox(e.target.checked)}
								/>
								<span className="pl-3 text-gray-500">Keep me logged in</span>
							</label>
							Forgot password?
						</div>
						<div className="pt-10">
							<button className="bg-[#63C7B2] hover:bg-[#63C7B2]/90 text-white w-full py-2 px-6 rounded-md font-bold" type="submit">Login</button>
							<span className="text-gray-500">Don't have an account? </span><a className="font-semibold" href='/authenticate/register'>Sign up</a>
							{error && <p className="text-red-500">{error}</p>}
						</div>
					</form>

				</div>
			</div>
		</div>
	);
};

export default Login;
