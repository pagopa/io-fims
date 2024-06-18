import { I18n } from "i18n";

const staticCatalog: i18n.GlobalCatalog = {
  en: {
    firstName: "Given name",
    fiscalCode: "Fiscal code",
    lastName: "Family name",
  },
  it: {
    firstName: "Nome",
    fiscalCode: "Codice fiscale",
    lastName: "Cognome",
  },
};

const i18n = new I18n({
  defaultLocale: "it",
  locales: ["it", "en"],
  staticCatalog,
});

export default i18n;
