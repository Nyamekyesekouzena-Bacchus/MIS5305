"use server";

import { db } from "@/lib/db";

export async function createSubmission(formData) {
  const email = formData.get("email");
  const message = formData.get("text");

  await db.submission.create({
    data: {
      email: email ?? "",
      message: message ?? "",
    },
  });
}
