import Link from "next/link";

export default function Home() {
  return (
    <main>
      <meta httpEquiv="refresh" content="0;url=/en" />
      <p>
        Continue to the <Link href="/en">English wiki</Link>.
      </p>
    </main>
  );
}
