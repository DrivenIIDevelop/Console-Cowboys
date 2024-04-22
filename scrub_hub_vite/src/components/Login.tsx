import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Cookies from 'universal-cookie';

const cookies = new Cookies();

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

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
      body: JSON.stringify({ username, password }),
    })
    .then(response => {
		if (!response.ok) {
		  throw new Error('Failed to fetch user data');
		}
		return response.json();
	  })
    .then(data => {
      if (data.detail === "Succesfully logged in!") { //Can change later in API and match here
        navigate("/dashboard");
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
        <input type="text" name="username" value={username} onChange={e => setUsername(e.target.value)} placeholder="Username" required />
        <input type="password" name="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" required />
        <button type="submit">Login</button>
        {error && <p>{error}</p>}
      </form>
      <Link to="/register">Need an account? Register here.</Link>
    </div>
  );
};

export default LoginPage;
