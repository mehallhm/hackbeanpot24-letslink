"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/nextauth";
import clientPromise from "@/lib/mongodb";

export async function getRecentEvents() {
  const user = await getServerSession(authOptions);

  const client = await clientPromise;
  const db = client.db("events");
  const events = db.collection("events");
  const data = await events
    .find(
      {
        emails: user?.user?.email,
        endDateRange: { $gte: new Date() },
      },
      {
        limit: 5,
      },
    )
    .toArray();
  return data.map((e) => ({
    title: e.title,
    id: e._id,
    startDateRange: e.startDateRange,
    endDateRange: e.endDateRange,
  }));
}