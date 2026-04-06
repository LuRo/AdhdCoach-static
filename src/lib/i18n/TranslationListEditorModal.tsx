import { useEffect, useState } from "react";
import { CoachButton } from "../../components/ui/CoachButton";
import { TrashBinButton } from "../../components/ui/TrashBinButton";

type TranslationListEditorModalProps = {
  isOpen: boolean;
  items: string[];
  title: string;
  addLabel?: string;
  cancelLabel?: string;
  saveLabel?: string;
  itemLabel?: string;
  onClose: () => void;
  onSave: (items: string[]) => void | Promise<void>;
  isSaving?: boolean;
  error?: string | null;
  testId?: string;
};

export const TranslationListEditorModal = ({
  isOpen,
  items,
  title,
  addLabel = "Add option",
  cancelLabel = "Cancel",
  saveLabel = "Save",
  itemLabel = "Option",
  onClose,
  onSave,
  isSaving = false,
  error = null,
  testId = "translation-list-editor-modal"
}: TranslationListEditorModalProps) => {
  const [draftItems, setDraftItems] = useState<string[]>(items);

  useEffect(() => {
    if (isOpen) {
      setDraftItems(items);
    }
  }, [isOpen, items]);

  if (!isOpen) {
    return null;
  }

  const updateItem = (index: number, value: string) => {
    setDraftItems((previous) => previous.map((entry, entryIndex) => (entryIndex === index ? value : entry)));
  };

  const removeItem = (index: number) => {
    setDraftItems((previous) => previous.filter((_, entryIndex) => entryIndex !== index));
  };

  const moveItem = (index: number, direction: -1 | 1) => {
    setDraftItems((previous) => {
      const nextIndex = index + direction;
      if (nextIndex < 0 || nextIndex >= previous.length) {
        return previous;
      }
      const copy = [...previous];
      const current = copy[index];
      copy[index] = copy[nextIndex];
      copy[nextIndex] = current;
      return copy;
    });
  };

  const addItem = () => {
    setDraftItems((previous) => [...previous, ""]);
  };

  const handleSave = () => {
    void onSave(draftItems.map((entry) => entry.trim()));
  };

  return (
    <>
      <div className="modal fade show d-block" role="dialog" aria-modal="true" aria-label={title} data-testid={testId}>
        <div className="modal-dialog modal-dialog-centered modal-lg">
          <div className="modal-content border-0 shadow-lg">
            <div className="modal-header">
              <h2 className="modal-title fs-5">{title}</h2>
              <CoachButton type="button" variant="ghost" className="modal-close-button" aria-label={cancelLabel} onClick={onClose}>
                <i className="bi bi-x-lg" aria-hidden="true" />
              </CoachButton>
            </div>

            <div className="modal-body d-grid gap-3">
              {draftItems.map((item, index) => (
                <div key={`${index}-${item}`} className="d-flex align-items-center gap-2" data-testid={`${testId}-item-${index}`}>
                  <label className="visually-hidden" htmlFor={`${testId}-input-${index}`}>
                    {itemLabel} {index + 1}
                  </label>
                  <input
                    id={`${testId}-input-${index}`}
                    className="form-control"
                    value={item}
                    onChange={(event) => updateItem(index, event.target.value)}
                    disabled={isSaving}
                  />
                  <CoachButton
                    type="button"
                    variant="outline"
                    className="px-2 py-1"
                    onClick={() => moveItem(index, -1)}
                    disabled={isSaving || index === 0}
                    testId={`${testId}-move-up-${index}`}
                  >
                    <i className="bi bi-arrow-up" aria-hidden="true" />
                  </CoachButton>
                  <CoachButton
                    type="button"
                    variant="outline"
                    className="px-2 py-1"
                    onClick={() => moveItem(index, 1)}
                    disabled={isSaving || index === draftItems.length - 1}
                    testId={`${testId}-move-down-${index}`}
                  >
                    <i className="bi bi-arrow-down" aria-hidden="true" />
                  </CoachButton>
                  <TrashBinButton
                    className="px-2 py-1"
                    onClick={() => removeItem(index)}
                    disabled={isSaving || draftItems.length === 1}
                    testId={`${testId}-remove-${index}`}
                  />
                </div>
              ))}

              <div>
                <CoachButton type="button" variant="outline" onClick={addItem} disabled={isSaving} testId={`${testId}-add`}>
                  {addLabel}
                </CoachButton>
              </div>

              {error ? <div className="text-danger small">{error}</div> : null}
            </div>

            <div className="modal-footer">
              <CoachButton type="button" variant="outline" onClick={onClose} disabled={isSaving}>
                {cancelLabel}
              </CoachButton>
              <CoachButton type="button" onClick={handleSave} disabled={isSaving}>
                {isSaving ? "Saving..." : saveLabel}
              </CoachButton>
            </div>
          </div>
        </div>
      </div>

      <div className="modal-backdrop fade show" onClick={onClose} data-testid={`${testId}-backdrop`} />
    </>
  );
};
