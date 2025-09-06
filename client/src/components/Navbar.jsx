// import React, { useEffect, useState } from "react";
// import { Link, useLocation, useNavigate } from "react-router-dom";
// import { FaGlobeAmericas } from "react-icons/fa";

// // Navbar componet handle the navbar and authentication state
// const Navbar = () => {
//   const [isAuthenticated, setIsAuthenticated] = useState(false); 
//   const location = useLocation(); 
//   const navigate = useNavigate();

//   useEffect(() => {
//     const token = localStorage.getItem("token");
//     const userData = JSON.parse(localStorage.getItem("user"));

//     if (token && userData) {
//       setIsAuthenticated(true);
//     } else {
//       setIsAuthenticated(false);
//     }
//   }, [location.pathname]);

//   const handleLogout = () => {
//     localStorage.removeItem("token");
//     localStorage.removeItem("user");
//     setIsAuthenticated(false);
//     navigate("/login");
//   };

//   const currentPath = location.pathname;
//   const isHomePage = currentPath === "/";
//   const isLoginPage = currentPath === "/login";
//   const isRegisterPage = currentPath === "/register";
//   const isTripDisplayPage = currentPath.startsWith("/trip-display");

//   return (
//     <nav className="sticky top-0 z-50 flex items-center justify-between px-8 py-4 bg-white/20 backdrop-blur-lg shadow-md border-b border-white/30 rounded-b-xl">
//       <div className="flex items-center gap-2 text-2xl font-bold text-red-500">
//         <FaGlobeAmericas className="text-3xl text-blue-600" />
//         <span className="tracking-wide">PocketTrip</span>
//       </div>

//       <div className="flex items-center space-x-4">
//         {/* Show Chat button on /trip-display/:id if authenticated */}
//         {isTripDisplayPage && isAuthenticated && (
//           <Link to="/chat">
//             <button className="px-4 py-2 text-white bg-red-500 rounded-md hover:bg-red-600">
//               Chat
//             </button>
//           </Link>
//         )}

//         {/* Show Sign In if NOT authenticated and on home or trip-display */}
//         {!isAuthenticated &&
//           (isHomePage || isTripDisplayPage) &&
//           !isLoginPage &&
//           !isRegisterPage && (
//             <Link to="/login">
//               <button className="px-4 py-2 text-white bg-red-500 rounded-md hover:bg-red-600">
//                 Sign In
//               </button>
//             </Link>
//           )}

//         {/* Show Logout only on homepage when authenticated */}
//         {isAuthenticated && isHomePage && (
//           <button
//             onClick={handleLogout}
//             className="px-4 py-2 text-white bg-red-500 rounded-md hover:bg-red-600"
//           >
//             Logout
//           </button>
//         )}
//       </div>
//     </nav>
//   );
// };

// export default Navbar;

import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FaGlobeAmericas } from "react-icons/fa";
import { LogIn, LogOut } from "lucide-react"; 

const Navbar = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsAuthenticated(!!token); 
  }, [location.pathname]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsAuthenticated(false);
    navigate("/login");
  };

  const currentPath = location.pathname;
  const isHomePage = currentPath === "/";
  const isLoginPage = currentPath === "/login";
  const isRegisterPage = currentPath === "/register";
  const isTripDisplayPage = currentPath.startsWith("/trip-display");

  return (
    <nav className="sticky top-0 z-50 flex items-center justify-between px-8 py-4 bg-white/20 backdrop-blur-lg shadow-md border-b border-white/30 rounded-b-xl">
      {/* Logo */}
      <Link
        to="/"
        className="flex items-center gap-2 text-2xl font-bold text-red-500 hover:opacity-80 transition"
      >
        <FaGlobeAmericas className="text-3xl text-blue-600" />
        <span className="tracking-wide">PocketTrip</span>
      </Link>

      <div className="flex items-center space-x-4">
        {/* Show Chat button on /trip-display/:id if authenticated */}
        {isTripDisplayPage && isAuthenticated && (
          <Link to="/chat">
            <button className="px-4 py-2 text-white bg-red-500 rounded-md hover:bg-red-600">
              Chat
            </button>
          </Link>
        )}

        {/* Show Sign In if NOT authenticated and on home or trip-display */}
        {!isAuthenticated &&
          (isHomePage || isTripDisplayPage) &&
          !isLoginPage &&
          !isRegisterPage && (
            <Link to="/login">
              <button className="flex items-center gap-2 px-4 py-2 text-white bg-red-500 rounded-md hover:bg-red-600">
                <LogIn className="w-5 h-5" />
                <span>Sign In</span>
              </button>
            </Link>
          )}

        {/* Show Logout on homepage when authenticated */}
        {isAuthenticated && isHomePage && (
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 text-white bg-red-500 rounded-md hover:bg-red-600"
          >
            <LogOut className="w-5 h-5" />
            <span>Logout</span>
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
