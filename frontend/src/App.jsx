import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import LandingPage from "./pages/LandingPage";
import RegistroPage from "./pages/RegistroPage";
import LoginPage from "./pages/LoginPage";
import VerPerfilPage from "./pages/VerPerfilPage";
import EditarPerfilPage from "./pages/EditarPerfilPage";
import VerGradosPage from "./pages/VerGradosPage";
import BuscarAsignaturasPage from "./pages/BuscarAsignaturasPage";
import VerDetallesGradoPage from "./pages/VerDetallesGradoPage";
import VerDetallesAsignaturaPage from "./pages/VerDetallesAsignaturaPage";
import VerListaFavoritosPage from "./pages/VerListaFavoritosPage";
import CrearComentarioPage from "./pages/CrearComentarioPage";
import VerComentariosPage from "./pages/VerComentariosPage";
import EditarComentarioPage from "./pages/EditarComentarioPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <Layout>
              <LandingPage />
            </Layout>
          }
        />
        <Route
          path="/usuario/registro"
          element={
            <Layout>
              <RegistroPage />
            </Layout>
          }
        />
        <Route
          path="/usuario/login"
          element={
            <Layout>
              <LoginPage />
            </Layout>
          }
        />
        <Route
          path="/usuario/ver-perfil"
          element={
            <Layout>
              <VerPerfilPage />
            </Layout>
          }
        />
        <Route
          path="/usuario/editar-perfil"
          element={
            <Layout>
              <EditarPerfilPage />
            </Layout>
          }
        />
        <Route
          path="/grados"
          element={
            <Layout>
              <VerGradosPage />
            </Layout>
          }
        />
        <Route
          path="/asignaturas"
          element={
            <Layout>
              <BuscarAsignaturasPage />
            </Layout>
          }
        />
        <Route
          path="/grados/:id"
          element={
            <Layout>
              <VerDetallesGradoPage />
            </Layout>
          }
        />
        <Route
          path="/asignaturas/:id"
          element={
            <Layout>
              <VerDetallesAsignaturaPage />
            </Layout>
          }
        />
        <Route
          path="/favoritos/lista"
          element={
            <Layout>
              <VerListaFavoritosPage />
            </Layout>
          }
        />
        <Route
          path="/comentarios/nuevo/:id"
          element={
            <Layout>
              <CrearComentarioPage />
            </Layout>
          }
        />
        <Route
          path="/comentarios/:id"
          element={
            <Layout>
              <VerComentariosPage />
            </Layout>
          }
        />
        <Route
          path="/comentarios/editar/:id"
          element={
            <Layout>
              <EditarComentarioPage />
            </Layout>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
