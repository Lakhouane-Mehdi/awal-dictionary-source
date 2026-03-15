import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Learn } from './pages/Learn';
import { Home } from './pages/Home';
import { WordPage } from './pages/WordPage';
import { Tools } from './pages/Tools';
import { VerbConjugator } from './pages/VerbConjugator';
import { Quiz } from './pages/Quiz';

// Heavy pages — lazy loaded so pdfjs-dist + tesseract.js aren't in the main bundle
const CalculatorOCR = lazy(() => import('./pages/Scan').then(m => ({ default: m.CalculatorOCR })));

// Placeholder imports
import { Favorites } from './pages/Favorites';
import { Community } from './pages/Community';
import { PrivacyPolicy } from './pages/legal/PrivacyPolicy'; // Legal
import { Imprint } from './pages/legal/Imprint'; // Legal

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="word/:id" element={<WordPage />} />
        <Route path="favorites" element={<Favorites />} />
        <Route path="learn" element={<Learn />} />
        <Route path="tools" element={<Tools />} />
        <Route path="tools/conjugator" element={<VerbConjugator />} />
        <Route path="tools/quiz" element={<Quiz />} />
        <Route path="tools/community" element={<Community />} />
        <Route path="privacy" element={<PrivacyPolicy />} />
        <Route path="imprint" element={<Imprint />} />
      </Route>
      {/* Standalone route for Camera — lazy loaded */}
      <Route path="/tools/scan" element={
        <Suspense fallback={<div className="flex items-center justify-center h-screen text-slate-400">Loading scanner...</div>}>
          <CalculatorOCR />
        </Suspense>
      } />
    </Routes>
  );
}

export default App;
