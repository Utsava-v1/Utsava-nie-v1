import React from 'react';

const About = () => {
    return (
        <div className="container mx-auto px-5 py-10">
            <h1 className="text-[#1D3557] text-4xl font-bold mb-5">About NIE Utsava✨</h1>
            <p className="text-[#2F3E46] text-lg leading-relaxed mb-5">
                NIE Utsava is an online platform designed and maintained by the student and faculty of NIE Mysuru.
                It brings together talent from all fields, including technology, arts, and culture to meet in event organized within the institution. Our
                goal is to create a platform for students to showcase their skills, network with peers,
                and participate in exciting events and workshops and gain valuble real life exposure.
            </p>
            <h2 className="text-[#1D3557] text-2xl font-semibold mb-3">Our Mission🎯</h2>
            <p className="text-[#2F3E46] text-lg leading-relaxed mb-5">
                To foster creativity, innovation, and collaboration among students, providing them with
                an opportunity to learn, grow, and excel.
            </p>
            <h2 className="text-[#1D3557] text-2xl font-semibold mb-3">Our Vision🛡</h2>
            <p className="text-[#2F3E46] text-lg leading-relaxed mb-5">
                To create a vibrant and inclusive community where every student feels empowered to express
                their talents and ideas.
            </p>
            <h2 className="text-[#1D3557] text-2xl font-semibold mb-3">Contact Us📞</h2>
            <p className="text-[#2F3E46] text-lg bg-white/50 backdrop-blur-sm inline-block p-3 rounded-2xl font-semibold">
                📧 Email: <a href="mailto:info@nieutsava.com" className="text-[#E63946] hover:underline">nieutsava@nie.ac.in</a><br />
                📞 Phone: <a href="tel:+919876543210" className="text-[#E63946] hover:underline">+91 79916 XXXXX</a>
            </p>
        </div>  
    );
}

export default About;
