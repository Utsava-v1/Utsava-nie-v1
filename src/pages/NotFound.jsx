import React from 'react';
import './styles/NotFound.css'; // Import your CSS for styling
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="not-found-container h-full w-full overflow-hidden">
      <header className="header">
        <img className="logo rounded-full" src='/images/logo.jpg' alt="Logo" />
        <h1 className='text-xl font-bold font-exo'>Event Hive</h1>
      </header>
      <div className="content flex justify-around w-full font-code">
        <section className="error-message flex flex-col">
          <h1 className='text-7xl'>404</h1>
          <p>Oops! The page you're looking for doesn't exist.</p>
          <Link to="/" className="home-link w-40 text-center rounded-xl !p-3 bg-green-700">Go to Homepage</Link>
        </section>
        <section className="image-section">
          <img src="/images/notfound.png" alt="Illustration" className="error-image h-100" />
        </section>
      </div>
    </div>
  );
};

export default NotFound