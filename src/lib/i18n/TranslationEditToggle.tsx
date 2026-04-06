import { useTranslation } from "react-i18next";
import { useTranslationEditMode } from "./TranslationEditModeContext";

type TranslationEditToggleProps = {
  className?: string;
};

export const TranslationEditToggle = ({ className }: TranslationEditToggleProps) => {
  const { enabled, setEnabled } = useTranslationEditMode();
  const { t } = useTranslation();

  return (
    <div className={["form-check form-switch m-0", className].filter(Boolean).join(" ")} data-testid="translation-edit-toggle">
      <input
        className="form-check-input"
        type="checkbox"
        role="switch"
        id="translation-edit-mode-enabled"
        checked={enabled}
        onChange={(event) => setEnabled(event.target.checked)}
        data-testid="translation-edit-toggle-input"
      />
      <label className="form-check-label small fw-semibold" htmlFor="translation-edit-mode-enabled" data-testid="translation-edit-toggle-label">
        {t("Translation edit mode", { defaultValue: "Translation edit mode", keySeparator: false, nsSeparator: false })}
      </label>
    </div>
  );
};

