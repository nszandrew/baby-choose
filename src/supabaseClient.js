import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://tgdapslksaldotyespim.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRnZGFwc2xrc2FsZG90eWVzcGltIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDcwMDY3OTksImV4cCI6MjA2MjU4Mjc5OX0.Ro-a3UBPRjwCXGLZaavDPe-LOEIhHWl0MuvivVu2IEE'
export const supabase = createClient(supabaseUrl, supabaseKey)
