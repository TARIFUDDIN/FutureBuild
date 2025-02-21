
import { Metadata } from "next";

export const metadata = {
  title: "AI Learning Roadmap Generator",
  description: "Generate personalized learning roadmaps to accelerate your career growth",
};

export default function RoadmapLayout({ children }) {
  return (
    <>
      <div className="flex flex-col min-h-screen">
        <main className="flex-1">{children}</main>
      </div>
    </>
  );
}