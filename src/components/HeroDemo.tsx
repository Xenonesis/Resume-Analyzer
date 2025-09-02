import { Hero } from "@/components/ui/hero";
import { useNavigate } from "react-router";

export default function HeroDemo() {
  const navigate = useNavigate();

  const handleAnalyzeClick = () => {
    // Navigate to the main analyzer page
    navigate('/app');
  };

  return (
    <div className="min-h-screen">
      <Hero 
        title="Transform Your Career with AI-Powered Resume Analysis"
        subtitle="Get instant feedback, boost ATS compatibility, and land your dream job faster. Our advanced AI analyzes your resume against industry standards and provides actionable insights in under 30 seconds."
        eyebrow="AI-Powered Resume Analysis"
        ctaLabel="Analyze My Resume"
        onCtaClick={handleAnalyzeClick}
      />
    </div>
  );
}
