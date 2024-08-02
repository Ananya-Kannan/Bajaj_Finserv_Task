import React, { useState } from 'react';
import axios from 'axios';
import Select from 'react-select';
import './App.css';

const App = () => {
  const [jsonInput, setJsonInput] = useState('');
  const [response, setResponse] = useState(null);
  const [filters, setFilters] = useState([]);
  const [filteredResponse, setFilteredResponse] = useState(null);
  const [error, setError] = useState(null);

  const options = [
    { value: 'numbers', label: 'Numbers' },
    { value: 'alphabets', label: 'Alphabets' },
    { value: 'highest_alphabet', label: 'Highest Alphabet' }
  ];

  const handleSubmit = async () => {
    try {
      if (!jsonInput.trim()) {
        throw new Error('JSON input cannot be empty');
      }

      const parsedJson = JSON.parse(jsonInput.replace(/“|”/g, '"'));

      const res = await axios.post('http://localhost:8080/bfhl', parsedJson);

      setResponse(res.data);
      setFilteredResponse(null);
      setError(null);
    } catch (error) {
      let errorMessage = 'An error occurred';
      if (error instanceof SyntaxError) {
        errorMessage = 'Invalid JSON format';
      } else if (error.response) {
        errorMessage = `API Error: ${error.response.status} ${error.response.statusText}`;
      } else if (error.message) {
        errorMessage = error.message;
      }
      setError(errorMessage);
    }
  };

  const handleFilterChange = (selectedOptions) => {
    setFilters(selectedOptions);
    if (response) {
      let filtered = {};
      selectedOptions.forEach(option => {
        filtered[option.value] = response[option.value];
      });
      setFilteredResponse(filtered);
    }
  };

  return (
    <div className="App">
      <div className="input-container">
        <input
          type="text"
          placeholder='API Input'
          value={jsonInput}
          onChange={(e) => setJsonInput(e.target.value)}
          className="input-field"
        />
        <button onClick={handleSubmit}>Submit</button>
        <input
          type="text"
          placeholder='Multi Filter'
          value={jsonInput}
          onChange={(e) => setJsonInput(e.target.value)}
          className="input-field"
        />
      </div>
      {error && <div className="error">{error}</div>}
      
      {response && (
        <>
          <div className="multi-filter">
            <Select
              isMulti
              options={options}
              onChange={handleFilterChange}
            />
          </div>
          <div className="response">
            <h2>Filtered Response</h2>
            <div>
              {filters.length > 0 ? (
                filters.map(filter => (
                  <div key={filter.value}>
                    <strong>{filter.label}:</strong> {JSON.stringify(filteredResponse ? filteredResponse[filter.value] : response[filter.value], null, 2)}
                  </div>
                ))
              ) : (
                <div>No filters selected</div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default App;
