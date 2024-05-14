import Cookies from 'universal-cookie';
import doctors from '../assets/doctors.png';
import email from '../assets/email.png';

const cookies = new Cookies();

type DashboardProps = {
first_name: string;
last_name: string;
}

const Dashboard = ({ first_name, last_name }: DashboardProps) => {

//Logout the user
const handleLogout = async () => {
	try
	{
	const response = await fetch('/authenticate/logout/', {
		method: 'POST',
		headers: {
		'Content-Type': 'application/json',
		'X-CSRFToken': cookies.get('csrftoken'),
		},
		credentials: 'same-origin',
	});
	if (response.ok) {
		window.location.href = `${location.protocol}//${location.host}/authenticate/login`;
	} else {
		throw new Error('Failed to logout');
	}
	}
	catch (error) {
	console.error('Error:', error);
	}
};

	return (
		<div className='absolute top-[100px] left-[105px] right-0 bottom-0'>
		<div className='w-full h-full flex bg-[#EEE]'>
			<div className='w-2/3 ml-5 mt-5'>
			<div className='inline-flex justify-end h-[220px] w-full pl-[70px] pr-[112px] rounded-[15px] bg-[#80CED7]'>
				<div className='flex-1 flex-col flex justify-center'>
				<div className='-translate-y-4'>
					<p className='text-[22px]'>Welcome Back!</p>
					<p className='text-[32px] text-white'>Dr. {first_name} {last_name}</p>
				</div>

				<div className='px-12'>
					<button className='bg-gray-100' onClick={handleLogout}>Logout</button>
				</div>

				</div>
				<div className='flex-1'>
				<img className='w-full h-full' src={doctors} alt='Doctors'/>
				</div>
			</div>
			<div className='flex h-1/3 mt-5'>
				<div className='w-1/2 bg-gray-200'>
				Recent Conversations
				</div>
				<div className='w-1/2 ml-5 bg-slate-300'>
				Email Status
				<img className='' src={email} alt='Email'/>
				</div>
			</div>
			<div className='h-1/3 mt-5 overflow-y-auto bg-orange-500'>
				Previous Patients
			</div>

			</div>
			<div className='w-1/4 mt-5 ml-5 bg-[#63C7B2] border rounded-tl-[15px]'>
			Calendar
			</div>
		</div>
		</div>
	);
};

{/* <div className=''>
	<div className='inline-flex h-[200px] pr-[112px] pl-[443px] justify-end items-center flex-shrink-0 rounded-[15px] bg-[#80CED7]'>
		<div className='flex-1 flex-col flex'>
		<p className='text-[24px]'>Welcome Back!</p>
		<p className='text-[32px] text-white'>Dr. {first_name} {last_name}</p>
		<button onClick={handleLogout}>Logout</button>
		</div>
		<div className='flex-1'>
		<img className='w-full h-full' src={doctors} alt='doctors'/>
		</div>
	</div>
	</div> */}

export default Dashboard;
