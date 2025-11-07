import { useAuth } from "../contexts/AuthContext";
import { Link } from "react-router-dom";

const About = () => {
    const { currentUser } = useAuth();

    return (
        <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold mb-6 text-gray-100">Acerca de MyDW</h1>
            
            <div className="space-y-6">
                <section className="bg-gray-800 p-6 rounded-2xl shadow-md border border-gray-700">
                    <h2 className="text-xl font-semibold mb-4 text-gray-100">Estado de Autenticación</h2>
                    {currentUser ? (
                        <div className="p-4 bg-green-900/20 border border-green-800 rounded-xl">
                            <p className="text-green-300">
                                ✅ Estás autenticado como: <strong>{currentUser.email}</strong>
                            </p>
                            <p className="text-sm text-green-400 mt-2">
                                Puedes hacer peticiones autenticadas al backend usando el token.
                            </p>
                        </div>
                    ) : (
                        <div className="p-4 bg-yellow-900/20 border border-yellow-800 rounded-xl">
                            <p className="text-yellow-300">
                                ⚠️ No estás autenticado
                            </p>
                            <p className="text-sm text-yellow-400 mt-2">
                                <Link to="/login" className="text-orange-500 hover:text-orange-400 underline">
                                    Inicia sesión
                                </Link> para acceder a funciones protegidas.
                            </p>
                        </div>
                    )}
                </section>

                <section className="bg-gray-800 p-6 rounded-2xl shadow-md border border-gray-700">
                    <h2 className="text-xl font-semibold mb-4 text-gray-100">Información del Proyecto</h2>
                    <p className="text-gray-300 mb-4">
                        MyDW es una aplicación web desarrollada con React y Firebase para autenticación.
                    </p>
                    <ul className="list-disc list-inside space-y-2 text-gray-300">
                        <li>Frontend: React + TypeScript + Tailwind CSS</li>
                        <li>Autenticación: Firebase Authentication</li>
                        <li>Backend: Node.js + Express + Firebase Admin SDK</li>
                        <li>Routing: React Router</li>
                    </ul>
                </section>
            </div>
        </div>
    );
};

export default About;