"use client";

import { useEffect } from "react";
import { supabase } from "../lib/supabase";

export default function TestPage() {
  useEffect(() => {
    const test = async () => {
      const { data, error } = await supabase
        .from("articles")
        .select("*");

      console.log("TEST DATA 👉", data);
      console.log("TEST ERROR 👉", error);
    };

    test();
  }, []);

  return <div>Check console</div>;
}
