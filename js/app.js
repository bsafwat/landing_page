/**
 * 
 * Manipulating the DOM exercise.
 * Exercise programmatically builds navigation,
 * scrolls to anchors from navigation,
 * and highlights section in viewport upon scrolling.
 * 
 * Dependencies: None
 * 
 * JS Version: ES2015/ES6
 * 
 * JS Standard: ESlint
 * 
*/

/**
 * Define Global Variables
 * 
 */
const docSections = document.querySelectorAll('section');
let activeSection = docSections[0];
let activeSectionId = activeSection.getAttribute('id');

const navList = document.getElementById('navbar__list');
let activeMenuItemName = '';

let lastScrollY = 0;
const mainElement = document.getElementsByTagName('main')[0];
/**
 * End of Global Variables
**/

/**
 * Begin Helper Functions 
**/
function isClassExist(searchedClassName, classList) {
	for( className of classList) {
		if(searchedClassName === className) {
			return true;
		}
	}
	return false;
}


function isInViewport(element) {
	const sectionRect = element.getBoundingClientRect();
    
	// Assume that active section is where its height occupies > 50% of viewport
	// i.e. (bottom - top) > (0.5 * h)  &&  
	// to handle the case that the section is totally below viewport, check 
		// if (bottom < 0) then NOT active
		// if (top > h) then NOT active
    		
	// section is totally before or after viewport
	if ( sectionRect.bottom < 0 || 
		sectionRect.top > (window.innerHeight || document.documentElement.clientHeight) ) {
		return false;
	} 

	// top >=0 && bottom >= h
		// if top > 0.5 h ==> not active
	if ( sectionRect.top >= 0 && 
		sectionRect.bottom >= (window.innerHeight || document.documentElement.clientHeight) &&
		sectionRect.top <= (0.5 * (window.innerHeight || document.documentElement.clientHeight) )
		) {
		return true;
	} 

	// section's size < viewport height 
	// need to check that it occupies > 50% of viewport , i.e. (bottom - top) > (0.5 * h)
	// top >=0 && bottom < h  // prob that another section appears
		// if bootom < 0.5 * h ==> not active
	if ( sectionRect.top >= 0 && 
		sectionRect.bottom < (window.innerHeight || document.documentElement.clientHeight) &&
		(sectionRect.bottom - sectionRect.top) > (0.5 * (window.innerHeight || document.documentElement.clientHeight) )
		// sectionRect.bottom >= (0.5 * (window.innerHeight || document.documentElement.clientHeight) )
		) {
		return true;
	}		

	// section size > viewport //
	// top <0 && bottom >= h  ==> True
	if ( sectionRect.top < 0 && 
		sectionRect.bottom >= (window.innerHeight || document.documentElement.clientHeight) ) {
		return true;
	} 

	// top <0 && bottom < h   // prob that another section appears
		// if bootom < 0.5 * h ==> not active
	if ( sectionRect.top < 0 && 
		sectionRect.bottom < (window.innerHeight || document.documentElement.clientHeight) &&
		sectionRect.bottom > (0.5 * (window.innerHeight || document.documentElement.clientHeight) )
		) {
		return true;
	} 

	// otherwise
	return false;
}
   	
/**
 * End Helper Functions
***************************/

/***
 *** Begin Main Functions ***
***/


/**/ 
// ** Begin of nav menu functions **

// * Handling nav menu actions
//
function controlMenuDisplay(newScrollY) {
	const autoHideClass = 'auto__hide__header';
    const pageHeader = document.getElementById('header1');
    const headerClasses = pageHeader.classList;
    
  if( newScrollY > lastScrollY) {
  	// scroll down 
  	// hide the menu
  	if( ! isClassExist(autoHideClass, headerClasses) ){
  		pageHeader.classList.add("auto__hide__header");
  	}  	
  } else {
  	// scroll up 
  	// display the menu
  	if( isClassExist(autoHideClass, headerClasses) ){
  		pageHeader.classList.remove("auto__hide__header");
  	}
  }
  // tracking lastScrollY is moved after controlToTopButton
  // lastScrollY = newScrollY;
}

function setActiveMenuItem(...itemNames) {		
	if(itemNames.length > 1) {
		const oldItem = document.getElementById(itemNames[1].split(' ')[1] );		
		oldItem.classList.toggle("activeMenuItem");
	}
	activeMenuItemName = itemNames[0];
	const activeItem = document.getElementById(itemNames[0].split(' ')[1]);
	activeItem.classList.toggle("activeMenuItem");
}

//
// * Building nav menu 

function addNewLink(linkName, parentElement) {
  const newElement = document.createElement('li');
  newElement.textContent = `${linkName}`;
  // add 2 classes for different @media queries. 
  // one apply is apply based on the match
  newElement.className = 'menu__link__horizontal menu__link__vertical';
  newElement.id = linkName.split(' ')[1];
  //
  parentElement.appendChild(newElement);
}

function buildNavigationMenu() {
  const navList = document.getElementById('navbar__list');
  const menuFragment = document.createDocumentFragment();

  docSections.forEach( (element, index, array) => {
     addNewLink( element.getAttribute('data-nav') , menuFragment )
  });
  // append to Fragment to avoid several reflow
  navList.appendChild(menuFragment); 
  // then set the first item to active thru
  // setActiveMenuItem(activeSection.getAttribute('data-nav') );
  //  ** set after getting the active section for sync. ** 
}

// * End of nav menu functions *
//

/**/ 
// ** Begin of nav menu functions **

// * Handling sections actions
//
function addRemoveToTopButton(oldActiveSection, currentActiveSection) {
	if( oldActiveSection ) {   // null
		// avoid double reflow - until using styling technique with non-button element
		if ( oldActiveSection.getAttribute('data-nav') === currentActiveSection.getAttribute('data-nav') ) {
				return;
		}
		const oldSectionName = oldActiveSection.getAttribute('data-nav');
		const toRemoveButtonId = `totop${oldSectionName.split(' ')[1]}`;
		
		if(toRemoveButton = document.getElementById(toRemoveButtonId) ) {
			toRemoveButton.remove();
		}

	}
	
	const sectionName = currentActiveSection.getAttribute('data-nav');
	const topButton = document.createElement('button');
    topButton.name = 'button';
    topButton.textContent = '-Top-';
    topButton.className = 'scrollToTopButton';
    topButton.id = `totop${sectionName.split(' ')[1]}`;       
    currentActiveSection.firstElementChild.appendChild(topButton);
}

function setActiveSection(oldActiveSection, currentActiveSection) {
	// remove activw class from old section
	oldActiveSection.classList.toggle("your-active-class");

	// add activw class to current section
	currentActiveSection.classList.toggle("your-active-class");
	// *** update the active section ***
	activeSection = currentActiveSection;
	// re-display the button at the bottom of the new active section
	addRemoveToTopButton(oldActiveSection, currentActiveSection); 
}

function getActiveSections() {
	let currentActiveSection = activeSection;
	for(section of docSections) {
		if (isInViewport(section) ) {
			if ( section.getAttribute('id') !== currentActiveSection.getAttribute('id') ) {
				const oldActiveSection = currentActiveSection;
				currentActiveSection = section;		
				setActiveSection(oldActiveSection, currentActiveSection );
			} // else do nothing
			return currentActiveSection;
		} // else do nothing
	}
	return currentActiveSection;
}

function getClickedSection(menuItemName) {
	for(section of docSections) {
		if( section.getAttribute('data-nav') == menuItemName) {
			return section;
		}
	}	
}

// * End of sections functions *
//


function goToTop() {
	// use window instead of rootElement = document.documentElement;
	window.scrollTo({ top: 0, left: 0, behavior: 'smooth'});
	// window.scrollY = 0 ;
	const newScrollY = window.scrollY;
	lastScrollY = newScrollY;
}

/**
 * End Main Functions
 ***************************/


/**
// ** Main calls **
**/

goToTop();
buildNavigationMenu(); 
//
// set active section to the first section (section 1) 
// set in Global declaration and active class is put in the init HTML structure. 
// just keep track using setActiveSections()
//
addRemoveToTopButton(null, activeSection);
//
setActiveMenuItem(activeSection.getAttribute('data-nav') );
goToTop();  // workaroud till bug fix

/**
 * End Main Functions
 ***************************/

 /**
 ** Begin Events **
 * 
**/

// ** listen to click events on nav menu **
//
navList.addEventListener('click', (event) => {
  setActiveMenuItem( event.target.textContent, activeMenuItemName );
  let clickedSection = getClickedSection( event.target.textContent );
  setActiveSection(activeSection, clickedSection );
  clickedSection.scrollIntoView({behavior: "smooth", block: "start", inline: "nearest"});
});


// ** listen to scroll events in the browser's window **
//
window.addEventListener('scroll', (event) => {
  const newScrollY = window.scrollY;
  controlMenuDisplay(newScrollY);
  // update scroll position here and 
  // SetActiveSection will control ToTop-button display as well
  lastScrollY = newScrollY;
  
  const oldActiveSection = activeSection;
  activeSection = getActiveSections();  // getActiveSections() will call setActiveSection()
  const newMenuItemName = activeSection.getAttribute('data-nav');
  setActiveMenuItem( newMenuItemName, activeMenuItemName );
});


// ** listen to click events on To-Top-button **
// adding the listner to "main" element
//
mainElement.addEventListener('click', (event) => {
  // to capture clicks on ToTop buttons only
  if( event.target.name === 'button' ) {
  	  goToTop();
	  // lastScrollY = window.newScrollY;
	  const targetSection = docSections[0];
	  const targetSectionName = docSections[0].getAttribute('data-nav');
	  const oldActiveSection = activeSection;
	  const oldActiveMenuItemName = activeMenuItemName;

	  setActiveSection(oldActiveSection, targetSection );
	  setActiveMenuItem(targetSectionName, oldActiveMenuItemName );
	} 
});

/**
 * End Events 
 ******************/