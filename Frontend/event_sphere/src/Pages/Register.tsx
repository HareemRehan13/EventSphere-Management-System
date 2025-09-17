import React, { useState } from 'react';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/Components/ui/Select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/Form';
import { Input } from '@/components/ui/input';
import { Key, Eye, EyeOff } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useToast } from "@/hooks/use-toast";
import { Toaster } from '@/Components/ui/Toaster';

const formSchema = z.object({
  name: z.string().min(5).max(50),
  email: z.string().min(5).max(50).regex(
    /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[cC][oO][mM]$/,
    { message: "Must be a valid .com email" }
  ),
  password: z.string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[a-zA-Z]/, "Must contain letters")
    .regex(/\d/, "Must contain numbers"),
  role: z.string().min(2).max(50),
  phone: z.string().min(11).max(14),
  organization: z.string().optional(),
});

const Register = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      role: "ATTENDEE",
      phone: "",
      organization: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const res = await axios.post('/api/users', values);
      if (res.status === 201) {
        toast({
          variant: "default",
          title: "Registration Successful",
          description: "You can now log in with your credentials.",
        });
        navigate('/login');
      }
    } catch (error: any) {
      console.error("Registration error:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error?.response?.data?.message || "Something went wrong",
      });
    }
  };

  return (
    <>
     <div className="flex items-center justify-center h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-pink-900">
  <Form {...form}>
    <form
      method="post"
      onSubmit={form.handleSubmit(onSubmit)}
      className="space-y-6 w-96 bg-white/10 backdrop-blur-md text-white p-6 rounded-2xl shadow-2xl"
    >
      {/* --- Name --- */}
      <FormField
        control={form.control}
        name="name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Name</FormLabel>
            <FormControl>
              <Input placeholder="John Doe" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* --- Email --- */}
      <FormField
        control={form.control}
        name="email"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Email</FormLabel>
            <FormControl>
              <Input placeholder="johndoe@example.com" {...field} />
            </FormControl>
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
                  placeholder="Password"
                  type={showPassword ? "text" : "password"}
                  {...field}
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2 text-gray-400 hover:text-black"
                >
                  {showPassword ? <Eye size={18} /> : <EyeOff size={18} />}
                </button>
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* --- Role --- */}
      <FormField
        control={form.control}
        name="role"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Role</FormLabel>
            <Select onValueChange={field.onChange} defaultValue="ATTENDEE">
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="EXHIBITOR">Exhibitor</SelectItem>
                <SelectItem value="ATTENDEE">Attendee</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* --- Phone --- */}
      <FormField
        control={form.control}
        name="phone"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Phone</FormLabel>
            <FormControl>
              <Input placeholder="+12345678910" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* --- Organization (if Organizer) --- */}
      {form.watch("role") === "ORGANIZER" && (
        <FormField
          control={form.control}
          name="organization"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Organization</FormLabel>
              <FormControl>
                <Input placeholder="Event Sphere" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      )}

      {/* --- Register Button --- */}
      <Button
        className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:opacity-90 rounded-xl"
        type="submit"
      >
        <Key className="mr-2" /> Register
      </Button>

      <p className="text-center text-sm text-gray-300">
        Already have an account?{" "}
        <Link to="/login" className="text-pink-400 hover:underline">
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

export default Register;
