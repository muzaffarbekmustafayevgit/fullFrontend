import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Loading from "../components/Loading";

function Role() {
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    const handleUnload = () => {
      localStorage.removeItem("accessToken");
    };

    // Add event listener for the unload event
    window.addEventListener("unload", handleUnload);

    // Clean up the event listener
    return () => {
      window.removeEventListener("unload", handleUnload);
    };
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("access_token");

        if (!token) {
          setError("Access token not found");
          return;
        }

        const response = await fetch("http://api.eagledev.uz/api/user/profile/", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) throw new Error("Failed to fetch profile data");

        const result = await response.json();
        setData(result);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Navigate based on the user's role if data is available
  useEffect(() => {
    if (data && data.user_obj && data.user_obj.role === 'moderator') {
      navigate('/moderator');
    }
   else if (data && data.user_obj && data.user_obj.role === 'student') {
        navigate('/courses');
      }
    else  if (data && data.user_obj && data.user_obj.role === 'admin') {
        navigate('/admin');
      }

  }, [data, navigate]);

  if (loading) {
    return <Loading/>;
  }


}

export default Role;
