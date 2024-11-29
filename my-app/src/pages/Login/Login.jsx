import React, { useState } from 'react';
import authService from '../../services/authService';
import './Login.css';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      // Effettua il login tramite il backend
      const message = await authService.login(username, password);
      alert(message); // Mostra il messaggio di successo
      window.location.href = '/dashboard'; // Reindirizza alla dashboard
    } catch (err) {
      setError('Credenziali non valide. Riprova.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-popup">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <div className="input-container">
          <input
            type="text"
            id="username"
            value={username}
            placeholder=" "
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <label htmlFor="username">Username</label>
        </div>
        <div className="input-container">
          <input
            type="password"
            id="password"
            value={password}
            placeholder=" "
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <label htmlFor="password">Password</label>
        </div>
        {error && <p className="error">{error}</p>}
        <button type="submit" disabled={loading}>
          {loading ? 'Caricamento...' : 'Accedi'}
        </button>
      </form>
    </div>
  );
};

export default Login;
