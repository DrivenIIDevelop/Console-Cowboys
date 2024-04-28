import scrubHubLogo from "../assets/scrubHubLogo.png"
import scrubPeople from "../assets/scrubPeople.png"
import "../index.css"

const Home = () => {
	return(
		<div className="flex justify-between">
			<div className="ml-16">
				<img className="justify-center" src={scrubHubLogo} alt="Scrub Hub Logo" />
				<h2 className="font-fira-condensed font-bold text-[48px]">Streamline <br></br>Communication and<br></br> Collaboration for <br></br>Medical Practitioners</h2>
				<div>
				<p className="font-fira-condensed text-[26px] mt-5 mb-5">
					Join our platform and experience seamless<br></br> communication and collaboration among medical<br></br> professionals.
				</p>
				<button className=" mr-10" onClick={() => window.location.href = '/authenticate/login'}>Login</button>
				<button onClick={() => window.location.href = '/authenticate/register'}>Register</button>
				</div>
			</div>
			<div>
				<img className= "" src={scrubPeople} alt="Scrub People" />
			</div>
		</div>
	)
}

export default Home;