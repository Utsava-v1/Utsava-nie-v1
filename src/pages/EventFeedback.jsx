import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { doc, getDoc, collection, query, where, getDocs, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../contexts/AuthContext';

const EventFeedback = () => {
    const { eventId } = useParams();
    const navigate = useNavigate();
    const { userProfile } = useAuth();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [event, setEvent] = useState(null);
    const [isRegistered, setIsRegistered] = useState(false);
    const [feedbackList, setFeedbackList] = useState([]);
    const [formData, setFormData] = useState({
        rating: '',
        comments: ''
    });

    const isOrganizer = userProfile?.role === 'organizer';

    useEffect(() => {
        const fetchEventData = async () => {
            try {
                setLoading(true);
                const eventDoc = await getDoc(doc(db, 'events', eventId));
                
                if (!eventDoc.exists()) {
                    setError('Event not found');
                    return;
                }

                const eventData = eventDoc.data();
                setEvent({ id: eventDoc.id, ...eventData });

                // Only check registration status for students
                if (userProfile?.role === 'student') {
                    const registrationQuery = query(
                        collection(db, 'registrations'),
                        where('event_id', '==', eventId),
                        where('email', '==', userProfile.email)
                    );
                    const registrationSnapshot = await getDocs(registrationQuery);
                    setIsRegistered(!registrationSnapshot.empty);
                }

                // Fetch all feedback for the event
                const feedbackQuery = query(
                    collection(db, 'event_feedback'),
                    where('event_id', '==', eventId)
                );
                const feedbackSnapshot = await getDocs(feedbackQuery);
                const feedbacks = feedbackSnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                setFeedbackList(feedbacks);

            } catch (err) {
                console.error('Error fetching event data:', err);
                setError('Failed to load event data');
            } finally {
                setLoading(false);
            }
        };

        fetchEventData();
    }, [eventId, userProfile]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (!formData.rating || !formData.comments) {
            setError('Please fill out all fields');
            return;
        }

        try {
            const feedbackRef = collection(db, 'event_feedback');
            await addDoc(feedbackRef, {
                event_id: eventId,
                user_email: userProfile?.email,
                user_name: userProfile?.name,
                rating: Number(formData.rating),
                comments: formData.comments,
                date: serverTimestamp()
            });

            setSuccess('Thank you for your feedback!');
            
            // Navigate back after 2 seconds
            setTimeout(() => {
                navigate(-1);
            }, 2000);
        } catch (err) {
            console.error('Error submitting feedback:', err);
            setError('Failed to submit feedback');
        }
    };

    if (loading) return <div className="text-center mt-8">Loading...</div>;
    if (error) return <div className="text-center mt-8 text-red-500">{error}</div>;
    if (!event) return null;

    // Only show registration check for students
    if (userProfile?.role === 'student' && !isRegistered) {
        return (
            <div className="text-center mt-8">
                <p className="text-red-500">You must be registered for this event to provide feedback.</p>
                <Link to="/student-profile" className="text-blue-600 hover:underline mt-2 inline-block">
                    Return to Profile
                </Link>
            </div>
        );
    }

    // Calculate average rating
    const averageRating = feedbackList.length > 0
        ? (feedbackList.reduce((acc, curr) => acc + curr.rating, 0) / feedbackList.length).toFixed(1)
        : 0;

    return (
        <div className="max-w-4xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-lg">
            <h2 className="text-3xl font-semibold mb-4 text-[#1D3557]">Event Feedback</h2>
            <p className="text-gray-600 mb-6">Event: {event.name}</p>

            {isOrganizer ? (
                // Organizer View
                <div className="space-y-6">
                    <div className="bg-gray-50 p-4 rounded-lg">
                        <h3 className="text-xl font-semibold mb-2">Feedback Summary</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-white p-3 rounded-lg shadow-sm">
                                <p className="text-sm text-gray-600">Average Rating</p>
                                <p className="text-2xl font-bold text-[#1D3557]">{averageRating}/5</p>
                            </div>
                            <div className="bg-white p-3 rounded-lg shadow-sm">
                                <p className="text-sm text-gray-600">Total Feedback</p>
                                <p className="text-2xl font-bold text-[#1D3557]">{feedbackList.length}</p>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <h3 className="text-xl font-semibold">All Feedback</h3>
                        {feedbackList.length > 0 ? (
                            feedbackList.map(feedback => (
                                <div key={feedback.id} className="border rounded-lg p-4 bg-white shadow-sm">
                                    <div className="flex justify-between items-start mb-2">
                                        <div>
                                            <p className="font-medium">{feedback.user_name}</p>
                                            <p className="text-sm text-gray-500">{feedback.user_email}</p>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="text-yellow-500">★</span>
                                            <span className="font-medium">{feedback.rating}/5</span>
                                        </div>
                                    </div>
                                    <p className="text-gray-700 mt-2">{feedback.comments}</p>
                                    <p className="text-xs text-gray-500 mt-2">
                                        {feedback.date?.toDate?.().toLocaleDateString() || 'Date not available'}
                                    </p>
                                </div>
                            ))
                        ) : (
                            <p className="text-gray-500">No feedback received yet.</p>
                        )}
                    </div>
                </div>
            ) : (
                // Student View
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Rating</label>
                        <select
                            name="rating"
                            value={formData.rating}
                            onChange={handleChange}
                            className="w-full p-2 border rounded focus:ring-2 focus:ring-[#1D3557] focus:border-transparent"
                            required
                        >
                            <option value="">Select Rating (1-5)</option>
                            {[1, 2, 3, 4, 5].map(n => (
                                <option key={n} value={n}>{n}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Comments</label>
                        <textarea
                            name="comments"
                            value={formData.comments}
                            onChange={handleChange}
                            rows="4"
                            className="w-full p-2 border rounded focus:ring-2 focus:ring-[#1D3557] focus:border-transparent"
                            placeholder="Share your experience and suggestions..."
                            required
                        />
                    </div>

                    {error && <p className="text-red-500">{error}</p>}
                    {success && <p className="text-green-500">{success}</p>}

                    <div className="flex gap-4">
                        <button
                            type="submit"
                            className="flex-1 bg-[#1D3557] text-white py-2 rounded hover:bg-[#457B9D] transition"
                        >
                            Submit Feedback
                        </button>
                        <button
                            type="button"
                            onClick={() => navigate(-1)}
                            className="flex-1 bg-gray-500 text-white py-2 rounded hover:bg-gray-600 transition"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            )}
        </div>
    );
};

export default EventFeedback; 