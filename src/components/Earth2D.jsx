import React from 'react';
import './Earth2D.css';

export default function Earth2D({ selectedSchool }) {
    // Calculate rotation based on school coordinates
    const getRotation = () => {
        if (!selectedSchool || !selectedSchool.coordinates) {
            return { longitude: 0, latitude: 0 };
        }
        const [lat, lon] = selectedSchool.coordinates;
        return { longitude: -lon, latitude: -lat };
    };

    const rotation = getRotation();

    return (
        <div className="earth-container">
            <div
                className="earth-globe"
                style={{
                    transform: `rotateY(${rotation.longitude}deg) rotateX(${rotation.latitude}deg)`
                }}
            >
                {/* Globe wireframe */}
                <div className="earth-grid"></div>
                <div className="earth-grid vertical"></div>

                {/* Marker for selected school */}
                {selectedSchool && (
                    <div className="earth-marker"></div>
                )}
            </div>
        </div>
    );
}
