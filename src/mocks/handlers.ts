import { http, HttpResponse, delay } from 'msw'
import { db } from './db'

const SIMULATED_DELAY = 400

export const handlers = [
  // GET /api/tasks
  http.get('/api/tasks', async () => {
    await delay(SIMULATED_DELAY)
    return HttpResponse.json(db.getAll())
  }),

  // GET /api/tasks/:id
  http.get('/api/tasks/:id', async ({ params }) => {
    await delay(SIMULATED_DELAY)
    const task = db.getById(Number(params.id))
    if (!task) return HttpResponse.json({ message: 'Not found' }, { status: 404 })
    return HttpResponse.json(task)
  }),

  // POST /api/tasks
  http.post('/api/tasks', async ({ request }) => {
    await delay(SIMULATED_DELAY)
    const body = (await request.json()) as Parameters<typeof db.create>[0]
    const task = db.create(body)
    return HttpResponse.json(task, { status: 201 })
  }),

  // PUT /api/tasks/:id
  http.put('/api/tasks/:id', async ({ params, request }) => {
    await delay(SIMULATED_DELAY)
    const body = (await request.json()) as Partial<Parameters<typeof db.create>[0]>
    const task = db.update(Number(params.id), body)
    if (!task) return HttpResponse.json({ message: 'Not found' }, { status: 404 })
    return HttpResponse.json(task)
  }),

  // PATCH /api/tasks/:id/status
  http.patch('/api/tasks/:id/status', async ({ params, request }) => {
    await delay(SIMULATED_DELAY)
    const body = (await request.json()) as { status: string; order: number }
    const task = db.update(Number(params.id), { status: body.status as any, order: body.order })
    if (!task) return HttpResponse.json({ message: 'Not found' }, { status: 404 })
    return HttpResponse.json(task)
  }),

  // PATCH /api/tasks/:id/order
  http.patch('/api/tasks/:id/order', async ({ params, request }) => {
    await delay(SIMULATED_DELAY)
    const body = (await request.json()) as { order: number }
    const task = db.update(Number(params.id), { order: body.order })
    if (!task) return HttpResponse.json({ message: 'Not found' }, { status: 404 })
    return HttpResponse.json(task)
  }),

  // DELETE /api/tasks/:id
  http.delete('/api/tasks/:id', async ({ params }) => {
    await delay(SIMULATED_DELAY)
    const ok = db.delete(Number(params.id))
    if (!ok) return HttpResponse.json({ message: 'Not found' }, { status: 404 })
    return new HttpResponse(null, { status: 204 })
  }),
]
