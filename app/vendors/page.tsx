export default function VendorsPage() {
  return (
    <div className="p-8 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-slate-900">Vendor Management</h1>
        <button className="px-4 py-2 bg-indigo-600 text-white rounded-md">Add Vendor</button>
      </div>
      
      {/* Table */}
      <div className="bg-white rounded-lg border border-slate-100 p-6">
        <input type="text" placeholder="Search vendors..." className="mb-4 px-3 py-2 border rounded-md w-72 text-sm" />
        
        <table className="w-full text-left text-sm text-slate-700">
          <thead>
            <tr className="border-b">
              <th className="pb-3">Name</th>
              <th className="pb-3">Category</th>
              <th className="pb-3">GST Number</th>
              <th className="pb-3">Contact</th>
              <th className="pb-3">Status</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="py-3 font-medium text-slate-900">Globex Corp</td>
              <td>Logistics & Raw Materials</td>
              <td>GST-9928192A</td>
              <td>contact@globex.com</td>
              <td><span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">Active</span></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}