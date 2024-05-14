// import {useState} from 'react'
//import menu, home, mail, calendar, and logout icons
import { CiMenuBurger, CiHome, CiMail, CiCalendar, CiLogout, CiSearch } from "react-icons/ci"
import { GoPersonAdd } from "react-icons/go"
import { IoChatbubbleEllipsesOutline } from "react-icons/io5"

//link to other components, if need to scroll
// import {Link} from 'react-scroll'
import scrubHubLogo from "../assets/scrubHubLogoMenu.png";
import notification from "../assets/notification.png";
import profilePic from "../assets/profilePic.png";
import { useContext } from "react";
import { LogOut, LoginContext, LoginState } from "../loginInfo";

export default function Navigation() {
	const loginInfo = useContext(LoginContext);
	if (!loginInfo.user || loginInfo.loggedIn !== LoginState.IN) {
		// This shouldn't ever happen. Django would redirect us first.
		window.location.href = `${location.protocol}//${location.host}/authenticate/login`;
		throw 'Not logged in';
	}

	return (
		<div className="relative h-screen">
			{/* side navigation menu */}
			<div className='absolute top-0 left-0 w-[105px] h-full bg-[#63C7B2] flex flex-col items-center rounded-r-xl z-10'>
				<ul className="h-full flex flex-col justify-between">
					<li className='pt-[30px] pb-[200px]'>
						<CiMenuBurger size={30}/>
					</li>
					<li className=''>
						<CiHome size={30} />
					</li>
					<li className='pt-[40px]'>
						<CiMail size={30} />
					</li>
					<li className='pt-[40px]'>
						<CiCalendar size={30} />
					</li>
					<li className='pt-[40px]'>
						<GoPersonAdd size={30} />
					</li>
					<li className='pt-[40px]'>
						<IoChatbubbleEllipsesOutline size={30} />
					</li>
					<li className='pt-[280px] pb-[40px] cursor-pointer'>
						<CiLogout size={30} onClick={LogOut} />
					</li>
				</ul>
			</div>
			<div className="absolute top-0 w-screen h-[100px] pl-[105px] bg-white flex items-center px-4 shadow-sm z-9">
				<div className="flex-1 pl-4">
					<img src={scrubHubLogo}/>
				</div>
				<div className="flex-1 inline-flex relative -translate-x-14 px-4">
					<input type="text" className="w-3/5 p-3 border rounded " placeholder="Search..." />
					<CiSearch className='absolute top-0 left-96 mt-3 ml-14 cursor-pointer' size={27}/>
					<div className="ml-16 mt-2">
						<img className="w-[32px] h-[32px]" src={notification}/>
					</div>
					<div className="ml-16 flex items-center">
						<div className="border-2 border-[#63C7B2] rounded-[15px] overflow-hidden flex items-center py-2 px-2">
							<img className="w-[32px] h-[32px] object-cover" src={profilePic} alt="Profile"/>
							<div className="px-2 text-[16px]">Dr. {loginInfo.user.firstName} {loginInfo.user.lastName}</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}



