
import { useState, useEffect } from 'react';
import './Style.css';

function Inicio() {
  const [personajes, setPersonajes] = useState([]);
  const [pagina, setPagina] = useState(1);
  const [siguientePagina, setSiguientePagina] = useState(true);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');

  const [favoritos, setFavoritos] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('favoritos') || '[]');
    } catch {
      return [];
    }
  });

  const [decididos, setDecididos] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('personajesDecididos') || '[]');
    } catch {
      return [];
    }
  });

  const [desplazamientoInicial, setDesplazamientoInicial] =
    useState(null);

  // Consultar personajes de Rick and Morty
  useEffect(() => {
    let cancelado = false;

    async function cargarPersonajes() {
      setCargando(true);
      setError('');

      try {
        const respuesta = await fetch(
          `https://rickandmortyapi.com/api/character?page=${pagina}`
        );

        if (!respuesta.ok) {
          throw new Error('No se pudieron cargar los personajes.');
        }

        const datos = await respuesta.json();

        if (!cancelado) {
          setPersonajes(actuales => [
            ...actuales,
            ...datos.results
          ]);

          setSiguientePagina(Boolean(datos.info.next));
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

    cargarPersonajes();

    return () => {
      cancelado = true;
    };
  }, [pagina]);

  // Mostrar solo personajes que todavía no fueron evaluados
  const disponibles = personajes.filter(
    personaje => !decididos.includes(personaje.id)
  );

  const personajeActual = disponibles[0];

  // Cargar más personajes cuando queden pocos
  useEffect(() => {
    if (
      disponibles.length <= 3 &&
      siguientePagina &&
      !cargando
    ) {
      setPagina(actual => actual + 1);
    }
  }, [disponibles.length, siguientePagina, cargando]);

  // Registrar decisión
  const decidirPersonaje = (darLike) => {
    if (!personajeActual) return;

    const id = personajeActual.id;

    const nuevosDecididos = [...decididos, id];

    setDecididos(nuevosDecididos);
    localStorage.setItem(
      'personajesDecididos',
      JSON.stringify(nuevosDecididos)
    );

    if (darLike) {
      const nuevosFavoritos = [
        ...favoritos.filter(p => p.id !== id),
        {
          id: personajeActual.id,
          nombre: personajeActual.name,
          image: personajeActual.image,
          status: personajeActual.status,
          species: personajeActual.species,
          gender: personajeActual.gender,
          origin: personajeActual.origin.name,
          location: personajeActual.location.name,
          episode: personajeActual.episode
        }
      ];

      setFavoritos(nuevosFavoritos);
      localStorage.setItem(
        'favoritos',
        JSON.stringify(nuevosFavoritos)
      );
    }
  };

  // Detectar deslizamiento en pantalla táctil
  const iniciarDeslizamiento = (evento) => {
    setDesplazamientoInicial(evento.touches[0].clientX);
  };

  const terminarDeslizamiento = (evento) => {
    if (desplazamientoInicial === null) return;

    const desplazamientoFinal = evento.changedTouches[0].clientX;
    const diferencia = desplazamientoFinal - desplazamientoInicial;

    if (diferencia > 80) {
      decidirPersonaje(true);
    } else if (diferencia < -80) {
      decidirPersonaje(false);
    }

    setDesplazamientoInicial(null);
  };

  if (error && personajes.length === 0) {
    return (
      <div className="tinder-container">
        <p>{error}</p>
        <button onClick={() => window.location.reload()}>
          Intentar de nuevo
        </button>
      </div>
    );
  }

  return (
    <main className="tinder-container">
      <header className="tinder-header">
        <h1>Rick & Morty <span>Swipe</span></h1>
        <p>¿Quién merece entrar en tu multiverso?</p>
      </header>

      {personajeActual ? (
        <section className="tinder-card-container">
          <article
            className="tinder-card"
            onTouchStart={iniciarDeslizamiento}
            onTouchEnd={terminarDeslizamiento}
          >
            <img
              className="tinder-imagen"
              src={personajeActual.image}
              alt={personajeActual.name}
              draggable="false"
            />

            <div className="tinder-info">
              <span className="tinder-id">
                #{personajeActual.id}
              </span>

              <h2>{personajeActual.name}</h2>

              <p>
                {personajeActual.status} · {personajeActual.species}
              </p>

              <p>
                <strong>Género:</strong> {personajeActual.gender}
              </p>

              <p>
                <strong>Origen:</strong> {personajeActual.origin.name}
              </p>

              <p>
                <strong>Ubicación:</strong> {personajeActual.location.name}
              </p>
            </div>
          </article>

          <div className="tinder-botones">
            <button
              className="btn-dislike"
              onClick={() => decidirPersonaje(false)}
              aria-label="Descartar personaje"
            >
              ✕
            </button>

            <button
              className="btn-like"
              onClick={() => decidirPersonaje(true)}
              aria-label="Agregar a favoritos"
            >
              ♥
            </button>
          </div>

          <p className="tinder-ayuda">
            Desliza a la izquierda para descartar o a la derecha para dar Like.
          </p>
        </section>
      ) : (
        <div className="tinder-fin">
          <h2>¡Has explorado este universo!</h2>
          <p>
            {cargando
              ? 'Cargando más personajes...'
              : 'Ya no quedan personajes disponibles por mostrar.'}
          </p>

          {error && <p>{error}</p>}

          {!cargando && !siguientePagina && (
            <button
              onClick={() => {
                setPersonajes([]);
                setPagina(1);
                setSiguientePagina(true);
                setDecididos([]);
                localStorage.removeItem('personajesDecididos');
              }}
            >
              Empezar de nuevo
            </button>
          )}
        </div>
      )}
    </main>
  );
}

export default Inicio;
