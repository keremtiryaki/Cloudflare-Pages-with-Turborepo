import { Hono } from 'hono'
import { HonoVariables, initializeDrizzle } from 'lib/db/initializeDrizzle'
import { CloudflareBindings } from 'lib/worker-configuration'
import { users } from 'lib/db/schema/users'

type Bindings = {
  [key in keyof CloudflareBindings]: CloudflareBindings[key]
}

const app = new Hono<{ Bindings: Bindings, Variables: HonoVariables }>()
app.use('*', async (c, next) => {
  c.set('DATABASE', c.env.D1_DB);
  c.set('DRIZZLE', initializeDrizzle(c.env.D1_DB));
  await next();
});


app.get('/', async (c) => {
  const result = await c.get('DRIZZLE').select().from(users).all();
  return c.text(`Users: \n\n${JSON.stringify(result, null, 2)}`)
})
app.get('/add', async (c) => {
  const id = Math.random().toString(36).substring(7);
  await c.get('DRIZZLE').insert(users).values({
    id
  });
  return c.text(`Added user with id ${id}`)
})

export default app