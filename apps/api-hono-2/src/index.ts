import { Hono } from 'hono'
import { HonoVariables, initializeDrizzle } from 'lib/db/initializeDrizzle'
import { CloudflareBindings } from 'lib/worker-configuration'
import { users } from 'lib/db/schema/users'
import { getNearbyRestaurants, hostnames, restaurants, restaurantWebsites, websites } from 'lib/db/schema/restaurants'

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

const calculateBoundingBox = (
  userLat: number,
  userLng: number,
  measure: 'km' | 'mi' = 'km',
  radius: number = 3
) => {
  // Earth's radius in km or miles
  const earthRadius = measure === 'km' ? 6371 : 3959;
  
  // Convert latitude and longitude to radians
  const latRad = userLat * Math.PI / 180;
  const lngRad = userLng * Math.PI / 180;

  // Angular distance in radians on a great circle
  const angularDistance = radius / earthRadius;

  // Calculate deltas
  const latDelta = angularDistance * 180 / Math.PI;
  const lngDelta = Math.asin(Math.sin(angularDistance) / Math.cos(latRad)) * 180 / Math.PI;

  // Calculate bounding box coordinates
  const minLat = userLat - latDelta;
  const maxLat = userLat + latDelta;
  const minLng = userLng - lngDelta;
  const maxLng = userLng + lngDelta;

  return { minLat, maxLat, minLng, maxLng };
}

app.get('/add-sample-restaurants', async (c) => {
  // sample user position: 43.6461002,-79.3751153
  const db = c.get('DRIZZLE');
  await db.delete(websites).execute();
  await db.delete(hostnames).execute();
  await db.delete(restaurants).execute();
  await db.delete(restaurantWebsites).execute();

  await db.insert(websites).values([
    { id: '1', name: 'sample' },
  ]);
  const sampelRestaurantsData = [
    { id: '1', name: 'Clutch Vape', lat: 43.64638058054689, lng: -79.37489199614096 },
    { id: '2', name: 'The Old Spaghetti Factory', lat: 43.64695608527815, lng: -79.37433991492232 },
    { id: '3', name: 'St. Lawrence Market', lat: 43.648732591007544, lng: -79.37168169792817 },
    { id: '4', name: 'The PUB', lat: 43.646373430972076, lng: -79.38310814709395 },
    { id: '5', name: 'Tim Hortons', lat: 43.647887104345685, lng: -79.37619090602158 },
    { id: '6', name: 'The Esplanade at Yonge St', lat: 43.645857049227835, lng: -79.37638611763383 },
  ].map(restaurant => {
    const { minLat, maxLat, minLng, maxLng } = calculateBoundingBox(restaurant.lat, restaurant.lng);
    return {
      ...restaurant,
      minLat,
      maxLat,
      minLng,
      maxLng,
    };
  });
  await db.insert(restaurants).values(sampelRestaurantsData);
  await db.insert(restaurantWebsites).values([
    { websiteId: '1', restaurantId: '2' },
    { websiteId: '1', restaurantId: '3' },
    { websiteId: '1', restaurantId: '4' },
    { websiteId: '1', restaurantId: '5' },
    { websiteId: '1', restaurantId: '6' },
  ]);
  await db.insert(hostnames).values([
    { hostname: 'localhost:3003', websiteId: '1' },
  ]);
  return c.text('Sample restaurants added');
});


app.get('/nearby-restaurants', async (c) => {
  // const cf = c.req.raw.cf as { latitude?: number; longitude?: number } | undefined;
  // const latitude = cf?.latitude?.toString() ?? '';
  // const longitude = cf?.longitude?.toString() ?? '';
  
  //user position: 43.6461002,-79.3751153
  const latitude = "43.6461002";
  const longitude = "-79.3751153";
  
  const { lat = latitude, lng = longitude, measure = 'km' } = c.req.query();
  const userLat = parseFloat(lat);
  const userLng = parseFloat(lng);

  if (isNaN(userLat) || isNaN(userLng)) {
    return c.json({ error: 'Invalid latitude or longitude' }, 400);
  }
  const db = c.get('DRIZZLE');
  const nearbyRestaurants = await getNearbyRestaurants(
    lat, lng, db,
    c.req.header('host') ?? '',
    measure === 'mi' ? 'mi' : 'km'
  );
  return c.text(`

Latitude: ${lat}
Longitude: ${lng}

Hostname: ${c.req.header('host')}

${JSON.stringify(nearbyRestaurants, null, 2)}

  `);
});


app.get('/', async (c) => {
  const result = await c.get('DRIZZLE').select().from(users).all();
  const headers = c.req.header();
  return c.text(`
    PROD:${import.meta.env.PROD}
    c.env.SECRET_KEY:${c.env.SECRET_KEY}
    c.env.API_HOST:${c.env.API_HOST}
    
    ----------------
    cf: \n${JSON.stringify(c.req.raw.cf, null, 2)}
    ----------------

    Users: \n${JSON.stringify(result, null, 2)}
    Headers: \n${JSON.stringify(headers, null, 2)}`)
});


// app.get('/', (c) => {
//   const cf = c.req.raw.cf;

//   const htmlContent = [
//     'colo', 'country', 'city', 'continent', 'latitude', 'longitude',
//     'postalCode', 'metroCode', 'region', 'regionCode', 'timezone'
//   ].map(key => `<p>${key.charAt(0).toUpperCase() + key.slice(1)}: ${cf?.[key] || 'N/A'}</p>`).join('')

//   return c.html(`
//     <!DOCTYPE html>
//     <html>
//       <head>
//         <title>Geolocation: Hello World</title>
//         <style>
//           body { padding: 6em; font-family: sans-serif; }
//           h1 { color: #f6821f; }
//         </style>
//       </head>
//       <body>
//         <h1>Geolocation: Hello World!</h1>
//         <p>You now have access to geolocation data about where your user is visiting from.</p>
//         ${htmlContent}
//       </body>
//     </html>
//   `)
// })

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