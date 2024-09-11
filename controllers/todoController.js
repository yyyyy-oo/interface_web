const { mySQL } = require('../modules/connectDB');
const { generateCode } = require('../modules/randomString');

const saveTodoList = async (req, res) => {
  try {
    const receivedData = JSON.stringify(req.body);
    const randomcode = generateCode(6);
    await mySQL('INSERT INTO todolist (code, todos, saveDate) VALUES (?, ?, NOW())', [randomcode, receivedData]);

    console.log('Data Saved:', randomcode);
    return res.status(201).json({ code: randomcode });
  } catch (error) {
    console.error('[saveTodoList]', error);
    res.sendStatus(500).json({ message: 'saveTodoList Failed' });
  }
};

const loadTodoList = async (req, res) => {
  try {
    const receivedCode = req.params.code;
    const [dbResult] = await mySQL('SELECT todos FROM todolist WHERE code = ?', [receivedCode]);
    if (dbResult) {
      console.log('Data loaded:', receivedCode);
      return res.status(200).json(dbResult);
    }

    console.warn('Code Not Found:', receivedCode);
    return res.status(404).json({ message: 'Code Not Found' });
  } catch (error) {
    console.error('[loadTodoList]', error);
    res.sendStatus(500).json({ message: 'loadTodoList Failed' });
  }
};

module.exports = { saveTodoList, loadTodoList };
