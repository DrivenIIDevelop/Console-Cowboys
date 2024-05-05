import Cookies from 'universal-cookie';
import doctors from "../assets/doctors.png";

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
      const response = await fetch("/authenticate/logout/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": cookies.get("csrftoken"),
        },
        credentials: "same-origin",
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
    <div className="">
      <div className="flex justify-center border-width-[15px] rounded-lg bg-[#80CED7] px-10 py-10">
        <div className="flex-1 flex-col flex">
          <p className="text-[24px]">Welcome Back!</p>
          <p className="text-[32px] text-white">Dr. {first_name} {last_name}</p>
          <button onClick={handleLogout}>Logout</button>
        </div>
        <div className="flex-1">
          <img className="w-full h-full" src={doctors} alt="doctors"/>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
