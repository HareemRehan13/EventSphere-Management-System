import React, { useEffect, useState } from 'react';
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
    FormMessage,
} from '@/components/ui/Form';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/Components/ui/Select';
import { Input } from '@/components/ui/input';
import { CircleFadingArrowUp } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useToast } from '@/hooks/use-toast';
import { Toaster } from '@/Components/ui/Toaster';

// Zod Schema Validation
const formSchema = z.object({
    boothNumber: z.string().min(4).max(4),
    expoId: z.string().nonempty('Please select an event'),
    floor: z.string().min(1).max(2),
});

const CreateBooth = () => {
    const { toast } = useToast();
    const navigate = useNavigate();
    const [expoEvents, setExpoEvents] = useState<Array<{ _id: string; name: string }>>([]);

    useEffect(() => {
        const fetchExpoEvents = async () => {
            try {
                const response = await axios.get('/api/expos');
                setExpoEvents(response.data);
            } catch (error) {
                console.error('Error fetching Expo Events: ', error);
                toast({
                    variant: 'destructive',
                    title: 'Error',
                    description: 'Failed to load Expo events.',
                });
            }
        };
        fetchExpoEvents();
    }, [toast]);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: { boothNumber: '', expoId: '', floor: '' },
    });

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            const response = await axios.post('/api/booths', values);
            if (response.status === 201) {
                toast({ variant: 'default', title: 'Success', description: 'Booth created successfully!' });
                navigate('/dashboard/allbooths');
            }
        } catch (err: any) {
            let errorMessage = "Failed to create a booth.";
            if (err.response?.data?.message) errorMessage = err.response.data.message;
            else if (err.message) errorMessage = err.message;

            toast({ variant: "destructive", title: "Error", description: errorMessage });
        }
    };

    return (
        <>
            <div className="min-h-screen flex flex-col justify-center items-center mx-auto px-4 bg-gradient-to-b from-black via-purple-900 to-black py-12">
                <h1 className="text-3xl font-bold mb-8 text-center text-purple-300 drop-shadow-lg">Create Booth</h1>

                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-8 bg-black/80 backdrop-blur-md text-white p-8 rounded-2xl shadow-2xl border border-purple-700 w-full max-w-4xl"
                    >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <FormField
                                control={form.control}
                                name="boothNumber"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Booth Number</FormLabel>
                                        <FormControl>
                                            <Input
                                                {...field}
                                                placeholder="5876"
                                                className="bg-gray-900 text-white border-purple-600 focus:border-purple-400 focus:ring-purple-400"
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="expoId"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Expo Event</FormLabel>
                                        <Select onValueChange={field.onChange} value={field.value}>
                                            <FormControl>
                                                <SelectTrigger className="bg-gray-900 text-white border-purple-600 focus:border-purple-400 focus:ring-purple-400">
                                                    <SelectValue placeholder="Select an event" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent className="bg-gray-900 text-white">
                                                {expoEvents.map(event => (
                                                    <SelectItem key={event._id} value={event._id}>
                                                        {event.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="floor"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Floor</FormLabel>
                                        <Select onValueChange={field.onChange} value={field.value}>
                                            <FormControl>
                                                <SelectTrigger className="bg-gray-900 text-white border-purple-600 focus:border-purple-400 focus:ring-purple-400">
                                                    <SelectValue placeholder="Select Floor" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent className="bg-gray-900 text-white">
                                                <SelectItem value="F1">Ground Floor</SelectItem>
                                                <SelectItem value="F2">First Floor</SelectItem>
                                                <SelectItem value="F3">Second Floor</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <Button
                            type="submit"
                            className="w-full bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-700 hover:to-purple-900 text-white font-bold shadow-lg hover:shadow-2xl transition-all duration-300 flex items-center justify-center gap-2"
                        >
                            <CircleFadingArrowUp /> Add Booth
                        </Button>
                    </form>
                </Form>

                <Link to="/dashboard/allbooths" className="mt-5 text-purple-400 hover:text-purple-200 transition-colors">
                    Show All Booths
                </Link>
            </div>
            <Toaster />
        </>
    );
};

export default CreateBooth;
