// src/components/Card.js

// The props (image, title, description) are destructured in the function arguments
function Card({ image, title, description }) {
  const cardStyle = {
    border: '1px solid #ddd',
    borderRadius: '8px',
    padding: '16px',
    margin: '16px',
    maxWidth: '300px',
    boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
    textAlign: 'left'
  };

  const imageStyle = {
    width: '100%',
    height: '180px',
    objectFit: 'cover',
    borderRadius: '4px'
  };

  return (
    <div style={cardStyle}>
      <img src={image} alt={title} style={imageStyle} />
      <h3>{title}</h3>
      <p>{description}</p>
    </div>
  );
}

export default Card;