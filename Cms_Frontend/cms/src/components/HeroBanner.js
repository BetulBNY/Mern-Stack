function HeroBanner({ title, subtitle, button_text }) {
  // This component receives data as "props" (properties)
  return (
    <div style={{ padding: '40px', backgroundColor: '#f0f0f0', textAlign: 'center' }}>
      <h1>{title}</h1>
      <p>{subtitle}</p>
      <button>{button_text}</button>
    </div>
  );
}

export default HeroBanner;
