interface NavbarProps {
  user?: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
}

export function Navbar({ user }: NavbarProps) {
  const imageUrl = user?.image;

  return (
    <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 shadow-sm z-10 shrink-0">
      <h1 className="text-xl font-semibold text-slate-800">VendorBridge</h1>


      <div className="flex items-center gap-3">
        {imageUrl ? (
          <img 
            src={imageUrl} 
            alt={user?.name || "User profile"} 
            className="w-10 h-10 rounded-full border border-slate-200 object-cover"
          />
        ) : (
          <div className="w-10 h-10 rounded-full border-2 border-slate-300 bg-slate-100 flex items-center justify-center text-slate-500 font-semibold text-sm">
            {user?.name?.slice(0, 2).toUpperCase() || "U"}
          </div>
        )}
      </div>
    </header>
  );
}

