import { createAPIFileRoute } from '@tanstack/react-start/api'
import { db } from '@/lib/db'

export const APIRoute = createAPIFileRoute('/api/ping')({
  GET: async () => {
    try {
      // Run a simple query to keep the database awake
      await db.$queryRaw`SELECT 1`
      
      return new Response(JSON.stringify({ status: 'ok', message: 'Database is awake' }), {
        headers: {
          'content-type': 'application/json',
        },
      })
    } catch (error: any) {
      return new Response(JSON.stringify({ status: 'error', message: error.message }), {
        status: 500,
        headers: {
          'content-type': 'application/json',
        },
      })
    }
  },
})
