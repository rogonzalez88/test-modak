import { IsEnum, IsString } from 'class-validator';

import { NotificationType } from './../enums';

/**
 * @swagger
 * components:
 *   schemas:
 *     Notification:
 *       type: object
 *       required:
 *         - user
 *         - type
 *         - message
 *       properties:
 *         user:
 *           type: string
 *           description: The user ID.
 *           example: USER101
 *         type:
 *           type: enum
 *           description: type of notification.
 *           enum:
 *             - status
 *             - news
 *             - marketing
 *           example: status
 *         message:
 *           type: string
 *           description: content of message.
 *           example: Lorem Ipsum ...
 */
export class Notification {
  @IsString()
  user: string;

  @IsEnum(NotificationType)
  type: string;

  @IsString()
  message: string;
}
