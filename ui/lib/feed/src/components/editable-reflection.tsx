import React, { useState } from 'react';
import ReflectCard, { ReflectCardProps } from './cards/reflect-card';
import dayjs from 'dayjs';
import { Extension } from '@akashaorg/ui-lib-extensions/lib/react/extension';
import { useCloseActions } from '@akashaorg/design-system-core/lib/utils';

const EditableReflection: React.FC<ReflectCardProps & { beamId: string }> = props => {
  const { entryData, beamId, ...rest } = props;
  const [canEdit, setCanEdit] = useState(false);

  const lastEditInMinutes = dayjs(new Date()).diff(entryData.createdAt, 'minutes');

  const wrapperRef = useCloseActions(() => {
    setCanEdit(false);
  });

  return (
    <div ref={wrapperRef}>
      <>
        {canEdit ? (
          <Extension
            name={`inline-editor_reflect_${entryData.id}`}
            extensionData={{
              beamId,
              reflectionId: entryData.id,
              content: entryData.content,
              showEditorInitialValue: true,
              action: 'edit',
            }}
          />
        ) : (
          <ReflectCard
            entryData={entryData}
            editable={lastEditInMinutes <= 1000}
            onEdit={() => setCanEdit(true)}
            {...rest}
          />
        )}
      </>
    </div>
  );
};

export default EditableReflection;
