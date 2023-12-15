const send = require("send");

// elements from the HTML document
const searchInput = document.getElementById("search-input");
const chatList = document.getElementById("chat-list");
const chatHeader = document.getElementById("chat-header");
const chatBody = document.getElementById("chat-body");
const chatFooter = document.getElementById("chat-footer");

//constants and variables
const API_URL = "https://my-json-server.typicode.com/codebuds-fk/chat/chats";
const BOT = "BOT";
const USER = "USER";
const TEXT = "text";
const OPTIONED_MESSAGE = "optionedMessage";
const REQUEST_A_CALL = "Request a call";

let chats = []; // data fetched from the API
let currentChat = null; // current selected chat

// Get the sidebar element by its class name
const sidebar = document.querySelector(".sidebar");

// Get the right section element by its class name
const rightSection = document.querySelector(".main");

// helper functions

// Add a click event listener to the sidebar element
function displayRightSection() {
  // Toggle the display of the right section element
  //   if (rightSection.style.display === "none") {
  rightSection.style.display = "block";
  // rightSection.style.width = "80%";
  sidebar.style.width = "30%";
  // Adjust the margin-left of the right section element if needed
  //     rightSection.style.marginLeft = "25%";
  //   } else {
  //     rightSection.style.display = "none";
  //     // Adjust the margin-left of the right section element if needed
  //     rightSection.style.marginLeft = "0";
  //   }
}

// A function to format a date object as DD/MM/YYYY
function formatDate(date) {
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}

// A function to check if two dates are on the same day
function isSameDay(date1, date2) {
  return (
    date1.getDate() === date2.getDate() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getFullYear() === date2.getFullYear()
  );
}

// A function to get a label for a date
function getDateLabel(date) {
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const lastWeek = new Date(today);
  lastWeek.setDate(lastWeek.getDate() - 7);

  if (isSameDay(date, today)) {
    return "Today";
  } else if (isSameDay(date, yesterday)) {
    return "Yesterday";
  } else if (date > lastWeek) {
    return date.toLocaleDateString("en-US", { weekday: "long" });
  } else {
    return formatDate(date);
  }
}

// A function to create a chat list item element from a chat object
// function createChatListItem(chat) {
//   const chatListItem = document.createElement("div");
//   chatListItem.classList.add("chat-list-item");

//   const img = document.createElement("img");
//   img.src = chat.imageURL;
//   img.alt = chat.title;

//   const chatListItemInfo = document.createElement("div");
//   chatListItemInfo.classList.add("chat-list-item-info");

//   const chatListItemTitle = document.createElement("span");
//   chatListItemTitle.classList.add("chat-list-item-title");
//   chatListItemTitle.textContent = chat.title;

//   const chatListItemOrderId = document.createElement("span");
//   chatListItemOrderId.classList.add("chat-list-item-order-id");
//   chatListItemOrderId.textContent = `Order ID: ${chat.orderId}`;

//   const chatListItemDate = document.createElement("span");
//   chatListItemDate.classList.add("chat-list-item-date");

//   const latestMessageTimestamp = chat.latestMessageTimestamp;

//   if (latestMessageTimestamp) {
//     const latestMessageDate = new Date(latestMessageTimestamp);
//     chatListItemDate.textContent = formatDate(latestMessageDate);
//   }
//   chatListItem.appendChild(img);
//   chatListItemInfo.appendChild(chatListItemTitle);
//   chatListItemInfo.appendChild(chatListItemOrderId);
//     // chatListItemInfo.appendChild(chatListItemLastMsg);

//   chatListItem.appendChild(chatListItemInfo);
//   chatListItem.appendChild(chatListItemDate);

//   chatListItem.addEventListener("click", function () {
//     currentChat = chat;
//     displayRightSection();
//     const chatListItems = document.querySelectorAll(".chat-list-item");
//     for (let item of chatListItems) {
//       item.classList.remove("selected");
//     }

//     this.classList.add("selected");

//     // Update the chat header, chat body, and chat footer elements
//     updateChatHeader();
//     updateChatBody();
//     updateChatFooter();
//   });

//   return chatListItem;
// }
function createChatListItem(chat) {
    const chatListItem = document.createElement("div");
    chatListItem.classList.add("chat-list-item");
  
    const img = document.createElement("img");
    img.src = chat.imageURL;
    img.alt = chat.title;
  
    const chatListItemInfo = document.createElement("div");
    chatListItemInfo.classList.add("chat-list-item-info");
  
    const chatListItemTitle = document.createElement("span");
    chatListItemTitle.classList.add("chat-list-item-title");
    chatListItemTitle.textContent = chat.title;
  
    const chatListItemOrderId = document.createElement("span");
    chatListItemOrderId.classList.add("chat-list-item-order-id");
    chatListItemOrderId.textContent = `Order ID: ${chat.orderId}`;
  
    const chatListItemDate = document.createElement("span");
    chatListItemDate.classList.add("chat-list-item-date");
  
    const latestMessageTimestamp = chat.latestMessageTimestamp;
  
    if (latestMessageTimestamp) {
      const latestMessageDate = new Date(latestMessageTimestamp);
      chatListItemDate.textContent = formatDate(latestMessageDate);
    }
  
    const lastMessageContent = document.createElement("div");
    lastMessageContent.classList.add("chat-list-item-last-message");
  
    const lastMessage = chat.messageList[chat.messageList.length - 1];
  
    if (lastMessage) {
      lastMessageContent.textContent = lastMessage.message;
    }
  
    chatListItem.appendChild(img);
    chatListItemInfo.appendChild(chatListItemTitle);
    chatListItemInfo.appendChild(chatListItemOrderId);
    chatListItemInfo.appendChild(lastMessageContent); // Add the last message content
    chatListItem.appendChild(chatListItemInfo);
    chatListItem.appendChild(chatListItemDate);
  
    chatListItem.addEventListener("click", function () {
      currentChat = chat;
      displayRightSection();
      const chatListItems = document.querySelectorAll(".chat-list-item");
      for (let item of chatListItems) {
        item.classList.remove("selected");
      }
  
      this.classList.add("selected");
  
      // Update the chat header, chat body, and chat footer elements
      updateChatHeader();
      updateChatBody();
      updateChatFooter();
    });
  
    return chatListItem;
  }
  
function createMessage(message) {
  const messageElement = document.createElement("div");
  messageElement.classList.add("message");
  console.log(message, "message");
  const messageContent = document.createElement("div");
  messageContent.classList.add("message-content");
  messageContent.textContent = message.message;

  const messageDate = document.createElement("span");
  messageDate.classList.add("message-date");

  const timestamp = new Date(message.timestamp);
  const hours = timestamp.getHours();
  const minutes = timestamp.getMinutes();
  const ampm = hours >= 12 ? "PM" : "AM";
  messageDate.textContent = `${hours % 12}:${
    minutes < 10 ? "0" + minutes : minutes
  } ${ampm}`;

  messageElement.appendChild(messageContent);
  messageElement.appendChild(messageDate);

  if (message.messageType === OPTIONED_MESSAGE) {
    // Use messageType instead of type
    const optionedMessage = createOptionedMessage(message.options);
    messageContent.appendChild(optionedMessage);
  }

  if (message.sender === BOT) {
    messageElement.classList.add("message-left");
  }

  if (message.sender === USER) {
    messageElement.classList.add("message-right");
  }

  return messageElement;
}

// A function to create an optionedMessage element from an array of options
function createOptionedMessage(options) {
  const optionedMessage = document.createElement("div");
  optionedMessage.classList.add("optioned-message");

  const optionedMessageOptions = document.createElement("div");
  optionedMessageOptions.classList.add("optioned-message-options");
  console.log(options, "options");
  for (let option of options) {
    const optionedMessageOption = document.createElement("span");
    optionedMessageOption.classList.add("optioned-message-option");
    optionedMessageOption.textContent = option.optionText;

    optionedMessageOption.addEventListener("click", function () {
      // If the option is "Request a Call", add a user message saying "I want a callback"
      if (option.optionText.trim() === REQUEST_A_CALL) {
        alert("Your call request is under process");
        addUserMessage("I want a callback");
      }

      const optionedMessageOptions = document.querySelectorAll(
        ".optioned-message-option"
      );
      for (let item of optionedMessageOptions) {
        item.classList.add("disabled");
      }
    });

    optionedMessageOptions.appendChild(optionedMessageOption);
  }
  optionedMessage.appendChild(optionedMessageOptions);
  return optionedMessage;
}

// A function to create a chat input element
// function createChatInput() {
//   const chatInput = document.createElement("div");
//   chatInput.classList.add("chat-input");

//   const input = document.createElement("input");
//   input.type = "text";
//   input.placeholder = "Type a message...";
//   input.id = "message-input";

//   input.addEventListener("keyup", function (event) {
//     // If the enter key is pressed, get the input value and add a user message with that value
//     if (event.keyCode === 13) {
//       const message = input.value.trim();
//       if (message) {
//         addUserMessage(message);
//       }

//       input.value = "";
//     }
//   });

//   chatInput.appendChild(input);

//   return chatInput;
// }

// A function to create a chat input element
function createChatInput() {
    const chatInput = document.createElement("div");
    chatInput.classList.add("chat-input");
  
    const input = document.createElement("input");
    input.type = "text";
    input.placeholder = "Type a message...";
    input.id = "message-input";
  
    const sendButton = document.createElement("button");
    sendButton.textContent = "Send";
    sendButton.classList.add("send-button");
    sendButton.addEventListener("click", function () {
      // Get the input value and add a user message with that value
      const message = input.value.trim();
      if (message) {
        addUserMessage(message);
      }
  
      // Clear the input value
      input.value = "";
    });
  
    input.addEventListener("keyup", function (event) {
      // If the enter key is pressed, trigger the send button click event
      if (event.keyCode === 13) {
        sendButton.click();
      }
    });
  
    chatInput.appendChild(input);
    chatInput.appendChild(sendButton);
  
    return chatInput;
  }
  

// A function to create a date label element from a date object
function createDateLabel(date) {
  const dateLabel = document.createElement("div");
  dateLabel.classList.add("date-label");

  const span = document.createElement("span");

  span.textContent = getDateLabel(date);

  dateLabel.appendChild(span);

  return dateLabel;
}

// A function to update the chat header element based on the current chat object
function updateChatHeader() {
  chatHeader.innerHTML = "";

  if (currentChat) {
    const img = document.createElement("img");
    img.src = currentChat.imageURL;
    img.alt = currentChat.title;
    const chatHeaderInfo = document.createElement("div");
    chatHeaderInfo.classList.add("chat-header-info");
    const chatHeaderTitle = document.createElement("span");
    chatHeaderTitle.classList.add("chat-header-title");
    chatHeaderTitle.textContent = currentChat.title;
    chatHeader.appendChild(img);
    chatHeaderInfo.appendChild(chatHeaderTitle);
    chatHeader.appendChild(chatHeaderInfo);
  }
}

// A function to update the chat body element based on the current chat object
function updateChatBody() {
  chatBody.innerHTML = "";

  if (currentChat) {
    const messageList = currentChat.messageList;

    if (messageList.length === 0) {
      const message = document.createElement("div");
      message.classList.add("message");
      message.textContent = "Send a message to start chatting";
      chatBody.appendChild(message);
    } else {
      for (let i = 0; i < messageList.length; i++) {
        const message = messageList[i];
        const messageElement = createMessage(message);
        chatBody.appendChild(messageElement);

        if (i < messageList.length - 1) {
          const nextMessage = messageList[i + 1];
          const timestamp = new Date(message.timestamp);
          const nextTimestamp = new Date(nextMessage.timestamp);
          if (!isSameDay(timestamp, nextTimestamp)) {
            const dateLabel = createDateLabel(nextTimestamp);
            chatBody.appendChild(dateLabel);
          }
        }
      }
    }

    chatBody.scrollTop = chatBody.scrollHeight;
  }
}

// A function to update the chat footer element based on the current chat object
function updateChatFooter() {
  chatFooter.innerHTML = "";

  if (currentChat) {
    const chatInput = createChatInput();
    chatFooter.appendChild(chatInput);
  }
}

// A function to add a user message to the current chat object and update the UI
function addUserMessage(content) {
  if (currentChat) {
    const userMessage = {
      sender: USER,
      messageType: TEXT,
      message: content,
      timestamp: new Date().toISOString()
    };

    currentChat.messageList.push(userMessage);
    updateChatBody();
  }
}

// A function to filter the chat list based on a search query
function filterChatList(query) {
  chatList.innerHTML = "";

  for (let chat of chats) {
    if (
      chat.title.toLowerCase().includes(query.toLowerCase()) ||
      chat.orderId.toLowerCase().includes(query.toLowerCase())
    ) {
      // Use title instead of chatTitle
      const chatListItem = createChatListItem(chat);

      chatList.appendChild(chatListItem);
    }
  }
}

// Fetch the chat data from the API URL using the fetch API
fetch(API_URL)
  .then((response) => response.json())
  .then((data) => {
    chats = data;
    console.log(data, "chat data");
    for (let chat of chats) {
      const chatListItem = createChatListItem(chat);
      chatList.appendChild(chatListItem);
    }

    // Update the chat header, chat body, and chat footer elements
    // updateChatHeader();
    // updateChatBody();
    // updateChatFooter();
  })
  .catch((error) => {
    console.error(error);
  });

// Add an input event listener to the search input element
searchInput.addEventListener("input", function () {
  const query = searchInput.value.trim();
  filterChatList(query);
  // displayRightSection()
});
