/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/components/base.ts":
/*!********************************!*\
  !*** ./src/components/base.ts ***!
  \********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Component)
/* harmony export */ });
class Component {
    constructor(templateId, renderElemId, insertAtStart, newElemId) {
        this.templateElem = document.getElementById(templateId);
        this.renderElem = document.getElementById(renderElemId);
        const importedNode = document.importNode(this.templateElem.content, true);
        this.element = importedNode.firstElementChild;
        if (newElemId)
            this.element.id = newElemId;
        this.attach(insertAtStart);
    }
    attach(insert) {
        this.renderElem.insertAdjacentElement(insert ? 'afterbegin' : 'beforeend', this.element);
    }
}


/***/ }),

/***/ "./src/components/input.ts":
/*!*********************************!*\
  !*** ./src/components/input.ts ***!
  \*********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Input": () => (/* binding */ Input)
/* harmony export */ });
/* harmony import */ var _state_state__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../state/state */ "./src/state/state.ts");
/* harmony import */ var _base__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./base */ "./src/components/base.ts");


class Input extends _base__WEBPACK_IMPORTED_MODULE_1__["default"] {
    constructor() {
        super('project', 'app', true, 'user-input');
        this.titleElem = this.element.querySelector('#title');
        this.descElem = this.element.querySelector('#description');
        this.peopleElem = this.element.querySelector('#people');
        this.configure();
    }
    configure() {
        this.element.addEventListener('submit', e => {
            e.preventDefault();
            let userInput = [this.titleElem.value, this.descElem.value, +this.peopleElem.value];
            const [title, desc, people] = userInput;
            _state_state__WEBPACK_IMPORTED_MODULE_0__.prjState.addProject(title, desc, people);
            this.titleElem.value = '';
            this.descElem.value = '';
            this.peopleElem.value = '';
        });
    }
    contentRender() { }
}


/***/ }),

/***/ "./src/components/item.ts":
/*!********************************!*\
  !*** ./src/components/item.ts ***!
  \********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Item": () => (/* binding */ Item)
/* harmony export */ });
/* harmony import */ var _base__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./base */ "./src/components/base.ts");

class Item extends _base__WEBPACK_IMPORTED_MODULE_0__["default"] {
    constructor(hostId, project) {
        super('single', hostId, false, project.id);
        this.dragStartHandler = (event) => {
            event.dataTransfer.setData('text/plain', this.project.id);
            event.dataTransfer.effectAllowed = 'move';
        };
        this.dragEndHandler = (_) => { console.log('DragEnd'); };
        this.project = project;
        this.configure();
        this.contentRender();
    }
    get persons() {
        return this.project.people === 1 ? '1 person' : `${this.project.people} persons`;
    }
    configure() {
        this.element.addEventListener('dragstart', this.dragStartHandler);
        this.element.addEventListener('dragend', this.dragEndHandler);
    }
    contentRender() {
        this.element.querySelector('h2').innerText = this.project.title;
        this.element.querySelector('h3').innerText = this.persons + ' assigned';
        this.element.querySelector('p').innerText = this.project.description;
    }
}


/***/ }),

/***/ "./src/components/list.ts":
/*!********************************!*\
  !*** ./src/components/list.ts ***!
  \********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "List": () => (/* binding */ List)
/* harmony export */ });
/* harmony import */ var _models_project__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../models/project */ "./src/models/project.ts");
/* harmony import */ var _base__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./base */ "./src/components/base.ts");
/* harmony import */ var _state_state__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../state/state */ "./src/state/state.ts");
/* harmony import */ var _item__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./item */ "./src/components/item.ts");




class List extends _base__WEBPACK_IMPORTED_MODULE_1__["default"] {
    constructor(type) {
        super('list', 'app', false, `${type}-projects`);
        this.type = type;
        this.dragOverHandler = (event) => {
            if (event.dataTransfer && event.dataTransfer.types[0] === 'text/plain') {
                event.preventDefault();
                const listEl = this.element.querySelector('ul');
                listEl.classList.add('droppable');
            }
        };
        this.dropHandler = (event) => {
            const prjId = event.dataTransfer.getData('text/plain');
            _state_state__WEBPACK_IMPORTED_MODULE_2__.prjState.moveProject(prjId, this.type === 'active' ? _models_project__WEBPACK_IMPORTED_MODULE_0__.ProjectStatus.Active : _models_project__WEBPACK_IMPORTED_MODULE_0__.ProjectStatus.Finished);
        };
        this.dragLeaveHandler = (_) => {
            const listEl = this.element.querySelector('ul');
            listEl.classList.remove('droppable');
        };
        this.assignedProjects = [];
        this.configure();
        this.contentRender();
    }
    configure() {
        this.element.addEventListener('dragover', this.dragOverHandler);
        this.element.addEventListener('dragleave', this.dragLeaveHandler);
        this.element.addEventListener('drop', this.dropHandler);
        _state_state__WEBPACK_IMPORTED_MODULE_2__.prjState.addListener((projects) => {
            const relevantProjects = projects.filter(prj => this.type === 'active' ? prj.status === _models_project__WEBPACK_IMPORTED_MODULE_0__.ProjectStatus.Active : prj.status === _models_project__WEBPACK_IMPORTED_MODULE_0__.ProjectStatus.Finished);
            this.assignedProjects = relevantProjects;
            this.projectsRender();
        });
    }
    contentRender() {
        const listId = `${this.type}-projects-list`;
        this.element.querySelector('ul').id = listId;
        this.element.querySelector('h2').innerText = `${this.type.toUpperCase()}PROJECTS`;
    }
    projectsRender() {
        const listEl = document.getElementById(`${this.type}-projects-list`);
        listEl.innerHTML = '';
        for (const prjItem of this.assignedProjects) {
            new _item__WEBPACK_IMPORTED_MODULE_3__.Item(this.element.querySelector('ul').id, prjItem);
        }
    }
}


/***/ }),

/***/ "./src/models/project.ts":
/*!*******************************!*\
  !*** ./src/models/project.ts ***!
  \*******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Project": () => (/* binding */ Project),
/* harmony export */   "ProjectStatus": () => (/* binding */ ProjectStatus)
/* harmony export */ });
var ProjectStatus;
(function (ProjectStatus) {
    ProjectStatus[ProjectStatus["Active"] = 0] = "Active";
    ProjectStatus[ProjectStatus["Finished"] = 1] = "Finished";
})(ProjectStatus || (ProjectStatus = {}));
class Project {
    constructor(id, title, description, people, status) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.people = people;
        this.status = status;
    }
}


/***/ }),

/***/ "./src/state/state.ts":
/*!****************************!*\
  !*** ./src/state/state.ts ***!
  \****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "State": () => (/* binding */ State),
/* harmony export */   "prjState": () => (/* binding */ prjState)
/* harmony export */ });
/* harmony import */ var _models_project__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../models/project */ "./src/models/project.ts");

class ListenerState {
    constructor() {
        this.listeners = [];
    }
    addListener(listenerFn) {
        this.listeners.push(listenerFn);
    }
}
class State extends ListenerState {
    constructor() {
        super();
        this.projects = [];
    }
    static getInstance() {
        if (this.instance)
            return this.instance;
        this.instance = new State();
        return this.instance;
    }
    addProject(title, desc, nums) {
        const newProject = new _models_project__WEBPACK_IMPORTED_MODULE_0__.Project(Math.random().toString(), title, desc, nums, _models_project__WEBPACK_IMPORTED_MODULE_0__.ProjectStatus.Active);
        this.projects.push(newProject);
        this.updateListeners();
    }
    moveProject(projectId, newStatus) {
        const project = this.projects.find(prj => prj.id === projectId);
        if (project && project.status !== newStatus) {
            project.status = newStatus;
            this.updateListeners();
        }
    }
    updateListeners() {
        for (const listenerFn of this.listeners) {
            listenerFn(this.projects.slice());
        }
    }
}
const prjState = State.getInstance();


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
/*!**********************!*\
  !*** ./src/index.ts ***!
  \**********************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _components_input__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./components/input */ "./src/components/input.ts");
/* harmony import */ var _components_list__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./components/list */ "./src/components/list.ts");


new _components_input__WEBPACK_IMPORTED_MODULE_0__.Input();
new _components_list__WEBPACK_IMPORTED_MODULE_1__.List('active');
new _components_list__WEBPACK_IMPORTED_MODULE_1__.List('finished');

})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnVuZGxlLmpzIiwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7O0FBQWU7QUFDZjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNiMEM7QUFDWDtBQUN4QixvQkFBb0IsNkNBQVM7QUFDcEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsWUFBWSw2REFBbUI7QUFDL0I7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTs7Ozs7Ozs7Ozs7Ozs7OztBQ3RCK0I7QUFDeEIsbUJBQW1CLDZDQUFTO0FBQ25DO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHVDQUF1QztBQUN2QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsMkRBQTJELHFCQUFxQjtBQUNoRjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDekJrRDtBQUNuQjtBQUNXO0FBQ1o7QUFDdkIsbUJBQW1CLDZDQUFTO0FBQ25DO0FBQ0EsdUNBQXVDLEtBQUs7QUFDNUM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxZQUFZLDhEQUFvQixpQ0FBaUMsaUVBQW9CLEdBQUcsbUVBQXNCO0FBQzlHO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsUUFBUSw4REFBb0I7QUFDNUIsb0dBQW9HLGlFQUFvQixrQkFBa0IsbUVBQXNCO0FBQ2hLO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBLDBCQUEwQixVQUFVO0FBQ3BDO0FBQ0Esd0RBQXdELHdCQUF3QjtBQUNoRjtBQUNBO0FBQ0Esa0RBQWtELFVBQVU7QUFDNUQ7QUFDQTtBQUNBLGdCQUFnQix1Q0FBSTtBQUNwQjtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7Ozs7Ozs7QUNqRE87QUFDUDtBQUNBO0FBQ0E7QUFDQSxDQUFDLHNDQUFzQztBQUNoQztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDYjJEO0FBQzNEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSwrQkFBK0Isb0RBQU8sOENBQThDLGlFQUFvQjtBQUN4RztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNPOzs7Ozs7O1VDdENQO1VBQ0E7O1VBRUE7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7O1VBRUE7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7Ozs7O1dDdEJBO1dBQ0E7V0FDQTtXQUNBO1dBQ0EseUNBQXlDLHdDQUF3QztXQUNqRjtXQUNBO1dBQ0E7Ozs7O1dDUEE7Ozs7O1dDQUE7V0FDQTtXQUNBO1dBQ0EsdURBQXVELGlCQUFpQjtXQUN4RTtXQUNBLGdEQUFnRCxhQUFhO1dBQzdEOzs7Ozs7Ozs7Ozs7O0FDTjJDO0FBQ0Y7QUFDekMsSUFBSSxvREFBSztBQUNULElBQUksa0RBQUk7QUFDUixJQUFJLGtEQUFJIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vZHJhZy1kcm9wLy4vc3JjL2NvbXBvbmVudHMvYmFzZS50cyIsIndlYnBhY2s6Ly9kcmFnLWRyb3AvLi9zcmMvY29tcG9uZW50cy9pbnB1dC50cyIsIndlYnBhY2s6Ly9kcmFnLWRyb3AvLi9zcmMvY29tcG9uZW50cy9pdGVtLnRzIiwid2VicGFjazovL2RyYWctZHJvcC8uL3NyYy9jb21wb25lbnRzL2xpc3QudHMiLCJ3ZWJwYWNrOi8vZHJhZy1kcm9wLy4vc3JjL21vZGVscy9wcm9qZWN0LnRzIiwid2VicGFjazovL2RyYWctZHJvcC8uL3NyYy9zdGF0ZS9zdGF0ZS50cyIsIndlYnBhY2s6Ly9kcmFnLWRyb3Avd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vZHJhZy1kcm9wL3dlYnBhY2svcnVudGltZS9kZWZpbmUgcHJvcGVydHkgZ2V0dGVycyIsIndlYnBhY2s6Ly9kcmFnLWRyb3Avd2VicGFjay9ydW50aW1lL2hhc093blByb3BlcnR5IHNob3J0aGFuZCIsIndlYnBhY2s6Ly9kcmFnLWRyb3Avd2VicGFjay9ydW50aW1lL21ha2UgbmFtZXNwYWNlIG9iamVjdCIsIndlYnBhY2s6Ly9kcmFnLWRyb3AvLi9zcmMvaW5kZXgudHMiXSwic291cmNlc0NvbnRlbnQiOlsiZXhwb3J0IGRlZmF1bHQgY2xhc3MgQ29tcG9uZW50IHtcbiAgICBjb25zdHJ1Y3Rvcih0ZW1wbGF0ZUlkLCByZW5kZXJFbGVtSWQsIGluc2VydEF0U3RhcnQsIG5ld0VsZW1JZCkge1xuICAgICAgICB0aGlzLnRlbXBsYXRlRWxlbSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHRlbXBsYXRlSWQpO1xuICAgICAgICB0aGlzLnJlbmRlckVsZW0gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChyZW5kZXJFbGVtSWQpO1xuICAgICAgICBjb25zdCBpbXBvcnRlZE5vZGUgPSBkb2N1bWVudC5pbXBvcnROb2RlKHRoaXMudGVtcGxhdGVFbGVtLmNvbnRlbnQsIHRydWUpO1xuICAgICAgICB0aGlzLmVsZW1lbnQgPSBpbXBvcnRlZE5vZGUuZmlyc3RFbGVtZW50Q2hpbGQ7XG4gICAgICAgIGlmIChuZXdFbGVtSWQpXG4gICAgICAgICAgICB0aGlzLmVsZW1lbnQuaWQgPSBuZXdFbGVtSWQ7XG4gICAgICAgIHRoaXMuYXR0YWNoKGluc2VydEF0U3RhcnQpO1xuICAgIH1cbiAgICBhdHRhY2goaW5zZXJ0KSB7XG4gICAgICAgIHRoaXMucmVuZGVyRWxlbS5pbnNlcnRBZGphY2VudEVsZW1lbnQoaW5zZXJ0ID8gJ2FmdGVyYmVnaW4nIDogJ2JlZm9yZWVuZCcsIHRoaXMuZWxlbWVudCk7XG4gICAgfVxufVxuIiwiaW1wb3J0IHsgcHJqU3RhdGUgfSBmcm9tIFwiLi4vc3RhdGUvc3RhdGVcIjtcbmltcG9ydCBDb21wb25lbnQgZnJvbSBcIi4vYmFzZVwiO1xuZXhwb3J0IGNsYXNzIElucHV0IGV4dGVuZHMgQ29tcG9uZW50IHtcbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgc3VwZXIoJ3Byb2plY3QnLCAnYXBwJywgdHJ1ZSwgJ3VzZXItaW5wdXQnKTtcbiAgICAgICAgdGhpcy50aXRsZUVsZW0gPSB0aGlzLmVsZW1lbnQucXVlcnlTZWxlY3RvcignI3RpdGxlJyk7XG4gICAgICAgIHRoaXMuZGVzY0VsZW0gPSB0aGlzLmVsZW1lbnQucXVlcnlTZWxlY3RvcignI2Rlc2NyaXB0aW9uJyk7XG4gICAgICAgIHRoaXMucGVvcGxlRWxlbSA9IHRoaXMuZWxlbWVudC5xdWVyeVNlbGVjdG9yKCcjcGVvcGxlJyk7XG4gICAgICAgIHRoaXMuY29uZmlndXJlKCk7XG4gICAgfVxuICAgIGNvbmZpZ3VyZSgpIHtcbiAgICAgICAgdGhpcy5lbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ3N1Ym1pdCcsIGUgPT4ge1xuICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgbGV0IHVzZXJJbnB1dCA9IFt0aGlzLnRpdGxlRWxlbS52YWx1ZSwgdGhpcy5kZXNjRWxlbS52YWx1ZSwgK3RoaXMucGVvcGxlRWxlbS52YWx1ZV07XG4gICAgICAgICAgICBjb25zdCBbdGl0bGUsIGRlc2MsIHBlb3BsZV0gPSB1c2VySW5wdXQ7XG4gICAgICAgICAgICBwcmpTdGF0ZS5hZGRQcm9qZWN0KHRpdGxlLCBkZXNjLCBwZW9wbGUpO1xuICAgICAgICAgICAgdGhpcy50aXRsZUVsZW0udmFsdWUgPSAnJztcbiAgICAgICAgICAgIHRoaXMuZGVzY0VsZW0udmFsdWUgPSAnJztcbiAgICAgICAgICAgIHRoaXMucGVvcGxlRWxlbS52YWx1ZSA9ICcnO1xuICAgICAgICB9KTtcbiAgICB9XG4gICAgY29udGVudFJlbmRlcigpIHsgfVxufVxuIiwiaW1wb3J0IENvbXBvbmVudCBmcm9tIFwiLi9iYXNlXCI7XG5leHBvcnQgY2xhc3MgSXRlbSBleHRlbmRzIENvbXBvbmVudCB7XG4gICAgY29uc3RydWN0b3IoaG9zdElkLCBwcm9qZWN0KSB7XG4gICAgICAgIHN1cGVyKCdzaW5nbGUnLCBob3N0SWQsIGZhbHNlLCBwcm9qZWN0LmlkKTtcbiAgICAgICAgdGhpcy5kcmFnU3RhcnRIYW5kbGVyID0gKGV2ZW50KSA9PiB7XG4gICAgICAgICAgICBldmVudC5kYXRhVHJhbnNmZXIuc2V0RGF0YSgndGV4dC9wbGFpbicsIHRoaXMucHJvamVjdC5pZCk7XG4gICAgICAgICAgICBldmVudC5kYXRhVHJhbnNmZXIuZWZmZWN0QWxsb3dlZCA9ICdtb3ZlJztcbiAgICAgICAgfTtcbiAgICAgICAgdGhpcy5kcmFnRW5kSGFuZGxlciA9IChfKSA9PiB7IGNvbnNvbGUubG9nKCdEcmFnRW5kJyk7IH07XG4gICAgICAgIHRoaXMucHJvamVjdCA9IHByb2plY3Q7XG4gICAgICAgIHRoaXMuY29uZmlndXJlKCk7XG4gICAgICAgIHRoaXMuY29udGVudFJlbmRlcigpO1xuICAgIH1cbiAgICBnZXQgcGVyc29ucygpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMucHJvamVjdC5wZW9wbGUgPT09IDEgPyAnMSBwZXJzb24nIDogYCR7dGhpcy5wcm9qZWN0LnBlb3BsZX0gcGVyc29uc2A7XG4gICAgfVxuICAgIGNvbmZpZ3VyZSgpIHtcbiAgICAgICAgdGhpcy5lbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2RyYWdzdGFydCcsIHRoaXMuZHJhZ1N0YXJ0SGFuZGxlcik7XG4gICAgICAgIHRoaXMuZWxlbWVudC5hZGRFdmVudExpc3RlbmVyKCdkcmFnZW5kJywgdGhpcy5kcmFnRW5kSGFuZGxlcik7XG4gICAgfVxuICAgIGNvbnRlbnRSZW5kZXIoKSB7XG4gICAgICAgIHRoaXMuZWxlbWVudC5xdWVyeVNlbGVjdG9yKCdoMicpLmlubmVyVGV4dCA9IHRoaXMucHJvamVjdC50aXRsZTtcbiAgICAgICAgdGhpcy5lbGVtZW50LnF1ZXJ5U2VsZWN0b3IoJ2gzJykuaW5uZXJUZXh0ID0gdGhpcy5wZXJzb25zICsgJyBhc3NpZ25lZCc7XG4gICAgICAgIHRoaXMuZWxlbWVudC5xdWVyeVNlbGVjdG9yKCdwJykuaW5uZXJUZXh0ID0gdGhpcy5wcm9qZWN0LmRlc2NyaXB0aW9uO1xuICAgIH1cbn1cbiIsImltcG9ydCB7IFByb2plY3RTdGF0dXMgfSBmcm9tIFwiLi4vbW9kZWxzL3Byb2plY3RcIjtcbmltcG9ydCBDb21wb25lbnQgZnJvbSBcIi4vYmFzZVwiO1xuaW1wb3J0IHsgcHJqU3RhdGUgfSBmcm9tIFwiLi4vc3RhdGUvc3RhdGVcIjtcbmltcG9ydCB7IEl0ZW0gfSBmcm9tIFwiLi9pdGVtXCI7XG5leHBvcnQgY2xhc3MgTGlzdCBleHRlbmRzIENvbXBvbmVudCB7XG4gICAgY29uc3RydWN0b3IodHlwZSkge1xuICAgICAgICBzdXBlcignbGlzdCcsICdhcHAnLCBmYWxzZSwgYCR7dHlwZX0tcHJvamVjdHNgKTtcbiAgICAgICAgdGhpcy50eXBlID0gdHlwZTtcbiAgICAgICAgdGhpcy5kcmFnT3ZlckhhbmRsZXIgPSAoZXZlbnQpID0+IHtcbiAgICAgICAgICAgIGlmIChldmVudC5kYXRhVHJhbnNmZXIgJiYgZXZlbnQuZGF0YVRyYW5zZmVyLnR5cGVzWzBdID09PSAndGV4dC9wbGFpbicpIHtcbiAgICAgICAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgICAgIGNvbnN0IGxpc3RFbCA9IHRoaXMuZWxlbWVudC5xdWVyeVNlbGVjdG9yKCd1bCcpO1xuICAgICAgICAgICAgICAgIGxpc3RFbC5jbGFzc0xpc3QuYWRkKCdkcm9wcGFibGUnKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICAgICAgdGhpcy5kcm9wSGFuZGxlciA9IChldmVudCkgPT4ge1xuICAgICAgICAgICAgY29uc3QgcHJqSWQgPSBldmVudC5kYXRhVHJhbnNmZXIuZ2V0RGF0YSgndGV4dC9wbGFpbicpO1xuICAgICAgICAgICAgcHJqU3RhdGUubW92ZVByb2plY3QocHJqSWQsIHRoaXMudHlwZSA9PT0gJ2FjdGl2ZScgPyBQcm9qZWN0U3RhdHVzLkFjdGl2ZSA6IFByb2plY3RTdGF0dXMuRmluaXNoZWQpO1xuICAgICAgICB9O1xuICAgICAgICB0aGlzLmRyYWdMZWF2ZUhhbmRsZXIgPSAoXykgPT4ge1xuICAgICAgICAgICAgY29uc3QgbGlzdEVsID0gdGhpcy5lbGVtZW50LnF1ZXJ5U2VsZWN0b3IoJ3VsJyk7XG4gICAgICAgICAgICBsaXN0RWwuY2xhc3NMaXN0LnJlbW92ZSgnZHJvcHBhYmxlJyk7XG4gICAgICAgIH07XG4gICAgICAgIHRoaXMuYXNzaWduZWRQcm9qZWN0cyA9IFtdO1xuICAgICAgICB0aGlzLmNvbmZpZ3VyZSgpO1xuICAgICAgICB0aGlzLmNvbnRlbnRSZW5kZXIoKTtcbiAgICB9XG4gICAgY29uZmlndXJlKCkge1xuICAgICAgICB0aGlzLmVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignZHJhZ292ZXInLCB0aGlzLmRyYWdPdmVySGFuZGxlcik7XG4gICAgICAgIHRoaXMuZWxlbWVudC5hZGRFdmVudExpc3RlbmVyKCdkcmFnbGVhdmUnLCB0aGlzLmRyYWdMZWF2ZUhhbmRsZXIpO1xuICAgICAgICB0aGlzLmVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignZHJvcCcsIHRoaXMuZHJvcEhhbmRsZXIpO1xuICAgICAgICBwcmpTdGF0ZS5hZGRMaXN0ZW5lcigocHJvamVjdHMpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IHJlbGV2YW50UHJvamVjdHMgPSBwcm9qZWN0cy5maWx0ZXIocHJqID0+IHRoaXMudHlwZSA9PT0gJ2FjdGl2ZScgPyBwcmouc3RhdHVzID09PSBQcm9qZWN0U3RhdHVzLkFjdGl2ZSA6IHByai5zdGF0dXMgPT09IFByb2plY3RTdGF0dXMuRmluaXNoZWQpO1xuICAgICAgICAgICAgdGhpcy5hc3NpZ25lZFByb2plY3RzID0gcmVsZXZhbnRQcm9qZWN0cztcbiAgICAgICAgICAgIHRoaXMucHJvamVjdHNSZW5kZXIoKTtcbiAgICAgICAgfSk7XG4gICAgfVxuICAgIGNvbnRlbnRSZW5kZXIoKSB7XG4gICAgICAgIGNvbnN0IGxpc3RJZCA9IGAke3RoaXMudHlwZX0tcHJvamVjdHMtbGlzdGA7XG4gICAgICAgIHRoaXMuZWxlbWVudC5xdWVyeVNlbGVjdG9yKCd1bCcpLmlkID0gbGlzdElkO1xuICAgICAgICB0aGlzLmVsZW1lbnQucXVlcnlTZWxlY3RvcignaDInKS5pbm5lclRleHQgPSBgJHt0aGlzLnR5cGUudG9VcHBlckNhc2UoKX1QUk9KRUNUU2A7XG4gICAgfVxuICAgIHByb2plY3RzUmVuZGVyKCkge1xuICAgICAgICBjb25zdCBsaXN0RWwgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChgJHt0aGlzLnR5cGV9LXByb2plY3RzLWxpc3RgKTtcbiAgICAgICAgbGlzdEVsLmlubmVySFRNTCA9ICcnO1xuICAgICAgICBmb3IgKGNvbnN0IHByakl0ZW0gb2YgdGhpcy5hc3NpZ25lZFByb2plY3RzKSB7XG4gICAgICAgICAgICBuZXcgSXRlbSh0aGlzLmVsZW1lbnQucXVlcnlTZWxlY3RvcigndWwnKS5pZCwgcHJqSXRlbSk7XG4gICAgICAgIH1cbiAgICB9XG59XG4iLCJleHBvcnQgdmFyIFByb2plY3RTdGF0dXM7XG4oZnVuY3Rpb24gKFByb2plY3RTdGF0dXMpIHtcbiAgICBQcm9qZWN0U3RhdHVzW1Byb2plY3RTdGF0dXNbXCJBY3RpdmVcIl0gPSAwXSA9IFwiQWN0aXZlXCI7XG4gICAgUHJvamVjdFN0YXR1c1tQcm9qZWN0U3RhdHVzW1wiRmluaXNoZWRcIl0gPSAxXSA9IFwiRmluaXNoZWRcIjtcbn0pKFByb2plY3RTdGF0dXMgfHwgKFByb2plY3RTdGF0dXMgPSB7fSkpO1xuZXhwb3J0IGNsYXNzIFByb2plY3Qge1xuICAgIGNvbnN0cnVjdG9yKGlkLCB0aXRsZSwgZGVzY3JpcHRpb24sIHBlb3BsZSwgc3RhdHVzKSB7XG4gICAgICAgIHRoaXMuaWQgPSBpZDtcbiAgICAgICAgdGhpcy50aXRsZSA9IHRpdGxlO1xuICAgICAgICB0aGlzLmRlc2NyaXB0aW9uID0gZGVzY3JpcHRpb247XG4gICAgICAgIHRoaXMucGVvcGxlID0gcGVvcGxlO1xuICAgICAgICB0aGlzLnN0YXR1cyA9IHN0YXR1cztcbiAgICB9XG59XG4iLCJpbXBvcnQgeyBQcm9qZWN0LCBQcm9qZWN0U3RhdHVzIH0gZnJvbSAnLi4vbW9kZWxzL3Byb2plY3QnO1xuY2xhc3MgTGlzdGVuZXJTdGF0ZSB7XG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHRoaXMubGlzdGVuZXJzID0gW107XG4gICAgfVxuICAgIGFkZExpc3RlbmVyKGxpc3RlbmVyRm4pIHtcbiAgICAgICAgdGhpcy5saXN0ZW5lcnMucHVzaChsaXN0ZW5lckZuKTtcbiAgICB9XG59XG5leHBvcnQgY2xhc3MgU3RhdGUgZXh0ZW5kcyBMaXN0ZW5lclN0YXRlIHtcbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgc3VwZXIoKTtcbiAgICAgICAgdGhpcy5wcm9qZWN0cyA9IFtdO1xuICAgIH1cbiAgICBzdGF0aWMgZ2V0SW5zdGFuY2UoKSB7XG4gICAgICAgIGlmICh0aGlzLmluc3RhbmNlKVxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuaW5zdGFuY2U7XG4gICAgICAgIHRoaXMuaW5zdGFuY2UgPSBuZXcgU3RhdGUoKTtcbiAgICAgICAgcmV0dXJuIHRoaXMuaW5zdGFuY2U7XG4gICAgfVxuICAgIGFkZFByb2plY3QodGl0bGUsIGRlc2MsIG51bXMpIHtcbiAgICAgICAgY29uc3QgbmV3UHJvamVjdCA9IG5ldyBQcm9qZWN0KE1hdGgucmFuZG9tKCkudG9TdHJpbmcoKSwgdGl0bGUsIGRlc2MsIG51bXMsIFByb2plY3RTdGF0dXMuQWN0aXZlKTtcbiAgICAgICAgdGhpcy5wcm9qZWN0cy5wdXNoKG5ld1Byb2plY3QpO1xuICAgICAgICB0aGlzLnVwZGF0ZUxpc3RlbmVycygpO1xuICAgIH1cbiAgICBtb3ZlUHJvamVjdChwcm9qZWN0SWQsIG5ld1N0YXR1cykge1xuICAgICAgICBjb25zdCBwcm9qZWN0ID0gdGhpcy5wcm9qZWN0cy5maW5kKHByaiA9PiBwcmouaWQgPT09IHByb2plY3RJZCk7XG4gICAgICAgIGlmIChwcm9qZWN0ICYmIHByb2plY3Quc3RhdHVzICE9PSBuZXdTdGF0dXMpIHtcbiAgICAgICAgICAgIHByb2plY3Quc3RhdHVzID0gbmV3U3RhdHVzO1xuICAgICAgICAgICAgdGhpcy51cGRhdGVMaXN0ZW5lcnMoKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICB1cGRhdGVMaXN0ZW5lcnMoKSB7XG4gICAgICAgIGZvciAoY29uc3QgbGlzdGVuZXJGbiBvZiB0aGlzLmxpc3RlbmVycykge1xuICAgICAgICAgICAgbGlzdGVuZXJGbih0aGlzLnByb2plY3RzLnNsaWNlKCkpO1xuICAgICAgICB9XG4gICAgfVxufVxuZXhwb3J0IGNvbnN0IHByalN0YXRlID0gU3RhdGUuZ2V0SW5zdGFuY2UoKTtcbiIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0obW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCIvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9ucyBmb3IgaGFybW9ueSBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSAoZXhwb3J0cywgZGVmaW5pdGlvbikgPT4ge1xuXHRmb3IodmFyIGtleSBpbiBkZWZpbml0aW9uKSB7XG5cdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKGRlZmluaXRpb24sIGtleSkgJiYgIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBrZXkpKSB7XG5cdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywga2V5LCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZGVmaW5pdGlvbltrZXldIH0pO1xuXHRcdH1cblx0fVxufTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSAob2JqLCBwcm9wKSA9PiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgcHJvcCkpIiwiLy8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5yID0gKGV4cG9ydHMpID0+IHtcblx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG5cdH1cblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbn07IiwiaW1wb3J0IHsgSW5wdXQgfSBmcm9tICcuL2NvbXBvbmVudHMvaW5wdXQnO1xuaW1wb3J0IHsgTGlzdCB9IGZyb20gJy4vY29tcG9uZW50cy9saXN0Jztcbm5ldyBJbnB1dCgpO1xubmV3IExpc3QoJ2FjdGl2ZScpO1xubmV3IExpc3QoJ2ZpbmlzaGVkJyk7XG4iXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=