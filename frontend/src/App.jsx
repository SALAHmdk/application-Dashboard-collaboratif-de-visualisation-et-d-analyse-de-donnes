import axios from 'axios';
import { useState } from 'react';
import Dashboard from './dashboard';

function App() {
  const [token, setToken] = useState('');
  const [error, setError] = useState(null);
  const [credentials, setCredentials] = useState({ username: '', password: '' });

  const handleLogin = async (event) => {
    event.preventDefault();
    try {
      const res = await axios.post('http://localhost:8000/token', new URLSearchParams(credentials));
      setToken(res.data.access_token);
      setError(null);
    } catch (err) {
      setError("Identifiants invalides");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCredentials({ ...credentials, [name]: value });
    setError(null);
  };

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white shadow-md p-6 rounded w-72">
          <h2 className="text-2xl font-bold mb-4 text-center">🔐 Connexion Admin</h2>
          <form onSubmit={handleLogin}>
            <input
              type="text"
              name="username"
              placeholder="Nom d'utilisateur"
              className="w-full border p-2 mb-3 rounded"
              value={credentials.username}
              onChange={handleInputChange}
            />
            <input
              type="password"
              name="password"
              placeholder="Mot de passe"
              className="w-full border p-2 mb-3 rounded"
              value={credentials.password}
              onChange={handleInputChange}
            />
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
            >
              Se connecter
            </button>
          </form>
          {error && (
            <p className="text-red-500 text-sm mt-2 text-center" aria-live="assertive">
              {error}
            </p>
          )}
        </div>
      </div>
    );
  }

  return <Dashboard token={token} />;
}

export default App;
