"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

const Register = () => {
  const [error, setError] = useState("");
  const router = useRouter();
  const { data: session, status: sessionStatus } = useSession();

  useEffect(() => {
    if (sessionStatus === "authenticated") {
      router.replace("/dashboard");
    }
  }, [sessionStatus, router]);

  const isValidEmail = (email: string) => {
    const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const email = e.target[0].value;
    const password = e.target[1].value;

    if (!isValidEmail(email)) {
      setError("Invalid email");
      return;
    }

    if (!password || password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (res.status === 400) {
        setError("This email is already registered");
      }
      if (res.status === 201) {
        router.push("/login");
        setError("");
      }
    } catch (err: any) {
      console.error(err);
      setError("Try again later");
    }
    // console.log(email, password);
  };

  if (sessionStatus === "loading") {
    return <h1>Loading...</h1>;
  }

  return (
    sessionStatus !== "authenticated" && (
      <div className="flex min-h-screen flex-col items-center justify-between p-24">
        <div className="bg-[#212121] p-8 rounded shadow-md w-96">
          <h1 className="text-4xl text-white text-center font-semibold mb-4">
            Register
          </h1>

          <form onSubmit={handleSubmit}>
            <input
              type="email"
              className="w-full border-gray-300 text-black rounded px-3 py-2 mb-4 focus:outline"
              placeholder="Email"
              required
            />
            <input
              type="password"
              className="w-full border-gray-300 text-black rounded px-3 py-2 mb-4 focus:outline"
              placeholder="Password"
              required
            />

            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
            >
              Submit
            </button>
            {error && <div className="text-red-500 mt-2">{error}</div>}
          </form>
          <div className="text-center text-gray-500 hover:underline mt-4">
            --OR--
          </div>
          <Link
            href="/login"
            className="block text-center text-blue-500 hover:underline mt-2"
          >
            {" "}
            Login with an existing account
          </Link>
        </div>
      </div>
    )
  );
};
export default Register;
