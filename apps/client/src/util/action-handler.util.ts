export function getButtonText(currentAction: 'add' | 'edit' | 'delete') {
  let buttonText = '';

  if (currentAction === 'add') {
    buttonText = 'Add';
  } else if (currentAction === 'edit') {
    buttonText = 'Save';
  } else {
    buttonText = 'Yes, delete';
  }

  return buttonText;
}

export function isActionAddOrEdit(currentAction: 'add' | 'edit' | 'delete') {
  return ['add', 'edit'].includes(currentAction);
}
