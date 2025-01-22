"use client";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { disAPI } from "@/lib/utils";
import { AlertCircle, CheckCircle2 } from "lucide-react";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Label } from "@/components/ui/label";
import { useAuth } from "./AuthContext";
import { Icons } from "@/components/ui/icons";

interface user {
  username: string;
  password: string;
}

const SignUpPage: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [signUp, setsignUp] = useState<user>({
    username: "",
    password: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);
  const [isLoading, setIsLoading] = React.useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setsignUp((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    setError(null);
    setSuccess(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    setIsLoading(true);

    try {
      const data = await disAPI(
        "auth/register",
        "POST",
        JSON.stringify(signUp)
      );
      console.log(data);

      const userData = {
        username: signUp.username,
        token: data.token,
      };

      login(userData);

      setsignUp({ username: "", password: "" });
      setSuccess(true);
      navigate("/");
    } catch {
      setError("Failed to Register User.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center  dark:from-slate-900 dark:to-slate-800">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="lg:p-8"
      >
        <Card className="w-[350px] sm:w-[400px] bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-teal-200 dark:border-teal-700">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center text-teal-700 dark:text-teal-300">
              Create Account
            </CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4">
            <form onSubmit={handleSubmit} className="space-y-6">
              <motion.div
                className="space-y-2"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
              >
                <Label
                  htmlFor="username"
                  className="text-slate-700 dark:text-slate-300"
                >
                  Username
                </Label>
                <Input
                  type="text"
                  name="username"
                  placeholder="User Name"
                  onChange={handleChange}
                  value={signUp.username}
                  className="bg-white/50 dark:bg-slate-700/50 border-teal-200 dark:border-teal-700 focus:border-teal-400 dark:focus:border-teal-500"
                  required
                />
              </motion.div>
              <motion.div
                className="space-y-2"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4, duration: 0.5 }}
              >
                <Label
                  htmlFor="password"
                  className="text-slate-700 dark:text-slate-300"
                >
                  Password
                </Label>
                <Input
                  type="password"
                  name="password"
                  placeholder="Password"
                  onChange={handleChange}
                  value={signUp.password}
                  className="bg-white/50 dark:bg-slate-700/50 border-teal-200 dark:border-teal-700 focus:border-teal-400 dark:focus:border-teal-500"
                  required
                />
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.5 }}
              >
                <Button
                  className="w-full mt-4 bg-cyan-700 hover:bg-teal-900 text-white dark:bg-teal-500 dark:hover:bg-teal-600"
                  type="submit"
                  disabled={isLoading}
                >
                  {isLoading && (
                    <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Register
                </Button>
              </motion.div>
            </form>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <Alert
                  variant="destructive"
                  className="mt-4 bg-red-100 border-red-400 text-red-700 rounded-lg"
                >
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              </motion.div>
            )}

            {success && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <Alert className="mt-4 bg-green-100 border-green-400 text-green-700 rounded-lg">
                  <CheckCircle2 className="h-4 w-4" />
                  <AlertDescription>
                    Registration successful! Redirecting...
                  </AlertDescription>
                </Alert>
              </motion.div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default SignUpPage;
