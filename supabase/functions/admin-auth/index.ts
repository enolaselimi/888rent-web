const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    if (req.method !== 'POST') {
      return new Response(
        JSON.stringify({ success: false, error: 'Method not allowed' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 405 }
      )
    }

    const { username, password } = await req.json()

    // Validate admin credentials securely on the server
    const adminUsername = Deno.env.get('ADMIN_USERNAME')
    const adminPassword = Deno.env.get('ADMIN_PASSWORD')

    if (!adminUsername || !adminPassword) {
      throw new Error('Missing admin credentials in environment variables')
    }

    if (username === adminUsername && password === adminPassword) {
      return new Response(
        JSON.stringify({ 
          success: true, 
          isAdmin: true,
          adminEmail: 'admin@888rent.al'
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    return new Response(
      JSON.stringify({ success: false, error: 'Invalid admin credentials' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 401 }
    )

  } catch (error) {
    console.error('Error in admin-auth function:', error)
    return new Response(
      JSON.stringify({ success: false, error: 'Internal server error' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})