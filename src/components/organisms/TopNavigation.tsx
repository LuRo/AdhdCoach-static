import { CoachButton } from "../atoms/CoachButton";

export const TopNavigation = () => (
  <nav className="navbar navbar-expand-lg px-1 px-lg-2" aria-label="Top navigation">
    <div className="container-fluid px-0 align-items-center">
      <a className="navbar-brand d-flex align-items-center gap-3 me-0" href="#" aria-label="ADHD Coach home">
        <img src="/adhd-logo.svg" alt="ADHD Coach logo" className="brand-logo" />
      </a>

      <div className="d-flex align-items-center gap-2 gap-md-3 ms-auto">
        <CoachButton className="rounded-circle" variant="outline" type="button" aria-label="Open settings">
          <i className="bi bi-gear" />
        </CoachButton>

        <img
          src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='84' height='84' viewBox='0 0 84 84'%3E%3Crect width='84' height='84' rx='42' fill='%23ead9cc'/%3E%3Ccircle cx='42' cy='32' r='16' fill='%23845b45'/%3E%3Cpath d='M16 72c5-14 16-21 26-21s21 7 26 21' fill='%23c96f36'/%3E%3C/svg%3E"
          alt="User avatar"
          className="user-avatar"
        />

        <CoachButton className="rounded-pill px-3 px-md-4" type="button">
          Logout
        </CoachButton>
      </div>
    </div>
  </nav>
);
