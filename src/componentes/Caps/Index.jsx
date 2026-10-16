
import { useState, useEffect } from 'react';
import './Style.css';

function Caps() {
  const [episodios, setEpisodios] = useState([]);
  const [temporadaSeleccionada, setTemporadaSeleccionada] = useState('Todas');
  const [busqueda, setBusqueda] = useState('');
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function cargarEpisodios() {
      try {
        setCargando(true);
        setError('');

        const primeraRespuesta = await fetch(
          'https://rickandmortyapi.com/api/episode'
        );

        if (!primeraRespuesta.ok) {
          throw new Error('No se pudieron cargar los episodios.');
        }

        const primeraPagina = await primeraRespuesta.json();
        const totalPaginas = primeraPagina.info.pages;

        const respuestas = await Promise.all(
          Array.from({ length: totalPaginas - 1 }, (_, i) =>
            fetch(`https://rickandmortyapi.com/api/episode?page=${i + 2}`)
          )
        );

        const paginas = await Promise.all(
          respuestas.map(respuesta => {
            if (!respuesta.ok) {
              throw new Error('Error al cargar los episodios.');
            }
            return respuesta.json();
          })
        );

        setEpisodios([
          ...primeraPagina.results,
          ...paginas.flatMap(pagina => pagina.results)
        ]);
      } catch (err) {
        setError(err.message);
      } finally {
        setCargando(false);
      }
    }

    cargarEpisodios();
  }, []);

  const temporadas = [
    ...new Set(
      episodios.map(episodio => episodio.episode.slice(0, 3))
    )
  ].sort();

  const episodiosFiltrados = episodios.filter(episodio => {
    const coincideTemporada =
      temporadaSeleccionada === 'Todas' ||
      episodio.episode.startsWith(temporadaSeleccionada);

    const coincideBusqueda =
      episodio.name.toLowerCase().includes(busqueda.toLowerCase()) ||
      episodio.episode.toLowerCase().includes(busqueda.toLowerCase());

    return coincideTemporada && coincideBusqueda;
  });

  return (
    <main className="caps-container">
      <div className="caps-overlay">
        <header className="caps-header">
          <p className="caps-etiqueta">EL ARCHIVO INTERDIMENSIONAL</p>
          <h1>
            Rick & Morty <span>Caps</span>
          </h1>
          <p>
            Cada episodio es una nueva aventura por el multiverso.
          </p>
        </header>

        <section className="caps-controles">
          <input
            type="text"
            placeholder="Buscar episodio por nombre o código..."
            value={busqueda}
            onChange={e => setBusqueda(e.target.value)}
            aria-label="Buscar episodio"
          />

          <select
            value={temporadaSeleccionada}
            onChange={e => setTemporadaSeleccionada(e.target.value)}
            aria-label="Filtrar por temporada"
          >
            <option value="Todas">Todas las temporadas</option>
            {temporadas.map(temporada => (
              <option key={temporada} value={temporada}>
                Temporada {temporada.slice(1)}
              </option>
            ))}
          </select>
        </section>

        {cargando ? (
          <p className="caps-mensaje">Cargando episodios del multiverso...</p>
        ) : error ? (
          <div className="caps-mensaje">
            <p>{error}</p>
            <button onClick={() => window.location.reload()}>
              Intentar de nuevo
            </button>
          </div>
        ) : (
          <>
            <p className="caps-contador">
              {episodiosFiltrados.length} episodios encontrados
            </p>

            <section className="caps-grid">
              {episodiosFiltrados.map(episodio => (
                <article className="caps-card" key={episodio.id}>
                  <div className="caps-card-top">
                    <span className="caps-codigo">
                      {episodio.episode}
                    </span>
                    <span className="caps-icono">▶</span>
                  </div>

                  <h2>{episodio.name}</h2>

                  <div className="caps-detalles">
                    <p>
                      <strong>Estreno:</strong> {episodio.air_date}
                    </p>
                    <p>
                      <strong>Personajes:</strong>{' '}
                      {episodio.characters.length}
                    </p>
                  </div>

                  <div className="caps-card-footer">
                    <span>
                      Temporada {episodio.episode.slice(1, 3)}
                    </span>
                    <span>
                      Episodio {episodio.episode.slice(4)}
                    </span>
                  </div>
                </article>
              ))}
            </section>

            {episodiosFiltrados.length === 0 && (
              <div className="caps-mensaje">
                No encontramos episodios con esa búsqueda.
              </div>
            )}
          </>
        )}
      </div>
    </main>
  );
}

export default Caps;
