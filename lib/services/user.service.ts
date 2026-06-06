export class UserService {
  static async getUserById(id: string) {
    return { id, name: 'John Doe', role: 'Procurement Officer' };
  }
}