import {
  ButtonGroup,
  Checkbox,
  Editable,
  EditableInput,
  EditablePreview,
  HStack,
  IconButton,
  useEditableControls,
} from '@chakra-ui/react';
import { useCallback } from 'react';

import {
  RiCheckLine,
  RiEditLine,
  RiCloseLine,
  RiDeleteBin5Fill,
} from 'react-icons/ri';

interface IUpdateFood {
  id: string;
  name: string;
}

interface CustomEditable {
  taskName: string;
  taskId: string;
  handleUpdateTask: (task: IUpdateFood) => void;
}

export function Task({
  taskName,
  taskId,
  handleUpdateTask,
}: CustomEditable): JSX.Element {
  const handleSubmit = useCallback(
    async nextValue => {
      handleUpdateTask({ id: taskId, name: nextValue });
    },
    [taskId, handleUpdateTask],
  );

  function EditableControls() {
    const {
      isEditing,
      getSubmitButtonProps,
      getCancelButtonProps,
      getEditButtonProps,
    } = useEditableControls();

    return isEditing ? (
      <ButtonGroup justifyContent="center" size="lg">
        <IconButton
          aria-label="submit"
          icon={<RiCheckLine />}
          {...getSubmitButtonProps()}
        />
        <IconButton
          aria-label="cancel"
          icon={<RiCloseLine />}
          {...getCancelButtonProps()}
        />
      </ButtonGroup>
    ) : (
      <ButtonGroup justifyContent="center" size="lg">
        <IconButton
          aria-label="edit"
          icon={<RiEditLine />}
          {...getEditButtonProps()}
        />
        <IconButton aria-label="delete" icon={<RiDeleteBin5Fill />} />
      </ButtonGroup>
    );
  }

  return (
    <Editable
      w="100%"
      display="flex"
      justifyContent="space-between"
      defaultValue={taskName}
      fontSize="lg"
      isPreviewFocusable={false}
      onSubmit={nextValue => handleSubmit(nextValue)}
    >
      <HStack spacing="4">
        <Checkbox colorScheme="pink" />
        <EditablePreview />
      </HStack>
      <EditableInput />
      <EditableControls />
    </Editable>
  );
}
