/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run `wrangler dev src/index.ts` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `wrangler publish src/index.ts --name my-worker` to publish your worker
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */

import { PrismaClient } from '@prisma/client/edge'
const prisma = new PrismaClient()

addEventListener('fetch', (event) => {
  event.respondWith(handleEvent(event))
})

async function handleEvent(event: FetchEvent): Promise<Response> {
  // Get URL parameters
  const { request } = event
  const url = new URL(request.url);
  const table = url.searchParams.get('table');
  let limit = url.searchParams.get('limit');
  const limitNumber = limit? parseInt(limit): 100;

  // Get model
  let model
  for (const [key, value] of Object.entries(prisma)) {
    if (typeof value == 'object' && key == table) {
      model = value
      break
    }
  }
  if(!model){
    return new Response("Table not defined")
  }

  // Get data
  const result = await model.findMany({ take: limitNumber })
  return new Response(JSON.stringify({ result }))
}