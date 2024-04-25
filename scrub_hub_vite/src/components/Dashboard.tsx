import Cookies from 'universal-cookie';

const cookies = new Cookies();

type DashboardProps = {
  username: string
}

const Dashboard = ({ username }: DashboardProps) => {

  //Logout the user
  const handleLogout = () => {
    fetch("/authenticate/logout/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": cookies.get("csrftoken"),
      },
      credentials: "same-origin",
    })
    .then(response => {
      if (response.ok) {
        // setIsAuthenticated(false);
        window.location.href = `${location.protocol}//${location.host}/authenticate/login`;
      } else {
        throw new Error('Failed to logout');
      }
    })
    .catch(err => {
      console.error('Error:', err);
    });
  };

  return (
    <div>
      <h2>Dashboard</h2>
        <div>
          <p>Welcome, {username}!</p>
          <button onClick={handleLogout}>Logout</button>
        </div>
    </div>
  );
};

export default Dashboard;

// const [userData, setUserData] = useState<any>(null);
  // const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  // const navigate = useNavigate();

  // useEffect(() => {
  //   getSession();
  // }, []);

  // //Check for user session via endpoint
  // const getSession = () => {
  //   fetch("/authenticate/session/", {
  //     credentials: "same-origin",
  //   })
  //   .then((res) => res.json())
  //   .then((data) => {
  //     if (data.isAuthenticated) {
  //       setIsAuthenticated(true);
  //       fetchUserData(); // Fetch user data if authenticated
  //     } else {
  //       setIsAuthenticated(false);
  //       // navigate('/login'); // Redirect to login page if not authenticated
  //     }
  //   })
  //   .catch((err) => {
  //     console.error('Error:', err);
  //   });
  // };

  // //Get user data and display on dashboard
  // const fetchUserData = () => {
  //   fetch("/authenticate/dashboard/", {
  //     headers: {
  //       "Content-Type": "application/json",
  //       "X-CSRFToken": cookies.get("csrftoken"),
  //     },
  //     credentials: "same-origin",
  //   })
  //   .then(response => {
  //     if (!response.ok) {
  //       throw new Error('Failed to fetch user data');
  //     }
  //     return response.json();
  //   })
  //   .then(data => {
  //     setUserData(data); //User data for display
  //   })
  //   .catch(err => {
  //     console.error('Error:', err);
  //     // navigate('/login');
  //   });
  // };