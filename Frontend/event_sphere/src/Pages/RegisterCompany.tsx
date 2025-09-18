import React, { useEffect, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/Components/ui/Select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/Form';
import { Input } from '@/components/ui/input';
import { Textarea } from "@/Components/ui/textarea";
import { Send } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useToast } from "@/hooks/use-toast";
import { Toaster } from '@/Components/ui/Toaster';

const formSchema = z.object({
  companyName: z.string().min(5).max(50),
  companyDescription: z.string().max(500).optional(),
  companyEmail: z.string().email(),
  companyContact: z.string().min(11).max(14),
  companyAddress: z.string().max(50),
  companyService: z.string().max(50),
  requireDocument: z.union([z.instanceof(File), z.undefined()]).optional(),
  expoId: z.string().min(1, "Expo is required"),
  boothId: z.string().optional(),
});

const RegisterCompany = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [expoId, setExpoId] = useState("");
  const [booths, setBooths] = useState<Array<{ _id: string; boothNumber: string; assignedTo: string | null; booked: boolean }>>([]);
  const [expoList, setExpoList] = useState<Array<{ _id: string; name: string }>>([]);

  useEffect(() => {
    axios.get('/api/expos', { headers: { Authorization: `Bearer ${token}` } })
      .then(res => setExpoList(res.data))
      .catch(err => console.error("Error fetching expos:", err));
  }, [token]);

  useEffect(() => {
    if (expoId) {
      axios.get(`/api/expos/${expoId}/booths`, { headers: { Authorization: `Bearer ${token}` } })
        .then(res => setBooths(res.data))
        .catch(err => console.error("Error fetching booths:", err));
    } else {
      setBooths([]);
    }
  }, [expoId, token]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      companyName: "",
      companyDescription: "",
      companyEmail: "",
      companyContact: "",
      companyAddress: "",
      companyService: "",
      requireDocument: undefined,
      expoId: "",
      boothId: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const formData = new FormData();
      formData.append("companyName", values.companyName);
      formData.append("companyDescription", values.companyDescription || "");
      formData.append("companyEmail", values.companyEmail);
      formData.append("companyContact", values.companyContact);
      formData.append("companyAddress", values.companyAddress);
      formData.append("companyService", values.companyService);
      formData.append("expoId", values.expoId);
      if (values.boothId) formData.append("boothId", values.boothId);
      if (values.requireDocument instanceof File) formData.append("requireDocument", values.requireDocument);

      const response = await axios.post("/api/register-company", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      const companyId = response?.data?.company?._id;

      toast({
        variant: "default",
        title: "Company Registered",
        description: "Company Registered Successfully.",
      });

      navigate("/dashboard/exhibitor", { state: { companyId } });

    } catch (error: any) {
      console.error("Registration error:", error.response?.data || error.message || error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.response?.data?.message || "An unexpected error occurred.",
      });
    }
  };

  return (
    <>
      <div className="min-h-screen flex flex-col justify-center items-center mx-auto px-4 bg-gradient-to-b from-black via-purple-900 to-black py-12">
        <h1 className="text-3xl font-bold mb-8 text-center text-purple-300 drop-shadow-lg">Register Company</h1>
        <p className="capitalize font-semibold mb-8 text-center text-purple-100 max-w-3xl">
          As an exhibitor, your first step is to create a company profile. Once your company is registered, you can proceed to book booths for your company in the desired expos.
        </p>

        <Form {...form}>
          <form
            method="post"
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-8 bg-black/80 backdrop-blur-md text-white p-8 rounded-2xl shadow-2xl border border-purple-700 w-full max-w-4xl"
            encType="multipart/form-data"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Company Name */}
              <FormField control={form.control} name="companyName" render={({ field }) => (
                <FormItem>
                  <FormLabel>Company Name</FormLabel>
                  <FormControl>
                    <Input placeholder="IBEX ...." {...field} className="bg-gray-900 text-white border-purple-600 focus:border-purple-400 focus:ring-purple-400"/>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />

              {/* Company Address */}
              <FormField control={form.control} name="companyAddress" render={({ field }) => (
                <FormItem>
                  <FormLabel>Company Official Address</FormLabel>
                  <FormControl>
                    <Input placeholder="Sector ...." {...field} className="bg-gray-900 text-white border-purple-600 focus:border-purple-400 focus:ring-purple-400"/>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />

              {/* Company Description */}
              <FormField control={form.control} name="companyDescription" render={({ field }) => (
                <FormItem className="col-span-full">
                  <FormLabel>Company Description</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Enter Description Here..." {...field} className="bg-gray-900 text-white border-purple-600 focus:border-purple-400 focus:ring-purple-400"/>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />

              {/* Email */}
              <FormField control={form.control} name="companyEmail" render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="john.doe@example.com" {...field} className="bg-gray-900 text-white border-purple-600 focus:border-purple-400 focus:ring-purple-400"/>
                  </FormControl>
                  <FormDescription>Please enter your email</FormDescription>
                  <FormMessage />
                </FormItem>
              )} />

              {/* Organizer Contact */}
              <FormField control={form.control} name="companyContact" render={({ field }) => (
                <FormItem>
                  <FormLabel>Organizer Contact</FormLabel>
                  <FormControl>
                    <Input placeholder="+1234567890" {...field} className="bg-gray-900 text-white border-purple-600 focus:border-purple-400 focus:ring-purple-400"/>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />

              {/* Company Services */}
              <FormField control={form.control} name="companyService" render={({ field }) => (
                <FormItem>
                  <FormLabel>Company/Org Services</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className="bg-gray-900 text-white border-purple-600 focus:border-purple-400 focus:ring-purple-400">
                        <SelectValue placeholder="Select a Service" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="bg-gray-900 text-white">
                      <SelectItem value="WEB_DEVELOPMENT">Web Development</SelectItem>
                      <SelectItem value="MOBILE_APP_DEVELOPMENT">Mobile App Development</SelectItem>
                      <SelectItem value="UI_UX_DESIGN">UI/UX Design</SelectItem>
                      <SelectItem value="DIGITAL_MARKETING">Digital Marketing</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )} />

              {/* Select Expo */}
              <FormField control={form.control} name="expoId" render={({ field }) => (
                <FormItem>
                  <FormLabel>Select Expo</FormLabel>
                  <Select
                    onValueChange={(value) => {
                      field.onChange(value);
                      setExpoId(value);
                    }}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="bg-gray-900 text-white border-purple-600 focus:border-purple-400 focus:ring-purple-400">
                        <SelectValue placeholder="Select an Expo" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="bg-gray-900 text-white">
                      {expoList.map((expo) => (
                        <SelectItem key={expo._id} value={expo._id}>{expo.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )} />

              {/* Select Booth */}
              <FormField control={form.control} name="boothId" render={({ field }) => (
                <FormItem>
                  <FormLabel>Select a Booth</FormLabel>
                  <Select
                    value={field.value || ""}
                    onValueChange={(value) => field.onChange(value)}
                    disabled={!booths.length}
                  >
                    <FormControl>
                      <SelectTrigger className="bg-gray-900 text-white border-purple-600 focus:border-purple-400 focus:ring-purple-400">
                        <SelectValue placeholder="Select a Booth" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="bg-gray-900 text-white">
                      {booths.map((b) => (
                        <SelectItem key={b._id} value={b._id}>
                          {b.boothNumber} — Assigned: {b.assignedTo || "Nobody"} — Booked: {b.booked ? "Yes" : "No"}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )} />

              {/* Require Document */}
              <FormField control={form.control} name="requireDocument" render={({ field }) => (
                <FormItem>
                  <FormLabel>Official Document</FormLabel>
                  <FormControl>
                    <Input
                      className="bg-white text-black hover:cursor-pointer"
                      type="file"
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) field.onChange(e.target.files[0]);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />
            </div>

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-700 hover:to-purple-900 text-white font-bold shadow-lg hover:shadow-2xl transition-all duration-300 flex items-center justify-center gap-2"
            >
              <Send /> Save Company
            </Button>
          </form>
        </Form>
      </div>

      <Toaster />
    </>
  );
};

export default RegisterCompany;
