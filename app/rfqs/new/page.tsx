import { VendorService } from "@/lib/services/vendor.service";
import { CreateRFQForm } from "./_components/CreateRFQForm";

export default async function NewRfqPage() {
  const vendors = await VendorService.getAllVendors();
  
  // Pass only necessary fields to the client to avoid large payloads
  const vendorData = vendors.map((v: any) => ({
    id: v.id,
    companyName: v.companyName,
  }));

  return <CreateRFQForm vendors={vendorData} />;
}