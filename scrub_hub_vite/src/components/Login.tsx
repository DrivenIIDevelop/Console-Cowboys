import React, { useState } from 'react';
import Cookies from 'universal-cookie';

const cookies = new Cookies();

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  //Login the user
  const handleLogin = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    fetch("/authenticate/login/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": cookies.get("csrftoken"),
      },
      credentials: "same-origin",
      body: JSON.stringify({ email, password }),
    })
    .then(response => {
		if (!response.ok) {
      throw new Error('Failed to fetch user data');
		}
		return response.json();
  })
    .then(data => {
      if (data.detail === "Succesfully logged in!") { //Can change later in API and match here
        
        window.location.href = `${location.protocol}//${location.host}/authenticate/dashboard`;
      } else {
        setError("Login failed, please check your credentials.");
      }
    })
    .catch(err => {
      console.error('Error:', err);
      setError("An error occurred. Please try again later.");
    });
  };

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <input type="text" name="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" required />
        <input type="password" name="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" required />
        <button type="submit">Login</button>
        {error && <p>{error}</p>}
      </form>
      Need an account? <a href='/authenticate/register'>Register here.</a>
    </div>
  );
};

export default Login;
