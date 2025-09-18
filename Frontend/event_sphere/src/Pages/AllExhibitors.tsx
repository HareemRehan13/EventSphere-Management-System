import React, { useEffect, useState } from "react";
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Toaster } from "@/components/ui/toaster";
import { useToast } from "@/hooks/use-toast";

const AllExhibitors = () => {
  const { toast } = useToast();
  const [exhibitors, setExhibitors] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchExhibitors = async () => {
      try {
        const response = await axios.get("/api/all-exhibitor", {
          headers: { Authorization: `Bearer ${token}` },
        });

        // Only keep the fields we need
        const filteredData = response.data.map((ex) => ({
          _id: ex._id,
          name: ex.userId?.name || "N/A",
          company: ex.companyId?.companyName || null,
          address: ex.companyId?.companyAddress || "N/A",
          contact: ex.companyId?.companyContact || "N/A",
          email: ex.companyId?.companyEmail || "N/A",
          services: ex.companyId?.companyService || "N/A",
        }));

        setExhibitors(filteredData);
      } catch (error) {
        console.error("Error fetching exhibitors:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to fetch exhibitors.",
        });
      }
    };

    fetchExhibitors();
  }, [token, toast]);

  return (
    <>
      <div className="min-h-screen bg-gradient-to-b from-black via-purple-900 to-black p-6 text-white">
        <h1 className="text-3xl font-bold text-purple-400 text-center mb-8 drop-shadow-lg">
          All Exhibitors
        </h1>

        {exhibitors.length === 0 ? (
          <p className="text-center text-gray-300">No exhibitors found.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {exhibitors.map((exhibitor) => (
              <Card
                key={exhibitor._id}
                className="bg-black/70 backdrop-blur-md text-white shadow-xl rounded-2xl p-4 border border-purple-700 hover:scale-105 hover:shadow-2xl transition-transform duration-300"
              >
                <CardHeader>
                  <CardTitle className="text-xl font-bold text-purple-300">
                    {exhibitor.name} {exhibitor.company && `- ${exhibitor.company}`}
                  </CardTitle>
                </CardHeader>

                <CardContent className="space-y-1 text-gray-300">
                  <p><strong>Address:</strong> {exhibitor.address}</p>
                  <p><strong>Contact:</strong> {exhibitor.contact}</p>
                  <p><strong>Email:</strong> {exhibitor.email}</p>
                  <p><strong>Services:</strong> {exhibitor.services}</p>
                </CardContent>
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
