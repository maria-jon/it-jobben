import type { Job } from "./Job"

export type AfResponse = {
    hits: Job [];
    total: { value: number }
}