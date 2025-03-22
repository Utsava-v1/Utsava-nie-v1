import React from 'react'
import { Link } from 'react-router-dom'

const Footer = () => {
    return (
        <footer className="bg-[#1D3557] text-white text-center py-8 shadow-lg">
            <div className="container mx-auto flex flex-wrap justify-evenly items-center gap-4 px-4">
                <p className="text-lg">&copy; 2025 College Event Management. All Rights Reserved.</p>
                <div className="flex flex-wrap justify-center items-center gap-4">
                    <Link to="/terms" className="hover:underline">Terms & Conditions</Link>
                    <Link to="/privacy" className="hover:underline">Privacy Policy</Link>
                    <Link to="/about" className="hover:underline">About</Link>
                    <Link to="/feedback" className="hover:underline">Feedback</Link>
                </div>
                <p className="text-sm">Designed by <Link to='/the-creators'>Team Utsava</Link></p>
            </div>
        </footer>
    )
}

export default Footer
