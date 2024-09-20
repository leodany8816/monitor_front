import { useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';

const Facturas = () => {
    console.log('1');
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [cfdis, setCfdis] = useState([]); // Almacenar CFDIs

    /**
     *  useEffect para llamar a Cfdis cuando el componente se cargue
     */
    useEffect(() => {
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
        Cfdis();
    }, []);

    /**
     * Definimos las columnas de las tablas
     */
    const Columns = [
        {
            name: 'Id',
            selector: row => <input type="checkbox" value={row.id_factura} />,
            sortable: true,
        },
        {
            name: 'Emisor',
            selector: row => row.emisor,
            sortable: true,
            width: '15rem',
        },
        {
            name: 'Rfc Emisor',
            selector: row => row.emisorRfc,
            sortable: true,
            width: '10rem',
        },
        {
            name: 'Serie',
            selector: row => row.serie,
            sortable: true,
        },
        {
            name: 'Folio',
            selector: row => row.folio,
            sortable: true,
        },
        {
            name: 'Receptor',
            selector: row => row.receptor,
            sortable: true,
            width: '20rem',
        },
        {
            name: 'Rfc Receptor',
            selector: row => row.receptorRfc,
            sortable: true,
            width: '10rem',
        },
        {
            name: 'Fecha Emisión',
            selector: row => row.fechaEmision,
            sortable: true,
        },
        {
            name: 'Tipo Comprobante',
            // selector: row => row.tipoComprobante == 'E' ? 'Egreso' : 'Ingreso',
            selector: row => row.tipoComprobante,
            sortable: true,
        },
        {
            name: 'SubTotal',
            selector: row => row.subtotal,
            sortable: true,
        },
        {
            name: 'Traslados',
            selector: row => row.traslado,
            sortable: true,
        },
        {
            name: 'Retenciones',
            selector: row => row.retencion,
            sortable: true,
        },
        {
            name: 'Total',
            selector: row => row.total,
            sortable: true,
        },
        {
            name: '',
            selector: row => (
                <div  className="flex items-center">
            <img className="h-auto max-w-s" src="img/pdf_icon.png" />
            <img className="h-auto max-w-s" src="img/zip_icon.png" />
            </div>),
            sortable: true,
            width: '8rem',
            // name: '',
            // selector: row => <img className="h-auto max-w-s" src="img/pdf_icon.png" />,
            // sortable: true,
        },
        // {
        //     name: '',
        //     selector: row => <img className="h-auto max-w-s" src="img/zip_icon.png" />,
        //     sortable: true,
        // }

    ]

    const customStyles = {
        rows: {
            style: {
                minHeight: '50px', // Cambia según sea necesario
            },
        },
        headCells: {
            style: {
                fontSize: '1rem',
                fontWeight: '700',
                backgroundColor: '#f8fafc', // Fondo claro usando colores de Tailwind
                padding: '1rem',
            },
        },
        cells: {
            style: {
                padding: '0.75rem',
                whiteSpace: 'normal',
            },
        },
    };

    // const formattedDate = new Intl.DateTimeFormat('es-ES', {
    //     day: '2-digit',
    //     month: '2-digit',
    //     year: 'numeric'
    //   }).format(date);


    return (
        <div>
            <h1>CFDIS</h1>
            {/* <button onClick={Cfdis}>Cargar CFDIs</button>  */}
            {loading && <p>Cargando...</p>} {/* Mostrar mensaje de carga */}
            {error && <p>{error}</p>} {/* Mostrar error si lo hay */}

            <DataTable
                columns={Columns}
                data={cfdis}
                pagination
            // highlightOnHover
            // striped
            // customStyles={customStyles}

            />


            {/*                         
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
            )} */}
        </div>
    );
};

export default Facturas;