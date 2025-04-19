import React, { useState } from 'react';

const Feedback = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!name || !email || !message) {
            alert('Please fill out all fields.');
            return;
        }

        console.log({ name, email, message });
        setSubmitted(true);

        // Clear the form after submission
        setName('');
        setEmail('');
        setMessage('');

        setTimeout(() => setSubmitted(false), 3000);
    };

    return (

        <div className='min-w-[70%] m-5 mt-10 flex justify-center items-center self-center justify-self-center'>
            <div className="bg-[#FFFFFF]/50 backdrop-blur-md w-auto p-5 rounded-lg  shadow-xl container flex flex-col justify-center items-center">

                <h1 className="text-[#1D3557] text-4xl font-bold mb-5 max-md:text-2xl max-md:mb-2">📝Feedback</h1>
                <p className="text-[#2F3E46] text-lg mb-5 w-[70%] max-md:text-sm">
                    We value your feedback! Please share your thoughts to help us improve.🙏
                </p>


                <form onSubmit={handleSubmit} className="max-w-full pb-5 min-w-[70%]">
                    <div className="mb-5">
                        {/* <label htmlFor="name" className="block text-[#1D3557] font-medium mb-2">Name</label> */}
                        <input
                            type="text"
                            id="name"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00a8ad]"
                            value={name}
                            placeholder='Name'
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </div>

                    <div className="mb-5">
                        {/* <label htmlFor="email" className="block text-[#1D3557] font-medium mb-2">Email</label> */}
                        <input
                            type="email"
                            id="email"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-gray-400"
                            value={email}
                            placeholder='Email'
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div className="mb-5">
                        {/* <label htmlFor="message" className="block text-[#1D3557] font-medium mb-2">Message</label> */}
                        <textarea
                            id="message"
                            rows="4"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400"
                            value={message}
                            placeholder='Message'
                            onChange={(e) => setMessage(e.target.value)}
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-[#1D3557] text-white py-3 rounded-lg hover:bg-[#E63946] transition-colors"
                    >
                        Submit
                    </button>

                    {submitted && (
                        <p className="text-green-500 text-center mt-4">Thank you for your feedback!</p>
                    )}
                </form>
            </div>
        </div>
    );
}

export default Feedback;
