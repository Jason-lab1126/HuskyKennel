import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Landing from './pages/Landing';
import Questionnaire from './pages/Questionnaire';
import Results from './pages/Results';
import Listings from './pages/Listings';
import Chatbot from './pages/Chatbot';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/questionnaire" element={<Questionnaire />} />
          <Route path="/results" element={<Results />} />
          <Route path="/listings" element={<Listings />} />
          <Route path="/chatbot" element={<Chatbot />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;