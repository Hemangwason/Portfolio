import { redirect } from "next/navigation";

// The play/ground split is retired — everything lives on the board.
export default function GroundPage() {
  redirect("/");
}
