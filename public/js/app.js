const socket = io('http://localhost:4020');
const createRoomContainer = document.querySelector('.create-room');
const roomTemplate = document.querySelector('template.room');
const btnCreateRoom = document.querySelector('.btn-create-room');
const formJoinRoom = document.querySelector('form.join-room');
const hands = document.querySelectorAll('.our .hand');
const formJanken = document.querySelector('form.janken');

socket.on('connected', ({ userId }) => {
  localStorage.setItem('userId', userId);
});

hands.forEach((hand) => {
  hand.addEventListener('click', function () {
    hands.forEach((hand) => hand.classList.remove('choose'));
    this.classList.add('choose');
  });
});

// CREATE ROOM
btnCreateRoom.addEventListener('click', () => {
  socket.emit('create-room');
});
socket.on('created-room', (newRoom) => {
  const newRoomTemplate = document.createElement('div');
  newRoomTemplate.innerHTML = roomTemplate.innerHTML;
  newRoomTemplate.querySelector('.id').textContent = newRoom.id;
  createRoomContainer.parentNode.append(newRoomTemplate);
  localStorage.setItem('roomId', newRoom.id);
});
socket.on('failed-create-room', ({ message }) => alert(message));

// JOIN ROOM
formJoinRoom.addEventListener('submit', function (event) {
  event.preventDefault();
  let roomIdInput = formJoinRoom.querySelector('input#room-id');
  if (roomIdInput.value === '') alert('room id is required');
  socket.emit('join-room', { roomId: roomIdInput.value });
  roomIdInput.value = '';
});
socket.on('joined-room', (room) => {
  localStorage.setItem('roomId', room.id);
});
socket.on('failed-join-room', ({ message }) => {
  alert(message);
});

// JANKEN
formJanken.addEventListener('submit', function (event) {
  event.preventDefault();
  let roomId = localStorage.getItem('roomId');
  let jankenInput = formJanken.querySelector('.our .hand.choose');
  let janken = jankenInput.getAttribute('data-value');
  socket.emit('janken', { janken, roomId });
});
socket.on('janken-opponent', ({ janken }) => {
  const waiting = document.querySelector('.opponent .waiting');
  waiting.classList.add('d-none');
  const hands = document.querySelector('.opponent .hands');
  hands.classList.remove('d-none');
  hands.querySelectorAll('.hand').forEach((hand) => {
    if (hand.getAttribute('data-value') === janken)
      hand.classList.add('choose');
  });
});
