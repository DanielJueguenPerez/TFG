import { BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import RegistroPage from './pages/RegistroPage';
import Layout from './components/Layout';

function App() {
  return(
    <Router>
      <Routes>
        <Route path='/' element={ <Layout><LandingPage /></Layout>} />
        <Route path='/registro' element={<Layout><RegistroPage /></Layout>} />
      </Routes>
    </Router>
  );
}

export default App;