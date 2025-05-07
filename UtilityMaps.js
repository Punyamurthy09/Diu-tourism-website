import React, { useEffect, useRef, useState } from 'react';

const MapComponent = () => {
    const [coordinates, setCoordinates] = useState({
        lat: null,
        lng: null,
        acc: null,
        alt: null,
        speed: null,
        head: null,
    });

    const mapRef = useRef(null);

    useEffect(() => {
        const initMap = () => {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    (position) => {
                        const pos = {
                            lat: position.coords.latitude,
                            lng: position.coords.longitude,
                            acc: position.coords.accuracy,
                            alt: position.coords.altitude,
                            speed: position.coords.speed,
                            head: position.coords.heading,
                        };

                        setCoordinates(pos);

                        const map = new window.google.maps.Map(mapRef.current, {
                            center: pos,
                            zoom: 14,
                        });

                        new window.google.maps.Marker({
                            position: pos,
                            map: map,
                            title: 'You are here!',
                        });

                        // Dummy data for public toilets
                        const toiletLocations = [
                            { lat: pos.lat + 0.002, lng: pos.lng + 0.002, name: 'Public Toilet 1' },
                            { lat: 21.719200, lng: 70.982300, name: 'Public Toilet 2' },
                        ];

                        // Dummy data for dustbins
                        const dustbinLocations = [
                            { lat: 21.718666, lng: 70.981086, name: 'Dustbin 1' },
                            { lat: 21.717900, lng: 70.980500, name: 'Dustbin 2' },
                        ];

                        // Add toilet markers with hotel icon
                        toiletLocations.forEach((toilet) => {
                            new window.google.maps.Marker({
                                position: { lat: toilet.lat, lng: toilet.lng },
                                map: map,
                                title: toilet.name,
                                icon: {
                                    url: 'https://cdn-icons-png.flaticon.com/512/139/139899.png', // Hotel icon
                                    scaledSize: new window.google.maps.Size(32, 32),
                                },
                            });
                        });

                        // Add dustbin markers with cart icon
                        dustbinLocations.forEach((bin) => {
                            new window.google.maps.Marker({
                                position: { lat: bin.lat, lng: bin.lng },
                                map: map,
                                title: bin.name,
                                icon: {
                                    url: 'https://cdn-icons-png.flaticon.com/512/263/263115.png', // Cart icon
                                    scaledSize: new window.google.maps.Size(32, 32),
                                },
                            });
                        });
                    },
                    () => {
                        alert('Failed to get location. Please enable location services.');
                    }
                );
            } else {
                alert('Geolocation is not supported by your browser.');
            }
        };

        const script = document.createElement('script');
        script.src =
            'https://maps.gomaps.pro/maps/api/js?key=AlzaSy9lxABqxdZBOPRdhfqPOiWGqsdit96a8AH&callback=initMap';
        script.async = true;
        script.defer = true;
        window.initMap = initMap;
        document.head.appendChild(script);

        return () => {
            delete window.initMap;
            document.head.removeChild(script);
        };
    }, []);

    return (
        <div style={{ textAlign: 'center', padding: '20px' }}>
            <h3>My Location</h3>
            <div
                ref={mapRef}
                style={{
                    width: '100%',
                    height: '400px',
                    margin: '20px auto',
                    boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
                }}
            ></div>
        </div>
    );
};

export default MapComponent;
