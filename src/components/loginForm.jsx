import { useEffect, useState } from 'react';
import Mensaje from './Message';

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
        <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">


            <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
                <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
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
                        <div>
                            <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">RFC</label>
                            <input type="text" name="usuario" id="usuario" className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required="" onChange={(e) => setUsuario(e.target.value)} />
                        </div>
                        <div>
                            <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Contraseña</label>
                            <input type="password" name="password" id="password" className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required="" onChange={(e) => setPassword(e.target.value)} />
                        </div>
                        <button type="submit" className="w-full text-blue-500 bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">Sign in</button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Login;