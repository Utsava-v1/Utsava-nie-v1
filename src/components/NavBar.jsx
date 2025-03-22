import React from 'react'
import { Link } from 'react-router-dom'

const NavBar = () => {
    const handleClick = () => {

    }
    return (
        <nav className="bg-[#1D3557] flex justify-between items-center !p-2 !pl-5 !pr-5">
            <Link to='/' onClick={handleClick} className="logo flex items-center justify-center gap-3">
                <img src="/images/logo.jpg" alt="Logo" className="h-10 rounded-full" />
                <h1 className='font-code !text-white'>NIE Utsava</h1>
            </Link>
            <div className='flex flex-wrap gap-15 items-center border-white'>
                <div className=' flex gap-10'>
                    <Link to="/" className="!text-white text-lg uppercase h-full p-3 py-2 hover:!text-[#E63946]">Home</Link>
                    <Link to="/about" className="!text-white text-lg uppercase h-full p-3 py-2 hover:!text-[#E63946]">About</Link>
                    <Link to="/feedback" className="!text-white text-lg uppercase h-full p-3 py-2 hover:!text-[#E63946]">Feedback</Link>
                </div>
                <div className='flex gap-10  border-white'>
                    <Link to="/login" className="!text-white text-lg p-3 py-1 rounded-sm bg-[#E63946] hover:bg-[#F63956]">Student</Link>
                    <Link to="/signup" className="!text-white text-lg p-3 py-1 rounded-sm bg-[#E63946] hover:bg-[#F63956]">Organizer</Link>
                </div>
            </div>

        </nav>
    )
}

export default NavBar