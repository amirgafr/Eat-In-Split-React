import { useState } from "react";

const initialFriends = [
  {
    id: 118836,
    name: "Clark",
    image: "https://i.pravatar.cc/48?u=118836",
    balance: -7,
  },
  {
    id: 933372,
    name: "Sarah",
    image: "https://i.pravatar.cc/48?u=933372",
    balance: 20,
  },
  {
    id: 499476,
    name: "Anthony",
    image: "https://i.pravatar.cc/48?u=499476",
    balance: 0,
  },
];
function Button({ children, onClick }) {
  return (
    <button className="button" onClick={onClick}>
      {children}
    </button>
  );
}
export default function App() {
  const [showFormFriends, setshowFormFriends] = useState(false);
  const [friends, setFriends] = useState(initialFriends);
  const [selectedFriend, setSelectedFriend] = useState(null);

  function handelShowFormFriends() {
    setshowFormFriends(!showFormFriends);
  }
  function handelAddFriends(friend) {
    setFriends([...friends, friend]);
  }
  function handelShowFriends(friend) {
    setSelectedFriend((url) => (url?.id === friend.id ? null : friend));
    setshowFormFriends(false);
  }
  function handelNewFriends(value) {
    console.log(value);

    setFriends((friends) =>
      friends.map((friend) =>
        friend.id === selectedFriend.id
          ? {
              ...friend,
              balance: friend.balance + value,
            }
          : friend
      )
    );
    setSelectedFriend(null);
  }
  return (
    <div className="app">
      <div className="sidebar">
        <FriendList
          friends={friends}
          onSelction={handelShowFriends}
          selectedFriend={selectedFriend}
        />
        {showFormFriends && <FormFriend addFriend={handelAddFriends} />}
        <Button onClick={handelShowFormFriends}>
          {showFormFriends ? "close" : "Add Friend"}
        </Button>
      </div>
      {selectedFriend && (
        <FormSplitBill
          selectedFriend={selectedFriend}
          handelNewFriends={handelNewFriends}
        />
      )}
    </div>
  );
}

function FriendList({ friends, onSelction, selectedFriend }) {
  return (
    <ul>
      {friends.map((friend) => (
        <Friend
          friend={friend}
          onSelction={onSelction}
          selectedFriend={selectedFriend}
        />
      ))}
    </ul>
  );
}

function Friend({ friend, onSelction, selectedFriend }) {
  const isSelected = selectedFriend?.id === friend.id;
  return (
    <li>
      <img src={friend.image} alt={friend.name}></img>
      <div>
        <h3>{friend.name}</h3>
        {friend.balance < 0 && (
          <p className="red">
            You owe {friend.name} {friend.balance}
          </p>
        )}
        {friend.balance > 0 && (
          <p className="green">
            You owe {friend.name} {friend.balance}
          </p>
        )}
        {friend.balance === 0 && <p>You and {friend.name} are even</p>}
      </div>
      <Button onClick={() => onSelction(friend)}>
        {isSelected ? "Close" : "Select"}
      </Button>
    </li>
  );
}

function FormFriend({ addFriend }) {
  const [name, setname] = useState("");
  const [image, seturlName] = useState("https://i.pravatar.cc/48");

  const id = crypto.randomUUID();
  function handelSubmit(e) {
    e.preventDefault();
    if (!name || !image) return;
    const newFriend = {
      id,
      name,
      image,
      balance: 0,
    };
    addFriend(newFriend);
  }
  return (
    <form className="form-add-friend">
      <label>👫 Friend name</label>
      <input
        type="text"
        value={name}
        onChange={(e) => setname(e.target.value)}
      />
      <label>🌄image URL</label>
      <input
        type="text"
        value={image}
        onChange={(e) => seturlName(e.target.value)}
      />

      <Button onClick={handelSubmit}>Add</Button>
    </form>
  );
}

function FormSplitBill({ selectedFriend, handelNewFriends }) {
  const [bill, setBill] = useState("");
  const [paidByUser, setPaidByUser] = useState("");
  const paidFriend = bill ? bill - paidByUser : "";
  const [whoPaying, setWhoPaying] = useState("user");

  function handelSubmit(e) {
    e.preventDefault();
    handelNewFriends(paidFriend);
  }
  return (
    <form className="form-split-bill">
      <h2>Split a bill with {selectedFriend.name} </h2>
      <label>💰 Bill Vlue</label>
      <input
        type="text"
        value={bill}
        onChange={(e) => setBill(Number(e.target.value))}
      />
      <label>🧍‍♀️Your expense</label>
      <input
        type="text"
        value={paidByUser}
        onChange={(e) =>
          setPaidByUser(
            Number(e.target.value) > bill ? paidByUser : Number(e.target.value)
          )
        }
      />
      <label>👫{selectedFriend.name} expense</label>
      <input type="text" disabled value={paidFriend} />
      <label>🤑who is paying the bill</label>
      <select value={whoPaying} onChange={(e) => setWhoPaying(e.target.value)}>
        <option value="user">You</option>
        <option value="friend">{selectedFriend.name}</option>
      </select>
      <Button onClick={handelSubmit}>Split Bill</Button>
    </form>
  );
}
