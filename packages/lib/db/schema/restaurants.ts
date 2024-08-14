import { sqliteTable, text, real, index } from "drizzle-orm/sqlite-core";
import { DrizzleD1Database } from "drizzle-orm/d1"
import { sql } from "drizzle-orm";

export const restaurants = sqliteTable('restaurants', {
    id: text('id').primaryKey(),
    name: text('name').notNull(),
    lat: real('lat').notNull(),
    lng: real('lng').notNull(),
}, (table) => {
    return {
        latIndex: index('lat_idx').on(table.lat),
        lngIndex: index('lng_idx').on(table.lng),
        // You can also create a composite index on both lat and lng
        latLngIndex: index('lat_lng_idx').on(table.lat, table.lng),
    };
});

export const getNearbyRestaurantsBasic = async (lat: string, lng: string, db: DrizzleD1Database) => {
    const userLat = parseFloat(lat);
    const userLng = parseFloat(lng);
    const nearbyRestaurants = await db
        .select({
            id: restaurants.id,
            name: restaurants.name,
            lat: restaurants.lat,
            lng: restaurants.lng,
            distance: sql<number>`(((${restaurants.lat} - ${userLat}) * (${restaurants.lat} - ${userLat})) + 
                              ((${restaurants.lng} - ${userLng}) * (${restaurants.lng} - ${userLng})))`.as('distance_squared')
        })
        .from(restaurants)
        .orderBy(sql`distance_squared`)
        .limit(10)
        .all();
    
    return nearbyRestaurants;

}

export const getNearbyRestaurants = async (
    lat: string,
    lng: string,
    db: DrizzleD1Database,
    measure: 'km' | 'mi' = 'km'
) => {
    const radius = measure === 'km' ? 6371 : 3959;
    const userLat = parseFloat(lat);
    const userLng = parseFloat(lng);
    const nearbyRestaurants = await db
        .select({
            id: restaurants.id,
            name: restaurants.name,
            lat: restaurants.lat,
            lng: restaurants.lng,
            distance: sql<number>`${radius} * 2 * ASIN(SQRT(
                (SIN((${restaurants.lat} - ${userLat}) * PI() / 180 / 2) * 
                 SIN((${restaurants.lat} - ${userLat}) * PI() / 180 / 2)) +
                COS(${userLat} * PI() / 180) * COS(${restaurants.lat} * PI() / 180) *
                (SIN((${restaurants.lng} - ${userLng}) * PI() / 180 / 2) * 
                 SIN((${restaurants.lng} - ${userLng}) * PI() / 180 / 2))
            ))`.as('distance')
        })
        .from(restaurants)
        .orderBy(sql`distance`)
        .limit(10)
        .all();
    
    return nearbyRestaurants;
}