import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { url } = await req.json();

    if (!url) {
      return NextResponse.json(
        { error: "No property URL provided" },
        { status: 400 }
      );
    }

    const token = process.env.APIFY_TOKEN;
    const actor = process.env.APIFY_ACTOR;

    if (!token || !actor) {
      return NextResponse.json(
        { error: "Missing Apify environment variables" },
        { status: 500 }
      );
    }

    const runResponse = await fetch(
      `https://api.apify.com/v2/acts/${actor}/runs?token=${token}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          propertyUrls: [url],
          maxItems: 1,
        }),
      }
    );

    const runData = await runResponse.json();

    if (!runResponse.ok) {
      return NextResponse.json(
        { error: "Failed to start Apify actor", details: runData },
        { status: 500 }
      );
    }

    const datasetId = runData?.data?.defaultDatasetId;

    if (!datasetId) {
      return NextResponse.json(
        { error: "No dataset returned from Apify" },
        { status: 500 }
      );
    }

    const datasetResponse = await fetch(
      `https://api.apify.com/v2/datasets/${datasetId}/items?token=${token}`
    );

    const properties = await datasetResponse.json();

    if (!datasetResponse.ok) {
      return NextResponse.json(
        { error: "Failed to fetch dataset", details: properties },
        { status: 500 }
      );
    }

    const property = properties?.[0];

    if (!property) {
      return NextResponse.json(
        { error: "Property not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      address: property.displayAddress || "",
      price: property.price || "",
      bedrooms: property.bedrooms || "",
      bathrooms: property.bathrooms || "",
      propertyType: property.propertyType || "",
      description: property.description || "",
      images: property.images || [],
      coordinates: property.coordinates || null,
      title: property.title || "",
      url: property.url || url,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to analyse property" },
      { status: 500 }
    );
  }
}
