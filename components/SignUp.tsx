"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import FeatureCards from "@/components/FeatureCards";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff } from "lucide-react";

export default function SignUp() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    const fd = new FormData(e.currentTarget);
    const firstName = fd.get("firstName") as string;
    const lastName = fd.get("lastName") as string;
    const phone = fd.get("phone") as string;
    const password = fd.get("password") as string;
    const confirmPassword = fd.get("confirmPassword") as string;

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          first_name: firstName,
          last_name: lastName,
          phone,
          password,
          email: `${phone}@placeholder.bng`,
        }),
      });
      const body = await res.json();
      if (!res.ok) {
        setError(body.error ?? "Registration failed");
        return;
      }
      // Redirect to home after successful registration
      window.location.href = "/";
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const card = (
    <Card className="w-full max-w-sm rounded-3xl shadow-xl">
      <CardHeader className="pb-0">
        <CardTitle className="text-2xl font-semibold text-center">
          Sign Up
        </CardTitle>
      </CardHeader>

      <CardContent className="pt-4">
        <form id="signup-form" onSubmit={handleSubmit}>
          <div className="flex flex-col gap-3">

            <Input
              id="firstName"
              name="firstName"
              type="text"
              placeholder="First Name"
              required
              className="bg-gray-100 border-0 rounded-xl"
            />

            <Input
              id="lastName"
              name="lastName"
              type="text"
              placeholder="Last Name"
              required
              className="bg-gray-100 border-0 rounded-xl"
            />

            <Input
              id="phone"
              name="phone"
              type="tel"
              placeholder="Phone Number"
              required
              className="bg-gray-100 border-0 rounded-xl"
            />

            {/* Password */}
            <div className="relative">
              <Input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                required
                className="bg-gray-100 border-0 rounded-xl pr-10"
              />
              <Button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                variant="ghost"
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1 h-auto"
              >
                {showPassword ? (
                  <EyeOff size={18} className="text-gray-400" />
                ) : (
                  <Eye size={18} className="text-gray-400" />
                )}
              </Button>
            </div>

            {/* Confirm Password */}
            <div className="relative">
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type={showConfirm ? "text" : "password"}
                placeholder="Confirm Password"
                required
                className="bg-gray-100 border-0 rounded-xl pr-10"
              />
              <Button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                variant="ghost"
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1 h-auto"
              >
                {showConfirm ? (
                  <EyeOff size={18} className="text-gray-400" />
                ) : (
                  <Eye size={18} className="text-gray-400" />
                )}
              </Button>
            </div>

          </div>
        </form>
      </CardContent>

      <CardFooter className="flex-col gap-2 pt-2">
        {error && <p className="text-sm text-destructive text-center">{error}</p>}
        <Button
          type="submit"
          form="signup-form"
          disabled={isLoading}
          className="w-full text-white rounded-lg py-2 font-medium bg-gradient-to-r from-[#409689] to-[#2F46AC] hover:from-[#2F46AC] hover:to-[#409689] transition-colors duration-300"
        >
          {isLoading ? "Creating account..." : "Sign Up"}
        </Button>

        <div className="w-full mt-4 pt-2">
          <p className="text-sm text-center text-gray-600">
            Already have an account?{" "}
            <Link
              href="/"
              className="text-[#409689] font-medium hover:underline"
            >
              Log In
            </Link>
          </p>
        </div>
      </CardFooter>
    </Card>
  );

  return (
    <>
      {/* LARGE SCREEN */}
      <div className="hidden lg:block relative min-h-screen bg-[#EEF5F4]">
        <Navbar />

        <div className="relative w-full min-h-screen bg-gradient-to-br from-[#2F44AD] to-[#2B9698] flex items-start pt-40">

          <div className="w-full px-24">
            <div className="text-white max-w-lg text-left">
              <h2 className="text-[48px] font-semibold leading-tight">
                Book your perfect <br />
                <span className="text-[#3FB09C]">Appointment</span> <br />
                in seconds
              </h2>

              <p className="mt-4 text-base opacity-90">
                Experience seamless scheduling with our modern reservation system.
              </p>
            </div>
          </div>

          <FeatureCards />
        </div>

        {/* SIGNUP CARD */}
        <div className="pr-3 relative z-10 lg:-mt-[700px]">
          <div className="flex justify-end items-center min-h-screen lg:pr-30">
            {card}
          </div>

          <svg
            className="absolute bottom-0 left-0 w-full z-0 pointer-events-none"
            viewBox="0 0 1440 320"
            preserveAspectRatio="none"
          >
            <path
              fill="#EEF5F4"
              d="M0,192L80,176C160,160,320,128,480,133.3C640,139,800,181,960,208C1120,235,1280,245,1360,250.7L1440,256L1440,320L0,320Z"
            />
          </svg>
        </div>
      </div>

      {/* MOBILE */}
      <div className="lg:hidden relative min-h-screen bg-gradient-to-br from-[#2F44AD] to-[#2B9698] flex flex-col">

        <div className="w-full h-16 bg-white flex items-center px-4">
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/bookngo_logo.png"
              alt="BookNGo Logo"
              width={48}
              height={48}
              className="w-10 h-10"
            />

            <h1 className="font-semibold text-2xl bg-gradient-to-r from-[#2B9698] to-[#2F44AD] text-transparent bg-clip-text">
              BookNGo
            </h1>
          </Link>
        </div>

        <div className="flex-1 flex items-center justify-center px-6 py-12">
          {card}
        </div>
      </div>
    </>
  );
}
