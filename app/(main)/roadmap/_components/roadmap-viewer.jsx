"use client";

import { useEffect, useRef, useState } from "react";
import mermaid from "mermaid";
import { Card, CardContent } from "../../../../@/components/ui/card";
import { Button } from "../../../../components/ui/button";
import { Download, Printer } from "lucide-react";
import { toast } from "sonner";
import FallbackRoadmap from "./fallback-roadmap";

export default function RoadmapViewer({ code, title }) {
  const containerRef = useRef(null);
  const [isRendering, setIsRendering] = useState(false);
  const [renderFailed, setRenderFailed] = useState(false);

  useEffect(() => {
    if (code && containerRef.current) {
      setRenderFailed(false);
      setIsRendering(true);
      
      mermaid.initialize({
        startOnLoad: false,
        theme: "neutral",
        flowchart: {
          useMaxWidth: false,
          htmlLabels: true,
          curve: "basis",
        },
        securityLevel: "loose",
      });

      try {
        containerRef.current.innerHTML = "";
        let cleanCode = code.replace(/```mermaid\s*/g, "").replace(/```\s*$/g, "");
        if (!cleanCode.trim().startsWith("graph") && !cleanCode.trim().startsWith("flowchart")) {
          cleanCode = "flowchart TD\n" + cleanCode;
        }
        console.log("Rendering Mermaid code:", cleanCode);
        const uniqueId = `roadmap-diagram-${Date.now()}`;
        mermaid.parse(cleanCode);
        mermaid.render(uniqueId, cleanCode).then(({ svg, bindFunctions }) => {
          containerRef.current.innerHTML = svg;
          if (bindFunctions) bindFunctions(containerRef.current);
          setIsRendering(false);
        });
      } catch (error) {
        console.error("Failed to render mermaid diagram:", error);
        setRenderFailed(true);
        setIsRendering(false);
        toast.error("Rendering failed. Showing a simplified roadmap instead.");
      }
    }
  }, [code]);

  const handlePrint = () => {
    if (!containerRef.current || !containerRef.current.innerHTML) {
      toast.error("No roadmap to print. Please generate a roadmap first.");
      return;
    }
    const printWindow = window.open("", "_blank");
    const diagramSvg = containerRef.current.innerHTML;
    printWindow.document.write(`
      <html>
        <head>
          <title>Learning Roadmap: ${title}</title>
          <style>
            body { font-family: system-ui, sans-serif; padding: 20px; }
            h1 { text-align: center; color: #333; }
            .diagram-container { max-width: 100%; overflow: auto; }
            @media print { h1 { margin-bottom: 20px; } }
          </style>
        </head>
        <body>
          <h1>Learning Roadmap: ${title}</h1>
          <div class="diagram-container">${diagramSvg}</div>
        </body>
      </html>
    `);
    printWindow.document.close();
    setTimeout(() => {
      printWindow.print();
    }, 500);
  };

  const handleDownload = () => {
    if (!containerRef.current || !containerRef.current.querySelector("svg")) {
      toast.error("No roadmap to download. Please generate a roadmap first.");
      return;
    }
    const svgElement = containerRef.current.querySelector("svg");
    const svgData = new XMLSerializer().serializeToString(svgElement);
    const blob = new Blob([svgData], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `roadmap-${title.toLowerCase().replace(/\s+/g, "-")}.svg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast.success("SVG downloaded successfully!");
  };

  return (
    <Card className="mt-4">
      <CardContent className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-medium">Learning Roadmap: {title}</h3>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handlePrint} disabled={!code || isRendering}>
              <Printer className="h-4 w-4 mr-2" /> Print
            </Button>
            <Button variant="outline" size="sm" onClick={handleDownload} disabled={!code || isRendering}>
              <Download className="h-4 w-4 mr-2" /> Download SVG
            </Button>
          </div>
        </div>

        {renderFailed ? (
          <FallbackRoadmap code={code} title={title} />
        ) : (
          <div className="border rounded-lg p-4 bg-white overflow-auto">
            <div ref={containerRef} className="mermaid-container min-h-[400px] flex items-center justify-center">
              {!code && <p className="text-muted-foreground">Loading roadmap...</p>}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
