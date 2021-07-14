//   const startTime = Date.now();

//   export function updateRemainingTime() {
//     let singleTime = (Date.now() - startTime) / this.offset;
//     let remainingTime;
//     if (this.offset == 0) {
//       remainingTime = '';
//     } else if (this.offset >= this.#queryIds.length) {
//       remainingTime = 0;
//     } else {
//       remainingTime =
//         (singleTime *
//           this.#queryIds.length *
//           (this.#queryIds.length - this.offset)) /
//         this.#queryIds.length /
//         1000;
//     }
//     if (remainingTime >= 3600) {
//       this.#INDICATOR_TEXT_TIME.innerHTML = `${Math.round(
//         remainingTime / 3600
//       )} hr.`;
//     } else if (remainingTime >= 60) {
//       this.#INDICATOR_TEXT_TIME.innerHTML = `${Math.round(
//         remainingTime / 60
//       )} min.`;
//     } else if (remainingTime >= 0) {
//       this.#INDICATOR_TEXT_TIME.innerHTML = `${Math.floor(remainingTime)} sec.`;
//     } else {
//       this.#INDICATOR_TEXT_TIME.innerHTML = ``;
//     }
//   }
