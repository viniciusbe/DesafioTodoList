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
  is_completed: boolean;
}

interface CustomEditableProps {
  taskName: string;
  taskId: string;
  handleUpdateTask: (task: IUpdateTask) => Promise<void>;
  handleDeleteTask: (id: string) => Promise<void>;
  isCompleted: boolean;
}

export function Task({
  taskName,
  taskId,
  handleUpdateTask,
  handleDeleteTask,
  isCompleted,
}: CustomEditableProps): JSX.Element {
  const handleSubmit = useCallback(
    nextValue => {
      handleUpdateTask({
        id: taskId,
        name: nextValue,
        is_completed: isCompleted,
      });
    },
    [taskId, handleUpdateTask, isCompleted],
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
          onChange={() =>
            handleUpdateTask({
              id: taskId,
              name: taskName,
              is_completed: !isCompleted,
            })
          }
        />
        <EditablePreview />
      </HStack>
      <EditableInput />
      <EditableControls />
    </Editable>
  );
}
