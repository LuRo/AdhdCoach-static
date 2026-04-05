import { useI18n } from "../i18n";
import { CoachButton } from "../shared/components/atoms/CoachButton";

interface Props {
  onClose: () => void;
}

export const ProfilePage = ({ onClose }: Props) => {
  const { copy } = useI18n();

  return (
    <section className="section-panel active" id="profile-panel" aria-labelledby="Profile" role="tabpanel">
      <div className="d-flex flex-column flex-lg-row align-items-lg-center justify-content-between gap-3 mb-4">
        <div className="d-flex flex-column gap-2">
          <p className="text-uppercase small fw-semibold text-secondary mb-0">{copy.profile.sectionLabel}</p>
          <h1 className="h2 mb-0">{copy.profile.title}</h1>
          <p className="text-secondary mb-0">{copy.profile.description}</p>
        </div>

        <CoachButton type="button" variant="outline" onClick={onClose} aria-label={copy.profile.closeAria}>
          {copy.common.close}
        </CoachButton>
      </div>

      <div className="placeholder-panel d-flex flex-column justify-content-center align-items-start p-4 p-lg-5">
        <span className="badge rounded-pill text-bg-light border mb-3">{copy.profile.badge}</span>
        <h2 className="h4 mb-3">{copy.profile.scaffoldTitle}</h2>
        <p className="text-secondary mb-0">{copy.profile.scaffoldText}</p>
      </div>
    </section>
  );
};
