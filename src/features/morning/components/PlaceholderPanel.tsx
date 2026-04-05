import { useI18n } from "../../../i18n";

interface Props {
  panelKey: "today" | "debriefing";
}

export const PlaceholderPanel = ({ panelKey }: Props) => {
  const { copy } = useI18n();
  const panel = copy.ui.placeholderPanel[panelKey];

  return (
    <div className="placeholder-panel d-flex flex-column justify-content-center align-items-start p-4 p-lg-5">
      <span className="badge rounded-pill text-bg-light border mb-3">{panel.badge}</span>
      <h2 className="h3 mb-3">{panel.title}</h2>
      <p className="text-secondary mb-0">{panel.text}</p>
    </div>
  );
};
