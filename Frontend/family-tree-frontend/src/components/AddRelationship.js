// AddRelationship.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AddRelationship = () => {
  const [familyMembers, setFamilyMembers] = useState([]);
  const [relationship, setRelationship] = useState({
    person1Id: '',
    person2Id: '',
    relationshipType: 'spouse',
    marriageDate: '',
    isCurrent: true // للزواج
  });

  // جلب جميع أفراد العائلة للاختيار منهم
  useEffect(() => {
    const fetchFamilyMembers = async () => {
      try {
        const response = await axios.get('YOUR_API_URL/family-members');
        setFamilyMembers(response.data);
      } catch (error) {
        console.error('Error fetching family members:', error);
      }
    };

    fetchFamilyMembers();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (relationship.relationshipType === 'spouse') {
        await axios.post('YOUR_API_URL/add-spouse', {
          person1Id: relationship.person1Id,
          person2Id: relationship.person2Id,
          marriageDate: relationship.marriageDate,
          isCurrent: relationship.isCurrent
        });
      } else {
        await axios.post('YOUR_API_URL/add-child', {
          parentId: relationship.person1Id,
          childId: relationship.person2Id
        });
      }
      alert('تمت إضافة العلاقة بنجاح');
      // إعادة تعيين النموذج
      setRelationship({
        person1Id: '',
        person2Id: '',
        relationshipType: 'spouse',
        marriageDate: '',
        isCurrent: true
      });
    } catch (error) {
      alert('حدث خطأ في إضافة العلاقة');
      console.error('Error:', error);
    }
  };

  return (
    <div className="add-relationship">
      <h2>إضافة علاقة عائلية</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>نوع العلاقة:</label>
          <select
            value={relationship.relationshipType}
            onChange={(e) => setRelationship({...relationship, relationshipType: e.target.value})}
          >
            <option value="spouse">زوج/زوجة</option>
            <option value="child">ابن/ابنة</option>
          </select>
        </div>

        <div className="form-group">
          <label>
            {relationship.relationshipType === 'spouse' ? 'الشخص الأول:' : 'الوالد/ة:'}
          </label>
          <select
            value={relationship.person1Id}
            onChange={(e) => setRelationship({...relationship, person1Id: e.target.value})}
          >
            <option value="">اختر شخصاً</option>
            {familyMembers.map(member => (
              <option key={member._id} value={member._id}>
                {`${member.firstName} ${member.middleName} ${member.lastName}`}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>
            {relationship.relationshipType === 'spouse' ? 'الشخص الثاني:' : 'الابن/ة:'}
          </label>
          <select
            value={relationship.person2Id}
            onChange={(e) => setRelationship({...relationship, person2Id: e.target.value})}
          >
            <option value="">اختر شخصاً</option>
            {familyMembers.map(member => (
              <option key={member._id} value={member._id}>
                {`${member.firstName} ${member.middleName} ${member.lastName}`}
              </option>
            ))}
          </select>
        </div>

        {relationship.relationshipType === 'spouse' && (
          <>
            <div className="form-group">
              <label>تاريخ الزواج:</label>
              <input
                type="date"
                value={relationship.marriageDate}
                onChange={(e) => setRelationship({...relationship, marriageDate: e.target.value})}
              />
            </div>

            <div className="form-group">
              <label>
                <input
                  type="checkbox"
                  checked={relationship.isCurrent}
                  onChange={(e) => setRelationship({...relationship, isCurrent: e.target.checked})}
                />
                الزواج حالي
              </label>
            </div>
          </>
        )}

        <button type="submit">إضافة العلاقة</button>
      </form>
    </div>
  );
};

// CSS إضافي
const styles = `
  .add-relationship {
    max-width: 600px;
    margin: 20px auto;
    padding: 20px;
    background-color: #f9f9f9;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  }

  .form-group {
    margin-bottom: 15px;
  }

  select {
    width: 100%;
    padding: 8px;
    border: 1px solid #ddd;
    border-radius: 4px;
    margin-bottom: 10px;
  }

  input[type="date"] {
    width: 100%;
    padding: 8px;
    border: 1px solid #ddd;
    border-radius: 4px;
  }

  input[type="checkbox"] {
    margin-right: 8px;
  }

  button {
    background-color: #4CAF50;
    color: white;
    padding: 10px 20px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    width: 100%;
  }

  button:hover {
    background-color: #45a049;
  }
`;

export default AddRelationship