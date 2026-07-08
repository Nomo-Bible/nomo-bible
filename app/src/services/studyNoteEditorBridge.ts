export interface StudyNoteEditorApi {
  insertHtml: (html: string) => void;
}

let editorApi: StudyNoteEditorApi | null = null;

export function registerStudyNoteEditor(api: StudyNoteEditorApi | null): void {
  editorApi = api;
}

export function insertIntoStudyNoteEditor(html: string): boolean {
  if (!editorApi) return false;
  editorApi.insertHtml(html);
  return true;
}
