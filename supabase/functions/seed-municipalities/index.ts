import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Manejo de CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
    const SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

    const { municipalities } = await req.json();

    if (!municipalities || !Array.isArray(municipalities)) {
      throw new Error("Se requiere un array de municipios");
    }

    console.log(`Recibidos ${municipalities.length} municipios para poblar.`);

    // Ejemplo de inserción en una tabla 'municipalities'
    const { data, error } = await supabase
      .from('municipalities')
      .upsert(municipalities, { onConflict: 'id' });

    if (error) throw error;

    return new Response(JSON.stringify({ message: "Municipios poblados con éxito", data }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 400,
    });
  }
})
