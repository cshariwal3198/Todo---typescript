import { view } from '../view/view.js';
import { cloudStore } from '../model/cloud-store-service.js';
import { localStore, getTodoLocal } from '../model/local-store-service.js';
import { TodoItem } from '../utils/todo-item.js';
const taskInput = document.querySelector('.form-input');
const taskContainer = document.querySelector('.div-to-display');
const store = document.querySelector('.storage');
let previousSpanValue;
let defaultStorageLocation;
localStorage.setItem('storage', localStorage.getItem('storage') || 'CloudStorage');
const { postMethod, deleteMethodCloud, getTodoCloud, putMethod, deleteAllCloud } = cloudStore();
const { createTodoLocal, editTodoLocal, deleteTodoLocal, deleteAllLocal } = localStore();
const { showEmptyInputError, prepareTask } = view();
// This is master branch, line is just to test.
handlePageRefresh();
function appController() {
    return {
        deleteSingleTask: function (parentElement, value) {
            actualExecutionFunction(async () => {
                const result = await deleteMethodCloud(value.id);
                result.status === 204 && taskContainer.removeChild(parentElement);
            }, () => { deleteTodoLocal(value.name), taskContainer.removeChild(parentElement); });
        },
        editSelectedTask: function (editButton, span, index) {
            if (editButton.innerText === 'Edit') {
                previousSpanValue = span.innerText;
                span.contentEditable = `${true}`;
                span.focus();
                editButton.innerText = 'Save';
            }
            else {
                editButton.innerText = 'Edit';
                span.contentEditable = `${false}`;
                actualExecutionFunction(() => { putMethod(index, span.innerText); }, () => { editTodoLocal(previousSpanValue, span.innerText); });
            }
        },
        adjustCheckValue: async function (check, value) {
            if (check.checked) {
                actualExecutionFunction(() => { putMethod(value.id, value.name, true); }, () => { editTodoLocal(value.name, value.name, true); });
                (check.parentElement?.firstChild).style.textDecoration = 'line-through';
                (check.parentElement?.children[3]).disabled = true;
            }
            else {
                actualExecutionFunction(() => { putMethod(value.id, value.name, false); }, () => { editTodoLocal(value.name, value.name, false); });
                (check.parentElement?.firstChild).style.textDecoration = 'none';
                (check.parentElement?.children[3]).disabled = false;
            }
        }
    };
}
function setTaskToList(event) {
    event.preventDefault();
    const inputValue = taskInput.value;
    showEmptyInputError() && actualExecutionFunction(async () => {
        const postResult = await postMethod(inputValue);
        postResult && prepareTask(postResult);
    }, () => { createTodoLocal(inputValue), prepareTask(new TodoItem(inputValue)); });
}
async function handlePageRefresh() {
    defaultStorageLocation = localStorage.getItem('storage');
    const tasks = (defaultStorageLocation === 'CloudStorage') ? await getTodoCloud() : getTodoLocal();
    tasks.map((task) => prepareTask(task));
    store.innerText = defaultStorageLocation;
}
function switchBetweenStorage() {
    if (confirm(`You are switching your default Storage. Press Ok to proceed`)) {
        actualExecutionFunction(() => { localStorage.setItem('storage', 'LocalStorage'); }, () => { localStorage.setItem('storage', 'CloudStorage'); });
        taskContainer.innerHTML = '';
        handlePageRefresh();
        store.innerText = defaultStorageLocation;
    }
}
async function clearAllTasks() {
    confirm('Your all tasks will be erased, Continue ?') &&
        actualExecutionFunction(async () => {
            let deleteResponse = await deleteAllCloud();
            deleteResponse.status === 200 && (taskContainer.innerHTML = '');
        }, () => { deleteAllLocal(), taskContainer.innerHTML = ''; });
}
function actualExecutionFunction(callback1, callback2) {
    localStorage.getItem('storage') === 'CloudStorage' ? callback1() : callback2();
}
document.querySelector('form').addEventListener('submit', setTaskToList);
store.addEventListener('click', switchBetweenStorage);
document.querySelector('.all-clear').addEventListener('click', clearAllTasks);
export { appController };
