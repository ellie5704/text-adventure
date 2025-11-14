class Room {
  constructor(name, description) {
    this.name = name;
    this.description = description;
    this.exits = {};
    this.items = [];


  }

  connect(direction, room) {
    this.exits[direction] = room;
  }

  describe() {

    const exits = Object.keys(this.exits);
    const exitList = exits.length
        ? exits.map(dir => `${this.exits[dir].name} → ${dir}`).join("\n")
        : "No exits";

    const itemList = this.items.length
        ? " You see here: " + this.items.map(item => item.description).join(", "): "";

    return `${this.name}:\n\n${this.description}\n\n${itemList}\n\n\nExits:\n ${exitList}`;
  }
}

class Item {
    constructor(name, description) {
        this.name = name;
        this.description = description;
    }
}

class Player {
    constructor(startRoom) {
        this.currentRoom = startRoom;
        this.inventory = []
    }
    
    move(direction) {
        const next = this.currentRoom.exits[direction];
        if (!next) {
            showOutput(this.currentRoom.describe `\n\nYou can't go that way.`);
            return;
        }

        this.currentRoom = next;
        clearOutput();
        showOutput(this.currentRoom.describe());
        resetItemImage();

        if (this.currentRoom.name.toLowerCase() === "porch") {
            this.handlePorchEvent()
        }

        if (this.currentRoom.name.toLowerCase() === "bedroom") {
            this.handleBedroomEvent()
        }

    }

    handlePorchEvent() {
        const treats = this.inventory.find(i => i.name === "treats");
        if (treats) {
            this.inventory = this.inventory.filter(i => i.name !== "treats");
            showOutput(this.currentRoom.describe() + `\n\nThe neighbour's cat steals your treats! You decide it's best to retreat back inside.`);
            showInventory(this);
            updateEventImage();
        }
    }

    handleBedroomEvent() {
        if (this.inventory.length > 0) {
            const randomIndex = Math.floor(Math.random() * this.inventory.length);
            const randomItem = this.inventory[randomIndex];
            
            this.inventory.splice(randomIndex, 1);
            showOutput(this.currentRoom.describe() + `\n\nYou dropped your ${randomItem.name} on the floor! Best to escape quickly.`);
            showInventory(this);
            updateEventImage();
        }
    }

    take(itemName) {
        const item = this.currentRoom.items.find(i => i.name === itemName);
        if (item) {
            this.inventory.push(item);
            this.currentRoom.items = this.currentRoom.items.filter(i => i.name !== itemName);
            showOutput(this.currentRoom.describe() + `\n\nYou have taken the ${itemName}.`);    
            showInventory(this);
            updateItemImage(item);
        } else {
            showOutput(this.currentRoom.describe() + `\n\nThere is no ${itemName} here.`);
        }
    }
}




const hallway = new Room("Hallway", "Coming through the cat flap, you find yourself in the hallway, it's not a destination, just a familiar path between naps.", "Go north ");

const lounge = new Room("Lounge", "Stepping in from the hallway, the lounge greets you. You brush against the sofa where your human rests, receiving a few head scratches before something catches your eye. You scurry under the sofa and find your favourite toy, that has been missing for awhile");
const toy = new Item("toy", "A small, squeaky mouse toy that you love to chase around the house.");
lounge.items.push(toy);

const kitchen = new Room("Kitchen", "The kitchen is quiet, with the hum of the fridge and a few crumbs on the floor. A cupboard door sits ajar, the faint promise of treats inside.");
const treats = new Item("treats", "A bag of delicious cat treats.");
kitchen.items.push(treats);

const porch = new Room("Porch", "You step out onto the porch, flinching as the cool air hits your whiskers. A shadow awaits on the fence - the neighbours cat! This isn't the place to linger.");

const laundry = new Room("Laundry", "You nose into the laundry room, spotting a basket of clothes with socks tucked in like hidden treasures.");
const sock = new Item("sock", "A single, lonely sock that has lost its pair.");
laundry.items.push(sock);

const garage = new Room("Garage", "The garage is cold with a faint smell of paint, what a bad napping spot! A cardboard box sits slumped against the wall full of old winter clothes, these could be useful...");
const clothes = new Item("clothes", "A pile of your human's winter clothes, perfect for napping.");    
garage.items.push(clothes);

const landing = new Room("Landing", "You find yourself in the landing, it's not a destination, just a familiar path between naps");

const bathroom = new Room("Bathroom", "The bathroom is steamy, the tiles damp and the mirror fogged. You shudder at the sight of the bath, reliving the bad memories of soaking fur and paws slipping on porcelain. As you look away you notice a comfy looking towel hanging off the rail");
const towel = new Item("towel", "A soft, fluffy towel hanging on the rack.");
bathroom.items.push(towel);

const bedroom = new Room("Bedroom", "You squeeze your way through the door to the bedroom, only to be met with the spare human sprawled out on the bed, snoring. Suddenly their eyes flick open - oh no! They spot you and reach out, wanting a fuss. Before you can wriggle free, they scoop you up, and in the scramble you drop an item on the floor.");

hallway.connect("west", lounge);
hallway.connect("north", kitchen);
hallway.connect("east", landing);
lounge.connect("east", hallway);
lounge.connect("north", kitchen);
kitchen.connect("north", porch);
kitchen.connect("west", lounge);
kitchen.connect("south", hallway);
kitchen.connect("east", laundry);
porch.connect("south", kitchen);
laundry.connect("west", kitchen);
laundry.connect("south", garage);
garage.connect("north", laundry);
landing.connect("south", hallway);
landing.connect("north", bathroom);
landing.connect("west", bedroom);
bathroom.connect("south", landing);
bedroom.connect("east", landing);

function showInventory(player) {
    const inventoryList = document.getElementById("inventoryList");
    inventoryList.innerHTML = "";

    if (player.inventory.length === 0) {
        const listItem = document.createElement("li");
        listItem.textContent = "Your inventory is empty.";
        inventoryList.appendChild(listItem);
    } else {
        player.inventory.forEach(item => {
            const li = document.createElement("li");
            li.textContent = `${item.description}`;
            inventoryList.appendChild(li);
        })
    }
}

function updateItemImage(item) {
    const img = document.getElementById("currentImage");
    img.src = "https://i.postimg.cc/kg6hVKWb/happy-cat.png";
    img.alt = "Happy cat";
}

function updateEventImage() {
    const img = document.getElementById("currentImage");
    img.src = "https://i.postimg.cc/g2kF6JGp/sad-cat.png";
    img.alt = "Sad cat";
}

function resetItemImage() {
    const img = document.getElementById("currentImage");
    img.src = "https://copilot.microsoft.com/th/id/BCO.d6ca66fa-a531-4147-abe0-a5db74d90843.png";
    img.alt = "cat";
}

function clearOutput() {
    const outputDiv = document.getElementById("output");
    outputDiv.innerHTML = "";
}

function parseCommand(input, player) {
    const words = input.trim().toLowerCase().split(" ");
    const command = words[0];
    const target = words[1];

    if (command === "go") {
        player.move(target);
    } else if (command === "take") {
        player.take(target);
    } else {
        showOutput("I don't understand that command." + player.currentRoom.describe());
    }
}

function showOutput(text) {
    const outputDiv = document.getElementById("output");
    outputDiv.innerText = text;

}

document.getElementById("restart").addEventListener("click", () => {
    location.reload();
}) 

document.getElementById("finish").addEventListener("click", () => {
    if (player.inventory.length > 3) {
        showOutput("Congratulations! You've collected enough items to have the perfect nap! You win!");

        document.body.classList.remove("bg-orange-100");
        document.body.classList.add("bg-black");
        
        const img = document.getElementById("currentImage");
        img.src = "https://copilot.microsoft.com/th/id/BCO.14575970-e335-4686-ba6b-a6b58eff82a9.png";
        img.alt = "Sleepy cat";
    }
    else {
        showOutput("Oh no! You haven't collected enough items for the perfect nap. Better luck next time!");
        updateEventImage();
    }
})

let player = new Player(hallway);

function startGame() {
    player = new Player(hallway);
    showOutput(player.currentRoom.describe());
    showInventory(player);

}

const commandBox = document.getElementById("commandBox");
    commandBox.addEventListener("keydown", function(event) {
        if (event.key === "Enter") {
            parseCommand(commandBox.value, player);
            commandBox.value = "";
        }
    });

window.onload = () => {
    startGame();

    document.getElementById("restart").addEventListener("click", () => {
        startGame();
    });
}