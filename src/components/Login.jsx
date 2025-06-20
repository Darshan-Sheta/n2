import React, { useState } from "react"; //🔹 local error store karva
import { Link, useNavigate } from "react-router-dom"; //🔹navigation without reload,programmatic redirect
import { login as authLogin } from "../store/authSlice"; //🔹 authLogin: Redux action to login
import { Button, Input, Logo } from "./index"; //🔹 Button/Input/Logo: custom components
import { useDispatch } from "react-redux"; //🔹 useDispatch: Redux ni action call karva
import authService from "../appwrite/auth"; //🔹 authService: Appwrite login service
import { useForm } from "react-hook-form"; //🔹 useForm: Form data handle karva hook

//React Hook Form thi tame: -> register("email"): input field ne form sathe jodo->handleSubmit(callback): form submit thaya pachi callback call

//Login component React + Appwrite + Redux + React Hook Form

/*
1. User enter kare → Email & Password
        ↓
2. User Click kare "Sign In"
        ↓
3. `onSubmit` → `handleSubmit(login)` call thay
        ↓
4. `login()` function execute thay
        ↓
5. Appwrite thi `authService.login()` call thay
        ↓
6. Login success → `authService.getCurrentUser()` thi user data lavay
        ↓
7. Redux ma `dispatch(authLogin(userData))` call thay
        ↓
8. `navigate("/")` → redirect to home

*/
function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { register, handleSubmit } = useForm();
  const [error, setError] = useState("");

  const login = async (data) => {
    // 💡 data ma email + password hase
    // 💡 authService.login() → Appwrite thi login
    // 💡authService.getCurrentUser() → user ni full details lavse
    setError("");
    try {
      const session = await authService.login(data);
      if (session) {
        const userData = await authService.getCurrentUser();
        if (userData) dispatch(authLogin(userData));
        navigate("/");
      }
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="flex items-center justify-center w-full">
      <div
        className={`mx-auto w-full max-w-lg bg-gray-100 rounded-xl p-10 border border-black/10`}
      >
        <div className="mb-2 flex justify-center">
          <span className="inline-block w-full max-w-[100px]">
            <Logo width="100%" />
          </span>
        </div>
        <h2 className="text-center text-2xl font-bold leading-tight">
          Sign in to your account
        </h2>
        <p className="mt-2 text-center text-base text-black/60">
          Don&apos;t have any account?&nbsp;
          <Link
            to="/signup"
            className="font-medium text-primary transition-all duration-200 hover:underline"
          >
            Sign Up
          </Link>
        </p>
        {error && <p className="text-red-600 mt-8 text-center">{error}</p>}
        <form onSubmit={handleSubmit(login)} className="mt-8">
          <div className="space-y-5">
            <Input
              label="Email: "
              placeholder="Enter your email"
              type="email"
              {...register("email", {
                required: true,
                validate: {
                  matchPatern: (value) =>
                    /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(value) ||
                    "Email address must be a valid address",
                },
              })}
            />
            <Input
              label="Password: "
              type="password"
              placeholder="Enter your password"
              {...register("password", {
                required: true,
              })}
            />
            <Button type="submit" className="w-full">
              Sign in
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;
