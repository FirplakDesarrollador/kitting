const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

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
        console.error(error)
    } else {
        console.log(JSON.stringify(data[0], null, 2))
    }
}

inspect()
