// src/components/CardGrid.js
import Card from './Card'; // Import the child component

// This component expects a prop called "cards" which should be an array
function CardGrid({ cards }) {
  const gridStyle = {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'center'
  };

  return (
    <div style={gridStyle}>
      {/* We use the .map() function to loop over the array */}
      {/* For each item in the array, we render a Card component */}
      {cards.map((card, index) => (   //What you've done: You've taught React how to build a grid of cards. The .map() function is one of the most important patterns in React. It says, "For every item in this list of data, create a component."
        <Card
          key={index} // React needs a unique "key" for lists
          image={card.image_src}
          title={card.title}
          description={card.description}
        />
      ))}
    </div>
  );
}

export default CardGrid;