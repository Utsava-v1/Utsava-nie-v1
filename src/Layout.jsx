import React, { useEffect, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import NavBar from "./components/NavBar";
import Footer from './components/Footer';
import Loading from './components/Loading'; // Make sure this component exists

const Layout = () => {
    const location = useLocation();
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setLoading(true);

        // Generate a random duration between 100ms and 1000ms
        const randomDelay = Math.floor(Math.random() * (1000 - 100 + 1)) + 100;

        const timer = setTimeout(() => {
            setLoading(false);
        }, randomDelay);

        return () => clearTimeout(timer);
    }, [location]);

    return (
        <>
            {loading && <Loading />} {/* Show loader on route change */}

            <header>
                <NavBar />
            </header>

            <main className='min-h-[76vh] bg-[url(/images/undraw_complete-form_aarh.svg)] bg-fixed bg-cover bg-center'>
                <Outlet />
            </main>

            <Footer />
        </>
    );
};

export default Layout;
