import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import { FaPlus, FaEdit, FaTrash, FaUsers } from 'react-icons/fa';

const Families = () => {
  const [families, setFamilies] = useState([]);
  const [divisions, setDivisions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingFamily, setEditingFamily] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDivision, setSelectedDivision] = useState('');
  const [formData, setFormData] = useState({
    name_english: '',
    name_tamil: '',
    phone_number: '',
    full_address: '',
    aadhaar_number: '',
    native_place: '',
    baptism_date: '',
    baptized_by: '',
    marriage_date: '',
    married_by: '',
    division_id: '',
    division_leader_name: '',
    members: []
  });

  useEffect(() => {
    fetchFamilies();
    fetchDivisions();
  }, []);

  const fetchFamilies = async () => {
    try {
      const response = await api.get('/api/admin/families');
      setFamilies(response.data.data);
    } catch (error) {
      console.error('Error fetching families:', error);
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

    // Form validation
    if (!formData.name_english.trim()) {
      alert('Family Head Name (English) is required');
      return;
    }
    if (!formData.phone_number.trim()) {
      alert('Phone Number is required');
      return;
    }
    if (!formData.division_id) {
      alert('Division Area is required');
      return;
    }

    try {
      if (editingFamily) {
        await api.put(`/api/families/${editingFamily.id}`, formData);
        alert('Family updated successfully!');
      } else {
        await api.post('/api/families', formData);
        alert('Family added successfully!');
      }

      fetchFamilies();
      setShowModal(false);
      resetForm();
    } catch (error) {
      console.error('Error saving family:', error);
      alert('Error saving family. Please try again.');
    }
  };

  const handleEdit = (family) => {
    setEditingFamily(family);
    setFormData({
      name_english: family.name_english || '',
      name_tamil: family.name_tamil || '',
      phone_number: family.phone_number || '',
      full_address: family.full_address || '',
      aadhaar_number: family.aadhaar_number || '',
      native_place: family.native_place || '',
      baptism_date: family.baptism_date || '',
      baptized_by: family.baptized_by || '',
      marriage_date: family.marriage_date || '',
      married_by: family.married_by || '',
      division_id: family.division_id || '',
      division_leader_name: family.division_leader_name || '',
      members: family.members || []
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this family?')) {
      try {
        await api.delete(`/api/families/${id}`);
        fetchFamilies();
      } catch (error) {
        console.error('Error deleting family:', error);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      name_english: '',
      name_tamil: '',
      phone_number: '',
      full_address: '',
      aadhaar_number: '',
      native_place: '',
      baptism_date: '',
      baptized_by: '',
      marriage_date: '',
      married_by: '',
      division_id: '',
      division_leader_name: '',
      members: []
    });
    setEditingFamily(null);
  };

  const addMember = () => {
    setFormData({
      ...formData,
      members: [...formData.members, {
        relationship: '',
        name_english: '',
        name_tamil: '',
        phone_number: '',
        gender: '',
        date_of_birth: ''
      }]
    });
  };

  const updateMember = (index, field, value) => {
    const updatedMembers = [...formData.members];
    updatedMembers[index][field] = value;
    setFormData({ ...formData, members: updatedMembers });
  };

  const removeMember = (index) => {
    const updatedMembers = formData.members.filter((_, i) => i !== index);
    setFormData({ ...formData, members: updatedMembers });
  };

  const handleExport = async (format, familyId) => {
    try {
      const response = await api.get(`/api/export/family/${familyId}/${format}`, {
        responseType: 'blob'
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `family_${familyId}.${format}`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Export error:', error);
    }
  };

  const filteredFamilies = families.filter(family => {
    const lowerSearch = searchTerm.toLowerCase();
    const englishName = family.name_english ? family.name_english.toLowerCase() : '';
    const tamilName = family.name_tamil ? family.name_tamil.toLowerCase() : '';
    const matchesSearch = englishName.includes(lowerSearch) || tamilName.includes(lowerSearch);
    const matchesDivision = !selectedDivision || family.division_id === selectedDivision;
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
          <h2>Families Management</h2>
          <button className="btn btn-primary" onClick={() => setShowModal(true)}>
            <FaPlus /> Add Family
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
                  <th>Members</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredFamilies.map(family => (
                  <tr key={family.id}>
                    <td>
                      <div>
                        <strong>{family.name_english}</strong>
                        {family.name_tamil && <div style={{ fontSize: '0.8rem', color: '#666' }}>{family.name_tamil}</div>}
                      </div>
                    </td>
                    <td>{family.phone_number}</td>
                    <td>{family.division_name}</td>
                    <td>{family.members?.length || 0} members</td>
                    <td>
                      <div className="actions">
                        <button className="btn-icon edit" onClick={() => handleEdit(family)}>
                          <FaEdit />
                        </button>
                        <button className="btn-icon delete" onClick={() => handleDelete(family.id)}>
                          <FaTrash />
                        </button>
                        <div className="export-buttons" style={{ display: 'inline-flex', gap: '5px' }}>
                          <button 
                            className="btn-icon" 
                            style={{ background: 'rgba(255, 193, 7, 0.1)', color: '#ffc107' }}
                            onClick={() => handleExport('pdf', family.id)}
                            title="Export PDF"
                          >
                            PDF
                          </button>
                          <button 
                            className="btn-icon" 
                            style={{ background: 'rgba(40, 167, 69, 0.1)', color: '#28a745' }}
                            onClick={() => handleExport('excel', family.id)}
                            title="Export Excel"
                          >
                            XLS
                          </button>
                          <button 
                            className="btn-icon" 
                            style={{ background: 'rgba(0, 123, 255, 0.1)', color: '#007bff' }}
                            onClick={() => handleExport('word', family.id)}
                            title="Export Word"
                          >
                            DOC
                          </button>
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredFamilies.length === 0 && (
            <div className="empty-state">
              <FaUsers style={{ fontSize: '4rem', opacity: 0.3 }} />
              <h3>No families found</h3>
              <p>Add your first family to get started</p>
            </div>
          )}
        </div>
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h2>{editingFamily ? 'Edit Family' : 'Add Family'}</h2>
              <button className="modal-close" onClick={() => setShowModal(false)}>
                ×
              </button>
            </div>
            
            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                <div className="form-grid">
                  <div className="form-group">
                    <label>Name (English) <span style={{color: 'red'}}>*</span></label>
                    <input
                      type="text"
                      value={formData.name_english}
                      onChange={(e) => setFormData({ ...formData, name_english: e.target.value })}
                      placeholder="Enter family head name"
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
                    <label>Phone Number <span style={{color: 'red'}}>*</span></label>
                    <input
                      type="text"
                      value={formData.phone_number}
                      onChange={(e) => setFormData({ ...formData, phone_number: e.target.value })}
                      placeholder="Enter phone number"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Division Area <span style={{color: 'red'}}>*</span></label>
                    <select
                      value={formData.division_id}
                      onChange={(e) => setFormData({ ...formData, division_id: e.target.value })}
                      required
                    >
                      <option value="">Select Division</option>
                      {divisions.map(division => (
                        <option key={division.id} value={division.id}>
                          {division.division_name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                
                <div className="form-group">
                  <label>Full Address</label>
                  <textarea
                    value={formData.full_address}
                    onChange={(e) => setFormData({ ...formData, full_address: e.target.value })}
                    rows="3"
                  />
                </div>
                
                <div className="form-grid">
                  <div className="form-group">
                    <label>Aadhaar Number</label>
                    <input
                      type="text"
                      value={formData.aadhaar_number}
                      onChange={(e) => setFormData({ ...formData, aadhaar_number: e.target.value })}
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>Native Place</label>
                    <input
                      type="text"
                      value={formData.native_place}
                      onChange={(e) => setFormData({ ...formData, native_place: e.target.value })}
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>Baptism Date</label>
                    <input
                      type="date"
                      value={formData.baptism_date}
                      onChange={(e) => setFormData({ ...formData, baptism_date: e.target.value })}
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>Baptized By</label>
                    <input
                      type="text"
                      value={formData.baptized_by}
                      onChange={(e) => setFormData({ ...formData, baptized_by: e.target.value })}
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>Marriage Date</label>
                    <input
                      type="date"
                      value={formData.marriage_date}
                      onChange={(e) => setFormData({ ...formData, marriage_date: e.target.value })}
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>Married By</label>
                    <input
                      type="text"
                      value={formData.married_by}
                      onChange={(e) => setFormData({ ...formData, married_by: e.target.value })}
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>Division Leader Name</label>
                    <input
                      type="text"
                      value={formData.division_leader_name}
                      onChange={(e) => setFormData({ ...formData, division_leader_name: e.target.value })}
                    />
                  </div>
                </div>
                
                <div style={{ marginTop: '20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                    <h3>Family Members</h3>
                    <button type="button" className="btn btn-secondary" onClick={addMember}>
                      <FaPlus /> Add Member
                    </button>
                  </div>
                  
                  {formData.members.map((member, index) => (
                    <div key={index} className="member-item">
                      <div style={{ flex: 1 }}>
                        <div className="form-grid">
                          <div className="form-group">
                            <label>Relationship</label>
                            <select
                              value={member.relationship}
                              onChange={(e) => updateMember(index, 'relationship', e.target.value)}
                            >
                              <option value="">Select Relationship</option>
                              <option value="Wife">Wife</option>
                              <option value="Son">Son</option>
                              <option value="Daughter">Daughter</option>
                              <option value="Father">Father</option>
                              <option value="Mother">Mother</option>
                              <option value="Brother">Brother</option>
                              <option value="Sister">Sister</option>
                            </select>
                          </div>
                          
                          <div className="form-group">
                            <label>Name (English)</label>
                            <input
                              type="text"
                              value={member.name_english}
                              onChange={(e) => updateMember(index, 'name_english', e.target.value)}
                            />
                          </div>
                          
                          <div className="form-group">
                            <label>Name (Tamil)</label>
                            <input
                              type="text"
                              value={member.name_tamil}
                              onChange={(e) => updateMember(index, 'name_tamil', e.target.value)}
                            />
                          </div>
                          
                          <div className="form-group">
                            <label>Phone</label>
                            <input
                              type="text"
                              value={member.phone_number}
                              onChange={(e) => updateMember(index, 'phone_number', e.target.value)}
                            />
                          </div>
                          
                          <div className="form-group">
                            <label>Gender</label>
                            <select
                              value={member.gender}
                              onChange={(e) => updateMember(index, 'gender', e.target.value)}
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
                              value={member.date_of_birth}
                              onChange={(e) => updateMember(index, 'date_of_birth', e.target.value)}
                            />
                          </div>
                        </div>
                      </div>
                      
                      <button 
                        type="button" 
                        className="btn-icon delete" 
                        onClick={() => removeMember(index)}
                        style={{ marginLeft: '10px' }}
                      >
                        <FaTrash />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingFamily ? 'Update' : 'Save'} Family
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Families;