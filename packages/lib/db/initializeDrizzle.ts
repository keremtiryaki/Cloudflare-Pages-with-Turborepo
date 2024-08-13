import { drizzle, DrizzleD1Database } from "drizzle-orm/d1"

export function initializeDrizzle(D1: D1Database): DrizzleD1Database {
    return drizzle(D1, { logger: false })
}

export type HonoVariables = {
    DATABASE: D1Database,
    DRIZZLE: DrizzleD1Database,
    R2_BUCKET: R2Bucket
}