import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-8">
      <div className="w-20 h-20 bg-gray-100 rounded-[24px] flex items-center justify-center mb-6">
        <span className="text-4xl font-extrabold font-display text-gray-300">404</span>
      </div>
      <h1 className="text-2xl font-bold font-display text-gray-900 mb-2">Page not found</h1>
      <p className="text-gray-500 mb-6">The page you&apos;re looking for doesn&apos;t exist.</p>
      <Link href="/" className="px-6 py-3 bg-gray-900 text-white rounded-xl font-bold hover:bg-black transition-colors">
        Go Home
      </Link>
    </div>
  );
}
