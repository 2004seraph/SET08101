
// Wait for the DOM to be loaded, then assigns variables that can be manipulated based on user interactions
document.addEventListener("DOMContentLoaded", () => {
    const bucket1 = document.getElementById("bucket1");
    const sandpile = document.getElementById('sand');
    const cylinder = document.getElementById('cylinder'); 
    const minigameOverlay = document.getElementById('minigame-overlay');
    const submitButton = document.getElementById('submit-minigame');
    const closeButton = document.getElementById('close-minigame');
    const door = document.getElementById('door');
    const slots = document.querySelectorAll('.slot');
  
    // Initialises an empty array to store items in the inventory, populating when the user collects items.
    let inventory = [];

    // Initialises a variable to track the inventory slot which is selected by the user
    let selectedSlotIndex = null;

    // This variable is for the mini game, keeping track of the bucket the user is dragging.
    let draggingBucket = null;

    // Initialises the variable that tracks the fill level of the glass cylinder, starting at empty.
    let cylinderFillLevel = 0;

    // Initialising a flag to indicate if the buckets have been unlocked yet, set to false to indicate locked.
    let bucket2Unlocked = false;
    let bucket3Unlocked = false;

    /* This block of code listens for a click even on the starting bucket,
    then creates an image of the bucket and places it in the first available inventory slot 
    and hides the original bucket. */
    bucket1.addEventListener('click', () => {
        const bucketInInventory = document.createElement('img');
        bucketInInventory.src = 'images/bucket1.png';
        bucketInInventory.alt = bucket1.alt;
        bucketInInventory.classList.add('inventory-item');
    
        console.log('Bucket added to inventory slot: ', bucketInInventory.src);
    
        for (let slot of slots) {
            if (!slot.querySelector('img')) {
                slot.append(bucketInInventory);
                break;
            }
        }
        bucket1.style.display = 'none';
    
        // Add the item to the inventory with initial state 'empty' AND link the imgElement.
        addItem({
            name: 'Small Bucket',
            state: 'empty',
            imgElement: bucketInInventory
        });
    });
    
  
    // Allows the user to interact with the item in the slot they have selected in the inventory.
    slots.forEach((slot, index) => {
      slot.addEventListener('click', () => {
        slots.forEach(s => s.classList.remove('selected'));
        slot.classList.add('selected');
        selectedSlotIndex = index;
        console.log('Selected slot:', selectedSlotIndex);
        console.log('Selected item:', inventory[selectedSlotIndex]);
      });
    });
  
    // Function to add an item to inventory, alerts the user if there are no available inventory slots.
    function addItem(item) {
      for (let i = 0; i < inventory.length; i++) {
        if (!inventory[i]) {
          inventory[i] = item;
          updateInventoryUI();
          return;
        }
      }
      if (inventory.length < slots.length) {
        inventory.push(item);
        updateInventoryUI();
      } else {
        alert('Inventory full!');
      }
    }
  
    // Function to keep the UI in sync with the current state of the inventory.
    function updateInventoryUI() {
        slots.forEach((slot, index) => {
            const currentItem = inventory[index];
            if (currentItem) {
                let img = slot.querySelector('img');
                if (!img) {
                    img = document.createElement('img');
                    slot.append(img);
                }
                if (currentItem.name === 'Small Bucket') {
                    img.src = currentItem.state === 'full' ? 'images/bucket1-full.png' : 'images/bucket1.png';
                } else if (currentItem.name === 'Medium Bucket') {
                    img.src = currentItem.state === 'full' ? 'images/bucket2-full.png' : 'images/bucket2.png';
                } else if (currentItem.name === 'Large Bucket') {
                    img.src = currentItem.state === 'full' ? 'images/bucket3-full.png' : 'images/bucket3.png';
                }
                img.alt = currentItem.name;
            } else {
                slot.innerHTML = '';
            }
        });
    }
    
    // Function allowing the user to interact with the medium bucket once it's unlocked and placed in the inventory.
    function unlockNextBucket() {
        if (!bucket2Unlocked) {
          // Creates bucket2 image.
          const bucket2 = document.createElement('img');
          bucket2.src = 'images/bucket2.png';
          bucket2.alt = 'Bucket 2';
          bucket2.classList.add('inventory-item');
      
          for (let slot of slots) {
            if (!slot.querySelector('img')) {
              slot.append(bucket2);
              break;
            }
          }
          bucket2Unlocked = true;
      
          // Adds bucket2 object into inventory.
          inventory.push({
            name: 'Medium Bucket',
            state: 'empty',
            imgElement: bucket2 
          });
      
          // Allows visual selection and item tracking on bucket2.
          bucket2.addEventListener('click', () => {
            for (let s of slots) s.classList.remove('selected');
            bucket2.parentElement.classList.add('selected');
            selectedSlotIndex = inventory.length - 1; 
            console.log('Selected slot:', selectedSlotIndex);
            console.log('Selected item:', inventory[selectedSlotIndex]);
          });
        }
    }
      
      
    // Allows the user to fill the selected bucket in the inventory with sand.
    sandpile.addEventListener('click', () => {
        if (selectedSlotIndex !== null) {
          const selectedItem = inventory[selectedSlotIndex];
          if (selectedItem && selectedItem.state === 'empty') {
            selectedItem.state = 'full';
      
            const img = selectedItem.imgElement;
            if (img) {
              if (selectedItem.name === 'Small Bucket') {
                img.src = 'images/bucket1-full.png';
              } else if (selectedItem.name === 'Medium Bucket') {
                img.src = 'images/bucket2-full.png';
              } else if (selectedItem.name === 'Large Bucket') {
                img.src = 'images/bucket3-full.png';
              }
            }
      
            alert('You have filled the bucket with sand!');
          }
        }
    });
      


    // Allows player to gradually fill the cylinder with sand and unlock the locked box items.
    cylinder.addEventListener('click', () => {
        if (selectedSlotIndex !== null) {
            const selectedItem = inventory[selectedSlotIndex];
            if (selectedItem && selectedItem.state === 'full') {
                cylinderFillLevel++;
    
                if (cylinderFillLevel === 1) {
                    cylinder.src = 'images/cylinder1-filled.png';
                    unlockNextBucket();
                } else if (cylinderFillLevel === 2) {
                    cylinder.src = 'images/cylinder2-filled.png';
                    unlockNextBucket2();
                } else if (cylinderFillLevel === 3) {
                    cylinder.src = 'images/cylinder3-filled.png';
                    unlockKey(); 
                }
    
                selectedItem.state = 'empty';
                if (selectedItem.imgElement) {
                    selectedItem.imgElement.src = selectedItem.name === 'Medium Bucket' ?
                        'images/bucket2.png' :
                        selectedItem.name === 'Large Bucket' ?
                        'images/bucket3.png' :
                        'images/bucket1.png';
                }
    
                alert('You have poured sand into the cylinder! Your bucket is now empty.');
            } else {
                alert('You need a full bucket to pour into the cylinder!');
            }
        }
    });
    
      
    //Allows the spawning of the third bucket in the user inventory when the cylinder is filled enough.
    function unlockNextBucket2() {
        if (!bucket3Unlocked) {
          const bucket3 = document.createElement('img');
          bucket3.src = 'images/bucket3.png';
          bucket3.alt = 'Bucket 3';
          bucket3.classList.add('inventory-item');
      
          for (let slot of slots) {
            if (!slot.querySelector('img')) {
              slot.append(bucket3);
              break;
            }
          }
          bucket3Unlocked = true;
      
          inventory.push({
            name: 'Large Bucket',
            state: 'empty',
            imgElement: bucket3
          });
      
          bucket3.addEventListener('click', () => {
            for (let s of slots) s.classList.remove('selected');
            bucket3.parentElement.classList.add('selected');
            selectedSlotIndex = inventory.length - 1;
            console.log('Selected slot:', selectedSlotIndex);
            console.log('Selected item:', inventory[selectedSlotIndex]);
          });
        }
    }
    
    // Function for adding the key to the user inventory when the cylinder reaches sufficient fill level.
    function unlockKey() {
    const key = document.createElement('img');
    key.src = 'images/key.png';
    key.alt = 'Key';
    key.classList.add('inventory-item');

    for (let slot of slots) {
        if (!slot.querySelector('img')) {
            slot.append(key);
            break;
        }
    }
    inventory.push({
        name: 'Key',
        state: 'found',
        imgElement: key
    });

    // Allows for the key to be selected and the index value is tracked.
    key.addEventListener('click', () => {
        for (let s of slots) s.classList.remove('selected');
        key.parentElement.classList.add('selected');
        selectedSlotIndex = inventory.length - 1;
        console.log('Selected slot:', selectedSlotIndex);
        console.log('Selected item:', inventory[selectedSlotIndex]);
    });

    alert('You found the key! 🗝️');
    }

    // Ensures that the user cannot escape the room without acquring the key.
    door.addEventListener('click', () => {
        const hasKey = inventory.some(item => item.name === 'Key');
        
        if (hasKey) {
            alert("You have successfully escaped the room!");
        } else {
            alert("The door is locked. You need the key to escape.");
        }
    });
    
    // Function to open the minigame.
    function openMinigame() {
        minigameOverlay.style.display = 'flex';
        closeButton.style.display = 'block'; // Show close button
    }

    // Function to close the minigame.
    function closeMinigame() {
        minigameOverlay.style.display = 'none';
    }

    // Sets up draggable buckets
    document.querySelectorAll('.minigame-bucket').forEach(bucket => {
        bucket.addEventListener('dragstart', (e) => {
            draggingBucket = e.target;
        });
    });

    // Sets up mini game slots to accept buckets for the puzzle.
    document.querySelectorAll('.minigame-slot').forEach(slot => {
        slot.addEventListener('dragover', (e) => e.preventDefault());
        slot.addEventListener('drop', (e) => {
            if (draggingBucket && !slot.querySelector('.minigame-bucket')) {
                slot.appendChild(draggingBucket);
            }
        });
    });

    // Checks the submitted order against the correct order.
    submitButton.addEventListener('click', () => {
        const slots = document.querySelectorAll('.minigame-slot');
        const correctOrder = ['Small', 'Large', 'Medium'];

        const currentOrder = Array.from(slots).map(slot => {
            const bucket = slot.querySelector('.minigame-bucket');
            return bucket ? bucket.textContent : null;
        });

        if (JSON.stringify(currentOrder) === JSON.stringify(correctOrder)) {
            alert("You completed the minigame! You got the final key!");
            inventory.push({ name: 'Key' });  // Adds final door key to inventory.
            closeMinigame();
            door.addEventListener('click', () => {
                if (inventory.some(item => item.name === 'Key')) {
                    alert("You have successfully escaped the room!");
                }
            });
        } else {
            alert("Wrong order! Try again.");
        }
    });

    // Event to open minigame.
    document.getElementById('open-minigame').addEventListener('click', openMinigame);

    // Close button for the minigame.
    closeButton.addEventListener('click', closeMinigame);
});
      

  

  