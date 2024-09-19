import { useEffect, useState } from 'react';

const Facturas = () => {
    console.log('1');
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [cfdis, setCfdis] = useState([]); // Almacenar CFDIs

    const Cfdis = async () => {  // Renombrar la función
        setLoading(true); // Mostrar el estado de carga
        setError(null); // Limpiar cualquier error previo

        try {
            const res = await fetch("http://127.0.0.1:8000/api/cfdi", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });

            const data = await res.json(); // Obtener los datos en formato JSON
            setCfdis(data.cfdis); // Asumiendo que los CFDIs están en data.cfdis
            console.table(data);
            setSuccess(true);
        } catch (err) {
            setError('Error en la conexión');
        } finally {
            setLoading(false);
        }
    };

    /**
     *  useEffect para llamar a Cfdis cuando el componente se cargue
     */
    useEffect(() => {
        Cfdis()
    }, []);

    return (
        <div>
            <h1>CFDIS</h1>
            {/* <button onClick={Cfdis}>Cargar CFDIs</button>  */}
            {loading && <p>Cargando...</p>} {/* Mostrar mensaje de carga */}
            {error && <p>{error}</p>} {/* Mostrar error si lo hay */}

            {!loading && !error && cfdis.length > 0 && (
                <div>
                    {cfdis.map((cfdi, index) => ( // Renderizar los CFDIs
                        <div key={index}>
                            <p>{cfdi.id_factura}</p>
                            <p>{cfdi.emisor}</p>
                            <p>{cfdi.emisorRfc}</p>
                        </div>// Asumiendo que 'nombre' es una propiedad del cfdi

                    ))}
                </div>
            )}
        </div>
    );
};

export default Facturas;