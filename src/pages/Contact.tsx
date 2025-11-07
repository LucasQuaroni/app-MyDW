const Contact = () => {
    return (
        <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold mb-6 text-gray-100">Contacto</h1>
            
            <div className="bg-gray-800 p-8 rounded-2xl shadow-md border border-gray-700">
                <p className="text-gray-300 text-lg">
                    ¿Tienes preguntas o necesitas ayuda? Estamos aquí para ti.
                </p>
                <div className="mt-6 space-y-4 text-gray-400">
                    <p>
                        <strong className="text-gray-200">Email:</strong> contacto@mydw.com
                    </p>
                    <p>
                        <strong className="text-gray-200">Teléfono:</strong> +34 123 456 789
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Contact;