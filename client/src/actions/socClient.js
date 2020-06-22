import io from 'socket.io-client';

export const socket = io.connect('http://localhost:5000');

export const forceRefresh = (userID) => async () => {
  try {
    var userList = [];
    socket.emit('initialList', userList);
    await socket.on('listupdate', (list) => {
      userList.concat(list);
      console.log(userList);
      console.log(list);
      let tmp = list.findIndex((x) => x.user === userID);
      // If user is online
      if (tmp !== -1) {
        console.log('initiating refresh');
        socket.emit('initiateRefresh', userID, list[tmp].sid);
      }
    });
    console.log('UserList at front end is ', userList);
  } catch (err) {
    console.log(err);
  }
};
