import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import { fileURLToPath } from 'url'
import { dirname, resolve } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

dotenv.config({ path: resolve(__dirname, '.env.local') })

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

async function inspect() {
    const { data, error } = await supabase
        .from('KT_ProgramacionProducto')
        .select('*')
        .limit(1)

    if (error) {
        console.error('Error:', error.message)
    } else if (data && data.length > 0) {
        console.log('Columns:', Object.keys(data[0]).join(', '))
        console.log('Sample Data:', JSON.stringify(data[0], null, 2))
    } else {
        console.log('No data found in KT_ProgramacionProducto table.')
    }
}

inspect()
