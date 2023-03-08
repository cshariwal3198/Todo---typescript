import { view } from '../view/view.js';
import { cloudStore } from '../model/cloud-store-service.js';
import { localStore, getTodoLocal } from '../model/local-store-service.js';
import { TodoItem, IValueObjectType } from '../utils/todo-item.js';

const taskInput = document.querySelector('.form-input') as HTMLInputElement
const taskContainer = document.querySelector('.div-to-display') as HTMLDivElement
const store = document.querySelector('.storage') as HTMLButtonElement
let previousSpanValue: string;

let defaultStorageLocation: string;
localStorage.setItem('storage', localStorage.getItem('storage') || 'CloudStorage')

const { postMethod, deleteMethodCloud, getTodoCloud, putMethod, deleteAllCloud } = cloudStore()
const { createTodoLocal, editTodoLocal, deleteTodoLocal, deleteAllLocal } = localStore()
const { showEmptyInputError, prepareTask } = view()

// testline to check changes in master

handlePageRefresh()

function appController() {
    return {
        deleteSingleTask: function (parentElement: HTMLElement, { id, name }: IValueObjectType) {
            const _deleteFromCloud = async () => {
                if (id) {
                    const result = await deleteMethodCloud(id)
                    result.status === 204 && taskContainer.removeChild(parentElement)
                }
            }
            const _deleteFromLocal = () => { deleteTodoLocal(name), taskContainer.removeChild(parentElement) }
            actualExecutionFunction(_deleteFromCloud, _deleteFromLocal)
        },

        editSelectedTask: function (editButton: HTMLButtonElement, span: HTMLSpanElement, index: number) {
            if (editButton.innerText === 'Edit') {
                previousSpanValue = span.innerText
                span.contentEditable = `${true}`
                span.focus()
                editButton.innerText = 'Save'
            } else {
                editButton.innerText = 'Edit'
                span.contentEditable = `${false}`
                const _putCloud = () => {
                    const result = putMethod(index, span.innerText)
                    if (!result) {
                        span.innerText = previousSpanValue
                    }
                }
                actualExecutionFunction(_putCloud, editTodoLocal.bind(previousSpanValue, span.innerText))
            }
        },

        adjustCheckValue: function (check: HTMLInputElement, { id, name }: IValueObjectType) {
            if (check.checked) {
                defaultStorageLocation === 'CloudStorage' && id ? putMethod(id, name, true) : editTodoLocal(name, name, true);
                (check.parentElement?.firstChild as HTMLSpanElement).style.textDecoration = 'line-through';
                (check.parentElement?.children[3] as HTMLButtonElement).disabled = true
            } else {
                defaultStorageLocation === 'CloudStorage' && id ? putMethod(id, name, false) : editTodoLocal(name, name, false);
                (check.parentElement?.firstChild as HTMLSpanElement).style.textDecoration = 'none';
                (check.parentElement?.children[3] as HTMLButtonElement).disabled = false
            }
        }
    }
}

function setTaskToList(event: Event) {
    event.preventDefault()
    const inputValue: string = taskInput.value;
    const _addToCloud = async () => {
        const postResult = await postMethod(inputValue)
        postResult && prepareTask(postResult)
    }
    const _addToLocal = () => { createTodoLocal(inputValue), prepareTask(new TodoItem(inputValue)) }
    showEmptyInputError() && actualExecutionFunction(_addToCloud, _addToLocal)
}

async function handlePageRefresh() {
    defaultStorageLocation = localStorage.getItem('storage') as string;
    const tasks = (defaultStorageLocation === 'CloudStorage') ? await getTodoCloud() : getTodoLocal()
    tasks.map((task: IValueObjectType) => prepareTask(task))
    store.innerText = defaultStorageLocation
}

function switchBetweenStorage() {
    if (confirm(`You are switching your default Storage. Press Ok to proceed`)) {
        actualExecutionFunction(() => { localStorage.setItem('storage', 'LocalStorage') },
            () => { localStorage.setItem('storage', 'CloudStorage') })
        taskContainer.innerHTML = ''
        handlePageRefresh();
        store.innerText = defaultStorageLocation;
    }
}

function clearAllTasks() {
    const _eraseFromCloud = async () => {
        const deleteResponse = await deleteAllCloud()
        deleteResponse.status === 200 && (taskContainer.innerHTML = '')
    }
    const _eraseFromLocal = () => { deleteAllLocal(), taskContainer.innerHTML = '' }
    confirm('Your all tasks will be erased, Continue ?') &&
        actualExecutionFunction(_eraseFromCloud, _eraseFromLocal)
}

function actualExecutionFunction(callback1: Function, callback2: Function): void {
    localStorage.getItem('storage') === 'CloudStorage' ? callback1() : callback2()
}

(document.querySelector('form') as HTMLFormElement).addEventListener('submit', setTaskToList);
store.addEventListener('click', switchBetweenStorage);
(document.querySelector('.all-clear') as HTMLButtonElement).addEventListener('click', clearAllTasks)

export { appController, IValueObjectType }
