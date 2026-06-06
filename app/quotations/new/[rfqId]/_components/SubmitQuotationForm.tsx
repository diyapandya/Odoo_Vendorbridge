"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { submitQuotationAction } from "../../../actions";

interface RFQLineItem {
  id: string;
  item: string;
  qty: number;
  unit: string;
}

interface RFQData {
  id: string;
  title: string;
  category: string;
  deadline: string;
  lineItems: RFQLineItem[];
}

export function SubmitQuotationForm({ rfq, vendorId }: { rfq: RFQData, vendorId: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Initialize state for each line item
  const [itemsData, setItemsData] = useState<Record<string, { unitPrice: number; deliveryETA: number }>>(() => {
    const initial: Record<string, { unitPrice: number; deliveryETA: number }> = {};
    rfq.lineItems.forEach(item => {
      initial[item.id] = { unitPrice: 0, deliveryETA: 7 }; // Default 7 days
    });
    return initial;
  });

  const [taxPercent, setTaxPercent] = useState<number>(18);
  const [terms, setTerms] = useState<string>("Payment terms: 20 days net...");

  const handleItemChange = (id: string, field: 'unitPrice' | 'deliveryETA', value: string) => {
    const numValue = parseFloat(value) || 0;
    setItemsData(prev => ({
      ...prev,
      [id]: {
        ...prev[id],
        [field]: numValue
      }
    }));
  };

  // Calculations
  const calculations = useMemo(() => {
    let subtotal = 0;
    const lineItemTotals: Record<string, number> = {};

    rfq.lineItems.forEach(item => {
      const data = itemsData[item.id];
      const total = data.unitPrice * item.qty;
      lineItemTotals[item.id] = total;
      subtotal += total;
    });

    const taxAmount = (subtotal * taxPercent) / 100;
    const grandTotal = subtotal + taxAmount;

    return {
      subtotal,
      taxAmount,
      grandTotal,
      lineItemTotals
    };
  }, [itemsData, rfq.lineItems, taxPercent]);

  const handleSubmit = async (status: string) => {
    setLoading(true);
    setError(null);

    const lineItemsPayload = rfq.lineItems.map(item => ({
      rfqItemId: item.id,
      unitPrice: itemsData[item.id].unitPrice,
      totalPrice: calculations.lineItemTotals[item.id],
      deliveryETA: itemsData[item.id].deliveryETA
    }));

    const payload = {
      rfqId: rfq.id,
      vendorId, // Normally extracted securely from session in the server action
      subtotal: calculations.subtotal,
      taxPercent: taxPercent,
      totalAmount: calculations.grandTotal,
      terms,
      status,
      lineItems: lineItemsPayload
    };

    const res = await submitQuotationAction(payload);
    
    if (res.error) {
      setError(res.error);
      setLoading(false);
    } else {
      router.push("/quotations");
    }
  };

  return (
    <div className="max-w-5xl mx-auto font-sans">
      <div className="mb-6">
        <h1 className="text-3xl font-medium text-slate-800">Submit Quotations</h1>
        <p className="text-slate-600 mt-2 text-lg">
          RFQ: {rfq.title} - deadline {new Date(rfq.deadline).toLocaleDateString(undefined, { day: 'numeric', month: 'long', year: 'numeric' })}
        </p>
      </div>

      <div className="border border-slate-300 rounded-xl p-4 mb-8 bg-white shadow-sm">
        <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">RFQ Summary</h3>
        <p className="text-sm text-slate-700">
          {rfq.lineItems.map(li => `${li.item} * ${li.qty}`).join(', ')} - category {rfq.category}
        </p>
      </div>

      {error && <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-md border border-red-200">{error}</div>}

      <div className="mb-8">
        <h3 className="text-sm font-medium text-slate-700 mb-3">Your Quotation</h3>
        <div className="border border-slate-300 rounded-xl overflow-hidden bg-white shadow-sm">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50">
                <th className="px-6 py-4 font-semibold text-slate-700">Item</th>
                <th className="px-6 py-4 font-semibold text-slate-700">Qty</th>
                <th className="px-6 py-4 font-semibold text-slate-700">Unit price</th>
                <th className="px-6 py-4 font-semibold text-slate-700">Total</th>
                <th className="px-6 py-4 font-semibold text-slate-700">Delivery (days)</th>
              </tr>
            </thead>
            <tbody>
              {rfq.lineItems.map((item, idx) => (
                <tr key={item.id} className="border-b border-slate-100 last:border-0 hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 text-slate-800">{item.item}</td>
                  <td className="px-6 py-4 text-slate-600">{item.qty}</td>
                  <td className="px-6 py-4">
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">$</span>
                      <input 
                        type="number" 
                        min="0"
                        className="w-32 pl-7 pr-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                        value={itemsData[item.id].unitPrice || ''}
                        onChange={(e) => handleItemChange(item.id, 'unitPrice', e.target.value)}
                        placeholder="0.00"
                      />
                    </div>
                  </td>
                  <td className="px-6 py-4 font-medium text-slate-800">
                    ${calculations.lineItemTotals[item.id].toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </td>
                  <td className="px-6 py-4">
                    <input 
                      type="number" 
                      min="1"
                      className="w-24 px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                      value={itemsData[item.id].deliveryETA || ''}
                      onChange={(e) => handleItemChange(item.id, 'deliveryETA', e.target.value)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">tax / GST %</label>
            <div className="relative w-48">
              <input 
                type="number" 
                className="w-full pl-3 pr-8 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                value={taxPercent}
                onChange={(e) => setTaxPercent(parseFloat(e.target.value) || 0)}
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">%</span>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Note / terms</label>
            <textarea 
              rows={4}
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-none"
              value={terms}
              onChange={(e) => setTerms(e.target.value)}
            ></textarea>
          </div>
        </div>

        <div className="flex flex-col justify-end">
          <div className="border border-slate-300 rounded-xl p-6 bg-white shadow-sm space-y-4">
            <div className="flex justify-between text-sm">
              <span className="text-slate-600">Subtotal</span>
              <span className="font-medium text-slate-800">${calculations.subtotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-600">GST ({taxPercent}%)</span>
              <span className="font-medium text-slate-800">${calculations.taxAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
            </div>
            <div className="pt-4 border-t border-slate-200 flex justify-between items-center">
              <span className="font-semibold text-slate-900">Grand total</span>
              <span className="text-xl font-bold text-slate-900">${calculations.grandTotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex gap-4 border-t border-slate-200 pt-8">
        <button 
          onClick={() => handleSubmit("Submitted")}
          disabled={loading}
          className="px-8 py-3 bg-white border-2 border-slate-800 text-slate-800 font-medium rounded-lg hover:bg-slate-50 transition-colors shadow-sm disabled:opacity-50"
        >
          {loading ? "Submitting..." : "Submit Quotation"}
        </button>
        <button 
          onClick={() => handleSubmit("Draft")}
          disabled={loading}
          className="px-8 py-3 bg-white border border-slate-300 text-slate-600 font-medium rounded-lg hover:bg-slate-50 transition-colors shadow-sm disabled:opacity-50"
        >
          Save Draft
        </button>
      </div>

    </div>
  );
}
