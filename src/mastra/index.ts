
import { Mastra } from '@mastra/core/mastra';
import { PinoLogger } from '@mastra/loggers';
import { LibSQLStore } from '@mastra/libsql';
import { weatherWorkflow } from './workflows/weather-workflow';
import { weatherAgent } from './agents/weather-agent';

export const mastra = new Mastra({
  workflows: { weatherWorkflow },
  agents: { weatherAgent },
  storage: new LibSQLStore({
    // stores telemetry, evals, ... into memory storage, if it needs to persist, change to file:../mastra.db
    url: ":memory:",
  }),
  logger: new PinoLogger({
    name: 'Mastra',
    level: 'info',
  }),
  server: {
    middleware: [
      {
        path: '*',
        handler: async (c, next) => {
          c.header('Access-Control-Allow-Origin', '*');
          c.header(
            'Access-Control-Allow-Methods',
            'GET, POST, PUT, DELETE, OPTIONS',
          );
          // c.header(
          //   'Access-Control-Allow-Headers',
          //   'Content-Type, Authorization',
          // );
      
          if (c.req.method === 'OPTIONS') {
            return new Response(null, { status: 204 });
          }
      
          await next();
        },
      }
    ]
  }
});
