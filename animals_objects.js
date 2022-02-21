"use strict";

window.addEventListener("DOMContentLoaded", start);

const allAnimals = [];

function start() {
    console.log("ready");

    loadJSON();
}


function loadJSON() {
    fetch("animals.json")
        .then(response => response.json())
        .then(jsonData => {
            // when loaded, prepare objects
            prepareObjects(jsonData);
        });
}

function prepareObjects(jsonData) {
    jsonData.forEach(jsonObject => {
        const fullName = jsonObject.fullname;
        const firstSpace = fullName.indexOf(" ");
        const secondSpace = fullName.indexOf(" ", firstSpace + 1);
        const lastSpace = fullName.lastIndexOf(" ");
        const name = fullName.substring(0, firstSpace);
        const type = fullName.substring(lastSpace);
        const desc = fullName.substring(secondSpace, lastSpace);
        const age = jsonObject.age;
        console.log(name, type, desc, age);


        // TODO: Create new object with cleaned data - and store that in the allAnimals array
        const animal = Object.create(Animal);
        animal.name = name;
        animal.type = type;
        animal.desc = desc;
        animal.age = age;
        // TODO: MISSING CODE HERE !!!
        allAnimals.push(animal);
    });

    displayList();
}

function displayList() {
    // clear the list
    document.querySelector("#list tbody").innerHTML = "";

    // build a new list
    allAnimals.forEach(displayAnimal);
}

function displayAnimal(animal) {
    // create clone
    const clone = document.querySelector("template#animal").content.cloneNode(true);

    // set clone data
    clone.querySelector("[data-field=name]").textContent = animal.name;
    clone.querySelector("[data-field=desc]").textContent = animal.desc;
    clone.querySelector("[data-field=type]").textContent = animal.type;
    clone.querySelector("[data-field=age]").textContent = animal.age;

    // append clone to list
    document.querySelector("#list tbody").appendChild(clone);
}

const Animal = {
    name: "",
    type: "",
    desc: "",
    age: ""
}