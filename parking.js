class ParkingSystem {
  constructor(entryPoints, parkingDistances, parkingSizes) {
    if (entryPoints.length < 3) {
      throw new Error('There must be at least three entry points.');
    }

    this.entryPoints = entryPoints;
    this.parkingDistances = parkingDistances;
    this.parkingSizes = parkingSizes;
    this.occupiedSlots = {};
  }

  parkVehicle(vehicleType) {
    const entryPointIndex = this.getClosestEntryPoint();
    const availableSlot = this.findAvailableSlot(vehicleType, entryPointIndex);

    if (availableSlot) {
      this.occupiedSlots[availableSlot] = {
        entryPointIndex,
        vehicleType,
        entryTime: Date.now(),
      };
      return availableSlot;
    } else {
      throw new Error('No available slot for the specified vehicle type.');
    }
  }

  unparkVehicle(slot) {
    if (this.occupiedSlots[slot]) {
      const { entryTime, vehicleType } = this.occupiedSlots[slot];
      delete this.occupiedSlots[slot];

      const totalTime = Math.ceil((Date.now() - entryTime) / (1000 * 60 * 60)); // Convert to hours and round up
      const baseRate = 40;
      let hourlyRate;

      switch (this.parkingSizes[slot]) {
        case 0: // Small
          hourlyRate = 20;
          break;
        case 1: // Medium
          hourlyRate = 60;
          break;
        case 2: // Large
          hourlyRate = 100;
          break;
      }

      const totalFee = this.calculateTotalFee(
        totalTime,
        baseRate,
        hourlyRate,
        vehicleType
      );
      return totalFee;
    } else {
      throw new Error('Invalid parking slot.');
    }
  }

  getClosestEntryPoint() {
    // Example: Choose the entry point with the minimum distance for simplicity
    return this.parkingDistances.reduce((minIndex, distances, currentIndex) => {
      const currentDistance = distances[minIndex];
      return distances[currentIndex] < currentDistance
        ? currentIndex
        : minIndex;
    }, 0);
  }

  findAvailableSlot(vehicleType, entryPointIndex) {
    // Example: Find the first available slot of the appropriate size
    for (let i = 0; i < this.parkingDistances.length; i++) {
      const distance = this.parkingDistances[i][entryPointIndex];
      const size = this.parkingSizes[i];

      if (!this.occupiedSlots[i] && this.isSlotCompatible(size, vehicleType)) {
        return i;
      }
    }

    return null;
  }

  isSlotCompatible(slotSize, vehicleType) {
    switch (vehicleType) {
      case 'S':
        return true;
      case 'M':
        return slotSize !== 0; // Medium vehicles can't park in small slots
      case 'L':
        return slotSize === 2; // Large vehicles can only park in large slots
      default:
        return false;
    }
  }

  calculateTotalFee(totalTime, baseRate, hourlyRate, vehicleType) {
    const exceedingRate = totalTime > 3 ? (totalTime - 3) * hourlyRate : 0;
    const baseFee = baseRate + exceedingRate;

    if (totalTime > 24) {
      const chunkCount = Math.floor(totalTime / 24);
      const remainderHours = totalTime % 24;
      const chunkFee = chunkCount * 5000;
      return (
        chunkFee +
        this.calculateTotalFee(
          remainderHours,
          baseRate,
          hourlyRate,
          vehicleType
        )
      );
    }

    return baseFee;
  }
}

// Example Usage
const entryPoints = 3;
const parkingDistances = [
  [1, 4, 5],
  [3, 2, 3],
  // ... Add more parking distances
];

const parkingSizes = [0, 2, 1, 1, 0]; // 0: Small, 1: Medium, 2: Large

const parkingSystem = new ParkingSystem(
  entryPoints,
  parkingDistances,
  parkingSizes
);

// Park a vehicle
const vehicleType = 'S'; // Small vehicle
const parkedSlot = parkingSystem.parkVehicle(vehicleType);
console.log(`Vehicle parked at slot ${parkedSlot}`);

// Unpark the vehicle
const unparkFee = parkingSystem.unparkVehicle(parkedSlot);
console.log(`Vehicle unparked. Total fee: ${unparkFee} pesos`);
