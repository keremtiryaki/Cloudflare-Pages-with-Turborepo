import { sqliteTable, text, real, index, numeric } from "drizzle-orm/sqlite-core";
import { DrizzleD1Database } from "drizzle-orm/d1"
import { and, eq, lte, gte, sql, asc } from "drizzle-orm";

// Websites table
export const websites = sqliteTable('websites', {
    id: text('id').notNull().primaryKey(),
    name: text('name').notNull(),
});

export const hostnames = sqliteTable('hostnames', {
    hostname: text('hostname').notNull().primaryKey(),
    websiteId: text('website_id').notNull()
        // .references(() => websites.id),
}, (table) => {
    return {
        websiteIdIndex: index('website_id_idx').on(table.websiteId),
    };
});

export const restaurants = sqliteTable('restaurants', {
    id: text('id').notNull().primaryKey(),
    name: text('name').notNull(),
    lat: real('lat').notNull(),
    lng: real('lng').notNull(),
    minLat: real('min_lat').notNull().default(0),
    maxLat: real('max_lat').notNull().default(0),
    minLng: real('min_lng').notNull().default(0),
    maxLng: real('max_lng').notNull().default(0),
}, (table) => {
    return {
        latIndex: index('lat_idx').on(table.lat),
        lngIndex: index('lng_idx').on(table.lng),
        // You can also create a composite index on both lat and lng
        latLngIndex: index('lat_lng_idx').on(table.lat, table.lng),
        minLatIndex: index('min_lat_idx').on(table.minLat),
        maxLatIndex: index('max_lat_idx').on(table.maxLat),
        minLngIndex: index('min_lng_idx').on(table.minLng),
        maxLngIndex: index('max_lng_idx').on(table.maxLng)
    };
});


// Junction table for the many-to-many relationship
export const restaurantWebsites = sqliteTable('restaurant_websites', {
    restaurantId: text('restaurant_id').notNull(),
        // .references(() => restaurants.id),
    websiteId: text('website_id').notNull(),
        // .references(() => websites.id),
}, (table) => {
    return {
        pk: index('restaurant_website_pk').on(table.restaurantId, table.websiteId)
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
    hostname: string,
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
            // Haversine formula for great-circle distance
            // distance: sql<number>`${radius} * 2 * ASIN(
            //     SQRT(
            //         (
            //             SIN((${restaurants.lat} - ${userLat}) * PI() / 180 / 2) * 
            //             SIN((${restaurants.lat} - ${userLat}) * PI() / 180 / 2)
            //         ) +
            //         COS(${userLat} * PI() / 180) *
            //         COS(${restaurants.lat} * PI() / 180) *
            //         (
            //             SIN((${restaurants.lng} - ${userLng}) * PI() / 180 / 2) * 
            //             SIN((${restaurants.lng} - ${userLng}) * PI() / 180 / 2)
            //         )
            //     )
            // )`.mapWith(Number).as('distance'),

            simple_distance: sql<number>`${radius} * 2 * ASIN(
                SQRT(
                    0.5 - COS((${restaurants.lat} - ${userLat}) * PI() / 180) / 2 + 
                    COS(${userLat} * PI() / 180) * COS(${restaurants.lat} * PI() / 180) * 
                    (1 - COS((${restaurants.lng} - ${userLng}) * PI() / 180)) / 2
                )
            )`.mapWith(Number).as('simple_distance')
        })
        .from(restaurants)
        .innerJoin(restaurantWebsites, eq(restaurants.id, restaurantWebsites.restaurantId))
        .innerJoin(websites, eq(restaurantWebsites.websiteId, websites.id))
        .innerJoin(hostnames, eq(websites.id, hostnames.websiteId))
        .where(
            and(
                eq(hostnames.hostname, hostname),
                lte(restaurants.minLat, userLat),
                gte(restaurants.maxLat, userLat),
                lte(restaurants.minLng, userLng),
                gte(restaurants.maxLng, userLng)
            )
        )
        .orderBy(asc(sql`simple_distance`))
        .limit(10);
    
    return nearbyRestaurants;
}