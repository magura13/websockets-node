import { z } from 'zod';
import { randomUUID } from 'node:crypto';
import { prisma } from '../../lib/prisma';
import { FastifyInstance } from 'fastify';
import { redis } from '../../lib/redis';

export async function voteOnPoll(app: FastifyInstance) {
  app.post('/polls/:pollId/votes', async (req, reply) => {

    const votePollBody = z.object({
      pollOptionId: z.string().uuid()
    })

    const votePollParams = z.object({
      pollId: z.string().uuid()
    })

    const { pollId } = votePollParams.parse(req.params)
    const { pollOptionId } = votePollBody.parse(req.body)

    let { sessionId } = req.cookies

    if (sessionId) {
      const userPreviousVoteOnPoll = await prisma.vote.findUnique({
        where: {
          sessionId_pollId: {
            sessionId,
            pollId,
          },
        }
      })

      if (userPreviousVoteOnPoll && userPreviousVoteOnPoll.pollOptionId != pollOptionId) {

        await prisma.vote.delete({
          where: {
            id: userPreviousVoteOnPoll.id,
          }
        })

        await redis.zincrby(pollId, -1, userPreviousVoteOnPoll.pollOptionId)
      } else if (userPreviousVoteOnPoll) {
        return reply.status(400).send({ message: "You Already Voted on this item" })
      }
    }



    if (!sessionId) {

      sessionId = randomUUID();

      reply.setCookie('sessionId', sessionId, {
        path: '/',
        maxAge: 60 * 60 * 24 * 30,
        signed: true,
        httpOnly: true,
      })
    }

    await prisma.vote.create({
      data: {
        sessionId,
        pollId,
        pollOptionId,
      }
    })

    await redis.zincrby(pollId, 1, pollOptionId);

    return reply.status(201).send();
  })
}