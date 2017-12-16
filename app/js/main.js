const ws = new WebSocket('ws://switch.darkshark.pro');

const checkbox1 = document.getElementById('checkbox1');
const checkbox2 = document.getElementById('checkbox2');
const checkbox3 = document.getElementById('checkbox3');
const checkbox4 = document.getElementById('checkbox4');


const switchChecker = (...arr) => {
	checkbox1.checked = !!arr[0];
	checkbox2.checked = !!arr[1];
	checkbox3.checked = !!arr[2];
	checkbox4.checked = !!arr[3];
}

const changeStyles = (token) => {
	const body = document.body;
	const tokenEl = document.createElement('div');
	tokenEl.id = 'token';
	tokenEl.innerHTML = `Token: ${token}`;
	body.appendChild(tokenEl);
	body.style.background = "#DCEDC8";
}

ws.onopen = () => {
	console.log('connected');
};

const leverArr = [false, false, false, false];

let a = 0;
let b = 1
let pulled;
let allStates = true;

ws.onmessage = e => {
	console.log(e.data)
	const data = JSON.parse(e.data);
	const stateId = data.stateId;

	if (typeof data.pulled === 'number') {
		leverArr[data.pulled] = !leverArr[data.pulled];
	}

	switchChecker(...leverArr);


	if (data.newState === 'poweredOff') {

		if (leverArr.some(item => item)) {
			switchChecker();
		}

		changeStyles(data.token)
		ws.close()
	}

	if (data.newState === 'poweredOn') {
		allStates = false
	}


	if(data.same) {
		leverArr[b] = leverArr[a];
		if (b < 3) {
			++a
			++b
		} else {
			if (leverArr.every(item => item === allStates)) {
				ws.send(JSON.stringify({ action: "powerOff", stateId }));
			}
		}
	}

	const testMessage = {
		action: "check",
		"lever1": a,
		"lever2": b,
		"stateId": stateId
	}

	if (typeof data.pulled === "number" ) {
		ws.send(JSON.stringify(testMessage));
	}
};
