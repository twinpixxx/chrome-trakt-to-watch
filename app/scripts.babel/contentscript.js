'use strict';

let iframe;
let isIframeAttached = false;
let resultsCached = [];
const iframeStyles = `
	position: fixed;
	top: 10px;
	right: 10px;
	width: 276px;
	height: 292px;
	max-height:292px;
	border: none;
	z-index: 2147483647;
`;


const actions = {
	showSearchResults,
	requestData,
	closeIframe: _unattachIframe,
	setIframeHeight,
};

chrome.runtime.onMessage.addListener(request => {
	actions[request.action](request.payload);
});

function showSearchResults(payload) {
	Object.assign(resultsCached, payload);
	if (!iframe) {
		iframe = _createIframe();
	}
	if (!isIframeAttached) {
		_attachIframe();
	} else {
		iframe.contentWindow.postMessage(payload, '*');
	}
}

function requestData() {
	iframe.contentWindow.postMessage(resultsCached, '*');
}

function setIframeHeight(height) {
	iframe && (iframe.style.height = `${height}px`);
}

function _createIframe() {
	let iframe = document.createElement('iframe');
	iframe.src = chrome.extension.getURL('iframe.html');
	iframe.setAttribute('style', iframeStyles);
	return iframe;
}

function _attachIframe() {
	document.body.appendChild(iframe);
	isIframeAttached = true;
}

function _unattachIframe() {
	document.body.removeChild(iframe);
	isIframeAttached = false;
}
