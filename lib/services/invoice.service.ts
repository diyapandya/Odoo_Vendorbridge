export class InvoiceService {
  static async calculateTaxes(amount: number, rate = 0.08) {
    return amount * rate;
  }
}