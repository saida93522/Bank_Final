'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

/////////////////////////////////////////////////
// Data

// DIFFERENT DATA! Contains movement dates, currency and locale



const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2021-05-08T14:11:59.604Z',
    '2021-06-16T17:01:17.194Z',
    '2021-06-20T23:36:17.929Z',
    '2021-06-17T10:51:36.790Z',
  ],
  currency: 'EUR',
  locale: 'pt-PT', // de-DE
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2020-06-25T18:49:59.371Z',
    '2020-07-26T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};

const accounts = [account1, account2];

/////////////////////////////////////////////////
// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

/////////////////////////////////////////////////
// Functions

const formatMovementDate = function (date, locale) {

  const calcDaysPassed = (date1, date2) => Math.round(Math.abs(date2 - date1) / (1000 * 60 * 60 * 24))

  const daysPassed = calcDaysPassed(new Date(), date)
  // console.log(daysPassed);

  if (daysPassed === 0) return 'Today'
  if (daysPassed === 1) return 'Yesterday'
  if (daysPassed <= 7) return `${daysPassed} days ago`;

  // const day = `${date.getDate()}`.padStart(2, 0)
  // const month = `${date.getMonth() + 1}`.padStart(2, 0)
  // const year = date.getFullYear() + 1

  // return `${month}/${day}/${year}`

  return new Intl.DateTimeFormat(locale).format(date);

}

//format currency

const formatCur = function (value, locale, currency) {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
  }).format(value)
}
const displayMovements = function (acc, sort = false) {
  containerMovements.innerHTML = '';

  const movs = sort ? acc.movements.slice().sort((a, b) => a - b) : acc.movements;

  movs.forEach(function (mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';

    const date = new Date(acc.movementsDates[i])//looping through two arrays
    const displayDate = formatMovementDate(date, acc.locale)

    const formattedMov = formatCur(mov, acc.locale, acc.currency)

    const html = `
      <div class="movements__row">
        <div class="movements__type movements__type--${type}">${i + 1
      } ${type}</div>
      <div class="movements__date">${displayDate}</div>
        <div class="movements__value">${formattedMov}</div>
      </div>
    `;

    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

const calcDisplayBalance = function (acc) {
  acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0);

  labelBalance.textContent = formatCur(acc.balance, acc.locale, acc.currency)
};

const calcDisplaySummary = function (acc) {
  const incomes = acc.movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = formatCur(incomes, acc.locale, acc.currency)


  const out = acc.movements
    .filter(mov => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumOut.textContent = formatCur(Math.abs(out), acc.locale, acc.currency)

  const interest = acc.movements
    .filter(mov => mov > 0)
    .map(deposit => (deposit * acc.interestRate) / 100)
    .filter((int, i, arr) => {
      return int >= 1;
    })
    .reduce((acc, int) => acc + int, 0);
  labelSumInterest.textContent = formatCur(interest, acc.locale, acc.currency)

};

const createUsernames = function (accs) {
  accs.forEach(function (acc) {
    acc.username = acc.owner
      .toLowerCase()
      .split(' ')
      .map(name => name[0])
      .join('');
  });
};
createUsernames(accounts);

const updateUI = function (acc) {
  // Display movements
  displayMovements(acc);

  // Display balance
  calcDisplayBalance(acc);

  // Display summary
  calcDisplaySummary(acc);


};

const startLogOutTimer = () => {
  const tick = function () {
    const min = String(Math.floor(timer / 60)).padStart(2, 0)
    const sec = String(Math.floor(timer % 60)).padStart(2, 0)

    //In each call, print the remaining time to UI
    labelTimer.textContent = `${min}:${sec}`


    //At 0 second, stop timer and logout user
    if (timer === 0) {
      clearInterval(time)
      labelWelcome.textContent = `Login to get started`
      containerApp.style.opacity = 0;
    }

    //Decrease 1s
    timer--;

  }
  //Set time to five minutes
  let timer = 120
  //call the timer every second
  tick();
  const time = setInterval(tick, 1000);
  return time;

}


//////////////////////////////////////////
// Event handlers
let currentAccount, time;

///TEMPORARY LOGGED IN
// currentAccount = account1;
// updateUI(currentAccount)
// containerApp.style.opacity = 1

//Experementing DATE API



btnLogin.addEventListener('click', function (e) {
  // Prevent form from submitting
  e.preventDefault();

  currentAccount = accounts.find(
    acc => acc.username === inputLoginUsername.value
  );
  console.log(currentAccount);

  if (currentAccount?.pin === +(inputLoginPin.value)) {
    // Display UI and message
    labelWelcome.textContent = `Welcome back, ${currentAccount.owner.split(' ')[0]
      }`;
    containerApp.style.opacity = 100;

    // Clear input fields
    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur();

    //Create current date and time
    const bankDate = new Date()
    const options = {
      hour: 'numeric',
      minute: 'numeric',
      month: 'numeric',
      day: 'numeric',
      year: 'numeric',

    }

    // const locale = navigator.language;
    // console.log(locale);

    labelDate.textContent = new Intl.DateTimeFormat(currentAccount.locale, options).format(bankDate);

    // const day = `${bankDate.getDate()}`.padStart(2, 0)
    // const month = `${bankDate.getMonth() + 1}`.padStart(2, 0)
    // const hour = `${bankDate.getHours()}`.padStart(2, 0)
    // const min = `${bankDate.getMinutes()}`.padStart(2, 0)
    // labelDate.textContent = `${month}/${day}/${bankDate.getFullYear()} ${hour}:${min}`

    //Timer Validation
    if (time) clearInterval(time)
    time = startLogOutTimer(currentAccount)

    // Update UI
    updateUI(currentAccount);
  }
});

btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = +inputTransferAmount.value;
  const receiverAcc = accounts.find(
    acc => acc.username === inputTransferTo.value
  );
  inputTransferAmount.value = inputTransferTo.value = '';

  if (
    amount > 0 &&
    receiverAcc &&
    currentAccount.balance >= amount &&
    receiverAcc?.username !== currentAccount.username
  ) {
    // Doing the transfer
    currentAccount.movements.push(-amount);
    receiverAcc.movements.push(amount);

    //Add transfer Date
    currentAccount.movementsDates.push(new Date().toISOString())
    receiverAcc.movementsDates.push(new Date().toISOString());


    // Update UI
    updateUI(currentAccount);

    //Reset Timer
    clearInterval(time)
    time = startLogOutTimer()
  }
});

btnLoan.addEventListener('click', function (e) {
  e.preventDefault();

  const amount = Math.floor(inputLoanAmount.value);

  if (amount > 0 && currentAccount.movements.some(mov => mov >= amount * 0.1)) {
    // Add movement
    setTimeout(() => {
      currentAccount.movements.push(amount);

      //Add Loan date
      currentAccount.movementsDates.push(new Date().toISOString());

      // Update UI
      updateUI(currentAccount);
      //Reset Timer
      clearInterval(time)
      time = startLogOutTimer()
    }, 2500)
  }
  inputLoanAmount.value = '';
});

btnClose.addEventListener('click', function (e) {
  e.preventDefault();

  if (
    inputCloseUsername.value === currentAccount.username &&
    +inputClosePin.value === currentAccount.pin
  ) {
    const index = accounts.findIndex(
      acc => acc.username === currentAccount.username
    );
    console.log(index);
    // .indexOf(23)

    // Delete account
    accounts.splice(index, 1);

    // Hide UI
    containerApp.style.opacity = 0;
  }

  inputCloseUsername.value = inputClosePin.value = '';
});

let sorted = false;
btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  displayMovements(currentAccount, !sorted);
  sorted = !sorted;
});

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES




//Conversion string to number
// console.log(+'23');



//PARSING
// console.log(Number.parseInt('30px', 10)); //redix
// console.log(Number.parseFloat('2.5rem'));

//isNAN
// console.log(Number.isNaN(+'20L'));

//better to use to check if value is a number
// console.log(Number.isFinite('20'));



//Math and rounding
// console.log(Math.sqrt(25));
// console.log(25 ** (1 / 2));

// console.log(Math.max(5, 10, 90, 2));
// console.log(Math.min(5, 2, 5, 6, 90, 8));

// console.log(Math.PI * Number.parseFloat('10px') ** 2); //how area of circle is created


// const randomInt = (min, max) => Math.floor(Math.random() * (max - min) + 1) + min

// console.log(randomInt(10, 20));

//Rounding integers
// console.log(Math.trunc(23.3));

// console.log(Math.round(23.3));
// console.log(Math.round(23.7));

// console.log(Math.ceil(23.3));

// console.log(Math.floor(23.3));


//Rounding decimals

// console.log(+(2.7).toFixed(0));


//Remainder

// console.log(5 % 2);

// console.log(10 / 2);

// const isEven = num => num % 2 === 0 ? 'Even' : 'Odd'

// console.log(isEven(11));

// labelBalance.addEventListener('click', function () {
//   [...document.querySelectorAll('.movements__row')].forEach((row, i) => {
//     if (i % 2 === 0) row.style.backgroundColor = 'red'
//     if (i % 3 === 0) row.style.backgroundColor = 'lightBlue'

//   })

// })

// console.log(2 ** 53 - 1);
// console.log(Number.MAX_SAFE_INTEGER);
// console.log(1245465645675475467467468768754677766n);
// console.log(BigInt(124546564567));


///Operations

// console.log(10000n + 10000n);
// const hugeNum = 7567834593468934689436589436894389n
// const regNum = 30

// console.log(hugeNum + BigInt(regNum));


//Divisions

// console.log(7n % 3n);



//Dates and Time

//Create a Date

// const now = new Date()
// console.log(now);

// //Parse date
// console.log(new Date(account1.movementsDates[0]));

// console.log(new Date(2037, 11, 19, 15, 23, 5));

// console.log(new Date(0));

//Working with Dates

// const future = new Date(2037, 10, 19, 15, 23)
// console.log(future);

// console.log(future.getFullYear());
// console.log(future.getMonth());
// console.log(future.getDay());
// console.log(future.getHours());
// console.log(future.getMinutes());
// console.log(future.getTimezoneOffset());

// console.log(future.toISOString());
// console.log(future.getTime());

// future.setFullYear(2040)
// console.log(future);



// const future = new Date(2037, 10, 19, 15, 23)
// console.log((+future));

// const calcDaysPassed = (date1, date2) => Math.abs((date1 - date2) / (1000 * 60 * 60 * 24))

// const day1 = calcDaysPassed(new Date(2037, 3, 4), new Date(2037, 3, 24))
// console.log(day1);

// console.dir(day1);

// const num = 3884764.23;
// console.log('US:      ', new Intl.NumberFormat('en-US').format(num));

// console.log('Germany:   ', new Intl.NumberFormat('de-DE').format(num));

// console.log('Syria:   ', new Intl.NumberFormat('ar-SY').format(num));


//SET TIMEOUT
// const ingredients = ['olives', 'spinach']

// const pizzaTimer = setTimeout((ing1, ing2) => {
//   console.log(`Here is your pizza with ${ing1} and ${ing2}`);
// }, 3000, ...ingredients)

// if (ingredients.includes('olivess')) clearTimeout(pizzaTimer)


//SET INTERVAL

// setInterval(function () {
//   const date = new Date()
//   const hour = date.getHours()
//   const minute = date.getMinutes()
//   const sec = date.getSeconds()

//   console.log(`${hour} ${minute} ${sec}`);

// }, 2500);

