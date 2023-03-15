import { format } from 'date-fns'

export function log(...args: unknown[]) {
    console.log(`[${format(Date.now(), 'yyyy-MM-dd HH:mm:ss')}]:`, ...args)
}