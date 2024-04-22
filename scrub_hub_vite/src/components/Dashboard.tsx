import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'universal-cookie';

const cookies = new Cookies();

const Dashboard = () => {
  const [userData, setUserData] = useState<any>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const navigate = useNavigate();

  useEffect(() => {
    getSession();
  }, []);

  //Check for user session via endpoint
  const getSession = () => {
    fetch("/authenticate/session/", {
      credentials: "same-origin",
    })
    .then((res) => res.json())
    .then((data) => {
      if (data.isAuthenticated) {
        setIsAuthenticated(true);
        fetchUserData(); // Fetch user data if authenticated
      } else {
        setIsAuthenticated(false);
        navigate('/login'); // Redirect to login page if not authenticated
      }
    })
    .catch((err) => {
      console.error('Error:', err);
    });
  };

  //Get user data and display on dashboard
  const fetchUserData = () => {
    fetch("/authenticate/dashboard/", {
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": cookies.get("csrftoken"),
      },
      credentials: "same-origin",
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Failed to fetch user data');
      }
      return response.json();
    })
    .then(data => {
      setUserData(data);
    })
    .catch(err => {
      console.error('Error:', err);
      navigate('/login');
    });
  };

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
        setIsAuthenticated(false);
        navigate("/login");
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
      {isAuthenticated ? (
        <div>
          <p>Welcome, {userData && userData.username}!</p>
          <button onClick={handleLogout}>Logout</button>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default Dashboard;

//---------------------------Previous Implementation---------------
// import { useEffect, useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import Cookies from 'universal-cookie';

// const cookies = new Cookies();

// interface DashboardProps {
// 	isAuthenticated: boolean;
// 	updateAuthStatus: (status: boolean) => void;
//   }

// const Dashboard = (props: DashboardProps) => {
//   const [userData, setUserData] = useState<any>(null); // You can replace 'any' with a more specific type
//   const [error, setError] = useState('');
//   const navigate = useNavigate();

//   useEffect(() => {
//     // Fetch user data when the component mounts
//     fetchUserData();
//   }, []);

//   const fetchUserData = () => {
//     fetch("/authenticate/dashboard/", {
//       headers: {
//         "Content-Type": "application/json",
//         "X-CSRFToken": cookies.get("csrftoken"),
//       },
//       credentials: "same-origin",
//     })
//     .then(response => {
//       if (!response.ok) {
//         throw new Error('Failed to fetch user data');
//       }
//       return response.json();
//     })
//     .then(data => {
//       setUserData(data);
//     })
//     .catch(err => {
//       console.error('Error:', err);
//       // Redirect to login page if there's an error or user data cannot be fetched
//       navigate('/login');
//     });
//   };

//     //Logout Method
// 	const handleLogout = () => {
// 		fetch("/authenticate/logout/", {
// 		  method: "POST",
// 		  headers: {
// 			"Content-Type": "application/json",
// 			"X-CSRFToken": cookies.get("csrftoken"), // Include the CSRF token in the request headers
// 		  },
// 		  credentials: "same-origin",
// 		})
// 		.then(response => {
// 		  if (response.ok) {
// 			return response.json();
// 		  } else {
// 			throw new Error('Failed to logout');
// 		  }
// 		})
// 		.then(data => {
// 		  console.log(data);
// 		  props.updateAuthStatus(false);
// 		  navigate("/login"); // Redirect to login page after successful logout
// 		})
// 		.catch(err => {
// 		  console.error('Error:', err);
// 		  setError("An error occurred. Please try again later.");
// 		});
// 	  };

//   return (
//     <div>
//       <h2>Dashboard</h2>
//       {userData ? (
//         <div>
//           <p>Welcome, {userData.username}!</p>
//           {/* Display additional user information here */}
// 		  <button onClick={handleLogout}>Logout</button>
//       		{error && <p>{error}</p>}
//         </div>
//       ) : (
//         <p>Loading...</p>
//       )}
//     </div>
//   );
// };

// export default Dashboard;
