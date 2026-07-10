import Header from '../components/common/header/Header';
import HeroSection from '../components/landing/HeroSection/HeroSection';
import NowShowingSection from '../components/landing/NowShowingSection/NowShowingSection';
import TrendingSection from '../components/landing/TrendingSection/TrendingSection';
import Footer from '../components/common/Footer/Footer';

function HomePage() {
  return (
    <div className="page-shell">
      <Header />
      <HeroSection />
      <main>
        <NowShowingSection />
        <TrendingSection />
      </main>
      <Footer />
    </div>
  );
}
// output: HomePage component renders the main structure of the home page, including the header, hero section, now showing section, trending section, and footer.
export default HomePage;