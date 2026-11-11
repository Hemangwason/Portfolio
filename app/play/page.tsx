import { redirect } from "next/navigation";

// The play/ground split is retired — everything lives in the index.
export default function PlayPage() {
  redirect("/#index");
}
