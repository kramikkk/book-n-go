"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { Eye, EyeOff, Mail, Lock } from "lucide-react"; // ADDED Mail and Lock
export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  return (
    <div className="flex justify-center md:justify-end items-center min-h-screen px-4 md:px-0 md:pr-30">
      <Card className="w-full max-w-sm h-[500px]">
        <CardHeader>
          <CardTitle className="text-3xl font-semibold mb-2">
            Welcome
          </CardTitle>
          <CardDescription className="-mt-4">
            Login to manage your appointment
            </CardDescription>
        </CardHeader>

        <CardContent>
          <form className="mt-6">
            <div className="flex flex-col gap-6">
              <div className="grid gap-2 relative">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                  className="pl-10" // Add padding to the left for the icon
                />
                <Mail className="absolute left-2 top-[70%] -translate-y-1/2 text-gray-400" size={20} /> 
              </div> 

              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                </div>

                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    required
                    className="pl-10 pr-10" // Add padding to the left for the icon
                  />
                  <Lock className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400" size={20} />  {/* ADD Lock icon */}
                  <Button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-1"
                    variant="ghost"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </Button>
                </div>
              </div>
            </div>
          </form>

            <div className="flex items-center justify-between mt-4">
                <div className="flex items-center gap-2">
                <input
                id="remember"
                type="checkbox"
                className="w-4 h-4 text-blue-600 bg-gray-100 rounded border-gray-300"
            />
            <label htmlFor="remember" className="text-sm text-gray-700">
            Remember me
            </label>
            </div>

  <a href="#" className="text-sm text-green-600 hover:underline">
    Forgot Password?
  </a>
</div>

    </CardContent>
 <CardFooter className="flex-col gap-2">
  <Button 
  type="submit"
  onClick={() => router.push("/dashboard")}
  className="w-full text-white rounded-lg py-2 font-medium bg-gradient-to-r from-[#409689] to-[#2F46AC] hover:from-[#2F46AC] hover:to-[#409689] transition-colors duration-300">
    Login
  </Button>

  <div className="w-full border-t border-gray-300 mt-4 pt-4">
    <p className="text-sm text-center text-gray-600">
      Don't have an account?{" "}
      <Link href="/signup" className="text-[#409689] font-medium hover:underline">
        Sign Up
      </Link>
    </p>
  </div>
</CardFooter>
      </Card>
    </div>
  );
}