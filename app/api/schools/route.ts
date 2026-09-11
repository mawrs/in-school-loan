import { NextRequest, NextResponse } from "next/server";

const endpoint = "https://api.data.gov/ed/collegescorecard/v1/schools";

export async function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams.get("q")?.trim();
  const apiKey = process.env.COLLEGE_SCORECARD_API_KEY;

  if (!query || query.length < 1) {
    return NextResponse.json([]);
  }

  if (!apiKey) {
    return NextResponse.json({ error: "College Scorecard API key is not configured." }, { status: 500 });
  }

  const searchParams = new URLSearchParams({
    api_key: apiKey,
    fields: "id,school.name,school.city,school.state",
    per_page: "8",
    "school.name": query.length === 1 ? `${query}*` : `${query}%`,
  });
  const response = await fetch(`${endpoint}?${searchParams}`, { next: { revalidate: 86400 } });

  if (!response.ok) {
    return NextResponse.json({ error: "School search is unavailable." }, { status: response.status });
  }

  const data = await response.json();
  const schools = (data.results ?? []).map(
    (school: { id: number; "school.city": string; "school.name": string; "school.state": string }) => ({
      id: school.id,
      label: `${school["school.name"]} — ${school["school.city"]}, ${school["school.state"]}`,
    }),
  );

  return NextResponse.json(schools);
}
