import { ProgressSpinner } from 'primereact/progressspinner';

const Spinner = () => {
    return (
        <div
        style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)', // Fondo semitransparente
            zIndex: 9999, // Superponer al contenido
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
        }}
        >
            <ProgressSpinner style={{ width: '50px', height: '50px' }} strokeWidth="8" fill="var(--surface-ground)" animationDuration=".5s" />
        </div>
    )
}

export default Spinner;