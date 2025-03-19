import React from 'react'
import { Link } from 'react-router-dom'

const NavBar = () => {
    return (
        <nav className="bg-[#1D3557] flex justify-between items-center !p-2 !pl-5 !pr-5">
            <div className="logo flex items-center justify-center gap-3 cursor-pointer">
                <img src="/images/logo.jpg" alt="Logo" className="h-10 rounded-full" />
                <h1 className='font-code !text-white'>NIE Utsava</h1>
            </div>
            <div className=''>
                <Link to="/" className="!text-white text-lg uppercase !mx-5 hover:!text-[#E63946]">Home</Link>
                <Link to="/about" className="!text-white text-lg uppercase !mx-5 hover:!text-[#E63946]">About</Link>
                <Link to="/feedback" className="!text-white text-lg uppercase !mx-5 hover:!text-[#E63946]">Feedback</Link>
                <Link to="#" className="!text-white text-lg uppercase !mx-5 hover:!text-[#E63946]">Login</Link>
                <Link to="#" className="!text-white text-lg uppercase !mx-5 hover:!text-[#E63946]">Signup</Link>
            </div>

        </nav>
    )
}

export default NavBar