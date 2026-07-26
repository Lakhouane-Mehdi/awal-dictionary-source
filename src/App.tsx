import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { ScrollToTop } from './components/ScrollToTop';
import { Home } from './pages/Home';
import { WordPage } from './pages/WordPage';

// Dictionary browsing
import { Browse } from './pages/Browse';
import { Categories } from './pages/Categories';
import { CategoryDetail } from './pages/CategoryDetail';
import { Roots } from './pages/Roots';
import { RootDetail } from './pages/RootDetail';

// Learning
import { LearnHub } from './pages/LearnHub';
import { Vocabulary } from './pages/Vocabulary';
import { Alphabet } from './pages/Alphabet';

// Culture
import { Proverbs } from './pages/Proverbs';
import { ProverbDetail } from './pages/ProverbDetail';

// Tools
import { Tools } from './pages/Tools';
import { VerbConjugator } from './pages/VerbConjugator';
import { Quiz } from './pages/Quiz';
import { Community } from './pages/Community';

// Heavy pages — lazy loaded so pdfjs-dist + tesseract.js aren't in the main bundle
const CalculatorOCR = lazy(() => import('./pages/Scan').then(m => ({ default: m.CalculatorOCR })));

import { Favorites } from './pages/Favorites';
import { About } from './pages/About';
import { NotFound } from './pages/NotFound';
import { PrivacyPolicy } from './pages/legal/PrivacyPolicy';
import { Imprint } from './pages/legal/Imprint';

function App() {
  return (
    <>
    <ScrollToTop />
    <Routes>
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

      {/* Standalone route for Camera — lazy loaded, full screen */}
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
