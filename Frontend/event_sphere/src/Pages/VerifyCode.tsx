import React, { useState, useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/Form';
import { Input } from '@/components/ui/input';
import { RotateCcw } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useToast } from "@/hooks/use-toast";
import { Toaster } from '@/Components/ui/Toaster';
import { jwtVerify, SignJWT } from 'jose';

const formOtpSchema = z.object({
  otp: z.string().min(6, 'OTP must be 6 digits').max(6, 'OTP must be 6 digits'),
});

const VerifyOTP = () => {
  const { toast } = useToast();
  const navigate = useNavigate();

  const checkToken = localStorage.getItem('jwt_token');
  const [token, setToken] = useState(checkToken || '');

  const formOtp = useForm<z.infer<typeof formOtpSchema>>({
    resolver: zodResolver(formOtpSchema),
    defaultValues: { otp: '' },
  });

  const secretKey = import.meta.env.VITE_SECRET_KEY;
  const secret = new TextEncoder().encode(secretKey);

  // If no token, show error
  useEffect(() => {
    if (!token) {
      toast({ variant: 'destructive', title: 'Error', description: 'No token found. Please request OTP again.' });
      navigate('/forget-password');
    }
  }, [token, toast, navigate]);

  const onSubmitOtp = async (values: z.infer<typeof formOtpSchema>) => {
    try {
      if (!token) return;

      const jwtToken = await jwtVerify(token, secret, {
        issuer: 'event-sphere',
        audience: 'event-sphere',
      });

      // Check expiry
      const expiry = jwtToken.payload.exp ?? 0;
      if (expiry < Math.floor(Date.now() / 1000)) {
        toast({ variant: 'destructive', title: 'Error', description: 'Token Expired. Request OTP again.' });
        return;
      }

      const decodedOTP = jwtToken.payload.otp;
      const email = jwtToken.payload.email;

      if (values.otp === decodedOTP) {
        // OTP correct, issue new token
        localStorage.removeItem('jwt_token');

        const newJwtToken = await new SignJWT({ email })
          .setProtectedHeader({ alg: 'HS256' })
          .setIssuedAt()
          .setIssuer('event-sphere')
          .setAudience('event-sphere')
          .setExpirationTime('30m')
          .sign(secret);

        localStorage.setItem('jwt_token', newJwtToken);

        toast({ variant: 'success', title: 'Success', description: 'OTP verified successfully.' });
        navigate('/reset-password');
      } else {
        toast({ variant: 'destructive', title: 'Error', description: 'Invalid OTP. Try again.' });
      }
    } catch (error) {
      console.error(error);
      toast({ variant: 'destructive', title: 'Error', description: 'Invalid OTP or token.' });
    }
  };

  return (
    <>
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-black via-purple-900 to-black p-4">
        <Form {...formOtp}>
          <form
            onSubmit={formOtp.handleSubmit(onSubmitOtp)}
            className="w-full max-w-md bg-black/80 backdrop-blur-md text-white p-8 rounded-3xl shadow-2xl border border-purple-700 space-y-6"
          >
            <h1 className="text-3xl font-bold text-center text-purple-300 drop-shadow-lg">Verify OTP</h1>
            <p className="text-center text-gray-300 text-sm">Enter the 6-digit OTP sent to your email</p>

            <FormField
              control={formOtp.control}
              name="otp"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-purple-300">OTP</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="123456"
                      {...field}
                      className="bg-gray-900 text-white border border-purple-600 placeholder-gray-400 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-purple-400"
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-700 hover:to-purple-900 text-white font-bold rounded-xl shadow-lg hover:shadow-2xl flex items-center justify-center gap-2 transition-all duration-300"
            >
              <RotateCcw /> Verify OTP
            </Button>

            <div className="flex flex-col gap-2 text-center text-sm text-gray-300">
              <p>
                Don’t have an account?{" "}
                <Link to="/register" className="text-pink-400 hover:underline">
                  Register
                </Link>
              </p>
              <p>
                Already registered?{" "}
                <Link to="/login" className="text-purple-400 hover:underline">
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

export default VerifyOTP;
