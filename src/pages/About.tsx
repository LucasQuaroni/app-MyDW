import React from "react";
import { useAuth } from "../contexts/AuthContext";
import { Link } from "react-router-dom";

const About = () => {
    const { currentUser } = useAuth();

    return (
        <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold mb-6">Acerca de MyDW</h1>
            
            <div className="space-y-6">
                <section className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                    <h2 className="text-xl font-semibold mb-4">Estado de Autenticación</h2>
                    {currentUser ? (
                        <div className="p-4 bg-green-50 border border-green-200 rounded-md">
                            <p className="text-green-800">
                                ✅ Estás autenticado como: <strong>{currentUser.email}</strong>
                            </p>
                            <p className="text-sm text-green-700 mt-2">
                                Puedes hacer peticiones autenticadas al backend usando el token.
                            </p>
                        </div>
                    ) : (
                        <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-md">
                            <p className="text-yellow-800">
                                ⚠️ No estás autenticado
                            </p>
                            <p className="text-sm text-yellow-700 mt-2">
                                <Link to="/login" className="text-blue-600 hover:underline">
                                    Inicia sesión
                                </Link> para acceder a funciones protegidas.
                            </p>
                        </div>
                    )}
                </section>

                <section className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                    <h2 className="text-xl font-semibold mb-4">Información del Proyecto</h2>
                    <p className="text-gray-700 mb-4">
                        MyDW es una aplicación web desarrollada con React y Firebase para autenticación.
                    </p>
                    <ul className="list-disc list-inside space-y-2 text-gray-700">
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