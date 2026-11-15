import { lazy, Suspense, type ComponentType } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { ScrollToTop } from './components/ScrollToTop';

// Every page is code-split. The dictionary data (~2 MB of JSON) is only
// pulled in by the pages that search or list words, so lighter pages such
// as About, Alphabet, Proverbs and the legal notices load without it.
const page = <T extends string>(load: () => Promise<Record<T, ComponentType>>, name: T) =>
  lazy(() => load().then(m => ({ default: m[name] })));

const Home = page(() => import('./pages/Home'), 'Home');
const WordPage = page(() => import('./pages/WordPage'), 'WordPage');

// Dictionary browsing
const Browse = page(() => import('./pages/Browse'), 'Browse');
const Categories = page(() => import('./pages/Categories'), 'Categories');
const CategoryDetail = page(() => import('./pages/CategoryDetail'), 'CategoryDetail');
const Roots = page(() => import('./pages/Roots'), 'Roots');
const RootDetail = page(() => import('./pages/RootDetail'), 'RootDetail');
const Favorites = page(() => import('./pages/Favorites'), 'Favorites');

// Learning
const LearnHub = page(() => import('./pages/LearnHub'), 'LearnHub');
const Vocabulary = page(() => import('./pages/Vocabulary'), 'Vocabulary');
const Alphabet = page(() => import('./pages/Alphabet'), 'Alphabet');

// Culture
const Proverbs = page(() => import('./pages/Proverbs'), 'Proverbs');
const ProverbDetail = page(() => import('./pages/ProverbDetail'), 'ProverbDetail');

// Tools
const Tools = page(() => import('./pages/Tools'), 'Tools');
const VerbConjugator = page(() => import('./pages/VerbConjugator'), 'VerbConjugator');
const Quiz = page(() => import('./pages/Quiz'), 'Quiz');
const Community = page(() => import('./pages/Community'), 'Community');
const CalculatorOCR = page(() => import('./pages/Scan'), 'CalculatorOCR');

// Project
const About = page(() => import('./pages/About'), 'About');
const NotFound = page(() => import('./pages/NotFound'), 'NotFound');
const PrivacyPolicy = page(() => import('./pages/legal/PrivacyPolicy'), 'PrivacyPolicy');
const Imprint = page(() => import('./pages/legal/Imprint'), 'Imprint');

function App() {
  return (
    <>
    <ScrollToTop />
    <Routes>
      {/* Layout wraps its <Outlet /> in Suspense, so the header stays put while a page loads */}
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />

        {/* Dictionary */}
        <Route path="word/:id" element={<WordPage />} />
        <Route path="browse" element={<Browse />} />
        <Route path="categories" element={<Categories />} />
        <Route path="category/:slug" element={<CategoryDetail />} />
        <Route path="roots" element={<Roots />} />
        <Route path="root/:slug" element={<RootDetail />} />
        <Route path="favorites" element={<Favorites />} />

        {/* Learning */}
        <Route path="learn" element={<LearnHub />} />
        <Route path="learn/vocabulary" element={<Vocabulary />} />
        <Route path="alphabet" element={<Alphabet />} />

        {/* Culture */}
        <Route path="proverbs" element={<Proverbs />} />
        <Route path="proverb/:id" element={<ProverbDetail />} />

        {/* Tools */}
        <Route path="tools" element={<Tools />} />
        <Route path="tools/conjugator" element={<VerbConjugator />} />
        <Route path="tools/quiz" element={<Quiz />} />
        <Route path="tools/community" element={<Community />} />

        {/* Project */}
        <Route path="about" element={<About />} />
        <Route path="privacy" element={<PrivacyPolicy />} />
        <Route path="imprint" element={<Imprint />} />

        {/* Catch-all: unknown URLs render a 404 inside the app shell */}
        <Route path="*" element={<NotFound />} />
      </Route>

      {/* Standalone route for Camera — full screen, outside the app shell */}
      <Route path="/tools/scan" element={
        <Suspense fallback={<div className="flex items-center justify-center h-screen text-indigo-400">Loading scanner...</div>}>
          <CalculatorOCR />
        </Suspense>
      } />
    </Routes>
    </>
  );
}

export default App;
