// src/components/AddContentForm.js
import React, { useState } from 'react';

function AddContentForm() {
  // Create state for each input field
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('feature_card'); // Default category

  const handleSubmit = async (event) => {
    // Prevent the default browser form submission (which causes a page reload)
    event.preventDefault();

    const newItem = { title, description, category };

    try {
      const response = await fetch('http://localhost:4000/api/content_items', {
        method: 'POST', // Specify the method
        headers: {
          'Content-Type': 'application/json', // Tell the server we're sending JSON //is a message to our backend server, letting it know that the data in the body is JSON. This is what app.use(express.json()) looks for.
        },
        body: JSON.stringify(newItem), // Convert the JS object to a JSON string
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const createdItem = await response.json();
      console.log('Successfully created item:', createdItem);
      alert('Content item created successfully!');

      // Clear the form fields
      setTitle('');
      setDescription('');

    } catch (error) {
      console.error('Failed to create item:', error);
      alert('Failed to create content item.');
    }
  };

  return (
    <div style={{ border: '2px solid blue', padding: '20px', margin: '20px' }}>
      <h2>Create New Content Item</h2>
      <form onSubmit={handleSubmit}> {/*handleSubmit: This function runs when you click the "Create Item" button.*/}
        <div>
          <label>Title: </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div style={{ marginTop: '10px' }}>
          <label>Description: </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>
        <div style={{ marginTop: '10px' }}>
          <label>Category: </label>
          <input
            type="text"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
          />
        </div>
        <button type="submit" style={{ marginTop: '10px' }}>Create Item</button>
      </form>
    </div>
  );
}

export default AddContentForm;