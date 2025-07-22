"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useUser } from "@clerk/nextjs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../../../components/ui/card";
import { Button } from "../../../../components/ui/button";
import { Label } from "../../../../components/ui/label";
import { Input } from "../../../../components/ui/input";
import { Textarea } from "../../../../components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "../../../../components/ui/select";

import { onboardingSchema } from "../../../lib/schema";
import { updateUser } from "../../../../actions/user";

const OnboardingForm = ({ industries }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, isLoaded } = useUser();
  const [selectedIndustry, setSelectedIndustry] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCheckingStatus, setIsCheckingStatus] = useState(true);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm({
    resolver: zodResolver(onboardingSchema),
    defaultValues: {
      industry: "",
      subIndustry: "",
      experience: "",
      skills: "",
      bio: "",
    }
  });

  // Check if user is already onboarded (client-side)
  useEffect(() => {
    const checkOnboardingStatus = async () => {
      if (!isLoaded || !user) return;
      
      try {
        // Simple client-side check
        const isOnboarded = localStorage.getItem('isOnboarded') === 'true';
        
        if (isOnboarded) {
          const redirectUrl = searchParams.get('redirect_url') || '/dashboard';
          router.push(redirectUrl);
          return;
        }
        
        setIsCheckingStatus(false);
      } catch (error) {
        console.error('Error checking onboarding status:', error);
        setIsCheckingStatus(false);
      }
    };

    checkOnboardingStatus();
  }, [isLoaded, user, router, searchParams]);

  const onSubmit = async (values) => {
    try {
      setIsSubmitting(true);
      console.log("🚀 Onboarding: Starting form submission with values:", values);
      console.log("🔍 Skills type:", typeof values.skills, "Value:", values.skills);

      // Validate required fields
      if (!values.industry || !values.subIndustry) {
        toast.error("Please select both industry and specialization");
        return;
      }

      const formattedIndustry = `${values.industry}-${values.subIndustry
        .toLowerCase()
        .replace(/ /g, "-")}`;

      // Prepare data for submission - fix skills handling
      let skillsArray = [];
      if (values.skills) {
        if (typeof values.skills === 'string') {
          // If it's a string, split by comma
          skillsArray = values.skills.split(',').map(s => s.trim()).filter(s => s);
        } else if (Array.isArray(values.skills)) {
          // If it's already an array, use it
          skillsArray = values.skills.filter(s => s);
        }
      }

      const submitData = {
        industry: formattedIndustry,
        experience: values.experience ? parseInt(values.experience) : 0,
        bio: values.bio || "",
        skills: skillsArray,
      };

      console.log("📤 Onboarding: Submitting data:", submitData);

      const result = await updateUser(submitData);
      console.log("📥 Onboarding: Received result:", result);

      if (result && result.success) {
        localStorage.setItem('isOnboarded', 'true');
        toast.success("Profile completed successfully!");
        
        const redirectUrl = searchParams.get('redirect_url') || '/dashboard';
        console.log("🔄 Onboarding: Redirecting to:", redirectUrl);
        
        // Use window.location for more reliable redirect
        window.location.href = redirectUrl;
      } else {
        console.error("❌ Onboarding: Update failed:", result);
        
        // Show specific error message
        const errorMessage = result?.error || 'Failed to update profile';
        toast.error(`Error: ${errorMessage}`);
        
        // Reset form if there's a server error
        if (result?.error && result.error.includes('timeout')) {
          toast.error("Request timed out. Please try again with a simpler bio.");
        }
      }
    } catch (error) {
      console.error("💥 Onboarding: Submission error:", error);
      toast.error(`Submission failed: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const watchIndustry = watch("industry");

  // Show loading while checking status
  if (isCheckingStatus || !isLoaded) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center bg-background min-h-screen py-8">
      <Card className="w-full max-w-lg mx-4">
        <CardHeader>
          <CardTitle className="gradient-title text-4xl">
            Complete Your Profile
          </CardTitle>
          <CardDescription>
            Select your industry to get personalized career insights and
            recommendations.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="industry">Industry *</Label>
              <Select
                onValueChange={(value) => {
                  setValue("industry", value);
                  setSelectedIndustry(
                    industries.find((ind) => ind.id === value)
                  );
                  setValue("subIndustry", "");
                }}
                required
              >
                <SelectTrigger id="industry">
                  <SelectValue placeholder="Select an industry" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Industries</SelectLabel>
                    {industries.map((ind) => (
                      <SelectItem key={ind.id} value={ind.id}>
                        {ind.name}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
              {errors.industry && (
                <p className="text-sm text-red-500">
                  {errors.industry.message}
                </p>
              )}
            </div>

            {watchIndustry && selectedIndustry && (
              <div className="space-y-2">
                <Label htmlFor="subIndustry">Specialization *</Label>
                <Select
                  onValueChange={(value) => setValue("subIndustry", value)}
                  required
                >
                  <SelectTrigger id="subIndustry">
                    <SelectValue placeholder="Select your specialization" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Specializations</SelectLabel>
                      {selectedIndustry?.subIndustries.map((sub) => (
                        <SelectItem key={sub} value={sub}>
                          {sub}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
                {errors.subIndustry && (
                  <p className="text-sm text-red-500">
                    {errors.subIndustry.message}
                  </p>
                )}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="experience">Years of Experience</Label>
              <Input
                id="experience"
                type="number"
                min="0"
                max="50"
                placeholder="Enter years of experience"
                {...register("experience")}
              />
              {errors.experience && (
                <p className="text-sm text-red-500">
                  {errors.experience.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="skills">Skills</Label>
              <Input
                id="skills"
                placeholder="e.g., Python, JavaScript, Project Management"
                {...register("skills")}
              />
              <p className="text-sm text-muted-foreground">
                Separate multiple skills with commas
              </p>
              {errors.skills && (
                <p className="text-sm text-red-500">{errors.skills.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="bio">Professional Bio</Label>
              <Textarea
                id="bio"
                placeholder="Tell us about your professional background..."
                className="h-32"
                maxLength={500}
                {...register("bio")}
              />
              <p className="text-sm text-muted-foreground">
                Keep it concise (max 500 characters)
              </p>
              {errors.bio && (
                <p className="text-sm text-red-500">{errors.bio.message}</p>
              )}
            </div>

            <Button 
              type="submit" 
              className="w-full" 
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving Profile...
                </>
              ) : (
                "Complete Profile"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default OnboardingForm;