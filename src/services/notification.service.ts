import { Service } from 'typedi';

import { Notification } from './../models';

@Service()
export class NotificationService {
  sendNotification(notification: Notification) {
    return notification;
  }
}
