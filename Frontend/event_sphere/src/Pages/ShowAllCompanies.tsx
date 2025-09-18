import React, { useEffect, useState } from "react";
import axios from "axios";
import { Skeleton } from "@/Components/ui/Skeleton";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/Components/ui/Card";
import { Button } from "@/components/ui/button";
import { Trash2, Edit } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

interface Company {
  _id: string;
  name: string;
  description: string;
  companyName: string;
  companyDescription: string;
  companyService: string;
  companyEmail: string;
  companyContact: string;
  companyAddress: string;
  createdAt: string;
}

const ShowAllCompanies: React.FC = () => {
  const { toast } = useToast();
  const [Companies, setCompanies] = useState<Company[]>([]);
  const token = localStorage.getItem("token");
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const response = await axios.get("/api/get-companies-by-exhibitor", {
          headers: { 
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}` 
          }
        });

        setCompanies(response.data);
      } catch (error) {
        console.error("Error fetching companies:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCompanies();
  }, [token]);

  const handleDelete = async (companyId: string) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this company?");
    if (confirmDelete) {
      try {
        await axios.delete(`/api/delete-company/${companyId}`, {
          headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` }
        });

        setCompanies(Companies.filter((company) => company._id !== companyId));
        toast({
          variant: "default",
          title: "Success",
          description: "Company deleted successfully",
        });
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to delete company",
        });
      }
    }
  };

  const handleEdit = (companyId: string) => {
    navigate(`/dashboard/editcompany/${companyId}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-purple-900 to-black py-12 px-4">
      <div className="container mx-auto">
        <h1 className="text-3xl font-bold text-center text-purple-300 mb-8 drop-shadow-lg">All Companies</h1>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, index) => (
              <Skeleton key={index} className="h-52 w-full rounded-2xl shadow-lg" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {Companies.map((company) => (
              <Card key={company._id} className="bg-black/80 backdrop-blur-md border border-purple-700 shadow-2xl rounded-2xl text-white transition-all hover:scale-105 hover:shadow-purple-600">
                <CardHeader className="relative">
                  <div className="absolute right-4 top-4 flex flex-col space-y-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="p-2 text-red-500 hover:text-red-400"
                      onClick={() => handleDelete(company._id)}
                    >
                      <Trash2 className="h-5 w-5" />
                    </Button>

                    <Button
                      variant="ghost"
                      size="icon"
                      className="p-2 text-purple-400 hover:text-purple-300"
                      onClick={() => handleEdit(company._id)}
                    >
                      <Edit className="h-5 w-5" />
                    </Button>
                  </div>

                  <CardTitle className="text-xl font-semibold text-purple-300">{company.name}</CardTitle>
                  <CardDescription className="break-words whitespace-normal overflow-hidden text-purple-100">
                    {company.description}
                  </CardDescription>
                </CardHeader>

                <CardContent className="space-y-1 text-sm text-purple-100">
                  <p><span className="font-semibold text-purple-300">Company Name:</span> {company.companyName}</p>
                  <p><span className="font-semibold text-purple-300">Description:</span> {company.companyDescription}</p>
                  <p><span className="font-semibold text-purple-300">Service:</span> {company.companyService}</p>
                  <p><span className="font-semibold text-purple-300">Email:</span> {company.companyEmail}</p>
                  <p><span className="font-semibold text-purple-300">Contact:</span> {company.companyContact}</p>
                  <p><span className="font-semibold text-purple-300">Address:</span> {company.companyAddress}</p>
                </CardContent>

                <CardFooter className="flex justify-between text-sm border-t border-purple-700 pt-2 text-purple-200">
                  <span>
                    <span className="font-semibold text-purple-300">Created At:</span>{" "}
                    {new Date(company.createdAt).toLocaleDateString()}
                  </span>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ShowAllCompanies;
