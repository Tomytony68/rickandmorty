
import { useState, useEffect } from 'react';
import './Style.css';

function Usuario() {
  const [perfil, setPerfil] = useState(() => {
    try {
      return {
        nombre: 'Viajero interdimensional',
        bio: 'Explorando el multiverso, una dimensión a la vez.',
        ...JSON.parse(localStorage.getItem('perfilRickMorty') || '{}')
      };
    } catch {
      return {
        nombre: 'Viajero interdimensional',
        bio: 'Explorando el multiverso, una dimensión a la vez.'
      };
    }
  });

  const [editando, setEditando] = useState(false);
  const [nombreTemporal, setNombreTemporal] = useState(perfil.nombre);
  const [bioTemporal, setBioTemporal] = useState(perfil.bio);
  const [favoritos, setFavoritos] = useState([]);
  const [decididos, setDecididos] = useState([]);

  useEffect(() => {
    function cargarEstadisticas() {
      try {
        setFavoritos(
          JSON.parse(localStorage.getItem('favoritos') || '[]')
        );
        setDecididos(
          JSON.parse(localStorage.getItem('personajesDecididos') || '[]')
        );
      } catch {
        setFavoritos([]);
        setDecididos([]);
      }
    }

    cargarEstadisticas();
  }, []);

  const guardarPerfil = (evento) => {
    evento.preventDefault();

    const perfilActualizado = {
      nombre: nombreTemporal.trim() || 'Viajero interdimensional',
      bio: bioTemporal.trim() || 'Sin descripción por ahora.'
    };

    setPerfil(perfilActualizado);
    localStorage.setItem(
      'perfilRickMorty',
      JSON.stringify(perfilActualizado)
    );
    setNombreTemporal(perfilActualizado.nombre);
    setBioTemporal(perfilActualizado.bio);
    setEditando(false);
  };

  const cancelarEdicion = () => {
    setNombreTemporal(perfil.nombre);
    setBioTemporal(perfil.bio);
    setEditando(false);
  };

  return (
    <main className="usuario-container">
      <section className="usuario-perfil">
        <div className="usuario-banner">
          <span className="usuario-portal">🌀</span>
          <span className="usuario-dimension">DIMENSIÓN C-137</span>
        </div>

        <div className="usuario-contenido">
          <div className="usuario-avatar">👨‍🚀</div>

          {!editando ? (
            <>
              <h1>{perfil.nombre}</h1>
              <p className="usuario-bio">{perfil.bio}</p>

              <button
                className="usuario-btn-principal"
                onClick={() => setEditando(true)}
              >
                ✎ Editar perfil
              </button>
            </>
          ) : (
            <form className="usuario-formulario" onSubmit={guardarPerfil}>
              <label htmlFor="nombreUsuario">Tu nombre</label>
              <input
                id="nombreUsuario"
                type="text"
                maxLength={40}
                value={nombreTemporal}
                onChange={e => setNombreTemporal(e.target.value)}
                placeholder="Escribe tu nombre"
              />

              <label htmlFor="bioUsuario">Tu descripción</label>
              <textarea
                id="bioUsuario"
                maxLength={150}
                value={bioTemporal}
                onChange={e => setBioTemporal(e.target.value)}
                placeholder="Cuéntanos sobre ti..."
                rows={3}
              />

              <div className="usuario-acciones">
                <button className="usuario-btn-principal" type="submit">
                  Guardar cambios
                </button>
                <button
                  className="usuario-btn-secundario"
                  type="button"
                  onClick={cancelarEdicion}
                >
                  Cancelar
                </button>
              </div>
            </form>
          )}

          <div className="usuario-separador" />

          <h2 className="usuario-subtitulo">Mi actividad</h2>

          <div className="usuario-estadisticas">
            <article className="usuario-stat">
              <span className="usuario-stat-icono">♥</span>
              <strong>{favoritos.length}</strong>
              <p>Favoritos</p>
            </article>

            <article className="usuario-stat">
              <span className="usuario-stat-icono">👽</span>
              <strong>{decididos.length}</strong>
              <p>Personajes vistos</p>
            </article>

            <article className="usuario-stat">
              <span className="usuario-stat-icono">🌌</span>
              <strong>{Math.max(decididos.length - favoritos.length, 0)}</strong>
              <p>Descartados aprox.</p>
            </article>
          </div>

          <div className="usuario-nota">
            <span>🛸</span>
            <div>
              <h3>¡Sigue explorando!</h3>
              <p>
                Encuentra nuevos personajes en Inicio y guarda tus favoritos
                para construir tu propio multiverso.
              </p>
            </div>
          </div>

          <p className="usuario-pie">
            Tus datos de perfil se guardan en este navegador.
          </p>
        </div>
      </section>
    </main>
  );
}

export default Usuario;
