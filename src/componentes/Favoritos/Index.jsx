
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

  return (
    <div className="favoritos-rm-container">
      <header className="favoritos-rm-header">
        <h1>❤️ Mis Favoritos</h1>
        <p>Los personajes de tu multiverso</p>
      </header>

      {favoritos.length === 0 ? (
        <div className="favoritos-rm-vacio">
          <h2>¡Aún no tienes favoritos!</h2>
          <p>
            Ve a Inicio y desliza a la derecha
            para guardar tus personajes preferidos.
          </p>
        </div>
      ) : (
        <div className="c-lista">
          {favoritos.map((personaje) => (
            <div
              key={personaje.id}
              className="c-lista-pokemon"
            >
              <div
                className="favorito-contenido"
                onClick={() =>
                  navigate(`/personaje/${personaje.id}`)
                }
              >
                <p className="favorito-id">
                  #{personaje.id}
                </p>

                <img
                  src={personaje.image}
                  alt={personaje.nombre}
                  loading="lazy"
                />

                <h3>{personaje.nombre}</h3>

                <p className="favorito-estado">
                  {personaje.status} · {personaje.species}
                </p>
              </div>

              <button
                className="favorito-quitar"
                onClick={() => quitarFavorito(personaje.id)}
                aria-label={`Quitar a ${personaje.nombre} de favoritos`}
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
