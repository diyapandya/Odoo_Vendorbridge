import * as React from 'react';

export function Table({ headers, children }: { headers: string[]; children: React.ReactNode }) {
  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b font-medium text-slate-500">
            {headers.map((h, i) => <th key={i} className="pb-3">{h}</th>)}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {children}
        </tbody>
      </table>
    </div>
  );
}