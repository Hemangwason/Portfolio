import type { Metadata } from "next";
import { Experience } from "../components/experience/Experience";

export const metadata: Metadata = {
  title: "About — Hemang Wason",
};

export default function AboutPage() {
  return <Experience initialView="about" />;
}
