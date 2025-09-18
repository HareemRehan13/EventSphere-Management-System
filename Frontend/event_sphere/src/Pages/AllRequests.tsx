import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/Components/ui/Card';
import { Toaster } from '@/Components/ui/Toaster';
import { useToast } from "@/hooks/use-toast";

const AllRequests = () => {
  const { toast } = useToast();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const response = await axios.get('/api/exhibitor', { 
          headers: { 
            'Content-Type': 'application/json', 
            'Authorization': `Bearer ${token}` 
          } 
        });
        setRequests(response.data);
      } catch (error) {
        console.error('Error fetching requests:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, []);

  const handleAccept = async (requestId, boothId) => {
    try {
      await axios.put(`/api/exhibitor/${requestId}`, { isAccepted: true }, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      await axios.put(`/api/boothBooked/${boothId}`, { isBooked: true }, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      toast({
        variant: "success",
        title: "Request Accepted Successfully",
        description: `Exhibitor has been accepted successfully.`,
      });
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleReject = async (requestId, boothId) => {
    try {
      await axios.put(`/api/exhibitor/${requestId}`, { isAccepted: false }, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      await axios.put(`/api/boothBooked/${boothId}`, { isBooked: false, isTemporaryBooked: false }, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      toast({
        variant: "danger",
        title: "Request Rejected Successfully",
        description: `Exhibitor has been rejected successfully.`,
      });
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-purple-900 to-black p-8">
      <h1 className="text-3xl font-bold mb-8 text-center text-purple-300 drop-shadow-lg">
        All Company Booth Requests
      </h1>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="h-64 w-full rounded-2xl bg-gray-800 animate-pulse"></div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {requests.map((request) => (
            <Card
              key={request._id}
              className="bg-black/70 text-white shadow-xl border border-purple-700 rounded-2xl hover:scale-105 transition-transform duration-300 hover:shadow-2xl"
            >
              <CardHeader className="border-b border-purple-700 pb-2">
                <CardTitle className="text-lg text-purple-300">{request.companyId.companyName}</CardTitle>
              </CardHeader>

              <CardContent className="space-y-2">
                <p className="text-sm">
                  <strong>Company Description:</strong> {request.companyId.companyDescription}
                </p>
                <p className="text-sm">
                  <strong>Booth No:</strong> {request.boothId.boothNumber} 
                  {request.requestByAnotherCompany ? ' (Requested by another company)' : ''}
                </p>
                <p className="text-sm">
                  <strong>Product Name:</strong> {request.productName}
                </p>
                <p className="text-sm">
                  <strong>Product Description:</strong> {request.productDescription}
                </p>
                <p className="text-sm p-3">
                  <strong>Required Document:</strong>
                  <img 
                    className="p-2 h-auto max-w-full rounded-lg blur-sm hover:blur-none transition-all duration-300"
                    src={request.companyId.requireDocument} 
                    alt="Document" 
                  />
                </p>
                <p className="text-sm text-gray-400">
                  <strong>Created At:</strong> {new Date(request.createdAt).toLocaleDateString()}
                </p>
              </CardContent>

              <CardFooter className="flex justify-between p-4">
                <Button
                  className='w-full bg-green-500 text-white hover:bg-green-600 py-2 px-4 rounded'
                  onClick={() => handleAccept(request._id, request.boothId._id)}
                >
                  Accept
                </Button>
                <Button
                  className='w-full bg-red-500 text-white hover:bg-red-600 py-2 px-4 rounded'
                  onClick={() => handleReject(request._id, request.boothId._id)}
                >
                  Reject
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      <Toaster />
    </div>
  );
};

export default AllRequests;
