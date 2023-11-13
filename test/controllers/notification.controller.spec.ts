import { describe, test, expect } from '@jest/globals';
import { plainToClass } from 'class-transformer';

import { NotificationController } from '../../src/controllers/notification.controller';
import { NotificationService } from '../../src/services';
import { Notification } from '../../src/models';

describe('NotificationController', () => {
  test('sendNotification', () => {
    const service = new NotificationService();
    const controller = new NotificationController(service);
    const notification = plainToClass(Notification, {
      user: 'USER101',
      type: 'status',
      message: 'asdasdasd',
    });
    expect(controller.sendNotification(notification)).toBe(notification);
  });
});
