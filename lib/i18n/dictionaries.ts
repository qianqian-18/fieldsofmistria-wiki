import type { Locale } from "./config";

export type Dictionary = {
  mainPage: string;
  specialPages: string;
  guides: string;
  search: string;
  language: string;
  contents: string;
  sources: string;
  categories: string;
  pending: string;
  noCodes: string;
  privacy: string;
  terms: string;
  fallbackNotice: string;
  navigation: string;
  article: string;
  codes: string;
  officialLinks: string;
  about: string;
};

const dictionaries: Record<Locale, Dictionary> = {
  en: { mainPage:"Main page", specialPages:"Special pages", guides:"Guides", search:"Search Fields of Mistria Wiki", language:"Language", contents:"Contents", sources:"Sources", categories:"Categories", pending:"To be confirmed", noCodes:"No confirmed codes", privacy:"Privacy Policy", terms:"Terms of Service", fallbackNotice:"This article is shown in English while the translation is being verified.", navigation:"Navigation", article:"Article", codes:"Redemption codes", officialLinks:"Official links", about:"About this wiki" },
  "zh-cn": { mainPage:"首页", specialPages:"特殊页面", guides:"攻略", search:"搜索 Fields of Mistria Wiki", language:"语言", contents:"目录", sources:"来源", categories:"分类", pending:"待确认", noCodes:"暂无已确认兑换码", privacy:"隐私政策", terms:"服务条款", fallbackNotice:"译文仍在核实，当前显示英文原文。", navigation:"导航", article:"文章", codes:"兑换码", officialLinks:"官方链接", about:"关于本站" },
  "zh-tw": { mainPage:"首頁", specialPages:"特殊頁面", guides:"攻略", search:"搜尋 Fields of Mistria Wiki", language:"語言", contents:"目錄", sources:"來源", categories:"分類", pending:"待確認", noCodes:"暫無已確認兌換碼", privacy:"隱私政策", terms:"服務條款", fallbackNotice:"譯文仍在核實，目前顯示英文原文。", navigation:"導覽", article:"文章", codes:"兌換碼", officialLinks:"官方連結", about:"關於本站" },
  fr: { mainPage:"Accueil", specialPages:"Pages spéciales", guides:"Guides", search:"Rechercher dans le wiki", language:"Langue", contents:"Sommaire", sources:"Sources", categories:"Catégories", pending:"À confirmer", noCodes:"Aucun code confirmé", privacy:"Confidentialité", terms:"Conditions d’utilisation", fallbackNotice:"Cet article reste en anglais pendant la vérification de la traduction.", navigation:"Navigation", article:"Article", codes:"Codes", officialLinks:"Liens officiels", about:"À propos du wiki" },
  ja: { mainPage:"メインページ", specialPages:"特別ページ", guides:"ガイド", search:"Wikiを検索", language:"言語", contents:"目次", sources:"出典", categories:"カテゴリ", pending:"確認待ち", noCodes:"確認済みコードなし", privacy:"プライバシー", terms:"利用規約", fallbackNotice:"翻訳確認中のため英語版を表示しています。", navigation:"ナビゲーション", article:"記事", codes:"交換コード", officialLinks:"公式リンク", about:"このWikiについて" },
  ko: { mainPage:"대문", specialPages:"특수 문서", guides:"가이드", search:"위키 검색", language:"언어", contents:"목차", sources:"출처", categories:"분류", pending:"확인 필요", noCodes:"확인된 코드 없음", privacy:"개인정보 처리방침", terms:"이용 약관", fallbackNotice:"번역 검토 중이라 영어 원문을 표시합니다.", navigation:"탐색", article:"문서", codes:"교환 코드", officialLinks:"공식 링크", about:"위키 소개" },
  ru: { mainPage:"Главная", specialPages:"Служебные страницы", guides:"Руководства", search:"Поиск по вики", language:"Язык", contents:"Содержание", sources:"Источники", categories:"Категории", pending:"Требует подтверждения", noCodes:"Подтверждённых кодов нет", privacy:"Конфиденциальность", terms:"Условия использования", fallbackNotice:"Перевод проверяется; пока показан английский текст.", navigation:"Навигация", article:"Статья", codes:"Коды", officialLinks:"Официальные ссылки", about:"О вики" },
  es: { mainPage:"Portada", specialPages:"Páginas especiales", guides:"Guías", search:"Buscar en el wiki", language:"Idioma", contents:"Contenido", sources:"Fuentes", categories:"Categorías", pending:"Pendiente de confirmar", noCodes:"No hay códigos confirmados", privacy:"Privacidad", terms:"Términos de servicio", fallbackNotice:"La traducción está en revisión; se muestra el texto en inglés.", navigation:"Navegación", article:"Artículo", codes:"Códigos", officialLinks:"Enlaces oficiales", about:"Acerca del wiki" }
};

export function getDictionary(locale: Locale) {
  return dictionaries[locale];
}
