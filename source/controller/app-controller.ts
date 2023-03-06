import { view } from '../view/view.js';
import { cloudStore } from '../model/cloud-store-service.js';
import { localStore, getTodoLocal } from '../model/local-store-service.js';
import { TodoItem, IvalueObjectType } from '../utils/todo-item.js';

const taskInput = document.querySelector('.form-input') as HTMLInputElement
const taskContainer = document.querySelector('.div-to-display') as HTMLDivElement
const store = document.querySelector('.storage') as HTMLButtonElement
let previousSpanValue : string = ''
 
let defaultStorageLocation : string;
localStorage.setItem('storage', localStorage.getItem('storage') || 'CloudStorage')

const { postMethod, deleteMethodCloud, getTodoCloud, putMethod, deleteAllCloud } = cloudStore()
const { createTodoLocal, editTodoLocal, deleteTodoLocal, deleteAllLocal } = localStore()
const { showEmptyInputError, prepareTask } = view()

// This is master branch, line is just to test.

handlePageRefresh()

function appController() {
    return {
        deleteSingleTask: function (parentElement: HTMLElement, value: IvalueObjectType) {
            actualExecutionFunction(async () => {
                const result = await deleteMethodCloud(value.id as number)
                result.status === 204 && taskContainer.removeChild(parentElement)
            }, () => { deleteTodoLocal(value.name), taskContainer.removeChild(parentElement) })
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
                actualExecutionFunction(() => { putMethod(index, span.innerText) },
                    () => { editTodoLocal(previousSpanValue, span.innerText) })
            }
        },

        adjustCheckValue: async function (check: HTMLInputElement, value: IvalueObjectType) {
            if (check.checked) {
                actualExecutionFunction(() => { putMethod(value.id as number, value.name, true) },
                    () => { editTodoLocal(value.name, value.name, true) });
                (check.parentElement?.firstChild as HTMLSpanElement).style.textDecoration = 'line-through';
                (check.parentElement?.children[3] as HTMLButtonElement).disabled = true
            } else {
                actualExecutionFunction(() => { putMethod(value.id as number, value.name, false) },
                    () => { editTodoLocal(value.name, value.name, false) });
                (check.parentElement?.firstChild as HTMLSpanElement).style.textDecoration = 'none';
                (check.parentElement?.children[3] as HTMLButtonElement).disabled = false
            }
        }
    }
}

function setTaskToList(event: Event) {
    event.preventDefault()
    const inputValue: string = taskInput.value;
    showEmptyInputError() && actualExecutionFunction(async () => {
        const postResult = await postMethod(inputValue)
        postResult && prepareTask(postResult)
    }, () => { createTodoLocal(inputValue), prepareTask(new TodoItem(inputValue)) })
}

async function handlePageRefresh() {
    defaultStorageLocation = localStorage.getItem('storage') as string;
    const tasks: IvalueObjectType[] = (defaultStorageLocation === 'CloudStorage') ? await getTodoCloud() : getTodoLocal()
    tasks.map((task: IvalueObjectType) => prepareTask(task))
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

async function clearAllTasks() {
    confirm('Your all tasks will be erased, Continue ?') &&
        actualExecutionFunction(async () => {
            let deleteResponse = await deleteAllCloud()
            deleteResponse.status === 200 && (taskContainer.innerHTML = '')
        },
            () => { deleteAllLocal(), taskContainer.innerHTML = '' })
}

function actualExecutionFunction(callback1: Function, callback2: Function): void {
    localStorage.getItem('storage') === 'CloudStorage' ? callback1() : callback2()
}

(document.querySelector('form') as HTMLFormElement).addEventListener('submit', setTaskToList);
store.addEventListener('click', switchBetweenStorage);
(document.querySelector('.all-clear') as HTMLButtonElement).addEventListener('click', clearAllTasks)

export { appController, IvalueObjectType }