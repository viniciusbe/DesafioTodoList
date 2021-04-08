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

interface IUpdateTask {
  id: string;
  name: string;
}

interface CustomEditable {
  taskName: string;
  taskId: string;
  handleUpdateTask: (task: IUpdateTask) => Promise<void>;
  handleDeleteTask: (id: string) => Promise<void>;
  handleCompleteTask: (id: string) => Promise<void>;
  isCompleted?: boolean;
}

export function Task({
  taskName,
  taskId,
  handleUpdateTask,
  handleDeleteTask,
  handleCompleteTask,
  isCompleted = false,
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
        <IconButton
          onClick={() => handleDeleteTask(taskId)}
          aria-label="delete"
          icon={<RiDeleteBin5Fill />}
        />
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
        <Checkbox
          colorScheme="pink"
          defaultChecked={isCompleted}
          onChange={() => handleCompleteTask(taskId)}
        />
        <EditablePreview />
      </HStack>
      <EditableInput />
      <EditableControls />
    </Editable>
  );
}
