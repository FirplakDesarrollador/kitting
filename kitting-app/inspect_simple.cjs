const { createClient } = require('@supabase/supabase-js')

const supabase = createClient(
    'https://vuiuorjzonpyobpelyld.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ1aXVvcmp6b25weW9icGVseWxkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDY4MDM2OTksImV4cCI6MjAyMjM3OTY5OX0.ARDJuGYox9CY3K8z287nEEFBmWVLTs6yCLkHHeMMTKw'
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
    } else {
        console.log('No data found.')
    }
}

inspect()
