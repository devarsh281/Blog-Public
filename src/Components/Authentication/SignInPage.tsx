"use client"

import * as React from "react"
import { useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import { AlertCircle, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Icons } from "@/components/ui/icons"
import { useAuth } from "./AuthContext"
import { disAPI } from "@/lib/utils"
import { Alert, AlertDescription } from "@/components/ui/alert";

interface User {
  username: string
  password: string
}

export default function SignInPage() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [isLoading, setIsLoading] = React.useState(false)
const [error, setError] = React.useState<string | null>(null);
  const [success, setSuccess] = React.useState<boolean>(false);
  const [user, setUser] = React.useState<User>({
    username: "",
    password: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setUser((prevUser) => ({
      ...prevUser,
      [name]: value,
    }))
    setError(null);
    setSuccess(false);
  }

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault()
    setIsLoading(true)
    setError(null);
    setSuccess(false);

    try {
      const data = await disAPI("auth/loguser", "POST", JSON.stringify(user))
      console.log(data)
      const userData = {
        username: user.username,
        token: data.token,
      }

      login(userData)

      setUser({ username: "", password: "" })
      setSuccess(true);
      setTimeout(() => {
        navigate("/")
      }, 2000)
    } catch {
      setError("Failed to Login");
    } finally {
      setIsLoading(false)
    }
  }

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
            <CardTitle className="text-2xl text-center text-teal-700 dark:text-teal-300">Login</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4">
            
            <form onSubmit={onSubmit}>
              <div className="grid gap-2">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                >
                  <Label htmlFor="username" className="text-slate-700 dark:text-slate-300">
                    Username
                  </Label>
                  <Input
                    id="username"
                    name="username"
                    placeholder="Enter your username"
                    type="text"
                    disabled={isLoading}
                    value={user.username}
                    onChange={handleChange}
                    className="bg-white/50 dark:bg-slate-700/50 border-teal-200 dark:border-teal-700 focus:border-teal-400 dark:focus:border-teal-500"
                    required
                  />
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4, duration: 0.5 }}
                >
                  <Label htmlFor="password" className="text-slate-700 dark:text-slate-300">
                    Password
                  </Label>
                  <Input
                    id="password"
                    name="password"
                    placeholder="Enter your password"
                    type="password"
                    autoCapitalize="none"
                    autoCorrect="off"
                    disabled={isLoading}
                    value={user.password}
                    onChange={handleChange}
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
                    {isLoading && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}
                    Login
                  </Button>
                </motion.div>
              </div>
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
          <CardFooter className="flex flex-col">
            <div className="mt-2 text-center text-sm text-slate-600 dark:text-slate-400">
              Don&apos;t have an account?{" "}
              <Button
                variant="link"
                className="text-amber-600 hover:text-amber-700 dark:text-amber-400 dark:hover:text-amber-300"
                onClick={() => navigate("/signup")}
              >
                Register
              </Button>
            </div>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  )
}

