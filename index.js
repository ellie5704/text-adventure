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
    return `${this.name}: ${this.description}`;
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
        this.currentRoom = this.currentRoom.exits[direction];
        showOutput(this.currentRoom.describe())
    }

    take(itemName) {
        const item = this.currentRoom.items.find(i => i.name === itemName);
        if (item) {
            this.inventory.push(item);
            this.currentRoom.items = this.currentRoom.items.filter(i => i.name !== itemName);
            showOutput(`You have taken the ${itemName}.`);
        } else {
            showOutput(`There is no ${itemName} here.`);
        }
    }
}





const hallway = new Room("Hallway", "Coming through the cat flap, you find yourself in the hallway, it's not a destination, just a familiar path between naps.");

const lounge = new Room("Lounge", "Stepping in from the hallway, the lounge greets you. You brush against the sofa where your human rests, receiving a few head scratches before something catches your eye. You scurry under the sofa and find your favourite toy, that has been missing for awhile");
const toy = new Item("toy", "A small, squeaky mouse toy that you love to chase around the house.");
lounge.items.push(toy);

const kitchen = new Room("Kitchen", "");
const treats = new Item("treats", "A bag of delicious cat treats.");
kitchen.items.push(treats);

const porch = new Room("Porch", "");

const laundry = new Room("Laundry", "");
const sock = new Item("sock", "A single, lonely sock that has lost its pair.");
laundry.items.push(sock);

const garage = new Room("Garage", "");
const clothes = new Item("clothes", "A pile of your human's winter clothes, perfect for napping.");    
garage.items.push(clothes);

const landing = new Room("Landing", "");

const bathroom = new Room("Bathroom", "");
const towel = new Item("towel", "A soft, fluffy towel hanging on the rack.");
bathroom.items.push(towel);

const bedroom = new Room("Bedroom", "");

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



function parseCommand(input, player) {
    const words = input.trim().toLowerCase().split(" ");
    const command = words[0];
    const target = words[1];

    if (command === "go") {
        player.move(target);
    } else if (command === "take") {
        player.take(target);
    } else {
        showOutput("I don't understand that command.")
    }
}

function showOutput(text) {
    const outputDiv = document.getElementById("output");
    const paragraph = document.createElement("p");
    paragraph.textContent = text;
    outputDiv.appendChild(paragraph);

}

const player = new Player(hallway);

function startGame() {
    currentRoom = hallway;

    const commandBox = document.getElementById("commandBox");
    commandBox.addEventListener("keydown", function(event) {
        if (event.key === "Enter") {
            parseCommand(commandBox.value, player);
            commandBox.value = "";
        }
    });

    showOutput(player.currentRoom.describe());
}

window.onload = startGame;