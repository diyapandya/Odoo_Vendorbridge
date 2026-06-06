"use client";

import { useState } from "react";
import { createRFQAction } from "../../actions";
import { useRouter } from "next/navigation";

interface Vendor {
  id: string;
  companyName: string;
}

export function CreateRFQForm({ vendors }: { vendors: Vendor[] }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form State
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("General");
  const [deadline, setDeadline] = useState("");
  const [description, setDescription] = useState("");

  const [lineItems, setLineItems] = useState<{ item: string; qty: number; unit: string }[]>([]);
  const [assignedVendors, setAssignedVendors] = useState<Vendor[]>([]);

  const handleAddLineItem = () => {
    setLineItems([...lineItems, { item: "", qty: 1, unit: "NOS" }]);
  };

  const handleRemoveLineItem = (index: number) => {
    const newItems = [...lineItems];
    newItems.splice(index, 1);
    setLineItems(newItems);
  };

  const handleLineItemChange = (index: number, field: string, value: string | number) => {
    const newItems = [...lineItems];
    (newItems[index] as any)[field] = value;
    setLineItems(newItems);
  };

  const handleAddVendor = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const vendorId = e.target.value;
    if (!vendorId) return;
    
    const vendor = vendors.find(v => v.id === vendorId);
    if (vendor && !assignedVendors.some(v => v.id === vendorId)) {
      setAssignedVendors([...assignedVendors, vendor]);
    }
    // reset select
    e.target.value = "";
  };

  const handleRemoveVendor = (id: string) => {
    setAssignedVendors(assignedVendors.filter(v => v.id !== id));
  };

  const handleSubmit = async (status: string) => {
    if (!title || !deadline || lineItems.length === 0) {
      setError("Please fill out all required fields and add at least one line item.");
      return;
    }

    setLoading(true);
    setError(null);

    const payload = {
      title,
      category,
      deadline,
      description,
      status, // "Open" (Save & Send) or "Draft"
      lineItems,
      vendorIds: assignedVendors.map(v => v.id)
    };

    const res = await createRFQAction(payload);
    
    if (res.error) {
      setError(res.error);
      setLoading(false);
    } else {
      router.push("/rfqs");
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-8 font-sans">
      <div className="mb-8">
        <h1 className="text-3xl font-medium text-slate-800 tracking-tight">Create RFQ's</h1>
        <p className="text-slate-500 mt-1">new request for quotation</p>
      </div>

      {/* Stepper mockup */}
      <div className="flex items-center w-full max-w-3xl mb-12">
        <div className="flex items-center text-indigo-600 relative">
          <div className="rounded-full h-10 w-10 flex items-center justify-center border-2 border-indigo-600 bg-indigo-50 font-semibold z-10">1</div>
        </div>
        <div className="flex-auto border-t-2 transition duration-500 ease-in-out border-slate-200 mx-2"></div>
        <div className="flex items-center text-slate-400 relative">
          <div className="rounded-full h-10 w-10 flex items-center justify-center border-2 border-slate-300 bg-white font-semibold z-10">2</div>
        </div>
        <div className="flex-auto border-t-2 transition duration-500 ease-in-out border-slate-200 mx-2"></div>
        <div className="flex items-center text-slate-400 relative">
          <div className="rounded-full h-10 w-10 flex items-center justify-center border-2 border-slate-300 bg-white font-semibold z-10">3</div>
        </div>
      </div>

      {error && <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-md border border-red-200">{error}</div>}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        
        {/* Left Column */}
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">RFQ's title*</label>
            <input 
              type="text" 
              placeholder="e.g. Office Furniture procurement Q2"
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-shadow"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Category</label>
            <input 
              type="text" 
              placeholder="e.g. Furniture"
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-shadow"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Deadline*</label>
            <input 
              type="date" 
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-shadow bg-white"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
            <textarea 
              placeholder="e.g. Ergonomic chairs and standing desks for 3rd floor"
              rows={4}
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-shadow resize-none"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            ></textarea>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-8">
          
          {/* Line Items */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Line items</label>
            <div className="border border-slate-300 rounded-lg overflow-hidden bg-white">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50">
                    <th className="px-4 py-3 font-medium text-slate-600">item</th>
                    <th className="px-4 py-3 font-medium text-slate-600 w-24">qty</th>
                    <th className="px-4 py-3 font-medium text-slate-600 w-24">Unit</th>
                    <th className="px-4 py-3 w-10"></th>
                  </tr>
                </thead>
                <tbody>
                  {lineItems.map((line, idx) => (
                    <tr key={idx} className="border-b border-slate-100 last:border-0 hover:bg-slate-50 transition-colors">
                      <td className="px-4 py-2">
                        <input 
                          type="text" 
                          placeholder="e.g. Ergonomic chair"
                          className="w-full bg-transparent border-none focus:ring-0 p-0 text-sm"
                          value={line.item}
                          onChange={(e) => handleLineItemChange(idx, 'item', e.target.value)}
                        />
                      </td>
                      <td className="px-4 py-2">
                        <input 
                          type="number" 
                          min="1"
                          className="w-full bg-transparent border-none focus:ring-0 p-0 text-sm"
                          value={line.qty}
                          onChange={(e) => handleLineItemChange(idx, 'qty', parseInt(e.target.value) || 0)}
                        />
                      </td>
                      <td className="px-4 py-2">
                        <input 
                          type="text" 
                          placeholder="NOS"
                          className="w-full bg-transparent border-none focus:ring-0 p-0 text-sm"
                          value={line.unit}
                          onChange={(e) => handleLineItemChange(idx, 'unit', e.target.value)}
                        />
                      </td>
                      <td className="px-4 py-2 text-center">
                        <button onClick={() => handleRemoveLineItem(idx)} className="text-slate-400 hover:text-red-500 font-bold">×</button>
                      </td>
                    </tr>
                  ))}
                  {lineItems.length === 0 && (
                    <tr>
                      <td colSpan={4} className="px-4 py-6 text-center text-slate-400 text-sm">No items added yet.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            <button 
              onClick={handleAddLineItem}
              className="mt-3 px-4 py-2 border border-slate-300 rounded-md text-sm font-medium text-slate-700 hover:bg-slate-50 flex items-center transition-colors"
            >
              + add line item
            </button>
          </div>

          {/* Assign Vendors */}
          <div>
            <label className="block text-sm font-medium text-slate-500 uppercase tracking-wider mb-2">ASSIGN VENDORS</label>
            <div className="border border-slate-300 rounded-lg overflow-hidden bg-white">
              {assignedVendors.length > 0 ? (
                <ul className="divide-y divide-slate-100">
                  {assignedVendors.map(v => (
                    <li key={v.id} className="px-4 py-3 flex justify-between items-center hover:bg-slate-50 transition-colors">
                      <span className="text-sm font-medium text-slate-800">{v.companyName}</span>
                      <button onClick={() => handleRemoveVendor(v.id)} className="text-slate-400 hover:text-red-500 font-bold">×</button>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="px-4 py-6 text-center text-slate-400 text-sm">No vendors assigned yet.</div>
              )}
              
              <div className="border-t border-slate-200">
                <select 
                  className="w-full px-4 py-3 text-sm text-slate-700 bg-transparent focus:outline-none focus:ring-0 cursor-pointer appearance-none"
                  onChange={handleAddVendor}
                  defaultValue=""
                >
                  <option value="" disabled>+ add vendor</option>
                  {vendors.filter(v => !assignedVendors.some(av => av.id === v.id)).map(v => (
                    <option key={v.id} value={v.id}>{v.companyName}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

        </div>
      </div>

      <div className="my-10 border-t border-slate-200"></div>

      {/* Attachments & Actions */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-8">
        
        {/* Actions */}
        <div className="flex flex-col gap-3 order-2 lg:order-1 w-full lg:w-auto">
          <button 
            onClick={() => handleSubmit("Open")}
            disabled={loading}
            className="px-6 py-3 bg-white border-2 border-slate-800 text-slate-800 font-medium rounded-lg hover:bg-slate-50 transition-colors w-full lg:w-auto text-center shadow-sm disabled:opacity-50"
          >
            {loading ? "Saving..." : "Save & Send to Vendors"}
          </button>
          <button 
            onClick={() => handleSubmit("Draft")}
            disabled={loading}
            className="px-6 py-3 bg-white border border-slate-300 text-slate-600 font-medium rounded-lg hover:bg-slate-50 transition-colors w-full lg:w-auto text-center shadow-sm disabled:opacity-50"
          >
            Save as Draft
          </button>
        </div>

        {/* Attachments */}
        <div className="w-full lg:w-[32rem] order-1 lg:order-2">
          <label className="block text-sm font-medium text-slate-700 mb-2">Attachments</label>
          <div className="border-2 border-dashed border-slate-300 rounded-xl p-10 flex items-center justify-center bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer group">
            <span className="text-sm text-slate-500 group-hover:text-slate-700">Drag & drop files or click to upload</span>
          </div>
        </div>

      </div>

    </div>
  );
}
