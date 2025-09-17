import React, { useState, useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/Form';
import { Input } from '@/components/ui/input';
import { RotateCcw } from 'lucide-react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useToast } from "@/hooks/use-toast";
import { Toaster } from '@/Components/ui/Toaster';
import { jwtVerify, SignJWT } from 'jose';

const formOtpSchema = z.object({
  otp: z.string().min(6).max(6),
});

const VerifyOTP = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const checkToken = localStorage.getItem('jwt_token')
    ? localStorage.getItem('jwt_token')
    : null;
  const [token, setToken] = useState(checkToken);
  const { otp } = useParams();

  if (!token && !otp) {
    toast({
      variant: 'destructive',
      title: 'Error',
      description: 'Invalid Token',
    });
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-pink-900">
        <h1 className="text-2xl text-pink-400 font-semibold">Invalid Token</h1>
        <Link to="/" className="text-purple-300 mt-5 hover:underline">
          Already Registered?
        </Link>
      </div>
    );
  }

  useEffect(() => {
    (async () => {
      setToken(localStorage.getItem('jwt_token'));
    })();
  }, [token]);

  const formOtp = useForm<z.infer<typeof formOtpSchema>>({
    resolver: zodResolver(formOtpSchema),
    defaultValues: {
      otp: otp ? otp : '',
    },
  });

  const secretKey = import.meta.env.VITE_SECRET_KEY;
  const secret = new TextEncoder().encode(secretKey);

  async function onSubmitOtp(values: z.infer<typeof formOtpSchema>) {
    const jwtToken = jwtVerify(token, secret, {
      issuer: 'event-sphere',
      audience: 'event-sphere',
    });

    if (jwtToken) {
      const expiry =
        (await jwtToken.then((token) => token.payload.exp)) ?? null;
      if (expiry < Date.now() / 1000) {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: 'Token Expired',
        });
        return;
      }
    } else {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Invalid Token',
      });
      return;
    }

    const decodedOTP =
      (await jwtToken.then((token) => token.payload.otp)) ?? null;

    try {
      if (values.otp === decodedOTP || values.otp === otp) {
        localStorage.removeItem('jwt_token');
        const decodeEmail =
          (await jwtToken.then((token) => token.payload.email)) ?? null;
        const newJwtToken = await new SignJWT({ email: decodeEmail })
          .setProtectedHeader({ alg: 'HS256' })
          .setIssuedAt()
          .setIssuer('event-sphere')
          .setAudience('event-sphere')
          .setExpirationTime('30m')
          .sign(secret);
        localStorage.setItem('jwt_token', newJwtToken);
        toast({
          variant: 'success',
          title: 'Success',
          description: 'OTP verified successfully.',
        });
        navigate('/reset-password');
      } else {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: 'Invalid OTP',
        });
      }
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Invalid OTP',
      });
    }
  }

  return (
    <>
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-pink-900">
        <Form {...formOtp}>
          <form
            onSubmit={formOtp.handleSubmit(onSubmitOtp)}
            className="space-y-6 w-96 bg-white/10 backdrop-blur-md text-white p-6 rounded-2xl shadow-2xl"
          >
            {/* Heading */}
            <h1 className="text-2xl font-bold text-center text-pink-400">
              Verify OTP
            </h1>
            <p className="text-center text-sm text-gray-300">
              Enter the OTP sent to your email
            </p>

            {/* OTP Input */}
            <FormField
              control={formOtp.control}
              name="otp"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-purple-300">OTP</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter 6-digit OTP"
                      {...field}
                      className="bg-transparent border border-purple-500 text-white 
                                 placeholder-gray-400 rounded-lg focus:outline-none 
                                 focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            {/* Submit Button */}
            <Button
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:opacity-90 rounded-lg"
              type="submit"
            >
              <RotateCcw className="mr-2" /> Verify OTP
            </Button>

            {/* Links */}
            <p className="text-center text-sm text-gray-300">
              Don’t have an account?{" "}
              <Link to="/register" className="text-pink-400 hover:underline">
                Register
              </Link>
            </p>
            <p className="text-center text-sm text-gray-300">
              Already registered?{" "}
              <Link to="/login" className="text-purple-400 hover:underline">
                Login
              </Link>
            </p>
          </form>
        </Form>
      </div>
      <Toaster />
    </>
  );
};

export default VerifyOTP;
