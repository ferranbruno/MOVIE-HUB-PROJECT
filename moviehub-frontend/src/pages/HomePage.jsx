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

export default HomePage;
