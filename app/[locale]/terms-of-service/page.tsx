import { notFound } from "next/navigation";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { isLocale } from "@/lib/i18n/config";

export default async function TermsOfService({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dictionary = getDictionary(locale);
  return <article className="article-page legal-page"><header className="article-heading"><p>Fields of Mistria Wiki</p><h1>{dictionary.terms}</h1></header><p className="lead">Fields of Mistria Wiki is an independent fan-made information site. Using the site means accepting that guide content may change as research and game versions are updated.</p><h2>Accuracy</h2><p>Published pages use the supplied research and label unsupported details To be confirmed. The site does not guarantee that changing game mechanics, schedules or platform information will remain current after an update.</p><h2>Rights and affiliation</h2><p>Fields of Mistria and related game materials belong to their respective rights holders. This site does not claim endorsement by or affiliation with NPC Studio. Specific trademark and copyright contact details are To be confirmed.</p><h2>Prohibited use</h2><p>The site does not publish cracks, unauthorized downloads or invented redemption codes. Users must not treat fan-made guide text as an official announcement.</p><h2>Operator</h2><p>Site operator identity, contact, governing law and effective date: To be confirmed.</p></article>;
}
