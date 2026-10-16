
import { useState, useEffect } from 'react';
import './Style.css';

function Multiverso() {
  const [lugares, setLugares] = useState([]);
  const [busqueda, setBusqueda] = useState('');
  const [tipoSeleccionado, setTipoSeleccionado] = useState('Todos');
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function cargarLugares() {
      try {
        setCargando(true);
        setError('');

        const primera = await fetch(
          'https://rickandmortyapi.com/api/location'
        );

        if (!primera.ok) {
          throw new Error('No se pudieron cargar las ubicaciones.');
        }

        const datosIniciales = await primera.json();
        const peticiones = [];

        for (let pagina = 2; pagina <= datosIniciales.info.pages; pagina++) {
          peticiones.push(
            fetch(`https://rickandmortyapi.com/api/location?page=${pagina}`)
          );
        }

        const respuestas = await Promise.all(peticiones);
        const datosPaginas = await Promise.all(
          respuestas.map(async respuesta => {
            if (!respuesta.ok) {
              throw new Error('Error al cargar las dimensiones.');
            }
            return respuesta.json();
          })
        );

        setLugares([
          ...datosIniciales.results,
          ...datosPaginas.flatMap(pagina => pagina.results)
        ]);
      } catch (err) {
        setError(err.message);
      } finally {
        setCargando(false);
      }
    }

    cargarLugares();
  }, []);

  const tipos = [...new Set(lugares.map(lugar => lugar.type))].sort();

  const lugaresFiltrados = lugares.filter(lugar => {
    const coincideBusqueda =
      lugar.name.toLowerCase().includes(busqueda.toLowerCase()) ||
      lugar.dimension.toLowerCase().includes(busqueda.toLowerCase());

    const coincideTipo =
      tipoSeleccionado === 'Todos' || lugar.type === tipoSeleccionado;

    return coincideBusqueda && coincideTipo;
  });

  return (
    <main className="multiverso-container">
      <header className="multiverso-header">
        <span className="multiverso-etiqueta">PORTAL INTERDIMENSIONAL</span>
        <h1>Explora el <span>Multiverso</span></h1>
        <p>126 ubicaciones conocidas... y quién sabe cuántas más.</p>
      </header>

      <section className="multiverso-controles">
        <input
          type="search"
          placeholder="Buscar planeta, dimensión..."
          value={busqueda}
          onChange={e => setBusqueda(e.target.value)}
          aria-label="Buscar ubicación o dimensión"
        />

        <select
          value={tipoSeleccionado}
          onChange={e => setTipoSeleccionado(e.target.value)}
          aria-label="Filtrar por tipo de ubicación"
        >
          <option value="Todos">Todos los tipos</option>
          {tipos.map(tipo => (
            <option key={tipo} value={tipo}>{tipo}</option>
          ))}
        </select>
      </section>

      {cargando ? (
        <p className="multiverso-mensaje">Abriendo portales...</p>
      ) : error ? (
        <div className="multiverso-mensaje">
          <p>{error}</p>
          <button onClick={() => window.location.reload()}>
            Intentar de nuevo
          </button>
        </div>
      ) : (
        <>
          <p className="multiverso-contador">
            {lugaresFiltrados.length} ubicaciones encontradas
          </p>

          <section className="multiverso-grid">
            {lugaresFiltrados.map(lugar => (
              <article className="multiverso-card" key={lugar.id}>
                <div className="multiverso-card-icono">✦</div>

                <span className="multiverso-tipo">{lugar.type}</span>

                <h2>{lugar.name}</h2>

                <div className="multiverso-datos">
                  <p><strong>Dimensión</strong></p>
                  <span>{lugar.dimension || 'Desconocida'}</span>
                </div>

                <div className="multiverso-residentes">
                  <span>👽 Residentes registrados</span>
                  <strong>{lugar.residents.length}</strong>
                </div>

                <div className="multiverso-card-footer">
                  UBICACIÓN #{lugar.id}
                </div>
              </article>
            ))}
          </section>

          {lugaresFiltrados.length === 0 && (
            <div className="multiverso-mensaje">
              No encontramos ubicaciones con esos criterios.
            </div>
          )}
        </>
      )}
    </main>
  );
}

export default Multiverso;
