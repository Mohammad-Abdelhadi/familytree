import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api/family';

export const fetchFamilyMembers = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching family members:', error);
    throw error;
  }
};

export const fetchFamilyTree = async (id) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/${id}/tree`);
    return response.data;
  } catch (error) {
    console.error('Error fetching family tree:', error);
    throw error;
  }
};

// إضافة عضو جديد للعائلة
export const addFamilyMember = async (memberData) => {
  try {
    const response = await axios.post(API_BASE_URL, memberData);
    return response.data;
  } catch (error) {
    console.error('Error adding family member:', error);
    throw error;
  }
};