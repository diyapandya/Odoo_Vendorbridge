import { RFQService } from "@/lib/services/rfq.service";
import { VendorService } from "@/lib/services/vendor.service";
import { CreateRFQForm } from "../../new/_components/CreateRFQForm";
import { notFound } from "next/navigation";

export default async function EditRfqPage({ params }: { params: { id: string } }) {
  const [rfq, vendors] = await Promise.all([
    RFQService.getRFQById(params.id),
    VendorService.getAllVendors()
  ]);

  if (!rfq) {
    notFound();
  }

  const vendorData = vendors.map((v: any) => ({
    id: v.id,
    companyName: v.companyName,
  }));

  const initialData = {
    id: rfq.id,
    title: rfq.title,
    category: rfq.category,
    deadline: rfq.deadline.toISOString(),
    description: rfq.description,
    status: rfq.status,
    lineItems: rfq.lineItems.map(item => ({
      item: item.item,
      qty: item.qty,
      unit: item.unit
    })),
    vendors: rfq.vendors.map(v => ({
      id: v.id,
      companyName: v.companyName
    }))
  };

  return <CreateRFQForm vendors={vendorData} initialData={initialData} />;
}
