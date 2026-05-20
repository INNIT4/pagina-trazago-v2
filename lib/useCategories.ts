import { useEffect, useState } from "react";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { db } from "@/lib/firebase";

export interface CategoryOption {
  value: string;
  label: string;
}

export function useCategories(
  collectionName: string,
  valueField = "name",
  labelField = "name"
): { options: CategoryOption[]; loading: boolean } {
  const [options, setOptions] = useState<CategoryOption[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getDocs(query(collection(db, collectionName), orderBy("order")))
      .then((snap) => {
        setOptions(
          snap.docs.map((d) => ({
            value: String(d.data()[valueField] ?? ""),
            label: String(d.data()[labelField] ?? ""),
          }))
        );
      })
      .finally(() => setLoading(false));
  }, [collectionName, valueField, labelField]);

  return { options, loading };
}
