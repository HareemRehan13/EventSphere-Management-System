import React, { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/Form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/Components/ui/Textarea';
import { CircleFadingArrowUp, Calendar as CalendarIcon } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useToast } from "@/hooks/use-toast";
import { Toaster } from '@/Components/ui/Toaster';
import { Calendar } from "@/Components/ui/Calendar";
import { Progress } from "@/Components/ui/Progress";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/Popover";
import { cn } from "@/lib/utils";

const formSchema = z.object({
  name: z.string().min(5).max(50),
  description: z.string().min(50).max(500),
  startDate: z.date(),
  endDate: z.date(),
  venue: z.string().min(5).max(50),
  organizerName: z.string().min(5).max(50),
  organizerContact: z.string().min(11).max(14),
  totalBooths: z.coerce.number().min(1),
  totalBoothsf2: z.coerce.number().min(0),
  totalBoothsf3: z.coerce.number().min(0),
});

const CreateExpoEvent = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [progress, setProgress] = useState(0);
  const [showProgress, setShowProgress] = useState(false);
  const [loading, setLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      startDate: new Date(),
      endDate: new Date(),
      venue: "",
      organizerName: "",
      organizerContact: "",
      totalBooths: 0,
      totalBoothsf2: 0,
      totalBoothsf3: 0
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);

    axios.post('/api/expos', values)
      .then(response => {
        if (response.status === 201) {
          setShowProgress(true);
          setProgress(0);
          const interval = setInterval(() => {
            setProgress(prev => {
              if (prev >= 100) {
                clearInterval(interval);
                toast({
                  variant: "default",
                  title: "Success",
                  description: "You have created an Expo event successfully",
                });
                navigate('/dashboard/allevents');
                setShowProgress(false);
                return 100;
              }
              return prev + 10;
            });
          }, 200);
        }
      })
      .catch(error => {
        toast({
          variant: "destructive",
          title: "Error",
          description: error.response?.data?.message || "An error occurred.",
        });
      });
  }

  return (
    <>
      <div className="min-h-screen bg-gradient-to-b from-black via-purple-900 to-black p-8 flex flex-col justify-center items-center">
        {loading ? (
          <div className='flex flex-col justify-center items-center space-y-4 h-screen'>
            <Progress className="w-full max-w-md" value={progress} />
            <h1 className="text-2xl font-semibold mb-6 text-center text-purple-300">Creating Event...</h1>
          </div>
        ) : (
          <>
            <h1 className="text-3xl font-bold mb-8 text-center text-purple-300 drop-shadow-lg">
              Create Expo Event
            </h1>
            <Form {...form}>
              <form
                method="post"
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-8 bg-black/70 backdrop-blur-md border border-purple-700 rounded-2xl p-6 w-full max-w-4xl shadow-lg"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Event Name */}
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-purple-300">Name</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Expo Event Name" 
                            {...field} 
                            className="bg-black/50 border-purple-600 focus:border-purple-400 focus:ring-purple-400 text-white placeholder-gray-400"
                          />
                        </FormControl>
                        <FormMessage className="text-pink-400"/>
                      </FormItem>
                    )}
                  />

                  {/* Venue */}
                  <FormField
                    control={form.control}
                    name="venue"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-purple-300">Venue</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Perl Continental Hotel" 
                            {...field} 
                            className="bg-black/50 border-purple-600 focus:border-purple-400 focus:ring-purple-400 text-white placeholder-gray-400"
                          />
                        </FormControl>
                        <FormMessage className="text-pink-400"/>
                      </FormItem>
                    )}
                  />

                  {/* Description */}
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem className="col-span-full">
                        <FormLabel className="text-purple-300">Description</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Describe your event here" 
                            {...field} 
                            className="bg-black/50 border-purple-600 focus:border-purple-400 focus:ring-purple-400 text-white placeholder-gray-400"
                          />
                        </FormControl>
                        <FormMessage className="text-pink-400"/>
                      </FormItem>
                    )}
                  />

                  {/* Start & End Dates */}
                  {["startDate", "endDate"].map((name) => (
                    <FormField
                      key={name}
                      control={form.control}
                      name={name as "startDate" | "endDate"}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-purple-300">{name === "startDate" ? "Start Date" : "End Date"}</FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant={"outline"}
                                  className={cn(
                                    "w-full justify-start text-left font-normal text-purple-200 hover:bg-purple-800/20",
                                    !field.value && "text-gray-400"
                                  )}
                                >
                                  <CalendarIcon className="mr-2 h-4 w-4" />
                                  {field.value ? field.value.toDateString() : "Pick a date"}
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0">
                              <Calendar
                                mode="single"
                                selected={field.value}
                                onSelect={field.onChange}
                                className="bg-black text-white border-purple-600"
                              />
                            </PopoverContent>
                          </Popover>
                          <FormMessage className="text-pink-400"/>
                        </FormItem>
                      )}
                    />
                  ))}

                  {/* Organizer Name & Contact */}
                  {["organizerName", "organizerContact"].map((name) => (
                    <FormField
                      key={name}
                      control={form.control}
                      name={name as "organizerName" | "organizerContact"}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-purple-300">
                            {name === "organizerName" ? "Organizer Name" : "Organizer Contact"}
                          </FormLabel>
                          <FormControl>
                            <Input 
                              placeholder={name === "organizerName" ? "Organizer Name" : "+1234567890"} 
                              {...field} 
                              className="bg-black/50 border-purple-600 focus:border-purple-400 focus:ring-purple-400 text-white placeholder-gray-400"
                            />
                          </FormControl>
                          <FormMessage className="text-pink-400"/>
                        </FormItem>
                      )}
                    />
                  ))}

                  {/* Booths */}
                  {["totalBooths", "totalBoothsf2", "totalBoothsf3"].map((name, idx) => (
                    <FormField
                      key={name}
                      control={form.control}
                      name={name as "totalBooths" | "totalBoothsf2" | "totalBoothsf3"}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-purple-300">
                            {idx === 0
                              ? "Total Booths on Ground Floor"
                              : idx === 1
                                ? "Total Booths on First Floor"
                                : "Total Booths on Second Floor"}
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="10"
                              type="number"
                              {...field}
                              className="bg-black/50 border-purple-600 focus:border-purple-400 focus:ring-purple-400 text-white placeholder-gray-400"
                            />
                          </FormControl>
                          <FormMessage className="text-pink-400"/>
                        </FormItem>
                      )}
                    />
                  ))}
                </div>

                {/* Submit Button */}
                <Button className="w-full bg-purple-700 text-white hover:bg-purple-800 hover:shadow-lg transition-all">
                  <CircleFadingArrowUp className="mr-2 h-4 w-4" /> Add Event
                </Button>
              </form>
            </Form>
            <Link to="/dashboard/allevents" className="text-purple-400 mt-5 hover:underline">
              Show All Events
            </Link>
          </>
        )}
      </div>
      <Toaster />
    </>
  );
};

export default CreateExpoEvent;
