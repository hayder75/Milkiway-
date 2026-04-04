const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const portfolio = {
  getAll: async () => {
    const items = await prisma.portfolio.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return items.map(item => ({ ...item, _id: item.id }));
  },

  getById: async (id) => {
    const item = await prisma.portfolio.findUnique({
      where: { id },
    });
    return item ? { ...item, _id: item.id } : null;
  },

  create: async (data) => {
    const item = await prisma.portfolio.create({
      data: {
        title: data.title,
        client: data.client,
        category: data.category,
        description: data.description,
        image: data.image || '',
        images: data.images || [],
        video: data.video || '',
        size: data.size || 'medium',
        services: data.services || [],
        tags: data.tags || [],
        isActive: data.isActive !== false,
      },
    });
    return { ...item, _id: item.id };
  },

  update: async (id, data) => {
    const item = await prisma.portfolio.update({
      where: { id },
      data: {
        ...(data.title && { title: data.title }),
        ...(data.client && { client: data.client }),
        ...(data.category && { category: data.category }),
        ...(data.description && { description: data.description }),
        ...(data.image !== undefined && { image: data.image }),
        ...(data.images !== undefined && { images: data.images }),
        ...(data.video !== undefined && { video: data.video }),
        ...(data.size && { size: data.size }),
        ...(data.services && { services: data.services }),
        ...(data.tags && { tags: data.tags }),
        ...(data.isActive !== undefined && { isActive: data.isActive }),
      },
    });
    return { ...item, _id: item.id };
  },

  delete: async (id) => {
    return prisma.portfolio.delete({
      where: { id },
    });
  },
};

module.exports = portfolio;