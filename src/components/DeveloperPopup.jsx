import React, { useState } from 'react';

const DeveloperPopup = () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="fixed bottom-0 right-0 m-4">
            <button 
                onClick={() => setIsOpen(true)} 
                className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-lg shadow-lg hover:shadow-xl transition-transform transform hover:scale-105"
            >
                Contact Developer
            </button>

            {isOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50">
                    <div className="bg-gray-800 rounded-lg shadow-xl p-8 max-w-md w-full transform transition-all duration-300 scale-100">
                        <h2 className="text-xl font-semibold text-gray-100 mb-4">Developer Information</h2>
                        <p className="text-gray-300"><strong>Name:</strong> Prince Kouamé</p>
                        <p className="text-gray-300"><strong>Website:</strong> <a href="https://www.princekouame.com" className="text-blue-500 hover:underline">www.princekouame.com</a></p>
                        <p className="text-gray-300"><strong>Email:</strong> <a href="mailto:hello@princekouame.com" className="text-blue-500 hover:underline">hello@princekouame.com</a></p>
                        <p className="text-gray-300"><strong>GitHub:</strong> <a href="https://github.com/kouame09" className="text-blue-500 hover:underline">github.com/princekouame</a></p>
                        <button 
                            onClick={() => setIsOpen(false)} 
                            className="mt-6 bg-blue-500 text-white px-6 py-2 rounded-lg shadow hover:bg-blue-600 transition"
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DeveloperPopup;