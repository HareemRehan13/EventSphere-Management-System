import React, { useEffect, useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Toaster } from "@/components/ui/toaster";
import { useToast } from "@/hooks/use-toast";

const AllExhibitors = () => {
  const { toast } = useToast();
  const [requests, setRequests] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const response = await axios.get('/api/exhibitor', {
          params: { isAccepted: true },
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}` 
          }
        });
        setRequests(response.data);
      } catch (error) {
        console.error('Error fetching requests:', error);
        toast({ variant: "destructive", title: "Error", description: "Failed to fetch exhibitors." });
      }
    };

    fetchRequests();
  }, [token, toast]);

  const ContactInfoGet = async (requestId) => {
    try {
      const response = await axios.get(
        `/api/exhibitor/contact-info-exchange/${requestId}`,
        { 
          params: { isAccepted: true },
          headers: { 'Authorization': `Bearer ${token}` }
        }
      );
      console.log(response);
      toast({
        variant: "success",
        title: "Contact Received Successfully",
        description: `Please check your email for the contact information.`,
      });
    } catch (error) {
      console.error('Error:', error);
      toast({ variant: "destructive", title: "Error", description: "Failed to get contact info." });
    }
  };

  return (
    <>
      <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 p-6">
        <h1 className="text-3xl font-bold text-purple-400 text-center mb-8">All Companies Registered For Expos</h1>

        {requests.length === 0 ? (
          <p className="text-center text-gray-300">No exhibitors found.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {requests.map((request) => (
              <Card key={request._id} className="bg-gray-800 text-white rounded-2xl shadow-lg hover:shadow-purple-600/50 transition-all duration-300">
                <CardHeader>
                  <CardTitle className="text-xl font-bold text-purple-300">{request.companyId.companyName}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <p><strong>Description:</strong> {request.companyId.companyDescription}</p>
                  <p><strong>Booth No:</strong> {request.boothId.boothNumber}</p>
                  <p><strong>Product:</strong> {request.productName}</p>
                  <p><strong>Product Description:</strong> {request.productDescription}</p>
                  <p><strong>Created At:</strong> {new Date(request.createdAt).toLocaleDateString()}</p>
                  <p><strong>Created By:</strong> {request.userId.name}</p>
                </CardContent>
                <CardFooter className="flex justify-center p-4">
                  <Button
                    className="bg-green-500 w-full hover:bg-green-600 text-white font-semibold py-2 rounded-lg transition-all duration-200"
                    onClick={() => ContactInfoGet(request._id)}
                  >
                    Share Contact Info
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>

      <Toaster />
    </>
  );
};

export default AllExhibitors;
