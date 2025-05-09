"use client";
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";
import { IoMdLogIn } from "react-icons/io";
import { useState } from "react";
import { LoginSchema } from "@/utils/validationSchemas";
import Alert from "@/components/Alert";
import Spinner from "@/components/Spinner";
import { loginAction } from "@/actions/auth.action";
import SocialProvider from "@/components/SocialProvider";
import { set } from "zod";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [clientError, setClientError] = useState("");
  const [serverError, setServerError] = useState("");
  const [serverSuccess, setServerSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const formSubmitHandler = (e: React.FormEvent) => {
    e.preventDefault();
    const validation = LoginSchema.safeParse({ email, password });
    if (validation.error)
      return setClientError(validation.error.errors[0].message);

    setLoading(true);
    loginAction({ email, password }).then((result) => {
      if (result.success) {
        setServerSuccess(result.message);
        setEmail("");
        setPassword("");
        setClientError("");
        setServerError(""); 
      }
      if (!result.success) setServerError(result.message);
      setLoading(false);
    });
  };

  return (
    <form onSubmit={formSubmitHandler}>
      <div className="flex flex-col mb-3">
        <label className="p-1 text-slate-500 font-bold" htmlFor="email">
          Email
        </label>
        <input
          className="border border-slate-500 rounded-lg px-2 py-1 text-xl"
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={loading}
        />
      </div>
      <div className="flex flex-col mb-3">
        <label className="p-1 text-slate-500 font-bold" htmlFor="password">
          Password
        </label>
        <input
          className="border border-slate-500 rounded-lg px-2 py-1 text-xl"
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={loading}
        />
      </div>
      {(clientError || serverError) && (
        <Alert type="error" message={clientError || serverError} />
      )}
      {serverSuccess && <Alert type="success" message={serverSuccess} />}
      <button
        className="disabled:bg-gray-300 flex items-center justify-center bg-slate-800  hover:bg-slate-900 mt-4 text-white cursor-pointer rounded-lg w-full py-2"
        disabled={loading}
        type="submit"
      >
        {loading ? (
          <Spinner />
        ) : (
          <>
            <IoMdLogIn className="me-1 text-2xl" />
            Login
          </>
        )}
      </button>
      <SocialProvider />
    </form>
  );
};
export default LoginForm;
