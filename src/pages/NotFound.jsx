import { Link } from 'react-router-dom';

function NotFound() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <h1 className="text-3xl font-bold text-slate-950">Page not found</h1>
      <p className="mt-3 text-slate-600">The route you requested does not exist.</p>
      <Link
        className="mt-6 inline-flex rounded-md bg-blue-700 px-4 py-2 font-medium text-white hover:bg-blue-800"
        to="/"
      >
        Go home
      </Link>
    </section>
  );
}

export default NotFound;
