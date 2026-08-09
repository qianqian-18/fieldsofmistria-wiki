import { notFound } from "next/navigation";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { isLocale } from "@/lib/i18n/config";

export default async function PrivacyPolicy({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dictionary = getDictionary(locale);
  return <article className="article-page legal-page"><header className="article-heading"><p>Fields of Mistria Wiki</p><h1>{dictionary.privacy}</h1></header><p className="lead">Fields of Mistria Wiki is an independent fan-made guide. It is not presented as an official NPC Studio website.</p><h2>Information collected</h2><p>This first version does not provide user accounts, comments, purchases or newsletter forms. Hosting providers may process standard technical logs required to deliver and protect the website. The provider and retention details are To be confirmed.</p><h2>External links</h2><p>The site may link to Steam or other verified destinations. External services apply their own privacy rules. Unverified official, Discord and YouTube destinations remain non-clickable and marked To be confirmed.</p><h2>Operator and contact</h2><p>Site operator identity: To be confirmed. Privacy contact: To be confirmed. Legal jurisdiction and effective date: To be confirmed.</p></article>;
}
