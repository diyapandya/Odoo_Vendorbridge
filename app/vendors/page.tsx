import { VendorService } from "@/lib/services/vendor.service";
import { VendorClient } from "./_components/VendorClient";

export default async function VendorsPage() {
  const vendors = await VendorService.getAllVendors();
  
  // Convert Decimals to string if necessary, but here Vendor doesn't use Decimal in Prisma schema. 
  // Prisma dates might need to be converted to strings or left alone depending on how Next.js serializes.
  // Next.js Server Components passing data to Client Components can pass plain objects.
  
  return <VendorClient initialVendors={vendors} />;
}