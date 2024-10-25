import React, { useEffect, useState } from 'react';
import { fetchFamilyMembers } from '../api';
import FamilyTree from './FamilyTree';
import './FamilyMembers.css';

const FamilyMembers = () => {
  const [familyMembers, setFamilyMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getFamilyMembers = async () => {
      try {
        const members = await fetchFamilyMembers();
        setFamilyMembers(members);
      } catch (err) {
        setError('Failed to fetch family members. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    console.log("Family Members:", familyMembers);

    getFamilyMembers();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="family-members">
      <FamilyTree familyMembers={familyMembers} />
    </div>
  );
};

export default FamilyMembers;