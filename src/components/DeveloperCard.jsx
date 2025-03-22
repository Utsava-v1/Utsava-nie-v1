import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FaGithub, FaLinkedin } from 'react-icons/fa'

const DeveloperCard = ({ name, role, image, github, linkedin }) => {
    return (
        <motion.div 
            className="bg-white border border-gray-300 rounded-lg shadow-md p-4 w-[250px] text-center"
            whileHover={{ scale: 1.05 }}
        >
            <img 
                src={image} 
                alt={name} 
                className="w-24 h-24 rounded-full mx-auto object-cover border-2 border-[#457B9D]"
            />
            <h2 className="text-lg font-semibold text-[#1D3557] mt-3">{name}</h2>
            <p className="text-sm text-gray-600">{role}</p>
            
            {/* Social Links */}
            <div className="flex justify-center gap-4 mt-3">
                {github && (
                    <Link 
                        to={github} 
                        target="_blank" 
                        className="text-[#1D3557] hover:text-[#457B9D]"
                    >
                        <FaGithub size={20} />
                    </Link>
                )}
                {linkedin && (
                    <Link 
                        to={linkedin} 
                        target="_blank" 
                        className="text-[#1D3557] hover:text-[#457B9D]"
                    >
                        <FaLinkedin size={20} />
                    </Link>
                )}
            </div>
        </motion.div>
    )
}

export default DeveloperCard
