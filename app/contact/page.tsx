import type { Metadata } from "next";
import { Experience } from "../components/experience/Experience";

export const metadata: Metadata = {
  title: "Say Hello — Hemang Wason",
};

export default function ContactPage() {
  return <Experience initialView="contact" />;
}
