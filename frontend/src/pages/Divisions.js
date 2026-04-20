import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import { FaPlus, FaEdit, FaTrash, FaQrcode, FaBuilding } from 'react-icons/fa';

const Divisions = () => {
  const [divisions, setDivisions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingDivision, setEditingDivision] = useState(null);
  const [formData, setFormData] = useState({
    division_name: '',
    leader_name: '',
    description: ''
  });

  useEffect(() => {
    fetchDivisions();
  }, []);

  const fetchDivisions = async () => {
    try {
      const response = await api.get('/api/admin/divisions');
      setDivisions(response.data.data);
    } catch (error) {
      console.error('Error fetching divisions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingDivision) {
        await api.put(`/api/divisions/${editingDivision.id}`, formData);
      } else {
        await api.post('/api/divisions', formData);
      }
      
      fetchDivisions();
      setShowModal(false);
      resetForm();
    } catch (error) {
      console.error('Error saving division:', error);
    }
  };

  const handleEdit = (division) => {
    setEditingDivision(division);
    setFormData({
      division_name: division.division_name || '',
      leader_name: division.leader_name || '',
      description: division.description || ''
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this division?')) {
      try {
        await api.delete(`/api/divisions/${id}`);
        fetchDivisions();
      } catch (error) {
        console.error('Error deleting division:', error);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      division_name: '',
      leader_name: '',
      description: ''
    });
    setEditingDivision(null);
  };

  const handleExport = async (format, divisionId) => {
    try {
      const response = await api.get(`/api/export/division/${divisionId}/${format}`, {
        responseType: 'blob'
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `division_${divisionId}.${format}`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Export error:', error);
    }
  };

  const generateQRCode = async (divisionId) => {
    try {
      const response = await api.get(`/api/qrcode/division/${divisionId}`);
      // You can implement QR code display modal here
      console.log('QR Code data:', response.data);
    } catch (error) {
      console.error('QR Code generation error:', error);
    }
  };

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
          <h2>Divisions Management</h2>
          <button className="btn btn-primary" onClick={() => setShowModal(true)}>
            <FaPlus /> Add Division
          </button>
        </div>
        
        <div className="card-body">
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Division Name</th>
                  <th>Leader Name</th>
                  <th>Families Count</th>
                  <th>Youth Count</th>
                  <th>Description</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {divisions.map(division => (
                  <tr key={division.id}>
                    <td><strong>{division.division_name}</strong></td>
                    <td>{division.leader_name}</td>
                    <td>
                      <span className="badge badge-primary">{division.family_count}</span>
                    </td>
                    <td>
                      <span className="badge badge-success">{division.youth_count}</span>
                    </td>
                    <td>{division.description}</td>
                    <td>
                      <div className="actions">
                        <button className="btn-icon edit" onClick={() => handleEdit(division)}>
                          <FaEdit />
                        </button>
                        <button className="btn-icon delete" onClick={() => handleDelete(division.id)}>
                          <FaTrash />
                        </button>
                        <button 
                          className="btn-icon" 
                          style={{ background: 'rgba(255, 193, 7, 0.1)', color: '#ffc107' }}
                          onClick={() => generateQRCode(division.id)}
                          title="Generate QR Code"
                        >
                          <FaQrcode />
                        </button>
                        <div className="export-buttons" style={{ display: 'inline-flex', gap: '5px' }}>
                          <button 
                            className="btn-icon" 
                            style={{ background: 'rgba(255, 193, 7, 0.1)', color: '#ffc107' }}
                            onClick={() => handleExport('pdf', division.id)}
                            title="Export PDF"
                          >
                            PDF
                          </button>
                          <button 
                            className="btn-icon" 
                            style={{ background: 'rgba(40, 167, 69, 0.1)', color: '#28a745' }}
                            onClick={() => handleExport('excel', division.id)}
                            title="Export Excel"
                          >
                            XLS
                          </button>
                          <button 
                            className="btn-icon" 
                            style={{ background: 'rgba(0, 123, 255, 0.1)', color: '#007bff' }}
                            onClick={() => handleExport('word', division.id)}
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

          {divisions.length === 0 && (
            <div className="empty-state">
              <FaBuilding style={{ fontSize: '4rem', opacity: 0.3 }} />
              <h3>No divisions found</h3>
              <p>Add your first division to get started</p>
            </div>
          )}
        </div>
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h2>{editingDivision ? 'Edit Division' : 'Add Division'}</h2>
              <button className="modal-close" onClick={() => setShowModal(false)}>
                ×
              </button>
            </div>
            
            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                <div className="form-group">
                  <label>Division Name *</label>
                  <input
                    type="text"
                    value={formData.division_name}
                    onChange={(e) => setFormData({ ...formData, division_name: e.target.value })}
                    required
                    placeholder="Enter division name"
                  />
                </div>
                
                <div className="form-group">
                  <label>Leader Name</label>
                  <input
                    type="text"
                    value={formData.leader_name}
                    onChange={(e) => setFormData({ ...formData, leader_name: e.target.value })}
                    placeholder="Enter leader name"
                  />
                </div>
                
                <div className="form-group">
                  <label>Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows="3"
                    placeholder="Enter division description"
                  />
                </div>
              </div>
              
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingDivision ? 'Update' : 'Save'} Division
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Divisions;