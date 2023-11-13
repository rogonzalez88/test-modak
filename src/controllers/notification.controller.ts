import {
  Body,
  JsonController as Controller,
  Post,
  UseBefore,
} from 'routing-controllers';
import { Service } from 'typedi';

import { Notification } from '../models';
import { NotificationService } from '../services';
import { BodyValidationMiddleware, RateLimitMiddleware } from '../middlewares';

/**
 * @swagger
 * /notifications:
 *   post:
 *     tags:
 *       - Notification
 *     description: Send a notification
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             $ref: '#/components/schemas/Notification'
 *     responses:
 *       200:
 *         description: Notification sent.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               $ref: '#/components/schemas/Notification'
 */
@Controller('/notifications')
@Service()
export class NotificationController {
  constructor(private notificationService: NotificationService) {}

  @Post('/', {})
  @UseBefore(BodyValidationMiddleware, RateLimitMiddleware)
  sendNotification(
    @Body({ validate: false, options: { type: Notification } })
    notification: Notification,
  ) {
    return this.notificationService.sendNotification(notification);
  }
}
