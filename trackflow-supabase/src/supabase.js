import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://qjbacfhdzkdvzizxqnhf.supabase.co';
const SUPABASE_KEY = 'sb_publishable_CzOJno4b_CFmrHhD5iufxA_XKnR98C7';

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
