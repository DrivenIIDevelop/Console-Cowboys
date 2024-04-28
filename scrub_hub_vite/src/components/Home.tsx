import scrubHubLogo from "../assets/scrubHubLogo.png"
import scrubPeople from "../assets/scrubPeople.png"
import "../index.css"

const Home = () => {
	return(
		<div className="flex justify-between columns-2">
			<div>
				<img src={scrubHubLogo} alt="Scrub Hub Logo" />
				<h2>Streamline Communication and Collaboration for Medical Practitioners</h2>
				<div>
				<p className="text-red-500">
					Join our platform and experience seamless communication and collaboration among medical professionals.
				</p>
				<button style={{ marginRight: '10px' }} onClick={() => window.location.href = '/authenticate/login'}>Login</button>
				<button onClick={() => window.location.href = '/authenticate/register'}>Register</button>
				</div>
			</div>
			<div>
				<img src={scrubPeople} alt="Scrub People" />
			</div>
		</div>
	)
}

export default Home;