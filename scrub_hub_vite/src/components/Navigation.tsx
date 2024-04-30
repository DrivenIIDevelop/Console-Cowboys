import React, {useState} from 'react'
//import menu, home, mail, calendar, and logout icons
import { CiMenuBurger, CiHome, CiMail, CiCalendar, CiLogout, CiSearch } from "react-icons/ci"
//import add person icon
import { GoPersonAdd } from "react-icons/go"
// import chat icon
import { IoChatbubbleEllipsesOutline } from "react-icons/io5"
//still need tot import notification bell
//link to other components, if need to scroll
// import {Link} from 'react-scroll'

export default function Navigation() {
    const [nav, setNav] = useState(false)
    const handleClick = () => setNav(!nav)

    return (
        <div>
            {/* side navigation menu */}
            <div className='top-0 left-0 w-[100px] h-screen bg-[#63C7B2] flex flex-col items-center rounded-r-xl'>
                <ul>
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
                    <li className='pt-[280px] pb-[40px]'>
                        <CiLogout size={30} />
                    </li>
                </ul>
            </div>
        </div>
    )
}



