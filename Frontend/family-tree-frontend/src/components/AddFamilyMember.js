// AddFamilyMember.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import "./AddFamilyMember.css"

const AddFamilyMember = () => {
  const [familyMembers, setFamilyMembers] = useState([]);
  const [formData, setFormData] = useState({
    firstName: '',
    middleName: '',
    lastName: '',
    gender: 'male',
    birthday: '',
    profession: '',
    isDeceased: false,
    parents: [],
    address: {
      street: '',
      city: '',
      country: ''
    },
    contactInfo: {
      email: '',
      phone: ''
    }
  });

  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  
  useEffect(() => {
    const fetchFamilyMembers = async () => {
      setLoading(true);
      try {
        const response = await axios.get('http://localhost:5000/api/family');
        console.log('Family Members:', response.data);
        setFamilyMembers(response.data);
        setError(null);
      } catch (error) {
        console.error('Error fetching family members:', error);
        setError('فشل في تحميل بيانات العائلة');
      } finally {
        setLoading(false);
      }
    };
      fetchFamilyMembers();
  }, []);
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/family/addfamily', formData);
      alert('تمت إضافة الفرد بنجاح');
      setFormData({
        firstName: '',
        middleName: '',
        lastName: '',
        gender: 'male',
        birthday: '',
        profession: '',
        isDeceased: false,
        parents: [],
        address: {
          street: '',
          city: '',
          country: ''
        },
        contactInfo: {
          email: '',
          phone: ''
        }
      });
    } catch (error) {
      alert('حدث خطأ في إضافة الفرد');
      console.error(error);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else if (name === 'father' || name === 'mother') {
      setFormData(prev => {
        const newParents = [...prev.parents];
        if (name === 'father') {
          newParents[0] = value;
        } else {
          newParents[1] = value;
        }
        return {
          ...prev,
          parents: newParents
        };
      });
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
  };

  const getMaleMembers = () => familyMembers.filter(member => member.gender === 'male');
  const getFemaleMembers = () => familyMembers.filter(member => member.gender === 'female');

  return (
    <div className="add-family-member">
    {loading && <p>جاري التحميل...</p>}
    {error && <p className="error-message">{error}</p>}
    {/* باقي الكود */}
      <h2>إضافة فرد جديد للعائلة</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>الاسم الأول:</label>
          <input
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>اسم الأب:</label>
          <input
            type="text"
            name="middleName"
            value={formData.middleName}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>اسم العائلة:</label>
          <input
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>الأب:</label>
          <select 
            name="father"
            value={formData.parents[0] || ''}
            onChange={handleChange}
          >
            <option value="">اختر الأب</option>
            {getMaleMembers().map(member => (
              <option key={member._id} value={member._id}>
                {`${member.firstName} ${member.middleName} ${member.lastName}`}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>الأم:</label>
          <select 
            name="mother"
            value={formData.parents[1] || ''}
            onChange={handleChange}
          >
            <option value="">اختر الأم</option>
            {getFemaleMembers().map(member => (
              <option key={member._id} value={member._id}>
                {`${member.firstName} ${member.middleName} ${member.lastName}`}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>الجنس:</label>
          <select name="gender" value={formData.gender} onChange={handleChange}>
            <option value="male">ذكر</option>
            <option value="female">أنثى</option>
          </select>
        </div>

        <div className="form-group">
          <label>تاريخ الميلاد:</label>
          <input
            type="date"
            name="birthday"
            value={formData.birthday}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>المهنة:</label>
          <input
            type="text"
            name="profession"
            value={formData.profession}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>
            <input
              type="checkbox"
              name="isDeceased"
              checked={formData.isDeceased}
              onChange={handleChange}
            />
            متوفى
          </label>
        </div>

        <div className="form-group">
          <label>العنوان:</label>
          <input
            type="text"
            name="address.street"
            placeholder="الشارع"
            value={formData.address.street}
            onChange={handleChange}
          />
          <input
            type="text"
            name="address.city"
            placeholder="المدينة"
            value={formData.address.city}
            onChange={handleChange}
          />
          <input
            type="text"
            name="address.country"
            placeholder="البلد"
            value={formData.address.country}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>معلومات الاتصال:</label>
          <input
            type="email"
            name="contactInfo.email"
            placeholder="البريد الإلكتروني"
            value={formData.contactInfo.email}
            onChange={handleChange}
          />
          <input
            type="tel"
            name="contactInfo.phone"
            placeholder="رقم الهاتف"
            value={formData.contactInfo.phone}
            onChange={handleChange}
          />
        </div>

        <button type="submit">إضافة</button>
      </form>
    </div>
  );
};

export default AddFamilyMember;