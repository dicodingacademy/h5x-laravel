import { Head } from '@inertiajs/react';

export default function Home() {
    return (
        <>
            <Head title="Welcome" />
            <div className="flex items-center justify-center min-h-screen bg-gray-100">
                <div className="p-8 bg-white rounded-lg shadow-lg">
                    <h1 className="text-4xl font-bold text-gray-800 mb-4">
                        Welcome to Laravel + Inertia + React
                    </h1>
                    <p className="text-gray-600">
                        This is a fresh installation with FrankenPHP and Filament.
                    </p>
                    <div className="mt-6">
                        <a
                            href="/admin"
                            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                        >
                            Go to Admin Panel
                        </a>
                    </div>
                </div>
            </div>
        </>
    );
}
