import { useState } from "react";
import { UseFormReturn } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight, Check, Save } from "lucide-react";
import type { InsertIdea } from "@shared/schema";

interface MultiStepFormProps {
  form: UseFormReturn<InsertIdea>;
  currentStep: number;
  onStepChange: (step: number) => void;
  onSubmit: (data: InsertIdea) => void;
  isSubmitting: boolean;
}

const steps = [
  {
    id: 1,
    title: "What problem are you solving?",
    description: "Clearly define the pain point your startup addresses",
  },
  {
    id: 2,
    title: "What's your solution?",
    description: "Describe how you plan to solve the problem",
  },
  {
    id: 3,
    title: "Who is your target market?",
    description: "Define your ideal customers and market size",
  },
  {
    id: 4,
    title: "How will you make money?",
    description: "Define your revenue model and pricing strategy",
  },
  {
    id: 5,
    title: "Competition & Team",
    description: "Analyze your competitive landscape and team capabilities",
  },
];

export default function MultiStepForm({ 
  form, 
  currentStep, 
  onStepChange, 
  onSubmit, 
  isSubmitting 
}: MultiStepFormProps) {
  const [charCounts, setCharCounts] = useState<Record<string, number>>({});

  const updateCharCount = (field: string, value: string, maxLength: number) => {
    setCharCounts(prev => ({ ...prev, [field]: value.length }));
    return value.length <= maxLength;
  };

  const nextStep = () => {
    if (currentStep < 5) {
      onStepChange(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      onStepChange(currentStep - 1);
    }
  };

  const handleSubmit = () => {
    form.handleSubmit(onSubmit)();
  };

  const stepVariants = {
    hidden: { opacity: 0, x: 50 },
    visible: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -50 }
  };

  return (
    <div className="space-y-8">
      {/* Step Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          variants={stepVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          transition={{ duration: 0.3 }}
        >
          <div className="mb-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {steps[currentStep - 1].title}
            </h3>
            <p className="text-gray-600">{steps[currentStep - 1].description}</p>
          </div>

          {/* Step 1: Problem Definition */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div>
                <Label htmlFor="title" className="text-sm font-medium text-gray-700 mb-2 block">
                  Idea Title *
                </Label>
                <Input
                  id="title"
                  placeholder="Give your idea a catchy name..."
                  {...form.register("title")}
                  className="transition-all duration-300 focus:scale-105"
                />
                {form.formState.errors.title && (
                  <p className="text-red-500 text-sm mt-1">{form.formState.errors.title.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="problem" className="text-sm font-medium text-gray-700 mb-2 block">
                  Problem Statement *
                </Label>
                <Textarea
                  id="problem"
                  placeholder="Describe the specific problem you're addressing..."
                  className="h-32 resize-none transition-all duration-300 focus:scale-105"
                  {...form.register("problem", {
                    onChange: (e) => updateCharCount("problem", e.target.value, 500)
                  })}
                />
                <div className="flex justify-between items-center mt-2">
                  <span className="text-sm text-gray-500">
                    Be specific about who experiences this problem and how often
                  </span>
                  <span className={`text-sm ${
                    (charCounts.problem || 0) > 450 ? "text-red-500" : "text-gray-400"
                  }`}>
                    {charCounts.problem || 0}/500
                  </span>
                </div>
                {form.formState.errors.problem && (
                  <p className="text-red-500 text-sm mt-1">{form.formState.errors.problem.message}</p>
                )}
              </div>
            </div>
          )}

          {/* Step 2: Solution */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div>
                <Label htmlFor="solution" className="text-sm font-medium text-gray-700 mb-2 block">
                  Solution Description *
                </Label>
                <Textarea
                  id="solution"
                  placeholder="Explain your proposed solution in detail..."
                  className="h-32 resize-none transition-all duration-300 focus:scale-105"
                  {...form.register("solution", {
                    onChange: (e) => updateCharCount("solution", e.target.value, 500)
                  })}
                />
                <div className="flex justify-between items-center mt-2">
                  <span className="text-sm text-gray-500">
                    Focus on the unique value proposition and key features
                  </span>
                  <span className={`text-sm ${
                    (charCounts.solution || 0) > 450 ? "text-red-500" : "text-gray-400"
                  }`}>
                    {charCounts.solution || 0}/500
                  </span>
                </div>
                {form.formState.errors.solution && (
                  <p className="text-red-500 text-sm mt-1">{form.formState.errors.solution.message}</p>
                )}
              </div>
            </div>
          )}

          {/* Step 3: Target Market */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div>
                <Label htmlFor="targetMarket" className="text-sm font-medium text-gray-700 mb-2 block">
                  Target Audience *
                </Label>
                <Textarea
                  id="targetMarket"
                  placeholder="Describe your ideal customers, their demographics, and characteristics..."
                  className="h-24 resize-none transition-all duration-300 focus:scale-105"
                  {...form.register("targetMarket", {
                    onChange: (e) => updateCharCount("targetMarket", e.target.value, 300)
                  })}
                />
                <span className={`text-sm float-right mt-1 ${
                  (charCounts.targetMarket || 0) > 270 ? "text-red-500" : "text-gray-400"
                }`}>
                  {charCounts.targetMarket || 0}/300
                </span>
                {form.formState.errors.targetMarket && (
                  <p className="text-red-500 text-sm mt-1">{form.formState.errors.targetMarket.message}</p>
                )}
              </div>
            </div>
          )}

          {/* Step 4: Business Model */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <div>
                <Label htmlFor="businessModel" className="text-sm font-medium text-gray-700 mb-2 block">
                  Business Model Details
                </Label>
                <Textarea
                  id="businessModel"
                  placeholder="Explain your revenue strategy, cost structure, and how you'll scale..."
                  className="h-24 resize-none transition-all duration-300 focus:scale-105"
                  {...form.register("businessModel", {
                    onChange: (e) => updateCharCount("businessModel", e.target.value, 300)
                  })}
                />
                <span className={`text-sm float-right mt-1 ${
                  (charCounts.businessModel || 0) > 270 ? "text-red-500" : "text-gray-400"
                }`}>
                  {charCounts.businessModel || 0}/300
                </span>
                {form.formState.errors.businessModel && (
                  <p className="text-red-500 text-sm mt-1">{form.formState.errors.businessModel.message}</p>
                )}
              </div>
            </div>
          )}

          {/* Step 5: Competition & Team */}
          {currentStep === 5 && (
            <div className="space-y-6">
              <div>
                <Label htmlFor="competition" className="text-sm font-medium text-gray-700 mb-2 block">
                  Competition Analysis *
                </Label>
                <Textarea
                  id="competition"
                  placeholder="Who are your main competitors? What makes you different or better?"
                  className="h-24 resize-none transition-all duration-300 focus:scale-105"
                  {...form.register("competition", {
                    onChange: (e) => updateCharCount("competition", e.target.value, 400)
                  })}
                />
                <span className={`text-sm float-right mt-1 ${
                  (charCounts.competition || 0) > 360 ? "text-red-500" : "text-gray-400"
                }`}>
                  {charCounts.competition || 0}/400
                </span>
                {form.formState.errors.competition && (
                  <p className="text-red-500 text-sm mt-1">{form.formState.errors.competition.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="team" className="text-sm font-medium text-gray-700 mb-2 block">
                  Team & Experience
                </Label>
                <Textarea
                  id="team"
                  placeholder="Describe your team, relevant experience, and key skills..."
                  className="h-24 resize-none transition-all duration-300 focus:scale-105"
                  {...form.register("team", {
                    onChange: (e) => updateCharCount("team", e.target.value, 300)
                  })}
                />
                <span className={`text-sm float-right mt-1 ${
                  (charCounts.team || 0) > 270 ? "text-red-500" : "text-gray-400"
                }`}>
                  {charCounts.team || 0}/300
                </span>
                {form.formState.errors.team && (
                  <p className="text-red-500 text-sm mt-1">{form.formState.errors.team.message}</p>
                )}
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Form Footer */}
      <div className="flex items-center justify-between pt-6 border-t border-gray-200">
        <Button
          variant="outline"
          onClick={prevStep}
          disabled={currentStep === 1}
          className="transition-all duration-300"
        >
          <ArrowLeft className="mr-2 w-4 h-4" />
          Previous
        </Button>
        
        <div className="flex items-center space-x-3">
          <Button
            variant="ghost"
            className="text-gray-600 hover:text-gray-800"
          >
            <Save className="mr-2 w-4 h-4" />
            Save Draft
          </Button>
          
          {currentStep < 5 ? (
            <Button
              onClick={nextStep}
              className="bg-gradient-to-r from-indigo-500 to-violet-500 hover:shadow-lg transform hover:scale-105 transition-all duration-300"
            >
              Next
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="bg-gradient-to-r from-emerald-500 to-cyan-500 hover:shadow-lg transform hover:scale-105 transition-all duration-300"
            >
              <Check className="mr-2 w-4 h-4" />
              {isSubmitting ? "Analyzing..." : "Submit for Analysis"}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
