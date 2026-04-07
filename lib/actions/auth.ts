"use server";

import { redirect } from "next/navigation";

import { authSchema } from "@/lib/schemas";
import { createClient } from "@/lib/supabase/server";
import { getRequestOrigin } from "@/lib/auth";

function authRedirect(path: string, message: string, field: "error" | "message" = "error"): never {
  const params = new URLSearchParams({ [field]: message });
  redirect(`${path}?${params.toString()}`);
}

export async function signIn(formData: FormData) {
  const parsed = authSchema.omit({ displayName: true }).safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    authRedirect("/login", parsed.error.issues[0]?.message ?? "Nao foi possivel entrar.");
  }

  const data = parsed.data;
  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword(data);

  if (error) {
    authRedirect("/login", error.message);
  }

  redirect("/dashboard");
}

export async function signUp(formData: FormData) {
  const parsed = authSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
    displayName: formData.get("displayName"),
  });

  if (!parsed.success) {
    authRedirect("/register", parsed.error.issues[0]?.message ?? "Nao foi possivel criar a conta.");
  }

  const data = parsed.data;
  const origin = await getRequestOrigin();
  const supabase = await createClient();
  const { error } = await supabase.auth.signUp({
    email: data.email,
    password: data.password,
    options: {
      data: {
        display_name: data.displayName,
      },
      emailRedirectTo: `${origin}/auth/confirm?next=/dashboard`,
    },
  });

  if (error) {
    authRedirect("/register", error.message);
  }

  authRedirect("/login", "Conta criada. Verifique seu email para confirmar o acesso.", "message");
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/");
}
