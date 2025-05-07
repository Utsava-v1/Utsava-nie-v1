import React, { useState, useEffect } from 'react';
import "./style/Hero.css"

const images = [
    'https://images.unsplash.com/photo-1522158637959-30385a09e0da?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
];

const Hero = () => {
    const [currentIndex, setCurrentIndex] = useState(0);

    // Function to move to the next image
    const nextImage = () => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length); // Infinite loop: modulo operator
    };

    // Function to move to the previous image
    const prevImage = () => {
        setCurrentIndex((prevIndex) =>
            prevIndex === 0 ? images.length - 1 : prevIndex - 1
        );
    };

    // Set up timed transition every 3 seconds (3000ms)
    useEffect(() => {
        const timer = setInterval(nextImage, 3000);
        return () => clearInterval(timer); // Cleanup on component unmount
    }, []);

    return (
        <div className="relative w-full h-[400px]">
            {/* Carousel Image */}
            <div
                className="bg-cover bg-center Michel h-full flex justify-center items-center text-white text-center"
                style={{ backgroundImage: `url(${images[currentIndex]})` }}
            >
                <div className='h-full w-full flex items-center justify-center bg-black/50'>
                    <h2 className="text-5xl font-bold text-shadow-lg tracking-wide text-white">
                        Discover Exciting Events in your Campus.
                    </h2>
                </div>
            </div>

            {/* Left Arrow Button */}
            <button
                onClick={prevImage}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white text-[#1D3557] p-2 rounded-full shadow-lg hover:bg-[#E63946] transition-all"
            >
                &#10094;
            </button>

            {/* Right Arrow Button */}
            <button
                onClick={nextImage}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white text-[#1D3557] p-2 rounded-full shadow-lg hover:bg-[#E63946] transition-all"
            >
                &#10095;
            </button>

            {/* Dots at the bottom */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                {images.map((_, index) => (
                    <div
                        key={index}
                        className={`w-3 h-3 rounded-full ${currentIndex === index ? 'bg-[#E63946]' : 'bg-white'
                            } transition-all`}
                    />
                ))}
            </div>
        </div>
    );
};

export default Hero;
