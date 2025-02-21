// app/(main)/roadmap/page.jsx
"use client";

import { useState } from "react";
import { generateRoadmap, getUserRoadmaps } from "../../../actions/roadmap";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../@/components/ui/card";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../components/ui/tabs";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import RoadmapViewer from "./_components/roadmap-viewer";
import SavedRoadmaps from "./_components/saved-roadmaps";

export default function RoadmapPage() {
  const [skillPath, setSkillPath] = useState("");
  const [mermaidCode, setMermaidCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("generate");

  const handleGenerate = async (e) => {
    e.preventDefault();
    if (!skillPath) {
      toast.error("Please enter a career path or skill to generate a roadmap");
      return;
    }

    setLoading(true);
    try {
      const result = await generateRoadmap(skillPath);
      setMermaidCode(result);
      setActiveTab("view");
      toast.success("Your learning roadmap has been created successfully");
    } catch (error) {
      toast.error(error.message || "Failed to generate roadmap");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-6 space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>AI Learning Roadmap Generator</CardTitle>
          <CardDescription>
            Generate personalized learning roadmaps to master new skills and advance your career
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="generate">Generate</TabsTrigger>
              <TabsTrigger value="view" disabled={!mermaidCode}>View Current</TabsTrigger>
              <TabsTrigger value="saved">Saved Roadmaps</TabsTrigger>
            </TabsList>

            <TabsContent value="generate" className="mt-6 space-y-4">
              <form onSubmit={handleGenerate} className="flex flex-col space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    What skill or career path would you like to learn?
                  </label>
                  <div className="flex gap-2">
                    <Input
                      placeholder="e.g., Full Stack Web Development, Data Science, UX Design"
                      value={skillPath}
                      onChange={(e) => setSkillPath(e.target.value)}
                      disabled={loading}
                    />
                    <Button type="submit" disabled={loading}>
                      {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      Generate Roadmap
                    </Button>
                  </div>
                </div>
              </form>
              
              <div className="bg-muted p-4 rounded-md">
                <h3 className="font-medium mb-2">How it works:</h3>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  <li>Enter the skill or career path you want to learn</li>
                  <li>Our AI analyzes your profile and generates a personalized learning roadmap</li>
                  <li>View, save, and print your roadmap to guide your learning journey</li>
                  <li>Roadmaps include time estimates and recommended learning resources</li>
                </ul>
              </div>
            </TabsContent>

            <TabsContent value="view">
              {mermaidCode && <RoadmapViewer code={mermaidCode} title={skillPath} />}
            </TabsContent>

            <TabsContent value="saved">
              <SavedRoadmaps setMermaidCode={setMermaidCode} setActiveTab={setActiveTab} />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
