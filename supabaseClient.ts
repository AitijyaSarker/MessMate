// src/supabaseClient.ts

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://obzogtioqbzmqgdghink.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9iem9ndGlvcWJ6bXFnZGdoaW5rIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTUzNDM5MzgsImV4cCI6MjA3MDkxOTkzOH0.1RKTIzuzulbLsoa_U66Vjnf-YB-bCDh0LOakjNFXxhM'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)