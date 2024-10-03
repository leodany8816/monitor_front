import { useEffect, useState, useRef } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Calendar } from 'primereact/calendar';
import { addLocale } from 'primereact/api';
import Spinner from './Spinner';
import Mensaje from './Message';

const Facturas = () => {
    const dt = useRef(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [cfdis, setCfdis] = useState([]); // Almacenar CFDIs
    // const [selectedRows, setSelectedRows] = useState([]); // Almacenar filas seleccionadas
    const [selectedRows, setSelectedRows] = useState([]); // Filas seleccionadas
    const [first, setFirst] = useState(0); // Índice de la primera fila visible en la página actual
    const [rowsPerPage, setRowsPerPage] = useState(50); // Cantidad de filas por página
    const [showWarning, setShowWarning] = useState(false); // Para mostrar mensaje si no se seleccionan facturas
    const [filteredCfdis, setFilteredCfdis] = useState([]); // Datos filtrados
    const [rangeDates, setRangeDates] = useState(null); // Estado para el rango de fechas
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [message, setMessage] = useState([]);
    const path_img = 'https://bekaert.grupo-citi.com/img/pdf_icon.png';


    // Configuración de localización para el formato de México (DD/MM/YYYY)
    addLocale('es', {
        firstDayOfWeek: 1,
        dayNames: ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'],
        dayNamesShort: ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'],
        dayNamesMin: ['D', 'L', 'M', 'M', 'J', 'V', 'S'],
        monthNames: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
        monthNamesShort: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
        today: 'Hoy',
        clear: 'Limpiar',
        dateFormat: 'dd-mm-yy',
    });


    useEffect(() => {
        const fetchCfdis = async () => {
            setLoading(true);
            // setError(null);

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
                setFilteredCfdis(data.cfdis);
            } catch (err) {
                setMessage('Error en la conexión: ' + err);
                setShowWarning(true);
            } finally {
                setLoading(false);
            }
        };
        fetchCfdis();
    }, []);

    // Función para aplicar el filtro de rango de fechas
    const applyDateFilter = () => {
        setLoading(true);
        setShowWarning(false);
        setTimeout(() => {
            if (startDate && endDate) {
                if (startDate < endDate) {
                    const filteredData = cfdis.filter(cfdi => {
                        const cfdiDate = new Date(cfdi.fechaEmision.split('-').reverse().join('-')); // Convertir la fecha
                        // const cfdiDate = new Date(cfdi.fechaEmision); // Convertir la fecha
                        console.log('fechas ' + cfdiDate);
                        return cfdiDate >= startDate && cfdiDate <= endDate;

                    });
                    setFilteredCfdis(filteredData);
                    setLoading(false);
                } else {
                    console.log('error');
                    setMessage('La fecha inicial no debe de ser mayor a la fecha fin');
                    setShowWarning(true);
                    setLoading(false);
                }
            } else {
                setMessage('Tienes que seleccionar un rango de fecha');
                setShowWarning(true);

            }
            setLoading(false);
        }, 100);
    };
    // Función para limpiar el filtro
    const clearDateFilter = () => {
        setStartDate(null);
        setEndDate(null);
        setFilteredCfdis(cfdis); // Restablece los datos originales
    };

    const Columns = [

        { field: 'emisor', header: 'Emisor' },
        { field: 'emisorRfc', header: 'Rfc Emisor' },
        { field: 'serie', header: 'Serie' },
        { field: 'folio', header: 'Folio' },
        { field: 'receptor', header: 'Receptor' },
        { field: 'receptorRfc', header: 'Rfc Receptor' },
        { field: 'fechaEmision', header: 'Fecha Emision',},
        { field: 'tipoComprobante', header: 'Tipo Comprobante' },
        { field: 'subtotal', header: 'SubTotal' },
        { field: 'traslado', header: 'Traslado' },
        { field: 'retencion', header: 'Retencion' },
        { field: 'total', header: 'Total' },
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
        );
    }

    // Funcion para manejar el click la imagen para mostrar el pdf
    const downloadPDFClick = async (id_factura) => {
        setLoading(true);
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
            } else {

            }

        } catch (err) {
            setMessage('Error en el servicio ' + err);
            setShowWarning(true);
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
        const dataCfdis = mostrarFacturasSeleccionadas();
        setShowWarning(false);
        if (dataCfdis.length === 0) {
            console.log('error 2')
            // Si no hay facturas seleccionadas, mostrar advertencia
            setMessage('Debes de seleccionar al menos una factura.');
            setShowWarning(true);
            setLoading(false);
            return;
        }

        // setShowWarning(false); // Ocultar la advertencia si hay selección
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
                setMessage(data.error);
                setShowWarning(true);
                setLoading(false);
            }

        } catch (err) {
            setMessage('Error en la conexión ' + err);
            setShowWarning(true);
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

    return (
        <div>
            <div className="flex align-items-center p-4 md:grid-cols-1">
                {loading &&
                    <div className='mt-1'><Spinner /></div>
                }
                {/* Mostrar advertencia si no se selecciona ninguna factura */}
                {showWarning &&
                    <div className='mt-3'>
                        <Mensaje showError={showWarning} showText={message} />
                    </div>
                }
            </div>
            <div className="flex align-items-center gap-3 mb-3 mt-3 p-4 md:grid-cols-4">
                <div>
                    <label className="block mb-2 text-lg font-medium text-white">Fecha Inicio:</label>
                    <Calendar value={startDate} onChange={(e) => setStartDate(e.value)} dateFormat="dd-mm-yy" showIcon locale="es"
                        className="w-full p-2.5 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg" />

                </div>
                <div>
                    <label className="block mb-2 text-lg font-medium text-white">Fecha Fin:</label>
                    <Calendar value={endDate} onChange={(e) => setEndDate(e.value)} dateFormat="dd-mm-yy" showIcon locale="es"
                        className="w-full p-2.5 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg" />
                </div>
                <div className="flex items-end gap-4">

                    <button type="button" onClick={applyDateFilter} className=" px-5 py-1.5 text-lg font-medium text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 rounded-lg text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Filtrar</button>



                    <button type="button" onClick={clearDateFilter} className="px-5 py-1.5 text-lg font-medium text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 rounded-lg text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Limpiar</button>
                </div>
            </div>

            <div className="flex align-items-center gap-3 mb-2 mt-2 p-4 md:grid-cols-1">
                <button type="button" onClick={descargarZip} className="px-5 py-1.5 text-lg font-medium text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 rounded-lg text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Descargar Zip</button>

                <button type="button" onClick={() => dt.current.exportCSV({ filename: "Cfdis.csv" })} className="px-5 py-1.5 text-lg font-medium text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 rounded-lg text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Exportar a Excel</button>
            </div>
            <DataTable
                value={filteredCfdis}
                // tableStyle={{ minWidth: 'auto' }}
                ref={dt}
                dataKey="id_factura"
                paginator
                rows={rowsPerPage}
                first={first}
                size="large"
                onPage={handlePageChange}
                rowsPerPageOptions={[50, 100, 200, 500]}
                paginatorTemplate="RowsPerPageDropdown FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink"
                currentPageReportTemplate="{first} a {last} de {totalRecords}"
                className="w-full border border-red-700 rounded-lg shadow-lg"
                selectionMode="single"

            >
                <Column
                    header={renderHeaderCheckbox}
                    body={renderCheckbox}
                    headerStyle={{ width: '1030rem' }}
                />
                {Columns.map((col, i) => (
                    <Column key={col.field || i} field={col.field} header={col.header}  body={col.body}  />
                ))}
                <Column
                    header="Descargar"
                    body={btnImage}
                />
            </DataTable>
        </div >
    );
};

export default Facturas;
