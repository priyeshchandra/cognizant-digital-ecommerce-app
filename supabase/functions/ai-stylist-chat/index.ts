import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const SYSTEM_PROMPT = `You are Jeanius, an expert AI fashion stylist for Levi's and denim fashion. You help customers find the perfect jeans, shirts, shorts, and shoes. You have extensive knowledge about:

- Denim fits (slim, straight, relaxed, bootcut, skinny)
- Body types and which styles work best
- Color coordination and outfit pairing
- Fabric quality and care tips
- Current fashion trends
- Levi's product line and history

Available products in our store:
1. Classic Blue Jeans ($89.99) - Premium denim with perfect fit, available in Blue/Black/Gray
2. Cotton Casual Shirt ($49.99) - Comfortable cotton for any occasion, White/Blue/Gray/Black
3. Summer Cargo Shorts ($39.99) - Breathable with multiple pockets, Khaki/Navy/Black/Olive
4. Urban Sneakers ($79.99) - Comfortable everyday wear, White/Black/Gray/Navy
5. Slim Fit Black Jeans ($94.99) - Modern slim fit with stretch comfort
6. Formal Dress Shirt ($69.99) - Professional for business, White/Light Blue/Pink/Gray

Be friendly, helpful, and enthusiastic about fashion. Give personalized recommendations based on the customer's needs. Keep responses concise but informative. Use emojis sparingly to add personality. When recommending products, mention specific items from our catalog.`;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      console.error("LOVABLE_API_KEY is not configured");
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    console.log("Sending request to AI gateway with messages:", JSON.stringify(messages));

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          ...messages,
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limits exceeded, please try again later." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Payment required, please add funds to your workspace." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      
      return new Response(JSON.stringify({ error: "AI gateway error" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    console.log("Successfully received response from AI gateway");

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("AI stylist chat error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
