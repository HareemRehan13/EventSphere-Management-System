// import React from 'react';
// import { z } from 'zod';
// import { zodResolver } from '@hookform/resolvers/zod';
// import { useForm } from 'react-hook-form';
// import { Button } from '@/Components/ui/Button';
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue
// } from "@/components/ui/Select";
// import {
//   Form,
//   FormControl,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage
// } from '@/Components/ui/Form';
// import { Input } from '@/Components/ui/Input';
// import { Key } from 'lucide-react';
// import { Link, useNavigate } from 'react-router-dom';
// import axios from 'axios';
// import { useToast } from "@/hooks/use-toast";
// import { Toaster } from '@/Components/ui/Toaster';

// const formSchema = z.object({
//   name: z.string().min(5).max(50),
//   email: z.string().min(5).max(50).regex(
//     /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[cC][oO][mM]$/,
//     { message: "Must be a valid .com email" }
//   ),
//   password: z.string()
//     .min(8, "Password must be at least 8 characters")
//     .regex(/[a-zA-Z]/, "Must contain letters")
//     .regex(/\d/, "Must contain numbers"),
//   role: z.string().min(2).max(50),
//   phone: z.string().min(11).max(14),
//   organization: z.string().optional(),
// });

// const Register = () => {
//   const { toast } = useToast();
//   const navigate = useNavigate();

//   const form = useForm<z.infer<typeof formSchema>>({
//     resolver: zodResolver(formSchema),
//     defaultValues: {
//       name: "",
//       email: "",
//       password: "",
//       role: "ATTENDEE",
//       phone: "",
//       organization: "",
//     },
//   });

//   const onSubmit = async (values: z.infer<typeof formSchema>) => {
//     try {
//       const res = await axios.post('/api/users', values);
//       if (res.status === 201) {
//         toast({
//           variant: "default",
//           title: "Registration Successful",
//           description: "You can now log in with your credentials.",
//         });
//         navigate('/'); // 👈 redirect to home after registration
//       }
//     } catch (error: any) {
//       console.error("Registration error:", error);
//       toast({
//         variant: "destructive",
//         title: "Error",
//         description: error?.response?.data?.message || "Something went wrong",
//       });
//     }
//   };

//   return (
//     <>
//       <div className="flex flex-col items-center justify-center h-screen">
//         <Form {...form}>
//           <form method='post' onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-96 bg-slate-900 text-white p-5 rounded-2xl">
//             <FormField
//               control={form.control}
//               name="name"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>Name</FormLabel>
//                   <FormControl>
//                     <Input placeholder="John Doe" {...field} />
//                   </FormControl>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />

//             <FormField
//               control={form.control}
//               name="email"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>Email</FormLabel>
//                   <FormControl>
//                     <Input placeholder="johndoe@example.com" {...field} />
//                   </FormControl>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />

//             <FormField
//               control={form.control}
//               name="password"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>Password</FormLabel>
//                   <FormControl>
//                     <Input placeholder="Password" type="password" {...field} />
//                   </FormControl>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />

//             <FormField
//               control={form.control}
//               name="role"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>Role</FormLabel>
//                   <Select onValueChange={field.onChange} defaultValue="ATTENDEE">
//                     <FormControl>
//                       <SelectTrigger>
//                         <SelectValue placeholder="Select a role" />
//                       </SelectTrigger>
//                     </FormControl>
//                     <SelectContent>
//                       <SelectItem value="EXHIBITOR">Exhibitor</SelectItem>
//                       <SelectItem value="ATTENDEE">Attendee</SelectItem>
//                     </SelectContent>
//                   </Select>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />

//             <FormField
//               control={form.control}
//               name="phone"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>Phone</FormLabel>
//                   <FormControl>
//                     <Input placeholder="+12345678910" {...field} />
//                   </FormControl>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />

//             {/* Optional: Show organization field if role is ORGANIZER */}
//             {form.watch('role') === 'ORGANIZER' && (
//               <FormField
//                 control={form.control}
//                 name="organization"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel>Organization</FormLabel>
//                     <FormControl>
//                       <Input placeholder="Event Sphere" {...field} />
//                     </FormControl>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />
//             )}

//             <Button className="w-full bg-white text-black hover:bg-black hover:text-white" type="submit">
//               <Key className="mr-2" /> Register
//             </Button>
//           </form>
//         </Form>

//         {/* 👇 Correct link: back to login page */}
//         <Link to="/login" className='text-rose-950 mt-5'>Already have an account?</Link>
//       </div>

//       <Toaster />
//     </>
//   );
// };

// export default Register;
import React from 'react';
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
import { Key } from 'lucide-react';
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

  // ✅ Final onSubmit function with redirection to login
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const res = await axios.post('/api/users', values);
      if (res.status === 201) {
        toast({
          variant: "default",
          title: "Registration Successful",
          description: "You can now log in with your credentials.",
        });
        navigate('/login'); // ✅ Redirects to login after registration
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
      <div className="flex flex-col items-center justify-center h-screen">
        <Form {...form}>
          <form method='post' onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-96 bg-slate-900 text-white p-5 rounded-2xl">
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

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input placeholder="Password" type="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

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

            {/* Optional: Show organization field if role is ORGANIZER */}
            {form.watch('role') === 'ORGANIZER' && (
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

            <Button className="w-full bg-white text-black hover:bg-black hover:text-white" type="submit">
              <Key className="mr-2" /> Register
            </Button>
          </form>
        </Form>

        {/* 👇 Link to login page */}
        <Link to="/login" className='text-rose-950 mt-5'>Already have an account?</Link>
      </div>

      <Toaster />
    </>
  );
};

export default Register;
