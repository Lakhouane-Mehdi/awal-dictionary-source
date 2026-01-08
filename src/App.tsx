import { Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Home } from './pages/Home';
import { Tools } from './pages/Tools';
import { VerbConjugator } from './pages/VerbConjugator';
import { CalculatorOCR } from './pages/Scan';
import { Quiz } from './pages/Quiz';

// Placeholder imports
import { Favorites } from './pages/Favorites';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="favorites" element={<Favorites />} />
        <Route path="tools" element={<Tools />} />
        <Route path="tools/conjugator" element={<VerbConjugator />} />
        <Route path="tools/quiz" element={<Quiz />} />
      </Route>
      {/* Standalone route for Camera to hide nav bar */}
      <Route path="/tools/scan" element={<CalculatorOCR />} />
    </Routes>
  );
}

export default App;
