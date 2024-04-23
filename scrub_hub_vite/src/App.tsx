import { Component } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginPage from './components/Login';
import RegisterPage from './components/Register';
import DashboardPage from './components/Dashboard';
import HomePage from './components/Home';

class App extends Component {
  render() {
    return (
      <Router>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/" element={<HomePage />} />
        </Routes>
      </Router>
    );
  }
}

export default App;

//------------------------------Previous Implementation without Routing------------------------------------------------------------
// import React from "react";
// import Cookies from "universal-cookie";

// //instantiating Cookies class by creating cookies object
// const cookies = new Cookies();

// interface AppState {
// 	username: string;
// 	password: string;
// 	email: string;
// 	error: string;
// 	isAuthenticated: boolean;
//   }

// class App extends React.Component<{}, AppState> {
//   constructor(props: {}) {
//     super(props);

//     this.state = {
//       username: "",
//       password: "",
//       email: "",
//       error: "",
//       isAuthenticated: false,
//     };
//   }

//   componentDidMount = () => {
//     this.getSession();
//   }

// // Get Session Method
  // getSession = () => {
  //   //// Make a GET request to the api "/authenticate/session/" URL with "same-origin" credentials
  //   fetch("/authenticate/session/", {
  //     credentials: "same-origin",
  //   })
  //   .then((res) => res.json()) //// Parse the response as JSON
  //   .then((data) => {
  //     console.log(data); // Log the response data to the console

  //     //// If the response indicates the user is authenticated
  //     if (data.isAuthenticated) {
  //       this.setState({isAuthenticated: true}); 
  //     } else {  
	// 	// If the response indicates the user is not authenticated
  //       this.setState({isAuthenticated: false}); 
  //     }
  //   })
  //     //// Handle any errors that occurred during the fetch
  //   .catch((err) => {
  //     console.log(err);
  //   });
  // }
  
// //Display dashboard
//   dashboard = () => {
//     fetch("/authenticate/dashboard/", {
//       headers: {
//         "Content-Type": "application/json",
//       },
//       credentials: "same-origin",
//     })
//     .then((res) => res.json())
//     .then((data) => {
// 		//Modify to show User name on site instead of console
//       console.log("You are logged in as: " + data.username);
//     })
//     .catch((err) => {
//       console.log(err);
//     });
//   }

//   handleRegisterPasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
//     this.setState({password: event.target.value});
//   }

//   handleRegisterUserNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
//     this.setState({username: event.target.value});
//   }

//   handleLoginPasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
//     this.setState({password: event.target.value});
//   }

//   handleLoginUserNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
//     this.setState({username: event.target.value});
//   }

//   isResponseOk(response: Response) {
//     if (response.status >= 200 && response.status <= 299) {
//       return response.json();
//     } else {
//       throw Error(response.statusText);
//     }
//   }

//   //Login Method
//   login = (event: React.FormEvent<HTMLFormElement>) => {
//     event.preventDefault(); // Prevent the default form submission behavior

//      // Make a POST request to the "/authenticate/login/" URL with the form data
//     fetch("/authenticate/login/", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//         "X-CSRFToken": cookies.get("csrftoken"),
//       },
//       credentials: "same-origin",
//       body: JSON.stringify({username: this.state.username, password: this.state.password}),
//     })
//     .then(this.isResponseOk)
//     .then((data) => {
//       console.log(data);
//       this.setState({isAuthenticated: true, username: "", password: "", error: ""});
//     })
//     .catch((err) => {
//       console.log(err);
//       this.setState({error: "Wrong username or password."});
//     });
//   }

  // //Logout Method
  // logout = () => {
  //   fetch("/authenticate/logout", {
  //     credentials: "same-origin",
  //   })
  //   .then(this.isResponseOk)
  //   .then((data) => {
  //     console.log(data);
  //     this.setState({isAuthenticated: false});
  //   })
  //   .catch((err) => {
  //     console.log(err);
  //   });
  // };

//   //Register Method
//   register = (event: React.FormEvent<HTMLFormElement>) => {
//     event.preventDefault(); // Prevent the default form submission behavior
//     // Make a POST request to the "/api/register/" URL with the form data
//     fetch("/authenticate/register/", {
//         method: "POST",
//         headers: {
//             "Content-Type": "application/json",
//             "X-CSRFToken": cookies.get("csrftoken"),
//         },
//         credentials: "same-origin",
//         body: JSON.stringify({
//             username: this.state.username,
//             password: this.state.password,
//             email: this.state.email,  // assuming you're also collecting email
//         }),
//     })
//     .then(this.isResponseOk)
//     .then((data) => {
//         console.log(data);
//         this.setState({ isAuthenticated: false, username: "", password: "", email: "", error: "" });
//         alert('Registration successful. You can now log in.');
//     })
//     .catch((err) => {
//         console.log(err);
//         this.setState({error: "Registration failed. Username might be taken or missing information."});
//     });
// }

// handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
//     this.setState({ email: event.target.value });
// }

//   // UI Rendering
//   render() {
//     if (!this.state.isAuthenticated) {
//       return (
//         <div className="container mt-3">
//           <h1>React Cookie Auth</h1>
//           <br />
//           <h2>Login</h2>
//           <form onSubmit={this.login}>
//             <div className="form-group">
//               <label htmlFor="username">Username</label>
//               <input type="text" className="form-control" id="username" name="username" value={this.state.username} onChange={this.handleLoginUserNameChange} />
//             </div>
//             <div className="form-group">
//               <label htmlFor="username">Password</label>
//               <input type="password" className="form-control" id="password" name="password" value={this.state.password} onChange={this.handleLoginPasswordChange} />
//               <div>
//                 {this.state.error &&
//                   <small className="text-danger">
//                     {this.state.error}
//                   </small>
//                 }
//               </div>
//             </div>
//             <button type="submit" className="btn btn-primary">Login</button>
//           </form>

// 		  <h2>Register</h2>
// 			<form onSubmit={this.register}>
// 			<div className="form-group">
//               <label htmlFor="username">Username</label>
//               <input type="text" className="form-control" id="username" name="username" value={this.state.username} onChange={this.handleRegisterUserNameChange} />
//             </div>
// 			<div className="form-group">
//               <label htmlFor="username">Password</label>
//               <input type="password" className="form-control" id="password" name="password" value={this.state.password} onChange={this.handleRegisterPasswordChange} />
//               <div>
//                 {this.state.error &&
//                   <small className="text-danger">
//                     {this.state.error}
//                   </small>
//                 }
//               </div>
//             </div>
// 				<div className="form-group">
// 					<label htmlFor="email">Email</label>
// 					<input type="email" className="form-control" id="email" name="email" value={this.state.email} onChange={this.handleEmailChange} />
// 				</div>
// 				{/* Other registration fields */}
// 				<button type="submit" className="btn btn-primary">Register</button>
// 			</form>
//         </div>
//       );
//     }
//     return (
//       <div className="container mt-3">
//         <h1>React Cookie Auth</h1>
//         <p>You are logged in!</p>
//         <button className="btn btn-primary mr-2" onClick={this.dashboard}>Dashboard</button>
//         <button className="btn btn-danger" onClick={this.logout}>Log out</button>
//       </div>
//     )
//   }
// }

// export default App;