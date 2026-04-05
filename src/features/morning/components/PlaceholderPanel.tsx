interface Props {
  panelKey: "today" | "debriefing";
}

const content = {
  today: {
    badge: "Today",
    title: "Working view placeholder",
    text: "This section is ready for active tasks, timers, blockers, and in-progress checkpoints using the same component language."
  },
  debriefing: {
    badge: "Debriefing",
    title: "Day-close placeholder",
    text: "Use this space for reflection prompts, wins, unfinished tasks, and tomorrow prep after the workday ends."
  }
};

export const PlaceholderPanel = ({ panelKey }: Props) => {
  const panel = content[panelKey];

  return (
    <div className="placeholder-panel d-flex flex-column justify-content-center align-items-start p-4 p-lg-5">
      <span className="badge rounded-pill text-bg-light border mb-3">{panel.badge}</span>
      <h2 className="h3 mb-3">{panel.title}</h2>
      <p className="text-secondary mb-0">{panel.text}</p>
    </div>
  );
};
