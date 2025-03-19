"use client";
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";
import { BsPerson, BsPersonPlus } from "react-icons/bs";
import { useState } from "react";
import { registerSchema } from "@/utils/validationSchemas";
import { registerAction } from "@/actions/auth.action";
import Spinner from "@/components/Spinner";
import Alert from "@/components/Alert";

const RegisterForm = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [clientError, setClientError] = useState("");
  const [serverError, setServerError] = useState("");
  const [serverSuccess, setServerSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const formSubmitHandler = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const user = { name, email, password };
    const validation = registerSchema.safeParse(user);
    if (validation.error)
      return setClientError(validation.error.errors[0].message);

    registerAction(user).then((res) => {
      if (res?.error) setServerError(res.error);
      if (res?.success) setServerSuccess(res.success);
    });

    setName("");
    setEmail("");
    setPassword("");
    setClientError("");
  };
  return (
    <form onSubmit={formSubmitHandler}>
      <div className="flex flex-col mb-3">
        <label className="p-1 text-slate-500 font-bold" htmlFor="name">
          Name
        </label>
        <input
          className="border border-slate-500 rounded-lg px-2 py-1 text-xl"
          type="name"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>
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
            {" "}
            <BsPersonPlus className="me-1 text-2xl" />
            Register
          </>
        )}
      </button>
      <div className="flex items-center justify-center gap-6 mt-6">
        <div
          className="border border-slate-200 bg-blue-100 hover:bg-blue-200 rounded px-4 py-2
         cursor-pointer w-1/2 flex justify-center items-center"
        >
          <FcGoogle className="text-4xl" />
        </div>
        <div
          className="border border-slate-200 bg-slate-100 hover:bg-slate-200 rounded px-4 py-2
         cursor-pointer w-1/2 flex justify-center items-center"
        >
          <FaGithub className="text-4xl" />
        </div>
      </div>
    </form>
  );
};
export default RegisterForm;
