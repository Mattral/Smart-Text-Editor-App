import React from 'react';
import './App.css';
import BlogEditor from './BlogEditor';
import backgroundImage from './L.gif'; // Path to your background imageimport backgroundImage from './L.gif'; // Path to your background image


function App() {
  return (
    <div className="App">
      <header className="App-header" style={{ backgroundImage: `url(${backgroundImage})` }}>
        <div className="text-container" style={{ backgroundColor: 'black', padding: '10px' }}>
          <h1>Text Editor App</h1>
        </div>
      </header>
      <main>
        <BlogEditor />
      </main>
    </div>
  );
}


export default App;