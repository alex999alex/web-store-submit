import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

export default function Signup() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const navigate = useNavigate(); 

  const [signupError, setSignupError] = useState(""); 

  
  async function formSubmit(data) {
    const apiHost = import.meta.env.VITE_APP_HOST || "http://localhost:3000";
    const url = `${apiHost}/api/users/signup`;

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorResponse = await response.json(); 
        setSignupError(errorResponse.message || "Signup failed. Please try again.");
      } else {
        setSignupError(""); 
        navigate("/login"); 
      }
    } catch (error) {
      console.error("Network error:", error);
      setSignupError("An error occurred while trying to sign up. Please try again later.");
    }
  }

  return (
    <>
      <h1>Signup</h1>
      {signupError && <p className="text-danger">{signupError}</p>} 
      <form onSubmit={handleSubmit(formSubmit)} method="post" className="w-25">
        <div className="mb-3">
          <label className="form-label">First Name</label>
          <input
            {...register("firstName", { required: "First Name is required." })}
            type="text"
            className="form-control bg-light"
          />
          {errors.firstName && <span className="text-danger">{errors.firstName.message}</span>}
        </div>
        <div className="mb-3">
          <label className="form-label">Last Name</label>
          <input
            {...register("lastName", { required: "Last Name is required." })}
            type="text"
            className="form-control bg-light"
          />
          {errors.lastName && <span className="text-danger">{errors.lastName.message}</span>}
        </div>
        <div className="mb-3">
          <label className="form-label">Email (username)</label>
          <input
            {...register("email", {
              required: "Email is required.",
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: "Invalid email format.",
              },
            })}
            type="text"
            className="form-control bg-light"
          />
          {errors.email && <span className="text-danger">{errors.email.message}</span>}
        </div>
        <div className="mb-3">
          <label className="form-label">Password</label>
          <input
            {...register("password", {
              required: "Password is required.",
              minLength: { value: 8, message: "Password must be at least 8 characters long." },
              pattern: {
                value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?!.*\s).+$/,
                message: "Password must include at least one lowercase letter, one uppercase letter, one number, and no spaces.",
              },
            })}
            type="password"
            className="form-control bg-light"
          />
          {errors.password && <span className="text-danger">{errors.password.message}</span>}
        </div>
        <button type="submit" className="btn btn-primary">Signup</button>
        <Link to="/login" className="btn btn-outline-dark ms-2">Cancel</Link>
      </form>
    </>
  );
} //
