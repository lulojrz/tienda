import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import FeaturedReleases from './components/FeaturedReleases';
import Footer from './components/Footer';
import { Route, Routes } from 'react-router-dom';
import PaginaPrincipal from './pages/PaginaPrincipal';
import PaginaProductos from './pages/PaginaProductos';

function App() {
  return (
    <>
      <Routes>
        <Route path='/' element={<PaginaPrincipal />}></Route>
        <Route path='/productos' element={<PaginaProductos />}></Route>

      </Routes>

    </>
  );
}

export default App;
