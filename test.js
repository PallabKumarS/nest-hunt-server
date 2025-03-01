const id = "L-00122";

const onlyNumber = id.split("-")[1];

console.log(`L-${(Number(onlyNumber) + 1).toString().padStart(5, "0")}`);
