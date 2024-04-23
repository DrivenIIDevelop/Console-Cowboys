// import React from "react";
import { Link } from "react-router-dom";

const Home = () => {

	return(
		<div>
			<h1>Welcome to My App</h1>
			<p>This is a brief introduction to your app.</p>
			<div>
				<h2>Get Started</h2>
				<p>Choose an option below:</p>
				<div>
				<Link to="/login">Login</Link>
				<span> or </span>
				<Link to="/register">Register</Link>
				</div>
			</div>
		</div>
	)
}

export default Home;