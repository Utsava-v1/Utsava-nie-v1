import React, { useState } from 'react';
import { submitFeedback } from '../utils/firestore';

const Feedback = ({ currentUserUSN, currentUserEmail, eventId }) => {
    const [rating, setRating] = useState('');
    const [comments, setComments] = useState('');
    const [submitted, setSubmitted] = useState(false);

    const studentId = currentUserUSN || currentUserEmail;

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!rating || !comments) {
            alert('Please fill out all fields.');
            return;
        }

        if (!studentId) {
            alert('Student ID missing.');
            return;
        }

        if (!eventId) {
            alert('Event ID is missing.');
            return;
        }

        try {
            await submitFeedback(eventId, studentId, {
                rating: Number(rating),
                comments,
            });

            setSubmitted(true);
            setRating('');
            setComments('');
            setTimeout(() => setSubmitted(false), 3000);
        } catch (error) {
            alert('Error submitting feedback. Try again.');
            console.error(error);
        }
    };

    return (
        <div className='min-w-[70%] p-5 flex justify-center items-center'>
            <div className="bg-white w-auto p-5 rounded-lg shadow-xl container flex flex-col justify-center items-center">
                <h1 className="text-[#1D3557] text-4xl font-bold mb-5 max-md:text-2xl max-md:mb-2">📝Feedback</h1>
                <p className="text-[#2F3E46] text-lg mb-5 w-[70%] max-md:text-sm">
                    We value your feedback! Please share your thoughts to help us improve.🙏
                </p>

                <form onSubmit={handleSubmit} className="max-w-full pb-5 min-w-[70%]">
                    <select
                        className="w-full px-4 py-2 mb-5 border border-gray-300 rounded-lg"
                        value={rating}
                        onChange={(e) => setRating(e.target.value)}
                        required
                    >
                        <option value="">Select Rating (1–5)</option>
                        {[1, 2, 3, 4, 5].map(n => (
                            <option key={n} value={n}>{n}</option>
                        ))}
                    </select>

                    <textarea
                        rows="4"
                        className="w-full px-4 py-2 mb-5 border border-gray-300 rounded-lg"
                        value={comments}
                        placeholder='Your feedback or suggestions.'
                        onChange={(e) => setComments(e.target.value)}
                        required
                    />

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
};

export default Feedback;
