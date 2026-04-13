import Nav from '../components/Nav';
import Hero from '../components/Hero';
import ProofBar from '../components/ProofBar';
import Services from '../components/Services';
import Portfolio from '../components/Portfolio';
import Testimonials from '../components/Testimonials';
import Contact from '../components/Contact';

export default function Home() {
  return (
    <main>
      <Nav />
      <Hero />
      <ProofBar />
      <Services />
      <Portfolio />
      <Testimonials />
      <Contact />
      <footer className="py-8 bg-[#0a0e1a] border-t border-gray-800 text-center text-gray-600 text-sm">
        © {new Date().getFullYear()} Christos Galaios. Built with Next.js + Tailwind CSS.
      </footer>
    </main>
  );
}
