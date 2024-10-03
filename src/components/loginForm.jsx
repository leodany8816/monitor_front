import { useEffect, useState } from 'react';
import Mensaje from './Message';
import Spinner from './Spinner';

const Login = () => {
    const [usuario, setUsuario] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [showWarning, setShowWarning] = useState(false); // Para mostrar mensaje si no se seleccionan facturas
    const [message, setMessage] = useState('');


    const getCsrfToken = async () => {
        const response = await fetch('https://apis.grupo-citi.com/api/csrf-token');
        const data = await response.json();
        return data.csrf_token;
    };



    const LoginForm = async (event) => {
        setShowWarning(false);
        event.preventDefault(); // Evitar que se recargue la página
        setLoading(true); // Mostrar el estado de carga
        setError(null); // Limpiar cualquier error previo

        const csrfToken = await getCsrfToken();
        console.log('token');
        console.log(csrfToken);


        try {
            // const response = await fetch('http://127.0.0.2:8000/api/login', {
            const response = await fetch('https://apis.grupo-citi.com/api/login', {
                method: 'POST',
                //credentials: 'includes',  // Incluir credenciales como cookies
                headers: {
                    'Content-Type': 'application/json',
                    // 'X-CSRF-TOKEN': `Bearer 1|${csrfToken}`,
                    //'Accept': 'application/json',

                },
                body: JSON.stringify({ usuario, password }),
            });

            const data = await response.json();

            if (response.ok) {
                setSuccess(true);
                console.log('Login exitoso:', data);
                localStorage.setItem('token', data.token);
                console.log('token ' + data.token);
                window.location.href = '/monitor'
            } else {
                console.log(1);
                setMessage(data.message);
                setShowWarning(true);
            }
        } catch (err) {
            console.log(2);
            setError('Error en la conexión');
            setMessage("Los datos son obligatorios");
            setShowWarning(true);
        } finally {
            setLoading(false); // Finalizar el estado de carga
        }
    };

    return (
        <div className="flex flex-col items-center justify-center px-6 py-1 mx-auto md:h-screen lg:py-0">


            <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
                <div className="p-6 space-y-4 md:space-y-6 sm:p-8">

                    {loading &&
                        <div className='mt-1'><Spinner /></div>
                    }
                    {/* Mostrar advertencia si no se selecciona ninguna factura */}
                    {showWarning &&
                        <div className='mt-3'>

                            <Mensaje showError={showWarning} showText={message} />

                        </div>
                    }
                    <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                        Ingresa tus credenciales
                    </h1>

                    <form className="space-y-4 md:space-y-6" onSubmit={LoginForm}>
                        <div className="relative mb-6">
                            <div className="absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className="icon icon-tabler icons-tabler-filled icon-tabler-user"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M12 2a5 5 0 1 1 -5 5l.005 -.217a5 5 0 0 1 4.995 -4.783z" /><path d="M14 14a5 5 0 0 1 5 5v1a2 2 0 0 1 -2 2h-10a2 2 0 0 1 -2 -2v-1a5 5 0 0 1 5 -5h4z" /></svg>
                            </div>
                            <input type="text" name="usuario" id="usuario" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Usuario" onChange={(e) => setUsuario(e.target.value)} />
                        </div>
                        <div className="relative mb-6">
                            <div className="absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className="icon icon-tabler icons-tabler-filled icon-tabler-key"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M14.52 2c1.029 0 2.015 .409 2.742 1.136l3.602 3.602a3.877 3.877 0 0 1 0 5.483l-2.643 2.643a3.88 3.88 0 0 1 -4.941 .452l-.105 -.078l-5.882 5.883a3 3 0 0 1 -1.68 .843l-.22 .027l-.221 .009h-1.172c-1.014 0 -1.867 -.759 -1.991 -1.823l-.009 -.177v-1.172c0 -.704 .248 -1.386 .73 -1.96l.149 -.161l.414 -.414a1 1 0 0 1 .707 -.293h1v-1a1 1 0 0 1 .883 -.993l.117 -.007h1v-1a1 1 0 0 1 .206 -.608l.087 -.1l1.468 -1.469l-.076 -.103a3.9 3.9 0 0 1 -.678 -1.963l-.007 -.236c0 -1.029 .409 -2.015 1.136 -2.742l2.643 -2.643a3.88 3.88 0 0 1 2.741 -1.136m.495 5h-.02a2 2 0 1 0 0 4h.02a2 2 0 1 0 0 -4" /></svg>
                            </div>
                            <input type="password" name="password" id="password" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Contraseña" onChange={(e) => setPassword(e.target.value)} />
                        </div>
                        <button type="submit" className="w-full px-5 py-3 text-base font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Ingresar</button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Login;