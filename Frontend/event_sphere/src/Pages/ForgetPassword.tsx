import React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/Form';
import { Input } from '@/components/ui/input';
import { BadgeCheck } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useToast } from "@/hooks/use-toast";
import { Toaster } from '@/Components/ui/Toaster';
import { SignJWT } from 'jose';

const formEmailSchema = z.object({
  email: z.string()
    .min(5)
    .max(100)
    .regex(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[cC][oO][mM]$/, "Invalid email format"),
});

const ForgetPassword = () => {
  const { toast } = useToast();
  const navigate = useNavigate();

  const formEmail = useForm<z.infer<typeof formEmailSchema>>({
    resolver: zodResolver(formEmailSchema),
    defaultValues: { email: "" },
  });

  const secretKey = import.meta.env.VITE_SECRET_KEY;
  const secret = secretKey ? new TextEncoder().encode(secretKey) : undefined;

  const onSubmit = async (values: z.infer<typeof formEmailSchema>) => {
    if (!secret) {
      toast({
        variant: "destructive",
        title: "Configuration Error",
        description: "Server secret key not found. Cannot generate OTP token.",
      });
      return;
    }

    try {
      axios.defaults.baseURL = 'http://localhost:5000';
      const response = await axios.post('/api/reset-password', values);

      if (response.status === 200 && response.data.token) {
        const otp = response.data.token;

        let token;
        try {
          token = await new SignJWT({ otp, email: values.email })
            .setProtectedHeader({ alg: 'HS256' })
            .setIssuedAt()
            .setIssuer('event-sphere')
            .setAudience('event-sphere')
            .setExpirationTime('15m')
            .sign(secret);
        } catch {
          toast({
            variant: "destructive",
            title: "JWT Error",
            description: "Failed to generate OTP token.",
          });
          return;
        }

        localStorage.setItem('jwt_token', token);
        toast({
          variant: "success",
          title: "OTP Sent",
          description: "OTP sent to your email successfully. Please check your inbox.",
        });

        navigate(`/verify-otp`);
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: response.data?.message || "OTP token not received from server.",
        });
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.response?.data?.message || error.message || "Unexpected error occurred.",
      });
    }
  };

  return (
    <>
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-black via-purple-900 to-black px-4">
        <Form {...formEmail}>
          <form
            onSubmit={formEmail.handleSubmit(onSubmit)}
            className="w-full max-w-md bg-black/80 backdrop-blur-md text-white p-8 rounded-3xl shadow-2xl border border-purple-700 hover:border-pink-500 transition-all duration-300 space-y-6"
          >
            <h1 className="text-3xl font-bold text-center text-purple-300 drop-shadow-lg">
              Forgot Password
            </h1>
            <p className="text-center text-sm text-gray-300">
              Enter your email to receive a password reset OTP.
            </p>

            {/* Email Field */}
            <FormField
              control={formEmail.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="john.doe@example.com"
                      {...field}
                      autoComplete="off"
                      className="bg-gray-900 text-white placeholder-gray-400 border-purple-600 focus:border-pink-400 focus:ring-pink-400 rounded-lg px-3 py-2 transition"
                    />
                  </FormControl>
                  <FormMessage className="text-sm text-red-400" />
                </FormItem>
              )}
            />

            {/* Send OTP Button */}
            <Button
              type="submit"
              className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:opacity-90 rounded-xl py-3 text-lg font-medium transition shadow-lg hover:shadow-pink-500/50"
            >
              <BadgeCheck className="w-5 h-5" /> Send OTP
            </Button>

            <div className="flex flex-col gap-2 text-center text-sm text-gray-300">
              <p>
                Don’t have an account?{" "}
                <Link to="/register" className="text-pink-400 hover:text-purple-300 hover:underline transition">
                  Register
                </Link>
              </p>
              <p>
                Already registered?{" "}
                <Link to="/login" className="text-purple-400 hover:text-pink-400 hover:underline transition">
                  Login
                </Link>
              </p>
            </div>
          </form>
        </Form>
      </div>

      <Toaster />
    </>
  );
};

export default ForgetPassword;
