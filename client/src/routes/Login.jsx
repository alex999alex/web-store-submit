import React, { useState } from 'react';
import { useForm } from "react-hook-form";
import { useOutletContext, useNavigate } from "react-router-dom";

export default function Login() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const setIsLoggedIn = useOutletContext(); // Get setIsLoggedIn from Outlet context
  const navigate = useNavigate(); // Hook for programmatically navigating

  const [loginFail, setLoginFail] = useState(false);

  async function formSubmit(data) {
    const apiHost = import.meta.env.VITE_APP_HOST || 'http://localhost:3000';
    const url = `${apiHost}/api/users/login`;

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data),
      credentials: 'include'
    });

    if(response.ok) {
      localStorage.setItem('token', 'true'); // Store a simple token
      setIsLoggedIn(true);

      // Get the redirection path from localStorage (default to home if not set)
      const redirectTo = localStorage.getItem('redirectTo') || '/';

      // Clear the redirectTo after redirecting
      localStorage.removeItem('redirectTo');

      // Redirect to the stored path or home
      navigate(redirectTo);
    } else {
      setLoginFail(true);
    }
  }

  return (
    <>
      <h1>Login</h1>
      {loginFail && <p className="text-danger">Incorrect username or password.</p>}
      <form onSubmit={handleSubmit(formSubmit)} method="post" className="w-25">
        <div className="mb-3">
          <label className="form-label">Email (username)</label>
          <input {...register("email", { required: "Email is required." })} type="text" className="form-control bg-light" />
          {errors.email && <span className="text-danger">{errors.email.message}</span>}
        </div>
        <div className="mb-3">
          <label className="form-label">Password</label>
          <input {...register("password", { required: "Password is required." })} type="password" className="form-control bg-light" />
          {errors.password && <span className="text-danger">{errors.password.message}</span>}
        </div>
        <button type="submit" className="btn btn-primary">Login</button>
      </form>
    </>
  );
}
