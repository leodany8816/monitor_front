import { useState, useEffect } from 'react';
import { Message } from 'primereact/message';

const Mensaje = ({ showError, showText }) => {
    const [showMessage, setShowMessage] = useState(false); // Iniciar como falso

    useEffect(() => {
        if (showError) {
            setShowMessage(true); // Mostrar el mensaje cuando detectamos un error

            const timer = setTimeout(() => {
                setShowMessage(false); // Ocultar el mensaje después de 5 segundos
            }, 3000);

            return () => clearTimeout(timer); // Limpiar el temporizador si el componente se desmonta o el error cambia
        }
    }, [showError]); // Ejecutar efecto cada vez que el valor de showError cambie

    return (
        <div>
            {showMessage && (
                <Message severity="error" text={showText} />
            )}
        </div>
    );
};

export default Mensaje;
