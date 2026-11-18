const path = require('path')
const { createClient } = require('@supabase/supabase-js')
const dotenv = require('dotenv')
const { WebSocket } = require('ws')

global.WebSocket = global.WebSocket || WebSocket

dotenv.config({ path: path.join(__dirname, '.env') })

const supabaseUrl = (process.env.SUPABASE_URL || '').trim()
const supabaseKey = (process.env.SUPABASE_KEY || '').trim()

const supabase = createClient(
  supabaseUrl || 'https://teuathobnzuwzwolpvon.supabase.co',
  supabaseKey || 'placeholder-publishable-key',
  {
    auth: {
      persistSession: false,
      autoRefreshToken: false
    }
  }
)

module.exports = supabase