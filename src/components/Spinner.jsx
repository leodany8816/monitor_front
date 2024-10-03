import { useEffect } from 'react';
import { ProgressSpinner } from 'primereact/progressspinner';

const Spinner = () => {

    useEffect(() => {
        // Bloquear el scroll al mostrar el spinner
        document.body.classList.add('overflow-hidden');

        // Limpiar el efecto (restaurar el scroll) cuando el spinner se oculta o el componente se desmonta
        return () => {
            document.body.classList.remove('overflow-hidden');
        };
    }, []);
    
    return (
        <div
        style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)', // Fondo semitransparente
            zIndex: 9999, // Superponer al contenido
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            overflow:'hidden'
        }}
        >
            <ProgressSpinner style={{ width: 'l50px', height: '150px' }} strokeWidth="8" fill="var(--surface-ground)" animationDuration=".5s" />
        </div>
    )
}

export default Spinner;