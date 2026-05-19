import { NextResponse } from "next/server";

function firstValue(...values: unknown[]) {
  for (const value of values) {
    if (value !== undefined && value !== null && value !== "") return value;
  }
  return "";
}

function getImages(property: any): string[] {
  const possible =
    property?.images ||
    property?.imageUrls ||
    property?.propertyImages ||
    property?.photos ||
    property?.media ||
    property?.assets ||
    [];

  if (!Array.isArray(possible)) return [];

  return possible
    .map((item) => {
      if (typeof item === "string") return item;

      return (
        item?.url ||
        item?.src ||
        item?.imageUrl ||
        item?.originalUrl ||
        item?.mainImageUrl ||
        item?.largeUrl ||
        item?.thumbnailUrl ||
        ""
      );
    })
    .filter(Boolean);
}

function getPrice(property: any) {
  const raw = firstValue(
    property?.price,
    property?.priceValue,
    property?.guidePrice,
    property?.salePrice,
    property?.amount,
    property?.pricing?.price,
    property?.pricing?.amount
  );

  if (typeof raw === "number") return raw;

  const cleaned = String(raw).replace(/[^\d]/g, "");
  return cleaned ? Number(cleaned) : "";
}

function normaliseProperty(property: any, fallbackUrl: string) {
  const address = firstValue(
    property?.displayAddress,
    property?.address,
    property?.propertyAddress,
    property?.location?.displayAddress,
    property?.location?.address,
    property?.summary?.displayAddress
  );

  const title = firstValue(
    property?.title,
    property?.heading,
    property?.summary,
    property?.propertyTitle,
    address,
    "Property listing"
  );

  const images = getImages(property);

  return {
    address: String(address || ""),
    title: String(title || ""),
    price: getPrice(property),
    bedrooms: firstValue(
      property?.bedrooms,
      property?.bedroomCount,
      property?.beds,
      property?.bedroomsCount
    ),
    bathrooms: firstValue(
      property?.bathrooms,
      property?.bathroomCount,
      property?.baths,
      property?.bathroomsCount
    ),
    propertyType: String(
      firstValue(
        property?.propertyType,
        property?.type,
        property?.propertySubType,
        property?.category
      ) || ""
    ),
    description: String(
      firstValue(property?.description, property?.summary, property?.text) || ""
    ),
    images,
    heroImage: images[0] || "",
    coordinates:
      property?.coordinates ||
      property?.location?.coordinates ||
      property?.geoLocation ||
      null,
    url: property?.url || property?.propertyUrl || fallbackUrl,
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
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          propertyUrls: [{ url }],
          urls: [url],
          startUrls: [{ url }],
          fullPropertyDetails: true,
          includePriceHistory: false,
          includeNearestSchools: false,
          maxProperties: 1,
          maxItems: 1,
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

    const property = Array.isArray(data)
      ? data[0]
      : data?.items?.[0] || data?.data?.[0] || data;

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
