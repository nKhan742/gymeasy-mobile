import React, { useEffect } from "react";
import { useRouter } from "expo-router";

export default function AddMemberScreen() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/(tabs)/add");
  }, []);

  return null;
}
