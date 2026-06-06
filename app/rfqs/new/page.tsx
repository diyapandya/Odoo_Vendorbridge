export default function NewRfqPage() {
  return (
    <div className="p-8 max-w-2xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-slate-900">Create Request for Quotation</h1>
      <form className="space-y-4 bg-white p-6 border rounded-lg shadow-sm">
        <div>
          <label className="block text-sm font-medium text-slate-700">RFQ Title</label>
          <input type="text" name="title" required className="mt-1 w-full px-3 py-2 border rounded-md" />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700">Product / Service Details</label>
          <textarea name="description" required className="mt-1 w-full px-3 py-2 border rounded-md" rows={3}></textarea>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700">Quantity</label>
            <input type="number" name="quantity" required className="mt-1 w-full px-3 py-2 border rounded-md" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700">Submission Deadline</label>
            <input type="date" name="deadline" required className="mt-1 w-full px-3 py-2 border rounded-md" />
          </div>
        </div>
        <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded-md">Submit RFQ</button>
      </form>
    </div>
  );
}