// src/components/Loading.jsx
import React from 'react';
import './style/Loader.css';

const Loading = () => {
    return (
        <div className="loading-overlay">
            <img className='h-30 w-30' src="/loader/Loader1.gif" alt="Loading..." />
        </div>
    );
};

export default Loading;
