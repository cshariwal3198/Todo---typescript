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
handlePageRefresh();
function appController() {
    return {
        deleteSingleTask: function (parentElement, { id, name }) {
            const deleteFromCloud = async () => {
                if (id) {
                    const result = await deleteMethodCloud(id);
                    result.status === 204 && taskContainer.removeChild(parentElement);
                }
            };
            const deleteFromLocal = () => { deleteTodoLocal(name), taskContainer.removeChild(parentElement); };
            actualExecutionFunction(deleteFromCloud, deleteFromLocal);
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
                const putCloud = function () {
                    const result = putMethod(index, span.innerText);
                    if (!result) {
                        span.innerText = previousSpanValue;
                    }
                };
                actualExecutionFunction(putCloud, editTodoLocal.bind(previousSpanValue, span.innerText));
            }
        },
        adjustCheckValue: function (check, { id, name }) {
            if (check.checked) {
                defaultStorageLocation === "CloudStorage" && id ? putMethod(id, name, true) : editTodoLocal(name, name, true);
                (check.parentElement?.firstChild).style.textDecoration = 'line-through';
                (check.parentElement?.children[3]).disabled = true;
            }
            else {
                defaultStorageLocation === "CloudStorage" && id ? putMethod(id, name, false) : editTodoLocal(name, name, false);
                (check.parentElement?.firstChild).style.textDecoration = 'none';
                (check.parentElement?.children[3]).disabled = false;
            }
        }
    };
}
function setTaskToList(event) {
    event.preventDefault();
    const inputValue = taskInput.value;
    const addToCloud = async () => {
        const postResult = await postMethod(inputValue);
        postResult && prepareTask(postResult);
    };
    const addToLocal = () => { createTodoLocal(inputValue), prepareTask(new TodoItem(inputValue)); };
    showEmptyInputError() && actualExecutionFunction(addToCloud, addToLocal);
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
function clearAllTasks() {
    const eraseFromCloud = async () => {
        const deleteResponse = await deleteAllCloud();
        deleteResponse.status === 200 && (taskContainer.innerHTML = '');
    };
    const eraseFromLocal = () => { deleteAllLocal(), taskContainer.innerHTML = ''; };
    confirm('Your all tasks will be erased, Continue ?') &&
        actualExecutionFunction(eraseFromCloud, eraseFromLocal);
}
function actualExecutionFunction(callback1, callback2) {
    localStorage.getItem('storage') === 'CloudStorage' ? callback1() : callback2();
}
document.querySelector('form').addEventListener('submit', setTaskToList);
store.addEventListener('click', switchBetweenStorage);
document.querySelector('.all-clear').addEventListener('click', clearAllTasks);
export { appController };
