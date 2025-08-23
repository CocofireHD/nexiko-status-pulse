import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Fetching status from external API...');
    
    // Fetch directly from the status API without using a proxy
    const statusResponse = await fetch('http://45.147.7.231:3000/status', {
      method: 'GET',
      headers: {
        'User-Agent': 'Nexiko-Status-Monitor/1.0',
      },
    });

    if (!statusResponse.ok) {
      throw new Error(`Status API responded with ${statusResponse.status}`);
    }

    const statusData = await statusResponse.json();
    console.log('Successfully fetched status data:', statusData);

    return new Response(JSON.stringify(statusData), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error fetching status:', error);
    
    // Return fallback data if external API fails
    const fallbackData = {
      Website1: 'unknown',
      MariaDB: 'unknown', 
      Proxy: 'unknown'
    };

    return new Response(JSON.stringify(fallbackData), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});