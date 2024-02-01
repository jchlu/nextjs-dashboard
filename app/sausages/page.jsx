import { fetchBusinesses } from '../lib/data'
export default async function Page() {
    const businesses = await fetchBusinesses()
    return JSON.stringify(businesses, null, 2)
}
