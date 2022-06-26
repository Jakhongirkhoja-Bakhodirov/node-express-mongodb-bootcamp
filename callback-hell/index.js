const fs = require('fs');
const superagent = require('superagent');

const readFilePro = (file) => {
  return new Promise((resolve, reject) => {
    fs.readFile(file, (err, data) => {
      if (err) reject(err);
      resolve(data);
    });
  });
};

const writeFilePro = (file, data) => {
  return new Promise((resolve, reject) => {
    fs.writeFile(file, data, (err) => {
      if (err) reject(err);
      resolve('success');
    });
  });
};

// writeFilePro('./dog.txt', 'something-new');

// readFilePro(`${__dirname}/dog.txt`).then((data) => {
//   console.log(data);
// });

//Soleve Callback-Hell problem using Promises

// readFilePro(`${__dirname}/dog.txt`)
//   .then((data) => {
//     console.log(`Breed: ${data}`);
//     return superagent.get(`https://dog.ceo/api/breed/${data}/images/random`);
//   })
//   .then((res) => {
//     console.log(res.body.message);
//     return writeFilePro('./callback-hell/dog-image.txt', res.body.message);
//   })
//   .then(() => {
//     console.log(`Random dog image saved to file`);
//   })
//   .catch((err) => {
//     console.log(err);
//   });

//Handle Promise Using Async/Await
const getDogPics = async () => {
  try {
    const data = await readFilePro(`${__dirname}/dog.txt`);
    console.log(`Breed: ${data}`);
    const res = superagent.get(
      `https://dog.ceo/api/breed/${data}/images/random`
    );
    const res2 = superagent.get(
      `https://dog.ceo/api/breed/${data}/images/random`
    );
    const res3 = superagent.get(
      `https://dog.ceo/api/breed/${data}/images/random`
    );
    const res4 = superagent.get(
      `https://dog.ceo/api/breed/${data}/images/random`
    );
    const all = await Promise.all([res, res2, res3, res4]);
    const images = all.map((el) => el.body.message);
    console.log(images);
    await writeFilePro('./callback-hell/dog-image.txt', images.join('\n'));
  } catch (error) {
    return new Error(error);
  }
  return '2:Ready here';
};

(async () => {
  try {
    const result = await getDogPics();
    console.log(result);
  } catch (error) {
    return new Error(error);
  }
})();

//Callback-Hell

// fs.readFile(`${__dirname}/dog.txt`, (err, data) => {
//   console.log(`Breed: ${data}`);
//   superagent
//     .get(`https://dog.ceo/api/breed/${data}/images/random`)
//     .then((res) => {
//       console.log(res.body.message);
//       fs.writeFile('./callback-hell/dog-img.txt', res.body.message, (err) => {
//         if (err) return console.log(err.message);
//         console.log('Random dog image saved to file ');
//       });
//     });
// });
