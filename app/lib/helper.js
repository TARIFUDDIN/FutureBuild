// Helper function to convert entries to markdown
export function entriesToMarkdown(entries, type) {
  if (!entries?.length) return "";

  return (
    `## ${type}\n\n` +
    entries
      .map((entry) => {
        const dateRange = entry.current
          ? `${entry.startDate} - Present`
          : `${entry.startDate} - ${entry.endDate}`;
        
        let markdown = `### ${entry.title} @ ${entry.organization}\n${dateRange}\n\n`;
        
        // Add links for projects (GitHub and Live Demo)
        if (entry.githubUrl || entry.liveUrl) {
          const links = [];
          if (entry.githubUrl) {
            links.push(`[GitHub](${entry.githubUrl})`);
          }
          if (entry.liveUrl) {
            links.push(`[Live Demo](${entry.liveUrl})`);
          }
          markdown += `**Links:** ${links.join(' | ')}\n\n`;
        }
        
        // Add tech stack if available
        if (entry.techStack) {
          markdown += `**Tech Stack:** ${entry.techStack}\n\n`;
        }
        
        // Add description
        markdown += entry.description;
        
        return markdown;
      })
      .join("\n\n")
  );
}