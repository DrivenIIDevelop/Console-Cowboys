import Cookies from 'universal-cookie';

const cookies = new Cookies();

type DashboardProps = {
  first_name: string
}

const Dashboard = ({ first_name }: DashboardProps) => {

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
    <div>
      <h2>Dashboard</h2>
        <div>
          <p>Welcome, {first_name}!</p>
          <button onClick={handleLogout}>Logout</button>
        </div>
    </div>
  );
};

export default Dashboard;
