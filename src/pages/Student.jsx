import React from "react";

const LoginPage = () => {
    const handleGoogleLogin = () => {
        // Implement your Google OAuth logic here
        alert("Redirecting to Google Login...");
    };

    return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="bg-white shadow-md rounded-xl px-8 py-10 w-full max-w-md text-center">
                <h2 className="text-2xl font-semibold text-[#1D3557] mb-6">
                    🎓 College Event Organizer
                </h2>

                <form className="space-y-4">
                    <input
                        type="email"
                        placeholder="Email"
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-200"
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-200"
                    />
                    <button
                        type="submit"
                        className="w-full bg-[#1D3557] text-white py-2 rounded-md hover:bg-[#1D3577] transition"
                    >
                        Login
                    </button>
                </form>

                <a
                    href="#"
                    className="block text-sm text-gray-600 mt-3 hover:underline"
                >
                    Forgot Password?
                </a>

                <div className="my-4 text-gray-500 text-sm">— or —</div>

                <button
                    onClick={handleGoogleLogin}
                    className="w-full flex items-center justify-center gap-3 border border-gray-300 py-2 rounded-md hover:bg-gray-100 transition"
                >
                    <img
                        src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                        alt="Google Icon"
                        className="w-5 h-5"
                    />
                    <span className="text-sm text-gray-700">Login with Google</span>
                </button>

                <div className="mt-6 text-sm text-gray-500">— New here? Sign up —</div>

                <div className="flex gap-3 mt-4 flex-wrap justify-center">
                    <button
                        onClick={() => (window.location.href = "/signup-student")}
                        className="flex-1 bg-[#1D3557] text-white py-2 rounded-md hover:bg-[#1D3577] transition min-w-[140px]"
                    >
                        👨‍🎓 Student
                    </button>
                    <button
                        onClick={() => (window.location.href = "/signup-organizer")}
                        className="flex-1 bg-[#E63946] text-white py-2 rounded-md hover:bg-[#e63937] transition min-w-[140px]"
                    >
                        📋 Organizer
                    </button>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
