import { appController, IValueObjectType } from '../controller/app-controller.js'

const taskContainer = document.querySelector('.div-to-display') as HTMLDivElement
const taskInputBlock = document.querySelector('.form-input') as HTMLInputElement
const inputError = document.querySelector('#error-div') as HTMLDivElement

function view() {
    return {

        prepareTask: function (value: IValueObjectType): void {
            let paraBlock = createNewElement('p')
            let span = createNewElement('span', value.name)
            appendElementToParent(paraBlock, span)
            appendElementToParent(paraBlock, createCheckBoxElement('change', span, value))
            appendElementToParent(paraBlock, createDeleteButton('click', value))
            appendElementToParent(paraBlock, createEditButton('click', span, value))
            appendElementToParent(taskContainer, paraBlock)
            taskInputBlock.value = ''
        },

        showEmptyInputError: function (): boolean {
            if (!taskInputBlock.value) {
                inputError.innerHTML = '** please enter a task'
                return false
            } else {
                inputError.innerHTML = ''
                return true
            }
        }
    }
}


function createNewElement(elementName: string, text?: string): HTMLElement {
    const newElement = document.createElement(elementName)
    text && (newElement.innerText = text)
    return newElement
}

function appendElementToParent(parent: HTMLElement, child: HTMLElement): void {
    parent.appendChild(child)
}

function createEditButton(event: string, span: HTMLSpanElement, {id, isCompleted}: IValueObjectType): HTMLButtonElement {
    const editButton = createNewElement('button', 'Edit') as HTMLButtonElement
    isCompleted && (editButton.disabled = true)
    id && editButton.addEventListener(event, handleEdit(editButton, span, id))
    return editButton;
}

function createDeleteButton(event: string, value: IValueObjectType): HTMLButtonElement {
    const deleteButton = createNewElement('button', 'X') as HTMLButtonElement
    deleteButton.addEventListener(event, handleDelete(deleteButton, value))
    return deleteButton;
}

function createCheckBoxElement(event: string, span: HTMLSpanElement, value: IValueObjectType): HTMLInputElement {
    const check = createNewElement('input') as HTMLInputElement
    check.type = 'checkbox'
    value.isCompleted && (check.checked = true, span.style.textDecoration = 'line-through')
    check.addEventListener(event, handleCheck(check, value))
    return check;
}

const { deleteSingleTask, editSelectedTask, adjustCheckValue } = appController()
const eventsHandlerFunctions = {
    handleDelete: (deleteButton: HTMLElement, value: IValueObjectType) => () => {
        deleteSingleTask((deleteButton.parentNode as HTMLElement), value)
    },

    handleEdit: (editButton: HTMLButtonElement, span: HTMLSpanElement, id: number) => () => {
        editSelectedTask(editButton, span, id)
    },

    handleCheck: (check: HTMLInputElement, value: IValueObjectType) => () => {
        adjustCheckValue(check, value)
    },
}
const { handleDelete, handleCheck, handleEdit } = eventsHandlerFunctions

export { view }