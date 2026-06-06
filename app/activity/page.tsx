import { ActivityService } from "@/lib/services/activity.service";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function ActivityPage() {
  const session = await getServerSession(authOptions);
  
  if (!session || !session.user) {
    redirect("/login");
  }

  const role = (session.user as any).role;
  const isAdmin = role !== "Vendor";

  if (!isAdmin) {
    redirect("/dashboard");
  }

  const activities = await ActivityService.getGlobalActivityFeed();

  const getIcon = (type: string) => {
    switch(type) {
      case 'rfq': return <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg></div>;
      case 'quote': return <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center text-purple-600"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg></div>;
      case 'po': return <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-600"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"></path></svg></div>;
      case 'invoice': return <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center text-amber-600"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2zM10 8.5a.5.5 0 11-1 0 .5.5 0 011 0zm5 5a.5.5 0 11-1 0 .5.5 0 011 0z"></path></svg></div>;
      default: return <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600"></div>;
    }
  };

  return (
    <div className="p-8 space-y-6 max-w-4xl mx-auto font-sans">
      <h1 className="text-3xl font-bold text-slate-900 tracking-tight">System Activity Log</h1>
      <p className="text-slate-600 mb-8">Real-time chronological audit trail of all platform events.</p>

      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
        {activities.length > 0 ? (
          <div className="relative border-l-2 border-slate-100 ml-4 space-y-8 pb-4">
            {activities.map((activity) => (
              <div key={activity.id} className="relative pl-8">
                <div className="absolute -left-[17px] top-1 bg-white">
                  {getIcon(activity.type)}
                </div>
                <div>
                  <h3 className="font-bold text-slate-800 text-base">{activity.title}</h3>
                  <p className="text-slate-600 mt-1 text-sm">{activity.description}</p>
                  <p className="text-xs font-semibold text-slate-400 mt-2 uppercase tracking-wider">
                    {new Date(activity.timestamp).toLocaleString(undefined, {
                      month: 'short', day: 'numeric', year: 'numeric',
                      hour: 'numeric', minute: 'numeric'
                    })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-12 text-center">
            <p className="text-slate-500">No recent activity found on the platform.</p>
          </div>
        )}
      </div>
    </div>
  );
}