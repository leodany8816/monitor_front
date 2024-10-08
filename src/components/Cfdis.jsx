import { useEffect, useState } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import "primereact/resources/themes/lara-light-cyan/theme.css"; // Tema de PrimeReact

const Facturas = () => {
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [cfdis, setCfdis] = useState([]); // Almacenar CFDIs
    // const [selectedRows, setSelectedRows] = useState([]); // Almacenar filas seleccionadas
    const [selectedRows, setSelectedRows] = useState([]); // Filas seleccionadas
    const [first, setFirst] = useState(0); // Índice de la primera fila visible en la página actual
    const [rowsPerPage, setRowsPerPage] = useState(2); // Cantidad de filas por página
    const [showWarning, setShowWarning] = useState(false); // Para mostrar mensaje si no se seleccionan facturas


    useEffect(() => {
        const fetchCfdis = async () => {
            setLoading(true);
            setError(null);

            try {
                const res = await fetch("http://127.0.0.1:8000/api/cfdi", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                });

                const data = await res.json();
                setCfdis(data.cfdis);
            } catch (err) {
                setError('Error en la conexión ' + err);
            } finally {
                setLoading(false);
            }
        };
        fetchCfdis();
    }, []);

    const Columns = [
        { field: 'emisor', header: 'Emisor' },
        { field: 'emisorRfc', header: 'Rfc Emisor' },
        { field: 'serie', header: 'Serie' },
        { field: 'folio', header: 'Folio' },
        { field: 'receptor', header: 'Receptor' },
        { field: 'receptorRfc', header: 'Rfc Receptor' },
        { field: 'fechaEmision', header: 'Fecha Emision' },
        { field: 'tipoComprobante', header: 'Tipo Comprobante' },
        { field: 'subtotal', header: 'SubTotal' },
        { field: 'traslado', header: 'Traslado' },
        { field: 'retencion', header: 'Retencion' },
        { field: 'total', header: 'Total' },
        {
            body: () => (
                <div className="flex items-center">
                    <img className="h-auto max-w-s" src="img/pdf_icon.png" alt="PDF" />
                    <img className="h-auto max-w-s" src="img/zip_icon.png" alt="ZIP" />
                </div>
            ),
            header: 'Descarga'
        },
    ];


    // Función para manejar la selección de un checkbox individual
    const handleCheckboxChange = (event, rowData) => {
        const { checked } = event.target;
        if (checked) {
            setSelectedRows(prev => [...prev, rowData]); // Agregar fila seleccionada
        } else {
            setSelectedRows(prev => prev.filter(row => row.id_factura !== rowData.id_factura)); // Quitar fila seleccionada
        }
    };

    // Función para manejar el cambio de página
    const handlePageChange = (event) => {
        setFirst(event.first); // Actualizar el índice de la primera fila visible
        setRowsPerPage(event.rows); // Actualizar la cantidad de filas visibles por página
        setSelectedRows([]); // Desseleccionar filas al cambiar de página
    };

    // Filtrar CFDIs que pertenecen a la página actual
    const cfdisPaginaActual = cfdis.slice(first, first + rowsPerPage);

    // Función para seleccionar/deseleccionar todas las filas visibles en la página actual
    const handleSelectAllChange = (event) => {
        const { checked } = event.target;
        if (checked) {
            // Seleccionar todas las filas visibles en la página actual
            setSelectedRows(cfdisPaginaActual);
        } else {
            // Deseleccionar todas las filas
            setSelectedRows([]);
        }
    };

    // Función para renderizar el checkbox en el encabezado
    const renderHeaderCheckbox = () => {
        const allSelected = selectedRows.length === cfdisPaginaActual.length && cfdisPaginaActual.length > 0;
        return (
            <input
                type="checkbox"
                checked={allSelected}
                onChange={handleSelectAllChange}
            />
        );
    };

    // Función para renderizar el checkbox en las filas
    const renderCheckbox = (rowData) => {
        return (
            <input
                type="checkbox"
                checked={selectedRows.some(row => row.id_factura === rowData.id_factura)}
                onChange={(e) => handleCheckboxChange(e, rowData)}
            />
        );
    };

    const mostrarFacturasSeleccionadas = () => {
        const idsSeleccionados = selectedRows.map(c => c.id_factura);
        console.log(idsSeleccionados);
        return idsSeleccionados.join(', ');
    };

    /**Se envian la data de los cfdis para descargar el zip  */
    const descargarZip = async () => {
        setLoading(true);
        setError(null);
        const dataCfdis = mostrarFacturasSeleccionadas();
        if (dataCfdis.length === 0) {
            // Si no hay facturas seleccionadas, mostrar advertencia
            setShowWarning(true);
            return;
        }

        setShowWarning(false); // Ocultar la advertencia si hay selección
        console.log('son los que se van enviar');
        console.log(dataCfdis);
        try {
            const res = await fetch("http://127.0.0.1:8000/api/downloadzip", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
                body: JSON.stringify({
                    cfdis: dataCfdis
                }),
            });

            const data = await res.json();
            console.log('respuesta de la descarga');
            console.table(data);
            if(data.exito){
                let nameZip =  data.nombreZip;
                let fileBase64 = data.file_base64;
                downloadZip(fileBase64, nameZip);
            }else{
                setError('Error en la conexión ' . data.error);
            }

        } catch (err) {
            setError('Error en la conexión ' + err);
        } finally {
            setLoading(false);
        }
    };

    const downloadZip = (base64String, fileName) => {
        const source = `data:application/zip;base64,${base64String}`;
        const link = document.createElement('a');
        link.href = source;
        link.download = fileName;
        link.click();
      }

    return (
        <div>
            <h1>CFDIS</h1>
            {loading && <p>Cargando...</p>}
            {error && <p>{error}</p>}

            {/* Mostrar advertencia si no se selecciona ninguna factura */}
            {showWarning && <p style={{ color: 'red' }}>Debe seleccionar al menos una factura.</p>}



            <button type="button" onClick={descargarZip} class="text-white bg-blue-700 hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 font-medium rounded-full text-sm px-5 py-2.5 text-center me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Descargar Zip</button>
            {/* Mostrar los IDs seleccionados */}
            <div>
                <h3>Facturas Seleccionadas: {mostrarFacturasSeleccionadas()}</h3>
            </div>

            <DataTable
                value={cfdis}
                dataKey="id_factura"
                paginator
                rows={rowsPerPage}
                first={first}
                onPage={handlePageChange}
                rowsPerPageOptions={[2, 4, 6]}
                paginatorTemplate="RowsPerPageDropdown FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink"
                currentPageReportTemplate="{first} a {last} de {totalRecords}"
            >
                <Column
                    header={renderHeaderCheckbox}
                    body={renderCheckbox}
                    headerStyle={{ width: '3rem' }}
                />
                {Columns.map((col, i) => (
                    <Column key={col.field || i} field={col.field} header={col.header} body={col.body} />
                ))}
            </DataTable>
        </div>
    );
};

export default Facturas;
