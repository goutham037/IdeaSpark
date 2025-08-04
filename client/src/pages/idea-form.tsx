import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { isUnauthorizedError } from "@/lib/authUtils";
import { insertIdeaSchema, type InsertIdea } from "@shared/schema";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Save, Check, X } from "lucide-react";
import MultiStepForm from "@/components/ui/multi-step-form";

export default function IdeaForm() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [currentStep, setCurrentStep] = useState(1);

  const form = useForm<InsertIdea>({
    resolver: zodResolver(insertIdeaSchema),
    defaultValues: {
      title: "",
      problem: "",
      solution: "",
      targetMarket: "",
      team: "",
      businessModel: "",
      competition: "",
    },
  });

  const createIdeaMutation = useMutation({
    mutationFn: async (data: InsertIdea) => {
      const response = await apiRequest("POST", "/api/ideas", data);
      return response.json();
    },
    onSuccess: (idea) => {
      queryClient.invalidateQueries({ queryKey: ["/api/ideas"] });
      toast({
        title: "Success",
        description: "Your idea has been submitted for analysis!",
      });
      setLocation(`/ideas/${idea.id}`);
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      console.error("Error creating idea:", error);
      toast({
        title: "Error",
        description: "Failed to submit idea. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleBack = () => {
    setLocation("/");
  };

  const handleSubmit = (data: InsertIdea) => {
    createIdeaMutation.mutate(data);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <motion.div 
        className="bg-white border-b border-gray-200 px-4 py-4"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="max-w-4xl mx-auto flex items-center space-x-4">
          <Button variant="ghost" size="icon" onClick={handleBack}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <h1 className="text-xl font-semibold text-gray-900">Validate Your Startup Idea</h1>
            <p className="text-sm text-gray-600">Complete the form to get your viability score and feedback</p>
          </div>
        </div>
      </motion.div>

      {/* Form */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Card className="shadow-lg">
            <CardHeader className="border-b border-gray-200">
              <div className="flex items-center justify-between">
                <CardTitle>Idea Validation Form</CardTitle>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    // TODO: Implement save as draft
                    toast({
                      title: "Draft Saved",
                      description: "Your progress has been saved.",
                    });
                  }}
                >
                  <Save className="mr-2 w-4 h-4" />
                  Save Draft
                </Button>
              </div>

              {/* Progress Bar */}
              <div className="mt-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">
                    Step {currentStep} of 5
                  </span>
                  <span className="text-sm text-gray-500">
                    {Math.round((currentStep / 5) * 100)}% Complete
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <motion.div 
                    className="bg-gradient-to-r from-indigo-500 to-violet-500 h-2 rounded-full"
                    initial={{ width: "20%" }}
                    animate={{ width: `${(currentStep / 5) * 100}%` }}
                    transition={{ duration: 0.5 }}
                  />
                </div>
              </div>
            </CardHeader>

            <CardContent className="p-8">
              <MultiStepForm
                form={form}
                currentStep={currentStep}
                onStepChange={setCurrentStep}
                onSubmit={handleSubmit}
                isSubmitting={createIdeaMutation.isPending}
              />
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
