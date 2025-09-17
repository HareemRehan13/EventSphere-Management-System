import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/Components/ui/Card";
import { Skeleton } from "@/Components/ui/Skeleton";

// Define Booth type
interface Booth {
  _id: string;
  boothNumber: string;
  expoId: {
    _id: string;
    name: string; 
  };
  floor: string;
  isBooked: boolean; 
}

const ShowAllBooth: React.FC = () => {
  const [booths, setBooths] = useState<Booth[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchBooths = async () => {
      try {
        const response = await axios.get("/api/booths");
        setBooths(response.data);
      } catch (error) {
        console.error("Error fetching booths:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchBooths();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-purple-900 to-black p-8">
      <h1 className="text-3xl font-bold mb-8 text-center text-purple-300 drop-shadow-lg">
        All Booths
      </h1>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, index) => (
            <Skeleton key={index} className="h-44 w-full rounded-2xl" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {booths.map((booth) => (
            <Card
              key={booth._id}
              className="bg-black/70 text-white shadow-xl border border-purple-700 rounded-2xl hover:scale-105 transition-transform duration-300 hover:shadow-2xl"
            >
              <CardHeader className="border-b border-purple-700 pb-2">
                <CardTitle className="text-lg text-purple-300">
                  Booth Number: {booth.boothNumber}
                </CardTitle>
                <CardDescription className="text-gray-300">
                  Event: <span className="font-semibold">{booth.expoId.name}</span>
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-2">
                <p className="text-sm">
                  Availability Status:{" "}
                  <span
                    className={`font-semibold ${
                      booth.isBooked ? "text-red-500" : "text-green-400"
                    }`}
                  >
                    {booth.isBooked ? "Booked" : "Available"}
                  </span>
                </p>
                <p className="text-sm">
                  Floor:{" "}
                  <span className="font-semibold">
                    {booth.floor === "F1"
                      ? "Ground Floor"
                      : booth.floor === "F2"
                      ? "First Floor"
                      : "Second Floor"}
                  </span>
                </p>
              </CardContent>

              <CardFooter className="text-gray-400 text-sm border-t border-purple-700 pt-2">
                Created At: {new Date().toLocaleDateString()} {/* You can replace with booth.createdAt if available */}
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default ShowAllBooth;
