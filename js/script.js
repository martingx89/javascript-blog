"use strict";

function titleClickHandler() {
	const links = document.querySelectorAll(".titles a");
	console.log(links);
}

const buttonTest = document.getElementById("button-test");

buttonTest.addEventListener("click", titleClickHandler);
