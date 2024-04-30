import React, { useState } from 'react';
import Cookies from 'universal-cookie';
import scrubHubLogo from "../assets/scrubHubLogo.png"
import scrubPeople from "../assets/scrubPeople.png"

const cookies = new Cookies();

const Register = () => {
  const [password, setPassword] = useState('');
  const [confirm_password, setConfirmPassword] = useState('');
  const [email, setEmail] = useState('');
  const [first_name, setFirstName] = useState('');
  const [last_name, setLastName] = useState('');
  const [phone_number, setPhoneNumber] = useState('');
  const [employee_id, setEmployeeId] = useState('');
  const [registration_code, setRegistrationCode] = useState('');
  const [checkbox, setCheckBox] = useState(false);
  const [error, setError] = useState('');

  //Register the user via endpoint
  const handleRegister = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!checkbox){
      setError("Please accept the terms and conditions")
      return;
    }
    fetch("/authenticate/register/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": cookies.get("csrftoken"),
      },
      credentials: "same-origin",
      body: JSON.stringify({ email, password, confirm_password, first_name, last_name, phone_number, employee_id, registration_code }),
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
    <div className="flex h-screen">
      <div className="flex-1">
        <img className= "w-full h-full object-cover" src={scrubPeople} alt="Scrub People" />
      </div>
      <div className="flex-1 flex flex-col">
        <div className="ml-8">
          <div className="max-w-sm mx-auto justify-center mt-4">
            <img className="w-[200px] h-[200px]" src={scrubHubLogo} alt="Scrub Hub Logo" />
          </div>
          <h2 className="font-fira-condensed font-bold text-[48px]">Registration</h2>
          <form onSubmit={handleRegister}>
            <input type="email" name="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email Address" required />
            <input type="password" name="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" required />
            <input type="password" name="confirm_password" value={confirm_password} onChange={e => setConfirmPassword(e.target.value)} placeholder="Repeat Password" required />

            <input type="text" name="first_name" value={first_name} onChange={e => setFirstName(e.target.value)} placeholder="First Name" required />
            <input type="text" name="last_name" value={last_name} onChange={e => setLastName(e.target.value)} placeholder="Last Name" required />
            <input type="text" name="phone_number" value={phone_number} onChange={e => setPhoneNumber(e.target.value)} placeholder="Phone Number" required />
            <input type="text" name="employee_id" value={employee_id} onChange={e => setEmployeeId(e.target.value)} placeholder="Employee ID" required />
            <input type="text" name="registration_code" value={registration_code} onChange={e => setRegistrationCode(e.target.value)} placeholder="Registration Code" required />
            <div>
              <label>
                <input
                  type="checkbox"
                  checked={checkbox}
                  onChange={(e) => setCheckBox(e.target.checked)}
                />
                I agree with <span className="text-[#00AEB5]">Terms and Conditions</span>
              </label>
            </div>
            <button className="bg-[#63C7B2] text-white py-2 px-6 rounded-md mr-8 font-bold" type="submit">Register</button>
            {error && <p>{error}</p>}
          </form>
          Already have an account? <a className="font-bold" href='/authenticate/login'>Sign in</a>
        </div>
      </div>
    </div>
  );
};

export default Register;
