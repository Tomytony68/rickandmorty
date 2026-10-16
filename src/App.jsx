import { BrowserRouter as Router, Route, Routes, Link, Navigate } from 'react-router-dom';
import Caps from './componentes/Caps/Index'
import Favoritos from './componentes/Favoritos/Index'
import Multiverso from './componentes/Multiverso/Index'
import Usuario from './componentes/User/Index'
import Rick from './componentes/Rick/Index'
import Inicio from './componentes/Inicio/Index'
import './App.css'


function App() {

  return (
   <>

     <Router>
      <nav className='c-menu'>
        <Link to="/">Inicio</Link>
        <Link to="/Caps">Caps</Link>
        <Link to="/favoritos">Favoritos</Link>
        <Link to="/Multiverso">Multiverso</Link>
        <Link to="/usuario">Usuario</Link>
      </nav>
    <Routes>
      <Route path="/" element={<Inicio />} />
      <Route path="/Caps" element={<Caps />} />
      <Route path="/favoritos" element={<Favoritos />} />
      <Route path="/Multiverso" element={<Multiverso />} />
      <Route path="/usuario" element={<Usuario />} />
      <Route path="/Rick/:name" element={<Rick/>} />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
    </Router>
   </>
  )
}

export default App