export class ActivityService {
  static async logEvent(userId: string, action: string) {
    console.log(`User ${userId} performed: ${action}`);
  }
}