import React from 'react'
import NavBar from "./components/NavBar"
import { Link, Outlet } from 'react-router-dom'
import Footer from './components/Footer'

const Layout = () => {
    return (
        <>
            <header>
                <NavBar />
            </header>

            <main className='min-h-[76vh] bg-[url(/images/undraw_complete-form_aarh.svg)] bg-fixed bg-cover bg-center'>
                <Outlet />
            </main>

            <Footer/>
        </>

    )
}

export default Layout