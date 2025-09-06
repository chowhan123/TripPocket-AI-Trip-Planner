import React, { useContext, useState } from "react";
const axios = require("axios");
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../components/Context";
const Logout = () => {
  const navigate = useNavigate();
  const { setUser } = useContext(AuthContext);

  const logout = async () => {
    try {
      await axios.post(
        "http://localhost:5000/api/user/logout",
        {},
        { withCredentials: true }
      );
      setUser(null);
      localStorage.removeItem("token");
      navigate("/login");
    } catch (error) {
      console.error( "Logout failed:", error.response?.data?.error || error.message );
    }
  };

  return <button onClick={logout}>Logout</button>;
};

export default Logout;
