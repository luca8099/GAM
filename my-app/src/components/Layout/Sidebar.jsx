import React from 'react';
import { Link } from 'react-router-dom';
import './Sidebar.css';

const Sidebar = () => {
  return (
    <div className="sidebar">
      <h2>Gestione</h2>
      <ul>
        <li>
          <Link to="/dashboard">Dashboard</Link>
        </li>
        <li>
          <Link to="/plants">Impianti</Link>
        </li>
        <li>
          <Link to="/machinery">Macchinari</Link>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
