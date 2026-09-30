import React, { useState, useEffect } from 'react';
import { FaUser, FaEnvelope, FaUserTie, FaSearch, FaSpinner } from 'react-icons/fa';

const UserList = ({ onSelectUser }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://10.2.0.65:8020/users?limit=100&offset=0');
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        // Transform the API response to match our expected format
        const formattedUsers = data.map(user => ({
          id: user.id,
          name: user.name || `${user.first_name || ''} ${user.last_name || ''}`.trim() || 'Unnamed User',
          email: user.email || 'No email provided',
          role: user.role || 'User',
          ...user // Include all other user properties
        }));
        
        setUsers(formattedUsers);
      } catch (err) {
        console.error('Error fetching users:', err);
        setError('Failed to load users. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (user.email && user.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (user.role && user.role.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  if (loading) {
    return (
      <div className="text-center py-4">
        <FaSpinner className="fa-spin me-2" />
        <span>Loading users...</span>
      </div>
    );
  }

  if (error) {
    return <div className="alert alert-danger">{error}</div>;
  }

  return (
    <div className="user-list-container">
      <div className="mb-4">
        <div className="input-group">
          <span className="input-group-text">
            <FaSearch />
          </span>
          <input
            type="text"
            className="form-control"
            placeholder="Search users by name, email, or role..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="row g-3">
        {filteredUsers.length > 0 ? (
          filteredUsers.map((user) => (
            <div key={user.id} className="col-md-6 col-lg-4">
              <div className="card h-100 shadow-sm">
                <div className="card-body">
                  <div className="d-flex align-items-center mb-3">
                    <div 
                      className="rounded-circle bg-light d-flex align-items-center justify-content-center me-3" 
                      style={{ width: '50px', height: '50px' }}
                    >
                      <FaUser size={20} className="text-secondary" />
                    </div>
                    <div>
                      <h5 className="mb-0">{user.name}</h5>
                      {user.role && (
                        <span className="badge bg-primary">{user.role}</span>
                      )}
                    </div>
                  </div>
                  
                  {user.email && (
                    <div className="d-flex align-items-center text-muted mb-2">
                      <FaEnvelope className="me-2" />
                      <small>{user.email}</small>
                    </div>
                  )}
                  
                  {onSelectUser && (
                    <button 
                      className="btn btn-outline-primary btn-sm w-100 mt-2"
                      onClick={() => onSelectUser(user)}
                    >
                      Select User
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-12">
            <div className="alert alert-info">
              No users found matching "{searchTerm}".
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserList;
