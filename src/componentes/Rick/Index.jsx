
import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import './Style.css';

function Personaje() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [personaje, setPersonaje] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');

  const [favoritos, setFavoritos] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('favoritos') || '[]');
    } catch {
      return [];
    }
  });

  useEffect(() => {
    let cancelado = false;

    async function cargarPersonaje() {
      setCargando(true);
      setError('');

      try {
        const respuesta = await fetch(
          `https://rickandmortyapi.com/api/character/${id}`
        );

        if (!respuesta.ok) {
          throw new Error('No encontramos este personaje.');
        }

        const datos = await respuesta.json();

        if (!cancelado) {
          setPersonaje(datos);
        }
      } catch (err) {
        if (!cancelado) {
          setError(err.message);
        }
      } finally {
        if (!cancelado) {
          setCargando(false);
        }
      }
    }

    cargarPersonaje();

    return () => {
      cancelado = true;
    };
  }, [id]);

  const esFavorito = favoritos.some(p => p.id === personaje?.id);

  const toggleFavorito = () => {
    if (!personaje) return;

    let nuevosFavoritos;

    if (esFavorito) {
      nuevosFavoritos = favoritos.filter(p => p.id !== personaje.id);
    } else {
      nuevosFavoritos = [
        ...favoritos,
        {
          id: personaje.id,
          nombre: personaje.name,
          image: personaje.image,
          status: personaje.status,
          species: personaje.species,
          gender: personaje.gender,
          origin: personaje.origin.name,
          location: personaje.location.name,
          episode: personaje.episode
        }
      ];
    }

    setFavoritos(nuevosFavoritos);
    localStorage.setItem('favoritos', JSON.stringify(nuevosFavoritos));
  };

  if (cargando) {
    return <div className="personaje-mensaje">Cargando personaje...</div>;
  }

  if (error || !personaje) {
    return (
      <div className="personaje-mensaje">
        <h2>¡Ups! Portal equivocado</h2>
        <p>{error || 'No encontramos el personaje.'}</p>
        <button onClick={() => navigate('/inicio')}>Volver</button>
      </div>
    );
  }

  return (
    <main className="personaje-container">
      <button className="personaje-volver" onClick={() => navigate(-1)}>
        ← Volver
      </button>

      <section className="personaje-detalle">
        <div className="personaje-imagen-container">
          <img
            className="personaje-imagen"
            src={personaje.image}
            alt={personaje.name}
          />

          <span className="personaje-id">#{personaje.id}</span>
        </div>

        <div className="personaje-info">
          <span className="personaje-etiqueta">
            ARCHIVO INTERDIMENSIONAL
          </span>

          <h1>{personaje.name}</h1>

          <p className="personaje-estado">
            <span
              className={`personaje-punto ${
                personaje.status === 'Alive'
                  ? 'vivo'
                  : personaje.status === 'Dead'
                    ? 'muerto'
                    : 'desconocido'
              }`}
            />
            {personaje.status === 'Alive'
              ? 'Vivo'
              : personaje.status === 'Dead'
                ? 'Muerto'
                : 'Desconocido'}
            {' · '}
            {personaje.species}
          </p>

          <div className="personaje-datos">
            <article>
              <span>Género</span>
              <strong>{personaje.gender}</strong>
            </article>

            <article>
              <span>Origen</span>
              <strong>{personaje.origin.name}</strong>
            </article>

            <article>
              <span>Última ubicación</span>
              <strong>{personaje.location.name}</strong>
            </article>

            <article>
              <span>Primera aparición</span>
              <strong>
                {personaje.episode.length > 0
                  ? `Episodio ${personaje.episode[0].split('/').pop()}`
                  : 'Desconocida'}
              </strong>
            </article>

            <article>
              <span>Total de episodios</span>
              <strong>{personaje.episode.length}</strong>
            </article>

            <article>
              <span>Creado</span>
              <strong>
                {new Date(personaje.created).toLocaleDateString('es-CO')}
              </strong>
            </article>
          </div>

          <button
            className={`personaje-favorito ${
              esFavorito ? 'activo' : ''
            }`}
            onClick={toggleFavorito}
          >
            {esFavorito ? '♥ Quitar de favoritos' : '♡ Agregar a favoritos'}
          </button>
        </div>
      </section>
    </main>
  );
}

export default Personaje;
