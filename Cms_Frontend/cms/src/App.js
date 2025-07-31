import React, { useState, useEffect } from 'react';

import HeroBanner from './components/HeroBanner'; 
import CardGrid from './components/CardGrid';
import AddContentForm from './components/AddContentForm';

function App() {
  const [pageData, setPageData] = useState(null);

   // useEffect will run once when the component first loads
  useEffect(() => { 
    fetch('http://localhost:4000/api/pages/homepage') // Fetch data from our API endpoint
      .then(response => response.json()) // Parse the JSON from the response
      .then(data => { 
        setPageData(data); // Set the data from the API into our state
      })
      .catch(error => console.error("Failed to fetch page data:", error));
  }, []); // The empty array [] means this effect runs only once.

console.log(pageData)
    // Render a loading message until the data has arrived

  if (!pageData) {
    return <div>Loading page...</div>;
  }


// Once data is loaded, render the page dynamically
  return (
    <div style={{ textAlign: 'center' }}>
      <h1>{pageData.title}</h1>
      {/* We now map over the BLOCKS from our real data */}
      {pageData.blocks.map((block, index) => {
        // Use the block_type to decide which component to render
        switch (block.block_type) {
          case 'hero_banner':
            return <HeroBanner key={index} title={block.data.title} subtitle={block.data.subtitle} button_text={block.data.button_text} />;
          case 'card_grid':
            // For the card grid, we need to fetch its content separately later.
            // For now, let's just show the title.
            return <h2 key={index}>{block.data.grid_title}</h2>;
          default:
            return null;
        }
      })}
      <AddContentForm />
    </div>
  );

}


export default App;
