import { NextResponse } from "next/server";

function firstValue(...values: unknown[]) {
  for (const value of values) {
    if (value !== undefined && value !== null && value !== "") return value;
  }
  return "";
}

function normaliseImages(property: any): string[] {
  const raw =
    property?.images ||
    property?.imageUrls ||
    property?.propertyImages ||
    property?.photos ||
    property?.imagesUrls ||
    [];

  if (!Array.isArray(raw)) return [];

  return raw
    .map((item) => {
      if (typeof item === "string") return item;
      return (
        item?.url ||
        item?.src ||
        item?.imageUrl ||
        item?.mainImageUrl ||
        item?.original ||
        ""
      );
    })
    .filter(Boolean);
}

function normaliseProperty(property: any, fallbackUrl: string) {
  const address = firstValue(
    property?.displayAddress,
    property?.address,
    property?.propertyAddress,
    property?.location?.displayAddress
  );

  const title = firstValue(
    property?.title,
    property?.heading,
    property?.summary,
    address,
    "Property listing"
  );

  const price = firstValue(
    property?.price,
    property?.priceValue,
    property?.guidePrice,
    property?.salePrice,
    property?.amount
  );

  const bedrooms = firstValue(
    property?.bedrooms,
    property?.bedroomCount,
    property?.beds,
    property?.bedroomsCount
  );

  const bathrooms = firstValue(
    property?.bathrooms,
    property?.bathroomCount,
    property?.baths,
    property?.bathroomsCount
  );

  const propertyType = firstValue(
    property?.propertyType,
    property?.type,
    property?.propertySubType,
    property?.category
  );

  const images = normaliseImages(property);

  return {
    address: String(address || ""),
    title: String(title || ""),
    price,
    bedrooms,
    bathrooms,
    propertyType: String(propertyType || ""),
    description: String(property?.description || property?.summary || ""),
    images,
    heroImage: images[0] || "",
    coordinates: property?.coordinates || property?.location?.coordinates || null,
    url: property?.url || property?.propertyUrl || fallbackUrl,
    raw: property,
  };
}

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
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          propertyUrls: [{ url }],
          fullPropertyDetails: true,
          includePriceHistory: false,
          includeNearestSchools: false,
          maxProperties: 1,
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { error: "Failed to fetch property data", details: data },
        { status: 500 }
      );
    }

    const property = Array.isArray(data) ? data[0] : data?.items?.[0] || data;

    if (!property) {
      return NextResponse.json(
        { error: "Property not found", details: data },
        { status: 404 }
      );
    }

    return NextResponse.json(normaliseProperty(property, url));
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
