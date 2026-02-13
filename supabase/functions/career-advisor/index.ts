import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { interests, degree, cgpa, careerGoal } = await req.json();

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const prompt = `You are a career and education advisor. A student has the following profile:
- Interests: ${interests}
- Degree: ${degree}
- CGPA: ${cgpa}/4.0
- Career Goal: ${careerGoal}

Based on this profile, provide personalized career recommendations using the provide_recommendations function.`;

    const response = await fetch(
      "https://ai.gateway.lovable.dev/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${LOVABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-3-flash-preview",
          messages: [
            {
              role: "system",
              content:
                "You are an expert career and education advisor. Always use the provide_recommendations tool to return structured results.",
            },
            { role: "user", content: prompt },
          ],
          tools: [
            {
              type: "function",
              function: {
                name: "provide_recommendations",
                description:
                  "Provide structured career recommendations for a student.",
                parameters: {
                  type: "object",
                  properties: {
                    careers: {
                      type: "array",
                      description: "Exactly 3 career suggestions",
                      items: {
                        type: "object",
                        properties: {
                          title: {
                            type: "string",
                            description: "Career title",
                          },
                          description: {
                            type: "string",
                            description:
                              "Brief description of why this career fits (1-2 sentences)",
                          },
                          relevance: {
                            type: "string",
                            enum: ["High", "Medium", "Low"],
                            description:
                              "How relevant this career is to the student's profile",
                          },
                        },
                        required: ["title", "description", "relevance"],
                        additionalProperties: false,
                      },
                    },
                    skills: {
                      type: "array",
                      description:
                        "5-8 skills the student should learn",
                      items: { type: "string" },
                    },
                    advice: {
                      type: "string",
                      description:
                        "A short personalized paragraph of guidance (3-5 sentences)",
                    },
                  },
                  required: ["careers", "skills", "advice"],
                  additionalProperties: false,
                },
              },
            },
          ],
          tool_choice: {
            type: "function",
            function: { name: "provide_recommendations" },
          },
        }),
      }
    );

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again later." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI usage limit reached. Please add credits." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const text = await response.text();
      console.error("AI gateway error:", response.status, text);
      throw new Error("AI gateway error");
    }

    const data = await response.json();
    const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];

    if (!toolCall) {
      throw new Error("No tool call in AI response");
    }

    const recommendations = JSON.parse(toolCall.function.arguments);

    return new Response(JSON.stringify(recommendations), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("career-advisor error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
