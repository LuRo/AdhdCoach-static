import { useI18n } from "../../../i18n";
import { CoachButton } from "../../../shared/components/atoms/CoachButton";
import { useTranslation } from "react-i18next";

interface Props {
  onClose: () => void;
}

export const ProfilePage = ({ onClose }: Props) => {
  const { t } = useTranslation();
  const { locale } = useI18n();

  return (
    <section className="section-panel active" id="profile-panel" aria-labelledby="profile-page-title" role="tabpanel" data-testid="profile-page">
      <div className="d-flex flex-column flex-lg-row align-items-lg-center justify-content-between gap-3 mb-4">
        <div className="d-flex flex-column gap-2">
          <p className="text-uppercase small fw-semibold text-secondary mb-0">{t("Profile")}</p>
          <h1 id="profile-page-title" className="h2 mb-0">{t("User profile")}</h1>
          <p className="text-secondary mb-0">{t("Review account details, coaching preferences, and activity context.")}</p>
        </div>

        <CoachButton type="button" variant="outline" onClick={onClose} aria-label={t("Close profile page")} testId="profile-close-button">
          {t("Close")}
        </CoachButton>
      </div>

      <div className="placeholder-panel d-flex flex-column justify-content-center align-items-start p-4 p-lg-5" data-locale={locale}>
        <span className="badge rounded-pill text-bg-light border mb-3">{t("Profile")}</span>
        <h2 className="h4 mb-3">{t("Profile page scaffold")}</h2>
        <p className="text-secondary mb-0">{t("Add avatar, identity fields, and profile-specific actions here.")}</p>
      </div>
    </section>
  );
};
