import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Landing from './pages/Landing';
import Intelligence from './pages/Intelligence';
import Submission from './pages/Submission';
import Blueprint from './pages/Blueprint';
import SignUp from './pages/SignUp';
import Login from './pages/Login';
import SmoothScroll from './components/ui/SmoothScroll';

function App() {
  return (
    <Router>
      <SmoothScroll>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/submission" element={<Submission />} />
          <Route path="/intelligence" element={<Intelligence />} />
          <Route path="/blueprint" element={<Blueprint />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </SmoothScroll>
    </Router>
  );
}

export default App;
