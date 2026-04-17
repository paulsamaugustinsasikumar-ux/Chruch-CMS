import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import { FaPlus, FaEdit, FaTrash, FaUsers } from 'react-icons/fa';

const Youth = () => {
  const [youth, setYouth] = useState([]);
  const [divisions, setDivisions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingMember, setEditingMember] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDivision, setSelectedDivision] = useState('');
  const [formData, setFormData] = useState({
    name_english: '',
    name_tamil: '',
    phone_number: '',
    division_id: '',
    gender: '',
    date_of_birth: '',
    occupation: '',
    address: ''
  });

  useEffect(() => {
    fetchYouth();
    fetchDivisions();
  }, []);

  const fetchYouth = async () => {
    try {
      const response = await api.get('/api/admin/youth');
      setYouth(response.data.data);
    } catch (error) {
      console.error('Error fetching youth:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchDivisions = async () => {
    try {
      const response = await api.get('/api/admin/divisions');
      setDivisions(response.data.data);
    } catch (error) {
      console.error('Error fetching divisions:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingMember) {
        await api.put(`/api/youth/${editingMember.id}`, formData);
      } else {
        await api.post('/api/youth', formData);
      }
      
      fetchYouth();
      setShowModal(false);
      resetForm();
    } catch (error) {
      console.error('Error saving youth member:', error);
    }
  };

  const handleEdit = (member) => {
    setEditingMember(member);
    setFormData({
      name_english: member.name_english || '',
      name_tamil: member.name_tamil || '',
      phone_number: member.phone_number || '',
      division_id: member.division_id || '',
      gender: member.gender || '',
      date_of_birth: member.date_of_birth || '',
      occupation: member.occupation || '',
      address: member.address || ''
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this youth member?')) {
      try {
        await api.delete(`/api/youth/${id}`);
        fetchYouth();
      } catch (error) {
        console.error('Error deleting youth member:', error);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      name_english: '',
      name_tamil: '',
      phone_number: '',
      division_id: '',
      gender: '',
      date_of_birth: '',
      occupation: '',
      address: ''
    });
    setEditingMember(null);
  };

  const filteredYouth = youth.filter(member => {
    const matchesSearch = member.name_english.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (member.name_tamil && member.name_tamil.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesDivision = !selectedDivision || member.division_id === selectedDivision;
    return matchesSearch && matchesDivision;
  });

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="card">
        <div className="card-header">
          <h2>Youth Members Management</h2>
          <button className="btn btn-primary" onClick={() => setShowModal(true)}>
            <FaPlus /> Add Youth Member
          </button>
        </div>
        
        <div className="card-body">
          <div className="search-bar">
            <input
              type="text"
              className="search-input"
              placeholder="Search by name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <select
              className="filter-select"
              value={selectedDivision}
              onChange={(e) => setSelectedDivision(e.target.value)}
            >
              <option value="">All Divisions</option>
              {divisions.map(division => (
                <option key={division.id} value={division.id}>
                  {division.division_name}
                </option>
              ))}
            </select>
          </div>

          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Phone</th>
                  <th>Division</th>
                  <th>Gender</th>
                  <th>Occupation</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredYouth.map(member => (
                  <tr key={member.id}>
                    <td>
                      <div>
                        <strong>{member.name_english}</strong>
                        {member.name_tamil && <div style={{ fontSize: '0.8rem', color: '#666' }}>{member.name_tamil}</div>}
                      </div>
                    </td>
                    <td>{member.phone_number}</td>
                    <td>{member.division_name}</td>
                    <td>
                      <span className={`badge ${member.gender === 'male' ? 'badge-primary' : 'badge-success'}`}>
                        {member.gender}
                      </span>
                    </td>
                    <td>{member.occupation}</td>
                    <td>
                      <div className="actions">
                        <button className="btn-icon edit" onClick={() => handleEdit(member)}>
                          <FaEdit />
                        </button>
                        <button className="btn-icon delete" onClick={() => handleDelete(member.id)}>
                          <FaTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredYouth.length === 0 && (
            <div className="empty-state">
              <FaUsers style={{ fontSize: '4rem', opacity: 0.3 }} />
              <h3>No youth members found</h3>
              <p>Add your first youth member to get started</p>
            </div>
          )}
        </div>
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h2>{editingMember ? 'Edit Youth Member' : 'Add Youth Member'}</h2>
              <button className="modal-close" onClick={() => setShowModal(false)}>
                ×
              </button>
            </div>
            
            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                <div className="form-grid">
                  <div className="form-group">
                    <label>Name (English) *</label>
                    <input
                      type="text"
                      value={formData.name_english}
                      onChange={(e) => setFormData({ ...formData, name_english: e.target.value })}
                      required
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>Name (Tamil)</label>
                    <input
                      type="text"
                      value={formData.name_tamil}
                      onChange={(e) => setFormData({ ...formData, name_tamil: e.target.value })}
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>Phone Number</label>
                    <input
                      type="text"
                      value={formData.phone_number}
                      onChange={(e) => setFormData({ ...formData, phone_number: e.target.value })}
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>Division</label>
                    <select
                      value={formData.division_id}
                      onChange={(e) => setFormData({ ...formData, division_id: e.target.value })}
                    >
                      <option value="">Select Division</option>
                      {divisions.map(division => (
                        <option key={division.id} value={division.id}>
                          {division.division_name}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="form-group">
                    <label>Gender</label>
                    <select
                      value={formData.gender}
                      onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                    >
                      <option value="">Select Gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  
                  <div className="form-group">
                    <label>Date of Birth</label>
                    <input
                      type="date"
                      value={formData.date_of_birth}
                      onChange={(e) => setFormData({ ...formData, date_of_birth: e.target.value })}
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>Occupation</label>
                    <input
                      type="text"
                      value={formData.occupation}
                      onChange={(e) => setFormData({ ...formData, occupation: e.target.value })}
                      placeholder="e.g., Student, Engineer, Teacher"
                    />
                  </div>
                </div>
                
                <div className="form-group">
                  <label>Address</label>
                  <textarea
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    rows="3"
                    placeholder="Enter full address"
                  />
                </div>
              </div>
              
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingMember ? 'Update' : 'Save'} Member
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Youth;