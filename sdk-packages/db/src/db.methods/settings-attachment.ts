import { RxAttachment, RxAttachmentCreator } from 'rxdb';
import { SettingsDoc, SettingsDocMethods, SettingsDocType } from '../collection.types/settings';

export async function getSettingsAttachment(doc: SettingsDoc, id: string) {
  const settings = await doc.getAttachment(id);
  return settings.getStringData();
}

// @example obj = {id: 'myThemeIdentifier', data: JSON.stringify({colors: ['red', 'blue']}), type: 'string'}
export function putSettingsAttachment(
  doc: SettingsDoc,
  obj: RxAttachmentCreator,
): Promise<RxAttachment<SettingsDocType, SettingsDocMethods>> {
  return doc.putAttachment(obj);
}

export async function removeSettingAttachment(doc: SettingsDoc, id: string) {
  const setting = await doc.getAttachment(id);
  return setting.remove();
}
