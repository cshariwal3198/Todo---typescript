import { view } from '../view/view.js';
import { cloudStore } from '../model/cloud-store-service.js';
import { localStore, getTodoLocal } from '../model/local-store-service.js';
import { TodoItem } from '../utils/todo-item.js';
const taskInput = document.querySelector('.form-input');
const taskContainer = document.querySelector('.div-to-display');
const store = document.querySelector('.storage');
let previousSpanValue;
let lsGet;
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
                // const put = () => { putMethod(index, span.innerText) }
                // const edit = () => { editTodoLocal(previousSpanValue, span.innerText) }
                actualExecutionFunction(putMethod.prototype.bind(index, span.innerText), editTodoLocal.bind(previousSpanValue, span.innerText));
            }
        },
        adjustCheckValue: function (check, { id, name }) {
            if (check.checked) {
                actualExecutionFunction(putMethod.prototype.bind(id, name, true), editTodoLocal.prototype.bind(name, name, true));
                (check.parentElement?.firstChild).style.textDecoration = 'line-through';
                (check.parentElement?.children[3]).disabled = true;
            }
            else {
                actualExecutionFunction(putMethod.prototype.bind(id, name, false), editTodoLocal.prototype.bind(name, name, false));
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
    lsGet = localStorage.getItem('storage');
    const tasks = (lsGet === 'CloudStorage') ? await getTodoCloud() : getTodoLocal();
    tasks.map((task) => prepareTask(task));
    store.innerText = lsGet;
}
function switchBetweenStorage() {
    if (confirm(`You are switching your default Storage. Press Ok to proceed`)) {
        actualExecutionFunction(() => { localStorage.setItem('storage', 'LocalStorage'); }, () => { localStorage.setItem('storage', 'CloudStorage'); });
        taskContainer.innerHTML = '';
        handlePageRefresh();
        store.innerText = lsGet;
    }
}
function clearAllTasks() {
    const eraseFromCloud = async () => {
        let deleteResponse = await deleteAllCloud();
        deleteResponse.status === 200 && (taskContainer.innerHTML = '');
    };
    const eraseFromeLocal = () => { deleteAllLocal(), taskContainer.innerHTML = ''; };
    confirm('Your all tasks will be erased, Continue ?') &&
        actualExecutionFunction(eraseFromCloud, eraseFromeLocal);
}
function actualExecutionFunction(callback1, callback2) {
    localStorage.getItem('storage') === 'CloudStorage' ? callback1() : callback2();
}
document.querySelector('form').addEventListener('submit', setTaskToList);
store.addEventListener('click', switchBetweenStorage);
document.querySelector('.all-clear').addEventListener('click', clearAllTasks);
export { appController };
