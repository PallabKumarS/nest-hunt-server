const id = "user-2";

const onlyNumber = id.split("-")[1];

console.log(`A-${(Number(onlyNumber) + 1).toString().padStart(5, "0")}`);
