"use client";
import { useSession } from "next-auth/react";
export default function SessionKeyProvider({ children }) {
  const { data: session, status } = useSession();
  // Use session id or status as key to force re-render
  return <div key={session?.user?.id || status}>{children}</div>;
}