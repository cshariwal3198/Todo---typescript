const form = document.querySelector(".form") as HTMLFormElement
const taskContainer = document.querySelector(".div-to-display") as HTMLDivElement
const taskInputBlock = document.querySelector(".form-input") as HTMLInputElement
const inputError = document.querySelector("#error-div")
const allClear = document.querySelector(".all-clear") as HTMLButtonElement

function view(){
    return {
        createNewElement : function(elementName : string,text?: string) : HTMLElement{
            const newElement = document.createElement(elementName)
            text && (newElement.innerText = text)
            return newElement
        },

        appendElementToParent : function(parent : HTMLElement, child : HTMLElement) : void{
            parent.appendChild(child)
        },

        createEditButton : function() : HTMLElement{
            const editButton = this.createNewElement("button","Edit")
            editButton.addEventListener("click", ()=>"")
            return editButton
        },

        createDeleteButton : function() : HTMLElement{
            const deleteButton = this.createNewElement("button","X")
            deleteButton.addEventListener("click", ()=>"")
            return deleteButton
        },

        prepareTask : function(value : {id : number | string, name : string, isCompleted : boolean}) : void{
            let paraBlock = this.createNewElement("p")
            let span = this.createNewElement("span",value.name)
            this.appendElementToParent(paraBlock,span)
            this.appendElementToParent(paraBlock,this.createDeleteButton())
            this.appendElementToParent(paraBlock,this.createEditButton())
            this.appendElementToParent(taskContainer,paraBlock)
        },
    }
}

console.log("first program in typescript")
view().prepareTask({id:1, name : "peter", isCompleted : false})