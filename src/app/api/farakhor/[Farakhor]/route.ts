import { MongoClient } from "mongodb";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const uri2 = process.env.MONGODB_URI2 || "";

  if (!uri2.startsWith("mongodb://") && !uri2.startsWith("mongodb+srv://")) {
    console.error("Invalid MongoDB URI:", uri2);
    return NextResponse.json(
      { message: "Configuration error", uri: uri2 },
      { status: 500 }
    );
  }

  const client = new MongoClient(uri2);

  try {
    await client.connect();

    const db = client.db('farakhor');
    const collection = db.collection('farakhorCollection');

    const { pathname } = new URL(req.url);
    const segments = pathname.split("/");
    const month = decodeURIComponent(segments[segments.length - 1]);

    let query = {};

    if (month && month !== "Farakhor") {
      query = { Month: month };
    }

    const documents = await collection.find(query).toArray();
    // console.log("documents");
    // console.log(documents);
    // Format the Georgian date
    const formattedDocuments = documents.map((doc) => {
      const [day, month] = doc.Georgian.split(",");
      const georgianDate = `${parseInt(day)} ${
        [
          "January",
          "February",
          "March",
          "April",
          "May",
          "June",
          "July",
          "August",
          "September",
          "October",
          "November",
          "December",
        ][parseInt(month) - 1]
      }`;
      return { ...doc, GeorgianDay: georgianDate };
    });

    if (formattedDocuments.length > 0) {
      return NextResponse.json(formattedDocuments);
    } else {
      return NextResponse.json(
        { message: "No documents found", query },
        { status: 404 }
      );
    }
  } catch (error) {
    const errorMessage = (error as Error).message || "Unknown error";
    console.error("Database connection error:", errorMessage);
    return NextResponse.json(
      { message: "Server error", error: errorMessage },
      { status: 500 }
    );
  } finally {
    try {
      await client.close();
    } catch (closeError) {
      console.error("Error closing MongoDB connection:", closeError);
    }
  }
}
