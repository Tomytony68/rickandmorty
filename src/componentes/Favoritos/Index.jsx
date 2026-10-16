
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Style.css';

function Favoritos() {
  const navigate = useNavigate();

  const [favoritos, setFavoritos] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('favoritos') || '[]');
    } catch {
      return [];
    }
  });

  const [busqueda, setBusqueda] = useState('');
  const [estado, setEstado] = useState('');
  const [especie, setEspecie] = useState('');
  const [universo, setUniverso] = useState('');

  // Obtiene el universo u origen según los datos disponibles.
  const obtenerUniverso = (personaje) =>
    personaje.universe ||
    personaje.universo ||
    personaje.origin?.name ||
    personaje.origen ||
    '';

  const normalizar = (valor) =>
    String(valor ?? '').trim().toLowerCase();

  // Opciones dinámicas basadas en los favoritos guardados.
  const especies = [...new Set(
    favoritos.map(p => p.species || p.especie).filter(Boolean)
  )].sort();

  const universos = [...new Set(
    favoritos.map(obtenerUniverso).filter(Boolean)
  )].sort();

  // Aplicar búsqueda y filtros.
  const favoritosFiltrados = favoritos.filter((personaje) => {
    const nombre = normalizar(
      personaje.nombre || personaje.name
    );

    const id = String(personaje.id ?? '');
    const estadoPersonaje = normalizar(personaje.status);
    const especiePersonaje = normalizar(
      personaje.species || personaje.especie
    );
    const universoPersonaje = normalizar(
      obtenerUniverso(personaje)
    );

    const coincideBusqueda =
      nombre.includes(normalizar(busqueda)) ||
      id.includes(busqueda.trim());

    const coincideEstado =
      !estado || estadoPersonaje === normalizar(estado);

    const coincideEspecie =
      !especie || especiePersonaje === normalizar(especie);

    const coincideUniverso =
      !universo ||
      universoPersonaje === normalizar(universo);

    return (
      coincideBusqueda &&
      coincideEstado &&
      coincideEspecie &&
      coincideUniverso
    );
  });

  const quitarFavorito = (id) => {
    const nuevosFavoritos = favoritos.filter(
      personaje => personaje.id !== id
    );

    setFavoritos(nuevosFavoritos);

    localStorage.setItem(
      'favoritos',
      JSON.stringify(nuevosFavoritos)
    );
  };

  const limpiarFiltros = () => {
    setBusqueda('');
    setEstado('');
    setEspecie('');
    setUniverso('');
  };

  return (
    <div className="favoritos-rm-container">
      <header className="favoritos-rm-header">
        <h1>Mis Favoritos</h1>
        <p>Los personajes de tu multiverso</p>
      </header>

      {/* BUSCADOR Y FILTROS */}
      <section className="favoritos-filtros">
        <div className="favoritos-busqueda">
          <span aria-hidden="true">🔎</span>
          <input
            type="search"
            placeholder="Buscar por nombre o ID..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            aria-label="Buscar favoritos por nombre o ID"
          />
        </div>

        <div className="favoritos-selectores">
          <select
            value={estado}
            onChange={(e) => setEstado(e.target.value)}
            aria-label="Filtrar por estado"
          >
            <option value="">Todos los estados</option>
            <option value="Alive">Vivo</option>
            <option value="Dead">Muerto</option>
            <option value="unknown">Desconocido</option>
          </select>

          <select
            value={especie}
            onChange={(e) => setEspecie(e.target.value)}
            aria-label="Filtrar por especie"
          >
            <option value="">Todas las especies</option>
            {especies.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>

          <select
            value={universo}
            onChange={(e) => setUniverso(e.target.value)}
            aria-label="Filtrar por universo u origen"
          >
            <option value="">Todos los universos/orígenes</option>
            {universos.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </div>

        <div className="favoritos-filtros-pie">
          <span>
            {favoritosFiltrados.length} de {favoritos.length} personajes
          </span>

          <button
            type="button"
            className="favoritos-limpiar"
            onClick={limpiarFiltros}
          >
            Limpiar filtros
          </button>
        </div>
      </section>

      {/* LISTA DE FAVORITOS */}
      {favoritos.length === 0 ? (
        <div className="favoritos-rm-vacio">
          <h2>¡Aún no tienes favoritos!</h2>
          <p>
            Ve a Inicio y desliza a la derecha
            para guardar tus personajes preferidos.
          </p>
        </div>
      ) : favoritosFiltrados.length === 0 ? (
        <div className="favoritos-rm-vacio">
          <h2>Sin coincidencias 🔍</h2>
          <p>
            No encontramos personajes con esos criterios.
            Prueba con otro nombre o modifica los filtros.
          </p>
          <button
            type="button"
            className="favoritos-limpiar"
            onClick={limpiarFiltros}
          >
            Ver todos los favoritos
          </button>
        </div>
      ) : (
        <div className="c-lista">
          {favoritosFiltrados.map((personaje) => (
            <div
              key={personaje.id}
              className="c-lista-pokemon"
            >
              <div
                className="favorito-contenido"
                onClick={() =>
                  navigate(`/personaje/${personaje.id}`)
                }
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    navigate(`/personaje/${personaje.id}`);
                  }
                }}
                role="link"
                tabIndex={0}
              >
                <p className="favorito-id">
                  #{personaje.id}
                </p>

                <img
                  src={personaje.image || personaje.imagen}
                  alt={personaje.nombre || personaje.name}
                  loading="lazy"
                />

                <h3>{personaje.nombre || personaje.name}</h3>

                <p className="favorito-estado">
                  {personaje.status || 'Desconocido'}
                  {' · '}
                  {personaje.species || personaje.especie || 'Sin especie'}
                </p>

                {obtenerUniverso(personaje) && (
                  <p className="favorito-universo">
                    🌌 {obtenerUniverso(personaje)}
                  </p>
                )}
              </div>

              <button
                type="button"
                className="favorito-quitar"
                onClick={() => quitarFavorito(personaje.id)}
                aria-label={`Quitar a ${personaje.nombre || personaje.name} de favoritos`}
                title="Quitar de favoritos"
              >
                ♥
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Favoritos;
