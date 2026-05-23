// Per-instance, in-memory rate limiter. On Vercel each lambda has its own
// map, so the effective limit is `limit × N`. Acceptable for spam shaping;
// for true rate limiting move to Redis/Upstash or a Mongo TTL counter.
const buckets = new Map<string, { count: number; resetAt: number }>();
const MAX_BUCKETS = 10_000;

function evictIfNeeded(now: number): void {
	if (buckets.size < MAX_BUCKETS) return;
	for (const [k, b] of buckets) {
		if (b.resetAt < now) buckets.delete(k);
	}
	// If still over (every bucket live), drop the oldest by insertion order.
	if (buckets.size >= MAX_BUCKETS) {
		const overflow = buckets.size - Math.floor(MAX_BUCKETS * 0.9);
		let i = 0;
		for (const k of buckets.keys()) {
			if (i++ >= overflow) break;
			buckets.delete(k);
		}
	}
}

export function rateLimit(key: string, limit: number, windowMs: number): boolean {
	const now = Date.now();
	const bucket = buckets.get(key);
	if (!bucket || bucket.resetAt < now) {
		evictIfNeeded(now);
		buckets.set(key, { count: 1, resetAt: now + windowMs });
		return true;
	}
	if (bucket.count >= limit) return false;
	bucket.count += 1;
	return true;
}
