import { prisma } from "@/config";
import { Payment } from "@prisma/client";

async function createPayment(ticketId: number, cardData: createOrUpdatePayment) {
  return prisma.payment.create({
    data: {
      ticketId,
      value: cardData.value,
      cardIssuer: cardData.issuer,
      cardLastDigits: cardData.number.slice(-4)
    }
  });
}

async function getPayment(ticketId: number) {
  return prisma.payment.findFirst({
    where: {
      ticketId,
    },
    include: {
      Ticket: {
        include: {
          TicketType: {
            select: {
              price: true
            }
          }
        }
      }
    }
  });
}

export type createOrUpdatePayment = {
  ticketId: number,
  value: number,
  issuer: string, 
  number: string
};

const paymentRepository = {
  getPayment,
  createPayment,
};

export default paymentRepository;
