import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import FeaturedReleases from './components/FeaturedReleases';
import Footer from './components/Footer';

function App() {
  return (
    <>
      <Navbar />
      <main>
        <HeroSection />
        <FeaturedReleases />
      </main>
      <Footer />
    </>
  );
}

export default App;
