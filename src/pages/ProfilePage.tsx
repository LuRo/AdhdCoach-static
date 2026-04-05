import { CoachButton } from "../shared/components/atoms/CoachButton";

interface Props {
  onClose: () => void;
}

export const ProfilePage = ({ onClose }: Props) => (
  <section className="section-panel active" id="profile-panel" aria-labelledby="Profile" role="tabpanel" data-testid="profile-page">
    <div className="d-flex flex-column flex-lg-row align-items-lg-center justify-content-between gap-3 mb-4">
      <div className="d-flex flex-column gap-2">
        <p className="text-uppercase small fw-semibold text-secondary mb-0">Profile</p>
        <h1 className="h2 mb-0">User profile</h1>
        <p className="text-secondary mb-0">Review account details, coaching preferences, and activity context.</p>
      </div>

      <CoachButton type="button" variant="outline" onClick={onClose} aria-label="Close profile page" testId="profile-close-button">
        Close
      </CoachButton>
    </div>

    <div className="placeholder-panel d-flex flex-column justify-content-center align-items-start p-4 p-lg-5">
      <span className="badge rounded-pill text-bg-light border mb-3">Profile</span>
      <h2 className="h4 mb-3">Profile page scaffold</h2>
      <p className="text-secondary mb-0">Add avatar, identity fields, and profile-specific actions here.</p>
    </div>
  </section>
);
