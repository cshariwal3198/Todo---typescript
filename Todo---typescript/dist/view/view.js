import { appController } from '../controller/app-controller.js';
const taskContainer = document.querySelector('.div-to-display');
const taskInputBlock = document.querySelector('.form-input');
const inputError = document.querySelector('#error-div');
function view() {
    return {
        prepareTask: function (value) {
            let paraBlock = createNewElement('p');
            let span = createNewElement('span', value.name);
            appendElementToParent(paraBlock, span);
            appendElementToParent(paraBlock, createCheckBoxElement('change', span, value));
            appendElementToParent(paraBlock, createDeleteButton('click', value));
            appendElementToParent(paraBlock, createEditButton('click', span, value));
            appendElementToParent(taskContainer, paraBlock);
            taskInputBlock.value = '';
        },
        showEmptyInputError: function () {
            if (!taskInputBlock.value) {
                inputError.innerHTML = '** please enter a task';
                return false;
            }
            else {
                inputError.innerHTML = '';
                return true;
            }
        }
    };
}
function createNewElement(elementName, text) {
    const newElement = document.createElement(elementName);
    text && (newElement.innerText = text);
    return newElement;
}
function appendElementToParent(parent, child) {
    parent.appendChild(child);
}
function createEditButton(event, span, { id, isCompleted }) {
    const editButton = createNewElement('button', 'Edit');
    isCompleted && (editButton.disabled = true);
    id && editButton.addEventListener(event, handleEdit(editButton, span, id));
    return editButton;
}
function createDeleteButton(event, value) {
    const deleteButton = createNewElement('button', 'X');
    deleteButton.addEventListener(event, handleDelete(deleteButton, value));
    return deleteButton;
}
function createCheckBoxElement(event, span, value) {
    const check = createNewElement('input');
    check.type = 'checkbox';
    value.isCompleted && (check.checked = true, span.style.textDecoration = 'line-through');
    check.addEventListener(event, handleCheck(check, value));
    return check;
}
const { deleteSingleTask, editSelectedTask, adjustCheckValue } = appController();
const eventsHandlerFunctions = {
    handleDelete: (deleteButton, value) => () => {
        deleteSingleTask(deleteButton.parentNode, value);
    },
    handleEdit: (editButton, span, id) => () => {
        editSelectedTask(editButton, span, id);
    },
    handleCheck: (check, value) => () => {
        adjustCheckValue(check, value);
    },
};
const { handleDelete, handleCheck, handleEdit } = eventsHandlerFunctions;
export { view };
