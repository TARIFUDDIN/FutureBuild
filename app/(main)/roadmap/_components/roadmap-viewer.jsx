"use client";

import { useEffect, useRef, useState } from "react";
import mermaid from "mermaid";
import { Card, CardContent } from "../../../../@/components/ui/card";
import { Button } from "../../../../components/ui/button";
import { Download, Printer, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import FallbackRoadmap from "./fallback-roadmap";

export default function RoadmapViewer({ code, title }) {
  const containerRef = useRef(null);
  const [isRendering, setIsRendering] = useState(false);
  const [renderFailed, setRenderFailed] = useState(false);
  const [renderAttempts, setRenderAttempts] = useState(0);

  useEffect(() => {
    const renderMermaid = async () => {
      if (!code || !containerRef.current) return;
      
      setRenderFailed(false);
      setIsRendering(true);
      
      try {
        // Initialize mermaid with simplified settings
        mermaid.initialize({
          startOnLoad: false,
          theme: "default",
          flowchart: {
            useMaxWidth: true,
            htmlLabels: true,
            curve: "linear",
            rankSpacing: 80,
            nodeSpacing: 50,
          },
          securityLevel: "loose",
          logLevel: 1,
        });

        // Clear container
        containerRef.current.innerHTML = "";
        
        // Process code - clean up any markdown formatting, ensure it starts with flowchart TD
        let cleanCode = code
          .replace(/```mermaid\s*/g, "")
          .replace(/```\s*$/g, "")
          .trim();
        
        // Ensure the code has proper flowchart syntax
        if (!cleanCode.startsWith("flowchart TD") && !cleanCode.startsWith("graph TD")) {
          cleanCode = "flowchart TD\n" + cleanCode;
        }
        
        console.log("Rendering Mermaid code (attempt " + (renderAttempts + 1) + "):", cleanCode);
        
        // Create a unique ID for this render
        const uniqueId = `roadmap-diagram-${Date.now()}`;
        
        try {
          // First try to parse the code to catch syntax errors
          await mermaid.parse(cleanCode);
          
          // Then render
          const { svg } = await mermaid.render(uniqueId, cleanCode);
          
          // Update the container with the SVG
          if (containerRef.current) {
            containerRef.current.innerHTML = svg;
            
            // Get the SVG element
            const svgElement = containerRef.current.querySelector("svg");
            if (svgElement) {
              // Set base SVG properties
              svgElement.style.maxWidth = "100%";
              svgElement.style.height = "auto";
              svgElement.style.minHeight = "400px";
              svgElement.setAttribute("width", "100%");
              
              // Create and inject a style element with specific overrides
              const styleElement = document.createElement("style");
              styleElement.textContent = `
                /* Make all text black and bold */
                .node text, .edgeLabel text, #mermaid-container text, .messageText, .loopText, .noteText, .labelText, .cluster text {
                  fill: #000000 !important;
                  color: #000000 !important;
                  font-weight: bold !important;
                  font-size: 14px !important;
                  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif !important;
                }
                
                /* Make all lines darker */
                .edge path, .flowchart-link path, .path, line, polyline, .messageLine0, .messageLine1 {
                  stroke: #333333 !important;
                  stroke-width: 1.5px !important;
                }
                
                /* Make all node borders darker */
                .node rect, .node circle, .node ellipse, .node polygon, .node path {
                  stroke: #333333 !important;
                  stroke-width: 2px !important;
                }
                
                /* Make node fill colors slightly tinted for better contrast */
                .node rect, .node circle, .node ellipse, .node polygon {
                  fill: #f8f8f8 !important;
                }
                
                /* Override any inline styles with !important */
                [style*="fill: rgb"] {
                  fill: #000000 !important;
                }
                
                [style*="stroke: rgb"] {
                  stroke: #333333 !important;
                }
              `;
              
              svgElement.appendChild(styleElement);
              
              // Direct DOM manipulation for text elements
              const textElements = svgElement.querySelectorAll("text, tspan");
              textElements.forEach(text => {
                text.setAttribute("fill", "#000000");
                text.setAttribute("font-weight", "bold");
                text.setAttribute("font-size", "14px");
                text.setAttribute("font-family", "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif");
                
                // Remove any inline styles that might be overriding our attributes
                const style = text.getAttribute("style") || "";
                if (style.includes("fill:")) {
                  text.setAttribute("style", style.replace(/fill:[^;]+;?/g, "fill: #000000 !important;"));
                } else {
                  text.setAttribute("style", style + "fill: #000000 !important;");
                }
              });
              
              // Path elements (lines, connectors)
              const pathElements = svgElement.querySelectorAll("path, line, polyline");
              pathElements.forEach(path => {
                path.setAttribute("stroke", "#333333");
                path.setAttribute("stroke-width", "1.5px");
                
                // Override inline styles
                const style = path.getAttribute("style") || "";
                if (style.includes("stroke:")) {
                  path.setAttribute("style", style.replace(/stroke:[^;]+;?/g, "stroke: #333333 !important;"));
                } else {
                  path.setAttribute("style", style + "stroke: #333333 !important;");
                }
              });
              
              // Set ARIA attributes for accessibility
              svgElement.setAttribute("role", "img");
              svgElement.setAttribute("aria-label", `Learning Roadmap for ${title}`);
            }
            
            setIsRendering(false);
            toast.success("Roadmap rendered successfully");
          }
        } catch (renderError) {
          console.error("Mermaid render error:", renderError);
          throw renderError;
        }
      } catch (error) {
        console.error("Failed to render mermaid diagram:", error);
        
        // If we've tried less than 2 times, try one more time with a simpler approach
        if (renderAttempts < 1) {
          setRenderAttempts(renderAttempts + 1);
          setTimeout(() => renderMermaid(), 500); // Try again after a delay
        } else {
          setRenderFailed(true);
          setIsRendering(false);
          toast.error("Rendering failed. Showing a simplified roadmap instead.");
        }
      }
    };

    renderMermaid();
  }, [code, renderAttempts]);

  const handleRetry = () => {
    setRenderAttempts(0);
    setRenderFailed(false);
  };

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
            .diagram-container { max-width: 100%; overflow: auto; margin: 0 auto; }
            svg { max-width: 100%; height: auto; display: block; margin: 0 auto; }
            
            /* Ensure dark text in printing */
            svg text, svg tspan { 
              fill: #000000 !important; 
              color: #000000 !important;
              font-weight: bold !important; 
              font-size: 14px !important; 
            }
            
            svg path, svg line, svg polyline { 
              stroke: #333333 !important; 
              stroke-width: 1.5px !important; 
            }
            
            @media print { 
              h1 { margin-bottom: 20px; } 
              /* Print-specific overrides */
              * { -webkit-print-color-adjust: exact !important; color-adjust: exact !important; }
            }
          </style>
        </head>
        <body>
          <h1>Learning Roadmap: ${title}</h1>
          <div class="diagram-container">${diagramSvg}</div>
          <script>
            // Force all text elements to have black fill
            document.querySelectorAll("text, tspan").forEach(el => {
              el.setAttribute("fill", "#000000");
              el.setAttribute("style", "fill: #000000 !important");
            });
          </script>
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
    
    // Deep clone the SVG to avoid modifying the displayed one
    const svgElement = containerRef.current.querySelector("svg").cloneNode(true);
    
    // Add inline styles to ensure text is dark when downloaded
    const styleElement = document.createElement("style");
    styleElement.textContent = `
      text, tspan { fill: #000000 !important; font-weight: bold !important; font-size: 14px !important; }
      path, line, polyline { stroke: #333333 !important; stroke-width: 1.5px !important; }
    `;
    svgElement.appendChild(styleElement);
    
    // Apply direct attributes to text elements
    const textElements = svgElement.querySelectorAll("text, tspan");
    textElements.forEach(text => {
      text.setAttribute("fill", "#000000");
      text.setAttribute("font-weight", "bold");
    });
    
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
            {renderFailed && (
              <Button variant="outline" size="sm" onClick={handleRetry}>
                <RefreshCw className="h-4 w-4 mr-2" /> Retry Rendering
              </Button>
            )}
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
          <div className="border rounded-lg p-4 bg-white overflow-auto" style={{ minHeight: "500px" }}>
            {isRendering && (
              <div className="flex justify-center items-center h-[400px]">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
              </div>
            )}
            <div 
              ref={containerRef} 
              className="mermaid-container w-full flex items-center justify-center"
              style={{ minHeight: isRendering ? "0" : "500px" }}
            >
              {!code && !isRendering && <p className="text-muted-foreground">No roadmap generated yet</p>}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}