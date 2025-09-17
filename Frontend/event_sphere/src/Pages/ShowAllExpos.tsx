import React, { useEffect, useState } from "react";
import axios from "axios";
import { Skeleton } from "@/Components/ui/Skeleton";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/Components/ui/Card";
import { Button } from "@/components/ui/button";
import { Trash2, Edit } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

interface ExpoEvents {
  _id: string;
  name: string;
  description: string;
  startDate: Date;
  endDate: Date;
  venue: string;
  organizerName: string;
  organizerContact: string;
  totalBooths: number;
  totalBooths2: number;  
  totalBooths3: number;  
}

const ShowAllExpos: React.FC = () => {
  const [expos, setExpos] = useState<ExpoEvents[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchExpos = async () => {
      try {
        const response = await axios.get("/api/expos");
        setExpos(response.data);
      } catch (error) {
        console.error("Error fetching expos:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchExpos();
  }, []);

  const handleDelete = async (expoId: string) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this event?");
    if (confirmDelete) {
      try {
        await axios.delete(`/api/expos/${expoId}`);
        setExpos(expos.filter((expo) => expo._id !== expoId));
        toast({
          variant: "default",
          title: "Success",
          description: "Event deleted successfully",
        });
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to delete event",
        });
      }
    }
  };

  const handleEdit = (expoId: string) => {
    navigate(`/dashboard/editexpo/${expoId}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-purple-900 to-black p-8">
      <h1 className="text-3xl font-bold mb-8 text-center text-purple-300 drop-shadow-lg">
        All Events
      </h1>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, index) => (
            <Skeleton key={index} className="h-48 w-full rounded-lg bg-purple-800/30 animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {expos.map((expo) => (
            <Card
              key={expo._id}
              className="shadow-lg rounded-xl bg-black/70 border border-purple-700 text-white hover:scale-105 hover:shadow-2xl transition-all duration-300"
            >
              <CardHeader className="relative">
                <div className="absolute right-4 top-4 flex flex-col space-y-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="p-2 text-red-500 hover:text-red-400 hover:bg-red-900/20 transition"
                    onClick={() => handleDelete(expo._id)}
                  >
                    <Trash2 className="h-5 w-5" />
                  </Button>

                  <Button
                    variant="ghost"
                    size="icon"
                    className="p-2 text-purple-400 hover:text-purple-300 hover:bg-purple-900/20 transition"
                    onClick={() => handleEdit(expo._id)}
                  >
                    <Edit className="h-5 w-5" />
                  </Button>
                </div>

                <CardTitle className="text-lg font-semibold text-purple-200">{expo.name}</CardTitle>
                <CardDescription className="break-words whitespace-normal overflow-hidden text-gray-300">
                  {expo.description}
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-1">
                <p className="text-sm text-gray-300">
                  <span className="font-semibold text-purple-300">Venue:</span> {expo.venue}
                </p>
                <p className="text-sm text-gray-300">
                  <span className="font-semibold text-purple-300">Organizer Name:</span> {expo.organizerName}
                </p>
                <p className="text-sm text-gray-300">
                  <span className="font-semibold text-purple-300">Organizer Contact:</span> {expo.organizerContact}
                </p>
                <p className="text-sm text-gray-300">
                  <span className="font-semibold text-purple-300">Total Booths:</span>{" "}
                  {expo.totalBooths + expo.totalBooths2 + expo.totalBooths3}
                </p>
              </CardContent>

              <CardFooter className="flex justify-between text-sm border-t border-purple-700 pt-2 text-gray-300">
                <span>
                  <span className="font-semibold text-purple-300">Start Date:</span>{" "}
                  {new Date(expo.startDate).toLocaleDateString()}
                </span>
                <span>
                  <span className="font-semibold text-purple-300">End Date:</span>{" "}
                  {new Date(expo.endDate).toLocaleDateString()}
                </span>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default ShowAllExpos;
