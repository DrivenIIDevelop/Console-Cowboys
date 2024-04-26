import scrubHubLogo from "../assets/scrubHubLogo.png"
import scrubPeople from "../assets/scrubPeople.png"

const Home = () => {
	return(
		<div style={{ display: "flex", justifyContent: "space-between" }}>
			<div style={{ flex: 1 }}>
				<img src={scrubHubLogo} alt="Scrub Hub Logo" />
				<h2>Streamline Communication and Collaboration for Medical Practitioners</h2>
				<div>
				<p>
					Join our platform and experience seamless communication and collaboration among medical professionals.
				</p>
				<button style={{ marginRight: '10px' }} onClick={() => window.location.href = '/authenticate/login'}>Login</button>
				<button onClick={() => window.location.href = '/authenticate/register'}>Register</button>
				</div>
			</div>
			<div style={{ flex: 1 }}>
				<img src={scrubPeople} alt="Scrub People" />
			</div>
		</div>
	)
}

export default Home;