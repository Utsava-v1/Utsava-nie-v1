import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="h-full w-full overflow-hidden flex flex-col items-center">
      <Link to='/' className="self-start p-5 flex justify-start items-center">
        <img className="h-12 rounded-full" src="/images/logo.jpg" alt="Logo" />
        {/* <h1 className="text-xl font-bold font-exo ml-4">Event Hive</h1> */}
      </Link>

      <div className="flex justify-around !p-5 font-code">
        <section className="flex flex-col items-center ">
          <h1 className="text-7xl font-extrabold">404</h1>
          <p className="text-center mt-2 text-lg">Oops! The page you're looking for doesn't exist.</p>
          <Link
            to="/"
            className="mt-4 w-40 text-white text-center rounded-xl p-3 bg-[#1D3557] hover:bg-[#E63946] transition-colors duration-300"
          >
            Go to Homepage
          </Link>
        </section>

        <section className=''>
          <img
            src="/images/notfound.png"
            alt="Illustration"
            className="h-100 object-cover object-top"
          />
        </section>
      </div>
    </div>
  );
};

export default NotFound;
