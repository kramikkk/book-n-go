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
    <div className="flex justify-center w-full px-4 md:px-0">
      <Card className="w-full max-w-[420px] h-auto bg-white/80 backdrop-blur-2xl shadow-2xl border border-white/50 pb-4 rounded-3xl">
        <CardHeader>
          <CardTitle className="text-3xl font-bold mb-1 text-[#2F44AD]">
            Welcome
          </CardTitle>
          <CardDescription className="-mt-1 text-gray-400 font-light text-sm">
            Login to manage your appointment
          </CardDescription>
        </CardHeader>

        <CardContent className="pt-0 pb-2">
          <form className="mt-2">
            <div className="flex flex-col gap-3">
              <div className="grid gap-2 relative group">
                <Label htmlFor="email" className="text-gray-700 font-medium ml-1">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  required
                  className="pl-11 h-10 bg-white/50 border-gray-200 focus:border-[#2B9698] focus:ring-[#2B9698] transition-all rounded-xl text-sm"
                />
                <Mail className="absolute left-4 top-[70%] -translate-y-1/2 text-[#2B9698]/50 group-focus-within:text-[#2B9698] transition-colors" size={17} />
              </div>

              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password" title="password" className="text-gray-700 font-medium ml-1">Password</Label>
                </div>

                <div className="relative group">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    required
                    className="pl-11 pr-10 h-10 bg-white/50 border-gray-200 focus:border-[#2B9698] focus:ring-[#2B9698] transition-all rounded-xl text-sm"
                  />
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-[#2B9698]/50 group-focus-within:text-[#2B9698] transition-colors" size={17} />
                  <Button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-gray-400 hover:text-[#2B9698]"
                    variant="ghost"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </Button>
                </div>
              </div>
            </div>
          </form>

          <div className="flex items-center mt-3 px-1">
            <div className="flex items-center gap-2 group cursor-pointer">
              <input
                id="remember"
                type="checkbox"
                className="w-4 h-4 text-[#2B9698] bg-gray-100 rounded border-gray-300 focus:ring-[#2B9698] cursor-pointer"
              />
              <label htmlFor="remember" className="text-sm text-gray-600 cursor-pointer group-hover:text-gray-900 transition-colors">
                Remember me
              </label>
            </div>
          </div>

        </CardContent>
 <CardFooter className="flex-col gap-2 pt-0 pb-4">
          <Button
            type="submit"
            onClick={() => router.push("/client/dashboard")}
            className="w-full h-11 text-white rounded-xl py-2 font-semibold bg-gradient-to-r from-[#2F44AD] to-[#2B9698] hover:from-[#2B9698] hover:to-[#2F44AD] transition-all duration-500 shadow-lg shadow-blue-500/20 active:scale-[0.98]">
            Login
          </Button>
          <div className="w-full border-t border-gray-100 mt-4 pt-4">
            <p className="text-[13px] text-center text-gray-400 font-light italic leading-tight">
              Contact an administrator to request account <br className="hidden sm:block" /> access and dashboard permissions.
            </p>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}