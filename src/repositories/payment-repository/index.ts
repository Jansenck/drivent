import { prisma } from "@/config";
import { Payment } from "@prisma/client";

async function createPayment(ticketId: number, params: PaymentParams) {
  return prisma.payment.create({
    data: {
      ticketId,
      ...params,
    }
  });
}

async function findPaymentByTicketId(ticketId: number) {
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

export type PaymentParams = Omit<Payment, "id" | "createdAt" | "updatedAt">

const paymentRepository = {
  findPaymentByTicketId,
  createPayment,
};

export default paymentRepository;
