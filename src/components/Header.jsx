import { Link } from "react-router-dom";

export default function Header() {
  return (
    <header className="bg-black text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-xl font-bold">SyncVerse</h1>
        <nav>
          <Link to="/" className="mr-4 hover:underline">Login</Link>
          <Link to="/dashboard" className="hover:underline">Dashboard</Link>
        </nav>
      </div>
    </header>
  );
}
