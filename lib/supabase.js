import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://uktnmjykbyuvfsbtawwg.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVrdG5tanlrYnl1dmZzYnRhd3dnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg1ODY3MjEsImV4cCI6MjA4NDE2MjcyMX0.B8BhlTsApCGEwDxRLINjDJBtyU3_H90jyziwm1gReHA';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
