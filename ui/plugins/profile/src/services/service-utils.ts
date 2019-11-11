// const PromiseStatus = {
//     PENDING: 'PENDING',
//     RESOLVED: 'RESOLVED',
//     REJECTED: 'REJECTED'
// }

// const readValues = () => {}

// export const suspensePromise = (promise) => {
//     let status = PromiseStatus.PENDING;
//     const suspender = readValues(promise);
//     let result;
//     return {
//         read: () => {
//             switch(status) {
//                 case PromiseStatus.PENDING:
//                     throw suspender;
//                 case PromiseStatus.REJECTED:
//                     throw result;
//                 case PromiseStatus.RESOLVED:
//                     return result;
//             }
//         }
//     }
// }
