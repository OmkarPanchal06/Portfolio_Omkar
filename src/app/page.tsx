import Nav from "@/components/nav";
import Hero from "@/components/sections/hero";
import Pillars from "@/components/sections/pillars";
import Projects from "@/components/sections/projects";
import Skills from "@/components/sections/skills";
import Path from "@/components/sections/path";
import Contact from "@/components/sections/contact";
import Footer from "@/components/footer";

export default function Home() {
  return (
    <>
      <Nav />
      <main id="main">
        <Hero />
        <Pillars />
        <Projects />
        <Skills />
        <Path />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
