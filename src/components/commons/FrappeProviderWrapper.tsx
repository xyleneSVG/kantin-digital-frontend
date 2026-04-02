/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { FrappeProvider } from "frappe-react-sdk";
import { ReactNode, useEffect, useState } from "react";

export default function FrappeProviderWrapper({
  children,
}: {
  children: ReactNode;
}) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  const frappeUrl =
    process.env.NEXT_PUBLIC_FRAPPE_URL || "";

  return <FrappeProvider url={frappeUrl}>{children}</FrappeProvider>;
}
