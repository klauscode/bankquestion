"use server";

import { isAdminEmail, requireUser } from "@/lib/auth";
import { questionImportArraySchema } from "@/lib/schemas";
import { createAdminClient } from "@/lib/supabase/admin";
import type { QuestionImport } from "@/lib/types";

export async function importQuestions(data: QuestionImport[]) {
  const user = await requireUser();

  if (!isAdminEmail(user.email)) {
    throw new Error("Unauthorized");
  }

  const parsed = questionImportArraySchema.parse(data);
  const supabase = createAdminClient();

  const { error } = await supabase.from("questions").upsert(parsed, {
    onConflict: "source_ref",
    ignoreDuplicates: false,
  });

  if (error) {
    throw error;
  }

  return { imported: parsed.length };
}
