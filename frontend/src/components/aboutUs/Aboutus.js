import React from 'react';

function Aboutus() {
    const containerStyle = {
        display: 'flex',
        justifyContent: 'space-around',
        flexWrap: 'wrap',
        marginTop: '50px',
    };

    const cardStyle = {
        width: '250px',
        margin: '20px',
        padding: '20px',
        border: '1px solid #ccc',
        borderRadius: '8px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        backgroundColor: '#fff',
        textAlign: 'center',
        animation: 'slide-in 1s ease-out',
    };

    const imageStyle = {
        width: '100%',
        borderRadius: '8px',
    };

    const nameStyle = {
        fontSize: '20px',
        margin: '10px 0',
        color: '#333',
    };

    const socialLinksStyle = {
        display: 'flex',
        justifyContent: 'center',
        gap: '10px',
        marginTop: '10px',
    };

    const socialLinkStyle = {
        color: '#fff',
        backgroundColor: '#000',
        padding: '10px',
        borderRadius: '50%',
        textDecoration: 'none',
        width: '30px',
        height: '30px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    };

    const keyframesStyle = `
    @keyframes slide-in {
      from {
        transform: translateX(100%);
        opacity: 0;
      }
      to {
        transform: translateX(0);
        opacity: 1;
      }
    }
  `;

    const cards = [
        {
            image: 'https://via.placeholder.com/150',
            name: 'John Doe',
            links: {
                facebook: 'https://facebook.com',
                twitter: 'https://twitter.com',
                instagram: 'https://instagram.com',
            },
        },
        {
            image: 'https://via.placeholder.com/150',
            name: 'Jane Smith',
            links: {
                facebook: 'https://facebook.com',
                twitter: 'https://twitter.com',
                instagram: 'https://instagram.com',
            },
        },
        {
            image: 'https://via.placeholder.com/150',
            name: 'Sam Wilson',
            links: {
                facebook: 'https://facebook.com',
                twitter: 'https://twitter.com',
                instagram: 'https://instagram.com',
            },
        },
        {
            image: 'https://via.placeholder.com/150',
            name: 'Sara Connor',
            links: {
                facebook: 'https://facebook.com',
                twitter: 'https://twitter.com',
                instagram: 'https://instagram.com',
            },
        },
        {
            image: 'https://via.placeholder.com/150',
            name: 'Sara Connor',
            links: {
                facebook: 'https://facebook.com',
                twitter: 'https://twitter.com',
                instagram: 'https://instagram.com',
            },
        },
    ];

    return (
        <div>
            <style>{keyframesStyle}</style>
            <h1 style={{ textAlign: 'center', marginTop: '20px' }}>About Us</h1>
            <div style={containerStyle}>
                {cards.map((card, index) => (
                    <div key={index} style={cardStyle}>
                        <img src={card.image} alt={card.name} style={imageStyle} />
                        <div style={nameStyle}>{card.name}</div>
                        <div style={socialLinksStyle}>
                            <a href={card.links.facebook} style={socialLinkStyle} target="_blank" rel="noopener noreferrer">F</a>
                            <a href={card.links.twitter} style={socialLinkStyle} target="_blank" rel="noopener noreferrer">T</a>
                            <a href={card.links.instagram} style={socialLinkStyle} target="_blank" rel="noopener noreferrer">I</a>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Aboutus;
