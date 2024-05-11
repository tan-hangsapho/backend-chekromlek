import { Channel, ConsumeMessage } from 'amqplib';
import { createQueueConnection } from './connection';
import { UserService } from '@users/services/user.service';
import { IUser } from '@users/database/models/user.model';
import { logger } from '@users/utils/logger';

export const consumerMessage = async (channel: Channel): Promise<void> => {
  try {
    if (!channel) {
      channel = (await createQueueConnection()) as Channel;
    }
    const exChangeName = 'chekromlek-user-update';
    const routingKey = 'user-update';
    const queueName = 'user-update-queue';

    await channel.assertExchange(exChangeName, 'direct');
    const queue = await channel.assertQueue(queueName, {
      durable: true,
      autoDelete: false,
    });
    await channel.bindQueue(queue.queue, exChangeName, routingKey);
    channel.consume(queue.queue, async (msg: ConsumeMessage | null) => {
      const userService = new UserService();

      const { type, authId } = JSON.parse(msg!.content.toString());
      if (type === 'auth' && authId) {
        const { username, email, profile, bio, work, gender, createdAt } =
          JSON.parse(msg!.content.toString());
        const user: IUser & { authId: string } = {
          username,
          email,
          profile,
          bio,
          work,
          gender,
          createdAt,
          favorites: [],
          questions: [],
          answers: 0,
          posts: 0,
          authId,
        };
        userService.CreateUser(user);
      }
    });
  } catch (error) {
    logger.error(
      `UserConsumer consumeUserDirectMessage() method error: ${error}`
    );
    throw error;
  }
};
