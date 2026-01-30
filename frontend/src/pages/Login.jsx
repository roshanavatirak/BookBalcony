// import React, { useState, useEffect } from "react";
// import { useNavigate, Link } from "react-router-dom";
// import { motion } from "framer-motion";
// import axios from "axios";
// import { useDispatch } from "react-redux";
// import { authActions } from "../store/auth";

// const Login = () => {
//   const navigate = useNavigate();
//   const dispatch = useDispatch();

//   const [credentials, setCredentials] = useState({
//     emailOrMobile: "",
//     password: "",
//   });

//   const [error, setError] = useState("");
//   const [loading, setLoading] = useState(false);

//   const handleChange = (e) => {
//     setCredentials({ ...credentials, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     const { emailOrMobile, password } = credentials;

//     if (!emailOrMobile || !password) {
//       setError("Please enter both email/mobile and password.");
//       return;
//     }

//     try {
//       setError("");
//       setLoading(true);

//       console.log("🔐 Attempting login...");

//       // Send login request to backend
//       const response = await axios.post("http://localhost:3000/api/v1/sign-in", {
//         emailOrMobile,
//         password,
//       });

//       console.log("📥 Login response:", response.data);

//       const { token, role, id } = response.data;

//       // ✅ Validate response data
//       if (!token || !role || !id) {
//         throw new Error("Invalid response from server - missing required fields");
//       }

//       console.log("✅ Login data received:", { role, id, hasToken: !!token });

//       // ✅ Store login info in localStorage for persistence
//       localStorage.setItem("token", token);
//       localStorage.setItem("role", role);
//       localStorage.setItem("id", id);

//       console.log("💾 Data stored in localStorage");
//       console.log("Role stored:", localStorage.getItem("role"));
//       console.log("ID stored:", localStorage.getItem("id"));

//       // ✅ Update Redux store
//       dispatch(authActions.login());
//       dispatch(authActions.changeRole(role));

//       console.log("✅ Redux state updated with role:", role);

//       alert(`Login successful! Welcome ${role === "admin" ? "Admin" : "User"}!`);

//       // ✅ Navigate based on role
//       if (role === "admin") {
//         console.log("🔀 Navigating to admin dashboard...");
//         navigate("/admin/dashboard");
//       } else {
//         console.log("🔀 Navigating to home...");
//         navigate("/");
//       }

//     } catch (err) {
//       console.error("❌ Login error:", err);
//       setError(err.response?.data?.message || err.message || "Invalid credentials or server error.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // ✅ Keep user logged in on reload (if token exists)
//   useEffect(() => {
//     const token = localStorage.getItem("token");
//     const role = localStorage.getItem("role");
//     const id = localStorage.getItem("id");

//     console.log("🔍 Checking existing session...");
//     console.log("Token exists:", !!token);
//     console.log("Role:", role);
//     console.log("ID:", id);

//     if (token && role && id) {
//       console.log("✅ Session found, restoring login state");
//       dispatch(authActions.login());
//       dispatch(authActions.changeRole(role));
      
//       // Redirect if already logged in
//       if (role === "admin") {
//         navigate("/admin/dashboard");
//       } else {
//         navigate("/");
//       }
//     }
//   }, [dispatch, navigate]);

//   return (
//     <motion.div
//       initial={{ opacity: 0, y: 20 }}
//       animate={{ opacity: 1, y: 0 }}
//       transition={{ duration: 0.4, ease: "easeOut" }}
//       className="min-h-screen bg-gradient-to-br from-gray-900 via-zinc-800 to-gray-900 flex items-center justify-center p-6"
//     >
//       <div className="bg-zinc-900 p-8 rounded-3xl shadow-lg w-full max-w-md text-white">
//         <h2 className="text-3xl font-bold mb-6 text-yellow-400 text-center">
//           Login to Your Account
//         </h2>

//         {error && (
//           <div className="mb-4 text-red-400 text-sm text-center bg-red-900 px-3 py-2 rounded">
//             {error}
//           </div>
//         )}

//         <form onSubmit={handleSubmit} className="space-y-4">
//           <input
//             type="text"
//             name="emailOrMobile"
//             placeholder="Email or Mobile Number"
//             value={credentials.emailOrMobile}
//             onChange={handleChange}
//             disabled={loading}
//             className="w-full p-3 rounded-md bg-transparent border border-zinc-700 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 disabled:opacity-50"
//           />

//           <input
//             type="password"
//             name="password"
//             placeholder="Password"
//             value={credentials.password}
//             onChange={handleChange}
//             disabled={loading}
//             className="w-full p-3 rounded-md bg-transparent border border-zinc-700 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 disabled:opacity-50"
//           />

//           <button
//             type="submit"
//             disabled={loading}
//             className="w-full bg-yellow-400 text-black font-semibold py-3 rounded-md hover:bg-yellow-300 transition disabled:opacity-50 disabled:cursor-not-allowed"
//           >
//             {loading ? "Logging in..." : "Login"}
//           </button>
//         </form>

//         <p className="mt-6 text-center text-zinc-400">
//           Don't have an account?{" "}
//           <Link to="/signup" className="text-yellow-400 hover:underline">
//             Sign Up
//           </Link>
//         </p>
//       </div>
//     </motion.div>
//   );
// };

// export default Login;

// import React, { useState, useEffect } from "react";
// import { useNavigate, Link } from "react-router-dom";
// import { motion } from "framer-motion";
// import axios from "axios";
// import { useDispatch } from "react-redux";
// import { authActions } from "../store/auth";

// const Login = () => {
//   const navigate = useNavigate();
//   const dispatch = useDispatch();

//   const [credentials, setCredentials] = useState({
//     emailOrMobile: "",
//     password: "",
//   });

//   const [error, setError] = useState("");
//   const [loading, setLoading] = useState(false);

//   const handleChange = (e) => {
//     setCredentials({ ...credentials, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     const { emailOrMobile, password } = credentials;

//     if (!emailOrMobile || !password) {
//       setError("Please enter both email/mobile and password.");
//       return;
//     }

//     try {
//       setError("");
//       setLoading(true);

//       console.log("🔐 Attempting login...");

//       // Send login request to backend
//       const response = await axios.post("http://localhost:3000/api/v1/sign-in", {
//         emailOrMobile,
//         password,
//       });

//       console.log("📥 Login response:", response.data);

//       const { token, role, id } = response.data;

//       // ✅ Validate response data
//       if (!token || !role || !id) {
//         throw new Error("Invalid response from server - missing required fields");
//       }

//       console.log("✅ Login data received:", { role, id, hasToken: !!token });

//       // ✅ Store login info in localStorage FIRST
//       localStorage.setItem("token", token);
//       localStorage.setItem("role", role);
//       localStorage.setItem("id", id);

//       console.log("💾 Data stored in localStorage");
//       console.log("Role stored:", localStorage.getItem("role"));
//       console.log("ID stored:", localStorage.getItem("id"));

//       // ✅ Update Redux store - dispatch login FIRST, then role
//       dispatch(authActions.login());
//       dispatch(authActions.changeRole(role));

//       console.log("✅ Redux state updated with role:", role);

//       alert(`Login successful! Welcome ${role === "admin" ? "Admin" : "User"}!`);

//       // ✅ Force a small delay to ensure Redux state propagates
//       await new Promise(resolve => setTimeout(resolve, 150));

//       // ✅ Navigate based on role with replace to prevent back button issues
//       if (role === "admin") {
//         console.log("🔀 Navigating to Admin Profile...");
//         navigate("/Admin/profile", { replace: true });
//       } else {
//         console.log("🔀 Navigating to home...");
//         navigate("/", { replace: true });
//       }

//     } catch (err) {
//       console.error("❌ Login error:", err);
//       setError(err.response?.data?.message || err.message || "Invalid credentials or server error.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // ✅ Keep user logged in on reload (if token exists)
//   useEffect(() => {
//     const token = localStorage.getItem("token");
//     const role = localStorage.getItem("role");
//     const id = localStorage.getItem("id");

//     console.log("🔍 Login Page - Checking existing session...");
//     console.log("Token exists:", !!token);
//     console.log("Role:", role);
//     console.log("ID:", id);

//     if (token && role && id) {
//       console.log("✅ Session found, user already logged in");
//       dispatch(authActions.login());
//       dispatch(authActions.changeRole(role));
      
//       // Redirect if already logged in
//       if (role === "admin") {
//         navigate("/Admin/profile", { replace: true });
//       } else {
//         navigate("/", { replace: true });
//       }
//     }
//   }, [dispatch, navigate]);

//   return (
//     <motion.div
//       initial={{ opacity: 0, y: 20 }}
//       animate={{ opacity: 1, y: 0 }}
//       transition={{ duration: 0.4, ease: "easeOut" }}
//       className="min-h-screen bg-gradient-to-br from-gray-900 via-zinc-800 to-gray-900 flex items-center justify-center p-6"
//     >
//       <div className="bg-zinc-900 p-8 rounded-3xl shadow-lg w-full max-w-md text-white">
//         <h2 className="text-3xl font-bold mb-6 text-yellow-400 text-center">
//           Login to Your Account
//         </h2>

//         {error && (
//           <div className="mb-4 text-red-400 text-sm text-center bg-red-900 px-3 py-2 rounded">
//             {error}
//           </div>
//         )}

//         <form onSubmit={handleSubmit} className="space-y-4">
//           <input
//             type="text"
//             name="emailOrMobile"
//             placeholder="Email or Mobile Number"
//             value={credentials.emailOrMobile}
//             onChange={handleChange}
//             disabled={loading}
//             className="w-full p-3 rounded-md bg-transparent border border-zinc-700 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 disabled:opacity-50"
//           />

//           <input
//             type="password"
//             name="password"
//             placeholder="Password"
//             value={credentials.password}
//             onChange={handleChange}
//             disabled={loading}
//             className="w-full p-3 rounded-md bg-transparent border border-zinc-700 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 disabled:opacity-50"
//           />

//           <button
//             type="submit"
//             disabled={loading}
//             className="w-full bg-yellow-400 text-black font-semibold py-3 rounded-md hover:bg-yellow-300 transition disabled:opacity-50 disabled:cursor-not-allowed"
//           >
//             {loading ? "Logging in..." : "Login"}
//           </button>
//         </form>

//         <p className="mt-6 text-center text-zinc-400">
//           Don't have an account?{" "}
//           <Link to="/signup" className="text-yellow-400 hover:underline">
//             Sign Up
//           </Link>
//         </p>
//       </div>
//     </motion.div>
//   );
// };

// export default Login;

import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { useDispatch } from "react-redux";
import { authActions } from "../store/auth";
import Alert from "../components/Alert/Alert";
import { useAlert } from "../components/Alert/useAlert";

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { alert, showAlert, hideAlert, success, error, warning, info } = useAlert();

  const [credentials, setCredentials] = useState({
    emailOrMobile: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { emailOrMobile, password } = credentials;

    // Validation
    if (!emailOrMobile || !password) {
      error("Please enter both email/mobile and password.", "Validation Error");
      return;
    }

    try {
      setLoading(true);
      info("Logging you in...", "Please Wait");

      console.log("🔐 Attempting login...");

      // Send login request to backend
      const response = await axios.post("http://localhost:3000/api/v1/sign-in", {
        emailOrMobile,
        password,
      });

      console.log("📥 Login response:", response.data);

      const { token, role, id } = response.data;

      // Validate response data
      if (!token || !role || !id) {
        throw new Error("Invalid response from server - missing required fields");
      }

      console.log("✅ Login data received:", { role, id, hasToken: !!token });

      // Store login info in localStorage
      localStorage.setItem("token", token);
      localStorage.setItem("role", role);
      localStorage.setItem("id", id);

      console.log("💾 Data stored in localStorage");
      console.log("Role stored:", localStorage.getItem("role"));
      console.log("ID stored:", localStorage.getItem("id"));

      // Update Redux store
      dispatch(authActions.login());
      dispatch(authActions.changeRole(role));

      console.log("✅ Redux state updated with role:", role);

      // Show success alert
      success(
        `Welcome back! Redirecting to your ${role === "admin" ? "admin panel" : "dashboard"}...`,
        "Login Successful"
      );

      // Force a small delay to ensure Redux state propagates
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Navigate based on role
      if (role === "admin") {
        console.log("🔀 Navigating to Admin Profile...");
        navigate("/Admin/profile", { replace: true });
      } else {
        console.log("🔀 Navigating to home...");
        navigate("/", { replace: true });
      }

    } catch (err) {
      console.error("❌ Login error:", err);
      const errorMessage = err.response?.data?.message || err.message || "Invalid credentials or server error.";
      error(errorMessage, "Login Failed");
    } finally {
      setLoading(false);
    }
  };

  // Keep user logged in on reload
  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");
    const id = localStorage.getItem("id");

    console.log("🔍 Login Page - Checking existing session...");
    console.log("Token exists:", !!token);
    console.log("Role:", role);
    console.log("ID:", id);

    if (token && role && id) {
      console.log("✅ Session found, user already logged in");
      dispatch(authActions.login());
      dispatch(authActions.changeRole(role));
      
      // Redirect if already logged in
      info("You're already logged in. Redirecting...", "Session Active");
      
      setTimeout(() => {
        if (role === "admin") {
          navigate("/Admin/profile", { replace: true });
        } else {
          navigate("/", { replace: true });
        }
      }, 1500);
    }
  }, [dispatch, navigate]);

  return (
    <>
      {/* Alert Component */}
      {alert && (
        <Alert
          type={alert.type}
          title={alert.title}
          message={alert.message}
          duration={alert.duration}
          position={alert.position}
          autoClose={alert.autoClose}
          onClose={hideAlert}
        />
      )}

      {/* Login Form */}
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-zinc-800 to-gray-900 flex items-center justify-center p-6 transition-all duration-500">
        <div className="bg-zinc-900 p-8 rounded-3xl shadow-2xl w-full max-w-md text-white border border-zinc-800 transition-all duration-300 hover:shadow-yellow-500/10">
          <h2 className="text-3xl font-bold mb-6 text-yellow-400 text-center">
            Login to Your Account
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              name="emailOrMobile"
              placeholder="Email or Mobile Number"
              value={credentials.emailOrMobile}
              onChange={handleChange}
              disabled={loading}
              className="w-full p-3 rounded-md bg-transparent border border-zinc-700 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 disabled:opacity-50 transition-all duration-300"
            />

            <input
              type="password"
              name="password"
              placeholder="Password"
              value={credentials.password}
              onChange={handleChange}
              disabled={loading}
              className="w-full p-3 rounded-md bg-transparent border border-zinc-700 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 disabled:opacity-50 transition-all duration-300"
            />

            {/* Forgot Password Link */}
            <div className="text-right">
              <Link 
                to="/forgot-password" 
                className="text-yellow-400 hover:underline text-sm transition-all duration-300 hover:text-yellow-300"
              >
                Forgot Password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-yellow-400 text-black font-semibold py-3 rounded-md hover:bg-yellow-300 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-[0.98]"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Logging in...
                </span>
              ) : (
                "Login"
              )}
            </button>
          </form>

          <p className="mt-6 text-center text-zinc-400">
            Don't have an account?{" "}
            <Link to="/signup" className="text-yellow-400 hover:underline transition-all duration-300 hover:text-yellow-300">
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </>
  );
};

export default Login;