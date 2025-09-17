import React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/Form';
import { Input } from '@/components/ui/input';
import { BadgeCheck } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useToast } from "@/hooks/use-toast";
import { Toaster } from '@/Components/ui/Toaster';
import { SignJWT } from 'jose';

const formEmailSchema = z.object({
  email: z.string().min(5).max(100)
    .regex(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[cC][oO][mM]$/, "Invalid email format"),
});

const ForgetPassword = () => {
  const { toast } = useToast();
  const navigate = useNavigate();

  const formEmail = useForm<z.infer<typeof formEmailSchema>>({
    resolver: zodResolver(formEmailSchema),
    defaultValues: { email: "" },
  });

  // Get secret key from environment
  const secretKey = import.meta.env.VITE_SECRET_KEY;
  if (!secretKey) {
    console.error("VITE_SECRET_KEY is not defined in environment variables.");
  }
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
      // Send email to backend to request OTP
axios.defaults.baseURL = 'http://localhost:5000';

const response = await axios.post('/api/reset-password', values);

      console.log("Server response:", response.data);

      if (response.status === 200 && response.data.token) {
        const otp = response.data.token;

        // Sign JWT
        let token;
        try {
          token = await new SignJWT({ otp, email: values.email })
            .setProtectedHeader({ alg: 'HS256' })
            .setIssuedAt()
            .setIssuer('event-sphere')
            .setAudience('event-sphere')
            .setExpirationTime('15m')
            .sign(secret);
        } catch (jwtError) {
          console.error("JWT signing error:", jwtError);
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
        console.warn("OTP token missing in server response:", response.data);
        toast({
          variant: "destructive",
          title: "Error",
          description: response.data?.message || "OTP token not received from server.",
        });
      }

    } catch (error: any) {
  console.error("Error sending OTP:", error.response || error.message || error);
  toast({
    variant: "destructive",
    title: "Error",
    description: error.response?.data?.message || error.message || "Unexpected error occurred.",
  });
}

  };

  return (
    <>
      <div className="flex flex-col items-center justify-center h-screen">
        <Form {...formEmail}>
          <form onSubmit={formEmail.handleSubmit(onSubmit)} className="space-y-8 w-96 bg-slate-900 text-white p-5 rounded-2xl">
            <FormField
              control={formEmail.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="john.doe@example.com" {...field} autoComplete="off" />
                  </FormControl>
                  <FormDescription>
                    Enter your email address to receive a password reset OTP.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button className="w-full bg-white text-black hover:bg-black hover:text-white" type="submit">
              <BadgeCheck /> Send OTP
            </Button>
          </form>
        </Form>

        <Link to="/register" className='text-rose-950 mt-5'>Don't have an account?</Link>
        <Link to="/" className='text-rose-950 mt-2'>Already Registered?</Link>
      </div>

      <Toaster />
    </>
  );
};

export default ForgetPassword;
