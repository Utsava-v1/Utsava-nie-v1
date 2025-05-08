import { Link } from 'react-router-dom'

const TnC = () => {
    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            <h1 className="text-2xl font-bold text-[#1D3557] mb-6">Terms & Conditions</h1>
            <p className="text-gray-700 mb-4">
                By accessing and using this website, you agree to be bound by the following terms and conditions.
                Please read them carefully before using the site.
            </p>
            <ul className="list-disc pl-5 mb-6 text-gray-700">
                <li>You must be at least 18 years old to use this site.</li>
                <li>You must be a member of The National Institute of Engineering to use this site.</li>
                <li>All content on this site is for informational purposes only.</li>
                <li>We reserve the right to modify or terminate the service at any time.</li>
            </ul>

            <h2 className="text-xl font-semibold text-[#1D3557] mb-4">Privacy Policy</h2>
            <p className="text-gray-700 mb-4">
                We take your privacy seriously. This policy explains how we collect, use, and protect your personal information.
            </p>
            <ul className="list-disc pl-5 mb-6 text-gray-700">
                <li>Your data will not be shared with third parties without your consent.</li>
                <li>We use cookies to improve user experience.</li>
                <li>You can request the deletion of your data at any time.</li>
            </ul>

            <Link 
                to="/" 
                className="text-[#1D3557] underline hover:text-[#457B9D] transition"
            >
                Back to Home
            </Link>
        </div>
    )
}

export default TnC
