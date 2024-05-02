import React, { useState } from 'react';
import Cookies from 'universal-cookie';
import scrubHubLogo from "../assets/scrubHubLogo.png"
import scrubPeople from "../assets/scrubPeople.png"
import refresh from "../assets/refresh.png"

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
  const [captcha, setCaptcha] = useState(false);
  const [error, setError] = useState('');

  //Register the user via endpoint
  const handleRegister = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      if (!checkbox){
        setError("Please accept the terms and conditions")
        return;
      }
      const response = await fetch("/authenticate/register/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": cookies.get("csrftoken"),
        },
        credentials: "same-origin",
        body: JSON.stringify({ email, password, confirm_password, first_name, last_name, phone_number, employee_id, registration_code }),
      });

      const data = await response.json();
      console.log(data);

        if (data.detail === "User successfully registered") { // Can change in the API later on and match here
          alert('Registration successful. You can now log in.');
          window.location.href = `${location.protocol}//${location.host}/authenticate/login`;
        } else { //Better way to handle this error if unable to register?
          setError(data.detail || "Registration failed. Please check your information.");
        }
      
      } catch(error ) {
      console.error('Error:', error);
      setError("Registration failed. Please check your information and try again.");
    }
  };

  return (
    <div className="flex h-screen">
      <div className="flex-1">
        <img className= "w-full h-full object-cover" src={scrubPeople} alt="Scrub People" />
      </div>
      <div className="flex-1 flex-col">
        <div className="ml-10">
          <div>
            <img className="w-[200px] h-[200px] ms-auto" src={scrubHubLogo} alt="Scrub Hub Logo" />
          </div>
          <div className="-mt-8">
            <h2 className="font-fira-condensed font-bold text-[50px]">Registration</h2>
            <form className="grid grid-cols-1 gap-x-4 gap-y-4" onSubmit={handleRegister}>
              <div>
                <label htmlFor="first_name" className="block text-sm font-semibold text-gray-500">Name</label>
                <input id="email" type="text" name="first_name" value={first_name} onChange={e => setFirstName(e.target.value)} placeholder="First Name" required className="w-2/5 rounded-md border-0 py-2 pl-3 mr-16 shadow-sm ring-2 ring-inset ring-gray-400 focus:ring-1 focus:ring-inset focus:ring-indigo-600 leading-9 bg-[#F1F1F1] placeholder:text-gray-500 placeholder:font-semibold"/>
                <input type="text" name="last_name" value={last_name} onChange={e => setLastName(e.target.value)} placeholder="Last Name" required className="w-2/5 rounded-md border-0 py-2 pl-3 shadow-sm ring-2 ring-inset ring-gray-400 focus:ring-1 focus:ring-inset focus:ring-indigo-600 leading-9 bg-[#F1F1F1] placeholder:text-gray-500 placeholder:font-semibold"/>
              </div>
              <div>
              <label htmlFor="email" className="block text-sm font-semibold text-gray-500">Contact Info</label>
                <input id="email" type="email" name="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email Address" required className="w-2/5 rounded-md border-0 py-2 pl-3 mr-16 shadow-sm ring-2 ring-inset ring-gray-400 focus:ring-1 focus:ring-inset focus:ring-indigo-600 leading-9 bg-[#F1F1F1] placeholder:text-gray-500 placeholder:font-semibold"/>
                <input type="text" name="phone_number" value={phone_number} onChange={e => setPhoneNumber(e.target.value)} placeholder="Phone Number" required className="w-2/5 rounded-md border-0 py-2 pl-3 shadow-sm ring-2 ring-inset ring-gray-400 focus:ring-1 focus:ring-inset focus:ring-indigo-600 leading-9 bg-[#F1F1F1] placeholder:text-gray-500 placeholder:font-semibold"/>
              </div>
              <div>
              <label htmlFor="password" className="block text-sm font-semibold text-gray-500">Password</label>
                <input id="password" type="password" name="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" required className="w-2/5 rounded-md border-0 py-2 pl-3 mr-16 shadow-sm ring-2 ring-inset ring-gray-400 focus:ring-1 focus:ring-inset focus:ring-indigo-600 leading-9 bg-[#F1F1F1] placeholder:text-gray-500 placeholder:font-semibold"/>
                <input type="password" name="confirm_password" value={confirm_password} onChange={e => setConfirmPassword(e.target.value)} placeholder="Repeat Password" required className="w-2/5 rounded-md border-0 py-2 pl-3 shadow-sm ring-2 ring-inset ring-gray-400 focus:ring-1 focus:ring-inset focus:ring-indigo-600 leading-9 bg-[#F1F1F1] placeholder:text-gray-500 placeholder:font-semibold"/>
              </div>
              <div>
              <label htmlFor="employee_id" className="block text-sm font-semibold text-gray-500">Credentials</label>
                <input id="employee_id" type="text" name="employee_id" value={employee_id} onChange={e => setEmployeeId(e.target.value)} placeholder="Employee ID" required className="w-2/5 rounded-md border-0 py-2 pl-3 mr-16 shadow-sm ring-2 ring-inset ring-gray-400 focus:ring-1 focus:ring-inset focus:ring-indigo-600 leading-9 bg-[#F1F1F1] placeholder:text-gray-500 placeholder:font-semibold"/>
                <input type="text" name="registration_code" value={registration_code} onChange={e => setRegistrationCode(e.target.value)} placeholder="Registration Code" required className="w-2/5 rounded-md border-0 py-2 pl-3 shadow-sm ring-2 ring-inset ring-gray-400 focus:ring-1 focus:ring-inset focus:ring-indigo-600 leading-9 bg-[#F1F1F1] placeholder:text-gray-500 placeholder:font-semibold"/>
              </div>
              <div className="mt-2">
                <span className="text-sm font-semibold text-gray-500">As a spam prevention measure, complete the CAPTCHA below</span>
                <div className="border rounded bg-[#F7F7F7] border-gray-300 p-4 w-1/3 flex items-center justify-start">
                    <input
                      className="h-6 w-6 rounded mr-14"
                      type="checkbox"
                      checked={captcha}
                      onChange={(e) => setCaptcha(e.target.checked)}
                    />
                    <span className="flex-1 text-gray-500">I'm not a robot </span> 
                    <img className="h-5 w-5 cursor-pointer -translate-x-1" src={refresh} alt="refresh"/>
                </div>
              </div>
              <div className="flex items-center justify-start">
                <input
                  className="h-5 w-5 rounded accent-[#63C7B2]"
                  type="checkbox"
                  checked={checkbox}
                  onChange={(e) => setCheckBox(e.target.checked)}
                />
                <span className="pl-3">I agree with</span><span className="text-[#00AEB5] ml-1 cursor-pointer">Terms and Conditions</span>
              </div>
              <div className="pt-10 justify-center px-48 -translate-x-6">
                <button className="bg-[#63C7B2] hover:bg-[#63C7B2]/90 text-white w-full py-2 px-6 rounded-md font-bold" type="submit">Register</button>
                <div className='mt-2 w-full flex justify-start ml-2'>
                  <span className="text-gray-500">Already have an account? </span><a className="font-bold ml-1" href='/authenticate/login'>Sign in</a>
                </div>
                {error && <p className="text-red-500 ml-2">{error}</p>}
              </div>
            </form>
            
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
