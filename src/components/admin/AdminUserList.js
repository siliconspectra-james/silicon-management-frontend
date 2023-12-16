import React, { useState, useEffect } from 'react';
import { Loader, List, Input } from 'semantic-ui-react';
import axios from 'axios';

function AdminUserList({ onUserSelect }) {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [candidateList, setCandidateList] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const newip = 'http://10.0.0.79:5000/management';

  useEffect(() => {
    const fetchCandidates = async () => {
      setIsLoading(true);
      setError(null);
      const token = localStorage.getItem("userToken");
      const isAdmin = localStorage.getItem("isAdmin") === 'true';

      if (!isAdmin) {
        setError("Access Denied: Not an admin.");
        setIsLoading(false);
        return;
      }

      try {
        const response = await axios.get(`${newip}/user/admin/all/users`, { headers: { 'auth': token } });
        setCandidateList(response.data); // Assuming the data is an array of user objects
        console.log('candidate list data: ',response.data)
      } catch (error) {
        setError('Failed to load candidate data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchCandidates();
  }, []);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredCandidates = candidateList.filter(candidate => {
    // Convert any non-null value to a string before calling toLowerCase
    const userName = candidate.userName ? candidate.userName.toString().toLowerCase() : '';
    return userName.includes(searchTerm.toLowerCase());
  });
  
  

  const handleCandidateClick = (candidate) => {
    localStorage.setItem('selectedUserId', candidate.userId); // Store the user's ID
    onUserSelect(candidate); // Pass the entire candidate object
  };

  if (isLoading) {
    return <Loader active>Loading...</Loader>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>Candidate List</h2>
        <Input 
          icon='search' 
          placeholder='Search candidates...' 
          value={searchTerm} 
          onChange={handleSearchChange} 
        />
      </div>
      <List>
        {filteredCandidates.map(candidate => (
          <List.Item key={candidate.userId} onClick={() => handleCandidateClick(candidate)}>
            <List.Content>
              <List.Header as="a">{candidate.userName}</List.Header>
              {/* Other candidate details can be added here */}
            </List.Content>
          </List.Item>
        ))}
      </List>
    </div>
  );
}

export default AdminUserList;
