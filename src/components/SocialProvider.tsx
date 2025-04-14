"use client";
import { FaGithub } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { signIn } from "next-auth/react";

type Provider = "github" | "google";

const SocialProvider = () => {
  const socialLoginHandler = (provider: Provider) => {
    signIn(provider, { redirectTo: "/profile" });
  };

  return (
    <div className="flex items-center justify-center gap-6 mt-6">
      <div
        className="border border-slate-200 bg-blue-100 hover:bg-blue-200 rounded px-4 py-2
     cursor-pointer w-1/2 flex justify-center items-center"
        onClick={() => socialLoginHandler("google")}
      >
        <FcGoogle className="text-4xl" />
      </div>
      <div
        className="border border-slate-200 bg-slate-100 hover:bg-slate-200 rounded px-4 py-2
     cursor-pointer w-1/2 flex justify-center items-center"
        onClick={() => socialLoginHandler("github")}
      >
        <FaGithub className="text-4xl" />
      </div>
    </div>
  );
};

export default SocialProvider;
