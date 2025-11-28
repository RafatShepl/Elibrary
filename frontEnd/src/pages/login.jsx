import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/authContext";


export default function Login() {

    const navigate = useNavigate()
    const { login ,setMessage,setError} = useAuth();
    const [loginForm, setLoginForm] = useState({
        email: "",
        password: ""
    });

    const onSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        try {
            const data = await login(loginForm.email, loginForm.password)
            if (data.success) {
                setMessage(data.message);  // can show "Login successful"
                const role = data?.role
                const redirectpath = data?.redirectpath?.trim() || (role === "admin" ? '/admin' : '/')

                navigate(redirectpath)

               
            } else {
                
                setError(data.message || "Login failed");
            }


        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="w-[80%] md:w-[40%] shadow-md mx-auto mt-24 bg-emerald-50">
            <form className="flex flex-col p-2" onSubmit={onSubmit}>
                <h1 className="text-center p-3.5 font-extrabold text-3xl text-green-600">
                    Login
                </h1>

                <div className="w-full flex flex-col gap-1 p-4">
                    <label className="text-slate-900">Email:</label>
                    <input
                        className="w-[90%] p-2 font-medium ml-5 focus:outline-0 bg-amber-50 shadow rounded-md focus:shadow-md focus:shadow-green-300"
                        placeholder="Enter email"
                        type="email"
                        name="email"
                        value={loginForm.email}
                        onChange={(e) =>
                            setLoginForm((p) => ({ ...p, [e.target.name]: e.target.value }))
                        }
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
                        value={loginForm.password}
                        onChange={(e) =>
                            setLoginForm((p) => ({ ...p, [e.target.name]: e.target.value }))
                        }
                        required
                    />
                </div>

                <div className="flex justify-center p-4">
                    <input
                        className="bg-blue-600 text-white p-2 px-4 rounded-md cursor-pointer"
                        type="submit"
                        value="Login"
                    />
                </div>

              
            </form>
        </div>
    );
}
