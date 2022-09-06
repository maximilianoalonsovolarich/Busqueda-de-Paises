var ciudades = [];
var inputElem = null;
var resultadosElem = null;
var indexActivo = 0;
var filtrarResultados = [];

function init() {
    fetch("https://restcountries.com/v3.1/all")
        .then((response) => response.json())
        .then((data) => (ciudades = data));

    resultadosElem = document.querySelector("ul");
    inputElem = document.querySelector("input");

    resultadosElem.addEventListener("click", (event) => {
        handleResultClick(event);
    });
    inputElem.addEventListener("input", (event) => {
        autocomplete(event);
    });
    inputElem.addEventListener("keyup", (event) => {
        handleResultKeyDown(event);
    });
}

function autocomplete(event) {
    const value = inputElem.value;
    if (!value) {
        hideResults();
        inputElem.value = "";
        return;
    }
    filtrarResultados = ciudades.filter((ciudad) => {
        return ciudad.name.common.toLowerCase().startsWith(value.toLowerCase());
    });

    resultadosElem.innerHTML = filtrarResultados
        .map((result, index) => {
            const isSelected = index === 0;
            return `
        <li
          id='autocomplete-result-${index}'
          class='autocomplete-result${isSelected ? " selected" : ""}'
          role='option'
          ${isSelected ? "aria-selected='true'" : ""}
        >
          ${result.name.common}
        </li>
      `;
        })
        .join("");
    resultadosElem.classList.remove("hidden");
}

function handleResultClick() {
    if (event.target && event.target.nodeName === "LI") {
        selectItem(event.target);
    }
}
function handleResultKeyDown(event) {
    const { key } = event;
    const activeItem = this.getItemAt(indexActivo);
    if (activeItem) {
        activeItem.classList.remove('selected');
        activeItem.setAttribute('aria-selected', 'false');
    }
    switch (key) {
        case "Backspace":
            return;
        case "Escape":
            hideResults();
            inputElem.value = "";
            return;
        case "ArrowUp": {
            if (indexActivo === 0) {
                indexActivo = filtrarResultados.length - 1;
            }
            indexActivo--;
            break;
        }
        case "ArrowDown": {
            if (indexActivo === filtrarResultados.length - 1) {
                indexActivo = 0;
            }
            indexActivo++;
            break;
        }
        default:
            selectFirstResult();
    }
    console.log(indexActivo);
    selectResult();
}
function selectFirstResult() {
    indexActivo = 0;
}

function selectResult() {
    const value = inputElem.value;
    const autocompleteValue = filtrarResultados[indexActivo].name.common;
    const activeItem = this.getItemAt(indexActivo);
    if (activeItem) {
        activeItem.classList.add('selected');
        activeItem.setAttribute('aria-selected', 'true');
    }
    if (!value || !autocompleteValue) {
        return;
    }
    if (value !== autocompleteValue) {
        inputElem.value = autocompleteValue;
        inputElem.setSelectionRange(value.length, autocompleteValue.length);
    }
}
function selectItem(node) {
    if (node) {
        console.log(node);
        inputElem.value = node.innerText;
        hideResults();
    }
}

function hideResults() {
    this.resultsElem.innerHTML = "";
    this.resultsElem.classList.add("hidden");
}

function getItemAt(index) {
    return this.resultsElem.querySelector(`#autocomplete-result-${index}`)
}

init();