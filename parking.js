class ParkingSystem {
  constructor(entryPoints, parkingMap, slotSizes) {
    this.entryPoints = entryPoints;
    this.parkingMap = parkingMap;
    this.slotSizes = slotSizes;
    this.occupiedSlots = new Set();
  }

  parkVehicle(vehicleType) {
    const availableSlots = this.findAvailableSlots(vehicleType);
    if (availableSlots.length === 0) {
      return 'No available slots for the specified vehicle type.';
    }

    const chosenSlot = this.chooseClosestSlot(availableSlots);
    this.occupiedSlots.add(chosenSlot);

    return `Vehicle parked at slot ${chosenSlot}.`;
  }

  unparkVehicle(slot, hoursParked) {
    if (!this.occupiedSlots.has(slot)) {
      return 'Slot is not occupied.';
    }

    this.occupiedSlots.delete(slot);

    const parkingFee = this.calculateParkingFee(slot, hoursParked);

    return `Vehicle unparked from slot ${slot}. Parking fee: ${parkingFee} pesos.`;
  }

  findAvailableSlots(vehicleType) {
    const availableSlots = [];

    for (let i = 0; i < this.parkingMap.length; i++) {
      const slotSize = this.slotSizes[i];

      if (
        (vehicleType === 'S' && slotSize <= 2) ||
        (vehicleType === 'M' && slotSize >= 1) ||
        (vehicleType === 'L' && slotSize === 2)
      ) {
        availableSlots.push(i);
      }
    }

    return availableSlots.filter((slot) => !this.occupiedSlots.has(slot));
  }

  chooseClosestSlot(availableSlots) {
    let closestDistance = Infinity;
    let closestSlot = null;

    for (const entryPoint of this.entryPoints) {
      for (const slot of availableSlots) {
        const distance = this.parkingMap[slot][entryPoint];
        if (distance < closestDistance) {
          closestDistance = distance;
          closestSlot = slot;
        }
      }
    }

    return closestSlot;
  }

  calculateParkingFee(slot, hoursParked) {
    const slotSize = this.slotSizes[slot];
    // Flat rate for the first 3 hours
    let fee = 0;
    if (hoursParked > 3 && hoursParked <= 24) {
      fee = 40;
      switch (slotSize) {
        case 0: // Small
          fee += 20 * (hoursParked - 3);
          break;
        case 1: // Medium
          fee += 60 * (hoursParked - 3);
          break;
        case 2: // Large
          fee += 100 * (hoursParked - 3);
          break;
      }
    } else {
      fee = 5000;
      // Calculate the remaining hours charge after the last 24-hour chunk
      const remainingHours = hoursParked - 24;
      if (remainingHours <= 3) {
        fee += 40;
      } else {
        fee += 40;
        switch (slotSize) {
          case 0:
            fee += (remainingHours - 3) * 20;
            break;
          case 1:
            fee += (remainingHours - 3) * 60;
            break;
          case 2:
            fee += (remainingHours - 3) * 100;
            break;
        }
      }
    }
    return fee;
  }
}

// Example usage
const entryPoints = [0, 1, 2];
const parkingMap = [
  [1, 4, 5],
  [3, 2, 3],
  // Add more entries if needed
];

const slotSizes = [0, 1, 2]; // Small, Medium, Large

const parkingSystem = new ParkingSystem(entryPoints, parkingMap, slotSizes);

console.log(parkingSystem.parkVehicle('S'));
console.log(parkingSystem.parkVehicle('M'));
console.log(parkingSystem.parkVehicle('L'));

console.log(parkingSystem.unparkVehicle(0, 5));
console.log(parkingSystem.unparkVehicle(1, 8));
