"use client";

import { useState } from "react";
import { Modal } from "@/components/ui/modal";
import { addVendorAction, updateVendorStatusAction } from "../actions";

interface Vendor {
  id: string;
  companyName: string;
  category: string;
  gstNumber: string;
  email: string;
  phone: string;
  status: string;
}

export function VendorClient({ initialVendors }: { initialVendors: Vendor[] }) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formCategory, setFormCategory] = useState("Hardware & Electronics");
  const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null);
  const [error, setError] = useState<string | null>(null);

  const STANDARD_CATEGORIES = [
    "Hardware & Electronics",
    "Software & IT Services",
    "Office Supplies",
    "Logistics & Transportation",
  ];

  const handleAddVendor = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    
    // If "Other" is selected, use the custom category value
    if (formCategory === "Other") {
      const customCat = formData.get("customCategory");
      if (customCat) {
        formData.set("category", customCat as string);
      }
    }
    
    const res = await addVendorAction(formData);
    setLoading(false);

    if (res.error) {
      setError(res.error);
    } else {
      setIsModalOpen(false);
      setFormCategory("Hardware & Electronics"); // Reset
      setError(null);
    }
  };

  const filteredVendors = initialVendors.filter((vendor) => {
    const searchLower = search.toLowerCase();
    const matchesSearch =
      vendor.companyName.toLowerCase().includes(searchLower) ||
      vendor.email.toLowerCase().includes(searchLower) ||
      vendor.category.toLowerCase().includes(searchLower) ||
      vendor.gstNumber.toLowerCase().includes(searchLower);
      
    const matchesStatus =
      statusFilter === "All" || vendor.status === statusFilter;
      
    const matchesCategory =
      categoryFilter === "All" ||
      vendor.category === categoryFilter ||
      (categoryFilter === "Other" && !STANDARD_CATEGORIES.includes(vendor.category));

    return matchesSearch && matchesStatus && matchesCategory;
  });

  return (
    <div className="p-8 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-slate-900">Vendor Management</h1>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
        >
          Add Vendor
        </button>
      </div>
      
      {/* Table & Filters */}
      <div className="bg-white rounded-lg border border-slate-100 p-6 shadow-sm">
        <div className="flex flex-wrap gap-4 mb-4">
          <input 
            type="text" 
            placeholder="Search vendors..." 
            className="px-3 py-2 border border-slate-300 rounded-md w-72 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <select 
            className="px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="All">All Statuses</option>
            <option value="Active">Active</option>
            <option value="Suspended">Suspended</option>
            <option value="Inactive">Inactive</option>
          </select>
          <select 
            className="px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            <option value="All">All Categories</option>
            {STANDARD_CATEGORIES.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
            <option value="Other">Other</option>
          </select>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-700">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="pb-3 font-semibold text-slate-900">Name</th>
                <th className="pb-3 font-semibold text-slate-900">Category</th>
                <th className="pb-3 font-semibold text-slate-900">GST Number</th>
                <th className="pb-3 font-semibold text-slate-900">Contact</th>
                <th className="pb-3 font-semibold text-slate-900">Status</th>
                <th className="pb-3 font-semibold text-slate-900 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredVendors.length > 0 ? (
                filteredVendors.map((vendor) => (
                  <tr key={vendor.id} className="border-b border-slate-50 last:border-0 hover:bg-slate-50 transition-colors">
                    <td className="py-3 font-medium text-slate-900">{vendor.companyName}</td>
                    <td>{vendor.category}</td>
                    <td>{vendor.gstNumber}</td>
                    <td>
                      <div className="flex flex-col">
                        <span>{vendor.email}</span>
                        <span className="text-xs text-slate-500">{vendor.phone}</span>
                      </div>
                    </td>
                    <td>
                      <span className={`px-2 py-1 text-xs rounded-full font-medium ${
                        vendor.status === 'Active' ? 'bg-green-100 text-green-800' :
                        vendor.status === 'Suspended' ? 'bg-red-100 text-red-800' :
                        'bg-slate-100 text-slate-800'
                      }`}>
                        {vendor.status}
                      </span>
                    </td>
                    <td className="text-right">
                      <button 
                        onClick={() => setSelectedVendor(vendor)}
                        className="text-indigo-600 hover:text-indigo-900 text-sm font-medium"
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-500">
                    No vendors found matching your criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Vendor Modal */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={() => {
          setIsModalOpen(false);
          setError(null);
        }} 
        title="Add New Vendor"
      >
        <form onSubmit={handleAddVendor} className="space-y-4">
          {error && <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-md text-sm">{error}</div>}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Company Name</label>
            <input name="companyName" required className="w-full px-3 py-2 border rounded-md" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
            <input name="email" type="email" required className="w-full px-3 py-2 border rounded-md" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Phone</label>
            <input name="phone" type="tel" required className="w-full px-3 py-2 border rounded-md" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">GST Number</label>
            <input name="gstNumber" required className="w-full px-3 py-2 border rounded-md" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Category</label>
            <select 
              name="category" 
              required 
              className="w-full px-3 py-2 border rounded-md bg-white"
              value={formCategory}
              onChange={(e) => setFormCategory(e.target.value)}
            >
              {STANDARD_CATEGORIES.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
              <option value="Other">Other</option>
            </select>
          </div>
          {formCategory === "Other" && (
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Specify Category</label>
              <input name="customCategory" required className="w-full px-3 py-2 border rounded-md" placeholder="e.g. Catering" />
            </div>
          )}
          <div className="pt-4 flex justify-end gap-3">
            <button 
              type="button" 
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 border rounded-md text-slate-600 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              disabled={loading}
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50"
            >
              {loading ? "Adding..." : "Add Vendor"}
            </button>
          </div>
        </form>
      </Modal>

      {/* Slide-over Panel for Vendor Details */}
      {selectedVendor && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <div className="absolute inset-0 bg-black/30 transition-opacity" onClick={() => setSelectedVendor(null)} />
          <div className="fixed inset-y-0 right-0 max-w-md w-full flex shadow-2xl animate-in slide-in-from-right duration-300">
            <div className="w-full h-full bg-white flex flex-col">
              <div className="px-6 py-4 border-b border-slate-200 flex justify-between items-center bg-slate-50">
                <h2 className="text-xl font-bold text-slate-800">Vendor Details</h2>
                <button onClick={() => setSelectedVendor(null)} className="text-slate-400 hover:text-slate-600 bg-white rounded-full p-1 shadow-sm">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                </button>
              </div>
              <div className="p-6 flex-1 overflow-y-auto space-y-8">
                
                {/* Company Info */}
                <div>
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Company Info</h3>
                  <div className="space-y-4 bg-slate-50/50 p-5 rounded-xl border border-slate-100">
                    <div>
                      <p className="text-xs text-slate-500 mb-1">Company Name</p>
                      <p className="font-semibold text-slate-900">{selectedVendor.companyName}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 mb-1">Category</p>
                      <span className="inline-block px-2.5 py-1 bg-indigo-50 text-indigo-700 text-xs rounded-full font-medium border border-indigo-100">{selectedVendor.category}</span>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 mb-1">GST Number</p>
                      <p className="font-medium text-slate-700 font-mono text-sm">{selectedVendor.gstNumber}</p>
                    </div>
                  </div>
                </div>
                
                {/* Contact Info */}
                <div>
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Contact Info</h3>
                  <div className="space-y-4 bg-slate-50/50 p-5 rounded-xl border border-slate-100">
                    <div>
                      <p className="text-xs text-slate-500 mb-1">Email Address</p>
                      <a href={`mailto:${selectedVendor.email}`} className="font-medium text-indigo-600 hover:underline">{selectedVendor.email}</a>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 mb-1">Phone Number</p>
                      <p className="font-medium text-slate-700">{selectedVendor.phone}</p>
                    </div>
                  </div>
                </div>
                
                {/* Manage Status */}
                <div>
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Manage Status</h3>
                  <div className="bg-slate-50/50 p-5 rounded-xl border border-slate-100">
                    <label className="block text-sm font-medium text-slate-700 mb-2">Current Status</label>
                    <select 
                      className="w-full px-4 py-2.5 border border-slate-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm transition-shadow font-medium text-slate-700"
                      value={selectedVendor.status}
                      onChange={async (e) => {
                        const newStatus = e.target.value;
                        // Update UI optimistically
                        setSelectedVendor({...selectedVendor, status: newStatus});
                        // Send server action
                        await updateVendorStatusAction(selectedVendor.id, newStatus);
                      }}
                    >
                      <option value="Active">🟢 Active</option>
                      <option value="Inactive">⚪ Inactive</option>
                      <option value="Suspended">🔴 Suspended</option>
                    </select>
                    <p className="mt-2 text-xs text-slate-500">
                      Changing the status will immediately update the vendor's access and visibility across the platform.
                    </p>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
