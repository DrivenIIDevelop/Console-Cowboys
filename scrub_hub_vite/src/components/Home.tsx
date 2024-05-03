import scrubHubLogo from "../assets/scrubHubLogo.png"
import scrubPeople from "../assets/scrubPeople.png"
// import "../index.css"

const Home = () => {
	return(
		<div className="flex h-screen">
			<div className="flex-1 flex flex-col">
				<div className="max-w-sm mx-auto justify-center mt-10">
					<img className="w-[260px] h-[260px]" src={scrubHubLogo} alt="Scrub Hub Logo" />
				</div>
				<div className="ml-[110px]">
					<h2 className="font-fira-condensed font-bold text-[48px]">Streamline <br></br>Communication And<br></br> Collaboration For <br></br>Medical Practitioners</h2>
					<div>
					<p className="font-fira-condensed text-[26px] mt-5 mb-8">
						Join our platform and experience seamless<br></br> communication and collaboration among medical<br></br> professionals.
					</p>
					<button className="bg-[#00AEB5] text-white py-2 px-6 rounded-md mr-8 font-bold" onClick={() => window.location.href = '/authenticate/login'}>Login</button>
					<button className="bg-[#D8D8D9] text-black py-2  px-6 rounded-md font-bold" onClick={() => window.location.href = '/authenticate/register'}>Register</button>
					</div>
				</div>
			</div>
			<div className="flex-1">
				<img className= "w-full h-full object-cover" src={scrubPeople} alt="Scrub People" />
			</div>
		</div>
	)
}

export default Home;