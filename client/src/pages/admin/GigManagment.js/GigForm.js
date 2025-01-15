import React, { useState } from 'react';

const GigForm = ({ gig, onClose }) => {
  const [formData, setFormData] = useState(
    gig || { title: '', price: '', status: 'Pending' }
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Submitted:', formData);
    onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block font-semibold mb-1">Title</label>
        <input
          type="text"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          className="w-full border px-3 py-2 rounded"
        />
      </div>
      <div>
        <label className="block font-semibold mb-1">Price</label>
        <input
          type="number"
          value={formData.price}
          onChange={(e) => setFormData({ ...formData, price: e.target.value })}
          className="w-full border px-3 py-2 rounded"
        />
      </div>
      <div>
        <label className="block font-semibold mb-1">Status</label>
        <select
          value={formData.status}
          onChange={(e) => setFormData({ ...formData, status: e.target.value })}
          className="w-full border px-3 py-2 rounded"
        >
          <option value="Pending">Pending</option>
          <option value="Approved">Approved</option>
          <option value="Rejected">Rejected</option>
        </select>
      </div>
      <button
        type="submit"
        className="bg-blue-500 text-white px-4 py-2 rounded w-full"
      >
        Save Changes
      </button>
    </form>
  );
};

export default GigForm;
