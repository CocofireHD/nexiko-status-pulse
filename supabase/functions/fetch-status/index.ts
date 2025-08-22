import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  console.log('fetch-status function called');

  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // Fetch status from the secure internal API
    const statusUrl = 'http://45.147.7.231:3000/status';
    const timestamp = Date.now();
    const urlWithTimestamp = `${statusUrl}?t=${timestamp}`;
    
    console.log(`Fetching status from: ${urlWithTimestamp}`);

    const response = await fetch(urlWithTimestamp, {
      method: 'GET',
      headers: {
        'User-Agent': 'Supabase-Edge-Function/1.0',
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      console.error(`Status API returned error: ${response.status} ${response.statusText}`);
      throw new Error(`Status API returned ${response.status}: ${response.statusText}`);
    }

    const statusData = await response.json();
    console.log('Status data received:', statusData);

    // Transform the data to match expected format
    const services = Object.entries(statusData).map(([name, status]) => ({
      name,
      status: status as string,
      description: `${name} service`,
      host: '45.147.7.231',
      port: 3000,
      check_type: 'http',
      last_checked: new Date().toISOString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      id: `service-${name.toLowerCase()}`,
    }));

    return new Response(
      JSON.stringify({ 
        success: true, 
        services,
        timestamp: new Date().toISOString()
      }),
      {
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        },
      },
    );

  } catch (error) {
    console.error('Error fetching status:', error);
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message,
        services: [] // Return empty array as fallback
      }),
      {
        status: 500,
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        },
      },
    );
  }
});