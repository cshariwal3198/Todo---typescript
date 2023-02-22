"use strict";
const form = document.querySelector(".form");
const taskContainer = document.querySelector(".div-to-display");
const taskInputBlock = document.querySelector(".form-input");
const inputError = document.querySelector("#error-div");
const allClear = document.querySelector(".all-clear");
function view() {
    return {
        createNewElement: function (elementName, text) {
            const newElement = document.createElement(elementName);
            text && (newElement.innerText = text);
            return newElement;
        },
        appendElementToParent: function (parent, child) {
            parent.appendChild(child);
        },
        createEditButton: function () {
            const editButton = this.createNewElement("button", "Edit");
            editButton.addEventListener("click", () => "");
            return editButton;
        },
        createDeleteButton: function () {
            const deleteButton = this.createNewElement("button", "X");
            deleteButton.addEventListener("click", () => "");
            return deleteButton;
        },
        prepareTask: function (value) {
            let paraBlock = this.createNewElement("p");
            let span = this.createNewElement("span", value.name);
            this.appendElementToParent(paraBlock, span);
            this.appendElementToParent(paraBlock, this.createDeleteButton());
            this.appendElementToParent(paraBlock, this.createEditButton());
            this.appendElementToParent(taskContainer, paraBlock);
        },
    };
}
console.log("first program in typescript");
view().prepareTask({ id: 1, name: "peter", isCompleted: false });
