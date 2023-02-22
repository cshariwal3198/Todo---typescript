// export function TodoItem(name: string, isCompleted: boolean = false, index: number)
//     : { name: string, isCompleted: boolean, id: number } {
//     return {
//         name: name,
//         isCompleted: isCompleted,
//         id: index,
//     }
// }
export class TodoItem {
    constructor(name, isCompleted = false, index) {
        this.name = name;
        this.isCompleted = isCompleted;
        this.id = index;
    }
}
