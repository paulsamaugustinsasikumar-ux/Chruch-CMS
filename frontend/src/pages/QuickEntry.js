import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import { FaSave, FaUserPlus } from 'react-icons/fa';

const QuickEntry = () => {
  const [divisions, setDivisions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('family');
  const [familyForm, setFamilyForm] = useState({
    name_english: '',
    name_tamil: '',
    phone_number: '',
    division_id: ''
  });
  const [youthForm, setYouthForm] = useState({
    name_english: '',
    name_tamil: '',
    phone_number: '',
    division_id: ''
  });
  const [familyMembers, setFamilyMembers] = useState([]);

  useEffect(() => {
    fetchDivisions();
  }, []);

  const fetchDivisions = async () => {
    try {
      const response = await api.get('/api/admin/divisions');
      setDivisions(response.data.data);
    } catch (error) {
      console.error('Error fetching divisions:', error);
    }
  };

  const handleFamilySubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const familyData = {
        ...familyForm,
        members: familyMembers
      };

      await api.post('/api/families', familyData);
      
      // Reset form
      setFamilyForm({
        name_english: '',
        name_tamil: '',
        phone_number: '',
        division_id: ''
      });
      setFamilyMembers([]);
      
      alert('Family added successfully!');
    } catch (error) {
      console.error('Error adding family:', error);
      alert('Error adding family. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleYouthSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await api.post('/api/youth', youthForm);
      
      // Reset form
      setYouthForm({
        name_english: '',
        name_tamil: '',
        phone_number: '',
        division_id: ''
      });
      
      alert('Youth member added successfully!');
    } catch (error) {
      console.error('Error adding youth member:', error);
      alert('Error adding youth member. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const addFamilyMember = () => {
    setFamilyMembers([...familyMembers, {
      relationship: '',
      name_english: '',
      name_tamil: '',
      phone_number: ''
    }]);
  };

  const updateFamilyMember = (index, field, value) => {
    const updatedMembers = [...familyMembers];
    updatedMembers[index][field] = value;
    setFamilyMembers(updatedMembers);
  };

  const removeFamilyMember = (index) => {
    setFamilyMembers(familyMembers.filter((_, i) => i !== index));
  };

  return (
    <div>
      <div className="card">
        <div className="card-header">
          <h2>Quick Entry</h2>
        </div>
        
        <div className="card-body">
          <div className="tabs">
            <button 
              className={`tab ${activeTab === 'family' ? 'active' : ''}`}
              onClick={() => setActiveTab('family')}
            >
              Add Family
            </button>
            <button 
              className={`tab ${activeTab === 'youth' ? 'active' : ''}`}
              onClick={() => setActiveTab('youth')}
            >
              Add Youth
            </button>
          </div>

          {activeTab === 'family' && (
            <form onSubmit={handleFamilySubmit}>
              <div style={{ marginTop: '20px' }}>
                <h3>Family Head Details</h3>
                <div className="form-grid">
                  <div className="form-group">
                    <label>Name (English) *</label>
                    <input
                      type="text"
                      value={familyForm.name_english}
                      onChange={(e) => setFamilyForm({ ...familyForm, name_english: e.target.value })}
                      required
                      placeholder="Enter name in English"
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>Name (Tamil)</label>
                    <input
                      type="text"
                      value={familyForm.name_tamil}
                      onChange={(e) => setFamilyForm({ ...familyForm, name_tamil: e.target.value })}
                      placeholder="Enter name in Tamil"
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>Phone Number</label>
                    <input
                      type="text"
                      value={familyForm.phone_number}
                      onChange={(e) => setFamilyForm({ ...familyForm, phone_number: e.target.value })}
                      placeholder="Enter phone number"
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>Division *</label>
                    <select
                      value={familyForm.division_id}
                      onChange={(e) => setFamilyForm({ ...familyForm, division_id: e.target.value })}
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

                <div style={{ marginTop: '20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                    <h3>Family Members (Optional)</h3>
                    <button type="button" className="btn btn-secondary" onClick={addFamilyMember}>
                      <FaUserPlus /> Add Member
                    </button>
                  </div>
                  
                  {familyMembers.map((member, index) => (
                    <div key={index} className="member-item" style={{ marginBottom: '10px' }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '10px' }}>
                          <select
                            value={member.relationship}
                            onChange={(e) => updateFamilyMember(index, 'relationship', e.target.value)}
                            style={{ padding: '8px', borderRadius: '6px', border: '1px solid #ddd' }}
                          >
                            <option value="">Relationship</option>
                            <option value="Wife">Wife</option>
                            <option value="Son">Son</option>
                            <option value="Daughter">Daughter</option>
                            <option value="Father">Father</option>
                            <option value="Mother">Mother</option>
                            <option value="Brother">Brother</option>
                            <option value="Sister">Sister</option>
                          </select>
                          
                          <input
                            type="text"
                            placeholder="Name (English)"
                            value={member.name_english}
                            onChange={(e) => updateFamilyMember(index, 'name_english', e.target.value)}
                            style={{ padding: '8px', borderRadius: '6px', border: '1px solid #ddd' }}
                          />
                          
                          <input
                            type="text"
                            placeholder="Name (Tamil)"
                            value={member.name_tamil}
                            onChange={(e) => updateFamilyMember(index, 'name_tamil', e.target.value)}
                            style={{ padding: '8px', borderRadius: '6px', border: '1px solid #ddd' }}
                          />
                          
                          <input
                            type="text"
                            placeholder="Phone"
                            value={member.phone_number}
                            onChange={(e) => updateFamilyMember(index, 'phone_number', e.target.value)}
                            style={{ padding: '8px', borderRadius: '6px', border: '1px solid #ddd' }}
                          />
                        </div>
                      </div>
                      
                      <button 
                        type="button" 
                        className="btn-icon delete" 
                        onClick={() => removeFamilyMember(index)}
                        style={{ marginLeft: '10px' }}
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>

                <div style={{ marginTop: '20px', textAlign: 'center' }}>
                  <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
                    <FaSave /> {loading ? 'Saving...' : 'Save Family'}
                  </button>
                </div>
              </div>
            </form>
          )}

          {activeTab === 'youth' && (
            <form onSubmit={handleYouthSubmit}>
              <div style={{ marginTop: '20px' }}>
                <h3>Youth Member Details</h3>
                <div className="form-grid">
                  <div className="form-group">
                    <label>Name (English) *</label>
                    <input
                      type="text"
                      value={youthForm.name_english}
                      onChange={(e) => setYouthForm({ ...youthForm, name_english: e.target.value })}
                      required
                      placeholder="Enter name in English"
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>Name (Tamil)</label>
                    <input
                      type="text"
                      value={youthForm.name_tamil}
                      onChange={(e) => setYouthForm({ ...youthForm, name_tamil: e.target.value })}
                      placeholder="Enter name in Tamil"
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>Phone Number</label>
                    <input
                      type="text"
                      value={youthForm.phone_number}
                      onChange={(e) => setYouthForm({ ...youthForm, phone_number: e.target.value })}
                      placeholder="Enter phone number"
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>Division</label>
                    <select
                      value={youthForm.division_id}
                      onChange={(e) => setYouthForm({ ...youthForm, division_id: e.target.value })}
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

                <div style={{ marginTop: '20px', textAlign: 'center' }}>
                  <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
                    <FaSave /> {loading ? 'Saving...' : 'Save Youth Member'}
                  </button>
                </div>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuickEntry;