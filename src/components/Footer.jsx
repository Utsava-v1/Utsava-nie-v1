import React from 'react'
import { Link } from 'react-router-dom'

const Footer = () => {
    return (
        <footer className="bg-[url(/images/background.svg)] text-white text-center py-8 shadow-lg">
            <div className='flex flex-wrap items-center justify-evenly gap-5'>
                <div className="text-gray-300 flex flex-col flex-wrap justify-evenly items-start gap-4 px-4 ">
                    <div className="flex flex-col flex-wrap justify-center items-start gap-4">
                        <div className='flex gap-5'>

                            <Link to="/terms" className="hover:!underline">Terms & Conditions</Link>
                            <Link to="/terms" className="hover:!underline">Privacy Policy</Link>
                        </div>
                        <Link to="/about" className="hover:!underline">Contact Us</Link>
                        <Link to="/feedback" className="hover:!underline">Feedback & Suggestions</Link>
                    </div>
                    <p className="text-gray-300">Designed by <span className='text-white font-semibold !underline'><Link to='/developers'>Team Utsava</Link></span></p>
                    <p className="">&copy; 2025 NIE Utsava. All Rights Reserved.</p>
                </div>
                <div className=''>
                    <div className='flex gap-5'>
                        <span className='text-gray-300 max-w-80 min-w-50 text-wrap text-right'>
                            NIE is a grant-in-aid institution and approved by the All India Council for Technical Education (AICTE), New Delhi. NIE got autonomous status from Visvesvaraya Technological University, Belagavi in 2007.
                            <br />
                            <Link className='!underline font-semibold text-white' to='https://nie.ac.in'>Visit website</Link>
                        </span>
                        <img className='h-30 w-30' src="/images/nie.jpg" alt="" />
                    </div>
                </div>
            </div>
        </footer>
    )
}

export default Footer
