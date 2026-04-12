// prisma.config.js
import { defineConfig } from '@prisma/config'; // Se estiver usando a versão mais recente

const prismaConfig = {
  datasource: {
    url: process.env.DATABASE_URL,
  },
};

export default prismaConfig;