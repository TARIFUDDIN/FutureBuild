
"use client";

import { useEffect, useState } from "react";
import { getUserRoadmaps } from "../../../../actions/roadmap";
import { Card, CardContent, CardDescription } from "../../../../@/components/ui/card";
import { Button } from "../../../../components/ui/button"
import { Eye, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";

export default function SavedRoadmaps({ setMermaidCode, setActiveTab }) {
  const [roadmaps, setRoadmaps] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadRoadmaps() {
      try {
        const data = await getUserRoadmaps();
        setRoadmaps(data);
      } catch (error) {
        toast.error("Failed to load your saved roadmaps");
      } finally {
        setLoading(false);
      }
    }

    loadRoadmaps();
  }, []);

  const handleView = (roadmap) => {
    setMermaidCode(roadmap.mermaidCode);
    setActiveTab("view");
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-40">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (roadmaps.length === 0) {
    return (
      <Card className="mt-4">
        <CardContent className="flex flex-col items-center justify-center h-40 p-6">
          <p className="text-muted-foreground mb-2">You don't have any saved roadmaps yet</p>
          <Button variant="outline" onClick={() => setActiveTab("generate")}>
            Generate your first roadmap
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4 mt-4">
      <h3 className="text-lg font-medium">Your Saved Roadmaps</h3>
      <div className="grid gap-4 md:grid-cols-2">
        {roadmaps.map((roadmap) => (
          <Card key={roadmap.id} className="overflow-hidden">
            <CardContent className="p-0">
              <div className="p-4">
                <h4 className="font-medium truncate">{roadmap.skillPath}</h4>
                <CardDescription>
                  Created on {format(new Date(roadmap.createdAt), "MMM d, yyyy")}
                </CardDescription>
              </div>
              <div className="flex items-center justify-between bg-muted/50 p-2 border-t">
                <span className="text-xs text-muted-foreground">
                  Last updated: {format(new Date(roadmap.updatedAt), "MMM d, yyyy")}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleView(roadmap)}
                  className="ml-auto"
                >
                  <Eye className="h-4 w-4 mr-1" />
                  View
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
