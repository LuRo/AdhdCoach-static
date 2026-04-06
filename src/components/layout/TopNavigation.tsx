import { useTranslation } from "react-i18next";
import { CoachButton } from "../ui/CoachButton";
import { LOCALES, type Locale, useI18n } from "../../lib/i18n";

interface Props {
  onOpenHomePage: () => void;
  onOpenProfilePage: () => void;
  onOpenSettingsPage: () => void;
}

export const TopNavigation = ({ onOpenHomePage, onOpenProfilePage, onOpenSettingsPage }: Props) => {
  const { t } = useTranslation();
  const { locale, setLocale } = useI18n();

  return (
    <nav className="navbar navbar-expand-lg px-1 px-lg-2" aria-label={t("Main sections")} data-testid="top-navigation">
      <div className="container-fluid px-0 align-items-center">
        <button
          type="button"
          className="navbar-brand d-flex align-items-center gap-3 me-0 border-0 bg-transparent p-0"
          aria-label={t("ADHD Coach home")}
          data-testid="top-navigation-home-button"
          onClick={onOpenHomePage}
        >
          <img src="/adhd-logo.svg" alt="" className="brand-logo" />
        </button>

        <div className="d-flex align-items-center gap-2 gap-md-3 ms-auto">
          <label className="d-flex align-items-center gap-2 small text-secondary mb-0">
            <span>{t("Language")}</span>
            <select
              className="form-select form-select-sm locale-select"
              value={locale}
              onChange={(event) => setLocale(event.currentTarget.value as Locale)}
              aria-label={t("Language")}
            >
              {LOCALES.map((item) => (
                <option key={item} value={item}>
                  {item === "en" ? t("English") : item === "de" ? t("Deutsch") : t("French")}
                </option>
              ))}
            </select>
          </label>

          <CoachButton className="rounded-circle" variant="outline" type="button" aria-label={t("Open settings")} testId="top-navigation-settings-button" onClick={onOpenSettingsPage}>
            <i className="bi bi-gear" />
          </CoachButton>

          <button
            type="button"
            className="border-0 p-0 bg-transparent rounded-circle"
            aria-label={t("Open profile")}
            data-testid="top-navigation-profile-button"
            onClick={onOpenProfilePage}
          >
            <img
              src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='84' height='84' viewBox='0 0 84 84'%3E%3Crect width='84' height='84' rx='42' fill='%23ead9cc'/%3E%3Ccircle cx='42' cy='32' r='16' fill='%23845b45'/%3E%3Cpath d='M16 72c5-14 16-21 26-21s21 7 26 21' fill='%23c96f36'/%3E%3C/svg%3E"
              alt=""
              className="user-avatar"
            />
          </button>

          <CoachButton className="rounded-pill px-3 px-md-4" type="button" testId="top-navigation-logout-button">
            {t("Logout")}
          </CoachButton>
        </div>
      </div>
    </nav>
  );
};
