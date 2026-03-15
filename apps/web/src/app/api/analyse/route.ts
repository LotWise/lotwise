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
    const actorRaw = process.env.APIFY_ACTOR;

    if (!token || !actorRaw) {
      return NextResponse.json(
        { error: "Missing Apify environment variables" },
        { status: 500 }
      );
    }

    const actor = actorRaw.replace("/", "~");

    const response = await fetch(
      `https://api.apify.com/v2/acts/${actor}/run-sync-get-dataset-items?token=${token}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          propertyUrls: [{ url }],
          fullPropertyDetails: true,
          includePriceHistory: false,
          includeNearestSchools: false,
          maxProperties: 1,
        }),
      }
    );

    const properties = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        {
          error: "Failed to fetch property data",
          details: properties,
        },
        { status: 500 }
      );
    }

    const property = Array.isArray(properties) ? properties[0] : null;

    if (!property) {
      return NextResponse.json(
        { error: "Property not found", details: properties },
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
      {
        error: "Failed to analyse property",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
