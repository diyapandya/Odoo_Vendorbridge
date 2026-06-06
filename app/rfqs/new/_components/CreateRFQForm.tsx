"use client";

import { useState } from "react";
import { createRFQAction, updateRFQAction } from "../../actions";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface Vendor {
  id: string;
  companyName: string;
}

interface RFQInitialData {
  id?: string;
  title?: string;
  category?: string;
  deadline?: string;
  description?: string;
  status?: string;
  lineItems?: { item: string; qty: number; unit: string }[];
  vendors?: { id: string; companyName: string }[];
}

export function CreateRFQForm({ vendors, initialData }: { vendors: Vendor[], initialData?: RFQInitialData }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [step, setStep] = useState(1);

  // Form State
  const [title, setTitle] = useState(initialData?.title || "");
  const [category, setCategory] = useState(initialData?.category || "General");
  const [deadline, setDeadline] = useState(initialData?.deadline ? new Date(initialData.deadline).toISOString().split('T')[0] : "");
  const [description, setDescription] = useState(initialData?.description || "");

  const [lineItems, setLineItems] = useState<{ item: string; qty: number; unit: string }[]>(
    initialData?.lineItems?.map(li => ({ item: li.item, qty: li.qty, unit: li.unit })) || []
  );
  
  const [assignedVendors, setAssignedVendors] = useState<Vendor[]>(
    initialData?.vendors || []
  );

  const [file, setFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

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

  const handleNext = () => {
    if (step === 1) {
      if (!title || !deadline || lineItems.length === 0) {
        setError("Please fill out Title, Deadline, and add at least one line item before proceeding.");
        return;
      }
    }
    setError(null);
    setStep(step + 1);
  };

  const handleBack = () => {
    setStep(step - 1);
    setError(null);
  };

  const handleSubmit = async (status: string) => {
    if (!title || !deadline || lineItems.length === 0) {
      setError("Please fill out all required fields and add at least one line item.");
      return;
    }

    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append("title", title);
    formData.append("category", category);
    formData.append("deadline", deadline);
    formData.append("description", description);
    formData.append("status", status);
    formData.append("lineItems", JSON.stringify(lineItems));
    formData.append("vendorIds", JSON.stringify(assignedVendors.map(v => v.id)));
    if (file) {
      formData.append("attachment", file);
    }

    let res;
    if (initialData?.id) {
      res = await updateRFQAction(initialData.id, formData);
    } else {
      res = await createRFQAction(formData);
    }
    
    if (res.error) {
      setError(res.error);
      setLoading(false);
    } else {
      router.push("/rfqs");
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-8 font-sans">
      <Link href="/rfqs" className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-indigo-600 mb-6 transition-colors">
        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
        Back to RFQs
      </Link>

      <div className="mb-8">
        <h1 className="text-3xl font-medium text-slate-800 tracking-tight">{initialData?.id ? "Edit RFQ Draft" : "Create RFQ's"}</h1>
        <p className="text-slate-500 mt-1">new request for quotation</p>
      </div>

      {/* Stepper */}
      <div className="flex items-center w-full mb-12">
        <div className="flex items-center relative">
          <div className={`rounded-full h-10 w-10 flex items-center justify-center border-2 font-semibold z-10 transition-colors ${step >= 1 ? 'border-indigo-600 bg-indigo-50 text-indigo-600' : 'border-slate-300 bg-white text-slate-400'}`}>1</div>
        </div>
        <div className={`flex-auto border-t-2 transition duration-500 ease-in-out mx-2 ${step >= 2 ? 'border-indigo-600' : 'border-slate-200'}`}></div>
        <div className="flex items-center relative">
          <div className={`rounded-full h-10 w-10 flex items-center justify-center border-2 font-semibold z-10 transition-colors ${step >= 2 ? 'border-indigo-600 bg-indigo-50 text-indigo-600' : 'border-slate-300 bg-white text-slate-400'}`}>2</div>
        </div>
        <div className={`flex-auto border-t-2 transition duration-500 ease-in-out mx-2 ${step >= 3 ? 'border-indigo-600' : 'border-slate-200'}`}></div>
        <div className="flex items-center relative">
          <div className={`rounded-full h-10 w-10 flex items-center justify-center border-2 font-semibold z-10 transition-colors ${step >= 3 ? 'border-indigo-600 bg-indigo-50 text-indigo-600' : 'border-slate-300 bg-white text-slate-400'}`}>3</div>
        </div>
      </div>

      {error && <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-md border border-red-200">{error}</div>}

      {/* Step 1: Basic Details & Line Items */}
      {step === 1 && (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
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
          </div>
          <div className="flex justify-end pt-6 border-t border-slate-200">
            <button onClick={handleNext} className="px-8 py-3 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors shadow-sm">Next Step</button>
          </div>
        </div>
      )}

      {/* Step 2: Assign Vendors */}
      {step === 2 && (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div>
            <label className="block text-sm font-medium text-slate-500 uppercase tracking-wider mb-2">ASSIGN VENDORS</label>
            <div className="border border-slate-300 rounded-lg overflow-hidden bg-white max-w-2xl">
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
              
              <div className="border-t border-slate-200 bg-slate-50">
                <select 
                  className="w-full px-4 py-4 text-sm text-slate-700 bg-transparent focus:outline-none focus:ring-0 cursor-pointer appearance-none font-medium"
                  onChange={handleAddVendor}
                  value=""
                >
                  <option value="" disabled>+ click here to assign a vendor</option>
                  {vendors.filter(v => !assignedVendors.some(av => av.id === v.id)).map(v => (
                    <option key={v.id} value={v.id}>{v.companyName}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
          <div className="flex justify-between pt-6 border-t border-slate-200">
            <button onClick={handleBack} className="px-8 py-3 bg-white border border-slate-300 text-slate-700 font-medium rounded-lg hover:bg-slate-50 transition-colors shadow-sm">Back</button>
            <button onClick={handleNext} className="px-8 py-3 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors shadow-sm">Next Step</button>
          </div>
        </div>
      )}

      {/* Step 3: Attachments & Submit */}
      {step === 3 && (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="w-full max-w-2xl">
            <label className="block text-sm font-medium text-slate-700 mb-2">Attachments</label>
            <div className="border-2 border-dashed border-slate-300 rounded-xl p-16 flex flex-col items-center justify-center bg-slate-50 hover:bg-slate-100 transition-colors relative">
              <input 
                type="file" 
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
                onChange={handleFileChange}
              />
              <span className="text-sm font-medium text-slate-500 group-hover:text-slate-700">
                {file ? file.name : "Drag & drop files or click to upload"}
              </span>
            </div>
          </div>
          
          <div className="flex justify-between pt-6 border-t border-slate-200">
            <button onClick={handleBack} className="px-8 py-3 bg-white border border-slate-300 text-slate-700 font-medium rounded-lg hover:bg-slate-50 transition-colors shadow-sm">Back</button>
            <div className="flex gap-4">
              <button 
                onClick={() => handleSubmit("Draft")}
                disabled={loading}
                className="px-6 py-3 bg-white border border-slate-300 text-slate-600 font-medium rounded-lg hover:bg-slate-50 transition-colors shadow-sm disabled:opacity-50"
              >
                Save as Draft
              </button>
              <button 
                onClick={() => handleSubmit("Open")}
                disabled={loading}
                className="px-6 py-3 bg-white border-2 border-slate-800 text-slate-800 font-medium rounded-lg hover:bg-slate-50 transition-colors shadow-sm disabled:opacity-50"
              >
                {loading ? "Saving..." : "Save & Send to Vendors"}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
