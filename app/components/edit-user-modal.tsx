import React, { useState } from 'react';
import { User } from '@/app/actions/schemas';

interface EditUserModalProps {
    user: User;
    onSave: (updatedUser: User) => void;
    onClose: () => void;
  }

const EditUserModal: React.FC<EditUserModalProps> = ({ user, onSave, onClose }) => {
    const [formData, setFormData] = useState(user);
  
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
      };
    
      const handleSave = () => {
        onSave(formData); 
      };


      return (
        <div className="modal-container">
          <div className="modal-content">
            <h2 className="text-xl font-semibold mb-4">Edit User</h2>
            <div className="space-y-4">
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Name"
                className="w-full px-4 py-2 border rounded"
              />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email"
                className="w-full px-4 py-2 border rounded"
              />
              <input
                type="text"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                placeholder="Phone Number"
                className="w-full px-4 py-2 border rounded"
              />
            </div>
            <div className="mt-6 flex justify-end gap-4">
              <button
                onClick={onClose}
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-blue-500 text-white hover:bg-blue-600 rounded"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      );
    };
    
    export default EditUserModal;