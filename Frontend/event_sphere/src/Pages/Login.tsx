import React, { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/Form';
import { Input } from '@/components/ui/input';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useToast } from "@/hooks/use-toast";
import { Toaster } from '@/Components/ui/Toaster';
import { Progress } from '@/Components/ui/progress';
import { LogIn, Eye, EyeOff } from 'lucide-react';

const formSchema = z.object({
  email: z.string().min(5).max(100).regex(
    /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[cC][oO][mM]$/,
    { message: "Must be a valid .com email" }
  ),
  password: z.string().min(8).max(80),
});

const Login = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setLoading(true);
    setProgress(20);

    try {
      setProgress(50);
      const response = await axios.post('/api/users/login', values);

      setProgress(65);

      if (response.status === 200 && response.data.token) {
        setProgress(80);
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        toast({
          variant: "default",
          title: "Success",
          description: "You have been logged in successfully",
        });
        setProgress(100);

        const userRole = response.data.user.role;
        setLoading(false);
        if (userRole === 'ATTENDEE') {
          navigate('/dashboard/attendee');
        } else {
          navigate('/dashboard');
        }
      }
    } catch (error: any) {
      setLoading(false);
      toast({
        variant: "destructive",
        title: "Error",
        description: error?.response?.data?.message || "Unexpected error occurred",
      });
    }
  };

  return (
    <>
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-pink-900">
        {loading ? (
          <div className="flex flex-col justify-center items-center space-y-4 h-screen">
            <Progress className="w-80" value={progress} />
            <h1 className="text-2xl font-semibold text-white text-center">
              Verifying, Please wait...
            </h1>
          </div>
        ) : (
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-6 w-96 bg-white/10 backdrop-blur-md text-white p-6 rounded-2xl shadow-2xl"
            >
              {/* --- Email --- */}
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="john.doe@example.com" {...field} />
                    </FormControl>
                    <FormDescription>
                      Please enter your email
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* --- Password --- */}
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type={showPassword ? "text" : "password"}
                          placeholder="Your Password"
                          autoComplete="new-password"
                          {...field}
                          className="pr-10"
                        />
                        <button
                          type="button"
                          className="absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-white"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? <Eye size={20} /> : <EyeOff size={20} />}
                        </button>
                      </div>
                    </FormControl>
                    <FormDescription>
                      Please enter your password
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* --- Forgot Password Link --- */}
              <Link to="/forget-password" className="text-pink-400 hover:underline">
                Forgot Password?
              </Link>

              {/* --- Login Button --- */}
              <Button
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:opacity-90 rounded-xl"
                type="submit"
              >
                <LogIn className="mr-2" /> Login
              </Button>

              {/* --- Register Link --- */}
              <p className="text-center text-sm text-gray-300">
                Don&apos;t have an account?{" "}
                <Link to="/register" className="text-pink-400 hover:underline">
                  Register
                </Link>
              </p>
            </form>
          </Form>
        )}
      </div>

      <Toaster />
    </>
  );
};

export default Login;
