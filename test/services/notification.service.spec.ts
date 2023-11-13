import { describe, expect, test } from '@jest/globals';
import { plainToClass } from 'class-transformer';

import { NotificationService } from '../../src/services';
import { Notification } from '../../src/models';

describe('NotificationService', () => {
  test('sendNotification', () => {
    const service = new NotificationService();
    const notification = plainToClass(Notification, {
      user: 'USER101',
      type: 'status',
      message: 'asdasdasd',
    });
    expect(service.sendNotification(notification)).toBe(notification);
  });
});
