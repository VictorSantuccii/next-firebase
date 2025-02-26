import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuth } from "../lib/context/authContext";

export const useRequireAuth = () => {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  return { user, loading };
};