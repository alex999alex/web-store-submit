import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

export default function Signup() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [signupError, setSignupError] = useState(null);
  const navigate = useNavigate();

  async function formSubmit(data) {
    const apiHost = import.meta.env.VITE_APP_HOST || 'http://localhost:3000';
    const url = `${apiHost}/api/users/signup`;

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(data),
        credentials: 'include'
      });

      if (response.ok) {
        navigate('/login');
      } else {
        const errorData = await response.text();
        setSignupError(errorData || "Signup failed. Please try again.");
      }
    } catch (error) {
      setSignupError("Network error. Please try again.");
    }
  }

  return (
    <>
      <h1>Signup</h1>
      {signupError && <p className="text-danger">{signupError}</p>}
      <form onSubmit={handleSubmit(formSubmit)} method="post" className="w-25">
        <div className="mb-3">
          <label className="form-label">First Name</label>
          <input {...register("firstName", { required: true })} type="text" className="form-control bg-light" />
          {errors.firstName && <span className="text-danger">First Name is required.</span>}
        </div>
        <div className="mb-3">
          <label className="form-label">Last Name</label>
          <input {...register("lastName", { required: "Last Name is required." })} type="text" className="form-control bg-light" />
          {errors.lastName && <span className="text-danger">{errors.lastName.message}</span>}
        </div>
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
        <button type="submit" className="btn btn-primary">Signup</button>
        <Link to="/login" className="btn btn-outline-dark ms-2">Cancel</Link>
      </form>
    </>
  )
}