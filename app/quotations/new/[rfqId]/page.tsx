import { RFQService } from "@/lib/services/rfq.service";
import { notFound, redirect } from "next/navigation";
import { SubmitQuotationForm } from "./_components/SubmitQuotationForm";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth"; // Assuming authOptions exists or similar

export default async function NewQuotationPage({ params }: { params: { rfqId: string } }) {
  const session = await getServerSession(authOptions);
  
  if (!session || !session.user) {
    redirect("/login");
  }

  const role = (session.user as any).role;
  const vendorId = (session.user as any).id;

  if (role !== "Vendor") {
    // Only vendors can submit quotations
    redirect("/dashboard");
  }

  const rfq = await RFQService.getRFQById(params.rfqId);

  if (!rfq) {
    notFound();
  }

  const rfqData = {
    id: rfq.id,
    title: rfq.title,
    category: rfq.category,
    deadline: rfq.deadline.toISOString(),
    lineItems: rfq.lineItems.map(item => ({
      id: item.id,
      item: item.item,
      qty: item.qty,
      unit: item.unit
    }))
  };

  return (
    <div className="p-8">
      <SubmitQuotationForm rfq={rfqData} vendorId={vendorId} />
    </div>
  );
}
