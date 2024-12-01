import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

console.log('Initializing Supabase with:', {
  url: supabaseUrl,
  keyLength: supabaseAnonKey.length // Log key length for security
});

const supabase = createClient(supabaseUrl, supabaseAnonKey)

export default supabase