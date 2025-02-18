// are we yellowing?
let yellowing = false;

// compact the web page for screenshots
function compact() {
	[...document.querySelectorAll('*')].forEach((e) => {
		e.style.marginTop = "0px";
		e.style.marginBottom = "0px";
		e.style.paddingTop = "0px";
		e.style.paddingBottom = "0px";
		e.style.lineHeight = "";
		// PENDING: scrollbar, remove !important
	});
}

// KeyboardEvent handler
function onKeyUp(event) {
	if (event.altKey === true && event.code === 'KeyC') {
		compact();
	}
	if (event.altKey === true && event.code === 'KeyY') {
		yellowing = !yellowing; // toggle yellowing
	}
	if (event.altKey === true && event.code === 'KeyG') {
		// grayscale the last clicked element (remember to click the element)
		if (lastMouseClick) {
			grayscale_all_but(lastMouseClick);
		}
	}
}

// highlight the specified element yellow
// press ALT+Y to start highlighting elements on mouse over to find the desired element, press ALT+Y again to stop
function highlight(element) {
	// highlight this element yellow
	const originalBackgroundColor = element.style.backgroundColor;
	element.style.backgroundColor = '#' + Math.floor(Math.random() * 16777215).toString(16);
	window.setTimeout(function () {
		element.style.backgroundColor = originalBackgroundColor;
	}, 100);
	// highlight the children elements yellow
	[...element.children].forEach((child) => highlight(child));
}

// grayscale the entire page except the specified element
// solution by ChatGPT
function grayscale_all_but(element) {
	// Apply grayscale filter to all elements
	Array.from(document.querySelectorAll('body *')).forEach((e) => {
		e.style.filter = 'grayscale(100%)';
	});
	// Function to remove filter from an element
	function removeFilter(e) {
		e.style.filter = 'none';
	}
	// Remove filter from the specified element
	removeFilter(element);
	// Remove filter from all descendants of the specified element
	Array.from(element.querySelectorAll('*')).forEach(removeFilter);
	// Remove filter from all ancestors of the specified element
	let parent = element.parentElement;
	while (parent != null) {
		removeFilter(parent);
		parent = parent.parentElement;
	}
}

// MouseEvent handler
function onMouseOver(event) {
	if (yellowing) {
		highlight(event.target);
	}
}

// PointerEvent handler
let lastMouseClick;
function onClick(event) {
	lastMouseClick = event.target;
	if (yellowing) {
		if (event.target.style.backgroundColor === 'yellow') {
			event.target.style.backgroundColor = '';
		} else {
			event.target.style.backgroundColor = 'yellow';
		}
	}
}

if (window === top) {
	window.addEventListener('keyup', onKeyUp, false);
	window.addEventListener('mouseover', onMouseOver, false);
	window.addEventListener('click', onClick, false);
}
