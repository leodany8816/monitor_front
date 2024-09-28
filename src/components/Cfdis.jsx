import { useEffect, useState } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import Spinner from './spinner';
import Mensaje from './Message';

// import 'primereact/resources/themes/bootstrap4-dark-blue/theme.css';  // O el tema que prefieras
// import 'primereact/resources/primereact.min.css';
// import 'primeicons/primeicons.css';

const Facturas = () => {
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [cfdis, setCfdis] = useState([]); // Almacenar CFDIs
    // const [selectedRows, setSelectedRows] = useState([]); // Almacenar filas seleccionadas
    const [selectedRows, setSelectedRows] = useState([]); // Filas seleccionadas
    const [first, setFirst] = useState(0); // Índice de la primera fila visible en la página actual
    const [rowsPerPage, setRowsPerPage] = useState(2); // Cantidad de filas por página
    const [showWarning, setShowWarning] = useState(false); // Para mostrar mensaje si no se seleccionan facturas
    const path_img = 'https://bekaert.grupo-citi.com/img/pdf_icon.png';


    useEffect(() => {
        const fetchCfdis = async () => {
            setLoading(true);
            setError(null);

            try {
                // const res = await fetch("http://127.0.0.1:8000/api/cfdi", {
                const res = await fetch("https://apis.grupo-citi.com/api/cfdi", {
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
        { field: 'emisor', header: 'Emisor', width: '150px' },
        { field: 'emisorRfc', header: 'Rfc Emisor' },
        { field: 'serie', header: 'Serie' },
        { field: 'folio', header: 'Folio' },
        { field: 'receptor', header: 'Receptor' },
        { field: 'receptorRfc', header: 'Rfc Receptor' },
        { field: 'fechaEmision', header: 'Fecha Emision', width: '150px' },
        { field: 'tipoComprobante', header: 'Tipo Comprobante' },
        { field: 'subtotal', header: 'SubTotal' },
        { field: 'traslado', header: 'Traslado' },
        { field: 'retencion', header: 'Retencion' },
        { field: 'total', header: 'Total' },
        {
            // header: ''
            // body: () => (
            //     <div className="flex items-center">
            //         <img className="h-auto max-w-s" src="img/pdf_icon.png" alt="PDF" />
            //         <img className="h-auto max-w-s" src="img/zip_icon.png" alt="ZIP" onClick={renderDomwnloadPdf} />
            //     </div>
            // ),
            // header: 'Descarga'
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



    // Funcion para renderizar la imagen en la columna y agregar el evento onclick
    const btnImage = (rowData) => {
        return (
            <img
                src={`${path_img}`} alt="PDF"
                className="h-auto max-w-s"
                style={{ cursor: 'pointer', width: '40px' }}
                onClick={() => downloadPDFClick(rowData.id_factura)}
            />
            // <div>
            //     <a href="https://google.com" target='_blank'>
            //     <img
            //         src="img/pdf_icon.png" alt="PDF"
            //         className="h-auto max-w-s"
            //         style={{ cursor: 'pointer', width: '30px' }}
            //     //onClick={() => handleImageClick(rowData.id_factura)}
            //     />
            //     </a>
            // </div>
        );
    }

    // Funcion para manejar el click la imagen para mostrar el pdf
    const downloadPDFClick = async (id_factura) => {
        setLoading(true);
        setError(null);
        const idfactura = id_factura;
        try {
            // const res = await fetch("http://127.0.0.1:8000/api/downloadpdf", {
            const res = await fetch("https://apis.grupo-citi.com/api/downloadpdf", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
                body: JSON.stringify({
                    idFactura: idfactura
                }),
            });

            const data = await res.json();
            //console.table(data);
            if (data.exito) {
                let namePdf = data.nombrePdf;
                let fileBase64 = data.file_base64;
                downloadPdf(fileBase64, namePdf);
                // abrirFilePdf(fileBase64);
            }

        } catch (err) {
            setError('Error en el servicio ' + err);
        } finally {
            setLoading(false);
        }

    };

    const mostrarFacturasSeleccionadas = () => {
        const idsSeleccionados = selectedRows.map(c => c.id_factura);
        //console.log(idsSeleccionados);
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
            setLoading(false);
            return;
        }

        setShowWarning(false); // Ocultar la advertencia si hay selección
        // console.log('son los que se van enviar');
        // console.log(dataCfdis);
        try {
            // const res = await fetch("http://127.0.0.1:8000/api/downloadzip", {
            const res = await fetch("https://apis.grupo-citi.com/api/downloadzip", {
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
            // console.log('respuesta de la descarga');
            // console.table(data);
            if (data.exito) {
                let nameZip = data.nombreZip;
                let fileBase64 = data.file_base64;
                downloadZip(fileBase64, nameZip);
                setSelectedRows([]);
            } else {
                setError('Error en la conexión '.data.error);
                setLoading(false);
            }

        } catch (err) {
            setError('Error en la conexión ' + err);
            setLoading(false);
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

    const downloadPdf = (base64String, fileName) => {
        const source = `data:application/pdf;base64,${base64String}`;
        const link = document.createElement('a');
        link.href = source;
        link.download = fileName;
        link.target = '_blank';
        link.click();
    }

    /// abrir el pdf en una nueva pestaña del navedador
    // const abrirFilePdf = (pdfBase64) => {
    //     const source = `data:application/pdf;base64,${pdfBase64}`;
    //     const newWindows = window.open();
    //     if (newWindows) {
    //         newWindows.document.write(
    //             `<iframe src="${source}" style="width:100%; height:100%;" frameborder="0"></iframe>`
    //         );
    //     } else {
    //         setError('No se pudo abrir una nueva pestaña. Verifica los bloqueadores de ventanas emergentes.');
    //     }
    // }

    return (
        <div>
            {/* <h1>CFDIS</h1> */}
            {loading &&
                <div className='mt-1'><Spinner /></div>
            }
            {/* Mostrar advertencia si no se selecciona ninguna factura */}
            {showWarning &&
                <div className='mt-3'>
                    <Mensaje showError={showWarning} showText='Debe seleccionar al menos una factura.' />
                </div>
            }



            <button type="button" onClick={descargarZip} class="text-white bg-blue-700 hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 font-medium rounded-full text-sm px-5 py-2.5 text-center me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 mt-9">Descargar Zip</button>
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
                size="large"
                onPage={handlePageChange}
                rowsPerPageOptions={[2, 4, 6]}
                paginatorTemplate="RowsPerPageDropdown FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink"
                currentPageReportTemplate="{first} a {last} de {totalRecords}"
                className="w-full border border-gray-700 rounded-lg shadow-lg"

            >
                <Column
                    header={renderHeaderCheckbox}
                    body={renderCheckbox}
                    headerStyle={{ width: '30rem' }}
                />
                {Columns.map((col, i) => (
                    <Column key={col.field || i} field={col.field} header={col.header} body={col.body} style={{ width: col.width }} />
                ))}
                <Column
                    header="Descargar"
                    body={btnImage}
                />
            </DataTable>
        </div>
    );
};

export default Facturas;
