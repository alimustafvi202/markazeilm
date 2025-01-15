import React from 'react';

const AdminGigList = ({ onEdit }) => {
  const gigs = [
    { id: 1, title: 'Web Development', price: 500, status: 'Pending', user: 'John Doe' },
    { id: 2, title: 'Logo Design', price: 200, status: 'Approved', user: 'Jane Smith' },
  ];

  const handleApprove = (id) => {
    console.log(`Approved gig with ID: ${id}`);
  };

  const handleReject = (id) => {
    console.log(`Rejected gig with ID: ${id}`);
  };

  const handleDelete = (id) => {
    console.log(`Deleted gig with ID: ${id}`);
  };

  return (
    <div className="bg-white rounded shadow-md p-4">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-gray-200">
            <th className="px-4 py-2">Gig Title</th>
            <th className="px-4 py-2">Posted By</th>
            <th className="px-4 py-2">Price</th>
            <th className="px-4 py-2">Status</th>
            <th className="px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {gigs.map((gig) => (
            <tr key={gig.id} className="border-t">
              <td className="px-4 py-2">{gig.title}</td>
              <td className="px-4 py-2">{gig.user}</td>
              <td className="px-4 py-2">${gig.price}</td>
              <td className="px-4 py-2">
                <span
                  className={`px-2 py-1 rounded text-white ${
                    gig.status === 'Approved'
                      ? 'bg-green-500'
                      : gig.status === 'Rejected'
                      ? 'bg-red-500'
                      : 'bg-yellow-500'
                  }`}
                >
                  {gig.status}
                </span>
              </td>
              <td className="px-4 py-2 flex space-x-2">
                <button
                  className="px-2 py-1 bg-green-500 text-white rounded"
                  onClick={() => handleApprove(gig.id)}
                >
                  Approve
                </button>
                <button
                  className="px-2 py-1 bg-red-500 text-white rounded"
                  onClick={() => handleReject(gig.id)}
                >
                  Reject
                </button>
                <button
                  className="px-2 py-1 bg-blue-500 text-white rounded"
                  onClick={() => onEdit(gig)}
                >
                  Edit
                </button>
                <button
                  className="px-2 py-1 bg-gray-500 text-white rounded"
                  onClick={() => handleDelete(gig.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminGigList;
