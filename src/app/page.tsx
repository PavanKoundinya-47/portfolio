import MissionControlBackground from '../components/MissionControlBackground';
import Navigation from '../components/Navigation';
import HeroSection from '../components/HeroSection';
import MissionBriefSection from '../components/MissionBriefSection';
import TimelineSection from '../components/TimelineSection';
import ProjectsSection from '../components/ProjectsSection';
import SkillsSection from '../components/SkillsSection';
import MissionLogSection from '../components/MissionLogSection';
import ResumeSection from '../components/ResumeSection';
import ContactSection from '../components/ContactSection';
import Footer from '../components/Footer';

export default function Home() {
  return (
    <>
      <MissionControlBackground />
      <Navigation />
      <main id="main-content">
        <HeroSection />
        <MissionBriefSection />
        <TimelineSection />
        <ProjectsSection />
        <SkillsSection />
        <MissionLogSection />
        <ResumeSection />
        <ContactSection />
      </main>
      <Footer />
    </>
  );
}
