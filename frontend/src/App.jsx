import { BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import Layout from './components/Layout';
import LandingPage from './pages/LandingPage';
import RegistroPage from './pages/RegistroPage';
import LoginPage from './pages/LoginPage';
import VerPerfilPage from './pages/VerPerfilPage';

function App() {
  return(
    <Router>
      <Routes>
        <Route path='/' element={ <Layout><LandingPage /></Layout>} />
        <Route path='/usuario/registro' element={<Layout><RegistroPage /></Layout>} />
        <Route path='/usuario/login' element={<Layout><LoginPage /></Layout>} />
        <Route path='/usuario/ver-perfil' element={<Layout><VerPerfilPage /></Layout>} />
      </Routes>
    </Router>
  );
}

export default App;