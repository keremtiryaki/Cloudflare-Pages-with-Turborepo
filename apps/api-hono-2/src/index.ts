import { Hono } from 'hono'
import { HonoVariables, initializeDrizzle } from 'lib/db/initializeDrizzle'
import { CloudflareBindings } from 'lib/worker-configuration'
import { users } from 'lib/db/schema/users'

type Bindings = {
  [key in keyof CloudflareBindings]: CloudflareBindings[key]
}

const app = new Hono<{ Bindings: Bindings, Variables: HonoVariables }>()
app.use('*', async (c, next) => {
  // console.log(`c.env.SECRET_KEY: ${c.env.SECRET_KEY}`)
  c.set('DATABASE', c.env.D1_DB);
  c.set('R2_BUCKET', c.env.R2_BUCKET);
  c.set('DRIZZLE', initializeDrizzle(c.env.D1_DB));
  await next();
});


app.get('/', async (c) => {
  const result = await c.get('DRIZZLE').select().from(users).all();
  return c.text(`
    PROD:${import.meta.env.PROD}
    c.env.SECRET_KEY:${c.env.SECRET_KEY}
    c.env.API_HOST:${c.env.API_HOST}
    Users: \n${JSON.stringify(result, null, 2)}`)
});

app.get('/add', async (c) => {
  const id = Math.random().toString(36).substring(7);
  await c.get('DRIZZLE').insert(users).values({
    id
  });
  return c.text(`Added user with id ${id}`)
})

app.get('/upload-form', async (c) => {
  return c.html(`
    <form action="/upload" method="post" enctype="multipart/form-data">
      <input type="file" name="upload_file" />
      <input type="submit" />
    </form>
  `);
})

app.post('/upload', async (c) => {
  const formData = await c.req.formData();
  console.log("formData");
  console.log(formData);
  const upload_file = formData.get('upload_file') as File | null;
  console.log("file");
  console.log(upload_file);
  if (upload_file) { 
    const key = `${new Date().getTime()}/${upload_file.name}`;
    const r2 = await c.get('R2_BUCKET');
    const fileBuffer = await upload_file.arrayBuffer();
    await r2.put(key, fileBuffer, {
      httpMetadata: {
        contentType: upload_file.type || 'application/octet-stream',
      },
    });
    console.log(`File uploaded successfully: ${key}`);

    if (!import.meta.env.PROD) {
      // Development environment
      const fs = await import('fs/promises');
      const path = await import('path');
      const localPath = path.join('../../packages/lib/.wrangler/state/v3/r2-local-cdn', key);
      await fs.mkdir(path.dirname(localPath), { recursive: true });
      await fs.writeFile(localPath, Buffer.from(fileBuffer));
      console.log(`File uploaded successfully to local path: ${localPath}`);
      return c.html(`<a target="_blank" href="http://localhost:3004/${key}">File uploaded successfully</a>`);
    } else {
      return c.html(`<a target="_blank" href="https://pub-a3bf5e6c799347a49d2dc32ba39b067b.r2.dev/${key}">File uploaded successfully</a>`);
    }

  } else {
    return c.text('No file uploaded')
  }
})

export default app