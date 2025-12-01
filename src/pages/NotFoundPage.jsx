import React from 'react';

function NotFoundPage() {
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full text-center space-y-8">

                {/* Illustration / Icon */}
                <div className="flex justify-center">
                    <svg
                        className="h-32 w-32 text-indigo-600"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        aria-hidden="true"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="1.5"
                            d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                    </svg>
                </div>

                {/* Main Text Content */}
                <div>
                    <h1 className="mt-6 text-center text-9xl font-extrabold text-gray-200">
                        404
                    </h1>
                    <h2 className="text-center text-3xl font-extrabold text-gray-900 -mt-12 relative z-10">
                        Page not found
                    </h2>
                    <p className="mt-4 text-center text-md text-gray-500">
                        Sorry, the page you are looking for doesn't exist or has been moved.
                    </p>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row justify-center gap-4 mt-8">
                    <a
                        href="/"
                        className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out shadow-sm"
                    >
                        Go back home
                    </a>
                    <a
                        href="/contact"
                        className="inline-flex items-center justify-center px-5 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out shadow-sm"
                    >
                        Contact support
                    </a>
                </div>

            </div>
        </div>
    );
}

export default NotFoundPage;