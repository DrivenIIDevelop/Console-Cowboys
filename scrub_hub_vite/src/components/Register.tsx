import React, { useState } from 'react';
import Cookies from 'universal-cookie';

const cookies = new Cookies();

const Register = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  // const [confirm_password, setConfirmPassword] = useState('');
  const [email, setEmail] = useState('');
  // const [firstName, setFirstName] = useState('');
  // const [lastName, setLastName] = useState('');
  // const [phoneNumber, setPhoneNumber] = useState('');
  // const [employeeId, setEmployeeId] = useState('');
  // const [registrationCode, setRegistrationCode] = useState('');
  const [error, setError] = useState('');

  //Register the user via endpoint
  const handleRegister = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    fetch("/authenticate/register/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": cookies.get("csrftoken"),
      },
      credentials: "same-origin",
      // body: JSON.stringify({ username, password, email, confirm_password, firstName, lastName, phoneNumber, employeeId, registrationCode }),

      body: JSON.stringify({ username, password, email }),
    })
    .then(response => response.json())
    .then(data => {
      console.log(data);
      if (data.detail === "User successfully registered") { // Can change in the API later on and match here
        alert('Registration successful. You can now log in.');
        window.location.href = `${location.protocol}//${location.host}/authenticate/login`;
      } else { //Better way to handle this error if unable to register?
        setError(data.detail || "Registration failed. Please check your information.");
      }
    })
    .catch(err => {
      console.error('Error:', err);
      setError("Registration failed. Please check your information and try again.");
    });
  };

  return (
    <div>
      <h2>Register</h2>
      <form onSubmit={handleRegister}>
        <input type="text" name="username" value={username} onChange={e => setUsername(e.target.value)} placeholder="Username" required />
        <input type="email" name="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" required />
        <input type="password" name="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" required />
        {/* <input type="password" name="confirm_password" value={confirm_password} onChange={e => setConfirmPassword(e.target.value)} placeholder="Confirm Password" required />

        <input type="text" name="firstName" value={firstName} onChange={e => setFirstName(e.target.value)} placeholder="First Name" required />
        <input type="text" name="lastName" value={lastName} onChange={e => setLastName(e.target.value)} placeholder="Last Name" required />
        <input type="text" name="phoneNumber" value={phoneNumber} onChange={e => setPhoneNumber(e.target.value)} placeholder="Phone Number" required />
        <input type="text" name="employeeId" value={employeeId} onChange={e => setEmployeeId(e.target.value)} placeholder="Employee ID" required />
        <input type="text" name="registrationCode" value={registrationCode} onChange={e => setRegistrationCode(e.target.value)} placeholder="Registration Code" required /> */}

        <button type="submit">Register</button>
        {error && <p>{error}</p>}
      </form>
      Already have an account?<a href='/authenticate/login'>Login Here</a>
    </div>
  );
};

export default Register;
