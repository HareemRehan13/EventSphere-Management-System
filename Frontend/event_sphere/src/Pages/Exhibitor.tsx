import React, { useEffect, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/Components/ui/Select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/Form';
import { Input } from '@/components/ui/input';
import { Send } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { useToast } from "@/hooks/use-toast";
import { Toaster } from '@/Components/ui/Toaster';
import { Textarea } from "@/Components/ui/textarea";
import Modal from "react-modal";

const formSchema = z.object({
  productName: z.string().min(2).max(50),
  productDescription: z.string().max(500),
  expoId: z.string(),
  companyId: z.string().nonempty("Company is required"),
});

const Exhibitor: React.FC = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const token = localStorage.getItem("token");

  const [expos, setExpos] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [booths, setBooths] = useState([]);
  const [selectedBooth, setSelectedBooth] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const registeredCompanyId = location.state?.companyId;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      productName: "",
      productDescription: "",
      expoId: "",
      companyId: registeredCompanyId || "",
    },
  });

  useEffect(() => {
    const fetchExpos = async () => {
      try {
        const res = await axios.get("/api/expos", {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        setExpos(res.data);
      } catch (err) {
        toast({ variant: "destructive", title: "Error", description: "Failed to fetch expos." });
      }
    };

    const fetchCompanies = async () => {
      try {
        const res = await axios.get("/api/get-companies-by-exhibitor", {
          headers: { "Authorization": `Bearer ${token}` },
        });
        setCompanies(res.data);
      } catch (err) {
        toast({ variant: "destructive", title: "Error", description: "Failed to fetch companies." });
      }
    };

    fetchExpos();
    fetchCompanies();
  }, [token, toast]);

  const fetchBooths = async (expoId: string) => {
    try {
      const res = await axios.get(`/api/booths/${expoId}`);
      setBooths(res.data);
    } catch (err) {
      toast({ variant: "destructive", title: "Error", description: "Failed to fetch booths." });
    }
  };

  const onBoothSubmit = async () => {
    if (!selectedBooth) {
      toast({ variant: "destructive", title: "Error", description: "Please select a booth before saving." });
      return;
    }
    try {
      const values = form.getValues();
      const payload = {
        ...values,
        boothId: selectedBooth._id,
        productDescription: values.productDescription?.toLowerCase() || "",
      };
      await axios.post('/api/exhibitor', payload, { headers: { 'Authorization': `Bearer ${token}` } });
      toast({ variant: "default", title: "Success", description: "Your booth request has been submitted. Wait for admin approval." });
      setIsModalOpen(false);
      fetchBooths(selectedBooth.expoId);
    } catch (err: any) {
      toast({ variant: "destructive", title: "Error", description: err.response?.data?.message || "Something went wrong." });
    }
  };

  const onSubmit = async (values: any) => {
    if (!values.expoId) {
      toast({ variant: "destructive", title: "Error", description: "Please select an Expo." });
      return;
    }
    await fetchBooths(values.expoId);
    setIsModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-purple-900 to-black p-8 flex flex-col items-center">
      <h1 className="text-3xl font-bold text-purple-300 mb-4 drop-shadow-lg">Register For Booths</h1>
      <p className="text-gray-300 text-center mb-2">
        You've successfully registered your company! Next, select an expo to showcase your products and book a booth by clicking 'Get Booths'.
      </p>
      <p className="text-gray-300 text-center mb-6">
        Remember, you must wait for admin approval for your selected booth. Once approved, you'll receive an email at your company email address, and your company card will appear in the listings.
      </p>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="w-full max-w-4xl p-10 bg-black/50 backdrop-blur-md rounded-3xl shadow-2xl space-y-6 border border-purple-700">
          
          {/* Company Select */}
          <FormField
            control={form.control}
            name="companyId"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-purple-300">Your Company</FormLabel>
                <FormControl>
                  <Select onValueChange={field.onChange} value={field.value} className="bg-black/40 border border-purple-500 text-white rounded-xl">
                    <SelectTrigger>
                      <SelectValue placeholder="Select your company" />
                    </SelectTrigger>
                    <SelectContent className="bg-black/60 text-white backdrop-blur-md">
                      {companies.map(c => <SelectItem key={c._id} value={c._id} className="hover:bg-purple-600">{c.companyName}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Expo Select */}
          <FormField
            control={form.control}
            name="expoId"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-purple-300">Expo</FormLabel>
                <FormControl>
                  <Select onValueChange={field.onChange} value={field.value} className="bg-black/40 border border-purple-500 text-white rounded-xl">
                    <SelectTrigger>
                      <SelectValue placeholder="Select an Expo" />
                    </SelectTrigger>
                    <SelectContent className="bg-black/60 text-white backdrop-blur-md">
                      {expos.map(e => <SelectItem key={e._id} value={e._id} className="hover:bg-purple-600">{e.name}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Product Name */}
          <FormField
            control={form.control}
            name="productName"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-purple-300">Product Name</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Enter product name" className="bg-black/40 border border-purple-500 text-white rounded-xl" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Product Description */}
          <FormField
            control={form.control}
            name="productDescription"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-purple-300">Product Description</FormLabel>
                <FormControl>
                  <Textarea {...field} placeholder="Enter product description..." className="bg-black/40 border border-purple-500 text-white rounded-xl" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex justify-end">
            <Button type="submit" className="flex items-center gap-2 bg-purple-500 hover:bg-purple-600 text-white font-semibold w-full sm:w-auto justify-center">
              <Send /> Save
            </Button>
          </div>
        </form>
      </Form>

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
        className="bg-black/50 backdrop-blur-md rounded-3xl p-8 w-full max-w-5xl mx-auto mt-16 shadow-2xl border border-purple-700 outline-none"
        overlayClassName="fixed inset-0 bg-black/70 flex justify-center items-start z-50"
      >
        <h2 className="text-2xl font-bold mb-6 text-purple-300 text-center drop-shadow-lg">Select a Booth</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {booths.map(booth => (
            <div
              key={booth._id}
              className={`p-4 border rounded-2xl cursor-pointer transition transform hover:scale-105 hover:shadow-lg backdrop-blur-md
                ${selectedBooth?._id === booth._id ? "bg-purple-600 text-white border-purple-400" : "bg-black/40 text-gray-300 border-gray-700"}`}
              onClick={() => setSelectedBooth(booth)}
            >
              <h3 className="text-lg font-semibold">{booth.boothNumber}</h3>
              <p><strong>Assigned to:</strong> {booth.Assignedto || "Nobody"}</p>
              <p><strong>Booked:</strong> {booth.isBooked ? "Yes" : "No"}</p>
            </div>
          ))}
        </div>
        <div className="flex justify-end mt-6 space-x-3">
          <Button onClick={onBoothSubmit} className="bg-purple-500 hover:bg-purple-600 text-white">Save Booth</Button>
          <Button onClick={() => setIsModalOpen(false)} className="bg-red-500 hover:bg-red-600 text-white">Cancel</Button>
        </div>
      </Modal>

      <Toaster />
    </div>
  );
};

export default Exhibitor;
