import { Head } from '@inertiajs/react';

export default function Home({ modules }) {
    return (
        <>
            <Head title="Learning Modules" />
            <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-md mx-auto text-center">
                    <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl">
                        No Content Available
                    </h1>
                    <p className="mt-4 text-lg text-gray-500">
                        There are currently no active learning modules. Please check back later or contact the administrator.
                    </p>
                    <div className="mt-6">
                        <a
                            href="/admin"
                            className="text-indigo-600 hover:text-indigo-500 font-medium"
                        >
                            Go to Admin Panel
                        </a>
                    </div>
                </div>
            </div>
        </>
    );
}
