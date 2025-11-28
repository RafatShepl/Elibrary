import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/authContext";

export default function Register() {
  const { register ,setMessage,setError} = useAuth()

  const [registerForm, setRegisterForm] = useState({
    username: "",
    email: "",
    password: "",
    role: "user"
  });
  const navigate = useNavigate()
  const onSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    try {
      const data = await register(registerForm.username, registerForm.email, registerForm.password)
      if (data.success) {
        setMessage(data.message);
        const role = data?.role
        const redirectpath = data?.redirectpath || (role === "admin" ? '/admin' : '/')
        navigate(redirectpath)

      }
      else {
        setError("Failed to register");
      }

    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="w-[80%] md:w-[40%] shadow-md mx-auto mt-24 bg-emerald-50">
      
      <form className="flex flex-col p-2" onSubmit={onSubmit}>
        <h1 className="text-center p-3.5 font-extrabold text-3xl text-green-600">Sign In</h1>

        <div className="w-full flex flex-col gap-1 p-4">
          <label className="text-slate-900">Username:</label>
          <input
            className="w-[90%] p-2 font-medium ml-5 focus:outline-0 bg-amber-50 shadow rounded-md focus:shadow-md focus:shadow-green-300"
            placeholder="Enter username"
            type="text"
            name="username"
            value={registerForm.username}
            onChange={(e) => setRegisterForm(p => ({ ...p, [e.target.name]: e.target.value }))}
            required
          />
        </div>

        <div className="w-full flex flex-col gap-1 p-4">
          <label className="text-slate-900">Email:</label>
          <input
            className="w-[90%] p-2 font-medium ml-5 focus:outline-0 bg-amber-50 shadow rounded-md focus:shadow-md focus:shadow-green-300"
            placeholder="Enter email"
            type="email"
            name="email"
            value={registerForm.email}
            onChange={(e) => setRegisterForm(p => ({ ...p, [e.target.name]: e.target.value }))}
            required
          />
        </div>

        <div className="w-full flex flex-col gap-1 p-4">
          <label className="text-slate-900">Password:</label>
          <input
            className="w-[90%] p-2 font-medium ml-5 focus:outline-0 bg-amber-50 shadow rounded-md focus:shadow-md focus:shadow-green-300"
            placeholder="Enter password"
            type="password"
            name="password"
            value={registerForm.password}
            onChange={(e) => setRegisterForm(p => ({ ...p, [e.target.name]: e.target.value }))}
            required
          />
        </div>

        <div className="flex justify-center p-4">
          <input
            className="bg-blue-600 text-white p-2 px-4 rounded-md cursor-pointer"
            type="submit"
            value="Sign In"
          />
        </div>



      </form>
    </div>
  );
}
