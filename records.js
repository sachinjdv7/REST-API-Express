const fs = require('fs');

function generateRandomId(){
  return Math.floor(Math.random() * 10000);
}

function save(data){
  return new Promise((resolve, reject) => {
    fs.writeFile('data.json', JSON.stringify(data, null, 2), (err) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
}

/**
 * Gets all quotes
 * @param None
 */
function getQuotes(){
  return new Promise((resolve, reject) => {
    fs.readFile('data.json', 'utf8', (err, data) => {
      if (err) {
        reject(err);
      } else {
        const json = JSON.parse(data);
        resolve(json);
      }
    });
  });
}

/**
 * Gets a specific quote by ID
 * @param {number} id - Accepts the ID of the specified quote.
 */
async function getQuote(id){
  const quotes = await getQuotes();
  return quotes.records.find(record => record.id == id);
}
/**
 * Gets a random quote 
 * @param None
 */
async function getRandomQuote(){
  const quotes = await getQuotes();
  const randNum = Math.floor(Math.random() * quotes.records.length);
  return quotes.records[randNum];
}

/**
 * Creates a new quote record 
 * @param {Object} newRecord - Object containing info for new quote: the quote text and author 
 */
async function createQuote(newRecord) {
  const quotes = await getQuotes(); 
  
  newRecord.id = generateRandomId(); 
  quotes.records.push(newRecord);
  await save(quotes); 
  return newRecord; 
}

/**
 * Updates a single record 
 * @param {Object} newQuote - An object containing the changes to quote: quote and author 
 */
async function updateQuote(newQuote){
  const quotes = await getQuotes();
  let quote = quotes.records.find(item => item.id == newQuote.id);
  
  quote.quote = newQuote.quote;
  quote.author = newQuote.author;
  quote.year = newQuote.year;
 
  await save(quotes);
}

/**
 * Deletes a single record
 * @param {Object} record - Accepts record to be deleted. 
 */
async function deleteQuote(record){
  const quotes = await getQuotes();
  quotes.records = quotes.records.filter(item => item.id != record.id);
  await save(quotes);
}

module.exports = {
  getQuotes,
  getQuote, 
  createQuote, 
  updateQuote, 
  deleteQuote,
  getRandomQuote
}
